import { CharacterType } from './types';

export interface CharacterDefinition
{
  type: CharacterType;
  displayName: string;
  // Floats and hovers instead of walking on the ground, which unlocks the fly state.
  canFly: boolean;
}

// Registry of every playable character. Add a new one here, then drop matching sprite
// gifs into media/<type>/ following the naming convention documented in media/README.md.
export const CHARACTERS: Record<CharacterType, CharacterDefinition> =
{
  [CharacterType.Mario]: { type: CharacterType.Mario, displayName: 'Mario', canFly: false },
  [CharacterType.Luigi]: { type: CharacterType.Luigi, displayName: 'Luigi', canFly: false },
  [CharacterType.Lakitu]: { type: CharacterType.Lakitu, displayName: 'Lakitu', canFly: true },
};
