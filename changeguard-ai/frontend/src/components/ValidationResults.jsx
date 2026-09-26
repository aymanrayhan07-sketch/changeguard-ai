import Card from './Card'

/**
 * ValidationResults — before/after test run summary with pass/fail comparison.
 *
 * Shows the complete 3-phase story:
 *   Phase 1 (before): initial run  — 83 tests, 1 failing
 *   Phase 3 (after):  final run    — 89 tests, 0 failing
 *   Plus a "what changed" callout for clarity
 */
export default function ValidationResults({ validation }) {
  if (!validation) return null

  const { before, after } = validation

  return (
    <Card title="Validation Results">
      <div className="grid grid-cols-2 gap-4">
        {/* Before */}
        <div className="bg-gray-800/60 rounded-md p-4">
          <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold mb-3">
            Phase 1 — Initial Run
          </p>
          <div className="space-y-2">
            <Stat label="Total Tests" value={before.totalTests} />
            <Stat label="Passed" value={before.passed} color="text-green-400" />
            <Stat
              label="Failed"
              value={before.failed}
              color={before.failed > 0 ? 'text-red-400' : 'text-gray-300'}
            />
          </div>
          {before.failingTests?.length > 0 && (
            <div className="mt-3 pt-3 border-t border-gray-700">
              <p className="text-xs text-gray-400 mb-1.5 font-medium">Failing tests:</p>
              {before.failingTests.map((t, i) => (
                <div key={i} className="mb-2">
                  <p className="text-xs text-red-300 font-mono leading-snug">{t.name}</p>
                  {t.error && (
                    <pre className="text-xs text-gray-500 font-mono mt-0.5 whitespace-pre-wrap">
                      {t.error}
                    </pre>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* After */}
        <div className="bg-gray-800/60 rounded-md p-4">
          <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold mb-3">
            Phase 3 — Final Run (Both Fixes Applied)
          </p>
          <div className="space-y-2">
            <Stat label="Total Tests" value={after.totalTests} />
            <Stat label="Passed" value={after.passed} color="text-green-400" />
            <Stat
              label="Failed"
              value={after.failed}
              color={after.failed > 0 ? 'text-red-400' : 'text-gray-300'}
            />
            {after.testSuitesPassed != null && (
              <Stat label="Suites Passed" value={after.testSuitesPassed} color="text-green-400" />
            )}
          </div>

          <div className="mt-3 pt-3 border-t border-gray-700 space-y-1.5">
            {/* Net new tests — only shown when the count actually grew */}
            {after.totalTests > before.totalTests && (
              <div className="flex items-center gap-1.5 text-xs text-gray-400">
                <svg className="w-3.5 h-3.5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                <span>
                  Test count:{' '}
                  <span className="text-gray-300 font-semibold">{before.totalTests}</span>
                  {' → '}
                  <span className="text-purple-300 font-semibold">{after.totalTests}</span>
                  {' '}(+{after.totalTests - before.totalTests} across both analysis cycles)
                </span>
              </div>
            )}

            {/* All-clear banner */}
            {after.failed === 0 && (
              <div className="flex items-center gap-1.5 text-green-400">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
                <span className="text-xs font-semibold">All tests passing — ALL GREEN</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mid-banner: what happened between the two phases */}
      <div className="mt-4 bg-gray-800/40 rounded-md border border-gray-700 px-4 py-3">
        <p className="text-xs font-semibold text-gray-300 mb-2">Between Phase 1 and Final — two defect cycles</p>
        <ol className="space-y-1.5 text-xs text-gray-400 list-none pl-0">
          <li className="flex items-start gap-2">
            <span className="mt-0.5 w-4 h-4 rounded-full bg-red-900/60 text-red-300 text-xs flex items-center justify-center shrink-0 font-bold">1</span>
            <span><strong className="text-gray-300">Defect #1 fixed</strong> — stock-restore added to CANCELLED payment-failure branch in <span className="font-mono text-blue-400">orderService.js</span>. Repository passed 83/83.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-0.5 w-4 h-4 rounded-full bg-orange-900/60 text-orange-300 text-xs flex items-center justify-center shrink-0 font-bold">2</span>
            <span><strong className="text-gray-300">Deeper analysis</strong> — <span className="font-mono text-blue-400">cancelOrder()</span> gap discovered; cancelling a confirmed order did not restore product stock. Additional regression coverage was generated for the cancellation scenarios.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-0.5 w-4 h-4 rounded-full bg-red-900/60 text-red-300 text-xs flex items-center justify-center shrink-0 font-bold">3</span>
            <span><strong className="text-gray-300">Defect #2 fixed</strong> — stock-restore loop added to <span className="font-mono text-blue-400">cancelOrder()</span>. Final suite: 89/89 passed, 10 suites.</span>
          </li>
        </ol>
      </div>
    </Card>
  )
}

function Stat({ label, value, color = 'text-gray-200' }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs text-gray-400">{label}</span>
      <span className={`text-sm font-bold tabular-nums ${color}`}>{value}</span>
    </div>
  )
}
