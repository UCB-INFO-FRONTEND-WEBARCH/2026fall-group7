import { NavLink, useLocation } from 'react-router-dom'
import Icon from './Icon'

const navClass = ({ isActive }) => `mobile-nav-link ${isActive ? 'is-current' : ''}`

export default function MobileNavigation({ onAdd }) {
  // The detail page mockup has no floating Add button.
  const isDetail = useLocation().pathname.startsWith('/applications/')
  return (
    <>
      {!isDetail && <button className="button button-primary floating-add" type="button" onClick={onAdd}><Icon name="plus" />Add application</button>}
      <nav className="mobile-navigation" aria-label="Mobile navigation">
        <NavLink className={navClass} to="/" end><Icon name="home" size={20} /><span>Home</span></NavLink>
        <NavLink className={navClass} to="/applications"><Icon name="briefcase" size={20} /><span>Applications</span></NavLink>
      </nav>
    </>
  )
}
