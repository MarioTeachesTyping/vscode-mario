<div align='center'>

# VS Code Mario

![icon](/media/marioluigi-ss/mario/mario-walk-left.gif) ![icon](/media/marioluigi-ss/mario/mario-idle-front.gif) ![icon](/media/marioluigi-ss/mario/mario-walk-right.gif)

Mario characters hanging out in your editor to boost productivity.

</div>

## Status

Early scaffold. Character rendering is a config-selected type (`mario`,
`luigi`, `lakitu`) with three states: `stand`, `walk`, and `fly` (for
characters that float). No sprites are checked in yet, see
[`media/README.md`](media/README.md) for the naming convention the code
expects.

## Development

```bash
npm install
npm run watch
```

Then press `F5` in VS Code to launch an Extension Development Host. Mario lives in
the **VS Code Mario** section of the Explorer sidebar, which you can also reveal by running
**Mario: Show Mario** from the Command Palette.

## Credits

### Acknowledgements

- All sprites are property of their original creator.
- This repository is a fan project and is not affiliated with Nintendo.

Inspired by
[vscode-pets](https://github.com/tonybaloney/vscode-pets) and
[vscode-pokemon](https://github.com/jakobhoeg/vscode-pokemon).