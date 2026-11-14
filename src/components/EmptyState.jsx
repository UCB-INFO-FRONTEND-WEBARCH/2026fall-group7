import Icon from './Icon'

// The centered icon + title + text + button block used by the empty mockups.
export default function EmptyState({ title, text, action }) {
  return (
    <div className="empty-state">
      <span className="welcome-icon"><Icon name="briefcase" size={26} /></span>
      <h2>{title}</h2>
      <p>{text}</p>
      {action}
    </div>
  )
}
