import { type Locator, type Page } from "@playwright/test";

export class BaseComponent {
    constructor(
        readonly page: Page,
        readonly locator: Locator,
    ) { }
}