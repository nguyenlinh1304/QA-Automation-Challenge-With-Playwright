import { BaseModel } from "@models/commons/base-model/base-model";
import { Page } from "@playwright/test";

import type { Elements } from "./config";

export class DashboardPage extends BaseModel<Elements> {
    constructor(page: Page) {
        super(page);

        this.elements = {
            label: this.ui.label({ type: 'css', value: 'h6:has-text("Dashboard")' }),
        };
    }

    async expectPageTitle(title: string) {
        await this.elements.label.expectText(title);
    }

    async expectPageTitleToBeVisible() {
        await this.elements.label.waitForVisible();
    }

}