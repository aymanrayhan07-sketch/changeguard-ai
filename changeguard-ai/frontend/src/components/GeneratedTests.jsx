import { useState } from 'react'
import SeverityBadge from './SeverityBadge'
import StatusBadge from './StatusBadge'
import Card from './Card'

/**
 * GeneratedTests — shows each AI-generated regression test stub with
 * syntax-highlighted code expandable on click.
 */
export default function GeneratedTests({ tests = [] }) {
  const [expanded, setExpanded] = useState(null)

  if (tests.length === 0) {
    return <Card title="Generated Tests"><p className="text-sm text-gray-500">No tests generated.</p></Card>
  }

  return (
    <Card title={`Generated Tests (${tests.length})`}>
      <ul className="space-y-2">
        {tests.map((t) => (
          <li key={t.gapId} className="bg-gray-800/50 rounded-md overflow-hidden">
            <button
              className="w-full flex items-center gap-3 px-3 py-2.5 text-left hover:bg-gray-800 transition-colors"
              onClick={() => setExpanded(expanded === t.gapId ? null : t.gapId)}
            >
              <svg className={`w-3.5 h-3.5 text-gray-500 shrink-0 transition-transform ${expanded === t.gapId ? 'rotate-90' : ''}`}
                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
              <span className="flex-1 text-sm text-gray-200">{t.title}</span>
              <StatusBadge status={t.status} />
              <span className="ml-2"><SeverityBadge severity={t.severity} /></span>
            </button>

            {expanded === t.gapId && (
              <div className="border-t border-gray-700">
                <p className="text-xs text-gray-500 px-4 py-1.5 font-mono">{t.affectedModule}</p>
                <pre className="text-xs text-green-300 bg-gray-950 px-4 py-3 overflow-x-auto leading-relaxed">
                  <code>{t.testCode}</code>
                </pre>
              </div>
            )}
          </li>
        ))}
      </ul>
    </Card>
  )
}
