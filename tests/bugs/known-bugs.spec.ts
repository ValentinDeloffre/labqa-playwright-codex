import { test, expect } from '../../fixtures/test.fixture';
import type { Page } from '@playwright/test';
import { signIn, euroAmount } from '../helpers';
import { users } from '../../data/users';

async function expectBrokenImage(page: Page): Promise<void> {
  const image = page.getByTestId('product-image-book-playwright');
  await expect(image).toBeVisible();
  await expect.poll(() => image.evaluate((element) => (element as HTMLImageElement).complete)).toBe(true);
  expect(await image.evaluate((element) => (element as HTMLImageElement).naturalWidth)).toBe(0);
}

async function expectReversedPriceSort(page: Page): Promise<void> {
  await page.getByTestId('sort-select').selectOption({ label: 'Prix croissant' });
  const raw = await page.locator('[data-testid^="product-price-"]').allTextContents();
  const values = raw.map((value) => Number(value.replace(/[^\d,.-]/g, '').replace(',', '.')));

  expect(values.length).toBeGreaterThan(1);
  expect(values).toEqual([...values].sort((a, b) => b - a));
}

async function expectDisappearingButton(page: Page): Promise<void> {
  const buttons = await page.locator('[data-testid^="add-to-cart-"]').all();
  const visibility = await Promise.all(buttons.map((button) => button.isVisible()));
  expect(visibility).toContain(false);
}

test.describe('Bugs pédagogiques caractérisés @known-bug', () => {
  test.describe('Activation par URL', () => {
    test.beforeEach(async ({ page, loginPage }) => {
      await signIn(page, loginPage);
      await page.goto('#/catalog?bugs=true');
      await expect(page.getByTestId('bug-mode-banner')).toBeVisible();
    });

    test('BUG-001 — broken-images rend une image produit inutilisable', async ({ page }) => {
      await expectBrokenImage(page);
    });

    test('BUG-002 — reversed-sort inverse les prix malgré la sélection croissante', async ({ page }) => {
      await expectReversedPriceSort(page);
    });

    test('BUG-003 — disappearing-button laisse au moins une action panier invisible', async ({ page }) => {
      await expectDisappearingButton(page);
    });

    test('BUG-004 — invalid-form-accepted accepte une livraison vide', async ({ page, catalogPage, checkoutPage }) => {
      await catalogPage.addProduct('book-ddd');
      await page.goto('#/checkout/info?bugs=true');
      await checkoutPage.continueButton.click();

      await expect(checkoutPage.review).toBeVisible();
    });

    test('BUG-005 — price-off-by-one affiche un centime de moins sur le total', async ({ page, catalogPage, cartPage }) => {
      const expectedTotal = euroAmount(await page.getByTestId('product-price-book-ddd').innerText());
      await catalogPage.addProduct('book-ddd');
      await page.goto('#/cart?bugs=true');

      expect(euroAmount(await cartPage.total.innerText())).toBe(expectedTotal - 1);
    });
  });

  test('BUG-006 — client_chaos reproduit les trois anomalies du catalogue', async ({ page, loginPage }) => {
    await page.goto('#/login');
    await loginPage.login(users.problem);

    await expect(page.getByTestId('bug-mode-banner')).toBeVisible();
    await expect(page.getByTestId('product-grid')).toBeVisible();
    await expectBrokenImage(page);
    await expectReversedPriceSort(page);
    await expectDisappearingButton(page);
  });
});

test('NAV-003 @probe @app-bug — observe la redirection login d’une session active', async ({ page, loginPage }) => {
  await signIn(page, loginPage);
  const persistedAuth = await page.evaluate(() => {
    const value = localStorage.getItem('auth-storage');
    return value ? JSON.parse(value).state.isAuthenticated : false;
  });
  expect(persistedAuth).toBe(true);
  await page.goto('#/login');

  const remainsOnLogin = new URL(page.url()).hash === '#/login';
  if (remainsOnLogin) {
    const observedUrl = page.url();
    const visibleText = await page.locator('body').innerText();
    test.info().annotations.push({
      type: 'app-anomaly',
      description: `La route login reste accessible malgré une session persistée; observé de façon intermittente en WebKit (${observedUrl}).`,
    });
    await test.info().attach('probe-observation', {
      body: `Session persistée : ${persistedAuth}\nURL observée : ${observedUrl}\nContenu visible :\n${visibleText}`,
      contentType: 'text/plain',
    });
    await test.info().attach('probe-screenshot', {
      body: await page.screenshot(),
      contentType: 'image/png',
    });
  }
});
