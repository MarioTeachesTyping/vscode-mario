import { CharacterDefinition } from '../common/characters';
import { CharacterState } from '../common/types';

const WALK_SPEED = 2; // Pixels moved per tick while walking or flying.
const FLY_BOB_SPEED = 1; // Pixels moved up or down per tick while flying.

// Picks how many ticks a state should last before the character re-rolls its behavior.
// At a 100ms tick rate this works out to roughly 2 to 6 seconds per state.
function randomDecisionTicks(): number
{
  return 20 + Math.floor(Math.random() * 40);
}

// A single character rendered as an <img> element whose src is swapped between
// pre-baked gifs, one per state and facing direction, instead of drawing to a canvas.
export class Character
{
  readonly el: HTMLImageElement;

  private state: CharacterState = CharacterState.Stand;
  private facingRight = true;
  private left: number;
  private bottom: number;
  private flyDirection: 1 | -1 = 1;
  private ticksInState = 0;
  private ticksUntilDecision = randomDecisionTicks();

  constructor(
    private readonly mediaUri: string,
    private readonly definition: CharacterDefinition,
    container: HTMLElement,
    spawnLeft: number,
    private readonly groundBottom: number,
  )
  {
    this.left = spawnLeft;
    this.bottom = groundBottom;

    this.el = document.createElement('img');
    this.el.className = 'character';
    container.appendChild(this.el);

    this.updateSprite();
    this.updatePosition();
  }

  // Advances the character by one simulation step. Called on a fixed interval by the caller.
  tick(stageWidth: number, ceilingBottom: number): void
  {
    this.ticksInState++;
    if (this.ticksInState >= this.ticksUntilDecision)
    {
      this.chooseNextState();
    }

    switch (this.state)
    {
      case CharacterState.Walk:
        this.left += this.facingRight ? WALK_SPEED : -WALK_SPEED;
        break;
      case CharacterState.Fly:
        // Flying characters drift horizontally like walking, but also bob up and down
        // between the ground and an invisible ceiling, flipping direction at either bound.
        this.left += this.facingRight ? WALK_SPEED : -WALK_SPEED;
        this.bottom += this.flyDirection * FLY_BOB_SPEED;
        if (this.bottom >= ceilingBottom || this.bottom <= this.groundBottom)
        {
          this.flyDirection *= -1;
        }
        break;
      case CharacterState.Stand:
      default:
        break;
    }

    this.bounceOffWalls(stageWidth);
    this.updatePosition();
  }

  // Clamps the character to the visible stage width and flips its facing direction
  // when it reaches either edge, so it never walks off screen.
  private bounceOffWalls(stageWidth: number): void
  {
    if (this.left <= 0)
    {
      this.left = 0;
      this.setFacing(true);
    }
    else if (this.left >= stageWidth - this.el.offsetWidth)
    {
      // The rendered width follows the gif's aspect ratio, and is briefly 0 while a newly
      // swapped gif is still loading, which just means the clamp is looser for a tick.
      this.left = stageWidth - this.el.offsetWidth;
      this.setFacing(false);
    }
  }

  private setFacing(right: boolean): void
  {
    if (this.facingRight === right)
    {
      return;
    }
    this.facingRight = right;
    this.updateSprite();
  }

  // Randomly rolls the next state, weighted equally, restricted to fly only when
  // this character's definition allows it.
  private chooseNextState(): void
  {
    this.ticksInState = 0;
    this.ticksUntilDecision = randomDecisionTicks();

    const options = this.definition.canFly
      ? [CharacterState.Stand, CharacterState.Walk, CharacterState.Fly]
      : [CharacterState.Stand, CharacterState.Walk];
    this.state = options[Math.floor(Math.random() * options.length)];
    this.facingRight = Math.random() > 0.5;
    this.updateSprite();
  }

  // Points the <img> at the gif matching the current game, type, state, and facing direction,
  // following the media/<game>/<type>/<type>-<state>-<direction>.gif naming convention.
  private updateSprite(): void
  {
    const direction = this.facingRight ? 'right' : 'left';
    const { game, type } = this.definition;
    // Standing uses a single front-facing idle gif, so it has no left or right variant.
    const variant = this.state === CharacterState.Stand ? 'idle-front' : `${this.state}-${direction}`;
    this.el.src = `${this.mediaUri}/${game}/${type}/${type}-${variant}.gif`;
  }

  private updatePosition(): void
  {
    this.el.style.left = `${this.left}px`;
    this.el.style.bottom = `${this.bottom}px`;
  }
}
