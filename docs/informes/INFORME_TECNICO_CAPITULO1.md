# Informe Técnico: Capítulo 1 — El Mundo Ordinario: Ítaca Perdida

**Obra**: Ítaca Digital: El Retorno del Navegante  
**Fecha**: 28 de diciembre de 2025  
**Autor del informe**: Agente Escritor (NovelistEditor)  
**Destinatarios**: Equipo Aleph Scriptorium

---

## 1. Estado de Conexiones

| Fuente | Estado | Última Sync |
|--------|--------|-------------|
| 🟢 Servidor MCP (`localhost:3066`) | Activo | En tiempo real |
| 🟢 Scriptorium Local (`obras/itaca-digital`) | Accesible | 2025-12-28 |
| 🟢 Fuente Remota (`THEIA_PATH/NOVELA`) | Accesible | — |
| 🟢 ARG_BOARD Teatro (`itaca-digital.yaml`) | Sincronizado | 2025-12-28 |

---

## 2. Tres Fuentes de Verdad — Análisis Comparativo

### 2.1. Fuente A: Disco Remoto (`Abstract_Portada.md`)

| Métrica | Valor |
|---------|-------|
| Ruta | `/Users/morente/Desktop/THEIA_PATH/NOVELA/Abstract_Portada.md` |
| Palabras | **1.403** |
| Bytes | 8.565 |
| Tipo | Prosa autobiográfica, ensayo/exordio |

**Contenido clave**:
- Concurso de microrrelatos en 6 palabras (revista Smith)
- Metáfora estructural: novela de vida = 6 palabras, 1 por década
- Monomitos del protagonista: Siddharta, Edipo, Electra, Orfeo, Caverna de Platón
- Primer encuentro con Onán y la "semilla"
- Destinatario simbólico: **Adam**
- Firma: Jaime, Sevilla, 10 julio de 2023

### 2.2. Fuente B: Codebase NovelistEditor (`01-mundo-ordinario.md`)

| Métrica | Valor |
|---------|-------|
| Ruta | `ARCHIVO/PLUGINS/NOVELIST/obras/itaca-digital/capitulos/01-mundo-ordinario.md` |
| Palabras | **153** (solo contenido narrativo: ~50) |
| Estado | `borrador` |
| Features | `@vestibulo`, `@cartaspuerta` |

**Contenido actual**:
- Breve introducción a Penélope tejiendo/destejiendo
- Pregunta retórica sobre el tejido en la era digital
- Placeholder pendiente de expandir

### 2.3. Fuente C: ARG_BOARD de Teatro (`itaca-digital.yaml`)

| Métrica | Valor |
|---------|-------|
| Ruta | `ARCHIVO/PLUGINS/TEATRO/obras/itaca-digital.yaml` |
| Estadio | 1 de 12 |
| Duración | 20 min |
| Estado global | `generada` → próximo paso: `instalar` |

**Contenido en YAML**:
```yaml
contenido: |
  En Ítaca, mientras Ulises navega por mares desconocidos,
  Penélope teje y desteje, esperando el retorno.
  ¿Qué significa tejer en la era de los datos y los algoritmos?
```

### 2.4. Fuente D: Servidor MCP (novel3, chap6)

| Métrica | Valor |
|---------|-------|
| Novel ID | `novel3` |
| Chapter ID | `chap6` |
| Escenas | **4** (scene11-scene14) |
| Personajes | 5 (El Cronista, Penélope Digital, Ulises, Autor-Narrador, Adam) |

**Escenas sincronizadas**:

| ID | Título | Personajes | Palabras (approx) |
|----|--------|------------|-------------------|
| scene11 | El Concurso de Seis Palabras | Autor-Narrador, Cronista | ~180 |
| scene12 | Penélope Teje en Código | Penélope, Ulises | ~160 |
| scene13 | Los Monomitos del Joven Confuso | Autor-Narrador, Adam | ~190 |
| scene14 | La Primera Toma de Onán | Autor-Narrador, Adam | ~200 |

