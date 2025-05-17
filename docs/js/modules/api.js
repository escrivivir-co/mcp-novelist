/**
 * api.js - Módulo para gestionar las llamadas a la API
 */

import { CONSTANTS } from './constants.js';

/**
 * Carga los datos de novelas desde la API
 * @returns {Promise<Object>} Los datos cargados
 */
export async function loadNovelData() {
    try {
        console.log("Intentando cargar datos desde:", CONSTANTS.API.NOVEL_DATA);
        
        // Agregar un parámetro de timestamp para evitar la caché
        const nocacheUrl = `${CONSTANTS.API.NOVEL_DATA}?_=${new Date().getTime()}`;
        
        const response = await fetch(nocacheUrl);
        
        if (!response.ok) {
            console.error('Error de respuesta:', response.status, response.statusText);
            throw new Error(`No se pudieron cargar los datos. Estado: ${response.status}`);
        }
        
        // Obtener el texto de la respuesta para depuración
        const responseText = await response.text();
        console.log("Texto de respuesta:", responseText.substring(0, 100) + "...");
        
        try {
            // Intentar analizar el texto como JSON
            const data = JSON.parse(responseText);
            console.log("Datos JSON cargados correctamente:", data);
            
            // Validar la estructura de datos
            validateData(data);
            
            return data;
        } catch (jsonError) {
            console.error("Error al analizar JSON:", jsonError);
            throw new Error(`Error al analizar JSON: ${jsonError.message}`);
        }
    } catch (error) {
        console.error('Error al cargar los datos:', error);
        throw error;
    }
}

/**
 * Valida la estructura de los datos
 * @param {Object} data - Los datos a validar
 */
function validateData(data) {
    if (!data.novels) {
        console.warn("No se encontraron novelas en los datos");
    } else {
        console.log(`Novelas cargadas: ${data.novels.length}`);
        
        // Validar capítulos
        data.novels.forEach(novel => {
            console.log(`Novela: ${novel.title}, Capítulos: ${novel.chapters ? novel.chapters.length : 0}`);
            
            if (novel.chapters && novel.chapters.length > 0) {
                novel.chapters.forEach(chapter => {
                    console.log(`Capítulo: ${chapter.title}, Escenas: ${chapter.scenes ? chapter.scenes.length : 0}`);
                    console.log('IDs de escenas:', chapter.scenes);
                });
            }
        });
    }
    
    if (!data.characters) {
        console.warn("No se encontraron personajes en los datos");
    } else {
        console.log(`Personajes cargados: ${data.characters.length}`);
    }
    
    if (!data.scenes) {
        console.warn("No se encontraron escenas en los datos");
    } else {
        console.log(`Escenas cargadas: ${data.scenes.length}`);
        console.log('IDs de escenas disponibles:', data.scenes.map(s => s.id));
    }
}
