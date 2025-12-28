---
name: Scriptorium Context Integration
description: Instrucciones para cargar el contexto del Scriptorium padre en NovelistEditor standalone
applyTo: "**/*.md, **/*.json, src/**/*.ts"
---

# Instrucciones: Contexto del Scriptorium

> **Propósito**: Permitir que NovelistEditor funcione como workspace standalone mientras mantiene conexión con el Scriptorium padre.

---

## Detección de Contexto

Al iniciar una sesión, el agente debe verificar:

### 1. ¿Existe `scriptorium-context.json`?

```javascript
// Leer configuración de contexto
const context = JSON.parse(read_file("scriptorium-context.json"));
```

Si existe, contiene:
- `scriptorium_root`: Ruta absoluta al Scriptorium padre
- `obras_disponibles`: Lista de obras detectadas
- `ultima_sincronizacion`: Timestamp de última sync

### 2. Si NO existe, generarlo

El agente debe:
1. Buscar el Scriptorium en rutas conocidas
2. Detectar obras en `ARCHIVO/PLUGINS/NOVELIST/obras/`
3. Crear `scriptorium-context.json` con la información

---

## Estructura del Contexto

```json
{
  "$schema": "./scriptorium-context.schema.json",
  "version": "1.0.0",
  "scriptorium": {
    "root": "/Users/morente/Desktop/NUEVA_BASE/SCRIPTORIUM/ALEPH",
    "detected": true,
    "plugins": {
      "novelist": ".github/plugins/novelist",
      "teatro": ".github/plugins/teatro",
      "agent_creator": ".github/plugins/agent-creator"
    }
  },
  "obras": {
    "path": "ARCHIVO/PLUGINS/NOVELIST/obras",
    "disponibles": [
      {
        "id": "itaca-digital",
        "titulo": "Ítaca Digital: El Retorno del Navegante",
        "estado": "borrador",
        "capitulos": 12,
        "ruta_local": "ARCHIVO/PLUGINS/NOVELIST/obras/itaca-digital"
      }
    ]
  },
  "sesion": {
    "obra_activa": null,
    "capitulo_actual": null,
    "ultima_sincronizacion": null
  }
}
```

---

## Rutas de Búsqueda del Scriptorium

El agente intenta encontrar el Scriptorium en este orden:

1. **Variable de entorno**: `ALEPH_SCRIPTORIUM_ROOT`
2. **Ruta relativa padre**: `../` (si NovelistEditor es submódulo)
3. **Rutas conocidas**:
   - `/Users/morente/Desktop/NUEVA_BASE/SCRIPTORIUM/ALEPH`
   - `~/SCRIPTORIUM/ALEPH`
   - `~/Desktop/SCRIPTORIUM/ALEPH`

### Validación del Scriptorium

Para confirmar que es un Scriptorium válido, verificar:
- Existe `.github/copilot-instructions.md`
- Existe `.github/PLUGINS.md`
- Existe `ARCHIVO/PLUGINS/NOVELIST/obras/`

---

## Carga de Obra

Cuando el usuario selecciona una obra:

### Paso 1: Cargar Metadatos
```javascript
const novela = JSON.parse(read_file(`${obra_path}/novela.json`));
const estructura = JSON.parse(read_file(`${obra_path}/estructura.json`));
const sync = JSON.parse(read_file(`${obra_path}/sincronizacion.json`));
```

### Paso 2: Verificar Capítulos
```javascript
// Listar archivos en capitulos/
const capitulos = list_dir(`${obra_path}/capitulos/`);

// Verificar que existen los 12
// Marcar faltantes como "pendiente de crear"
```

### Paso 3: Actualizar Sesión
```javascript
// Actualizar scriptorium-context.json
context.sesion.obra_activa = obra.id;
context.sesion.ultima_sincronizacion = new Date().toISOString();
```

---

## Sincronización con Fuentes

Cada obra puede tener tres fuentes de sincronización:

