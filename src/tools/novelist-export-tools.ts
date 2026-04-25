import { z } from 'zod';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { spawnSync } from 'child_process';
import { existsSync } from 'fs';
import path from 'path';
import { NovelResourceLoader } from '../resources/resource-loader.js';

const projectRoot = path.resolve(__dirname, '..', '..');
const defaultExportDir = path.join(projectRoot, 'tmp', 'exports');
const localSkillScriptPath = path.join(
  projectRoot,
  '.github',
  'skills',
  'export-novel-markdown',
  'scripts',
  'export-novel-markdown.js'
);
const workspaceSkillScriptPath = path.join(
  projectRoot,
  '..',
  '.github',
  'skills',
  'export-novel-markdown',
  'scripts',
  'export-novel-markdown.js'
);
const novelDataFilePath = path.join(projectRoot, 'src', 'resources', 'novel-data.json');

function slugify(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-');
}

function resolveExporterScriptPath(): string {
  const candidates = [localSkillScriptPath, workspaceSkillScriptPath];
  const match = candidates.find((candidate) => existsSync(candidate));

  if (!match) {
    throw new Error(
      `Exporter script not found. Checked:\n- ${candidates.join('\n- ')}`
    );
  }

  return match;
}

function resolveOutputPath(outputPath: string | undefined, novelId: string, novelTitle: string): string {
  if (outputPath && outputPath.trim().length > 0) {
    return path.isAbsolute(outputPath)
      ? outputPath
      : path.resolve(projectRoot, outputPath);
  }

  return path.join(defaultExportDir, `${novelId}-${slugify(novelTitle)}.md`);
}

export function registerNovelistExportTools(server: McpServer) {
  const resourceLoader = NovelResourceLoader.getInstance();

  server.tool(
    'alephAlpha_exportNovelMarkdown',
    'Exports a novel to Markdown using the skill-backed exporter script',
    {
      novelId: z.string().describe('ID of the novel to export'),
      outputPath: z
        .string()
        .optional()
        .describe('Optional output path. Relative paths are resolved from NovelistEditor/'),
      overwrite: z
        .boolean()
        .optional()
        .describe('Whether to overwrite an existing output file (false by default)'),
    },
    async ({ novelId, outputPath, overwrite = false }) => {
      const novel = resourceLoader.getNovel(novelId);

      if (!novel) {
        return {
          content: [{ type: 'text', text: `Novel with ID ${novelId} not found.` }],
          description: 'Error: Novel not found',
        };
      }

      const persisted = resourceLoader.saveAllResources();
      if (!persisted) {
        return {
          content: [{
            type: 'text',
            text: 'Failed to persist the latest in-memory state before exporting.',
          }],
          description: 'Error: Failed to persist state before export',
        };
      }

      let exporterScriptPath: string;
      try {
        exporterScriptPath = resolveExporterScriptPath();
      } catch (error) {
        return {
          content: [{
            type: 'text',
            text: error instanceof Error ? error.message : String(error),
          }],
          description: 'Error: Exporter script not found',
        };
      }

      const resolvedOutputPath = resolveOutputPath(outputPath, novelId, novel.title);
      const args = [
        exporterScriptPath,
        '--data',
        novelDataFilePath,
        '--novelId',
        novelId,
        '--out',
        resolvedOutputPath,
      ];

      if (overwrite) {
        args.push('--overwrite');
      }

      const result = spawnSync(process.execPath, args, {
        cwd: projectRoot,
        encoding: 'utf8',
      });

      if (result.error) {
        return {
          content: [{
            type: 'text',
            text: `Failed to execute exporter script: ${result.error.message}`,
          }],
          description: 'Error: Exporter execution failed',
        };
      }

      if (result.status !== 0) {
        const stderr = result.stderr?.trim();
        const stdout = result.stdout?.trim();
        return {
          content: [{
            type: 'text',
            text: [
              'Exporter script exited with an error.',
              stderr || stdout || 'No diagnostic output was returned.',
            ].join('\n\n'),
          }],
          description: 'Error: Exporter script failed',
        };
      }

      let summary: Record<string, unknown> = {
        novelId,
        title: novel.title,
        outputPath: resolvedOutputPath,
      };

      if (result.stdout?.trim()) {
        try {
          summary = JSON.parse(result.stdout.trim()) as Record<string, unknown>;
        } catch {
          summary.stdout = result.stdout.trim();
        }
      }

      return {
        content: [{
          type: 'text',
          text: JSON.stringify(
            {
              message: 'Novel exported to Markdown successfully',
              tool: 'alephAlpha_exportNovelMarkdown',
              outputPath: resolvedOutputPath,
              summary,
            },
            null,
            2
          ),
        }],
        description: 'Novel exported to Markdown successfully',
      };
    }
  );
}
