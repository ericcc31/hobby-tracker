# Wet Palette — Project Memory

## What this is
A personal iOS app for tracking a Warhammer miniature collection: painting
progress, paint recipes, and a visual history of how each miniature looked
at every stage. Built with **Expo + React Native**, developed in Claude
Code, following the structure taught in Nick Saraev's "How to Build Mobile
Apps with Claude Code" course.

This is a **fresh rebuild**, not a port of old code. There's an earlier
single-file HTML/PWA version of this app (working title "Hobby Tracker")
kept as a reference/backup — don't reference or reuse its code, just the
ideas in this doc.

Long-term goal: publish to the App Store via EAS Build. Not urgent, but
build with that path in mind (avoid anything that would block it later).

## Working name
**Wet Palette.** Not fully locked, but this is the current direction —
confirm before assuming it's final if it comes up in generated copy,
splash screens, bundle IDs, etc.

## What makes this different from competitors
There are several existing Warhammer/miniature painting trackers (Pile of
Potential, Sprue, Figure Case, HobbyArmory, The Painting Ledger,
PaintMyMinis). Most treat photos as an afterthought — one thumbnail per
model, usually the finished shot.

**Wet Palette's core differentiator: a photo per stage, not just a photo
per unit.** Each unit should have room for a distinct photo at each point
in the pipeline (built, primed, painted, based, finished, etc.), and the
unit detail screen should let you visually compare early vs. late photos
— e.g. a before/after reveal slider — rather than just listing thumbnails.
This is the single feature to protect and build well; everything else is
secondary to it.

## Core data model
- **Unit**: name, army, chapter (Space Marines only — Blood Angels, Dark
  Angels, Space Wolves, Black Templars, Deathwatch), stage, notes, pinned
  recipe IDs, and **a photo slot per pipeline stage** (not just a flat
  photo array — each photo should know which stage it was taken at, so
  the app can do stage-to-stage comparisons).
- **Recipe**: name, one photo, ordered list of steps (paint + technique),
  pinned unit IDs. Pinning is many-to-many and bidirectional — pinning
  from either side keeps both in sync.
- **Stage pipeline** (exact names and order — do not rename or reorder
  without asking first):
  Bought → Built → Primed → Painted → Based → Transfers → Finished

## Gamification (decided — keep it light)
Three elements only. Do not add more (badges, tiers, leaderboards, ranks)
without asking first — this was an explicit choice, not an oversight:
1. **Painting streaks** — days/weeks with painting activity. Should feel
   like a quiet nudge (small indicator, e.g. a flame + count), not a
   guilt-trip modal or interruption.
2. **Before/after reveal animation per unit** — the flagship interaction.
   A draggable slider or swipe gesture comparing an early-stage photo to
   the finished photo. This should be the centerpiece of the unit detail
   screen, not a buried feature.
3. **Collection completion %** — the main "reward" metric, shown as the
   natural payoff of tracking progress rather than a separate stats page.

## Design direction
- Minimalist, native-feeling iOS design — informed by the "mobile app UI
  in 8 minutes" video Eric watched (leverage native iOS gestures and
  patterns rather than custom web-style components).
- Native navigation, system typography, standard iOS spacing/sizing.
- Real native gestures: swipe-to-delete, the before/after reveal slider,
  haptic feedback on key actions (stage change, save, delete, streak
  milestones) via `expo-haptics`, native transitions (edge-swipe-back).
- Should feel like a "real" iOS app, not a web app wrapped in a shell.

## How I want to work
- I'm not strong in code. Explain changes in plain language, not just
  diffs or file lists.
- One change at a time — check in with me before moving to the next
  rather than doing large unprompted rewrites.
- Before starting a new feature, briefly confirm scope/approach with a
  quick question rather than assuming.
- When a design decision comes up (naming, colors, layout, navigation
  pattern), ask rather than guess.

## Tech stack
- Expo + React Native, tested locally via Expo Go.
- EAS Build for eventual App Store builds (Apple Developer account only
  needed at that point, not during development).
- Data persistence: not yet decided — pick together before implementing
  (options to weigh: AsyncStorage for simplicity, expo-sqlite or
  WatermelonDB if the stage-by-stage photo model outgrows key-value
  storage).

## Open questions / not yet decided
- Final app name (Wet Palette is the leading candidate, not locked).
- App icon — Eric is developing this separately; several SVG concepts
  were explored (paint stroke on red, shield on blue, ascending bar
  chart, scattered palette blobs) but nothing finalized yet.
- Backup/export approach on mobile (iCloud? manual file export?).
- Data persistence choice (see Tech stack above).
- Exact visual treatment of the streak indicator (placement, whether it's
  always visible or only on the home screen).
