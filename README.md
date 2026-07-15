# PG Management

On-premise desktop app for a **single operator** managing a PG property.
Runs on **macOS** and **Windows**. Auth and data use **Firebase** (stubs today; wire later).
There is **no multi-tenant / tenants** model.

## Quick start

```bash
cd pg-management
npm install
npm run dev
```

Sign in with any valid email and non-empty password (local auth shell). You land on the dashboard.

## Docs

| Doc | What it’s for |
|-----|----------------|
| **[PLATFORMS.md](./PLATFORMS.md)** | Run & package on macOS and Windows |
| **[ARCHITECTURE.md](./ARCHITECTURE.md)** | Folders, Firebase, PG modules, hardware recipes |
| **[.env.example](./.env.example)** | Firebase env placeholders |

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Electron + Vite (Mac or Windows) |
| `npm run build` | Compile main, preload, renderer |
| `npm run dist` | Package for current OS |
| `npm run dist:mac` | macOS DMG / ZIP |
| `npm run dist:win` | Windows NSIS / portable |
| `npm run typecheck` | TypeScript check |

## Stack

- Electron + electron-vite
- React 19 + TypeScript
- Tailwind CSS v4 + shadcn/ui
- Zustand (session)
- React Router
- Firebase (folder stubs — wire when ready)
