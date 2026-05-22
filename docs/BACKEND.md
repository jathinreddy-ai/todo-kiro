# Backend & Integration

## Storage Architecture

Taskflow uses a **three-tier storage strategy**:

```
Tier 1: localStorage (always active)
  - Instant reads on page load
  - Works offline
  - No auth required
  - Limited to ~5MB per origin

Tier 2: Supabase PostgreSQL (when configured + signed in)
  - Primary persistent database
  - Row-level security per user
  - Survives browser clears
  - Accessible from any device

Tier 3: Firebase Firestore (when configured + signed in)
  - Realtime sync mirror
  - onSnapshot listener pushes changes to all open tabs/devices
  - Eventual consistency with Supabase
```

---

## Supabase

### What is Supabase?

Supabase is an open-source Firebase alternative built on PostgreSQL. It provides a hosted database, authentication, and auto-generated REST/realtime APIs.

### Database Schema

Run this SQL in your Supabase project's SQL editor (Dashboard → SQL Editor):

```sql
-- Create tasks table
create table if not exists tasks (
  id          text primary key,
  user_id     uuid references auth.users(id) on delete cascade not null,
  title       text not null,
  description text default '',
  priority    text default 'medium' check (priority in ('high', 'medium', 'low')),
  categories  text[] default '{}',
  due_date    date,
  completed   boolean default false,
  "order"     integer default 0,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

-- Enable Row Level Security
alter table tasks enable row level security;

-- Policy: users can only access their own tasks
create policy "Users can manage their own tasks"
  on tasks
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Index for faster user queries
create index if not exists tasks_user_id_idx on tasks(user_id);
create index if not exists tasks_order_idx on tasks(user_id, "order");
```

### Authentication Setup

In your Supabase Dashboard:

1. Go to **Authentication → Providers**
2. Enable **Email** provider (enabled by default)
3. Enable **Google** provider:
   - Create a Google OAuth app at [console.cloud.google.com](https://console.cloud.google.com)
   - Add `https://your-project.supabase.co/auth/v1/callback` as an authorized redirect URI
   - Copy Client ID and Client Secret into Supabase

### Environment Variables

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Find these in: Supabase Dashboard → Project Settings → API

### How the Client Works (`src/lib/supabase.js`)

```js
// Returns null when credentials are placeholder values
export const supabase =
  supabaseUrl && !supabaseUrl.includes("your-project")
    ? createClient(supabaseUrl, supabaseKey)
    : null;

export const isSupabaseConfigured = !!supabase;
```

All functions in `taskSync.js` check `isSupabaseConfigured` before making any calls, so the app works offline without errors.

### Data Mapping

JavaScript task object → Supabase row:

| JS field      | Supabase column | Type                 |
| ------------- | --------------- | -------------------- |
| `id`          | `id`            | `text` (primary key) |
| `title`       | `title`         | `text`               |
| `description` | `description`   | `text`               |
| `priority`    | `priority`      | `text`               |
| `categories`  | `categories`    | `text[]`             |
| `dueDate`     | `due_date`      | `date`               |
| `completed`   | `completed`     | `boolean`            |
| `order`       | `order`         | `integer`            |
| `createdAt`   | `created_at`    | `timestamptz`        |
| `updatedAt`   | `updated_at`    | `timestamptz`        |

---

## Firebase Firestore

### What is Firestore?

Firestore is Google's NoSQL document database with built-in realtime sync. Taskflow uses it as a realtime mirror of Supabase data.

### Data Structure

```
Firestore
└── users/
    └── {userId}/
        └── tasks/
            └── {taskId}/
                ├── id: string
                ├── title: string
                ├── description: string
                ├── priority: string
                ├── categories: array
                ├── dueDate: string | null
                ├── completed: boolean
                ├── order: number
                ├── createdAt: string
                └── updatedAt: string
```

### Security Rules

Paste in Firebase Console → Firestore Database → Rules:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId}/tasks/{taskId} {
      allow read, write: if request.auth != null
                         && request.auth.uid == userId;
    }
  }
}
```

### Firebase Project Setup

1. Go to [console.firebase.google.com](https://console.firebase.google.com)
2. Create a new project
3. Add a Web app
4. Enable Firestore Database (start in production mode)
5. Apply the security rules above
6. Copy the config values to your `.env` file

### Environment Variables

```env
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123
```

### Realtime Sync

```js
// In TaskContext, on sign-in:
const unsub = subscribeToFirestoreTasks(userId, (remoteTasks) => {
  if (remoteTasks.length > 0) {
    dispatch({ type: "LOAD_TASKS", payload: remoteTasks });
  }
});
// Returns unsubscribe function, called on component unmount
```

---

## Authentication Flow

### Sign In with Google

```
User clicks "Sign in" → AuthModal opens
User clicks "Continue with Google"
  → supabase.auth.signInWithOAuth({ provider: 'google' })
  → Browser redirects to Google OAuth consent screen
  → User approves
  → Browser redirects back to app (window.location.origin)
  → Supabase sets session cookie
  → onAuthStateChange fires → user state updates
  → App re-renders with user.id
  → TaskProvider fetches tasks from Supabase
```

### Sign In with Email/Password

```
User fills email + password → clicks "Sign In"
  → supabase.auth.signInWithPassword({ email, password })
  → Returns { data: { user, session }, error }
  → On success: onAuthStateChange fires → user state updates
  → On error: toast.error(error.message)
```

### Sign Up

```
User fills email + password → clicks "Create Account"
  → supabase.auth.signUp({ email, password })
  → Supabase sends confirmation email
  → User clicks link in email → session created
  → onAuthStateChange fires → user state updates
```

### Sign Out

```
User clicks sign-out button
  → supabase.auth.signOut()
  → Session cleared
  → onAuthStateChange fires → user = null
  → TaskProvider re-initialises with userId = null
  → App falls back to localStorage tasks
```

---

## Sync Strategy Details

### First Sign-In

```
1. Fetch tasks from Supabase
2. If Supabase has tasks → load them (overwrite localStorage)
3. If Supabase is empty → upload localStorage tasks to Supabase
   (preserves existing work done offline)
```

### Conflict Resolution

Currently **last-write-wins**. The `updatedAt` timestamp is updated on every mutation. Future improvement: use `updatedAt` for conflict detection.

### Offline Behavior

When the user is offline or backends are not configured:

- All reads/writes go to localStorage only
- No error is shown (silent degradation)
- When connectivity is restored, the next mutation will sync to backends

---

## localStorage Keys

| Key                   | Value               | Description                   |
| --------------------- | ------------------- | ----------------------------- |
| `todo-app:tasks`      | `Task[]` JSON       | Full task array               |
| `todo-app:filter`     | `Filter` JSON       | Last active filter state      |
| `todo-app:sort`       | `string`            | Last active sort option       |
| `todo-app:theme`      | `'dark' \| 'light'` | Theme preference              |
| `todo-app:glass`      | `boolean`           | Glass mode preference         |
| `todo-app:gradient`   | `boolean`           | Gradient mode preference      |
| `todo-app:accent`     | `string`            | Accent color ID or `'custom'` |
| `todo-app:custom-hex` | `string`            | Custom hex color value        |
