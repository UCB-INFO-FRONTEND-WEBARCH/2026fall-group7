import Icon from './Icon'
import EventCard from './EventCard'

// Build a Sunday-first month without a calendar library. The sample month is
// fixed so it keeps matching the design when the real current date changes.
function createMonthCells(year, month) {
  const firstWeekday = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const cellCount = Math.ceil((firstWeekday + daysInMonth) / 7) * 7
  return Array.from({ length: cellCount }, (_, index) => {
    const date = new Date(year, month, index - firstWeekday + 1)
    return {
      day: date.getDate(),
      inMonth: date.getMonth() === month,
      date: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`,
    }
  })
}

export default function CalendarView({ applications, events }) {
  const selectedDate = '2026-11-12'
  const selectedEvents = events.filter(event => event.date === selectedDate)
  const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

  return (
    <div className="calendar-layout">
      <section className="surface month-card" aria-label="November 2026 calendar">
        <div className="month-heading">
          <h2>November 2026</h2>
          <div className="month-arrows">
            <button className="icon-button" type="button" aria-label="Previous month" aria-disabled="true"><Icon name="left" /></button>
            <button className="icon-button" type="button" aria-label="Next month" aria-disabled="true"><Icon name="right" /></button>
          </div>
        </div>
        <div className="calendar-weekdays">{weekdays.map(day => <abbr key={day} title={day}>{day[0]}</abbr>)}</div>
        <div className="calendar-days">
          {createMonthCells(2026, 10).map(cell => {
            const dayEvents = events.filter(event => event.date === cell.date)
            // Colored dots summarize the same event data used by the timeline.
            const hasDeadline = dayEvents.some(event => ['deadline', 'offer'].includes(event.kind))
            const hasMeeting = dayEvents.some(event => ['interview', 'assessment'].includes(event.kind))
            return (
              <div className={`calendar-cell ${!cell.inMonth ? 'outside-month' : ''}`} key={cell.date}>
                <button type="button" className={`calendar-day ${cell.date === selectedDate ? 'is-selected' : ''} ${cell.date === '2026-11-06' ? 'is-today' : ''}`} aria-label={`${cell.date}, ${dayEvents.length} events`} aria-pressed={cell.date === selectedDate} aria-disabled="true">
                  {cell.day}
                </button>
                <span className="calendar-dots" aria-hidden="true">{hasDeadline && <i className="dot-deadline" />}{hasMeeting && <i className="dot-meeting" />}</span>
              </div>
            )
          })}
        </div>
        <div className="calendar-legend"><span><i className="dot-deadline" />Deadline</span><span><i className="dot-meeting" />Interview / assessment</span></div>
      </section>

      <section className="surface selected-day-card" aria-labelledby="selected-day-title">
        <div className="selected-day-heading"><h2 id="selected-day-title">Thu, Nov 12</h2><span>{selectedEvents.length} event</span></div>
        <ul className="event-list">
          {selectedEvents.map(event => <li key={event.id}><EventCard event={event} application={applications.find(application => application.id === event.applicationId)} /></li>)}
        </ul>
        <p className="selected-day-hint">Select another day to see its events.</p>
      </section>
    </div>
  )
}
