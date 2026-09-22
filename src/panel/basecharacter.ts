import { CharacterState, CharacterType } from '../common/types';

const CHARACTER_WIDTH = 64;
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
    private readonly type: CharacterType,
    private readonly canFly: boolean,
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
    else if (this.left >= stageWidth - CHARACTER_WIDTH)
    {
      this.left = stageWidth - CHARACTER_WIDTH;
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

    const options = this.canFly
      ? [CharacterState.Stand, CharacterState.Walk, CharacterState.Fly]
      : [CharacterState.Stand, CharacterState.Walk];
    this.state = options[Math.floor(Math.random() * options.length)];
    this.facingRight = Math.random() > 0.5;
    this.updateSprite();
  }

  // Points the <img> at the gif matching the current type, state, and facing direction,
  // following the media/<type>/<type>_<state>_<direction>.gif naming convention.
  private updateSprite(): void
  {
    const direction = this.facingRight ? 'right' : 'left';
    this.el.src = `${this.mediaUri}/${this.type}/${this.type}_${this.state}_${direction}.gif`;
  }

  private updatePosition(): void
  {
    this.el.style.left = `${this.left}px`;
    this.el.style.bottom = `${this.bottom}px`;
  }
}
