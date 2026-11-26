import { test, expect } from '@playwright/test';

// Session 2 homework — broken suite. Read homework/session-2/README.md first.
// Change test.describe.fixme to test.describe, then make every test pass reliably.
// A test can have MORE THAN ONE problem. Fix them all, with one CAUSE comment per problem.

test.describe.fixme('homework · account', () => {
  test('a logged-in customer can open their favourites from the account menu', async ({ page }) => {
    await page.goto('/auth/login');
    await page.getByLabel('Email address').fill('customer2@practicesoftwaretesting.com');
    await page.getByLabel('Password').fill(process.env.CUSTOMER_PASSWORD as string);
    await page.getByRole('button', { name: 'Login' }).click();

    expect(page.url()).toContain('/account');
    await expect(page.getByTestId('nav-menu')).toHaveText('Jack Howe');

    await page.getByTestId('nav-menu').click();
    await page.getByTestId('nav-my-favorites').click();
    await expect(page.getByRole('heading', { name: 'Favorites' })).toBeVisible();
  });
});
