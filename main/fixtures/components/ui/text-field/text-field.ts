import { type Locator, type Page, expect } from '@playwright/test';
import { BaseComponent } from '@fixtures/components/commons';
import { resolveSelector, type Selector } from '@fixtures/components/ui/selector';


export class TextField extends BaseComponent {
    readonly input: Locator;

    constructor(page: Page, selector: Selector) {
        super(page, resolveSelector(page, selector));

        if (selector.type === 'name') {
            this.input = this.locator;
        } else if (selector.type === 'css' && selector.value.includes('input[')) {
            this.input = this.locator;
        } else {
            this.input = this.locator.locator('input').first();
        }
    }

    async fill(text: string) {
        await this.input.fill(text);
    }

    async clear() {
        await this.input.clear();
    }

    async getValue(): Promise<string> {
        return await this.input.inputValue();
    }

    async expectValue(value: string) {
        await expect(this.input).toHaveValue(value);
    }

}
