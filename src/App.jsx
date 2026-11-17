import { useCallback, useEffect, useState } from 'react'
import { Link, Navigate, Route, Routes, useLocation, useNavigate, useParams } from 'react-router-dom'
import AppHeader from './components/AppHeader'
import MobileNavigation from './components/MobileNavigation'
import HomePage from './components/HomePage'
import ApplicationsPage from './components/ApplicationsPage'
import ApplicationDetailPage from './components/ApplicationDetailPage'
import ApplicationFormModal from './components/ApplicationFormModal'
import Toast from './components/Toast'
import { loadData, saveData } from './data/storage'
import { todayKey } from './data/dates'
import { createApplication, findDeadline, setDeadline } from './data/records'
import { createCalendarEvent, isGoogleCalendarConfigured } from './services/googleCalendar'

export default function App() {
  //  Saved data 
  // Load once on the first render; save whenever applications or events change.
  const [initialData] = useState(loadData)
  const [applications, setApplications] = useState(initialData.applications)
  const [events, setEvents] = useState(initialData.events)

  useEffect(() => {
    saveData({ applications, events })
  }, [applications, events])

  //  UI state (not saved) 
  const [form, setForm] = useState(null) // null | { mode: 'add' } | { mode: 'edit', id }
  const [toast, setToast] = useState(null) // { message, action?, error? }
  const dismissToast = useCallback(() => setToast(null), [])

  const navigate = useNavigate()
  const { pathname } = useLocation()
  const today = todayKey()

  // New page -> start at the top.
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])

  // ----- Changes to the data (passed down as callback props) -----
  // Each one makes a NEW array; React re-renders and the useEffect above saves.
  function updateApplication(id, changes) {
    setApplications(apps => apps.map(app => (app.id === id ? { ...app, ...changes } : app)))
  }

  function deleteApplication(id) {
    setApplications(apps => apps.filter(app => app.id !== id))
    setEvents(evts => evts.filter(event => event.applicationId !== id)) // its dates go too
    navigate('/applications')
  }

  const addEvent = event => setEvents(evts => [...evts, event])
  const updateEvent = (id, changes) => setEvents(evts => evts.map(e => (e.id === id ? { ...e, ...changes } : e)))
  const deleteEvent = id => setEvents(evts => evts.filter(event => event.id !== id))

  // Add / Edit form (ApplicationFormModal) hands us validated fields.
  function saveForm(fields) {
    if (form.mode === 'add') {
      const { application, events: newEvents } = createApplication(fields)
      setApplications(apps => [...apps, application])
      setEvents(evts => [...evts, ...newEvents])
      setToast({
        message: `Application saved · ${application.company}`,
        detail: `, ${application.role}`,
        action: { label: 'View', onClick: () => navigate(`/applications/${application.id}`) },
      })
    } else {
      const { link, company, role, description, deadline } = fields
      updateApplication(form.id, { link: link.trim(), company, role, description: description.trim() })
      setEvents(evts => setDeadline(evts, form.id, deadline))
      setToast({ message: 'Changes saved' })
    }
    setForm(null)
  }

  //  Google Calendar (see services/googleCalendar.js + docs/google-calendar.md)
  async function addEventToGoogle(event) {
    if (!isGoogleCalendarConfigured()) {
      setToast({ message: 'Google Calendar isn’t connected yet.', error: true })
      return
    }
    try {
      const application = applications.find(app => app.id === event.applicationId)
      const googleEventId = await createCalendarEvent(event, application)
      updateEvent(event.id, { googleEventId }) // saved, so it's never added twice
      setToast({ message: 'Added to Google Calendar' })
    } catch (error) {
      console.error(error)
      setToast({ message: 'Couldn’t add to Google Calendar. Try again.', error: true })
    }
  }

  async function syncAllToGoogle() {
    if (!isGoogleCalendarConfigured()) {
      setToast({ message: 'Google Calendar isn’t connected yet.', error: true })
      return
    }
    // Upcoming dates that aren't in Google Calendar yet.
    const toSync = events.filter(e => !e.googleEventId && e.date >= today)
    let added = 0
    for (const event of toSync) {
      try {
        const application = applications.find(app => app.id === event.applicationId)
        const googleEventId = await createCalendarEvent(event, application)
        updateEvent(event.id, { googleEventId })
        added++
      } catch (error) {
        console.error(error)
      }
    }
    setToast({
      message: toSync.length === 0 ? 'Everything is already in Google Calendar' : `Added ${added} of ${toSync.length} dates to Google Calendar`,
      error: added < toSync.length,
    })
  }

  const openAddForm = () => setForm({ mode: 'add' })
  const shared = { applications, events, today, onAdd: openAddForm }
  const editing = form?.mode === 'edit' && applications.find(app => app.id === form.id)

  return (
    <div className={`app-shell ${applications.length === 0 && pathname === '/' ? 'is-empty' : ''}`}>
      <a className="skip-link" href="#main-content">Skip to content</a>
      <AppHeader onAdd={openAddForm} onSync={syncAllToGoogle} />

      <Routes>
        <Route path="/" element={<HomePage {...shared} />} />
        <Route path="/applications" element={<ApplicationsPage {...shared} />} />
        <Route
          path="/applications/:id"
          element={
            <DetailRoute
              {...shared}
              onUpdate={updateApplication}
              onDelete={deleteApplication}
              onAddEvent={addEvent}
              onDeleteEvent={deleteEvent}
              onEdit={id => setForm({ mode: 'edit', id })}
              onAddToGoogle={addEventToGoogle}
            />
          }
        />
        {/* Unknown URL -> Home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <MobileNavigation onAdd={openAddForm} />

      {form?.mode === 'add' && <ApplicationFormModal mode="add" onSave={saveForm} onClose={() => setForm(null)} />}
      {editing && (
        <ApplicationFormModal
          mode="edit"
          initial={{ ...editing, deadline: findDeadline(events, editing.id)?.date || '' }}
          onSave={saveForm}
          onClose={() => setForm(null)}
        />
      )}

      <Toast toast={toast} onDismiss={dismissToast} />
    </div>
  )
}

// Route "/applications/:id": reads the id from the URL (useParams) and finds that application.
function DetailRoute({ applications, events, today, ...handlers }) {
  const { id } = useParams()
  const application = applications.find(app => app.id === id)

  if (!application) {
    return (
      <main className="detail-page page-width" id="main-content">
        <div className="surface not-found">
          <h1>Application not found</h1>
          <p>It may have been deleted.</p>
          <Link className="button button-outline" to="/applications">Back to applications</Link>
        </div>
      </main>
    )
  }

  // key: start fresh (e.g. close open forms) when switching to a different application.
  return <ApplicationDetailPage key={application.id} application={application} events={events} today={today} {...handlers} />
}
