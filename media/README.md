# Sprite Naming Convention

Sprites are grouped by the game they came from, then by character. The game folder
for each character is set in `src/common/characters.ts`, and the character folder
is named after its `CharacterType` value (see `src/common/types.ts`).
Each character needs GIFs named:

```
media/<game>/<type>/<type>-idle-front.gif
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

GIFs should be transparent and pre-cropped to a consistent canvas/anchor point
(no per-frame jitter). The webview draws every GIF 32px tall and lets the
width follow the GIF's aspect ratio (see `.character` in the webview CSS), so
sprites do not need a square canvas. Export GIFs at 1x from Piskel with a 32px
source height, so they display at native size and stay crisp.
