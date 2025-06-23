# Todo App – Nuxt Front-End Assessment

This project is the front-end portion of a technical assessment for a Software Engineer position. It demonstrates proficiency in building a modern, maintainable, and user-friendly task management interface using Nuxt 3 and related technologies.

## Project Purpose

This repository implements the user interface for a Todo application as part of a technical assessment. The focus is on front-end architecture, component design, and integration with a backend API (assumed to be provided separately).

## What Was Implemented

**Main Features & Components:**
- **Authentication:** Login page with form validation and integration with Sanctum-based authentication.
- **Task Management:** 
  - Create, edit, delete, and mark tasks as complete/incomplete.
  - Support for subtasks (nested tasks).
  - Task labels and priorities (High, Medium, Low).
  - Task list is divided into pending and completed sections.
- **UI/UX:**
  - Responsive layouts for authenticated and guest users.
  - User feedback via toast notifications.
  - Clean, accessible forms and list views.
  - Consistent design using Nuxt UI and Tailwind CSS.
- **Architecture & Technologies:**
  - Built with Nuxt 3, Vue 3, TypeScript.
  - Modular component structure (`TaskCard`, `TaskList`, `TaskCreateForm`).
  - State and API management using Nuxt composables and `useSanctumFetch`.
  - CSS via Tailwind and Nuxt UI for rapid, consistent styling.
  - Code organization for scalability and maintainability.

## Areas for Improvement

Given more time, the following enhancements could be made:
- **Testing:** Add unit and end-to-end tests for components and flows.
- **Performance:** Optimize API calls, lazy-load components, and improve state management for large task lists.
- **UI Polish:** Add animations, transitions, and further refine mobile responsiveness.
- **Accessibility:** Conduct a full accessibility audit and address any issues.
- **Feature Completeness:** 
  - Implement advanced filtering, sorting, and search.
  - Add user profile management and settings.
  - Improve error handling and offline support.
- **Code Quality:** Further modularize logic, add more comprehensive TypeScript types, and document key modules.

**Note:** If the API domain changes, be sure to update the `sanctum.baseUrl` property in `nuxt.config.ts` to prevent CORS errors.

API Repository: https://github.com/lauroguedes/api-todo

## Setup

Make sure to install dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```
