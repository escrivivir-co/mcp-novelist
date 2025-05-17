#!/usr/bin/env node

/**
 * Script para actualizar los datos del catálogo de novelas
 * 
 * Este script copia el archivo novel-data.json desde src/resources
 * a una ubicación accesible para la web (docs/api)
 * 
 * ACTUALIZADO: Ahora compatible con la nueva estructura de directorios
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

// Función para validar y normalizar los datos
function validateAndNormalizeData(data) {
    // Asegurarse de que todos los arrays existan
    data.novels = data.novels || [];
    data.characters = data.characters || [];
    data.scenes = data.scenes || [];
    
    // Validar y normalizar novelas
    data.novels.forEach(novel => {
        // Asegurar que las propiedades básicas existan
        novel.id = novel.id || `novel-${Date.now()}`;
        novel.name = novel.name || novel.title || 'Novela sin título';
        novel.title = novel.title || novel.name;
        novel.description = novel.description || novel.summary || '';
        novel.genre = novel.genre || 'General';
        
        // Convertir arrays de strings a arrays de objetos si es necesario
        if (!novel.chapters) {
            novel.chapters = [];
        } else if (Array.isArray(novel.chapters)) {
            // Transformar cualquier string en el array chapters a objetos
            novel.chapters = novel.chapters.map((chapter, chapterIndex) => {
                if (typeof chapter === 'string') {
                    // Si chapter es un string, lo usamos como ID y creamos un objeto
                    return {
                        id: chapter,
                        title: `Capítulo ${chapterIndex + 1}`,
                        description: '',
                        scenes: []
                    };
                }
                return chapter;
            });
        }
        
        if (!novel.characters) {
            novel.characters = [];
        } else if (Array.isArray(novel.characters)) {
            // Asegurarnos de que cada elemento en characters sea un string (ID)
            novel.characters = novel.characters.map(char => 
                typeof char === 'object' ? char.id || `char-${Date.now()}` : char
            );
        }
        
        // Validar capítulos
        novel.chapters.forEach((chapter, chapterIndex) => {
            chapter.id = chapter.id || `chapter-${novel.id}-${chapterIndex}`;
            chapter.title = chapter.title || `Capítulo ${chapterIndex + 1}`;
            chapter.description = chapter.description || '';
            
            // Manejar scenes de la misma manera
            if (!chapter.scenes) {
                chapter.scenes = [];
            } else if (Array.isArray(chapter.scenes)) {
                // Transformar cualquier objeto en el array scenes a strings (IDs)
                chapter.scenes = chapter.scenes.map(scene => 
                    typeof scene === 'object' ? scene.id || `scene-${Date.now()}` : scene
                );
            }
        });
    });
    
    // Validar y normalizar personajes
    data.characters.forEach((character, index) => {
        character.id = character.id || `character-${Date.now()}-${index}`;
        character.name = character.name || 'Personaje sin nombre';
        character.description = character.description || '';
        character.role = character.role || 'Personaje';
        
        // Asegurarnos de que traits es un array
        if (!character.traits) {
            character.traits = [];
        } else if (!Array.isArray(character.traits)) {
            character.traits = [character.traits.toString()];
        }
        
        character.background = character.background || '';
    });
    
    // Validar y normalizar escenas
    data.scenes.forEach((scene, index) => {
        scene.id = scene.id || `scene-${Date.now()}-${index}`;
        scene.title = scene.title || 'Escena sin título';
        scene.setting = scene.setting || '';
        scene.content = scene.content || '';
        
        // Asegurarnos de que characters es un array
        if (!scene.characters) {
            scene.characters = [];
        } else if (!Array.isArray(scene.characters)) {
            scene.characters = [scene.characters.toString()];
        }
    });
    
    return data;
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
    
    // Transformar los datos al formato esperado por el frontend
    let transformedData = {
        novels: [],
        characters: [],
        scenes: []
    };
    
    // Manejar diferentes estructuras posibles en los datos de origen
    if (sourceData.resources) {
        // Estructura original con resources
        if (sourceData.resources.novels) {
            transformedData.novels = Array.isArray(sourceData.resources.novels) 
                ? sourceData.resources.novels 
                : Object.values(sourceData.resources.novels);
        }
        
        if (sourceData.resources.characters) {
            transformedData.characters = Array.isArray(sourceData.resources.characters) 
                ? sourceData.resources.characters 
                : Object.values(sourceData.resources.characters);
        }
        
        if (sourceData.resources.scenes) {
            transformedData.scenes = Array.isArray(sourceData.resources.scenes) 
                ? sourceData.resources.scenes 
                : Object.values(sourceData.resources.scenes);
        }
    } else {
        // Estructura simple
        transformedData.novels = sourceData.novels || [];
        transformedData.characters = sourceData.characters || [];
        transformedData.scenes = sourceData.scenes || [];
    }
    
    // Validar y normalizar los datos
    transformedData = validateAndNormalizeData(transformedData);
    
    // Escribir los datos transformados
    fs.writeFileSync(targetFile, JSON.stringify(transformedData, null, 2), 'utf8');
    console.log(`✅ Catálogo actualizado: ${sourceFile} → ${targetFile}`);
} catch (error) {
    console.error(`❌ Error al actualizar el catálogo: ${error.message}`);
    console.error('Stack:', error.stack);
    process.exit(1);
}

console.log('🚀 Catálogo web actualizado correctamente.');
