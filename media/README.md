# Sprite Naming Convention

Each character needs a folder here named after its `CharacterType` value
(see `src/common/types.ts`), containing GIFs named:

```
media/<type>/<type>_stand_right.gif
media/<type>/<type>_stand_left.gif
media/<type>/<type>_walk_right.gif
media/<type>/<type>_walk_left.gif
```

Characters with `canFly: true` in `src/common/characters.ts` also need:

```
media/<type>/<type>_fly_right.gif
media/<type>/<type>_fly_left.gif
```

Example for Mario: `media/mario/mario_walk_right.gif`.

GIFs should be transparent, pre-cropped to a consistent canvas/anchor point
(no per-frame jitter), and roughly 64x64px to match `.character` in the
webview CSS.
