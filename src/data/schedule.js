// Everything the screens show that is CALCULATED from the saved data:
// timeline weeks, "Next 7 days", deadline labels, materials counts.
// None of this is saved; it's worked out fresh from applications + events.

import { DEADLINE_KINDS, EVENT_KINDS } from './constants'
import {
  addDays, daysBetween, formatShortDate, formatTime, formatWeekdayDate, parseDateKey, relativeDays, startOfWeek,
} from './dates'

const URGENT_WITHIN_DAYS = 3 // deadlines this close turn red

const sortKey = event => `${event.date}T${event.time || '23:59'}`
export const sortEvents = events => [...events].sort((a, b) => sortKey(a).localeCompare(sortKey(b)))

// Attach each event's application so cards can show company, role and status.
export function withApplications(events, applications) {
  return events
    .map(event => ({ ...event, application: applications.find(app => app.id === event.applicationId) }))
    .filter(event => event.application)
}

// Is this a deadline that's coming up very soon?
export function isUrgent(event, today) {
  const days = daysBetween(today, event.date)
  return event.kind === 'deadline' && days >= 0 && days <= URGENT_WITHIN_DAYS
}

// The small line under the role on a timeline card, e.g. "Deadline · in 2 days" or "Interview · 2:00 PM".
export function describeEvent(event, today) {
  const label = EVENT_KINDS[event.kind] || 'Event'
  if (isUrgent(event, today)) return `${label} · ${relativeDays(daysBetween(today, event.date))}`
  return event.time ? `${label} · ${formatTime(event.time)}` : label
}

// "Nov 8 – 14", or "Nov 29 – Dec 5" when the week crosses months.
function weekRange(weekStart) {
  const weekEnd = addDays(weekStart, 6)
  const start = formatShortDate(weekStart)
  const sameMonth = parseDateKey(weekStart).getMonth() === parseDateKey(weekEnd).getMonth()
  return `${start} – ${sameMonth ? parseDateKey(weekEnd).getDate() : formatShortDate(weekEnd)}`
}

// Timeline: events from the start of this week onward, grouped into weeks.
export function groupEventsByWeek(applications, events, today) {
  const thisWeek = startOfWeek(today)
  const nextWeek = addDays(thisWeek, 7)
  const upcoming = sortEvents(withApplications(events, applications)).filter(event => event.date >= thisWeek)

  const groups = []
  for (const event of upcoming) {
    const weekStart = startOfWeek(event.date)
    let group = groups.find(g => g.id === weekStart)
    if (!group) {
      const prefix = weekStart === thisWeek ? 'This week · ' : weekStart === nextWeek ? 'Next week · ' : ''
      group = { id: weekStart, label: prefix + weekRange(weekStart), events: [] }
      groups.push(group)
    }
    group.events.push(event)
  }
  return groups
}

export function materialsProgress(application) {
  const done = application.checklist.filter(item => item.done).length
  return { done, total: application.checklist.length }
}

// "Cover letter & portfolio missing" / "3 materials missing"
function missingMaterialsTitle(missing) {
  if (missing.length > 2) return `${missing.length} materials missing`
  const [first, second] = missing.map(item => item.label)
  return second ? `${first} & ${second.toLowerCase()} missing` : `${first} missing`
}

// "Next 7 days" panel: events from today through a week from today,
// plus a reminder when an application due soon still has unchecked materials.
export function getUpcomingItems(applications, events, today, days = 7) {
  const lastDay = addDays(today, days)
  const soon = sortEvents(withApplications(events, applications)).filter(e => e.date >= today && e.date <= lastDay)
  const items = []

  for (const event of soon) {
    const { company } = event.application
    const when = `${formatWeekdayDate(event.date)}${event.time ? ` · ${formatTime(event.time)}` : ''}`
    const base = { id: event.id, applicationId: event.applicationId, kind: event.kind }

    if (event.kind === 'deadline') {
      items.push({ ...base, title: `Submit application · ${company}`, detail: `Due ${formatWeekdayDate(event.date)} · ${relativeDays(daysBetween(today, event.date))}`, action: 'Open', urgent: true })
      const missing = event.application.checklist.filter(item => !item.done)
      if (missing.length) {
        const { total } = materialsProgress(event.application)
        items.push({ ...base, id: `${event.id}-materials`, kind: 'materials', title: `${missingMaterialsTitle(missing)} · ${company}`, detail: `${missing.length} of ${total} materials left · due ${formatShortDate(event.date)}`, action: 'Upload' })
      }
    } else if (event.kind === 'interview') {
      items.push({ ...base, title: `${event.title || 'Interview'} · ${company}`, detail: when, action: 'Prep' })
    } else {
      const duration = event.durationMin ? ` · ${event.durationMin} min` : ''
      const action = event.kind === 'offer' ? 'Open' : 'Start'
      items.push({ ...base, title: `${EVENT_KINDS[event.kind]} · ${company}`, detail: when + duration, action })
    }
  }
  return items
}

// The deadline pill on list rows and board cards: "Due Nov 8" (red if soon), "Decide by Nov 21", "No deadline".
export function deadlinePill(application, events, today) {
  const deadline = getNextDeadline(application, events, today)
  if (!deadline) return { label: 'No deadline', urgent: false, date: null }
  const prefix = deadline.kind === 'offer' ? 'Decide by' : 'Due'
  return { label: `${prefix} ${formatShortDate(deadline.date)}`, urgent: isUrgent(deadline, today), date: deadline.date }
}

// The next upcoming deadline (or offer decision) for one application, or null.
export function getNextDeadline(application, events, today) {
  const candidates = events.filter(
    e => e.applicationId === application.id && DEADLINE_KINDS.includes(e.kind) && e.date >= today,
  )
  return sortEvents(candidates)[0] || null
}
