<!-- filepath: d:\ALEPH-ALPHA\ALEPH_MCP\aleph-mcp\aleph-mcp\HINT.md -->
MCP Tool:
alephAlpha_getNovelistSystemInfo

### GitHub Copilot

I'll help you get information about the Novelist Assistant system architecture and features using the relevant tool.

Ran `alephAlpha_getNovelistSystemInfo` 

[AlephAlpha (MCP Server)](codebase "command:workbench.mcp.showConfiguration?%255B%2522mcp.config.wf1%2522%252C%2522mcp.config.wf1.AlephAlpha%2522%255D")

Novelist Assistant System - AlephAlpha
======================================

Based on the information retrieved, the AlephAlpha Novelist Assistant is a comprehensive system designed to aid in creative writing processes. Here's a summary of its architecture and capabilities:

Overview
--------

The Novelist Assistant provides tools to help with creative writing by managing resources like novels, characters, scenes, and chapters, as well as offering specialized prompt templates for different writing tasks.

System Architecture
-------------------

### Components

1.  **Resources**

    -   **Novel**: Main container with properties like id, title, author, genre, summary, characters, chapters, setting, and timeline
    -   **Character**: Represents a character with id, name, description, traits, and backstory
    -   **Scene**: Individual narrative unit with id, title, setting, characters, summary, and content
    -   **Chapter**: Groups related scenes under a common title, with id, title, scenes, and summary
2.  **Prompt Templates**

    -   Pre-defined text templates for various creative writing aspects:
        -   `start-novel`: For beginning a new novel
        -   `develop-character`: For in-depth character development
        -   `continue-scene`: For continuing an in-progress scene
        -   `plot-development`: For generating plot development ideas
        -   `writing-feedback`: For obtaining feedback on written passages
3.  **Tools**

    -   MCP functions for interacting with resources and templates:
        -   `alephAlpha_listNovels`: Lists all available novels
        -   `alephAlpha_getNovelDetails`: Gets detailed information about a specific novel
        -   `alephAlpha_listCharacters`: Lists characters, optionally filtered by novel
        -   `alephAlpha_getCharacterDetails`: Gets detailed information about a character
        -   `alephAlpha_getScene`: Gets the content of a specific scene
        -   `alephAlpha_listNovelistPromptTemplates`: Lists available writing templates
        -   `alephAlpha_getNovelistPromptTemplate`: Gets a specific template
        -   `alephAlpha_applyNovelistPromptTemplate`: Applies variables to a template
        -   `alephAlpha_createNovel`: Creates a new novel
        -   `alephAlpha_createCharacter`: Creates a new character
        -   `alephAlpha_createScene`: Creates a new scene
        -   `alephAlpha_createChapter`: Creates a new chapter
        -   `alephAlpha_updateScene`: Updates an existing scene
        -   `alephAlpha_deleteChapter`: Deletes an existing chapter
        -   `alephAlpha_saveCurrentState`: Manually saves all resources to disk
        -   `alephAlpha_configureAutoSave`: Enables or disables automatic saving

4.  **Persistence System**

    -   Automatic persistence of changes to resources:
        -   All modifications to novels, characters, scenes, and chapters are automatically saved
        -   Changes persist across server restarts
        -   Manual saving possible with `alephAlpha_saveCurrentState` tool
        -   Auto-save feature can be toggled with `alephAlpha_configureAutoSave` tool

Recommended Workflow
--------------------

1.  Explore available novels with `alephAlpha_listNovels`
2.  Create or select an existing novel
3.  Explore or create characters using `alephAlpha_listCharacters` and `alephAlpha_getCharacterDetails`
4.  Work on specific scenes with `alephAlpha_getScene`
5.  Use prompt templates for various writing tasks with `alephAlpha_applyNovelistPromptTemplate`
6.  Make changes to novels, characters, and scenes as needed (all changes are automatically persisted)
7.  Use `alephAlpha_saveCurrentState` if you want to force an immediate save of all resources

Best Practices
--------------

-   Organize characters and scenes before writing complete chapters
-   Use prompt templates to overcome writer's block
-   Keep summaries updated for easier navigation
-   Develop characters in depth using the develop-character template
-   Request feedback on written passages using writing-feedback
-   Rely on automatic persistence for most operations
-   Use manual save function (`alephAlpha_saveCurrentState`) after critical changes
-   If experiencing performance issues, consider disabling auto-save temporarily with `alephAlpha_configureAutoSave`

This system appears to be implemented as part of your MCP (Model Context Protocol) project, providing a structured approach to creative writing assistance with robust persistence capabilities to ensure your creative work is always saved.
