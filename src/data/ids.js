// Unique ids for new records, e.g. makeId('evt') -> 'evt-lx3k9a-4f2z'.
export const makeId = prefix => `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`
