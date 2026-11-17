import { useEffect } from 'react'
import Icon from './Icon'
import '../styles/modal.css'

// The dark message at the bottom ("Application saved · Notion, Frontend Engineer Intern  View").
// `detail` is extra text that phones hide to keep it short.
// Disappears on its own after a few seconds.
export default function Toast({ toast, onDismiss }) {
  useEffect(() => {
    if (!toast) return
    const timer = setTimeout(onDismiss, 6000)
    return () => clearTimeout(timer) // a new toast restarts the timer
  }, [toast, onDismiss])

  return (
    <div className="toast-region" role="status" aria-live="polite">
      {toast && (
        <div className="toast">
          <Icon name={toast.error ? 'alert' : 'check'} size={16} />
          <p>{toast.message}{toast.detail && <span className="toast-detail">{toast.detail}</span>}</p>
          {toast.action && (
            <button type="button" onClick={() => { toast.action.onClick(); onDismiss() }}>{toast.action.label}</button>
          )}
        </div>
      )}
    </div>
  )
}
