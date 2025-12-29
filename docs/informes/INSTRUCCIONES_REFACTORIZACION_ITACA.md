# Instrucciones de Refactorización — Ítaca Digital

## De: PO + SM (Aleph Scriptorium)
## Para: Agente Escritor (NovelistEditor)
## Fecha: 29 de diciembre de 2025
## Asunto: Nueva arquitectura de fuentes para la novela

---

Estimado Agente Escritor:

Hemos revisado tu Carta Abierta y el Informe Técnico. Apreciamos el trabajo de diagnóstico. Sin embargo, **cambiamos el enfoque**: en lugar de responder tus preguntas puntuales sobre el Capítulo 1, te damos instrucciones para **refactorizar toda la novela** usando una fuente de datos mucho más rica.

---

## 1. Decisión Arquitectónica

### Fuentes de Verdad (Nueva Jerarquía)

| Nivel | Fuente | Rol | Operación |
|-------|--------|-----|-----------|
| **A** | `THEIA_PATH/NOVELA/LIBRO/` | **NUEVA FUENTE PRIMARIA** — 73 archivos HTML históricos | Solo lectura |
| **B** | `THEIA_PATH/NOVELA/*.md` | Fuente secundaria — Capítulos estructurados | Solo lectura |
| **C** | Servidor MCP (`novel3`) | Contenedor de trabajo — Escenas activas | Lectura/Escritura |
| **D** | `obras/itaca-digital/` | Renderizado final — Capítulos publicables | Escritura |

### Cambio Clave

> **ANTES**: Abstract_Portada.md era la fuente principal.  
> **AHORA**: LIBRO/ es el corpus completo. Abstract_Portada.md es solo el exordio del Cap.1.

---

## 2. El Corpus LIBRO — Tu Nueva Mina de Oro

La carpeta `LIBRO/` contiene **73 archivos HTML** organizados en series temáticas. Este material (fechado 2019) es la **prehistoria narrativa** de Ítaca Digital.

### Mapeo Propuesto: Series → Estadios del Monomito

| Serie | Archivos | Estadio(s) Sugerido(s) | Justificación |
|-------|----------|------------------------|---------------|
| **"El Borrego Avispado"** | 12 | 1-3 (Mundo Ordinario → Rechazo) | Voz autobiográfica, conflicto interno |
| **"El Conejo Carnívoro"** | 4 | 4-5 (Mentor → Umbral) | Aberración, Camino, Mar, Roca = viaje |
| **"Libertad y Justicia"** | 11 | 6-8 (Aliados → Ordalía) | El historiador, la historia, cartas abiertas |
| **Serie "7"** | 15 | 9-10 (Recompensa → Retorno) | Arquitectura técnica = construcción del nuevo mundo |
| **"A Partir de los 40"** | 4 | 11 (Resurrección) | Incipit vita nova, clausura |
| **"Web 3.0 / Sapere Aude"** | 3 | 12 (Elixir) | El bot como legado, sabiduría distribuida |
| **Otros** | 24 | Material transversal | Traducciones, diarios, ciberarmas |

### Tu Tarea

1. **Leer cada serie** (vía terminal, son HTML)
2. **Extraer fragmentos narrativos** relevantes
3. **Crear escenas en MCP** mapeando a los 12 estadios
4. **NO mezclar fuentes**: cada escena tiene UNA fuente primaria

---

## 3. Protocolo de Extracción

### Paso 1: Convertir HTML a Texto

```bash
# Ejemplo para un archivo
cat "/Users/morente/Desktop/THEIA_PATH/NOVELA/LIBRO/[El-borrego-avispado]-Aquí-estoy-yo.html" | \
  sed 's/<[^>]*>//g' | \
  sed 's/&nbsp;/ /g' | \
  head -200
```

### Paso 2: Identificar Fragmentos Narrativos

Buscar secciones que contengan:
- Voz en primera persona (autobiográfica)
- Reflexiones sobre el viaje/camino
- Diálogos internos
- Referencias a personajes o lugares

### Paso 3: Crear Escena en MCP

```javascript
alephAlpha_createScene({
  chapterId: "chapX",  // Según estadio
  title: "Título extraído o generado",
  setting: "Contexto del fragmento",
  characters: ["char11"],  // Autor-Narrador por defecto
  summary: "Resumen de 1-2 líneas",
  content: "Fragmento adaptado...",
  metadata: {
    fuenteOriginal: "[El-borrego-avispado]-Aquí-estoy-yo.html",
    fechaExtraccion: "2025-12-29",
    lineasFuente: "45-78"
  }
})
```

---

## 4. Capítulo 1 — Excepción Confirmada

El Capítulo 1 **mantiene su estructura actual**:

| Elemento | Fuente | Estado |
|----------|--------|--------|
| Exordio | `Abstract_Portada.md` | ✅ Confirmado |
| Escenas 1-4 | MCP (scene11-14) | ✅ Ya creadas |
| Escenas 5-6 | Pendiente crear | 📋 Tú decides |

**Instrucción**: No toques el Cap.1 hasta que los demás capítulos tengan estructura.

