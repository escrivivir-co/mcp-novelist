#!/usr/bin/env node

/**
 * Script para actualizar los datos del catálogo de novelas
 * 
 * Este script copia el archivo novel-data.json desde src/resources
 * a una ubicación accesible para la web (docs/api)
 */

const fs = require('fs');
const path = require('path');

// Rutas de los archivos
const sourceFile = path.resolve(__dirname, '..', 'src', 'resources', 'novel-data.json');
const targetDir = path.resolve(__dirname, '..', 'docs', 'api');
const targetFile = path.resolve(targetDir, 'novel-data.json');

// Asegurarse de que el directorio existe
if (!fs.existsSync(targetDir)) {
    console.log(`Creando directorio: ${targetDir}`);
    fs.mkdirSync(targetDir, { recursive: true });
}

try {
    // Leer el archivo fuente
    const data = fs.readFileSync(sourceFile, 'utf8');
    
    // Parsear el JSON para verificar que es válido
    const jsonData = JSON.parse(data);
    
    // Agregar información de timestamp
    jsonData.lastUpdated = new Date().toISOString();
    
    // Escribir el archivo con el timestamp actualizado
    fs.writeFileSync(targetFile, JSON.stringify(jsonData, null, 2));
    
    console.log(`✓ Datos actualizados exitosamente en: ${targetFile}`);
    console.log(`✓ Timestamp: ${jsonData.lastUpdated}`);
} catch (error) {
    console.error('❌ Error al actualizar datos:');
    console.error(error);
    process.exit(1);
}
