/**
 * AnalysisProgress — animated pipeline stage tracker.
 * Shows each stage with a check/spinner/idle icon.
 * Reflects the complete IBM Bob validated workflow:
 *   Code Change → Impact Analysis → Test Gap Analysis →
 *   Regression Test Generation → Test Execution → Defect Discovery →
 *   Fix Validation → Final Validation
 */
const STAGES = [
  { key: 'change',      label: 'Code Change Analysis' },
  { key: 'impact',      label: 'Change Impact Analysis' },
  { key: 'gaps',        label: 'Test Gap Analysis' },
  { key: 'generation',  label: 'Regression Test Generation' },
  { key: 'execution',   label: 'Test Execution' },
  { key: 'defects',     label: 'Defect Discovery' },
  { key: 'fix',         label: 'Fix Validation' },
  { key: 'final',       label: 'Final Validation' },
]

export default function AnalysisProgress({ currentStage, isComplete }) {
  // currentStage is the index (0-based) of the stage actively running
  // isComplete means all stages finished
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-lg p-5">
      <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4">
        Analysis Pipeline
      </h2>
      <div className="space-y-2">
        {STAGES.map((stage, idx) => {
          const isDone    = isComplete || idx < currentStage
          const isActive  = !isComplete && idx === currentStage
          const isPending = !isComplete && idx > currentStage

          return (
            <div key={stage.key}
              className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors
                ${isActive  ? 'bg-blue-950 border border-blue-800' : ''}
                ${isDone    ? 'opacity-80' : ''}
                ${isPending ? 'opacity-40' : ''}
              `}
            >
              {/* Icon */}
              <div className="w-5 h-5 shrink-0 flex items-center justify-center">
                {isDone && (
                  <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                )}
                {isActive && (
                  <svg className="animate-spin w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                )}
                {isPending && (
                  <span className="w-2 h-2 rounded-full bg-gray-600 block" />
                )}
              </div>

              {/* Label */}
              <span className={`text-sm ${isActive ? 'text-blue-300 font-medium' : isDone ? 'text-gray-300' : 'text-gray-500'}`}>
                {stage.label}
              </span>

              {/* Stage number */}
              <span className="ml-auto text-xs text-gray-600">{idx + 1}/{STAGES.length}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
