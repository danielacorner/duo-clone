# AGENTS.md

This file provides guidance to AI agents (like Gemini, Claude, etc.) when working with this repository.

## Lesson Answer Validation

When implementing or modifying lesson answer validation:

1.  **Flexible Attribute Ordering**: For code-based lessons (HTML/React/JSX), the validation logic MUST allow attributes and props within an opening tag to be placed in any order.
    -   Example: `<input value={val} onChange={fn} />` and `<input onChange={fn} value={val} />` must both be considered correct.
    -   This applies to any tokens located between the opening component/element token (e.g., `<Button`) and the closing token of that opening tag (e.g., `/>` or `>`).
    -   The order of the opening tag itself and the closing tag must be preserved.

2.  **Implementation**: This logic is currently implemented in `src/store/useLessonStore.ts` via the `normalizeCodeTokens` helper within `checkAnswer`. Do not remove or regress this logic.
