# CtOS Boot Animation (Watchdogs)

The startup video bundled with Void Deck at `assets/boot/deck_startup.webm` is a derivative work of the
"Watchdogs Boot Animation" by **Akshat Singh** ([ShorterKing]), which is itself inspired by the CtOS
boot sequence from Ubisoft's *Watchdogs*.

## Source

| | |
|---|---|
| Repository | <https://github.com/ShorterKing/Watchdogs-Boot-Animation> |
| Author | Akshat Singh (`ShorterKing`) |
| License | GPL-3.0 (see the `LICENSE` file in the source repository) |
| Upstream asset | `CTOS Boot Animation Flash to run.zip` → `system/media/bootanimation.zip` |

## What was changed

The upstream asset is an **Android** boot animation: a 1080×1920 portrait, 60 fps sequence of 211 JPEG
frames described by an Android `desc.txt`. It cannot be used on SteamOS, which expects a 1280×800 WebM
movie placed in `~/.steam/root/config/uioverrides/movies/`.

The bundled file was produced by re-encoding the original frames:

* Cropped the portrait source to a 16:10 window (`crop=1080:675:0:599`) that keeps the full source width
  and centres the animation vertically.
* Scaled to 1280×800 with the Lanczos filter and padded the tail with a 1.5 s hold on the final frame.
* Decoded the JPEG sequence at 30 fps and encoded the result as VP9 video with a silent Vorbis track
  (`-crf 22`, `-b:v 0`).
* Trimmed the 8.5 s result down to 5.5 s: the trailing hold was cut away and the silent track was dropped, so
  the movie the Deck plays is the whole story arc and nothing else.

`assets/ui/deck_startup_preview.webm` is a 480×300 rendition of that same trimmed clip, embedded in the plugin
so the panel can show the movie as a preview. It reuses the same frames and adds no new artwork.

No artwork, timing, or ordering of the original frames was altered beyond the crop, the scale, the
frame-rate conversion and the trim.

## Credit

* CtOS and the Watchdogs imagery are the property of Ubisoft Entertainment. This project is an
  unofficial fan work and is not affiliated with or endorsed by Ubisoft.
* The original animation remains the copyright of its author and is redistributed here under the
  GPL-3.0 terms of the source repository, as required by that license.
