import type { Locator, Page } from '@playwright/test';

export class CartPage {
  readonly container: Locator;
  readonly emptyState: Locator;
  readonly subtotal: Locator;
  readonly total: Locator;
  readonly promoInput: Locator;
  readonly promoApply: Locator;
  readonly checkoutButton: Locator;

  constructor(private readonly page: Page) {
    this.container = page.getByTestId('cart-container');
    this.emptyState = page.getByTestId('cart-empty');
    this.subtotal = page.getByTestId('cart-subtotal');
    this.total = page.getByTestId('cart-total');
    this.promoInput = page.getByTestId('cart-promo-input');
    this.promoApply = page.getByTestId('cart-promo-apply');
    this.checkoutButton = page.getByTestId('cart-checkout-button');
  }

  async goto(): Promise<void> {
    await this.page.goto('#/cart');
  }

  item(productId: string, size = ''): Locator {
    return this.page.getByTestId(`cart-item-${productId}${size ? `-${size.toLowerCase()}` : ''}`);
  }

  quantity(productId: string): Locator {
    return this.page.getByTestId(`cart-quantity-${productId}`);
  }
}
