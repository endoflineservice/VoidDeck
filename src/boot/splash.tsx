// The startup movie, reused inside the plugin. The panel shows the very clip the
// Deck plays on the next boot, so the animation is not only seen once a year.
import { splashUrl } from "virtual:voiddeck-splash";

/** The startup movie preview, as a data URL the panel can play. */
export const startupMovieUrl = splashUrl;

/** The startup movie preview, looping silently like the real boot movie. */
export function StartupMoviePreview({ caption, width = 200 }: { caption?: string; width?: number }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, margin: "4px 0 10px" }}>
      <video
        src={startupMovieUrl}
        width={width}
        height={Math.round((width * 5) / 8)}
        muted
        loop
        autoPlay
        playsInline
        style={{ display: "block", background: "#000", border: "1px solid var(--vd-line)" }}
      />
      {caption ? (
        <span
          style={{
            fontFamily: "var(--vd-font-mono)",
            fontSize: 10,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "var(--vd-ink-muted)",
          }}
        >
          {caption}
        </span>
      ) : null}
    </div>
  );
}
