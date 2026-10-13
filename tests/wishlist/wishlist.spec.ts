import { test, expect } from '../../fixtures/test.fixture';
import { signIn } from '../helpers';

test.describe('Wishlist', () => {
  test.beforeEach(async ({ page, loginPage }) => signIn(page, loginPage));

  test('WISHLIST-001 — une wishlist neuve est vide', async ({ wishlistPage }) => {
    await wishlistPage.goto();
    await expect(wishlistPage.emptyState).toBeVisible();
  });

  test('WISHLIST-002 — ajouter depuis une fiche produit met à jour la wishlist', async ({ page, productPage, wishlistPage }) => {
    await productPage.goto('sauce-backpack');
    await productPage.wishlistButton.click();
    await expect(productPage.wishlistButton).toHaveAttribute('aria-pressed', 'true');
    await wishlistPage.goto();

    await expect(wishlistPage.item('sauce-backpack')).toBeVisible();
    await expect(page.getByTestId('wishlist-count')).toHaveText('1');
  });

  test('WISHLIST-003 — un article wishlist survit à une actualisation', async ({ page, productPage, wishlistPage }) => {
    await productPage.goto('sauce-backpack');
    await productPage.wishlistButton.click();
    await wishlistPage.goto();
    await page.reload();

    await expect(wishlistPage.item('sauce-backpack')).toBeVisible();
  });

  test('WISHLIST-004 — retirer un article ramène à l’état vide', async ({ page, productPage, wishlistPage }) => {
    await productPage.goto('sauce-backpack');
    await productPage.wishlistButton.click();
    await wishlistPage.goto();
    await page.getByTestId('wishlist-remove-sauce-backpack').click();

    await expect(wishlistPage.emptyState).toBeVisible();
    await expect(page.getByTestId('wishlist-count')).toHaveCount(0);
  });

  test('WISHLIST-005 — ajouter un article disponible depuis la wishlist le retire de la liste', async ({ page, productPage, wishlistPage }) => {
    await productPage.goto('sauce-backpack');
    await productPage.wishlistButton.click();
    await wishlistPage.goto();
    await page.getByTestId('wishlist-add-to-cart-sauce-backpack').click();

    await expect(wishlistPage.emptyState).toBeVisible();
    await expect(page.getByTestId('cart-count')).toHaveText('1');
  });
});
