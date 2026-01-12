# Project Summary

## Overview

This project consists of a **React + TypeScript frontend** and a **FastAPI backend** that work together to provide an AI-powered React component generation and modification system. Users can create prompts through the frontend interface, and the backend uses LangChain agents with XAI (Grok) to generate or modify React components.

## Frontend

### Tech Stack
- **React** (v19.1.1) with **TypeScript** (~5.8.3)
- **Vite** (^7.1.2) - Build tool and dev server
- **React Router** (^7.9.4) - Client-side routing
- **Tailwind CSS** (^3.4.18) - Styling
- **Axios** (^1.12.2) - HTTP client
- **React Toastify** (^11.0.5) - Notifications

### Key Components

**App.tsx** - Root component with React Router setup:
- Routes: `/` (Homepage), `/example1` through `/example5`
- Provides full-screen layout with navigation bar

**Homepage.tsx** - Main interface for AI prompts:
- Example selection (1-5)
- Prompt textarea for user input
- Submit button (POST `/api/prompt`)
- Undo button (GET `/api/undo`)
- Loading states and toast notifications

**Navbar.tsx** - Top navigation bar with links to homepage and example pages

**Tiles.tsx** - Memory matching game component (30 tiles, 15 pairs)

### Development
- Dev server: `http://localhost:3000`
- API proxy: `/api/*` → `http://localhost:3001`
- Scripts: `npm run dev`, `npm run build`, `npm run lint`

## Backend

### Architecture

FastAPI application with five main modules:

1. **main.py** - REST API server (port 3001)
   - `POST /api/prompt` - Build or modify components
   - `GET /api/undo` - Restore previous component versions

2. **tools.py** - File operations and backup management
   - Saves React components with automatic backups
   - Reads component files from `Frontend/src/examples`
   - Backup location: `Frontend/src/backups`

3. **Build_page.py** - New component generation
   - Uses LangChain agent with XAI Grok (`grok-code-fast-1`)
   - Multi-threaded: Creates 5 parallel threads for variations
   - Generates TypeScript React components with Tailwind CSS
   - Validates code with linter and attempts auto-fixes

4. **Modify_page.py** - Existing component modification
   - Reads original component code for context
   - Multi-threaded: 5 parallel modification attempts
   - Preserves component structure while applying changes

5. **linter.py** - Code validation
   - Runs ESLint on generated components
   - Returns success status and error messages
   - Resets to placeholder on failure

### Workflow

```
User Prompt → FastAPI → Build_page/Modify_page
                        ↓
                  AI Agent (LangChain + XAI)
                        ↓
                  Save to test.tsx
                        ↓
                  Linter Validation
                        ↓
                  Save to example.tsx (on success)
```

### Key Features

- **AI-Powered Generation**: XAI Grok model for React component generation
- **Multi-threaded Processing**: 5 parallel variations for better results
- **Automatic Linting**: Code validation with ESLint and auto-fix attempts
- **Backup System**: Automatic backups before modifications
- **Undo Functionality**: Restore components to previous state
- **Error Handling**: Graceful failure handling with placeholder components

## API Integration

- **Base URL**: `/api` (proxied to `http://localhost:3001` in development)
- **Endpoints**:
  - `POST /api/prompt` - Submit prompt with example selection (timeout: 120s)
  - `GET /api/undo` - Undo last action
- **Error Handling**: Toast notifications for success/error states

## Project Structure

```
Frontend/
├── src/
│   ├── components/     # Navbar, NavbarButton, Tiles
│   ├── examples/       # Generated example components (1-4)
│   ├── backups/        # Backup copies of components
│   ├── Homepage.tsx    # Main prompt interface
│   └── App.tsx         # Root component with routing

Backend/
├── main.py             # FastAPI server
├── tools.py            # File operations
├── Build_page.py       # Component generation
├── Modify_page.py      # Component modification
└── linter.py           # Code validation
```

## Development Workflow

1. Start backend: Run FastAPI server on port 3001
2. Start frontend: `npm run dev` (port 3000)
3. Access: `http://localhost:3000`
4. Create prompts: Use homepage interface to generate/modify components
5. View results: Navigate to example pages to see generated components

## Dependencies

**Frontend**: React, React Router, Axios, Tailwind CSS, Vite, TypeScript, ESLint

**Backend**: FastAPI, LangChain, langchain-xai, Pydantic, uvicorn, python-dotenv

