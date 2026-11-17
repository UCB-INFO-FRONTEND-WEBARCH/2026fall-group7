import { Link, NavLink, useLocation } from 'react-router-dom'
import Icon from './Icon'

// NavLink knows which page is open and gives us isActive for the purple highlight.
// `end` on Home means "only exactly /"; otherwise every page would count as Home.
const navClass = ({ isActive }) => `nav-link ${isActive ? 'is-current' : ''}`

export default function AppHeader({ onAdd, onSync }) {
  const { pathname } = useLocation()
  const mobileTitle = pathname.startsWith('/applications') ? 'Applications' : 'Home'
  const isDetail = pathname.startsWith('/applications/') // phones: "‹ Application" with a back link

  return (
    <header className="app-header">
      {/* CSS swaps the desktop navigation for the compact mobile header. */}
      <div className="header-inner page-width">
        <div className="desktop-header">
          <Link className="brand" to="/" aria-label="Application Tracker home">
            <span className="brand-mark"><Icon name="briefcase" size={20} /></span>
            <span>Application Tracker</span>
          </Link>
          <nav className="desktop-navigation" aria-label="Main navigation">
            <NavLink className={navClass} to="/" end><Icon name="home" />Home</NavLink>
            <NavLink className={navClass} to="/applications"><Icon name="briefcase" />Applications</NavLink>
          </nav>
          <div className="header-actions">
            <button className="button button-outline" type="button" onClick={onSync}><Icon name="sync" />Sync to Google Calendar</button>
            <button className="button button-primary" type="button" onClick={onAdd}><Icon name="plus" />Add application</button>
          </div>
        </div>
        <div className="mobile-header">
          {isDetail ? (
            <h1 className="mobile-back"><Link to="/applications" aria-label="Back to applications"><Icon name="left" size={20} /></Link>Application</h1>
          ) : (
            <>
              <h1>{mobileTitle}</h1>
              <button className="button button-outline button-small" type="button" onClick={onSync}><Icon name="sync" size={14} />Sync</button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
