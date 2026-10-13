import { test, expect } from '../../fixtures/test.fixture';
import { signIn } from '../helpers';

test.describe('Catalogue et recherche', () => {
  test.beforeEach(async ({ page, loginPage }) => signIn(page, loginPage));

  test('CAT-001 @smoke — le catalogue affiche les produits et la pagination', async ({ page, catalogPage }) => {
    await expect(catalogPage.productGrid).toBeVisible();
    await expect(page.getByTestId('product-card-sauce-backpack')).toBeVisible();
    await expect(page.getByRole('heading', { name: /18 produits/ })).toBeVisible();
    await expect(catalogPage.pagination).toBeVisible();
  });

  test('CAT-002 — la recherche réduit les résultats au produit correspondant', async ({ page, catalogPage }) => {
    await catalogPage.search('Sac à dos');

    await expect(page.getByTestId('product-card-sauce-backpack')).toBeVisible();
    await expect(page.getByTestId('product-card-sauce-bike-light')).toHaveCount(0);
  });

  test('CAT-003 — une recherche sans résultat présente un état vide et peut être effacée', async ({ page, catalogPage }) => {
    await catalogPage.search('aucun-produit-xyz');
    await expect(page.getByTestId('empty-state')).toBeVisible();
    await page.getByTestId('reset-search').click();

    await expect(page.getByTestId('product-card-sauce-backpack')).toBeVisible();
  });

  test('CAT-004 — la catégorie livres exclut les produits des autres catégories', async ({ page }) => {
    await page.goto('#/catalog?category=books');

    await expect(page.getByTestId('product-grid')).toBeVisible();
    await expect(page.locator('[data-testid^="product-card-book-"]').first()).toBeVisible();
    await expect(page.getByTestId('product-card-sauce-backpack')).toHaveCount(0);
  });

  test('CAT-005 — le filtre de disponibilité masque les produits en rupture', async ({ page, catalogPage }) => {
    await catalogPage.inStockFilter.click();

    await expect(page.getByTestId('product-card-sauce-bike-light')).toHaveCount(0);
    await expect(page.getByTestId('product-card-sauce-backpack')).toBeVisible();
  });

  test('CAT-006 — le tri par prix croissant ordonne les cartes visibles', async ({ page, catalogPage }) => {
    await catalogPage.sortSelect.selectOption({ label: 'Prix croissant' });
    const cards = await page.locator('main article').allInnerTexts();
    const prices = cards.map((text) => {
      const amounts = [...text.matchAll(/(\d+,\d{2})\s*€/g)];
      const displayedPrice = amounts.at(-1)?.[1];
      return displayedPrice ? Number(displayedPrice.replace(',', '.')) : Number.NaN;
    }).filter(Number.isFinite);

    expect(prices.length).toBeGreaterThan(1);
    expect(prices).toEqual([...prices].sort((a, b) => a - b));
  });

  test('CAT-007 — la pagination ouvre la deuxième page de résultats', async ({ page }) => {
    await page.getByTestId('pagination-next').click();

    await expect(page.getByRole('heading', { name: /page 2\/3/i })).toBeVisible();
    await expect(page.getByTestId('product-card-sauce-backpack')).toHaveCount(0);
  });

  test('PRODUCT-001 — la fiche produit expose prix, disponibilité et action panier', async ({ page, productPage }) => {
    await productPage.goto('sauce-backpack');

    await expect(productPage.name).toHaveText('Sac à dos');
    await expect(productPage.price).toContainText('59,99');
    await expect(page.getByTestId('product-detail-stock')).toBeVisible();
    await expect(productPage.addButton).toBeEnabled();
  });

  test('PRODUCT-002 — une variante doit être choisie avant l’ajout du vêtement', async ({ page, productPage }) => {
    await productPage.goto('sauce-bolt-shirt');

    await expect(page.getByTestId('product-detail-choose-size')).toBeDisabled();
    await page.getByTestId('size-btn-M').click();
    await expect(productPage.addButton).toBeEnabled();
    await productPage.addButton.click();
    await expect(page.getByTestId('cart-count')).toHaveText('1');
  });

  test('PRODUCT-003 — un article indisponible ne peut pas être ajouté', async ({ page, productPage }) => {
    await productPage.goto('sauce-bike-light');

    await expect(productPage.outOfStock).toBeVisible();
    await expect(page.getByTestId('product-detail-out-of-stock-action')).toBeDisabled();
  });

  test('PRODUCT-004 — la quantité demandée ne dépasse pas le stock disponible', async ({ page, productPage }) => {
    await productPage.goto('sauce-backpack');
    const increase = page.getByTestId('product-detail-qty-increase');
    for (let quantity = 1; quantity < 8; quantity += 1) await increase.click();

    await expect(page.getByTestId('product-detail-qty-value')).toHaveText('8');
    await expect(increase).toBeDisabled();
    await productPage.addButton.click();
    await page.goto('#/cart');
    await expect(page.getByTestId('cart-quantity-sauce-backpack')).toHaveValue('8');
  });
});
