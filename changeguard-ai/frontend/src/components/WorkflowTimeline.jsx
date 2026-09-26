/**
 * WorkflowTimeline — full narrative of the IBM Bob change-impact workflow.
 *
 * Displays the complete validated workflow from our controlled
 * change-impact-demo demonstration:
 *
 *   CODE CHANGE → IMPACT ANALYSIS → TEST GAP ANALYSIS →
 *   REGRESSION TEST GENERATION → TEST EXECUTION → DEFECT DISCOVERY →
 *   FIX VALIDATION → FINAL VALIDATION
 */

const STEPS = [
  {
    id: 1,
    phase: 'CODE CHANGE',
    color: 'blue',
    icon: 'code',
    title: 'Discount-code support added',
    detail: 'Developer added discount-code support to the payment and order flow.',
    files: [
      'src/config/constants.js',
      'src/modules/payments/paymentService.js',
      'src/modules/orders/orderService.js',
    ],
  },
  {
    id: 2,
    phase: 'IMPACT ANALYSIS',
    color: 'yellow',
    icon: 'impact',
    title: 'Cascading impact mapped',
    detail: '3 files changed · 6 files impacted — cart, notifications, routes and docs all touched by the change.',
  },
  {
    id: 3,
    phase: 'INITIAL TEST GAP ANALYSIS',
    color: 'orange',
    icon: 'gaps',
    title: '6 test gaps identified',
    detail: '6 untested paths found in the discount-code change: stock-restore on payment failure, refund amount precision, float rounding, empty-code edge case, code bleed between orders, and cart preservation on failure.',
  },
  {
    id: 4,
    phase: 'INITIAL REGRESSION TEST GENERATION',
    color: 'purple',
    icon: 'tests',
    title: '6 regression tests generated',
    detail: 'One regression test per identified gap — covering stock restore, refund amounts, float precision, edge cases, discount isolation, and cart preservation.',
  },
  {
    id: 5,
    phase: 'TEST EXECUTION — INITIAL',
    color: 'red',
    icon: 'run',
    title: '1 test failed out of 83',
    detail: 'First defect exposed: stock not restored after failed discounted payment.',
    metric: { label: 'Result', value: '82 / 83 passed · 1 failed', isFailure: true },
    error: 'Expected stock: 10  ·  Received: 7',
  },
  {
    id: 6,
    phase: 'DEFECT DISCOVERY — #1',
    color: 'red',
    icon: 'bug',
    title: 'placeOrder() CANCELLED branch missing stock restore',
    detail: 'placeOrder() decremented stock before processPayment(). When payment failed, the CANCELLED branch had no stock-restore logic — inventory left permanently reduced.',
    fix: 'Fix: added items.forEach() in the CANCELLED else-branch to restore each item\'s quantity.',
  },
  {
    id: 7,
    phase: 'DEEPER IMPACT ANALYSIS',
    color: 'orange',
    icon: 'search',
    title: 'Second regression gap discovered: cancelOrder()',
    detail: 'After Defect #1 was fixed and 83/83 tests passed, deeper analysis of the cancellation path revealed cancelOrder() never called productService.updateProduct() to restore stock. Additional regression coverage was generated for the cancellation scenarios.',
  },
  {
    id: 8,
    phase: 'DEFECT DISCOVERY — #2',
    color: 'red',
    icon: 'bug',
    title: 'cancelOrder() permanently reduced inventory',
    detail: 'Cancelling a confirmed order set status to CANCELLED but left the reserved stock permanently deducted. Every cancellation quietly corrupted inventory.',
    fix: 'Fix: added stock-restore loop in cancelOrder() for each order item.',
  },
  {
    id: 9,
    phase: 'FINAL VALIDATION',
    color: 'green',
    icon: 'pass',
    title: 'All tests GREEN — 89 / 89',
    detail: 'Both defects fixed. Test count grew from 83 → 89: 6 initial regression tests plus additional coverage added during the deeper cancelOrder() analysis cycle. All 10 suites pass.',
    metric: { label: 'Final result', value: '89 / 89 passed · 0 failed · 10 suites', isFailure: false },
  },
]

const COLOR_MAP = {
  blue:   { bg: 'bg-blue-950/40',   border: 'border-blue-800',   badge: 'bg-blue-900 text-blue-300',   dot: 'bg-blue-400',   icon: 'text-blue-400' },
  yellow: { bg: 'bg-yellow-950/30', border: 'border-yellow-800', badge: 'bg-yellow-900/60 text-yellow-300', dot: 'bg-yellow-400', icon: 'text-yellow-400' },
  orange: { bg: 'bg-orange-950/30', border: 'border-orange-800', badge: 'bg-orange-900/60 text-orange-300', dot: 'bg-orange-400', icon: 'text-orange-400' },
  purple: { bg: 'bg-purple-950/40', border: 'border-purple-800', badge: 'bg-purple-900/60 text-purple-300', dot: 'bg-purple-400', icon: 'text-purple-400' },
  red:    { bg: 'bg-red-950/40',    border: 'border-red-800',    badge: 'bg-red-900/60 text-red-300',   dot: 'bg-red-400',    icon: 'text-red-400' },
  green:  { bg: 'bg-green-950/40',  border: 'border-green-800',  badge: 'bg-green-900/60 text-green-300', dot: 'bg-green-400',  icon: 'text-green-400' },
}

