# Guía para agentes MCP: uso de `mcp-novelist`

Esta guía práctica explica cómo un host/agente MCP puede descubrir y usar las capacidades del servidor en este repositorio. Todo lo descrito aquí está contrastado con el código fuente real en `src/`.

## Qué expone este servidor

- Transporte: HTTP streamable (SDK: `StreamableHTTPServerTransport`)
  - Por defecto escucha en `http://localhost:3066` (configurable por .env)
- Capacidades MCP:
  - Tools (herramientas)
  - Resources (recursos legibles por URI)
  - Prompts (plantillas con variables)
- Persistencia: guardado a disco en `src/resources/novel-data.json` con auto-guardado activado por defecto

## Variables de entorno relevantes (src/index.ts)

- MCP_HTTP_HOST: host HTTP (por defecto `localhost`)
- MCP_HTTP_PORT: puerto HTTP (por defecto `3066`)
- MCP_SERVER_NAME: nombre del servidor (por defecto `AlephCodeAgent`)
- MCP_SERVER_VERSION: versión del servidor (por defecto `1.0.0`)
- LOG_LEVEL: `debug` | `info` | `error` (por defecto `info`)

Copia `.env.example` a `.env` y ajusta según necesites.

## Arranque del servidor

- Modo desarrollo: `npm run dev` (usa `tsx` sobre `src/index.ts`)
- Producción: `npm start` (compila y ejecuta `dist/index.js`)

Al iniciar se registran:
- Herramientas: `registerPromptTools`, `registerCodeTools`, `registerDocumentationTools`, `registerNovelistTools`, `registerNovelistExtensionTools`
- Recursos MCP: `registerMcpResources`
- Prompts MCP: `registerMcpPrompts`

Además, ejecuta `scripts/update-catalog.js` para generar el catálogo web de novelas.

## Conexión desde un host MCP

- Este servidor usa transporte HTTP streamable. Un host MCP compatible con HTTP deberá apuntar a `http://<MCP_HTTP_HOST>:<MCP_HTTP_PORT>`.
- Para clientes SDK, usa el transporte HTTP streamable de cliente correspondiente. Nota: el CLI incluido en `src/client-cli.ts` usa WebSocket por defecto y no coincide con el transporte del servidor; úsalo sólo si expones un transporte WebSocket alternativo.

## Resources (URIs) disponibles (src/resources/mcp-resources.ts)

Puedes descubrirlos con `resources/list` y leerlos con `resources/read`:
- server-info: `aleph://server/info` — JSON con nombre, versión y capacidades
- character: `aleph://novel/character/{characterId}` — lista y lectura dinámica
- scene: `aleph://novel/scene/{sceneId}` — lista y lectura dinámica (incluye `characterDetails`)
- novel: `aleph://novel/{novelId}` — lista y lectura dinámica (incluye `chapterDetails` y `characterDetails`)
- prompt-template: `aleph://prompt-templates/{templateId}` — lista y lectura dinámica
- resource-index: `aleph://resources/index` — HTML con índice navegable

Sugerencia de flujo:
1) `resources/list` sobre `novel` para obtener IDs de novelas
2) `resources/read` de `aleph://novel/<id>` para detalles
3) Opcionalmente recorrer `scene` y `character`

## Prompts disponibles (src/resources/mcp-prompts.ts)

El servidor registra prompts MCP a partir de dos fuentes:
- Genéricos de código desde `src/tools/templates.ts` con prefijo `code_...`
- De novela desde `novel-data.json` con prefijo `novel_...`

Descúbrelos con `prompts/list`. Para usarlos, invoca `prompts/get` con el ID y pasa las variables que exige la plantilla. Ejemplos típicos de novela: `novel_start-novel`, `novel_develop-character`, `novel_plot-development`, `novel_continue-scene`, `novel_writing-feedback`.

## Catálogo de Tools (src/tools/*)

Entre paréntesis se indican los parámetros esperados.

- Prompt tools (src/tools/prompt-tools.ts)
  - alephAlpha_listPromptTemplates ()
  - alephAlpha_getPromptTemplate (name: string)
  - alephAlpha_applyPromptTemplate (templateName: string, variables: Record<string,string>)

- Code tools (src/tools/code-tools.ts)
  - alephAlpha_analyzeCode (code: string, language: string)
  - alephAlpha_findCodeExamples (topic: string, language: string)

- Documentation tools (src/tools/documentation-tools.ts)
  - alephAlpha_getDocumentation (topic: string)
  - alephAlpha_searchDocumentation (query: string, limit?: number)

