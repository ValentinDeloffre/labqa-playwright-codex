import type { Locator, Page } from '@playwright/test';

export class CatalogPage {
  readonly productGrid: Locator;
  readonly cartIcon: Locator;
  readonly searchInput: Locator;

  constructor(page: Page) {
    this.productGrid = page.getByTestId('product-grid');
    this.cartIcon = page.getByTestId('cart-icon');
    this.searchInput = page.getByTestId('search-input');
  }
}