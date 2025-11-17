import { expect, test } from '@playwright/test';
import { Auth } from '../../../fixtures/utils/auth';
import { CommonPage } from '../../../models/pages';
import { UserManagementPage } from '../../../models/pages/user-management';
import { USER_MANAGEMENT } from '../../../configs/routes';

test.beforeEach(async ({ page }) => {
    const auth = new Auth(page);
    await auth.login();
});

test('[OD-3] Should successfully search user by Username ', async ({
    page, request
}) => {
    const commonPage = new CommonPage(page);
    await commonPage.clickAdminMenu();
    await expect(page).toHaveURL(USER_MANAGEMENT.path);
    const userManagementPage = new UserManagementPage(page);
    await userManagementPage.searchUsersByUsername('Admin');
    await userManagementPage.clickSearchButton();
    await userManagementPage.verifyAllUsernamesMatchSearch('Admin');
});