- Novelist tools base (src/tools/novelist-tools.ts)
  - alephAlpha_listNovels ()
  - alephAlpha_getNovelDetails (novelId: string)
  - alephAlpha_listCharacters (novelId?: string)
  - alephAlpha_getCharacterDetails (characterId: string)
  - alephAlpha_getScene (sceneId: string)
  - alephAlpha_listNovelistPromptTemplates ()
  - alephAlpha_getNovelistPromptTemplate (templateId: string)
  - alephAlpha_applyNovelistPromptTemplate (templateId: string, variables: Record<string,string>)
  - alephAlpha_saveCurrentState ()
  - alephAlpha_configureAutoSave (enabled: boolean)
  - alephAlpha_listScenes ()
  - alephAlpha_listScenesByNovel (novelId: string)
  - alephAlpha_listScenesByChapter (chapterId: string)

- Novelist tools extendidas (src/tools/novelist-extension-tools.ts)
  - alephAlpha_createScene (title: string, setting: string, characters: string[], summary: string, content?: string, novelId?: string)
  - alephAlpha_createChapter (title: string, scenes: string[], summary: string, novelId: string)
  - alephAlpha_createCharacter (name: string, description: string, traits: string[], backstory: string, novelId?: string)
  - alephAlpha_createNovel (title: string, author: string, genre: string[], summary: string, setting: string, characters?: string[], chapters?: string[])
  - alephAlpha_updateScene (sceneId: string, title?: string, setting?: string, characters?: string[], summary?: string, content?: string)
  - alephAlpha_createChapterWithScenes (novelId: string, chapterTitle: string, chapterSummary: string, sceneDescriptions: Array<{ title: string, setting: string, summary: string, characterIds: string[] }>)
  - alephAlpha_createPvsNPChapter (novelId: string)
  - alephAlpha_deleteChapter (chapterId: string, novelId: string, deleteScenes?: boolean)

Notas:
- Todas las herramientas validan argumentos con Zod; respeta tipos/obligatoriedad.
- Las respuestas vienen en `content: [{ type: 'text', text: ... }]` (formato común MCP).

## Persistencia y catálogo web

- Auto-guardado: activo por defecto. Puedes desactivarlo con `alephAlpha_configureAutoSave { enabled: false }`.
- Guardado manual: `alephAlpha_saveCurrentState`.
- Cada guardado actualiza también el catálogo web (vía `NovelResourceLoader.updateCatalogForWeb()` y `scripts/update-catalog.js`).
- Archivo destino: `src/resources/novel-data.json`.

## Flujo recomendado para agentes (Novelist Assistant)

1) Explora `alephAlpha_listNovels` y, si procede, `alephAlpha_getNovelDetails`.
2) Lista personajes con `alephAlpha_listCharacters` o crea nuevos con `alephAlpha_createCharacter`.
3) Lista/crea escenas y capítulos con las herramientas extendidas.
4) Usa prompts de novela: `alephAlpha_listNovelistPromptTemplates` → `alephAlpha_getNovelistPromptTemplate` → `alephAlpha_applyNovelistPromptTemplate`.
5) Persiste cambios si el auto-guardado está desactivado.

## Ejemplos de llamadas (JSON-RPC sobre MCP)

- tools/list: descubre herramientas registradas
- tools/call: por ejemplo `alephAlpha_analyzeCode` con `{ code, language }`
- resources/list + resources/read: descubre y lee `aleph://novel/<id>`
- prompts/list + prompts/get: resuelve plantillas `novel_*`/`code_*`

No todos los hosts requieren que construyas JSON-RPC a mano; la mayoría exponen UI o comandos nativos para estas operaciones.

## Compatibilidad de nombres en algunos hosts

En ciertos hosts (p.ej., integraciones con GitHub Copilot) puede aparecer un prefijo adicional como `a0b_` delante del nombre de la herramienta. Si ves `a0b_alephAlpha_listNovels`, corresponde a `alephAlpha_listNovels` del servidor.

## Solución de problemas

- No me conecto: verifica que el servidor corre en `http://<host>:<port>` y que tu host MCP soporta transporte HTTP streamable.
- 404/500 al leer recursos: primero usa `resources/list` para obtener IDs válidos.
- Parámetros inválidos: revisa tipos y obligatorios según este documento y los esquemas Zod.
- CLI del repo: el `client-cli` usa WebSocket; no funcionará contra este servidor HTTP salvo que añadas un transporte WS.

## Referencias de código

- Entrada del servidor: `src/index.ts`
- Tools: `src/tools/*.ts`
- Recursos MCP: `src/resources/mcp-resources.ts`
- Prompts MCP: `src/resources/mcp-prompts.ts`
- Persistencia: `src/resources/persistence-manager.ts`, `src/resources/novel-data.json`

---
Si necesitas ampliar esta guía con ejemplos específicos para tu host MCP (Claude Desktop, VS Code, etc.), abre una issue y los añadimos.
