import { test, expect } from '@playwright/test';

// Session 2 homework — broken suite. Read homework/session-2/README.md first.
// Change test.describe.fixme to test.describe, then make every test pass reliably.
// A test can have MORE THAN ONE problem. Fix them all, with one CAUSE comment per problem.

test.describe.fixme('homework · language', () => {
  test('switching to German translates the menu', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Select language' }).click();
    await page.getByRole('menuitem', { name: 'DE' }).click();

    // translations take a moment to load
    await new Promise((resolve) => setTimeout(resolve, 300));

    const contactLink = await page.getByTestId('nav-contact').innerText();
    expect(contactLink.trim()).toBe('Kontakt');

    // and the English menu is gone
    await expect(page.getByRole('link', { name: 'Contact us' })).toBeHidden();
  });
});
