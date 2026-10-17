# GAME HUB — Mobile Edition — Arcade Launcher

A responsive dark-arcade lobby built with plain HTML, CSS, and JavaScript. Launch local HTML games inside a fullscreen iframe player. Double-click the transparent curved top-left handle to return to the lobby.

## Run locally
1. Extract the project folder.
2. Open it in VS Code.
3. Use the **Live Server** extension and open `index.html` through Live Server.
4. Select a game card to launch it.

Opening `index.html` directly with `file://` may work in some browsers, but a local web server is recommended for reliable iframe behavior.

## Add your own games
1. Copy your game's HTML file and its asset folders into `games/` (or another folder in this project).
2. Open `app.js` and add an object to `GAME_LIST`, for example:

```js
{
  id: "my-game",
  name: "My Game",
  letter: "M",
  category: "Arcade",
  file: "games/my-game.html",
  accent: "#c8ff3d",
  description: "Arcade"
}
```

3. Save and refresh the lobby.

Paths in `file` are relative to `index.html`. Keep referenced CSS, JS, images, audio, and other assets in their original relative locations or update their paths.

## Notes
- The player is an iframe covering the browser viewport; it is not browser/OS kiosk mode.
- Double-click the top-left handle to exit. The handle is intentionally nearly invisible until hovered/focused.
- The launcher cannot override a game that independently requests browser fullscreen or traps the pointer. Games using those features should provide their own exit handling.
- A missing file may be difficult for browsers to report from an iframe, so the player shows a loading fallback after 12 seconds.
- The example games are simple demos intended to verify the launcher. Replace them with your own games when ready.


## Mobile edition notes

This version is tuned for phones and tablets:
- Two-column game cards on narrow screens with larger touch targets.
- Safe-area support for phones with notches and home indicators.
- Full-height player using dynamic viewport sizing.
- Tap the top-left corner handle twice quickly to return to the lobby on touch devices; double-click still works on desktop.
- Landscape-phone layout is compact.

### Open on your phone
For testing on the same Wi-Fi network, run the folder using VS Code Live Server and open the computer's local network address on your phone. For public access, deploy the folder to GitHub Pages or another static host. Keep the `games/` folder and all game assets together.
