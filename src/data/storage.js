// The ONLY file that talks to localStorage. If the team ever switches to a
// real database, this is the file to change; nothing else needs to know.

import { createSampleData } from './sampleData'

const STORAGE_KEY = 'group7.applicationTracker.v1'

// While building, start with sample data so screens aren't empty.
// Set to false before the demo so first-time users see the Welcome screen.
const START_WITH_SAMPLE_DATA = true

export function loadData() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY))
    if (saved && Array.isArray(saved.applications) && Array.isArray(saved.events)) return saved
  } catch (error) {
    console.warn('Could not read saved applications', error)
  }
  // Nothing saved yet (or the saved data was broken).
  return START_WITH_SAMPLE_DATA ? createSampleData() : { applications: [], events: [] }
}

export function saveData(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch (error) {
    // Happens if storage is full (~5MB) or blocked, e.g. some private windows.
    console.warn('Could not save applications', error)
  }
}
