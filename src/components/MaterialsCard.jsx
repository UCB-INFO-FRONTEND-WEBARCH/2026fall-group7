import { useState } from 'react'
import Icon from './Icon'
import { makeId } from '../data/ids'

// The checklist on the detail page. Every change builds a NEW checklist array
// and hands it to onChange, which saves it on the application.
export default function MaterialsCard({ checklist, onChange }) {
  const [editingId, setEditingId] = useState(null) // which item is being renamed
  const [draft, setDraft] = useState('') // text in the rename / add box
  const [adding, setAdding] = useState(false)

  const done = checklist.filter(item => item.done).length
  const percent = checklist.length ? (done / checklist.length) * 100 : 0

  const toggle = id => onChange(checklist.map(item => (item.id === id ? { ...item, done: !item.done } : item)))
  const remove = id => onChange(checklist.filter(item => item.id !== id))

  function startRename(item) { setAdding(false); setEditingId(item.id); setDraft(item.label) }
  function saveRename() {
    if (draft.trim()) onChange(checklist.map(item => (item.id === editingId ? { ...item, label: draft.trim() } : item)))
    setEditingId(null)
  }
  function startAdd() { setEditingId(null); setAdding(true); setDraft('') }
  function saveAdd() {
    if (draft.trim()) onChange([...checklist, { id: makeId('mat'), label: draft.trim(), done: false }])
    setAdding(false)
  }

  // Enter saves, Escape cancels.
  const keys = save => e => {
    if (e.key === 'Enter') { e.preventDefault(); save() }
    if (e.key === 'Escape') { setEditingId(null); setAdding(false) }
  }

  return (
    <section className="surface detail-card" aria-labelledby="materials-title">
      <div className="card-heading">
        <h2 id="materials-title">Materials</h2>
        <span className="card-meta">{done}/{checklist.length} ready</span>
      </div>
      <div className="progress" role="progressbar" aria-label="Materials ready" aria-valuemin={0} aria-valuemax={checklist.length} aria-valuenow={done}>
        <span style={{ width: `${percent}%` }} />
      </div>

      <ul className="checklist">
        {checklist.map(item => (
          <li key={item.id} className="checklist-row">
            {editingId === item.id ? (
              <>
                <input className="text-input" aria-label="Item name" value={draft} autoFocus onChange={e => setDraft(e.target.value)} onKeyDown={keys(saveRename)} />
                <button className="text-button" type="button" onClick={saveRename}>Save</button>
                <button className="icon-button" type="button" aria-label="Cancel rename" onClick={() => setEditingId(null)}><Icon name="close" /></button>
              </>
            ) : (
              <>
                <label className={`check ${item.done ? 'is-done' : ''}`}>
                  <input type="checkbox" checked={item.done} onChange={() => toggle(item.id)} />
                  <span>{item.label}</span>
                </label>
                <button className="icon-button" type="button" aria-label={`Rename ${item.label}`} onClick={() => startRename(item)}><Icon name="pencil" /></button>
                <button className="icon-button" type="button" aria-label={`Delete ${item.label}`} onClick={() => remove(item.id)}><Icon name="trash" /></button>
              </>
            )}
          </li>
        ))}
        {adding && (
          <li className="checklist-row">
            <input className="text-input" aria-label="New item name" placeholder="e.g. Transcript" value={draft} autoFocus onChange={e => setDraft(e.target.value)} onKeyDown={keys(saveAdd)} />
            <button className="text-button" type="button" onClick={saveAdd}>Save</button>
            <button className="icon-button" type="button" aria-label="Cancel" onClick={() => setAdding(false)}><Icon name="close" /></button>
          </li>
        )}
      </ul>
      {!adding && <button className="add-row-button" type="button" onClick={startAdd}><Icon name="plus" />Add item</button>}
    </section>
  )
}