| Fuente | Tipo | Uso |
|--------|------|-----|
| **Teatro** | Bidireccional | Exportar/importar YAML para visualización |
| **Taller** | Lectura | Consultar arquitectura y mapeos |
| **Fuente Remota** | Lectura selectiva | Importar contenido original |

### Importar desde Fuente Remota
```javascript
// La fuente remota está en sincronizacion.json
const fuente = sync.enlaces.fuenteRemota.ruta;
const archivos = sync.enlaces.fuenteRemota.archivosVinculados;

// Para importar un capítulo específico:
const capitulo = archivos.find(a => a.capitulo === 4);
const contenido = read_file(`${fuente}/${capitulo.fuente}`);
```

---

## Integración con Servidor MCP

### Modo Completo (servidor activo)

Si el servidor MCP está corriendo en `localhost:3066`:

```javascript
// Verificar conexión
const info = await resources_read("aleph://server/info");

// Sincronizar obra con servidor
await alephAlpha_createNovel({
  title: novela.titulo,
  author: novela.autor,
  genre: novela.genero,
  summary: novela.sinopsis
});
```

### Modo Ligero (sin servidor)

Si el servidor no está disponible:
- Trabajar directamente con archivos `.md` y `.json`
- No usar herramientas `alephAlpha_*`
- Guardado manual con `edit_file`

---

## Banderas del Scriptorium

Cada capítulo tiene un `feature` que indica qué agente del Scriptorium puede ayudar:

| Feature | Rol | Cuándo usar |
|---------|-----|-------------|
| `@vestibulo` | Entrada/navegación | Capítulo 1 (Mundo Ordinario) |
| `@periodico` | Formato 5W | Capítulo 2 (Llamada) |
| `@blueflag` | Auditoría de verdad | Capítulos que requieren evidencia |
| `@blackflag` | Auditoría de sombras | Capítulos con conflicto |
| `@redflag` | Auditoría de estructura | Capítulos de escala |
| `@yellowflag` | Auditoría de límites | Capítulos de metacognición |
| `@orangeflag` | Auditoría de registro | Capítulos de retórica |
| `@enciclopedia` | Referencias | Capítulos que citan fuentes |
| `@agentcreator` | Crear personajes | Cuando aparecen personajes nuevos |

---

## Respuesta de Onboarding

Cuando el agente detecta primera sesión, debe:

1. **Verificar contexto**: ¿Existe scriptorium-context.json?
2. **Detectar obras**: Listar obras disponibles
3. **Mostrar estado**: Tabla con obras y progreso
4. **Ofrecer opciones**:
   - "¿En qué obra quieres trabajar?"
   - "¿Quieres crear una nueva obra?"
   - "¿Necesitas sincronizar con fuentes?"

---

## Ejemplo de Primera Sesión

**Usuario**:
> Hola. Soy un usuario de Aleph Scriptorium. Es la primera vez que abro este NovelistEditor. Soy uno de los escritores de la novela "Ítaca digital". Necesito hacer una sesión de escritura. ¿Puedes ayudarme?

**Agente**:

```markdown
¡Bienvenido al NovelistEditor! 🐂

He detectado tu conexión con Aleph Scriptorium.

## 📚 Obra Detectada: Ítaca Digital

| Campo | Valor |
|-------|-------|
| **Título** | Ítaca Digital: El Retorno del Navegante |
| **Estado** | Borrador |
| **Capítulos** | 12/12 creados |
| **Estructura** | Monomito-12 |

### 📊 Estado de Capítulos

| # | Nombre | Estado | Palabras |
|---|--------|--------|----------|
| 1 | El Mundo Ordinario | borrador | 0 |
| 2 | La Llamada | borrador | 0 |
| ... | ... | ... | ... |

### 🎯 Próximos Pasos Sugeridos

1. **Importar contenido**: Los 12 capítulos están vinculados a fuentes originales
2. **Editar capítulo 1**: El "Mundo Ordinario" es el punto de partida natural
3. **Sincronizar con Teatro**: Para visualización en impress.js

¿En qué capítulo te gustaría trabajar hoy?
```
