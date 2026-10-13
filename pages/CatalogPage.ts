import type { Locator, Page } from '@playwright/test';

export class CatalogPage {
  readonly productGrid: Locator;
  readonly cartIcon: Locator;
  readonly searchInput: Locator;
  readonly searchButton: Locator;
  readonly sortSelect: Locator;
  readonly inStockFilter: Locator;
  readonly wishlistIcon: Locator;
  readonly pagination: Locator;

  constructor(private readonly page: Page) {
    this.productGrid = page.getByTestId('product-grid');
    this.cartIcon = page.getByTestId('cart-icon');
    this.searchInput = page.getByTestId('search-input');
    this.searchButton = page.getByTestId('search-button');
    this.sortSelect = page.getByTestId('sort-select');
    this.inStockFilter = page.getByTestId('filter-in-stock');
    this.wishlistIcon = page.getByTestId('wishlist-icon');
    this.pagination = page.getByTestId('pagination');
  }

  async goto(): Promise<void> {
    await this.page.goto('#/catalog');
  }

  async search(query: string): Promise<void> {
    await this.searchInput.fill(query);
    await this.searchButton.click();
  }

  async addProduct(productId: string): Promise<void> {
    await this.page.getByTestId(`add-to-cart-${productId}`).click();
  }
}
