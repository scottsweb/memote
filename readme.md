# Memote

**Navigate Popular Streaming Sites with a Remote Control or Keyboard**

Smart spatial navigation controls for streaming platforms. Binds WASD, arrow keys, and remote-style controls for navigation:

- `W/A/S/D` or `Arrow Keys`: Four-way spatial navigation
- `J/I`: Show or hide jump keys
- `F/Enter`: Click focused link
- `Ctrl+Shift+X`: Disable the hotkeys for current tab

Set your own keys: Click the icon and choose Options, or visit the details page in the browser extension manager.

Any contributions are most welcome! 🤓👍

## Optimised Sites

Currently optimised and enabled for the following streaming sites:

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
- The extension uses a hard-coded list of link hint keys that might interfere with browser keys.

### Customization

The CSS styles for links/hints can be changed in `js/content.js`:

- Cursor styling: look for `CURSOR_ID` style definitions
- Marker styling: look for `MAP.map` function

### Future Improvements

- Site-specific CSS overrides for better UI integration
- Site-specific navigation hacks (e.g., iPlayer video element focus issues)
- Firefox extension support
- More streaming sites

### No Language Options

There are no language options or internationalization yet.
