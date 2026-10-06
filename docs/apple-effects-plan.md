# Apple effects plan (v1, 2026-10-06)

Bring all ten `/lab` prototypes (draft PR #32, branch `proto/lab`) to the real pages. The owner approved all ten as prototypes. This plan covers placement, build approach, guardrails, testing and rollout. **Status: draft for review (Codex), nothing implemented yet.**

**Ground rules (unchanged from the upgrade plan):**
- Keep the page copy. The only new text is the UI labels listed in [New UI text](#new-ui-text).
- No em dashes in visible text.
- Preview every change in the browser before pushing.
- Visible changes need the owner's approval before merge.
- Commits use the owner's noreply identity and carry no AI attribution.

---

## 1. Where each effect goes

| # | Prototype (lab source) | Real location | Replaces |
|---|---|---|---|
| 1 | Liquid Glass hero (`LiquidGlassCanvas.tsx`) | Home hero: a WebGL wallpaper behind the hero, with the name in a draggable glass pill | Today's white hero background and the letter-by-letter name reveal |
| 2 | iOS 26 floating tab bar + scroll edge blur (`MoreDemos.tsx` `TabBarDemo`) | Global navigation (`Navbar.tsx`) | The full-width fixed AppBar and its 48px spacer |
| 3 | Apple Watch honeycomb (`AppleDemos.tsx` `HoneycombDemo`) | Home "Technologies I work with": the default view on fine-pointer devices | The visual list (the list stays as an alternative view, see #4) |
| 4 | Liquid Glass controls (`GlassControlsDemo`) | **Segmented control:** the skills section, switching Honeycomb / List and filtering by category. **Switch:** the theme toggle in the nav. | The sun/moon icon button |
| 5 | App Store card morph (`CardMorphDemo`) | Open Source: tap a card to open a detail sheet with "View on GitHub" | Cards that link straight to GitHub |
| 6 | Dynamic Island (`DynamicIslandDemo`) | Contact form feedback (sending, sent, error) | The success/error `Alert`s (inline field errors stay) |
| 7 | Scroll-lit text (`ScrubTextDemo`) | Home About paragraph | That paragraph's `ScrollReveal` fade |
| 8 | Apple TV parallax cards (`TvCardsDemo`) | Open Source project cards (the same cards as #5) | Today's tilt, cursor glow and `MagneticElement` on those cards |
| 9 | macOS Dock (`DockDemo`) | Footer "Connect" column, on every page | The footer's text link list. The Contact page keeps its detailed text list. |
| 10 | Apple Intelligence glow (`GlowDemo`) | Contact message field on focus and while sending; Home closing "Get in touch" CTA on hover/focus | Nothing; it's additive |

---

## 2. Build approach per item

### 2.1 Liquid Glass hero (Home)

**Rendering**
- Keep the one-pass WebGL2 approach from the lab: the shader draws the wallpaper and the glass, so it refracts in Safari, Chrome and Firefox.
- No new dependency; about 6 KB of code.

**Loading and fallbacks**
- Load it with `next/dynamic` (`ssr: false`) once the browser is idle and the hero is in view.
- Until then, and wherever WebGL2 is missing, show a static CSS gradient poster in the same colours, so first paint and the fallback look the same.

**Keeping LCP and the text intact**
- The hero subtitle stays the LCP element and stays as DOM text.
- The canvas is decoration only (`aria-hidden`).
- The name stays an `<h1>` (DOM text) positioned over the glass pill; it is not drawn into the canvas.

**Name entrance**
- Replace the letter split with the glass "materialising": animate refraction strength and opacity from 0. The name text fades in with it.

**Motion**
- Reduced motion: render one frame and stop, and the glass is not draggable.
- Pause the render loop when the hero is off screen or the tab is hidden.
- Cap the device pixel ratio at 1.5.

**Input**
- Fine pointer: drag the glass, with the trailing droplet.
- Touch: `touch-action: pan-y`, so vertical swipes still scroll the page. A tap nudges the glass. No dragging on touch, to avoid fighting scroll.

**Theme and contrast**
- Light and dark use separate wallpaper intensities.
- Overline, subtitle, CTAs and the stats line sit on the wallpaper with a soft tint panel, so text keeps at least 4.5:1 contrast. This must be checked with the contrast script used for dark mode.

### 2.2 Floating tab bar (global)

**Layout**
- **Desktop:** a centred glass capsule at the top holding "HY.", the four links and the theme switch (#4). It floats 12px below the viewport top.
- **Mobile:** see decision D6 (top capsule, or a bottom tab bar like iOS).

**Active-route highlight**
- A glass capsule moves to the current route with a GSAP stretch.
- It must run with the existing page crossfade: the header keeps `view-transition-name: site-header`, and the capsule animates after navigation commits.

**Scroll behaviour**
- The bar shrinks while scrolling down and expands when scrolling back up. A ScrollTrigger direction check sets one class; CSS does the animation.

**Scroll edge effect**
- A fixed stack of 3 (mobile) or 5 (desktop) `backdrop-filter` layers under the bar, each masked to a band, replacing the bar's own background.

**Keep from today**
- skip link
- `<nav aria-label="Main">` and `aria-current`
- 44px hit areas
- `main#main` scroll margin

**Layout fallout**
- Removing the 48px spacer means page tops (hero padding, `scroll-margin-top`) must be retuned.
- Reduced transparency: a solid fill instead of glass.

### 2.3 Honeycomb skills (Home)

**Behaviour**
- Hex layout built from the content in `skills.ts`. Fisheye sizing.
- Drag with momentum; GSAP Draggable + Inertia are optional, since the lab's hand-rolled pointer code needs no extra plugins.
- The centre skill's name and category show below the grid in an `aria-live="polite"` caption.

**Keyboard**
- Each bubble is focusable (roving tabindex, arrow keys move between neighbours). Focusing a bubble pans it to the centre.

**Screen readers and touch**
- The honeycomb is a `role="group"` with labelled buttons.
- The categorised **List** view stays in the DOM as the alternative (segmented control, #4). Screen reader users and touch users get List by default; see D7.

**Reduced motion and size**
- Reduced motion: a static honeycomb (no momentum, instant pans).
- Height is reserved (fixed 440px), so CLS stays 0.

### 2.4 Glass controls

**Segmented control**
- A `role="radiogroup"`: Honeycomb | List, plus a category filter when List is active.
- The glass thumb stretches as it moves (GSAP).

**Theme switch**
- A `role="switch"` labelled "Dark mode" that replaces `ThemeToggle`.
- The knob turns to glass while pressed. Sun and moon glyphs sit in the track.
- It keeps today's logic: choosing the system's own scheme returns to following the system.
- Without JavaScript, the switch shows the scheme the system is using.

**Shared**
- Both use one shared glass token set (CSS module or MUI `sx` helpers).
- Reduced transparency: solid fill.

### 2.5 + 2.8 Open Source cards (TV cards + App Store morph)

**Grid**
- TV parallax cards: layered tilt, glare and lift, built with `gsap.quickTo`.
- Each card keeps its gradient art, name, description and tags. The Live / Coming Soon chip moves onto the card.

**Click and the sheet**
- Clicking opens a dialog sheet. The card and the sheet share a React `<ViewTransition name>` for the morph.
- The sheet holds the description, tags, the status chip and "View on GitHub", plus a Close button.
- Use MUI `Dialog` (or a custom dialog) with a focus trap, Esc to close and focus returned to the card.
- Deep link: `?project=<name>` opens the sheet (optional, see D8).

**Server Component**
- The page stays a Server Component. The cards become a small client island (replacing `OpenSourceMotion`).

**Fallbacks**
- No ViewTransition support: the sheet appears without the morph.
- Reduced motion: no tilt; the sheet crossfades.

### 2.6 Dynamic Island (Contact)

**Behaviour**
- A fixed island at the top centre, just under the floating bar. States: idle (hidden), sending, sent, error.
- One `role="status"` live region, so screen readers hear "Sending", "Message sent" or the error message.
- Inline field errors and focus on the first invalid field stay as they are (PR 4a).
- The submit button keeps `aria-disabled` while sending.

**Motion**
- Spring CSS transitions on width, height and radius.
- Reduced motion: the island crossfades instead of springing.

### 2.7 Scroll-lit text (Home About)

**Behaviour**
- GSAP SplitText by **words**, scrubbed by ScrollTrigger from 0.18 to 1 opacity.
- SplitText sets `aria-label` on the paragraph and `aria-hidden` on each word, and reverts on cleanup.
- Re-check VoiceOver with words split, since Roselli's 2026 findings were about splitting by letters.

**Reduced motion and no JavaScript**
- Reduced motion: no split, full opacity.
- Without JavaScript: full opacity. It must not hide text before hydration, so do not use `data-intro`.

### 2.9 Dock (footer)

**Behaviour**
- Email, LinkedIn, GitHub and Medium as Dock icons with cosine magnification on mouse and trackpad.
- Labels appear above, like macOS, on hover and focus.

**Touch, keyboard and accessibility**
- Touch and keyboard: no magnification, plain links.
- Each icon keeps its accessible name and a 44px hit area.
- The Contact page keeps its full text list (email address, handles and location stay visible as text).

### 2.10 Apple Intelligence glow

**CSS**
- A conic gradient with a registered `@property --angle`, a 2px masked ring plus a blurred halo.

**Where**
- Contact message field on focus and while sending, and the Home closing CTA on hover and focus.
- At most two on screen at once.

**Fallbacks**
- Reduced motion: a static ring.
- `forced-colors`: no glow.

---

## 3. Shared foundations (first PR)

**New modules**
- `src/lib/glass.ts` (or a CSS module): glass tokens (fill, blur, saturate, rim, shadow) for light and dark, reduced-transparency fallbacks, and engine detection for any Chromium-only extra.
- `src/lib/motion.ts`: add `usePrefersReducedTransparency` and `useInView`/`useIdle` helpers for lazy effects.

**Lazy loading**
- Load the heavy client pieces (WebGL hero, honeycomb) with `next/dynamic` and IntersectionObserver.

**GSAP**
- Register SplitText (and optionally Draggable + Inertia) in `src/lib/gsap.ts`, the single registration point from step 2.3.

**Lab**
- Keep `/lab` (noindex) until the last PR, then delete it.

---

## 4. Guardrails

**Accessibility**
- Lighthouse accessibility 100 on all pages (CI budget).
- Manual checks: a keyboard-only pass, and VoiceOver on the nav, honeycomb, segmented control, theme switch, card sheet and island.
- Respect `prefers-reduced-motion` and `prefers-reduced-transparency` everywhere.

**Contrast**
- Text on glass and on the wallpaper must reach at least 4.5:1, verified with the contrast script, in both schemes.

**Performance (existing Lighthouse CI budgets)**
- JS ≤ 350 KB and total ≤ 420 KB per page.
- CLS ≤ 0.1.
- Performance warns below 90.
- Home LCP must not regress by more than 10% against the current production median: 0.95 s, measured with the Step 0 method.

**Cost**
- No new runtime dependency unless justified in its PR.
- The WebGL hero and the backdrop-filter layers must be paused or cheap when off screen.

**Other**
- **SEO:** all copy stays in server-rendered HTML. The canvas and decorative layers are `aria-hidden`.
- **Browsers:** Safari 17+, Chrome, Firefox and iOS Safari, each with a fallback as listed above.

---

## 5. Testing

**Unit tests (Vitest)**
- hex layout centring
- Dock falloff
- the displacement and smooth-union helpers, as pure functions
- segmented-control state

**End-to-end tests (Playwright)**
- **Nav:** the active capsule follows the route; the bar shrinks on scroll; the skip link still comes first.
- **Theme:** the switch keeps today's theme test coverage (system, toggle, persistence, return to system) and the icon checks.
- **Skills:** switching Honeycomb and List; category filter; keyboard navigation in the honeycomb.
- **Open Source:** the sheet opens and closes, Esc works, focus returns, "View on GitHub" has the right link, and the deep link works if D8 is yes.
- **Contact:** the island announces sending, sent and error (with the route mocked), field errors still work, and a double click still sends once.
- **Footer:** the Dock links keep their names and hit areas.
- **Reduced motion and transparency:** the existing specs still pass, and nothing is hidden.

**Visual snapshots (Docker)**
- WebGL output is not guaranteed to match pixel for pixel across GPU and SwiftShader builds.
- Mask the hero canvas in `toHaveScreenshot`, and add one WebGL smoke test that checks the canvas rendered non-uniform pixels.
- Regenerate light and dark snapshots only after the owner approves each visible change.

**Performance**
- Lighthouse CI on every PR.
- A local Lighthouse run of the Home hero before and after PR C.

---

## 6. Rollout (one PR each, in order)

| PR | Scope | Visible? |
|---|---|---|
| A | Foundations: glass tokens, motion helpers, GSAP registration, lazy-load helpers | No |
| B | Floating tab bar + scroll edge + glass theme switch (global) | Yes |
| C | Liquid Glass hero (Home) | Yes |
| D | Honeycomb + segmented control, with the List view kept (Home skills) | Yes |
| E | Scroll-lit About text + glow on the Home CTA | Yes |
| F | Open Source: TV cards + App Store sheet | Yes |
| G | Contact: Dynamic Island + glow on the message field; footer Dock | Yes |
| H | Cleanup: delete `/lab` and unused components (`MagneticElement` if unused, old toggle), README, re-baseline Lighthouse | No |

**For each PR:**
1. Preview in the browser pane.
2. Screenshots, light and dark, to the owner.
3. Owner approval.
4. Snapshot update.
5. Push.
6. CI must pass.
7. Merge.

---

## 7. Decisions needed

| # | Question | Recommendation |
|---|---|---|
| D5 | The hero gets a colourful wallpaper. Is that acceptable on a site that is otherwise white or black? | Yes for the hero only, toned down in light mode. Every other section stays plain. |
| D6 | Mobile nav: top capsule, or bottom tab bar like iOS 26? | Bottom tab bar on phones (thumb reach, the iOS feel), top capsule on tablets and desktop. |
| D7 | Skills default view on touch and for screen readers? | Honeycomb on fine pointers; List on touch and for assistive tech, with the segmented control to switch. |
| D8 | Project cards: should a click open the sheet (an extra step to reach GitHub)? Add `?project=` deep links? | Yes to the sheet, with a GitHub icon shortcut on each card. Yes to deep links. |
| D9 | Theme control as a switch loses the visible "following the system" state. Is that acceptable? | Yes. A long press or the context menu could reset to system later, if wanted. |
| D10 | Footer Dock replaces the text links on every page. Keep the text links on Contact? | Yes, keep the full text list on Contact. |

---

## 8. New UI text

- "View on GitHub"
- "Close"
- "Sending…"
- "Message sent"
- "Horus will get back to you soon"
- the error line (reuses `CONTACT_SEND_ERROR`)
- "Dark mode"
- "Honeycomb"
- "List"
- "All"

The category names are reused from `skills.ts`. Nothing else in the copy changes.

---

## 9. Risks

| Risk | Mitigation |
|---|---|
| WebGL battery and heat on laptops and phones | Pause off screen or when the tab is hidden; DPR cap 1.5; single draw call; reduced-motion still frame |
| Stacked backdrop-filters cause scroll jank on low-end mobile | 3 layers on mobile; profile on a throttled Pixel; drop to one layer if INP or scroll suffers |
| Touch conflicts (hero drag, honeycomb pan) with page scroll | `touch-action: pan-y` on the hero; the honeycomb in a bounded card with List as the touch default |
| Honeycomb is harder to scan than a list | Keep List one tap away; the centre caption names the skill |
| ViewTransition morph clashing with the page crossfade | Unique names, `default="none"` on named elements, test both navigation and dialog morphs |
| SplitText and screen readers | Split by words, never letters; VoiceOver check; revert after |
| Visual snapshot flakiness from WebGL | Mask the canvas, plus a separate smoke test |
| Design drift from the minimal look | One colourful moment (the hero); everything else stays monochrome glass |
