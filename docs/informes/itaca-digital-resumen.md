# Ítaca Digital — Resumen para NovelistEditor

> **Ubicación**: NovelistEditor/docs  
> **Propósito**: Contexto técnico para desarrollo del editor  
> **Actualizado**: 2025-12-29

---

## Visión General

**Ítaca Digital** es la obra piloto del sistema NovelistEditor. Demuestra la capacidad del editor para mantener sincronización entre múltiples fuentes de verdad y gestionar memoria a largo plazo vía MCP.

## Arquitectura de Datos

```
┌─────────────────────────────────────────────────────────────┐
│  THEIA_PATH (Fuente Remota) — SOLO LECTURA                  │
│  Abstract_Portada.md [1.403 palabras]                       │
│  ▸ Material original autobiográfico                         │
└─────────────────────────────────────────────────────────────┘
                            │ lectura
                            ▼
┌─────────────────────────────────────────────────────────────┐
│  MCP Server (localhost:3066)                                 │
│  novel3 / chap6 / scene11-14                                │
│  ▸ 5 personajes × 4 escenas × ~730 palabras                 │
└─────────────────────────────────────────────────────────────┘
                            │ bidireccional
                            ▼
┌─────────────────────────────────────────────────────────────┐
│  NOVELIST Local (obras/itaca-digital)                       │
│  01-mundo-ordinario.md [~50 palabras]                       │
│  ▸ Capítulo renderizado para lectura fluida                 │
└─────────────────────────────────────────────────────────────┘
```

## Métricas Clave del Capítulo 1

| Métrica | Actual | Objetivo | Gap |
|---------|--------|----------|-----|
| Palabras cap. local | 50 | 800-1200 | ⚠️ -94% |
| Escenas en MCP | 4 | 6 | 2 pendientes |
| Sincronización | 10% | 100% | 🔴 90% |
| Personajes | 5/5 | 5/5 | ✅ |

## Personajes (URIs MCP)

| Personaje | URI | Rol |
|-----------|-----|-----|
| El Cronista | `aleph://novel/character/char8` | Narrador omnisciente |
| Penélope Digital | `aleph://novel/character/char9` | Tejedora-guía |
| Ulises | `aleph://novel/character/char10` | Navegante digital |
| Autor-Narrador | `aleph://novel/character/char11` | Voz autobiográfica |
| Adam | `aleph://novel/character/char12` | Interlocutor heredero |

## Temas Implementados vs Pendientes

| Tema | MCP | Local | Pendiente |
|------|-----|-------|-----------|
| Concurso 6 palabras | ✅ | ❌ | Sincronizar |
| Penélope tejiendo | ✅ | ✅ parcial | Expandir |
| Monomitos múltiples | ✅ | ❌ | Sincronizar |
| Primera experiencia Onán | ✅ | ❌ | Sincronizar |
| Clausura adolescencia | ❌ | ❌ | Estructurar |

## Scripts de Desarrollo

```bash
# Verificar conexión MCP
npm run mcp:status

# Sincronizar desde MCP
npm run sync:mcp -- --novel novel3 --chapter chap6

# Exportar a Teatro
npm run export:teatro -- --obra itaca-digital
```

---

*Generado para equipo de desarrollo NovelistEditor — Aleph Scriptorium*
