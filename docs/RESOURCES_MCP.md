# Recursos MCP Implementados en AlephAlpha

Además de las herramientas MCP, el sistema implementa varios recursos MCP que pueden ser accedidos directamente por el modelo de lenguaje o a través de herramientas. Estos recursos están definidos en `src/resources/mcp-resources.ts` y siguen el patrón URI de MCP.

## 1. Recurso de Información del Servidor

**URI**: `aleph://server/info`

**Descripción**: Proporciona información sobre el servidor MCP y sus capacidades.

**Tipo**: Recurso estático.

**Formato de respuesta**:
```json
{
  "name": "AlephCodeAgent",
  "version": "1.0.0",
  "description": "Aleph MCP Server",
  "capabilities": [
    "code-analysis",
    "documentation",
    "novelist-assistant",
    "prompt-templates"
  ]
}
```

## 2. Recursos de Personajes

**URI**: `aleph://novel/character/{characterId}`

**Descripción**: Proporciona información detallada sobre un personaje específico.

**Tipo**: Recurso dinámico con plantilla.

**Funcionalidad de listado**: Sí, devuelve todos los personajes disponibles.

**Formato de respuesta**:
```json
{
  "id": "char1",
  "name": "Elena Vega",
  "description": "Una arqueóloga brillante de 35 años con un pasado misterioso",
  "traits": ["inteligente", "valiente", "desconfiada", "resiliente"],
  "backstory": "Creció en una pequeña ciudad costera..."
}
```

## 3. Recursos de Escenas

**URI**: `aleph://novel/scene/{sceneId}`

**Descripción**: Proporciona información y contenido de una escena específica.

**Tipo**: Recurso dinámico con plantilla.

**Funcionalidad de listado**: Sí, devuelve todas las escenas disponibles.

**Formato de respuesta**:
```json
{
  "id": "scene1",
  "title": "Descubrimiento en la cueva",
  "setting": "Una cueva antigua en los Andes peruanos",
  "characters": [...],
  "summary": "Elena descubre un artefacto extraño...",
  "content": "La linterna de Elena iluminó débilmente..."
}
```

## 4. Recursos de Novelas

**URI**: `aleph://novel/{novelId}`

**Descripción**: Proporciona información detallada sobre una novela específica.

**Tipo**: Recurso dinámico con plantilla.

**Funcionalidad de listado**: Sí, devuelve todas las novelas disponibles.

**Formato de respuesta**:
```json
{
  "id": "novel1",
  "title": "El Secreto de los Antiguos",
  "author": "Usuario",
  "genre": ["aventura", "misterio", "histórica"],
  "summary": "Una arqueóloga descubre un artefacto antiguo...",
  "characters": [...],
  "chapters": [...],
  "setting": "Perú contemporáneo..."
}
```

## 5. Recursos de Plantillas de Prompts

**URI**: `aleph://prompt-templates/{templateId}`

**Descripción**: Proporciona una plantilla de prompt específica para escritura creativa.

**Tipo**: Recurso dinámico con plantilla.

**Funcionalidad de listado**: Sí, devuelve todas las plantillas disponibles.

**Formato de respuesta**:
```json
{
  "id": "start-novel",
  "name": "Comenzar nueva novela",
  "description": "Plantilla para iniciar una nueva novela desde cero",
  "template": "Ayúdame a comenzar una nueva novela de género {{genre}}...",
  "variables": ["genre", "theme", "setting", "protagonist"]
}
```

## 6. Recurso de Índice de Recursos

**URI**: `aleph://resources/index`

**Descripción**: Proporciona un índice HTML de todos los recursos disponibles en el servidor.

**Tipo**: Recurso estático.

**Formato de respuesta**: HTML que muestra todos los recursos categorizados.

**Acceso alternativo**: También disponible a través de navegador en `http://localhost:3000/resources`

## Implementación Técnica

### Registrando Recursos en el Servidor

Los recursos se registran en el archivo `src/resources/mcp-resources.ts` utilizando la función `registerMcpResources` que es llamada desde `index.ts` al iniciar el servidor:

```typescript
// Ejemplo simplificado del registro de recursos
export function registerMcpResources(server: McpServer): void {
  // Recurso estático
  server.resource(
    "server-info",
    "aleph://server/info",
    async (uri) => ({
      contents: [{
        uri: uri.href,
        mimeType: "application/json",
        text: JSON.stringify({
          name: "AlephCodeAgent",
          version: "1.0.0",
          // ...
        })
      }]
    })
  );

  // Recurso dinámico con plantilla
  server.resource(
    "character",
    new ResourceTemplate("aleph://novel/character/{characterId}", {
      // Función de listado - devuelve todos los recursos disponibles
      list: async () => ({ 
        resources: [
          { name: "Personaje 1", uri: "aleph://novel/character/char1" },
          // ...
        ] 
      })
    }),
    async (uri, params) => ({
      contents: [{
        uri: uri.href,
        mimeType: "application/json",
        text: JSON.stringify(characterData)
      }]
    })
  );
}
```

