# Setup & Development Guide

## Prerequisites

| Tool    | Minimum Version | Check            |
| ------- | --------------- | ---------------- |
| Node.js | 18.x            | `node --version` |
| npm     | 9.x             | `npm --version`  |
| Git     | any             | `git --version`  |

---

## Installation

```bash
# 1. Navigate to the project directory
cd todo-app

# 2. Install all dependencies
npm install
```

This installs all packages listed in `package.json` — React, Vite, Tailwind, Framer Motion, dnd-kit, Supabase, Firebase, and all other dependencies.

---

## Environment Variables

The app works fully offline without any environment variables. To enable cloud sync and authentication, configure the backends:

```bash
# Copy the example file
copy .env.example .env   # Windows
cp .env.example .env     # Mac/Linux
```

Then edit `.env` and fill in your credentials:

```env
# ─── Supabase ────────────────────────────────────────────────────────────────
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# ─── Firebase ────────────────────────────────────────────────────────────────
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123
```

**Important**: All Vite environment variables must start with `VITE_` to be accessible in the browser. Never put secret keys here — only public/anon keys.

---

## Development

```bash
# Start the development server with HMR
npm run dev
```

Opens at **http://localhost:5173**

The dev server supports:

- Hot Module Replacement (HMR) — changes reflect instantly without full reload
- React Fast Refresh — component state is preserved across edits
- Source maps for debugging

---

## Available Scripts

| Script      | Command           | Description                        |
| ----------- | ----------------- | ---------------------------------- |
| Development | `npm run dev`     | Start Vite dev server on port 5173 |
| Build       | `npm run build`   | Production build to `dist/`        |
| Preview     | `npm run preview` | Serve the production build locally |
| Lint        | `npm run lint`    | Run ESLint on all source files     |

---

## Production Build

```bash
npm run build
```

Output goes to `dist/`. The build:

- Minifies all JavaScript and CSS
- Tree-shakes unused code
- Generates content-hashed filenames for cache busting
- Produces a single `index.html` entry point

```bash
# Preview the production build locally
npm run preview
# Opens at http://localhost:4173
```

---

## Project Structure

```
todo-app/
├── public/                    # Static assets served as-is
│   └── favicon.svg
├── src/
│   ├── assets/                # Images imported by components
│   ├── components/
│   │   ├── auth/              # AuthModal
│   │   ├── dashboard/         # StatsPanel
│   │   ├── filters/           # FilterBar, SortMenu
│   │   ├── layout/            # Layout, Header, Sidebar
│   │   ├── tasks/             # TaskCard, TaskList, TaskForm, TaskEmpty
│   │   └── ui/                # Button, Badge, Modal, Skeleton, toggles, pickers
│   ├── context/               # React contexts (Theme, UI, Task, Auth)
│   ├── hooks/                 # Custom hooks
│   ├── lib/                   # Backend clients (Supabase, Firebase, taskSync)
│   ├── utils/                 # Pure utilities (constants, sampleData, taskHelpers)
│   ├── App.jsx                # Root component
│   ├── main.jsx               # Vite entry point
│   └── index.css              # Tailwind + custom CSS
├── docs/                      # This documentation
├── .env                       # Environment variables (not committed)
├── .env.example               # Template for .env
├── .gitignore
├── eslint.config.js
├── index.html                 # HTML entry point
├── package.json
├── postcss.config.js
├── tailwind.config.js
└── vite.config.js
```

---

## Supabase Setup (Step by Step)

