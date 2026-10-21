// The Steam Deck on-screen keyboard: a black matrix of square keys with dot-matrix letters.
import { clsList } from "../steam/classes";
import { join, paint } from "./selectors";

/** Dot grid behind the text buffer, like the dot meters in Quick Access. */
const dots = (color: string) => `radial-gradient(circle, ${color} 1.4px, transparent 1.8px) 0 0 / 6px 6px repeat`;

/** Selectors for a Steam class: the Decky class map when the Deck publishes it, plus the hashed
    CSS-module form other pads and SteamOS use (`virtualkeyboard_KeyboardKey_2KhPX`). The hash is
    rewritten on every Steam update, so match the readable name and its `_` delimiter and let the
    hash be whatever the update made it. */
const of = (name: string, ...siblings: string[]): string[] => [
  ...clsList(name, ...siblings).filter((c) => c !== ".vd-missing"),
  `[class~="${name}"]`,
  `[class*="${name}_"]`,
];

/** Only the class map, with no readable-name fallback. For names so generic that matching
    them literally would catch unrelated elements elsewhere in the interface. */
const mapped = (name: string, ...siblings: string[]): string[] =>
  clsList(name, ...siblings).filter((c) => c !== ".vd-missing");

/** A rule, or nothing when Steam has not published the classes it needs. */
const rule = (selectors: string[], body: string): string =>
  selectors.length ? `${join(selectors)} { ${body} }` : "";

/** The letter of a key: Steam draws it as a bare span, without a class of its own. */
const LABEL = " span:not([class])";

/** Every selector of the first list followed by every selector of the second. */
const pairs = (list: string[], others: string[]): string[] =>
  list.flatMap((a) => others.map((b) => `${a} ${b}`));

/**
 * Steam's keyboard themes paint themselves with custom properties instead of with
 * backgrounds, and every theme declares its own set of them on the keyboard element.
 * Remapping the whole set here overrides all of the themes at once, so the keyboard comes
 * out in the Void Deck colours whichever theme Steam has selected.
 */
const KEY_COLORS: Record<string, string> = {
  "--background-color": "var(--vd-bg)",
  "--foreground-color": "var(--vd-ink)",
  "--background-scale": "1",
  "--key-color": "var(--vd-ink)",
  "--key-background-color": "transparent",
  "--key-focused-color": "var(--vd-on-ink)",
  "--key-focused-background-color": "var(--vd-ink)",
  "--key-touched-color": "var(--vd-on-ink)",
  "--key-touched-background-color": "var(--vd-ink)",
  "--key-emoji-color": "var(--vd-ink)",
  "--key-emoji-background-color": "transparent",
  "--key-emoji-focused-color": "var(--vd-on-ink)",
  "--key-emoji-focused-background-color": "var(--vd-ink)",
  "--key-emoji-category-background-color": "transparent",
  "--key-emoji-category-highlight-background-color": "var(--vd-line-strong)",
  "--key-emoji-row-background-color": "transparent",
  "--key-spacebar-color": "var(--vd-ink)",
  "--key-spacebar-background-color": "transparent",
  "--key-caps-color": "var(--vd-ink)",
  "--key-caps-background-color": "transparent",
  "--key-shift-color": "var(--vd-ink)",
  "--key-shift-background-color": "transparent",
  "--key-shift-label-color": "var(--vd-ink-muted)",
  "--key-focused-shift-label-color": "var(--vd-on-ink)",
  "--key-tab-color": "var(--vd-ink)",
  "--key-tab-background-color": "transparent",
  "--key-enter-color": "var(--vd-ink)",
  "--key-enter-background-color": "transparent",
  "--key-enter-action-button-glyph-color": "var(--vd-ink)",
  "--key-backspace-color": "var(--vd-ink)",
  "--key-backspace-background-color": "transparent",
  "--key-meta-color": "var(--vd-ink)",
  "--key-meta-background-color": "transparent",
  "--key-extendedkey-color": "var(--vd-ink)",
  "--key-extendedkey-background-color": "transparent",
  "--key-extendedkey-focused-color": "var(--vd-on-ink)",
  "--key-extendedkey-focused-background-color": "var(--vd-ink)",
  "--key-extendedkey-hover-color": "var(--vd-on-ink)",
  "--key-extendedkey-hover-background-color": "var(--vd-ink)",
  "--key-toggleon-color": "var(--vd-on-ink)",
  "--key-toggleon-background-color": "var(--vd-ink)",
  "--key-toggleoneshot-color": "var(--vd-on-ink)",
  "--key-toggleoneshot-background-color": "var(--vd-ink)",
  "--key-deadkey-background-color": "var(--vd-ink)",
  "--key-deadkeyactive-color": "var(--vd-on-ink)",
  "--key-deadkeyinactive-color": "var(--vd-ink-muted)",
  "--key-pointer-background-color": "var(--vd-ink)",
  "--key-pointer-stroke-color": "var(--vd-on-ink)",
  "--key-action-button-glyph-color": "var(--vd-ink)",
  "--key-focused-action-button-left-color": "var(--vd-on-ink)",
  "--key-focused-action-button-right-color": "var(--vd-on-ink)",
  "--key-spacer-background-color": "transparent",
  "--key-bg-glow": "transparent",
  "--key-glow-color": "transparent",
  "--key-glow-color2": "transparent",
  "--key-glow-color3": "transparent",
};

