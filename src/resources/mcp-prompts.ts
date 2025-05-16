import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { NovelResourceLoader } from "./resource-loader.js";
import { z } from "zod";
import { promptTemplates } from "../tools/templates.js";

/**
 * Registra todos los prompts MCP en el servidor
 * @param server Instancia del servidor MCP
 */
export function registerMcpPrompts(server: McpServer): void {
  // Cargar instancia del gestor de recursos
  const novelResourceLoader = NovelResourceLoader.getInstance();

  // Registrar prompts genéricos desde templates.ts
  Object.entries(promptTemplates).forEach(([promptId, template]) => {
    // Extraer variables del template buscando patrones {{variable}}
    const variableRegex = /{{([^}]+)}}/g;
    const variables = new Set<string>();
    let match;
    
    while ((match = variableRegex.exec(template)) !== null) {
      variables.add(match[1]);
    }
    
    // Crear schema dinámico para las variables
    const argsSchema: Record<string, z.ZodString> = {};
    variables.forEach(variable => {
      argsSchema[variable] = z.string().describe(`Value for ${variable}`);
    });
    
    // Registrar el prompt
    server.prompt(
      `code_${promptId}`,
      `Plantilla de código: ${promptId}`,
      argsSchema,
      async ({ ...variables }) => {
        // Reemplazar variables en el template
        let result = template;
        Object.entries(variables).forEach(([key, value]) => {
          result = result.replace(new RegExp(`{{${key}}}`, 'g'), value as string);
        });
        
        return {
          messages: [
            {
              role: "assistant",
              content: {
                type: "text",
                text: result,
              },
            },
          ],
        };
      }
    );
  });

  // Registrar prompts de novela desde novel-data.json
  const novelTemplates = novelResourceLoader.getPromptTemplates();
  
  novelTemplates.forEach(template => {
    // Crear schema dinámico para las variables
    const argsSchema: Record<string, z.ZodString> = {};
    template.variables.forEach(variable => {
      argsSchema[variable] = z.string().describe(`Value for ${variable}`);
    });
    
    // Registrar el prompt
    server.prompt(
      `novel_${template.id}`,
      template.description,
      argsSchema,
      async ({ ...variables }) => {
        // Reemplazar variables en el template
        let result = template.template;
        Object.entries(variables).forEach(([key, value]) => {
          result = result.replace(new RegExp(`{{${key}}}`, 'g'), value as string);
        });
        
        return {
          messages: [
            {
              role: "assistant",
              content: {
                type: "text",
                text: result,
              },
            },
          ],
        };
      }
    );
  });
  
  console.log("MCP Prompts registered successfully");
}
