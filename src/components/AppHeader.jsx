import Icon from './Icon'

export default function AppHeader() {
  return (
    <header className="app-header">
      {/* CSS swaps the desktop navigation for the compact mobile header. */}
      <div className="header-inner page-width">
        <div className="desktop-header">
          <a className="brand" href="/" aria-label="Application Tracker home">
            <span className="brand-mark"><Icon name="briefcase" size={20} /></span>
            <span>Application Tracker</span>
          </a>
          <nav className="desktop-navigation" aria-label="Main navigation">
            <a className="nav-link is-current" href="/" aria-current="page"><Icon name="home" />Home</a>
            <button className="nav-link" type="button" aria-disabled="true"><Icon name="briefcase" />Applications</button>
          </nav>
          {/* No callbacks yet: these are the action locations for the next phase. */}
          <div className="header-actions">
            <button className="button button-outline" type="button" aria-disabled="true"><Icon name="sync" />Sync to Google Calendar</button>
            <button className="button button-primary" type="button" aria-disabled="true"><Icon name="plus" />Add application</button>
          </div>
        </div>
        <div className="mobile-header">
          <h1>Home</h1>
          <button className="button button-outline button-small" type="button" aria-disabled="true"><Icon name="sync" size={14} />Sync</button>
        </div>
      </div>
    </header>
  )
}
