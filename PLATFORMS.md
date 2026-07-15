# Running on macOS and Windows

Same codebase. Electron packages a native desktop app for each OS. One repo, two installers.

---

## Requirements (both platforms)

- **Node.js** 20+ (LTS recommended)
- **npm** 10+
- Git (optional)

```bash
cd pg-management
npm install
```

---

## Develop (either OS)

```bash
npm run dev
```

Opens the Electron window with hot reload. Works the same on Mac and Windows.

| Step | What happens |
|------|----------------|
| 1 | Vite serves the React UI |
| 2 | Electron loads main + preload |
| 3 | App window opens → Login |

Local auth shell: any valid email + non-empty password → Dashboard.

---

## Build installers

### On a Mac (produce macOS app)

```bash
npm run dist:mac
```

Output in `release/`:

| Artifact | Use |
|----------|-----|
| `*.dmg` | Drag-to-Applications installer |
| `*.zip` | Portable archive |

Open the `.dmg` and move **PG Management** to Applications.

### On a Windows PC (produce Windows app)

```bash
npm run dist:win
```

Output in `release/`:

| Artifact | Use |
|----------|-----|
| `*.exe` (NSIS) | Installer wizard |
| portable `*.exe` | Run without install |

Run the NSIS installer, or use the portable build if you prefer no setup.

### Current machine only

```bash
npm run dist
```

Packages for **whatever OS you are on right now**.

---

## Cross-build notes

| Want | Run on | Command |
|------|--------|---------|
| macOS `.dmg` / `.zip` | macOS | `npm run dist:mac` |
| Windows `.exe` | Windows | `npm run dist:win` |

- Prefer building **macOS installers on a Mac**.
- Prefer building **Windows installers on a Windows PC**.
- Building Windows from macOS (or the reverse) often needs extra tooling and is not required for day-to-day work.

Icons and packaging config live in `resources/` and `electron-builder.yml`.

---

## Useful scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Develop on current OS |
| `npm run build` | Compile only (no installer) |
| `npm run dist:mac` | macOS package |
| `npm run dist:win` | Windows package |
| `npm run typecheck` | TypeScript check |

---

## Firebase (when you wire it)

1. Copy `.env.example` → `.env`
2. Fill `VITE_FIREBASE_*` for **this operator’s** Firebase project
3. Same `.env` pattern on Mac and Windows developer machines
4. Do **not** commit `.env`

Auth and data stay tied to the signed-in user — not a multi-tenant product.

---

## Architecture

Folder map and “where do I put a feature?” → [ARCHITECTURE.md](./ARCHITECTURE.md)
