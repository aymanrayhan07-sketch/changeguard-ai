# ChangeGuard AI

> **Understand the impact. Find the gaps. Validate the change.**

AI Change Impact & Test Validation Assistant — hackathon prototype.

---

## What it does

ChangeGuard AI demonstrates an AI-driven developer workflow:

```
Developer describes a code change
        ↓
AI analyses the repository
        ↓
Change impact analysis  (which files are affected?)
        ↓
Test-gap analysis       (which scenarios are untested?)
        ↓
Regression test generation
        ↓
Test execution / validation
        ↓
Developer receives an actionable report
```

Results are currently populated from the real controlled demonstration run
against the `change-impact-demo` e-commerce backend in this workspace.

---

## Project structure

```
changeguard-ai/
├── backend/
│   ├── package.json
│   └── src/
│       ├── server.js               ← Express app entry point
│       ├── routes/
│       │   └── analyze.js          ← POST /api/analyze
│       └── services/
│           ├── analysisService.js  ← Orchestrates pipeline (Bob integration point)
│           ├── repositoryService.js← Repo metadata / file scanner
│           ├── testService.js      ← Test generation & validation runner
│           └── reportService.js    ← Assembles final AnalysisReport object
│
└── frontend/
    ├── package.json
    ├── vite.config.js
    ├── tailwind.config.js
    ├── index.html
    └── src/
        ├── main.jsx
        ├── App.jsx                 ← Root component, orchestrates dashboard
        ├── index.css
        ├── api/
        │   └── api.js              ← All fetch() calls (no API calls in components)
        └── components/
            ├── Header.jsx
            ├── ChangeInput.jsx
            ├── AnalysisProgress.jsx
            ├── SummaryBar.jsx
            ├── FileList.jsx
            ├── TestGapList.jsx
            ├── GeneratedTests.jsx
            ├── DefectReport.jsx
            ├── ValidationResults.jsx
            ├── Card.jsx
            ├── SeverityBadge.jsx
            └── StatusBadge.jsx
```

---

## How to run

### Prerequisites
- Node.js ≥ 18
- npm ≥ 8

### Backend

```bash
cd changeguard-ai/backend
npm install
npm start
# → http://localhost:3001
```

### Frontend

```bash
cd changeguard-ai/frontend
npm install
npm run dev
# → http://localhost:5173
```

Open **http://localhost:5173** in your browser.

The Vite dev server proxies all `/api/*` requests to the backend on port 3001,
so both must be running simultaneously.

### Production build (frontend)

```bash
cd changeguard-ai/frontend
npm run build      # outputs to dist/
npm run preview    # preview the production build
```

---

## API

### `POST /api/analyze`

**Request:**
```json
{ "changeDescription": "Added discount-code support to payment processing." }
```

**Response:** `AnalysisReport` object
```json
{
  "meta": { "repository": "change-impact-demo", "analyzedAt": "...", "dataSource": "..." },
  "summary": { "filesChanged": 3, "filesImpacted": 6, "testGapsFound": 6, ... },
  "changedFiles":    [...],
  "impactedFiles":   [...],
  "testGaps":        [...],
  "generatedTests":  [...],
  "validation":      { "before": {...}, "after": {...}, "defectsFound": [...] }
}
```

### `GET /api/health`
Returns `{ "status": "ok" }`.

---

## IBM Bob integration points

All integration hooks are marked with `// ── IBM Bob integration point ──` comments
in the source files. The key locations are:

| File | What to replace |
|---|---|
| `backend/src/services/analysisService.js` | Each `_analyse*()` helper → Bob agent tool calls |
| `backend/src/services/repositoryService.js` | Static metadata → real file-system scan via Bob |
| `backend/src/services/testService.js` | `generateRegressionTests()` → Bob LLM call for real Jest stubs; `getValidationResults()` → real `jest --runInBand --json` subprocess |
| `backend/src/routes/analyze.js` | `analysisService.runAnalysis()` call → async Bob agent invocation |

The `AnalysisReport` object shape must not change when Bob is wired in —
the frontend is already built to consume it.

---

## Demo data source

The results displayed come from the real controlled demonstration performed on
`change-impact-demo`:

- **Change implemented:** 10% discount code support added to `paymentService` and `orderService`
- **1 real defect found:** stock not restored after payment failure (Gap 1)
- **Before fix:** 82/83 tests passing
- **After fix:** 83/83 tests passing
