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
  for (const [novelId, novel] of Object.entries(processedData.resources.novels)) {    novel.id = novelId;
    
    // Asegurarse de que chapters contiene todos los capítulos
    if (!novel.chapters) {
      novel.chapters = [];
    } else if (!Array.isArray(novel.chapters)) {
      novel.chapters = Object.values(novel.chapters);
    }
    
    // Buscar capítulos huérfanos que deberían pertenecer a esta novela
    // basándonos en metadatos o relaciones implícitas
    checkAndAttachOrphanedChapters(novel, processedData.resources.chapters);
    
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
    // Verificar capítulos huérfanos (no asociados a ninguna novela)
  checkForOrphanedChapters(processedData.resources.chapters, chapters, novels);
  
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
  
  // Estadísticas generales
  summary += `📚 Novelas: ${webData.novels.length}\n`;
  summary += `👤 Personajes: ${webData.characters.length}\n`;
  summary += `🎬 Escenas: ${webData.scenes.length}\n`;
  summary += `📃 Capítulos: ${webData.chapters.length}\n`;
  
  // Calcular algunas estadísticas adicionales
  const totalCharacterWords = webData.characters.reduce((sum, char) => {
    const description = char.description || '';
    const backstory = char.backstory || '';
    return sum + countWords(description) + countWords(backstory);
  }, 0);
  
  const totalSceneWords = webData.scenes.reduce((sum, scene) => {
    const content = scene.content || scene.summary || '';
    return sum + countWords(content);
  }, 0);
  
  summary += `📊 Total de palabras en descripciones de personajes: ${totalCharacterWords}\n`;
  summary += `📊 Total de palabras en escenas: ${totalSceneWords}\n`;
  
  // Detalles de cada novela
  webData.novels.forEach((novel, index) => {
    summary += `\n📕 NOVELA ${index + 1}: ${novel.title || 'Sin título'} (${novel.id})\n`;
    summary += `  Género: ${novel.genre ? (Array.isArray(novel.genre) ? novel.genre.join(', ') : novel.genre) : 'No especificado'}\n`;
    summary += `  Descripción: ${truncateSummary(novel.summary || novel.description || 'No disponible')}\n`;
    
    // Encontrar capítulos de esta novela
    const novelChapters = webData.chapters.filter(ch => ch.novelId === novel.id);
    summary += `  📑 Capítulos: ${novelChapters.length}\n`;
    
    novelChapters.forEach((chapter, chapIndex) => {
      summary += `    ${chapIndex + 1}. ${chapter.title || 'Sin título'} (${chapter.id}): ${chapter.scenes?.length || 0} escenas\n`;
      
      // Mostrar solo los IDs de las escenas para no sobrecargar el resumen
      if (chapter.scenes?.length > 0) {
        const sceneSummary = chapter.scenes.length <= 5 
          ? chapter.scenes.join(', ')
          : `${chapter.scenes.slice(0, 3).join(', ')} ... y ${chapter.scenes.length - 3} más`;
        
        summary += `       Escenas: ${sceneSummary}\n`;
      } else {
        summary += `       Sin escenas\n`;
      }
    });
    
    // Encontrar personajes de esta novela
    const novelCharacterIds = novel.characters || [];
    const novelCharacters = novelCharacterIds.length > 0 
      ? novelCharacterIds.map(id => {
          const char = webData.characters.find(c => c.id === id);
          return char ? char.name || id : id;
        })
      : [];
    
    summary += `  👥 Personajes: ${novelCharacters.length}\n`;
    
    if (novelCharacters.length > 0) {
      const charSummary = novelCharacters.length <= 8 
        ? novelCharacters.join(', ')
        : `${novelCharacters.slice(0, 6).join(', ')} ... y ${novelCharacters.length - 6} más`;
      
      summary += `     ${charSummary}\n`;
    }
  });
  
  return summary;
}

/**
 * Cuenta palabras en un texto
 * @param {string} text - Texto a analizar
 * @returns {number} - Número de palabras
 */
function countWords(text) {
  if (!text || typeof text !== 'string') return 0;
  return text.split(/\s+/).filter(word => word.length > 0).length;
}

/**
 * Trunca un resumen si es demasiado largo
 * @param {string} text - Texto a truncar
 * @param {number} maxLength - Longitud máxima
 * @returns {string} - Texto truncado
 */
function truncateSummary(text, maxLength = 100) {
  if (!text || typeof text !== 'string') return '';
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
}

/**
 * Valida la estructura de los datos del catálogo
 * @param {Object} sourceData - Los datos a validar
 * @returns {Object} - Resultados de la validación con mensajes y errores
 */
