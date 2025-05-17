import { readFileSync } from 'fs';
import { 
  NovelResources, 
  NovelPromptTemplate,
  CharacterSchema,
  SceneSchema,
  ChapterSchema,
  NovelSchema
} from './novel-resources.js';
import { PersistenceManager } from './persistence-manager.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

// Obtener el directorio actual
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..', '..');

// Clase para cargar y gestionar recursos de novela
export class NovelResourceLoader {
  private resources: NovelResources;
  private promptTemplates: NovelPromptTemplate[];
  private static instance: NovelResourceLoader;
  private persistenceManager: PersistenceManager;

  private constructor() {
    this.resources = {
      characters: {},
      scenes: {},
      chapters: {},
      novels: {}
    };
    this.promptTemplates = [];
    this.persistenceManager = PersistenceManager.getInstance();
    this.loadFromFile();
  }

  public static getInstance(): NovelResourceLoader {
    if (!NovelResourceLoader.instance) {
      NovelResourceLoader.instance = new NovelResourceLoader();
    }
    return NovelResourceLoader.instance;
  }

  private loadFromFile(): void {
    try {
      const dataPath = path.join(__dirname, 'novel-data.json');
      const fileContent = readFileSync(dataPath, 'utf-8');
      const data = JSON.parse(fileContent);

      // Validar y cargar recursos
      if (data.resources) {
        // Cargar personajes
        if (data.resources.characters) {
          Object.entries(data.resources.characters).forEach(([id, character]) => {
            try {
              const validatedCharacter = CharacterSchema.parse(character);
              this.resources.characters[id] = validatedCharacter;
            } catch (error) {
              console.error(`Error validating character ${id}:`, error);
            }
          });
        }

        // Cargar escenas
        if (data.resources.scenes) {
          Object.entries(data.resources.scenes).forEach(([id, scene]) => {
            try {
              const validatedScene = SceneSchema.parse(scene);
              this.resources.scenes[id] = validatedScene;
            } catch (error) {
              console.error(`Error validating scene ${id}:`, error);
            }
          });
        }

        // Cargar capítulos
        if (data.resources.chapters) {
          Object.entries(data.resources.chapters).forEach(([id, chapter]) => {
            try {
              const validatedChapter = ChapterSchema.parse(chapter);
              this.resources.chapters[id] = validatedChapter;
            } catch (error) {
              console.error(`Error validating chapter ${id}:`, error);
            }
          });
        }

        // Cargar novelas
        if (data.resources.novels) {
          Object.entries(data.resources.novels).forEach(([id, novel]) => {
            try {
              const validatedNovel = NovelSchema.parse(novel);
              this.resources.novels[id] = validatedNovel;
            } catch (error) {
              console.error(`Error validating novel ${id}:`, error);
            }
          });
        }
      }

      // Cargar plantillas de prompts
      if (data.promptTemplates) {
        this.promptTemplates = data.promptTemplates;
      }

      console.log('Novel resources and templates loaded successfully');
    } catch (error) {
      console.error('Error loading novel resources:', error);
    }
  }
  // Métodos para acceder a los recursos
  public getCharacters(): Record<string, any> {
    return this.resources.characters;
  }

  public getCharacter(id: string): any | null {
    return this.resources.characters[id] || null;
  }

  public getScenes(): Record<string, any> {
    return this.resources.scenes;
  }

  public getScene(id: string): any | null {
    return this.resources.scenes[id] || null;
  }

  public getChapters(): Record<string, any> {
    return this.resources.chapters;
  }

  public getChapter(id: string): any | null {
    return this.resources.chapters[id] || null;
  }

  public getNovels(): Record<string, any> {
    return this.resources.novels;
  }

  public getNovel(id: string): any | null {
    return this.resources.novels[id] || null;
  }

  public getPromptTemplates(): NovelPromptTemplate[] {
    return this.promptTemplates;
  }

  public getPromptTemplate(id: string): NovelPromptTemplate | null {
    return this.promptTemplates.find(template => template.id === id) || null;
  }

