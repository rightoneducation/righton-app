# CreateGame useEffect – cases and split plan

## Route-derived flags and IDs

- **route** = `useMatch('/clone/game/:type/:gameId')`
- **editRoute** = `useMatch('/edit/game/:type/:gameId')`
- **addQuestionRoute** = `useMatch('/edit/game/:type/:gameId/add/:questionId')`

- **isClone** = route has gameId
- **isEdit** = editRoute has gameId (includes add-question when we’re on edit base)
- **isEditDraft** = edit/add type is 'Draft'
- **isAddQuestion** = addQuestionRoute has questionId

- **selectedGameId**:
  - **isAddQuestion** → `addQuestionRoute.params.gameId`
  - **isEdit** → `editRoute.params.gameId`
  - **isClone** → `route.params.gameId`
  - **default** → `''`

## Current single useEffect – execution order

1. **Always**
   - `setIsLoading(false)`

2. **First-time create (no edit)**
   - Condition: `localStorage(StorageKeyIsFirstCreate) === null && !isEdit`
   - Actions:
     - `localStorage.setItem(StorageKeyIsFirstCreate, 'false')`
     - `setDraftGame` with `initPublicPrivate` on gameTemplate

3. **Populate from selected (clone / edit / add)**
   - Condition: `selected !== null && (isClone || isEdit || isAddQuestion)`
   - `selected` = `centralData.selectedGame`
   - **3a. Clone-only:** if `selected?.game && title && !/[DUPLICATE OF]/i.test(title) && isClone`
     - Mutate `selected.game.title` to `[DUPLICATE OF] ${title}` (in place)
   - **3b. If `selected.game` exists:**
     - `setDraftGame` from `selected.game` (openCreateQuestion, imageUrl)
     - `setOriginalGameImageUrl(selected.game.imageUrl ?? '')`
     - `setPhaseTime` from `phaseOneTime` / `phaseTwoTime` via `timeLookup`
     - `setOriginalGameType(selected.game.publicPrivateType ?? PUBLIC)`
   - **3c. Branch by isAddQuestion:**
     - **isAddQuestion:**
       - `getQuestionTemplate(addQuestionRoute.params.type, addQuestionRoute.params.questionId)`
       - `originals = [addedQuestion, ...(selected.game.questionTemplates ?? [])]`
       - `setOriginalQuestionTemplates`, `assembleQuestionTemplate` for each, `setOriginalQuestionImageUrls`, `setDraftQuestionsList` (with `draftTemplate`, `isLibraryViewOnly: true`)
     - **Else (clone or edit, not add):**
       - `originals = selected.game.questionTemplates`
       - Same sets: `setOriginalQuestionTemplates`, assembled, `setOriginalQuestionImageUrls`, `setDraftQuestionsList`

4. **Fetch when game missing or wrong**
   - Condition:  
     `(!centralData.selectedGame?.game && selectedGameId && (isClone || isEdit || isAddQuestion))`  
     **OR**  
     `(centralData.selectedGame?.game?.id !== selectedGameId)`
   - Actions: `setIsLoading(true)`, `fetchElement(GameQuestionType.GAME, selectedGameId)`

## Cases preserved

| Case | selectedGameId | Fetch? | Populate? | Extra |
|------|----------------|--------|-----------|--------|
| **Create** | `''` | No | No | Maybe first-time localStorage + initPublicPrivate |
| **Clone** | route.gameId | Yes if no game or id mismatch | Yes when selected | Clone: prefix title `[DUPLICATE OF]` |
| **Edit** | editRoute.gameId | Yes if no game or id mismatch | Yes when selected | — |
| **Add question** | addQuestionRoute.gameId | Yes if no game or id mismatch | Yes when selected | Also fetch added question, list = [added, ...game.questions] |

## Split

### Effect 1 – Fetch (+ first-time create)

- **Deps:** `[route, editRoute, addQuestionRoute, selectedGameId]`  
  Do **not** depend on `centralData.selectedGame`.
- **Runs:** on mount + when route/selectedGameId change.
- **Logic:**
  1. `setIsLoading(false)`
  2. First-time create: same `localStorage` + `initPublicPrivate` when `!isEdit` and storage null.
  3. Same fetch condition as above → `setIsLoading(true)`, `fetchElement(GAME, selectedGameId)`.
- **Does not:** populate from `selected`; no `selected`-based logic.

### Effect 2 – Populate

- **Deps:** `[centralData.selectedGame, route, editRoute, addQuestionRoute]`.
- **Runs:** when `selectedGame` or route params change (e.g. after fetch completes).
- **Logic:**
  1. Recompute `selectedGameId`, `isClone`, `isEdit`, `isAddQuestion` from routes (same as component).
  2. `selected = centralData.selectedGame`.
  3. **Guard:**  
     `if (!selected || !(isClone || isEdit || isAddQuestion) || selected.game?.id !== selectedGameId) return;`  
     (Ensures we only populate when we have the game for the current route.)
  4. `setIsLoading(false)` (we have the game; loading done).
  5. Clone title mutate (same as today).
  6. `setDraftGame`, `setOriginalGameImageUrl`, `setPhaseTime`, `setOriginalGameType` from `selected`.
  7. **isAddQuestion:** fetch added question → `originals = [added, ...game.questionTemplates]` → same sets as today.
  8. **Else:** `originals = selected.game.questionTemplates` → same sets as today.
- **Does not:** fetch the game; no `fetchElement`.

## Refresh vs in-app nav

- **Refresh (edit):** Fetch effect runs → fetch game. Populate effect runs first with `selected` null → guard, return. When fetch completes, `selectedGame` updates → populate effect runs again → guard passes → populate. Loading cleared in populate.
- **In-app nav (e.g. ViewGame → Edit):** `selectedGame` already set. Fetch effect may or may not fetch (id match). Populate effect runs → guard passes → populate. No infinite loop because fetch effect does not depend on `selectedGame`.

## Edge cases covered

- Create: no fetch, no populate; first-time create unchanged.
- Clone vs edit: only affects title mutate; both use same fetch/populate structure.
- Add question: same fetch as edit; populate adds extra question fetch and `[added, ...]` list.
- Wrong or stale game: populate guard `selected.game?.id === selectedGameId` prevents using wrong game.
- Loading: cleared at start of fetch effect; set true before fetch; cleared again when we populate (we have the game).
