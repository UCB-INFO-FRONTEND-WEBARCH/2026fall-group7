# Application Tracker — Group 7

A **Vite + React** app for tracking internship and job applications: deadlines, interview rounds, and the materials each one needs. It started as a static translation of our teammate's Figma screens and is now a working app with routing and saved data. It follows the class approach: function components, JSX, CSS, props, `useState` / `useEffect`, and React Router. The project proposal is in [proposal.md](proposal.md).

## Run locally

Node 18 or newer is required, matching the course's Vite 5 starter.

```powershell
npm.cmd install
npm.cmd run dev
```

On macOS/Linux, use `npm install` and `npm run dev`. Open the URL printed by Vite (usually `http://localhost:5173`).

`npm install` also installs **React Router** (`react-router-dom`), which is listed in `package.json`. If you pulled new changes and see *"Failed to resolve import 'react-router-dom'"*, run `npm install` again.

```powershell
npm.cmd run build
```

`node_modules/`, `dist/` and `.env.local` are ignored by Git. Commit the source, `package.json` and `package-lock.json`.

## Pages (routes)

| URL | Page |
| --- | --- |
| `/` | Home: timeline, calendar, and "Next 7 days" |
| `/?view=calendar` | Home with the Calendar tab open |
| `/applications` | All applications as a list (search, status filters, sort) |
| `/applications?view=board` | The same applications as a board, one column per status |
| `/applications/:id` | One application: status, materials, notes, key dates, job description |

Any other URL redirects to Home. Because the view is in the URL, refreshing or using the browser's Back button keeps you where you were.

**Deploying:** we use `BrowserRouter`, so the host must send every URL to `index.html`. Otherwise refreshing on `/applications` shows a 404.
- **Netlify:** add a file `public/_redirects` containing `/*  /index.html  200`
- **Vercel:** add `vercel.json` containing `{ "rewrites": [{ "source": "/(.*)", "destination": "/" }] }`

## How data is saved (persistence)

Everything is saved in the browser's **localStorage** under the key `group7.applicationTracker.v1`. Only `src/data/storage.js` reads and writes it.

1. `App.jsx` loads the saved data once, into two pieces of state: `applications` and `events` (dates).
2. Pages change data by calling callback props from App (`updateApplication`, `deleteApplication`, `addEvent`, `deleteEvent`, …). Each creates a **new** array.
3. A single `useEffect` in App saves both arrays whenever either changes.

Everything else on screen (timeline weeks, "Next 7 days", "Due Nov 8 · in 2 days", "3/5" materials) is **calculated** from that data in `src/data/schedule.js` and is never saved separately.

Saved data shape:

```js
{
  applications: [{ id, company, role, status, link, description, notes,
                   checklist: [{ id, label, done }], createdAt }],
  events: [{ id, applicationId, kind, date: '2026-11-19', time: '14:00', title, durationMin, googleEventId }]
}
// status: Submitted | Under Review | First Round | Second Round | Third Round | Offer | Denied
// kind:   deadline | interview | assessment | takehome | offer
```

Each event's `applicationId` points to its application, so one application can have several dates.

### Sample data and resetting

While building, the app starts with **sample applications** (dates relative to today) so screens aren't empty.

- **Before the demo:** set `START_WITH_SAMPLE_DATA = false` in `src/data/storage.js`, then clear the saved data. First-time users should see the Welcome screen.
- **To reset:** DevTools → Application → Local Storage → delete `group7.applicationTracker.v1` → refresh.
- localStorage belongs to one browser on one computer. A different browser or laptop starts fresh.

## Structure and responsibilities