**Total en MCP**: ~730 palabras estructuradas

---

## 3. Diagnóstico de Sincronización

### 3.1. Gap de Contenido

| Fuente | Palabras | % del Total Original |
|--------|----------|---------------------|
| Fuente Remota (A) | 1.403 | 100% |
| Servidor MCP (D) | ~730 | 52% |
| Capítulo Local (B) | ~50 narrativas | 3.5% |
| Teatro YAML (C) | ~40 | 2.8% |

**Problema**: La fuente local (B) y Teatro (C) tienen solo el ~3% del material original. El servidor MCP (D) tiene el 52% estructurado en escenas.

### 3.2. Flujo de Sincronización Actual

```
┌─────────────────────────────────────────────────────────────────┐
│  FUENTE REMOTA (THEIA_PATH)                                     │
│  Abstract_Portada.md [1.403 palabras]                           │
│  ════════════════════════════════════════════════               │
│  ↓ lectura-selectiva                                            │
├─────────────────────────────────────────────────────────────────┤
│  SERVIDOR MCP (novel3/chap6)                                    │
│  4 escenas estructuradas [~730 palabras]                        │
│  ════════════════════════════════════════════════               │
│  ↓ exportar-teatro / ↑ importar-teatro                          │
├─────────────────────────────────────────────────────────────────┤
│  NOVELIST LOCAL (obras/itaca-digital)                           │
│  01-mundo-ordinario.md [~50 palabras]                           │
│  ════════════════════════════════════════════════               │
│  ↓ sincronización bidireccional                                 │
├─────────────────────────────────────────────────────────────────┤
│  TEATRO ARG_BOARD (itaca-digital.yaml)                          │
│  estadio.1.contenido [~40 palabras]                             │
└─────────────────────────────────────────────────────────────────┘
```

### 3.3. Inconsistencias Detectadas

| Problema | Ubicación | Impacto | Prioridad |
|----------|-----------|---------|-----------|
| Contenido desincronizado | B ≠ D | El capítulo local no refleja las escenas MCP | 🔴 Alta |
| Material sin importar | A → D | ~50% del texto original no está estructurado | 🟡 Media |
| Teatro simplificado | C | Solo tiene el "hook" del capítulo | 🟡 Media |
| Personajes completos en D | MCP | Pero no reflejados en B ni C | 🟠 Media |

---

## 4. Inventario de Recursos del Capítulo 1

### 4.1. Personajes Involucrados

| Personaje | ID MCP | Rol en Cap. 1 | Estado |
|-----------|--------|---------------|--------|
| El Cronista | char8 | Narrador omnisciente, eco de Galdós/Joyce | ✅ En MCP |
| Penélope Digital | char9 | Tejedora de código, guía de la novela | ✅ En MCP |
| Ulises el Navegante | char10 | Viajero por mares digitales | ✅ En MCP |
| El Autor-Narrador | char11 | Voz autobiográfica, novela de 6 palabras | ✅ En MCP |
| Adam | char12 | Interlocutor simbólico, heredero | ✅ En MCP |

### 4.2. Temas/Motivos

| Tema | Presente en Fuente A | Estructurado en MCP | En Capítulo Local |
|------|---------------------|---------------------|-------------------|
| Concurso 6 palabras | ✅ | ✅ (scene11) | ❌ |
| Penélope tejiendo | ✅ implícito | ✅ (scene12) | ✅ parcial |
| Monomitos múltiples | ✅ | ✅ (scene13) | ❌ |
| Primera experiencia Onán | ✅ | ✅ (scene14) | ❌ |
| Destinatario Adam | ✅ | ✅ | ❌ |
| Caverna de Platón (prefigurado) | ✅ | ✅ | ❌ |
| Clausura adolescencia / adultez | ✅ | ❌ | ❌ |

### 4.3. Agentes y Features Asignados

