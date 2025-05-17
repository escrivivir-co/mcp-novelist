#!/usr/bin/env node

/**
 * Script para actualizar los datos del catálogo de novelas
 * 
 * Este script copia el archivo novel-data.json desde src/resources
 * a una ubicación accesible para la web (docs/api)
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { processNovelDataForWeb, validateNovelData, generateCatalogSummary } from './modules/dataProcessor.js';

// Obtener la ruta del directorio actual
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.join(__dirname, '..');

// Rutas de origen y destino
const sourceFile = path.join(projectRoot, 'src', 'resources', 'novel-data.json');
const targetDir = path.join(projectRoot, 'docs', 'api');
const targetFile = path.join(targetDir, 'novel-data.json');

// Función para depuración
function logObject(title, obj, maxDepth = 2) {
  console.log(`\n=== ${title} ===`);
  console.log(JSON.stringify(obj, (key, value) => {
    if (typeof value === 'object' && value !== null && maxDepth <= 0) {
      return '[Object]';
    }
    return value;
  }, 2));
}

// Asegurarse de que el directorio de destino existe
if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
    console.log(`Directorio creado: ${targetDir}`);
}

// Leer, transformar y escribir los datos
try {
    const rawData = fs.readFileSync(sourceFile, 'utf8');
    const sourceData = JSON.parse(rawData);
    
    // Para depuración
    console.log('Estructura de sourceData:', Object.keys(sourceData));
    if (sourceData.resources) {
        console.log('Estructura de resources:', Object.keys(sourceData.resources));
    }
    
    // Validar datos
    const validationMessages = validateNovelData(sourceData);
    validationMessages.forEach(message => console.log(message));
    
    // Procesar datos para formato web
    const webData = processNovelDataForWeb(sourceData);
    
    // Escribir los datos procesados
    fs.writeFileSync(targetFile, JSON.stringify(webData, null, 2), 'utf8');
    
    // Generar resumen del catálogo
    const summary = generateCatalogSummary(webData);
    console.log(summary);
    
    console.log(`✅ Catálogo actualizado: ${sourceFile} → ${targetFile}`);
    console.log('🚀 Catálogo web actualizado correctamente.');
} catch (error) {
    console.error('Error al procesar los datos:', error);
}
