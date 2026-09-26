# ChangeGuard AI — IBM Bob 2.0 Initial Agent Workflow

## Purpose

This document records the initial IBM Bob 2.0 agent workflow used for the ChangeGuard AI demonstration.

The workflow used the existing `change-impact-demo` repository and the discount-code change as the demonstration scenario.

IBM Bob was used as the core development agent for repository inspection, impact analysis, test-gap identification, regression-test generation, test execution, defect discovery, and repair.

---

## Demonstration Change

The example developer change introduced discount-code support into the e-commerce application.

The change involved:

- Adding a shared `DISCOUNT_CODES` registry.
- Updating `paymentService.js` to accept and apply discount codes.
- Updating `orderService.js` to pass the discount code to payment processing.
- Storing the discounted payment amount in the order.
- Updating related tests for the new discount behavior.

The purpose of the Bob workflow was not simply to generate code, but to determine what existing behavior could be affected by this change and whether the existing test suite adequately covered those consequences.

---

## IBM Bob Agent Workflow

The initial workflow followed these stages:

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