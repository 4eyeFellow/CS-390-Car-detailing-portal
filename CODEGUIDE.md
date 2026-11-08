
# Evansville Mobile Car Detailing


# -----------UNDERSTANDING REACT-----------

## QUICK COMMAND REFERENCE

| Command | Purpose |
|---|---|
| `npm install` | Download dependencies |
| `npm run dev` | Start the website |
| `Control + c` | Stop the website |
| `npm run build` | Test production build |
| `git pull` | Get latest GitHub changes |
| `git status` | Check changed files |

# 1. FIRST-TIME SETUP

**Required:** VS Code and Node.js (includes npm).

1. Download or clone the project from GitHub.
2. Open the project folder in VS Code.
3. Open **Terminal > New Terminal**.
4. Run:

```bash
npm install
```

This downloads all the React/Vite dependencies needed for the project. **Only necessary the first time or when dependencies change.**

Do NOT create a new React project. Everything is already set up.

---

# 2. HOW TO RUN THE WEBSITE

In the VS Code terminal:

```bash
npm run dev
```

The terminal will display something like:

```text
Local: http://localhost:5173/
```

**Open that link in your browser to view the website.**

- The website runs locally on your computer, not publicly online.
- Changes automatically appear in the browser when saved.
- Keep the terminal running while working.
- Press **Control + C** to stop the website.
- Run `npm run dev` again whenever you want to restart it.

---

# 3. WHERE EVERYTHING IS

# IMPORTANT FILES

**GLOBAL STYLES:** `src/index.css`
- Shared styling for text, buttons, containers, etc.
- Currently contains very basic placeholder styles.
- Changing this will affect any page using the styles, which is great for consistent styling,
- HOWEVER, if you need styling specific to your page (like positioning a container), keep those adjustments in your page's file rather than changing the global styles!

**PAGE NAVIGATION:** `src/App.jsx`
- Connects all pages and controls navigation.
- New pages must be imported and added here.

**NAVIGATION HOMEPAGE:** `src/pages/NavigateTo.jsx`
- Temporary starting page with buttons to every other page.
- Used to test and view individual pages.

**MAIN PAGES:** `src/pages/`
- `SignIn.jsx`
- `MyProfile.jsx`
- `AdminDashboard.jsx`

**BOOKING FORM PAGES:** `src/pages/form/`
- `GetClientDetails.jsx`
- `GetCarDetails.jsx`
- `SelectPackage.jsx`
- `SelectDate.jsx`
- `ReviewSubmit.jsx`
- `Confirmation.jsx`

**OTHER FILES:**
- `src/main.jsx` — Starts the React application.
- `src/App.css` — Currently unused.
- `public/` — Static assets, such as images.
- `package.json` — Project dependencies and commands.

---

## 4. CURRENT PROJECT SETUP

The website currently has:

- A functioning React/Vite setup.
- A temporary navigation homepage.
- Individual placeholder pages for each major feature.
- Shared basic CSS styling (white background, black text).
- Buttons to navigate between pages.

**The pages are placeholders, not finished features.**

For now, navigation is handled through `App.jsx` rather than actual URLs. Refreshing returns to the navigation homepage.

The purpose of this setup is to give everyone a working starting point to build on.

---
