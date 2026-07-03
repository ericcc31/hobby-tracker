# Warhammer Hobby Tracker — Full Project Recap & Reference

---

## What we built

A personal iPhone web app for tracking a Warhammer miniature collection. It lives at your GitHub Pages URL, opens in Safari, and can be saved to your iPhone home screen where it looks and behaves like a native app — full screen, no browser chrome, its own icon. No account required, no subscription, no backend server. Everything you enter (unit names, photos, recipes, notes) is stored privately on your phone using a browser technology called IndexedDB, and never sent anywhere.

---

## How we built it

We built this as a single HTML file — one file that contains the entire app: layout, visual design (CSS), and logic (JavaScript) all in one place. This was a deliberate choice for simplicity. No frameworks, no build tools, no dependencies. You can open the file in any text editor and see exactly what's in it. The tradeoff is that editing it requires some confidence with code, which is why we work on it together here in Claude.

---

## Features (current state)

### Three tabs

**Units**
- A grid of cards showing every unit you've added, with a thumbnail (the most recent photo you uploaded), the unit name, faction, and a colored stage pill.
- Search bar at the top filters by unit name or faction as you type.
- Filter chips below the search bar let you view only units at a specific stage.
- Tap any card to open and edit that unit.
- Tap + (top right or bottom right floating button) to add a new unit.

**Each unit stores:**
- Name and faction/army
- Up to 5 photos, compressed automatically so they don't eat your phone storage
- A progress stage (one of the 7 stages below)
- Notes (free text — paint schemes, conversion plans, anything)
- Pinned paint recipes (links to recipes from the library)

**Paint Recipes**
- A standalone recipe library, separate from but connected to units.
- Each recipe has: a name, one finished photo, and an ordered list of steps.
- Each step has two fields: paint name (e.g. "Citadel Macragge Blue") and technique/note (e.g. "basecoat, two thin coats").
- Recipes can be pinned to any number of units, and units can have any number of recipes pinned to them (many-to-many relationship).
- Pinning is bidirectional — you can pin from the recipe screen or from the unit screen, and both stay in sync.

**Progress**
- An overview screen showing: total units, finished count, percentage of collection finished, and in-progress count.
- A bar chart showing how many units are at each stage, color-matched to the stage pills.
- Deliberately no goals, streaks, or activity calendar — kept simple on purpose.

---

## The 7-stage pipeline

This is the exact pipeline, in order. Do not rename or reorder without updating the app code.

| Stage | Color |
|-------|-------|
| Bought | Gray |
| Built | Orange/brown |
| Primed | Blue |
| Painted | Green |
| Based | Purple |
| Transfers | Gold |
| Finished | Pink |

---

## Technical details (for reference or handoff)

- **File:** Single HTML file, no build step, no external libraries.
- **Database:** IndexedDB, stored locally on the device. Database name: `hobbyTrackerDB`. Two stores: `units` and `recipes`.
- **Photos:** Compressed client-side before storage — resized to max 900px on longest edge, JPEG quality 0.72. Stored as base64 data URLs inside IndexedDB.
- **Colors:** All defined as CSS variables at the top of the `<style>` block — easy to change without touching any logic.
- **Hosting:** GitHub Pages, deployed from the `main` branch, root folder. The file must be named `index.html` for the clean URL to work.
- **PWA:** Uses `apple-mobile-web-app-capable` and related meta tags so Safari treats it as a home-screen app. No service worker currently — offline works because IndexedDB is local, but there's no explicit cache manifest.

---

## Decisions we made (and why)

**Why a web app, not a native app:** No Mac required, no $99/year Apple Developer account, no App Store review process. A GitHub Pages PWA is free, instant to update, and works perfectly for a personal tool.

**Why a single HTML file:** No build tools, no Node.js, no dependencies to break. You can hand this file to anyone and it just works in a browser.

**Why IndexedDB:** It's the most capable local storage option in modern browsers — can handle large data like base64 photos, survives browser restarts, and has no arbitrary size limit the way localStorage does.

**Why GitHub Pages:** Apple's iOS 18.5 removed the ability to open local HTML files directly in Safari due to a security change. Hosting the file at a real `https://` URL sidesteps this entirely. GitHub Pages is free, reliable, and permanent for public repos.

