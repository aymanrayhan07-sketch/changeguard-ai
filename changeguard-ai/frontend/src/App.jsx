import { useState } from 'react'
import { analyzeChange } from './api/api'

import Header from './components/Header'
import ChangeInput from './components/ChangeInput'
import AnalysisProgress from './components/AnalysisProgress'
import SummaryBar from './components/SummaryBar'
import FileList from './components/FileList'
import TestGapList from './components/TestGapList'
import GeneratedTests from './components/GeneratedTests'
import DefectReport from './components/DefectReport'
import ValidationResults from './components/ValidationResults'
import WorkflowTimeline from './components/WorkflowTimeline'

// Simulated pipeline stage timing (ms per stage before real Bob is connected)
// Matches 8-step workflow: Change → Impact → Gaps → Generation → Execution → Defects → Fix → Final
const STAGE_DELAYS = [350, 450, 550, 500, 600, 500, 450, 400]

export default function App() {
  const [changeDescription, setChangeDescription] = useState(
    'Added discount-code support to payment and order flow.'
  )
  const [status, setStatus]           = useState('Ready')     // Header status
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [currentStage, setCurrentStage] = useState(-1)        // -1 = not started
  const [isComplete, setIsComplete]   = useState(false)
  const [report, setReport]           = useState(null)
  const [error, setError]             = useState(null)

  // Demo banner: always shown until Bob is wired in
  const [showDemoBanner] = useState(true)

  function handleReset() {
    setReport(null)
    setIsComplete(false)
    setCurrentStage(-1)
    setError(null)
    setStatus('Ready')
    setChangeDescription('')
  }

  async function handleAnalyze() {
    setError(null)
    setReport(null)
    setIsComplete(false)
    setIsAnalyzing(true)
    setStatus('Analyzing')
    setCurrentStage(0)

    // Animate through pipeline stages while the API call runs in parallel
    const stageTimer = async () => {
      for (let i = 0; i < STAGE_DELAYS.length; i++) {
        await delay(STAGE_DELAYS[i])
        setCurrentStage(i + 1)
      }
    }

    try {
      const [data] = await Promise.all([
        analyzeChange(changeDescription),
        stageTimer(),
      ])
      setReport(data)
      setIsComplete(true)
      setStatus('Ready')
    } catch (err) {
      setError(err.message ?? 'An unexpected error occurred.')
      setStatus('Error')
      setCurrentStage(-1)
      setIsComplete(false)
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-950">
      <Header status={status} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">

        {/* Demo banner */}
        {showDemoBanner && (
          <div className="flex items-start gap-3 bg-blue-950/60 border border-blue-800 rounded-lg px-4 py-3">
            <svg className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
            </svg>
            <div>
              <p className="text-sm font-semibold text-blue-300">Demonstration Mode</p>
              <p className="text-xs text-blue-400/80 mt-0.5">
                Results shown are real findings from the <span className="font-mono">change-impact-demo</span> repository controlled demonstration.
                IBM Bob agent workflow integration is pending — see{' '}
                <span className="font-mono">backend/src/services/analysisService.js</span> for integration points.
              </p>
            </div>
          </div>
        )}

        {/* Top section: input + pipeline */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChangeInput
            value={changeDescription}
            onChange={setChangeDescription}
            onAnalyze={handleAnalyze}
            onReset={handleReset}
            isAnalyzing={isAnalyzing}
            isComplete={isComplete}
          />
          {(isAnalyzing || isComplete) && (
            <AnalysisProgress
              currentStage={currentStage}
              isComplete={isComplete}
            />
          )}
        </div>

        {/* Error state */}
        {error && (
          <div className="bg-red-950/50 border border-red-800 rounded-lg px-4 py-3 text-sm text-red-300">
            <strong>Error:</strong> {error}
          </div>
        )}

        {/* Results — only shown once analysis is complete */}
        {report && isComplete && (
          <div className="space-y-6">
            {/* Summary KPIs */}
            <SummaryBar summary={report.summary} />

            {/* Full workflow narrative — top-level story */}
            <WorkflowTimeline />

            {/* Files grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <FileList
                title={`Changed Files (${report.changedFiles?.length ?? 0})`}
                files={report.changedFiles}
                emptyMessage="No changed files detected."
              />
              <FileList
                title={`Potentially Impacted Files (${report.impactedFiles?.length ?? 0})`}
                files={report.impactedFiles}
                emptyMessage="No impacted files detected."
              />
            </div>

            {/* Test analysis grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <TestGapList gaps={report.testGaps} />
              <GeneratedTests tests={report.generatedTests} />
            </div>

            {/* Defects + Validation */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <DefectReport defects={report.validation?.defectsFound} />
              <ValidationResults validation={report.validation} />
            </div>

            {/* Data source watermark */}
            <p className="text-xs text-center text-gray-600">
              {report.meta?.dataSource} · Analyzed at {report.meta?.analyzedAt
                ? new Date(report.meta.analyzedAt).toLocaleTimeString()
                : '—'}
            </p>
          </div>
        )}

      </main>
    </div>
  )
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
