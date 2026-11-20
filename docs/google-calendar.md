# Google Calendar integration

Users can add their application dates to their own Google Calendar. All the Google code is in **one file: `src/services/googleCalendar.js`**.
It runs only in the browser (no server, no client secret), using Google Identity Services for sign-in and `fetch` for the Calendar API.

## How it's wired

| Button | Where | Calls (in `App.jsx`) |
| --- | --- | --- |
| **Add to Google Calendar** | Detail page → Key dates, under each date | `addEventToGoogle(event)` |
| **Sync to Google Calendar** | Header (and "Sync" on mobile) | `syncAllToGoogle()`: every upcoming date without a `googleEventId` |

Both call `createCalendarEvent(event, application)` from `googleCalendar.js`. When it returns an id, App saves it on the event as
`googleEventId`. The button then changes to "✓ In Google Calendar", and Sync skips it next time (no duplicates).
Errors are caught and shown as a toast, so a failed request won't crash the app.

Until a Client ID is set, both buttons show "Google Calendar isn't connected yet."

### What an event looks like (saved in localStorage)
```js
{ id, applicationId, kind: 'interview', date: '2026-11-19', time: '14:00', title: 'First Round', durationMin: null, googleEventId: null }
// kind: 'deadline' | 'interview' | 'assessment' | 'takehome' | 'offer'
```

## What `googleCalendar.js` does

### `signIn()`: get an access token
- The Google Identity Services script is loaded in `index.html` when the page loads. Loading it early means the sign-in popup opens
  straight from the button click, so the browser doesn't block it.
- `signIn()` asks Google for an access token with the scope `https://www.googleapis.com/auth/calendar.events` (create/edit events only,
  not read the whole calendar). It returns a Promise that resolves once the user has signed in.
- The token and its expiry time are kept **in memory only**. A token lasts about 1 hour; `createCalendarEvent()` signs in again when it has
  less than a minute left. A page refresh also forgets it. Signing in again is usually a quick popup that closes by itself.
- If the user closes the popup, denies access, or doesn't tick the calendar permission, it throws a `GoogleSignInError`.
- Two clicks at once share the same sign-in, so only one popup opens.

### `createCalendarEvent(event, application)`: add one event
1. Signs in first if there is no valid token.
2. Sends `POST https://www.googleapis.com/calendar/v3/calendars/primary/events` with the body from `toGoogleEvent()`.
3. Returns the new Google event's `id`, which App saves as `googleEventId`.

Errors:
- **401** (token expired or revoked): forgets the token and throws a `GoogleSignInError`. The next click signs in again.
- **Any other failure**: throws an error with Google's response text, printed in the browser console.

`syncAllToGoogle()` in App stops at the first `GoogleSignInError`, so closing the popup during Sync doesn't open one popup per date.
Dates added before that keep their `googleEventId`.

### `toGoogleEvent(event, application)`: our event → Google's format
Builds the request body (`summary`, `description`, `start`, `end`, time zone):
- no time → all-day event
- interview / assessment → starts at the time, lasts `durationMin` (default 60 min)
- deadline / take-home / offer → 30-minute block **ending** at the due time

## Google Cloud setup

The project in Google Cloud Console needs:
- The **Google Calendar API** enabled.
- An **OAuth consent screen** (External, in **Testing** mode) with every Google account that should use the feature listed under **Test users** (up to 100).
- An **OAuth client ID** of type *Web application*, with these **Authorized JavaScript origins**:
  - `http://localhost:5173` (Vite's dev URL)
  - the deployed URL, once we deploy. Otherwise sign-in fails with `origin_mismatch`.

The Client ID goes in **`.env.local`** at the project root (ignored by git). Restart `npm run dev` after adding it:

```text
VITE_GOOGLE_CLIENT_ID=1234-abc.apps.googleusercontent.com
```

For the deployed site, set the same variable in the hosting service's environment variables. Vite puts it into the build.
A Client ID isn't a secret (it's visible in the browser anyway), but keeping it out of git makes it easy to swap.

## Who can use it

Because the app is in **Testing** mode, only accounts on the Test users list can sign in. Anyone else can use the rest of the app,
but Google rejects their sign-in (`access_denied`) and the app shows "Couldn't add to Google Calendar."
Before the demo, add the TAs', instructor's and demo accounts as Test users.

We're not publishing the app. `calendar.events` is a sensitive scope: publishing without Google's review shows an
"unverified app" warning, and the review needs a privacy policy and can take weeks.

## Troubleshooting

| What you see | Cause |
| --- | --- |
| "Google Calendar isn't connected yet." | No `VITE_GOOGLE_CLIENT_ID`, or `npm run dev` wasn't restarted after adding it. |
| Google shows `Error 403: access_denied` | This account isn't a Test user. |
| Google shows `origin_mismatch` | The current URL (e.g. a different port or the deployed site) isn't an authorized JavaScript origin. |
| Console: "Google sign-in script has not loaded yet" | The GIS script in `index.html` didn't load (offline, or blocked by an extension). |
| Console: "Google Calendar API error 403 …" | The Calendar API isn't enabled in the Google Cloud project. |
