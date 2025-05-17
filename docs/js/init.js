/**
 * init.js - Script de verificación de la nueva estructura
 * 
 * Este script se carga en todas las páginas y verifica que los archivos
 * necesarios estén cargados correctamente.
 */

(function() {
    console.log('Iniciando verificación de la nueva estructura...');
    
    const requiredFiles = {
        css: ['common.css'],
        js: ['utils.js']
    };
    
    // Verificar los archivos CSS
    const cssFiles = Array.from(document.styleSheets)
        .filter(sheet => sheet.href)
        .map(sheet => {
            const url = new URL(sheet.href);
            return url.pathname.split('/').pop();
        });
    
    console.log('CSS cargados:', cssFiles);
    
    // Verificar si todos los archivos requeridos están cargados
    const missingCSS = requiredFiles.css.filter(file => !cssFiles.includes(file));
    
    if (missingCSS.length > 0) {
        console.error('¡ATENCIÓN! Faltan archivos CSS:', missingCSS);
    } else {
        console.log('✓ Todos los archivos CSS requeridos están cargados');
    }
    
    // Verificar que utils.js está cargado
    if (typeof formatDate === 'function') {
        console.log('✓ utils.js está cargado correctamente');
    } else {
        console.error('¡ATENCIÓN! utils.js no está cargado correctamente');
    }
    
    // Verificar la página actual
    const isHomePage = window.location.pathname.endsWith('index.html') || window.location.pathname.endsWith('/');
    const isCatalogPage = window.location.pathname.includes('novel-catalog.html');
    
    if (isHomePage) {
        console.log('Página actual: Inicio');
        if (typeof typeEffect === 'function') {
            console.log('✓ main.js está cargado correctamente');
        } else {
            console.error('¡ATENCIÓN! main.js no está cargado correctamente');
        }
    } else if (isCatalogPage) {
        console.log('Página actual: Catálogo');
        if (typeof loadNovelData === 'function') {
            console.log('✓ catalog.js está cargado correctamente');
        } else {
            console.error('¡ATENCIÓN! catalog.js no está cargado correctamente');
        }
    }
    
    console.log('Verificación completada');
})();
