# Memote

**Navigate Popular Streaming Sites with a Remote Control or Keyboard**

Smart spatial navigation with keyboard controls for streaming platforms.

Binds WASD, arrow keys, and remote-style controls for navigation:

- `W/A/S/D` or `Arrow Keys`: Four-way spatial navigation
- `E/Shift+E`: Expand/Contract (change link targets)
- `Q`: Quit navigation/hints mode
- `Enter/F`: Click link
- `Shift+Enter/Shift+F`: Shift-click link (open new tab)
- `Ctrl+Enter/Ctrl+F`: Ctrl-click link (open new background tab)
- `Ctrl+Shift+X`: Disable the hotkeys for current tab

Set your own keys: Click the icon and choose Options, or visit the details page in the browser extension manager.

Any contributions are most welcome! 🤓👍

## Optimised Sites

Currently optimised for the following streaming platforms:

- [BBC iPlayer](https://www.bbc.co.uk/iplayer)
- [ITVX](https://www.itv.com)
- [Channel 4](https://www.channel4.com)
- [Channel 5](https://www.channel5.com)

## Screenshot

![Screenshot of extension in use](img/screenshot.jpg 'Screenshot of extension in use')

## Installation

### Developer Mode (Manual)

- Clone this repo, or download and unpack it to your file system.
- Install dependencies: `npm install`
- Open your browser's _Manage Extensions_ page.
- Enable Developer Mode.
- Click 'Load Unpacked'.
- In the file picker navigate to the extension's folder containing the `manifest.json` file and click 'Select Folder'.
- The extension is now installed.

### Known Issues

- Changing keys in options require a tab reload to take effect.
- Using `Ctrl+<link key>` in hints mode does not work. Using `Shift+<link key>` works for opening in a new tab though.
- The default `Ctrl+F` interferes with the common browser shortcut for Find-In-Page.
- The extension uses a hard-coded list of link hint keys that might interfere with browser keys.

### Customization

The CSS styles for links/hints/url display can be changed in `js/content.js`:

- Cursor styling: look for `CURSOR_ID` style definitions
- Marker styling: look for `MAP.map` function
- URL display styling: look for `displayUrl` function

### Future Improvements

- Site-specific CSS overrides for better UI integration
- Site-specific navigation hacks (e.g., iPlayer video element focus issues)
- Firefox extension support
- More streaming sites

### No Language Options

There are no language options or internationalization yet.
