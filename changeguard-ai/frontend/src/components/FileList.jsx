import SeverityBadge from './SeverityBadge'
import Card from './Card'

/**
 * FileList — renders a list of changed or impacted files with severity badges.
 */
export default function FileList({ title, files = [], emptyMessage = 'No files.' }) {
  return (
    <Card title={title}>
      {files.length === 0 ? (
        <p className="text-sm text-gray-500">{emptyMessage}</p>
      ) : (
        <ul className="space-y-2">
          {files.map((f, i) => (
            <li key={i} className="flex items-start gap-3 bg-gray-800/50 rounded-md px-3 py-2.5">
              {/* File icon */}
              <svg className="w-4 h-4 text-gray-500 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-mono text-blue-300 truncate">{f.path}</p>
                {f.reason && (
                  <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">{f.reason}</p>
                )}
              </div>
              <SeverityBadge severity={f.severity} />
            </li>
          ))}
        </ul>
      )}
    </Card>
  )
}
