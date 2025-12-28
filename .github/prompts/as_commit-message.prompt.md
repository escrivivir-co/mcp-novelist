# Prompt: Generación de Commit Message — NovelistEditor

> **Resumen**: Genera mensajes de commit conformes al protocolo DevOps del proyecto.
> **Contexto**: NovelistEditor como submódulo del Scriptorium Aleph

---

## Formato

```
<tipo>(<scope>): <descripción en imperativo>

[cuerpo opcional: qué y por qué]

refs #<TASK-ID>
```

---

## Tipos y Scopes para NovelistEditor

| Tipo | Uso | Scopes |
|------|-----|--------|
| `feat` | Nueva funcionalidad | `mcp`, `agents`, `tools`, `resources`, `docs` |
| `fix` | Corrección de error | `server`, `client`, `persistence`, `sync` |
| `docs` | Solo documentación | `readme`, `api`, `catalog` |
| `refactor` | Reestructuración | `core`, `sdk`, `tools` |
| `chore` | Mantenimiento | `deps`, `config`, `scripts` |
| `sync` | Sincronización con Scriptorium | `scriptorium`, `obras`, `teatro` |

---

## Scopes Específicos

| Scope | Descripción | Ejemplo |
|-------|-------------|---------|
| `mcp` | Servidor MCP y herramientas | `feat(mcp): añadir tool createChapterWithScenes` |
| `agents` | Agentes personalizados | `fix(agents): mejorar protocolo de escritor` |
| `tools` | Herramientas MCP | `refactor(tools): unificar novelist-tools` |
| `resources` | Recursos y datos | `feat(resources): añadir novel-data.json` |
| `sync` | Sincronización con Scriptorium | `sync(scriptorium): actualizar contexto` |
| `sdk` | Submódulo mcp-core-sdk | `chore(sdk): actualizar submódulo a v1.0.1` |
| `obras` | Obras/Novelas | `feat(obras): importar Ítaca Digital` |

---

## Procedimiento

### 1. Identificar cambios

```bash
git status && git diff --stat
```

### 2. Clasificar por tipo

| Cambios en | Tipo sugerido |
|------------|---------------|
| `src/tools/` | `feat(tools)` o `fix(tools)` |
| `src/resources/` | `feat(resources)` |
| `.github/agents/` | `feat(agents)` |
| `scriptorium-context.json` | `sync(scriptorium)` |
| `mcp-core-sdk` (submódulo) | `chore(sdk)` |
| `package.json` | `chore(deps)` |

### 3. Generar mensaje

**Ejemplo: Nueva funcionalidad MCP**
```
feat(mcp): implementar sincronización bidireccional con Teatro

- Añadir tool exportToTeatro para YAML
- Crear resource aleph://sync/teatro
- Actualizar novelist-extension-tools.ts

refs #NOVEL-1.2.0-T003
```

**Ejemplo: Corrección de servidor**
```
fix(server): resolver error de dependencia mcp-core-sdk

- Clonar SDK como submódulo en lugar de referencia externa
- Actualizar package.json con ruta relativa

refs #NOVEL-1.1.0-T001
```

**Ejemplo: Sincronización con Scriptorium**
```
sync(scriptorium): importar estructura de Ítaca Digital

- Crear novel3 con 8 capítulos del Monomito adaptado
- Sincronizar personajes: Penélope Digital, El Navegante, El Cronista
- Actualizar scriptorium-context.json con obra activa

refs #SCRIPT-1.23.0-S02
```

---

## Reglas

- **Descripción**: máximo 72 chars, imperativo ("añadir", no "añadido")
- **Cuerpo**: qué y por qué, no cómo
- **Un commit por unidad lógica**
- **Submódulos**: commit separado para actualizaciones de `mcp-core-sdk`

---

## Integración con Scriptorium Padre

Cuando los cambios afectan la integración con el Scriptorium:

1. Commit en NovelistEditor con scope `sync`
2. Actualizar referencia del submódulo en el Scriptorium padre
3. Commit en Scriptorium: `chore(script/submods): actualizar NovelistEditor a vX.Y.Z`

---

## Versionado

```
novelist-<major>.<minor>.<patch>
```

- `novelist-1.0.0` — Servidor MCP funcional
- `novelist-1.1.0` — Integración con Scriptorium
- `novelist-1.2.0` — Sincronización Teatro/Obras

---

→ Para protocolo DevOps completo del Scriptorium: [DEVOPS.md](../../../../.github/DEVOPS.md)
