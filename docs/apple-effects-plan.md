# Apple effects plan (v2, 2026-10-06)

Bring all ten `/lab` prototypes (draft PR #32, branch `proto/lab`) to the real pages. The owner approved all ten as prototypes.

v2 folds in an independent Codex review of v1; see the [changelog](#changelog-v1--v2) at the end. **Status: approved 2026-10-06. The owner accepted every recommendation for D5 to D12. Implementation is handed to Codex, one PR at a time, starting with PR A. Nothing is implemented yet.**

**Ground rules (unchanged from the upgrade plan):**
- Keep the page copy. The only new text is the UI labels listed in [New UI text](#8-new-ui-text).
- No em dashes in visible text.
- Preview every change in the browser before pushing.
- Visible changes need the owner's approval before merge.
- Commits use the owner's noreply identity and carry no AI attribution.

**Prototype approval is not production approval.** Each integration must prove it keeps navigation, focus, server-rendered content and performance intact before it ships.

---

## 1. Where each effect goes

| # | Prototype (lab source) | Real location | Replaces |
|---|---|---|---|
| 1 | Liquid Glass hero (`LiquidGlassCanvas.tsx`) | Home hero: a WebGL wallpaper behind the hero, with a glass pill that sits behind the real `<h1>` | The white hero background and the letter-by-letter name reveal |
| 2 | Floating tab bar + scroll edge blur (`TabBarDemo`) | Global navigation (`Navbar.tsx`): a top capsule on every screen size (D6) | The full-width fixed AppBar and its 48px spacer |
| 3 | Apple Watch honeycomb (`HoneycombDemo`) | Home "Technologies I work with": an **opt-in** view; List stays the default (D7) | Nothing removed; it is an extra view |
| 4 | Liquid Glass controls (`GlassControlsDemo`) | **Segmented controls:** the skills section's View (List / Honeycomb) and Category groups. **Switch:** the theme toggle in the nav. | The sun/moon icon button |
| 5 | App Store card morph (`CardMorphDemo`) | Open Source: a **Details** button on each card opens a sheet; a separate GitHub link stays on the card (D8) | The current behaviour, where the whole card links to GitHub |
| 6 | Dynamic Island (`DynamicIslandDemo`) | Contact form feedback: sending, sent and error | The success and error `Alert`s (inline field errors stay) |
| 7 | Scroll-lit text (`ScrubTextDemo`) | Home About paragraph, animated from secondary grey to primary text colour (both pass AA) | That paragraph's share of the `ScrollReveal` wrapper |
| 8 | Apple TV parallax cards (`TvCardsDemo`) | Open Source project cards (the same cards as #5) | The tilt, cursor glow and `MagneticElement` on those cards |
| 9 | macOS Dock (`DockDemo`) | Footer "Connect" on every page, with the same four destinations (Email, LinkedIn, GitHub, Medium) | The footer's text link list. Contact keeps its detailed text list (D10). |
| 10 | Apple Intelligence glow (`GlowDemo`) | Contact message field and the Home closing CTA, on interaction only, settling within 5 s (D11) | Nothing; it is additive |

---

## 2. Build approach per item

### 2.1 Liquid Glass hero (Home)

**Server HTML stays the source of truth**
- The overline, `<h1>` name, subtitle (the LCP element), CTAs and stats stay in the server-rendered page markup, exactly where they are today.
- The canvas is a separate decorative layer behind them: `aria-hidden`, loaded with `next/dynamic({ ssr: false })` after idle and when the hero is in view.
- **Do not copy the prototype's structure, which puts the label inside the canvas component** (`LiquidGlassCanvas.tsx:327`). The glass pill is drawn under the real `<h1>`: its size and position come from the heading's measured box plus padding, clamped to the viewport width minus 32px.
- Dragging the glass moves a visual offset only. The heading stays in the DOM and in reading order.

**Poster and failure handling**
- A static CSS gradient poster in the same colours is always present. The canvas fades in over it only after the first successful frame.
- Check shader compile **and** link status; the prototype throws on compile and never checks link (`LiquidGlassCanvas.tsx:125`). Any failure leaves the poster.
- Handle `webglcontextlost` (call `preventDefault` and show the poster) and `webglcontextrestored` (rebuild resources, then fade back in).
- Dispose the program, shaders and buffers on unmount.

**Render on demand**
- The render loop runs only while something changes: the opening animation, a drag, or the droplet settling.
- It redraws once after a resize, a theme change, or a change in a reduced-motion or transparency preference. "One frame and stop" must never mean a stale frame.
- Pause while the hero is off screen (IntersectionObserver) or the tab is hidden.
- Cap the device pixel ratio at 1.5.

**Motion settles (WCAG 2.2.2, D11)**
- The wallpaper drifts for at most 5 s after it appears, then freezes.
- It moves again only during and just after the visitor's own drag.
- Reduced motion: one static frame, and no dragging.

**Intro ownership**
- The Home hero GSAP timeline in `page.tsx` keeps owning `data-intro` on the overline, subtitle, CTAs and stats.
- The name's letter split is removed. The timeline gets a "materialise" step: canvas refraction and opacity go from 0 to 1, and the name fades in.
- The existing scroll parallax fade-out stays. The canvas pauses once the hero's opacity reaches 0.

**Input**
- Fine pointer: drag, with the trailing droplet.
- Touch: `touch-action: pan-y`, so vertical swipes scroll the page. A tap nudges the glass. No touch dragging.

**Contrast and D5**
- Light and dark get restrained wallpaper intensities.
- Every text block on the wallpaper (overline, name on glass, subtitle, CTA labels, stats) is checked at its **worst-case pixel** for at least 4.5:1, or 3:1 for the large name, by sampling the rendered screenshot behind each text box in both themes.
- Text-bearing areas get a tint panel where needed.

### 2.2 Floating tab bar (global)

**Layout and D6**
- A centred glass capsule at the top on every screen size, holding "HY.", the four links and the theme switch.
- It sits `max(12px, env(safe-area-inset-top))` from the top.
- A bottom tab bar on phones is postponed until the safe-area, keyboard and focus checks below are proven.

**Never shrink hit areas**
- The compact (scrolled) state shrinks only the decoration: padding, shadow and background.
- Links keep a 44px hit area in every state. The prototype's `scale: 0.86` (`lab.module.css:157`) would cut 44px to 37.8px, so don't copy it.

**Keeping focus and content visible**
- Set `scroll-padding-top` to the bar height plus 16px, so focused elements and in-page targets are never hidden under the floating bar (WCAG 2.4.11).
- `main#main` keeps its scroll margin, updated to match.
- Removing the 48px spacer means the hero and every page top get matching padding.

**Stacking order**
- One documented z-index scale:
  - nav 1100
  - Dynamic Island 1200
  - dialogs and the sheet 1300 (MUI modal)
  - skip link 2000
- The island must never cover a focused field, and the sheet must cover the nav.

**Active-route highlight**
- A glass capsule moves to the current route after navigation commits.
- The header keeps `view-transition-name: site-header`, so the page crossfade and the capsule never animate the same element.

**Scroll edge effect**
- A fixed stack of `backdrop-filter` layers under the bar: 3 on phones, 5 on desktop.
- Both `-webkit-` and unprefixed declarations, for Safari 17.
- Profiled on a real phone before merge.

**Keep from today**
- skip link
- `<nav aria-label="Main">`
- `aria-current`
- 44px hit areas

**Tests**
- Extend the skip-link and hit-area checks to the compact state and to 200% text zoom.
- Check that focused links are not obscured.

### 2.3 Honeycomb skills (Home) and 2.4 glass controls

**Default view and D7**
- The complete categorised **List** is the default for everyone; fine-pointer detection cannot identify screen-reader users.
- **Honeycomb** is an explicit choice in the View control, optionally remembered in `localStorage`.

**Two separate radio groups**
- "View": List / Honeycomb.
- "Category": All plus the nine categories (List view only).
- Each is a labelled `role="radiogroup"` with roving tabindex. Arrow keys move the selection, Home/End jump, and Space selects.
- **All shows every skill.** The prototype truncated "All" to 18 skills (`MoreDemos.tsx:158`).

**Only one view is live**
- The inactive view is removed from the accessibility tree and from focus (`hidden` + `inert`).
- Heights are reserved, so switching views causes no layout shift.

**Honeycomb interaction**
- All 45 skills are reachable by keyboard: roving focus across hex neighbours with the arrow keys.
- Enter or Space centres the focused skill.
- A polite live caption announces "Name, Category" once panning settles (debounced), never during movement.
- Pointer drag has momentum. Reduced motion: instant pans.

**Theme switch**
- A `role="switch"` labelled "Dark mode". `aria-checked` reflects the **resolved** scheme.
- It keeps today's logic: choosing the system's own scheme goes back to following the system. No hidden long-press reset.
- Without JavaScript, it renders inert (`aria-disabled`) and shows the resolved scheme.
- The knob turns to glass while pressed.

### 2.5 + 2.8 Open Source cards (TV cards + App Store sheet)

**Server rendering**
- The page stays a Server Component. Every card's name, description, tags, status and GitHub URL stay in server HTML.
- The cards island receives the data as props; it never fetches or suspends.

**No nested interactive controls**
- Each card is an `<article>` holding:
  - a **Details** `<button>` that opens the sheet, stretched over the card with a pseudo-element
  - a separate **GitHub** `<a>` shortcut with its own accessible name (D8)
- The Live / Coming Soon chip stays visible on the card.

**Morph lifecycle (React ViewTransition)**
- Keep the prototype's `startTransition`, explicit `share` class and mutually exclusive named participants: either the card or the sheet carries `today-<id>` at any moment, never both.
- The sheet renders in a portal outside `main`, so opening it does not trigger the page-level crossfade on `main`.
- Names are unique per project ID and never reuse `site-header`.
- Safari 18.0 and 18.1 lack `view-transition-class` and get the default crossfade. Safari 17 has no view transitions and the sheet simply appears. The full morph needs Chrome or Safari 18.2+.

**Focus**
- The prototype's placeholder swap detaches the opener, so restoring a saved node fails (`MoreDemos.tsx:261`).
- Instead, keep a ref map keyed by project ID. After the closing transition finishes, focus the current Details button for that ID.
- The dialog has a focus trap, closes on Esc, and is labelled by the project name (MUI `Dialog` or equivalent).

**Deep links and history (D8)**
- A small client `ProjectSheetController` reads `?project=<id>` inside its own `<Suspense fallback={null}>`, so the cards never disappear behind a fallback.
- **Opening** pushes `?project=<id>` without scrolling. **Closing** goes back in history if the sheet was opened in-app; if the page was loaded directly with the parameter, it replaces the URL with the bare path instead.
- An **invalid id** is ignored and stripped.
- **Back and Forward** open and close the sheet.

**Tilt and glare**
- Built with `gsap.quickTo`; pointer reads and writes batched in one rAF.
- Lift only on touch and with reduced motion. Keyboard focus also lifts.

**Intro ownership**
- `OpenSourceMotion` owns the title and subtitle `data-intro` reveals today.
- When it is replaced, a small `OpenSourceIntro` island keeps them, so no `data-intro` element is left without an owner.

### 2.6 Dynamic Island (Contact)

**Announcements**
- One persistent, initially empty `role="status"` live region, mounted outside the form so `aria-busy` doesn't mute it.
- The island updates its text ("Sending…", "Message sent", or the error) without moving focus.
- The island is a visual mirror of that region.

**No automatic reset**
- Success and error stay readable until the next submission or until the visitor dismisses the island. Don't copy the prototype's 3-second reset (`AppleDemos.tsx:391`).
- Long error text wraps; the island grows in height.

**Keep from today**
- inline field errors
- focus on the first invalid field
- the synchronous double-submit guard
- `aria-disabled` on the button while sending

**Layout**
- The island sits below the nav (z-index 1200) and never covers the focused field.
- Reduced motion: a crossfade instead of the spring.

### 2.7 Scroll-lit text (Home About)

**Readable at every frame**
- Words animate **colour**, from `text.secondary` (5.1:1 in light, 8.7:1 in dark) to `text.primary`. Opacity is not used: the prototype's 0.18 opacity measured about 1.3:1.

**Semantics**
- GSAP SplitText by words with `aria: 'none'`: no `aria-label` on the paragraph (ARIA prohibits naming a paragraph) and no `aria-hidden` on words, so screen readers read the real word spans.
- Revert the split on cleanup.

**Scope**
- Remove the paragraph from the shared `ScrollReveal` wrapper (`page.tsx:275`); the heading keeps its reveal.

**Fallbacks**
- Reduced motion and no JavaScript: no split, plain `text.secondary`, exactly as today. No `data-intro`, so nothing is hidden before hydration.

### 2.9 Dock (footer)

**Destinations and labels**
- The same four destinations as today: Email, LinkedIn, GitHub, Medium.
- Each icon keeps its accessible name and a 44px hit area.
- Keyboard focus shows the macOS-style label.

**By input type**
- **Fine pointer:** cosine magnification, with batched pointer reads and writes in rAF.
- **Touch:** no magnification, and each icon gets a visible caption underneath.

**Contact page**
- Keeps its full text list: email address, handles and location stay visible.

### 2.10 Apple Intelligence glow

**When it shows**
- On interaction only: message-field focus, sending, and CTA hover/focus. Never on page load.
- At most two on screen at once.

**Motion settles (D11)**
- The ring rotates for at most 5 s per activation, then settles to a static ring.
- Reduced motion: a static ring from the start.
- `forced-colors`: no glow.

**CSS**
- A conic gradient with a registered `@property --angle`; a 2px masked ring plus a blurred halo.

---

## 3. Shared foundations (PR A)

**Glass tokens** in one place (CSS module plus `sx` helpers):
- fill, blur, saturate, rim, shadow
- light and dark values
- `-webkit-backdrop-filter` always paired with `backdrop-filter`

**Transparency policy (D12)**
- `prefers-reduced-transparency` is unsupported in Safari and behind a preference in Firefox, so it cannot be the only safeguard.
- **Text-bearing glass** (nav, controls, island, sheet) uses an opaque-enough fill everywhere: at least 72% opacity, as apple.com does. That keeps contrast without detection.
- Where `prefers-reduced-transparency: reduce` does match (Chromium), all glass, the edge blur and the WebGL lens become solid.
- Fallback rules sit **after** the base rules; the prototype's fallback was overridden by later styles (`lab.module.css:62`).

**Motion helpers** in `src/lib/motion.ts`:
- `usePrefersReducedTransparency`
- `useInView`
- `useIdle`
- `settleAfter(ms)`, which stops nonessential motion after 5 s

**GSAP**
- Register SplitText in `src/lib/gsap.ts`. Load it with a dynamic `import()` only on pages that use it, so it stays out of other routes' bundles.
- Draggable and Inertia aren't needed; the hand-rolled pointer code stays.

**Lab**
- `/lab` lives only on the `proto/lab` branch (draft PR #32) as the reference implementation. It never reaches `master`; PR I closes draft PR #32 once everything has shipped.

---

## 4. Guardrails

**Accessibility**
- Lighthouse accessibility 100 on all pages (CI budget).
- Manual keyboard-only pass.
- VoiceOver on the nav, theme switch, skills controls, honeycomb, card sheet, island and scroll-lit paragraph.

**Contrast**
- Text on glass and on the wallpaper reaches at least 4.5:1 (3:1 for large text) at worst-case pixels, in both schemes.

**Motion**
- No nonessential animation runs longer than 5 s without user interaction (WCAG 2.2.2).

**Performance acceptance (enforced, not just warned)**
- **Bundle headroom:** about 37 KB below the 350 KB JS budget today. Each PR reports its JS delta, and anything over 8 KB gzip needs a justification in the PR.
- **Lighthouse medians:**
  - For PRs B, C and the final PR, run five Lighthouse passes on the baseline (`master`) and on the candidate, on the same machine with the same production build method.
  - Record the medians and the **actual LCP element**.
  - **Home LCP may not exceed the baseline median × 1.10.** CI only warns above 4 s, so this is a manual gate written into each PR.
- **Blur layers:** the scroll edge blur and the glass are profiled on a real phone, the owner's iPhone, before PR B merges.
- **WebGL:** paused off screen or when the tab is hidden; DPR capped at 1.5; a single draw call.

**SEO and content**
- All copy stays in server-rendered HTML.

**Browsers**
- Safari 17+, iOS Safari 17+, Chrome and Firefox, each with the fallback described above.

---

## 5. Testing

Tests change in the **same PR** as the behaviour they cover.

**Unit tests (Vitest)**
- hex layout centring and keyboard neighbour map
- Dock falloff
- glass map and smooth-union helpers (pure functions)
- radio-group keyboard reducer
- deep-link parser (valid, invalid and missing id)

**End-to-end tests (Playwright)**
- **Nav:**
  - the capsule follows the route
  - the compact state keeps 44px hit areas
  - the skip link comes first
  - focused links aren't obscured
  - 200% text zoom doesn't overflow
- **Theme:** update `theme.spec.ts` (`:35` expects a button) to the switch: resolved `aria-checked`, persistence, return to system, inert without JavaScript.
- **Skills:**
  - List is the default and shows all 45
  - View and Category radio groups with arrow keys
  - Honeycomb reaches every skill by keyboard
  - the live caption appears once the honeycomb has settled
  - the inactive view is inert
- **Open Source:**
  - Details opens the sheet; Esc and Close work; focus returns to the same card's Details button
  - the GitHub shortcut href is correct
  - deep link, invalid id, and Back/Forward behave as specified
  - opening and closing quickly or repeatedly, and navigating away mid-transition, cause no errors
  - update `accessibility.spec.ts` (`:70` expects project links)
- **Contact:**
  - the live region announces sending, sent and error (route mocked) without moving focus
  - field errors still work
  - a double click still sends once
  - update the specs that expect the old confirmation
- **Footer:** Dock names, hit areas, and visible captions on touch.

**Coverage to add**
- **Reduced transparency:** Chromium via CDP `Emulation.setEmulatedMedia` with `prefers-reduced-transparency: reduce`.
- **No JavaScript and deferred chunks:** a context with JavaScript disabled, plus a test that blocks the WebGL chunk. All copy must still be present and readable.
- **Firefox:** a Desktop Firefox project for the functional specs (not visual).

**Visual snapshots (Docker)**
- **Don't mask the canvas.** A mask covers its whole box, including the hero text.
- For deterministic snapshots, hide only the canvas pixels (`canvas { visibility: hidden }` injected in the test). The poster and all DOM text stay in the snapshot.

**Separate GPU checks**, in both themes:
- the canvas renders and the pill aligns with the `<h1>` box
- the failure path shows the poster
- the loop pauses off screen and resumes
- the worst-case name contrast passes

Visual snapshots are regenerated only after the owner approves each visible change.

---

## 6. Rollout (one PR each, in order)

| PR | Scope | Visible? |
|---|---|---|
| A | Foundations: glass tokens and transparency policy, motion helpers (`settleAfter`, `useInView`, `useIdle`), z-index scale, lazy SplitText | No |
| B | Floating top nav + scroll edge + glass theme switch (global), with perf medians and real-phone profiling | Yes |
| C | Liquid Glass hero (Home): poster, failure handling, render on demand, settle rule, perf medians | Yes |
| D | Skills: List default, View and Category radio groups, opt-in Honeycomb | Yes |
| E | Scroll-lit About text (colour, `aria: 'none'`) + glow on the Home CTA | Yes |
| F | Open Source: TV cards, Details button + GitHub shortcut, sheet morph, deep links, `OpenSourceIntro` | Yes |
| G | Contact: Dynamic Island with a persistent live region + glow on the message field | Yes |
| H | Footer: Dock with touch captions | Yes |
| I | Cleanup: remove components left unused (`MagneticElement` if unused, the old `ThemeToggle`), README, final perf medians, re-baseline Lighthouse, then close draft PR #32 | No |

**For each PR:**
1. Preview in the browser pane.
2. Light and dark screenshots to the owner.
3. Owner approval.
4. Snapshot update.
5. Push.
6. CI must pass.
7. Merge.

Each PR leaves the site consistent and can be reverted on its own.

---

## 7. Decisions

| # | Question | Decision (approved 2026-10-06) |
|---|---|---|
| D5 | A colourful wallpaper in the Home hero only? | **Yes, conditionally:** restrained intensity, readable name and body text at worst-case pixels, a stable poster, and LCP measured against the baseline. |
| D6 | Mobile nav placement? | **Top capsule on all sizes first.** A bottom tab bar can follow once safe-area, keyboard and focus-obstruction checks pass. |
| D7 | Skills default view? | **List by default for everyone;** Honeycomb is an explicit, optionally remembered choice. |
| D8 | Project cards open a sheet? Deep links? | **Yes:** a Details button opens the sheet, plus a separate GitHub shortcut on every card. Deep links with the history contract in §2.5. |
| D9 | Theme switch loses a visible "system" state? | **Accept.** Keep the automatic return to system, a resolved `aria-checked`, and an honest inert state without JavaScript. No hidden long-press. |
| D10 | Footer Dock vs Contact list? | **Dock in the footer; Contact keeps its detailed list.** Visible captions on touch, reliable keyboard labels, the same four destinations. |
| D11 | Decorative motion: settle within 5 s, or add a pause control? | **Settle within 5 s** (wallpaper drift, glow rotation) and animate again only on interaction. No new UI text needed. |
| D12 | Where the browser can't report Reduce Transparency (Safari, most Firefox), is an opaque-enough glass fallback acceptable? | **Yes:** text-bearing glass is at least 72% opaque everywhere, like apple.com; fully solid where the preference is detectable; the clearest glass only on decorative surfaces (the hero lens). |

---

## 8. New UI text

**Open Source**
- "Details"
- "View on GitHub"
- "Close"

**Contact**
- "Sending…"
- "Message sent"
- "Horus will get back to you soon"
- the error line (reuses `CONTACT_SEND_ERROR`)

**Theme and skills controls**
- "Dark mode"
- "View"
- "List"
- "Honeycomb"
- "Category"
- "All"

**Accessible names only** (not visible): "GitHub repository for {project}". The category names are reused from `skills.ts`. Nothing else in the copy changes.

---

## 9. Risks

| Risk | Mitigation |
|---|---|
| WebGL battery and heat | Render on demand, settle after 5 s, pause off screen or when the tab is hidden, DPR cap 1.5, single draw call |
| WebGL failure or context loss | The poster is always underneath; compile/link checks; context loss and restore handled; resources disposed |
| Stacked backdrop-filters cause jank on phones | 3 layers on phones, profiled on a real iPhone; drop to one layer if scrolling or INP suffers |
| Floating nav hides focused content | `scroll-padding-top`, an obscured-focus test, a z-index scale |
| Touch conflicts with page scroll | `pan-y` on the hero, no touch drag; the honeycomb is opt-in |
| The morph collides with the page crossfade or breaks focus | Sheet portal outside `main`, exclusive names, a ref map by project id, tests for rapid and repeated use |
| Deep links blank the cards while prerendering | A query controller in its own Suspense with a `null` fallback; cards stay server-rendered |
| Scroll-lit text unreadable or mis-announced | Colour animation between two AA colours; SplitText `aria: 'none'` |
| Reduce Transparency undetectable in Safari | Opaque-enough text-bearing glass everywhere (D12) |
| Visual snapshots flaky or blind to the hero | Hide only the canvas pixels; separate GPU checks |
| Bundle creeps past the budget | Lazy SplitText and WebGL chunks; a per-PR JS delta report with an 8 KB threshold |
| Design drift from the minimal look | One colourful moment (the hero); everything else stays monochrome glass |

---

## Where things live

- **This plan:** `docs/apple-effects-plan.md` on branch `proto/lab`. Read it with `git show origin/proto/lab:docs/apple-effects-plan.md`.
- **Reference prototypes:** `src/app/lab/` on branch `proto/lab`. Port ideas from them; never merge the branch.
- **Implementation PRs:** each one branches from the latest `master`.

## Changelog v1 → v2

All changes come from the Codex review of 2026-10-06.

1. **Scroll-lit text:**
   - animate colour between two AA colours, not opacity (0.18 opacity measured about 1.3:1)
   - SplitText `aria: 'none'`, with no `aria-label` on the `<p>`
   - remove the paragraph from the shared ScrollReveal
2. **Server HTML:**
   - hero text stays outside the lazy canvas; the canvas is a decorative layer aligned to the real `<h1>`
   - explicit intro ownership for Home, and a new `OpenSourceIntro` island
3. **WebGL robustness:**
   - compile and link checks; poster on failure; context loss and restore handled
   - resources disposed on unmount
   - render on demand, redrawing on resize, theme and preference changes
   - pill sized from the heading and clamped to the viewport
4. **WCAG 2.2.2:** wallpaper drift and glow rotation settle within 5 s and animate again only on interaction (D11).
5. **Nav:**
   - a top capsule on all sizes
   - safe-area insets; hit areas never shrink
   - `scroll-padding-top` for focus visibility
   - a z-index scale; tests at 200% zoom
6. **Morph:** exclusive named participants, the sheet in a portal outside `main`, focus restored through a ref map by project id, and tests for rapid and repeated use.
7. **Deep links:** a query controller in its own Suspense, a history contract, handling of invalid ids, and a separate Details button and GitHub anchor.
8. **Skills:**
   - List is the default; Honeycomb is opt-in
   - two labelled radio groups with arrow keys
   - "All" shows everything; the inactive view is inert
   - full keyboard reachability; a live caption once settled
9. **Transparency:**
   - text-bearing glass at least 72% opaque everywhere (D12)
   - fallback rule order fixed; prefixed `backdrop-filter` for Safari 17
   - the Safari 18.0/18.1 morph fallback documented
10. **Performance:** enforced 5-run medians for B, C and the final PR; the actual LCP element recorded; the Home LCP gate made explicit; a per-PR JS delta report; real-phone profiling.
11. **Visual tests:** hide only the canvas pixels instead of masking; separate GPU checks for render, alignment, failure, pause and contrast.
12. **Contact:** a persistent live region outside the busy form, no automatic reset, wrapping error text.
13. **Tests and rollout:**
   - tests updated in each feature PR
   - added reduced-transparency, no-JS and deferred-chunk, dialog and Firefox coverage
   - G split into G (Contact) and H (Footer); cleanup is now I
