// Small original SVG icons match the mockup's outline style.
// They inherit the surrounding text color; no icon package is required.
export default function Icon({ name, size = 16, className = '' }) {
  const paths = {
    briefcase: <><path d="M8 7V5a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2" /><rect x="4" y="7" width="16" height="13" rx="2" /><path d="M4 12h16M10 12v2h4v-2" /></>,
    home: <><path d="m3 10 9-7 9 7" /><path d="M5 9v11h5v-7h4v7h5V9" /></>,
    calendar: <><rect x="4" y="5" width="16" height="16" rx="2" /><path d="M8 3v4m8-4v4M4 10h16M8 14h2m4 0h2m-8 3h2" /></>,
    timeline: <><path d="M8 6h12M8 12h12M8 18h12" /><path d="M4 6h.01M4 12h.01M4 18h.01" strokeWidth="3" /></>,
    plus: <path d="M12 5v14M5 12h14" />,
    sync: <><path d="M20 7v5h-5M4 17v-5h5" /><path d="M5.5 7a7 7 0 0 1 11.6-2L20 8M4 16l2.9 3A7 7 0 0 0 18.5 17" /></>,
    file: <><path d="M14 3H6a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8z" /><path d="M14 3v5h5" /></>,
    clock: <><circle cx="12" cy="12" r="8" /><path d="M12 7v5l3 2" /></>,
    code: <><path d="m8 8-4 4 4 4m8-8 4 4-4 4m-3-10-2 12" /></>,
    left: <path d="m14 6-6 6 6 6" />,
    right: <path d="m10 6 6 6-6 6" />,
    down: <path d="m6 10 6 6 6-6" />,
    check: <path d="m5 12 5 5 9-10" strokeWidth="2.4" />,
    close: <path d="M6 6l12 12M18 6 6 18" />,
    pencil: <><path d="M4 20h4L19 9l-4-4L4 16z" /><path d="m13.5 6.5 4 4" /></>,
    trash: <><path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13" /></>,
    external: <><path d="M14 4h6v6M20 4l-9 9" /><path d="M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" /></>,
    link: <><path d="M10 14a4 4 0 0 0 5.66 0l3-3a4 4 0 0 0-5.66-5.66l-1 1" /><path d="M14 10a4 4 0 0 0-5.66 0l-3 3a4 4 0 0 0 5.66 5.66l1-1" /></>,
    alert: <><circle cx="12" cy="12" r="8" /><path d="M12 8v5M12 16h.01" /></>,
    search: <><circle cx="11" cy="11" r="6" /><path d="m20 20-4.5-4.5" /></>,
    sort: <><path d="M8 4v16m0 0-3-3m3 3 3-3" /><path d="M16 20V4m0 0-3 3m3-3 3 3" /></>,
    building: <><path d="M5 20V5a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v15" /><path d="M15 10h3a1 1 0 0 1 1 1v9M3 20h18M8 8h1m2 0h1m-4 4h1m2 0h1m-4 4h1m2 0h1" /></>,
    board: <><rect x="4" y="5" width="16" height="14" rx="2" /><path d="M9.5 5v14M14.5 5v14" /></>,
  }

  return (
    <svg className={`icon ${className}`} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      {paths[name] || paths.briefcase}
    </svg>
  )
}
