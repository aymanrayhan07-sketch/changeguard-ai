/**
 * Header — application title bar with status indicator.
 */
export default function Header({ status = 'Ready' }) {
  const statusColor = {
    Ready:     'bg-green-500',
    Analyzing: 'bg-yellow-400 animate-pulse',
    Error:     'bg-red-500',
  }[status] ?? 'bg-gray-500'

  return (
    <header className="bg-gray-900 border-b border-gray-800 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            {/* Shield icon */}
            <svg className="w-7 h-7 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
            </svg>
            <h1 className="text-xl font-bold text-white tracking-tight">ChangeGuard AI</h1>
          </div>
          <p className="text-xs text-gray-400 mt-0.5 ml-10">
            Understand the impact. Find the gaps. Validate the change.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className={`w-2.5 h-2.5 rounded-full ${statusColor}`} />
          <span className="text-sm text-gray-300 font-medium">{status}</span>
        </div>
      </div>
    </header>
  )
}
