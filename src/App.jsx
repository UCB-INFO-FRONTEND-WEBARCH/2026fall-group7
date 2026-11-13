import AppHeader from './components/AppHeader'
import MobileNavigation from './components/MobileNavigation'
import ViewTabs from './components/ViewTabs'
import EmptyWelcome from './components/EmptyWelcome'
import UpcomingPanel from './components/UpcomingPanel'
import TimelineView from './components/TimelineView'
import CalendarView from './components/CalendarView'
import { applications, scheduleEvents, upcomingItems } from './data/mockData'

export default function App() {
  // Static design previews: / (empty), /?preview=timeline, /?preview=calendar.
  // This is a development preview choice, not task state or a working router.
  // Later: App can own applications + selected view in useState and pass callbacks.
  const preview = new URLSearchParams(window.location.search).get('preview')
  const isEmpty = !['timeline', 'calendar'].includes(preview)
  const view = preview === 'calendar' ? 'calendar' : 'timeline'

  return (
    <div className={`app-shell ${isEmpty ? 'is-empty' : ''}`}>
      <a className="skip-link" href="#main-content">Skip to schedule</a>
      <AppHeader />
      <main className="dashboard page-width" id="main-content">
        <section className="schedule-section" aria-label="Your schedule">
          <div className="schedule-heading"><h1>Your schedule</h1><ViewTabs view={view} /></div>
          {isEmpty ? (
            <>
              <div className="surface desktop-welcome"><EmptyWelcome /></div>
              <div className="surface timeline-empty"><p>Nothing on your timeline yet</p><span>Deadlines, interviews and assessments appear here by week.</span></div>
            </>
          ) : view === 'calendar' ? (
            <CalendarView applications={applications} events={scheduleEvents} />
          ) : (
            <TimelineView applications={applications} events={scheduleEvents} />
          )}
        </section>
        <UpcomingPanel items={isEmpty ? [] : upcomingItems} isEmpty={isEmpty} />
      </main>
      <MobileNavigation />
    </div>
  )
}
