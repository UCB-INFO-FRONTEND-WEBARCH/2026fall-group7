import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Icon from './Icon'
import ViewTabs from './ViewTabs'
import EmptyState from './EmptyState'
import { STATUSES, statusTones } from '../data/constants'
import { formatShortDate, toDateKey } from '../data/dates'
import { deadlinePill, materialsProgress } from '../data/schedule'
import '../styles/applications.css'

const SORT_OPTIONS = [
  { value: 'deadline', label: 'Deadline (soonest)' },
  { value: 'company', label: 'Company (A–Z)' },
  { value: 'status', label: 'Status' },
  { value: 'recent', label: 'Recently added' },
]

const VIEW_OPTIONS = [
  { value: 'list', label: 'List', icon: 'timeline' },
  { value: 'board', label: 'Board', icon: 'board' },
]

// Small pieces shared by list rows and board cards.
const StatusBadge = ({ status }) => <span className={`status-badge status-${statusTones[status]}`}><span className="status-dot" />{status}</span>
const DeadlinePill = ({ pill }) => <span className={`deadline-pill ${pill.urgent ? 'is-urgent' : ''}`}><Icon name="calendar" size={13} />{pill.label}</span>
const MaterialsPill = ({ app }) => {
  const { done, total } = materialsProgress(app)
  return <span className="materials-pill" aria-label={`${done} of ${total} materials ready`}>{done}/{total}</span>
}

