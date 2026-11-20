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
// Sign in with Google Identity Services (token model, browser only).
// The GIS script is loaded in index.html and creates `window.google`.
// We get an access token (valid ~1 hour) and keep it in memory; when it is
// about to expire, the next request signs in again (usually a quick popup
// that closes by itself, because the user already agreed).
// ---------------------------------------------------------------------------
let accessToken = null
let tokenExpiresAt = 0      // ms timestamp
let tokenClient = null
let pendingSignIn = null    // shared Promise, so two clicks never open two popups

// Thrown when the user can't or won't sign in. App stops a "Sync all" loop on
// this error instead of opening one popup per date.
export class GoogleSignInError extends Error {
  constructor(message) {
    super(message)
    this.name = 'GoogleSignInError'
  }
}

const EXPIRY_MARGIN_MS = 60 * 1000 // renew one minute early

function hasValidToken() {
  return Boolean(accessToken) && Date.now() < tokenExpiresAt - EXPIRY_MARGIN_MS
}

export function signIn() {
  if (pendingSignIn) return pendingSignIn

  pendingSignIn = new Promise((resolve, reject) => {
    const oauth2 = window.google?.accounts?.oauth2
    if (!oauth2) {
      reject(new GoogleSignInError('Google sign-in script has not loaded yet'))
      return
    }

    tokenClient ??= oauth2.initTokenClient({ client_id: CLIENT_ID, scope: SCOPE, callback: () => {} })

    // Google finished: either a token or an error such as "access_denied".
    tokenClient.callback = response => {
      if (response.error) {
        reject(new GoogleSignInError(`Google sign-in failed: ${response.error}`))
        return
      }
      if (!oauth2.hasGrantedAllScopes(response, SCOPE)) {
        reject(new GoogleSignInError('Calendar permission was not granted'))
        return
      }
      accessToken = response.access_token
      tokenExpiresAt = Date.now() + Number(response.expires_in) * 1000
      resolve()
    }
    // The popup was closed or blocked. Without this the Promise would never settle.
    tokenClient.error_callback = error => {
      reject(new GoogleSignInError(`Google sign-in was cancelled: ${error.type}`))
    }

    tokenClient.requestAccessToken()
  }).finally(() => {
    pendingSignIn = null
  })

  return pendingSignIn
}

// ---------------------------------------------------------------------------
// Create the event in the user's main Google Calendar and return its id.
// Any error is thrown; App catches it and shows "Couldn't add".
// ---------------------------------------------------------------------------
const EVENTS_URL = 'https://www.googleapis.com/calendar/v3/calendars/primary/events'

export async function createCalendarEvent(event, application) {
  if (!application) throw new Error('This date is not linked to an application')
  if (!hasValidToken()) await signIn()

  const response = await fetch(EVENTS_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(toGoogleEvent(event, application)),
  })

  if (response.status === 401) {
    // Token expired or was revoked: forget it so the next click signs in again.
    accessToken = null
    tokenExpiresAt = 0
    throw new GoogleSignInError('Google session expired')
  }
  if (!response.ok) {
    const details = await response.text()
    throw new Error(`Google Calendar API error ${response.status}: ${details}`)
  }

  const created = await response.json()
  return created.id
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
