// script para actualizar novelist-extension-tools.ts
const fs = require('fs');
const path = require('path');

// Rutas a los archivos principales
const projectRoot = path.resolve(__dirname, '..');
const novelistExtensionToolsPath = path.join(projectRoot, 'src', 'tools', 'novelist-extension-tools.ts');

try {
  console.log('Modificando novelist-extension-tools.ts...');
  
  // Leer el archivo original
  let content = fs.readFileSync(novelistExtensionToolsPath, 'utf8');
  
  // Paso 1: Añadir la importación del PersistenceManager
  if (!content.includes('PersistenceManager')) {
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
  }
  
  // Paso 2: Buscar la función saveResources
  const saveResourcesRegex = /\/\*\*\s*\n\s*\*\s*Función de utilidad para guardar datos actualizados\s*\n\s*\*\/\s*\n\s*const saveResources[\s\S]*?return false;\s*\n\s*\}\s*\};/m;
  
  // Reemplazar la función saveResources
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
  
  content = content.replace(saveResourcesRegex, newSaveResources);
  
  // Escribir el archivo modificado
  fs.writeFileSync(novelistExtensionToolsPath, content, 'utf8');
  console.log('novelist-extension-tools.ts modificado con éxito');
  
} catch (error) {
  console.error('Error al modificar novelist-extension-tools.ts:', error);
}
