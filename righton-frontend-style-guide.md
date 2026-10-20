# RightOn frontend style guide (for LLM agents)

SCOPE: React + MUI v5 frontends in the righton-app monorepo (central_v2, microcoach_v2, host_v2, play).
USE: Load this before writing or changing any UI code. These rules override general MUI or web defaults.
SOURCE: Derived from long-lived, multi-author files in central_v2 (CreateGame, ViewGame, MyLibrary, UserProfile, Login, SignUp, GameCard, CreateGameCardBase, Header, DiscardModal) and microcoach_v2's established screens (Review, UploadRtd, MyPlan, sign-up flow).

---

## 1. Layout: core rules (MUST)

R1. Build layout as a tree of nested flex containers. Each container sets `display: 'flex'`, `flexDirection`, alignment, and `gap`.
R2. The space between siblings comes ONLY from the parent's `gap`. A child never sets its own margin or padding to push itself away from a sibling.
R3. Padding is a container's INSET, i.e. the distance from its own edge to its content. Set it once on the container (page column, card, modal), not on its children.
R4. When siblings need different spacing, GROUP them. Wrap the tighter items in a sub-container with its own smaller `gap`. Do not add margins to individual items.
R5. Prefer flexbox (`justifyContent`/`alignItems` center or flex-start, plus `gap`). Use MUI `Grid` only for many repeating items (card galleries, `Grid container spacing={4}`). MUI Grid's default styles make it clunky for general layout.
R6. Never reproduce Figma pixel coordinates with padding or margin. Do not sum tokens (`space11 + space1 + space5`) to land an element at a Figma y-position. Pick ONE token for the role (inset or gap) and accept the nearest value.
R7. A component that contributes sections to a page column may return a fragment (`<>…</>`). Its children then become items of the parent column and share its `gap`. See central_v2 `components/game/CreateGameComponent.tsx`.

R8. Content must fit its container. Never rely on `nowrap` text spilling past its box into a `gap` or gutter. Size flex children from their content instead:
  - A column that should hug its widest child: `flex: '0 0 auto'`. A column that fills the remainder: `flex: '1 1 auto'`.
  - Content that wraps (chip rows, helper text) contributes its full one-line width to the column's intrinsic size. Cap it with `maxWidth` computed from named constants (e.g. `CHIPS_PER_ROW * CHIP_WIDTH + (CHIPS_PER_ROW - 1) * gap`) so it wraps instead of widening the column.
  - Below LARGE, stacked columns take `width: '100%'` and `flex: 'none'`, and text wraps normally.
R9. When design frames disagree on a value that one shared container owns (e.g. title-to-content gap on two list pages), give the container a prop that takes a theme token (`contentGap={theme.sizing.space7}`). Do not patch it with `sx` margins at call sites.
R10. Interactive items (tabs, breadcrumb steps) carry their own even padding inset. Align a row of mixed items (labels + separators) with `alignItems: 'center'` on the row, not with `paddingTop` on the row.

Allowed exceptions (small, local, rare):
- `marginTop: 'auto'` to push an item to the end of a flex column (e.g. a card CTA pinned to the bottom).
- A small corrective nudge inside a group (e.g. `marginTop: -8` to tuck helper text under a field). Comment it.
- Optical alignment of an icon inside an input adornment.

## 2. Layout: page skeleton

```
<PageMainContainer>            // height 100%, position relative, owns scroll (overflow auto, hidden scrollbar)
  <PageBackground />           // optional decorative layer (absolute inset 0, zIndex 0) — or a backgroundImage on a container
  <Modals … />                 // modals/backgrounds as siblings, not nested in content
  <PageContentColumn>          // flex column, alignItems center, gap: <section gap>, padding: <inset>, flexGrow 1
    <Title />
    <Section />                // each section is its own flex container with its own gap
    <Section />
  </PageContentColumn>
</PageMainContainer>
```

