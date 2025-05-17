/**
 * utils.js - Funciones de utilidad compartidas entre las diferentes páginas
 */

/**
 * Formatea una fecha a un formato localizado
 * @param {Date|string} date - Fecha a formatear
 * @param {string} locale - Código de localización (por defecto: 'es-ES')
 * @returns {string} Fecha formateada
 */
function formatDate(date, locale = 'es-ES') {
    if (!date) return 'Fecha desconocida';
    
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    if (isNaN(dateObj.getTime())) return 'Fecha inválida';
    
    return dateObj.toLocaleDateString(locale, {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

/**
 * Trunca un texto a un número máximo de caracteres
 * @param {string} text - Texto a truncar
 * @param {number} maxLength - Longitud máxima
 * @returns {string} Texto truncado
 */
function truncateText(text, maxLength) {
    if (!text) return '';
    
    if (text.length <= maxLength) return text;
    
    return text.substring(0, maxLength) + '...';
}

/**
 * Genera un ID único
 * @returns {string} ID único
 */
function generateUniqueId() {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

/**
 * Protege contra XSS sanitizando HTML
 * @param {string} html - HTML a sanitizar
 * @returns {string} HTML sanitizado
 */
function sanitizeHTML(html) {
    if (!html) return '';
    
    const tempDiv = document.createElement('div');
    tempDiv.textContent = html;
    return tempDiv.innerHTML;
}

/**
 * Guarda un objeto en localStorage
 * @param {string} key - Clave
 * @param {any} value - Valor a guardar
 */
function saveToLocalStorage(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
        console.error('Error al guardar en localStorage:', error);
    }
}

/**
 * Recupera un objeto de localStorage
 * @param {string} key - Clave
 * @param {any} defaultValue - Valor por defecto si no existe
 * @returns {any} Valor recuperado
 */
function getFromLocalStorage(key, defaultValue = null) {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
        console.error('Error al recuperar de localStorage:', error);
        return defaultValue;
    }
}

/**
 * Detecta si se está usando un dispositivo móvil
 * @returns {boolean} true si es dispositivo móvil
 */
function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

// Exportar funciones si estamos en un entorno de módulos
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = {
        formatDate,
        truncateText,
        generateUniqueId,
        sanitizeHTML,
        saveToLocalStorage,
        getFromLocalStorage,
        isMobileDevice
    };
}
