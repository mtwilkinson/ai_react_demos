# Frontend Documentation

## Overview

This is a React + TypeScript frontend application built with Vite. The application provides a homepage interface for creating AI prompts and displays multiple example pages through a navigation system.

## Tech Stack

- **React** (v19.1.1) - UI library
- **TypeScript** (~5.8.3) - Type safety
- **Vite** (^7.1.2) - Build tool and dev server
- **React Router** (^7.9.4) - Client-side routing
- **Tailwind CSS** (^3.4.18) - Utility-first CSS framework
- **Axios** (^1.12.2) - HTTP client
- **React Toastify** (^11.0.5) - Toast notifications
- **ESLint** (^9.39.1) - Code linting

## Project Structure

```
Frontend/
├── src/
│   ├── components/          # Reusable React components
│   │   ├── Navbar.tsx       # Main navigation bar
│   │   ├── NavbarButton.tsx # Navigation button component
│   │   └── Tiles.tsx        # Memory game component
│   ├── Homepage.tsx         # Main homepage component
│   ├── App.tsx              # Root component with routing
│   ├── main.tsx             # Application entry point
│   ├── App.css              # Application styles
│   ├── index.css            # Global styles
│   └── vite-env.d.ts        # Vite type definitions
├── public/                  # Static assets
├── index.html               # HTML template
├── package.json             # Dependencies and scripts
├── vite.config.ts           # Vite configuration
├── tsconfig.json            # TypeScript configuration
├── tsconfig.app.json        # TypeScript app config
├── tsconfig.node.json       # TypeScript node config
├── tailwind.config.js       # Tailwind CSS configuration
├── postcss.config.js        # PostCSS configuration
└── eslint.config.js         # ESLint configuration
```

## Configuration Files

### Vite Configuration (`vite.config.ts`)

- **Development Server**: Runs on `0.0.0.0:3000`
- **API Proxy**: Proxies `/api` requests to `http://localhost:3001`
- **Plugin**: Uses `@vitejs/plugin-react` for React support

### TypeScript Configuration

- **tsconfig.json**: Base configuration referencing app and node configs
- **tsconfig.app.json**: Application-specific TypeScript settings
  - Target: ES2022
  - Module: ESNext
  - JSX: react-jsx
  - Strict mode enabled
- **tsconfig.node.json**: Node.js TypeScript settings

### Tailwind CSS (`tailwind.config.js`)

- Content paths: `./index.html` and `./src/**/*.{js,ts,jsx,tsx}`
- Default theme with no custom extensions

### ESLint (`eslint.config.js`)

- TypeScript ESLint configuration
- React Hooks linting
- React Refresh support
- Import plugin for import/export validation
- Custom rules: warnings for unused vars, prefer const, and undefined variables

## Components

### App Component (`src/App.tsx`)

The root component that sets up React Router with the following routes:

- `/` - Homepage
- `/example1` through `/example5` - Example pages

The `Root` component wraps all routes and provides:
- Full-screen layout with white background
- Navigation bar at the top
- Outlet for child routes

### Homepage Component (`src/Homepage.tsx`)

Main interface for creating AI prompts:

**Features:**
- Example selection (1-5) - Users can select a base example
- Prompt textarea - Input field for detailed prompts
- Submit button - Sends prompt to `/api/prompt` endpoint
- Undo button - Calls `/api/undo` endpoint
- Loading states - Disables buttons during API calls
- Toast notifications - Shows success/error messages

**API Endpoints:**
- `POST /api/prompt` - Submits a prompt with selected example
- `GET /api/undo` - Undoes the last action

**State Management:**
- `selectedExample`: Currently selected example (0-5)
- `prompt`: User-entered prompt text
- `isLoading`: Loading state for API calls
- `toastMessage`: Toast notification message
- `showToast`: Toast visibility state

### Navbar Component (`src/components/Navbar.tsx`)

Top navigation bar with links to:
- Homepage
- Example 1-5 pages

Styled with Tailwind CSS (blue-950 background).

### NavbarButton Component (`src/components/NavbarButton.tsx`)

Reusable navigation button component:

**Props:**
- `href`: Route path
- `name`: Display text

**Features:**
- Active state styling (blue-300 border when current route matches)
- Default styling (blue-950 border for inactive state)

### Tiles Component (`src/components/Tiles.tsx`)

Memory matching game component:

**Features:**
- 30 tiles (15 pairs of numbers 1-15)
- Click tracking
- Match detection
- Reset functionality
- Visual feedback (green for matched, blue for revealed/unrevealed)

**Game Logic:**
- Two tiles can be selected at a time
- Matching tiles stay revealed (green)
- Non-matching tiles hide after 1 second
- Click counter tracks total clicks

## Routing

The application uses React Router v7 with a browser router:

- All routes are nested under the root `/` path
- Error boundaries are set up for each route
- The Root component provides the layout structure
- Navigation is handled through the Navbar component

## Development Workflow

### Available Scripts

- `npm run dev` - Start development server (Vite dev server on port 3000)
- `npm run build` - Build for production (TypeScript compilation + Vite build)
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build
- `npm run install:packages` - Install dependencies

### Development Server

The dev server runs on `http://localhost:3000` (or `0.0.0.0:3000` for network access).

API requests to `/api/*` are proxied to `http://localhost:3001` during development.

### Hot Module Replacement (HMR)

Vite provides fast HMR for React components, allowing instant updates during development without full page reloads.

## Styling

The application uses Tailwind CSS for styling:

- Utility-first CSS classes
- Responsive design utilities
- Custom color scheme (blue palette)
- Flexbox and Grid layouts

Global styles are defined in:
- `src/index.css` - Base styles
- `src/App.css` - Application-specific styles

## API Integration

The frontend communicates with a backend API:

- **Base URL**: `/api` (proxied to `http://localhost:3001` in development)
- **Endpoints**:
  - `POST /api/prompt` - Submit a prompt with example selection
  - `GET /api/undo` - Undo last action
- **Timeout**: 120 seconds for prompt submission
- **Error Handling**: Toast notifications for success/error states

## Build and Deployment

### Production Build

```bash
npm run build
```

This command:
1. Compiles TypeScript (`tsc -b`)
2. Builds the application with Vite
3. Outputs to `dist/` directory

### Preview Production Build

```bash
npm run preview
```

Starts a local server to preview the production build.

## TypeScript

The project uses strict TypeScript configuration:

- Strict mode enabled
- Unused locals/parameters detection
- No implicit any
- React JSX transform
- ES2022 target with DOM libraries

## Code Quality

### Linting

ESLint is configured with:
- TypeScript support
- React Hooks rules
- React Refresh support
- Import/export validation
- Custom warning rules

Run linting with:
```bash
npm run lint
```

## Dependencies

### Production Dependencies

- `react`, `react-dom` - React framework
- `react-router`, `react-router-dom` - Routing
- `axios` - HTTP client
- `react-toastify` - Toast notifications
- `turbo` - Build system

### Development Dependencies

- `vite` - Build tool
- `@vitejs/plugin-react` - Vite React plugin
- `typescript` - TypeScript compiler
- `tailwindcss`, `postcss`, `autoprefixer` - CSS tooling
- `eslint` and plugins - Code linting
- `@types/react`, `@types/react-dom` - TypeScript types

## Notes

- The `Backups` and `examples` folders are excluded from this documentation as per project requirements
- The application assumes a backend API server running on port 3001
- All routes include error boundaries for graceful error handling
- The application uses React 19 with the latest features

