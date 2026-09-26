# ChangeGuard AI

**Understand the impact. Find the gaps. Validate the change.**

ChangeGuard AI is a hackathon prototype that demonstrates how an **agentic developer workflow** can analyze a code change, trace its impact across a repository, identify missing regression coverage, validate behavior through automated tests, and document the entire workflow.

This repository (`change-impact-demo`) is the **controlled demonstration codebase** used to showcase that workflow.

---

## The Problem

When developers modify one part of a software system, the biggest risk is often **outside the changed file**.

Questions like these become difficult:

- Which modules are actually affected?
- Which existing tests are still relevant?
- Which regression scenarios are missing?
- Did the change quietly introduce a defect somewhere else?

Manually answering these questions becomes increasingly expensive as projects grow.

---

## Our Solution

ChangeGuard AI demonstrates an **IBM Bob 2.0 agentic workflow** that performs repository-aware change analysis.

Rather than simply reviewing a diff, the workflow:

1. Understands the change.
2. Maps dependency impact.
3. Identifies missing regression coverage.
4. Generates targeted Jest tests.
5. Validates existing and generated tests.
6. Confirms genuine production defects.
7. Applies minimal repairs.
8. Produces a structured change-impact report.

The current dashboard operates in **Demonstration Mode**, presenting the validated workflow and findings produced from this controlled repository.

---

## Demonstration Scenario

The demonstration uses a realistic e-commerce backend where a developer introduced a **discount-code feature**.

### Change introduced

- Added `DISCOUNT_CODES` configuration.
- Extended payment processing to apply discounts.
- Updated order creation to store both:
  - `cartTotal`
  - discounted `total`

Initially, the existing suite passed.

A deeper repository-aware analysis discovered an uncovered regression path.

---

## IBM Bob Agentic Workflow

The workflow follows seven stages:

```text
CHANGE UNDERSTANDING
        ↓
IMPACT ANALYSIS
        ↓
TEST IMPACT ANALYSIS
        ↓
REGRESSION TEST GENERATION
        ↓
VALIDATION
        ↓
REPAIR
        ↓
FINAL REPORT
Repository capabilities demonstrated

During the workflow, IBM Bob performed repository-level analysis including:

reading source modules

tracing imports and dependencies

locating symbol references

identifying affected modules

generating targeted Jest regression tests

executing tests

applying a minimal production repair

producing a structured final report

Real Defect Discovered

The deeper analysis identified a genuine production defect.

Defect

cancelOrder() restored payment refunds but did not restore product stock after cancelling a confirmed order.

Root cause

Stock restoration existed in the payment-failure path but not in the order-cancellation path.

Minimal repair

A four-line stock-restoration loop was added inside cancelOrder().

Validation Results
Before deeper repair

Metric

	

Result




Test Suites

	

9




Total Tests

	

83




Passed

	

83




Failed

	

0

Additional regression coverage

A new regression suite was added for cancellation scenarios, including:

confirmed order stock restoration

discounted order stock restoration

refund correctness

multi-item restoration

order status invariants

Final validation

Metric

	

Result




Test Suites

	

10




Total Tests

	

89




Passed

	

89




Failed

	

0

Final Status: ALL GREEN

Repository Architecture
src/
├── config/
│   ├── constants.js
│   └── database.js
│
├── modules/
│   ├── users/
│   ├── auth/
│   ├── products/
│   ├── cart/
│   ├── payments/
│   ├── orders/
│   └── notifications/
│
└── index.js

tests/
├── unit/
├── regression/
└── integration/
Dependency Graph
authService
   └── userService

cartService
   └── productService

orderService
   ├── cartService
   ├── productService
   ├── paymentService
   └── notificationService

All modules
   └── config/database
   └── config/constants
 Technology Stack

Layer

	

Technology




Frontend

	

React 18, Vite, Tailwind CSS




Backend

	

Node.js, Express




Testing

	

Jest




Demo Repository

	

JavaScript, in-memory database




Workflow

	

IBM Bob 2.0 agentic repository analysis

Running the Project
Prerequisites

Node.js 18+

npm 8+
Install
npm install
Run tests
npm test
Coverage
npm run test:coverage
ChangeGuard Dashboard

Backend:

cd changeguard-ai/backend
node src/server.js

Frontend:

cd changeguard-ai/frontend
npx vite

Then open:

http://localhost:5173

The dashboard visualizes:

impact analysis

changed files

affected modules

generated regression tests

discovered defects

validation results

complete workflow timeline

Project Structure
change-impact-demo/
├── src/
├── tests/
├── changeguard-ai/
├── bob_sessions/
├── screenshots/
├── docs/
└── README.md
Current Prototype Scope

This prototype intentionally keeps the dashboard in Demonstration Mode.

The demonstrated workflow is based on repository inspection and validated test execution performed on the controlled change-impact-demo repository.

The frontend presents those validated findings through a stable AnalysisReport interface while preserving clear integration points for future repository-aware automation.

Outcome

The demonstration shows that an agentic repository workflow can:

understand a developer change

trace dependency impact

identify missing regression coverage

generate targeted tests

uncover genuine production defects

validate minimal repairs

finish with 89 passing tests across 10 test suites while preserving developer oversight over the final merge decision.

---

## Why this version is stronger

Compared to your previous README, this one:

- Presents **ChangeGuard AI** as the actual hackathon project from the first screen.
- Clearly explains that **`change-impact-demo`** is the demonstration repository.
- Accurately describes IBM Bob's role without claiming a direct API integration.
- Includes the real workflow, defect discovery, and **89/89** validation result.
- Keeps the architecture, dependency graph, tech stack, and run instructions judges expect.

Once you save this, the README is essentially submission-ready.  