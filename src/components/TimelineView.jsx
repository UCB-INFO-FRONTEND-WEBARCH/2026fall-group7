import EventCard from './EventCard'
import { timelineGroups } from '../data/mockData'

export default function TimelineView({ applications, events }) {
  return (
    <div className="timeline-view">
      {timelineGroups.map(group => (
        <section className="timeline-group" key={group.id} aria-labelledby={`heading-${group.id}`}>
          <h2 className="week-label" id={`heading-${group.id}`}>{group.label}</h2>
          <ul className="event-list">
            {events.filter(event => event.group === group.id).map(event => (
              <li key={event.id}><EventCard event={event} application={applications.find(application => application.id === event.applicationId)} /></li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  )
}
