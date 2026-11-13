import Icon from './Icon'

export default function MobileNavigation() {
  return (
    <>
      <button className="button button-primary floating-add" type="button" aria-disabled="true"><Icon name="plus" />Add application</button>
      <nav className="mobile-navigation" aria-label="Mobile navigation">
        <a className="mobile-nav-link is-current" href="/" aria-current="page"><Icon name="home" size={20} /><span>Home</span></a>
        <button className="mobile-nav-link" type="button" aria-disabled="true"><Icon name="briefcase" size={20} /><span>Applications</span></button>
      </nav>
    </>
  )
}
