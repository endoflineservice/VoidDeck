// Quick Access (···): surface panel, chamfered icon tabs, design rows,
// hard-corner toggles, and sliders as dot meters.
// Measurements are in Steam CSS px: 1 px here = 1.5 design px.
import { cls, clsAll } from "../steam/classes";

/** Dot row for sliders: 4 px dots every 7 px. */
const dotRow = (color: string) => `radial-gradient(circle, ${color} 1.6px, transparent 2px) 0 50% / 7px 8px repeat-x`;

export function quickAccessCss(): string {
  const tab = cls("Tab", "TabList");
  const selected = cls("Selected", "TabList");
  const title = cls("Title", "TabList");
  const field = cls("Field", "FieldLabel");
  const track = cls("SliderTrack", "SliderHandle");
  const toggle = cls("Toggle", "ToggleRail");
  const on = cls("On", "ToggleRail");
  const rail = cls("ToggleRail", "ToggleSwitch");
  // Repeated to override the position specificity set by Steam.
  const knob = cls("ToggleSwitch", "ToggleRail").repeat(2);

  return `
/* Panel */
${cls("QuickAccessMenu", "TabList")}, ${title} { background: var(--vd-surface) !important; box-shadow: none !important; }
${title} { font-weight: 500 !important; }
${clsAll("PanelSectionTitle")}, ${clsAll("PanelSectionTitle", " *")} {
  font-family: var(--vd-font-mono) !important; font-weight: 400 !important; font-size: 10px !important;
  letter-spacing: .08em !important; color: var(--vd-ink-muted) !important;
}

/* Tabs: chamfered squares; active tab filled */
${cls("Tabs", "TabList")} {
  width: 48px !important; min-width: 48px !important;
  background: var(--vd-surface) !important; border-right: 1px solid var(--vd-line) !important;
}
/* The list clips overflow (overflow: auto): use its full width so the focus ring fits. */
${cls("TabList", "Tabs")} { width: 48px !important; box-sizing: border-box !important; }
${tab} {
  width: 32px !important; height: 32px !important; min-height: 0 !important; margin: 8px auto !important; padding: 0 !important;
  display: grid !important; place-items: center !important; box-sizing: border-box !important;
  position: relative !important;
  border-radius: 0 !important; border: 0 !important;
  clip-path: polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%) !important;
  background: transparent !important; color: var(--vd-ink-muted) !important;
  --vd-cut: 10px; --vd-frame: var(--vd-line-strong);
}
${tab} svg { width: 16px !important; height: 16px !important; }
${tab}${selected} { background: var(--vd-ink) !important; color: var(--vd-on-ink) !important; --vd-frame: var(--vd-ink); }
${tab}.gpfocus { --vd-frame: var(--vd-ink); }
${tab}${selected}.gpfocus { --vd-frame: var(--vd-on-ink); }
/* Frame strips: four edges plus a diagonal that turns the chamfered corner
   (clip-path hides borders and box-shadow, so the outline is painted inside). */
${tab}::after, ${rail}::after {
  content: ""; position: absolute; inset: 0; pointer-events: none;
  background:
    linear-gradient(var(--vd-frame), var(--vd-frame)) 0 0 / 100% 1.5px no-repeat,
    linear-gradient(var(--vd-frame), var(--vd-frame)) 0 100% / 100% 1.5px no-repeat,
    linear-gradient(var(--vd-frame), var(--vd-frame)) 0 0 / 1.5px 100% no-repeat,
    linear-gradient(var(--vd-frame), var(--vd-frame)) 100% 0 / 1.5px 100% no-repeat,
    linear-gradient(to top right, transparent calc(50% - .75px), var(--vd-frame) calc(50% - .75px) calc(50% + .75px), transparent calc(50% + .75px)) 100% 0 / var(--vd-cut) var(--vd-cut) no-repeat;
}

/* Rows: focus raises the row and marks the left edge */
${field}.gpfocus, ${field}.gpfocuswithin { background: var(--vd-surface-raised) !important; box-shadow: inset 2px 0 0 var(--vd-ink) !important; }

/* Sliders (brightness, volume…) as dot meters */
${track} { height: 8px !important; border-radius: 0 !important; background: ${dotRow("var(--vd-ink-faint)")} !important; }
${track}::before { height: 8px !important; border-radius: 0 !important; background: ${dotRow("var(--vd-ink)")} !important; }
${cls("SliderHandle", "SliderTrack")} { opacity: 0 !important; }

/* Toggles: chamfered switch; on = ink fill. The rail is pinned to 40x22 so the
   8px cut stays clear of the knob at full travel (left 4 + translate 16 + 14). */
${rail} {
  position: relative !important; box-sizing: border-box !important;
  width: 40px !important; height: 22px !important;
  background: transparent !important; border: 0 !important; border-radius: 0 !important;
  clip-path: polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 0 100%) !important;
  --vd-cut: 8px; --vd-frame: var(--vd-line-strong);
}
${rail}::before { display: none !important; }
${toggle}${on} ${rail} { background: var(--vd-ink) !important; --vd-frame: var(--vd-ink); }
${knob} {
  width: 14px !important; height: 14px !important; top: 4px !important; left: 4px !important; right: auto !important;
  border-radius: 0 !important;
  background: var(--vd-ink-muted) !important; box-shadow: none !important; transition: transform 150ms ease !important;
}
${toggle}${on} ${knob} { transform: translateX(16px) !important; background: var(--vd-on-ink) !important; }
`;
}
