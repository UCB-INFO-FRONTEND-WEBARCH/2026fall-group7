// Building new records from the Add / Edit form.
// Pure functions: they return new objects/arrays and never change the old ones.

import { makeId } from './ids'

// Form fields -> { application, events } for a brand-new application.
// `fields` = { link, company, role, deadline: 'YYYY-MM-DD' or '', description, materials: ['Resume', ...] }
export function createApplication(fields) {
  const application = {
    id: makeId('app'),
    company: fields.company.trim(),
    role: fields.role.trim(),
    status: 'Submitted',
    link: fields.link.trim(),
    description: fields.description.trim(),
    notes: '',
    checklist: fields.materials.map(label => ({ id: makeId('mat'), label, done: false })),
    createdAt: new Date().toISOString(),
  }
  const events = fields.deadline ? [newDeadline(application.id, fields.deadline)] : []
  return { application, events }
}

const newDeadline = (applicationId, date) => ({
  id: makeId('evt'), applicationId, kind: 'deadline', date, time: '23:59', title: '', durationMin: null, googleEventId: null,
})

// The application's (first) deadline date, for pre-filling the Edit form.
export function findDeadline(events, applicationId) {
  return events.find(e => e.applicationId === applicationId && e.kind === 'deadline') || null
}

// Edit form changed the deadline: update it, add it, or remove it.
export function setDeadline(events, applicationId, date) {
  const existing = findDeadline(events, applicationId)
  if (!existing) return date ? [...events, newDeadline(applicationId, date)] : events
  if (!date) return events.filter(e => e.id !== existing.id)
  if (date === existing.date) return events
  // Date changed: keep the time; clear googleEventId since the Google copy is now out of date.
  return events.map(e => (e.id === existing.id ? { ...e, date, googleEventId: null } : e))
}
