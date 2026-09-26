/**
 * SeverityBadge — renders a colored pill for high / medium / low severity.
 */
export default function SeverityBadge({ severity }) {
  const map = {
    high:   'bg-red-900/60 text-red-300 border border-red-700',
    medium: 'bg-yellow-900/60 text-yellow-300 border border-yellow-700',
    low:    'bg-blue-900/60 text-blue-300 border border-blue-700',
  }
  const cls = map[severity] ?? map.low
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold uppercase tracking-wide ${cls}`}>
      {severity}
    </span>
  )
}
