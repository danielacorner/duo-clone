# AGENTS.md

This file provides critical context and guidance for AI agents working on this repository.

## Project Overview

- **Stack**: React 19, TypeScript, Tailwind CSS v4, Zustand, Framer Motion.
- **Core Concept**: A gamified language learning app (Duo clone) for React/TS.
- **Key Files**:
  - `src/store/useStore.ts`: Global application state (User progress, Units, Dev Mode).
  - `src/store/useLessonStore.ts`: Localized state for the active lesson session.
  - `src/components/LearningPath.tsx`: The main vertical "road" interface.
  - `src/components/Lesson.tsx`: The exercise runner interface.
  - `src/data/lessons.ts`: Static data for exercises and questions.

## Development Rules & Context

### 1. Lesson Answer Validation (Flexible Attribute Order)

- For HTML/JSX exercises, attribute order within an opening tag **must not matter**.
- **Implementation**: Managed in `src/store/useLessonStore.ts` via `normalizeCodeTokens`. It sorts attributes alphabetically before comparison. **Do not remove this logic.**

### 2. Dev Mode & Permissions

- **State**: `devMode` (boolean) in `useStore.ts`.
- **Behavior**: When `devMode` is active:
  - All lesson nodes in `LearningPath.tsx` are interactive and visually unlocked.
  - `LessonPopover` allows starting any lesson regardless of sequential progress.
- **UI**: Toggled via the Floating Action Button (FAB) defined in `src/components/DevModeToggle.tsx`.

### 3. Visual Learning Path (Wavy Road)

- **Pathing**: The line connecting nodes is an SVG rendered within `LearningPath.tsx`.
- **Curves**: Uses `generatePathData` to create Cubic Bezier (`C`) curves between node coordinates.
- **Coordinates**: Node positions are percentage-based (`x`, `y` in 0-100).
- **Z-Index**: Active/Hovered nodes should promote to `z-50` to ensure popovers and tooltips appear above the SVG path and neighboring nodes.

### 4. Progress Tracking

- User progress is tracked in `useStore.ts` via:
  - `user.completedLessonIds`: Array of IDs.
  - `units[].nodes[].status`: Individual node status (`locked`, `available`, `completed`).
- **Sequential Unlocking**: `completeLesson` action in `useStore.ts` automatically finds the next node in the unit array and sets it to `available`.

### 5. UI/UX Patterns

- **Non-Intrusive Popups**: Instead of full-screen modals, use the `LessonPopover` (popover style) relative to the node.
- **Hover States**: Use `LessonTooltip` to show a quick preview of the lesson title on hover.
- **Styling**: Strictly use Tailwind CSS v4 custom theme colors (e.g., `duo-green`, `duo-blue`).

## Component Structure Guidelines

- **Logic Placement**: Keep visual rendering logic in components and complex state/persistence logic in Zustand stores.
- **Translations**: Always use `useTranslation` hook and `t()` function. Keys are structured in `src/locales/en.json`.

Please maintain and update this document as-needed.
