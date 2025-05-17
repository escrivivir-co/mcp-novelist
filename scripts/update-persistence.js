import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

// Obtener el directorio actual
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

// Rutas a los archivos principales
const resourceLoaderPath = path.join(projectRoot, 'src', 'resources', 'resource-loader.ts');
const persistenceManagerPath = path.join(projectRoot, 'src', 'resources', 'persistence-manager.ts');
const novelistExtensionToolsPath = path.join(projectRoot, 'src', 'tools', 'novelist-extension-tools.ts');

/**
 * Modifica novelist-extension-tools.ts para utilizar el sistema de persistencia
 */
function updateNovelistExtensionTools() {
  try {
    console.log('Modificando novelist-extension-tools.ts...');
    
    // Leer el archivo original
    let content = fs.readFileSync(novelistExtensionToolsPath, 'utf8');
    
    // Paso 1: Añadir la importación del PersistenceManager
    content = content.replace(
      `import { 
  NovelResources, 
  Character, 
  Scene, 
  Chapter, 
  Novel 
} from '../resources/novel-resources.js';`,
      `import { 
  NovelResources, 
  Character, 
  Scene, 
  Chapter, 
  Novel 
} from '../resources/novel-resources.js';
import { PersistenceManager } from '../resources/persistence-manager.js';`
    );
    
    // Paso 2: Reemplazar la función saveResources
    const oldSaveResources = `/**
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
  };`;
    
    const newSaveResources = `/**
   * Función de utilidad para guardar datos actualizados
   */
  const saveResources = (resources: NovelResources) => {
    try {
      // Obtener el gestor de persistencia
      const persistenceManager = PersistenceManager.getInstance();
      
      // Leer el archivo existente para preservar las plantillas de prompts
      const currentData = persistenceManager.readResourceFile();
      
      if (!currentData) {
        console.error('Error reading current resource file');
        return false;
      }
      
      // Guardar los recursos
      const saved = persistenceManager.saveResources(resources, currentData.promptTemplates);
      
      // Actualizar catálogo web
      if (saved) {
        resourceLoader.updateCatalogForWeb();
      }
      
      return saved;
    } catch (error) {
      console.error('Error saving resources:', error);
      return false;
    }
  };`;
    
    content = content.replace(oldSaveResources, newSaveResources);
    
    // Escribir el archivo modificado
    fs.writeFileSync(novelistExtensionToolsPath, content, 'utf8');
    console.log('novelist-extension-tools.ts modificado con éxito');
    
    return true;
  } catch (error) {
    console.error('Error al modificar novelist-extension-tools.ts:', error);
    return false;
  }
}

// Ejecutar la actualización
updateNovelistExtensionTools();
