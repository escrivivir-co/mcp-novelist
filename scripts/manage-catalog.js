#!/usr/bin/env node

/**
 * Script para gestionar el catálogo de novelas
 * 
 * Este script permite añadir, modificar o eliminar novelas, personajes y escenas
 * del archivo novel-data.json y actualiza automáticamente el catálogo web.
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

// Rutas de los archivos
const sourceFile = path.resolve(__dirname, '..', 'src', 'resources', 'novel-data.json');
const catalogScriptPath = path.resolve(__dirname, 'update-catalog.js');

// Crear interfaz de línea de comandos
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Función para preguntar al usuario
function question(query) {
  return new Promise((resolve) => {
    rl.question(`${query} `, resolve);
  });
}

// Función para cargar los datos actuales
function loadNovelData() {
  try {
    const data = fs.readFileSync(sourceFile, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error al cargar los datos:', error);
    process.exit(1);
  }
}

// Función para guardar los datos
function saveNovelData(data) {
  try {
    fs.writeFileSync(sourceFile, JSON.stringify(data, null, 2));
    console.log('✓ Datos guardados correctamente');
    
    // Actualizar el catálogo web
    require('./update-catalog');
  } catch (error) {
    console.error('Error al guardar los datos:', error);
  }
}

// Función para generar un ID único
function generateId(prefix) {
  return `${prefix}${Date.now().toString(36)}`;
}

// Función para mostrar el menú principal
async function showMainMenu() {
  console.log('\n===== GESTOR DE CATÁLOGO DE NOVELAS =====');
  console.log('1. Gestionar novelas');
  console.log('2. Gestionar personajes');
  console.log('3. Gestionar escenas');
  console.log('4. Gestionar plantillas de prompts');
  console.log('5. Salir');
  
  const choice = await question('\nSeleccione una opción (1-5):');
  
  switch (choice) {
    case '1':
      await manageNovels();
      break;
    case '2':
      await manageCharacters();
      break;
    case '3':
      await manageScenes();
      break;
    case '4':
      await managePromptTemplates();
      break;
    case '5':
      console.log('Saliendo del programa...');
      rl.close();
      return;
    default:
      console.log('Opción no válida. Inténtelo de nuevo.');
      await showMainMenu();
  }
}

// Función para gestionar novelas
async function manageNovels() {
  const data = loadNovelData();
  
  console.log('\n===== GESTIÓN DE NOVELAS =====');
  console.log('1. Listar novelas');
  console.log('2. Añadir nueva novela');
  console.log('3. Modificar novela existente');
  console.log('4. Eliminar novela');
  console.log('5. Volver al menú principal');
  
  const choice = await question('\nSeleccione una opción (1-5):');
  
  switch (choice) {
    case '1':
      listNovels(data);
      await manageNovels();
      break;
    case '2':
      await addNovel(data);
      await manageNovels();
      break;
    case '3':
      await modifyNovel(data);
      await manageNovels();
      break;
    case '4':
      await deleteNovel(data);
      await manageNovels();
      break;
    case '5':
      await showMainMenu();
      break;
    default:
      console.log('Opción no válida. Inténtelo de nuevo.');
      await manageNovels();
  }
}

// Función para listar novelas
function listNovels(data) {
  console.log('\n===== LISTA DE NOVELAS =====');
  
  const novels = data.resources.novels;
  if (Object.keys(novels).length === 0) {
    console.log('No hay novelas registradas.');
    return;
  }
  
  Object.entries(novels).forEach(([id, novel]) => {
    console.log(`ID: ${id}`);
    console.log(`Título: ${novel.title}`);
    console.log(`Autor: ${novel.author}`);
    console.log(`Género: ${novel.genre.join(', ')}`);
    console.log(`Personajes: ${novel.characters.length}`);
    console.log('----------------------------');
  });
}

// Función para añadir una nueva novela
async function addNovel(data) {
  console.log('\n===== AÑADIR NUEVA NOVELA =====');
  
  const id = generateId('novel');
  const title = await question('Título:');
  const author = await question('Autor:');
  const genreStr = await question('Géneros (separados por comas):');
  const summary = await question('Resumen:');
  const setting = await question('Ambientación:');
  
  // Dividir géneros
  const genre = genreStr.split(',').map(g => g.trim()).filter(g => g);
  
  // Crear objeto de novela
  const novel = {
    id,
    title,
    author,
    genre,
    summary,
    characters: [],
    chapters: [],
    setting
  };
  
  // Añadir a los datos
  data.resources.novels[id] = novel;
  
  // Guardar cambios
  saveNovelData(data);
  console.log(`✓ Novela "${title}" añadida con ID: ${id}`);
}

// Función para modificar una novela existente
async function modifyNovel(data) {
  console.log('\n===== MODIFICAR NOVELA =====');
  
  // Listar novelas
  listNovels(data);
  
  if (Object.keys(data.resources.novels).length === 0) {
    return;
  }
  
  const id = await question('ID de la novela a modificar:');
  
  if (!data.resources.novels[id]) {
    console.log('Novela no encontrada.');
    return;
  }
  
  const novel = data.resources.novels[id];
  
  console.log('\nDeje en blanco para mantener el valor actual');
  
  const title = await question(`Título [${novel.title}]:`);
  const author = await question(`Autor [${novel.author}]:`);
  const genreStr = await question(`Géneros [${novel.genre.join(', ')}]:`);
  const summary = await question(`Resumen [${novel.summary}]:`);
  const setting = await question(`Ambientación [${novel.setting}]:`);
  
  // Actualizar campos si se han proporcionado nuevos valores
  if (title) novel.title = title;
  if (author) novel.author = author;
  if (genreStr) novel.genre = genreStr.split(',').map(g => g.trim()).filter(g => g);
  if (summary) novel.summary = summary;
  if (setting) novel.setting = setting;
  
  // Guardar cambios
  saveNovelData(data);
  console.log(`✓ Novela "${novel.title}" actualizada`);
}

// Función para eliminar una novela
async function deleteNovel(data) {
  console.log('\n===== ELIMINAR NOVELA =====');
  
  // Listar novelas
  listNovels(data);
  
  if (Object.keys(data.resources.novels).length === 0) {
    return;
  }
  
  const id = await question('ID de la novela a eliminar:');
  
  if (!data.resources.novels[id]) {
    console.log('Novela no encontrada.');
    return;
  }
  
  const confirm = await question(`¿Está seguro de que desea eliminar la novela "${data.resources.novels[id].title}"? (s/n):`);
  
  if (confirm.toLowerCase() === 's') {
    delete data.resources.novels[id];
    saveNovelData(data);
    console.log('✓ Novela eliminada correctamente');
  } else {
    console.log('Operación cancelada.');
  }
}

// Función para gestionar personajes
async function manageCharacters() {
  const data = loadNovelData();
  
  console.log('\n===== GESTIÓN DE PERSONAJES =====');
  console.log('1. Listar personajes');
  console.log('2. Añadir nuevo personaje');
  console.log('3. Modificar personaje existente');
  console.log('4. Eliminar personaje');
  console.log('5. Volver al menú principal');
  
  const choice = await question('\nSeleccione una opción (1-5):');
  
  switch (choice) {
    case '1':
      listCharacters(data);
      await manageCharacters();
      break;
    case '2':
      await addCharacter(data);
      await manageCharacters();
      break;
    case '3':
      await modifyCharacter(data);
      await manageCharacters();
      break;
    case '4':
      await deleteCharacter(data);
      await manageCharacters();
      break;
    case '5':
      await showMainMenu();
      break;
    default:
      console.log('Opción no válida. Inténtelo de nuevo.');
      await manageCharacters();
  }
}

// Función para listar personajes
function listCharacters(data) {
  console.log('\n===== LISTA DE PERSONAJES =====');
  
  const characters = data.resources.characters;
  if (Object.keys(characters).length === 0) {
    console.log('No hay personajes registrados.');
    return;
  }
  
  Object.entries(characters).forEach(([id, character]) => {
    console.log(`ID: ${id}`);
    console.log(`Nombre: ${character.name}`);
    console.log(`Descripción: ${character.description.substring(0, 50)}...`);
    console.log(`Rasgos: ${character.traits.join(', ')}`);
    console.log('----------------------------');
  });
}

// Función para añadir un nuevo personaje
async function addCharacter(data) {
  console.log('\n===== AÑADIR NUEVO PERSONAJE =====');
  
  const id = generateId('char');
  const name = await question('Nombre:');
  const description = await question('Descripción:');
  const traitsStr = await question('Rasgos (separados por comas):');
  const backstory = await question('Historia (backstory):');
  
  // Dividir rasgos
  const traits = traitsStr.split(',').map(t => t.trim()).filter(t => t);
  
  // Crear objeto de personaje
  const character = {
    id,
    name,
    description,
    traits,
    backstory
  };
  
  // Añadir a los datos
  data.resources.characters[id] = character;
  
  // Preguntar si se quiere asociar a una novela
  const associateToNovel = await question('¿Desea asociar este personaje a una novela existente? (s/n):');
  
  if (associateToNovel.toLowerCase() === 's') {
    listNovels(data);
    
    if (Object.keys(data.resources.novels).length === 0) {
      console.log('No hay novelas para asociar.');
    } else {
      const novelId = await question('ID de la novela:');
      
      if (data.resources.novels[novelId]) {
        data.resources.novels[novelId].characters.push(id);
        console.log(`✓ Personaje asociado a la novela "${data.resources.novels[novelId].title}"`);
      } else {
        console.log('Novela no encontrada.');
      }
    }
  }
  
  // Guardar cambios
  saveNovelData(data);
  console.log(`✓ Personaje "${name}" añadido con ID: ${id}`);
}

// Función para modificar un personaje existente
async function modifyCharacter(data) {
  console.log('\n===== MODIFICAR PERSONAJE =====');
  
  // Listar personajes
  listCharacters(data);
  
  if (Object.keys(data.resources.characters).length === 0) {
    return;
  }
  
  const id = await question('ID del personaje a modificar:');
  
  if (!data.resources.characters[id]) {
    console.log('Personaje no encontrado.');
    return;
  }
  
  const character = data.resources.characters[id];
  
  console.log('\nDeje en blanco para mantener el valor actual');
  
  const name = await question(`Nombre [${character.name}]:`);
  const description = await question(`Descripción [${character.description}]:`);
  const traitsStr = await question(`Rasgos [${character.traits.join(', ')}]:`);
  const backstory = await question(`Historia [${character.backstory}]:`);
  
  // Actualizar campos si se han proporcionado nuevos valores
  if (name) character.name = name;
  if (description) character.description = description;
  if (traitsStr) character.traits = traitsStr.split(',').map(t => t.trim()).filter(t => t);
  if (backstory) character.backstory = backstory;
  
  // Guardar cambios
  saveNovelData(data);
  console.log(`✓ Personaje "${character.name}" actualizado`);
}

// Función para eliminar un personaje
async function deleteCharacter(data) {
  console.log('\n===== ELIMINAR PERSONAJE =====');
  
  // Listar personajes
  listCharacters(data);
  
  if (Object.keys(data.resources.characters).length === 0) {
    return;
  }
  
  const id = await question('ID del personaje a eliminar:');
  
  if (!data.resources.characters[id]) {
    console.log('Personaje no encontrado.');
    return;
  }
  
  const confirm = await question(`¿Está seguro de que desea eliminar el personaje "${data.resources.characters[id].name}"? (s/n):`);
  
  if (confirm.toLowerCase() === 's') {
    // Eliminar personaje de todas las novelas que lo referencian
    Object.values(data.resources.novels).forEach(novel => {
      novel.characters = novel.characters.filter(charId => charId !== id);
    });
    
    // Eliminar personaje de todas las escenas que lo referencian
    Object.values(data.resources.scenes).forEach(scene => {
      scene.characters = scene.characters.filter(charId => charId !== id);
    });
    
    // Eliminar el personaje
    delete data.resources.characters[id];
    
    saveNovelData(data);
    console.log('✓ Personaje eliminado correctamente');
  } else {
    console.log('Operación cancelada.');
  }
}

// Función para gestionar escenas
async function manageScenes() {
  const data = loadNovelData();
  
  console.log('\n===== GESTIÓN DE ESCENAS =====');
  console.log('1. Listar escenas');
  console.log('2. Añadir nueva escena');
  console.log('3. Modificar escena existente');
  console.log('4. Eliminar escena');
  console.log('5. Volver al menú principal');
  
  const choice = await question('\nSeleccione una opción (1-5):');
  
  switch (choice) {
    case '1':
      listScenes(data);
      await manageScenes();
      break;
    case '2':
      await addScene(data);
      await manageScenes();
      break;
    case '3':
      await modifyScene(data);
      await manageScenes();
      break;
    case '4':
      await deleteScene(data);
      await manageScenes();
      break;
    case '5':
      await showMainMenu();
      break;
    default:
      console.log('Opción no válida. Inténtelo de nuevo.');
      await manageScenes();
  }
}

// Función para listar escenas
function listScenes(data) {
  console.log('\n===== LISTA DE ESCENAS =====');
  
  const scenes = data.resources.scenes;
  if (Object.keys(scenes).length === 0) {
    console.log('No hay escenas registradas.');
    return;
  }
  
  Object.entries(scenes).forEach(([id, scene]) => {
    console.log(`ID: ${id}`);
    console.log(`Título: ${scene.title}`);
    console.log(`Ambientación: ${scene.setting}`);
    console.log(`Personajes: ${scene.characters.length}`);
    console.log('----------------------------');
  });
}

// Función para gestionar plantillas de prompts
async function managePromptTemplates() {
  console.log('\n===== GESTIÓN DE PLANTILLAS DE PROMPTS =====');
  console.log('Esta funcionalidad está en desarrollo...');
  
  await question('Presione Enter para volver al menú principal');
  await showMainMenu();
}

// Iniciar el programa
async function main() {
  console.log('======================================');
  console.log('  GESTOR DE CATÁLOGO DE ALEPH NOVELS  ');
  console.log('======================================');
  
  await showMainMenu();
}

// Ejecutar el programa
main().catch(error => {
  console.error('Error en la ejecución del programa:', error);
  rl.close();
});

// Manejar la salida del programa
rl.on('close', () => {
  console.log('\n¡Gracias por usar el Gestor de Catálogo de Aleph Novels!');
  process.exit(0);
});