export function validateNovelData(sourceData) {
  const result = {
    messages: [],
    errors: [],
    warnings: [],
    isValid: true
  };
  
  // Verificar si existen las secciones principales requeridas
  const requiredSections = ['novels', 'chapters', 'scenes', 'characters'];
  for (const section of requiredSections) {
    if (!sourceData.resources || !sourceData.resources[section]) {
      result.errors.push(`Sección requerida '${section}' no encontrada en los datos`);
      result.isValid = false;
    }
  }
  
  // Si faltan secciones principales, no continuamos
  if (!result.isValid) {
    result.messages = [...result.errors];
    return result;
  }
  
  // Verificar novelas y sus relaciones
  result.messages.push('Verificando estructura de novelas:');
  
  for (const [novelId, novel] of Object.entries(sourceData.resources.novels)) {
    result.messages.push(`\nNovela: ${novel.title || 'Sin título'} (${novelId})`);
    
    // Verificar campos obligatorios
    if (!novel.title) {
      result.warnings.push(`Novela ${novelId} no tiene título definido`);
    }
    
    // Verificar capítulos
    const chaptersCount = novel.chapters ? 
      (Array.isArray(novel.chapters) ? novel.chapters.length : Object.keys(novel.chapters).length) : 0;
    
    result.messages.push(`  Capítulos definidos: ${chaptersCount}`);
    
    if (chaptersCount === 0) {
      result.warnings.push(`Novela ${novelId} (${novel.title || 'Sin título'}) no tiene capítulos`);
    }
    
    // Analizar cada capítulo
    if (novel.chapters && chaptersCount > 0) {
      const chapterRefs = Array.isArray(novel.chapters) ? 
        novel.chapters : Object.values(novel.chapters);
      
      chapterRefs.forEach((chapterRef, index) => {
        // Recuperar el objeto completo del capítulo
        let chapter;
        let chapterId;
        
        if (typeof chapterRef === 'string') {
          chapterId = chapterRef;
          chapter = sourceData.resources.chapters[chapterId];
          result.messages.push(`  Capítulo ${index+1}: ${chapterId} - ${chapter ? chapter.title || 'Sin título' : 'NO ENCONTRADO!'}`);
          
          if (!chapter) {
            result.errors.push(`Novela ${novelId}: Referencia a capítulo inexistente: ${chapterId}`);
            result.isValid = false;
          }
        } else if (typeof chapterRef === 'object') {
          chapterId = chapterRef.id;
          chapter = chapterRef;
          result.messages.push(`  Capítulo ${index+1}: ${chapterId} - ${chapter.title || 'Sin título'}`);
        }
        
        // Verificar escenas del capítulo
        if (chapter && chapter.scenes) {
          const sceneCount = Array.isArray(chapter.scenes) ? chapter.scenes.length : 
                          (typeof chapter.scenes === 'object' ? Object.keys(chapter.scenes).length : 0);
          result.messages.push(`    Escenas: ${sceneCount}`);
          
          if (sceneCount === 0) {
            result.warnings.push(`Capítulo ${chapterId} (${chapter.title || 'Sin título'}) no tiene escenas`);
          }
          
          // Asegurarse de que las escenas existen
          if (Array.isArray(chapter.scenes)) {
            chapter.scenes.forEach(sceneRef => {
              const scene = sourceData.resources.scenes[sceneRef];
              result.messages.push(`      - ${sceneRef}: ${scene ? scene.title || 'Sin título' : 'NO ENCONTRADA!'}`);
              
              if (!scene) {
                result.errors.push(`Capítulo ${chapterId}: Referencia a escena inexistente: ${sceneRef}`);
                result.isValid = false;
              }
            });
          } else if (typeof chapter.scenes === 'object') {
            Object.values(chapter.scenes).forEach(sceneRef => {
              const scene = sourceData.resources.scenes[sceneRef];
              result.messages.push(`      - ${sceneRef}: ${scene ? scene.title || 'Sin título' : 'NO ENCONTRADA!'}`);
              
              if (!scene) {
                result.errors.push(`Capítulo ${chapterId}: Referencia a escena inexistente: ${sceneRef}`);
                result.isValid = false;
              }
            });
          }
        } else if (chapter) {
          result.warnings.push(`Capítulo ${chapterId} (${chapter.title || 'Sin título'}) no tiene escenas definidas`);
        }
      });
    }
    
    // Verificar personajes de la novela
    if (novel.characters) {
      result.messages.push(`  Personajes: ${Array.isArray(novel.characters) ? novel.characters.length : 0}`);
      
      if (Array.isArray(novel.characters)) {
        novel.characters.forEach(charId => {
          const character = sourceData.resources.characters[charId];
          if (!character) {
            result.errors.push(`Novela ${novelId}: Referencia a personaje inexistente: ${charId}`);
            result.isValid = false;
          }
        });
      }
    } else {
      result.warnings.push(`Novela ${novelId} (${novel.title || 'Sin título'}) no tiene personajes definidos`);
    }
  }
  
  // Verificar capítulos huérfanos
  const allChapterIds = Object.keys(sourceData.resources.chapters);
  const referencedChapterIds = new Set();
  
  // Recopilar todos los IDs de capítulos referenciados en novelas
  for (const [novelId, novel] of Object.entries(sourceData.resources.novels)) {
    if (novel.chapters) {
      const chapterRefs = Array.isArray(novel.chapters) ? 
        novel.chapters : Object.values(novel.chapters);
      
      chapterRefs.forEach(chapterRef => {
        if (typeof chapterRef === 'string') {
          referencedChapterIds.add(chapterRef);
        } else if (typeof chapterRef === 'object' && chapterRef.id) {
          referencedChapterIds.add(chapterRef.id);
        }
      });
    }
  }
  
  // Encontrar capítulos no referenciados
  const orphanedChapters = allChapterIds.filter(id => !referencedChapterIds.has(id));
  
  if (orphanedChapters.length > 0) {
    result.warnings.push('\nCapítulos no asociados a ninguna novela:');
    orphanedChapters.forEach(chapterId => {
      const chapter = sourceData.resources.chapters[chapterId];
      result.warnings.push(`  - ${chapterId}: ${chapter.title || 'Sin título'}`);
    });
  }
  
  // Verificar escenas huérfanas
  const allSceneIds = Object.keys(sourceData.resources.scenes);
  const referencedSceneIds = new Set();
  
  // Recopilar todos los IDs de escenas referenciadas en capítulos
  for (const [chapterId, chapter] of Object.entries(sourceData.resources.chapters)) {
    if (chapter.scenes) {
      const sceneRefs = Array.isArray(chapter.scenes) ? 
        chapter.scenes : Object.values(chapter.scenes);
      
      sceneRefs.forEach(sceneRef => {
        if (typeof sceneRef === 'string') {
          referencedSceneIds.add(sceneRef);
        }
      });
    }
  }
  
  // Encontrar escenas no referenciadas
  const orphanedScenes = allSceneIds.filter(id => !referencedSceneIds.has(id));
  
  if (orphanedScenes.length > 0) {
    result.warnings.push('\nEscenas no asociadas a ningún capítulo:');
    orphanedScenes.forEach(sceneId => {
      const scene = sourceData.resources.scenes[sceneId];
      result.warnings.push(`  - ${sceneId}: ${scene.title || 'Sin título'}`);
    });
  }
  
  // Combinar mensajes para la salida final
  result.messages = [
    ...result.messages,
    '\n=== RESULTADO DE VALIDACIÓN ===',
    `Estado: ${result.isValid ? 'VÁLIDO' : 'INVÁLIDO'}`,
    `Advertencias: ${result.warnings.length}`,
    `Errores: ${result.errors.length}`
  ];
  
  if (result.warnings.length > 0) {
    result.messages.push('\n=== ADVERTENCIAS ===');
    result.messages.push(...result.warnings);
  }
  
  if (result.errors.length > 0) {
    result.messages.push('\n=== ERRORES ===');
    result.messages.push(...result.errors);
  }
  
  return result;
}

