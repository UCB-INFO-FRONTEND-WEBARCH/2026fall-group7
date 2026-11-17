// ============================================================================
// Google Calendar integration: HANDOFF FILE
// ----------------------------------------------------------------------------
// The app side is already wired up:
//   • "Add to Google Calendar" (detail page → Key dates) calls addEventToGoogle() in App.jsx
//   • "Sync to Google Calendar" (header) calls syncAllToGoogle() in App.jsx
//   • Both call createCalendarEvent() below, then App saves the returned id
//     on the event as `googleEventId` (so a date is never added twice).
//
// What's left: fill in signIn() and createCalendarEvent().
// What the app expects: see docs/google-calendar.md
// ============================================================================

// Put your OAuth Client ID in a file called .env.local (already ignored by git):
//   VITE_GOOGLE_CLIENT_ID=1234-abc.apps.googleusercontent.com
// Vite only exposes variables that start with VITE_.
const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID
const SCOPE = 'https://www.googleapis.com/auth/calendar.events'

// True once a Client ID is set. Until then the buttons show a friendly
// "not connected yet" message instead of erroring.
export function isGoogleCalendarConfigured() {
  return Boolean(CLIENT_ID)
}

// ---------------------------------------------------------------------------
// TODO 1: sign in and get an access token.
// Store it in `accessToken` and resolve once the user is signed in
// (createCalendarEvent awaits this). Reuse the token until it expires.
// ---------------------------------------------------------------------------
let accessToken = null

export async function signIn() {
  // TODO: sign the user in, then set accessToken.
  void SCOPE
  throw new Error('Google sign-in is not implemented yet')
}

// ---------------------------------------------------------------------------
// TODO 2: create the event in Google Calendar and RETURN ITS ID (a string).
// The request body is ready: toGoogleEvent(event, application), below.
// Throw an error if it fails; App catches it and shows "Couldn't add".
// ---------------------------------------------------------------------------
export async function createCalendarEvent(event, application) {
  if (!accessToken) await signIn()
  // TODO: send toGoogleEvent(event, application) to the Calendar API, return the new event's id
  void toGoogleEvent(event, application)
  throw new Error('createCalendarEvent is not implemented yet')
}

// ---------------------------------------------------------------------------
// DONE: turns one of our events into the body Google Calendar expects.
// Our event:  { kind, date: '2026-11-19', time: '14:00', title, durationMin }
// Rules:
//   • no time                     -> all-day event
//   • interview / assessment      -> starts at the time, lasts durationMin (default 60 min)
//   • deadline / take-home / offer -> a 30-minute block ENDING at the due time
// ---------------------------------------------------------------------------
const KIND_LABELS = { deadline: 'Application deadline', interview: 'Interview', assessment: 'Online assessment', takehome: 'Take-home due', offer: 'Offer decision' }
const DUE_KINDS = ['deadline', 'takehome', 'offer']

const pad = n => String(n).padStart(2, '0')
const localDateTime = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}:00`

export function toGoogleEvent(event, application, timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone) {
  const label = event.kind === 'interview' && event.title ? `Interview (${event.title})` : KIND_LABELS[event.kind] || 'Event'
  const base = {
    summary: `${label} · ${application.company}`,
    description: [application.role, application.link, 'Added from Application Tracker'].filter(Boolean).join('\n'),
  }

  if (!event.time) {
    const [y, m, d] = event.date.split('-').map(Number)
    const nextDay = new Date(y, m - 1, d + 1)
    return { ...base, start: { date: event.date }, end: { date: localDateTime(nextDay).slice(0, 10) } }
  }

  const at = new Date(`${event.date}T${event.time}:00`)
  const isDue = DUE_KINDS.includes(event.kind)
  const minutes = isDue ? 30 : event.durationMin || 60
  const start = isDue ? new Date(at.getTime() - minutes * 60000) : at
  const end = isDue ? at : new Date(at.getTime() + minutes * 60000)
  return { ...base, start: { dateTime: localDateTime(start), timeZone }, end: { dateTime: localDateTime(end), timeZone } }
}
