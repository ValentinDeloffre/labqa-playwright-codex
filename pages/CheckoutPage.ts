import type { Locator, Page } from '@playwright/test';

export class CheckoutPage {
  readonly firstName: Locator;
  readonly lastName: Locator;
  readonly email: Locator;
  readonly postalCode: Locator;
  readonly continueButton: Locator;
  readonly review: Locator;
  readonly finishButton: Locator;
  readonly cardNumber: Locator;
  readonly expiry: Locator;
  readonly cvc: Locator;
  readonly cardholder: Locator;
  readonly paymentSubmit: Locator;
  readonly confirmation: Locator;

  constructor(private readonly page: Page) {
    this.firstName = page.getByTestId('checkout-first-name');
    this.lastName = page.getByTestId('checkout-last-name');
    this.email = page.getByTestId('checkout-email');
    this.postalCode = page.getByTestId('checkout-postal-code');
    this.continueButton = page.getByTestId('checkout-continue');
    this.review = page.getByTestId('checkout-review');
    this.finishButton = page.getByTestId('checkout-finish');
    this.cardNumber = page.getByTestId('payment-card-number');
    this.expiry = page.getByTestId('payment-expiry');
    this.cvc = page.getByTestId('payment-cvc');
    this.cardholder = page.getByTestId('payment-name');
    this.paymentSubmit = page.getByTestId('payment-submit');
    this.confirmation = page.getByTestId('confirmation-container');
  }

  async fillShipping(): Promise<void> {
    await this.firstName.fill('Camille');
    await this.lastName.fill('Test');
    await this.email.fill('camille.test@example.test');
    await this.postalCode.fill('75001');
  }

  async fillAcceptedCard(): Promise<void> {
    await this.cardholder.fill('Camille Test');
    await this.cardNumber.fill('4242 4242 4242 4242');
    await this.expiry.fill('12/30');
    await this.cvc.fill('123');
  }
}
