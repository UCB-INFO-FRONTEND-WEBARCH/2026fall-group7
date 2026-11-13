import Icon from './Icon'

export default function EmptyWelcome() {
  return (
    <div className="empty-welcome">
      <span className="welcome-icon"><Icon name="briefcase" size={26} /></span>
      <h2>Welcome! Let’s add your first application</h2>
      <p>Paste a job posting link and we’ll pull in the company, role and deadline. Your deadlines, interviews and assessments will appear here by week.</p>
      <button className="button button-primary" type="button" aria-disabled="true"><Icon name="plus" />Add application</button>
    </div>
  )
}
