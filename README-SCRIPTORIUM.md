# MCP Novelist — Integración con ALEPH Scriptorium

**Submódulo**: `mcp-novelist`  
**Rama de integración**: `integration/beta/scriptorium`  
**Plugin destino**: `novelist`  
**Fecha**: 2025-12-24

---

## Propósito de la Integración

Este submódulo proporciona un **servidor MCP de memoria a largo plazo** que usa la metáfora de novelas para organizar información narrativa. El Scriptorium lo integra para:

1. **Editar obras del TALLER** con herramientas MCP avanzadas
2. **Sincronizar personajes** con AGENT_CREATOR
3. **Publicar obras** en el Teatro con flujo bidireccional

---

## Arquitectura del Submódulo

```
mcp-novelist/
├── src/
│   ├── tools/                    # 25+ herramientas MCP
│   │   ├── novelist-tools.ts     # CRUD novelas, personajes, escenas
│   │   ├── novelist-extension-tools.ts  # Herramientas extendidas
│   │   ├── code-tools.ts         # Análisis de código
│   │   ├── documentation-tools.ts # Documentación
│   │   └── prompt-tools.ts       # Plantillas de prompts
│   ├── resources/
│   │   ├── novel-data.json       # ⚠️ PERSISTENCIA (fuente de verdad)
│   │   ├── mcp-resources.ts      # Recursos URI (aleph://novel/...)
│   │   └── persistence-manager.ts # Auto-guardado
│   └── novelist-server.ts        # Servidor HTTP (puerto 3066)
├── .github/
│   ├── chatmodes/                # 3 modos especializados
│   │   ├── editor.chatmode.md    # Inicializar/recuperar
│   │   ├── albacea.chatmode.md   # Crear contenido
│   │   └── lector.chatmode.md    # Consultar
│   └── copilot-instructions.md   # Contexto del sistema
└── docs/
    ├── INTEGRATION.md
    └── NOVELIST_EXTENSION_TOOLS.md
```

---

## Mapeo Ontológico: Novelist ↔ Scriptorium

| Novelist | Scriptorium | Descripción |
|----------|-------------|-------------|
| `novel` | `TALLER/{obra}/obra.yaml` | Contenedor de historia |
| `chapter` | Estadio del monomito (1-12) | Fase narrativa (Partida/Iniciación/Retorno) |
| `scene` | `escenas/*.md` | Contenido de un momento |
| `character` | `ELENCO/{personaje}/` + recipe.json | Entidad del elenco |
| `novel-data.json` | `.arrakis/obras.json` | Registro de obras |
| Editor chatmode | @plugin_ox_novelist | Inicializar/recuperar |
| Albacea chatmode | Prompts del plugin | Crear contenido |
| Lector chatmode | @revisor + queries | Consultar/auditar |

---

## Herramientas MCP Disponibles

### Discovery & Navigation

