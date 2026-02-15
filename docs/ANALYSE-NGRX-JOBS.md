# Analyse du projet JobFinder – NgRx et fonctionnalités

## 1. Vue d’ensemble du projet

- **Stack** : Angular 21, NgRx Store + Effects, Tailwind, json-server (API locale).
- **Données** : `db.json` (users avec `favorites[]` et `applications[]`) + API jobs (Adzuna ou équivalent via `API_URL`).
- **Fonctionnalités principales** :
  - Liste d’offres d’emploi (pagination, recherche locale).
  - Favoris (cœurs) par utilisateur, persistés en base.
  - Candidatures (« Candidater ») par utilisateur, persistées en base.
  - Auth (login/register) avec token et `currentUser` en localStorage.

---

## 2. NgRx dans l’application

### 2.1 Configuration globale (`app.config.ts`)

- **Store** : 2 slices
  - `favorites` → `favoritesReducer`
  - `applications` → `applicationsReducer`
- **Effects** : `FavoritesEffects`, `ApplicationsEffects`.
- Il n’y a **pas** de slice NgRx dédié aux **jobs** : les offres viennent du `JobService` (HTTP), puis sont enrichies avec favoris et candidatures via le store.

### 2.2 Favoris (NgRx)

| Fichier | Rôle |
|--------|------|
| `favorites.actions.ts` | `loadFavorites`, `loadFavoritesSuccess`, `addFavorite`, `removeFavorite`, `logout` |
| `favorites.reducer.ts` | State `{ favorites: number[] }`. Gère `loadFavoritesSuccess` et `logout` (vide les favoris). **Pas** de gestion de `addFavorite`/`removeFavorite` dans le reducer (tout passe par les effects). |
| `favorites.effects.ts` | `loadFavorites` → GET user → `loadFavoritesSuccess`. `addFavorite`/`removeFavorite` → PATCH user → `loadFavorites` pour recharger. |
| `favorites.selectors.ts` | `selectFavorites`, `selectFavoritesCount`, `selectIsFavorite(jobId)` |
| `favorites-service.ts` | GET/PATCH `http://localhost:3000/users/:id` (favorites). |

**Flux** : pas de mise à jour optimiste dans le reducer ; l’UI se met à jour après succès de l’API (reload des favoris).

### 2.3 Candidatures / Apply to job (NgRx)

| Fichier | Rôle |
|--------|------|
| `application.actions.ts` | `loadApplications`, `loadApplicationsSuccess`, `addApplication` + feature key et sélecteur de state. |
| `application.reducer.ts` | State `{ applications: number[] }`. Gère `loadApplicationsSuccess`, `addApplication` (ajout optimiste de `jobId`), `logout` (reset). |
| `application.effects.ts` | `loadApplications` → GET user → `loadApplicationsSuccess`. `addApplication` → PATCH user → `loadApplications` pour resynchroniser. |
| `application.selectors.ts` | `selectApplications`, `selectHasApplied(jobId)`. |
| `applications-service.ts` | GET/PATCH `http://localhost:3000/users/:id` (applications). |

**Flux** :
1. **Candidater** : `addApplication` → le reducer ajoute tout de suite le `jobId` (UI optimiste) → l’effect persiste en base et déclenche `loadApplications`.
2. **Chargement** : seul `loadApplications` (puis `loadApplicationsSuccess`) remplit le state. **Problème** : aucun composant ne dispatch `loadApplications` au chargement de la liste des jobs (voir ci‑dessous).

---

## 3. Intégration Jobs ↔ NgRx (job-list-component)

- **Jobs** : récupérés par `JobService.getAllJobs(page)` (pagination).
- **Favoris / Candidatures** : lus depuis le store (`selectFavorites`, `selectApplications`).
- **Enrichissement** : `combineLatest(apiJobs$, selectFavorites, selectApplications)` → chaque job reçoit `isFavorite` et `hasApplied`.
- **Actions** :
  - Cœur : `toggleFavorite` → `addFavorite` / `removeFavorite`.
  - Bouton « Candidater » : `applyToJob` → `addApplication`.

**À l’initialisation** :
- Le composant dispatch **uniquement** `loadFavorites({ userId })` si l’utilisateur est connecté.
- Il ne dispatch **jamais** `loadApplications({ userId })`, donc le state `applications` reste vide après un refresh : **hasApplied** reste toujours `false` même si l’utilisateur a déjà candidaté.

---

## 4. Points à corriger / améliorer (NgRx “Apply job”)

1. **Charger les candidatures au démarrage**  
   Dans le composant qui affiche la liste des jobs (ex. `JobListComponent`), au même endroit que `loadFavorites`, ajouter :
   - `this.store.dispatch(loadApplications({ userId }));`
   Ainsi, au chargement de la page, les candidatures sont lues depuis l’API et `hasApplied` est correct.

2. **Cohérence des types**  
   Dans `db.json`, les `id` utilisateur sont parfois des strings (`"1"`, `"7406"`, `"0c4b"`, …). Les actions NgRx utilisent `userId: number`. S’assurer que `getCurrentUser().id` est bien converti selon ce que l’API attend (number ou string) pour éviter des erreurs GET/PATCH.

3. **Réduction des logs**  
   Retirer les `console.log` dans `job-list-component.ts` et dans `ApplicationsEffects` pour la prod.

4. **Favoris : mise à jour optimiste (optionnel)**  
   Pour un comportement homogène avec les candidatures, on peut gérer `addFavorite` / `removeFavorite` dans le reducer (mise à jour optimiste) en plus des effects, pour que le cœur se mette à jour immédiatement avant la réponse API.

---

## 5. Résumé des flux NgRx “Apply to job”

```
[Ouverture liste jobs + user connecté]
  → dispatch loadFavorites({ userId })
  → dispatch loadApplications({ userId })   ← À AJOUTER

[Effect loadApplications]
  → GET /users/:userId
  → dispatch loadApplicationsSuccess({ applications })
  → reducer met à jour state.applications

[Affichage]
  → combineLatest(jobs$, selectFavorites, selectApplications)
  → jobs avec isFavorite, hasApplied

[Clic « Candidater»]
  → dispatch addApplication({ userId, jobId })
  → reducer ajoute jobId (optimiste)
  → effect PATCH /users/:userId puis loadApplications
```

---

## 6. Fichiers clés pour “Apply job” (NgRx)

- `src/app/features/applications/` : actions, reducer, effects, selectors, service.
- `src/app/app.config.ts` : enregistrement du reducer et des effects.
- `src/app/features/jobs/components/job-list-component/job-list-component.ts` : dispatch `addApplication`, utilisation de `selectApplications`, et **dispatch de `loadApplications` au init**.
