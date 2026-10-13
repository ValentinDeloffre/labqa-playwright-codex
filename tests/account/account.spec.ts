import { test, expect } from '../../fixtures/test.fixture';
import { signIn } from '../helpers';

test.describe('Compte client', () => {
  test.beforeEach(async ({ page, loginPage }) => {
    await signIn(page, loginPage);
    await page.goto('#/account');
  });

  test('ACCOUNT-001 — le compte affiche l’utilisateur et son profil', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Mon compte' })).toBeVisible();
    await expect(page.getByTestId('profile-first-name')).toHaveValue('Jane');
    await expect(page.getByTestId('profile-email')).toHaveValue('jane.doe@lab.qa');
  });

  test('ACCOUNT-002 — le profil valide peut être enregistré', async ({ page }) => {
    await page.getByTestId('profile-first-name').fill('Camille');
    await page.getByTestId('profile-submit').click();

    await expect(page.getByTestId('profile-success')).toBeVisible();
  });

  test('ACCOUNT-003 — l’historique affiche les commandes seedées et leurs états', async ({ page }) => {
    await page.getByTestId('account-tab-orders').click();

    await expect(page.getByTestId('orders-table')).toBeVisible();
    await expect(page.getByTestId('order-row-SL-20241201-001')).toContainText('Livré');
    await expect(page.getByTestId('order-row-SL-20250301-003')).toContainText('En cours');
  });

  test('ACCOUNT-004 — une adresse éditée est présentée avec son nouvel état sauvegardé', async ({ page }) => {
    await page.getByTestId('account-tab-addresses').click();
    await page.getByTestId('address-edit-button').click();
    await page.getByTestId('address-city').fill('Lyon');
    await page.getByTestId('address-save').click();

    await expect(page.getByTestId('address-success')).toBeVisible();
    await expect(page.getByTestId('address-card')).toContainText('Lyon');
  });

  test('ACCOUNT-005 — une tentative de changement de mot de passe valide renvoie un succès explicite', async ({ page }) => {
    await page.getByTestId('account-tab-security').click();
    await page.getByTestId('password-current').fill('Baguette42!');
    await page.getByTestId('password-new').fill('NouveauPass42');
    await page.getByTestId('password-confirm').fill('NouveauPass42');
    await page.getByTestId('password-submit').click();

    await expect(page.getByTestId('password-success')).toBeVisible();
  });
});
