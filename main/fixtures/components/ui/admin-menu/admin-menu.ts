import { type Page } from '@playwright/test';
import { BaseComponent } from '../../commons/base-component/base-component';
import { resolveSelector, type Selector } from '../selector/selector';

export class AdminMenu extends BaseComponent {
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

}