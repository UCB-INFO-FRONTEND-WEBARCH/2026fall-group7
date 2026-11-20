import { useRef, useState } from 'react'
import Icon from './Icon'
import Modal from './Modal'
import { DEFAULT_MATERIALS } from '../data/constants'
import { makeId } from '../data/ids'
import '../styles/form.css'

// One form, two uses:
//   mode="add":  details + materials checklist.
//   mode="edit": just the details (no materials: those are edited on the detail page).
// The form keeps its own field values (a "controlled component") and only hands
// a finished, validated object to onSave. App decides what to do with it.
export default function ApplicationFormModal({ mode = 'add', initial, onSave, onClose }) {
  const isEdit = mode === 'edit'
  const [fields, setFields] = useState({
    link: initial?.link || '',
    company: initial?.company || '',
    role: initial?.role || '',
    deadline: initial?.deadline || '',
    description: initial?.description || '',
  })
  const [errors, setErrors] = useState({}) // { company: '...', role: '...' }

  // Materials checklist (Add only). Checked = this job needs it.
  const [materials, setMaterials] = useState(() => DEFAULT_MATERIALS.map(label => ({ id: makeId('mat'), label, included: true })))
  const [editingId, setEditingId] = useState(null)
  const [draft, setDraft] = useState('')

  const companyRef = useRef(null)
  const roleRef = useRef(null)

  const setField = name => e => {
    setFields({ ...fields, [name]: e.target.value })
    if (errors[name]) setErrors({ ...errors, [name]: '' }) // clear the error as soon as they type
  }

  // ----- Materials checklist -----
  const toggleMaterial = id => setMaterials(materials.map(m => (m.id === id ? { ...m, included: !m.included } : m)))
  const removeMaterial = id => setMaterials(materials.filter(m => m.id !== id))
  function startEditing(material) { setEditingId(material.id); setDraft(material.label) }
  function startAdding() { setEditingId('new'); setDraft('') }
  function saveEditing() {
    const label = draft.trim()
    if (label && editingId === 'new') setMaterials([...materials, { id: makeId('mat'), label, included: true }])
    if (label && editingId !== 'new') setMaterials(materials.map(m => (m.id === editingId ? { ...m, label } : m)))
    setEditingId(null)
  }
  const editKeys = e => {
    if (e.key === 'Enter') { e.preventDefault(); saveEditing() }
    if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); setEditingId(null) } // don't close the modal
  }

  // ----- Save -----
  function handleSubmit(e) {
    e.preventDefault()
    const newErrors = {}
    if (!fields.company.trim()) newErrors.company = 'Company is required.'
    if (!fields.role.trim()) newErrors.role = 'Role is required.'
    setErrors(newErrors)
    if (newErrors.company) return companyRef.current.focus()
    if (newErrors.role) return roleRef.current.focus()

    onSave({
      ...fields,
      company: fields.company.trim(),
      role: fields.role.trim(),
      materials: materials.filter(m => m.included).map(m => m.label),
    })
  }

  const included = materials.filter(m => m.included).length

  const footer = (
    <>
      <button className="button button-outline" type="button" onClick={onClose}>Cancel</button>
      <button className="button button-primary" type="submit" form="application-form">{isEdit ? 'Save changes' : 'Save application'}</button>
    </>
  )

  return (
    <Modal wide title={isEdit ? 'Edit details' : 'Add application'} onClose={onClose} footer={footer}>
      <form id="application-form" className="form-stack" onSubmit={handleSubmit} noValidate>
        <div className="form-row">
          <div className="form-field">
            <label htmlFor="company">Company *</label>
            <input id="company" ref={companyRef} className="text-input" placeholder="e.g. Notion" value={fields.company} onChange={setField('company')} aria-invalid={Boolean(errors.company)} autoFocus={!isEdit} />
            {errors.company && <p className="field-message"><Icon name="alert" size={14} />{errors.company}</p>}
          </div>
          <div className="form-field">
            <label htmlFor="role">Role *</label>
            <input id="role" ref={roleRef} className="text-input" placeholder="e.g. Frontend Engineer Intern" value={fields.role} onChange={setField('role')} aria-invalid={Boolean(errors.role)} />
            {errors.role && <p className="field-message"><Icon name="alert" size={14} />{errors.role}</p>}
          </div>
        </div>

        <div className="form-field">
          <label htmlFor="deadline">Deadline</label>
          <input id="deadline" className="text-input" type="date" value={fields.deadline} onChange={setField('deadline')} />
        </div>

        <div className="form-field">
          <label htmlFor="job-url">Job posting URL</label>
          <div className="url-input">
            <Icon name="link" />
            <input id="job-url" type="url" placeholder="https://…" value={fields.link} onChange={setField('link')} />
          </div>
        </div>

        <div className="form-field">
          <label htmlFor="description">Job description</label>
          <textarea id="description" className="text-input" rows={4} placeholder="Paste the job description…" value={fields.description} onChange={setField('description')} />
        </div>

        {!isEdit && (
          <fieldset className="materials-fieldset">
            <legend className="materials-heading">
              <span>Materials checklist</span>
              <small>{included === materials.length ? `${included} included` : `${included} of ${materials.length} included`}</small>
            </legend>
            <p className="field-hint">Auto-generated defaults. Uncheck to remove, rename, or add your own.</p>
            <ul>
              {materials.map(material => (
                <li key={material.id} className="form-check-row">
                  {editingId === material.id ? (
                    <>
                      <input className="text-input" aria-label="Item name" value={draft} autoFocus onChange={e => setDraft(e.target.value)} onKeyDown={editKeys} />
                      <button className="text-button" type="button" onClick={saveEditing}>Save</button>
                      <button className="icon-button" type="button" aria-label="Cancel" onClick={() => setEditingId(null)}><Icon name="close" /></button>
                    </>
                  ) : (
                    <>
                      <label className={`check ${material.included ? '' : 'is-excluded'}`}>
                        <input type="checkbox" checked={material.included} onChange={() => toggleMaterial(material.id)} />
                        <span>{material.label}</span>
                      </label>
                      <button className="icon-button" type="button" aria-label={`Rename ${material.label}`} onClick={() => startEditing(material)}><Icon name="pencil" /></button>
                      <button className="icon-button" type="button" aria-label={`Remove ${material.label}`} onClick={() => removeMaterial(material.id)}><Icon name="trash" /></button>
                    </>
                  )}
                </li>
              ))}
              {editingId === 'new' && (
                <li className="form-check-row">
                  <input className="text-input" aria-label="New item name" placeholder="e.g. Writing sample" value={draft} autoFocus onChange={e => setDraft(e.target.value)} onKeyDown={editKeys} />
                  <button className="text-button" type="button" onClick={saveEditing}>Save</button>
                  <button className="icon-button" type="button" aria-label="Cancel" onClick={() => setEditingId(null)}><Icon name="close" /></button>
                </li>
              )}
            </ul>
            {editingId !== 'new' && <button className="add-row-button" type="button" onClick={startAdding}><Icon name="plus" />Add custom item</button>}
          </fieldset>
        )}
      </form>
    </Modal>
  )
}
