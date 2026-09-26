/**
 * Card — generic surface container used across all dashboard sections.
 */
export default function Card({ title, children, className = '' }) {
  return (
    <div className={`bg-gray-900 border border-gray-800 rounded-lg ${className}`}>
      {title && (
        <div className="px-5 py-3 border-b border-gray-800">
          <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">{title}</h2>
        </div>
      )}
      <div className="p-5">{children}</div>
    </div>
  )
}
