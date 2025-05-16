// Script para el catálogo de novelas de Aleph MCP
document.addEventListener('DOMContentLoaded', function() {
    // Variables globales
    let novelData = null;
    let currentView = 'novels';
    let lastUpdated = new Date();
    
    // Referencias a elementos del DOM
    const catalogGrid = document.getElementById('catalog-grid');
    const searchInput = document.getElementById('search-input');
    const toggleButtons = document.querySelectorAll('.toggle-btn');
    const serverStatusIndicator = document.getElementById('server-status-indicator');
    const serverStatusText = document.getElementById('server-status-text');
    const lastUpdatedText = document.getElementById('last-updated');
    const modal = document.getElementById('detail-modal');
    const modalContent = document.getElementById('modal-content');
    const closeModal = document.querySelector('.close-modal');
    
    // Función para formatear fecha
    function formatDate(date) {
        return date.toLocaleString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    }
    
    // Inicializar la última actualización
    lastUpdatedText.textContent = formatDate(lastUpdated);
    
    // Función para cargar los datos del servidor MCP
    async function fetchNovelData() {
        try {
            // Cambiar a estado "conectando"
            serverStatusIndicator.className = 'status-indicator connecting';
            serverStatusText.textContent = 'Conectando al servidor...';
            
            // Intentar cargar los datos desde el endpoint
            const response = await fetch('/api/novel-data.json');
            
            if (!response.ok) {
                throw new Error(`Error al cargar datos: ${response.status}`);
            }
            
            const data = await response.json();
            
            // Actualizar estado a "en línea"
            serverStatusIndicator.className = 'status-indicator online';
            serverStatusText.textContent = 'Servidor en línea';
            
            // Actualizar timestamp
            lastUpdated = new Date();
            lastUpdatedText.textContent = formatDate(lastUpdated);
            
            return data;
        } catch (error) {
            console.error('Error al cargar los datos:', error);
            
            // Si falla, intentar cargar datos de reserva locales
            try {
                const backupResponse = await fetch('../src/resources/novel-data.json');
                
                if (!backupResponse.ok) {
                    throw new Error('No se pudo cargar datos de reserva');
                }
                
                const backupData = await backupResponse.json();
                
                // Actualizar estado a "fuera de línea (datos locales)"
                serverStatusIndicator.className = 'status-indicator offline';
                serverStatusText.textContent = 'Servidor desconectado (usando datos locales)';
                
                return backupData;
            } catch (backupError) {
                console.error('Error al cargar datos de reserva:', backupError);
                
                // Ambos intentos fallaron, mostrar error
                serverStatusIndicator.className = 'status-indicator offline';
                serverStatusText.textContent = 'Error de conexión';
                
                // Si todo falla, usar datos de ejemplo mínimos
                return {
                    resources: {
                        novels: {},
                        characters: {},
                        scenes: {}
                    },
                    promptTemplates: []
                };
            }
        }
    }
    
    // Función para renderizar la cuadrícula según la vista actual
    function renderCatalog(searchTerm = '') {
        if (!novelData) return;
        
        // Limpiar cuadrícula
        catalogGrid.innerHTML = '';
        
        let items;
        let cardClass;
        
        // Determinar qué datos mostrar según la vista actual
        switch (currentView) {
            case 'novels':
                items = novelData.resources.novels;
                cardClass = 'novel-card';
                break;
            case 'characters':
                items = novelData.resources.characters;
                cardClass = 'character-card';
                break;
            case 'scenes':
                items = novelData.resources.scenes;
                cardClass = 'scene-card';
                break;
            default:
                items = novelData.resources.novels;
                cardClass = 'novel-card';
        }
        
        // Filtrar por término de búsqueda si existe
        const filteredItems = Object.values(items).filter(item => {
            const searchableText = JSON.stringify(item).toLowerCase();
            return searchableText.includes(searchTerm.toLowerCase());
        });
        
        // Generar tarjetas para cada elemento
        if (filteredItems.length > 0) {
            filteredItems.forEach(item => {
                const card = document.createElement('div');
                card.className = `catalog-card ${cardClass}`;
                card.dataset.id = item.id;
                card.dataset.type = currentView;
                
                // Determinar contenido según tipo
                let tags = [];
                let description = '';
                
                switch (currentView) {
                    case 'novels':
                        tags = item.genre || [];
                        description = item.summary || '';
                        break;
                    case 'characters':
                        tags = item.traits || [];
                        description = item.description || '';
                        break;
                    case 'scenes':
                        tags = item.characters?.map(charId => {
                            const character = novelData.resources.characters[charId];
                            return character ? character.name : '';
                        }).filter(Boolean) || [];
                        description = item.summary || '';
                        break;
                }
                
                card.innerHTML = `
                    <div class="card-image"></div>
                    <div class="card-content">
                        <h3 class="card-title">${item.name || item.title}</h3>
                        <div class="card-description">${description}</div>
                        <div class="card-tags">
                            ${tags.map(tag => `<span class="card-tag">${tag}</span>`).join('')}
                        </div>
                    </div>
                `;
                
                // Evento para abrir modal con detalles
                card.addEventListener('click', () => showDetails(item.id, currentView));
                
                catalogGrid.appendChild(card);
            });
        } else {
            // Mostrar mensaje si no hay resultados
            catalogGrid.innerHTML = `
                <div class="no-results">
                    <p>No se encontraron resultados para "${searchTerm}"</p>
                </div>
            `;
        }
    }
    
    // Función para mostrar detalles en modal
    function showDetails(id, type) {
        if (!novelData) return;
        
        let item;
        let detailContent = '';
        
        // Obtener el elemento según el tipo
        switch (type) {
            case 'novels':
                item = novelData.resources.novels[id];
                if (!item) return;
                
                const characters = item.characters?.map(charId => {
                    const character = novelData.resources.characters[charId];
                    return character ? {
                        id: charId,
                        name: character.name,
                        description: character.description.substring(0, 100) + '...'
                    } : null;
                }).filter(Boolean) || [];
                
                const scenes = item.chapters?.flatMap(chapId => {
                    const chapter = novelData.resources.chapters[chapId];
                    if (!chapter) return [];
                    
                    return chapter.scenes.map(sceneId => {
                        const scene = novelData.resources.scenes[sceneId];
                        return scene ? {
                            id: sceneId,
                            title: scene.title,
                            summary: scene.summary.substring(0, 100) + '...'
                        } : null;
                    }).filter(Boolean);
                }) || [];
                
                detailContent = `
                    <div class="detail-header">
                        <h2 class="detail-title">${item.title}</h2>
                        <div class="detail-subtitle">por ${item.author}</div>
                    </div>
                    <div class="detail-content">
                        <div class="detail-image" style="background-image: url('https://source.unsplash.com/random/600x800/?book,fantasy,${encodeURIComponent(item.title)}')"></div>
                        <div class="detail-info">
                            <div class="info-section">
                                <h3 class="info-title">Sinopsis</h3>
                                <p class="info-text">${item.summary}</p>
                                <div class="info-tags">
                                    ${item.genre?.map(tag => `<span class="info-tag">${tag}</span>`).join('') || ''}
                                </div>
                            </div>
                            <div class="info-section">
                                <h3 class="info-title">Personajes</h3>
                                ${characters.length > 0 ? `
                                    <div class="char-list">
                                        ${characters.map(char => `
                                            <div class="char-badge" data-id="${char.id}" data-type="characters">
                                                <span class="char-icon">👤</span>
                                                <span class="char-name">${char.name}</span>
                                            </div>
                                        `).join('')}
                                    </div>
                                ` : '<p>No hay personajes registrados</p>'}
                            </div>
                            <div class="info-section">
                                <h3 class="info-title">Ambientación</h3>
                                <p class="info-text">${item.setting || 'No especificada'}</p>
                            </div>
                            ${scenes.length > 0 ? `
                                <div class="info-section">
                                    <h3 class="info-title">Escenas</h3>
                                    <div class="scene-list">
                                        ${scenes.map(scene => `
                                            <div class="scene-badge" data-id="${scene.id}" data-type="scenes">
                                                <span class="scene-icon">📜</span>
                                                <span class="scene-name">${scene.title}</span>
                                            </div>
                                        `).join('')}
                                    </div>
                                </div>
                            ` : ''}
                        </div>
                    </div>
                `;
                break;
                
            case 'characters':
                item = novelData.resources.characters[id];
                if (!item) return;
                
                const novelsByCharacter = Object.values(novelData.resources.novels).filter(novel => 
                    novel.characters?.includes(id)
                ) || [];
                
                detailContent = `
                    <div class="detail-header">
                        <h2 class="detail-title">${item.name}</h2>
                        <div class="detail-subtitle">${item.description}</div>
                    </div>
                    <div class="detail-content">
                        <div class="detail-image" style="background-image: url('https://source.unsplash.com/random/600x800/?portrait,person,${encodeURIComponent(item.name)}')"></div>
                        <div class="detail-info">
                            <div class="info-section">
                                <h3 class="info-title">Rasgos</h3>
                                <div class="info-tags">
                                    ${item.traits?.map(trait => `<span class="info-tag">${trait}</span>`).join('') || '<p>No hay rasgos registrados</p>'}
                                </div>
                            </div>
                            <div class="info-section">
                                <h3 class="info-title">Historia</h3>
                                <p class="info-text">${item.backstory || 'No disponible'}</p>
                            </div>
                            ${novelsByCharacter.length > 0 ? `
                                <div class="info-section">
                                    <h3 class="info-title">Aparece en</h3>
                                    <div class="novel-list">
                                        ${novelsByCharacter.map(novel => `
                                            <div class="scene-badge" data-id="${novel.id}" data-type="novels">
                                                <span class="scene-icon">📕</span>
                                                <span class="scene-name">${novel.title}</span>
                                            </div>
                                        `).join('')}
                                    </div>
                                </div>
                            ` : ''}
                        </div>
                    </div>
                `;
                break;
                
            case 'scenes':
                item = novelData.resources.scenes[id];
                if (!item) return;
                
                const sceneCharacters = item.characters?.map(charId => {
                    const character = novelData.resources.characters[charId];
                    return character ? {
                        id: charId,
                        name: character.name
                    } : null;
                }).filter(Boolean) || [];
                
                detailContent = `
                    <div class="detail-header">
                        <h2 class="detail-title">${item.title}</h2>
                        <div class="detail-subtitle">${item.setting}</div>
                    </div>
                    <div class="detail-content">
                        <div class="detail-image" style="background-image: url('https://source.unsplash.com/random/600x800/?landscape,scene,${encodeURIComponent(item.setting)}')"></div>
                        <div class="detail-info">
                            <div class="info-section">
                                <h3 class="info-title">Resumen</h3>
                                <p class="info-text">${item.summary}</p>
                            </div>
                            <div class="info-section">
                                <h3 class="info-title">Personajes</h3>
                                ${sceneCharacters.length > 0 ? `
                                    <div class="char-list">
                                        ${sceneCharacters.map(char => `
                                            <div class="char-badge" data-id="${char.id}" data-type="characters">
                                                <span class="char-icon">👤</span>
                                                <span class="char-name">${char.name}</span>
                                            </div>
                                        `).join('')}
                                    </div>
                                ` : '<p>No hay personajes registrados</p>'}
                            </div>
                            <div class="info-section">
                                <h3 class="info-title">Contenido</h3>
                                <div class="novel-content">${item.content || 'No disponible'}</div>
                            </div>
                        </div>
                    </div>
                `;
                break;
                
            default:
                detailContent = '<p>No se encontraron detalles</p>';
        }
        
        // Configurar modal
        modalContent.innerHTML = detailContent;
        modal.style.display = 'block';
        
        // Agregar eventos a los badges de personajes y escenas en el modal
        document.querySelectorAll('.char-badge, .scene-badge').forEach(badge => {
            badge.addEventListener('click', function(e) {
                e.stopPropagation();
                const badgeId = this.dataset.id;
                const badgeType = this.dataset.type;
                closeModalHandler();
                showDetails(badgeId, badgeType);
            });
        });
    }
    
    // Manejadores de eventos
    
    // Cambiar vista al hacer clic en los botones de toggle
    toggleButtons.forEach(button => {
        button.addEventListener('click', function() {
            const view = this.dataset.view;
            
            if (view === currentView) return;
            
            toggleButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            currentView = view;
            renderCatalog(searchInput.value);
        });
    });
    
    // Búsqueda en tiempo real
    searchInput.addEventListener('input', function() {
        renderCatalog(this.value);
    });
    
    // Cerrar modal
    function closeModalHandler() {
        modal.style.display = 'none';
    }
    
    closeModal.addEventListener('click', closeModalHandler);
    
    window.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModalHandler();
        }
    });
    
    // Escapar para cerrar modal
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.style.display === 'block') {
            closeModalHandler();
        }
    });
    
    // Inicialización
    async function init() {
        novelData = await fetchNovelData();
        renderCatalog();
    }
    
    // Iniciar la aplicación
    init();
    
    // Actualizar datos cada 5 minutos
    setInterval(async function() {
        novelData = await fetchNovelData();
        renderCatalog(searchInput.value);
    }, 5 * 60 * 1000);
    
    // Nueva función renderView
    function renderView() {
        if (!novelData) {
            console.error("novelData es null o undefined");
            catalogGrid.innerHTML = `
                <div class="error-container">
                    <div class="error-icon">⚠️</div>
                    <div class="error-message">No se pudieron cargar los datos (novelData es null)</div>
                    <button class="retry-button" onclick="location.reload()">Reintentar</button>
                </div>
            `;
            return;
        }
        
        console.log("Datos cargados:", novelData);
        
        let items = [];
        let template = '';
        
        // Depuración: mostrar qué propiedades están disponibles
        console.log("Propiedades en novelData:", Object.keys(novelData));
        
        // Filtrar por término de búsqueda
        const filterItems = (items) => {
            if (!searchTerm) return items;
            if (!items || !Array.isArray(items)) {
                console.error("Items no es un array:", items);
                return [];
            }
            return items.filter(item => 
                (item.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                 item.description?.toLowerCase().includes(searchTerm.toLowerCase()))
            );
        };
        
        // Determinar qué datos mostrar según la vista actual
        switch (currentView) {
            case 'novels':
                if (!novelData.novels || !Array.isArray(novelData.novels)) {
                    console.error("novelData.novels no es un array:", novelData.novels);
                    items = [];
                } else {
                    items = filterItems(novelData.novels);
                }
                template = createNovelCard;
                break;
            case 'characters':
                if (!novelData.characters || !Array.isArray(novelData.characters)) {
                    console.error("novelData.characters no es un array:", novelData.characters);
                    items = [];
                } else {
                    items = filterItems(novelData.characters);
                }
                template = createCharacterCard;
                break;
            case 'scenes':
                if (!novelData.scenes || !Array.isArray(novelData.scenes)) {
                    console.error("novelData.scenes no es un array:", novelData.scenes);
                    items = [];
                } else {
                    items = filterItems(novelData.scenes);
                }
                template = createSceneCard;
                break;
        }
        
        console.log(`Vista actual: ${currentView}, Número de items: ${items.length}`);
        
        // Renderizar los items
        if (items.length === 0) {
            catalogGrid.innerHTML = `
                <div class="no-results">
                    <div class="no-results-icon">🔎</div>
                    <div class="no-results-text">No se encontraron resultados para "${searchTerm}"</div>
                </div>
            `;
        } else {
            try {
                catalogGrid.innerHTML = items.map(template).join('');
                
                // Añadir event listeners a las tarjetas
                document.querySelectorAll('.catalog-card').forEach(card => {
                    card.addEventListener('click', (e) => {
                        const id = e.currentTarget.dataset.id;
                        const type = e.currentTarget.dataset.type;
                        showDetails(id, type);
                    });
                });
            } catch (error) {
                console.error("Error al renderizar los items:", error);
                catalogGrid.innerHTML = `
                    <div class="error-container">
                        <div class="error-icon">⚠️</div>
                        <div class="error-message">Error al renderizar: ${error.message}</div>
                    </div>
                `;
            }
        }
    }
});
