import { useState } from 'react'
import Icon from './Icon'
import EventCard from './EventCard'
import { DEADLINE_KINDS } from '../data/constants'
import { formatLongDate, formatMonthYear, formatWeekdayDate, toDateKey } from '../data/dates'
import { sortEvents, withApplications } from '../data/schedule'

// Build a Sunday-first month grid without a calendar library.
function createMonthCells(year, month) {
  const firstWeekday = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const cellCount = Math.ceil((firstWeekday + daysInMonth) / 7) * 7
  return Array.from({ length: cellCount }, (_, index) => {
    const date = new Date(year, month, index - firstWeekday + 1)
    return { day: date.getDate(), inMonth: date.getMonth() === month, date: toDateKey(date) }
  })
}

const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

export default function CalendarView({ applications, events, today, onOpen }) {
  // Which month is showing and which day is picked. UI-only state, not saved.
  const [selectedDate, setSelectedDate] = useState(today)
  const [shownMonth, setShownMonth] = useState(() => {
    const [y, m] = today.split('-').map(Number)
    return { year: y, month: m - 1 }
  })

  function changeMonth(step) {
    setShownMonth(({ year, month }) => {
      const next = new Date(year, month + step, 1)
      return { year: next.getFullYear(), month: next.getMonth() }
    })
  }

  const allEvents = sortEvents(withApplications(events, applications))
  const selectedEvents = allEvents.filter(event => event.date === selectedDate)
  const monthLabel = formatMonthYear(toDateKey(new Date(shownMonth.year, shownMonth.month, 1)))

  return (
    <div className="calendar-layout">
      <section className="surface month-card" aria-label={`${monthLabel} calendar`}>
        <div className="month-heading">
          <h2>{monthLabel}</h2>
          <div className="month-arrows">
            <button className="icon-button" type="button" aria-label="Previous month" onClick={() => changeMonth(-1)}><Icon name="left" /></button>
            <button className="icon-button" type="button" aria-label="Next month" onClick={() => changeMonth(1)}><Icon name="right" /></button>
          </div>
        </div>
        <div className="calendar-weekdays">{weekdays.map(day => <abbr key={day} title={day}>{day[0]}</abbr>)}</div>
        <div className="calendar-days">
          {createMonthCells(shownMonth.year, shownMonth.month).map(cell => {
            const dayEvents = allEvents.filter(event => event.date === cell.date)
            const hasDeadline = dayEvents.some(event => DEADLINE_KINDS.includes(event.kind))
            const hasMeeting = dayEvents.some(event => !DEADLINE_KINDS.includes(event.kind))
            const isSelected = cell.date === selectedDate
            return (
              <div className={`calendar-cell ${!cell.inMonth ? 'outside-month' : ''}`} key={cell.date}>
                <button
                  type="button"
                  className={`calendar-day ${isSelected ? 'is-selected' : ''} ${cell.date === today ? 'is-today' : ''}`}
                  aria-label={`${formatWeekdayDate(cell.date)}, ${dayEvents.length} events`}
                  aria-pressed={isSelected}
                  onClick={() => setSelectedDate(cell.date)}
                >
                  {cell.day}
                </button>
                <span className="calendar-dots" aria-hidden="true">{hasDeadline && <i className="dot-deadline" />}{hasMeeting && <i className="dot-meeting" />}</span>
              </div>
            )
          })}
        </div>
        <div className="calendar-legend"><span><i className="dot-deadline" />Deadline</span><span><i className="dot-meeting" />Interview / assessment</span></div>
      </section>

      <section className="surface selected-day-card" aria-labelledby="selected-day-title" aria-live="polite">
        <div className="selected-day-heading">
          <h2 id="selected-day-title">
            <span className="desktop-only">{formatWeekdayDate(selectedDate)}</span>
            <span className="mobile-only">{formatLongDate(selectedDate)}</span>
          </h2>
          <span>{selectedEvents.length} {selectedEvents.length === 1 ? 'event' : 'events'}</span>
        </div>
        {selectedEvents.length > 0 ? (
          <ul className="event-list">
            {selectedEvents.map(event => <li key={event.id}><EventCard event={event} today={today} onOpen={onOpen} /></li>)}
          </ul>
        ) : (
          <p className="selected-day-empty">Nothing scheduled.</p>
        )}
        <p className="selected-day-hint">Select another day to see its events.</p>
      </section>
    </div>
  )
}
