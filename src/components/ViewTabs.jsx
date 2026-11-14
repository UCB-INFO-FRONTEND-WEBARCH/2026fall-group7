import Icon from './Icon'

// Reusable two-option toggle. Home uses it for Timeline / Calendar;
// the Applications page passes its own options for List / Board.
const HOME_OPTIONS = [
  { value: 'timeline', label: 'Timeline', icon: 'timeline' },
  { value: 'calendar', label: 'Calendar', icon: 'calendar' },
]

export default function ViewTabs({ view, onViewChange, options = HOME_OPTIONS, label = 'Schedule view' }) {
  return (
    <div className="view-tabs" role="group" aria-label={label}>
      {options.map(option => (
        <button
          key={option.value}
          className={`view-tab ${view === option.value ? 'is-selected' : ''}`}
          type="button"
          aria-pressed={view === option.value}
          aria-disabled={option.disabled ? 'true' : undefined}
          title={option.disabled ? 'Coming soon' : undefined}
          onClick={() => !option.disabled && onViewChange(option.value)}
        >
          <Icon name={option.icon} />{option.label}
        </button>
      ))}
    </div>
  )
}
