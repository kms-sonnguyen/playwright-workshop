import { test, expect } from '@playwright/test';

// Session 2 · Exercises 1 and 2 — a broken suite.
// Exercise 1: change test.describe.fixme to test.describe, run the suite, and for every failing test
//             add a comment above it:  // CAUSE: timing | data | order | environment — <one line why>
//             Don't fix anything yet.
// Exercise 2: fix the tests you marked "timing" (web-first assertions, no sleeps), then prove it:
//             npx playwright test session-2/broken -g "log in|confirmation|only pliers" --repeat-each=20 --project=chromium
//             (the -g pattern runs only the three timing tests, one in each of account, cart and search)

test.describe.fixme('broken suite · account', () => {
  test('customer can log in and sees their account page', async ({ page }) => {
    await page.goto('/auth/login');
    await page.getByLabel('Email address').fill('customer@practicesoftwaretesting.com');
    await page.getByLabel('Password').fill('welcome01');
    await page.getByRole('button', { name: 'Login' }).click();

    expect(page.url()).toContain('/account');
    await expect(page.getByRole('heading', { name: 'My account' })).toBeVisible();
  });

  test('contact page shows the contact form', async ({ page }) => {
    await page.goto('http://localhost:4200/contact');

    await expect(page.getByRole('heading', { name: 'Contact' })).toBeVisible();
    await expect(page.getByLabel('Message')).toBeVisible();
  });
});
