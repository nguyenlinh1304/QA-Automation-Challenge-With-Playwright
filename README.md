# E2E Testing Framework

A scalable, maintainable end-to-end testing framework built on Playwright with TypeScript, implementing the Page Object Model (POM) pattern and component-based architecture.

## Table of Contents

- [Overview](#overview)
- [Framework Structure](#framework-structure)
- [Architecture Rationale](#architecture-rationale)
- [Key Concepts](#key-concepts)
- [Directory Structure](#directory-structure)
- [Getting Started](#getting-started)
- [Writing Tests](#writing-tests)
- [Configuration](#configuration)

## Overview

This framework provides a structured approach to writing maintainable end-to-end tests by:

- **Separation of Concerns**: Clear separation between test logic, page models, and UI components
- **Reusability**: Component-based architecture allows sharing UI interactions across pages
- **Type Safety**: Full TypeScript support with path aliases for better developer experience
- **Scalability**: Modular structure that scales with your application
- **Test Management**: Integration with Qase for test execution tracking and reporting

## Framework Structure

### Core Components

1. **Page Models** (`models/`) - Represent application pages and their behaviors
2. **UI Components** (`fixtures/components/`) - Reusable UI element wrappers
3. **Tests** (`tests/e2e/`) - Test specifications
4. **Configuration** (`configs/`) - Routes and environment settings
5. **Utilities** (`fixtures/utils/`) - Helper functions and utilities

## Architecture Rationale

### 1. Page Object Model (POM) Pattern

**Why POM?**
- **Maintainability**: UI changes require updates in a single location (the page model) rather than across multiple tests
- **Reusability**: Page models can be reused across different test scenarios
- **Readability**: Tests read like user stories, focusing on "what" rather than "how"
- **Abstraction**: Test writers don't need to know implementation details of selectors or interactions

**Implementation:**
- `BaseModel` class provides the foundation for all page models
- Each page extends `BaseModel` and defines its elements and methods
- Elements are accessed through typed `elements` property

### 2. Component-Based Architecture

**Why Components?**
- **DRY Principle**: Common UI elements (buttons, text fields, selects) are defined once and reused
- **Consistency**: Ensures uniform interaction patterns across the framework
- **Encapsulation**: Each component encapsulates its own behavior and validations
- **Testability**: Components can be unit tested independently

**Implementation:**
- `BaseComponent` provides common functionality for all UI components
- Specialized components (Button, TextField, Select, Label) extend BaseComponent
- Components expose high-level methods (e.g., `click()`, `fill()`, `isVisible()`) rather than raw Playwright APIs

### 3. Selector Abstraction Layer

**Why Abstract Selectors?**
- **Flexibility**: Easy to change selector strategies (CSS, XPath, data-testid) without affecting tests
- **Maintainability**: Centralized selector resolution logic
- **Type Safety**: Selector types are validated at compile time
- **Best Practices**: Encourages use of preferred selector types (e.g., data-testid over brittle CSS)

**Implementation:**
- `Selector` type union supports multiple selector strategies
- `resolveSelector()` function converts abstract selectors to Playwright Locators
- Components accept `Selector` objects rather than raw strings

### 4. UI Factory Pattern

**Why Factory Pattern?**
- **Consistency**: Single point of creation for all UI components
- **Dependency Injection**: Page instance is injected once at the factory level
- **Extensibility**: Easy to add new component types without modifying existing code
- **Type Safety**: Factory returns typed components

**Implementation:**
- `Ui` factory function creates component instances bound to a Page
- Page models access UI components through `this.ui` property
- Factory pattern eliminates repetitive `new Component(page, selector)` calls

### 5. TypeScript Path Aliases

**Why Path Aliases?**
- **Clean Imports**: Avoid deeply nested relative imports (`../../../`)
- **Refactoring Safety**: Moving files doesn't break imports
- **IntelliSense**: Better IDE support and autocomplete
- **Clarity**: Imports clearly show module type (`@models`, `@fixtures`, `@typings`)

**Implementation:**
- Configured in `tsconfig.json` with aliases like `@models/*`, `@fixtures/*`, `@typings/*`
- All imports use absolute paths relative to project root

### 6. Configuration Management

**Why Centralized Configuration?**
- **Single Source of Truth**: Route paths defined once and reused
- **Environment Flexibility**: Easy to switch between environments
- **Version Control**: Configuration changes tracked in source control
- **Type Safety**: Configuration objects are const-asserted for type inference

**Implementation:**
- Route configurations in `configs/routes/`
- Environment variables via `dotenv-flow`
- Base URL and other settings in `playwright.config.ts`

## Key Concepts

### BaseModel

The foundation for all page models. Provides:
- Page instance management
- UI factory access (`this.ui`)
- Elements storage with getter/setter pattern
- Type-safe element definitions

```typescript
class MyPage extends BaseModel<MyElements> {
    constructor(page: Page) {
        super(page);
        this.elements = {
            button: this.ui.button({ type: 'css', value: '.submit' })
        };
    }
}
```

### BaseComponent

The foundation for all UI components. Provides:
- Page and Locator references
- Common interaction methods
- Consistent API across components

```typescript
class MyComponent extends BaseComponent {
    async customAction() {
        await this.locator.click();
    }
}
```

### Selector Types

Supported selector strategies:
- `datatestId`: `{ type: 'datatestId', value: 'submit-btn' }` → `page.getByTestId('submit-btn')`
- `css`: `{ type: 'css', value: '.button' }` → `page.locator('.button')`
- `xpath`: `{ type: 'xpath', value: '//button[text()="Submit"]' }` → `page.locator('xpath=...')`
- `name`: `{ type: 'name', value: 'username' }` → `page.locator('[name="username"]')`
- `text`: `{ type: 'text', value: 'Click me' }` → Playwright text locator
- `label`: `{ type: 'label', value: 'Email' }` → Label-based locator

## Directory Structure

```
main/
├── configs/              # Configuration files
│   └── routes/          # Route definitions (SIGN_IN, DASHBOARD, etc.)
│
├── fixtures/            # Test fixtures and utilities
│   ├── components/     # UI component library
│   │   ├── commons/    # Base classes (BaseComponent)
│   │   └── ui/         # Specific components (Button, TextField, Select, Label)
│   ├── utils/          # Utility functions (Auth helpers, etc.)
│   └── index.ts        # Ui factory and exports
│
├── models/             # Page Object Models
│   ├── commons/        # Base classes (BaseModel)
│   └── pages/          # Page-specific models (Login, Dashboard, etc.)
│
├── tests/              # Test specifications
│   └── e2e/           # End-to-end tests (*.e2e.ts)
│
├── scripts/            # Automation scripts
│   ├── pre-qase-run/  # Pre-execution setup (Qase run creation)
│   └── post-qase-run/ # Post-execution cleanup
│
├── typings/            # TypeScript type definitions
│   └── model.ts       # Common types (Elements, InteractiveElement)
│
├── result/             # Test execution results
│   └── test-results/  # Screenshots, videos, traces
│
└── playwright.config.ts # Playwright configuration
```

## Getting Started

### Prerequisites

- Node.js 18+ 
- pnpm (or npm/yarn)
- TypeScript 5+

### Installation

```bash
pnpm install
```

### Configuration

1. Copy `.env.example` to `.env` (if exists)
2. Set required environment variables:
   - `BASE_URL`: Application URL to test
   - `QASE_TESTOPS_API_TOKEN`: Qase API token (if using Qase)
   - `QASE_TESTOPS_PLAN_ID`: Qase test plan ID

### Running Tests

```bash
# Run all tests
nx test:e2e

# Run specific test file
npx playwright test tests/e2e/Authenticator/TC-1.e2e.ts

# Run in UI mode
npx playwright test --ui

# Run in headed mode
npx playwright test --headed
```

## Writing Tests

### 1. Create a Page Model

```typescript
// models/pages/login/login.ts
import { BaseModel } from "@models/commons/base-model/base-model";
import { Page } from "@playwright/test";
import type { Elements } from "./config";
import { SIGN_IN } from "@src/configs/routes";

export class SignInPage extends BaseModel<Elements> {
    constructor(page: Page) {
        super(page);

        this.elements = {
            username: this.ui.textField({ type: 'name', value: 'username' }),
            password: this.ui.textField({ type: 'name', value: 'password' }),
            submit: this.ui.button({ type: 'css', value: 'button[type="submit"]' }),
        };
    }

    async goto() {
        await this.page.goto(SIGN_IN.path);
    }
}
```

### 2. Write a Test

```typescript
// tests/e2e/Authenticator/TC-1.e2e.ts
import { expect, test } from '@playwright/test';
import { SignInPage } from '@models/pages/login';
import { SIGN_IN, DASHBOARD } from '@src/configs/routes';

test('Should successfully log in', async ({ page }) => {
    const signInPage = new SignInPage(page);

    await test.step('Navigate to login page', async () => {
        await signInPage.goto();
        await expect(page).toHaveURL(SIGN_IN.path);
    });

    await test.step('Enter credentials', async () => {
        await signInPage.elements.username.fill('Admin');
        await signInPage.elements.password.fill('admin123');
    });

    await test.step('Submit login', async () => {
        await signInPage.elements.submit.click();
        await expect(page).toHaveURL(DASHBOARD.path);
    });
});
```

### 3. Best Practices

1. **Use Descriptive Test Names**: Include test case ID and clear description
2. **Use test.step()**: Group related actions for better reporting
3. **Prefer Data Attributes**: Use `datatestId` selector type when possible
4. **Keep Tests Focused**: One assertion per test, or related assertions grouped
5. **Reuse Page Models**: Don't duplicate page initialization logic
6. **Use Type Safety**: Define proper types for page elements

## Configuration

### Playwright Configuration

Key settings in `playwright.config.ts`:
- **Test Matching**: `**/*.e2e.ts` files in `tests/e2e/`
- **Projects**: Chromium, Firefox, WebKit browsers
- **Retries**: 1 retry in CI, 0 locally
- **Artifacts**: Video, trace, and screenshots enabled
- **Base URL**: Configurable via `BASE_URL` environment variable

### TypeScript Configuration

Path aliases configured in `tsconfig.json`:
- `@models/*` → `main/models/*`
- `@fixtures/*` → `main/fixtures/*`
- `@typings/*` → `main/typings/*`
- `@src/*` → `main/*`

### NX Configuration

Targets defined in `project.json`:
- `test:e2e`: Run Playwright tests
- `pre:qase-run`: Create Qase test run before execution
- `post:qase-run`: Update Qase after test execution

## Testing Strategy

### Test Organization

- Tests organized by feature/domain (e.g., `Authenticator/`, `Search/`)
- Test files follow naming: `TC-<ID>.e2e.ts`
- Each test file should be self-contained

### Cross-Browser Testing

Framework supports:
- **Chromium**: Desktop Chrome
- **Firefox**: Desktop Firefox  
- **WebKit**: Desktop Safari

All browsers run in parallel for faster execution.

### Reporting

- **Console**: List reporter for immediate feedback
- **JSON**: Results saved to `result.json`
- **Artifacts**: Screenshots, videos, traces saved per test
- **Qase Integration**: Test results tracked in Qase TestOps

## Extending the Framework

### Adding a New UI Component

1. Create component class extending `BaseComponent`:
```typescript
// fixtures/components/ui/custom/custom.ts
export class CustomComponent extends BaseComponent {
    async customAction() {
        await this.locator.click();
    }
}
```

2. Add to `Ui` factory:
```typescript
// fixtures/index.ts
export interface Ui {
    // ... existing components
    custom: UiComponent<CustomComponent>;
}

export const Ui = (page: Page): Ui => ({
    // ... existing components
    custom: (selector) => new CustomComponent(page, selector),
});
```

### Adding a New Page Model

1. Create page class extending `BaseModel`:
```typescript
// models/pages/my-page/my-page.ts
export class MyPage extends BaseModel<MyElements> {
    constructor(page: Page) {
        super(page);
        this.elements = { /* ... */ };
    }
}
```

2. Export from pages index if needed:
```typescript
// models/pages/index.ts
export * from './my-page';
```

## Troubleshooting

### Common Issues

1. **Import Errors**: Ensure path aliases are correctly configured in `tsconfig.json`
2. **Selector Not Found**: Verify selector type and value, check if element exists in DOM
3. **Type Errors**: Ensure element types are properly defined in page config
4. **Environment Variables**: Check `.env` file exists and variables are set

### Debugging

- Use `--headed` flag to see browser during test execution
- Use `--debug` flag for Playwright Inspector
- Check `result/test-results/` for screenshots, videos, and traces
- Review test trace files in Playwright Trace Viewer

## Contributing

When contributing:
1. Follow existing patterns and conventions
2. Add TypeScript types for new components/models
3. Update documentation for new features
4. Ensure tests pass across all browsers
5. Use descriptive commit messages


