# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Duolingo-inspired language learning app clone built with React, TypeScript, and Tailwind CSS v4. The app features a gamified learning experience with lessons, quests, user progression tracking, and a visual learning path interface.

## Development Commands

```bash
# Start development server
npm run dev
# or
npm start

# Build for production
npm run build

# Run linter
npm run lint

# Preview production build
npm run preview
```

## Tech Stack

- **Framework**: React 19.2.0 with TypeScript
- **Routing**: React Router v7
- **State Management**: Zustand (src/store/useStore.ts)
- **Styling**: Tailwind CSS v4 with custom theme colors
- **Build Tool**: Vite
- **Linting**: ESLint with TypeScript and React plugins

## Architecture

### State Management (Zustand)

Global state is managed via Zustand in `src/store/useStore.ts`. The store contains:
- **user**: User profile with XP, level, streak, gems, lingots, league info
- **quests**: Array of daily/weekly quests with progress tracking
- **units**: Array of learning units, each containing lesson nodes
- Actions: `updateXP`, `updateQuestProgress`, `completeLesson`

### Routing Structure

The app uses React Router with a nested layout structure:
- `/` - Home page (landing/welcome screen)
- `/learn` - Learning path with lesson nodes
- `/practice` - Practice exercises (placeholder)
- `/leaderboard` - League standings (placeholder)
- `/shop` - In-app shop (placeholder)
- `/profile` - User profile (placeholder)
- `/more` - Additional settings/info (placeholder)

All routes are wrapped in a `Layout` component that includes `Sidebar` (left navigation) and `QuestPanel` (right sidebar with quests).

### Component Structure

- **Layout.tsx**: Main layout with fixed sidebar (left) and quest panel (right)
- **Sidebar.tsx**: Left navigation with route links
- **QuestPanel.tsx**: Right sidebar showing daily quests and progress
- **Home.tsx**: Landing page with call-to-action
- **LearningPath.tsx**: Main learning interface displaying units and lesson nodes in a vertical path layout
- **LessonNode** (within LearningPath.tsx): Individual lesson/practice/story nodes with different states (locked, available, completed)

### Type Definitions

Core types are defined in `src/types/index.ts`:
- **Quest**: Quest with progress tracking
- **User**: User profile data
- **LessonNode**: Individual lesson with type, status, level, and position
- **Unit**: Collection of lesson nodes with metadata

### Styling System

Tailwind CSS v4 with custom theme defined in `src/index.css`:
- Custom colors: duo-green, duo-blue, duo-purple, duo-orange, duo-red, duo-yellow, duo-dark, duo-gray
- Dark theme by default (bg-duo-dark)
- Uses gradients, shadows, and transform animations for gamified UI

### Data Flow

Currently uses mock data defined directly in `src/store/useStore.ts`:
- `mockUser`: Initial user state
- `mockQuests`: List of daily quests
- `mockUnits`: Learning path structure with 4 units and multiple lesson nodes

## Key Features to Understand

1. **Lesson Node States**: Nodes can be locked, available, or completed, each with different styling
2. **Lesson Node Types**: lesson, story, practice, unit-review, chest - each has unique icons and colors
3. **Visual Learning Path**: Nodes are positioned using percentage-based coordinates (x, y) within each unit
4. **Progress Tracking**: XP gains, quest progress, and lesson completion are tracked via Zustand store
5. **Responsive Layout**: Fixed sidebars with central content area that scrolls

## Notes

- The app currently uses all mock data; no backend integration yet
- Placeholder routes exist for practice, leaderboard, shop, profile, and more sections
- Lesson node click handlers are defined but don't navigate anywhere yet
- Korean text is used in the UI (e.g., quest descriptions, unit titles)
