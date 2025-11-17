import { BaseModel } from "@models/commons/base-model/base-model";
import { Page, expect } from "@playwright/test";

import type { Elements } from "./config";

export class UserManagementPage extends BaseModel<Elements> {
    constructor(page: Page) {
        super(page);

        this.elements = {
            usernameSearchField: this.ui.textField({ type: 'css', value: '(//input[@class="oxd-input oxd-input--active"])[2]' }),
            searchButton: this.ui.button({ type: 'css', value: 'button[type="submit"]' }),
            tableRows: this.page.locator('//div[@class="oxd-table-body"]//div[@role="row"]'),
            usernameCells: this.page.locator('//div[@class="oxd-table-body"]//div[@role="row"]//div[@role="cell"][2]/div'),
        };
    }

    async searchUsersByUsername(username: string) {
        await this.elements.usernameSearchField.fill(username);
        await this.clickSearchButton();

        // Wait until search result table reloads
        const oldCount = await this.elements.tableRows.count();
        await this.page.waitForFunction(
            (oldCount) => {
                return document.querySelectorAll('div.oxd-table-body div[role="row"]').length !== oldCount;
            },
            oldCount,
            { timeout: 5000 }
        );
    }

    async clickSearchButton() {
        await this.elements.searchButton.click();
    }

    async verifyAllUsernamesMatchSearch(username: string) {
        await this.elements.tableRows.first().waitFor({ state: 'visible', timeout: 5000 });

        const count = await this.elements.usernameCells.count();
        const usernames: string[] = [];

        for (let i = 0; i < count; i++) {
            const text = await this.elements.usernameCells.nth(i).innerText();
            const trimmed = (text ?? '').trim();
            // usernames.push(trimmed);
            expect(trimmed).toEqual(username);
        }

    }
}
