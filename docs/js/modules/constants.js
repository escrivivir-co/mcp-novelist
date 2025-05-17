/**
 * constants.js - Constantes compartidas entre los diferentes archivos (versión ES Module)
 */

export const CONSTANTS = {
    // Rutas
    API: {
        NOVEL_DATA: './api/novel-data.json'
    },
    
    // Intervalos (en milisegundos)
    INTERVALS: {
        REFRESH_DATA: 5 * 60 * 1000, // 5 minutos
        AUTO_SAVE: 2 * 60 * 1000 // 2 minutos
    },
    
    // Configuración de UI
    UI: {
        ANIMATION_DURATION: 300, // ms
        TYPING_SPEED: 50, // ms por caracter
        MAX_EXCERPT_LENGTH: 150 // caracteres para extractos
    },
    
    // Tipos de elementos
    TYPES: {
        NOVEL: 'novel',
        CHARACTER: 'character',
        SCENE: 'scene',
        CHAPTER: 'chapter'
    },
    
    // Claves para localStorage
    STORAGE_KEYS: {
        READING_POSITION: 'aleph_reading_position',
        VIEW_PREFERENCES: 'aleph_view_prefs',
        LAST_VISIT: 'aleph_last_visit'
    },
    
    // Estado del servidor
    SERVER_STATUS: {
        CONNECTED: 'conectado',
        DISCONNECTED: 'desconectado',
        CONNECTING: 'conectando'
    }
};
