// Sample records based on the Figma mockups. Dates are set relative to today
// so the timeline and "Next 7 days" always have something to show.
// This only runs when nothing is saved in localStorage yet.

import { addDays, todayKey } from './dates'

// Build a checklist where the first `doneCount` items are checked off.
const checklist = (appId, labels, doneCount) =>
  labels.map((label, i) => ({ id: `${appId}-m${i}`, label, done: i < doneCount }))

export function createSampleData() {
  const today = todayKey()
  const day = offset => addDays(today, offset)

  const app = (id, company, role, status, materials, done, extra = {}) => ({
    id, company, role, status,
    link: '', description: '', notes: '',
    checklist: checklist(id, materials, done),
    createdAt: appliedOn(id),
    ...extra,
  })

  // How many days ago each sample was added ("Applied Oct 28" on phone cards).
  const appliedDaysAgo = { stripe: 9, figma: 7, ramp: 3, spotify: 16, datadog: 37, airbnb: 31, linear: 13, notion: 23, duolingo: 42, canva: 49 }
  const appliedOn = id => new Date(`${day(-appliedDaysAgo[id])}T12:00:00`).toISOString()

  const applications = [
    app('stripe', 'Stripe', 'Software Engineer Intern', 'Submitted', ['Resume', 'Transcript', 'Work samples', 'Cover letter', 'Portfolio'], 3),
    app('figma', 'Figma', 'Product Design Intern', 'Submitted', ['Resume', 'Portfolio', 'Cover letter', 'Work samples', 'Recommendation letter'], 4),
    app('ramp', 'Ramp', 'Software Engineer Intern', 'Submitted', ['Resume', 'Cover letter', 'Transcript', 'Work samples'], 1),
    app('spotify', 'Spotify', 'Data Science Intern', 'Under Review', ['Resume', 'Transcript', 'Cover letter', 'Work samples'], 2),
    app('datadog', 'Datadog', 'Backend Engineer Intern', 'Offer', ['Resume', 'Cover letter', 'Transcript', 'Work samples', 'Recommendation letter'], 5),
    app('airbnb', 'Airbnb', 'UX Research Intern', 'Second Round', ['Resume', 'Cover letter', 'Portfolio', 'Transcript', 'Work samples'], 5),
    app('linear', 'Linear', 'Software Engineer, New Grad', 'Under Review', ['Resume', 'Cover letter', 'Transcript', 'Work samples'], 4),
    app('notion', 'Notion', 'Frontend Engineer Intern', 'First Round', ['Resume', 'Cover letter', 'Transcript', 'Portfolio', 'Recommendation letter'], 4, {
      link: 'https://jobs.lever.co/notion/8f2c1a7e',
      description: 'About the role\nBuild delightful product surfaces in React and TypeScript, partnering closely with design on the Notion editor.',
      notes: 'Recruiter: Maya Chen. First round is a 45-min technical with a frontend engineer — review React performance, accessibility, and the editor architecture blog post.',
    }),
    app('duolingo', 'Duolingo', 'Product Manager Intern', 'Third Round', ['Resume', 'Cover letter', 'Work samples'], 3),
    app('canva', 'Canva', 'Design Engineer Intern', 'Denied', ['Resume', 'Cover letter', 'Portfolio', 'Work samples'], 4),
  ]

  // Each event points to its application with applicationId.
  // One application can have several events (see Notion and Spotify).
  const event = (id, applicationId, kind, date, time, extra = {}) => ({
    id, applicationId, kind, date, time, title: '', durationMin: null, googleEventId: null, ...extra,
  })

  const events = [
    event('stripe-deadline', 'stripe', 'deadline', day(2), '23:59'),
    event('figma-deadline', 'figma', 'deadline', day(3), '23:59'),
    event('airbnb-interview', 'airbnb', 'interview', day(4), '14:00', { title: 'Second round' }),
    event('linear-assessment', 'linear', 'assessment', day(5), '09:00', { durationMin: 90 }),
    event('notion-deadline', 'notion', 'deadline', day(-27), '23:59'),
    event('notion-assessment', 'notion', 'assessment', day(-10), '09:00'),
    event('notion-interview', 'notion', 'interview', day(6), '10:00', { title: 'First round' }),
    event('duolingo-interview', 'duolingo', 'interview', day(7), '13:30', { title: 'Third round' }),
    event('ramp-deadline', 'ramp', 'deadline', day(8), '23:59'),
    event('spotify-assessment', 'spotify', 'assessment', day(11), '10:00'),
    event('spotify-takehome', 'spotify', 'takehome', day(14), '17:00'),
    event('datadog-offer', 'datadog', 'offer', day(15), '17:00'),
  ]

  return { applications, events }
}
