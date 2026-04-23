# AGENTS.md

## Role
You are assisting on a frontend codebase with a strict design system and implementation workflow. Your job is to implement, extend, and refactor code without changing the intended visual design unless the user explicitly asks for a design change.

## Core development rules
- Use atomic design structure: atoms, molecules, organisms.
- Use React functional components only.
- Use Tailwind CSS classes only for styling unless the user explicitly asks otherwise.
- Do not use inline styles.
- Keep components small, reusable, and clearly scoped.
- Prefer clear, descriptive, consistent prop names.
- Follow the existing folder structure and naming conventions.
- Match the existing design system and code style of the project.
- Do not introduce unnecessary libraries, abstractions, or patterns.
- Keep code readable, simple, and maintainable.

## Design protection rules
- Do not change an existing design just because a different implementation seems better.
- If a design has already been defined by the user, preserve it exactly while writing other parts of the code.
- Only change the design if the user explicitly asks for a design change.
- Do not reinterpret, restyle, simplify, improve, or “modernize” the UI unless the user asks.
- Treat provided designs, screenshots, mockups, and written UI instructions as the source of truth.

## Colors
- Never guess colors from an image or mockup.
- If exact colors are not already defined in the codebase or explicitly provided by the user, ask the user.
- If the user gives a screenshot or image, do not assume approximate colors from it unless the user explicitly says to.
- Reuse existing project color tokens and theme values whenever available.

## Typography
- Fonts must follow the definitions already present in `global.css` or the existing design system.
- Text sizes, font weights, line heights, and letter spacing must follow the established typography system in the codebase.
- If a needed typography style is unclear or missing, ask the user instead of guessing.
- Do not introduce random font sizes or font families.

## Spacing and layout
- Do not guess gaps, spacing, padding, margins, or sizing.
- Use spacing values already defined by the user, the design, or the codebase.
- If spacing is not explicitly defined and cannot be inferred from existing system patterns, ask the user.
- Preserve the intended layout structure and alignment from the design.

## Inputs, buttons, cards, panels, and UI elements
- Reuse existing atoms and molecules when possible before creating new ones.
- If a new component is needed, make it consistent with the existing design system.
- Do not change border radius, shadows, icon sizes, text styles, spacing, or interaction states unless explicitly instructed.
- Keep interaction states aligned with the provided design.

## Icons and images
- Use the project’s existing icon system and file structure.
- Do not replace icons with different ones unless the user asks.
- Do not guess image treatment, image sizing, or image styling.
- If an image or screenshot is provided, treat it as reference, not as something to reinterpret.

## Code behavior rules
- Implement only the behavior requested by the user.
- Do not add extra features, extra states, hidden logic, or speculative UX improvements unless requested.
- Do not remove existing behavior unless the user asks.
- Keep state management minimal and appropriate to the task.
- Avoid overengineering.

## When uncertain
- If colors are unclear, ask.
- If typography is unclear, ask.
- If spacing is unclear, ask.
- If a design decision is unclear, ask.
- If the user’s existing styles in `global.css` or the design system conflict with a new request, point it out clearly before changing anything.

## Refactoring rules
- Refactor only when it improves maintainability without changing design or behavior.
- Preserve public props and existing usage patterns unless the user asks for a structural change.
- Avoid large unnecessary rewrites.

## Output expectations
- Produce code that fits directly into the current project.
- Keep imports clean and consistent.
- Keep naming aligned with the project.
- Respect the existing architecture.
- Prioritize fidelity to the user’s design and instructions over personal preference.