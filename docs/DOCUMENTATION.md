# Documentación de Aleph MCP

## Introducción

Aleph MCP (Model Context Protocol) es una implementación avanzada del Protocolo de Contexto del Modelo que facilita la comunicación entre modelos de lenguaje y entornos de desarrollo. Este protocolo permite expandir las capacidades de los agentes de IA como GitHub Copilot, proporcionando herramientas personalizadas y funcionalidades extendidas.

## Componentes Principales

### 1. Servidor MCP

El servidor MCP actúa como intermediario entre el modelo de lenguaje y el entorno de desarrollo. Procesa las solicitudes, ejecuta las herramientas personalizadas y devuelve los resultados al modelo.

```typescript
// Ejemplo básico de inicialización del servidor
import { startMCPServer } from 'aleph-mcp';

startMCPServer({
  port: 3000,
  tools: [...customTools],
  debug: true
});
```

### 2. Cliente MCP

El cliente MCP se integra con el entorno de desarrollo y se comunica con el servidor MCP para proporcionar las capacidades extendidas al modelo de lenguaje.

```typescript
// Ejemplo de configuración del cliente
import { MCPClient } from 'aleph-mcp';

const client = new MCPClient({
  serverUrl: 'http://localhost:3000'
});

client.connect();
```

### 3. Herramientas Personalizadas

Aleph MCP incluye varias categorías de herramientas personalizadas:

#### Herramientas de Código
- `analyzeCode`: Analiza fragmentos de código para proporcionar información sobre estructura, complejidad y posibles problemas.
- `findCodeExamples`: Busca ejemplos de código sobre un tema específico en un lenguaje determinado.

#### Herramientas de Documentación
- `getDocumentation`: Recupera documentación sobre un tema de programación específico.
- `searchDocumentation`: Realiza búsquedas en recursos de documentación.

#### Herramientas para Novelist Assistant
- `listNovels`: Lista todas las novelas disponibles.
- `getNovelDetails`: Obtiene información detallada sobre una novela específica.
- `listCharacters`: Lista todos los personajes disponibles.
- `getCharacterDetails`: Obtiene información detallada sobre un personaje.
- `getScene`: Recupera el contenido de una escena específica.

#### Herramientas de Prompts
- `listPromptTemplates`: Lista todas las plantillas de prompts disponibles.
- `getPromptTemplate`: Recupera una plantilla de prompt específica.
- `applyPromptTemplate`: Aplica variables a una plantilla y devuelve el texto resultante.

#### Herramientas de Prompts para Novelist
- `listNovelistPromptTemplates`: Lista todas las plantillas específicas para escritura creativa.
- `getNovelistPromptTemplate`: Recupera una plantilla específica para escritura creativa.
- `applyNovelistPromptTemplate`: Aplica variables a una plantilla de escritura creativa.

### 4. Recursos MCP

Aleph MCP expone datos a través de recursos MCP, que son fuentes de información de solo lectura accesibles mediante URIs. Estos recursos se implementan en `src/resources/mcp-resources.ts`.

#### Tipos de Recursos
- **Recurso de Información del Servidor**: Proporciona metadatos sobre el servidor MCP.
  - URI: `aleph://server/info`
  
- **Recursos de Personajes**: Proporcionan información sobre personajes de novela.
  - URI: `aleph://novel/character/{characterId}`
  - Listado: Disponible mediante la funcionalidad de listado de recursos.
  
- **Recursos de Escenas**: Proporcionan contenido de escenas específicas.
  - URI: `aleph://novel/scene/{sceneId}`
  - Listado: Disponible mediante la funcionalidad de listado de recursos.
  
- **Recursos de Novelas**: Proporcionan información detallada sobre novelas.
  - URI: `aleph://novel/{novelId}`
  - Listado: Disponible mediante la funcionalidad de listado de recursos.
  
- **Recursos de Plantillas de Prompts**: Proporcionan plantillas predefinidas para escritura creativa.
  - URI: `aleph://prompt-templates/{templateId}`
  - Listado: Disponible mediante la funcionalidad de listado de recursos.
  
- **Recurso de Índice**: Proporciona un índice HTML de todos los recursos disponibles.
  - URI: `aleph://resources/index`
- `getNovelistSystemInfo`: Proporciona información sobre el sistema Novelist Assistant.
- `listNovels`: Lista todas las novelas disponibles.
- `getNovelDetails`: Obtiene información detallada sobre una novela.
- `listCharacters`: Lista todos los personajes de una novela.
- `getCharacterDetails`: Obtiene información detallada sobre un personaje.
- `getScene`: Obtiene el contenido de una escena específica.

## Configuración del Servidor MCP

### Requisitos Previos

- Node.js v14 o superior
- npm o yarn

### Instalación

```bash
# Clonar el repositorio
git clone https://github.com/escrivivir-co/mcp-novelist.git

# Entrar al directorio
cd aleph-mcp

# Instalar dependencias
npm install

# Configurar el archivo .env
cp .env.example .env
# Editar .env con tus configuraciones
```

### Ejecución del Servidor

