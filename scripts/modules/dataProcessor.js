/**
 * Configuración para el procesamiento de datos del catálogo
 * @module dataProcessor
 */

/**
 * Procesa los datos del catálogo para convertirlos en formato web
 * @param {Object} data - Los datos a procesar
 * @returns {Object} - Los datos procesados
 */
export function processNovelDataForWeb(data) {
  console.log('Procesando datos para la web...');
  
  // Crear una copia profunda de los datos para no modificar el original
  const processedData = JSON.parse(JSON.stringify(data));
  
  // Convertir objetos a arrays para facilitar el renderizado en la web
  const novels = [];
  const characters = [];
  const scenes = [];
  const chapters = [];
  
  // Procesar novelas
  for (const [novelId, novel] of Object.entries(processedData.resources.novels)) {
    novel.id = novelId;
    
    // Asegurarse de que chapters contiene todos los capítulos
    if (!novel.chapters) {
      novel.chapters = [];
    } else if (!Array.isArray(novel.chapters)) {
      novel.chapters = Object.values(novel.chapters);
    }
    
    // Verificar explícitamente si el capítulo 4 (El Enigma Computacional) existe
    if (novelId === 'novel2' && processedData.resources.chapters['chap4']) {
      // Comprobar si chap4 ya está incluido en los capítulos de la novela
      const hasChap4 = novel.chapters.some(ch => 
        (typeof ch === 'string' && ch === 'chap4') || 
        (typeof ch === 'object' && ch.id === 'chap4')
      );
      
      // Si no está incluido, añadirlo
      if (!hasChap4) {
        console.log("🔍 Añadiendo manualmente el capítulo 'El Enigma Computacional' (chap4) a la novela novel2");
        novel.chapters.push('chap4');
      }
    }
    
    // Crear capítulos completos para la novela
    const processedChapters = [];
    
    for (const chapterRef of novel.chapters) {
      const chapterId = typeof chapterRef === 'string' ? chapterRef : chapterRef.id;
      const chapterData = processedData.resources.chapters[chapterId];
      
      if (chapterData) {
        // Crear objeto de capítulo completo
        const chapterObj = {
          id: chapterId,
          title: chapterData.title || `Capítulo ${chapterId}`,
          description: chapterData.description || '',
          scenes: []
        };
        
        // Procesar escenas del capítulo
        if (chapterData.scenes) {
          if (Array.isArray(chapterData.scenes)) {
            chapterObj.scenes = [...chapterData.scenes];
          } else if (typeof chapterData.scenes === 'object') {
            chapterObj.scenes = Object.values(chapterData.scenes);
          }
        }
        
        processedChapters.push(chapterObj);
        
        // También añadir al array general de capítulos
        chapters.push({
          ...chapterObj,
          novelId: novelId
        });
      }
    }
    
    // Reemplazar las referencias con objetos completos en la novela
    novel.chapters = processedChapters;
    
    novels.push(novel);
  }
  
  // Procesar personajes
  for (const [charId, character] of Object.entries(processedData.resources.characters)) {
    character.id = charId;
    characters.push(character);
  }
  
  // Procesar escenas
  for (const [sceneId, scene] of Object.entries(processedData.resources.scenes)) {
    scene.id = sceneId;
    scenes.push(scene);
  }
  
  // Verificación adicional para chap4
  const chap4 = processedData.resources.chapters['chap4'];
  if (chap4 && !chapters.some(ch => ch.id === 'chap4')) {
    console.log("⚠️ El capítulo 'chap4' existe pero no está asociado a ninguna novela. Añadiéndolo manualmente.");
    chapters.push({
      id: 'chap4',
      title: chap4.title || 'El Enigma Computacional',
      description: chap4.description || '',
      scenes: chap4.scenes || [],
      novelId: 'novel2' // Asociarlo a AlephAlpha
    });
  }
  
  return {
    novels,
    characters,
    scenes,
    chapters
  };
}

/**
 * Genera un resumen del catálogo
 * @param {Object} webData - Los datos del catálogo
 * @returns {string} - Un resumen formateado
 */
export function generateCatalogSummary(webData) {
  let summary = '\n=== RESUMEN DEL CATÁLOGO GENERADO ===\n';
  summary += `Novelas: ${webData.novels.length}\n`;
  summary += `Personajes: ${webData.characters.length}\n`;
  summary += `Escenas: ${webData.scenes.length}\n`;
  
  webData.novels.forEach(novel => {
    summary += `\nNovela: ${novel.title} (${novel.id})\n`;
    
    // Encontrar capítulos de esta novela
    const novelChapters = webData.chapters.filter(ch => ch.novelId === novel.id);
    summary += `  Capítulos: ${novelChapters.length}\n`;
    
    novelChapters.forEach(chapter => {
      summary += `    - ${chapter.title} (${chapter.id}): ${chapter.scenes?.length || 0} escenas\n`;
      summary += `      Escenas: ${chapter.scenes?.join(', ') || 'ninguna'}\n`;
    });
    
    // Encontrar personajes de esta novela
    const novelCharacters = novel.characters?.length || 0;
    summary += `  Personajes: ${novelCharacters}\n`;
    summary += `  Personajes IDs: ${novel.characters?.join(', ') || 'ninguno'}\n`;
  });
  
  return summary;
}

/**
 * Valida la estructura de los datos del catálogo
 * @param {Object} sourceData - Los datos a validar
 * @returns {Array<string>} - Mensajes de validación
 */
export function validateNovelData(sourceData) {
  const messages = [];
  
  messages.push('Verificando capítulos de cada novela:');
  
  for (const [novelId, novel] of Object.entries(sourceData.resources.novels)) {
    messages.push(`\nNovela: ${novel.title} (${novelId})`);
    messages.push(`  Capítulos definidos: ${novel.chapters ? novel.chapters.length : 0}`);
    
    if (novel.chapters && novel.chapters.length > 0) {
      novel.chapters.forEach((chapterRef, index) => {
        // Recuperar el objeto completo del capítulo
        let chapter;
        if (typeof chapterRef === 'string') {
          chapter = sourceData.resources.chapters[chapterRef];
          messages.push(`  Capítulo ${index+1}: ${chapterRef} - ${chapter ? chapter.title : 'NO ENCONTRADO!'}`);
        } else if (typeof chapterRef === 'object') {
          chapter = chapterRef;
          messages.push(`  Capítulo ${index+1}: ${chapter.id} - ${chapter.title}`);
        }
        
        // Verificar escenas del capítulo
        if (chapter && chapter.scenes) {
          const sceneCount = Array.isArray(chapter.scenes) ? chapter.scenes.length : 
                          (typeof chapter.scenes === 'object' ? Object.keys(chapter.scenes).length : 0);
          messages.push(`    Escenas: ${sceneCount}`);
          
          // Asegurarse de que las escenas se procesen correctamente
          if (Array.isArray(chapter.scenes)) {
            chapter.scenes.forEach(sceneRef => {
              messages.push(`      - ${sceneRef}: ${sourceData.resources.scenes[sceneRef] ? 
                              sourceData.resources.scenes[sceneRef].title : 'NO ENCONTRADA!'}`);
            });
          } else if (typeof chapter.scenes === 'object') {
            Object.entries(chapter.scenes).forEach(([key, sceneRef]) => {
              messages.push(`      - ${sceneRef}: ${sourceData.resources.scenes[sceneRef] ? 
                              sourceData.resources.scenes[sceneRef].title : 'NO ENCONTRADA!'}`);
            });
          }
        }
      });
    }
  }
  
  return messages;
}
