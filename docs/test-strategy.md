# Stratégie de test — Lab.QA

## Contexte et périmètre

Lab.QA est une boutique fictive, hébergée comme site statique. Les comptes, articles, montants, commandes et paiements sont des données de formation; l’application conserve une partie de l’état dans `localStorage`. La suite valide les parcours utilisateur visibles au navigateur et s’appuie sur les `data-testid` documentés par l’application.

Le périmètre couvre l’authentification, les routes, le catalogue, les fiches produit, le panier, la wishlist, les étapes livraison/récapitulatif/paiement, le compte, la route QA Lab et les anomalies d’entraînement documentées. Les contrôles internes de l’application, les performances de charge, la sécurité et les paiements réels sont hors périmètre.

## Risques prioritaires

| Risque | Impact | Réponse de test |
|---|---|---|
| Mauvais accès ou redirection de session | Élevé | Login nominal/erroné, compte bloqué, garde de routes, logout |
| Prix, quantité, remise ou total incohérent | Élevé | Calcul du sous-total, changement de quantité, code TESTQA, totaux checkout |
| Variante/stock ignorés à l’achat | Élevé | Produit sans taille, choix de taille, indisponibilité |
| Commande impossible à terminer ou données perdues entre étapes | Élevé | Tunnel complet, validations, retour arrière, confirmation |
| État partagé entre tests | Moyen | Nouveau contexte navigateur par test, données locales propres |
| Régression de navigation ou découverte des produits | Moyen | Recherche, filtre, tri, pagination, About, compte, QA Lab |

## Stratégie E2E et isolation

Les tests utilisent les comptes seedés et des valeurs fictives dédiées (`camille.test@example.test`, carte `4242…`). Aucun vrai renseignement n’est utilisé. Playwright crée un nouveau contexte par test; le stockage local est ainsi isolé sans dépendance à l’ordre des scénarios. Chaque scénario authentifié se connecte lui-même via `LoginPage`; les tests d’authentification restent visiteurs.

Les Page Objects représentent les pages/parcours qui reviennent souvent (`LoginPage`, `CatalogPage`, `CartPage`, `ProductPage`, `WishlistPage`, `CheckoutPage`). Les tests conservent les assertions métier et les sélecteurs spécifiques au scénario. La remise à zéro consiste à utiliser un contexte neuf plutôt qu’un bouton de l’application ou des données persistées communes.

## Environnements et navigateurs

`BASE_URL` cible par défaut le site GitHub Pages `https://ssid-testing-agency.github.io/Lab.qa/`. L’URL peut être remplacée pour viser un déploiement ou un environnement de test compatible. Chromium est le navigateur local rapide (`npm test`); `npm run test:all` exécute toute la suite sur Chromium, Firefox et WebKit. Le checkout paiement utilise le simulateur intégré à Lab.QA et reste une transaction fictive.

## Cas nominaux, négatifs et limites

La smoke vérifie les gestes indispensables: login, visibilité du catalogue, ajout et calcul panier, accès checkout et landing. Le reste de la suite couvre les erreurs de connexion/formulaire, le panier vide, la recherche sans résultat, les variantes et ruptures, les remises, le paiement refusé, les retours entre étapes, la persistance de session locale et les limites de stock observables.

La régression standard exclut les tests `@known-bug`. Ces derniers forment une suite de détection séparée: elle vérifie que les cinq anomalies annoncées sont reproduites en mode bugs, et sonde la redirection intermittente observée en WebKit. Le compte `client_chaos` déclenche les trois anomalies visuelles de catalogue; `?bugs=true` active les cinq. Aucun bug n’est corrigé dans l’application cible.

## Tags, CI et artifacts

- `@smoke`: parcours essentiels, rapide à exécuter après déploiement.
- `@critical`: commande nominale complète.
- `@known-bug`: assertions de détection des anomalies pédagogiques documentées.
- `@app-bug`: sonde isolée d’une anomalie applicative intermittente observée.
- Les autres scénarios forment la régression fonctionnelle.

GitHub Actions installe Node et les navigateurs, lance le typecheck, la smoke Chromium et la régression cross-browser. Un échec reste bloquant. Rapport HTML, traces, captures et vidéos conservés dans les artifacts en fin de job, y compris en cas d’échec. En local, les mêmes artifacts sont produits sous `playwright-report/` et `test-results/`.
