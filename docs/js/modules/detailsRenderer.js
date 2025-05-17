/**
 * detailsRenderer.js - Módulo para renderizar los detalles de los elementos
 */

import { CONSTANTS } from './constants.js';
import { novelData } from '../catalog.js';
/**
 * Crea el HTML para los detalles de una novela
 * @param {Object} novel - La novela a mostrar
 * @param {Object} novelData - Los datos completos del catálogo
 * @returns {string} HTML con los detalles
 */
export function createNovelDetails(novel, novelData) {
    console.log(`Generando detalles para: ${novel.title} con ${novel.chapters?.length || 0} capítulos`);
    
    // Estructura básica inicial
    let detailContent = `
        <div class="detail-header">
            <h2>${novel.title}</h2>
            <div class="detail-meta">
                <span class="detail-badge">${novel.genre?.join(',') || 'Sin género'}</span>
                <span class="detail-date">Creada: ${formatDate(new Date())}</span>
            </div>
        </div>
        <div class="detail-section">
            <h3>Descripción</h3>
            <p>${novel.summary || 'No hay descripción disponible.'}</p>
        </div>
    `;
    
    // Sección de personajes
    if (novel.characters && novel.characters.length > 0) {
        detailContent += `<div class="detail-section">
            <h3>Personajes</h3>
            <div class="detail-characters">`;
        
        novel.characters.forEach(charId => {
            const character = novelData.content.characters.find(c => c.id === charId);
            if (character) {
                detailContent += `
                    <div class="detail-character-card" data-id="${character.id}" data-type="character">
                        <h4>${character.name}</h4>
                        <p>${character.description ? character.description + '...' : 'Sin descripción'}</p>
                    </div>
                `;
            }
        });
        
        detailContent += `</div></div>`;
    }
    
    // Sección de capítulos
    console.log("DEBUG - Capítulos disponibles:", novel.chapters);
    
    if (novel.chapters && novel.chapters.length > 0) {
        detailContent += `<div class="detail-section">
            <h3>Capítulos</h3>
            <div class="chapters-accordion">`;
        
        novel.chapters.forEach((chapter, index) => {
            // Depuración detallada
            console.log(`DEBUG - Procesando capítulo ${index}:`, chapter);
            
            // Obtener el título real del capítulo
            const chapterTitle = chapter.title || `Capítulo ${index+1}`;
            
            detailContent += `
                <div class="chapter-item">
                    <div class="chapter-header">
                        <h4>${chapterTitle}</h4>
                        <span class="chapter-toggle">+</span>
                    </div>
                    <div class="chapter-content" style="max-height: 0px;">
                        <p>${chapter.description || chapter.summary || 'Sin descripción'}</p>
                        <h5>Escenas:</h5>
                        <ul class="scene-list">
            `;
            
            // Procesar escenas del capítulo
            if (chapter.scenes && chapter.scenes.length > 0) {
                chapter.scenes.forEach(sceneId => {
                    console.log(`DEBUG - Buscando escena: ${sceneId}`);
                    
                    // Buscar la escena en el catálogo completo
                    const scene = novelData.content.scenes.find(s => s.id === sceneId);
                    
                    if (scene) {
                        detailContent += `
                            <li data-scene-id="${scene.id}">
                                <strong>${scene.title}</strong>: ${scene.summary || 'Sin resumen'}
                            </li>`;
                    } else {
                        console.log(`⚠️ Escena ${sceneId} no encontrada`);
                        detailContent += `<li>Escena no encontrada (ID: ${sceneId})</li>`;
                    }
                });
            } else {
                detailContent += `<li>No hay escenas disponibles para este capítulo</li>`;
            }
            
            detailContent += `</ul></div></div>`;
        });
        
        detailContent += `</div></div>`;
    }
    
    // Sección de lectura
    detailContent += `
        <div class="detail-section reading-section">
            <h3>Leer Novela</h3>
            <div class="reading-controls">
                <button id="toggle-reading-mode" class="reading-button">
                    <span class="icon">📖</span> Modo Lectura
                </button>
                <select id="chapter-selector" class="chapter-selector">
                    <option value="all">Novela Completa</option>
                    ${novel.chapters ? novel.chapters.map((chapter, idx) => 
                        `<option value="${idx}">Capítulo ${idx+1}: ${chapter.title || 'Sin título'}</option>`).join('') : ''}
                </select>
            </div>
            <div id="reading-container" class="reading-container">
                <div class="reading-header">
                    <h2>${novel.title}</h2>
                    <p class="reading-meta">Género: ${novel.genre?.join(',') || 'No especificado'}</p>
                </div>
                <div id="reading-content" class="reading-content">
                    ${generateNovelContent(novel, novelData)}
                </div>
            </div>
        </div>
    `;
    
    return detailContent;
}

