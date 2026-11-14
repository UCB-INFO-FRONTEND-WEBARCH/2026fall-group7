import Icon from './Icon'
import { eventIcons, statusTones } from '../data/constants'
import { formatMonthShort } from '../data/dates'
import { describeEvent, isUrgent } from '../data/schedule'

// The colored line on the left follows the type of date (matches the mockup):
// urgent deadline = orange, interview = yellow, assessment = purple, other deadlines = gray.
function accentFor(event, urgent) {
  if (urgent) return ''
  if (event.kind === 'interview') return 'accent-interview'
  if (event.kind === 'assessment') return 'accent-assessment'
  return 'accent-muted'
}

export default function EventCard({ event, today, onOpen }) {
  const { application } = event
  const tone = statusTones[application.status] || 'submitted'
  const urgent = isUrgent(event, today)

  // Shared by the weekly timeline and the calendar's selected day. Clicking opens the application.
  return (
    <button type="button" onClick={() => onOpen(event.applicationId)} className={`event-card ${urgent ? 'event-card-urgent' : ''} ${accentFor(event, urgent)}`}>
      <time className="event-date" dateTime={event.date}><span>{formatMonthShort(event.date)}</span><strong>{Number(event.date.slice(-2))}</strong></time>
      <div className="event-details">
        <div className="event-topline">
          <h3>{application.company}</h3>
          <span className={`status-badge status-${tone}`}><span className="status-dot" />{application.status}</span>
        </div>
        <p className="event-role">{application.role}</p>
        <p className={`event-meta ${urgent ? 'is-urgent' : ''}`}><Icon name={eventIcons[event.kind]} size={13} />{describeEvent(event, today)}</p>
      </div>
    </button>
  )
}
