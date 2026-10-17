import { Character } from './basecharacter';
import { CHARACTERS } from '../common/characters';
import { CharacterType } from '../common/types';

// Lets TypeScript know about the globals extension.ts injects into the webview's HTML.
declare global
{
  interface Window
  {
    __marioMediaUri: string;
    __marioCharacterTypes: string[];
  }
}

const TICK_MS = 100;
const GROUND_BOTTOM = 0;
const CEILING_BOTTOM = 150;
const FIRST_SPAWN_LEFT = 40;
const SPAWN_SPACING = 50;

const stage = document.getElementById('stage') as HTMLElement;
const mediaUri = window.__marioMediaUri;

// Ignores any configured name that isn't a registered character, and falls back to Mario
// so the view is never empty.
const requestedTypes = (window.__marioCharacterTypes ?? []).filter((type) => type in CHARACTERS);
const types = requestedTypes.length > 0 ? requestedTypes : [CharacterType.Mario];

// Starts each character at a different spot so they don't spawn on top of each other.
const characters = types.map((type, index) =>
  new Character(
    mediaUri,
    CHARACTERS[type as CharacterType],
    stage,
    FIRST_SPAWN_LEFT + index * SPAWN_SPACING,
    GROUND_BOTTOM,
  ),
);

// Drives every character's simulation on a fixed interval instead of requestAnimationFrame,
// since gif playback already handles the per-frame animation on its own.
setInterval(() =>
{
  // A collapsed or hidden view reports a width of 0, and ticking then would clamp every
  // character to the left wall, so just wait until the view has a real size again.
  if (stage.clientWidth === 0)
  {
    return;
  }

  for (const character of characters)
  {
    character.tick(stage.clientWidth, CEILING_BOTTOM);
  }
}, TICK_MS);