/**
 * Crea el HTML para los detalles de un personaje
 * @param {Object} character - El personaje a mostrar
 * @param {Object} novelData - Los datos completos del catálogo
 * @returns {string} HTML con los detalles
 */
export function createCharacterDetails(character, novelData) {
    return `
        <div class="detail-header">
            <h2>${character.name}</h2>
            <div class="detail-meta">
                <span class="detail-badge">${character.role || 'Personaje'}</span>
            </div>
        </div>
        <div class="detail-section">
            <h3>Descripción</h3>
            <p>${character.description || 'Sin descripción disponible'}</p>
        </div>
        <div class="detail-section">
            <h3>Rasgos</h3>
            <div class="traits-container">
                ${(character.traits || []).map(trait => `<span class="trait-badge">${trait}</span>`).join('')}
            </div>
        </div>
        <div class="detail-section">
            <h3>Trasfondo</h3>
            <p>${character.backstory || 'Sin información de trasfondo'}</p>
        </div>
        <div class="detail-section">
            <h3>Aparece en</h3>
            <div class="appears-in-list">
                ${(novelData.content.novels || [])
                    .filter(novel => novel.characters && novel.characters.includes(character.id))
                    .map(novel => `
                        <div class="appears-in-item" data-id="${novel.id}" data-type="novel">
                            <h4>${novel.name || novel.title}</h4>
                            <p>${novel.description ? novel.description.substring(0, 100) + '...' : 'Sin descripción'}</p>
                        </div>
                    `).join('') || '<p>No aparece en ninguna novela</p>'}
            </div>
        </div>
    `;
}

/**
 * Crea el HTML para los detalles de una escena
 * @param {Object} scene - La escena a mostrar
 * @param {Object} novelData - Los datos completos del catálogo
 * @returns {string} HTML con los detalles
 */
export function createSceneDetails(scene, novelData) {
    if (!scene) return '<p>No se encontraron detalles de la escena</p>';

    // Buscar a qué novela y capítulo pertenece esta escena
    let novelTitle = 'Novela desconocida';
    let chapterTitle = 'Capítulo desconocido';
    
    // Buscar la novela y capítulo en los datos
    if (novelData && novelData.content) {
        // Buscar en cada novela
        for (const novel of novelData.content.novels || []) {
            // Buscar en cada capítulo de la novela
            for (const chapter of novel.chapters || []) {
                if (chapter.scenes && chapter.scenes.includes(scene.id)) {
                    novelTitle = novel.title || 'Sin título';
                    chapterTitle = chapter.title || 'Sin título';
                    break;
                }
            }
        }
    }

    // Generar el HTML
    return `
        <div class="scene-details">
            <h2>${scene.title || 'Escena sin título'}</h2>
            <p><strong>Novela:</strong> ${novelTitle}</p>
            <p><strong>Capítulo:</strong> ${chapterTitle}</p>
            <p><strong>Ambientación:</strong> ${scene.setting || 'No especificada'}</p>
            
            <div class="scene-content">
                <h3>Contenido</h3>
                <div class="scene-text">
                    ${scene.content ? scene.content.replace(/\n/g, '<br>') : 
                      scene.summary ? scene.summary : 'No hay contenido disponible para esta escena'}
                </div>
            </div>
            
            ${scene.characters && scene.characters.length > 0 ? `
                <div class="scene-characters">
                    <h3>Personajes presentes</h3>
                    <ul>
                        ${scene.characters.map(charId => {
                            const character = novelData.content.characters.find(c => c.id === charId);
                            return character ? 
                                `<li><strong>${character.name}</strong> - ${character.description || 'Sin descripción'}</li>` : 
                                `<li>Personaje ID: ${charId} (no encontrado)</li>`;
                        }).join('')}
                    </ul>
                </div>
            ` : ''}
        </div>
    `;
}

