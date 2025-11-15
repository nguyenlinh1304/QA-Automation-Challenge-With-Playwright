import { type Locator, type Page } from '@playwright/test';
import { BaseComponent } from '@fixtures/components/commons';
import { resolveSelector, type Selector } from '@fixtures/components/ui/selector';

export class Button extends BaseComponent {
    constructor(page: Page, selector: Selector) {
        super(page, resolveSelector(page, selector));
    }

    async click() {
        await this.locator.click();
    }

    async isVisible(): Promise<boolean> {
        return await this.locator.isVisible();
    }

    async isEnabled(): Promise<boolean> {
        return await this.locator.isEnabled();
    }

    async getText(): Promise<string> {
        return await this.locator.textContent() ?? '';
    }
}