```text
src/
  main.jsx                     React entry point; wraps App in <BrowserRouter>
  App.jsx                      Saved state, all data changes, routes, Add/Edit modal, toast
  App.css                      Layout, shared components and controls, responsive rules
  styles/
    tokens.css                 Figma colors, fonts, spacing, radii, shadows
    applications.css           Applications list, board, empty states
    detail.css                 Application detail page
    form.css                   Add / Edit application form
    modal.css                  Modal (design-system popup) and toast
  assets/fonts/                Locally bundled fonts and their licenses
  data/
    storage.js                 The only file that touches localStorage (+ sample-data switch)
    sampleData.js              Sample applications/events, dates relative to today
    schedule.js                Calculated data: timeline weeks, Next 7 days, deadline labels, materials counts
    records.js                 Builds new records from the Add / Edit form
    dates.js                   Date helpers ('YYYY-MM-DD' dates, 'HH:MM' times)
    constants.js               Statuses, date types, colors, icons, default materials
    ids.js                     makeId() for new records
  services/
    googleCalendar.js          Google Calendar API: Google sign-in, create events, our dates → Google's format
  components/
    AppHeader.jsx              Desktop nav (NavLink) and compact mobile header
    MobileNavigation.jsx       Phone bottom navigation and floating Add button
    HomePage.jsx               Route "/": schedule + Next 7 days
    ViewTabs.jsx               Two-option toggle (Timeline/Calendar, List/Board)
    TimelineView.jsx           Events grouped by week
    CalendarView.jsx           Month grid, arrows, selected-day events
    EventCard.jsx              Event card shared by timeline and calendar
    UpcomingPanel.jsx          "Next 7 days" reminders
    EmptyWelcome.jsx           First-time welcome card
    ApplicationsPage.jsx       Route "/applications": list + board, search, filters, sort
    ApplicationDetailPage.jsx  Route "/applications/:id": puts the cards below together
    StatusStepper.jsx          Status stages + Offer / Denied menu
    MaterialsCard.jsx          Materials checklist (tick, rename, delete, add)
    KeyDatesCard.jsx           Key dates (add, delete, Add to Google Calendar)
    ApplicationFormModal.jsx   Add application and Edit details (same form)
    Modal.jsx                  Reusable popup from the design system
    Toast.jsx                  "Application saved · View" message
    EmptyState.jsx             "No applications yet" / "No results" block
    Icon.jsx                   Small local SVG icons, no icon dependency
docs/
  google-calendar.md           How Google Calendar plugs into the app
```

### How the files work together

The startup flow is `index.html → src/main.jsx → src/App.jsx`. `main.jsx` wraps the app in `BrowserRouter`; `App.jsx` holds the saved data, defines the routes, and passes data and callbacks down as props.

- **Routing:** `<Routes>` in App maps URLs to pages. `NavLink` gives the header its active highlight. The detail page reads the id with `useParams()`. Pages navigate with `useNavigate()`. Timeline/Calendar and List/Board use `useSearchParams()`.
- **One source of truth:** applications and events live only in App state. Views receive them as props and calculate what they show; nothing keeps its own copy.
- **Forms:** `ApplicationFormModal` is a controlled component. It keeps field values locally, validates (company and role are required), and sends one finished object to App's `saveForm`. Add and Edit share it.
- **Reusable pieces:** `Modal` (Add/Edit, delete confirmation), `EventCard` (timeline + calendar), `ViewTabs` (both toggles), `EmptyState`, `Icon`.
- **Styles:** `tokens.css` defines the design values; the other CSS files apply them. Every screen has a phone layout that matches the mobile mockups (900px and below); the Add / Edit form becomes full-screen at 600px and below.

### Project setup files

| File | Responsibility |
| --- | --- |
| `index.html` | Browser document, React root, page title, viewport settings, and the Google sign-in script. |
| `package.json` | Dependencies (React, React Router) and dev/build/preview commands. |
| `package-lock.json` | Exact installed dependency versions for consistent team installations. |
| `vite.config.js` | Enables Vite's React plugin. |
| `.gitignore` | Excludes generated and local files such as `node_modules/`, `dist/` and `.env.local`. |
| `README.md` | Setup, routes, persistence, architecture, APIs, and next steps. |
| `docs/google-calendar.md` | How the Google Calendar integration plugs into the app. |
| `proposal.md` | The team's product proposal. |

`node_modules/` is created by installation; `dist/` is created by a production build. Neither is committed to Git.

