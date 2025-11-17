import { BaseModel } from "@models/commons/base-model/base-model";
import { Page } from "@playwright/test";
import type { Elements } from "./config";

export class CommonPage extends BaseModel<Elements> {
    constructor(page: Page) {
        super(page);
        this.elements = {
            adminMenu: this.ui.adminMenu({ type: 'css', value: 'a[href="/web/index.php/admin/viewAdminModule"]' }),
        };
    }
    async clickAdminMenu() {
        await this.elements.adminMenu.click();
    }
}