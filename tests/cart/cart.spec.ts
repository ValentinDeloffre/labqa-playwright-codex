import { test, expect } from '../../fixtures/test.fixture';
import { signIn, euroAmount } from '../helpers';

test.describe('Panier', () => {
  test.beforeEach(async ({ page, loginPage }) => signIn(page, loginPage));

  test('CART-001 — un panier neuf est vide', async ({ cartPage }) => {
    await cartPage.goto();
    await expect(cartPage.emptyState).toBeVisible();
    await expect(cartPage.checkoutButton).toBeDisabled();
  });

  test('CART-002 @smoke — ajouter un article affiche la ligne et les montants exacts', async ({ page, catalogPage, cartPage }) => {
    await catalogPage.addProduct('sauce-backpack');
    await cartPage.goto();

    await expect(cartPage.item('sauce-backpack')).toBeVisible();
    await expect(cartPage.quantity('sauce-backpack')).toHaveValue('1');
    expect(euroAmount(await cartPage.subtotal.innerText())).toBe(5999);
    expect(euroAmount(await cartPage.total.innerText())).toBe(5999);
  });

  test('CART-003 — augmenter puis diminuer la quantité recalcule le total', async ({ page, catalogPage, cartPage }) => {
    await catalogPage.addProduct('sauce-backpack');
    await cartPage.goto();
    await page.getByTestId('cart-increase-sauce-backpack').click();

    await expect(cartPage.quantity('sauce-backpack')).toHaveValue('2');
    expect(euroAmount(await cartPage.subtotal.innerText())).toBe(11998);
    await page.getByTestId('cart-decrease-sauce-backpack').click();
    await expect(cartPage.quantity('sauce-backpack')).toHaveValue('1');
  });

  test('CART-004 — la suppression peut être annulée', async ({ page, catalogPage, cartPage }) => {
    await catalogPage.addProduct('sauce-backpack');
    await cartPage.goto();
    await page.getByTestId('cart-remove-sauce-backpack').click();

    await expect(page.getByTestId('cart-undo-banner')).toBeVisible();
    await page.getByTestId('cart-undo-btn').click();
    await expect(cartPage.item('sauce-backpack')).toBeVisible();
  });

  test('CART-005 — TESTQA applique 10 % puis le retrait restaure le total', async ({ page, catalogPage, cartPage }) => {
    await catalogPage.addProduct('sauce-backpack');
    await cartPage.goto();
    const before = euroAmount(await cartPage.total.innerText());
    await cartPage.promoInput.fill('TESTQA');
    await cartPage.promoApply.click();

    await expect(page.getByTestId('cart-discount')).toContainText('6,00');
    expect(euroAmount(await cartPage.total.innerText())).toBe(5399);
    await page.getByTestId('cart-remove-promo').click();
    expect(euroAmount(await cartPage.total.innerText())).toBe(before);
  });

  test('CART-006 — un code promo inconnu laisse le panier inchangé', async ({ page, catalogPage, cartPage }) => {
    await catalogPage.addProduct('sauce-backpack');
    await cartPage.goto();
    const before = await cartPage.total.innerText();
    await cartPage.promoInput.fill('NOT-A-CODE');
    await cartPage.promoApply.click();

    await expect(page.getByTestId('cart-promo-error')).toHaveText('Code promo invalide');
    await expect(cartPage.total).toHaveText(before);
  });

  test('CART-007 — le panier persiste après actualisation', async ({ page, catalogPage, cartPage }) => {
    await catalogPage.addProduct('sauce-backpack');
    await cartPage.goto();
    await page.reload();

    await expect(cartPage.item('sauce-backpack')).toBeVisible();
    await expect(cartPage.quantity('sauce-backpack')).toHaveValue('1');
  });

  test('CART-008 — vider le panier présente l’état vide et permet une annulation', async ({ page, catalogPage, cartPage }) => {
    await catalogPage.addProduct('sauce-backpack');
    await cartPage.goto();
    await page.getByTestId('cart-clear').click();

    await expect(cartPage.emptyState).toBeVisible();
    await page.getByTestId('cart-undo-btn').click();
    await expect(cartPage.item('sauce-backpack')).toBeVisible();
  });
});