/**
 * Busca capítulos que deberían pertenecer a una novela basándose en metadatos
 * @param {Object} novel - La novela a la que posiblemente pertenecen los capítulos
 * @param {Object} allChapters - Todos los capítulos disponibles
 */
function checkAndAttachOrphanedChapters(novel, allChapters) {
  // Buscar en todos los capítulos si alguno tiene una referencia a esta novela
  for (const [chapterId, chapterData] of Object.entries(allChapters)) {
    // Verificar si el capítulo ya está incluido en la novela
    const isAlreadyIncluded = novel.chapters.some(ch => 
      (typeof ch === 'string' && ch === chapterId) || 
      (typeof ch === 'object' && ch.id === chapterId)
    );
    
    if (!isAlreadyIncluded) {
      // Buscar relaciones implícitas o explícitas con la novela
      const belongsToNovel = checkChapterBelongsToNovel(chapterData, novel);
      
      if (belongsToNovel) {
        console.log(`🔍 Añadiendo capítulo '${chapterData.title || chapterId}' a la novela ${novel.title || novel.id}`);
        novel.chapters.push(chapterId);
      }
    }
  }
}

/**
 * Verifica si un capítulo pertenece a una novela basándose en metadatos
 * @param {Object} chapter - El capítulo a verificar
 * @param {Object} novel - La novela a comprobar
 * @returns {boolean} - Verdadero si el capítulo pertenece a la novela
 */
