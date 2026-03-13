# PresenceBadgeApp

Application React Native CLI de pointage de présence avec géolocalisation.

## Fonctionnalités
- écran **Badge** pour pointer la présence
- écran **Rapports** pour les retards **hebdomadaires** et **mensuels**
- données **persistantes** dans l'application via AsyncStorage
- validation par rayon GPS autour du point exact :
  - latitude: `3.824888888888889`
  - longitude: `11.542694444444445`
- seuil de retard: **08:00**
- cartes en **rouge léger** pour les retards, **bleu léger** sinon
- workflow GitHub Actions pour générer l'APK debug

## Dépôt GitHub
1. crée un nouveau repo vide
2. copie tous les fichiers de ce dossier dans ton repo
3. pousse sur `main`
4. lance le workflow GitHub Actions
5. récupère l'APK dans les artifacts du workflow

## Important
Ce package vise Android. Le build GitHub Actions est prêt pour un APK **debug**.

## Variables métier
Le fichier `src/config/appConfig.ts` centralise:
- le point de badge
- le rayon autorisé
- l'heure de retard

## Permissions Android
L'application demande la permission de localisation au runtime et déclare:
- `ACCESS_FINE_LOCATION`
- `ACCESS_COARSE_LOCATION`

## Remarque technique
Je n'ai pas pu exécuter un build Android complet dans cet environnement, donc le projet est fourni comme base React Native CLI complète et cohérente, prête à être poussée sur GitHub pour compilation par Actions.
