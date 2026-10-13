import {test, expect} from '../../fixtures/test.fixture';

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
});