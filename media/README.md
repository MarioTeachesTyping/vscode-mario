# Sprite Naming Convention

Sprites are grouped by the game they came from, then by character. The game folder
for each character is set in `src/common/characters.ts`, and the character folder
is named after its `CharacterType` value (see `src/common/types.ts`).
Each character needs GIFs named:

```
media/<game>/<type>/<type>-stand-right.gif
media/<game>/<type>/<type>-stand-left.gif
media/<game>/<type>/<type>-walk-right.gif
media/<game>/<type>/<type>-walk-left.gif
```

Characters with `canFly: true` in `src/common/characters.ts` also need:

```
media/<game>/<type>/<type>-fly-right.gif
media/<game>/<type>/<type>-fly-left.gif
```

Example for Mario: `media/marioluigi-ss/mario/mario-walk-right.gif`.

Raw source sheets can live in `media/<game>/sprite-sheets/`. The extension never loads them.

GIFs should be transparent, pre-cropped to a consistent canvas/anchor point
(no per-frame jitter), and roughly 64x64px to match `.character` in the
webview CSS.
