import Card from './Card'

/**
 * ChangeInput — change description textarea + repository display + analyze button.
 */
export default function ChangeInput({ value, onChange, onAnalyze, onReset, isAnalyzing, isComplete }) {
  return (
    <Card title="Change Description">
      <div className="space-y-4">
        {/* Repository info */}
        <div className="flex items-center gap-3 bg-gray-800 rounded-md px-4 py-2.5">
          {/* Folder icon */}
          <svg className="w-4 h-4 text-blue-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v8.25m19.5 0A2.25 2.25 0 0119.5 18h-15a2.25 2.25 0 01-2.25-2.25m19.5 0v.375a1.125 1.125 0 01-1.125 1.125H2.625A1.125 1.125 0 011.5 18.375V6" />
          </svg>
          <div>
            <p className="text-xs text-gray-400">Repository</p>
            <p className="text-sm font-mono font-medium text-white">change-impact-demo</p>
          </div>
          <div className="ml-auto">
            <span className="text-xs bg-blue-900/50 text-blue-300 border border-blue-800 px-2 py-0.5 rounded">
              Node.js · Jest
            </span>
          </div>
        </div>

        {/* Text area */}
        <div>
          <label className="block text-xs text-gray-400 mb-1.5">
            Describe the code change you made
          </label>
          <textarea
            className="w-full h-28 bg-gray-800 border border-gray-700 rounded-md px-4 py-3 text-sm text-gray-100
                       placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500
                       resize-none font-mono"
            placeholder="Added discount-code support to payment processing."
            value={value}
            onChange={(e) => onChange(e.target.value)}
            disabled={isAnalyzing}
          />
        </div>

        {/* Action buttons */}
        <div className={`flex gap-3 ${isComplete ? 'flex-row' : ''}`}>
          {/* Analyze button */}
          <button
            onClick={onAnalyze}
            disabled={isAnalyzing || !value.trim()}
            className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500
                       disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed
                       text-white font-semibold py-2.5 px-4 rounded-md transition-colors text-sm"
          >
            {isAnalyzing ? (
              <>
                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                Analyzing…
              </>
            ) : (
              <>
                {/* Lightning icon */}
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                </svg>
                Analyze Change
              </>
            )}
          </button>

          {/* New Analysis button — only shown after a completed run */}
          {isComplete && (
            <button
              onClick={onReset}
              disabled={isAnalyzing}
              className="flex items-center justify-center gap-2 bg-gray-700 hover:bg-gray-600
                         disabled:opacity-50 disabled:cursor-not-allowed
                         text-gray-200 font-semibold py-2.5 px-4 rounded-md transition-colors text-sm whitespace-nowrap"
            >
              {/* Refresh icon */}
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
              </svg>
              New Analysis
            </button>
          )}
        </div>
      </div>
    </Card>
  )
}