| Tool | Descripción | Scriptorium equiv |
|------|-------------|-------------------|
| `alephAlpha_listNovels` | Ver todas las novelas | Listar TALLER |
| `alephAlpha_getNovelDetails` | Detalles de novela | Leer obra.yaml |
| `alephAlpha_listCharacters` | Ver personajes | Listar ELENCO |
| `alephAlpha_listScenes` | Ver escenas | Listar escenas/*.md |

### Content Creation

| Tool | Descripción | Scriptorium equiv |
|------|-------------|-------------------|
| `alephAlpha_createNovel` | Crear novela | crear-obra.prompt |
| `alephAlpha_createCharacter` | Crear personaje | crear-personaje.prompt → AGENT_CREATOR |
| `alephAlpha_createScene` | Crear escena | crear-escena.prompt |
| `alephAlpha_createChapter` | Crear capítulo | Añadir estadio |
| `alephAlpha_createChapterWithScenes` | Bulk create | Crear estadio con escenas |

### Information Retrieval

| Tool | Descripción | Scriptorium equiv |
|------|-------------|-------------------|
| `alephAlpha_getScene` | Obtener escena | Leer escenas/*.md |
| `alephAlpha_getCharacterDetails` | Detalles personaje | Leer recipe.json |
| `alephAlpha_listScenesByNovel` | Escenas de novela | Filtrar por obra |
| `alephAlpha_listScenesByChapter` | Escenas de capítulo | Filtrar por estadio |

### Memory Management

| Tool | Descripción | Scriptorium equiv |
|------|-------------|-------------------|
| `alephAlpha_saveCurrentState` | Guardar cambios | Automático |
| `alephAlpha_configureAutoSave` | Config auto-save | Config plugin |
| `alephAlpha_updateScene` | Actualizar escena | Editar escenas/*.md |
| `alephAlpha_deleteChapter` | Eliminar capítulo | Eliminar estadio |

---

## Esquema de Datos

### novel-data.json (Novelist)

```json
{
  "resources": {
    "novels": {
      "camino-tarotista": {
        "id": "camino-tarotista",
        "title": "El Camino del Tarotista",
        "author": "Scriptorium",
        "genre": ["onboarding", "fantástico"],
        "summary": "El Tarotista guía al usuario...",
        "characters": ["tarotista"],
        "chapters": ["chap-vestibulo", "chap-biblioteca", ...],
        "setting": "El Scriptorium"
      }
    },
    "characters": {
      "tarotista": {
        "id": "tarotista",
        "name": "El Tarotista",
        "description": "Guía místico del Scriptorium",
        "traits": ["enigmático", "sabio", "paciente"],
        "backstory": "Conoce cada rincón del Scriptorium..."
      }
    },
    "chapters": {
      "chap-vestibulo": {
        "id": "chap-vestibulo",
        "title": "El Vestíbulo",
        "scenes": ["scene-bienvenida"],
        "summary": "Primera etapa del viaje"
      }
    },
    "scenes": {
      "scene-bienvenida": {
        "id": "scene-bienvenida",
        "title": "Bienvenida al Scriptorium",
        "setting": "La entrada principal",
        "characters": ["tarotista"],
        "summary": "El Tarotista da la bienvenida",
        "content": "El espacio se ilumina gradualmente..."
      }
    }
  }
}
```

### obra.yaml (Scriptorium)

```yaml
titulo: "El Camino del Tarotista"
tipo: onboarding
personaje_guia: tarotista
descripcion: "El Tarotista guía al usuario..."

estadios:
  - id: 1
    nombre: "El Vestíbulo"
    anillo: 0
    tipo: inicio
    contenido_ref: "escenas/01-vestibulo.md"
    
meta:
  novelist_id: "camino-tarotista"  # ← Referencia para sync
```

---

## Configuración del Servidor

### Iniciar el servidor MCP

```bash
cd mcp-novelist
npm install
npm start
# Server: http://localhost:3066
```

### Configurar VS Code

**`.vscode/mcp.json`**:

```json
{
  "servers": {
    "Novelist": {
      "type": "http",
      "url": "http://localhost:3066"
    }
  }
}
```

### Variables de entorno

**`.env`**:

```bash
MCP_HTTP_HOST=localhost
MCP_HTTP_PORT=3066
MCP_SERVER_NAME=Novelist
LOG_LEVEL=info
```

---

## Dependencias

### Externas (npm)

| Paquete | Versión | Propósito |
|---------|---------|-----------|
| `@modelcontextprotocol/sdk` | ^1.19.1 | SDK MCP oficial |
| `express` | ^5.1.0 | Servidor HTTP |
| `zod` | ^3.22.4 | Validación de esquemas |
| `dotenv` | ^16.3.1 | Variables de entorno |

### Locales

| Dependencia | Path | Notas |
|-------------|------|-------|
| `@alephscript/mcp-core-sdk` | `file:../mcp-core-sdk` | ⚠️ Requiere submódulo adicional |

**Gap conocido (G7)**: La dependencia `mcp-core-sdk` es local. Para integración completa, se requiere:
- Añadir como submódulo, o
- Publicar en npm, o
- Copiar código necesario

---

## Modos de Operación

### Modo Completo (Con servidor MCP)

```
┌─────────────────────────────────────────────────────────────┐
│                    MODO COMPLETO                             │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│   VS Code                    mcp-novelist                    │
│   ───────                    ────────────                    │
│   Plugin Novelist ──────────▶ localhost:3066                │
│                   HTTP/MCP                                   │
│                                                              │
│   Herramientas disponibles:                                  │
│   - alephAlpha_createNovel                                   │
│   - alephAlpha_createCharacter                              │
│   - alephAlpha_createScene                                   │
│   - ... (25+ tools)                                          │
│                                                              │
│   Persistencia: novel-data.json (auto-save)                 │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Modo Ligero (Sin servidor MCP)

```
┌─────────────────────────────────────────────────────────────┐
│                    MODO LIGERO                               │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│   VS Code                                                    │
│   ───────                                                    │
│   Plugin Novelist ──────────▶ TALLER (archivos locales)     │
│                   File I/O                                   │
│                                                              │
│   Prompts disponibles:                                       │
│   - novelist-crear-obra.prompt.md                           │
│   - novelist-crear-personaje.prompt.md                      │
│   - novelist-crear-escena.prompt.md                         │
│                                                              │
│   Persistencia: obra.yaml + escenas/*.md                    │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## Flujos de Integración

### Exportar: Novelist → Teatro

```
1. Usuario: @aleph → [NOVELIST] Exportar obra
2. Plugin lee novel-data.json via MCP tools
3. Plugin genera:
   - TALLER/{obra}/obra.yaml
   - TALLER/{obra}/escenas/*.md
   - TALLER/{obra}/personajes/*.yaml
4. Plugin sincroniza con AGENT_CREATOR (recipes)
5. Plugin registra en ARG_BOARD (obras.json, actores.json)
6. Usuario: @aleph → [TEATRO] Publicar obra
```

### Importar: Teatro → Novelist

```
1. Usuario: @aleph → [NOVELIST] Importar obra desde TALLER
2. Plugin lee obra.yaml + escenas/*.md
3. Plugin crea estructuras via MCP tools:
   - alephAlpha_createNovel(...)
   - alephAlpha_createChapter(...) × 12
   - alephAlpha_createScene(...) × N
   - alephAlpha_createCharacter(...) × N
4. Usuario edita con chatmodes de Novelist
5. Usuario exporta de vuelta al Teatro
```

---

## Gaps Conocidos

| Gap | Descripción | Mitigación |
|-----|-------------|------------|
| G1 | Dependencia mcp-core-sdk local | Añadir submódulo o resolver |
| G2 | Formato escenas no 100% compatible | Transformación flexible |
| G3 | Auto-save puede conflictuar con TALLER | Timestamp de última modificación |
| G4 | 3 chatmodes vs 1 bridge Scriptorium | Bridge unifica acceso |

---

## Comandos de Desarrollo

```bash
# Desarrollo
npm run dev          # Watch mode

# Producción
npm run build        # Compilar TypeScript
npm start           # Iniciar servidor

# Testing
npm test            # Jest tests
npm run lint        # ESLint

# Utilidades
npm run inspector   # MCP Inspector (debug)
```

---

## Referencias

- **Protocolo MCP**: [modelcontextprotocol.io](https://modelcontextprotocol.io)
- **Plugin Scriptorium**: `.github/plugins/novelist/`
- **Bridge**: `.github/agents/plugin_ox_novelist.agent.md`
- **Backlog**: `ARCHIVO/DISCO/BACKLOG_BORRADORES/MCP-NOVELIST/`
- **TALLER**: `ARCHIVO/DISCO/TALLER/`
- **AGENT_CREATOR**: `ARCHIVO/PLUGINS/AGENT_CREATOR/`
