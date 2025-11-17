import { type OptionIdType } from '@typings';
import { type Locator, type Page, expect } from '@playwright/test';
import { type Selector, resolveSelector } from '@fixtures/components/ui/selector'
import { BaseComponent } from '@fixtures/components/commons';

export class Select<T extends OptionIdType> extends BaseComponent {
    private readonly selector: Selector;

    constructor(page: Page, selector: Selector) {
        super(page, resolveSelector(page, selector));
        this.selector = selector;
    }

    async open() {
        await this.locator.click();
    }

    async close() {
        await this.page.keyboard.press('Escape');
        await expect(this.page.getByRole('listbox')).toBeHidden();
    }

    async chooseById(id: T) {
        await this.open();
        let optionLocator: Locator
        switch (this.selector.type) {
            case 'datatestId':
                optionLocator = this.locator.getByTestId(`${this.selector.value}-optionId-${id}`);
                break;
            case 'css':
                optionLocator = this.locator.locator(`[data-option-id="${id}"]`);
                break;
            case 'tag':
                optionLocator = this.locator.locator(`${this.selector.value}[data-option-id="${id}"]`)
                break;
            case 'xpath':
                optionLocator = this.locator.locator(`xpath=.//*[@data-option-id="${id}"]`);
                break;
            case 'text':
                optionLocator = this.locator.locator(`text=${this.selector.value}`);
                break;
            case 'name':
                optionLocator = this.locator.locator(`[name="${this.selector.value}"]`);
                break;
            default:
                throw new Error(`Unsupported selector type: ${(this.selector as any).type}`);
        }
        await optionLocator.click();
    }

    async chooseByText(text: string) {
        await this.open();
        const option = this.locator.locator(`text=${text}`);
        if ((await option.count()) === 0) {
            throw new Error(`Option with text "${text}" not found`);
        }
        await option.first().click();
    }

    async getValue() {
        return await this.locator.locator('input').inputValue()
    }

    async expectValue(value: T) {
        await expect(this.locator.locator('input')).toHaveValue(String(value));
    }

}
