import { test, expect } from '../../fixtures/test.fixture';

import { users } from '../../data/users';

test.describe('Authentification', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
  });

  test(
    'AUTH-001 @smoke - connexion avec un utilisateur valide',
    async ({ loginPage, catalogPage }) => {
      await test.step('Saisir les identifiants valides', async () => {
        await loginPage.login(users.standard);
      });

      await test.step('Vérifier l’accès au catalogue', async () => {
        await expect(catalogPage.productGrid).toBeVisible();
      });
    },
  );

  test('AUTH-002 — un identifiant inconnu affiche une erreur sans ouvrir la session', async ({ page, loginPage }) => {
    await loginPage.usernameInput.fill('utilisateur_inconnu');
    await loginPage.passwordInput.fill(users.standard.password);
    await loginPage.submitButton.click();

    await expect(loginPage.errorMessage).toContainText('ne correspondent');
    await expect(page).toHaveURL(/#\/login$/);
  });

  test('AUTH-003 — les champs vides sont signalés et la page reste exploitable', async ({ page, loginPage }) => {
    await loginPage.submitButton.click();

    await expect(loginPage.errorMessage).toHaveText("Le nom d'utilisateur est requis");
    await expect(loginPage.usernameInput).toBeEnabled();
    await expect(page).toHaveURL(/#\/login$/);
  });

  test('AUTH-004 — un compte verrouillé ne peut pas ouvrir de session', async ({ page, loginPage }) => {
    await loginPage.login(users.locked);

    await expect(loginPage.errorMessage).toHaveText('Désolé, ce compte est verrouillé');
    await expect(page).toHaveURL(/#\/login$/);
    await expect(loginPage.passwordInput).toBeEnabled();
  });

  test('AUTH-005 — le compte lent expose un état de chargement avant la connexion', async ({ page, loginPage }) => {
    await loginPage.usernameInput.fill(users.performance.username);
    await loginPage.passwordInput.fill(users.performance.password);
    const submission = loginPage.submitButton.click();

    await expect(loginPage.submitButton).toBeDisabled();
    await expect(loginPage.submitButton).toContainText('Connexion en cours');
    await submission;
    await expect(page).toHaveURL(/#\/catalog$/);
  });
});
