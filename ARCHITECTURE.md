# Architecture & feature integration guide

Use this document whenever you add a feature. It maps **which folder** owns **what**, and gives step-by-step recipes for Firebase, PG modules, hardware, shared UI, and theme work.

## App model

| Concept | How this app works |
|---------|--------------------|
| Deployment | **On-premise desktop** (Electron) on the operator’s Mac or Windows machine |
| Users | **Single operator account** via Firebase Auth — not a multi-tenant SaaS |
| Data | Firebase (Auth + Firestore later) scoped to that signed-in user / property |
| Tenants | **Not used** — no tenant / multi-tenant concept in this codebase |

---

## Process overview

```
UI (src/features/*/pages)
  → hooks / stores
    → services (src/services/*)
      → Firebase SDK  OR  window.api (preload)
                            → electron/main/ipc
                              → electron/main/hardware
```

**Rules**

- Never import `electron`, Node builtins, or native modules from `src/` (renderer).
- Never put React/UI inside `electron/`.
- Prefer vertical feature folders over dumping everything into `shared/` or `components/`.

---

## Folder purpose map

| Path | Purpose | Put here | Do not put here |
|------|---------|----------|-----------------|
| `electron/main/` | Privileged Electron / Node process | Window lifecycle, OS APIs | React / CSS / UI |
| `electron/main/ipc/` | IPC channel handlers | New `*.handlers.ts` per domain | UI business logic |
| `electron/main/hardware/` | Device adapters | Serial / USB / printer / biometric drivers | Imports from renderer |
| `electron/preload/` | Secure bridge | Typed `window.api` only | Heavy business logic |
| `src/app/` | App bootstrap | Router, providers, `ProtectedRoute` | Feature screens |
| `src/features/<name>/` | Vertical feature slice | `pages/`, `components/`, `hooks/`, `stores/`, `types.ts` | Generic shadcn primitives |
| `src/features/auth/` | Auth UI + session | Login form, `authStore`, `useAuth` | Firebase SDK init |
| `src/features/dashboard/` | Post-login chrome | Sidebar, header, home enter screen | Domain CRUD |
| `src/features/pg/` | PG domain modules | `rooms`, `payments`, `bookings`, `reports` | Multi-tenant / tenants logic |
| `src/shared/components/ui/` | shadcn primitives | Button, Input, Dialog, … | Feature-specific composites |
| `src/shared/components/layout/` | Cross-app layout pieces | Shared shells reused by many features | One-off feature layouts |
| `src/shared/lib/` | Utilities | `cn()`, helpers | API calls / stores |
| `src/shared/hooks/` | Cross-feature hooks | Truly shared hooks only | Feature-only hooks |
| `src/shared/types/` | Shared TypeScript types | Cross-cutting types | Feature-private types |
| `src/shared/constants/` | Shared constants | App name, route keys | Feature constants |
| `src/services/firebase/` | Firebase clients | Config, Auth, Firestore repos for this user | React components |
| `src/services/hardware/` | Renderer → IPC callers | Thin helpers over `window.api.hardware` | Native drivers |
| `src/styles/` | Global theme | Tokens, Tailwind base | One-off page styles |
| `src/assets/` | Renderer assets | Images used in UI | Installer icons |
| `resources/` | Packaging assets | App icons for electron-builder | Source code |

---

## Current milestone (what exists)

- Local auth shell → dashboard (`LocalAuthService` + Zustand + localStorage)
- Dashboard enter screen with sidebar placeholders for future PG modules
- Hardware IPC stubs (`hardware:listDevices`, `hardware:getStatus`)
- Firebase folders with interfaces / stubs only (no SDK yet)

---

## Feature recipes

### 1. New PG UI module (example: Rooms)

1. Create:

```
src/features/pg/rooms/
  pages/RoomsPage.tsx
  components/
  hooks/
  stores/
  types.ts
```

2. Add a route in [`src/app/router.tsx`](./src/app/router.tsx) under the authenticated `DashboardShell` layout:

```tsx
<Route path="/pg/rooms" element={<RoomsPage />} />
```

3. Enable the sidebar item in [`src/features/dashboard/components/DashboardSidebar.tsx`](./src/features/dashboard/components/DashboardSidebar.tsx) (`enabled: true` for Rooms).

4. Call data through `src/services/*` — do **not** initialize Firebase or talk to IPC inside page components.

### 2. Wire real Firebase Auth (single user)

1. Copy `.env.example` → `.env` and fill `VITE_FIREBASE_*` values for the project this operator uses.
2. Install Firebase (`npm install firebase`) when ready.
3. Initialize the app in [`src/services/firebase/config.ts`](./src/services/firebase/config.ts).
4. Implement `FirebaseAuthService` implementing the same `AuthService` interface in [`src/services/firebase/auth.ts`](./src/services/firebase/auth.ts).
5. Export it as `authService` instead of `LocalAuthService`.
6. Keep UI in `src/features/auth` unchanged.
7. Scope Firestore reads/writes to the signed-in `uid` (or that user’s property document) — no tenant IDs.

### 3. Add Firestore data / collections

1. Domain types in the feature `types.ts` (or `src/shared/types` if cross-cutting).
2. Repository methods in [`src/services/firebase/firestore.ts`](./src/services/firebase/firestore.ts) or a new `src/services/firebase/<domain>.ts`.
3. Feature hooks/stores call the repository — pages stay presentational.
4. Always filter by the authenticated user’s id / property — never introduce a tenants collection for multi-tenancy.

### 4. Add a hardware device

1. Adapter: `electron/main/hardware/<device>.ts`
2. Register IPC in [`electron/main/ipc/hardware.handlers.ts`](./electron/main/ipc/hardware.handlers.ts) (or a new `*.handlers.ts` + register in `ipc/index.ts`)
3. Expose on the bridge in [`electron/preload/api.ts`](./electron/preload/api.ts) and [`electron/preload/index.ts`](./electron/preload/index.ts)
4. Renderer helper in [`src/services/hardware/`](./src/services/hardware/)
5. Optional UI in the feature that needs the device (e.g. bookings check-in)

### 5. New shared UI component

- Generic primitive (shadcn-style) → `src/shared/components/ui/`
- App-wide chrome → `src/shared/components/layout/` or `src/features/dashboard/components/`
- Use `components.json` aliases when adding more shadcn pieces

### 6. Theme / branding change

- CSS variables and Tailwind tokens → [`src/styles/globals.css`](./src/styles/globals.css)
- UI images → `src/assets/`
- Installer / dock icons → `resources/`

---

## Planned PG modules

Prefolded under `src/features/pg/`:

| Folder | Purpose |
|--------|---------|
| `rooms/` | Room inventory & occupancy |
| `payments/` | Rent / dues |
| `bookings/` | Check-in / check-out |
| `reports/` | Analytics views |

Also see [`src/features/pg/README.md`](./src/features/pg/README.md).

---

## Auth & routing today

| Route | Access | Component |
|-------|--------|-----------|
| `/login` | Public | `LoginPage` |
| `/dashboard` | Authenticated | `DashboardPage` inside `DashboardShell` |
| `/` and unknown | Redirect | → `/dashboard` (then auth gate sends unsigned users to login) |

Session is persisted in `localStorage` under `pg-management.session` via Zustand. Replace persistence when Firebase Auth session handling lands.

---

## Platforms

See **[PLATFORMS.md](./PLATFORMS.md)** for developing and packaging on **macOS** and **Windows**.
