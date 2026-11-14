import Icon from './Icon'

const PAGE_TITLES = { home: 'Home', applications: 'Applications' }

export default function AppHeader({ page: currentPage, onNavigate }) {
  // The detail page lives under the Applications section.
  const page = currentPage === 'detail' ? 'applications' : currentPage
  return (
    <header className="app-header">
      {/* CSS swaps the desktop navigation for the compact mobile header. */}
      <div className="header-inner page-width">
        <div className="desktop-header">
          <button className="brand" type="button" onClick={() => onNavigate('home')} aria-label="Application Tracker home">
            <span className="brand-mark"><Icon name="briefcase" size={20} /></span>
            <span>Application Tracker</span>
          </button>
          <nav className="desktop-navigation" aria-label="Main navigation">
            <button className={`nav-link ${page === 'home' ? 'is-current' : ''}`} type="button" aria-current={page === 'home' ? 'page' : undefined} onClick={() => onNavigate('home')}><Icon name="home" />Home</button>
            <button className={`nav-link ${page === 'applications' ? 'is-current' : ''}`} type="button" aria-current={page === 'applications' ? 'page' : undefined} onClick={() => onNavigate('applications')}><Icon name="briefcase" />Applications</button>
          </nav>
          {/* Sync = Google Calendar chunk; Add = Add modal chunk. */}
          <div className="header-actions">
            <button className="button button-outline" type="button" aria-disabled="true"><Icon name="sync" />Sync to Google Calendar</button>
            <button className="button button-primary" type="button" aria-disabled="true"><Icon name="plus" />Add application</button>
          </div>
        </div>
        <div className="mobile-header">
          <h1>{PAGE_TITLES[page]}</h1>
          <button className="button button-outline button-small" type="button" aria-disabled="true"><Icon name="sync" size={14} />Sync</button>
        </div>
      </div>
    </header>
  )
}
