# Application Tracker — Group 7

This first draft translates our teammate's Figma Home screenshots into a responsive **Vite + React** interface. It follows the class approach: function components, JSX, CSS, props, and `.map()` for repeated content. The project proposal is in [proposal.md](proposal.md).

## Run locally

Node 18 or newer is required, matching the course's Vite 5 starter.

```powershell
npm.cmd install
npm.cmd run dev
```

On macOS/Linux, use `npm install` and `npm run dev`. Open the URL printed by Vite (usually `http://localhost:5173`).

```powershell
npm.cmd run build
```

`node_modules/` and `dist/` are ignored by Git. Commit the source and `package-lock.json`.

## Three static design previews

| URL (after starting Vite) | Screenshot represented |
| --- | --- |
| `/` | First-time empty Home, also called the landing page in the design handoff |
| `/?preview=timeline` | Home with sample application events grouped by week |
| `/?preview=calendar` | November 2026 calendar with November 12 selected |

Resize any preview to see the matching phone layout. There is no separate marketing landing page in the supplied screenshots.

**This is a visual draft.** Add application, Sync, reminder actions, Applications navigation, view buttons, and month/day controls are presentation-only. They have no API calls, click handlers, data mutation, uploads, or persistence. `aria-disabled` communicates this to assistive technology while preserving the mockup's styling. The preview URL chooses a fixed screen; it is not a production router. Home links reload the default empty preview.

The calendar shows correct November **2026** weekdays; some screenshot captions used 2025 weekday names with the 2026 month. Relative deadline copy and week group labels remain fixed demo content, not calculations from today's date.

## Structure and responsibilities

```text
src/
  main.jsx                     React entry point
  App.jsx                      Composes the page and chooses the static preview
  App.css                      Layouts, components, and responsive rules
  styles/tokens.css            Figma colors, fonts, spacing, radii, shadows
  assets/fonts/                Locally bundled fonts and their licenses
  data/mockData.js             Sample applications, events, and reminders
  components/
    AppHeader.jsx              Desktop navigation and compact mobile header
    MobileNavigation.jsx       Fixed phone navigation and floating Add button
    ViewTabs.jsx               Timeline / Calendar selector appearance
    EmptyWelcome.jsx           Reusable first-application welcome card
    UpcomingPanel.jsx          Next 7 days and reminder rows
    EventCard.jsx              Shared event appearance in timeline and calendar
    TimelineView.jsx           Weekly groups of EventCards
    CalendarView.jsx           Month grid and selected-day events
    Icon.jsx                   Small local SVG icons, no icon dependency
```

### How the files work together

The startup flow is `index.html → src/main.jsx → src/App.jsx`. The HTML provides the `root` element, `main.jsx` loads the styles and starts React, and `App.jsx` assembles the components and passes sample data down through props.

- **Page composition:** `AppHeader`, `ViewTabs`, `UpcomingPanel`, and `MobileNavigation` provide the surrounding interface. App chooses `EmptyWelcome`, `TimelineView`, or `CalendarView` using the preview URL.
- **Repeated content:** TimelineView groups events by week; CalendarView builds the month grid and selects events for a fixed sample date. Both reuse EventCard. Icon provides shared SVG drawings.
- **Data relationships:** `mockData.js` separates applications from events. Each event's `applicationId` points to an application, allowing several events for one application. `.filter()` selects matching events, `.find()` locates their application, and `.map()` renders the lists with stable keys. Upcoming reminders are currently separate sample records; later they should be derived from shared state.
- **Styles:** `tokens.css` defines the shared design values and local fonts. `App.css` applies them to components and changes the layout at 900px and below. Font files and license documents live in `src/assets/fonts/`.
- **Future interactions:** App can own shared application/event state and pass callback props to children. View selection and calendar dates are currently fixed previews, and action buttons have no handlers yet.

### Project setup files

| File | Responsibility |
| --- | --- |
| `index.html` | Browser document, React root, page title, and viewport settings. |
| `package.json` | Dependencies and dev/build/preview commands. |
| `package-lock.json` | Exact installed dependency versions for consistent team installations. |
| `vite.config.js` | Enables Vite's React plugin. |
| `.gitignore` | Excludes generated files such as `node_modules/` and `dist/`. |
| `README.md` | Setup, architecture, previews, and next steps. |
| `proposal.md` | The team's product proposal. |

`node_modules/` is created by installation; `dist/` is created by a production build. Neither is committed to Git.

### Why organize it this way?

- **Shared data, separate presentation:** application records store company, role, and status. Events refer to an `applicationId`; one application can have several events. Updating one company/status later can update both the timeline and calendar.
- **Props:** App supplies the sample arrays to the views. Components receive what they display through props instead of selecting or modifying DOM elements.
- **Reusable cards:** EventCard controls date, role, status badge, and event metadata in both views, avoiding two designs drifting apart.
- **One design system:** `tokens.css` contains the screenshot's palette and typography. Montserrat is used for headings; Google Sans Flex is used for body text and controls. Local fonts avoid runtime network requests.
- **Responsive composition:** at desktop widths the schedule and upcoming panel form an 8/4-style split with a 24px gutter. At 900px and below, upcoming content moves first, the compact header appears, and bottom navigation/floating action are shown. Extra bottom space prevents the fixed controls from hiding the final event.
- **Empty placement:** desktop puts the welcome card in the schedule area; mobile puts it under Next 7 days. The same EmptyWelcome component is reused in both locations and CSS displays only the appropriate instance.

## Next implementation phases (not implemented yet)

1. Move applications/events and the selected view into state in App; pass callback props to controls, following In-Person Project 6.
2. Build the add/edit application form as a controlled component. Keep field values local to the form and send a validated record to App.
3. Derive weekly groups, upcoming reminders, and selected-day events from shared state. Do not create independent copies of the same records in each view.
4. Add Applications navigation and state-driven calendar selection. Keep the existing presentational components.
5. Add persistence and authenticated Google Calendar integration separately. Job-link extraction and LLM credentials belong behind a server endpoint, not in browser source.

No deployment or Git push is performed by this draft. Review the layouts together before adding those later features.

## Font sources

Fonts are distributed under the SIL Open Font License; copies of each license are included in `src/assets/fonts/`.

- [Montserrat](https://fonts.google.com/specimen/Montserrat)
- [Google Sans Flex](https://fonts.google.com/specimen/Google+Sans+Flex)