  // Métodos para crear y actualizar recursos con persistencia
  public createCharacter(character: any): string {
    try {
      const validatedCharacter = CharacterSchema.parse(character);
      this.resources.characters[character.id] = validatedCharacter;
      
      // Guardar en archivo si el autoguardado está activado
      if (this.persistenceManager.isAutoSaveEnabled()) {
        this.persistenceManager.saveResource('character', character.id, validatedCharacter);
      }
      
      return character.id;
    } catch (error) {
      console.error('Error creating character:', error);
      throw error;
    }
  }

  public createScene(scene: any): string {
    try {
      const validatedScene = SceneSchema.parse(scene);
      this.resources.scenes[scene.id] = validatedScene;
      
      // Guardar en archivo si el autoguardado está activado
      if (this.persistenceManager.isAutoSaveEnabled()) {
        this.persistenceManager.saveResource('scene', scene.id, validatedScene);
      }
      
      return scene.id;
    } catch (error) {
      console.error('Error creating scene:', error);
      throw error;
    }
  }

  public createChapter(chapter: any): string {
    try {
      const validatedChapter = ChapterSchema.parse(chapter);
      this.resources.chapters[chapter.id] = validatedChapter;
      
      // Guardar en archivo si el autoguardado está activado
      if (this.persistenceManager.isAutoSaveEnabled()) {
        this.persistenceManager.saveResource('chapter', chapter.id, validatedChapter);
      }
      
      return chapter.id;
    } catch (error) {
      console.error('Error creating chapter:', error);
      throw error;
    }
  }

  public updateNovel(novel: any): boolean {
    try {
      const validatedNovel = NovelSchema.parse(novel);
      this.resources.novels[novel.id] = validatedNovel;
      
      // Guardar en archivo si el autoguardado está activado
      if (this.persistenceManager.isAutoSaveEnabled()) {
        this.persistenceManager.saveResource('novel', novel.id, validatedNovel);
      }
      
      return true;
    } catch (error) {
      console.error('Error updating novel:', error);
      return false;
    }
  }

  public updateScene(scene: any): boolean {
    try {
      const validatedScene = SceneSchema.parse(scene);
      this.resources.scenes[scene.id] = validatedScene;
      
      // Guardar en archivo si el autoguardado está activado
      if (this.persistenceManager.isAutoSaveEnabled()) {
        this.persistenceManager.saveResource('scene', scene.id, validatedScene);
      }
      
      return true;
    } catch (error) {
      console.error('Error updating scene:', error);
      return false;
    }
  }

  public updateChapter(chapter: any): boolean {
    try {
      const validatedChapter = ChapterSchema.parse(chapter);
      this.resources.chapters[chapter.id] = validatedChapter;
      
      // Guardar en archivo si el autoguardado está activado
      if (this.persistenceManager.isAutoSaveEnabled()) {
        this.persistenceManager.saveResource('chapter', chapter.id, validatedChapter);
      }
      
      return true;
    } catch (error) {
      console.error('Error updating chapter:', error);
      return false;
    }
  }

  // Guardar todos los recursos en el archivo JSON
  public saveAllResources(): boolean {
    return this.persistenceManager.saveResources(this.resources, this.promptTemplates);
  }

  // Método para aplicar una plantilla de prompt con variables
  public applyPromptTemplate(templateId: string, variables: Record<string, string>): string | null {
    const template = this.getPromptTemplate(templateId);
    if (!template) return null;    let result = template.template;
    Object.entries(variables).forEach(([key, value]) => {
      result = result.replace(new RegExp(`{{${key}}}`, 'g'), value);
    });
    
    return result;
  }
  
  // Actualiza el catálogo para la web
  public updateCatalogForWeb(): void {
    try {
      console.log("Actualizando catálogo de novelas para la web desde ResourceLoader...");
      const scriptPath = path.join(projectRoot, 'scripts', 'update-catalog.js');
      execSync(`node "${scriptPath}"`, { stdio: 'inherit' });
      console.log("Catálogo de novelas actualizado correctamente desde ResourceLoader");
    } catch (error) {
      console.error("Error al actualizar el catálogo de novelas:", error);
    }
  }
}