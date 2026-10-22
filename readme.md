# Memote

**Navigate Popular Streaming Sites with a Remote Control or Keyboard**

Smart spatial navigation controls for streaming platforms. Binds WASD, arrow keys, and remote-style controls for navigation:

- `W/A/S/D` or `Arrow Keys`: Four-way spatial navigation
- `J/I`: Show or hide jump keys
- `F/Enter`: Click focused link
- `ESC`: Hold to go home
- `Ctrl+Shift+X`: Disable the hotkeys for current tab

You can also set your own keys: Click the extension icon and choose `Options`, or visit the details page in the browser extension manager.

If you are using a device like a Steam Machine, add your preferred browser as a non Steam game and adjust the launch options to start the browser in kiosk mode (e.g. `run org.chromium.Chromium --kiosk --force-device-scale-factor=1.25 https://example.com`). You can also set flags like the scale factor to make for a more relaxing interface.

Contributions for more sites are most welcome! 🤓

Forked from [Spatialnavigation](https://github.com/Pathduck/spatialnavigation) and [spatial-navigation](https://github.com/falsandtru/spatial-navigation)

## Optimised Sites

Currently optimised and enabled for the following streaming sites:

- [BBC iPlayer](https://www.bbc.co.uk/iplayer)
- [ITVX](https://www.itv.com)
- [Channel 4](https://www.channel4.com)
- [Channel 5](https://www.channel5.com)
- [SVT Play](https://www.svtplay.se)
- [Apple TV](https://tv.apple.com)

## Installation

### Developer Mode (Manual)

- Clone this repo, or download and unpack it to your file system.
- Open your browser's _Manage Extensions_ page.
- Enable Developer Mode.
- Click 'Load Unpacked'.
- In the file picker navigate to the extension's folder containing the `manifest.json` file and click 'Select Folder'.
- The extension is now installed.

### Known Issues

- Changing keys in options require a tab reload to take effect.
- The extension uses a hard-coded list of link hint keys that might interfere with browser keys.

### Future Improvements

- More streaming sites (U, Netflix etc)
- Translations