**Why not HobbyArmory:** HobbyArmory is a real, well-built app. We're building something personal and deliberate — no ads, no account, no subscription risk, built exactly the way you want it, with features you decide on yourself. The goal was never to clone it, just to be inspired by its approach.

---

## What's not built yet (open ideas)

- **Backup/export** — currently the only copy of your data is on your phone. If you clear Safari's site data or get a new phone, it's gone. An export-to-JSON-file button is the obvious safety net and should probably be the next feature we add.
- **Import** — the reverse of export; restoring a backup or moving data to a new phone.
- **Native app via Capacitor** — wrapping this same HTML/JS in a native shell for a real App Store listing. Discussed as a maybe-someday idea, not a priority.

---

## Your update process — step by step

This is the workflow for every future session: you work with Claude in chat to change or add something, get a new HTML file, and push it live to your phone.

### Step 1 — Work with Claude in chat
Describe what you want changed or added. Claude makes one change at a time, explains it in plain English, and gives you a new `index.html` file to download. Always download the full new file — not a partial snippet — since the whole app lives in one file.

### Step 2 — Download the new file from Claude
When Claude presents the file, download it. It will be named `warhammer-tracker.html` or `index.html` depending on how it was created — make sure it ends up named `index.html` before you upload it to GitHub (you can rename it on your computer or during the GitHub upload step).

### Step 3 — Go to your GitHub repo
Open github.com in a browser, sign in, and navigate to your `hobby-tracker` repository (or whatever you named it).

### Step 4 — Upload and replace the file
Click on the existing `index.html` file in your repo. On the file's page, click the pencil/edit icon area and look for the option to upload — or go back to the main repo page, click "Add file" → "Upload files," drag in the new `index.html`, and GitHub will replace the old one. At the bottom of the upload page, write a short note in the "Commit changes" box describing what changed (e.g. "added export button" or "changed stage colors") — this is called a commit message and it's just for your own reference history.

### Step 5 — Wait 1–2 minutes
GitHub Pages doesn't update instantly. It usually takes between 30 seconds and 2 minutes to rebuild and publish after a commit. You can watch the progress under your repo's Settings → Pages, or check the Actions tab.

### Step 6 — Hard refresh on your phone
Open the app URL in Safari (not the home screen icon — open Safari and type the URL directly). Do a hard refresh: pull down on the page until the refresh spinner appears and hold it, or close the tab fully and reopen the URL. This forces Safari to fetch the new version instead of showing a cached old one. Once you confirm the update loaded correctly in Safari, the home screen icon will also use the new version on next launch.

### Step 7 — Confirm your data is still there
Your unit data lives in IndexedDB on your phone and has nothing to do with the file on GitHub. Updating the app code never touches your data. But it's worth a quick check after any update — tap a unit, confirm it looks right.

---

## Important things to know long-term

**Your data is only on your phone.** IndexedDB is local storage — it does not sync to iCloud, it does not back up with your normal iPhone backup (unless you use encrypted iTunes/Finder backups, which do include app data for Safari), and it does not go to GitHub. When we build the export feature, use it regularly.

**Clearing Safari data will wipe the app.** If you ever go to Settings → Safari → Clear History and Website Data, that will delete your hobby tracker data along with everything else. Don't do this casually. The specific path that deletes it is "Website Data" — if you need to clear browsing history separately, look for options that don't touch website data.

**The GitHub repo is public.** The code of the app is visible to anyone who finds the URL. Your personal data (units, photos, recipes) is never in the repo — it only lives on your device. But the app's source code is public, which is fine and normal for a personal project like this.

**Updating the app does not reset your data.** This is worth repeating because it's counterintuitive. The HTML file on GitHub is just the code — the instructions for how the app behaves. Your actual data lives separately on your phone in IndexedDB and is completely unaffected by replacing the code file.

---

## Reference links

- Your live app: `https://ericcc31.github.io/hobby-tracker/`
- Your GitHub repo: `https://github.com/ericcc31/hobby-tracker`
- GitHub Pages docs: https://docs.github.com/en/pages
- HobbyArmory (inspiration): https://www.hobbyarmory.com
