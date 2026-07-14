# CLIuno Solid template

SolidJS + Vite + TypeScript SPA implementing the CLIuno demo app (auth, users, todos,
posts+comments, follows) against the shared CLIuno REST contract.

## Commands

```bash
pnpm dev        # vite on :5000
pnpm build      # vite build
pnpm lint       # oxlint (also run: npx tsc --noEmit for types)
pnpm format     # oxfmt src/
```

## Structure

- `src/apis/` — the API layer (`auth-api`, `user-api`, `todo-api`, `post-api`,
  `follow-api`) on `http.ts`; Bearer token from localStorage, 401 → `/login`.
- `src/stores/auth.ts` — signals-based auth store.
- `src/pages/` — pages; routing via `@solidjs/router` (`Route component=` layouts take
  `Readonly<{ children?: any }>` props).

## The API contract (what backends guarantee)

Login sends `{usernameOrEmail, password}` and reads `data.token`. Responses are
`{status, message, data}` with exact keys `data.users/user/todos/todo/posts/post/`
`followers/following/isFollowing`. Any CLIuno backend template serves this contract.
Keep all URLs inside `src/apis/`.

## Conventions

- oxc tooling: `oxlint` + `oxfmt` (`semi: false`, single quotes); prettier for css/md/html.
- Solid reactivity: use `createEffect(on(...))` for param-driven reloads — never
  tautological conditions to force tracking.
- TypeScript 6.0; conventional commits; Tailwind v4 (no prefix) + **shadcn-style UI on
  Kobalte primitives** — components vendored by hand in `src/components/ui/`, `cn()` in
  `src/lib/utils.ts`, theme tokens in `src/assets/index.css`, dark mode = `.dark` class
  on `<html>` + `localStorage('theme')` (see `src/utils/theme.ts`); icons from
  `lucide-solid`.
