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
| `npm test` | Régression Chromium, sans bugs pédagogiques ni probes |
| `npm run test:smoke` | Courte smoke Chromium (`@smoke`) |
| `npm run test:smoke:all` | Smoke sur Chromium, Firefox et WebKit |
| `npm run test:all` | Régression complète cross-browser |
| `npm run test:known-bugs` | Caractérisation des bugs pédagogiques reproductibles (`@known-bug`) |
| `npm run test:probes` | Probes diagnostiques isolées (`@probe`), dont NAV-003 |
| `npm run test:headed` | Exécution Chromium avec navigateur visible |
| `npm run test:ui` | Playwright UI mode |
| `npm run test:debug` | Débogueur Playwright Chromium |
| `npm run typecheck` | Vérification TypeScript sans émission |
| `npm run report` | Ouvre le dernier rapport HTML |

Les suites de régression excluent `@known-bug` et `@probe`: elles valident les comportements fonctionnels attendus. La suite `test:known-bugs` caractérise séparément les six anomalies pédagogiques; la suite `test:probes` collecte une preuve si l’anomalie intermittente NAV-003 réapparaît. `@critical` signale le parcours d’achat principal.

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
tests/bugs/               bugs pédagogiques et probes diagnostiques séparés
docs/                     stratégie QA et matrice des cas
```

Chaque test a son propre contexte Playwright et prépare lui-même la session requise. Les `data-testid` documentés par Lab.QA servent aux contrôles métier stables; les rôles/labels sont utilisés quand ils expriment mieux l’intention utilisateur.

## Rapports et debug

Les captures et vidéos ne sont gardées qu’en cas d’échec. Les traces sont conservées en local sur échec et produites au premier retry en CI. Le rapport HTML se trouve dans `playwright-report/`, les résultats et artifacts dans `test-results/`.

## CI

GitHub Actions sépare trois jobs: `regression` bloque la PR en cas d’échec du typecheck, de la smoke ou de la suite cross-browser; `known-bugs` caractérise séparément les six anomalies pédagogiques et reste non bloquant; `probes` exécute les observations diagnostiques et reste non bloquant. Chaque job publie son propre rapport et ses artifacts, y compris après un échec.

Comptage vérifié: **55 scénarios uniques** — **48** de régression fonctionnelle, **6** de caractérisation des bugs pédagogiques et **1** probe diagnostique. Exécutés sur trois navigateurs, cela représente 144 tests de régression, 18 tests de bugs et 3 probes.

Voir [la stratégie de test](docs/test-strategy.md) et [la matrice de couverture](docs/test-cases.md) pour le périmètre, les risques et les identifiants de scénarios.
