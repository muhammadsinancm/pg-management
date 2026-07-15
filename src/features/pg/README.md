# PG domain modules (scaffold)

On-premise app for a **single signed-in user** (Firebase Auth). There is **no
multi-tenant / tenants** model — each install serves one operator and their
property data.

Add feature slices here as vertical folders:

| Folder | Purpose |
|--------|---------|
| `rooms/` | Room inventory & occupancy |
| `payments/` | Rent / dues |
| `bookings/` | Check-in / check-out |
| `reports/` | Analytics views |

Each module should follow:

```
src/features/pg/<module>/
  pages/
  components/
  hooks/
  stores/
  types.ts
```

See root `ARCHITECTURE.md` for routing, sidebar, and service wiring steps.
See `PLATFORMS.md` for running and packaging on macOS and Windows.
