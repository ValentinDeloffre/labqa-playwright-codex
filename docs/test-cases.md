# Matrice des cas de test

Priorité: **P0** bloque l’achat ou l’accès, **P1** risque métier élevé, **P2** couverture utile. `@known-bug` caractérise les anomalies pédagogiques; `@probe` collecte un diagnostic non bloquant sur une anomalie intermittente. Les deux catégories sont séparées de la régression fonctionnelle.

| ID | Scénario | Priorité | Type | Auto | Tag |
|---|---|---:|---|:---:|---|
| AUTH-001 | Connexion standard ouvre le catalogue | P0 | Positif | Oui | @smoke |
| AUTH-002 | Identifiants inconnus affichent une erreur et gardent la route login | P1 | Négatif | Oui | — |
| AUTH-003 | Champs vides signalés, formulaire encore utilisable | P1 | Limite | Oui | — |
| AUTH-004 | Compte verrouillé refusé sans redirection | P1 | Négatif | Oui | — |
| AUTH-005 | Compte à latence: indicateur et désactivation pendant le login | P2 | État transitoire | Oui | — |
| CAT-001 | Catalogue, produit connu et pagination visibles | P0 | Positif | Oui | @smoke |
| CAT-002 | Recherche d’un article cible le résultat | P1 | Positif | Oui | — |
| CAT-003 | Recherche vide puis remise à zéro | P1 | Négatif | Oui | — |
| CAT-004 | Filtre catégorie livres exclut les autres catégories | P1 | Positif | Oui | — |
| CAT-005 | Filtre en stock masque un produit épuisé | P1 | Positif | Oui | — |
| CAT-006 | Tri croissant ordonne les prix affichés | P1 | Limite | Oui | — |
| CAT-007 | Pagination ouvre la page suivante | P2 | Positif | Oui | — |
| PRODUCT-001 | Détail backpack: nom, prix, stock et action disponibles | P0 | Positif | Oui | — |
| PRODUCT-002 | Taille requise avant achat du T-shirt | P1 | Négatif/positif | Oui | — |
| PRODUCT-003 | Produit en rupture non achetable | P1 | Négatif | Oui | — |
| PRODUCT-004 | Quantité produit plafonnée au stock disponible | P1 | Limite | Oui | — |
| CART-001 | Panier initial vide, checkout absent | P1 | Limite | Oui | — |
| CART-002 | Ajout backpack, ligne, quantité et sous-total exacts | P0 | Positif | Oui | @smoke |
| CART-003 | Augmenter/diminuer la quantité recalcule le prix | P1 | Positif | Oui | — |
| CART-004 | Suppression puis annulation restaure la ligne | P2 | Positif | Oui | — |
| CART-005 | TESTQA applique 10 % puis suppression restaure le total | P1 | Positif | Oui | — |
| CART-006 | Code promo inconnu signale erreur et conserve le total | P1 | Négatif | Oui | — |
| CART-007 | Ligne panier conservée après rafraîchissement | P1 | Persistance | Oui | — |
| CART-008 | Vider le panier puis annuler restaure l’article | P2 | Positif | Oui | — |
| WISHLIST-001 | Wishlist initialement vide | P2 | Limite | Oui | — |
| WISHLIST-002 | Ajout depuis détail actualise ligne et compteur | P2 | Positif | Oui | — |
| WISHLIST-003 | Article conservé après rafraîchissement | P2 | Persistance | Oui | — |
| WISHLIST-004 | Retrait du dernier article présente l’état vide | P2 | Positif | Oui | — |
| WISHLIST-005 | Achat depuis wishlist ajoute au panier et retire de la liste | P1 | Positif | Oui | — |
| CHECKOUT-001 | Livraison, récapitulatif, paiement fictif et confirmation | P0 | E2E nominal | Oui | @smoke @critical |
| CHECKOUT-002 | Champs livraison vides bloquent la progression | P0 | Négatif | Oui | — |
| CHECKOUT-003 | Email et code postal invalides sont rejetés | P1 | Négatif/limite | Oui | — |
| CHECKOUT-004 | Retour arrière conserve les informations saisies | P1 | Persistance | Oui | — |
| CHECKOUT-005 | Carte de test refusée affiche erreur sans confirmation | P1 | Négatif | Oui | — |
| CHECKOUT-006 | Annuler livraison revient au panier avec la ligne | P2 | Navigation | Oui | — |
| CHECKOUT-007 | Total du récapitulatif égale panier plus livraison | P0 | Calcul métier | Oui | — |
| CHECKOUT-008 | Champs de carte vides n’autorisent pas le paiement | P1 | Négatif | Oui | — |
| CHECKOUT-009 | Un panier vide redirige vers le panier au lieu du checkout | P0 | Négatif | Oui | — |
| ACCOUNT-001 | Compte standard affiche les informations seedées | P2 | Positif | Oui | — |
| ACCOUNT-002 | Profil valide enregistré avec succès | P2 | Positif | Oui | — |
| ACCOUNT-003 | Historique montre commandes et statuts seedés | P2 | Positif | Oui | — |
| ACCOUNT-004 | Adresse modifiée puis affichée dans la carte | P2 | Positif | Oui | — |
| ACCOUNT-005 | Changement simulé de mot de passe valide confirme le succès | P2 | Positif | Oui | — |
| NAV-001 | Landing publique conduit à la boutique | P1 | Navigation | Oui | @smoke |
| NAV-002 | Route protégée redirige le visiteur vers login | P0 | Négatif | Oui | — |
| NAV-003 | Observe si la route login redirige une session active; collecte une preuve si l’écart réapparaît | P1 | Probe diagnostique | Oui | @probe @app-bug |
| NAV-004 | Logout ferme la session et réactive la protection | P0 | Négatif | Oui | — |
| NAV-005 | About et route inconnue exposent un contenu identifiable | P2 | Navigation | Oui | — |
| LAB-001 | QA Lab documente anomalies, déclencheurs et code test | P2 | Contenu produit | Oui | — |
| BUG-001 | broken-images: image défaillante détectée | P2 | Anomalie connue | Oui | @known-bug |
| BUG-002 | reversed-sort: tri croissant observé en ordre inverse | P2 | Anomalie connue | Oui | @known-bug |
| BUG-003 | disappearing-button: action produit invisible détectée | P2 | Anomalie connue | Oui | @known-bug |
| BUG-004 | invalid-form-accepted: livraison vide acceptée en mode bug | P2 | Anomalie connue | Oui | @known-bug |
| BUG-005 | price-off-by-one: écart d’un centime affiché | P2 | Anomalie connue | Oui | @known-bug |
| BUG-006 | client_chaos reproduit broken-images, reversed-sort et disappearing-button | P2 | Anomalie connue | Oui | @known-bug |

**Total actuel: 55 scénarios** — 48 tests de régression fonctionnelle, 6 scénarios de caractérisation des bugs pédagogiques et 1 probe diagnostique. Comptage confirmé par `npx playwright test --list --project=chromium`.