function StepIcon({ type, colorClass }) {
  if (type === 'code') return (
    <svg className={`w-5 h-5 ${colorClass}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
    </svg>
  )
  if (type === 'impact') return (
    <svg className={`w-5 h-5 ${colorClass}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
    </svg>
  )
  if (type === 'gaps') return (
    <svg className={`w-5 h-5 ${colorClass}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
    </svg>
  )
  if (type === 'tests') return (
    <svg className={`w-5 h-5 ${colorClass}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
    </svg>
  )
  if (type === 'run') return (
    <svg className={`w-5 h-5 ${colorClass}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
    </svg>
  )
  if (type === 'bug') return (
    <svg className={`w-5 h-5 ${colorClass}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 12.75c1.148 0 2.278.08 3.383.237 1.037.146 1.866.966 1.866 2.013 0 3.728-2.35 6.75-5.25 6.75S6.75 18.728 6.75 15c0-1.046.83-1.867 1.866-2.013A24.204 24.204 0 0112 12.75zm0 0c2.883 0 5.647.508 8.207 1.44a23.91 23.91 0 01-1.152 6.06M12 12.75c-2.883 0-5.647.508-8.208 1.44a23.916 23.916 0 001.153 6.06M12 12.75a2.25 2.25 0 002.248-2.354M12 12.75a2.25 2.25 0 01-2.248-2.354M12 8.25c.995 0 1.971-.08 2.922-.236.403-.066.74-.358.795-.762a3.778 3.778 0 00-.399-2.25M12 8.25c-.995 0-1.97-.08-2.922-.236-.402-.066-.74-.358-.795-.762a3.778 3.778 0 01.4-2.25m0 0a3.75 3.75 0 013.093-.792 3.75 3.75 0 013.093.792m-6.186 0a3.75 3.75 0 00-3.093-.792 3.75 3.75 0 00-3.093.792" />
    </svg>
  )
  if (type === 'search') return (
    <svg className={`w-5 h-5 ${colorClass}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
    </svg>
  )
  if (type === 'pass') return (
    <svg className={`w-5 h-5 ${colorClass}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
    </svg>
  )
  return null
}

export default function WorkflowTimeline() {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-lg">
      {/* Header */}
      <div className="px-5 py-3 border-b border-gray-800 flex items-center gap-2">
        <svg className="w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
        </svg>
        <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">
          Full Workflow — Validated Change-Impact Demonstration
        </h2>
      </div>

      {/* Timeline */}
      <div className="p-5">
        <div className="relative">
          {/* Vertical connector line */}
          <div className="absolute left-5 top-6 bottom-6 w-px bg-gray-700" aria-hidden="true" />

          <ol className="space-y-4">
            {STEPS.map((step) => {
              const c = COLOR_MAP[step.color]
              return (
                <li key={step.id} className="relative pl-14">
                  {/* Step dot */}
                  <span className={`absolute left-3.5 top-3 w-3 h-3 rounded-full ring-2 ring-gray-900 ${c.dot}`} />

                  <div className={`rounded-md border px-4 py-3 ${c.bg} ${c.border}`}>
                    {/* Top row */}
                    <div className="flex items-start gap-3 flex-wrap">
                      <StepIcon type={step.icon} colorClass={c.icon} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-0.5">
                          <span className={`text-xs font-semibold px-2 py-0.5 rounded ${c.badge}`}>
                            {step.phase}
                          </span>
                        </div>
                        <p className="text-sm font-semibold text-gray-200">{step.title}</p>
                        <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">{step.detail}</p>
                      </div>
                    </div>

                    {/* Files touched */}
                    {step.files && (
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {step.files.map((f) => (
                          <span key={f} className="text-xs font-mono text-blue-400 bg-blue-950/60 border border-blue-900/50 rounded px-2 py-0.5">
                            {f}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Metric pill */}
                    {step.metric && (
                      <div className={`mt-2 inline-flex items-center gap-2 rounded px-3 py-1.5 text-xs font-semibold
                        ${step.metric.isFailure
                          ? 'bg-red-950/60 border border-red-800 text-red-300'
                          : 'bg-green-950/60 border border-green-800 text-green-300'
                        }`}>
                        {step.metric.isFailure ? (
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        ) : (
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                          </svg>
                        )}
                        {step.metric.value}
                      </div>
                    )}

                    {/* Error output */}
                    {step.error && (
                      <pre className="mt-2 text-xs font-mono text-red-300 bg-red-950/40 border border-red-900/40 rounded px-3 py-1.5 whitespace-pre-wrap">
                        {step.error}
                      </pre>
                    )}

                    {/* Fix applied */}
                    {step.fix && (
                      <div className="mt-2 flex items-start gap-2 bg-green-950/40 border border-green-900/50 rounded px-3 py-2">
                        <svg className="w-4 h-4 text-green-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z" />
                        </svg>
                        <p className="text-xs text-green-300 leading-relaxed">{step.fix}</p>
                      </div>
                    )}
                  </div>
                </li>
              )
            })}
          </ol>
        </div>
      </div>
    </div>
  )
}
