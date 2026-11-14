import EventCard from './EventCard'
import { groupEventsByWeek } from '../data/schedule'

export default function TimelineView({ applications, events, today, onOpen }) {
  // Week groups are calculated from the real dates every render.
  const groups = groupEventsByWeek(applications, events, today)

  if (groups.length === 0) {
    return (
      <div className="surface schedule-empty">
        <p>Nothing coming up</p>
        <span>Add a deadline or interview to an application and it will show here.</span>
      </div>
    )
  }

  return (
    <div className="timeline-view">
      {groups.map(group => (
        <section className="timeline-group" key={group.id} aria-labelledby={`heading-${group.id}`}>
          <h2 className="week-label" id={`heading-${group.id}`}>{group.label}</h2>
          <ul className="event-list">
            {group.events.map(event => (
              <li key={event.id}><EventCard event={event} today={today} onOpen={onOpen} /></li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  )
}
