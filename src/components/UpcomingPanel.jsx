import Icon from './Icon'
import EmptyWelcome from './EmptyWelcome'
import { eventIcons } from '../data/mockData'

export default function UpcomingPanel({ items, isEmpty }) {
  return (
    <aside className="upcoming-panel" aria-labelledby="upcoming-title">
      <div className="upcoming-heading">
        <h2 id="upcoming-title">Next 7 days</h2>
        {!isEmpty && <span className="item-count">{items.length} items</span>}
      </div>
      {isEmpty ? (
        <>
          <div className="surface all-clear"><p>You’re all clear</p><span>Upcoming deadlines, interviews and missing materials show up here.</span></div>
          {/* The mobile mockup places the welcome card above the view tabs. */}
          <div className="surface mobile-welcome"><EmptyWelcome /></div>
        </>
      ) : (
        <ul className="surface upcoming-list">
          {items.map(item => (
            <li className={`upcoming-item reminder-${item.kind}`} key={item.id}>
              <span className="reminder-icon"><Icon name={eventIcons[item.kind]} size={17} /></span>
              <div className="reminder-copy"><p>{item.title}</p><span>{item.detail}</span></div>
              <button className="button button-outline button-small" type="button" aria-disabled="true" aria-label={`${item.action}: ${item.title}`}>{item.action}</button>
            </li>
          ))}
        </ul>
      )}
    </aside>
  )
}
