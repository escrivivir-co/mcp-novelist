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

// Obtener la ruta del directorio actual
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.join(__dirname, '..');

// Rutas de origen y destino
const sourceFile = path.join(projectRoot, 'src', 'resources', 'novel-data.json');
const targetDir = path.join(projectRoot, 'docs', 'api');
const targetFile = path.join(targetDir, 'novel-data.json');

// Asegurarse de que el directorio de destino existe
if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
    console.log(`Directorio creado: ${targetDir}`);
}

// Leer, transformar y escribir los datos
try {
    const rawData = fs.readFileSync(sourceFile, 'utf8');
    const sourceData = JSON.parse(rawData);
    
    // Transformar los datos al formato esperado por el frontend
    const transformedData = {
        novels: Object.values(sourceData.resources.novels || {}),
        characters: Object.values(sourceData.resources.characters || {}),
        scenes: Object.values(sourceData.resources.scenes || {})
    };
    
    // Escribir los datos transformados
    fs.writeFileSync(targetFile, JSON.stringify(transformedData, null, 2), 'utf8');
    console.log(`✅ Catálogo actualizado: ${sourceFile} → ${targetFile}`);
} catch (error) {
    console.error(`❌ Error al actualizar el catálogo: ${error.message}`);
    process.exit(1);
}

console.log('🚀 Catálogo web actualizado correctamente.');