/**
 * Genera el contenido completo de una novela
 * @param {Object} novel - La novela a mostrar
 * @param {Object} novelData - Los datos completos del catálogo
 * @returns {string} HTML con el contenido
 */
export function generateNovelContent(novel, novelData) {
    if (!novel) return '<p>No hay contenido disponible.</p>';
    
    const chapters = novel.chapters || [];
    console.log("Generando contenido para todos los capítulos:", chapters);
    
    return `
        <div class="novel-introduction">
            <p>${novel.description || novel.summary || 'No hay descripción disponible.'}</p>
        </div>
        ${chapters.length > 0 ? chapters.map((chapter, index) => {
            console.log(`Generando contenido para capítulo:`, chapter);
            
            return `
                <div class="novel-chapter">
                    <h3>Capítulo ${index+1}: ${chapter.title || 'Sin título'}</h3>
                    <p class="chapter-description">${chapter.description || chapter.summary || 'Sin descripción'}</p>
                    ${generateChapterScenes(chapter, novelData)}
                </div>
            `;
        }).join('') : '<p>Esta novela no tiene capítulos todavía.</p>'}
    `;
}

/**
 * Genera el contenido de las escenas de un capítulo
 * @param {Object} chapter - El capítulo a mostrar
 * @param {Object} novelData - Los datos completos del catálogo
 * @returns {string} HTML con el contenido de las escenas
 */
export function generateChapterScenes(chapter, novelData) {
    if (!chapter || !chapter.scenes || chapter.scenes.length === 0) {
        return '<p>No hay escenas disponibles para este capítulo.</p>';
    }
    
    console.log(`Escenas en el capítulo:`, chapter.scenes);
    
    let scenesContent = '';
    
    chapter.scenes.forEach(sceneId => {
        console.log(`Buscando escena con ID: ${sceneId}`);
        
        const scene = novelData.content.scenes.find(s => s.id === sceneId);
        
        if (scene) {
            console.log(`Escena encontrada:`, scene);
              scenesContent += `
                <div class="novel-scene" data-scene-id="${scene.id}">
                    <h4>${scene.title || 'Escena sin título'}</h4>
                    <p class="scene-setting">${scene.setting || 'Ubicación no especificada'}</p>
                    <div class="scene-text">${(scene.content || scene.summary || 'No hay contenido disponible para esta escena.').replace(/\n/g, '<br>')}</div>
                </div>
            `;
        } else {
            scenesContent += `<p>Escena ${sceneId} no encontrada.</p>`;
        }
    });
    
    return scenesContent;
}

/**
 * Formatea una fecha en formato dd/mm/yyyy
 * @param {Date} date - La fecha a formatear
 * @returns {string} La fecha formateada
 */
function formatDate(date) {
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
}

/**
 * Muestra los detalles de un personaje
 * @param {Object} character - Datos del personaje
 * @param {Object} novelData - Datos completos del catálogo
 */
export function showCharacterDetails(character, novelData) {
    const modalContent = document.getElementById('modal-content');
    if (!modalContent) {
        console.error('No se encontró el elemento modal-content');
        return;
    }

    // Generar el HTML para los detalles del personaje
    modalContent.innerHTML = createCharacterDetails(character, novelData);

    // Mostrar el modal - Asegurarse de usar el ID correcto del modal
    const modal = document.getElementById('detail-modal');
    if (!modal) {
        console.error('No se encontró el elemento detail-modal');
        return;
    }
    
    modal.style.display = 'block';
}

/**
 * Muestra los detalles de una escena
 * @param {Object} scene - Datos de la escena
 * @param {Object} novelData - Datos completos del catálogo
 */
export function showSceneDetails(scene, novelData) {
    const modalContent = document.getElementById('modal-content');
    if (!modalContent) {
        console.error('No se encontró el elemento modal-content');
        return;
    }

    // Generar el HTML para los detalles de la escena
    modalContent.innerHTML = createSceneDetails(scene, novelData);

    // Mostrar el modal - Asegurarse de usar el ID correcto del modal
    const modal = document.getElementById('detail-modal');
    if (!modal) {
        console.error('No se encontró el elemento detail-modal');
        return;
    }
    
    modal.style.display = 'block';
}
