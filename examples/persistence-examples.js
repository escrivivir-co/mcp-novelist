// Este archivo contiene ejemplos del uso del sistema de persistencia para AlephAlpha MCP

/* 
 * EJEMPLO 1: Activar el autoguardado
 * 
 * Esta solicitud habilita el guardado automático después de cada modificación. 
 * Cuando está habilitado, cualquier cambio realizado a través de las herramientas MCP 
 * se guardará automáticamente en el archivo novel-data.json.
 */

// Solicitud:
// POST /api/mcp
// {
//   "jsonrpc": "2.0",
//   "id": "1",
//   "method": "alephAlpha_configureAutoSave",
//   "params": {
//     "enabled": true
//   }
// }

// Respuesta esperada:
// {
//   "jsonrpc": "2.0",
//   "id": "1",
//   "result": {
//     "content": [
//       {
//         "type": "text",
//         "text": "Auto-save has been enabled. Changes will be automatically persisted to disk."
//       }
//     ],
//     "description": "Auto-save enabled"
//   }
// }

/* 
 * EJEMPLO 2: Crear un nuevo personaje (con autoguardado)
 * 
 * Esta solicitud crea un nuevo personaje. Con el autoguardado habilitado,
 * el personaje se guardará automáticamente en el archivo novel-data.json.
 */

// Solicitud:
// POST /api/mcp
// {
//   "jsonrpc": "2.0",
//   "id": "2",
//   "method": "alephAlpha_createCharacter",
//   "params": {
//     "name": "Test Character",
//     "description": "A test character created to demonstrate persistence",
//     "traits": ["curious", "persistent", "logical"],
//     "backstory": "Created during the implementation of the persistence system."
//   }
// }

/* 
 * EJEMPLO 3: Desactivar el autoguardado
 *
 * Esta solicitud deshabilita el guardado automático. Los cambios realizados
 * después de esta solicitud no se guardarán automáticamente.
 */

// Solicitud:
// POST /api/mcp
// {
//   "jsonrpc": "2.0",
//   "id": "3",
//   "method": "alephAlpha_configureAutoSave",
//   "params": {
//     "enabled": false
//   }
// }

/* 
 * EJEMPLO 4: Crear una escena (sin autoguardado)
 *
 * Esta solicitud crea una nueva escena. Con el autoguardado deshabilitado,
 * la escena no se guardará automáticamente en el archivo novel-data.json.
 */

// Solicitud:
// POST /api/mcp
// {
//   "jsonrpc": "2.0",
//   "id": "4",
//   "method": "alephAlpha_createScene",
//   "params": {
//     "title": "Test Scene",
//     "setting": "A digital void where persistence is being tested",
//     "characters": ["char1"],
//     "summary": "A scene created to test the manual persistence system",
//     "content": "The void was empty, waiting for someone to save it from oblivion..."
//   }
// }

/* 
 * EJEMPLO 5: Guardar manualmente el estado actual
 *
 * Esta solicitud guarda manualmente el estado actual en el archivo novel-data.json.
 * Útil después de realizar cambios con el autoguardado deshabilitado.
 */

// Solicitud:
// POST /api/mcp
// {
//   "jsonrpc": "2.0",
//   "id": "5",
//   "method": "alephAlpha_saveCurrentState",
//   "params": {}
// }

// Respuesta esperada:
// {
//   "jsonrpc": "2.0",
//   "id": "5",
//   "result": {
//     "content": [
//       {
//         "type": "text",
//         "text": "All novel resources have been successfully saved to disk and the web catalog has been updated."
//       }
//     ],
//     "description": "State successfully persisted"
//   }
// }

/*
 * EJEMPLO DE FLUJO DE TRABAJO RECOMENDADO
 * 
 * 1. Habilitar autoguardado al inicio de la sesión
 * 2. Realizar cambios (crear/actualizar novelas, capítulos, escenas, personajes)
 * 3. Los cambios se guardarán automáticamente
 * 4. Si es necesario deshabilitar el autoguardado para realizar múltiples cambios relacionados
 * 5. Después de completar los cambios, guardar manualmente con alephAlpha_saveCurrentState
 * 6. Volver a habilitar el autoguardado para futuros cambios
 */
