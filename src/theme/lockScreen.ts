// The Deck's lock screen: the PIN pad Steam shows when the console wakes up.
// It is drawn inside the Game Mode window, but its classes belong to the
// gamepad bundle, and Steam only publishes them once the lock screen has been
// shown at least once. The skin rebuilds its CSS whenever new classes turn up,
// so the pad gets dressed the first time the Deck is locked.
import { clsList } from "../steam/classes";
import { join, paint } from "./selectors";

/** A rule, or nothing when Steam has not published the classes it needs. */
const rule = (selectors: string[], body: string): string =>
  selectors.length ? `${join(selectors)} { ${body} }` : "";

/** Steam publishes the same name in many modules, so every lookup names the
    siblings that only its own module publishes. */
const of = (name: string, ...siblings: string[]): string[] =>
  clsList(name, ...siblings).filter((c) => c !== ".vd-missing");

/** The lock screen and its PIN pad: the module of the gamepad bundle. */
const pad = (name: string): string[] => of(name, "NumericButtonOption", "NumericButtonInput", "DigitIndicator");

/** The row of PIN digits Steam shows on the login screen. */
const digits = (name: string): string[] => of(name, "PinDigit", "TogglePasswordVisibilityBtn");

/** The PIN prompt Steam shows on the login screen. */
const prompt = (name: string): string[] => of(name, "PinPromptMain", "AvatarAndName", "UserAccountName");

/** The mono voice Void Deck uses for the labels Steam writes in its own face. */
const mono = "font-family: var(--vd-font-mono) !important; font-weight: 400 !important;";

/** A small caps label, the way Void Deck writes every piece of UI text. */
const label = `${mono} font-size: 11px !important; letter-spacing: .18em !important; text-transform: uppercase !important;`;

