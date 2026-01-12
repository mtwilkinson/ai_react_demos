# Backend Documentation

## Overview

The Backend is a FastAPI application that provides AI-powered React component generation and modification capabilities. It uses LangChain agents with XAI (Grok) to generate and modify React TypeScript components that use Tailwind CSS.

## Architecture

The backend consists of five main Python modules:

1. **main.py** - FastAPI REST API server
2. **tools.py** - File operation utilities
3. **Build_page.py** - New component generation
4. **Modify_page.py** - Existing component modification
5. **linter.py** - Code validation and linting

## Module Descriptions

### main.py

The FastAPI application entry point that exposes REST API endpoints for component operations.

**Key Components:**
- **FastAPI Application**: Main web server running on port 3001
- **Prompt Model**: Request model for user prompts (prompt text + example ID)
- **Response Model**: Standardized API response format

**Endpoints:**
- `GET /` - Health check endpoint
- `POST /api/prompt` - Build or modify React components based on user prompts
  - Routes to `build_page()` for new components (example=0)
  - Routes to `modify_page()` for existing components (example=1-4)
- `GET /api/undo` - Undo the most recent changes to all example components

### tools.py

Utility module providing file operations and backup management for React component files.

**Key Functions:**
- `save_example(thread_id, code)`: Saves a React component file, creating a backup first
- `save_test(file_name, code)`: Saves code to a test file (test.tsx) during AI generation
- `read_file(file_name)`: Reads React component files from the examples directory
- `undo_prompt()`: Restores all example components from their backup copies
- `read_file_tool`: LangChain tool wrapper for file reading operations used by AI agents

**File Structure:**
- Base path: `../Frontend/src/examples`
- Backup path: `../Frontend/src/backups`
- Supports example components numbered 1-4

### Build_page.py

Handles generation of new React components from scratch using AI agents.

**Key Components:**
- **LangChain Agent**: Uses XAI Grok model (`grok-code-fast-1`) with tool-calling capabilities
- **Multi-threaded Generation**: Creates 5 parallel threads to generate multiple component variations
- **Linting Integration**: Validates generated code and attempts automatic error fixes

**Workflow:**
1. Receives user prompt for new component
2. Spawns 5 threads, each generating a component variation
3. Each thread:
   - Queries AI agent with the prompt
   - Saves generated code to `test.tsx`
   - Runs linter to validate code
   - If errors exist, attempts one auto-fix iteration
   - On success, copies `test.tsx` to `example.tsx`
   - On failure, resets to placeholder code

**AI Prompt Guidelines:**
- Generates TypeScript React functional components (.tsx)
- Uses Tailwind CSS for styling
- Includes interactive features with state management
- Avoids forms with onSubmit
- Ensures non-scrollable pages using flex-grow

### Modify_page.py

Handles modification of existing React components based on user prompts.

**Key Components:**
- **LangChain Agent**: Uses XAI Grok model with file reading capabilities
- **Multi-threaded Modification**: Creates 5 parallel threads for component modifications
- **Original File Context**: Reads existing component code to preserve structure

**Workflow:**
1. Receives user prompt and example number (1-4)
2. Spawns 5 threads, each modifying the component
3. Each thread:
   - Reads the original `example.tsx` file
   - Queries AI agent with modification prompt + original code
   - Saves modified code to `test.tsx`
   - Runs linter to validate code
   - If errors exist, attempts one auto-fix iteration
   - On success, copies `test.tsx` to `example.tsx`
   - On failure, resets to placeholder code

**AI Prompt Guidelines:**
- Modifies existing components while preserving structure
- Maintains TypeScript types and Tailwind CSS styling
- Preserves integration with existing project

### linter.py

Code validation module that uses ESLint to check generated React components.

**Key Functions:**
- `linter(example_number)`: Runs ESLint on a test file and returns success status + error messages
- `reset_code(example_number)`: Resets a component to a placeholder "Failed to generate" state

**Process:**
- Executes `npx eslint` on `test.tsx` files in the Frontend directory
- Returns boolean success status and error output
- Used by both Build_page and Modify_page to validate AI-generated code

## Data Flow

```
User Request → main.py → Build_page.py / Modify_page.py
                                    ↓
                            AI Agent (LangChain + XAI)
                                    ↓
                            tools.py (save_test)
                                    ↓
                            linter.py (validation)
                                    ↓
                            tools.py (save_example)
                                    ↓
                            Frontend/src/examples/
```

## Key Features

- **AI-Powered Generation**: Uses XAI Grok model for React component generation
- **Multi-threaded Processing**: Generates 5 variations in parallel for better results
- **Automatic Linting**: Validates code quality and attempts auto-fixes
- **Backup System**: Automatically creates backups before modifications
- **Undo Functionality**: Restores components to previous state
- **Error Handling**: Gracefully handles failures with placeholder components

## Dependencies

- FastAPI - Web framework
- LangChain - AI agent framework
- langchain-xai - XAI (Grok) integration
- Pydantic - Data validation
- uvicorn - ASGI server
- python-dotenv - Environment variable management

