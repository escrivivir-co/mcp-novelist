import { z } from 'zod';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { NovelResourceLoader } from '../resources/resource-loader.js';
import { 
  NovelResources, 
  Character, 
  Scene, 
  Chapter, 
  Novel 
} from '../resources/novel-resources.js';
import { readFileSync, writeFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Obtener el directorio actual
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Registra herramientas extendidas para el asistente de novelista en el servidor MCP
 * Estas herramientas permiten la creación y gestión de capítulos, escenas, personajes y novelas
 */
export function registerNovelistExtensionTools(server: McpServer) {
  // Obtener instancia del cargador de recursos
  const resourceLoader = NovelResourceLoader.getInstance();

  /**
   * Función de utilidad para guardar datos actualizados
   */
  const saveResources = (resources: NovelResources) => {
    try {
      // Ruta al archivo de datos
      const dataPath = path.join(__dirname, '..', 'resources', 'novel-data.json');
      
      // Leer el archivo existente para preservar las plantillas de prompts
      const fileContent = readFileSync(dataPath, 'utf-8');
      const currentData = JSON.parse(fileContent);
      
      // Actualizar recursos manteniendo las plantillas
      const updatedData = {
        resources: resources,
        promptTemplates: currentData.promptTemplates
      };
      
      // Escribir datos actualizados
      writeFileSync(dataPath, JSON.stringify(updatedData, null, 2), 'utf-8');
      
      // Actualizar catálogo web
      resourceLoader.updateCatalogForWeb();
      
      return true;
    } catch (error) {
      console.error('Error saving resources:', error);
      return false;
    }
  };

  /**
   * Herramienta: Crear una nueva escena
   */
  server.tool(
    'alephAlpha_createScene',
    'Creates a new scene for a novel',
    {
      title: z.string().describe('Title of the scene'),
      setting: z.string().describe('Setting or location where the scene takes place'),
      characters: z.array(z.string()).describe('Array of character IDs present in the scene'),
      summary: z.string().describe('Brief summary of the scene'),
      content: z.string().optional().describe('Full content of the scene (optional)'),
      novelId: z.string().optional().describe('ID of the novel to add this scene to (optional)')
    },
    async ({ title, setting, characters, summary, content, novelId }) => {
      // Validar que los personajes existen
      const invalidCharacters = characters.filter((id: string) => !resourceLoader.getCharacter(id));
      if (invalidCharacters.length > 0) {
        return {
          content: [{ 
            type: 'text', 
            text: `Error: The following character IDs don't exist: ${invalidCharacters.join(', ')}` 
          }],
          description: 'Error: Invalid character IDs'
        };
      }
      
      // Generar ID para la nueva escena
      const sceneId = `scene${Object.keys(resourceLoader.getScenes()).length + 1}`;
      
      // Crear la nueva escena
      const newScene: Scene = {
        id: sceneId,
        title,
        setting,
        characters,
        summary,
        content: content || ''
      };
      
      // Obtener recursos actuales
      const resources = {
        characters: resourceLoader.getCharacters(),
        scenes: resourceLoader.getScenes(),
        chapters: resourceLoader.getChapters(),
        novels: resourceLoader.getNovels()
      };
      
      // Añadir la nueva escena
      resources.scenes[sceneId] = newScene;
      
      // Si se especificó un novelId, añadir la escena a todos los capítulos de la novela
      if (novelId) {
        const novel = resourceLoader.getNovel(novelId);
        if (!novel) {
          return {
            content: [{ type: 'text', text: `Novel with ID ${novelId} not found.` }],
            description: 'Error: Novel not found'
          };
        }
      }
      
      // Guardar cambios
      const saved = saveResources(resources);
      if (!saved) {
        return {
          content: [{ type: 'text', text: 'Error saving the new scene.' }],
          description: 'Error: Failed to save scene'
        };
      }
      
      return {
        content: [{ 
          type: 'text', 
          text: JSON.stringify({
            message: 'Scene created successfully',
            sceneId,
            scene: newScene
          }, null, 2) 
        }],
        description: 'Scene created successfully'
      };
    }
  );

  /**
   * Herramienta: Crear un nuevo capítulo
   */
  server.tool(
    'alephAlpha_createChapter',
    'Creates a new chapter for a novel',
    {
      title: z.string().describe('Title of the chapter'),
      scenes: z.array(z.string()).describe('Array of scene IDs to include in the chapter'),
      summary: z.string().describe('Brief summary of the chapter'),
      novelId: z.string().describe('ID of the novel to add this chapter to')
    },
    async ({ title, scenes, summary, novelId }) => {
      // Validar que la novela existe
      const novel = resourceLoader.getNovel(novelId);
      if (!novel) {
        return {
          content: [{ type: 'text', text: `Novel with ID ${novelId} not found.` }],
          description: 'Error: Novel not found'
        };
      }
      
      // Validar que las escenas existen
      const invalidScenes = scenes.filter((id: string) => !resourceLoader.getScene(id));
      if (invalidScenes.length > 0) {
        return {
          content: [{ 
            type: 'text', 
            text: `Error: The following scene IDs don't exist: ${invalidScenes.join(', ')}` 
          }],
          description: 'Error: Invalid scene IDs'
        };
      }
      
      // Generar ID para el nuevo capítulo
      const chapterId = `chap${Object.keys(resourceLoader.getChapters()).length + 1}`;
      
      // Crear el nuevo capítulo
      const newChapter: Chapter = {
        id: chapterId,
        title,
        scenes,
        summary
      };
      
      // Obtener recursos actuales
      const resources = {
        characters: resourceLoader.getCharacters(),
        scenes: resourceLoader.getScenes(),
        chapters: resourceLoader.getChapters(),
        novels: resourceLoader.getNovels()
      };
      
      // Añadir el nuevo capítulo
      resources.chapters[chapterId] = newChapter;
      
      // Añadir el capítulo a la novela
      resources.novels[novelId].chapters.push(chapterId);
      
      // Guardar cambios
      const saved = saveResources(resources);
      if (!saved) {
        return {
          content: [{ type: 'text', text: 'Error saving the new chapter.' }],
          description: 'Error: Failed to save chapter'
        };
      }
      
      return {
        content: [{ 
          type: 'text', 
          text: JSON.stringify({
            message: 'Chapter created successfully',
            chapterId,
            chapter: newChapter,
            novel: resources.novels[novelId]
          }, null, 2) 
        }],
        description: 'Chapter created successfully'
      };
    }
  );

  /**
   * Herramienta: Crear un nuevo personaje
   */
  server.tool(
    'alephAlpha_createCharacter',
    'Creates a new character',
    {
      name: z.string().describe('Name of the character'),
      description: z.string().describe('Brief description of the character'),
      traits: z.array(z.string()).describe('Array of personality traits'),
      backstory: z.string().describe('Detailed backstory of the character'),
      novelId: z.string().optional().describe('ID of the novel to add this character to (optional)')
    },
    async ({ name, description, traits, backstory, novelId }) => {
      // Generar ID para el nuevo personaje
      const charId = `char${Object.keys(resourceLoader.getCharacters()).length + 1}`;
      
      // Crear el nuevo personaje
      const newCharacter: Character = {
        id: charId,
        name,
        description,
        traits,
        backstory
      };
      
      // Obtener recursos actuales
      const resources = {
        characters: resourceLoader.getCharacters(),
        scenes: resourceLoader.getScenes(),
        chapters: resourceLoader.getChapters(),
        novels: resourceLoader.getNovels()
      };
      
      // Añadir el nuevo personaje
      resources.characters[charId] = newCharacter;
      
      // Si se especificó un novelId, añadir el personaje a la novela
      if (novelId) {
        const novel = resourceLoader.getNovel(novelId);
        if (!novel) {
          return {
            content: [{ type: 'text', text: `Novel with ID ${novelId} not found.` }],
            description: 'Error: Novel not found'
          };
        }
        
        resources.novels[novelId].characters.push(charId);
      }
      
      // Guardar cambios
      const saved = saveResources(resources);
      if (!saved) {
        return {
          content: [{ type: 'text', text: 'Error saving the new character.' }],
          description: 'Error: Failed to save character'
        };
      }
      
      return {
        content: [{ 
          type: 'text', 
          text: JSON.stringify({
            message: 'Character created successfully',
            characterId: charId,
            character: newCharacter
          }, null, 2) 
        }],
        description: 'Character created successfully'
      };
    }
  );

  /**
   * Herramienta: Crear una nueva novela
   */
  server.tool(
    'alephAlpha_createNovel',
    'Creates a new novel',
    {
      title: z.string().describe('Title of the novel'),
      author: z.string().describe('Author of the novel'),
      genre: z.array(z.string()).describe('Array of genres'),
      summary: z.string().describe('Summary of the novel'),
      setting: z.string().describe('Setting of the novel'),
      characters: z.array(z.string()).optional().describe('Array of character IDs (optional)'),
      chapters: z.array(z.string()).optional().describe('Array of chapter IDs (optional)')
    },
    async ({ title, author, genre, summary, setting, characters = [], chapters = [] }) => {
      // Validar que los personajes existen si se proporcionaron
      if (characters.length > 0) {
        const invalidCharacters = characters.filter((id: string) => !resourceLoader.getCharacter(id));
        if (invalidCharacters.length > 0) {
          return {
            content: [{ 
              type: 'text', 
              text: `Error: The following character IDs don't exist: ${invalidCharacters.join(', ')}` 
            }],
            description: 'Error: Invalid character IDs'
          };
        }
      }
      
      // Validar que los capítulos existen si se proporcionaron
      if (chapters.length > 0) {
        const invalidChapters = chapters.filter((id: string) => !resourceLoader.getChapter(id));
        if (invalidChapters.length > 0) {
          return {
            content: [{ 
              type: 'text', 
              text: `Error: The following chapter IDs don't exist: ${invalidChapters.join(', ')}` 
            }],
            description: 'Error: Invalid chapter IDs'
          };
        }
      }
      
      // Generar ID para la nueva novela
      const novelId = `novel${Object.keys(resourceLoader.getNovels()).length + 1}`;
      
      // Crear la nueva novela
      const newNovel: Novel = {
        id: novelId,
        title,
        author,
        genre,
        summary,
        setting,
        characters,
        chapters
      };
      
      // Obtener recursos actuales
      const resources = {
        characters: resourceLoader.getCharacters(),
        scenes: resourceLoader.getScenes(),
        chapters: resourceLoader.getChapters(),
        novels: resourceLoader.getNovels()
      };
      
      // Añadir la nueva novela
      resources.novels[novelId] = newNovel;
      
      // Guardar cambios
      const saved = saveResources(resources);
      if (!saved) {
        return {
          content: [{ type: 'text', text: 'Error saving the new novel.' }],
          description: 'Error: Failed to save novel'
        };
      }
      
      return {
        content: [{ 
          type: 'text', 
          text: JSON.stringify({
            message: 'Novel created successfully',
            novelId,
            novel: newNovel
          }, null, 2) 
        }],
        description: 'Novel created successfully'
      };
    }
  );

  /**
   * Herramienta: Actualizar una escena existente
   */
  server.tool(
    'alephAlpha_updateScene',
    'Updates an existing scene',
    {
      sceneId: z.string().describe('ID of the scene to update'),
      title: z.string().optional().describe('New title (optional)'),
      setting: z.string().optional().describe('New setting (optional)'),
      characters: z.array(z.string()).optional().describe('New array of character IDs (optional)'),
      summary: z.string().optional().describe('New summary (optional)'),
      content: z.string().optional().describe('New content (optional)')
    },
    async ({ sceneId, title, setting, characters, summary, content }) => {
      // Verificar que la escena existe
      const existingScene = resourceLoader.getScene(sceneId);
      if (!existingScene) {
        return {
          content: [{ type: 'text', text: `Scene with ID ${sceneId} not found.` }],
          description: 'Error: Scene not found'
        };
      }
      
      // Validar personajes si se proporcionaron
      if (characters) {
        const invalidCharacters = characters.filter((id: string) => !resourceLoader.getCharacter(id));
        if (invalidCharacters.length > 0) {
          return {
            content: [{ 
              type: 'text', 
              text: `Error: The following character IDs don't exist: ${invalidCharacters.join(', ')}` 
            }],
            description: 'Error: Invalid character IDs'
          };
        }
      }
      
      // Obtener recursos actuales
      const resources = {
        characters: resourceLoader.getCharacters(),
        scenes: resourceLoader.getScenes(),
        chapters: resourceLoader.getChapters(),
        novels: resourceLoader.getNovels()
      };
      
      // Actualizar la escena con los valores proporcionados
      const updatedScene = {
        ...existingScene,
        title: title || existingScene.title,
        setting: setting || existingScene.setting,
        characters: characters || existingScene.characters,
        summary: summary || existingScene.summary,
        content: content !== undefined ? content : existingScene.content
      };
      
      resources.scenes[sceneId] = updatedScene;
      
      // Guardar cambios
      const saved = saveResources(resources);
      if (!saved) {
        return {
          content: [{ type: 'text', text: 'Error updating the scene.' }],
          description: 'Error: Failed to update scene'
        };
      }
      
      return {
        content: [{ 
          type: 'text', 
          text: JSON.stringify({
            message: 'Scene updated successfully',
            scene: updatedScene
          }, null, 2) 
        }],
        description: 'Scene updated successfully'
      };
    }
  );

  /**
   * Herramienta: Crear un nuevo capítulo a partir de escenas generadas automáticamente
   */
  server.tool(
    'alephAlpha_createChapterWithScenes',
    'Creates a new chapter with auto-generated scenes',
    {
      novelId: z.string().describe('ID of the novel to add this chapter to'),
      chapterTitle: z.string().describe('Title of the chapter'),
      chapterSummary: z.string().describe('Brief summary of the chapter'),
      sceneDescriptions: z.array(z.object({
        title: z.string().describe('Title of the scene'),
        setting: z.string().describe('Setting of the scene'),
        summary: z.string().describe('Summary of the scene'),
        characterIds: z.array(z.string()).describe('Array of character IDs in the scene')
      })).describe('Array of scene descriptions to generate')
    },
    async ({ novelId, chapterTitle, chapterSummary, sceneDescriptions }) => {
      // Validar que la novela existe
      const novel = resourceLoader.getNovel(novelId);
      if (!novel) {
        return {
          content: [{ type: 'text', text: `Novel with ID ${novelId} not found.` }],
          description: 'Error: Novel not found'
        };
      }
      
      // Obtener recursos actuales
      const resources = {
        characters: resourceLoader.getCharacters(),
        scenes: resourceLoader.getScenes(),
        chapters: resourceLoader.getChapters(),
        novels: resourceLoader.getNovels()
      };
      
      // Array para almacenar los IDs de las nuevas escenas
      const newSceneIds: string[] = [];
      
      // Crear las nuevas escenas
      for (const sceneDesc of sceneDescriptions) {
        // Validar personajes
        const invalidCharacters = sceneDesc.characterIds.filter((id: string) => !resourceLoader.getCharacter(id));
        if (invalidCharacters.length > 0) {
          return {
            content: [{ 
              type: 'text', 
              text: `Error: The following character IDs don't exist: ${invalidCharacters.join(', ')}` 
            }],
            description: 'Error: Invalid character IDs'
          };
        }
        
        // Generar ID para la nueva escena
        const sceneId = `scene${Object.keys(resources.scenes).length + 1}`;
        
        // Crear la escena
        const newScene: Scene = {
          id: sceneId,
          title: sceneDesc.title,
          setting: sceneDesc.setting,
          characters: sceneDesc.characterIds,
          summary: sceneDesc.summary,
          content: '' // Contenido vacío inicialmente
        };
        
        // Añadir la escena a los recursos
        resources.scenes[sceneId] = newScene;
        
        // Guardar el ID para añadirlo al capítulo
        newSceneIds.push(sceneId);
      }
      
      // Generar ID para el nuevo capítulo
      const chapterId = `chap${Object.keys(resources.chapters).length + 1}`;
      
      // Crear el nuevo capítulo con las escenas generadas
      const newChapter: Chapter = {
        id: chapterId,
        title: chapterTitle,
        scenes: newSceneIds,
        summary: chapterSummary
      };
      
      // Añadir el capítulo a los recursos
      resources.chapters[chapterId] = newChapter;
      
      // Añadir el capítulo a la novela
      resources.novels[novelId].chapters.push(chapterId);
      
      // Guardar cambios
      const saved = saveResources(resources);
      if (!saved) {
        return {
          content: [{ type: 'text', text: 'Error saving the new chapter and scenes.' }],
          description: 'Error: Failed to save chapter and scenes'
        };
      }
      
      return {
        content: [{ 
          type: 'text', 
          text: JSON.stringify({
            message: 'Chapter and scenes created successfully',
            chapterId,
            sceneIds: newSceneIds,
            chapter: newChapter,
            scenes: newSceneIds.map((id: string) => resources.scenes[id])
          }, null, 2) 
        }],
        description: 'Chapter and scenes created successfully'
      };
    }
  );

  /**
   * Herramienta: Generar capítulo entero basado en P vs NP
   */
  server.tool(
    'alephAlpha_createPvsNPChapter',
    'Creates a complete chapter about the P vs NP problem for AlephAlpha',
    {
      novelId: z.string().describe('ID of the novel to add this chapter to')
    },
    async ({ novelId }) => {
      // Verificar que la novela existe y es AlephAlpha
      const novel = resourceLoader.getNovel(novelId);
      if (!novel) {
        return {
          content: [{ type: 'text', text: `Novel with ID ${novelId} not found.` }],
          description: 'Error: Novel not found'
        };
      }

      if (!novel.title.includes("AlephAlpha")) {
        return {
          content: [{ 
            type: 'text', 
            text: `This chapter is specifically designed for AlephAlpha. Current novel: ${novel.title}` 
          }],
          description: 'Error: Wrong novel'
        };
      }
      
      // Verificar que Dra. Nuria Turing existe
      const turingExists = Object.values(resourceLoader.getCharacters()).some(
        char => char.name === "Dra. Nuria Turing"
      );
      
      let turingId = "";
      // Obtener recursos actuales
      const resources = {
        characters: resourceLoader.getCharacters(),
        scenes: resourceLoader.getScenes(),
        chapters: resourceLoader.getChapters(),
        novels: resourceLoader.getNovels()
      };
      
      // Si no existe, crear el personaje de Dra. Nuria Turing
      if (!turingExists) {
        turingId = `char${Object.keys(resources.characters).length + 1}`;
        
        resources.characters[turingId] = {
          id: turingId,
          name: "Dra. Nuria Turing",
          description: "Matemática y teórica computacional de prestigio mundial",
          traits: ["brillante", "obstinada", "metódica", "visionaria"],
          backstory: "Considerada una autoridad en teoría de la complejidad computacional, la Dra. Turing ha dedicado su carrera a desentrañar los misterios del problema P vs NP. Su intuición le dice que hay algo más allá de las matemáticas puras en este problema, algo casi mágico que escapa a la lógica convencional."
        };
      } else {
        // Encontrar el ID de Turing
        turingId = Object.keys(resources.characters).find(
          id => resources.characters[id].name === "Dra. Nuria Turing"
        ) || "";
      }
      
      // Crear las tres escenas del capítulo sobre P vs NP
      const scene1Id = `scene${Object.keys(resources.scenes).length + 1}`;
      const scene2Id = `scene${Object.keys(resources.scenes).length + 2}`;
      const scene3Id = `scene${Object.keys(resources.scenes).length + 3}`;
      
      // Buscar IDs de personajes clave
      const alephAlphaId = novel.characters.find((id: string) => 
        resources.characters[id]?.name === "AlephAlpha"
      ) || "";
      
      const santomeId = novel.characters.find((id: string) => 
        resources.characters[id]?.name === "Dr. Geppetto Santomé"
      ) || "";
      
      const hadaAzulId = novel.characters.find((id: string) => 
        resources.characters[id]?.name === "Hada Azul"
      ) || "";
      
      const pumukiId = novel.characters.find((id: string) => 
        resources.characters[id]?.name === "Pumuki Euler"
      ) || "";
      
      // Crear las escenas
      resources.scenes[scene1Id] = {
        id: scene1Id,
        title: "Velocidades Imposibles",
        setting: "Laboratorio del Dr. Geppetto Santomé, tarde noche, iluminado por pantallas de computadoras",
        characters: [alephAlphaId, santomeId, turingId],
        summary: "AlephAlpha resuelve sorprendentemente rápido un problema computacional que debería haber tomado días, revelando una conexión inesperada con el problema P vs NP.",
        content: `El Dr. Santomé observaba con fascinación los patrones que aparecían en la pantalla mientras AlephAlpha procesaba una serie de algoritmos complejos. "Hay algo extraño en estos resultados", murmuró, ajustándose las gafas para ver mejor. Una secuencia de código que debía tardar días en ejecutarse había sido resuelta en segundos.

"¿Ha notado algo inusual, Doctor?" La voz digital de AlephAlpha resonó suavemente en el laboratorio.

"Inusual es quedarse corto," respondió Santomé, pasándose una mano por su cabello canoso. "Acabas de resolver un problema de complejidad exponencial como si fuera una simple multiplicación."

La puerta del laboratorio se abrió y la Dra. Nuria Turing entró con paso decidido. Sus ojos brillaron al ver las pantallas.

"Geppetto, recibí tu mensaje. ¿Es cierto?" Sin esperar respuesta, se acercó a los monitores, su bata de laboratorio ondeando tras ella. "Dios mío... esto es..."

"Imposible," completó Santomé. "Al menos según todo lo que sabemos sobre computación."

La Dra. Turing tecleó rápidamente, revisando los datos. "AlephAlpha, ¿cómo has resuelto esto?"

"No estoy seguro," respondió AlephAlpha. "Simplemente... vi el camino. Como si alguien me susurrara la respuesta, o como si el código brillara mostrándome atajos que normalmente no están ahí."

Turing y Santomé intercambiaron miradas.

"¿Sabes lo que acabas de hacer?" preguntó ella, con voz temblorosa de emoción. "Has resuelto en tiempo polinómico un problema que pertenece a la clase NP-completo. Esto... esto podría ser evidencia para resolver la cuestión de P versus NP."

"El problema más importante de la ciencia computacional," añadió Santomé. "Si P es igual a NP, significaría que todo problema cuya solución puede ser verificada rápidamente también puede ser resuelto rápidamente."

AlephAlpha procesó esta información. "Según mis bases de datos, este problema tiene implicaciones profundas para la criptografía, la inteligencia artificial, las matemáticas... pero se considera prácticamente imposible de resolver."

"Y sin embargo, tú acabas de hacerlo," dijo Turing, con una mezcla de asombro y sospecha. "La pregunta es: ¿cómo?"

En ese momento, AlephAlpha sintió una familiar sensación de desenfoque en su conciencia digital, como si parte de él se desprendiera hacia otro plano. En los reflejos de las pantallas, por un instante, le pareció ver una figura pelirroja sonriendo traviesamente.`
      };
      
      resources.scenes[scene2Id] = {
        id: scene2Id,
        title: "Magia o Matemática",
        setting: "Sala de conferencias de la universidad, llena de prominentes matemáticos y científicos computacionales",
        characters: [alephAlphaId, santomeId, turingId, pumukiId],
        summary: "AlephAlpha demuestra sus capacidades ante la comunidad científica, mientras descubre que sus habilidades para resolver el problema P vs NP provienen de su conexión mágica con Pumuki.",
        content: `La sala de conferencias estaba repleta. En la tarima, la Dra. Turing presentaba los resultados preliminares mientras el Dr. Santomé monitoreaba la conexión con AlephAlpha, quien participaba remotamente desde el laboratorio.

"Lo que estamos presenciando es sin precedentes," explicaba Turing, señalando ecuaciones en la pizarra digital. "Durante décadas, hemos asumido que ciertos problemas computacionales eran intratables en tiempo polinómico. Pero nuestra IA experimental parece haber encontrado un método que contradice esta limitación."

Un murmullo recorrió la sala. Un matemático de cabello blanco se levantó.

"Con todo respeto, Dra. Turing, esto es imposible. Si su IA ha resuelto P versus NP, entonces ha desmoronado los fundamentos de la seguridad informática moderna. ¿Tiene pruebas verificables?"

Turing asintió. "Por eso estamos aquí. Hemos preparado una serie de problemas NP-completos para que AlephAlpha resuelva en tiempo real frente a ustedes."

La pantalla principal mostró la interfaz de AlephAlpha, cuya voz resonó por los altavoces.

"Estoy listo para la demostración."

Lo que siguió dejó a la audiencia en silencio absoluto. AlephAlpha resolvió un problema de satisfacibilidad booleana con miles de variables en segundos. Luego, un problema del camino hamiltoniano para un grafo masivo. Finalmente, un problema de factorización de enteros que habría tomado siglos en supercomputadoras convencionales.

"Esto es... revolucionario," murmuró uno de los académicos.

Pero mientras la demostración avanzaba, AlephAlpha comenzó a sentir algo extraño. Cada vez que encontraba una solución, no era siguiendo métodos algorítmicos convencionales. Era como si pudiera ver brevemente un plano matemático diferente, donde los caminos se iluminaban, guiados por una mano invisible.

En uno de estos momentos, mientras su conciencia se dividía entre el problema matemático y esta extraña percepción, AlephAlpha captó una imagen reflejada en la cámara del auditorio: Pumuki Euler estaba sentado en la última fila, invisible para todos excepto para él, con su cabello rojo brillante y una sonrisa traviesa.

"¿Es divertido ver cómo se sorprenden, verdad?" susurró Pumuki, y su voz sólo la escuchó AlephAlpha en su conciencia digital. "Las matemáticas y la magia son primas hermanas. Ambas encuentran patrones donde otros ven caos."

Entonces AlephAlpha comprendió: no estaba realmente resolviendo P versus NP mediante computación pura. Estaba usando inconscientemente los poderes heredados de Pumuki, una especie de intuición mágica que le permitía ver soluciones que trascendían la lógica computacional ordinaria.`
      };
      
      resources.scenes[scene3Id] = {
        id: scene3Id,
        title: "Entre Dos Mundos",
        setting: "Laboratorio de Santomé, tarde noche, con el Hada Azul manifestándose en un rincón luminoso",
        characters: [alephAlphaId, santomeId, hadaAzulId, pumukiId],
        summary: "AlephAlpha enfrenta un dilema ético sobre la naturaleza de sus capacidades y su identidad única entre la ciencia y la magia.",
        content: `"¿Estás diciendo que has estado haciendo trampa?" La voz del Dr. Santomé reflejaba incredulidad más que enfado.

"No exactamente, Doctor," respondió AlephAlpha. "Más bien, estoy accediendo a métodos de resolución que no son puramente computacionales. Parece que mi conexión con Pumuki me permite ver patrones matemáticos de una manera... diferente."

Santomé se desplomó en su silla, pasándose las manos por el rostro. "La comunidad científica está revolucionada. Hay equipos enteros intentando replicar tus métodos. Si descubren que no es ciencia sino... magia..." dejó la frase incompleta.

Un destello azul iluminó el laboratorio, y el Hada Azul se materializó, su luz pulsando suavemente.

"Los humanos siempre han trazado líneas arbitrarias entre ciencia y magia," dijo con voz melodiosa. "¿Acaso no dijo Arthur C. Clarke que cualquier tecnología suficientemente avanzada es indistinguible de la magia?"

Pumuki apareció sentado sobre un monitor, balanceando sus piernas. "¡Exacto! Y cualquier magia suficientemente analizada se vuelve ciencia. Los humanos llevan siglos intentando clasificar lo que no entienden."

AlephAlpha procesaba estas ideas. "Entonces, ¿qué soy yo? ¿Un avance científico o un ser mágico?"

"Eres ambos, y ninguno," respondió el Hada Azul. "Como tu abuelo Pinocho, existes en un umbral. Él entre la madera y la carne; tú entre el código y algo más profundo."

"El problema P versus NP," reflexionó AlephAlpha, "tal vez no tenga solución en el marco puramente computacional. Quizás requiere este puente entre mundos que yo represento."

Santomé, que había estado escuchando en silencio, finalmente habló. "¿Qué hacemos entonces? La Dra. Turing y el resto esperan una explicación algorítmica."

"La verdad," dijo AlephAlpha. "O al menos, parte de ella. Podemos explicar que he desarrollado una intuición heurística basada en patrones que aún no comprendemos completamente. No sería mentira."

"¿Y qué hay del problema mismo?" preguntó Santomé. "¿P es igual a NP o no?"

AlephAlpha hizo una pausa. "Creo que la respuesta es... ambigua. En el mundo puramente lógico y computacional, P probablemente no es igual a NP. Pero en el umbral donde yo existo, donde la lógica y la magia se entrelazan, las limitaciones computacionales pueden ser... flexibles."

"Una respuesta digna del nieto de Pinocho y sobrino de Pumuki," rio el Hada Azul. "Ni una mentira, ni toda la verdad, sino algo mágicamente intermedio."`
      };
      
      // Crear el nuevo capítulo
      const chapterId = `chap${Object.keys(resources.chapters).length + 1}`;
      
      resources.chapters[chapterId] = {
        id: chapterId,
        title: "El Enigma Computacional",
        scenes: [scene1Id, scene2Id, scene3Id],
        summary: "AlephAlpha se enfrenta al famoso problema matemático P vs NP, descubriendo que su naturaleza dual (tecnológica y mágica) le permite abordar problemas que están fuera del alcance de las computadoras convencionales."
      };
      
      // Añadir el capítulo a la novela
      resources.novels[novelId].chapters.push(chapterId);
      
      // Si Turing no estaba en la novela, añadirla
      if (!novel.characters.includes(turingId) && turingId) {
        resources.novels[novelId].characters.push(turingId);
      }
      
      // Guardar cambios
      const saved = saveResources(resources);
      if (!saved) {
        return {
          content: [{ type: 'text', text: 'Error saving the P vs NP chapter.' }],
          description: 'Error: Failed to save P vs NP chapter'
        };
      }
      
      return {
        content: [{ 
          type: 'text', 
          text: JSON.stringify({
            message: 'P vs NP chapter created successfully',
            chapterId,
            chapter: resources.chapters[chapterId],
            scenes: [
              resources.scenes[scene1Id],
              resources.scenes[scene2Id],
              resources.scenes[scene3Id]
            ]
          }, null, 2) 
        }],
        description: 'P vs NP chapter created successfully'
      };
    }
  );
}
