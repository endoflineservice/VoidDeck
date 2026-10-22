// Library and other tabbed Steam pages (GamepadTabbedPage module).
// Measurements are in Steam CSS px: 1 px here = 1.5 design px.
import { cls, clsList } from "../steam/classes";
import { join } from "./selectors";

export function libraryCss(): string {
  // The library panel is lazy-loaded, so the class map may not know its names yet.
  // The attribute selectors keep the rules working while it loads.
  const tabList = [...clsList("Tab", "TabCount").filter((c) => c !== ".vd-missing"), '[class*="Tab_"]'];
  const selectedList = [...clsList("Selected", "TabCount").filter((c) => c !== ".vd-missing"), '[class*="Selected_"]'];
  const tab = join(tabList);
  const selected = join(selectedList);
  const glyphs = cls("Glyphs", "TabRow");
  const item = cls("LibraryItemBox");
  const hot = [`${item}:hover`, `${item}.gpfocus`];
  // Side of the cut-away corner, in design px.
  const cut = 14;
  // Design focus ring (3 px padding + 3 px white) at Steam scale.
  const ring = "0 0 0 2px var(--vd-bg), 0 0 0 4px var(--vd-ink)";

  return `
/* Void first: no background gradient */
${cls("GamepadLibrary")} { background: var(--vd-bg) !important; background-image: none !important; }

/* Tabs: monospace labels, the selected one marked with an underline. A filled white
   pill left Steam's own label colour on white, so the text disappeared; the underline
   marks the tab without hiding the label underneath it. */
${tab} {
  background: transparent !important; color: var(--vd-ink-muted) !important;
  font-family: var(--vd-font-mono) !important; font-size: 10px !important; font-weight: 400 !important; letter-spacing: .08em !important;
}
${tab} * { color: var(--vd-ink-muted) !important; }
${tab}:is(${selected}) { background: transparent !important; color: var(--vd-ink) !important; box-shadow: inset 0 -2px 0 var(--vd-ink) !important; }
${tab}:is(${selected}) * { color: var(--vd-ink) !important; }
${tab}.gpfocus { box-shadow: ${ring} !important; color: var(--vd-ink) !important; }
${tab}:is(${selected}).gpfocus { box-shadow: ${ring}, inset 0 -2px 0 var(--vd-ink) !important; }
${tab}:is(${selected}).gpfocus * { color: var(--vd-ink) !important; }
${cls("TabCount")} { font-family: var(--vd-font-mono) !important; opacity: .6; }

/* L1 / R1: outlined pills instead of Steam images */
${glyphs}:has(img[src*="_l1"]) img, ${glyphs}:has(img[src*="_r1"]) img { display: none !important; }
${glyphs}:has(img[src*="_l1"])::after, ${glyphs}:has(img[src*="_r1"])::after {
  display: inline-grid; place-items: center; min-width: 27px; height: 19px; padding: 0 4px; box-sizing: border-box;
  border: 1px solid var(--vd-line-strong); border-radius: 999px;
  font: 700 9px/1 var(--vd-font-mono); color: var(--vd-ink);
}
${glyphs}:has(img[src*="_l1"])::after { content: "L1"; }
${glyphs}:has(img[src*="_r1"])::after { content: "R1"; }

/* Cover art: hard corners, no shadows or glow */
${item} { box-shadow: none !important; border-radius: 0 !important; }
${item} ${cls("Capsule", "CapsuleVisible")} { border-radius: 0 !important; overflow: hidden !important; filter: grayscale(1) !important; transition: filter 150ms ease !important; }
${join(hot)} ${cls("Capsule", "CapsuleVisible")} { filter: none !important; }
html[data-vd-bw="off"] ${item} ${cls("Capsule", "CapsuleVisible")} { filter: none !important; }

/* Focus frame: the top-right corner is cut away and the frame is drawn as five background
   strips inside the clipped box, so the border turns the corner along the cut. */
${join(hot)} {
  outline: none !important; box-shadow: none !important; position: relative !important;
  clip-path: polygon(0 0, calc(100% - ${cut}px) 0, 100% ${cut}px, 100% 100%, 0 100%) !important;
}
${join(hot, "::after")} {
  content: ""; position: absolute; inset: 0; pointer-events: none;
  background:
    linear-gradient(var(--vd-ink), var(--vd-ink)) 0 0 / 100% 1.5px no-repeat,
    linear-gradient(var(--vd-ink), var(--vd-ink)) 0 100% / 100% 1.5px no-repeat,
    linear-gradient(var(--vd-ink), var(--vd-ink)) 0 0 / 1.5px 100% no-repeat,
    linear-gradient(var(--vd-ink), var(--vd-ink)) 100% 0 / 1.5px 100% no-repeat,
    linear-gradient(to top right, transparent calc(50% - 1.5px), var(--vd-ink) calc(50% - 1.5px) 50%, transparent 50%) 100% 0 / ${cut}px ${cut}px no-repeat;
}
${cls("LibraryImageBackgroundGlow")} { display: none !important; }
`;
}
