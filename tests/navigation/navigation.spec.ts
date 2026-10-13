import { test, expect } from '../../fixtures/test.fixture';
import { signIn } from '../helpers';

test('NAV-001 @smoke — l’accueil public conduit au catalogue', async ({ page }) => {
  await page.goto('#/');
  await expect(page.getByRole('heading', { name: /bienvenue|boutique/i })).toBeVisible();
  await page.getByTestId('landing-start').click();
  await expect(page).toHaveURL(/#\/login$/);
  await expect(page.getByRole('heading', { name: 'Connexion' })).toBeVisible();
});

test('NAV-002 — une route protégée redirige un visiteur vers le login', async ({ page }) => {
  await page.goto('#/cart');
  await expect(page).toHaveURL(/#\/login$/);
  await expect(page.getByRole('heading', { name: 'Connexion' })).toBeVisible();
});

test('CHECKOUT-009 — un panier vide ne peut pas commencer le checkout', async ({ page, loginPage, cartPage }) => {
  await signIn(page, loginPage);
  await page.goto('#/checkout/info');

  await expect(page).toHaveURL(/#\/cart$/);
  await expect(cartPage.emptyState).toBeVisible();
});

test('NAV-004 — le logout ferme la session et protège de nouveau le compte', async ({ page, loginPage }) => {
  await signIn(page, loginPage);
  await page.getByTestId('logout-button').click();

  await expect(page).toHaveURL(/#\/login$/);
  await page.goto('#/account');
  await expect(page).toHaveURL(/#\/login$/);
});

test('NAV-005 — About et route inconnue présentent des contenus identifiables', async ({ page, loginPage }) => {
  await signIn(page, loginPage);
  await page.goto('#/about');
  await expect(page.getByRole('heading', { name: /à propos/i })).toBeVisible();
  await page.goto('#/route-inconnue');
  await expect(page.getByRole('heading', { name: /404|introuvable|non trouvée/i })).toBeVisible();
});

test('LAB-001 — le QA Lab explique ses cinq bugs intentionnels et leurs déclencheurs', async ({ page, loginPage }) => {
  await signIn(page, loginPage);
  await page.goto('#/qa-lab');

  await expect(page.getByRole('heading', { name: 'QA Lab — Bugs intentionnels' })).toBeVisible();
  await expect(page.getByText('invalid-form-accepted')).toBeVisible();
  await expect(page.getByText('price-off-by-one')).toBeVisible();
  await expect(page.getByText('TESTQA').first()).toBeVisible();
});
