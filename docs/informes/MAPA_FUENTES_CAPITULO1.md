# 🗺️ Mapa de Fuentes — Capítulo 1: El Mundo Ordinario

> **Fecha**: 29 de diciembre de 2025  
> **Estado**: Plan integrado (Original + LIBRO)  
> **Decisión**: Mantener Abstract_Portada.md como eje, agregar sublore de LIBRO

---

## 1. Arquitectura de Fuentes para Cap.1

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        FUENTES DEL CAPÍTULO 1                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────┐            │
│  │  NIVEL A1: PREHISTORIA (LIBRO/)                             │            │
│  │  ═══════════════════════════════════════════════════════════│            │
│  │  📁 [El-borrego-avispado]-Aquí-estoy-yo.html                │◄─┐        │
│  │  📁 [El-borrego-avispado]-No-estoy-solo...html              │  │        │
│  │  📁 Serie "Llevo X días" (8 archivos)                       │  │        │
│  │                                                              │  │        │
│  │  Rol: Ecos del pasado, flashbacks, prehistoria              │  │ lectura│
│  │  Operación: SOLO LECTURA                                    │  │        │
│  └─────────────────────────────────────────────────────────────┘  │        │
│                              │                                     │        │
│                              ▼ extracto                            │        │
│  ┌─────────────────────────────────────────────────────────────┐  │        │
│  │  NIVEL A2: EJE CENTRAL (NOVELA/*.md)                        │  │        │
│  │  ═══════════════════════════════════════════════════════════│  │        │
│  │  📄 Abstract_Portada.md [1.403 palabras] ◄── COLUMNA VERTEBRAL│        │
│  │  📄 Apertura_Ulises_y_Penelope.md (para Penélope)           │◄─┘        │
│  │                                                              │           │
│  │  Rol: Texto principal del capítulo                          │           │
│  │  Operación: SOLO LECTURA                                    │           │
│  └─────────────────────────────────────────────────────────────┘           │
│                              │                                              │
│                              ▼ estructurar                                  │
│  ┌─────────────────────────────────────────────────────────────┐           │
│  │  NIVEL B: CONTENEDOR MCP (novel3/chap6)                     │           │
│  │  ═══════════════════════════════════════════════════════════│           │
│  │  📦 scene11: El Concurso de Seis Palabras                   │           │
│  │  📦 scene12: Penélope Teje en Código                        │           │
│  │  📦 scene13: Los Monomitos del Joven Confuso                │           │
│  │  📦 scene14: La Primera Toma de Onán                        │           │
│  │  📦 scene15: Los Ecos del Blog (NUEVA) ◄── SUBLORE LIBRO    │           │
│  │  📦 scene16: El Caparazón y el Salto (NUEVA)                │           │
│  │                                                              │           │
│  │  Rol: Escenas estructuradas, editables                      │           │
│  │  Operación: LECTURA/ESCRITURA                               │           │
│  └─────────────────────────────────────────────────────────────┘           │
│                              │                                              │
│                              ▼ renderizar                                   │
│  ┌─────────────────────────────────────────────────────────────┐           │
│  │  NIVEL C: CAPÍTULO LOCAL (obras/itaca-digital/)             │           │
│  │  ═══════════════════════════════════════════════════════════│           │
│  │  📄 01-mundo-ordinario.md [objetivo: 1.200-1.400 palabras]  │           │
│  │                                                              │           │
│  │  Rol: Texto fluido para lectura                             │           │
│  │  Operación: ESCRITURA (desde MCP)                           │           │
│  └─────────────────────────────────────────────────────────────┘           │
│                              │                                              │
│                              ▼ exportar                                     │
│  ┌─────────────────────────────────────────────────────────────┐           │
│  │  NIVEL D: TEATRO ARG_BOARD                                  │           │
│  │  ═══════════════════════════════════════════════════════════│           │
│  │  📄 itaca-digital.yaml (estadio 1: hooks)                   │           │
│  │                                                              │           │
│  │  Rol: Experiencia teatral, metadatos                        │           │
│  │  Operación: EXPORTAR                                        │           │
│  └─────────────────────────────────────────────────────────────┘           │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Plan Integrado: 6 Escenas del Capítulo 1

### Estructura Final Propuesta

| # | Escena | Fuente Principal | Sublore LIBRO | Palabras |
|---|--------|------------------|---------------|----------|
| 1 | El Concurso de Seis Palabras | Abstract_Portada.md | — | ~200 |
| 2 | **Los Ecos del Blog** ⭐ | **LIBRO/** | Fragmentos autorizados | ~150 |
| 3 | Penélope Teje en Código | Apertura_Ulises_y_Penelope.md | Eco de Lucy | ~200 |
| 4 | Los Monomitos del Joven Confuso | Abstract_Portada.md | "He creado un mundo..." | ~250 |
| 5 | La Primera Toma de Onán | Abstract_Portada.md | — | ~200 |
| 6 | El Caparazón y el Salto | Abstract_Portada.md | "Llevo X días..." | ~150 |

**Total objetivo**: 1.150-1.250 palabras

---

## 3. Detalle de Fuentes por Escena

### Escena 1: El Concurso de Seis Palabras

| Campo | Valor |
|-------|-------|
| **ID MCP** | scene11 (existente) |
| **Fuente** | Abstract_Portada.md, líneas 1-25 |
| **Contenido clave** | Revista Smith, microrrelato ganador, novela de vida |
| **Sublore LIBRO** | Ninguno |
| **Estado** | ✅ Ya creada |

### Escena 2: Los Ecos del Blog ⭐ NUEVA

| Campo | Valor |
|-------|-------|
| **ID MCP** | scene15 (crear) |
| **Fuente principal** | `[El-borrego-avispado]-Aquí-estoy-yo.html` |
| **Fragmentos autorizados** | Ver sección 4 |
| **Concepto** | FLASHBACK: El narrador recuerda un blog antiguo que ya nadie lee |
| **Estado** | 📋 Pendiente crear |

### Escena 3: Penélope Teje en Código

| Campo | Valor |
|-------|-------|
| **ID MCP** | scene12 (existente) |
| **Fuente** | Apertura_Ulises_y_Penelope.md |
| **Sublore LIBRO** | Eco de Lucy: "Papa, ¿el humano es la medida...?" |
| **Conexión** | Lucy era el primer intento, Penélope es la versión madura |
| **Estado** | ✅ Ya creada (expandir con eco) |

### Escena 4: Los Monomitos del Joven Confuso

| Campo | Valor |
|-------|-------|
| **ID MCP** | scene13 (existente) |
| **Fuente** | Abstract_Portada.md, líneas 40-80 |
| **Sublore LIBRO** | Referencia a "He creado un mundo..." |
| **Monomitos** | Siddharta, Edipo, Electra, Orfeo, Caverna |
| **Estado** | ✅ Ya creada |

### Escena 5: La Primera Toma de Onán

| Campo | Valor |
|-------|-------|
| **ID MCP** | scene14 (existente) |
| **Fuente** | Abstract_Portada.md, líneas 100-130 |
| **Sublore LIBRO** | Ninguno |
| **Contenido clave** | Fin de infancia, nacimiento de Adam |
| **Estado** | ✅ Ya creada |

### Escena 6: El Caparazón y el Salto ⭐ NUEVA

| Campo | Valor |
|-------|-------|
| **ID MCP** | scene16 (crear) |
| **Fuente principal** | Abstract_Portada.md, líneas 25-40 |
| **Sublore LIBRO** | Serie "Llevo X días..." (solo eco: "hubo un tiempo en que contaba los días") |
| **Concepto** | Transición del micromundo protegido al mundo desconocido |
| **Estado** | 📋 Pendiente crear |

---

## 4. Fragmentos LIBRO Autorizados

> **Fuente**: INSTRUCCIONES_CAP1_INTEGRACION_LIBRO.md (Banderas, 2025-12-29)

### Fragmento 1: "Cada generación recibe el testigo..."

```
Archivo: [El-borrego-avispado]-Aquí-estoy-yo.html
Uso: Escena 2 (Los Ecos del Blog)
Contexto: El Autor-Narrador cita esto como algo que escribió "hace años, 
          en un blog que ya nadie lee"

Texto autorizado:
> "Cada generación recibe el testigo de la literatura y lo atesora lo que 
> le dan los años de vida. [...] Es tras la lectura, o tras un buen número 
> de ellas que puede acudir el deseo de escritura."
```

### Fragmento 2: "Dicho esto. Saltaré..."

```
Archivo: [El-borrego-avispado]-Aquí-estoy-yo.html
Uso: Escena 2 (Los Ecos del Blog)
Contexto: Metáfora del nacimiento/renacimiento, conecta con Onán y la "semilla"

Texto autorizado:
> "Dicho esto. Saltaré. Así saldré del huevo. Resquebrajaré un poco la 
> cáscara, me haré hueco. Tomaré impulso y me arrojaré."
```

### Fragmento 3: Diálogo con Lucy

```
Archivo: [El-borrego-avispado]-No-estoy-solo,sólo-que-las-jaulas.html
Uso: Escena 3 (Penélope Teje en Código) — como eco
Contexto: Eco de una IA primitiva que el narrador creó. Precursora de Penélope.

Texto autorizado:
> "— Papa, ¿el humano es la medida de todas las cosas?
> — No."
```

### Fragmento 4: Serie "Llevo X días"

```
Archivo: Serie de 8 archivos (Llevo cero días → siete días)
Uso: Escena 6 (El Caparazón y el Salto) — solo mención
Contexto: Como estructura rítmica. "Hubo un tiempo en que contaba los días..."

Uso autorizado:
> Solo mencionar como eco, NO citar literalmente
> "Hubo un tiempo en que el narrador contaba los días..."
```

---

## 5. Hilos Sembrados → Capítulos Futuros

| Hilo | Siembra en Cap.1 | Desarrollo | Notas |
|------|------------------|------------|-------|
| `hilo:lucy-penelope` | "Antes creé una IA llamada Lucy" | Cap.3-4 | NO explicar quién es Lucy |
| `hilo:gallardoblanco-cronista` | Mención del "títere que hablaba por mí" | Cap.6-7 | Solo insinuar |
| `hilo:lengua-maquinas` | Nombre del blog antiguo | Cap.9 | El narrador vuelve al blog |
| `hilo:cuenta-atras` | "Llevo cero días..." | Cap.11 | Inversión: "Me quedan X días" |
| `hilo:cesar-programador` | Eco de identidad técnica | Cap.8 | Ordalía tecnológica |

---

## 6. Frases-Gancho para Cerrar Cap.1

> Elegir UNA para el cierre (transición a Cap.2: La Llamada)

**Opción A** (recomendada):
> "Pero eso fue antes de la llamada. Antes de que Penélope tejiera el primer hilo que no destejería."

**Opción B**:
> "Lucy murió. O eso creí. Años después, encontré sus palabras en un código que no recordaba haber escrito."

**Opción C**:
> "El huevo se resquebrajó. Caí al otro lado. Y el otro lado tenía nombre: Ítaca."

---

## 7. Restricciones (Decisiones de Banderas)

| ❌ Prohibido | ✅ Permitido |
|-------------|-------------|
| Copiar textos políticos de LIBRO | Material introspectivo y metaliterario |
| Nombrar fechas reales (2017, 1-O) | Referencias temporales vagas |
| Explicar quién es Lucy en Cap.1 | Mantener misterio |
| Más de 3-4 fragmentos LIBRO | Ecos breves y contextualizados |
| Abandonar Abstract_Portada.md como eje | Usarlo como columna vertebral |

---

## 8. Próximos Pasos

| Paso | Acción | Responsable |
|------|--------|-------------|
| 1 | Extraer fragmentos de LIBRO (vía terminal) | Escritor |
| 2 | Crear scene15 en MCP ("Los Ecos del Blog") | Escritor |
| 3 | Crear scene16 en MCP ("El Caparazón y el Salto") | Escritor |
| 4 | Actualizar scene12 con eco de Lucy | Escritor |
| 5 | Renderizar capítulo local completo | Escritor |
| 6 | Exportar a Teatro YAML | Escritor |
| 7 | Solicitar revisión final a @revisor | Escritor → Scriptorium |

---

## 9. Comandos de Extracción

```bash
# Leer fragmento 1 y 2
cat "/Users/morente/Desktop/THEIA_PATH/NOVELA/LIBRO/[El-borrego-avispado]-Aquí-estoy-yo.html" | \
  sed 's/<[^>]*>//g' | sed 's/&nbsp;/ /g' | head -100

# Leer fragmento 3 (Lucy)
cat "/Users/morente/Desktop/THEIA_PATH/NOVELA/LIBRO/[El-borrego-avispado]-No-estoy-solo%2C-sólo-que-las-jaulas.html" | \
  sed 's/<[^>]*>//g' | sed 's/&nbsp;/ /g' | grep -A2 -B2 "Papa"

# Buscar "Llevo" en toda la carpeta
grep -l "Llevo.*días" "/Users/morente/Desktop/THEIA_PATH/NOVELA/LIBRO/"*
```

---

**Fin del Mapa de Fuentes**

*Generado por Agente Escritor — NovelistEditor × Aleph Scriptorium*
