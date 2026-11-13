import Icon from './Icon'

export default function ViewTabs({ view }) {
  // The selected view comes from the static preview URL for now.
  // Later App can pass state and an onViewChange callback, just like class filters.
  return (
    <div className="view-tabs" role="group" aria-label="Schedule view">
      <button className={`view-tab ${view === 'timeline' ? 'is-selected' : ''}`} type="button" aria-pressed={view === 'timeline'} aria-disabled="true"><Icon name="timeline" />Timeline</button>
      <button className={`view-tab ${view === 'calendar' ? 'is-selected' : ''}`} type="button" aria-pressed={view === 'calendar'} aria-disabled="true"><Icon name="calendar" />Calendar</button>
    </div>
  )
}
