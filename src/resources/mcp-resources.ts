import { McpServer, ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";
import { NovelResourceLoader } from "./resource-loader.js";

/**
 * Registra todos los recursos MCP en el servidor
 * @param server Instancia del servidor MCP
 */
export function registerMcpResources(server: McpServer): void {
  // Cargar instancia del gestor de recursos
  const novelResourceLoader = NovelResourceLoader.getInstance();

  // 1. Recurso estático para información del servidor
  server.resource(
    "server-info",
    "aleph://server/info",
    async (uri) => ({
      contents: [{
        uri: uri.href,
        mimeType: "application/json",
        text: JSON.stringify({
          name: "AlephCodeAgent", // Valor estático en lugar de server.info.name
          version: "1.0.0", // Valor estático en lugar de server.info.version
          description: "Aleph MCP Server",
          capabilities: [
            "code-analysis",
            "documentation",
            "novelist-assistant",
            "prompt-templates"
          ]
        }, null, 2)
      }]
    })
  );

  // 2. Recurso dinámico para personajes de novela
  server.resource(
    "character",
    new ResourceTemplate("aleph://novel/character/{characterId}", {
      list: async () => {
        const characters = novelResourceLoader.getCharacters();
        const resourceList = Object.keys(characters).map(id => ({
          name: characters[id].name,
          uri: `aleph://novel/character/${id}`,
          description: characters[id].description.substring(0, 100)
        }));
        
        return {
          resources: resourceList
        };
      }
    }),
    async (uri, params) => {
      const characterId = params.characterId as string;
      const character = novelResourceLoader.getCharacter(characterId);
      
      if (!character) {
        throw new Error(`Character with ID ${characterId} not found`);
      }
      
      return {
        contents: [{
          uri: uri.href,
          mimeType: "application/json",
          text: JSON.stringify(character, null, 2)
        }]
      };
    }
  );

  // 3. Recurso dinámico para escenas de novela
  server.resource(
    "scene",
    new ResourceTemplate("aleph://novel/scene/{sceneId}", {
      list: async () => {
        const scenes = novelResourceLoader.getScenes();
        const resourceList = Object.keys(scenes).map(id => ({
          name: scenes[id].title,
          uri: `aleph://novel/scene/${id}`,
          description: scenes[id].summary.substring(0, 100)
        }));
        
        return {
          resources: resourceList
        };
      }
    }),
    async (uri, params) => {
      const sceneId = params.sceneId as string;
      const scene = novelResourceLoader.getScene(sceneId);
      
      if (!scene) {
        throw new Error(`Scene with ID ${sceneId} not found`);
      }
      
      // Enriquecer la escena con información de los personajes
      const enrichedScene = {
        ...scene,
        characterDetails: await Promise.all(
          scene.characters.map(async (charId: string) => {
            const character = novelResourceLoader.getCharacter(charId);
            return character ? { 
              id: charId,
              name: character.name,
              description: character.description
            } : { id: charId, name: "Unknown character", description: "Character data not found" };
          })
        )
      };
      
      return {
        contents: [{
          uri: uri.href,
          mimeType: "application/json",
          text: JSON.stringify(enrichedScene, null, 2)
        }]
      };
    }
  );
  // 4. Recurso dinámico para novelas completas
  server.resource(
    "novel",
    new ResourceTemplate("aleph://novel/{novelId}", {
      list: async () => {
        // Actualizar el catálogo web cuando se lista las novelas
        novelResourceLoader.updateCatalogForWeb();
        
        const novels = novelResourceLoader.getNovels();
        const resourceList = Object.keys(novels).map(id => ({
          name: novels[id].title,
          uri: `aleph://novel/${id}`,
          description: novels[id].summary.substring(0, 100)
        }));
        
        return {
          resources: resourceList
        };
      }
    }),
    async (uri, params) => {
      const novelId = params.novelId as string;
      const novel = novelResourceLoader.getNovel(novelId);
      
      if (!novel) {
        throw new Error(`Novel with ID ${novelId} not found`);
      }
      
      // Enriquecer la novela con capítulos y personajes principales
      const enrichedNovel = {
        ...novel,
        chapterDetails: await Promise.all(
          novel.chapters.map(async (chapId: string) => {
            const chapter = novelResourceLoader.getChapter(chapId);
            return chapter ? {
              id: chapId,
              title: chapter.title,
              summary: chapter.summary
            } : { id: chapId, title: "Unknown chapter", summary: "Chapter data not found" };
          })
        ),
        characterDetails: await Promise.all(
          novel.characters.map(async (charId: string) => {
            const character = novelResourceLoader.getCharacter(charId);
            return character ? { 
              id: charId,
              name: character.name,
              description: character.description
            } : { id: charId, name: "Unknown character", description: "Character data not found" };
          })
        )
      };
      
      return {
        contents: [{
          uri: uri.href,
          mimeType: "application/json",
          text: JSON.stringify(enrichedNovel, null, 2)
        }]
      };
    }
  );
  // 5. Recurso dinámico para plantillas de prompts
  server.resource(
    "prompt-template",
    new ResourceTemplate("aleph://prompt-templates/{templateId}", {
      list: async () => {
        const templates = novelResourceLoader.getPromptTemplates();
        const resourceList = templates.map(template => ({
          name: template.name,
          uri: `aleph://prompt-templates/${template.id}`,
          description: template.description
        }));
        
        return {
          resources: resourceList
        };
      }
    }),    async (uri, params) => {
      const templateId = params.templateId as string;
      const template = novelResourceLoader.getPromptTemplate(templateId);
      
      if (!template) {
        throw new Error(`Prompt template with ID ${templateId} not found`);
      }
      
      return {
        contents: [{
          uri: uri.href,
          mimeType: "application/json",
          text: JSON.stringify(template, null, 2)
        }]
      };
    }
  );

  // 6. Recurso estático para lista de recursos en formato HTML
  server.resource(
    "resource-index",
    "aleph://resources/index",
    async (uri) => {
      const characters = Object.values(novelResourceLoader.getCharacters());
      const scenes = Object.values(novelResourceLoader.getScenes());
      const novels = Object.values(novelResourceLoader.getNovels());
      const promptTemplates = novelResourceLoader.getPromptTemplates();
      
      const html = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Aleph MCP Resources</title>
          <style>
            body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
            h1, h2 { color: #333; }
            ul { padding-left: 20px; }
            li { margin: 5px 0; }
            .resource { margin-bottom: 10px; }
            .uri { font-family: monospace; color: #0066cc; }
          </style>
        </head>
        <body>
          <h1>Aleph MCP Available Resources</h1>
          
          <h2>Server Information</h2>
          <div class="resource">
            <div class="uri">aleph://server/info</div>
            <p>Information about the server and its capabilities</p>
          </div>
          
          <h2>Characters (${characters.length})</h2>
          <ul>
            ${characters.map(char => `
              <li class="resource">
                <div class="uri">aleph://novel/character/${char.id}</div>
                <p>${char.name}: ${char.description.substring(0, 100)}...</p>
              </li>
            `).join('')}
          </ul>
          
          <h2>Scenes (${scenes.length})</h2>
          <ul>
            ${scenes.map(scene => `
              <li class="resource">
                <div class="uri">aleph://novel/scene/${scene.id}</div>
                <p>${scene.title}: ${scene.summary.substring(0, 100)}...</p>
              </li>
            `).join('')}
          </ul>
          
          <h2>Novels (${novels.length})</h2>
          <ul>
            ${novels.map(novel => `
              <li class="resource">
                <div class="uri">aleph://novel/${novel.id}</div>
                <p>${novel.title} by ${novel.author}: ${novel.summary.substring(0, 100)}...</p>
              </li>
            `).join('')}
          </ul>
          
          <h2>Prompt Templates (${promptTemplates.length})</h2>
          <ul>
            ${promptTemplates.map(template => `
              <li class="resource">
                <div class="uri">aleph://prompt-templates/${template.id}</div>
                <p>${template.name}: ${template.description}</p>
              </li>
            `).join('')}
          </ul>
        </body>
        </html>
      `;
      
      return {
        contents: [{
          uri: uri.href,
          mimeType: "text/html",
          text: html
        }]
      };
    }
  );
  
  console.log("MCP Resources registered successfully");
}