| Feature | Propósito | Estado Implementación |
|---------|-----------|----------------------|
| `@vestibulo` | Orientar al lector en la navegación | 📋 Pendiente |
| `@cartaspuerta` | Presentar según perfil del lector | 📋 Pendiente |

---

## 5. Recomendaciones Técnicas

### 5.1. Sincronización Inmediata (Prioridad Alta)

1. **Actualizar capítulo local (B) desde MCP (D)**:
   - Ejecutar: `@novelist importar-mcp itaca-digital 1`
   - O copiar manualmente el contenido de las 4 escenas

2. **Actualizar Teatro (C) desde MCP (D)**:
   - Ejecutar: `@novelist exportar-teatro itaca-digital`
   - Incluir al menos los hooks de cada escena

### 5.2. Importación Selectiva desde Fuente Remota (Prioridad Media)

El material original (A) tiene **673 palabras** (~48%) que no están en las escenas MCP:
- Clausura de adolescencia y apertura a adultez
- Detalles sobre el caparazón familiar
- Reflexiones sobre pulsión de muerte / superego
- Momentos polarizados vs armoniosos

**Propuesta**: Crear 2 escenas adicionales:
- `scene15`: "El Caparazón y el Salto" (protección familiar → mundo desconocido)
- `scene16`: "Clausura de la Tercera Palabra" (adolescencia finaliza, adultez abre)

### 5.3. Principio DRY (Don't Repeat Yourself)

**Estrategia recomendada**:
1. **Fuente A**: Mantener como archivo de referencia íntegro (solo lectura)
2. **Servidor MCP**: Estructurar en escenas todo el material utilizable
3. **Capítulo Local (B)**: Renderizado narrativo fluido desde escenas MCP
4. **Teatro (C)**: Hooks y metadatos para experiencia teatral

**Flujo de edición**:
```
Editar en MCP (escenas) → Exportar a Local (B) → Sincronizar a Teatro (C)
```

La fuente remota (A) **nunca se modifica**, solo se referencia.

---

## 6. Métricas Objetivo para Capítulo 1

| Métrica | Actual | Objetivo | Gap |
|---------|--------|----------|-----|
| Palabras en cap. local | 50 | 800-1200 | 750-1150 |
| Escenas en MCP | 4 | 6 | 2 |
| Personajes activos | 5 | 5 | ✅ |
| Sincronización B↔C↔D | 10% | 100% | 90% |
| Agentes implementados | 0/2 | 2/2 | 2 |

---

## 7. Anexos

### 7.1. Comandos de Sincronización Disponibles

```bash
# Importar desde Teatro
@novelist importar-teatro itaca-digital

# Exportar a Teatro
@novelist exportar-teatro itaca-digital

# Importar fuente específica
@novelist importar-fuente itaca-digital 1

# Sincronizar con Taller
@novelist sincronizar-taller itaca-digital
```

### 7.2. URIs de Recursos MCP

```
aleph://novel/novel3                    # Novela completa
aleph://novel/scene/scene11             # Escena 1
aleph://novel/scene/scene12             # Escena 2
aleph://novel/scene/scene13             # Escena 3
aleph://novel/scene/scene14             # Escena 4
aleph://novel/character/char8           # El Cronista
aleph://novel/character/char9           # Penélope Digital
aleph://novel/character/char10          # Ulises
aleph://novel/character/char11          # Autor-Narrador
aleph://novel/character/char12          # Adam
```

### 7.3. Hash de Verificación

| Archivo | Palabras | Fecha |
|---------|----------|-------|
| `Abstract_Portada.md` | 1.403 | 2023-07-10 |
| `01-mundo-ordinario.md` | 153 | 2025-12-28 |
| `itaca-digital.yaml` | — | 2025-12-28 |
| MCP scene11-14 | ~730 | 2025-12-28 |

---

**Fin del Informe Técnico**

*Generado por Agente Escritor — NovelistEditor × Aleph Scriptorium*
