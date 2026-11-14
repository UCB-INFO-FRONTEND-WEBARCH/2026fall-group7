import { useState } from 'react'
import Icon from './Icon'
import StatusStepper from './StatusStepper'
import MaterialsCard from './MaterialsCard'
import KeyDatesCard from './KeyDatesCard'
import Modal from './Modal'
import { statusTones } from '../data/constants'
import '../styles/detail.css'

// "https://jobs.lever.co/notion/8f2c1a7e" -> "jobs.lever.co/notion/8f2c1a7e"
const displayLink = link => link.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')

export default function ApplicationDetailPage({ application, events, today, onBack, onUpdate, onDelete, onAddEvent, onDeleteEvent }) {
  const [descriptionOpen, setDescriptionOpen] = useState(true)
  const [notesSaved, setNotesSaved] = useState(false)
  const [confirmingDelete, setConfirmingDelete] = useState(false)
  const update = changes => onUpdate(application.id, changes)

  return (
    <main className="detail-page page-width" id="main-content">
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <button type="button" onClick={onBack}>Applications</button> / <span aria-current="page">{application.company}</span>
      </nav>

      <header className="detail-header">
        <div>
          <div className="detail-title">
            <h1>{application.company}</h1>
            <span className={`status-badge status-${statusTones[application.status]}`}><span className="status-dot" />{application.status}</span>
          </div>
          <p className="detail-role">{application.role}</p>
          {application.link && (
            <a className="detail-link" href={application.link} target="_blank" rel="noreferrer"><Icon name="external" />{displayLink(application.link)}</a>
          )}
        </div>
        <div className="detail-actions">
          {/* Edit details reuses the Add application form (next chunk). */}
          <button className="button button-outline" type="button" aria-disabled="true"><Icon name="pencil" />Edit details</button>
          <button className="button button-danger" type="button" onClick={() => setConfirmingDelete(true)}><Icon name="trash" />Delete</button>
        </div>
      </header>

      <StatusStepper status={application.status} onChange={status => update({ status })} />

      <div className="detail-grid">
        <div className="detail-column">
          <MaterialsCard checklist={application.checklist} onChange={checklist => update({ checklist })} />

          <section className="surface detail-card" aria-labelledby="notes-title">
            <h2 id="notes-title">Notes</h2>
            <label className="field">
              <span>Your notes</span>
              {/* Saves on every keystroke: App's useEffect writes it to localStorage. */}
              <textarea
                className="text-input notes-input"
                rows={4}
                placeholder="Recruiter names, interview prep, anything to remember…"
                value={application.notes}
                onChange={e => { update({ notes: e.target.value }); setNotesSaved(true) }}
              />
            </label>
            <p className="card-hint">Saved automatically{notesSaved && ' · just now'}</p>
          </section>
        </div>

        <div className="detail-column">
          <KeyDatesCard application={application} events={events} today={today} onAdd={onAddEvent} onDelete={onDeleteEvent} />

          <section className="surface detail-card" aria-labelledby="description-title">
            <button className="card-heading collapse-toggle" type="button" aria-expanded={descriptionOpen} onClick={() => setDescriptionOpen(open => !open)}>
              <h2 id="description-title">Job description</h2>
              <Icon name={descriptionOpen ? 'down' : 'right'} />
            </button>
            {descriptionOpen && (
              application.description
                ? <p className="job-description">{application.description}</p>
                : <p className="card-empty">No description added.</p>
            )}
          </section>
        </div>
      </div>

      {/* Destructive confirmation, using the design system's Modal. */}
      {confirmingDelete && (
        <Modal
          title="Delete application?"
          description={`This removes the ${application.company} application, its notes, materials checklist and key dates. This can’t be undone.`}
          onClose={() => setConfirmingDelete(false)}
          footer={<>
            <button className="button button-outline" type="button" autoFocus onClick={() => setConfirmingDelete(false)}>Cancel</button>
            <button className="button button-danger" type="button" onClick={() => onDelete(application.id)}>Delete application</button>
          </>}
        />
      )}
    </main>
  )
}
