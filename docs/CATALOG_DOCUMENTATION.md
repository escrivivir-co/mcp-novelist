# Documentación del Catálogo de Novelas

## Introducción

El Catálogo de Novelas de Aleph MCP es una interfaz web diseñada para explorar y gestionar el contenido narrativo generado mediante el protocolo MCP. La interfaz permite visualizar, filtrar y acceder al contenido de novelas, personajes y escenas de manera integrada.

## Estructura del Catálogo

### Datos

Los datos del catálogo se almacenan en formato JSON en `./api/novel-data.json` con la siguiente estructura:

```json
{
  "novels": [
    {
      "id": "string",
      "title": "string",
      "name": "string",
      "description": "string",
      "genre": "string",
      "characters": ["string"],
      "chapters": [
        {
          "title": "string",
          "description": "string",
          "scenes": ["string"]
        }
      ]
    }
  ],
  "characters": [
    {
      "id": "string",
      "name": "string",
      "description": "string",
      "role": "string",
      "traits": ["string"],
      "background": "string"
    }
  ],
  "scenes": [
    {
      "id": "string",
      "title": "string",
      "setting": "string",
      "content": "string",
      "characters": ["string"]
    }
  ]
}
```

### Vistas

El catálogo ofrece tres vistas principales que pueden alternarse mediante los botones de la parte superior:

1. **Novelas**: Muestra todas las novelas disponibles con información básica.
2. **Personajes**: Muestra todos los personajes del universo narrativo.
3. **Escenas**: Muestra todas las escenas individuales.

## Funcionalidades

### Búsqueda y Filtrado

- La barra de búsqueda permite filtrar elementos por nombre o descripción.
- Los resultados se actualizan dinámicamente mientras se escribe.

### Visualización Detallada

Al hacer clic en cualquier elemento del catálogo, se abre un modal con información detallada:

- **Novelas**: Muestra descripción, personajes, capítulos y escenas.
- **Personajes**: Muestra descripción, rasgos, trasfondo y novelas en las que aparece.
- **Escenas**: Muestra ambientación, personajes presentes y contenido.

### Modo de Lectura

Para las novelas, existe un "Modo Lectura" que permite:

- Leer la novela completa o capítulos individuales.
- Vista optimizada para lectura a pantalla completa.
- Navegación entre capítulos.

## Actualización de Datos

Los datos del catálogo se actualizan mediante dos scripts:

1. **update-catalog.js**: Transforma datos de fuentes externas al formato requerido por el catálogo.
2. **manage-catalog.js**: Herramienta CLI para añadir, editar o eliminar elementos manualmente.

Para actualizar el catálogo:

```bash
node scripts/update-catalog.js
```

Para gestionar manualmente:

```bash
node scripts/manage-catalog.js --action=add --type=novel
node scripts/manage-catalog.js --action=edit --type=character --id=char123
node scripts/manage-catalog.js --action=delete --type=scene --id=scene456
```

## Diseño Visual

El catálogo utiliza un diseño monocromático con elementos de interfaz minimalistas:

- Tarjetas para cada elemento con información resumida.
- Modal para visualización detallada.
- Acordeón para capítulos y escenas.
- Indicadores de estado del servidor.

## Integración con MCP

El catálogo se comunica con el servidor MCP para obtener datos actualizados. El estado de conexión se muestra en la parte superior de la página.

## Extensión

Para añadir nuevos tipos de elementos al catálogo:

1. Actualizar la estructura JSON en `novel-data.json`.
2. Añadir una nueva vista en `toggle-btn` en el HTML.
3. Implementar las funciones de renderizado en `catalog.js`.
4. Añadir estilos correspondientes en `catalog-styles.css`.
