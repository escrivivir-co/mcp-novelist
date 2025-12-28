# Backlog — NovelistEditor

> **Submódulo de**: Aleph Scriptorium  
> **Versión**: 1.1.0  
> **Sprint actual**: NE-FC1 (Feature Cycle 1)  
> **Actualizado**: 2025-12-28

---

## ⚠️ Protocolo DRY

> Este archivo sigue el protocolo DRY del Scriptorium padre.  
> Los detalles de épicas viven en carpetas de borradores, no aquí.

---

## Sprint Activo: NE-FC1

| Estado | Épica | Nombre | Referencia |
|--------|-------|--------|------------|
| ✅ | NOVEL-1.1.0 | Integración mcp-core-sdk como submódulo | [cerrado](#novel-110-cerrado) |
| ✅ | NOVEL-1.1.1 | Protocolo de commit para NovelistEditor | [cerrado](#novel-111-cerrado) |
| ✅ | NOVEL-1.1.2 | Mejoras al agente @escritor | [cerrado](#novel-112-cerrado) |
| 📋 | NOVEL-1.2.0 | Sincronización completa de Ítaca Digital | pendiente |

---

## Épicas Cerradas en este Sprint

### NOVEL-1.1.0 (Cerrado)

**Nombre**: Integración mcp-core-sdk como submódulo

**Problema**: La dependencia `@alephscript/mcp-core-sdk` apuntaba a `file:../mcp-core-sdk` (fuera del workspace), causando errores al arrancar el servidor MCP.

**Solución**:
1. Clonar SDK como submódulo dentro de NovelistEditor: `git submodule add`
2. Actualizar `package.json` con ruta relativa: `file:./mcp-core-sdk`
3. Crear `.gitmodules` con referencia al repositorio

**Archivos modificados**:
- `.gitmodules` (nuevo)
- `mcp-core-sdk/` (submódulo nuevo)
- `package.json` (ruta actualizada)
- `package-lock.json` (regenerado)

**Resultado**: Servidor MCP arranca correctamente en puerto 3066.

---

### NOVEL-1.1.1 (Cerrado)

**Nombre**: Protocolo de commit para NovelistEditor

**Problema**: No existía un prompt de generación de commits adaptado al contexto de NovelistEditor.

**Solución**: Crear `.github/prompts/as_commit-message.prompt.md` con:
- Tipos y scopes específicos para NovelistEditor
- Ejemplos de commits para MCP, agents, sync
- Integración con protocolo del Scriptorium padre

**Archivos creados**:
- `.github/prompts/as_commit-message.prompt.md`

---

### NOVEL-1.1.2 (Cerrado)

**Nombre**: Mejoras al agente @escritor basadas en análisis de comportamiento

**Problema**: El agente @escritor tenía problemas identificados:
1. No informaba claramente cuando la sincronización quedaba a medias
2. Faltaban handoffs para arrancar servidor y sincronizar obras completas
3. No tenía protocolo documentado para sincronización completa

**Análisis del log** (`ESCRITOR_INNER_LOGS.md`):
- ✅ Detectó contexto correctamente
- ✅ Identificó que el servidor no estaba corriendo
- ✅ Resolvió dependencias (clonó submódulo)
- ✅ Creó la novela Ítaca Digital en el servidor
- ⚠️ Creó solo 3 personajes, no llegó a capítulos
- ⚠️ No actualizó `scriptorium-context.json` con estado final

**Solución**: Actualizar `escritor.agent.md` con:
1. Nuevos handoffs: "Arrancar Servidor MCP", "Sincronizar Obra Completa"
2. Protocolo de arranque del servidor MCP documentado
3. Protocolo de sincronización completa con 5 fases
4. Advertencia: "NO dejar sincronización a medias"

**Archivos modificados**:
- `.github/agents/escritor.agent.md`

---

## Épicas Pendientes

| Épica | Nombre | Prioridad |
|-------|--------|-----------|
| NOVEL-1.2.0 | Sincronización completa de Ítaca Digital | Alta |
| NOVEL-1.3.0 | Exportación a Teatro (YAML) | Media |
| NOVEL-1.4.0 | Importación desde fuentes externas | Media |
| NOVEL-2.0.0 | Modo offline sin servidor MCP | Baja |

---

## Métricas del Sprint

| Métrica | Valor |
|---------|-------|
| Épicas cerradas | 3 |
| Archivos creados | 2 |
| Archivos modificados | 4 |
| Submódulos añadidos | 1 |
| Estado servidor MCP | ✅ Operativo |

---

## Changelog

| Fecha | Cambio | Autor |
|-------|--------|-------|
| 2025-12-28 | 🔧 NOVEL-1.1.0: Integrar mcp-core-sdk como submódulo | @escritor |
| 2025-12-28 | 📝 NOVEL-1.1.1: Crear prompt de commits | @aleph |
| 2025-12-28 | 🔧 NOVEL-1.1.2: Mejorar agente escritor | @aleph |
| 2025-12-28 | 📋 Crear backlog NovelistEditor | @aleph |

---

## Integración con Scriptorium

Este backlog se sincroniza con el Scriptorium padre en:
- **Épica padre**: SCRIPT-1.23.0 (MMCO Editor Transmedia)
- **Plugin**: `.github/plugins/novelist/`
- **Obras**: `ARCHIVO/PLUGINS/NOVELIST/obras/`

→ Para backlog del Scriptorium: [BACKLOG-SCRIPTORIUM.md](../../../../.github/BACKLOG-SCRIPTORIUM.md)