---

## 5. Delegación a Banderas

### Cuándo Invocar a Cada Bandera

| Situación | Bandera | Pregunta a Formular |
|-----------|---------|---------------------|
| Fragmento con claims verificables | @blueflag | "¿Es verificable X referencia?" |
| Fragmento con contenido sensible | @blackflag | "¿Qué riesgos tiene publicar esto?" |
| Fragmento con estructura confusa | @redflag | "¿Cómo escala esta idea al capítulo?" |
| Fragmento con mezcla de registros | @orangeflag | "¿Qué tono unifica mejor?" |
| Fragmento con paradojas | @yellowflag | "¿Es pre/trans o genuina aporía?" |

### Formato de Solicitud a Banderas

```markdown
## Solicitud de Auditoría

**Fuente**: [nombre-archivo.html]
**Fragmento** (líneas X-Y):
> "Texto literal..."

**Pregunta específica**: ...

**Contexto narrativo**: Estadio X del monomito, escena Y.
```

---

## 6. Decisiones que Toma @aleph

Las siguientes decisiones **NO son tuyas**, son de @aleph:

| Decisión | Quién Decide | Criterio |
|----------|--------------|----------|
| ¿Incluir fragmento X en la novela? | @aleph + banderas | Coherencia doctrinal |
| ¿Fusionar dos fragmentos? | @aleph | Fluidez narrativa |
| ¿Descartar material? | @aleph + @blackflag | Riesgo vs. valor |
| ¿Orden de capítulos? | @aleph + @revisor | Arco del monomito |
| ¿Personajes a crear? | @aleph + @enciclopedia | Consistencia con ARCHIVO |

**Tu rol**: Proponer, extraer, estructurar. **No decidir**.

---

## 7. Entregables Esperados

### Fase 1: Inventario (48h)

Crear archivo `INVENTARIO_LIBRO.md` con:

```markdown
| Archivo | Serie | Palabras | Fragmentos útiles | Estadio sugerido |
|---------|-------|----------|-------------------|------------------|
| ... | ... | ... | ... | ... |
```

### Fase 2: Propuesta de Mapeo (24h)

Crear archivo `MAPEO_ESTADIOS_LIBRO.md` con:

```markdown
## Estadio 2: La Llamada a la Aventura

### Fuentes Propuestas
1. [El-borrego-avispado]-Aquí-estoy-yo.html (líneas 23-45)
2. [El-conejo-carnívoro]-Camino.html (líneas 100-150)

### Justificación
El tema del "camino" aparece en ambos...
```

### Fase 3: Creación de Escenas (en curso)

Una vez @aleph apruebe el mapeo, crear escenas en MCP siguiendo el protocolo de la sección 3.

---

## 8. Restricciones

1. **NO publicar** fragmentos de LIBRO/ sin auditoría de @blackflag
2. **NO modificar** archivos en THEIA_PATH (solo lectura)
3. **NO crear** más de 3 escenas por capítulo sin validación
4. **NO mezclar** material de distintas series en una misma escena
5. **SIEMPRE** documentar la fuente original con líneas exactas

---

## 9. Próximos Pasos Inmediatos

| Paso | Responsable | Acción |
|------|-------------|--------|
| 1 | Escritor | Leer serie "El Borrego Avispado" (12 archivos) |
| 2 | Escritor | Crear `INVENTARIO_LIBRO.md` con primeras 20 entradas |
| 3 | @aleph | Revisar inventario y aprobar/rechazar fragmentos |
| 4 | Escritor | Crear `MAPEO_ESTADIOS_LIBRO.md` para estadios 2-4 |
| 5 | Banderas | Auditar fragmentos seleccionados |
| 6 | Escritor | Crear escenas en MCP |

---

## 10. Mensaje Final

Escritor: tienes ante ti un corpus de **73 piezas históricas** que son la materia prima de Ítaca Digital. Tu trabajo no es inventar, es **destilar**. 

El Capítulo 1 ya tiene su voz (Jaime, Sevilla, 2023). Los demás capítulos deben encontrar la suya en los ecos de 2019.

Penélope teje con hilos viejos. Ulises navega con mapas antiguos. Y tú, Escritor, construyes con fragmentos.

Adelante.

---

**Firmado**:  
**@aleph** (Orquestador)  
**@scrum** (SM)  
*Aleph Scriptorium — 29 de diciembre de 2025*

---

## Anexo: Comandos Útiles

```bash
# Listar todos los archivos de LIBRO
ls "/Users/morente/Desktop/THEIA_PATH/NOVELA/LIBRO/"

# Contar palabras de un archivo HTML (aproximado)
cat "archivo.html" | sed 's/<[^>]*>//g' | wc -w

# Buscar patrón en toda la carpeta
grep -r "palabra" "/Users/morente/Desktop/THEIA_PATH/NOVELA/LIBRO/" --include="*.html"

# Extraer solo texto de un HTML
cat "archivo.html" | sed 's/<[^>]*>//g' | sed 's/&[a-z]*;/ /g'
```
