import { useState } from 'react'
import Icon from './Icon'

// Stages 1-5 are statuses; stage 6 is the final outcome (Offer or Denied).
const STAGES = ['Submitted', 'Under Review', 'First Round', 'Second Round', 'Third Round']

export default function StatusStepper({ status, onChange }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const isFinal = status === 'Offer' || status === 'Denied'
  const currentIndex = isFinal ? STAGES.length : STAGES.indexOf(status)

  function choose(newStatus) {
    onChange(newStatus)
    setMenuOpen(false)
  }

  const stages = [...STAGES, isFinal ? status : 'Offer / Denied']

  return (
    <section className="surface detail-card status-card" aria-labelledby="status-title">
      <h2 id="status-title">Status</h2>
      <ol className="stepper">
        {stages.map((label, index) => {
          const state = index < currentIndex ? 'is-done' : index === currentIndex ? 'is-current' : ''
          const isLast = index === STAGES.length
          return (
            <li key={index} className={`step ${state}`}>
              <button
                type="button"
                className="step-button"
                aria-current={index === currentIndex ? 'step' : undefined}
                aria-haspopup={isLast ? 'menu' : undefined}
                aria-expanded={isLast ? menuOpen : undefined}
                onClick={() => (isLast ? setMenuOpen(open => !open) : choose(label))}
              >
                <span className="step-marker">{index < currentIndex ? <Icon name="check" size={12} /> : index + 1}</span>
                <span className="step-label">{label}</span>
              </button>
              {isLast && menuOpen && (
                <div className="outcome-menu" role="menu" aria-label="Final outcome">
                  <p>Final outcome</p>
                  <button type="button" role="menuitem" className={status === 'Offer' ? 'is-selected' : ''} onClick={() => choose('Offer')}><span className="outcome-dot offer" />Offer</button>
                  <button type="button" role="menuitem" className={status === 'Denied' ? 'is-selected' : ''} onClick={() => choose('Denied')}><span className="outcome-dot" />Denied</button>
                </div>
              )}
            </li>
          )
        })}
      </ol>
      <p className="card-hint">Click a stage to update the status. The last stage asks whether it was an Offer or Denied.</p>
    </section>
  )
}
