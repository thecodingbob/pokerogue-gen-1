import { Arena } from "../field/arena";
import { Type } from "./type";
import * as Utils from "../utils";
import { MoveCategory, allMoves } from "./move";
import { getPokemonNameWithAffix } from "../messages";
import Pokemon from "../field/pokemon";
import { BattlerIndex } from "../battle";
import { CommonAnim, CommonBattleAnim } from "./battle-anims";
import i18next from "i18next";
import { ArenaTagType } from "#enums/arena-tag-type";
import { Moves } from "#enums/moves";

export enum ArenaTagSide {
  BOTH,
  PLAYER,
  ENEMY
}

export abstract class ArenaTag {
  public tagType: ArenaTagType;
  public turnCount: integer;
  public sourceMove?: Moves;
  public sourceId?: integer;
  public side: ArenaTagSide;


  constructor(tagType: ArenaTagType, turnCount: integer, sourceMove: Moves | undefined, sourceId?: integer, side: ArenaTagSide = ArenaTagSide.BOTH) {
    this.tagType = tagType;
    this.turnCount = turnCount;
    this.sourceMove = sourceMove;
    this.sourceId = sourceId;
    this.side = side;
  }

  apply(arena: Arena, args: any[]): boolean {
    return true;
  }

  onAdd(arena: Arena, quiet: boolean = false): void { }

  onRemove(arena: Arena, quiet: boolean = false): void {
    if (!quiet) {
      arena.scene.queueMessage(i18next.t(`arenaTag:arenaOnRemove${this.side === ArenaTagSide.PLAYER ? "Player" : this.side === ArenaTagSide.ENEMY ? "Enemy" : ""}`, { moveName: this.getMoveName() }));
    }
  }

  onOverlap(arena: Arena): void { }

  lapse(arena: Arena): boolean {
    return this.turnCount < 1 || !!(--this.turnCount);
  }

  getMoveName(): string | null {
    return this.sourceMove
      ? allMoves[this.sourceMove].name
      : null;
  }
}

/**
 * Arena Tag class for {@link https://bulbapedia.bulbagarden.net/wiki/Mist_(move) Mist}.
 * Prevents Pokémon on the opposing side from lowering the stats of the Pokémon in the Mist.
 */
export class MistTag extends ArenaTag {
  constructor(turnCount: integer, sourceId: integer, side: ArenaTagSide) {
    super(ArenaTagType.MIST, turnCount, Moves.MIST, sourceId, side);
  }

  onAdd(arena: Arena, quiet: boolean = false): void {
    super.onAdd(arena);

    if (this.sourceId) {
      const source = arena.scene.getPokemonById(this.sourceId);

      if (!quiet && source) {
        arena.scene.queueMessage(i18next.t("arenaTag:mistOnAdd", { pokemonNameWithAffix: getPokemonNameWithAffix(source) }));
      } else if (!quiet) {
        console.warn("Failed to get source for MistTag onAdd");
      }
    }
  }

  apply(arena: Arena, args: any[]): boolean {
    (args[0] as Utils.BooleanHolder).value = true;

    arena.scene.queueMessage(i18next.t("arenaTag:mistApply"));

    return true;
  }
}

/**
 * Reduces the damage of specific move categories in the arena.
 * @extends ArenaTag
 */
export class WeakenMoveScreenTag extends ArenaTag {
  protected weakenedCategories: MoveCategory[];

  /**
   * Creates a new instance of the WeakenMoveScreenTag class.
   *
   * @param tagType - The type of the arena tag.
   * @param turnCount - The number of turns the tag is active.
   * @param sourceMove - The move that created the tag.
   * @param sourceId - The ID of the source of the tag.
   * @param side - The side (player or enemy) the tag affects.
   * @param weakenedCategories - The categories of moves that are weakened by this tag.
   */
  constructor(tagType: ArenaTagType, turnCount: integer, sourceMove: Moves, sourceId: integer, side: ArenaTagSide, weakenedCategories: MoveCategory[]) {
    super(tagType, turnCount, sourceMove, sourceId, side);

    this.weakenedCategories = weakenedCategories;
  }

  /**
   * Applies the weakening effect to the move.
   *
   * @param arena - The arena where the move is applied.
   * @param args - The arguments for the move application.
   * @param args[0] - The category of the move.
   * @param args[1] - A boolean indicating whether it is a double battle.
   * @param args[2] - An object of type `Utils.NumberHolder` that holds the damage multiplier
   *
   * @returns True if the move was weakened, otherwise false.
   */
  apply(arena: Arena, args: any[]): boolean {
    if (this.weakenedCategories.includes((args[0] as MoveCategory))) {
      (args[2] as Utils.NumberHolder).value = (args[1] as boolean) ? 2732/4096 : 0.5;
      return true;
    }
    return false;
  }
}

