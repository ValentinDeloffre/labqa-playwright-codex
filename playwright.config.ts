import { defineConfig, devices } from '@playwright/test';

/**
 * Détecte si les tests s'exécutent dans une CI
 * (GitHub Actions par exemple).
 */
const isCI = !!process.env.CI;

const baseURL =
  process.env.BASE_URL ??
  'https://ssid-testing-agency.github.io/Lab.qa/';

export default defineConfig({

  testDir: './tests',

  timeout: 15_000,

  expect: {
    timeout: 5_000,
  },

  // Autorise Playwright à exécuter plusieurs tests en parallèle.
  fullyParallel: true,

  /**
   * Empêche de laisser accidentellement un test.only en CI.
   * Cela évite qu'une pipeline n'exécute qu'un seul test par erreur.
   */
  forbidOnly: isCI,

  /**
   * En local : aucun retry pour voir immédiatement les échecs.
   * En CI : deux nouvelles tentatives en cas d'échec.
   */
  retries: isCI ? 2 : 0,

  /**
   * En CI, on limite volontairement le nombre de workers
   * pour rendre les exécutions plus stables.
   *
   * En local, Playwright choisit automatiquement.
   */
  workers: isCI ? 2 : undefined,

  /**
   * Reporter différent selon l'environnement.
   *
   * Local :
   * - affichage lisible dans le terminal
   * - rapport HTML disponible
   *
   * CI :
   * - intégration des erreurs dans GitHub Actions
   * - rapport HTML conservable comme artifact
   */
  reporter: isCI
    ? [
        ['github'],
        ['html', { open: 'never' }],
      ]
    : [
        ['list'],
        ['html', { open: 'never' }],
      ],

  use: {
    baseURL,
    actionTimeout: 10_000,
    navigationTimeout: 15_000,
    trace: isCI ? 'on-first-retry' : 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
      },
    },

    {
      name: 'firefox',
      use: {
        ...devices['Desktop Firefox'],
      },
    },

    {
      name: 'webkit',
      use: {
        ...devices['Desktop Safari'],
      },
    },
  ],
});