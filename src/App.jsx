import { useEffect, useState } from 'react'
import AppHeader from './components/AppHeader'
import MobileNavigation from './components/MobileNavigation'
import ViewTabs from './components/ViewTabs'
import EmptyWelcome from './components/EmptyWelcome'
import UpcomingPanel from './components/UpcomingPanel'
import TimelineView from './components/TimelineView'
import CalendarView from './components/CalendarView'
import ApplicationsPage from './components/ApplicationsPage'
import ApplicationDetailPage from './components/ApplicationDetailPage'
import { loadData, saveData } from './data/storage'
import { getUpcomingItems } from './data/schedule'
import { todayKey } from './data/dates'

export default function App() {
  // Load saved data once, on the first render.
  const [initialData] = useState(loadData)
  const [applications, setApplications] = useState(initialData.applications)
  const [events, setEvents] = useState(initialData.events)

  // Persistence: whenever applications or events change, save them.
  useEffect(() => {
    saveData({ applications, events })
  }, [applications, events])

  // UI state: not saved, resets on refresh.
  const [page, setPage] = useState('home') // 'home' | 'applications' | 'detail'
  const [selectedId, setSelectedId] = useState(null) // which application the detail page shows
  const [view, setView] = useState('timeline') // 'timeline' | 'calendar'

  const today = todayKey()
  const isEmpty = applications.length === 0
  const selectedApplication = applications.find(app => app.id === selectedId)

  // ----- Navigation -----
  function openApplication(id) {
    setSelectedId(id)
    setPage('detail')
    window.scrollTo(0, 0)
  }

  // ----- Changes to the data (passed down as callback props) -----
  // Each one creates a NEW array; React notices, re-renders, and the useEffect above saves.
  function updateApplication(id, changes) {
    setApplications(apps => apps.map(app => (app.id === id ? { ...app, ...changes } : app)))
  }

  function deleteApplication(id) {
    setApplications(apps => apps.filter(app => app.id !== id))
    setEvents(evts => evts.filter(event => event.applicationId !== id)) // its dates go too
    setPage('applications')
  }

  function addEvent(event) {
    setEvents(evts => [...evts, event])
  }

  function deleteEvent(id) {
    setEvents(evts => evts.filter(event => event.id !== id))
  }

  // If the open application was deleted, fall back to the list.
  const currentPage = page === 'detail' && !selectedApplication ? 'applications' : page

  return (
    <div className={`app-shell ${isEmpty && currentPage === 'home' ? 'is-empty' : ''}`}>
      <a className="skip-link" href="#main-content">Skip to content</a>
      <AppHeader page={currentPage} onNavigate={setPage} />

      {currentPage === 'detail' ? (
        <ApplicationDetailPage
          key={selectedApplication.id}
          application={selectedApplication}
          events={events}
          today={today}
          onBack={() => setPage('applications')}
          onUpdate={updateApplication}
          onDelete={deleteApplication}
          onAddEvent={addEvent}
          onDeleteEvent={deleteEvent}
        />
      ) : currentPage === 'applications' ? (
        <ApplicationsPage applications={applications} events={events} today={today} onOpen={openApplication} />
      ) : (
        <main className="dashboard page-width" id="main-content">
          <section className="schedule-section" aria-label="Your schedule">
            <div className="schedule-heading"><h1>Your schedule</h1><ViewTabs view={view} onViewChange={setView} /></div>
            {isEmpty ? (
              <>
                <div className="surface desktop-welcome"><EmptyWelcome /></div>
                <div className="surface timeline-empty"><p>Nothing on your timeline yet</p><span>Deadlines, interviews and assessments appear here by week.</span></div>
              </>
            ) : view === 'calendar' ? (
              <CalendarView applications={applications} events={events} today={today} onOpen={openApplication} />
            ) : (
              <TimelineView applications={applications} events={events} today={today} onOpen={openApplication} />
            )}
          </section>
          <UpcomingPanel items={getUpcomingItems(applications, events, today)} isEmpty={isEmpty} onOpen={openApplication} />
        </main>
      )}

      <MobileNavigation page={currentPage} onNavigate={setPage} />
    </div>
  )
}
