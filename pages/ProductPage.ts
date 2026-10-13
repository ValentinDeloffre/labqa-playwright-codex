import type { Locator, Page } from '@playwright/test';

export class ProductPage {
  readonly name: Locator;
  readonly price: Locator;
  readonly quantity: Locator;
  readonly addButton: Locator;
  readonly wishlistButton: Locator;
  readonly outOfStock: Locator;

  constructor(private readonly page: Page) {
    this.name = page.getByTestId('product-detail-name');
    this.price = page.getByTestId('product-detail-price');
    this.quantity = page.getByTestId('product-detail-qty-value');
    this.addButton = page.getByTestId('product-detail-add-to-cart');
    this.wishlistButton = page.getByTestId('wishlist-btn-detail');
    this.outOfStock = page.getByTestId('product-detail-out-of-stock');
  }

  async goto(productId: string): Promise<void> {
    await this.page.goto(`#/product/${productId}`);
  }
}