// Route "/applications". List vs Board lives in the URL (/applications?view=board).
export default function ApplicationsPage({ applications, events, today, onAdd }) {
  const navigate = useNavigate()
  const onOpen = id => navigate(`/applications/${id}`)
  const [searchParams, setSearchParams] = useSearchParams()
  const view = searchParams.get('view') === 'board' ? 'board' : 'list'
  const setView = next => setSearchParams(next === 'board' ? { view: 'board' } : {}, { replace: true })

  // UI-only state: not saved.
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [sortBy, setSortBy] = useState('deadline')

  // No applications at all: the "No data" mockup.
  if (applications.length === 0) {
    return (
      <main className="applications-page page-width" id="main-content">
        <div className="page-heading"><div className="page-title"><h1>Applications</h1></div></div>
        <div className="surface">
          <EmptyState
            title="No applications yet"
            text="Track every role you apply to — deadlines, interview rounds and the materials each one needs."
            action={<button className="button button-primary" type="button" onClick={onAdd}><Icon name="plus" />Add application</button>}
          />
        </div>
      </main>
    )
  }

  // Work out each application's deadline pill once, then filter and sort.
  const query = search.trim().toLowerCase()
  const rows = applications
    .map(app => ({ app, pill: deadlinePill(app, events, today) }))
    .filter(({ app }) => statusFilter === 'All' || app.status === statusFilter)
    .filter(({ app }) => `${app.company} ${app.role}`.toLowerCase().includes(query))
    .sort((a, b) => {
      if (sortBy === 'company') return a.app.company.localeCompare(b.app.company)
      if (sortBy === 'status') return STATUSES.indexOf(a.app.status) - STATUSES.indexOf(b.app.status)
      if (sortBy === 'recent') return (b.app.createdAt || '').localeCompare(a.app.createdAt || '')
      // Deadline (soonest): applications with no deadline go last.
      if (!a.pill.date || !b.pill.date) return a.pill.date ? -1 : b.pill.date ? 1 : a.app.company.localeCompare(b.app.company)
      return a.pill.date.localeCompare(b.pill.date)
    })

  const isFiltered = query !== '' || statusFilter !== 'All'
  const clearFilters = () => { setSearch(''); setStatusFilter('All') }
  const countLabel = `${isFiltered ? `${rows.length} of ` : ''}${applications.length} ${applications.length === 1 ? 'application' : 'applications'}`

  // Board: one column per status (only the filtered status if a chip is selected).
  const boardColumns = (statusFilter === 'All' ? STATUSES : [statusFilter]).map(status => ({
    status, rows: rows.filter(({ app }) => app.status === status),
  }))

  return (
    <main className="applications-page page-width" id="main-content">
      {/* One grid for all the controls: desktop and phone arrange them differently (applications.css). */}
      <div className="list-controls">
        <div className="page-title">
          <h1>Applications</h1>
          <span>{countLabel}</span>
        </div>
        <div className="controls-tabs"><ViewTabs view={view} onViewChange={setView} options={VIEW_OPTIONS} label="Applications view" /></div>
        <label className="search-field">
          <Icon name="search" />
          <span className="visually-hidden">Search applications</span>
          <input type="search" placeholder="Search company or role" value={search} onChange={e => setSearch(e.target.value)} />
        </label>
        <label className="sort-field">
          <Icon name="sort" />
          <span className="visually-hidden">Sort by</span>
          <select value={sortBy} onChange={e => setSortBy(e.target.value)}>
            {SORT_OPTIONS.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
          </select>
          <Icon name="down" className="sort-chevron" />
        </label>
        <div className="filter-chips" role="group" aria-label="Filter by status">
          {['All', ...STATUSES].map(status => (
            <button key={status} type="button" className={`filter-chip ${statusFilter === status ? 'is-selected' : ''}`} aria-pressed={statusFilter === status} onClick={() => setStatusFilter(status)}>
              {status}
            </button>
          ))}
        </div>
      </div>

      {rows.length === 0 ? (
        // Search/filter matched nothing: the "No results" mockup.
        <div className="surface">
          <EmptyState
            title="No applications match your filters"
            text={`Try a different search, or clear the filters to see all ${applications.length} applications.`}
            action={<button className="button button-outline" type="button" onClick={clearFilters}>Clear filters</button>}
          />
        </div>
      ) : view === 'board' ? (
        <>
        <div className="board" aria-label="Applications by status">
          {boardColumns.map(column => (
            <section className="board-column" key={column.status} aria-label={`${column.status}, ${column.rows.length}`}>
              <div className="board-column-heading"><StatusBadge status={column.status} /><span>{column.rows.length}</span></div>
              <ul className="board-cards">
                {column.rows.map(({ app, pill }) => (
                  <li key={app.id}>
                    <button className="board-card" type="button" onClick={() => onOpen(app.id)}>
                      <strong>{app.company}</strong>
                      <span className="board-card-role">{app.role}</span>
                      <span className="board-card-pills"><DeadlinePill pill={pill} /><MaterialsPill app={app} /></span>
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          ))}
          </div>
          <p className="board-hint">Swipe sideways to see more columns →</p>
        </>
      ) : (
        <>
        <div className="surface applications-table-card">
          <table className="applications-table">
            <thead>
              <tr>
                <th scope="col">Company · Role</th>
                <th scope="col">Status</th>
                <th scope="col">Deadline</th>
                <th scope="col">Materials</th>
                <th scope="col"><span className="visually-hidden">Open</span></th>
              </tr>
            </thead>
            <tbody>
              {rows.map(({ app, pill }) => (
                // The whole row is clickable; the company name is a real button for keyboard users.
                <tr key={app.id} className="is-clickable" onClick={() => onOpen(app.id)}>
                  <td className="cell-company">
                    <span className="company-icon"><Icon name="building" size={18} /></span>
                    <span>
                      <button className="row-link" type="button" onClick={e => { e.stopPropagation(); onOpen(app.id) }}>{app.company}</button>
                      <span>{app.role}</span>
                    </span>
                  </td>
                  <td><StatusBadge status={app.status} /></td>
                  <td><DeadlinePill pill={pill} /></td>
                  <td><MaterialsPill app={app} /></td>
                  <td className="cell-chevron"><Icon name="right" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Phones: separate cards instead of the table (CSS shows one or the other). */}
        <ul className="application-cards">
          {rows.map(({ app, pill }) => (
            <li key={app.id} className="surface application-card">
              <div className="application-card-top">
                <span className="company-icon"><Icon name="building" size={18} /></span>
                <div className="application-card-name">
                  <h2>{app.company}</h2>
                  <p>{app.role}</p>
                </div>
                <StatusBadge status={app.status} />
              </div>
              <div className="application-card-pills"><DeadlinePill pill={pill} /><MaterialsPill app={app} /></div>
              <div className="application-card-footer">
                <span>Applied {formatShortDate(toDateKey(new Date(app.createdAt)))}</span>
                <button className="text-button" type="button" onClick={() => onOpen(app.id)} aria-label={`Open ${app.company}`}>Open</button>
              </div>
            </li>
          ))}
        </ul>
        </>
      )}
    </main>
  )
}