/** The custom properties, each flagged important so it beats Steam's own declaration. */
const importantVars = (map: Record<string, string>): string =>
  Object.entries(map).map(([name, value]) => `${name}: ${value} !important`).join("; ");

export function keyboardCss(): string {
  const panel = [
    // The keyboard root itself, which carries `DefaultTheme` and `virtualkeyboard_Keyboard_<hash>`.
    '[class*="Keyboard_"]',
    ...of("VirtualKeyboardContainer"),
    ...of("ModalVirtualKeyboardContainer"),
    ...of("VirtualKeyboardStandaloneContainer"),
    ...of("CombinedKeyboardContainer"),
    ...of("KeyboardContainer"),
    ...of("KeyboardPageContainer"),
    ...of("VRFloatingKeyboard"),
    ...of("VRVirtualKeyboardContents"),
  ];
  const key = of("KeyboardKey");
  // Steam declares the keyboard's colours as custom properties on the keyboard element itself
  // and paints the panel, the rows and the columns with them, so the element that declares
  // them has to be found. Its class is hashed and rewritten on every Steam update, but the
  // class map still publishes it under the readable name "Keyboard"; the wrapper that paints
  // the properties is published as "VirtualKeyboardContainer".
  // The keyboard's module publishes "KeyboardKey" as well, so the sibling narrows the name
  // down to the keyboard and leaves out the Quick Access icon that Steam also calls
  // "Keyboard".
  const root = [...of("Keyboard", "KeyboardKey"), ...of("VirtualKeyboardContainer")];
  const extended = [...of("KeyboardExtendedKey", "KeyboardKey"), '[class*="KeyboardExtendedKey_"]'];
  // A latched modifier and a one-shot modifier are the two states Steam paints in blue.
  const toggle = [
    ...of("ToggleOn", "KeyboardKey"),
    ...of("ToggleOneShot", "KeyboardKey"),
    ...of("ShiftActive", "KeyboardKey"),
  ];
  const wide = [
    ...of("KeyboardSpacebar"),
    ...of("KeyboardTabKey"),
    ...of("KeyboardCapsKey"),
    ...of("KeyboardEnter"),
    ...of("KeyboardBackspace"),
    ...of("KeyboardLeftShift"),
    ...of("KeyboardRightShift"),
    ...of("KeyboardMetaKey"),
  ];
  const action = [
    ...of("KeyboardActionButtonLeft"),
    ...of("KeyboardActionButtonRight"),
    ...of("KeyboardActionButtonCenterLeft"),
    ...of("KeyboardButton"),
    ...of("KeyboardNavKeyRight"),
  ];
  const tile = [
    ...of("KeyboardEmojiKey"),
    ...of("KeyboardSteamItemKey"),
    ...of("KeyboardImeLutKey"),
    ...of("KeyboardImeLutNav"),
  ];
  const mono = "font-family: var(--vd-font-mono) !important; font-weight: 400 !important;";
  const shifted = of("ShiftedLabel");
  // The combined keyboard names its label; the plain one leaves the letter as a bare span.
  const letter = [...paint(key, LABEL), ...paint(of("KeyboardKeyLabel"))];
  // Steam marks the key under the pointer with classes of its own, which the class map
  // publishes as "Focused" and "Touched". The names are generic, so they are only used when
  // the module also publishes "KeyboardKey", and never matched as a literal class.
  const states = [...mapped("Focused", "KeyboardKey"), ...mapped("Touched", "KeyboardKey")];
  const focus = [...paint(key, ".gpfocus"), ...paint(states)];

  return `
/* Panel: a black slab with a hairline frame, square like the matrix of keys inside it */
${rule(panel, "background-color: var(--vd-bg) !important; background-image: none !important; border: 1px solid var(--vd-line) !important; border-radius: 0 !important; box-shadow: none !important; backdrop-filter: none !important;")}

/* Steam paints the keyboard through its own custom properties rather than through backgrounds,
   and every one of its themes declares its own set of them. Remapping the whole set on the
   keyboard element overrides all of the themes at once. */
${rule(paint(root), importantVars(KEY_COLORS))}

/* Keys: black cells of a matrix — no border, no rounded keycap, the letter alone on the panel */
${rule(key, "background: transparent !important; border: 0 !important; border-radius: 0 !important; box-shadow: none !important; outline: none !important; color: var(--vd-ink) !important; padding: var(--vd-space-1) var(--vd-space-2) !important; min-width: 0 !important;")}

/* The extended keys are not keys, so they need the same cell treatment of their own */
${rule(extended, "background: transparent !important; border: 0 !important; border-radius: 0 !important; box-shadow: none !important; color: var(--vd-ink) !important;")}
${rule(paint(extended, ".gpfocus"), "background: var(--vd-ink) !important; color: var(--vd-on-ink) !important;")}

/* A latched or one-shot modifier keeps a solid cell, so the state is still readable */
${rule(paint(toggle), "background: var(--vd-ink) !important; color: var(--vd-on-ink) !important;")}
${rule(pairs(paint(toggle), ["span:not([class])"]), "color: var(--vd-on-ink) !important;")}

/* Steam draws a white glow over the key under the pointer and, in some of its themes, a border
   around it. Neither belongs in a black-and-white keyboard. */
${rule([...paint(key, "::after"), ...paint(key, "::before")], "content: none !important;")}

/* The key under the pointer inverts to solid ink, so there is always one clear spot */
${rule(focus, "background: var(--vd-ink) !important; color: var(--vd-on-ink) !important;")}

/* The clickable area inside a key must not draw anything of its own */
${rule(of("KeyboardKeyHitArea"), "background: transparent !important; border: 0 !important; box-shadow: none !important;")}

/* The letter: dot matrix, the same type as the numbers of the Home screen */
${rule(letter, "font-family: var(--vd-font-dot) !important; font-weight: 800 !important; font-size: 22px !important; line-height: 1 !important; letter-spacing: 0 !important; color: var(--vd-ink) !important;")}
${rule(pairs(focus, ["span:not([class])"]), "color: var(--vd-on-ink) !important;")}

/* The word on a modifier key reads better in small caps than in dots */
${rule(paint(wide, LABEL), `${mono} font-size: 11px !important; letter-spacing: .1em !important; text-transform: uppercase !important;`)}
${rule(pairs(paint(wide, ".gpfocus"), ["span:not([class])"]), "color: var(--vd-on-ink) !important;")}

/* The shifted symbol above a letter */
${rule(shifted, `${mono} font-size: 10px !important; line-height: 1 !important; letter-spacing: .06em !important; color: var(--vd-ink-muted) !important;`)}
${rule(pairs(focus, shifted), "color: var(--vd-on-ink) !important;")}

/* Dead key held down */
${rule(of("KeyboardKeyDeadKeyActive"), "background: var(--vd-ink) !important; color: var(--vd-on-ink) !important; border-color: var(--vd-ink) !important;")}
${rule(paint(of("KeyboardKeyDeadKeyActive"), LABEL), "color: var(--vd-on-ink) !important;")}

/* Text buffer: what has been typed, over a dot grid */
${rule(of("VirtualKeyboardTextBuffer"), `background: var(--vd-bg) ${dots("var(--vd-ink-faint)")} !important; border: 1px solid var(--vd-line) !important; border-radius: 0 !important; box-shadow: none !important;`)}
${rule(of("VirtualKeyboardTextBufferText"), `${mono} font-size: 14px !important; color: var(--vd-ink) !important;`)}
${rule(of("VirtualKeyboardTextBufferCursor"), "background: var(--vd-ink) !important; color: var(--vd-on-ink) !important;")}

/* Action buttons: square cells that invert on focus */
${rule(action, "background: transparent !important; border: 1px solid var(--vd-line-strong) !important; border-radius: 0 !important; box-shadow: none !important; color: var(--vd-ink) !important;")}
${rule(paint(action, ".gpfocus"), "background: var(--vd-ink) !important; border-color: var(--vd-ink) !important; color: var(--vd-on-ink) !important;")}
${rule(action, `${mono} font-size: 11px !important; letter-spacing: .1em !important; text-transform: uppercase !important;`)}
${rule(paint(action, ".gpfocus").map((s) => `${s} span`), "color: var(--vd-on-ink) !important;")}
${rule(of("ActionButtonGlyph", "KeyboardKey"), "color: var(--vd-ink) !important; fill: var(--vd-ink) !important;")}

/* The pointer that marks the key under the touchpad */
${rule(of("TouchpadPointer", "KeyboardKey"), "fill: var(--vd-ink) !important; stroke: var(--vd-on-ink) !important;")}

/* Categories: the active one is a white cell */
${rule(of("KeyboardCategoryKeyHighlight"), "background: var(--vd-ink) !important; color: var(--vd-on-ink) !important; border-radius: 0 !important;")}
${rule(of("KeyboardEmojiCategory"), "background: transparent !important; border: 1px solid var(--vd-line) !important; border-radius: 0 !important; color: var(--vd-ink) !important;")}
${rule(of("KeyboardEmojiCategoryDivider"), "background: var(--vd-line) !important;")}

/* Emoji, Steam items and IME candidates: flat cells */
${rule(tile, "background: transparent !important; border: 1px solid var(--vd-line) !important; border-radius: 0 !important; box-shadow: none !important;")}
${rule(paint(tile, ".gpfocus"), "background: var(--vd-ink) !important; border-color: var(--vd-ink) !important;")}
${rule(of("KeyboardEmojiContainer"), "background: var(--vd-bg) !important; border: 1px solid var(--vd-line) !important; border-radius: 0 !important;")}

/* Emoji header */
${rule(of("KeyboardEmojiHeader"), `${mono} font-size: 10px !important; letter-spacing: .08em !important; color: var(--vd-ink-muted) !important;`)}
${rule(of("KeyboardImeLutActionGlyph"), "color: var(--vd-ink) !important;")}

/* IME: the text being composed */
${rule(of("KeyboardImePreeditText"), `${mono} color: var(--vd-ink) !important; border-bottom: 1px dashed var(--vd-ink-muted) !important;`)}
${rule(of("KeyboardImeAuxText"), `${mono} color: var(--vd-ink-muted) !important;`)}
${rule(of("KeyboardImeUnavailable"), "color: var(--vd-ink-muted) !important;")}

/* Steam item list */
${rule(of("KeyboardSteamItems"), "background: var(--vd-bg) !important; border-top: 1px solid var(--vd-line) !important;")}

/* Theme and layout options */
${rule([...of("KeyboardThemeButtons"), ...of("KeyboardLayoutOptions"), ...of("ShowKeyboardButton")], "background: transparent !important; border: 1px solid var(--vd-line-strong) !important; border-radius: 0 !important; color: var(--vd-ink) !important;")}

/* The invisible layer that captures typing must not draw anything */
${rule(of("KeyboardCapture"), "background: transparent !important; border: 0 !important; box-shadow: none !important;")}
`;
}
