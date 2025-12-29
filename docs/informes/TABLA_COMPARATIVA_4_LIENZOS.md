# 🎯 Tabla Comparativa: 4 Lienzos de Ítaca Digital

> **Propósito**: Coordinar el contenido de la novela "Ítaca Digital" a través de los 4 puntos del ecosistema Scriptorium.  
> **Fecha**: 2025-12-29  
> **Épica**: SCRIPT-1.29.0 (Context Bloat Mitigation)

---

## Vista de Pájaro

| Lienzo | Ubicación | Propósito | Audiencia | Palabras | Estado |
|--------|-----------|-----------|-----------|----------|--------|
| **ARG_BOARD** | `ARCHIVO/PLUGINS/ARG_BOARD/.arrakis/` | Coordinar obra como experiencia teatral | Director escénico | ~350 | 🟢 Nuevo |
| **Plugin Novelist** | `.github/plugins/novelist/docs/` | Referencia para el agente @novelist | Agente IA | ~400 | 🟢 Nuevo |
| **NovelistEditor** | `NovelistEditor/docs/` | Contexto técnico para desarrollo | Desarrollador | ~450 | 🟢 Nuevo |
| **THEIA_PATH** | `ARCHIVO/DISCO/THEIA_PATH_RESUMEN/` | Índice de la fuente original remota | Escritor/Archivista | ~400 | 🟢 Nuevo |

---

## Comparativa de Contenido

| Aspecto | ARG_BOARD | Plugin Novelist | NovelistEditor | THEIA_PATH |
|---------|-----------|-----------------|----------------|------------|
| **Foco** | Actores y escenas | Estructura narrativa | Arquitectura técnica | Material fuente |
| **Formato** | Tablas de actores | Comandos de agente | Diagramas y scripts | Índice de extracción |
| **Personajes** | 5 (como actores) | 5 (como entidades MCP) | 5 (como URIs) | Implícitos |
| **Escenas** | 4 (para representar) | 4 (para expandir) | 4 (para sincronizar) | 4 (origen) |
| **Métricas** | Estado de integración | Palabras por escena | Gap de sincronización | % extraído |
| **Acciones** | Registrar en obras.json | @novelist importar-mcp | npm run sync:mcp | Solo lectura |

---

## Flujo de Trabajo del Escritor

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                                ESCRITOR                                       │
│                                   │                                           │
│        ┌──────────────────────────┼──────────────────────────┐               │
│        ▼                          ▼                          ▼               │
│  ┌───────────┐            ┌───────────────┐           ┌────────────┐         │
│  │ THEIA_PATH│   lectura  │ NovelistEditor│  edición  │   Plugin   │         │
│  │ (Fuente)  │───────────▶│   (Técnico)   │◀─────────▶│  Novelist  │         │
│  └───────────┘            └───────────────┘           │  (Agente)  │         │
│        │                          │                   └────────────┘         │
│        │                          │ exportar                 │               │
│        │                          ▼                          │               │
│        │                   ┌────────────┐                    │               │
│        └──────────────────▶│  ARG_BOARD │◀───────────────────┘               │
│                            │  (Teatro)  │                                     │
│                            └────────────┘                                     │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

## Checklist de Sincronización

| Tarea | ARG | Novelist | Editor | THEIA | Responsable |
|-------|:---:|:--------:|:------:|:-----:|-------------|
| Registrar obra en obras.json | ⬜ | ✅ | ✅ | N/A | @arg-board |
| Añadir 5 actores a actores.json | ⬜ | N/A | N/A | N/A | @arg-board |
| Importar escenas desde MCP | N/A | ⬜ | ⬜ | N/A | @novelist |
| Crear scene15 y scene16 | N/A | ⬜ | ⬜ | ✅ fuente | @novelist |
| Exportar a Teatro YAML | ⬜ | ⬜ | N/A | N/A | @novelist |
| Actualizar capítulo local | N/A | ⬜ | N/A | N/A | @novelist |
| Verificar URIs MCP | N/A | N/A | ✅ | N/A | @developer |

---

## Principios DRY para el Escritor

1. **THEIA_PATH es sagrado**: Nunca modificar la fuente original
2. **MCP es la verdad estructurada**: Editar escenas en el servidor MCP
3. **Capítulo local es renderizado**: Se genera desde MCP, no se edita directamente
4. **Teatro es experiencia**: Contiene hooks y metadatos, no narrativa completa
5. **Resúmenes son índices**: Estos 4 archivos apuntan, no duplican

---

## Archivos Creados

| Archivo | Ruta | Propósito |
|---------|------|-----------|
| ARG_BOARD resumen | [itaca-digital-resumen.md](ARCHIVO/PLUGINS/ARG_BOARD/.arrakis/itaca-digital-resumen.md) | Coordinar actores |
| Plugin resumen | [itaca-digital-resumen.md](.github/plugins/novelist/docs/itaca-digital-resumen.md) | Referencia agente |
| Editor resumen | [itaca-digital-resumen.md](NovelistEditor/docs/itaca-digital-resumen.md) | Contexto técnico |
| THEIA resumen | [itaca-digital-resumen.md](ARCHIVO/DISCO/THEIA_PATH_RESUMEN/itaca-digital-resumen.md) | Índice fuente |

---

## Próximos Pasos Sugeridos

1. **Registrar obra en ARG_BOARD**: Añadir `itaca-digital` a `obras.json`
2. **Crear escenas faltantes**: scene15 y scene16 con material pendiente (~583 palabras)
3. **Sincronizar capítulo local**: Ejecutar `@novelist importar-mcp itaca-digital 1`
4. **Expandir Teatro YAML**: Incluir las 6 escenas con hooks

---

*Generado para coordinación del escritor — Aleph Scriptorium × Ítaca Digital*
