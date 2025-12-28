#!/usr/bin/env node
/**
 * Script de inicialización del contexto Scriptorium
 * 
 * Detecta el Scriptorium padre y genera/actualiza scriptorium-context.json
 * 
 * Uso:
 *   node scripts/init-scriptorium-context.js
 *   npm run init:scriptorium
 * 
 * Opciones:
 *   --scriptorium-root <path>  Ruta explícita al Scriptorium
 *   --force                    Sobrescribir scriptorium-context.json existente
 */

const fs = require('fs');
const path = require('path');

// Configuración
const CONFIG = {
  contextFile: 'scriptorium-context.json',
  schemaFile: 'scriptorium-context.schema.json',
  validationFiles: [
    '.github/copilot-instructions.md',
    '.github/PLUGINS.md'
  ],
  obrasPath: 'ARCHIVO/PLUGINS/NOVELIST/obras',
  searchPaths: [
    process.env.ALEPH_SCRIPTORIUM_ROOT,
    path.resolve(__dirname, '..', '..'),  // Si es submódulo
    path.resolve(process.env.HOME || '', 'SCRIPTORIUM/ALEPH'),
    path.resolve(process.env.HOME || '', 'Desktop/SCRIPTORIUM/ALEPH'),
    '/Users/morente/Desktop/NUEVA_BASE/SCRIPTORIUM/ALEPH'  // Ruta conocida
  ].filter(Boolean)
};

/**
 * Valida si una ruta es un Scriptorium válido
 */
function isValidScriptorium(rootPath) {
  for (const file of CONFIG.validationFiles) {
    const fullPath = path.join(rootPath, file);
    if (!fs.existsSync(fullPath)) {
      return false;
    }
  }
  return true;
}

/**
 * Busca el Scriptorium en las rutas conocidas
 */
function findScriptorium() {
  for (const searchPath of CONFIG.searchPaths) {
    if (searchPath && fs.existsSync(searchPath) && isValidScriptorium(searchPath)) {
      console.log(`✅ Scriptorium encontrado en: ${searchPath}`);
      return searchPath;
    }
  }
  return null;
}

/**
 * Lista las obras disponibles en el Scriptorium
 */
function listObras(scriptoriumRoot) {
  const obrasDir = path.join(scriptoriumRoot, CONFIG.obrasPath);
  
  if (!fs.existsSync(obrasDir)) {
    console.log(`⚠️  Directorio de obras no encontrado: ${obrasDir}`);
    return [];
  }

  const obras = [];
  const entries = fs.readdirSync(obrasDir, { withFileTypes: true });

  for (const entry of entries) {
    if (entry.isDirectory()) {
      const obraPath = path.join(obrasDir, entry.name);
      const novelaJsonPath = path.join(obraPath, 'novela.json');
      const estructuraJsonPath = path.join(obraPath, 'estructura.json');

      if (fs.existsSync(novelaJsonPath)) {
        try {
          const novela = JSON.parse(fs.readFileSync(novelaJsonPath, 'utf8'));
          const estructura = fs.existsSync(estructuraJsonPath) 
            ? JSON.parse(fs.readFileSync(estructuraJsonPath, 'utf8'))
            : null;

          obras.push({
            id: novela.id || entry.name,
            titulo: novela.titulo || novela.title || entry.name,
            estado: novela.estado || 'borrador',
            capitulos: estructura?.capitulos?.length || 12,
            ruta_local: path.join(CONFIG.obrasPath, entry.name),
            estructura: estructura?.tipo || 'monomito-12',
            personajeGuia: novela.personajeGuia || null,
            fechaCreacion: novela.fechaCreacion || new Date().toISOString().split('T')[0],
            sincronizacion: novela.sincronizacion || {}
          });
          console.log(`   📚 ${novela.titulo || entry.name}`);
        } catch (err) {
          console.log(`   ⚠️  Error leyendo ${entry.name}: ${err.message}`);
        }
      }
    }
  }

  return obras;
}

/**
 * Genera el contexto del Scriptorium
 */
