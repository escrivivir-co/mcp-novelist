# Aleph MCP - Sitio Web

Este directorio contiene los archivos del sitio web para Aleph MCP, alojado en GitHub Pages.

## Estructura de Archivos

```
docs/
├── index.html             # Página principal
├── novel-catalog.html     # Catálogo de novelas
├── common.css             # Estilos comunes a todas las páginas
├── DOCUMENTATION.md       # Documentación técnica del proyecto
├── CATALOG_DOCUMENTATION.md # Documentación del catálogo
├── api/                   # Datos JSON para el catálogo
│   └── novel-data.json    # Datos de novelas, personajes y escenas
├── css/                   # Estilos específicos de cada página
│   ├── home-styles.css    # Estilos para la página principal
│   └── catalog-styles.css # Estilos para el catálogo de novelas
├── js/                    # JavaScript 
│   ├── constants.js       # Constantes compartidas entre scripts
│   ├── utils.js           # Funciones de utilidad compartidas
│   ├── main.js            # Script principal para la página de inicio
│   ├── catalog.js         # Script para el catálogo de novelas
│   └── init.js            # Script de verificación de archivos cargados
└── images/                # Imágenes utilizadas en el sitio
    ├── stars-mono.svg     # Fondo de estrellas (monocromático)
    └── twinkle-mono.svg   # Efecto de destello (monocromático)
```

## Arquitectura

El sitio está estructurado siguiendo un patrón de diseño modular, con una clara separación entre:

1. **Estructura (HTML)**: Contenido y estructura de las páginas
2. **Presentación (CSS)**: Estilos visuales
3. **Comportamiento (JS)**: Interactividad y funcionalidad

### Enfoque de Diseño

- **Tema Monocromático**: Diseño en escala de grises con detalles minimalistas
- **Responsivo**: Adaptable a diferentes tamaños de pantalla
- **Accesible**: Se han considerado aspectos básicos de accesibilidad
- **Modular**: Componentes reutilizables y código organizado

## Componentes Principales

### Página Principal

La página principal (`index.html`) presenta una introducción al proyecto Aleph MCP, incluyendo:

- Terminal simulado con efecto de escritura
- Características principales
- Instrucciones de instalación
- Tutorial paso a paso

### Catálogo de Novelas

El catálogo (`novel-catalog.html`) permite explorar y gestionar:

- Novelas
- Personajes
- Escenas
- Relaciones entre ellos

Incluye funcionalidades como:
- Filtrado por tipo (novelas, personajes, escenas)
- Búsqueda por texto
- Vista detallada en modal
- Modo de lectura para novelas
- Visualización de relaciones entre elementos

## Guía de Estilos

### Colores

Se utiliza una paleta monocromática:

- **Negro (#000000)**: Color principal para textos y elementos importantes
- **Gris oscuro (#222222)**: Fondo de elementos y texto secundario
- **Gris medio (#777777)**: Elementos de interfaz y detalles
- **Gris claro (#aaaaaa)**: Texto de menor importancia y bordes
- **Gris muy claro (#dddddd)**: Fondos de elementos y separadores
- **Blanco (#ffffff)**: Fondo de la página y texto sobre fondos oscuros

### Tipografía

- **Orbitron**: Títulos y elementos destacados
- **Segoe UI / Sans-serif**: Texto general
- **Monospace**: Bloques de código y terminal

## Configuración de GitHub Pages

Para habilitar GitHub Pages en este repositorio:

1. Ve a la configuración del repositorio en GitHub
2. Navega a la sección "Pages"
3. En "Source", selecciona la rama principal y el directorio "/docs"
4. Guarda los cambios

Una vez configurado, el sitio estará disponible en: `https://[usuario].github.io/aleph-mcp/`

## Documentación

- **[DOCUMENTATION.md](DOCUMENTATION.md)** - Documentación técnica completa del proyecto
- **[CATALOG_DOCUMENTATION.md](CATALOG_DOCUMENTATION.md)** - Guía específica del catálogo de novelas

## Mantenimiento

Para modificar o extender el sitio:

1. **Añadir nueva página**: Crear HTML, CSS y JS correspondiente siguiendo la estructura existente
2. **Modificar estilos**: Actualizar `common.css` para cambios globales o los archivos específicos para cambios locales
3. **Añadir funcionalidad**: Extender los archivos JS existentes o crear nuevos según sea necesario

## Scripts de Actualización

En la carpeta `scripts/` se encuentran utilidades para:

- **update-catalog.js**: Actualizar el catálogo de novelas desde fuentes externas
- **manage-catalog.js**: Gestionar manualmente el catálogo (añadir, editar, eliminar)

## Licencia

Este sitio web está bajo la misma licencia que el proyecto principal Aleph MCP.
