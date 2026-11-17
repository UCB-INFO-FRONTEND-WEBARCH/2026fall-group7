// ============================================================================
// "Fetch details" from a job posting link: placeholder for the LLM step
// ----------------------------------------------------------------------------
// The Add application modal already calls fetchJobDetails(url) and handles
// all three outcomes from the mockups: loading ("Fetching…"), success (fills
// the form), and failure ("We couldn't read this link").
//
// STATUS: not assigned yet; the team will decide whether to build it (see README).
//
// If built: the browser can't do this alone. Job sites block direct
// requests (CORS), and an LLM API key must never be in front-end code. So:
//   1. Make a small serverless function (e.g. Vercel / Netlify) that takes the
//      URL, fetches the page, and asks the LLM to return JSON.
//   2. Replace the body below with:
//        const res = await fetch('/api/job-details', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ url }) })
//        if (!res.ok) throw new Error('Could not read link')
//        return await res.json()
//
// Must resolve to:  { company, role, deadline: 'YYYY-MM-DD' or '', description }
// Throw an error if the page can't be read; the modal shows the error banner.
// ============================================================================

export async function fetchJobDetails(url) {
  // Placeholder: wait a moment so the "Fetching…" state is visible, then fail,
  // which sends the user to manual entry with their URL kept.
  await new Promise(resolve => setTimeout(resolve, 900))
  throw new Error(`Link reading isn't set up yet (${url})`)
}
