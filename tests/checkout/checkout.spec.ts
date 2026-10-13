import { test, expect } from '../../fixtures/test.fixture';
import { signIn, euroAmount } from '../helpers';

test.describe('Checkout', () => {
  test.beforeEach(async ({ page, loginPage, catalogPage, cartPage }) => {
    await signIn(page, loginPage);
    await catalogPage.addProduct('sauce-backpack');
    await cartPage.goto();
    await cartPage.checkoutButton.click();
  });

  test('CHECKOUT-001 @smoke @critical — le parcours de commande crée une confirmation et vide le panier', async ({ page, checkoutPage }) => {
    await checkoutPage.fillShipping();
    await checkoutPage.continueButton.click();
    await expect(checkoutPage.review).toBeVisible();
    await expect(page.getByTestId('review-item-sauce-backpack')).toContainText('Sac à dos');
    await expect(page.getByTestId('review-total')).toBeVisible();
    await checkoutPage.finishButton.click();
    await checkoutPage.fillAcceptedCard();
    await checkoutPage.paymentSubmit.click();

    await expect(checkoutPage.confirmation).toBeVisible({ timeout: 10_000 });
    await expect(page.getByTestId('confirmation-title')).toHaveText('Commande confirmée !');
    await expect(page.getByTestId('confirmation-container')).toContainText('Camille Test');
    await expect(page.getByTestId('confirmation-container')).toContainText(/ORD-\d+/);
    await page.goto('#/cart');
    await expect(page.getByTestId('cart-empty')).toBeVisible();
  });

  test('CHECKOUT-002 — les champs livraison vides empêchent de continuer', async ({ page, checkoutPage }) => {
    await expect(checkoutPage.continueButton).toBeDisabled();
    await expect(checkoutPage.review).toHaveCount(0);
    await expect(page).toHaveURL(/#\/checkout\/info$/);
  });

  test('CHECKOUT-003 — email et code postal invalides sont rejetés', async ({ page, checkoutPage }) => {
    await checkoutPage.firstName.fill('Camille');
    await checkoutPage.lastName.fill('Test');
    await checkoutPage.email.fill('adresse-invalide');
    await checkoutPage.postalCode.fill('7500');
    await expect(checkoutPage.continueButton).toBeDisabled();
    await expect(checkoutPage.review).toHaveCount(0);
  });

  test('CHECKOUT-004 — les informations de livraison restent présentes au retour du récapitulatif', async ({ page, checkoutPage }) => {
    await checkoutPage.fillShipping();
    await checkoutPage.continueButton.click();
    await expect(checkoutPage.review).toBeVisible();
    await page.getByTestId('checkout-review-back').click();

    await expect(checkoutPage.firstName).toHaveValue('Camille');
    await expect(checkoutPage.email).toHaveValue('camille.test@example.test');
  });

  test('CHECKOUT-005 — un paiement refusé reste à l’étape paiement avec une erreur métier', async ({ page, checkoutPage }) => {
    await checkoutPage.fillShipping();
    await checkoutPage.continueButton.click();
    await checkoutPage.finishButton.click();
    await checkoutPage.fillAcceptedCard();
    await checkoutPage.cardNumber.fill('4000 0000 0000 0002');
    await checkoutPage.paymentSubmit.click();

    await expect(page.getByTestId('payment-error-declined')).toBeVisible({ timeout: 10_000 });
    await expect(checkoutPage.confirmation).toHaveCount(0);
  });

  test('CHECKOUT-008 — les champs de carte vides affichent leurs erreurs et ne valident pas le paiement', async ({ page, checkoutPage }) => {
    await checkoutPage.fillShipping();
    await checkoutPage.continueButton.click();
    await checkoutPage.finishButton.click();
    await checkoutPage.paymentSubmit.click();

    await expect(page.getByText('Le numéro de carte est requis')).toBeVisible();
    await expect(page.getByText("La date d'expiration est requise")).toBeVisible();
    await expect(page.getByText('Le cryptogramme est requis')).toBeVisible();
    await expect(page.getByText('Le nom du porteur est requis')).toBeVisible();
    await expect(checkoutPage.confirmation).toHaveCount(0);
  });

  test('CHECKOUT-006 — quitter les informations de livraison ramène au panier', async ({ page }) => {
    await page.getByTestId('checkout-cancel').click();
    await expect(page.getByTestId('cart-container')).toBeVisible();
    await expect(page.getByTestId('cart-item-sauce-backpack')).toBeVisible();
  });

  test('CHECKOUT-007 — le récapitulatif additionne livraison et montant du panier', async ({ page, checkoutPage, cartPage }) => {
    await page.goto('#/cart');
    const cartTotal = euroAmount(await cartPage.total.innerText());
    await cartPage.checkoutButton.click();
    await checkoutPage.fillShipping();
    await page.getByTestId('delivery-express').click();
    await checkoutPage.continueButton.click();

    const reviewTotal = euroAmount(await page.getByTestId('review-total').innerText());
    const delivery = euroAmount(await page.getByTestId('review-delivery').innerText());
    expect(reviewTotal).toBe(cartTotal + delivery);
  });
});
