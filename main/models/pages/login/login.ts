import { BaseModel } from "@models/commons/base-model/base-model";
import { Page } from "@playwright/test";

import type { Elements } from "./config";
import { SIGN_IN } from "@src/configs/routes";

export class SignInPage extends BaseModel<Elements> {
    constructor(page: Page) {
        super(page);

        this.elements = {
            username: this.ui.textField({ type: 'name', value: 'username' }),
            password: this.ui.textField({ type: 'name', value: 'password' }),
            submit: this.ui.button({ type: 'css', value: 'button[type="submit"]' }),
        };
    }

    async goto() {
        await this.page.goto(SIGN_IN.path);
    }

}