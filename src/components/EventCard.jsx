import Icon from './Icon'
import { eventIcons, statusTones } from '../data/mockData'

export default function EventCard({ event, application }) {
  const day = Number(event.date.slice(-2))
  const tone = statusTones[application.status] || 'submitted'

  // This card is shared by the weekly timeline and the calendar's selected day.
  return (
    <article className={`event-card ${event.urgent ? 'event-card-urgent' : ''} tone-${tone}`}>
      <time className="event-date" dateTime={event.date}><span>Nov</span><strong>{day}</strong></time>
      <div className="event-details">
        <div className="event-topline">
          <h3>{application.company}</h3>
          <span className={`status-badge status-${tone}`}><span className="status-dot" />{application.status}</span>
        </div>
        <p className="event-role">{application.role}</p>
        {event.detail && <p className={`event-meta ${event.urgent ? 'is-urgent' : ''}`}><Icon name={eventIcons[event.kind]} size={13} />{event.detail}</p>}
      </div>
    </article>
  )
}
