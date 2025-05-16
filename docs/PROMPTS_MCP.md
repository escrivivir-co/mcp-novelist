# Prompts MCP en AlephAlpha

Los prompts MCP son plantillas predefinidas que pueden ser utilizadas por el modelo de lenguaje para diversas tareas como análisis de código, depuración, documentación y escritura creativa. Este documento detalla los diferentes tipos de prompts disponibles en el servidor AlephAlpha.

## Prompts Genéricos para Código

Estos prompts están definidos en `src/tools/templates.ts` y se acceden a través de las herramientas en `src/tools/prompt-tools.ts`.

| ID            | Nombre           | Descripción                                  | Variables                                   |
|---------------|------------------|----------------------------------------------|---------------------------------------------|
| `code-review` | Code Review      | Revisión de código                           | `code`                                      |
| `debug-help`  | Debug Help       | Ayuda con depuración                         | `language`, `error`, `code`                 |
| `documentation` | Documentation  | Generación de documentación                  | `language`, `code`                          |
| `refactor`    | Refactor         | Refactorización de código                    | `language`, `aspect`, `code`                |
| `unit-test`   | Unit Test        | Generación de pruebas unitarias              | `language`, `code`, `framework`             |

### Ejemplos de Prompts Genéricos

#### Code Review
```
Review this code:

```[código a revisar]```

Provide feedback on:
1. Readability
2. Efficiency
3. Best practices
```

#### Debug Help
```
I need help debugging the following error in [language]:

```[mensaje de error]```

Related code:

```[código relacionado]```
```

## Prompts para Novelistas

Estos prompts están definidos en `novel-data.json` y se acceden a través de las herramientas en `src/tools/novelist-tools.ts`.

| ID                 | Nombre               | Descripción                                  | Variables                                       |
|--------------------|----------------------|----------------------------------------------|------------------------------------------------|
| `start-novel`      | Comenzar nueva novela | Iniciar una nueva novela desde cero         | `genre`, `theme`, `setting`, `protagonist`      |
| `develop-character`| Desarrollar personaje | Desarrollar un personaje en profundidad     | `name`, `novelTitle`, `briefDescription`        |
| `continue-scene`   | Continuar escena     | Continuar escribiendo una escena en curso    | `novelTitle`, `sceneContent`, `characters`, `mood`, `focus` |
| `plot-development` | Desarrollo de trama  | Generar ideas de desarrollo de trama         | `novelTitle`, `genre`, `premise`, `characters`, `currentPlot`, `direction` |
| `writing-feedback` | Retroalimentación    | Obtener feedback sobre un fragmento escrito  | `novelTitle`, `content`                        |

### Ejemplos de Prompts para Novelistas

#### Desarrollar Personaje
```
Necesito desarrollar un personaje llamado [nombre] para mi novela [título]. Este personaje es [descripción breve]. Ayúdame a crear:

1. Un pasado detallado
2. Rasgos de personalidad
3. Motivaciones y conflictos internos
4. Apariencia física
5. Hábitos y manías características
```

#### Continuar Escena
```
Estoy escribiendo una escena para mi novela [título]. Hasta ahora he escrito:

[contenido de la escena]

Los personajes presentes son: [personajes]. El ambiente es [ambiente]. Por favor, ayúdame a continuar esta escena enfocándote en [enfoque].
```

## Implementación Técnica

### Prompts Genéricos

Los prompts genéricos están implementados como un objeto simple en `src/tools/templates.ts`:

```typescript
export const promptTemplates: Record<string, string> = {
  "code-review": "Review this code:\n\n```{{code}}```\n\nProvide feedback on:\n1. Readability\n2. Efficiency\n3. Best practices",
  "debug-help": "I need help debugging the following error in {{language}}:\n\n```{{error}}```\n\nRelated code:\n\n```{{code}}```",
  // ...más plantillas
};
```

### Prompts para Novelistas

Los prompts para novelistas están almacenados en `novel-data.json` y tienen una estructura más compleja:

```json
{
  "promptTemplates": [
    {
      "id": "start-novel",
      "name": "Comenzar nueva novela",
      "description": "Plantilla para iniciar una nueva novela desde cero",
      "template": "Ayúdame a comenzar una nueva novela de género {{genre}}...",
      "variables": ["genre", "theme", "setting", "protagonist"]
    },
    // ...más plantillas
  ]
}
```

## Herramientas de Acceso a Prompts

### Para Prompts Genéricos

- `alephAlpha_listPromptTemplates`: Lista todas las plantillas disponibles
- `alephAlpha_getPromptTemplate`: Obtiene una plantilla específica
- `alephAlpha_applyPromptTemplate`: Aplica variables a una plantilla

### Para Prompts de Novelistas

- `alephAlpha_listNovelistPromptTemplates`: Lista todas las plantillas para escritura
- `alephAlpha_getNovelistPromptTemplate`: Obtiene una plantilla específica para escritura
- `alephAlpha_applyNovelistPromptTemplate`: Aplica variables a una plantilla para escritura

## Recursos MCP para Prompts

Los prompts de novelistas también están disponibles como recursos MCP accesibles a través de la URI `aleph://prompt-templates/{templateId}`. Esto permite listar y acceder a las plantillas directamente a través del protocolo MCP.

## Uso Recomendado

Para aplicaciones de análisis y desarrollo de código, se recomienda usar los prompts genéricos. Para tareas de escritura creativa y desarrollo de novelas, se recomienda usar los prompts específicos para novelistas.

Los prompts pueden ser adaptados y extendidos según las necesidades específicas del usuario o proyecto.
