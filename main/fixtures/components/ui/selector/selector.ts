import { Locator, Page } from "@playwright/test";

export type Selector =
    | { type: 'datatestId'; value: string }
    | { type: 'css'; value: string }
    | { type: 'tag'; value: string }
    | { type: 'xpath'; value: string }
    | { type: 'text'; value: string }
    | { type: 'name'; value: string }
    | { type: 'label'; value: string }

export const resolveSelector = (page: Page, selector: Selector): Locator => {
    switch (selector.type) {
        case 'datatestId':
            return page.getByTestId(selector.value);
        case 'css':
            return page.locator(selector.value);
        case 'tag':
            return page.locator(selector.value);
        case 'xpath':
            return page.locator(`xpath=${selector.value}`);
        case 'text':
            return page.locator(selector.value);
        case 'name':
            return page.locator(`[name="${selector.value}"]`);
        case 'label':
            return page.locator(`label:has-text("${selector.value}")`);
        default:
            throw new Error(`Unknown selector type: ${(selector as any).type}`);
    }
}