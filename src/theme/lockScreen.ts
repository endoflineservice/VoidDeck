// Lock screen (PIN entry): a void-black background with the PIN pad as a matrix
// of square cells and the code indicators as dot-matrix numerals.
// The lock screen runs in its own Steam window; its class names are harvested
// by windowClasses.ts the same way as the on-screen keyboard ones.
import { clsList } from "../steam/classes";
import { join, paint } from "./selectors";

/** Selectors for a Steam class: the Decky class map plus the hashed
    CSS-module form (`lockscreen_LockScreenBody_2KhPX`). The hash changes
    on every Steam update, so match the readable prefix and let the rest
    be whatever the update made it. */
const of = (name: string, ...siblings: string[]): string[] => [
  ...clsList(name, ...siblings).filter((c) => c !== ".vd-missing"),
  `[class*="lockscreen_${name}_"]`,
];

/** A rule, or nothing when no selectors matched. */
const rule = (selectors: string[], body: string): string =>
  selectors.length ? `${join(selectors)} { ${body} }` : "";

export function lockScreenCss(): string {
  // --- containers ---
  const container = of("LockScreenContainer");
  const body = of("LockScreenBody");
  const overlay = of("LockScreenOverlay");

  // --- profile / branding ---
  const avatar = of("LockScreenAvatar");
  const username = of("LockScreenUsername");
  const profileContainer = of("UserProfile");

  // --- PIN dots (filled/unfilled indicators) ---
  const dotsContainer = of("PinDotsContainer");
  const dot = of("PinDot");
  const dotActive = of("PinDotActive");
  const dotError = of("PinDotError");

  // --- PIN pad (number buttons 0–9 + backspace + enter) ---
  const pad = of("PinPadGrid");
  const button = of("PinButton");
  const buttonLabel = of("PinButtonLabel");

  // --- fallback: target the lock screen window broadly when classes aren't mapped yet ---
  const lockWindowFallback = [
    '[class*="lockscreen_"]',
    '[class*="LockScreen"]',
  ];

  const mono = "font-family: var(--vd-font-mono) !important; font-weight: 400 !important;";

  return `
/* ── Lock screen: void background ─────────────────────────────────────────── */
${rule([...container, ...body, ...overlay, ...lockWindowFallback], `
  background-color: var(--vd-bg) !important;
  background-image: none !important;
  backdrop-filter: none !important;
`)}

/* The fallback catches any lock-screen-scoped class container on a broad level. */
${rule(lockWindowFallback, "color: var(--vd-ink) !important;")}

/* ── Profile / avatar ─────────────────────────────────────────────────────── */
${rule(avatar, `
  border: 1px solid var(--vd-line) !important;
  border-radius: 0 !important;
  box-shadow: none !important;
`)}
${rule(username, `
  ${mono}
  font-size: 11px !important;
  letter-spacing: .12em !important;
  text-transform: uppercase !important;
  color: var(--vd-ink-muted) !important;
`)}
${rule(profileContainer, "background: transparent !important;")}

/* ── PIN indicator dots: dot-matrix squares instead of rounded blobs ──────── */
${rule(dotsContainer, `
  display: flex !important;
  gap: 12px !important;
  justify-content: center !important;
`)}
${rule(dot, `
  width: 16px !important;
  height: 16px !important;
  border-radius: 0 !important;
  background: transparent !important;
  border: 1px solid var(--vd-line-strong) !important;
  transition: background 150ms ease, border-color 150ms ease !important;
`)}
${rule(dotActive, `
  background: var(--vd-ink) !important;
  border-color: var(--vd-ink) !important;
`)}
${rule(dotError, `
  background: var(--vd-ink) !important;
  border-color: var(--vd-ink) !important;
  animation: none !important;
`)}

/* ── PIN pad: a 3-column matrix of square cells ──────────────────────────── */
${rule(pad, `
  background: transparent !important;
  border: 1px solid var(--vd-line) !important;
  border-radius: 0 !important;
  gap: 0 !important;
`)}
${rule(button, `
  background: transparent !important;
  border: 1px solid var(--vd-line) !important;
  border-radius: 0 !important;
  box-shadow: none !important;
  color: var(--vd-ink) !important;
  min-width: 0 !important;
  transition: background 100ms ease, color 100ms ease !important;
`)}

/* Focus: inverted cell */
${rule(paint(button, ".gpfocus"), `
  background: var(--vd-ink) !important;
  border-color: var(--vd-ink) !important;
  color: var(--vd-on-ink) !important;
  box-shadow: var(--vd-focus-ring) !important;
`)}
${rule(paint(button, ":hover"), `
  background: var(--vd-surface-raised) !important;
`)}

/* Number labels: Doto dot-matrix font */
${rule(buttonLabel, `
  font-family: var(--vd-font-dot) !important;
  font-weight: 800 !important;
  font-size: 28px !important;
  line-height: 1 !important;
  letter-spacing: 0 !important;
  color: inherit !important;
`)}

/* Focused label inherits the inverted colour */
${rule(paint(button, ".gpfocus").flatMap((s) => [`${s} span`, `${s} [class*="Label"]`]), `
  color: var(--vd-on-ink) !important;
`)}

/* ── Broad attribute fallbacks: catch future class hash changes ──────────── */
/* PIN pad buttons matched by attribute substring */
[class*="lockscreen_PinButton_"],
[class*="lockscreen_PinPadButton_"] {
  background: transparent !important;
  border: 1px solid var(--vd-line) !important;
  border-radius: 0 !important;
  box-shadow: none !important;
  color: var(--vd-ink) !important;
}
[class*="lockscreen_PinButton_"].gpfocus,
[class*="lockscreen_PinPadButton_"].gpfocus {
  background: var(--vd-ink) !important;
  border-color: var(--vd-ink) !important;
  color: var(--vd-on-ink) !important;
}
/* Number labels in the PIN pad */
[class*="lockscreen_PinButton_"] span,
[class*="lockscreen_PinButton_"] [class*="Label"],
[class*="lockscreen_PinPadButton_"] span,
[class*="lockscreen_PinPadButton_"] [class*="Label"] {
  font-family: var(--vd-font-dot) !important;
  font-weight: 800 !important;
  font-size: 28px !important;
  line-height: 1 !important;
  color: inherit !important;
}
/* PIN dots by attribute substring */
[class*="lockscreen_PinDot_"] {
  width: 16px !important;
  height: 16px !important;
  border-radius: 0 !important;
  background: transparent !important;
  border: 1px solid var(--vd-line-strong) !important;
}
[class*="lockscreen_PinDot_"][class*="Active"],
[class*="lockscreen_PinDotActive_"] {
  background: var(--vd-ink) !important;
  border-color: var(--vd-ink) !important;
}
`;
}
