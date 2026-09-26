# ChangeGuard AI – Architecture Diagram

## High-Level Architecture

```text
                 Developer Change
                       │
                       ▼
              ┌─────────────────┐
              │   IBM Bob 2.0   │
              │ Agentic Workflow│
              └────────┬────────┘
                       │
          ┌────────────┼────────────┐
          ▼            ▼            ▼
     Change         Impact       Test Gap
   Understanding    Analysis      Analysis
          │            │            │
          └────────────┼────────────┘
                       ▼
             Regression Test
                 Generation
                       │
                       ▼
                Test Execution
                       │
                       ▼
               Defect Discovery
                       │
                       ▼
                 Fix Validation
                       │
                       ▼
                Final Validation
                       │
                       ▼
                  89 / 89 PASS
```

## Prototype Architecture

```text
ChangeGuard AI Dashboard (React + Vite)
            │
            ▼
Express Backend
            │
            ▼
AnalysisReport JSON
            │
            ▼
Frontend Dashboard Components
```

## Controlled Demonstration Repository

```text
change-impact-demo/
├── src/
│   ├── config/
│   └── modules/
│       ├── users/
│       ├── auth/
│       ├── products/
│       ├── cart/
│       ├── payments/
│       ├── orders/
│       └── notifications/
├── tests/
│   ├── unit/
│   ├── regression/
│   └── integration/
└── README.md
```

## Demonstrated Workflow

1. Developer introduces a discount-code feature.
2. IBM Bob performs repository-aware analysis.
3. Impacted modules are identified.
4. Existing tests are evaluated.
5. Missing regression scenarios are identified.
6. Targeted Jest tests are generated.
7. A genuine production defect is confirmed.
8. A minimal repair is applied.
9. The repository reaches **89 passing tests across 10 test suites**.