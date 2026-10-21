// Game details (/library/app/:id): restyled without replacing it, so the Play button preserves every
// state (install, update, queued, stop, etc.). Steam CSS pixel measurements (1px = 1.5 concept pixels).
import { clsList } from "../steam/classes";
import { join, paint } from "./selectors";

export function detailsCss(): string {
  const of = (name: string, ...siblings: string[]) => clsList(name, ...siblings);
  const play = of("PlayButton", "PlayButtonContainer");
  const container = of("PlayButtonContainer", "PlayButton");
  const selector = of("StreamingSelector", "PlayButton");
  const menuButton = of("MenuButton", "ControllerConfigButton");
  const capsule = of("TopCapsule");
  const tabRow = of("TabHeaderRowWrapper");
  const label = of("PlayBarLabel");
  const value = of("PlayBarDetailLabel");
  const section = of("AppDetailsSectionContainer");
  const post = of("PostButton");
  const hero = of("HeaderBackgroundImage");
  const statRow = of("GameStatRight", "PlayBarLabel");
  const progress = of("DetailsProgressContainer", "DetailsProgressBar");
  const progressFill = of("DetailsProgressBar", "DetailsProgressContainer");
  const tab = of("Tab", "TabTitle");
  const tabTitle = of("TabTitle", "Tab");
  const selected = of("Selected", "Tab");
  const activeTabLabel = tab.flatMap((t) => selected.flatMap((s) => tabTitle.map((title) => `${t}${s} ${title}`)));
  const mono = "font-family: var(--vd-font-mono) !important; font-weight: 400 !important; font-size: 9px !important; letter-spacing: .08em !important; color: var(--vd-ink-muted) !important;";
  // The page's tabs (Game Info, Activity, Community, Your Stuff) are drawn by Steam as white pills, and Steam
  // paints the hovered label white on that white pill, so the button all but disappears under the cursor.
  // They are looked up without the sibling filter as well, because more than one Steam panel publishes a
  // "Tab", and the readable name is what stays stable when the hash changes.
  const resolved = (list: string[]) => list.filter((selector) => selector !== ".vd-missing");
  const tabButton = [...new Set([...resolved([...tab, ...clsList("Tab")]), '[class*="Tab_"]'])];
  const tabLabel = [...new Set([...resolved([...tabTitle, ...clsList("TabTitle")]), '[class*="TabTitle_"]'])];
  // Every rule below is scoped to the details page: the Library draws its own tabs with the same names and
  // Void Deck styles those as pills.
  const detailsRoot = [...new Set([...of("AppDetailsRoot"), ...section, ...capsule])].filter(
    (selector) => selector !== ".vd-missing",
  );
  const inPage = (list: string[], suffix = "") =>
    detailsRoot.length > 0
      ? detailsRoot.flatMap((root) => list.map((selector) => `${root} ${selector}${suffix}`))
      : list.map((selector) => selector + suffix);
  // The class is repeated so the rule outranks Steam's own, more specific, hover colour.
  const inPagePaint = (list: string[], suffix = "") =>
    detailsRoot.length > 0
      ? detailsRoot.flatMap((root) => list.map((selector) => `${root} ${selector}${selector}${suffix}`))
      : paint(list, suffix);
  // Same chamfer as the library posters: the top-right corner is sliced off at 45°.
  const cut = 14;
  const notch = 10;
  const chamfer = (px: number) => `polygon(0 0, calc(100% - ${px}px) 0, 100% ${px}px, 100% 100%, 0 100%)`;
  // Frames are five background strips inside the clipped box, so the stroke turns along the cut (a
  // clip-path would otherwise cut away the border and any outer focus ring).
  const frame = (px: number, width: number, inset = 0) => `
  content: ""; position: absolute; inset: ${inset}px; pointer-events: none;
  background:
    linear-gradient(var(--vd-frame), var(--vd-frame)) 0 0 / 100% ${width}px no-repeat,
    linear-gradient(var(--vd-frame), var(--vd-frame)) 0 100% / 100% ${width}px no-repeat,
    linear-gradient(var(--vd-frame), var(--vd-frame)) 0 0 / ${width}px 100% no-repeat,
    linear-gradient(var(--vd-frame), var(--vd-frame)) 100% 0 / ${width}px 100% no-repeat,
    linear-gradient(to top right, transparent calc(50% - ${width / 2}px), var(--vd-frame) calc(50% - ${width / 2}px) 50%, transparent 50%) 100% 0 / ${px}px ${px}px no-repeat;`;

  return `
/* Void first: no blurred copy of the header behind the entire page */
${join(of("AppDetailsRoot"))} { background: var(--vd-bg) !important; }
${join(of("ImgBlurBackdrop"))} { display: none !important; }
${join(of("PlaySection"))} { background: transparent !important; }
/* The header fills the screen: image + the Play bar (80px) meet Steam's bottom bar
   (40px). Scrolling moves it up through Steam's outer scroller and reveals the tabs. */
${join(capsule)} { position: relative; height: calc(100vh - 120px) !important; }
${join([...of("HeaderBackgroundImage"), ...of("HeaderBackgroundImage").map((s) => s + " img")])} { height: 100% !important; }
${join(of("HeaderBackgroundImage"), " img")} { object-fit: cover !important; }
/* The artwork prints as a dot screen: desaturated like the library capsules, then covered by the
   same 8px lattice as the rest of the interface, so the hero reads as halftone rather than as a photo. */
${join(hero)} { filter: grayscale(1) contrast(1.06) brightness(.9) !important; }
html[data-vd-bw="off"] ${join(hero)} { filter: none !important; }
${join(hero, "::after")} {
  content: ""; position: absolute; inset: 0; pointer-events: none;
  background-image: radial-gradient(circle, var(--vd-bg) 2px, transparent 2.25px);
  background-size: 8px 8px; opacity: .55;
}
html[data-vd-bw="off"] ${join(hero, "::after")} { display: none !important; }
${join(of("ScrollContainer", "Glassy").flatMap((s) => of("Glassy", "ScrollContainer").map((g) => s + g)))} {
  background: var(--vd-bg) !important; background-image: none !important;
}
/* With the page scrolled, Steam's top bar would blur what remains underneath (the fixed Play button),
   so use a solid black background instead. */
${join(of("Header", "OverrideHeaderBackground"), "::before")} { background: var(--vd-bg) !important; backdrop-filter: none !important; }
${join(capsule, "::after")} {
  content: ""; position: absolute; left: 0; right: 0; bottom: 0; height: 55%; pointer-events: none;
  background: linear-gradient(transparent, var(--vd-bg));
}
${join([...tabRow, ...tabRow.map((s) => s + "::before"), ...tabRow.map((s) => s + "::after")])} {
  background: var(--vd-bg) !important; background-image: none !important; backdrop-filter: none !important;
}
/* The tabs lose Steam's white pill and become the same cut-corner button as the rest of the page: outlined
   at rest, solid ink under the cursor. The label is painted explicitly, because Steam's own hover colour is
   white and would otherwise vanish against the pill it came from. */
${join(inPage(tabButton))} {
  --vd-frame: var(--vd-line-strong);
  background: transparent !important; border: 0 !important; border-radius: 0 !important;
  position: relative !important; box-sizing: border-box !important; box-shadow: none !important;
  color: var(--vd-ink-muted) !important; clip-path: ${chamfer(notch)} !important;
}
${join(inPage(tabButton, "::after"))} { ${frame(notch, 1)} }
${join(inPage(tabRow, " > *"))} { background: transparent !important; border-radius: 0 !important; }
${join([...inPage(tabLabel), ...inPage(tabLabel, " *")])} { color: var(--vd-ink-muted) !important; }
${join([...inPage(activeTabLabel), ...inPage(activeTabLabel, " *")])} { color: var(--vd-ink) !important; }
${join(inPagePaint(tabButton, ":hover"))} {
  --vd-frame: var(--vd-ink); background: var(--vd-ink) !important; color: var(--vd-on-ink) !important;
}
${join(inPagePaint(tabButton, ".gpfocus"))} {
  --vd-frame: var(--vd-ink); background: var(--vd-ink) !important; color: var(--vd-on-ink) !important;
  outline: none !important;
}
${join(inPagePaint(tabButton, ":hover *"))} { color: var(--vd-on-ink) !important; }
${join(inPagePaint(tabButton, ".gpfocus *"))} { color: var(--vd-on-ink) !important; }

/* Tabs read as instrument labels: uppercase mono, with the active one underlined in dots. */
${join([...tabTitle, ...tabTitle.map((s) => s + " *")])} {
  font-family: var(--vd-font-mono) !important; font-weight: 400 !important; font-size: 9px !important;
  letter-spacing: .14em !important; text-transform: uppercase !important;
}
${join(activeTabLabel)} { color: var(--vd-ink) !important; border-bottom: 1px dotted var(--vd-ink) !important; padding-bottom: 3px !important; }
${join(tab, ".gpfocus")} { box-shadow: none !important; outline: 1px dotted var(--vd-ink) !important; outline-offset: 2px !important; }

/* Play button: a rectangle with the top-right corner cut, matching the poster frames. The clip sits on
   the container so Play and the streaming selector form one shape; the focus frame is drawn inside it. */
${join(container)} {
  --vd-frame: var(--vd-on-ink);
  background: transparent !important; border-radius: 0 !important; position: relative !important;
  clip-path: ${chamfer(cut)} !important;
}
${join(container, ":has(.gpfocus)::after")} { ${frame(cut, 2, 2)} }
${join(play)} { background: var(--vd-ink) !important; color: var(--vd-on-ink) !important; border-radius: 0 !important; gap: 8px; }
${join(play, ":only-child")} { border-radius: 0 !important; }
${join(play, " *")} { color: var(--vd-on-ink) !important; }
${join(play, " svg")} { display: none !important; }
${join(play, "::before")} {
  content: "A"; display: inline-grid; place-items: center; width: 16px; height: 16px; margin-left: 4px;
  border-radius: 50%; border: 1px solid currentColor; font: 700 8px/1 var(--vd-font-mono);
}
${join(selector)} {
  background: var(--vd-ink) !important; color: var(--vd-on-ink) !important;
  border-radius: 0 !important; border-left: 1px solid rgba(0, 0, 0, .2) !important;
}
${join(selector, " svg")} { fill: var(--vd-on-ink) !important; color: var(--vd-on-ink) !important; }
${join([...play, ...selector], ".gpfocus")} { box-shadow: none !important; outline: none !important; }

/* Controller and settings: outlined rectangles with the corner cut, inverting on hover, like the Play button.
   The class is repeated so these rules outrank Steam's own (more specific) fill on the glyph. */
${join(menuButton)} {
  --vd-frame: var(--vd-line-strong);
  background: transparent !important; border: 0 !important; border-radius: 0 !important; position: relative !important;
  box-sizing: border-box !important; color: var(--vd-ink) !important; clip-path: ${chamfer(notch)} !important;
}
${join(menuButton, "::after")} { ${frame(notch, 1)} }
${join(paint(menuButton, " svg"))} { color: var(--vd-ink) !important; fill: var(--vd-ink) !important; }
${join(paint(menuButton, " svg *"))} { color: var(--vd-ink) !important; fill: var(--vd-ink) !important; }
${join(paint(menuButton, ":hover"))} { --vd-frame: var(--vd-ink); background: var(--vd-ink) !important; color: var(--vd-on-ink) !important; }
${join(paint(menuButton, ".gpfocus"))} { --vd-frame: var(--vd-ink); background: var(--vd-ink) !important; color: var(--vd-on-ink) !important; }
${join(paint(menuButton, ":hover svg"))} { color: var(--vd-on-ink) !important; fill: var(--vd-on-ink) !important; }
${join(paint(menuButton, ":hover svg *"))} { color: var(--vd-on-ink) !important; fill: var(--vd-on-ink) !important; }
${join(paint(menuButton, ".gpfocus svg"))} { color: var(--vd-on-ink) !important; fill: var(--vd-on-ink) !important; }
${join(paint(menuButton, ".gpfocus svg *"))} { color: var(--vd-on-ink) !important; fill: var(--vd-on-ink) !important; }

/* Last session / playtime: monospaced label and dot-matrix value */
${join([...label, ...label.map((s) => s + " *")])} { ${mono} }
${join([...value, ...value.map((s) => s + " *")])} {
  font-family: var(--vd-font-dot) !important; font-weight: 800 !important; font-size: 17px !important; color: var(--vd-ink) !important;
}

/* Stats read as a spec sheet: small-caps label, dotted leader, right-aligned dot-matrix value.
   GameStatRight is the div Steam wraps around PlayBarLabel + PlayBarDetailLabel. */
${join(statRow)} { display: flex !important; align-items: baseline !important; gap: 8px !important; }
${join(statRow.map((s) => `${s} > :first-child`))} {
  display: flex !important; align-items: baseline !important; gap: 8px !important;
  flex: 0 1 auto !important; white-space: nowrap !important;
}
${join(statRow.map((s) => `${s} > :first-child::after`))} {
  content: ""; flex: 1 1 12px; min-width: 16px; align-self: center;
  border-bottom: 1px dotted var(--vd-line-strong);
}
${join(statRow.map((s) => `${s} > :last-child`))} { margin-left: auto !important; text-align: right !important; }

/* Progress reads as a segmented dot meter: a dotted track with the fill cut into 4px segments. */
${join(progress)} {
  background-color: transparent !important;
  background-image: radial-gradient(circle, var(--vd-line-strong) 1.5px, transparent 1.75px) !important;
  background-size: 8px 8px !important; background-position: 4px 50% !important; background-repeat: repeat !important;
  border-radius: 0 !important; box-shadow: none !important; overflow: hidden !important;
}
${join(progressFill)} {
  border-radius: 0 !important;
  -webkit-mask-image: repeating-linear-gradient(90deg, transparent 0 2px, #000 2px 6px, transparent 6px 8px) !important;
  mask-image: repeating-linear-gradient(90deg, transparent 0 2px, #000 2px 6px, transparent 6px 8px) !important;
}

/* Sections (friends, activity, events) on a thin-lined surface */
${join(section)} { background: transparent !important; border: 1px solid var(--vd-line) !important; border-radius: 0 !important; position: relative !important; }
${join(section, "::before")} {
  content: ""; position: absolute; top: 12px; right: 12px; width: 20px; height: 4px; pointer-events: none;
  background-image: radial-gradient(circle, var(--vd-ink-muted) 1.5px, transparent 1.75px);
  background-size: 8px 4px; background-repeat: repeat-x; background-position: 0 50%;
}
${join([...of("FriendsSectionSubHeading"), ...of("SectionHeader")])} { ${mono} }
${join([...of("PartnerEventMediumImage_Container"), ...of("PartnerEvent", "PartnerEventMediumImage_Container")])} {
  background: var(--vd-surface) !important; background-image: none !important; border-radius: 11px !important;
}
${join(of("Rule", "PartnerEvent"))} { background: var(--vd-line) !important; background-image: none !important; }
${join(of("PostTextEntryArea"))} { background: var(--vd-surface-raised) !important; border-radius: 0 !important; }
${join(post)} {
  --vd-frame: var(--vd-line-strong);
  background: transparent !important; border: 0 !important; border-radius: 0 !important; position: relative !important;
  color: var(--vd-ink) !important; box-shadow: none !important; clip-path: ${chamfer(notch)} !important;
}
${join(post, "::after")} { ${frame(notch, 1)} }
${join(post, ".gpfocus")} { --vd-frame: var(--vd-ink); box-shadow: none !important; }
`;
}
