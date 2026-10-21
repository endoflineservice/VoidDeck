// Which other Decky plugins are installed on this Deck.
//
// Void Deck replaces Steam's Home screen, and Steam's game menu lives there.
// Plugins such as SteamGridDB add their own entries to that menu, so those
// entries disappear together with Steam's menu. Void Deck therefore asks the
// backend which plugins are installed, and offers the entries itself.
import { call } from "@decky/api";

type PluginList = {
  success: boolean;
  error?: string;
  plugins: string[];
};

/** Names of the folders Decky installed plugins into. Empty when the read fails. */
export async function installedPlugins(): Promise<string[]> {
  try {
    const result = await call<[], PluginList>("list_plugins");
    return result.plugins ?? [];
  } catch (error) {
    console.error("[Void Deck] plugin list failed", error);
    return [];
  }
}

/**
 * True when a SteamGridDB plugin is installed.
 * The folder name follows the plugin's repository, so the match is loose on
 * purpose: "SteamGridDB", "steamgriddb" and "GridDB" all count.
 */
export function hasSteamGridDb(plugins: string[]): boolean {
  return plugins.some((name) => /grid.?db/i.test(name));
}
