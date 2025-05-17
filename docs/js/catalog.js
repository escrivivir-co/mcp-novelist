/**
 * Archivo principal del catálogo - Coordina los módulos
 * 
 * Este archivo sirve como punto de entrada y coordina la funcionalidad
 * de todos los módulos del catálogo de novelas.
 */

import { loadNovelData } from './modules/api.js';
import { createNovelCard, createCharacterCard, createSceneCard } from './modules/templates.js';
import { createNovelDetails, showCharacterDetails, showSceneDetails } from './modules/detailsRenderer.js';
import { setupReadingMode } from './modules/readingMode.js';
import { CONSTANTS } from './modules/constants.js';

export const novelData = {
    content: {}
}; // Almacena los datos de las novelas

// Inicializar el catálogo cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', () => {
    initCatalog();
});

/**
 * Inicializa el catálogo de novelas
 */
async function initCatalog() {
    try {
        // Cargar datos
        novelData.content = await loadNovelData();
        
        // Mostrar novelas en el catálogo (vista por defecto)
        displayCatalogItems('novels');
        
        // Configurar listeners para eventos
        setupEventListeners();
        
        console.log('Catálogo inicializado correctamente');
    } catch (error) {
        console.error('Error al inicializar el catálogo:', error);
        document.getElementById('catalog-container').innerHTML = 
            `<div class="error-message">Error al cargar el catálogo: ${error.message}</div>`;
    }
}

/**
 * Muestra las novelas en el catálogo
 */
function displayNovels() {
    const catalogContainer = document.getElementById('catalog-grid');
    if (!catalogContainer) {
        console.warn('No se encontró el contenedor del catálogo');
        return;
    }
    
    catalogContainer.innerHTML = '';
      // Mostrar cada novela
    if (novelData && novelData.content.novels) {
        novelData.content.novels.forEach(novel => {
            const cardHTML = createNovelCard(novel);
            // Convertir string HTML a elemento DOM
            const tempContainer = document.createElement('div');
            tempContainer.innerHTML = cardHTML.trim();
            const cardElement = tempContainer.firstChild;
            catalogContainer.appendChild(cardElement);
        });
    } else {
        catalogContainer.innerHTML = '<p>No hay novelas disponibles</p>';
    }
}

/**
 * Configura los listeners para eventos
 */
function setupEventListeners() {
    // Listener para clicks en el catálogo
    document.getElementById('catalog-grid')?.addEventListener('click', handleCatalogClick);
    
    // Listener para cerrar el modal
    document.querySelector('.close-modal')?.addEventListener('click', closeModal);
    
    // Listener para los botones de cambio de vista
    const viewToggleButtons = document.querySelectorAll('.view-toggle .toggle-btn');
    viewToggleButtons.forEach(button => {
        button.addEventListener('click', handleViewToggle);
    });
}

/**
 * Maneja los clicks en el catálogo
 */
function handleCatalogClick(event) {
    const card = event.target.closest('.catalog-card');
    if (!card) return;
    
    const itemId = card.dataset.id;
    const itemType = card.dataset.type;
    
    if (!itemId || !itemType) return;
    
    // Buscar el elemento según su tipo
    let item = null;
    
    switch (itemType) {
        case CONSTANTS.TYPES.NOVEL:
            item = novelData.content.novels.find(n => n.id === itemId);
            break;
        case CONSTANTS.TYPES.CHARACTER:
            item = novelData.content.characters.find(c => c.id === itemId);
            break;
        case CONSTANTS.TYPES.SCENE:
            item = novelData.content.scenes.find(s => s.id === itemId);
            break;
    }
    
    if (!item) {
        console.error(`No se encontró el elemento con ID: ${itemId} (tipo: ${itemType})`);
        return;
    }
    
    // Mostrar detalles según el tipo
    switch (itemType) {
        case CONSTANTS.TYPES.NOVEL:
            showNovelDetails(item);
            break;
        case CONSTANTS.TYPES.CHARACTER:
            showCharacterDetails(item);
            break;
        case CONSTANTS.TYPES.SCENE:
            showSceneDetails(item);
            break;
    }
}