### Estructura de Datos

Los datos de personajes, escenas, novelas y plantillas se cargan desde `novel-data.json` utilizando el `NovelResourceLoader` que implementa el patrón Singleton para mantener una única instancia de los datos en memoria.

## Validación y Pruebas

Para comprobar que los recursos MCP están funcionando correctamente:

1. Inicia el servidor MCP: `npm run start`
2. Utiliza el MCP Inspector: `npm run inspector` o `mcp-inspector --server http://localhost:3000`
3. Para cada recurso, verifica que:
   - Se muestra correctamente en la lista de recursos
   - Puedes acceder a él utilizando su URI
   - El contenido devuelto es el esperado

## Integración con Herramientas

Los recursos MCP se integran con las herramientas del servidor, como se muestra en este diagrama:

```
┌─────────────────┐       ┌───────────────────┐       ┌─────────────────┐
│                 │       │                   │       │                 │
│  GitHub Copilot │◄─────►│  Servidor MCP     │◄─────►│  Recursos MCP   │
│                 │       │                   │       │                 │
└─────────────────┘       └───────────────────┘       └─────────────────┘
                                    ▲
                                    │
                                    ▼
                          ┌─────────────────────┐
                          │                     │
                          │  Herramientas MCP   │
                          │                     │
                          └─────────────────────┘
```

Para más información sobre cómo los recursos, herramientas y prompts trabajan juntos, consulta [INTEGRATION.md](INTEGRATION.md).

**Funcionalidad de listado**: Sí, devuelve todas las plantillas disponibles.

**Formato de respuesta**:
```json
{
  "id": "develop-character",
  "name": "Desarrollar personaje",
  "description": "Plantilla para desarrollar un personaje en profundidad",
  "template": "Necesito desarrollar un personaje llamado {{name}}...",
  "variables": ["name", "novelTitle", "briefDescription"]
}
```

## 6. Índice de Recursos

**URI**: `aleph://resources/index`

**Descripción**: Proporciona un índice HTML de todos los recursos disponibles en el sistema.

**Tipo**: Recurso estático.

**Formato de respuesta**: Documento HTML con enlaces y descripciones de todos los recursos disponibles.

## Implementación

Los recursos MCP están implementados en el archivo `src/resources/mcp-resources.ts` utilizando la función `server.resource()` del SDK de MCP. Para los recursos dinámicos, se utiliza la clase `ResourceTemplate` que permite definir patrones de URI con variables.

```typescript
// Ejemplo de recurso estático
server.resource(
  "server-info",
  "aleph://server/info",
  async (uri) => ({
    contents: [{
      uri: uri.href,
      mimeType: "application/json",
      text: JSON.stringify({
        name: "AlephCodeAgent",
        version: "1.0.0",
        description: "Aleph MCP Server",
        capabilities: [
          "code-analysis",
          "documentation",
          "novelist-assistant",
          "prompt-templates"
        ]
      }, null, 2)
    }]
  })
);

// Ejemplo de recurso dinámico con plantilla
server.resource(
  "character",
  new ResourceTemplate("aleph://novel/character/{characterId}", {
    list: async () => {
      const characters = novelResourceLoader.getCharacters();
      const resourceList = Object.keys(characters).map(id => ({
        name: characters[id].name,
        uri: `aleph://novel/character/${id}`,
        description: characters[id].description.substring(0, 100)
      }));
      
      return {
        resources: resourceList
      };
    }
  }),
  async (uri, { characterId }) => {
    const character = novelResourceLoader.getCharacter(characterId);
    
    if (!character) {
      throw new Error(`Character with ID ${characterId} not found`);
    }
    
    return {
      contents: [{
        uri: uri.href,
        mimeType: "application/json",
        text: JSON.stringify(character, null, 2)
      }]
    };
  }
);
```

## Acceso a los Recursos

Los recursos MCP pueden ser accedidos de dos maneras:

1. **Directamente a través del protocolo MCP**: Los clientes MCP pueden acceder directamente a los recursos a través de sus URIs.

2. **A través de herramientas MCP**: Las herramientas como `getCharacterDetails` o `getNovelDetails` utilizan internamente los recursos para obtener la información solicitada.