/**
 * Reduces the damage of physical moves.
 * Used by {@linkcode Moves.REFLECT}
 */
class ReflectTag extends WeakenMoveScreenTag {
  constructor(turnCount: integer, sourceId: integer, side: ArenaTagSide) {
    super(ArenaTagType.REFLECT, turnCount, Moves.REFLECT, sourceId, side, [MoveCategory.PHYSICAL]);
  }

  onAdd(arena: Arena, quiet: boolean = false): void {
    if (!quiet) {
      arena.scene.queueMessage(i18next.t(`arenaTag:reflectOnAdd${this.side === ArenaTagSide.PLAYER ? "Player" : this.side === ArenaTagSide.ENEMY ? "Enemy" : ""}`));
    }
  }
}

/**
 * Reduces the damage of special moves.
 * Used by {@linkcode Moves.LIGHT_SCREEN}
 */
class LightScreenTag extends WeakenMoveScreenTag {
  constructor(turnCount: integer, sourceId: integer, side: ArenaTagSide) {
    super(ArenaTagType.LIGHT_SCREEN, turnCount, Moves.LIGHT_SCREEN, sourceId, side, [MoveCategory.SPECIAL]);
  }

  onAdd(arena: Arena, quiet: boolean = false): void {
    if (!quiet) {
      arena.scene.queueMessage(i18next.t(`arenaTag:lightScreenOnAdd${this.side === ArenaTagSide.PLAYER ? "Player" : this.side === ArenaTagSide.ENEMY ? "Enemy" : ""}`));
    }
  }
}

type ProtectConditionFunc = (arena: Arena, moveId: Moves) => boolean;

/**
 * Class to implement conditional team protection
 * applies protection based on the attributes of incoming moves
 */
export class ConditionalProtectTag extends ArenaTag {
  /** The condition function to determine which moves are negated */
  protected protectConditionFunc: ProtectConditionFunc;
  /** Does this apply to all moves, including those that ignore other forms of protection? */
  protected ignoresBypass: boolean;

  constructor(tagType: ArenaTagType, sourceMove: Moves, sourceId: integer, side: ArenaTagSide, condition: ProtectConditionFunc, ignoresBypass: boolean = false) {
    super(tagType, 1, sourceMove, sourceId, side);

    this.protectConditionFunc = condition;
    this.ignoresBypass = ignoresBypass;
  }

  onAdd(arena: Arena): void {
    arena.scene.queueMessage(i18next.t(`arenaTag:conditionalProtectOnAdd${this.side === ArenaTagSide.PLAYER ? "Player" : this.side === ArenaTagSide.ENEMY ? "Enemy" : ""}`, { moveName: super.getMoveName() }));
  }

  // Removes default message for effect removal
  onRemove(arena: Arena): void { }

  /**
   * apply(): Checks incoming moves against the condition function
   * and protects the target if conditions are met
   * @param arena The arena containing this tag
   * @param args\[0\] (Utils.BooleanHolder) Signals if the move is cancelled
   * @param args\[1\] (Pokemon) The Pokemon using the move
   * @param args\[2\] (Pokemon) The intended target of the move
   * @param args\[3\] (Moves) The parameters to the condition function
   * @param args\[4\] (Utils.BooleanHolder) Signals if the applied protection supercedes protection-ignoring effects
   * @returns
   */
  apply(arena: Arena, args: any[]): boolean {
    const [ cancelled, user, target, moveId, ignoresBypass ] = args;

    if (cancelled instanceof Utils.BooleanHolder
        && user instanceof Pokemon
        && target instanceof Pokemon
        && typeof moveId === "number"
        && ignoresBypass instanceof Utils.BooleanHolder) {

      if ((this.side === ArenaTagSide.PLAYER) === target.isPlayer()
          && this.protectConditionFunc(arena, moveId)) {
        if (!cancelled.value) {
          cancelled.value = true;
          user.stopMultiHit(target);

          new CommonBattleAnim(CommonAnim.PROTECT, target).play(arena.scene);
          arena.scene.queueMessage(i18next.t("arenaTag:conditionalProtectApply", { moveName: super.getMoveName(), pokemonNameWithAffix: getPokemonNameWithAffix(target) }));
        }

        ignoresBypass.value = ignoresBypass.value || this.ignoresBypass;
        return true;
      }
    }
    return false;
  }
}

/**
 * Arena Tag class for {@link https://bulbapedia.bulbagarden.net/wiki/Lucky_Chant_(move) Lucky Chant}.
 * Prevents critical hits against the tag's side.
 */
