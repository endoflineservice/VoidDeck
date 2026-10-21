// Layer 4: the panel's view of the startup movie.
//
// The movie lives on disk, outside the plugin, and the backend is the only
// part of Void Deck that can see it. The panel therefore asks the backend for
// the state instead of guessing, and keeps that state in one hook so the
// switch always reflects what is really installed.
import { useCallback, useEffect, useState } from "react";
import { bootAnimationStatus, installBootAnimation, removeBootAnimation, type BootAnimationResult } from "./boot";

/** Live state of the startup movie for the Quick Access panel. */
export type BootAnimation = {
  /** `null` until the backend answers; `false` when the movie is not installed. */
  installed: boolean | null;
  /** True while an install or a removal is in flight. */
  busy: boolean;
  /** Install or remove the startup movie. The result reports what happened. */
  setInstalled: (on: boolean) => Promise<BootAnimationResult>;
};

/**
 * Track the startup movie for the Quick Access panel.
 * The backend owns the file, so the panel asks it on mount and after every
 * change instead of keeping its own guess of the state.
 */
export function useBootAnimation(): BootAnimation {
  const [installed, setInstalledState] = useState<boolean | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let alive = true;
    void bootAnimationStatus().then((status) => {
      if (alive && status) setInstalledState(status.installed);
    });
    return () => {
      alive = false;
    };
  }, []);

  const setInstalled = useCallback(async (on: boolean) => {
    setBusy(true);
    const result = on ? await installBootAnimation() : await removeBootAnimation();
    if (result.success) setInstalledState(on);
    setBusy(false);
    return result;
  }, []);

  return { installed, busy, setInstalled };
}
