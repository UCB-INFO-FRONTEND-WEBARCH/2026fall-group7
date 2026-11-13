// Fixed November 2026 examples reproduce the teammate's mockups.
// Keep records separate from JSX so real API/state data can replace them later.
export const applications = [
  { id: 'stripe', company: 'Stripe', role: 'Software Engineer Intern', status: 'Submitted' },
  { id: 'figma', company: 'Figma', role: 'Product Design Intern', status: 'Submitted' },
  { id: 'airbnb', company: 'Airbnb', role: 'UX Research Intern', status: 'Second Round' },
  { id: 'linear', company: 'Linear', role: 'Software Engineer, New Grad', status: 'Under Review' },
  { id: 'notion', company: 'Notion', role: 'Frontend Engineer Intern', status: 'First Round' },
  { id: 'duolingo', company: 'Duolingo', role: 'Product Manager Intern', status: 'Third Round' },
  { id: 'ramp', company: 'Ramp', role: 'Software Engineer Intern', status: 'Submitted' },
  { id: 'spotify', company: 'Spotify', role: 'Data Science Intern', status: 'Under Review' },
  { id: 'datadog', company: 'Datadog', role: 'Backend Engineer Intern', status: 'Offer' },
]

// One application may have several events (Spotify is an example).
// applicationId links an event to its company, role, and current status.
export const scheduleEvents = [
  { id: 'stripe-deadline', applicationId: 'stripe', date: '2026-11-08', kind: 'deadline', detail: 'Deadline · in 2 days', urgent: true, group: 'this-week' },
  { id: 'figma-deadline', applicationId: 'figma', date: '2026-11-09', kind: 'deadline', detail: 'Deadline · in 3 days', urgent: true, group: 'this-week' },
  { id: 'airbnb-interview', applicationId: 'airbnb', date: '2026-11-10', kind: 'interview', detail: 'Interview · 2:00 PM', group: 'next-week' },
  { id: 'linear-assessment', applicationId: 'linear', date: '2026-11-11', kind: 'assessment', detail: 'Online assessment · 9:00 AM', group: 'next-week' },
  { id: 'notion-interview', applicationId: 'notion', date: '2026-11-12', kind: 'interview', detail: 'Interview · 10:00 AM', group: 'next-week' },
  { id: 'duolingo-interview', applicationId: 'duolingo', date: '2026-11-13', kind: 'interview', detail: 'Interview · 1:30 PM', group: 'next-week' },
  { id: 'ramp-deadline', applicationId: 'ramp', date: '2026-11-14', kind: 'deadline', detail: 'Deadline · 11:59 PM', group: 'next-week' },
  { id: 'spotify-review', applicationId: 'spotify', date: '2026-11-17', kind: 'assessment', detail: '', group: 'later' },
  { id: 'spotify-takehome', applicationId: 'spotify', date: '2026-11-20', kind: 'assessment', detail: 'Take-home due · 5:00 PM', group: 'later' },
  { id: 'datadog-offer', applicationId: 'datadog', date: '2026-11-21', kind: 'offer', detail: 'Offer decision · 5:00 PM', group: 'later' },
]

export const timelineGroups = [
  { id: 'this-week', label: 'This week · Nov 3 – 9' },
  { id: 'next-week', label: 'Next week · Nov 10 – 16' },
  { id: 'later', label: 'Nov 17 – 23' },
]

// Reminder copy and action labels are display examples, not connected services.
export const upcomingItems = [
  { id: 'finish-stripe', kind: 'deadline', title: 'Finish application · Stripe', detail: 'Due Sun, Nov 8 · in 2 days', action: 'Open' },
  { id: 'stripe-materials', kind: 'materials', title: 'Cover letter & portfolio missing · Stripe', detail: '2 of 5 materials left · due Nov 8', action: 'Upload' },
  { id: 'submit-figma', kind: 'deadline', title: 'Submit application · Figma', detail: 'Due Mon, Nov 9 · in 3 days', action: 'Open' },
  { id: 'prepare-airbnb', kind: 'interview', title: 'Second round · Airbnb', detail: 'Tue, Nov 10 · 2:00 PM', action: 'Prep' },
  { id: 'start-linear', kind: 'assessment', title: 'Online assessment · Linear', detail: 'Wed, Nov 11 · 9:00 AM · 90 min', action: 'Start' },
  { id: 'prepare-notion', kind: 'interview', title: 'First round · Notion', detail: 'Thu, Nov 12 · 10:00 AM', action: 'Prep' },
  { id: 'prepare-duolingo', kind: 'interview', title: 'Third round · Duolingo', detail: 'Fri, Nov 13 · 1:30 PM', action: 'Prep' },
]

// Visual mappings live in one place so timeline and calendar cards agree.
export const statusTones = {
  Submitted: 'submitted',
  'Under Review': 'review',
  'First Round': 'interview',
  'Second Round': 'interview',
  'Third Round': 'interview',
  Offer: 'offer',
}

export const eventIcons = {
  deadline: 'calendar',
  interview: 'clock',
  assessment: 'code',
  materials: 'file',
  offer: 'file',
}
