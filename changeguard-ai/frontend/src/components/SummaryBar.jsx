/**
 * SummaryBar — top-line KPI strip shown once analysis is complete.
 * All numbers reflect the COMPLETE validated workflow (initial + deeper analysis cycles).
 */
export default function SummaryBar({ summary }) {
  if (!summary) return null

  const netNewTests = summary.testsAfter - summary.testsBefore

  const stats = [
    {
      label: 'Files Changed',
      value: summary.filesChanged,
      color: 'text-blue-400',
    },
    {
      label: 'Files Impacted',
      value: summary.filesImpacted,
      color: 'text-yellow-400',
    },
    {
      label: 'Test Gaps',
      value: summary.testGapsFound,
      color: 'text-orange-400',
      // These 6 gaps belong to the initial analysis cycle only.
      // The cancelOrder() gap was discovered in the subsequent deeper analysis.
      note: 'initial cycle',
    },
    {
      label: 'Tests Generated',
      value: summary.testsGenerated,
      color: 'text-purple-400',
      // Matches the 6 initial-cycle gaps; additional coverage was added in the deeper cycle.
      note: 'initial cycle',
    },
    {
      label: 'Defects Found',
      value: summary.defectsFound,
      color: summary.defectsFound > 0 ? 'text-red-400' : 'text-green-400',
    },
    {
      label: 'Tests Before',
      value: summary.testsBefore,
      color: 'text-gray-300',
    },
    {
      label: 'Tests After',
      value: summary.testsAfter,
      color: 'text-gray-300',
      // Only highlight growth when tests were actually added
      note: netNewTests > 0 ? `+${netNewTests} added` : null,
      noteColor: 'text-purple-400',
    },
    {
      label: 'Failing After',
      value: summary.failedAfter,
      color: summary.failedAfter > 0 ? 'text-red-400' : 'text-green-400',
      highlight: summary.failedAfter === 0,
    },
  ]

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
      <div className="flex items-center gap-2 mb-3">
        <svg className="w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
        </svg>
        <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">Summary</h2>

        {/* Final-state indicator */}
        {summary.failedAfter === 0 && (
          <span className="ml-auto flex items-center gap-1.5 text-xs font-semibold text-green-400 bg-green-950/50 border border-green-800 rounded-full px-3 py-0.5">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
            ALL GREEN
          </span>
        )}
      </div>

      <div className="grid grid-cols-4 gap-3">
        {stats.map((s) => (
          <div
            key={s.label}
            className={`rounded-md px-3 py-2.5 text-center ${
              s.highlight
                ? 'bg-green-950/40 border border-green-800'
                : 'bg-gray-800/60'
            }`}
          >
            <p className={`text-2xl font-bold tabular-nums ${s.color}`}>{s.value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
            {/* Optional sub-note — only rendered when present */}
            {s.note && (
              <p className={`text-xs mt-0.5 ${s.noteColor ?? 'text-gray-600'}`}>{s.note}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
