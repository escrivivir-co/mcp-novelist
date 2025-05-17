/**
 * templates.js - Módulo para las plantillas de visualización
 */

import { CONSTANTS } from './constants.js';

/**
 * Crea el HTML para una tarjeta de novela
 * @param {Object} novel - La novela a mostrar
 * @returns {string} HTML de la tarjeta
 */
export function createNovelCard(novel) {
    // Añadir verificación de propiedades
    const description = novel.description || novel.summary || '';
    const characterCount = novel.characters ? novel.characters.length : 0;
    const chapterCount = novel.chapters ? novel.chapters.length : 0;
    
    return `
        <div class="catalog-card" data-id="${novel.id}" data-type="${CONSTANTS.TYPES.NOVEL}">
            <div class="card-header">
                <h3>${novel.name || novel.title || 'Sin título'}</h3>
                <span class="card-badge">${novel.genre || 'General'}</span>
            </div>
            <div class="card-body">
                <p>${truncateText(description, CONSTANTS.UI.MAX_EXCERPT_LENGTH)}</p>
            </div>
            <div class="card-footer">
                <span class="card-meta">${chapterCount} capítulos</span>
                <span class="card-meta">${characterCount} personajes</span>
            </div>
        </div>
    `;
}

/**
 * Crea el HTML para una tarjeta de personaje
 * @param {Object} character - El personaje a mostrar
 * @returns {string} HTML de la tarjeta
 */
export function createCharacterCard(character) {
    // Verificar que character.traits sea un array
    const traits = Array.isArray(character.traits) ? character.traits : [];
    const description = character.description || 'Sin descripción disponible';
    
    return `
        <div class="catalog-card" data-id="${character.id}" data-type="${CONSTANTS.TYPES.CHARACTER}">
            <div class="card-header">
                <h3>${character.name}</h3>
                <span class="card-badge">${character.role || 'Personaje'}</span>
            </div>
            <div class="card-body">
                <p>${truncateText(description, CONSTANTS.UI.MAX_EXCERPT_LENGTH)}</p>
            </div>
            <div class="card-footer">
                <span class="card-meta">${traits.join(', ') || 'Sin rasgos'}</span>
            </div>
        </div>
    `;
}

/**
 * Crea el HTML para una tarjeta de escena
 * @param {Object} scene - La escena a mostrar
 * @returns {string} HTML de la tarjeta
 */
export function createSceneCard(scene) {
    const title = scene.title || 'Escena sin título';
    const setting = scene.setting || 'Sin ambientación';
    const content = scene.content || 'Sin contenido';
    const characters = Array.isArray(scene.characters) ? scene.characters : [];
    
    return `
        <div class="catalog-card" data-id="${scene.id}" data-type="${CONSTANTS.TYPES.SCENE}">
            <div class="card-header">
                <h3>${title}</h3>
                <span class="card-badge">Escena</span>
            </div>
            <div class="card-body">
                <p>${setting}</p>
                <p>${truncateText(content, CONSTANTS.UI.MAX_EXCERPT_LENGTH / 2)}</p>
            </div>
            <div class="card-footer">
                <span class="card-meta">${characters.length} personajes</span>
            </div>
        </div>
    `;
}

/**
 * Trunca un texto a una longitud máxima
 * @param {string} text - El texto a truncar
 * @param {number} maxLength - La longitud máxima
 * @returns {string} El texto truncado
 */
export function truncateText(text, maxLength) {
    if (typeof text !== 'string') return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
}
