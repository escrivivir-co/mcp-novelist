/**
 * readingMode.js - Módulo para la funcionalidad del modo de lectura
 */

import { CONSTANTS } from './constants.js';
import { generateNovelContent } from './detailsRenderer.js';

/**
 * Configura el modo de lectura para novelas
 * @param {Object} novel - La novela a mostrar
 * @param {Object} novelData - Los datos completos del catálogo
 */
export function setupReadingMode(novel, novelData) {
    const toggleReadingBtn = document.getElementById('toggle-reading-mode');
    const chapterSelector = document.getElementById('chapter-selector');
    const readingContent = document.getElementById('reading-content');
    
    if (!toggleReadingBtn || !chapterSelector || !readingContent) {
        console.warn('Elementos de modo lectura no encontrados');
        return;
    }
    
    // Event listener para cambiar entre modo lectura y normal
    toggleReadingBtn.addEventListener('click', () => {
        document.body.classList.toggle('reading-mode');
        
        if (document.body.classList.contains('reading-mode')) {
            toggleReadingBtn.innerHTML = '<span class="icon">🔍</span> Modo Normal';
            readingContent.style.display = 'block';
        } else {
            toggleReadingBtn.innerHTML = '<span class="icon">📖</span> Modo Lectura';
            readingContent.style.display = 'none';
        }
    });
    
    // Event listener para cambiar el capítulo seleccionado
    chapterSelector.addEventListener('change', (e) => {
        const selectedValue = e.target.value;
        
        if (selectedValue === 'all') {
            readingContent.innerHTML = generateNovelContent(novel, novelData);
        } else {
            const chapterIndex = parseInt(selectedValue);
            if (novel.chapters && novel.chapters[chapterIndex]) {
                const chapter = novel.chapters[chapterIndex];
                readingContent.innerHTML = generateChapterContent(chapter, novelData);
            }
        }
    });
}

/**
 * Genera el contenido de un capítulo específico
 * @param {Object} chapter - El capítulo a mostrar
 * @param {Object} novelData - Los datos completos del catálogo
 * @returns {string} HTML con el contenido del capítulo
 */
function generateChapterContent(chapter, novelData) {
    console.log('Generando contenido para capítulo:', chapter);
    
    if (!chapter || !chapter.scenes || !chapter.scenes.length) {
        console.log('No hay escenas disponibles para este capítulo');
        return '<p>No hay escenas disponibles para este capítulo.</p>';
    }
    
    console.log('Escenas en el capítulo:', chapter.scenes);
    
    let scenesContent = '';
    
    chapter.scenes.forEach(sceneId => {
        console.log(`Buscando escena con ID: ${sceneId}`);
        const scene = novelData.content.scenes.find(s => s.id === sceneId);
        
        if (scene) {
            console.log(`Escena encontrada:`, scene);
              scenesContent += `
                <div class="novel-scene">
                    <h4>${scene.title || 'Escena sin título'}</h4>                    ${scene.setting ? `<p class="scene-setting">${scene.setting}</p>` : ''}
                    <div class="scene-text">${(scene.content || scene.summary || 'No hay contenido disponible.').replace(/\n/g, '<br>')}</div>
                </div>
            `;
        } else {
            scenesContent += `<p>Escena ${sceneId} no encontrada.</p>`;
        }
    });
    
    return scenesContent;
}
