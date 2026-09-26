import StatusBadge from './StatusBadge'
import Card from './Card'

/**
 * DefectReport — lists any defects found during validation.
 */
export default function DefectReport({ defects = [] }) {
  return (
    <Card title={`Defects Found (${defects.length})`}>
      {defects.length === 0 ? (
        <div className="flex items-center gap-2 text-green-400">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
          </svg>
          <span className="text-sm font-medium">No defects found.</span>
        </div>
      ) : (
        <ul className="space-y-3">
          {defects.map((d) => (
            <li key={d.id} className="bg-red-950/40 border border-red-900/60 rounded-md px-4 py-3 space-y-1.5">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-red-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                </svg>
                <span className="text-sm font-semibold text-red-300">{d.title}</span>
                <span className="ml-auto"><StatusBadge status={d.status} /></span>
              </div>
              <p className="text-xs font-mono text-blue-400">{d.file}</p>
              <p className="text-xs text-gray-300 leading-relaxed">{d.description}</p>
              {d.fix && (
                <div className="bg-green-950/40 border border-green-900/50 rounded px-3 py-2 mt-1">
                  <p className="text-xs text-gray-400 font-semibold mb-0.5">Fix applied:</p>
                  <p className="text-xs text-green-300 leading-relaxed">{d.fix}</p>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </Card>
  )
}
