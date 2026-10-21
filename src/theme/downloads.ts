// Why: Steam's downloads screens ship a blue-on-grey palette of their own — a
// radial #3D4450→#23262E page gradient, #1a9fff progress fills, #59bf40 green
// hover states and a #0056D6→#1A9FFF button gradient. Void Deck is a flat
// monochrome system, so every one of those has to be re-asserted here or the
// downloads screens read as unthemed next to the rest of the client.
import { clsList } from "../steam/classes";
import { join } from "./selectors";

/**
 * Resolves a Steam class name to its hashed CSS-module class.
 *
 * Sibling names pin the lookup to a single CSS module, because Steam publishes
 * generic names such as `ProgressBar`, `Name` or `Icon` in dozens of modules.
 */
const of = (name: string, ...siblings: string[]): string[] =>
  clsList(name, ...siblings).filter((c) => c !== ".vd-missing");

/** Emits a rule only when at least one selector resolved. */
const rule = (list: string[] | string, body: string): string => {
  const selectors = typeof list === "string" ? [list] : list;
  return selectors.length > 0 ? `${join(selectors)} { ${body} }` : "";
};

/** Cross product of two selector lists, for parent/child rules. */
const within = (parent: string[] | string, child: string[] | string): string[] => {
  const parents = typeof parent === "string" ? [parent] : parent;
  const children = typeof child === "string" ? [child] : child;
  return parents.flatMap((p) => children.map((c) => `${p} ${c}`));
};

const MONO = "font-family: var(--vd-font-mono) !important; font-size: 9px !important; letter-spacing: .12em !important; text-transform: uppercase !important; color: var(--vd-ink-muted) !important;";
const DOT = "font-family: var(--vd-font-dot) !important; color: var(--vd-ink) !important;";

