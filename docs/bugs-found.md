# Anomalies observées

## NAV-003 — Redirection intermittente vers le catalogue avec session active

- **Préconditions :** utilisateur `jean_dupont` connecté; `auth-storage.state.isAuthenticated` vaut `true`.
- **Étapes :** ouvrir l’application, se connecter, puis naviguer directement vers `#/login`.
- **Résultat attendu :** l’utilisateur authentifié est redirigé vers `#/catalog`.
- **Résultat observé :** lors d’une exécution WebKit, la route est restée sur `#/login`. Cinq répétitions isolées suivantes ont redirigé correctement, ce qui indique un comportement intermittent; le scénario dédié conserve une annotation dans le rapport lorsqu’il reproduit le symptôme.
- **Sévérité estimée :** P2 — incohérence de navigation, sans exposition de données constatée.
- **Preuve :** test `NAV-003 @probe @app-bug` dans `tests/bugs/known-bugs.spec.ts`. En cas de reproduction, le probe attache l’URL, le texte visible et une capture; le job CI conserve également rapport et diagnostics.
- **Statut :** anomalie observée, non répertoriée parmi les bugs intentionnels de Lab.QA. L’application cible n’a pas été modifiée.
