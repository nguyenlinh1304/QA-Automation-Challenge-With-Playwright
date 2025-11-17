import { type Page, expect } from '@playwright/test';
import { BaseComponent } from '@fixtures/components/commons';
import { resolveSelector, type Selector } from '@fixtures/components/ui/selector';

export class ErrorMessage extends BaseComponent {
    constructor(page: Page, selector: Selector) {
        super(page, resolveSelector(page, selector));
    }

    async isVisible(): Promise<boolean> {
        return await this.locator.isVisible();
    }

    async getText(): Promise<string> {
        return await this.locator.textContent() ?? '';
    }

    async expectText(text: string) {
        await this.locator.waitFor({ state: 'visible' });
        await expect(this.locator).toHaveText(text);
    }

    async waitForVisible() {
        await this.locator.waitFor({ state: 'visible' });
    }
}

