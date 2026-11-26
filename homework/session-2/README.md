# Session 2 homework — debug a broken suite, then automate 3 longer scenarios

**Due:** 48 hours before Session 3 · **Time:** about 3–4 hours
**Submit:** a pull request from branch `hw/s2` (see the course README)

Both parts are different from the in-class exercises: new features, longer flows, and problems that hide behind each other.
Before you submit, run `npm run selfcheck`.

---

## Part 1 — Fix the broken suite (about 1.5 hours)

**Files:** `tests/session-2/homework/broken/` (5 files, 7 tests)

This suite is harder than the one in class:

- **Some tests have more than one problem.** When you fix the first one, the test may fail somewhere else. Keep going.
- **One test passes today** — but it would also pass if the feature it checks were broken. Nothing will fail to point you at it.
  Read every test and ask: *if this feature broke, would this test go red?*

Steps:

1. In each file, change `test.describe.fixme` to `test.describe`.
2. Run the suite and read every failure (error message, HTML report, trace):
   ```bash
   npx playwright test session-2/homework/broken --project=chromium
   ```
3. Fix each problem **at its cause**. Above the test, add one comment line **per problem**:
   ```ts
   // CAUSE: timing — counted the products once, before the Wrench filter had been applied
   // CAUSE: weak assertion — only checked the total was visible, not that it changed
   ```
   The cause is one of **timing**, **data**, **order**, **environment** — or **weak assertion** for a check that can't fail.
4. Prove the suite is reliable — every test must pass **20 out of 20**, and in random order:
   ```bash
   npx playwright test session-2/homework/broken --project=chromium --repeat-each=20
   npx playwright test session-2/homework/broken --project=chromium --shuffle
   ```

Rules:

- **No hard waits** of any kind — not `waitForTimeout`, and not a `setTimeout` promise either.
- **No retries or longer timeouts** to make a test pass, in the config or in the test.
- Keep what each test is meant to check. A "fix" that deletes an assertion is not a fix — strengthen it instead.
- If a test needs a password, it must work on a fresh clone of the repo with no `.env` file, and still allow an override from `.env`. Document any new variable in `.env.example`.

> Hints: at least one test fails only when it runs in a different worker from another test — try `--workers=1`, then the default.
> A check that something is **hidden** passes when the locator matches nothing at all.

---

## Part 2 — Three longer scenarios (about 2 hours)

**File:** `tests/session-2/homework/new-tests.spec.ts` — one Playwright test per test case.

Explore each scenario by hand first — each one has a surprise in it. Each test must **pass**, and must **fail if the feature it checks is broken**.
Check every expected result right after the step it belongs to. Above each test, write how you checked it can fail:

```ts
// Can fail: changed the expected total to $47.83 — the test failed at step 4.
```

All scenarios start **not logged in** with an empty cart (every Playwright test gets a fresh browser).
**Find products like a user would** (search or click) — product ids change when the data is reset.

### TC-05 — Cart quantities, a per-product limit and totals

| | |
|---|---|
| **Steps** | 1. Open **Slip Joint Pliers**, set the quantity to **2** and click **Add to cart** <br> 2. Open **Thor Hammer** and click **Add to cart** <br> 3. Open the cart from the header <br> 4. Change the Slip Joint Pliers quantity to **4** <br> 5. Change the Thor Hammer quantity to **2** <br> 6. Reload the cart page |
| **Expected result** | After step 1: "Product added to shopping cart." appears and the cart icon shows **2**. <br> After step 2: the cart icon shows **3**. <br> After step 3: Slip Joint Pliers line total **$18.34**, Thor Hammer line total **$11.14**, cart total **$29.48**. <br> After step 4: "Product quantity updated." appears, the Slip Joint Pliers line total is **$36.68**, the cart total **$47.82**, and the cart icon shows **5**. <br> After step 5: "You can only have one Thor Hammer in the cart." appears. <br> After step 6: Thor Hammer's quantity is **1** and the cart total is still **$47.82**. |

> Watch the screen closely between steps 5 and 6. What does the page show before you reload, and is that what the shop saved?
> Write what you saw in a comment in your test.

### TC-06 — A guest can check out up to the payment step, with the address they typed

| | |
|---|---|
| **Steps** | 1. Add **Combination Pliers** to the cart, open the cart and click **Proceed to checkout** <br> 2. Choose **Continue as Guest**, enter an email address, first name and last name, and continue <br> 3. Click **Proceed to checkout** <br> 4. Fill in the billing address: Country **Viet Nam**, Postal code **700000**, House number **12**, Street **Nguyen Hue**, City **Ho Chi Minh City**, State **Ho Chi Minh** <br> 5. Click **Proceed to checkout** <br> 6. Choose the payment method **Bank Transfer** |
| **Expected result** | After step 2: "Continuing as guest: *first last* (*email*)" is shown. <br> After step 4: the Street, City and State fields contain **exactly** what you typed, and **Proceed to checkout** is enabled. <br> After step 5: the **Payment** step is shown and **Confirm** is disabled. <br> After step 6: the fields **Bank Name**, **Account Name** and **Account Number** appear and **Confirm** is enabled. |

> **Do not click Confirm** — that places an order on the shared server.
> Fill in the address by hand, slowly, and watch the Street field after you enter the postal code and house number.
> Your test must give the same result every time, however fast the server answers.

### TC-07 — Widening and narrowing the price range changes which products are listed

| | |
|---|---|
| **Steps** | 1. Open the home page and tick the categories **Sander** and **Workbench** <br> 2. Move the **maximum** price handle all the way to the top <br> 3. Sort by **Price (High - Low)** <br> 4. Move the **minimum** price handle up to **101** |
| **Expected result** | After step 1: only **Sheet Sander** and **Belt Sander** are listed. <br> After step 2: **5** products are listed. <br> After step 3: they are listed in this order: Workbench with Drawers **$178.20**, Wooden Workbench **$172.52**, Random Orbit Sander **$100.79**, Belt Sander **$73.59**, Sheet Sander **$58.48**. <br> After step 4: only the two workbenches are listed, still most expensive first. |

> The price handles are sliders. Dragging with the mouse at fixed pixel positions breaks as soon as the layout changes —
> find a way to move them that doesn't depend on where they are on screen. (Try the keyboard on the handle by hand first.)
> Check the handle's value too, not only the product list.

---

## What's scored

| Criterion | Weight |
|---|---|
| Broken suite passes reliably (20/20 with `--repeat-each=20`, and with `--shuffle`) | Gate |
| Assertion quality — every test fails when its feature breaks (including the one that passed from the start) | 40% |
| Correct root-cause fixes, with one CAUSE comment per problem that names the real cause | 30% |
| No hard waits; web-first assertions | 20% |
| Clear test names and comments | 10% |

From this session on, a test that only passes on a re-run counts as **flaky** and loses points.

## Hints

- Read the error **top to bottom** before you open any tool: what was checked, expected vs received, which line.
- Traces: the course config records them only on retry, and local runs don't retry. Add `--trace on` to the command
  instead of editing `playwright.config.ts` (the grader compares it with the template).
- A one-time read (`textContent()`, `innerText()`, `count()`, `page.url()`) followed by `expect(value)` does not wait.
  `await expect(locator).toHaveText(…)` and `await expect(page).toHaveURL(…)` do.
- Run `npx eslint tests` — some of its warnings point straight at a problem.
- Go through `docs/review-checklist.md` (Sessions 1 and 2) before you open the pull request.
