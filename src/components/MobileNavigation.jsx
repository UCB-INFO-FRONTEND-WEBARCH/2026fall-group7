import Icon from './Icon'

export default function MobileNavigation({ page: currentPage, onNavigate }) {
  const page = currentPage === 'detail' ? 'applications' : currentPage
  return (
    <>
      <button className="button button-primary floating-add" type="button" aria-disabled="true"><Icon name="plus" />Add application</button>
      <nav className="mobile-navigation" aria-label="Mobile navigation">
        <button className={`mobile-nav-link ${page === 'home' ? 'is-current' : ''}`} type="button" aria-current={page === 'home' ? 'page' : undefined} onClick={() => onNavigate('home')}><Icon name="home" size={20} /><span>Home</span></button>
        <button className={`mobile-nav-link ${page === 'applications' ? 'is-current' : ''}`} type="button" aria-current={page === 'applications' ? 'page' : undefined} onClick={() => onNavigate('applications')}><Icon name="briefcase" size={20} /><span>Applications</span></button>
      </nav>
    </>
  )
}
