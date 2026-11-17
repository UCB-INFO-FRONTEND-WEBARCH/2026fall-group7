import { useState } from 'react'
import Icon from './Icon'
import { EVENT_KINDS, eventIcons } from '../data/constants'
import { formatTime, formatWeekdayDate } from '../data/dates'
import { makeId } from '../data/ids'
import { sortEvents } from '../data/schedule'

// "Interview · First Round", "Application deadline", "Online assessment"...
function eventTitle(event) {
  if (event.kind === 'deadline') return 'Application deadline'
  if (event.kind === 'interview') return event.title ? `Interview · ${event.title}` : 'Interview'
  return EVENT_KINDS[event.kind]
}

// If the status is a round, a new interview is probably for that round.
const roundFromStatus = status => (status.endsWith('Round') ? status : '')

const EMPTY_FORM = { kind: 'interview', date: '', time: '' }

// Time dropdown options: every 30 minutes, plus 11:59 PM for deadlines. Saved as '14:00'.
const TIME_OPTIONS = [
  ...Array.from({ length: 48 }, (_, i) => `${String(Math.floor(i / 2)).padStart(2, '0')}:${i % 2 ? '30' : '00'}`),
  '23:59',
]

export default function KeyDatesCard({ application, events, today, onAdd, onDelete, onAddToGoogle }) {
  const [formOpen, setFormOpen] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)
  const [error, setError] = useState('')

  const myEvents = sortEvents(events.filter(event => event.applicationId === application.id))

  function save(e) {
    e.preventDefault()
    if (!form.date) { setError('Pick a date.'); return }
    onAdd({
      id: makeId('evt'),
      applicationId: application.id,
      kind: form.kind,
      date: form.date,
      time: form.time,
      title: form.kind === 'interview' ? roundFromStatus(application.status) : '',
      durationMin: null,
      googleEventId: null,
    })
    setForm(EMPTY_FORM)
    setError('')
    setFormOpen(false)
  }

  return (
    <section className="surface detail-card" aria-labelledby="dates-title">
      <div className="card-heading">
        <h2 id="dates-title">Key dates</h2>
        {!formOpen && <button className="button button-outline button-small" type="button" onClick={() => setFormOpen(true)}><Icon name="plus" size={14} />Add date</button>}
      </div>

      {myEvents.length === 0 && !formOpen && <p className="card-empty">No dates yet. Add a deadline, assessment or interview.</p>}

      <ul className="key-dates">
        {myEvents.map(event => {
          const past = event.date < today
          const pastNote = past ? (event.kind === 'deadline' ? ' · submitted' : ' · done') : ''
          return (
            <li key={event.id} className={`key-date kind-${event.kind}`}>
              <div className="key-date-main">
                <span className="reminder-icon"><Icon name={eventIcons[event.kind]} size={17} /></span>
                <div className="key-date-copy">
                  <p>{eventTitle(event)}</p>
                  <span>{formatWeekdayDate(event.date)}{event.time && ` · ${formatTime(event.time)}`}{pastNote}</span>
                </div>
                <button className="icon-button" type="button" aria-label={`Delete ${eventTitle(event)}`} onClick={() => onDelete(event.id)}><Icon name="trash" /></button>
              </div>
              {/* Its own row under the date, like the mockup. Calls addEventToGoogle in App.jsx;
                  once added, googleEventId is saved on the event. */}
              {event.googleEventId ? (
                <span className="calendar-link is-added"><Icon name="check" size={14} />In Google Calendar</span>
              ) : (
                <button className="calendar-link" type="button" onClick={() => onAddToGoogle(event)}><Icon name="calendar" size={14} />Add to Google Calendar</button>
              )}
            </li>
          )
        })}
      </ul>

      {formOpen && (
        <form className="date-form" onSubmit={save} noValidate>
          <label className="field">
            <span>Type</span>
            <select className="text-input" value={form.kind} onChange={e => setForm({ ...form, kind: e.target.value })}>
              {Object.entries(EVENT_KINDS).map(([kind, label]) => <option key={kind} value={kind}>{label}</option>)}
            </select>
          </label>
          <div className="field-row">
            <label className="field">
              <span>Date</span>
              <input className="text-input" type="date" value={form.date} aria-invalid={Boolean(error)} onChange={e => { setForm({ ...form, date: e.target.value }); setError('') }} />
            </label>
            <label className="field">
              <span>Time</span>
              <select className="text-input" value={form.time} onChange={e => setForm({ ...form, time: e.target.value })}>
                <option value="">No time</option>
                {TIME_OPTIONS.map(time => <option key={time} value={time}>{formatTime(time)}</option>)}
              </select>
            </label>
          </div>
          {error && <p className="field-error"><Icon name="alert" size={14} />{error}</p>}
          <div className="form-actions">
            <button className="text-button" type="button" onClick={() => { setFormOpen(false); setError('') }}>Cancel</button>
            <button className="button button-primary button-small" type="submit">Save date</button>
          </div>
        </form>
      )}
    </section>
  )
}
