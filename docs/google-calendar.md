# Google Calendar: handoff notes

Everything on the app side is built. What's left is the Google part: signing in and creating the event.
The code goes in **one file: `src/services/googleCalendar.js`**.

## How it's wired

| Button | Where | Calls (in `App.jsx`) |
| --- | --- | --- |
| **Add to Google Calendar** | Detail page → Key dates, under each date | `addEventToGoogle(event)` |
| **Sync to Google Calendar** | Header (and "Sync" on mobile) | `syncAllToGoogle()`: every upcoming date without a `googleEventId` |

Both call `createCalendarEvent(event, application)` from `googleCalendar.js`. When it returns an id, App saves it on the event as
`googleEventId`. The button then changes to "✓ In Google Calendar", and Sync skips it next time (no duplicates).
Errors are caught and shown as a toast, so a failed request won't crash the app.

Until a Client ID is set, both buttons show "Google Calendar isn't connected yet." That's expected.

### What an event looks like (saved in localStorage)
```js
{ id, applicationId, kind: 'interview', date: '2026-11-19', time: '14:00', title: 'First Round', durationMin: null, googleEventId: null }
// kind: 'deadline' | 'interview' | 'assessment' | 'takehome' | 'offer'
```

### Already done: `toGoogleEvent(event, application)`
Turns our event into the request body Google expects (`summary`, `description`, `start`, `end`, time zone):
- no time → all-day event
- interview / assessment → starts at the time, lasts `durationMin` (default 60 min)
- deadline / take-home / offer → 30-minute block **ending** at the due time

## What our app expects from the setup
However you set up the Google Cloud project, the app needs:
- The **Client ID** in a file called **`.env.local`** at the project root:
  `VITE_GOOGLE_CLIENT_ID=...`. It's already ignored by git, and you need to **restart `npm run dev`** after adding it.
- `http://localhost:5173` as an authorized JavaScript origin (that's Vite's dev URL), plus the deployed URL later.
- The scope `https://www.googleapis.com/auth/calendar.events` (already set as `SCOPE` in `googleCalendar.js`).

## The two TODOs in `googleCalendar.js`

**TODO 1, `signIn()`:** get an access token however you like and store it in the `accessToken` variable.
`createCalendarEvent()` calls `await signIn()` when there's no token yet, so `signIn()` should return a Promise
that resolves once the user has signed in.

**TODO 2, `createCalendarEvent()`:** create the event in Google Calendar and **return its id** (a string).
`toGoogleEvent(event, application)` already gives you the request body. If it fails, throw an error and App shows
a "Couldn't add" message.
