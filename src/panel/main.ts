import { Character } from './basecharacter';
import { CHARACTERS } from '../common/characters';
import { CharacterType } from '../common/types';

// Lets TypeScript know about the globals extension.ts injects into the webview's HTML.
declare global
{
  interface Window
  {
    __marioMediaUri: string;
    __marioCharacterType: string;
  }
}

const TICK_MS = 100;
const GROUND_BOTTOM = 0;
const CEILING_BOTTOM = 150;

const stage = document.getElementById('stage') as HTMLElement;
const mediaUri = window.__marioMediaUri;
const characterType = (window.__marioCharacterType as CharacterType) ?? CharacterType.Mario;
const definition = CHARACTERS[characterType] ?? CHARACTERS[CharacterType.Mario];

const character = new Character(mediaUri, definition.type, definition.canFly, stage, 40, GROUND_BOTTOM);

// Drives the character's simulation on a fixed interval instead of requestAnimationFrame,
// since gif playback already handles the per-frame animation on its own.
setInterval(() =>
{
  character.tick(stage.clientWidth, CEILING_BOTTOM);
}, TICK_MS);