- The top and bottom inset of the page is padding on the content column, set once (microcoach_v2: `pt`/`pb` on `AppContentRow`; central_v2: `paddingTop` on `UserProfileMainContainer`).
- Side insets are the column's horizontal padding (microcoach_v2: `pageGutter(theme, screenSize)`).
- Page skeletons may be shared across screens (central_v2 ViewGame reuses CreateGame's containers). Reuse before re-creating.
- There is no single rule for decorative backgrounds. A separate absolute layer, an absolute `<img>`, and `backgroundImage` on a container all exist. Match the nearest existing screen.

## 3. Do / Don't

DON'T: space siblings with margins on the children.
```tsx
<Card>
  <Title />
  <Subtitle sx={{ mt: '20px' }} />
  <Pickers sx={{ mt: '92px' }} />
  <Cta sx={{ mt: '32px' }} />
</Card>
```

DO: let the container's gap space them, and group for tighter spacing.
```tsx
// styled: Card = flex column, alignItems center, padding: space6 (inset), gap: space8
<Card>
  <Heading>          {/* flex column, gap: space4 — title + subtitle sit tighter */}
    <Title />
    <Subtitle />
  </Heading>
  <Pickers />
  <Cta />
</Card>
```

DON'T: use padding on the page container to place the first element at a Figma y.
```ts
paddingTop: theme.sizing.space11 + theme.sizing.space1 + theme.sizing.space5, // ✗ summed tokens
```

DO: use one token per role.
```ts
paddingTop: theme.sizing.space8, // page inset
gap: theme.sizing.space6,        // section spacing
```

DON'T: use per-call-site `sx={{ mt }}` / `sx={{ pl }}` to fix spacing inside a list.
DO: add a container (e.g. `WeekGroup` = flex column with gap) and give the heading row its own inset padding in its styled definition.

## 4. Styled components

S1. Use `styled()` from `@mui/material/styles`. Name by role, prefixed with the page or feature: `CreateGameMainContainer`, `CreateGameTitleBarStyled`, `GameContentContainerStyled`, `DashboardCard`, `SidebarContent`.
S2. Placement:
  - Page or feature containers go in `lib/styledcomponents/<Feature>StyledComponents.tsx`.
  - Pieces used by only one component may live at the top of that component file (central_v2 GameCard, Login, Header, DiscardModal do this).
S3. Responsive behaviour is driven by a `screenSize: ScreenSize` prop into the styled function, switching `flexDirection`, `gap` and padding. Filter custom props with `shouldForwardProp` so they don't reach the DOM:
```ts
export const Row = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'screenSize',
})<{ screenSize: ScreenSize }>(({ theme, screenSize }) => ({
  display: 'flex',
  flexDirection: screenSize === ScreenSize.SMALL ? 'column' : 'row',
  gap: `${theme.sizing.space3}px`,
}));
```
S4. Inline `<Box sx={{ display: 'flex', gap }}>` is acceptable for a small one-off group. The same flex+gap rules apply. Prefer a named styled component once it is reused or has more than a few properties.
S5. Give each text role its own styled `Typography`, or use a theme typography variant (`<Typography variant="…">`). Do not hand-roll font properties at call sites.
S6. Before editing a shared styled component, grep its consumers. If others use it, name them and confirm scope before changing it.

## 5. Theme and design tokens

Theme file pattern (`src/lib/Theme.tsx`): module-level token constants → `declare module '@mui/material/styles'` augmentation → `createTheme`. microcoach_v2 mirrors `networking/src/DesignSystem/Theme.tsx`.

T1. Spacing tokens live on `theme.sizing` as unitless numbers. Always write them as `` `${theme.sizing.X}px` ``. A bare number in an sx spacing prop (`p`, `m`, `gap`) is multiplied by MUI's 8px spacing unit.
  - central_v2 / networking (role-named): `xxSmPadding` 4, `xSmPadding` 8, `smPadding` 16 (content in cards), `mdPadding` 24, `lgPadding` 32 (top of titles), `xLgPadding` 48 (card ↔ screen edge), `xxLgPadding` 64.
  - microcoach_v2 (Figma scale): `space0` 4, `space1` 8, `space2` 12, `space3` 16, `space4` 20, `space5` 24, `space6` 32, `space7` 40, `space8` 48, `space9` 52, `space10` 56, `space11` 64, `space12` 80, `space13` 100, `space14` 120.
T2. Use exactly one token per spacing value. Never add tokens together.
T3. Layout widths and fixed dimensions are named entries in `theme.sizing` (e.g. `appContentMaxWidth`, `headerHeight`). Add one there rather than hardcoding a width in a component.
T4. Breakpoints are shared across apps: xs 0, sm 400, md 700, lg 1024, xl 1536. `ScreenSize`: SMALL < 700, MEDIUM 700–1023, LARGE ≥ 1024.
T5. Colours:
  - microcoach_v2 uses `theme.palette.designSystem.{background,foreground,surface,status}`; central_v2 uses `theme.palette.primary.*`.
  - Do not hardcode hex in components.
  - To match a Figma colour to an existing token, compare the max per-channel difference. ≤ 8: reuse the token. ≥ 17: add a new token with a usage comment. In between: judgement, and say which you chose.
T6. Typography (microcoach_v2): theme variants from `designSystemTypography` with `variantMapping`. Use `variant="…"`. Add a variant to the theme rather than overriding font properties ad hoc.
T7. Borders: `theme.borders.*` built from `borderWidth`.

## 6. Implementing from Figma

F1. Export frames as SVG with "Outline text" OFF, "Include id" ON, and "Simplify stroke" OFF. If `grep -c '<text'` returns 0, text was outlined: ask for a re-export rather than guessing type values.
F2. Read geometry from the SVG: `<rect>`/`<path>` bounds, `transform="translate()"`, `stroke-width`, and `fill-opacity`. Cards and chips are often drawn as `<path>`, so parse those too.
F3. Text positions in the SVG are BASELINES; CSS lays out LINE BOXES. With `lineHeight: 'normal'`:
  - Rubik line box ≈ 1.185 × fontSize; ascent ≈ 0.935 × fontSize.
  - Poppins line box ≈ 1.5 × fontSize; ascent ≈ 1.05 × fontSize.
  - Box top = baseline − ascent. Measure gaps between box edges, then map each gap to ONE token. State which token you chose when the frame's value falls between two.
F4. Expect frames to be inconsistent (same element, different spacing across frames). Pick one token per role, flag the discrepancy, and don't reproduce each frame's pixels.
F5. Repeating decorative backgrounds:
  - Ask design for a single repeat module.
  - If the frames repeat it at a pitch wider than the module, pad the module's SVG `width`/`viewBox` to the pitch (shapes untouched) and use `background-repeat: repeat-x`.
  - Don't crop a band out of a full frame: the seams won't tile.
F6. Fonts not loaded by the app (e.g. Open Sans in a frame) are replaced with the nearest loaded family (Rubik/Poppins) at the same size and weight. Note the substitution.

## 7. Naming and structure

N1. Name shared pieces by their shared role and page-only pieces by their page. Example: the shell used by all sidebar screens is `SidebarLayout` / `SidebarContent` / `SidebarTitleBand`; Dashboard-only parts are `DashboardCard` / `DashboardHeading` / `DashboardForm` / `DashboardCta`.
N2. Visible copy may differ from code names (the sidebar label reads "Home" while code and i18n keys say `dashboard`). Code names follow the route and screen; copy follows design.
N3. Reuse existing helpers before writing new ones (microcoach_v2):
  - `components/AppContentRow.tsx`: the in-app page column.
  - `components/SidebarPage.tsx`: the titled sidebar screen shell.
  - `components/LoadingSlot.tsx`: a per-part spinner sized to the final content.
  - `hooks/readiness` (`useI18nReady`, `useAllReady`).
  - `lib/weeks.ts`: local-time week keys. Never parse `YYYY-MM-DD` with `new Date(iso)`, which reads it as UTC and shifts the day.
  - `lib/flowProgress.ts`: step derivation.

## 8. Copy, data, and loading

C1. All user-facing text goes through i18n `t('…')`, with keys in `public/locales/{en,es}/translation.json`. Add both languages.
C2. Name routes, files, components and i18n keys after the screen's real name. Do not call non-root screens "home" (the homepage is `/`).
C3. Loading:
  - Gate the page only on translations.
  - Render static parts immediately.
  - Give each query-backed part its own pending state (spinner sized to the final content's height) or an optimistic default.
  - Correct the part when its query answers OR fails. A failed query must not render as an empty result.
  - A status of IDLE ("not started") is unknown, not empty.
  - When a query fails, fall back to an action that is always valid, never a guessed state.
C4. No dead ends in UI state. Every selectable mode needs a way back (e.g. a single-option sort menu toggles off when the active option is clicked again).
C5. Screens on mock data keep their actions wired to a single `logPending(action, id)` placeholder. Mock data lives in `lib/mocks/`, shaped like the eventual query result.

## 9. Process hazards (repo-specific)

P1. Never run `prettier --write` on existing files. Several files are not prettier-clean, and a reformat produces huge unrelated diffs.
P2. After any scripted or bulk edit, check `git diff --stat` for unexpected files or line counts.
P3. Verify with `npx tsc --noEmit -p tsconfig.json` and `npx eslint src` in the app directory. Do not run browser QA unless asked; the user tests visually.
P4. Do not touch schema or backend files owned by others (microcoach_v2 schema belongs to another workstream).
P5. To learn a convention, read whole files across layers (shell → page → section → card → primitive), and weight files with long, multi-author git history (`git log --format=%an -- <file>`). Do not infer conventions from grep counts or from the first file you open. Recent single-commit files may be LLM-written and are weak evidence.
P6. When a design note is ambiguous (e.g. "remove the other options"), ask before building. Offer the 2–3 concrete readings.
P7. Keep tool outputs small (≈60 lines per read or command). Large outputs have caused API errors in this repo's sessions.

## 10. Pre-flight checklist (answer before writing layout)

1. Which container owns this spacing? Put a `gap` on that container.
2. Is this padding an inset of the container itself? If it separates siblings, use a `gap` instead.
3. Do some siblings need tighter spacing? Group them into a sub-container with its own gap.
4. Is every spacing value a single theme token?
5. Is there an existing styled container or page skeleton to reuse?
6. Flexbox, or genuinely many repeating items (Grid)?
7. Are custom props filtered with `shouldForwardProp`, and is responsive behaviour driven by `screenSize`?
8. Are all strings in i18n (en + es)?
9. Does every text element fit its own box at the target widths (no overflow into a gap)?
10. Did I convert Figma baselines to line-box edges before choosing tokens?