/**
 * Muestra los detalles de una novela
 */
function showNovelDetails(novel) {
    const modalContent = document.getElementById('modal-content');
    if (!modalContent) return;
    
    modalContent.innerHTML = createNovelDetails(novel, novelData);
    
    // Configurar modo de lectura
    setupReadingMode(novel, novelData);
    
    // Mostrar modal
    document.getElementById('detail-modal').style.display = 'block';
    
    // Añadir listener para acordeón de capítulos
    setupChapterAccordion();
}

/**
 * Configura el acordeón de capítulos
 */
function setupChapterAccordion() {
    const chapterHeaders = document.querySelectorAll('.chapter-header');
    chapterHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const content = header.nextElementSibling;
            const toggle = header.querySelector('.chapter-toggle');
            
            if (content.style.maxHeight !== '0px') {
                content.style.maxHeight = '0px';
                toggle.textContent = '+';
            } else {
                content.style.maxHeight = content.scrollHeight + 'px';
                toggle.textContent = '−';
            }
        });
    });
}

/**
 * Cierra el modal de detalles
 */
function closeModal() {
    document.getElementById('detail-modal').style.display = 'none';
}

/**
 * Maneja el cambio entre diferentes vistas (novelas, personajes, escenas)
 */
function handleViewToggle(event) {
    // Obtener el botón clickeado
    const clickedButton = event.target;
    if (!clickedButton || !clickedButton.dataset.view) return;
    
    // Actualizar estado activo de los botones
    const allButtons = document.querySelectorAll('.view-toggle .toggle-btn');
    allButtons.forEach(btn => btn.classList.remove('active'));
    clickedButton.classList.add('active');
    
    // Obtener el tipo de vista seleccionada
    const viewType = clickedButton.dataset.view;
    
    // Mostrar los elementos según la vista seleccionada
    displayCatalogItems(viewType);
}

/**
 * Muestra los elementos del catálogo según el tipo de vista seleccionada
 */
function displayCatalogItems(viewType) {
    const catalogContainer = document.getElementById('catalog-grid');
    if (!catalogContainer || !novelData) return;
    
    catalogContainer.innerHTML = '';
    
    // Mostrar elementos según el tipo seleccionado
    switch(viewType) {
        case 'novels':
            if (novelData.content.novels && novelData.content.novels.length > 0) {
                novelData.content.novels.forEach(novel => {
                    const cardHTML = createNovelCard(novel);
                    const tempContainer = document.createElement('div');
                    tempContainer.innerHTML = cardHTML.trim();
                    catalogContainer.appendChild(tempContainer.firstChild);
                });
            } else {
                catalogContainer.innerHTML = '<p>No hay novelas disponibles</p>';
            }
            break;
            
        case 'characters':
            if (novelData.content.characters && novelData.content.characters.length > 0) {
                novelData.content.characters.forEach(character => {
                    const cardHTML = createCharacterCard(character);
                    const tempContainer = document.createElement('div');
                    tempContainer.innerHTML = cardHTML.trim();
                    catalogContainer.appendChild(tempContainer.firstChild);
                });
            } else {
                catalogContainer.innerHTML = '<p>No hay personajes disponibles</p>';
            }
            break;
            
        case 'scenes':
            if (novelData.content.scenes && novelData.content.scenes.length > 0) {
                novelData.content.scenes.forEach(scene => {
                    const cardHTML = createSceneCard(scene);
                    const tempContainer = document.createElement('div');
                    tempContainer.innerHTML = cardHTML.trim();
                    catalogContainer.appendChild(tempContainer.firstChild);
                });
            } else {
                catalogContainer.innerHTML = '<p>No hay escenas disponibles</p>';
            }
            break;
            
        default:
            console.warn(`Tipo de vista no reconocido: ${viewType}`);
            break;
    }
}

// Exportar funciones y datos para uso en otros scripts
export { showNovelDetails, closeModal };