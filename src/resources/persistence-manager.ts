import { writeFileSync, readFileSync } from 'fs';
import { NovelResources, NovelPromptTemplate } from './novel-resources.js';
import path from 'path';
import { fileURLToPath } from 'url';

// Obtener el directorio actual
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Clase para gestionar la persistencia de recursos de novela
 * Implementa un patrón singleton para asegurar que solo existe una instancia
 */
export class PersistenceManager {
  private dataFilePath: string;
  private static instance: PersistenceManager;
  private autoSaveEnabled: boolean;
  
  private constructor() {
    this.dataFilePath = path.join(__dirname, 'novel-data.json');
    this.autoSaveEnabled = true;
  }

  /**
   * Obtiene la instancia única del PersistenceManager
   */
  public static getInstance(): PersistenceManager {
    if (!PersistenceManager.instance) {
      PersistenceManager.instance = new PersistenceManager();
    }
    return PersistenceManager.instance;
  }

  /**
   * Habilita o deshabilita el guardado automático
   */
  public setAutoSave(enabled: boolean): void {
    this.autoSaveEnabled = enabled;
    console.log(`Auto-save ${enabled ? 'enabled' : 'disabled'}`);
  }

  /**
   * Comprueba si el guardado automático está habilitado
   */
  public isAutoSaveEnabled(): boolean {
    return this.autoSaveEnabled;
  }

  /**
   * Guarda los recursos en el archivo JSON
   */
  public saveResources(resources: NovelResources, promptTemplates: NovelPromptTemplate[]): boolean {
    try {
      const data = {
        resources,
        promptTemplates
      };
      
      writeFileSync(this.dataFilePath, JSON.stringify(data, null, 2), 'utf-8');
      console.log(`Resources saved to ${this.dataFilePath}`);
      return true;
    } catch (error) {
      console.error('Error saving resources:', error);
      return false;
    }
  }

  /**
   * Lee el contenido actual del archivo de recursos
   */
  public readResourceFile(): any {
    try {
      const fileContent = readFileSync(this.dataFilePath, 'utf-8');
      return JSON.parse(fileContent);
    } catch (error) {
      console.error('Error reading resource file:', error);
      return null;
    }
  }

  /**
   * Permite guardar un recurso individual e integrarlo en el archivo JSON existente
   */
  public saveResource(
    resourceType: 'character' | 'scene' | 'chapter' | 'novel', 
    resourceId: string, 
    resourceData: any
  ): boolean {
    try {
      // Leer el archivo actual
      const currentData = this.readResourceFile();
      if (!currentData) return false;
      
      // Actualizar el recurso específico
      if (!currentData.resources[`${resourceType}s`]) {
        currentData.resources[`${resourceType}s`] = {};
      }
      
      currentData.resources[`${resourceType}s`][resourceId] = resourceData;
      
      // Guardar el archivo actualizado
      writeFileSync(this.dataFilePath, JSON.stringify(currentData, null, 2), 'utf-8');
      console.log(`Resource ${resourceType} with ID ${resourceId} saved to ${this.dataFilePath}`);
      return true;
    } catch (error) {
      console.error(`Error saving ${resourceType} resource:`, error);
      return false;
    }
  }
}