1. Create a free account at [supabase.com](https://supabase.com)
2. Click **New Project**, choose a name and region
3. Go to **SQL Editor** and run the schema from `docs/BACKEND.md`
4. Go to **Authentication → Providers**:
   - Email is enabled by default
   - For Google: create OAuth credentials at [console.cloud.google.com](https://console.cloud.google.com), add your Supabase callback URL
5. Go to **Project Settings → API**
6. Copy **Project URL** → `VITE_SUPABASE_URL`
7. Copy **anon public** key → `VITE_SUPABASE_ANON_KEY`

---

## Firebase Setup (Step by Step)

1. Create a project at [console.firebase.google.com](https://console.firebase.google.com)
2. Click **Add app** → Web
3. Register the app (no need for Firebase Hosting)
4. Copy the `firebaseConfig` object values to your `.env`
5. Go to **Firestore Database** → **Create database** → Start in production mode
6. Go to **Rules** tab and paste the security rules from `docs/BACKEND.md`
7. Click **Publish**

---

## Tailwind Configuration

`tailwind.config.js` key settings:

```js
{
  darkMode: 'class',           // dark mode via .dark class on <html>
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: { /* indigo 50-900 */ },
        priority: { high, medium, low }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif']
      }
    }
  }
}
```

---

## ESLint Configuration

`eslint.config.js` uses:

- `@eslint/js` recommended rules
- `eslint-plugin-react-hooks` — enforces Rules of Hooks
- `eslint-plugin-react-refresh` — ensures components are Fast Refresh compatible

Run linting:

```bash
npm run lint
```

---

## Deployment

### Netlify

```bash
# Build command
npm run build

# Publish directory
dist

# Environment variables
# Add all VITE_* variables in Netlify dashboard → Site settings → Environment variables
```

Add a `_redirects` file in `public/`:

```
/*  /index.html  200
```

### Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables
vercel env add VITE_SUPABASE_URL
vercel env add VITE_SUPABASE_ANON_KEY
# ... etc
```

Vercel auto-detects Vite and configures the build correctly.

### GitHub Pages

```bash
# Install gh-pages
npm install -D gh-pages

# Add to package.json scripts:
"predeploy": "npm run build",
"deploy": "gh-pages -d dist"

# Deploy
npm run deploy
```

Add `base: '/repo-name/'` to `vite.config.js` if deploying to a subdirectory.

---

## Common Issues

### App shows blank page after build

- Check browser console for errors
- Ensure `base` in `vite.config.js` matches your deployment path
- Verify all `VITE_*` environment variables are set in your hosting platform

### Tasks not syncing to Supabase

- Verify credentials in `.env` are correct
- Check Supabase dashboard → Logs for errors
- Ensure the SQL schema has been run (tasks table exists)
- Verify Row Level Security policies are set up correctly

### Google sign-in not working

- Check that the redirect URL in Google OAuth matches your Supabase callback URL
- Format: `https://your-project.supabase.co/auth/v1/callback`
- Ensure Google provider is enabled in Supabase Authentication settings

### Firebase realtime not updating

- Check Firebase console → Firestore → Rules are published
- Verify all Firebase config values in `.env` are correct
- Check browser console for Firebase permission errors

### Drag-and-drop not working

- Ensure Sort is set to **Manual Order** in the sort dropdown
- Drag is intentionally disabled for all other sort modes

### Browser notifications not appearing

- Click "Allow" when the browser asks for notification permission
- Check browser settings → Notifications → ensure the site is allowed
- Notifications only fire for tasks due within 24 hours

---

## Adding a New Category

Edit `src/utils/constants.js`:

```js
export const DEFAULT_CATEGORIES = [
  // ... existing categories ...
  {
    id: "finance",
    label: "Finance",
    color: "#eab308", // yellow
    bgClass: "bg-yellow-100 dark:bg-yellow-900/30",
    textClass: "text-yellow-700 dark:text-yellow-400",
  },
];
```

The new category will automatically appear in the sidebar, filter bar, and task form.

---

## Adding a New Accent Color

Edit `src/context/UIContext.jsx`, add to the `ACCENT_COLORS` array:

```js
{
  id: 'coral',
  label: 'Coral',
  primary: '#ff6b6b',
  vars: {
    '--accent-50':  '#fff5f5',
    '--accent-100': '#ffe3e3',
    '--accent-200': '#ffc9c9',
    '--accent-300': '#ffa8a8',
    '--accent-400': '#ff8787',
    '--accent-500': '#ff6b6b',
    '--accent-600': '#fa5252',
    '--accent-700': '#f03e3e',
    '--accent-glow': 'rgba(255,107,107,0.35)',
    '--orb1': 'rgba(255,107,107,0.45)',
    '--orb2': 'rgba(255,135,135,0.35)',
    '--orb3': 'rgba(250,82,82,0.25)',
  },
},
```

The color will appear in the picker grid automatically.
