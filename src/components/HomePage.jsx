import { useNavigate, useSearchParams } from 'react-router-dom'
import ViewTabs from './ViewTabs'
import EmptyWelcome from './EmptyWelcome'
import UpcomingPanel from './UpcomingPanel'
import TimelineView from './TimelineView'
import CalendarView from './CalendarView'
import { getUpcomingItems } from '../data/schedule'

// Route "/". Timeline vs Calendar lives in the URL (/?view=calendar),
// so refreshing or sharing the link keeps the same view.
export default function HomePage({ applications, events, today, onAdd }) {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const view = searchParams.get('view') === 'calendar' ? 'calendar' : 'timeline'
  const setView = next => setSearchParams(next === 'calendar' ? { view: 'calendar' } : {}, { replace: true })

  const openApplication = id => navigate(`/applications/${id}`)
  const isEmpty = applications.length === 0

  return (
    <main className="dashboard page-width" id="main-content">
      <section className="schedule-section" aria-label="Your schedule">
        <div className="schedule-heading"><h1>Your schedule</h1><ViewTabs view={view} onViewChange={setView} /></div>
        {isEmpty ? (
          <>
            <div className="surface desktop-welcome"><EmptyWelcome onAdd={onAdd} /></div>
            <div className="surface timeline-empty"><p>Nothing on your timeline yet</p><span>Deadlines, interviews and assessments appear here by week.</span></div>
          </>
        ) : view === 'calendar' ? (
          <CalendarView applications={applications} events={events} today={today} onOpen={openApplication} />
        ) : (
          <TimelineView applications={applications} events={events} today={today} onOpen={openApplication} />
        )}
      </section>
      <UpcomingPanel items={getUpcomingItems(applications, events, today)} isEmpty={isEmpty} onOpen={openApplication} onAdd={onAdd} />
    </main>
  )
}
