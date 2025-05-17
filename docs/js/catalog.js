/**
 * catalog.js - Maneja la funcionalidad del catálogo de novelas
 */

// Estado de la aplicación
let novelData = null;
let currentView = CONSTANTS.TYPES.NOVEL;
let searchTerm = '';

// Referencias a elementos del DOM
const catalogGrid = document.getElementById('catalog-grid');
const serverStatusIndicator = document.getElementById('server-status-indicator');
const serverStatusText = document.getElementById('server-status-text');
const lastUpdatedElement = document.getElementById('last-updated');
const searchInput = document.getElementById('search-input');
const modal = document.getElementById('detail-modal');
const modalContent = document.getElementById('modal-content');
const closeModal = document.querySelector('.close-modal');
const viewToggleBtns = document.querySelectorAll('.toggle-btn');

/**
 * Carga los datos de novelas desde la API
 */
async function loadNovelData() {
    try {
        console.log("Intentando cargar datos desde:", CONSTANTS.API.NOVEL_DATA);
        const response = await fetch(CONSTANTS.API.NOVEL_DATA);
        
        if (!response.ok) {
            console.error('Error de respuesta:', response.status, response.statusText);
            throw new Error(`No se pudieron cargar los datos. Estado: ${response.status}`);
        }
        
        // Obtener el texto de la respuesta para depuración
        const responseText = await response.text();
        console.log("Texto de respuesta:", responseText.substring(0, 100) + "...");
        
        try {
            // Intentar analizar el texto como JSON
            novelData = JSON.parse(responseText);
            console.log("Datos JSON cargados correctamente:", novelData);
        } catch (jsonError) {
            console.error("Error al analizar JSON:", jsonError);
            throw new Error(`Error al analizar JSON: ${jsonError.message}`);
        }
        
        // Actualizar la fecha de última actualización
        const timestamp = new Date();
        lastUpdatedElement.textContent = timestamp.toLocaleString();            // Actualizar el estado del servidor
            serverStatusIndicator.classList.remove('offline');
            serverStatusIndicator.classList.add('online');
            serverStatusText.textContent = 'Servidor MCP ' + CONSTANTS.SERVER_STATUS.CONNECTED;
            
            // Renderizar la vista actual
            renderView();
        } catch (error) {
            console.error('Error al cargar los datos:', error);
            catalogGrid.innerHTML = `
                <div class="error-container">
                    <div class="error-icon">⚠️</div>
                    <div class="error-message">No se pudieron cargar los datos del servidor: ${error.message}</div>
                    <button class="retry-button" onclick="location.reload()">Reintentar</button>
                </div>
            `;
            serverStatusIndicator.classList.remove('online');
            serverStatusIndicator.classList.add('offline');
            serverStatusText.textContent = 'Servidor MCP ' + CONSTANTS.SERVER_STATUS.DISCONNECTED;
    }
}

/**
 * Renderiza la vista actual del catálogo
 */
function renderView() {
    if (!novelData) return;
    
    let items = [];
    let template = '';
    
    // Filtrar por término de búsqueda
    const filterItems = (items) => {
        if (!searchTerm) return items;
        return items.filter(item => 
            item.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
            item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.title?.toLowerCase().includes(searchTerm.toLowerCase())
        );
    };        
        // Determinar qué datos mostrar según la vista actual
        switch (currentView) {
            case 'novels':
                items = filterItems(novelData.novels || []);
                template = createNovelCard;
                break;
            case 'characters':
                items = filterItems(novelData.characters || []);
                template = createCharacterCard;
                break;
            case 'scenes':
                items = filterItems(novelData.scenes || []);
                template = createSceneCard;
                break;
    }
    
    // Renderizar los items
    if (items.length === 0) {
        catalogGrid.innerHTML = `
            <div class="no-results">
                <div class="no-results-icon">🔎</div>
                <div class="no-results-text">No se encontraron resultados para "${searchTerm}"</div>
            </div>
        `;
    } else {
        catalogGrid.innerHTML = items.map(template).join('');
        
        // Añadir event listeners a las tarjetas
        document.querySelectorAll('.catalog-card').forEach(card => {
            card.addEventListener('click', (e) => {
                const id = e.currentTarget.dataset.id;
                const type = e.currentTarget.dataset.type;
                showDetails(id, type);
            });
        });
    }
}

