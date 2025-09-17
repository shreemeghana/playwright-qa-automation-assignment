# QA Automation Test Project

This project contains **Playwright automated tests** for validating analytics events and theme behavior across two sites:

- **iNews Politics page** (mobile Chrome simulation)
- **New Scientist** (desktop Chrome with Dark/Light mode)

---

## Setup Instructions

### 1. Install dependencies

```
npm install
npx playwright install
```

### 2. Running tests

Run all tests or use --ui for Test Explorer UI:
```
cd dmg-assignment/tests
% npx playwright test
or 
% npx playwright test --ui 
```

### 3. View reports
```
npx playwright show-report
```