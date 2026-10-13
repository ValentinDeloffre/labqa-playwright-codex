import type { Locator, Page } from '@playwright/test';

export class WishlistPage {
  readonly emptyState: Locator;

  constructor(private readonly page: Page) {
    this.emptyState = page.getByTestId('wishlist-empty');
  }

  async goto(): Promise<void> {
    await this.page.goto('#/wishlist');
  }

  item(productId: string): Locator {
    return this.page.getByTestId(`wishlist-item-${productId}`);
  }
}
