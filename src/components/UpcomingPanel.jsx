import Icon from './Icon'
import EmptyWelcome from './EmptyWelcome'
import { eventIcons } from '../data/constants'

// `items` comes from getUpcomingItems() in data/schedule.js.
export default function UpcomingPanel({ items, isEmpty, onOpen }) {
  const showAllClear = isEmpty || items.length === 0

  return (
    <aside className="upcoming-panel" aria-labelledby="upcoming-title">
      <div className="upcoming-heading">
        <h2 id="upcoming-title">Next 7 days</h2>
        {!showAllClear && <span className="item-count">{items.length} {items.length === 1 ? 'item' : 'items'}</span>}
      </div>
      {showAllClear ? (
        <>
          <div className="surface all-clear"><p>You’re all clear</p><span>Upcoming deadlines, interviews and missing materials show up here.</span></div>
          {/* The mobile mockup places the welcome card above the view tabs. */}
          {isEmpty && <div className="surface mobile-welcome"><EmptyWelcome /></div>}
        </>
      ) : (
        <ul className="surface upcoming-list">
          {items.map(item => (
            <li className={`upcoming-item reminder-${item.urgent ? 'deadline' : item.kind}`} key={item.id}>
              <span className="reminder-icon"><Icon name={eventIcons[item.kind]} size={17} /></span>
              <div className="reminder-copy"><p>{item.title}</p><span>{item.detail}</span></div>
              {/* Every action opens the application's detail page. */}
              <button className="button button-outline button-small" type="button" onClick={() => onOpen(item.applicationId)} aria-label={`${item.action}: ${item.title}`}>{item.action}</button>
            </li>
          ))}
        </ul>
      )}
    </aside>
  )
}