function generateContext(scriptoriumRoot, obras) {
  return {
    "$schema": "./scriptorium-context.schema.json",
    "version": "1.0.0",
    "scriptorium": {
      "root": scriptoriumRoot,
      "detected": true,
      "plugins": {
        "novelist": ".github/plugins/novelist",
        "teatro": ".github/plugins/teatro",
        "agent_creator": ".github/plugins/agent-creator",
        "enciclopedia": ".github/plugins/enciclopedia"
      },
      "agentes": {
        "core": ["@aleph", "@revisor", "@periodico"],
        "banderas": ["@blueflag", "@blackflag", "@redflag", "@yellowflag", "@orangeflag"],
        "sistema": ["@vestibulo", "@cartaspuerta"],
        "meta": ["@ox", "@pluginmanager", "@indice"]
      }
    },
    "obras": {
      "path": CONFIG.obrasPath,
      "disponibles": obras
    },
    "mcp": {
      "servidor": "http://localhost:3066",
      "activo": false,
      "ultimaVerificacion": null
    },
    "sesion": {
      "obra_activa": null,
      "capitulo_actual": null,
      "modo": "ligero",
      "ultima_sincronizacion": null
    },
    "rutas_busqueda": CONFIG.searchPaths,
    "validacion_scriptorium": {
      "archivos_requeridos": CONFIG.validationFiles.concat([CONFIG.obrasPath])
    },
    "meta": {
      "creado": new Date().toISOString(),
      "descripcion": "Contexto de conexión NovelistEditor ↔ Aleph Scriptorium",
      "generado_por": "scripts/init-scriptorium-context.js"
    }
  };
}

/**
 * Función principal
 */
function main() {
  console.log('🐂 Inicializando contexto del Scriptorium...\n');

  // Parsear argumentos
  const args = process.argv.slice(2);
  const forceFlag = args.includes('--force');
  const rootIndex = args.indexOf('--scriptorium-root');
  const explicitRoot = rootIndex !== -1 ? args[rootIndex + 1] : null;

  // Verificar si ya existe el archivo
  const contextPath = path.resolve(__dirname, '..', CONFIG.contextFile);
  if (fs.existsSync(contextPath) && !forceFlag) {
    console.log(`ℹ️  ${CONFIG.contextFile} ya existe. Usa --force para sobrescribir.\n`);
    const existing = JSON.parse(fs.readFileSync(contextPath, 'utf8'));
    console.log(`   Scriptorium: ${existing.scriptorium?.root}`);
    console.log(`   Obras: ${existing.obras?.disponibles?.length || 0}`);
    return;
  }

  // Buscar Scriptorium
  let scriptoriumRoot = explicitRoot;
  if (!scriptoriumRoot) {
    console.log('🔍 Buscando Scriptorium...');
    scriptoriumRoot = findScriptorium();
  } else {
    if (!isValidScriptorium(scriptoriumRoot)) {
      console.error(`❌ Ruta no es un Scriptorium válido: ${scriptoriumRoot}`);
      process.exit(1);
    }
    console.log(`✅ Usando Scriptorium en: ${scriptoriumRoot}`);
  }

  if (!scriptoriumRoot) {
    console.error('❌ No se encontró un Scriptorium válido.');
    console.log('\nOpciones:');
    console.log('  1. Establecer ALEPH_SCRIPTORIUM_ROOT en el entorno');
    console.log('  2. Usar --scriptorium-root <path>');
    console.log('  3. Verificar que NovelistEditor es submódulo del Scriptorium');
    process.exit(1);
  }

  // Listar obras
  console.log('\n📚 Obras disponibles:');
  const obras = listObras(scriptoriumRoot);
  console.log(`   Total: ${obras.length} obra(s)\n`);

  // Generar contexto
  const context = generateContext(scriptoriumRoot, obras);

  // Escribir archivo
  fs.writeFileSync(contextPath, JSON.stringify(context, null, 2), 'utf8');
  console.log(`✅ Generado: ${contextPath}\n`);

  // Resumen
  console.log('📋 Resumen:');
  console.log(`   Scriptorium: ${scriptoriumRoot}`);
  console.log(`   Obras: ${obras.length}`);
  obras.forEach(o => console.log(`     - ${o.titulo} (${o.estado})`));
  console.log('\n🎭 Usa el chatmode "escritor" para iniciar una sesión de escritura.');
}

// Ejecutar
main();