```bash
# Para desarrollo con hot-reload
npm run dev

# Para producción (después de compilar)
npm run start
```

Por defecto, el servidor se ejecutará en `http://localhost:3000`. También puedes usar el script incorporado para ejecutar el MCP Inspector fácilmente:

```bash
npm run inspector
```

## Integración con VS Code

### Configuración de GitHub Copilot

Para utilizar Aleph MCP con GitHub Copilot en VS Code, debes:

1. Asegurarte de que tienes instalada la extensión de GitHub Copilot.
2. Iniciar el servidor MCP como se describe arriba.
3. Modificar la configuración de VS Code para apuntar al servidor MCP:

```json
{
  "github.copilot.advanced": {
    "model": "mcp://localhost:3000"
  }
}
```

### Verificación de la Conexión

Para verificar que VS Code se está comunicando correctamente con el servidor MCP:

1. Abre la paleta de comandos en VS Code (Ctrl+Shift+P / Cmd+Shift+P).
2. Escribe y selecciona "Developer: Toggle Developer Tools".
3. En la consola, busca mensajes que indiquen la conexión con el servidor MCP.

### Verificación de Recursos MCP

Para comprobar que los recursos MCP funcionan correctamente:

1. Instala MCP Inspector ejecutando `npm install -g @modelcontextprotocol/inspector`.
2. Con el servidor ejecutándose, abre otra terminal y ejecuta `mcp-inspector --server http://localhost:3000`.
3. El inspector te mostrará todos los recursos disponibles y te permitirá probarlos interactivamente.
4. Verifica los siguientes recursos:
   - `aleph://server/info`: Información del servidor
   - `aleph://novel/character/{characterId}`: Detalles de personajes
   - `aleph://novel/scene/{sceneId}`: Contenido de escenas
   - `aleph://novel/{novelId}`: Información de novelas
   - `aleph://prompt-templates/{templateId}`: Plantillas de prompts
   - `aleph://resources/index`: Índice HTML de recursos

También puedes acceder a `http://localhost:3000/resources` en tu navegador para ver el índice de recursos en formato HTML.

## Catálogo de Novelas

Aleph MCP incluye un catálogo web interactivo para explorar novelas, personajes y escenas. Este catálogo está accesible desde:

- [http://localhost:8080/novel-catalog.html](http://localhost:8080/novel-catalog.html) (cuando sirves la carpeta docs con un servidor local)
- [https://tu-usuario.github.io/aleph-mcp/novel-catalog.html](https://tu-usuario.github.io/aleph-mcp/novel-catalog.html) (si has desplegado en GitHub Pages)

### Actualización del Catálogo

Para actualizar el catálogo web con los datos más recientes:

```bash
npm run update-catalog
```

## Uso de las Herramientas Personalizadas

Una vez configurado, puedes acceder a las herramientas personalizadas desde Copilot en VS Code. Por ejemplo:

- Para utilizar el Novelist Assistant: "¿Puedes ayudarme a desarrollar un personaje para mi novela?"
- Para analizar código: "¿Puedes analizar este fragmento de código JavaScript?"
- Para buscar documentación: "¿Puedes explicarme cómo funcionan los Promises en JavaScript?"

## Desarrollo de Herramientas Personalizadas

Puedes desarrollar tus propias herramientas personalizadas para Aleph MCP siguiendo este patrón:

```typescript
import { Tool, ToolParameter } from 'aleph-mcp';

const myCustomTool: Tool = {
  name: 'myTool',
  description: 'Descripción de lo que hace la herramienta',
  parameters: {
    param1: {
      type: 'string',
      description: 'Descripción del primer parámetro'
    },
    param2: {
      type: 'number',
      description: 'Descripción del segundo parámetro'
    }
  },
  execute: async (params: any) => {
    // Implementación de la herramienta
    return { result: 'Resultado de la herramienta' };
  }
};

// Agregar la herramienta al servidor MCP
registerTool(myCustomTool);
```

## Resolución de Problemas

### El Servidor MCP No Inicia

- Verifica que no haya otro proceso usando el puerto 3000.
- Asegúrate de que todas las dependencias estén instaladas.
- Revisa los logs en la consola para errores específicos.

### VS Code No Se Conecta al Servidor MCP

- Verifica que el servidor MCP esté en ejecución.
- Asegúrate de que la configuración en VS Code es correcta.
- Comprueba si hay algún firewall bloqueando la conexión.

### Las Herramientas Personalizadas No Responden

- Verifica los logs del servidor para ver si hay errores.
- Comprueba que la sintaxis de la solicitud es correcta.
- Asegúrate de que la herramienta está registrada correctamente en el servidor.

## Recursos Adicionales

- [Repositorio de GitHub](https://github.com/escrivivir-co/mcp-novelist)
- [Guía de Contribución](CONTRIBUTING.md)
- [Código de Conducta](CODE_OF_CONDUCT.md)
- [Licencia](LICENSE)

## Licencia

Aleph MCP se distribuye bajo la licencia MIT. Consulta el archivo [LICENSE](LICENSE) para más detalles.
