# Integración de Recursos, Herramientas y Prompts MCP

En un servidor MCP completo como AlephAlpha, estos tres componentes se relacionan de la siguiente manera:

## Recursos

Los recursos son fuentes de datos de solo lectura que proporcionan información estructurada. Se definen con `server.resource()` en el código del servidor.

```typescript
// Ejemplo de definición de un recurso estático
server.resource(
  "server-info",
  "aleph://server/info",
  async (uri) => ({
    contents: [{
      uri: uri.href,
      mimeType: "application/json",
      text: JSON.stringify({ name: "AlephMCP", version: "1.0.0" })
    }]
  })
);

// Ejemplo de definición de un recurso dinámico con plantilla
server.resource(
  "character",
  new ResourceTemplate("aleph://novel/character/{characterId}", {
    list: async () => ({
      resources: [
        { name: "Character 1", uri: "aleph://novel/character/1" },
        { name: "Character 2", uri: "aleph://novel/character/2" }
      ]
    })
  }),
  async (uri, { characterId }) => ({
    contents: [{ uri: uri.href, mimeType: "application/json", text: JSON.stringify(characterData) }]
  })
);
```

## Herramientas

Las herramientas son funciones ejecutables que pueden realizar acciones o acceder a recursos. Se definen con `server.tool()` en el código del servidor.

```typescript
// Ejemplo de definición de una herramienta
server.tool(
  "alephAlpha_getCharacterDetails",
  "Gets detailed information about a character",
  {
    characterId: z.string().describe('ID of the character to retrieve')
  },
  async ({ characterId }) => {
    // Internamente podría acceder al recurso aleph://novel/character/{characterId}
    const character = await getCharacterById(characterId);
    return {
      content: [{ type: 'text', text: JSON.stringify(character) }],
      description: `Character information for ${character.name}`
    };
  }
);
```

## Prompts

Los prompts son plantillas predefinidas que pueden ser utilizadas directamente. Se implementan como herramientas especializadas.

```typescript
// Ejemplo de herramienta para obtener una plantilla de prompt
server.tool(
  "alephAlpha_getPromptTemplate",
  "Retrieves a specific prompt template",
  {
    name: z.string().describe('Name of the template to retrieve')
  },
  async ({ name }) => {
    const template = promptTemplates[name];
    return {
      content: [{ type: 'text', text: template || "Template not found" }],
      description: "Retrieves a prompt template"
    };
  }
);
```

## Flujo de Funcionamiento

1. **Registro de Componentes**: Al iniciar el servidor, se registran los recursos, herramientas y prompts utilizando las funciones `server.resource()`, `server.tool()` y objetos de plantillas de prompts.

2. **Acceso desde Clientes MCP**: Cuando un cliente MCP (como GitHub Copilot) se conecta al servidor, puede:
   - Listar los recursos disponibles
   - Acceder a recursos específicos mediante sus URIs
   - Invocar herramientas con parámetros específicos
   - Obtener y aplicar plantillas de prompts

3. **Interacción con el Usuario**: El modelo de lenguaje interactúa con estos componentes para proporcionar respuestas enriquecidas y funcionalidades específicas al usuario.

## Beneficios de la Arquitectura

- **Separación de Responsabilidades**: Los recursos proporcionan datos, las herramientas proporcionan funcionalidades, y los prompts proporcionan plantillas.
- **Extensibilidad**: Fácil adición de nuevos recursos, herramientas y prompts sin modificar el código existente.
- **Consistencia**: Interfaz unificada para acceder a diferentes tipos de información y funcionalidades.
- **Descubrimiento**: Capacidad de listar y explorar los componentes disponibles en tiempo de ejecución.
