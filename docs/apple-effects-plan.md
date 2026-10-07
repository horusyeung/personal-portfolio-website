# Apple effects plan (v3, 2026-10-07)

This is the current portfolio effects and interaction plan. It replaces the v2 rollout stored on `proto/lab`. The prototype branch remains a separate reference; its code and history are never merged into `master`.

**Current owner-approved direction:** keep the original full-width top navigation, the stable CSS hero background and the unwrapped name. Use Bento spotlight categories on desktop and category shelves on mobile. The floating capsule, WebGL hero/lens, liquid-glass name wrapper, Honeycomb and Apple Watch frame are retired experiments, not pending production work. Their former contracts are retained in the historical appendix solely as a record.

The owner approved the cumulative F, G and Home preview for merge/deployment on 2026-10-07. Approval authorizes release after verification; it does not turn a failing CI run into a passing one. F is deployed and verified on the canonical site. G is merged with required CI passing, and its production pipeline is running. The status table records this release checkpoint; refresh it from actual deployment evidence as the remaining releases finish.

## 1. Status and sequence

| Step           | Current scope                                                                              | Status at the 2026-10-07 planning checkpoint                                                                                     |
| -------------- | ------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------- |
| A              | Shared accessibility, transparency, motion and layering foundations                        | Shipped                                                                                                                          |
| B              | Original full-width header retained; clear, labelled theme action                          | Shipped with the owner's revised direction                                                                                       |
| C              | Stable CSS hero background; no name wrapper or canvas replacement                          | Shipped with the owner's revised direction                                                                                       |
| D              | Technologies: desktop Bento spotlight, mobile category shelves                             | Shipped with the owner's revised direction                                                                                       |
| E              | Scroll-lit About text and interaction glow on the Home closing CTA                         | Shipped; [PR #35](https://github.com/horusyeung/personal-portfolio-website/pull/35) merged                                       |
| F              | Open Source TV cards, project sheet, deep links and separate repository actions            | Shipped; [PR #36](https://github.com/horusyeung/personal-portfolio-website/pull/36) merged at `635d999`; canonical site verified |
| G              | Contact status island and message-field interaction glow                                   | [PR #37](https://github.com/horusyeung/personal-portfolio-website/pull/37) merged at `b1f3731`; production verification pending  |
| Home follow-up | Per-category scroll fades and clearer hero paragraph hierarchy, with exact copy preserved  | Built and now approved in the cumulative preview; release pending                                                                |
| H              | Footer Dock with keyboard labels and touch captions                                        | Built and verified locally; owner visual approval and release pending                                                            |
| H1             | Audit all animation and page animation; fix missing or inconsistent fade-ins               | New step before final cleanup; not started                                                                                       |
| H2             | R&D beautiful, expressive showpiece animation; browser prototypes and owner choice         | New research/prototype step; no production effect selected                                                                       |
| H3             | R&D a mini-game or fancy interactive UI demonstration; browser prototypes and owner choice | New research/prototype step; no production demo selected                                                                         |
| I              | Final cleanup, documentation, final performance and accessibility checks                   | Last step, after H1, H2 and H3 decisions                                                                                         |

**Order:** finish F → release G and the approved Home follow-up → H → H1 → H2 → H3 → I. Keep one implementation PR in flight at a time. H2 and H3 authorize research and prototypes; a chosen production integration needs an explicit owner decision, a bounded scope and the same release gates as other visible work. If no candidate is selected, record that outcome and continue to I.

Six of the original nine steps are shipped at this checkpoint. G is merged and awaits production verification; H and I remain, with three newly requested steps inserted before I. The Home follow-up is a separate approved correction, not an invented replacement for an original step.

F's final PR browser job completed with 574 passed, 127 skipped and one flaky Escape-dismissal case that passed on the CI retry. An earlier local Firefox reduced-motion Close failure also remains unresolved. Preserve both observations and investigate the sheet lifecycle during H1; green CI is not evidence that either intermittent failure was repaired.

## 2. Ground rules and release workflow

- Keep existing page copy. Only already approved UI labels may be added; propose any R&D copy or new section separately before production integration.
- No em dashes in visible text.
- Preview each visible change in the browser and provide light/dark desktop/mobile evidence before pushing. Obtain owner visual approval before updating affected snapshots or merging.
- Use branches such as `feat/apple-footer-dock`, starting from verified latest `master`. **Never use a `codex/` branch prefix.**
- Commit author and committer are **Horus Yeung <84363315+horusyeung@users.noreply.github.com>**. Use per-command Git identity settings without changing repository configuration. Commit and PR titles/messages have no AI attribution and no `Co-authored-by` trailer.
- PR descriptions contain exactly `## Summary` and `## Test plan`; validation uses checkboxes. Report failures and manual checks that were not performed honestly.
- Tests change in the same PR as the behavior they cover. Do not weaken assertions, increase image tolerances or retry away an unresolved failure to claim readiness.
- Require passing CI before merge. Verify the resulting production deployment and canonical routes before marking a step shipped.
- Each production PR leaves the site consistent and can be reverted independently.

For each implementation PR: browser preview → light/dark evidence → owner approval → approved snapshot updates → push → passing CI → merge → deployment verification. The owner's 2026-10-07 approval already covers the reviewed cumulative F, G and Home design; request another visual decision only if it materially changes.

## 3. Active behavior and acceptance contracts

### 3.1 Home hero and header

**Server content and first paint**

- The overline, real `<h1>`, hero paragraph, CTAs and stats remain server-rendered and in their original reading order.
- Preserve the exact `BIO.hero` text in one semantic paragraph. Its first sentence may have stronger hierarchy and the supporting sentence a smaller size; do not rewrite the copy.
- The hero paragraph stays visible and stationary from server render. Do not delay the LCP text behind an entrance opacity or sideways slide.
- Keep the stable CSS gradient background and unwrapped name. Do not restore a canvas, WebGL lens or glass name wrapper as a cleanup or audit repair.
- Native scrolling and pinch zoom stay available; do not add `touch-action: pan-y` or touch-drag interception to the decorative hero.

**Navigation and theme**

- Keep the original full-width fixed AppBar and its matching spacer. Preserve the skip link, `<nav aria-label="Main">`, `aria-current` and at least 44px navigation hit areas.
- The header keeps `view-transition-name: site-header` so route crossfades do not animate it twice.
- Keep focus and in-page targets clear of the fixed header through the existing scroll margin/padding; verify at narrow widths and 200% text zoom.
- Keep the explicit theme action with the icon and visible `Light` or `Dark` label describing the destination. Its accessible name identifies that action, such as `Switch to dark theme`.
- Theme behavior follows the resolved scheme. Selecting the system's own scheme returns to following the system. The pre-hydration/no-JavaScript representation is visibly correct and inert; do not require an invisible long-press reset.
- Theme text uses the same intended palette as the navigation. Do not reintroduce the rejected ambiguous icon-only control or the superseded switch/radio-group design.

### 3.2 Technologies showcase

- Desktop uses the approved Bento spotlight category layout; mobile uses the approved category shelves. All nine categories and all 47 current skill names remain in server HTML, accessible and readable without JavaScript.
- Pointer spotlight is an enhancement for capable fine-pointer devices. Touch, keyboard, reduced motion and no-JavaScript users keep complete readable content and normal page scrolling.
- Each category gets its own once-only scroll fade through the existing shared entrance-motion lifecycle: opacity 0 to 1, 0.6 seconds, `power2.out`, trigger at `top 85%`.
- Keep hover transform ownership in CSS; the opacity entrance must not overwrite the hover transform or cause a layout shift.
- Reduced motion, preference changes during a reveal, hydration delays and route cleanup must restore all content to a readable state.
- No Watch frame, Honeycomb view, panning canvas, hidden skills or substitute skill inventory is part of the active plan.

### 3.3 Scroll-lit Home About text

- Animate word **color**, from the existing AA `text.secondary` to `text.primary`; never use low-opacity text as the visual effect.
- Use GSAP SplitText by words with `aria: 'none'`. Do not add an `aria-label` to the paragraph or hide its actual words from assistive technology.
- Revert the split on cleanup. The paragraph has a single animation owner; its heading may retain the shared section reveal.
- Reduced motion and no JavaScript show the original unsplit paragraph in readable `text.secondary`, with no pre-hydration hiding.

### 3.4 Open Source cards and project sheets (F)

**Server rendering and controls**

- The page stays a Server Component. Every card's name, description, tags, status and repository URL stay in server HTML. The client island receives data as props without fetching or suspending the cards.
- Each card is an `<article>` with a Details button and a separate repository shortcut. No nested interactive controls. The Live/Coming Soon status remains visible.
- **Coming Soon repository actions are disabled**, including `View on GitHub` in the sheet. They cannot navigate through pointer, keyboard or an active anchor. Preserve the owner-approved disabled appearance and accessible state.

**Morph lifecycle and fallbacks**

- Keep `startTransition`, an explicit `share` class and mutually exclusive named participants: either the card or the sheet carries its project transition name, never both.
- Render the sheet in a portal outside `main`, so opening it does not trigger the page crossfade.
- Names are unique per project and never reuse `site-header`.
- Safari 18.0/18.1 lack `view-transition-class` and use the default crossfade. Safari 17 has no view transitions and shows the sheet directly. Full morph requires a compatible browser; fallback functionality must be complete.

**Focus, history and rapid use**

- The dialog is labelled by the project name, traps focus and closes on Escape and Close.
- Keep current Details-button refs keyed by project ID. After closing finishes, focus the current opener for the same project even if the transition swapped DOM nodes.
- A small query controller reads `?project=<id>` in its own `<Suspense fallback={null}>`; the server-rendered cards never disappear behind its fallback.
- Opening pushes the project query without scrolling. Closing goes back if opened in-app; a directly loaded sheet instead replaces the URL with the bare path. Invalid IDs are ignored and stripped. Back/Forward open and close the expected sheet.
- Rapid/repeated open-close and route navigation during transitions must not detach the effective opener, create duplicate dialogs/history entries or cause runtime errors.

**Card motion and intro ownership**

- Tilt and glare use `gsap.quickTo`, with pointer reads/writes batched in one animation frame. Touch and reduced motion get a restrained lift; keyboard focus also lifts.
- One intro owner retains the page title/subtitle reveals. No `data-intro` element is left without a motion owner.

### 3.5 Contact status island (G)

**Announcements and persistence**

- Keep one persistent, initially empty `role="status"`, `aria-live="polite"`, atomic region outside the busy form, so `aria-busy` does not mute announcements.
- Update it for sending, success and error without moving focus. The visual island mirrors the same state without duplicate announcements.
- Success and error persist until the next submission or explicit dismissal. No automatic three-second reset. Long messages wrap and the island may grow.
- Preserve inline field errors, first-invalid-field focus, the synchronous double-submit guard, validation/normalization, existing API behavior and `aria-disabled` while sending.

**Focus and geometry**

- The island sits below the navigation at z-index 1200 and never covers the focused field or an actionable control.
- Fall back to normal flow when it would obscure focus or not fit the visual viewport. Account for resize, scrolling and virtual-keyboard viewport changes, with batched geometry work.
- Explicit Close may restore the last connected external focus target. State changes and automatic repositioning do not steal focus.
- The Close control has a reliable accessible name and at least a 44px hit area.
- Reduced motion gets the static/crossfade fallback instead of the spring. Supported reduced transparency makes the surface solid.

### 3.6 Interaction glow (E and G)

- Activate on message-field focus/sending and Home CTA hover/focus, never on page load. At most two glows are on screen at once.
- A registered `@property --angle` drives a conic-gradient, 2px masked ring with a blurred halo.
- Each activation rotates for at most five seconds and then settles to a static ring. Reduced motion is static from the start; forced colors suppress the glow.
- Entrance animation and hover/focus animation have separate property ownership. Verification waits for the actual entrance state before testing a stationary hover target.

### 3.7 Footer Dock (H, next)

- Use the same four destinations: Email, LinkedIn, GitHub and Medium. Each retains its accessible name and at least a 44px hit area.
- Fine pointer gets cosine magnification with pointer reads/writes batched in an animation frame. Magnification must not shrink a hit area, shift surrounding content or obscure nearby focused controls.
- Keyboard focus shows the macOS-style destination label and a clear focus indicator. The destination remains an ordinary link with predictable activation and tab order.
- Touch gets no magnification and a visible caption under each icon. Reduced motion gets a stable presentation, with all links usable.
- Contact keeps its full detailed text list, including the existing address, handles and location. Footer work does not replace it.
- Preview all four routes in both themes at desktop and narrow mobile widths before requesting the owner's decision.

## 4. New steps before I

### H1. Audit all animation and page animation

**Purpose:** make existing motion consistent and repair missing fade-ins throughout the site without revisiting the retired design experiments.

1. Inventory motion on Home, Experience, Open Source and Contact, plus shared header/footer, route transitions, project sheets, status feedback, hover and focus states. For each animated target record its owner, trigger, animated properties, timing/easing, replay rule, cleanup and fallback.
2. Compare initial load, route navigation, Back/Forward, slow/deferred hydration and scrolling into each section. Find elements with missing owners, conflicting wrappers, skipped or repeated reveals, unexplained timing differences and accidental long-running motion.
3. Align related section/card fade-ins with the existing shared motion contract. Preserve intentional differences, such as always-visible LCP text, interactive morphs and the readable color-only About effect. Do not hide every element just to make it animate.
4. Fix confirmed missing/inconsistent fade-ins and property-ownership conflicts in a focused PR. Ensure in-view content cannot stay invisible when preferences change, motion is interrupted or a route unmounts.
5. Verify no-JavaScript and deferred-chunk readability, reduced motion at load and during playback, keyboard focus, touch scrolling, both themes and all supported browser profiles. Show before/after browser evidence for each repaired inconsistency.

**Deliverables:** a checked route/component motion inventory; a short finding/repair ledger; the verified fixes; and an owner-reviewed preview. Do not count unperformed native Safari 17, physical iPhone or VoiceOver checks as automated-browser results.

### H2. R&D beautiful showpiece animation

**Purpose:** identify a restrained, memorable motion moment that demonstrates craft and fits the current portfolio, then let the owner choose it in a browser.

1. Research current industry examples and primary library/platform documentation when this step starts. Compare CSS/WAAPI, existing GSAP and native View Transitions before adding a dependency. Record source URLs, license/maintenance, browser fallbacks, payload cost and input/accessibility limits.
2. Inspect the owner-requested Horvault website frontend `DEV` reference. Reuse general implementation lessons only. Its shared reveal lifecycle, grid-level pointer spotlight, named View Transitions and lazy deterministic demo with an SSR fallback are verified reference patterns; they are not an instruction to transplant the design or private material.
3. Build a small set of genuinely different browser prototypes, such as typography choreography, a layered scroll composition, a controlled pointer light/depth treatment or a native transition composition. Use existing portfolio content or neutral fixtures and keep experiments isolated from production routes and releases.
4. Each candidate must demonstrate its first frame, complete finite playback, user reactivation, reduced-motion/static fallback, keyboard/touch behavior, offscreen/hidden-tab lifecycle and both themes. Prefer a clear finite sequence over subtle perpetual movement.
5. Present playable previews, screenshots or short recordings and a concise comparison of visual fit, complexity, accessibility and performance. The owner selects a candidate, asks for another trial, or defers the idea.

**Deliverables:** sourced research, working prototypes and an explicit recorded owner decision. Production integration is a separately scoped follow-up only if selected. R&D must not reintroduce the rejected header, hero wrapper or Watch UI by default.

### H3. R&D mini-game or interactive UI demonstration

**Purpose:** explore a playful way to show technical ability while keeping the portfolio easy to read and navigate.

1. Research current examples and appropriate maintained tools from primary sources. Compare a small mini-game with an interactive UI demo; assess which communicates the portfolio's skills most clearly.
2. Prototype distinct concepts, for example a bounded physics toy, a keyboard/touch puzzle, an interactive system map or a deterministic data/UI simulation. Concepts are candidates, not approved production features or approved new page copy.
3. Give each prototype a clear start/reset/exit interaction, predictable keyboard and touch controls, visible focus, a static explanation/fallback and a reduced-motion mode. Do not capture global keys, lock page scrolling, require sound or block normal navigation.
4. Keep initial route content server-rendered and usable before the demo loads. Lazy-load heavy code/assets; pause offscreen/hidden-tab activity and dispose listeners, workers, animation frames, GPU resources and audio on exit/unmount. Use neutral simulated data rather than private product, client or user data.
5. Present playable browser candidates with a comparison of delight, skill signal, mobile usability, accessibility, load cost and ongoing maintenance. Let the owner select, revise or defer before specifying any production location or integration.

**Deliverables:** sourced research, playable prototypes, interaction/accessibility/performance notes and an explicit recorded owner decision. Any selected integration needs its own acceptance scope and release gates. No analytics, leaderboard, account system or backend expansion is implied by this R&D step.

## 5. Shared foundations and guardrails

**Styling and transparency**

- Use the project's existing design tokens and components. Glass tokens stay centralized: fill, blur, saturation, rim and shadow in both themes. Pair `-webkit-backdrop-filter` with `backdrop-filter` where used.
- Text-bearing translucent surfaces use an opaque-enough fill of at least 72% everywhere. Where `prefers-reduced-transparency: reduce` matches, use solid surfaces. Preference detection is not the sole contrast safeguard because support varies.
- Fallback CSS follows base rules so it wins in the cascade. Do not introduce additional stacked blur layers without measured benefit and phone evidence.
- Keep the documented z-index order: header 1100, status island 1200, modal sheets/dialogs 1300, skip link 2000. A sheet covers the header; feedback cannot cover focus.

**Motion and accessibility**

- Use the existing shared motion helpers and scoped cleanup. Lazy-load SplitText only on routes that use it; do not add Draggable/Inertia or a new animation runtime without a demonstrated need.
- No nonessential automatic animation runs longer than five seconds without user interaction. Respect reduced motion, forced colors and supported reduced transparency.
- Keep a readable server-rendered first frame, a no-JavaScript fallback and a complete interruption/cleanup path. Avoid content flashes, replay surprises and competing transform/opacity owners.
- Text contrast is at least 4.5:1, or 3:1 for large text, at worst-case background pixels in both themes. All copy remains in server HTML.
- Lighthouse accessibility 100 on all production routes, plus a keyboard-only pass. VoiceOver/native Safari/physical-device checks are reported individually, including checks not performed.

**Performance**

- Report each PR's initial route JS gzip delta. Changes over 8 KB require justification. Stay within the project's enforced 350 KiB JavaScript and 420 KiB total-transfer budgets; do not rely on obsolete v2 headroom estimates.
- For substantial Home/hero motion changes and final I, run five Lighthouse passes on verified baseline `master` and candidate, on the same machine with the same production build method. Record medians and the actual LCP element.
- **Home LCP must not exceed baseline median × 1.10.** Keep the hero paragraph immediately readable and avoid measurable layout shift.
- Profile any new blur/GPU-heavy effect on a real phone before production integration. Automated WebKit is not evidence of real-device heat, battery, keyboard or Safari-version behavior.
- Any future selected GPU prototype must settle, pause offscreen/hidden and dispose resources. Those conditional safeguards do not approve bringing the retired WebGL hero back.

**Browser behavior**

- Preserve complete functionality in Safari 17+, iOS Safari 17+, Chrome and Firefox, using the documented static/crossfade fallbacks.
- Native View Transitions and modern effects are progressive enhancements. No browser may lose content, focus, navigation or submission feedback when an enhancement is unavailable.

## 6. Verification

Use the repository's installed tooling and read the relevant installed Next.js guides before code changes. Keep checks proportionate to the behavior changed and retain initial failure evidence when diagnosing a repair.

**Unit coverage**

- Dock falloff/geometry and any other new pure interaction helpers.
- Deep-link parsing and history-state behavior.
- Contact status parsing/dismissal and validation contracts.
- Any new audit repair or selected R&D integration that changes state behavior.

**Browser coverage**

- Header/theme: skip link first, active route, resolved scheme/persistence/return to system, inert pre-hydration representation, hit areas, focus clearance and 200% text zoom.
- Skills: all nine categories/47 names, independent once-only fades, visible intermediate frames, reduced-motion recovery during playback, CSS hover ownership and readable no-JavaScript/deferred-hydration states.
- Open Source: sheet open/Close/Escape/focus return; correct live repository links; disabled Coming Soon actions; valid/invalid deep links; Back/Forward; rapid repeated operation and route departure without errors.
- Contact: mocked sending/success/error announcements without focus theft; persistent terminal states; explicit dismissal; inline errors/first-invalid focus; one request on duplicate activation; feedback stays clear of focused fields in narrow/short viewports.
- Footer: all destination names/hrefs/hit areas, keyboard labels/focus, touch captions and reduced-motion behavior.
- H1: every repaired reveal gets a meaningful regression check, including preference changes and interrupted lifecycle when relevant. Do not write tests that merely mirror CSS values while missing actual visibility or focus behavior.
- R&D: prototype checks establish viability; complete production checks are required only if an integration is selected and scoped.
- Run supported Desktop Chrome, Desktop Safari, Desktop Firefox, Mobile Chrome and Mobile Safari profiles. Emulate reduced transparency in Chromium through CDP where supported. JavaScript-disabled and blocked/deferred application chunks must leave all core content readable.

**Visual and manual evidence**

- Use the official Playwright Docker version pinned by the repository and explicit `linux/amd64` to match CI. Keep zero pixel tolerance; do not confuse host-architecture differences with a production change.
- Regenerate only affected snapshots after owner approval. Record expected differences and review both themes/viewport sizes. Do not hide whole content regions to make a snapshot pass.
- For any separately approved future canvas demo, hide only decorative canvas pixels for deterministic layout snapshots and add separate render/failure/pause/contrast checks; never mask the text's entire box.
- Preserve failures, skips and flaky results in the report. A later passing diagnostic does not erase an earlier unresolved intermittent failure.

## 7. I: final cleanup and release acceptance

I remains last. It starts after H and the H1 audit, and after H2/H3 each have an owner decision recorded. A deferred R&D idea does not block cleanup; an approved integration must be verified before it is counted as shipped.

- Remove genuinely unused components and dependencies only after checking references. Do not remove the active `ThemeToggle` simply because v2 once proposed replacing it.
- Keep `/lab`, prototype-only routes and rejected experiments out of `master`. Preserve their separate branch history as reference; close draft [PR #32](https://github.com/horusyeung/personal-portfolio-website/pull/32) when the rollout is complete and its final disposition is confirmed.
- Update README, this canonical plan, motion inventory and the final chosen/deferred R&D decisions. Remove stale instructions that would resurrect retired designs.
- Run final lint, formatting, types, unit, browser, approved visual snapshots and Lighthouse budgets. Record the five-run baseline/candidate Home medians, actual LCP element and route bundle deltas.
- Finish keyboard, focus, contrast, reduced-motion/transparency, no-JavaScript and responsive checks. List any physical-device/native Safari/VoiceOver limits explicitly.
- Require passing CI, verify deployment and canonical route behavior, and update the status table from actual results. Do not mark a PR merged or production deployed based on local preview alone.

## 8. Approved labels and references

Existing portfolio prose stays unchanged. Approved labels already used by the current direction include:

- Open Source: `Details`, `View on GitHub`, `Close`; accessible repository names identify the project.
- Contact: `Sending…`, `Message sent`, `Horus will get back to you soon`, the existing `CONTACT_SEND_ERROR`, and the accessible Close label.
- Theme: visible `Light` / `Dark` action text and the corresponding `Switch to … theme` accessible name.
- Category headings and skill names reuse the existing content. The retired `View`, `List`, `Honeycomb`, `Category`, `All` control proposal is not a reason to add those controls now.

H2/H3 may propose additional labels or a demo section, but those are reviewed with the selected integration. Research does not authorize rewriting existing copy.

**Sources and reference boundaries**

- This document becomes canonical at `docs/apple-effects-plan.md` on `master` through a normal implementation/documentation PR.
- Original v2: `git show proto/lab:docs/apple-effects-plan.md`. Prototype source: `src/app/lab/` on `proto/lab`, never a merge source.
- Release references: [PR #35](https://github.com/horusyeung/personal-portfolio-website/pull/35) and [PR #36](https://github.com/horusyeung/personal-portfolio-website/pull/36). Check their current state before updating release status.
- Owner-requested Horvault reference: the `DEV` chat for `horvault-website-frontend` was identified and read. General motion patterns are available as research evidence. Private conversation links, product fixtures, client details and secrets stay out of the public portfolio repository. Inspect the current implementation and licensing before proposing any code reuse; local source presence does not prove deployment.
- Add current primary-source URLs and prototype comparisons during H2/H3; this planning update does not claim those R&D investigations are already complete.

## Changelog v2 to v3

1. Replaced the obsolete “nothing implemented yet” status with the actual shipped, approved and CI-pending rollout state.
2. Recorded the owner's superseding full-width header, explicit theme action, stable CSS hero, unwrapped name and Bento/shelves choices. Retained the retired v2 details as history rather than implementation instructions.
3. Added the approved Home typography and per-category scroll-fade follow-up, with preserved copy and first-render readability.
4. Preserved the detailed sheet/history/focus, live-region/persistence, color-only About, finite glow, Dock, accessibility and performance contracts. Added the approved disabled Coming Soon repository behavior.
5. Kept H Footer next and inserted H1 animation audit/repairs, H2 showpiece-animation R&D and H3 mini-game/interactive-demo R&D before I cleanup.
6. Required sourced research, working browser prototypes and owner choice before any R&D idea becomes production scope.
7. Made owner identity, branch naming, no coauthor/attribution, PR format, architecture-matched snapshots and deployment evidence explicit.

## Historical appendix: retired v2 contracts

The following original detailed contracts are retained for traceability. **They are superseded by sections 1 to 8 above and are not production acceptance criteria or unfinished tasks.** Restoring any retired concept requires a new owner choice and separately scoped integration. Shared accessibility/performance principles remain active only as stated in the active sections.

<details>
<summary>Superseded hero, floating navigation, Honeycomb and glass-control contracts</summary>

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

</details>
