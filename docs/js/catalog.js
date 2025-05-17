/**
 * Archivo principal del catálogo - Coordina los módulos
 * 
 * Este archivo sirve como punto de entrada y coordina la funcionalidad
 * de todos los módulos del catálogo de novelas.
 */

import { loadNovelData } from './modules/api.js';
import { createNovelCard } from './modules/templates.js';
import { createNovelDetails } from './modules/detailsRenderer.js';
import { setupReadingMode } from './modules/readingMode.js';
import { CONSTANTS } from './modules/constants.js';

// Variable global para almacenar los datos de las novelas
let novelData = null;

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
        novelData = await loadNovelData();
        
        // Mostrar novelas en el catálogo
        displayNovels();
        
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
    if (novelData && novelData.novels) {
        novelData.novels.forEach(novel => {
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
}

/**
 * Maneja los clicks en el catálogo
 */
function handleCatalogClick(event) {
    const novelCard = event.target.closest('.catalog-card');
    if (!novelCard) return;
    
    const novelId = novelCard.dataset.id;
    if (!novelId) return;
    
    // Buscar la novela por ID
    const novel = novelData.novels.find(n => n.id === novelId);
    if (!novel) {
        console.error(`No se encontró la novela con ID: ${novelId}`);
        return;
    }
    
    // Mostrar detalles de la novela
    showNovelDetails(novel);
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

// Exportar funciones y datos para uso en otros scripts
export { novelData, showNovelDetails, closeModal };