### Why organize it this way?

- **Shared data, separate presentation:** application records store company, role, status, materials and notes. Events refer to an `applicationId`; one application can have several events. Updating one company/status updates the timeline, calendar, list, board and detail page at once.
- **One source of truth:** applications and events live only in App state and are saved in one place (`storage.js`). Everything else on screen is calculated from them in `schedule.js`, so nothing can get out of sync.
- **Props and callbacks:** App supplies the data to the pages and passes callbacks (`updateApplication`, `addEvent`, …) for changes. Components receive what they display through props instead of selecting or modifying DOM elements.
- **Reusable cards:** EventCard controls date, role, status badge, and event metadata in both the timeline and calendar, avoiding two designs drifting apart. Modal, ViewTabs and EmptyState are reused the same way.
- **One design system:** `tokens.css` contains the screenshot's palette and typography. Montserrat is used for headings; Google Sans Flex is used for body text and controls. Local fonts avoid runtime network requests.
- **Responsive composition:** at desktop widths the schedule and upcoming panel form an 8/4-style split with a 24px gutter. At 900px and below, upcoming content moves first, the compact header appears, and bottom navigation/floating action are shown. Extra bottom space prevents the fixed controls from hiding the final event. The other pages follow the mobile mockups the same way.
- **Empty placement:** desktop puts the welcome card in the schedule area; mobile puts it under Next 7 days. The same EmptyWelcome component is reused in both locations and CSS displays only the appropriate instance.

## External APIs

| API | Status | Where |
| --- | --- | --- |
| **Google Calendar** | **Working.** Sign-in (Google Identity Services) and creating events are done and tested. Only Google accounts on the **Test users** list can sign in (see below). | `src/services/googleCalendar.js`, notes in [docs/google-calendar.md](docs/google-calendar.md) |
The class requires **at least one** external API, so Google Calendar alone meets it.

We dropped the "Fetch details" idea (an LLM reading a job link to fill in the form). It would need a server and an LLM API key, and many job sites can't be read anyway. The Add form keeps the job link as a plain field.

### Google Calendar: setup and who can use it

**Set up locally:** create `.env.local` in the project root with the OAuth Client ID (ask the teammate who owns the Google Cloud project), then restart `npm run dev`:

```text
VITE_GOOGLE_CLIENT_ID=1234-abc.apps.googleusercontent.com
```

Without it, the app still runs and the Google buttons say "Google Calendar isn't connected yet."

**How it works:** the first click on "Add to Google Calendar" or "Sync" opens a Google sign-in popup. Each user signs in with their **own** account, and events go to **their own** main calendar. The token lasts about 1 hour and is kept only in memory; after it expires (or after a refresh), the next click signs in again. Events already added stay in Google Calendar.

**Who can sign in:** the Google Cloud app is in **Testing** mode, so only accounts listed under **OAuth consent screen → Test users** (up to 100) can sign in. Others can use the rest of the app, but Google rejects their sign-in (`access_denied`). We are not publishing the app: the calendar permission is a sensitive scope, so publishing without Google's review shows an "unverified app" warning, and the review takes weeks.

**Allowed URLs:** the OAuth client allows `http://localhost:5173`. After deploying, add the deployed URL too, or sign-in fails with `origin_mismatch`.

## Next steps

1. **Small gaps:** edit an existing key date (right now: delete and re-add); decide what the "Upload" reminder button should do (it currently opens the application).
2. **Before the demo:** turn off sample data (see above), deploy, and add the hosting redirect. For Google Calendar: add the deployed URL to the OAuth client's JavaScript origins, set `VITE_GOOGLE_CLIENT_ID` in the host's environment variables, and add the TAs' and instructor's Google accounts as Test users.

## Font sources

Fonts are distributed under the SIL Open Font License; copies of each license are included in `src/assets/fonts/`.

- [Montserrat](https://fonts.google.com/specimen/Montserrat)
- [Google Sans Flex](https://fonts.google.com/specimen/Google+Sans+Flex)