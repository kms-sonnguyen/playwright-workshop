import { test, expect } from '@playwright/test';

// Session 2 homework — broken suite. Read homework/session-2/README.md first.
// Change test.describe.fixme to test.describe, then make every test pass reliably.
// A test can have MORE THAN ONE problem. Fix them all, with one CAUSE comment per problem.

test.describe.fixme('homework · sort', () => {
  test('filtering by Wrench and sorting Z to A lists the spanners first', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('checkbox', { name: 'Wrench', exact: true }).check();

    const count = await page.getByTestId('product-name').count();
    expect(count).toBe(3);

    await page.getByTestId('sort').selectOption('Name (Z - A)');

    const firstName = await page.getByTestId('product-name').first().textContent();
    expect(firstName?.trim()).toBe('Open-end Spanners (Set)');
  });
});
