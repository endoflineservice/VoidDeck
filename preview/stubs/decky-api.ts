// Minimal @decky/api implementation for the preview.
import type { DefinePluginFn, RoutePatch } from "@decky/api/dist/types";

export const definePlugin = (fn: DefinePluginFn) => fn;

export const toaster = { toast: (_options: unknown) => Promise.resolve() };

export const fetchNoCors = (url: string, request?: RequestInit) => fetch(url, request);

// There is no plugin backend in the preview, so a backend call fails loudly instead of
// returning a half-filled object. `never` keeps the call sites' result types.
export const call = async (...args: unknown[]): Promise<never> => {
  throw new Error(`call(${String(args[0])}) is not available in the preview`);
};

// The preview shows the Home screen when its route has a registered patch.
const patches = new Map<string, Set<RoutePatch>>();
const listeners = new Set<() => void>();

export const routerHook = {
  addPatch(path: string, patch: RoutePatch) {
    if (!patches.has(path)) patches.set(path, new Set());
    patches.get(path)!.add(patch);
    listeners.forEach((l) => l());
    return patch;
  },
  removePatch(path: string, patch: RoutePatch) {
    patches.get(path)?.delete(patch);
    listeners.forEach((l) => l());
  },
};

export function previewRoute(path: string): RoutePatch[] {
  return [...(patches.get(path) ?? [])];
}

export function onRoutesChange(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
