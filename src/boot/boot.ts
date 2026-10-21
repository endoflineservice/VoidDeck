// Layer 4: the startup movie SteamOS plays when the Deck boots.
//
// The video has to live in the user's own Steam configuration, not in the
// plugin folder, and only the Python backend can write there. Everything the
// panel wants to know about the movie therefore travels through the backend
// instead of the frontend touching the filesystem itself.
import { call } from "@decky/api";

/** What the backend found on disk. */
export type BootAnimationStatus = {
  success: boolean;
  installed: boolean;
  moviePresent: boolean;
  path: string;
};

/** What an install or a removal achieved. `error` is only set on failure. */
export type BootAnimationResult = {
  success: boolean;
  error?: string;
  installed?: boolean;
  restored?: boolean;
};

/**
 * Read the current state of the startup movie.
 * A backend that cannot answer yields `null`, so the panel can keep quiet
 * instead of offering a switch that would do nothing.
 */
export async function bootAnimationStatus(): Promise<BootAnimationStatus | null> {
  try {
    return await call<[], BootAnimationStatus>("boot_animation_status");
  } catch (error) {
    console.error("[Void Deck] startup movie status failed", error);
    return null;
  }
}

/** Install the bundled startup movie, keeping any movie the user had. */
export async function installBootAnimation(): Promise<BootAnimationResult> {
  try {
    return await call<[], BootAnimationResult>("install_boot_animation");
  } catch (error) {
    console.error("[Void Deck] startup movie install failed", error);
    return { success: false, error: String(error) };
  }
}

/** Remove the startup movie and hand the user's own movie back, if any. */
export async function removeBootAnimation(): Promise<BootAnimationResult> {
  try {
    return await call<[], BootAnimationResult>("remove_boot_animation");
  } catch (error) {
    console.error("[Void Deck] startup movie removal failed", error);
    return { success: false, error: String(error) };
  }
}
