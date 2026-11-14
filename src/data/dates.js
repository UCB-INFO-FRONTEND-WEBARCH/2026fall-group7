// Small date helpers. Dates are stored as 'YYYY-MM-DD' strings ("date keys")
// and times as 'HH:MM', so they save cleanly to localStorage and are easy to compare.

export function toDateKey(date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export const todayKey = () => toDateKey(new Date())

// Parse as a LOCAL date (new Date('2026-11-12') would be UTC and can shift a day).
export function parseDateKey(key) {
  const [y, m, d] = key.split('-').map(Number)
  return new Date(y, m - 1, d)
}

export function addDays(key, days) {
  const date = parseDateKey(key)
  date.setDate(date.getDate() + days)
  return toDateKey(date)
}

// Whole days from one date key to another (negative if `to` is earlier).
export const daysBetween = (from, to) => Math.round((parseDateKey(to) - parseDateKey(from)) / 86400000)

// The Sunday that starts the week containing `key` (calendar weeks start on Sunday).
export function startOfWeek(key) {
  const date = parseDateKey(key)
  date.setDate(date.getDate() - date.getDay())
  return toDateKey(date)
}

const format = (key, options) => parseDateKey(key).toLocaleDateString('en-US', options)

export const formatMonthShort = key => format(key, { month: 'short' }) // "Nov"
export const formatShortDate = key => format(key, { month: 'short', day: 'numeric' }) // "Nov 8"
export const formatWeekdayDate = key => format(key, { weekday: 'short', month: 'short', day: 'numeric' }) // "Sat, Nov 8"
export const formatMonthYear = key => format(key, { month: 'long', year: 'numeric' }) // "November 2026"

// '14:00' -> '2:00 PM'
export function formatTime(time) {
  if (!time) return ''
  const [h, m] = time.split(':').map(Number)
  const hour = h % 12 || 12
  return `${hour}:${String(m).padStart(2, '0')} ${h < 12 ? 'AM' : 'PM'}`
}

// 0 -> 'today', 1 -> 'tomorrow', 3 -> 'in 3 days'
export function relativeDays(days) {
  if (days === 0) return 'today'
  if (days === 1) return 'tomorrow'
  return `in ${days} days`
}
