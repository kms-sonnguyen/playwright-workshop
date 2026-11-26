import { test, expect } from '@playwright/test';

// Session 2 homework — broken suite. Read homework/session-2/README.md first.
// Change test.describe.fixme to test.describe, then make every test pass reliably.
// A test can have MORE THAN ONE problem. Fix them all, with one CAUSE comment per problem.

test.describe.fixme('homework · cart', () => {
  test('removing a product updates the cart total', async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('product-name').filter({ hasText: 'Combination Pliers' }).click();
    await page.getByTestId('add-to-cart').click();
    await expect(page.getByTestId('cart-quantity')).toHaveText('1');

    await page.goto('/');
    await page.getByTestId('product-name').filter({ hasText: /^\s*Claw Hammer\s*$/ }).click();
    await page.getByTestId('add-to-cart').click();
    await expect(page.getByTestId('cart-quantity')).toHaveText('2');

    await page.getByTestId('nav-cart').click();
    await expect(page.getByTestId('product-title')).toHaveCount(2);

    // the remove button has no accessible name, so it is found inside its row
    await page.getByRole('row').filter({ hasText: 'Claw Hammer' }).locator('a.btn-danger').click();

    await expect(page.getByTestId('cart-total')).toBeVisible();
  });
});
