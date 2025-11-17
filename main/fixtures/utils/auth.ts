import { Page } from "@playwright/test";
import { DashboardPage } from "@models/pages/dashboard";

export class Auth {
    constructor(private readonly page: Page) { }

    async login() {
        await this.page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');
        await this.page.fill('input[name="username"]', 'Admin');
        await this.page.fill('input[name="password"]', 'admin123');
        await this.page.click('button[type="submit"]');
        // In cookie
        const cookies = await this.page.context().cookies();
        console.log('All cookies:', cookies);

        return new DashboardPage(this.page);
    }
}