export function lockScreenCss(): string {
  // --- the lock screen itself ---
  const container = pad("Container");
  const details = pad("Details");
  const detailsGroup = pad("DetailsGroup");
  const question = pad("Prompt");
  const directions = pad("Directions");
  const indicators = pad("Indicators");
  const incorrect = pad("IncorrectPIN");
  const resetWarning = pad("ResetWarning");
  const resetDescription = pad("ResetDescription");
  const cleared = pad("PINClearedQuestion");

  // --- the PIN pad ---
  const grid = pad("NumericButtonInput");
  const key = pad("NumericButtonOption");
  const hover = pad("VR");
  const forgot = pad("ForgotPINButton");

  // --- the dots that show the code ---
  const dot = pad("DigitIndicator");
  const filled = pad("Filled");

  // --- the login screen's PIN prompt ---
  const promptBox = prompt("PinPromptCtn");
  const avatar = prompt("UserAvatarImage");
  const account = prompt("UserAccountName");
  const inputBox = prompt("PinInputCtn");
  const input = prompt("PinInput");
  const description = prompt("PinPromptDescription");
  const error = prompt("PinPromptErrorMessage");
  const links = prompt("PinPromptOtherLinks");
  const back = prompt("PinPromptBack");

  // --- the digit row of the login screen ---
  const digitRow = digits("Digits");
  const digit = digits("PinDigit");
  const eye = digits("TogglePasswordVisibilityBtn");

  // A key of the pad inverts to solid ink while it is held or pointed at.
  const pressed = [
    ...paint(key, ":hover"),
    ...paint(key, ":active"),
    ...paint(key, ".gpfocus"),
    ...paint(hover),
  ];

  return `
/* ── Lock screen: the void, without Steam's blue glow ────────────────────── */
${rule(container, `
  background-color: var(--vd-bg) !important;
  background-image: none !important;
  backdrop-filter: none !important;
`)}

/* ── The prompt above the pad ────────────────────────────────────────────── */
${rule(question, `
  ${label}
  font-size: 13px !important;
  color: var(--vd-ink) !important;
`)}
${rule(directions, `
  ${label}
  font-size: 10px !important;
  color: var(--vd-ink-muted) !important;
`)}
${rule(incorrect, `
  ${label}
  color: var(--vd-ink) !important;
  text-decoration: underline !important;
  text-underline-offset: 4px !important;
`)}

/* ── The dots that show how much of the code is in ────────────────────────── */
${rule(indicators, `
  gap: 12px !important;
`)}
${rule(dot, `
  width: 12px !important;
  height: 12px !important;
  border-radius: 0 !important;
  background: transparent !important;
  border: 1px solid var(--vd-line-strong) !important;
  box-shadow: none !important;
  transition: background 150ms ease, border-color 150ms ease !important;
`)}
${rule(filled, `
  background: var(--vd-ink) !important;
  border-color: var(--vd-ink) !important;
`)}

/* ── The pad: a matrix of square cells ───────────────────────────────────── */
${rule(grid, `
  gap: 12px !important;
  background: transparent !important;
`)}
${rule(key, `
  width: 76px !important;
  height: 64px !important;
  padding: 0 !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  background: transparent !important;
  border: 1px solid var(--vd-line) !important;
  border-radius: 0 !important;
  box-shadow: none !important;
  color: var(--vd-ink) !important;
  transition: background 100ms ease, color 100ms ease, border-color 100ms ease !important;
`)}

/* The digits are drawn by Steam in its own face; Doto writes them in dots. */
${rule([...key, ...key.map((k) => `${k} > *`)], `
  font-family: var(--vd-font-dot) !important;
  font-weight: 800 !important;
  font-size: 28px !important;
  line-height: 1 !important;
  letter-spacing: 0 !important;
`)}

/* Held, hovered or focused: the cell turns solid ink. */
${rule(pressed, `
  background: var(--vd-ink) !important;
  border-color: var(--vd-ink) !important;
  color: var(--vd-on-ink) !important;
`)}

/* ── The link that gives up on the code ──────────────────────────────────── */
${rule(forgot, `
  ${label}
  width: 100% !important;
  margin-top: 24px !important;
  padding: 10px 12px !important;
  background: transparent !important;
  border: 1px solid var(--vd-line) !important;
  border-radius: 0 !important;
  color: var(--vd-ink-muted) !important;
  box-shadow: none !important;
  transition: background 100ms ease, color 100ms ease, border-color 100ms ease !important;
`)}
${rule([...paint(forgot, ":hover"), ...paint(forgot, ":focus")], `
  background: var(--vd-ink) !important;
  border-color: var(--vd-ink) !important;
  color: var(--vd-on-ink) !important;
`)}

/* ── The confirmation Steam asks for when the code is forgotten ───────────── */
${rule(resetWarning, `
  ${label}
  color: var(--vd-ink) !important;
`)}
${rule(resetDescription, `
  ${label}
  color: var(--vd-ink-muted) !important;
`)}
${rule(cleared, `
  ${label}
  color: var(--vd-ink) !important;
`)}
${rule(details, "background: transparent !important;")}
${rule(detailsGroup, "background: transparent !important;")}

/* ── The PIN prompt of the login screen ──────────────────────────────────── */
${rule(promptBox, `
  background: transparent !important;
  box-shadow: none !important;
`)}
${rule(avatar, `
  width: 72px !important;
  height: 72px !important;
  border-radius: 0 !important;
  border: 1px solid var(--vd-line) !important;
  background: var(--vd-surface) !important;
  box-shadow: none !important;
`)}
${rule(account, `
  ${label}
  color: var(--vd-ink) !important;
`)}
${rule(description, `
  ${label}
  font-size: 10px !important;
  color: var(--vd-ink-muted) !important;
`)}
${rule(error, `
  ${label}
  color: var(--vd-ink) !important;
  text-decoration: underline !important;
  text-underline-offset: 4px !important;
`)}
${rule(links, `
  ${label}
  color: var(--vd-ink-muted) !important;
`)}
${rule(inputBox, "background: transparent !important;")}
${rule(input, `
  ${mono}
  color: var(--vd-ink) !important;
  background: var(--vd-surface) !important;
  border: 1px solid var(--vd-line) !important;
  border-radius: 0 !important;
  box-shadow: none !important;
  letter-spacing: .3em !important;
`)}
${rule(back, `
  filter: grayscale(1) contrast(1.06) !important;
  opacity: 0.8 !important;
`)}

/* ── The digits of the login screen ──────────────────────────────────────── */
${rule(digitRow, `
  gap: 10px !important;
  background: transparent !important;
`)}
${rule(digit, `
  ${mono}
  color: var(--vd-ink) !important;
  letter-spacing: .2em !important;
`)}
${rule(eye, `
  background: transparent !important;
  border: 0 !important;
  box-shadow: none !important;
  filter: grayscale(1) contrast(1.06) !important;
`)}
`;
}
