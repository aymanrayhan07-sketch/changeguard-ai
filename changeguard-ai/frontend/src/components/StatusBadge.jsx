/**
 * StatusBadge — renders a colored pill for a status string.
 * Used for test/defect status labels.
 */
export default function StatusBadge({ status }) {
  const map = {
    fixed:             'bg-green-900/60 text-green-300 border border-green-700',
    defect_exposed:    'bg-red-900/60 text-red-300 border border-red-700',
    confirmed_correct: 'bg-green-900/60 text-green-300 border border-green-700',
    PASS:              'bg-green-900/60 text-green-300 border border-green-700',
    FAIL:              'bg-red-900/60 text-red-300 border border-red-700',
  }
  const label = {
    fixed:             'Fixed',
    defect_exposed:    'Defect Exposed',
    confirmed_correct: 'Confirmed Correct',
    PASS:              'Pass',
    FAIL:              'Fail',
  }
  const cls = map[status] ?? 'bg-gray-800 text-gray-400 border border-gray-700'
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold ${cls}`}>
      {label[status] ?? status}
    </span>
  )
}
