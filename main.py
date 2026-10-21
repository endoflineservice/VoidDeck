"""Void Deck's Python backend.

The frontend is the visible half of the plugin, but the startup movie needs
filesystem access the browser sandbox cannot offer. SteamOS keeps custom
startup movies in a deep folder inside the user's own Steam configuration, so
the plugin has to copy the bundled video there and put things back when the
feature is switched off again.

Every method answers with a plain dictionary: Decky serialises the return
value to JSON, and the frontend treats `success: false` as "show a toast"
rather than as an exception.
"""

import filecmp
import shutil
from pathlib import Path

import decky

# The plugin folder as Decky installed it. Resolving from this file keeps the
# backend independent of whatever path constants the loader exposes.
PLUGIN_DIR = Path(__file__).resolve().parent

# The movie Void Deck ships, and the place SteamOS looks for a custom one.
BUNDLED_MOVIE = PLUGIN_DIR / "assets" / "boot" / "deck_startup.webm"
MOVIES_DIR = Path.home() / ".steam" / "root" / "config" / "uioverrides" / "movies"
INSTALLED_MOVIE = MOVIES_DIR / "deck_startup.webm"

# SteamOS plays whatever sits in that folder, so a backup must not live there:
# it would be picked up as a second candidate movie. The state folder sits
# next to it instead, and records that Void Deck is the one managing the file.
STATE_DIR = Path.home() / ".steam" / "root" / "config" / "uioverrides" / "voiddeck"
MARKER = STATE_DIR / "installed"
BACKUP_MOVIE = STATE_DIR / "deck_startup.webm.bak"

# Decky installs every plugin as its own folder here. Void Deck replaces
# Steam's Home screen, and with it the entries other plugins add to Steam's
# game menu, so the frontend needs to know which plugins are installed before
# it can put those entries back.
PLUGINS_DIR = Path.home() / "homebrew" / "plugins"


def _movie_is_ours(path: Path) -> bool:
    """True when the file on disk is still the exact movie Void Deck installed.

    The user is free to drop a movie of their own into the folder, and that
    file must survive: only the plugin's own copy is ever removed.
    """
    try:
        return filecmp.cmp(path, BUNDLED_MOVIE, shallow=False)
    except OSError:
        return False


def _take_movie_back() -> bool:
    """Undo the install and give the user their own startup movie back.

    Three cases, in order of who owns the file that is there now:

    - the user replaced it with a movie of their own: it is left alone and
      only Void Deck's bookkeeping is dropped;
    - Void Deck's movie is there and a backup of the user's movie exists: the
      backup is put back;
    - Void Deck's movie is there and there is no backup: the file is removed
      and SteamOS goes back to its own boot video.

    Returns True when the user's original movie was restored.
    """
    restored = False
    if INSTALLED_MOVIE.is_file() and not _movie_is_ours(INSTALLED_MOVIE):
        if BACKUP_MOVIE.is_file():
            BACKUP_MOVIE.unlink()
    elif BACKUP_MOVIE.is_file():
        shutil.copy2(BACKUP_MOVIE, INSTALLED_MOVIE)
        BACKUP_MOVIE.unlink()
        restored = True
    elif INSTALLED_MOVIE.is_file():
        INSTALLED_MOVIE.unlink()

    if MARKER.is_file():
        MARKER.unlink()
    if STATE_DIR.is_dir() and not any(STATE_DIR.iterdir()):
        STATE_DIR.rmdir()
    return restored


class Plugin:
    async def _main(self):
        decky.logger.info("Void Deck loaded")

    async def _unload(self):
        decky.logger.info("Void Deck unloaded")

    async def list_plugins(self) -> dict:
        """List the Decky plugins installed on this Deck.

        Void Deck replaces Steam's Home screen, and with it the entries other
        plugins add to Steam's game menu. Knowing which plugins are installed
        lets Void Deck offer those entries itself.
        """
        if not PLUGINS_DIR.is_dir():
            return {"success": True, "plugins": []}

        try:
            names = sorted(entry.name for entry in PLUGINS_DIR.iterdir() if entry.is_dir())
        except OSError as error:
            decky.logger.error(f"Void Deck could not read the plugin folder: {error}")
            return {"success": False, "error": str(error)}

        return {"success": True, "plugins": names}

    async def boot_animation_status(self) -> dict:
        """Report whether the startup movie is currently installed by Void Deck."""
        return {
            "success": True,
            "installed": MARKER.is_file(),
            "moviePresent": INSTALLED_MOVIE.is_file(),
            "path": str(INSTALLED_MOVIE),
        }

    async def install_boot_animation(self) -> dict:
        """Copy the bundled startup movie into SteamOS' uioverrides folder.

        A movie that was already there belongs to the user, so it is moved
        aside first and handed back when the feature is switched off.
        """
        if not BUNDLED_MOVIE.is_file():
            message = "The bundled boot animation is missing from the plugin"
            decky.logger.error(f"Void Deck: {message}")
            return {"success": False, "error": message}

        try:
            MOVIES_DIR.mkdir(parents=True, exist_ok=True)
            STATE_DIR.mkdir(parents=True, exist_ok=True)
            if INSTALLED_MOVIE.is_file() and not BACKUP_MOVIE.is_file():
                shutil.copy2(INSTALLED_MOVIE, BACKUP_MOVIE)
            shutil.copy2(BUNDLED_MOVIE, INSTALLED_MOVIE)
            MARKER.touch()
        except OSError as error:
            decky.logger.error(f"Void Deck could not install the startup movie: {error}")
            return {"success": False, "error": str(error)}

        decky.logger.info(f"Void Deck installed the startup movie at {INSTALLED_MOVIE}")
        return {"success": True, "path": str(INSTALLED_MOVIE)}

    async def remove_boot_animation(self) -> dict:
        """Undo install_boot_animation: restore the user's movie, or remove ours.

        Without the marker file Void Deck never touched the folder, so the
        user's own startup movie is left alone.
        """
        if not MARKER.is_file():
            return {"success": True, "installed": False, "restored": False}

        try:
            restored = _take_movie_back()
        except OSError as error:
            decky.logger.error(f"Void Deck could not remove the startup movie: {error}")
            return {"success": False, "error": str(error)}

        decky.logger.info("Void Deck removed the startup movie")
        return {"success": True, "installed": False, "restored": restored}

    async def _uninstall(self):
        """Give the Deck its own startup movie back when Void Deck is removed.

        Decky calls this only on uninstall, and the movie lives outside the
        plugin folder, so without it the CtOS clip would keep playing on the
        Deck after the plugin is gone and the user's own movie would stay
        stranded in the backup file, with nothing left to restore it.
        """
        if not MARKER.is_file():
            return

        try:
            restored = _take_movie_back()
        except OSError as error:
            decky.logger.error(f"Void Deck could not restore the startup movie: {error}")
            return

        decky.logger.info("Void Deck restored the startup movie on uninstall")
        if restored:
            decky.logger.info("Void Deck put the user's own startup movie back")
