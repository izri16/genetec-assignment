# Genetec assignment

Small reusable component library (`DataGrid`, `Timeline`, `UpsertEventForm`) showcased in a demo "Events console" app.

The demo app is meant to loosely evoke a security-ops style dashboard: the user picks an event category (Access / Video / Alarms / Network), browses the events as either a table or a chronological timeline, and can add or edit events via a modal form (in a real-world system events would usually be generated automatically by the underlying devices — the manual form is here to satisfy the assignment's "Add/Edit Event" requirement). It's deliberately lightweight — the goal isn't to be a realistic product, just to put the three lib components into a plausible end-to-end scenario where their loading / empty / error / validation paths all get exercised.

## Project layout

```
packages/events-lib   -> the library (the three components)
apps/demo             -> the showcase app (mock data, wiring, styling)
```

I used a pnpm workspace to keep a clean boundary between the reusable lib and the demo app — the split makes it easy to imagine either (a) sharing the lib across several small apps in the same monorepo, or (b) publishing it to npm. I didn't actually publish to npm for simplicity, and also because — looking at the requirements, especially the `Form` — it felt more like an in-house lib than a public one: its scope is opinionated enough (e.g. an "upsert event" form tied to a specific field-config shape) that a public package would need more generalisation than this task asks for.

## Running

```sh
pnpm install
pnpm dev          # start the demo app (Vite dev server)
pnpm build        # build lib + app (optional — only if you want to serve a prod bundle)
pnpm preview      # serve the built app locally (run after `pnpm build`)
pnpm test
pnpm typecheck
pnpm lint
pnpm format
```

## Demo app behaviour

The app has a category switcher (`Access / Video / Alarms / Network`) and a view switcher (`Grid / Timeline`) — both views render the same underlying event list for the selected category, so switching views is always a different presentation of the same data. Each category intentionally simulates a different backend characteristic, so the lib's loading / empty / error states are exercised by real interactions rather than toggle buttons:

- **Access** — loads quickly (~300 ms), 100 events. The default "happy path".
- **Video** — loads **slowly** (~2 s), 100 events. Shows the loading state for longer.
- **Alarms** — always **errors**. Shows the error state with a Retry button.
- **Network** — loads quickly but returns **no data**. Shows the empty state.

The **New event** button opens the form as a modal; clicking a grid row / timeline card opens it in edit mode. The save endpoint is also mocked with ~500 ms latency and **always fails when the active category is Alarms** — same "the alarms endpoint is down" story as the fetch failure above, so the form's error branch is deterministic to demo.

Data is fully in-memory — mutations are kept in a module-scoped store so edits persist for the tab's lifetime but reset on reload.

**Timeline grouping**: events are grouped by day. With 100 events spanning several weeks, day-granularity makes dense clusters and sparse stretches both scannable at a glance (finer would fragment; coarser would flatten signal). Days with **no events are dropped from the output** rather than rendered as empty columns — so keyboard navigation never wastes keystrokes on empty space.

**No virtualisation**: the timeline renders all events in the current page up-front. For the volumes the assignment asks for (≤100) this is fine; at larger scales I'd reach for a windowed renderer (e.g. TanStack Virtual).

**Desktop-first**: the layout is tuned for desktop viewports. I didn't invest in small-screen responsiveness — a real-world event console would target ops-center workstations, and I assumed fitting this into a phone was out of scope for the assignment.

**Grid sizing**: column widths and spacing in the `DataGrid` are a first pass — more care could be given to fluid sizing across viewport widths (proportional columns, min/max constraints, better truncation behaviour). Left as-is to keep the focus on component behaviour rather than pixel polish.

## Tech choices

- **Mantine** for UI primitives. It's lighter than MUI, and much faster to get going with than pure Tailwind or Radix + Tailwind while still giving a polished baseline. Good fit for a small showcase.
- **`@mantine/form`** for the form — smaller than react-hook-form and already in the Mantine ecosystem. In a real app I'd likely pick react-hook-form instead (nicer schema resolvers, `shouldFocusError` built-in) and would reconsider keeping form utilities in the shared lib at all, since schemas tend to be app-specific.
- **No TanStack Table** — the assignment is about building the `DataGrid` itself, and TanStack Table is headless, so we'd still hand-roll all the UI (headers, pagination, filter popovers, visibility menu) on top. Overkill for 100 client-side rows and would hide the actual component work.
- **TanStack Query** in the demo app purely to simplify handling of loading/error/retry/cache states — it might be overkill for the scope, but it keeps `App.tsx` focused on wiring rather than state plumbing.
- **Vite + TypeScript + pnpm workspaces**, ESLint + Prettier.

## Tests

The assignment said not to spend time on tests, so I only added a few targeted unit tests where the logic was error-prone enough that I wanted a safety net — pagination / sort / filter for the grid, grouping + keyboard navigation for the timeline. Everything else is untested on purpose.

## Git history

I deliberately left the history as a sequence of scoped commits rather than squashing to one, to reflect how I'd actually work: one feature per commit, plus the inevitable small fix/refactor commits along the way. Easier to follow as a review timeline and closer to a realistic PR stack.
