import { useEffect, useRef } from 'react'
import Icon from './Icon'
import '../styles/modal.css'

// Reusable popup from the design system: title, close X, description,
// optional content (children), and a footer of buttons.
// Uses the browser's <dialog> element, which handles focus and the Escape key for us.
//
// Usage:
//   {open && <Modal title="Delete application?" description="..." onClose={...} footer={<>buttons</>} />}
// `wide` makes it 560px (the Add / Edit form); `description` can be text or JSX.
export default function Modal({ title, description, children, footer, onClose, wide = false }) {
  const dialogRef = useRef(null)

  // Open as a true modal when it appears; close when it's removed.
  useEffect(() => {
    const dialog = dialogRef.current
    dialog.showModal()
    return () => dialog.close()
  }, [])

  return (
    <dialog
      ref={dialogRef}
      className={`modal ${wide ? 'modal-wide' : ''}`}
      aria-labelledby="modal-title"
      // Escape key: let React decide (via onClose) instead of the browser closing it.
      onCancel={e => { e.preventDefault(); onClose() }}
      // Clicking the gray scrim (outside the white box) closes it.
      onClick={e => { if (e.target === dialogRef.current) onClose() }}
    >
      <div className="modal-box">
        <div className="modal-header">
          <h2 id="modal-title">{title}</h2>
          <button className="icon-button" type="button" aria-label="Close" onClick={onClose}><Icon name="close" /></button>
        </div>
        {description && <div className="modal-description">{description}</div>}
        {children && <div className="modal-content">{children}</div>}
        {footer && <div className="modal-footer">{footer}</div>}
      </div>
    </dialog>
  )
}
