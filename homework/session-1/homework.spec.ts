import { test, expect } from '@playwright/test'

// Session 1 homework — see homework/session-1/README.md for the four test cases.
// Write one test per test case below. Submit on branch hw/s1.

test.describe('Session 1 homework', () => {
  test('TC-01 contact form shows validation errors, then accepts a valid message', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('link', { name: 'Contact' }).click()

    // Step 2: send an empty form
    await page.getByRole('button', { name: 'Send' }).click()
    await expect(page.getByText('First name is required')).toBeVisible()
    await expect(page.getByText('Last name is required')).toBeVisible()
    await expect(page.getByText('Email is required')).toBeVisible()
    await expect(page.getByText('Subject is required')).toBeVisible()
    await expect(page.getByText('Message is required')).toBeVisible()

    // Step 3: invalid email and a short message
    await page.getByLabel('First name').fill('Jane')
    await page.getByLabel('Last name').fill('Doe')
    await page.getByLabel('Email').fill('not-an-email')
    await page.getByLabel('Subject').selectOption('Warranty')
    await page.getByLabel('Message').fill('Too short')
    await page.getByRole('button', { name: 'Send' }).click()
    await expect(page.getByText('Email format is invalid')).toBeVisible()
    await expect(page.getByText('Message must be minimal 50 characters')).toBeVisible()

    // Step 4: fix the email and write a long enough message
    await page.getByLabel('Email').fill('jane.doe@example.com')
    await page.getByLabel('Message').fill('I bought a hammer last week and the handle broke on the first use. Could you help me with a warranty claim?')
    // The form validates on blur, so move focus out of the message field before sending.
    await page.getByLabel('Message').blur()
    await page.getByRole('button', { name: 'Send' }).click()
    await expect(page.getByRole('alert')).toHaveText('Thanks for your message! We will contact you shortly.')
  })

  test('TC-02 cart updates quantities and totals, and can be emptied', async ({ page }) => {
    await page.goto('/')
    await page.getByPlaceholder('Search').fill('Slip Joint Pliers')
    await page.getByRole('button', { name: 'Search' }).click()
    await page.getByRole('link', { name: 'Slip Joint Pliers' }).click()

    // Step 2: click Increase twice to go from 1 to 3, then add to cart
    const increase = page.getByRole('button', { name: 'Increase quantity' })
    await increase.click()
    await increase.click()
    await expect(page.getByRole('spinbutton', { name: 'Quantity' })).toHaveValue('3')
    await page.getByRole('button', { name: 'Add to cart' }).click()
    await expect(page.getByText('Product added to shopping cart.')).toBeVisible()
    await expect(page.getByTestId('cart-quantity')).toHaveText('3')

    // Step 3: open the cart. The prices and badge have no role or label, so I use their data-test ids.
    await page.getByRole('link', { name: 'Cart' }).click()
    await expect(page.getByTestId('line-price')).toHaveText('$27.51')
    await expect(page.getByTestId('cart-total')).toHaveText('$27.51')

    // Step 4: change the quantity to 1. The cart saves on blur, so Tab out of the field (there is no Update button).
    await page.getByRole('spinbutton', { name: 'Quantity for Slip Joint Pliers' }).fill('1')
    await page.keyboard.press('Tab')
    await expect(page.getByText('Product quantity updated.')).toBeVisible()
    await expect(page.getByTestId('cart-total')).toHaveText('$9.17')
    await expect(page.getByTestId('cart-quantity')).toHaveText('1')

    // Step 5: remove the item. The remove button is an icon with no name, role, or test id.
    // So I find this product's table row and use the only link inside it.
    await page.getByRole('row').filter({ hasText: 'Slip Joint Pliers' }).locator('a').click()
    await expect(page.getByText('Product deleted.')).toBeVisible()
    await expect(page.getByText('The cart is empty. Nothing to display.')).toBeVisible()
  })

  test('TC-03 an out-of-stock product cannot be added to the cart', async ({ page }) => {
    await page.goto('/')
    await page.getByPlaceholder('Search').fill('long nose')
    await page.getByRole('button', { name: 'Search' }).click()
    await expect(page.getByText("1 product found for 'long nose'")).toBeVisible()
    await expect(page.getByText('Out of stock')).toBeVisible()

    await page.getByRole('link', { name: 'Long Nose Pliers' }).click()
    await expect(page.getByRole('button', { name: 'Add to cart' })).toBeDisabled()
    await expect(page.getByRole('spinbutton', { name: 'Quantity' })).toBeDisabled()
    await expect(page.getByRole('button', { name: 'Increase quantity' })).toBeDisabled()
    await expect(page.getByRole('button', { name: 'Decrease quantity' })).toBeDisabled()
  })

  test('TC-04 filtering by Drill and sorting by price lists the drills cheapest first', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('checkbox', { name: 'Drill', exact: true }).click()
    await page.getByLabel('Sort').selectOption({ label: 'Price (Low - High)' })

    // The shop has four cordless drills, but only the 12V and 24V ones are in the Drill category.
    // The 18V and 20V drills are filed elsewhere, so the Drill filter does not show them.
    // Product names and prices have no role or label, so I use their data-test ids.
    await expect(page.getByTestId('product-name')).toHaveText(['Cordless Drill 12V', 'Cordless Drill 24V'])
    await expect(page.getByTestId('product-price')).toHaveText(['$46.50', '$66.54'])
  })
})
