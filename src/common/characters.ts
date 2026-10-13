import { CharacterType } from './types';

export interface CharacterDefinition
{
  type: CharacterType;
  displayName: string;
  // Folder under media/ holding this character's sprites, named after the game they came from.
  game: string;
  // Floats and hovers instead of walking on the ground, which unlocks the fly state.
  canFly: boolean;
}

// Registry of every playable character. Add a new one here, then drop matching sprite
// gifs into media/<game>/<type>/ following the naming convention documented in media/README.md.
export const CHARACTERS: Record<CharacterType, CharacterDefinition> =
{
  [CharacterType.Mario]: { type: CharacterType.Mario, displayName: 'Mario', game: 'marioluigi-ss', canFly: false },
  [CharacterType.Luigi]: { type: CharacterType.Luigi, displayName: 'Luigi', game: 'marioluigi-ss', canFly: false },
  [CharacterType.Lakitu]: { type: CharacterType.Lakitu, displayName: 'Lakitu', game: 'marioluigi-ss', canFly: true },
};