/**
 * Templates para las tarjetas
 */    
    function createNovelCard(novel) {
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
}    function createCharacterCard(character) {
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

    function createSceneCard(scene) {
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
 * Muestra los detalles de un item en el modal
 */
function showDetails(id, type) {
    let item = null;
    let detailsHTML = '';
    
    // Encontrar el item correspondiente
    switch (type) {
        case 'novel':
            item = novelData.novels.find(n => n.id === id);
            if (item) {
                detailsHTML = createNovelDetails(item);
            }
            break;
            
        case 'character':
            item = novelData.characters.find(c => c.id === id);
            if (item) {
                detailsHTML = createCharacterDetails(item);
            }
            break;
            
        case 'scene':
            item = novelData.scenes.find(s => s.id === id);
            if (item) {
                detailsHTML = createSceneDetails(item);
            }
            break;
    }
    
    // Mostrar el modal con los detalles
    if (detailsHTML) {
        modalContent.innerHTML = detailsHTML;
        modal.style.display = 'block';
        
        // Añadir event listeners a los elementos interactivos dentro del modal
        modalContent.querySelectorAll('[data-id]').forEach(el => {
            el.addEventListener('click', (e) => {
                e.preventDefault();
                const newId = e.currentTarget.dataset.id;
                const newType = e.currentTarget.dataset.type;
                showDetails(newId, newType);
            });
        });
        
        // Event listeners para el acordeón de capítulos
        modalContent.querySelectorAll('.chapter-header').forEach(header => {
            header.addEventListener('click', (e) => {
                const chapterItem = e.currentTarget.parentElement;
                const chapterContent = chapterItem.querySelector('.chapter-content');
                const toggle = e.currentTarget.querySelector('.chapter-toggle');
                
                if (chapterContent.style.maxHeight) {
                    chapterContent.style.maxHeight = null;
                    toggle.textContent = '+';
                } else {
                    chapterContent.style.maxHeight = chapterContent.scrollHeight + 'px';
                    toggle.textContent = '−';
                }
            });
        });
        
        // Configurar el modo de lectura para novelas
        if (type === 'novel') {
            setupReadingMode(item);
        }
    }
}

/**
 * Crea el HTML para los detalles de una novela
 */
function createNovelDetails(novel) {
    // Verificar si chapters existe y es un array, si no, usar un array vacío
    const chapters = novel.chapters || [];
    
    return `
        <div class="detail-header">
            <h2>${novel.title || novel.name}</h2>
            <div class="detail-meta">
                <span class="detail-badge">${novel.genre || 'Sin género'}</span>
                <span class="detail-date">Creada: ${new Date().toLocaleDateString()}</span>
            </div>
        </div>
        <div class="detail-section">
            <h3>Descripción</h3>
            <p>${novel.description || 'Sin descripción disponible'}</p>
        </div>
        <div class="detail-section">
            <h3>Personajes</h3>
            <div class="detail-characters">
                ${(novel.characters || []).map(charId => {
                    const char = novelData.characters.find(c => c.id === charId);
                    return char ? `
                        <div class="detail-character-card" data-id="${char.id}" data-type="character">
                            <h4>${char.name}</h4>
                            <p>${char.description ? char.description.substring(0, 100) + '...' : 'Sin descripción'}</p>
                        </div>
                    ` : '';
                }).join('')}
            </div>
        </div>
        <div class="detail-section">
            <h3>Capítulos</h3>
            <div class="chapters-accordion">
                ${chapters.map(chapter => {
                    return `
                        <div class="chapter-item">
                            <div class="chapter-header">
                                <h4>${chapter.title || 'Sin título'}</h4>
                                <span class="chapter-toggle">+</span>
                            </div>
                            <div class="chapter-content">
                                <p>${chapter.description || 'Sin descripción'}</p>
                                <h5>Escenas:</h5>
                                <ul class="scene-list">
                                    ${(chapter.scenes || []).map(sceneId => {
                                        const scene = novelData.scenes.find(s => s.id === sceneId);
                                        return scene ? `
                                            <li>
                                                <a href="#" class="scene-link" data-id="${scene.id}" data-type="scene">
                                                    ${scene.title || 'Escena sin título'}
                                                </a>
                                            </li>
                                        ` : '';
                                    }).join('')}
                                </ul>
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        </div>
        <div class="detail-section reading-section">
            <h3>Leer Novela</h3>
            <div class="reading-controls">
                <button id="toggle-reading-mode" class="reading-button">
                    <span class="icon">📖</span> Modo Lectura
                </button>
                <select id="chapter-selector" class="chapter-selector">
                    <option value="all">Novela Completa</option>
                    ${chapters.map((chapter, index) => 
                        `<option value="${index}">Capítulo ${index+1}: ${chapter.title || 'Sin título'}</option>`
                    ).join('')}
                </select>
            </div>
            <div id="reading-container" class="reading-container">
                <div class="reading-header">
                    <h2>${novel.title || novel.name}</h2>
                    <p class="reading-meta">Género: ${novel.genre || 'Sin categoría'}</p>
                </div>
                <div id="reading-content" class="reading-content">
                    ${generateNovelContent(novel)}
                </div>
            </div>
        </div>
    `;
}

/**
 * Crea el HTML para los detalles de un personaje
 */
function createCharacterDetails(character) {
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
            <p>${character.background || 'Sin información de trasfondo'}</p>
        </div>
        <div class="detail-section">
            <h3>Aparece en</h3>
            <div class="appears-in-list">
                ${(novelData.novels || [])
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
 */
function createSceneDetails(scene) {
    return `
        <div class="detail-header">
            <h2>${scene.title || 'Escena sin título'}</h2>
            <div class="detail-meta">
                <span class="detail-badge">Escena</span>
            </div>
        </div>
        <div class="detail-section">
            <h3>Ambientación</h3>
            <p>${scene.setting || 'Sin ambientación definida'}</p>
        </div>
        <div class="detail-section">
            <h3>Personajes presentes</h3>
            <div class="present-characters">
                ${(scene.characters || []).map(charId => {
                    const char = novelData.characters.find(c => c.id === charId);
                    return char ? `
                        <span class="character-badge" data-id="${char.id}" data-type="character">
                            ${char.name}
                        </span>
                    ` : '';
                }).join('') || '<p>No hay personajes en esta escena</p>'}
            </div>
        </div>
        <div class="detail-section">
            <h3>Contenido</h3>
            <div class="scene-content">${(scene.content || 'Sin contenido').replace(/\n/g, '<br>')}</div>
        </div>
    `;
}

/**
 * Configura el modo de lectura para novelas
 */
function setupReadingMode(novel) {
    const toggleReadingBtn = document.getElementById('toggle-reading-mode');
    const chapterSelector = document.getElementById('chapter-selector');
    
    if (toggleReadingBtn) {
        toggleReadingBtn.addEventListener('click', () => {
            document.body.classList.toggle('reading-mode');
            
            if (document.body.classList.contains('reading-mode')) {
                toggleReadingBtn.innerHTML = '<span class="icon">🔍</span> Modo Normal';
            } else {
                toggleReadingBtn.innerHTML = '<span class="icon">📖</span> Modo Lectura';
            }
        });
    }
    
    if (chapterSelector) {
        chapterSelector.addEventListener('change', (e) => {
            const selectedValue = e.target.value;
            const readingContent = document.getElementById('reading-content');
            
            if (selectedValue === 'all') {
                readingContent.innerHTML = generateNovelContent(novel);
            } else {
                const chapterIndex = parseInt(selectedValue);
                const chapter = novel.chapters[chapterIndex];
                readingContent.innerHTML = generateChapterContent(chapter, novelData);
            }
        });
    }
}

/**
 * Genera el contenido completo de una novela
 */
function generateNovelContent(novel) {
    if (!novel) return '<p>No hay contenido disponible.</p>';
    
    const chapters = novel.chapters || [];
    
    return `
        <div class="novel-introduction">
            <p>${novel.description || 'No hay descripción disponible.'}</p>
        </div>
        ${chapters.length > 0 ? chapters.map((chapter, index) => `
            <div class="novel-chapter">
                <h3>Capítulo ${index+1}: ${chapter.title || 'Sin título'}</h3>
                <p class="chapter-description">${chapter.description || 'Sin descripción'}</p>
                ${generateChapterContent(chapter, novelData)}
            </div>
        `).join('') : '<p>Esta novela no tiene capítulos todavía.</p>'}
    `;
}

/**
 * Genera el contenido de un capítulo específico
 */
function generateChapterContent(chapter, novelData) {
    if (!chapter || !chapter.scenes || !chapter.scenes.length) 
        return '<p>No hay escenas disponibles para este capítulo.</p>';
    
    return `
        ${chapter.scenes.map(sceneId => {
            const scene = novelData.scenes.find(s => s.id === sceneId);
            
            if (!scene) return '<p>Escena no encontrada.</p>';
            
            return `
                <div class="novel-scene">
                    <h4>${scene.title || 'Escena sin título'}</h4>
                    <p class="scene-setting">${scene.setting || 'Sin ambientación definida'}</p>
                    <div class="scene-text">${
                        scene.content ? 
                        scene.content.replace(/\n/g, '<br>') : 
                        'No hay contenido disponible para esta escena.'
                    }</div>
                </div>
            `;
        }).join('')}
    `;
}

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    // Event listeners
    
    // Cambiar vista
    viewToggleBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            viewToggleBtns.forEach(b => b.classList.remove('active'));
            e.currentTarget.classList.add('active');
            currentView = e.currentTarget.dataset.view;
            renderView();
        });
    });
    
    // Búsqueda
    searchInput.addEventListener('input', (e) => {
        searchTerm = e.target.value.trim();
        renderView();
    });
    
    // Cerrar modal
    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
        // Quitar el modo de lectura si está activo
        document.body.classList.remove('reading-mode');
    });
    
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
            // Quitar el modo de lectura si está activo
            document.body.classList.remove('reading-mode');
        }
    });
      // Iniciar la carga de datos
    loadNovelData();
    
    // Comprobar actualizaciones periódicamente
    setInterval(loadNovelData, CONSTANTS.INTERVALS.REFRESH_DATA);
});