export class NoCritTag extends ArenaTag {
  /**
   * Constructor method for the NoCritTag class
   * @param turnCount `integer` the number of turns this effect lasts
   * @param sourceMove {@linkcode Moves} the move that created this effect
   * @param sourceId `integer` the ID of the {@linkcode Pokemon} that created this effect
   * @param side {@linkcode ArenaTagSide} the side to which this effect belongs
   */
  constructor(turnCount: integer, sourceMove: Moves, sourceId: integer, side: ArenaTagSide) {
    super(ArenaTagType.NO_CRIT, turnCount, sourceMove, sourceId, side);
  }

  /** Queues a message upon adding this effect to the field */
  onAdd(arena: Arena): void {
    arena.scene.queueMessage(i18next.t(`arenaTag:noCritOnAdd${this.side === ArenaTagSide.PLAYER ? "Player" : "Enemy"}`, {
      moveName: this.getMoveName()
    }));
  }

  /** Queues a message upon removing this effect from the field */
  onRemove(arena: Arena): void {
    const source = arena.scene.getPokemonById(this.sourceId!); // TODO: is this bang correct?
    arena.scene.queueMessage(i18next.t("arenaTag:noCritOnRemove", {
      pokemonNameWithAffix: getPokemonNameWithAffix(source ?? undefined),
      moveName: this.getMoveName()
    }));
  }
}


/**
 * Abstract class to implement weakened moves of a specific type.
 */
export class WeakenMoveTypeTag extends ArenaTag {
  private weakenedType: Type;

  /**
   * Creates a new instance of the WeakenMoveTypeTag class.
   *
   * @param tagType - The type of the arena tag.
   * @param turnCount - The number of turns the tag is active.
   * @param type - The type being weakened from this tag.
   * @param sourceMove - The move that created the tag.
   * @param sourceId - The ID of the source of the tag.
   */
  constructor(tagType: ArenaTagType, turnCount: integer, type: Type, sourceMove: Moves, sourceId: integer) {
    super(tagType, turnCount, sourceMove, sourceId);

    this.weakenedType = type;
  }

  apply(arena: Arena, args: any[]): boolean {
    if ((args[0] as Type) === this.weakenedType) {
      (args[1] as Utils.NumberHolder).value *= 0.33;
      return true;
    }

    return false;
  }
}


/**
 * Abstract class to implement arena traps.
 */
export class ArenaTrapTag extends ArenaTag {
  public layers: integer;
  public maxLayers: integer;

  /**
   * Creates a new instance of the ArenaTrapTag class.
   *
   * @param tagType - The type of the arena tag.
   * @param sourceMove - The move that created the tag.
   * @param sourceId - The ID of the source of the tag.
   * @param side - The side (player or enemy) the tag affects.
   * @param maxLayers - The maximum amount of layers this tag can have.
   */
  constructor(tagType: ArenaTagType, sourceMove: Moves, sourceId: integer, side: ArenaTagSide, maxLayers: integer) {
    super(tagType, 0, sourceMove, sourceId, side);

    this.layers = 1;
    this.maxLayers = maxLayers;
  }

  onOverlap(arena: Arena): void {
    if (this.layers < this.maxLayers) {
      this.layers++;

      this.onAdd(arena);
    }
  }

  apply(arena: Arena, args: any[]): boolean {
    const pokemon = args[0] as Pokemon;
    if (this.sourceId === pokemon.id || (this.side === ArenaTagSide.PLAYER) !== pokemon.isPlayer()) {
      return false;
    }

    return this.activateTrap(pokemon);
  }

  activateTrap(pokemon: Pokemon): boolean {
    return false;
  }

  getMatchupScoreMultiplier(pokemon: Pokemon): number {
    return pokemon.isGrounded() ? 1 : Phaser.Math.Linear(0, 1 / Math.pow(2, this.layers), Math.min(pokemon.getHpRatio(), 0.5) * 2);
  }
}

export function getArenaTag(tagType: ArenaTagType, turnCount: integer, sourceMove: Moves | undefined, sourceId: integer, targetIndex?: BattlerIndex, side: ArenaTagSide = ArenaTagSide.BOTH): ArenaTag | null {
  switch (tagType) {
  case ArenaTagType.MIST:
    return new MistTag(turnCount, sourceId, side);
  case ArenaTagType.NO_CRIT:
    return new NoCritTag(turnCount, sourceMove!, sourceId, side); // TODO: is this bang correct?
  case ArenaTagType.REFLECT:
    return new ReflectTag(turnCount, sourceId, side);
  case ArenaTagType.LIGHT_SCREEN:
    return new LightScreenTag(turnCount, sourceId, side);
  default:
    return null;
  }
}
