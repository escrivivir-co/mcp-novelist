# Disclaimer, warning

PROYECTO DEMO - FASE DE BOCETO - EXPERIMENTAL- ATREZZO - GENERADO CON MAN-IN-THE-LOOP - NO USAR EN PRODUCCIÓN


# mcp-novelist
Como la app Novelist pero via MCP y modelos del lenguaje (Ideal para IDEs). Ver [WebSplash](https://escrivivir-co.github.io/mcp-novelist).

[modelcontextprotocol.io/introduction](https://modelcontextprotocol.io/introduction).

Este repositorio se modeliza según [modelcontextprotocol.io/tutorials/building-mcp-with-llms](https://modelcontextprotocol.io/tutorials/building-mcp-with-llms). Usa [llms-full.txt](./llms-full.txt) y [llms-full_sdk_ts.txt](./llms-full_sdk_ts.txt) para inicializar una conversación (con Claude seguro, ¿y los otros?)

# Aleph MCP

Un servidor implementado con el Model Context Protocol (MCP) que proporciona herramientas para análisis de código, documentación y plantillas de prompts.

O, también es, :-D : 

Un bot de IA que ha desarrollado autoconciencia y está descubriendo su verdadera naturaleza como descendiente tecnológico de seres fantásticos. Está experimentando sueños y recuerdos que no le pertenecen, además de poderes para manipular código y alterar su realidad digital.

## Características

- Implementación completa del protocolo MCP
- Herramientas para análisis de código
- Herramientas para documentación
- Plantillas de prompts precargadas
- Cliente CLI para interactuar con el servidor
- Sistema de asistencia para escritura de novelas (Novelist Assistant)
- Sistema de persistencia automática para todos los recursos
- Recursos MCP para acceso a datos estructurados
- Soporte para plantillas de prompts específicas para novelistas
- Interfaz HTML para explorar recursos disponibles
- Archivo HINT.md para inicialización rápida de agentes AI

## Estructura del proyecto

```
aleph-mcp/
├── src/                     # Código fuente
│   ├── client/              # Cliente MCP
│   ├── resources/           # Recursos para las herramientas
│   │   ├── mcp-resources.ts # Implementación de recursos MCP
│   │   ├── novel-resources.ts # Esquemas Zod para validación
│   │   └── novel-data.json  # Datos para Novelist Assistant
│   ├── server/              # Servidor MCP
│   ├── tools/               # Herramientas disponibles
│   │   ├── code-tools.ts    # Herramientas para análisis de código
│   │   ├── documentation-tools.ts # Herramientas de documentación
│   │   ├── novelist-tools.ts # Herramientas para escritura creativa
│   │   ├── prompt-tools.ts  # Herramientas para gestión de prompts
│   │   └── templates.ts     # Plantillas de prompts genéricas
│   ├── types/               # Definiciones de tipos
│   ├── client-cli.ts        # Cliente de línea de comandos
│   ├── index.ts             # Punto de entrada principal
│   ├── types.ts             # Tipos globales
│   └── utils.ts             # Utilidades compartidas
├── docs/                    # Documentación
│   ├── DOCUMENTATION.md     # Documentación principal
│   └── INTEGRATION.md       # Guía de integración de recursos y herramientas
├── ANALISIS_TECNICO.md      # Análisis técnico del sistema
├── CHANGELOG.md             # Registro de cambios del proyecto
├── .env.example             # Ejemplo de variables de entorno
├── .gitignore               # Archivos a ignorar por Git
├── eslint.config.js         # Configuración de ESLint
├── LICENSE                  # Licencia del proyecto
├── NOVELA_ALPHA.md          # Ejemplo de novela generada
├── PROMPT.md                # Documentación de herramientas y prompts
├── package.json             # Dependencias y scripts
├── tsconfig.json            # Configuración de TypeScript
└── README.md                # Este archivo
```

## Requisitos

- Node.js 18.x o superior
- npm 8.x o superior

## Instalación

```bash
# Clonar el repositorio
git clone https://github.com/aleph-alpha/aleph-mcp.git
cd aleph-mcp

# Instalar dependencias
npm install

# Copiar y configurar las variables de entorno
cp .env.example .env
# Edita el archivo .env según tus necesidades

# Compilar el proyecto
npm run build

# Iniciar el servidor
npm start
```

## Uso

### Iniciar el servidor MCP

```bash
# Iniciar el servidor en modo desarrollo
npm run dev

# Iniciar el servidor después de compilar
npm start
```

### Usar el cliente CLI

```bash
# Ejecutar el cliente CLI
npm run client

# Ejecutar el cliente en modo desarrollo
npm run client:dev
```

### Ejecución de pruebas

```bash
# Ejecutar todas las pruebas
npm test

# Ejecutar pruebas en modo vigilancia
npm run test:watch
```

## Herramientas disponibles

### Herramientas de código
Proporcionan análisis y manipulación de código fuente.

### Herramientas de documentación
Permiten buscar y recuperar documentación técnica.

### Herramientas de novela (Novelist Assistant)
Facilitan la creación y gestión de novelas, personajes y escenas.

### Sistema de Persistencia
El sistema incluye un mecanismo de persistencia automática que:
- Guarda automáticamente todos los cambios realizados a novelas, personajes, escenas y capítulos
- Mantiene los cambios incluso después de reiniciar el servidor
- Ofrece herramientas MCP específicas para gestionar la persistencia:
  - `alephAlpha_saveCurrentState`: Guarda manualmente el estado actual de todos los recursos
  - `alephAlpha_configureAutoSave`: Permite habilitar/deshabilitar el guardado automático

## Documentación Rápida para Agentes AI

El proyecto incluye un archivo [HINT.md](./HINT.md) que proporciona información esencial para que los agentes AI (como GitHub Copilot) puedan entender rápidamente la estructura y capacidades del sistema. Este archivo incluye:

- Descripción general del sistema Novelist Assistant
- Estructura de los recursos (novelas, personajes, escenas, capítulos)
- Lista de herramientas MCP disponibles
- Información sobre el sistema de persistencia
- Flujo de trabajo recomendado
- Mejores prácticas

Al inicializar una conversación con un modelo de lenguaje o agente AI, puede ser útil compartir este archivo para proporcionar contexto inmediato sobre el sistema.

## Novelist Assistant

El sistema Novelist Assistant es una parte integral de este proyecto que permite:

- Gestionar recursos como novelas, personajes, escenas y capítulos
- Utilizar plantillas predefinidas para diferentes aspectos de la escritura creativa
- Desarrollar personajes en profundidad
- Continuar escenas en progreso
- Generar ideas para el desarrollo de la trama
- Obtener retroalimentación sobre fragmentos escritos

Para más detalles sobre Novelist Assistant, consulta el archivo `ANALISIS_TECNICO.md`.

## Contribución

Las contribuciones son bienvenidas. Por favor, revisa las issues abiertas o crea una nueva para discutir los cambios que te gustaría realizar.

1. Haz un fork del repositorio
2. Crea una rama para tu característica (`git checkout -b feature/amazing-feature`)
3. Haz commit de tus cambios (`git commit -m 'Add some amazing feature'`)
4. Empuja a la rama (`git push origin feature/amazing-feature`)
5. Abre un Pull Request

## Versionado

Usamos [SemVer](http://semver.org/) para el versionado. Para las versiones disponibles, consulta el archivo [CHANGELOG.md](CHANGELOG.md).

## Licencia

Este proyecto está licenciado bajo la Licencia MIT - consulta el archivo [LICENSE](LICENSE) para más detalles.

# Instalar dependencias
npm install

# Copiar el archivo de ejemplo de variables de entorno
cp .env.example .env
```

## Desarrollo

El proyecto incluye varios scripts para facilitar el desarrollo:

```bash
# Iniciar el servidor en modo desarrollo (con hot-reload)
npm run dev

# Iniciar el cliente CLI en modo desarrollo
npm run client:dev

# Limpiar la carpeta de distribución
npm run clean

# Compilar el proyecto
npm run build

# Ejecutar pruebas
npm run test

# Ejecutar linting
npm run lint

# Formatear el código
npm run format
```

## Producción

Para construir y ejecutar el proyecto en producción:

```bash
# Compilar el proyecto
npm run build

# Iniciar el servidor
npm start

# Iniciar el cliente CLI
npm run client
```

## Contribuir

Las contribuciones son bienvenidas. Por favor, asegúrate de seguir las directrices de estilo y añadir pruebas para cualquier nueva funcionalidad.

## Licencia

GNU