function checkChapterBelongsToNovel(chapter, novel) {
  // Verificar si hay referencias explícitas a la novela
  if (chapter.novelId && chapter.novelId === novel.id) {
    return true;
  }
  
  // Verificar si hay referencias en metadatos
  if (chapter.metadata && chapter.metadata.novelId === novel.id) {
    return true;
  }
  
  // Verificar si hay personajes comunes
  if (chapter.characters && novel.characters) {
    const characterOverlap = chapter.characters.some(charId => 
      novel.characters.includes(charId)
    );
    if (characterOverlap && chapter.characters.length > 0) {
      return true;
    }
  }
  
  // Verificar si hay referencias textuales en el título o descripción
  if (novel.title && chapter.title && 
      (chapter.title.includes(novel.title) || (novel.title.includes(chapter.title)))) {
    return true;
  }
  
  return false;
}

/**
 * Verifica si hay capítulos que no están asociados a ninguna novela
 * @param {Object} allChapters - Todos los capítulos disponibles
 * @param {Array} processedChapters - Los capítulos ya procesados
 * @param {Array} novels - Las novelas disponibles
 */
function checkForOrphanedChapters(allChapters, processedChapters, novels) {
  for (const [chapterId, chapter] of Object.entries(allChapters)) {
    // Verificar si el capítulo ya está procesado
    if (!processedChapters.some(ch => ch.id === chapterId)) {
      console.log(`⚠️ El capítulo '${chapter.title || chapterId}' no está asociado a ninguna novela.`);
      
      // Intentar encontrar la novela más apropiada
      let bestMatch = null;
      let highestScore = 0;
      
      for (const novel of novels) {
        const score = calculateNovelChapterAffinity(novel, chapter);
        if (score > highestScore) {
          highestScore = score;
          bestMatch = novel;
        }
      }
      
      // Si encontramos una novela con afinidad > 0, asociarla
      if (bestMatch && highestScore > 0) {
        console.log(`   Asociando automáticamente a la novela '${bestMatch.title || bestMatch.id}' (afinidad: ${highestScore})`);
        
        processedChapters.push({
          id: chapterId,
          title: chapter.title || `Capítulo sin título`,
          description: chapter.description || '',
          scenes: chapter.scenes || [],
          novelId: bestMatch.id
        });
      } else if (novels.length > 0) {
        // Si no hay match pero hay novelas, asignarlo a la primera por defecto
        const defaultNovel = novels[0];
        console.log(`   No se encontró match, asociando a la primera novela: '${defaultNovel.title || defaultNovel.id}'`);
        
        processedChapters.push({
          id: chapterId,
          title: chapter.title || `Capítulo sin título`,
          description: chapter.description || '',
          scenes: chapter.scenes || [],
          novelId: defaultNovel.id
        });
      }
    }
  }
}

/**
 * Calcula la afinidad entre una novela y un capítulo
 * @param {Object} novel - La novela a evaluar
 * @param {Object} chapter - El capítulo a evaluar
 * @returns {number} - Puntuación de afinidad (mayor = más relacionados)
 */
function calculateNovelChapterAffinity(novel, chapter) {
  let score = 0;
  
  // Comprobar coincidencias en el título
  if (novel.title && chapter.title) {
    const novelWords = novel.title.toLowerCase().split(/\s+/);
    const chapterWords = chapter.title.toLowerCase().split(/\s+/);
    
    const commonWords = novelWords.filter(word => 
      word.length > 3 && chapterWords.includes(word)
    );
    
    score += commonWords.length * 2;
  }
  
  // Comprobar coincidencias en personajes
  if (novel.characters && chapter.characters) {
    const commonCharacters = novel.characters.filter(charId => 
      chapter.characters.includes(charId)
    );
    
    score += commonCharacters.length * 3;
  }
  
  // Comprobar si hay temas comunes
  if (novel.themes && chapter.themes) {
    const commonThemes = novel.themes.filter(theme => 
      chapter.themes.includes(theme)
    );
    
    score += commonThemes.length * 2;
  }
  
  return score;
}
