# Copilot Instructions for AI Coding Agents

## Project Overview

This is a Playwright-based end-to-end testing codebase for a web application. The workspace is organized by test suites, data, configuration, and reporting assets. The main focus is on automated UI and API testing, with custom conventions for test organization and data management.

## Architecture & Key Components

- **Test Suites:**
  - Located in `tests/` and `e2e/`.
  - Organized by feature, scenario, and polarity (e.g., `positif`, `negatif`).
  - Example: `tests/SpecialTestCase1/positif/EC-052.spec.js`.
- **Test Data:**
  - Environment-specific data in `data/dev/dataDev.json` and `data/qa/dataQa.json`.
- **Config & Setup:**
  - Playwright config: `playwright.config.js`.
  - Global setup: `config/globalSetup.js`.
- **Reporting:**
  - Playwright HTML reports in `playwright-report/`.
  - Test results and traces in `test-results/`.

## Developer Workflows

- **Run All Tests:**
  - `npx playwright test`
- **Run Specific Test:**
  - `npx playwright test tests/SpecialTestCase1/positif/EC-052.spec.js`
- **View Reports:**
  - Open `playwright-report/index.html` after test runs.
- **Debugging:**
  - Use Playwright's `--debug` or `--headed` flags for interactive debugging.
- **Environment Data:**
  - Switch data files in `data/dev/` or `data/qa/` as needed for environment-specific runs.

## Project-Specific Conventions

- **Test Naming:**
  - Test files use scenario codes (e.g., `EC-052`) and polarity (`positif`, `negatif`).
- **Directory Structure:**
  - Features and enhancements are grouped in subfolders (e.g., `Enhancement New 2025/`, `FEAT-ORGANIZATION/`).
- **Data Management:**
  - Tests reference environment data via JSON files, not hardcoded values.
- **Reporting:**
  - Each test run generates a report and trace for debugging failures.

## Integration Points

- **External Dependencies:**
  - Playwright (see `package.json` for version).
  - Custom API integrations in `tests-examples/api/`.
- **Cross-Component Patterns:**
  - Tests may import shared setup/config from `config/` and use data from `data/`.

## Examples

- To add a new test for a feature, create a `.spec.js` or `.spec.ts` file in the relevant subfolder under `tests/`.
- To update environment data, edit the appropriate JSON file in `data/dev/` or `data/qa/`.

## Key Files & Directories

- `playwright.config.js` — Playwright configuration
- `config/globalSetup.js` — Global test setup
- `data/` — Environment-specific test data
- `tests/` — Main test suites
- `playwright-report/` — Test reports

---

**Feedback Requested:**
If any section is unclear or missing important project-specific details, please specify so this guide can be improved for future AI agents.
