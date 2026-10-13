# Lab.QA — suite E2E Playwright

Suite TypeScript/Playwright pour valider les parcours de la boutique fictive [Lab.QA](https://ssid-testing-agency.github.io/Lab.qa/). Le projet privilégie des tests reproductibles centrés sur les règles métier: session, disponibilité, montants, wishlist et tunnel de commande. L’application cible reste un environnement d’entraînement; les comptes, moyens de paiement et commandes utilisés ici sont entièrement fictifs.

## Démarrer

```bash
npm ci
npx playwright install
npm run typecheck
npm test
```

`BASE_URL` permet de viser un environnement compatible. Exemple PowerShell:

```powershell
$env:BASE_URL = "https://ssid-testing-agency.github.io/Lab.qa/"
npm test
```

## Commandes

| Commande | Usage |
|---|---|
| `npm test` | Régression Chromium, sans anomalies connues |
| `npm run test:smoke` | Courte smoke Chromium (`@smoke`) |
| `npm run test:smoke:all` | Smoke sur Chromium, Firefox et WebKit |
| `npm run test:all` | Régression complète cross-browser |
| `npm run test:known-bugs` | Détection distincte des anomalies documentées (`@known-bug`) |
| `npm run test:headed` | Exécution Chromium avec navigateur visible |
| `npm run test:ui` | Playwright UI mode |
| `npm run test:debug` | Débogueur Playwright Chromium |
| `npm run typecheck` | Vérification TypeScript sans émission |
| `npm run report` | Ouvre le dernier rapport HTML |

Les suites de régression excluent `@known-bug`: elles vérifient les attentes nominales. La commande dédiée aux bugs passe au vert lorsque les symptômes de formation attendus sont détectés. `@critical` signale le parcours d’achat principal.

## Architecture

```text
data/                     comptes seedés
fixtures/test.fixture.ts  fixtures et Page Objects
pages/                    objets Login, Catalogue, Produit, Panier, Wishlist, Checkout
tests/auth/               authentification
tests/catalog/            catalogue et détails produit
tests/cart/               règles du panier
tests/wishlist/           favoris
tests/checkout/           tunnel d’achat
tests/account/            profil, commandes, adresse et sécurité
tests/navigation/         routes, landing et QA Lab
tests/bugs/               détection séparée des bugs connus
docs/                     stratégie QA et matrice des cas
```

Chaque test a son propre contexte Playwright et prépare lui-même la session requise. Les `data-testid` documentés par Lab.QA servent aux contrôles métier stables; les rôles/labels sont utilisés quand ils expriment mieux l’intention utilisateur.

## Rapports et debug

Les captures et vidéos ne sont gardées qu’en cas d’échec. Les traces sont conservées en local sur échec et produites au premier retry en CI. Le rapport HTML se trouve dans `playwright-report/`, les résultats et artifacts dans `test-results/`.

## CI

GitHub Actions installe Node et les navigateurs Playwright, vérifie le typecheck, exécute la smoke Chromium puis la régression et les tests `@known-bug` sur les trois navigateurs. Le rapport HTML et les artifacts de diagnostic sont publiés comme artifact GitHub Actions, même après un échec.

Voir [la stratégie de test](docs/test-strategy.md) et [la matrice de couverture](docs/test-cases.md) pour le périmètre, les risques et les identifiants de scénarios.
