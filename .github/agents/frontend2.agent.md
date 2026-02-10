# Frontend Documentation

## Tech Stack

### Core Technologies

- **Next.js 15+** - React framework with App Router
- **React 19+** - UI library
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **PostCSS** - CSS processing

### Internationalization

- **next-intl** - Internationalization for Next.js
- **Messages**: en.json, vi.json for English and Vietnamese

### Data Fetching & State Management

- **TanStack Query (React Query)** - Server state management
- **Zustand** - Lightweight client-side state management
- **React Hooks** - State and side effects

### Development Tools

- **ESLint** - Code linting
- **TypeScript** - Static type checking
- **Zod** - Type-safe schema validation and parsing
- **Next.js Dev Tools** - Development utilities

## Folder Structure & Main Functions

### `/` - Root Configuration

- `components.json` - Shadcn/ui configuration
- `next.config.ts` - Next.js configuration
- `postcss.config.mjs` - PostCSS configuration
- `tsconfig.json` - TypeScript configuration

### `/messages/` - Internationalization

- `en.json` - English translations
- `vi.json` - Vietnamese translations
- **Purpose**: Store all UI text strings for multi-language support

### `/public/` - Static Assets

- `flags/` - Country flag icons for language selection
- `icons/` - Application icons
- **Purpose**: Static files that don't require processing

### `/src/` - Main Application Source

#### `/src/app/` - Next.js App Router Structure

- `globals.css` - Global CSS styles
- `layout.tsx` - Root layout component
- `[locale]/` - Locale-based routing structure
- **Purpose**: Core routing and layout structure following Next.js 15 App Router patterns

#### `/src/components/` - Reusable UI Components

- `guards/` - Route protection components
- `icons/` - Custom icon components
- `layout/` - Layout-specific components (header, sidebar, etc.)
- `ui/` - Basic UI components (buttons, forms, modals)
- **Purpose**: Shared UI components used throughout the application

#### `/src/features/` - Feature-Based Modules

- `auth/` - Authentication components and logic
- `stories/` - Story management features
- `users/` - User management features
- **Purpose**: Self-contained feature modules with their own components, hooks, and logic

#### `/src/hooks/` - Custom React Hooks

- **Purpose**: Reusable logic extraction and state management

#### `/src/i18n/` - Internationalization Configuration

- `navigation.ts` - Internationalized routing setup
- `request.ts` - Request internationalization
- `routing.ts` - Locale-based routing configuration
- **Purpose**: Setup and configuration for multi-language support

#### `/src/lib/` - Utility Libraries

- `error.ts` - Error handling utilities
- `http.ts` - HTTP client configuration
- `utils.ts` - General utility functions
- **Purpose**: Shared utility functions and configurations

#### `/src/providers/` - React Context Providers

- `app-provider.tsx` - Main application context
- `auth-provider.tsx` - Authentication state management
- `react-query-provider.tsx` - React Query configuration
- **Purpose**: Global state and context management

#### `/src/shared/` - Shared Resources Across Features

- `constants/` - Application-wide constants
- `events/` - Event handling and emission
- `providers/` - Smaller context providers
- `schemas/` - Validation schemas (Zod, etc.)
- `stores/` - Client-side state stores
- `types/` - TypeScript type definitions
- `utils/` - Feature-specific utilities
  - `date.utils.ts` - Date formatting and manipulation (timezone handling, date comparisons)
  - `format-utils.ts` - Text formatting utilities (capitalize, truncate, slug generation)
  - `image-utils.ts` - Image processing utilities (rescaling, compression, format conversion)
  - `route.utils.ts` - URL manipulation and query string handling
- **Purpose**: Resources shared between different features and modules

## Key Architectural Patterns

### Feature-Based Organization

- Each major feature (auth, stories, users) has its own directory with components, hooks, and logic
- Promotes code organization and maintainability

### Shared Resources Strategy

- Common functionality is placed in `/src/shared/` to avoid duplication
- UI components are separated by reusability (generic in `ui/`, feature-specific in feature folders)

### Internationalization First

- Built-in support for multiple languages from the ground up
- Locale-based routing structure for SEO-friendly URLs

### Type Safety

- Comprehensive TypeScript setup with strict mode
- Shared types in `/src/shared/types/` for consistency
