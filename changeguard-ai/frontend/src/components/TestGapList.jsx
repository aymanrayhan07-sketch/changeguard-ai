import { useState } from 'react'
import SeverityBadge from './SeverityBadge'
import StatusBadge from './StatusBadge'
import Card from './Card'

/**
 * TestGapList — renders the identified test gaps with expandable detail.
 */
export default function TestGapList({ gaps = [] }) {
  const [expanded, setExpanded] = useState(null)

  if (gaps.length === 0) {
    return <Card title="Test Gaps"><p className="text-sm text-gray-500">No gaps identified.</p></Card>
  }

  return (
    <Card title={`Test Gaps (${gaps.length})`}>
      <ul className="space-y-2">
        {gaps.map((gap) => (
          <li key={gap.id} className="bg-gray-800/50 rounded-md overflow-hidden">
            <button
              className="w-full flex items-center gap-3 px-3 py-2.5 text-left hover:bg-gray-800 transition-colors"
              onClick={() => setExpanded(expanded === gap.id ? null : gap.id)}
            >
              {/* Chevron */}
              <svg className={`w-3.5 h-3.5 text-gray-500 shrink-0 transition-transform ${expanded === gap.id ? 'rotate-90' : ''}`}
                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
              <span className="flex-1 text-sm text-gray-200">{gap.title}</span>
              {gap.defectFound && (
                <span className="text-xs bg-red-900/60 text-red-300 border border-red-700 px-2 py-0.5 rounded font-semibold mr-1">
                  Defect
                </span>
              )}
              <SeverityBadge severity={gap.severity} />
            </button>

            {expanded === gap.id && (
              <div className="px-4 pb-3 pt-1 border-t border-gray-700 space-y-1.5">
                <p className="text-xs text-gray-400 leading-relaxed">{gap.description}</p>
                <p className="text-xs font-mono text-blue-400">{gap.affectedModule}</p>
              </div>
            )}
          </li>
        ))}
      </ul>
    </Card>
  )
}
