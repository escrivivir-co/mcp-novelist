/**
 * main.js - Script principal para la página de inicio
 */

// Función de tipeo para el terminal
function typeEffect() {
    const typedTextElement = document.getElementById('typed-text');
    
    if (typedTextElement) {
        const texto = `> Inicializando Aleph MCP...
> Cargando protocolos de comunicación...
> Conectando con modelador de contexto...
> Preparando recursos narrativos...
> Estableciendo canales de comunicación con la IA...
> Aleph MCP activado. Listo para asistir.
>_ `;
        
        let i = 0;
        const velocidad = 50; // ms por caracter
        
        function typeWriter() {
            if (i < texto.length) {
                typedTextElement.innerHTML += texto.charAt(i);
                i++;
                setTimeout(typeWriter, velocidad);
            }
        }
        
        typeWriter();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Iniciar efecto de tipeo
    typeEffect();
    
    // Función para copiar código de ejemplo
    window.copyCode = function() {
        const codeElement = document.querySelector('.code-block code');
        const textToCopy = codeElement.textContent;
        
        navigator.clipboard.writeText(textToCopy).then(() => {
            const copyButton = document.querySelector('.copy-button');
            const originalText = copyButton.textContent;
            
            copyButton.textContent = 'Copiado!';
            copyButton.classList.add('copied');
            
            setTimeout(() => {
                copyButton.textContent = originalText;
                copyButton.classList.remove('copied');
            }, 2000);
        }).catch(err => {
            console.error('Error al copiar: ', err);
            alert('No se pudo copiar el código. Por favor, inténtalo manualmente.');
        });
    };
});
