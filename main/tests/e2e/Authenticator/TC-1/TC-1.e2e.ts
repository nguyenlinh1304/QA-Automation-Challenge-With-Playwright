import { expect, test } from '@playwright/test';
import { SignInPage } from '../../../../models/pages';
import { SIGN_IN, ADMIN } from '../../../../configs/routes';

test('[TC-1] Should successfully log in when input valid email address and password', async ({
    page
}) => {
    const currentPage = new SignInPage(page);
    const PASSWORD = 'admin123';
    const USERNAME = 'Admin';

    await test.step('Navigate to the page', async () => {
        await currentPage.goto();
        await expect(page).toHaveURL(SIGN_IN.path);
    });

    await test.step('Input Username', async () => {
        await currentPage.elements.username.fill(USERNAME);
        await currentPage.elements.username.expectValue(USERNAME);
    });

    await test.step('Input Password', async () => {
        await currentPage.elements.password.fill(PASSWORD);
        await currentPage.elements.password.expectValue(PASSWORD);
    });

    await test.step('Click Login', async () => {
        await currentPage.elements.submit.click();
        await expect(page).toHaveURL(ADMIN.path);
    });
});
