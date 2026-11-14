// Fixed lists and visual mappings shared across the app.

// The status stepper on the detail page uses this order.
export const STATUSES = ['Submitted', 'Under Review', 'First Round', 'Second Round', 'Third Round', 'Offer', 'Denied']

// Badge colors for each status (matches the classes in App.css).
export const statusTones = {
  Submitted: 'submitted',
  'Under Review': 'review',
  'First Round': 'interview',
  'Second Round': 'interview',
  'Third Round': 'interview',
  Offer: 'offer',
  Denied: 'denied',
}

// The kinds of key dates an application can have, with their display names.
export const EVENT_KINDS = {
  deadline: 'Deadline',
  interview: 'Interview',
  assessment: 'Online assessment',
  takehome: 'Take-home due',
  offer: 'Offer decision',
}

// Deadline-style dates show a red dot on the calendar; the rest show yellow.
export const DEADLINE_KINDS = ['deadline', 'takehome', 'offer']

export const eventIcons = {
  deadline: 'calendar',
  interview: 'clock',
  assessment: 'code',
  takehome: 'calendar',
  offer: 'calendar',
  materials: 'file',
}

// Every new application starts with these (from the Add modal design).
export const DEFAULT_MATERIALS = ['Resume', 'Cover letter', 'Recommendation letter', 'Portfolio', 'Work samples']
