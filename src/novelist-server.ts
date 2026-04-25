import { BaseMCPServer, BaseMCPServerConfig, MCPLogger } from "@alephscript/mcp-core-sdk/server";
import { registerPromptTools } from "./tools/prompt-tools";
import { registerCodeTools } from "./tools/code-tools";
import { registerDocumentationTools } from "./tools/documentation-tools";
import { registerNovelistTools } from './tools/novelist-tools';
import { registerNovelistExtensionTools } from './tools/novelist-extension-tools';
import { registerNovelistExportTools } from './tools/novelist-export-tools';
import { registerMcpResources } from './resources/mcp-resources';
import { registerMcpPrompts } from './resources/mcp-prompts';
import dotenv from 'dotenv';
import { execSync } from 'child_process';
import { join } from 'path';

// Obtener la ruta del directorio actual (CommonJS style)
const projectRoot = join(__dirname, '..');

// Cargar variables de entorno
dotenv.config();

// Configuración del servidor desde variables de entorno
const SERVER_NAME = process.env.MCP_SERVER_NAME || "AlephCodeAgent";
const SERVER_VERSION = process.env.MCP_SERVER_VERSION || "1.0.0";
const LOG_LEVEL = process.env.LOG_LEVEL || "info";
const HTTP_PORT = parseInt(process.env.MCP_HTTP_PORT || "3066");

// Configurar logger compatible con BaseMCPServer
const logger: MCPLogger = {
  info: (message: string, ...args: any[]): void => {
    if (LOG_LEVEL !== 'error') console.log(`[INFO] ${message}`, ...args);
  },
  error: (message: string, ...args: any[]): void => {
    console.error(`[ERROR] ${message}`, ...args);
  },
  warn: (message: string, ...args: any[]): void => {
    if (LOG_LEVEL !== 'error') console.warn(`[WARN] ${message}`, ...args);
  },
  debug: (message: string, ...args: any[]): void => {
    if (LOG_LEVEL === 'debug') console.log(`[DEBUG] ${message}`, ...args);
  },
  verbose: (message: string, ...args: any[]): void => {
    if (LOG_LEVEL === 'debug') console.log(`[VERBOSE] ${message}`, ...args);
  }
};

/**
 * MCP Novelist Server Implementation
 * Extends BaseMCPServer with novel-specific functionality
 */
class NovelistMCPServer extends BaseMCPServer {
  
  constructor() {
    const config: BaseMCPServerConfig = {
      id: "novelist-mcp-server",
      name: SERVER_NAME,
      version: SERVER_VERSION,
      description: "A code-focused MCP server that provides tools for code analysis, documentation, and prompt templates focused on long-term memory using novel-like structures.",
      port: HTTP_PORT,
      capabilities: {
        tools: true,
        resources: true,
        prompts: true
      },
      features: {
        enableHealthChecks: true,
        enableWebConsole: true,
        enableManagers: false
      }
    };

    super(config, logger);
  }

  /**
   * Setup server-specific tools, resources, and prompts
   */
  protected async setupServerSpecifics(): Promise<void> {
    this.logger.info("Setting up Novelist MCP Server specifics...");

    try {
      // Register all tools
      this.logger.info("Registering tools...");
      registerPromptTools(this.server);
      registerCodeTools(this.server);
      registerDocumentationTools(this.server);
      registerNovelistTools(this.server);
      registerNovelistExtensionTools(this.server);
      registerNovelistExportTools(this.server);
      this.logger.info("All tools registered successfully");

      // Register all resources
      this.logger.info("Registering resources...");
      registerMcpResources(this.server);
      this.logger.info("All resources registered successfully");

      // Register all prompts
      this.logger.info("Registering prompts...");
      registerMcpPrompts(this.server);
      this.logger.info("All prompts registered successfully");

      // Update novel catalog for web interface
      this.updateNovelCatalog();

      this.logger.info("Novelist MCP Server specifics setup completed");
    } catch (error) {
      this.logger.error("Failed to setup server specifics:", error as object);
      throw error;
    }
  }

  /**
   * Update the novel catalog for web interface
   */
  private updateNovelCatalog(): void {
    try {
      this.logger.info("Updating novel catalog for web interface...");
      const scriptPath = join(projectRoot, 'scripts', 'update-catalog.js');
      execSync(`node ${scriptPath}`, { stdio: 'inherit' });
      this.logger.info("Novel catalog updated successfully");
    } catch (error) {
      this.logger.error("Error updating novel catalog:", error as object);
    }
  }
}

// Create and start the server
const novelistServer = new NovelistMCPServer();

// Handle graceful shutdown
process.on('SIGINT', async () => {
  logger.info("Shutting down Novelist MCP server...");
  await novelistServer.shutdown();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  logger.info("Shutting down Novelist MCP server...");
  await novelistServer.shutdown();
  process.exit(0);
});

// Start the server
novelistServer.start().catch(error => {
  logger.error("Fatal error starting Novelist MCP server:", error);
  process.exit(1);
});

export default novelistServer;