export function downloadsCss(): string {
  // --- The downloads page itself (Steam's own client route) ---
  const page = of("DownloadsPage");
  const section = of("Section", "DownloadsPage");
  const sectionTitle = of("SectionTitle", "DownloadsPage");
  const titleAndCount = of("TitleAndCount", "DownloadsPage");
  const count = of("Count", "DownloadsPage");
  const divider = of("Rule", "DownloadsPage");
  const sectionDivider = of("SectionDivider", "DownloadsPage");
  const sectionList = of("SectionList", "DownloadsPage");
  const itemList = of("ItemList", "DownloadsPage");
  const itemWrapper = of("ItemListWrapper", "DownloadsPage");
  const scrollWrapper = of("ItemListScrollWrapper", "DownloadsPage");
  const jumpBar = of("SectionJumpBar", "DownloadsPage");
  const collapsible = of("Collapsible", "DownloadsPage");
  const topBar = of("TopBar", "DownloadsPage");
  const topSection = of("TopSection", "DownloadsPage");
  const topInner = of("TopSectionInner", "DownloadsPage");

  // --- Rows ---
  const item = of("SectionItem", "DownloadsPage");
  const itemContent = of("SectionItemContent", "DownloadsPage");
  const itemCenter = of("SectionItemCenter", "DownloadsPage");
  const itemStatus = of("SectionItemStatus", "DownloadsPage");
  const itemStatusLine = of("SectionItemStatusLine", "DownloadsPage");
  const hoverRing = of("HoverRing", "DownloadsPage");
  const dropOption = of("DropOption", "DownloadsPage");
  const active = of("Active", "DownloadsPage");
  const dragging = of("Dragging", "DownloadsPage");
  const name = of("Name", "DownloadsPage");
  const contentType = of("ContentType", "DownloadsPage");
  const state = of("State", "DownloadsPage");
  const error = of("Error", "DownloadsPage");
  const startTime = of("StartTime", "DownloadsPage");
  const timeLeft = of("DownloadTimeRemaining", "DownloadsPage");
  const dragHandle = of("DragHandle", "DownloadsPage");
  const gameIcon = of("DownloadGameIcon", "DownloadsPage");
  const itemName = of("DownloadItemName", "DownloadsPage");
  const rightColumn = of("ActiveItemRightColumn", "DownloadsPage");
  const activeItem = of("DownloadSectionActiveItem", "DownloadsPage");

  // --- Progress ---
  const progressBar = of("ProgressBar", "DownloadsPage");
  const network = of("Network", "DownloadsPage");
  const disk = of("Disk", "DownloadsPage");
  const notActive = of("NotActive", "DownloadsPage");
  const progressDetails = of("ProgressDetails", "DownloadsPage");
  const progressRow = of("ProgressPercentageAndBar", "DownloadsPage");
  const value = of("Value", "DownloadsPage");
  const denominator = of("Denominator", "DownloadsPage");
  const inProgress = of("InProgress", "DownloadsPage");
  const label = of("Label", "DownloadsPage");
  const labelRow = of("LabelRow", "DownloadsPage");

  // --- Buttons ---
  const button = of("Button", "DownloadsPage");
  const buttonText = of("ButtonText", "DownloadsPage");
  const buttons = of("Buttons", "DownloadsPage");
  const playButton = of("PlayButton", "DownloadsPage");
  const pauseResume = of("PauseResumeButton", "DownloadsPage");
  const removeAll = of("RemoveAllButton", "DownloadsPage");
  const removeQueue = of("RemoveFromQueue", "DownloadsPage");
  const settingsButton = of("SettingsButton", "DownloadsPage");
  const toggleButton = of("ToggleButton", "DownloadsPage");

  // --- Remote client selector (the blue gradient dropdown) ---
  const selector = of("RemoteClientDownloadsSelector", "DownloadsPage");
  const dropDown = of("RemoteClientDropDownContainer", "DownloadsPage");
  const dropArrow = of("RemoteClientDropDownArrow", "DownloadsPage");
  const mgmtBackground = of("RemoteClientManagementBackground", "DownloadsPage");
  const mgmtRow = of("RemoteClientManagementRow", "DownloadsPage");
  const mgmtName = of("ManagingRemoteClientName", "DownloadsPage");

  // --- Empty states and throttle readouts ---
  const empty = of("Empty", "DownloadsPage");
  const emptyQueue = of("EmptyQueue", "DownloadsPage");
  const emptyTransfers = of("EmptyTransfers", "DownloadsPage");
  const throttle = of("Throttle", "DownloadsPage");
  const throttleValue = of("ThrottleValue", "DownloadsPage");
  const noThrottle = of("NoThrottleLink", "DownloadsPage");
  const launchOnComplete = of("LaunchOnCompletion", "DownloadsPage");
  const autoUpdate = of("AutoUpdate", "DownloadsPage");

  // --- The downloads dialog ---
  const dialog = of("Dialog", "Downloads");
  const dialogMain = of("MainContent", "Downloads");
  const dialogHeader = of("Header", "Downloads");
  const dialogDescription = of("Description", "Downloads");
  const dialogItem = of("DownloadItem", "Downloads");
  const dialogDetails = of("Details", "Downloads");
  const dialogFooter = of("Footer", "Downloads");

  // --- The Game Mode bottom bar widget ---
  const barContent = of("DownloadStatusContent", "DownloadStatusContent");
  const barStatus = of("Status", "DownloadStatusContent");
  const barQueue = of("Queue", "DownloadStatusContent");
  const barIcon = of("Icon", "DownloadStatusContent");
  const barStatusLine = of("StatusLine", "DownloadStatusContent");
  const barPercentage = of("Percentage", "DownloadStatusContent");
  const barProgress = of("ProgressBar", "DownloadStatusContent");
  const barProgressWrap = of("ProgressBarWrapper", "DownloadStatusContent");

  // --- The Deck download status screen ---
  const screenContainer = of("DownloadStatusContainer", "DownloadStatusContainer");
  const screenTitle = of("Title", "DownloadStatusContainer");
  const screenName = of("Name", "DownloadStatusContainer");
  const screenTime = of("TimeRemaining", "DownloadStatusContainer");
  const screenDetails = of("Details", "DownloadStatusContainer");
  const screenProgress = of("Progress", "DownloadStatusContainer");
  const screenCount = of("RemainingCount", "DownloadStatusContainer");
  const screenStatus = of("Status", "DownloadStatusContainer");
  const screenIcon = of("Icon", "DownloadStatusContainer");

  // --- The library grid download chip ---
  const chip = of("DownloadStatus", "DownloadContainer");
  const chipTitle = of("DownloadStatusTitle", "DownloadContainer");
  const chipDetails = of("DownloadStatusDetails", "DownloadContainer");
  const chipPause = of("DownloadPauseButton", "DownloadContainer");

  // --- The older desktop downloads panel (bandwidth limiter lives here) ---
  const oldProgress = of("DownloadProgress", "DownloadBody");
  const oldProgressBar = of("DownloadProgressBar", "DownloadBody");
  const oldDash = of("DownloadDash", "DownloadBody");
  const oldInfo = of("DownloadInfo", "DownloadBody");
  const oldComplete = of("DownloadCompleteText", "DownloadBody");
  const oldPaused = of("DownloadPaused", "DownloadBody");
  const oldStarted = of("DownloadStartedCtn", "DownloadBody");
  const oldHeaderBar = of("HeaderDownloadProgressBar", "DownloadBody");
  const oldHeaderTrack = of("HeaderDownloadProgressBarBackground", "DownloadBody");
  const oldBytes = of("BytesDownloaded", "DownloadBody");
  const oldByteProgress = of("ByteProgress", "DownloadBody");
  const lastPlayed = of("LastGamePlayed", "DownloadBody");
  const exception = of("ExceptionButton", "DownloadBody");
  const detailsProgress = of("DetailsProgressBar", "DownloadBody");
  const bandwidthLimit = of("BandwidthLimit", "DownloadBody");
  const bandwidthField = of("BandwidthInputField", "DownloadBody");
  const bandwidthWrap = of("BandwidthInputWrapper", "DownloadBody");
  const sliderTrack = of("SliderTrack", "DownloadBody");

  return `
/* ---- Steam downloads: flat monochrome rebuild ---- */

${rule(page, "background: var(--vd-bg) !important; background-image: none !important; color: var(--vd-ink) !important;")}
${rule(topBar, "background: var(--vd-bg) !important; border-bottom: 1px solid var(--vd-line) !important;")}
${rule([...topSection, ...topInner, ...section, ...sectionList, ...itemList, ...itemWrapper, ...scrollWrapper, ...selector, ...jumpBar], "background: transparent !important; background-image: none !important; border: 0 !important;")}
${rule(sectionTitle, MONO)}
${rule(titleAndCount, "display: flex !important; align-items: baseline !important; gap: 8px !important;")}
${rule(count, DOT)}
${rule([...divider, ...sectionDivider], "background: var(--vd-line) !important; height: 1px !important; border: 0 !important;")}
${rule(collapsible, "color: var(--vd-ink-muted) !important;")}

/* rows */
${rule(item, "background: transparent !important; border-radius: 0 !important; border-bottom: 1px solid var(--vd-line) !important;")}
${rule(join(item, ":hover"), "background: var(--vd-surface) !important;")}
${rule(within(active, item), "background: var(--vd-surface-raised) !important; box-shadow: inset 2px 0 0 var(--vd-ink) !important;")}
${rule(within(dragging, item), "background: var(--vd-surface-raised) !important;")}
${rule([...itemContent, ...itemCenter, ...rightColumn, ...activeItem], "background: transparent !important;")}
${rule(hoverRing, "border-color: var(--vd-line) !important;")}
${rule(within(hoverRing, dropOption), "border-style: solid !important; border-color: var(--vd-ink) !important;")}
${rule(name, "font-family: var(--vd-font-sans) !important; font-weight: 500 !important; color: var(--vd-ink) !important;")}
${rule(contentType, "color: var(--vd-ink-muted) !important;")}
${rule(itemStatus, MONO)}
${rule(itemStatusLine, MONO)}
${rule(within(itemStatus, state), "color: var(--vd-ink-muted) !important;")}
${rule(within(itemStatus, error), "color: var(--vd-ink) !important;")}
${rule([...startTime, ...timeLeft], MONO)}
${rule(dragHandle, "color: var(--vd-ink-muted) !important;")}
${rule(gameIcon, "border: 0 !important; box-shadow: none !important;")}
${rule(itemName, "font-family: var(--vd-font-sans) !important; color: var(--vd-ink) !important;")}

/* progress */
${rule(progressBar, "background: var(--vd-line) !important; border-radius: 0 !important; height: 3px !important;")}
${rule(within(progressBar, ["div"]), "background: var(--vd-ink) !important;")}
${rule(within(within(progressBar, network), ["div"]), "background: rgba(255,255,255,.45) !important;")}
${rule(within(within(progressBar, disk), ["div"]), "background: var(--vd-ink) !important;")}
${rule(within(within(progressBar, notActive), ["div"]), "background: var(--vd-line-strong) !important;")}
${rule(progressDetails, MONO)}
${rule(progressRow, "background: transparent !important;")}
${rule([...value, ...denominator], DOT)}
${rule(within(value, inProgress), "color: var(--vd-ink) !important;")}
${rule([...label, ...labelRow], MONO)}

/* buttons */
${rule(button, "background: var(--vd-surface-raised) !important; background-image: none !important; border: 1px solid var(--vd-line) !important; border-radius: 0 !important; box-shadow: none !important; color: var(--vd-ink) !important;")}
${rule(join(button, ":hover"), "background: var(--vd-line) !important;")}
${rule(join(button, ".gpfocus"), "background: var(--vd-ink) !important; color: var(--vd-on-ink) !important;")}
${rule(within(join(button, ".gpfocus"), ["svg"]), "color: var(--vd-on-ink) !important; fill: currentColor !important;")}
${rule(buttons, "background: transparent !important;")}
${rule(buttonText, MONO)}
${rule(playButton, "background: var(--vd-surface-raised) !important; background-image: none !important; border: 1px solid var(--vd-line) !important; border-radius: 0 !important;")}
${rule(join(playButton, ".gpfocus"), "background: var(--vd-ink) !important; color: var(--vd-on-ink) !important;")}
${rule(join(playButton, "::after"), "content: none !important;")}
${rule([...pauseResume, ...removeAll, ...removeQueue, ...settingsButton, ...toggleButton], "background: transparent !important; border: 0 !important; color: var(--vd-ink-muted) !important;")}
${rule(join([...pauseResume, ...removeAll, ...removeQueue, ...settingsButton, ...toggleButton], ":hover"), "color: var(--vd-ink) !important;")}

/* remote client dropdown */
${rule(dropDown, "background: var(--vd-surface-raised) !important; background-image: none !important; border: 1px solid var(--vd-line) !important; border-radius: 0 !important; color: var(--vd-ink) !important;")}
${rule(join(dropDown, ":hover"), "background: var(--vd-line) !important;")}
${rule(join(dropDown, "::after"), "content: none !important;")}
${rule(dropArrow, "filter: grayscale(1) brightness(3) !important;")}
${rule(mgmtBackground, "background: var(--vd-bg) !important; border: 1px solid var(--vd-line) !important; border-radius: 0 !important;")}
${rule(mgmtRow, "background: transparent !important;")}
${rule(mgmtName, MONO)}

/* empty states + throttle readouts */
${rule([...empty, ...emptyQueue, ...emptyTransfers], "color: var(--vd-ink-muted) !important; font-family: var(--vd-font-mono) !important; font-size: 10px !important; letter-spacing: .12em !important; text-transform: uppercase !important;")}
${rule(throttle, MONO)}
${rule(throttleValue, DOT)}
${rule(noThrottle, "color: var(--vd-ink-muted) !important; text-decoration: underline !important;")}
${rule([...launchOnComplete, ...autoUpdate], MONO)}

/* downloads dialog */
${rule(dialog, "background: var(--vd-surface) !important; border: 1px solid var(--vd-line) !important; border-radius: 0 !important;")}
${rule(dialogMain, "background: transparent !important;")}
${rule(dialogHeader, "font-family: var(--vd-font-mono) !important; font-size: 10px !important; letter-spacing: .16em !important; text-transform: uppercase !important; color: var(--vd-ink) !important; border-bottom: 1px solid var(--vd-line) !important;")}
${rule(dialogDescription, "color: var(--vd-ink-muted) !important; font-size: 11px !important;")}
${rule(dialogItem, "background: transparent !important; border-bottom: 1px solid var(--vd-line) !important;")}
${rule(dialogDetails, MONO)}
${rule(dialogFooter, "border-top: 1px solid var(--vd-line) !important; background: transparent !important;")}

/* Game Mode bottom bar widget */
${rule(barContent, "color: var(--vd-ink) !important;")}
${rule([...barStatus, ...barQueue, ...barStatusLine], MONO)}
${rule(barIcon, "color: var(--vd-ink-muted) !important;")}
${rule(barPercentage, DOT)}
${rule(barProgressWrap, "--color-progress-bar-foreground: var(--vd-ink) !important; --color-progress-bar-background: var(--vd-bg) !important;")}
${rule(barProgress, "background: var(--vd-line) !important; border-radius: 0 !important;")}

/* Deck download status screen */
${rule(screenContainer, "background: var(--vd-bg) !important; color: var(--vd-ink) !important;")}
${rule(screenTitle, "font-family: var(--vd-font-mono) !important; font-size: 11px !important; letter-spacing: .2em !important; text-transform: uppercase !important; color: var(--vd-ink-muted) !important;")}
${rule(screenName, "font-family: var(--vd-font-sans) !important; color: var(--vd-ink) !important;")}
${rule(screenTime, DOT)}
${rule(screenDetails, "color: var(--vd-ink-muted) !important;")}
${rule(screenProgress, "background: var(--vd-line) !important; border-radius: 0 !important;")}
${rule(within(screenProgress, ["div"]), "background: var(--vd-ink) !important;")}
${rule(screenCount, DOT)}
${rule([...screenStatus, ...screenIcon], "color: var(--vd-ink-muted) !important;")}

/* library grid download chip */
${rule(chip, "background: var(--vd-surface) !important; border: 1px solid var(--vd-line) !important; border-radius: 0 !important;")}
${rule(chipTitle, "font-family: var(--vd-font-mono) !important; font-size: 9px !important; letter-spacing: .1em !important; text-transform: uppercase !important; color: var(--vd-ink) !important;")}
${rule(chipDetails, "color: var(--vd-ink-muted) !important;")}
${rule(chipPause, "background: var(--vd-surface-raised) !important; border: 1px solid var(--vd-line) !important; border-radius: 0 !important; color: var(--vd-ink) !important;")}

/* older desktop downloads panel */
${rule(oldProgress, "color: var(--vd-ink) !important;")}
${rule([...oldProgressBar, ...oldHeaderBar, ...oldHeaderTrack, ...detailsProgress], "background: var(--vd-line) !important; border-radius: 0 !important;")}
${rule(oldDash, "color: var(--vd-ink-muted) !important;")}
${rule(oldInfo, "color: var(--vd-ink) !important;")}
${rule(oldComplete, "color: var(--vd-ink) !important;")}
${rule(oldPaused, "color: var(--vd-ink-muted) !important;")}
${rule(oldStarted, "background: var(--vd-surface-raised) !important; border-radius: 0 !important;")}
${rule([...oldBytes, ...oldByteProgress], DOT)}
${rule(lastPlayed, "color: var(--vd-ink-muted) !important;")}
${rule(exception, "background: var(--vd-surface-raised) !important; color: var(--vd-ink-muted) !important; border-radius: 0 !important;")}
${rule(bandwidthLimit, MONO)}
${rule(bandwidthWrap, "background: transparent !important;")}
${rule(bandwidthField, "background: var(--vd-surface) !important; border: 1px solid var(--vd-line) !important; border-radius: 0 !important; color: var(--vd-ink) !important; font-family: var(--vd-font-mono) !important;")}
${rule(sliderTrack, "--left-track-color: var(--vd-ink) !important; background: var(--vd-line) !important;")}
`;
}
