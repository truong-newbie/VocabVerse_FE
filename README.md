# VocabVerse Frontend

VocabVerse is a modern vocabulary learning frontend for authenticated learners. It connects to the VocabVerse Backend and provides collection management, vocabulary practice, AI-assisted learning, shadowing, and roleplay flows.

## Tech Stack

- React 19
- Vite 6
- React Router
- TanStack Query
- Zustand
- Axios
- React Hook Form
- Zod
- Tailwind CSS v4
- Sonner toasts
- React Icons

## Folder Structure

```text
src/
  app/
    providers/      React Query, theme, auth hydration
    router/         route configuration and guards
    store/          Zustand stores
  components/
    common/         shared app components
    layout/         app/auth layouts
    routes/         protected/public route guards
    ui/             primitive UI components
  features/         API services, hooks, utilities, feature components
  pages/            route-level pages
  services/         shared API client and error normalization
  styles/           global Tailwind/theme styles
  types/            DTO declarations
```

## Environment Variables

Create `.env.local` from `.env.example`:

```bash
cp .env.example .env.local
```

Required:

```text
VITE_API_BASE_URL=http://localhost:8080/api/v1
```

`VITE_API_BASE_URL` should include the backend context path `/api/v1`. Frontend services call paths such as `/auth/login` and `/collections`.

## Local Development

Install dependencies:

```bash
npm install
```

Run development server:

```bash
npm run dev
```

Default Vite URL:

```text
http://localhost:5173
```

## Quality Checks

Run lint:

```bash
npm run lint
```

Run TypeScript declaration/type checks:

```bash
npm run typecheck
```

Run production build:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Backend Connection

The frontend uses `src/services/apiClient.js` for all backend calls.

- Base URL comes from `VITE_API_BASE_URL`.
- Auth tokens are attached through Axios interceptors.
- 401 responses attempt refresh through `/auth/refresh` relative to `VITE_API_BASE_URL`.
- API envelopes are normalized through `unwrapApiResponse`.
- Transport/backend errors are normalized through `normalizeApiError`.
- PDF export uses blob responses and safe object URL downloads.
- Shadowing MP4 upload uses multipart `FormData`.

## Main Routes

- `/login` and `/register`: public auth routes
- `/dashboard`: learning overview
- `/collections`: personal collection management and collection PDF export
- `/public/collections`: public collection discovery and clone flow
- `/vocabularies`: vocabulary management and all-vocabulary PDF export
- `/review`: spaced review dashboard
- `/flashcards`: flashcard learning sessions
- `/quiz`: multiple-choice quiz sessions
- `/typing`: typing practice sessions
- `/ai`: AI vocabulary normalization
- `/shadowing`: shadowing lesson library
- `/shadowing/:lessonId`: shadowing practice detail
- `/admin/shadowing`: admin-only shadowing upload/process tools
- `/roleplay`: AI roleplay setup and history
- `/roleplay/:sessionId`: AI roleplay conversation

## Deployment Notes

For Vercel, Netlify, or Cloudflare Pages:

1. Set build command to `npm run build`.
2. Set output directory to `dist`.
3. Configure `VITE_API_BASE_URL` in project environment variables.
4. Ensure the backend allows the deployed frontend origin through CORS.
5. Configure SPA fallback/rewrite to `index.html`.
6. Use HTTPS backend URLs in production.

## Production Checklist

- `npm run lint` passes.
- `npm run typecheck` passes.
- `npm run build` passes.
- `.env.local` is not committed.
- `VITE_API_BASE_URL` points to the deployed backend API root, for example `https://api.your-domain.com/api/v1`.
- Backend CORS includes the deployed frontend origin.
- Login, token refresh, logout, and protected routes are tested.
- File/blob downloads are tested in the target browser.
- Admin-only pages are tested with normal and admin users.
