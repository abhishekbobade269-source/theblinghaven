---
name: playwright
description: |
  Comprehensive Playwright testing and browser automation guide for The Bling Haven.
  Use whenever the user asks to write, execute, debug, or configure end-to-end (E2E) tests,
  visual regression tests, component tests, or browser automation scripts for the storefront and admin apps.
  Covers TypeScript/JavaScript (@playwright/test) and Python (playwright), locators, assertions,
  Page Object Models (POM), auth storage state, network interception, and CI/CD setup.
license: MIT
metadata:
  version: v1
  publisher: antigravity
---

# Playwright Testing & Browser Automation Skill

This skill provides expert guidance and production-grade patterns for authoring, running, and debugging end-to-end tests and browser automations using **Playwright** on The Bling Haven platform.

---

## 1. Core Principles & Best Practices

1. **User-Visible Locators First**: Prefer `page.getByRole()`, `page.getByText()`, `page.getByLabel()`, or `page.getByPlaceholder()`.
2. **Web-First Auto-Waiting Assertions**: Always use `await expect(locator).toBeVisible()`, `await expect(locator).toHaveText()`, etc.
3. **Zero Arbitrary Sleep**: NEVER use `page.waitForTimeout()`. Rely on auto-waiting locators and explicit condition assertions.
4. **Isolate State**: Use fresh browser contexts or persistent `storageState` for auth tokens rather than logging in through the UI in every test.

---

## 2. Recommended Commands

```bash
# Run all end-to-end tests
npx playwright test

# Run in interactive UI mode with time-travel debugger
npx playwright test --ui

# Run single test in headed browser
npx playwright test e2e/catalog.spec.ts --headed

# Debug test step-by-step
npx playwright test --debug

# View HTML test execution report
npx playwright show-report
```
