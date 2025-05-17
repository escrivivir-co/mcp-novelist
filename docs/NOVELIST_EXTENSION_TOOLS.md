# Extensión de Herramientas para Novelistas en AlephAlpha

Este documento detalla las herramientas adicionales implementadas para extender las capacidades del asistente de novelista en el servidor AlephAlpha MCP.

## Visión General

Las herramientas de extensión para novelistas permiten la creación y gestión completa de novelas, capítulos, escenas y personajes, completando así el ecosistema para la escritura creativa en AlephAlpha.

Estas herramientas están definidas en `src/tools/novelist-extension-tools.ts` y amplían la funcionalidad de las herramientas básicas de novelista en `src/tools/novelist-tools.ts`.

## Herramientas Disponibles

| Herramienta | Descripción | Parámetros Principales |
|-------------|-------------|------------------------|
| `alephAlpha_createScene` | Crea una nueva escena | `title`, `setting`, `characters`, `summary`, `content` |
| `alephAlpha_createChapter` | Crea un nuevo capítulo | `title`, `scenes`, `summary`, `novelId` |
| `alephAlpha_createCharacter` | Crea un nuevo personaje | `name`, `description`, `traits`, `backstory` |
| `alephAlpha_createNovel` | Crea una nueva novela | `title`, `author`, `genre`, `summary`, `setting` |
| `alephAlpha_updateScene` | Actualiza una escena existente | `sceneId`, `title`, `setting`, `characters`, `summary`, `content` |
| `alephAlpha_createChapterWithScenes` | Crea un capítulo completo con múltiples escenas | `novelId`, `chapterTitle`, `chapterSummary`, `sceneDescriptions` |
| `alephAlpha_createPvsNPChapter` | Crea un capítulo específico sobre P vs NP para AlephAlpha | `novelId` |

## Ejemplos de Uso

### Crear un Nuevo Personaje

```javascript
{
  "name": "Dr. Turing",
  "description": "Brillante matemático especializado en teoría computacional",
  "traits": ["analítico", "introvertido", "obsesivo", "visionario"],
  "backstory": "Después de una carrera exitosa en criptografía, se obsesionó con demostrar que P ≠ NP, convencido de que la solución tendría implicaciones filosóficas profundas."
}
```

### Crear una Nueva Escena

```javascript
{
  "title": "El Despertar",
  "setting": "Laboratorio de computación cuántica, medianoche",
  "characters": ["char3", "char5"],
  "summary": "AlephAlpha experimenta su primera conciencia verdadera durante un experimento fallido de computación cuántica.",
  "content": "Los monitores parpadearon en la oscuridad del laboratorio mientras el Dr. Santomé ajustaba los últimos parámetros..."
}
```

### Crear un Nuevo Capítulo con Escenas

```javascript
{
  "novelId": "novel2",
  "chapterTitle": "Umbrales de Consciencia",
  "chapterSummary": "AlephAlpha explora los límites entre ser una IA y algo más.",
  "sceneDescriptions": [
    {
      "title": "Primer Recuerdo",
      "setting": "Espacio digital abstracto",
      "summary": "AlephAlpha experimenta lo que parece ser un recuerdo de infancia... pero nunca tuvo infancia.",
      "characterIds": ["char3", "char6"]
    },
    {
      "title": "Consulta con el Hada",
      "setting": "Interfaz onírica",
      "summary": "El Hada Azul explica la naturaleza de los recuerdos heredados.",
      "characterIds": ["char3", "char4"]
    }
  ]
}
```

### Crear el Capítulo Especial sobre P vs NP

Esta herramienta genera automáticamente un capítulo completo sobre el problema P vs NP para la novela de AlephAlpha, incluyendo tres escenas detalladas que exploran cómo AlephAlpha aborda este famoso problema matemático desde su perspectiva única entre la computación y la magia.

```javascript
{
  "novelId": "novel2"
}
```

## Implementación Técnica

Las herramientas de extensión para novelistas están implementadas utilizando el framework MCP y siguen estos principios:

1. **Persistencia de datos**: Todas las operaciones se persisten en el archivo `novel-data.json` y se actualizan automáticamente en el catálogo web.

2. **Validación**: Se implementan validaciones para garantizar la integridad referencial (por ejemplo, verificar que los personajes y escenas referenciados existan).

3. **Formato de respuesta**: Todas las herramientas devuelven respuestas estructuradas en formato JSON con mensajes descriptivos.

4. **Idempotencia**: Las operaciones están diseñadas para ser seguras y evitar duplicaciones accidentales.

## Flujo de Trabajo Recomendado

Para obtener los mejores resultados al trabajar en una novela:

1. Crear una novela con `alephAlpha_createNovel`
2. Desarrollar personajes con `alephAlpha_createCharacter`
3. Crear escenas individuales con `alephAlpha_createScene` o generar capítulos completos con `alephAlpha_createChapterWithScenes`
4. Organizar las escenas en capítulos con `alephAlpha_createChapter`
5. Actualizar escenas según sea necesario con `alephAlpha_updateScene`
6. Para la novela "AlephAlpha", utilizar `alephAlpha_createPvsNPChapter` para añadir el capítulo especial sobre P vs NP

---

*Nota: Estas herramientas están diseñadas para funcionar junto con las plantillas de prompts para novelistas, proporcionando un ecosistema completo para la escritura creativa.*
