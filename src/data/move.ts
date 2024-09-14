import { ChargeAnim, MoveChargeAnim, initMoveAnim, loadMoveAnimAssets } from "./battle-anims";
import { BattleStat } from "./battle-stat";
import { StockpilingTag, TrappedTag, TypeBoostTag } from "./battler-tags";
import { getPokemonNameWithAffix } from "../messages";
import Pokemon, { AttackMoveResult, EnemyPokemon, HitResult, MoveResult, PlayerPokemon, PokemonMove, TurnMove } from "../field/pokemon";
import { StatusEffect, getStatusEffectHealText } from "./status-effect";
import { getTypeDamageMultiplier, Type } from "./type";
import { Constructor } from "#app/utils";
import * as Utils from "../utils";
import { WeatherType } from "./weather";
import { ArenaTagSide, ArenaTrapTag, WeakenMoveTypeTag } from "./arena-tag";
import { BlockRecoilDamageAttr, BlockOneHitKOAbAttr, IgnoreContactAbAttr, MaxMultiHitAbAttr, applyAbAttrs, BlockNonDirectDamageAbAttr, MoveAbilityBypassAbAttr, ReverseDrainAbAttr, FieldPreventExplosiveMovesAbAttr, ForceSwitchOutImmunityAbAttr, BlockItemTheftAbAttr, applyPostAttackAbAttrs, ConfusionOnStatusEffectAbAttr, HealFromBerryUseAbAttr, IgnoreProtectOnContactAbAttr, IgnoreMoveEffectsAbAttr, applyPreDefendAbAttrs, MoveEffectChanceMultiplierAbAttr, WonderSkinAbAttr, applyPreAttackAbAttrs, MoveTypeChangeAbAttr, UserFieldMoveTypePowerBoostAbAttr, FieldMoveTypePowerBoostAbAttr, AllyMoveCategoryPowerBoostAbAttr, VariableMovePowerAbAttr } from "./ability";
import { PokemonHeldItemModifier, BerryModifier, PreserveBerryModifier, PokemonMoveAccuracyBoosterModifier, AttackTypeBoosterModifier, PokemonMultiHitModifier } from "../modifier/modifier";
import { BattlerIndex, BattleType } from "../battle";
import { Stat } from "./pokemon-stat";
import { TerrainType } from "./terrain";
import { ModifierPoolType } from "#app/modifier/modifier-type";
import i18next from "i18next";
import { Localizable } from "#app/interfaces/locales";
import { getBerryEffectFunc } from "./berry";
import { Abilities } from "#enums/abilities";
import { ArenaTagType } from "#enums/arena-tag-type";
import { BattlerTagType } from "#enums/battler-tag-type";
import { Moves } from "#enums/moves";
import { MoveUsedEvent } from "#app/events/battle-scene";
import { PartyStatusCurePhase } from "#app/phases/party-status-cure-phase";
import { BattleEndPhase } from "#app/phases/battle-end-phase";
import { MoveEndPhase } from "#app/phases/move-end-phase";
import { MovePhase } from "#app/phases/move-phase";
import { NewBattlePhase } from "#app/phases/new-battle-phase";
import { PokemonHealPhase } from "#app/phases/pokemon-heal-phase";
import { StatChangePhase } from "#app/phases/stat-change-phase";
import { SwitchPhase } from "#app/phases/switch-phase";
import { SwitchSummonPhase } from "#app/phases/switch-summon-phase";
import { NumberHolder } from "#app/utils";
import { GameMode } from "#app/game-mode";
import { applyChallenges, ChallengeType } from "./challenge";

export enum MoveCategory {
  PHYSICAL,
  SPECIAL,
  STATUS
}

export enum MoveTarget {
  /** {@link https://bulbapedia.bulbagarden.net/wiki/Category:Moves_that_target_the_user Moves that target the User} */
  USER,
  OTHER,
  ALL_OTHERS,
  NEAR_OTHER,
  /** {@link https://bulbapedia.bulbagarden.net/wiki/Category:Moves_that_target_all_adjacent_Pok%C3%A9mon Moves that target all adjacent Pokemon} */
  ALL_NEAR_OTHERS,
  NEAR_ENEMY,
  /** {@link https://bulbapedia.bulbagarden.net/wiki/Category:Moves_that_target_all_adjacent_foes Moves that target all adjacent foes} */
  ALL_NEAR_ENEMIES,
  RANDOM_NEAR_ENEMY,
  ALL_ENEMIES,
  /** {@link https://bulbapedia.bulbagarden.net/wiki/Category:Counterattacks Counterattacks} */
  ATTACKER,
  /** {@link https://bulbapedia.bulbagarden.net/wiki/Category:Moves_that_target_one_adjacent_ally Moves that target one adjacent ally} */
  NEAR_ALLY,
  ALLY,
  USER_OR_NEAR_ALLY,
  USER_AND_ALLIES,
  /** {@link https://bulbapedia.bulbagarden.net/wiki/Category:Moves_that_target_all_Pok%C3%A9mon Moves that target all Pokemon} */
  ALL,
  USER_SIDE,
  /** {@link https://bulbapedia.bulbagarden.net/wiki/Category:Entry_hazard-creating_moves Entry hazard-creating moves} */
  ENEMY_SIDE,
  BOTH_SIDES,
  PARTY,
  CURSE
}

export enum MoveFlags {
  NONE              = 0,
  MAKES_CONTACT     = 1 << 0,
  IGNORE_PROTECT    = 1 << 1,
  IGNORE_VIRTUAL    = 1 << 2,
  SOUND_BASED       = 1 << 3,
  HIDE_USER         = 1 << 4,
  HIDE_TARGET       = 1 << 5,
  BITING_MOVE       = 1 << 6,
  PULSE_MOVE        = 1 << 7,
  PUNCHING_MOVE     = 1 << 8,
  SLICING_MOVE      = 1 << 9,
  /**
   * Indicates a move should be affected by {@linkcode Abilities.RECKLESS}
   * @see {@linkcode Move.recklessMove()}
   */
  RECKLESS_MOVE     = 1 << 10,
  BALLBOMB_MOVE     = 1 << 11,
  POWDER_MOVE       = 1 << 12,
  DANCE_MOVE        = 1 << 13,
  WIND_MOVE         = 1 << 14,
  TRIAGE_MOVE       = 1 << 15,
  IGNORE_ABILITIES  = 1 << 16,
  /**
   * Enables all hits of a multi-hit move to be accuracy checked individually
   */
  CHECK_ALL_HITS   = 1 << 17,
  /**
   * Indicates a move is able to be redirected to allies in a double battle if the attacker faints
   */
  REDIRECT_COUNTER = 1 << 18,
}

type MoveConditionFunc = (user: Pokemon, target: Pokemon, move: Move) => boolean;
type UserMoveConditionFunc = (user: Pokemon, move: Move) => boolean;

export default class Move implements Localizable {
  public id: Moves;
  public name: string;
  private _type: Type;
  private _category: MoveCategory;
  public moveTarget: MoveTarget;
  public power: integer;
  public accuracy: integer;
  public pp: integer;
  public effect: string;
  public chance: integer;
  public priority: integer;
  public generation: integer;
  public attrs: MoveAttr[];
  private conditions: MoveCondition[];
  private flags: integer;
  private nameAppend: string;

  constructor(id: Moves, type: Type, category: MoveCategory, defaultMoveTarget: MoveTarget, power: integer, accuracy: integer, pp: integer, chance: integer, priority: integer, generation: integer) {
    this.id = id;

    this.nameAppend = "";
    this._type = type;
    this._category = category;
    this.moveTarget = defaultMoveTarget;
    this.power = power;
    this.accuracy = accuracy;
    this.pp = pp;
    this.chance = chance;
    this.priority = priority;
    this.generation = generation;

    this.attrs = [];
    this.conditions = [];

    this.flags = 0;
    if (defaultMoveTarget === MoveTarget.USER) {
      this.setFlag(MoveFlags.IGNORE_PROTECT, true);
    }
    if (category === MoveCategory.PHYSICAL) {
      this.setFlag(MoveFlags.MAKES_CONTACT, true);
    }

    this.localize();
  }

  get type() {
    return this._type;
  }
  get category() {
    return this._category;
  }

  localize(): void {
    const i18nKey = Moves[this.id].split("_").filter(f => f).map((f, i) => i ? `${f[0]}${f.slice(1).toLowerCase()}` : f.toLowerCase()).join("") as unknown as string;

    this.name = this.id ? `${i18next.t(`move:${i18nKey}.name`)}${this.nameAppend}` : "";
    this.effect = this.id ? `${i18next.t(`move:${i18nKey}.effect`)}${this.nameAppend}` : "";
  }

  /**
   * Get all move attributes that match `attrType`
   * @param attrType any attribute that extends {@linkcode MoveAttr}
   * @returns Array of attributes that match `attrType`, Empty Array if none match.
   */
  getAttrs<T extends MoveAttr>(attrType: Constructor<T>): T[] {
    return this.attrs.filter((a): a is T => a instanceof attrType);
  }

  /**
   * Check if a move has an attribute that matches `attrType`
   * @param attrType any attribute that extends {@linkcode MoveAttr}
   * @returns true if the move has attribute `attrType`
   */
  hasAttr<T extends MoveAttr>(attrType: Constructor<T>): boolean {
    return this.attrs.some((attr) => attr instanceof attrType);
  }

  /**
   * Takes as input a boolean function and returns the first MoveAttr in attrs that matches true
   * @param attrPredicate
   * @returns the first {@linkcode MoveAttr} element in attrs that makes the input function return true
   */
  findAttr(attrPredicate: (attr: MoveAttr) => boolean): MoveAttr {
    return this.attrs.find(attrPredicate)!; // TODO: is the bang correct?
  }

  /**
   * Adds a new MoveAttr to the move (appends to the attr array)
   * if the MoveAttr also comes with a condition, also adds that to the conditions array: {@linkcode MoveCondition}
   * @param AttrType {@linkcode MoveAttr} the constructor of a MoveAttr class
   * @param args the args needed to instantiate a the given class
   * @returns the called object {@linkcode Move}
   */
  attr<T extends Constructor<MoveAttr>>(AttrType: T, ...args: ConstructorParameters<T>): this {
    const attr = new AttrType(...args);
    this.attrs.push(attr);
    let attrCondition = attr.getCondition();
    if (attrCondition) {
      if (typeof attrCondition === "function") {
        attrCondition = new MoveCondition(attrCondition);
      }
      this.conditions.push(attrCondition);
    }

    return this;
  }

  /**
   * Adds a new MoveAttr to the move (appends to the attr array)
   * if the MoveAttr also comes with a condition, also adds that to the conditions array: {@linkcode MoveCondition}
   * Almost identical to {@link attr}, except you are passing in a MoveAttr object, instead of a constructor and it's arguments
   * @param attrAdd {@linkcode MoveAttr} the attribute to add
   * @returns the called object {@linkcode Move}
   */
  addAttr(attrAdd: MoveAttr): this {
    this.attrs.push(attrAdd);
    let attrCondition = attrAdd.getCondition();
    if (attrCondition) {
      if (typeof attrCondition === "function") {
        attrCondition = new MoveCondition(attrCondition);
      }
      this.conditions.push(attrCondition);
    }

    return this;
  }

  /**
   * Sets the move target of this move
   * @param moveTarget {@linkcode MoveTarget} the move target to set
   * @returns the called object {@linkcode Move}
   */
  target(moveTarget: MoveTarget): this {
    this.moveTarget = moveTarget;
    return this;
  }

  /**
   * Getter function that returns if this Move has a MoveFlag
   * @param flag {@linkcode MoveFlags} to check
   * @returns boolean
   */
  hasFlag(flag: MoveFlags): boolean {
    // internally it is taking the bitwise AND (MoveFlags are represented as bit-shifts) and returning False if result is 0 and true otherwise
    return !!(this.flags & flag);
  }

  /**
   * Getter function that returns if the move hits multiple targets
   * @returns boolean
   */
  isMultiTarget(): boolean {
    switch (this.moveTarget) {
    case MoveTarget.ALL_OTHERS:
    case MoveTarget.ALL_NEAR_OTHERS:
    case MoveTarget.ALL_NEAR_ENEMIES:
    case MoveTarget.ALL_ENEMIES:
    case MoveTarget.USER_AND_ALLIES:
    case MoveTarget.ALL:
    case MoveTarget.USER_SIDE:
    case MoveTarget.ENEMY_SIDE:
    case MoveTarget.BOTH_SIDES:
      return true;
    }
    return false;
  }

  /**
   * Getter function that returns if the move targets itself or an ally
   * @returns boolean
   */

  isAllyTarget(): boolean {
    switch (this.moveTarget) {
    case MoveTarget.USER:
    case MoveTarget.NEAR_ALLY:
    case MoveTarget.ALLY:
    case MoveTarget.USER_OR_NEAR_ALLY:
    case MoveTarget.USER_AND_ALLIES:
    case MoveTarget.USER_SIDE:
      return true;
    }
    return false;
  }

  /**
   * Checks if the move is immune to certain types.
   * Currently looks at cases of Grass types with powder moves.
   * @param {Pokemon} user the source of this move
   * @param {Pokemon} target the target of this move
   * @param {Type} type the type of the move's target
   * @returns boolean
   */
  isTypeImmune(user: Pokemon, target: Pokemon, type: Type): boolean {
    if (this.moveTarget === MoveTarget.USER) {
      return false;
    }
    if (type === Type.GRASS && this.hasFlag(MoveFlags.POWDER_MOVE)) {
      return true;
    }
    return false;
  }

  /**
   * Adds a move condition to the move
   * @param condition {@linkcode MoveCondition} or {@linkcode MoveConditionFunc}, appends to conditions array a new MoveCondition object
   * @returns the called object {@linkcode Move}
   */
  condition(condition: MoveCondition | MoveConditionFunc): this {
    if (typeof condition === "function") {
      condition = new MoveCondition(condition as MoveConditionFunc);
    }
    this.conditions.push(condition);

    return this;
  }

  /**
   * Marks the move as "partial": appends texts to the move name
   * @returns the called object {@linkcode Move}
   */
  partial(): this {
    this.nameAppend += " (P)";
    return this;
  }

  /**
   * Marks the move as "unimplemented": appends texts to the move name
   * @returns the called object {@linkcode Move}
   */
  unimplemented(): this {
    this.nameAppend += " (N)";
    return this;
  }

  /**
   * Sets the flags of the move
   * @param flag {@linkcode MoveFlags}
   * @param on a boolean, if True, then "ORs" the flag onto existing ones, if False then "XORs" the flag onto existing ones
   */
  private setFlag(flag: MoveFlags, on: boolean): void {
    // bitwise OR and bitwise XOR respectively
    if (on) {
      this.flags |= flag;
    } else {
      this.flags ^= flag;
    }
  }

  /**
   * Sets the {@linkcode MoveFlags.MAKES_CONTACT} flag for the calling Move
   * @param makesContact The value (boolean) to set the flag to
   * @returns The {@linkcode Move} that called this function
   */
  makesContact(makesContact: boolean = true): this { // TODO: is true the correct default?
    this.setFlag(MoveFlags.MAKES_CONTACT, makesContact);
    return this;
  }

  /**
   * Sets the {@linkcode MoveFlags.IGNORE_PROTECT} flag for the calling Move
   * @param ignoresProtect The value (boolean) to set the flag to
   * example: @see {@linkcode Moves.CURSE}
   * @returns The {@linkcode Move} that called this function
   */
  ignoresProtect(ignoresProtect: boolean = true): this { // TODO: is `true` the correct default?
    this.setFlag(MoveFlags.IGNORE_PROTECT, ignoresProtect);
    return this;
  }

  /**
   * Sets the {@linkcode MoveFlags.IGNORE_VIRTUAL} flag for the calling Move
   * @param ignoresVirtual The value (boolean) to set the flag to
   * example: @see {@linkcode Moves.NATURE_POWER}
   * @returns The {@linkcode Move} that called this function
   */
  ignoresVirtual(ignoresVirtual: boolean = true): this { // TODO: is `true` the correct default?
    this.setFlag(MoveFlags.IGNORE_VIRTUAL, ignoresVirtual);
    return this;
  }

  /**
   * Sets the {@linkcode MoveFlags.SOUND_BASED} flag for the calling Move
   * @param soundBased The value (boolean) to set the flag to
   * example: @see {@linkcode Moves.UPROAR}
   * @returns The {@linkcode Move} that called this function
   */
  soundBased(soundBased: boolean = true): this { // TODO: is `true` the correct default?
    this.setFlag(MoveFlags.SOUND_BASED, soundBased);
    return this;
  }

  /**
   * Sets the {@linkcode MoveFlags.HIDE_USER} flag for the calling Move
   * @param hidesUser The value (boolean) to set the flag to
   * example: @see {@linkcode Moves.TELEPORT}
   * @returns The {@linkcode Move} that called this function
   */
  hidesUser(hidesUser: boolean = true): this { // TODO: is `true` the correct default?
    this.setFlag(MoveFlags.HIDE_USER, hidesUser);
    return this;
  }

  /**
   * Sets the {@linkcode MoveFlags.HIDE_TARGET} flag for the calling Move
   * @param hidesTarget The value (boolean) to set the flag to
   * example: @see {@linkcode Moves.WHIRLWIND}
   * @returns The {@linkcode Move} that called this function
   */
  hidesTarget(hidesTarget: boolean = true): this { // TODO: is `true` the correct default?
    this.setFlag(MoveFlags.HIDE_TARGET, hidesTarget);
    return this;
  }

  /**
   * Sets the {@linkcode MoveFlags.BITING_MOVE} flag for the calling Move
   * @param bitingMove The value (boolean) to set the flag to
   * example: @see {@linkcode Moves.BITE}
   * @returns The {@linkcode Move} that called this function
   */
  bitingMove(bitingMove: boolean = true): this { // TODO: is `true` the correct default?
    this.setFlag(MoveFlags.BITING_MOVE, bitingMove);
    return this;
  }

  /**
   * Sets the {@linkcode MoveFlags.PULSE_MOVE} flag for the calling Move
   * @param pulseMove The value (boolean) to set the flag to
   * example: @see {@linkcode Moves.WATER_PULSE}
   * @returns The {@linkcode Move} that called this function
   */
  pulseMove(pulseMove: boolean = true): this { // TODO: is `true` the correct default?
    this.setFlag(MoveFlags.PULSE_MOVE, pulseMove);
    return this;
  }

  /**
   * Sets the {@linkcode MoveFlags.PUNCHING_MOVE} flag for the calling Move
   * @param punchingMove The value (boolean) to set the flag to
   * example: @see {@linkcode Moves.DRAIN_PUNCH}
   * @returns The {@linkcode Move} that called this function
   */
  punchingMove(punchingMove: boolean = true): this { // TODO: is `true` the correct default?
    this.setFlag(MoveFlags.PUNCHING_MOVE, punchingMove);
    return this;
  }

  /**
   * Sets the {@linkcode MoveFlags.SLICING_MOVE} flag for the calling Move
   * @param slicingMove The value (boolean) to set the flag to
   * example: @see {@linkcode Moves.X_SCISSOR}
   * @returns The {@linkcode Move} that called this function
   */
  slicingMove(slicingMove: boolean = true): this { // TODO: is `true` the correct default?
    this.setFlag(MoveFlags.SLICING_MOVE, slicingMove);
    return this;
  }

  /**
   * Sets the {@linkcode MoveFlags.RECKLESS_MOVE} flag for the calling Move
   * @see {@linkcode Abilities.RECKLESS}
   * @param recklessMove The value to set the flag to
   * @returns The {@linkcode Move} that called this function
   */
  recklessMove(recklessMove: boolean = true): this { // TODO: is `true` the correct default?
    this.setFlag(MoveFlags.RECKLESS_MOVE, recklessMove);
    return this;
  }

  /**
   * Sets the {@linkcode MoveFlags.BALLBOMB_MOVE} flag for the calling Move
   * @param ballBombMove The value (boolean) to set the flag to
   * example: @see {@linkcode Moves.ELECTRO_BALL}
   * @returns The {@linkcode Move} that called this function
   */
  ballBombMove(ballBombMove: boolean = true): this { // TODO: is `true` the correct default?
    this.setFlag(MoveFlags.BALLBOMB_MOVE, ballBombMove);
    return this;
  }

  /**
   * Sets the {@linkcode MoveFlags.POWDER_MOVE} flag for the calling Move
   * @param powderMove The value (boolean) to set the flag to
   * example: @see {@linkcode Moves.STUN_SPORE}
   * @returns The {@linkcode Move} that called this function
   */
  powderMove(powderMove: boolean = true): this { // TODO: is `true` the correct default?
    this.setFlag(MoveFlags.POWDER_MOVE, powderMove);
    return this;
  }

  /**
   * Sets the {@linkcode MoveFlags.DANCE_MOVE} flag for the calling Move
   * @param danceMove The value (boolean) to set the flag to
   * example: @see {@linkcode Moves.PETAL_DANCE}
   * @returns The {@linkcode Move} that called this function
   */
  danceMove(danceMove: boolean = true): this { // TODO: is `true` the correct default?
    this.setFlag(MoveFlags.DANCE_MOVE, danceMove);
    return this;
  }

  /**
   * Sets the {@linkcode MoveFlags.WIND_MOVE} flag for the calling Move
   * @param windMove The value (boolean) to set the flag to
   * example: @see {@linkcode Moves.HURRICANE}
   * @returns The {@linkcode Move} that called this function
   */
  windMove(windMove: boolean = true): this { // TODO: is `true` the correct default?
    this.setFlag(MoveFlags.WIND_MOVE, windMove);
    return this;
  }

  /**
   * Sets the {@linkcode MoveFlags.TRIAGE_MOVE} flag for the calling Move
   * @param triageMove The value (boolean) to set the flag to
   * example: @see {@linkcode Moves.ABSORB}
   * @returns The {@linkcode Move} that called this function
   */
  triageMove(triageMove: boolean = true): this { // TODO: is `true` the correct default?
    this.setFlag(MoveFlags.TRIAGE_MOVE, triageMove);
    return this;
  }

  /**
   * Sets the {@linkcode MoveFlags.IGNORE_ABILITIES} flag for the calling Move
   * @param ignoresAbilities sThe value (boolean) to set the flag to
   * example: @see {@linkcode Moves.SUNSTEEL_STRIKE}
   * @returns The {@linkcode Move} that called this function
   */
  ignoresAbilities(ignoresAbilities: boolean = true): this { // TODO: is `true` the correct default?
    this.setFlag(MoveFlags.IGNORE_ABILITIES, ignoresAbilities);
    return this;
  }

  /**
   * Sets the {@linkcode MoveFlags.CHECK_ALL_HITS} flag for the calling Move
   * @param checkAllHits The value (boolean) to set the flag to
   * example: @see {@linkcode Moves.TRIPLE_AXEL}
   * @returns The {@linkcode Move} that called this function
   */
  checkAllHits(checkAllHits: boolean = true): this { // TODO: is `true` the correct default?
    this.setFlag(MoveFlags.CHECK_ALL_HITS, checkAllHits);
    return this;
  }

  /**
   * Sets the {@linkcode MoveFlags.REDIRECT_COUNTER} flag for the calling Move
   * @param redirectCounter The value (boolean) to set the flag to
   * example: @see {@linkcode Moves.METAL_BURST}
   * @returns The {@linkcode Move} that called this function
   */
  redirectCounter(redirectCounter: boolean = true): this { // TODO: is `true` the correct default?
    this.setFlag(MoveFlags.REDIRECT_COUNTER, redirectCounter);
    return this;
  }

  /**
   * Checks if the move flag applies to the pokemon(s) using/receiving the move
   * @param flag {@linkcode MoveFlags} MoveFlag to check on user and/or target
   * @param user {@linkcode Pokemon} the Pokemon using the move
   * @param target {@linkcode Pokemon} the Pokemon receiving the move
   * @returns boolean
   */
  checkFlag(flag: MoveFlags, user: Pokemon, target: Pokemon | null): boolean {
    // special cases below, eg: if the move flag is MAKES_CONTACT, and the user pokemon has an ability that ignores contact (like "Long Reach"), then overrides and move does not make contact
    switch (flag) {
    case MoveFlags.MAKES_CONTACT:
      if (user.hasAbilityWithAttr(IgnoreContactAbAttr)) {
        return false;
      }
      break;
    case MoveFlags.IGNORE_ABILITIES:
      if (user.hasAbilityWithAttr(MoveAbilityBypassAbAttr)) {
        const abilityEffectsIgnored = new Utils.BooleanHolder(false);
        applyAbAttrs(MoveAbilityBypassAbAttr, user, abilityEffectsIgnored, false, this);
        if (abilityEffectsIgnored.value) {
          return true;
        }
      }
      break;
    case MoveFlags.IGNORE_PROTECT:
      if (user.hasAbilityWithAttr(IgnoreProtectOnContactAbAttr) &&
          this.checkFlag(MoveFlags.MAKES_CONTACT, user, target)) {
        return true;
      }
      break;
    }

    return !!(this.flags & flag);
  }

  /**
   * Applies each {@linkcode MoveCondition} of this move to the params
   * @param user {@linkcode Pokemon} to apply conditions to
   * @param target {@linkcode Pokemon} to apply conditions to
   * @param move {@linkcode Move} to apply conditions to
   * @returns boolean: false if any of the apply()'s return false, else true
   */
  applyConditions(user: Pokemon, target: Pokemon, move: Move): boolean {
    for (const condition of this.conditions) {
      if (!condition.apply(user, target, move)) {
        return false;
      }
    }

    return true;
  }

  /**
   * Sees if, given the target pokemon, a move fails on it (by looking at each {@linkcode MoveAttr} of this move
   * @param user {@linkcode Pokemon} using the move
   * @param target {@linkcode Pokemon} receiving the move
   * @param move {@linkcode Move} using the move
   * @param cancelled {@linkcode Utils.BooleanHolder} to hold boolean value
   * @returns string of the failed text, or null
   */
  getFailedText(user: Pokemon, target: Pokemon, move: Move, cancelled: Utils.BooleanHolder): string | null {
    for (const attr of this.attrs) {
      const failedText = attr.getFailedText(user, target, move, cancelled);
      if (failedText !== null) {
        return failedText;
      }
    }
    return null;
  }

  /**
   * Calculates the userBenefitScore across all the attributes and conditions
   * @param user {@linkcode Pokemon} using the move
   * @param target {@linkcode Pokemon} receiving the move
   * @param move {@linkcode Move} using the move
   * @returns integer representing the total benefitScore
   */
  getUserBenefitScore(user: Pokemon, target: Pokemon, move: Move): integer {
    let score = 0;

    for (const attr of this.attrs) {
      score += attr.getUserBenefitScore(user, target, move);
    }

    for (const condition of this.conditions) {
      score += condition.getUserBenefitScore(user, target, move);
    }

    return score;
  }

  /**
   * Calculates the targetBenefitScore across all the attributes
   * @param user {@linkcode Pokemon} using the move
   * @param target {@linkcode Pokemon} receiving the move
   * @param move {@linkcode Move} using the move
   * @returns integer representing the total benefitScore
   */
  getTargetBenefitScore(user: Pokemon, target: Pokemon, move: Move): integer {
    let score = 0;

    for (const attr of this.attrs) {
      // conditionals to check if the move is self targeting (if so then you are applying the move to yourself, not the target)
      score += attr.getTargetBenefitScore(user, !attr.selfTarget ? target : user, move) * (target !== user && attr.selfTarget ? -1 : 1);
    }

    return score;
  }

  /**
   * Calculates the accuracy of a move in battle based on various conditions and attributes.
   *
   * @param user {@linkcode Pokemon} The Pokémon using the move.
   * @param target {@linkcode Pokemon} The Pokémon being targeted by the move.
   * @returns The calculated accuracy of the move.
   */
  calculateBattleAccuracy(user: Pokemon, target: Pokemon, simulated: boolean = false) {
    const moveAccuracy = new Utils.NumberHolder(this.accuracy);

    applyMoveAttrs(VariableAccuracyAttr, user, target, this, moveAccuracy);
    applyPreDefendAbAttrs(WonderSkinAbAttr, target, user, this, { value: false }, simulated, moveAccuracy);

    if (moveAccuracy.value === -1) {
      return moveAccuracy.value;
    }

    const isOhko = this.hasAttr(OneHitKOAccuracyAttr);

    if (!isOhko) {
      user.scene.applyModifiers(PokemonMoveAccuracyBoosterModifier, user.isPlayer(), user, moveAccuracy);
    }

    if (user.scene.arena.weather?.weatherType === WeatherType.FOG) {
      /**
       *  The 0.9 multiplier is PokeRogue-only implementation, Bulbapedia uses 3/5
       *  See Fog {@link https://bulbapedia.bulbagarden.net/wiki/Fog}
       */
      moveAccuracy.value = Math.floor(moveAccuracy.value * 0.9);
    }

    if (!isOhko && user.scene.arena.getTag(ArenaTagType.GRAVITY)) {
      moveAccuracy.value = Math.floor(moveAccuracy.value * 1.67);
    }

    return moveAccuracy.value;
  }

  /**
   * Calculates the power of a move in battle based on various conditions and attributes.
   *
   * @param source {@linkcode Pokemon} The Pokémon using the move.
   * @param target {@linkcode Pokemon} The Pokémon being targeted by the move.
   * @returns The calculated power of the move.
   */
  calculateBattlePower(source: Pokemon, target: Pokemon, simulated: boolean = false): number {
    if (this.category === MoveCategory.STATUS) {
      return -1;
    }

    const power = new Utils.NumberHolder(this.power);
    const typeChangeMovePowerMultiplier = new Utils.NumberHolder(1);

    applyPreAttackAbAttrs(MoveTypeChangeAbAttr, source, target, this, true, null, typeChangeMovePowerMultiplier);

    const sourceTeraType = source.getTeraType();
    if (sourceTeraType !== Type.UNKNOWN && sourceTeraType === this.type && power.value < 60 && this.priority <= 0 && !this.hasAttr(MultiHitAttr) && !source.scene.findModifier(m => m instanceof PokemonMultiHitModifier && m.pokemonId === source.id)) {
      power.value = 60;
    }

    applyPreAttackAbAttrs(VariableMovePowerAbAttr, source, target, this, simulated, power);

    if (source.getAlly()) {
      applyPreAttackAbAttrs(AllyMoveCategoryPowerBoostAbAttr, source.getAlly(), target, this, simulated, power);
    }

    const fieldAuras = new Set(
      source.scene.getField(true)
        .map((p) => p.getAbilityAttrs(FieldMoveTypePowerBoostAbAttr) as FieldMoveTypePowerBoostAbAttr[])
        .flat(),
    );
    for (const aura of fieldAuras) {
      // The only relevant values are `move` and the `power` holder
      aura.applyPreAttack(null, null, simulated, null, this, [power]);
    }

    const alliedField: Pokemon[] = source instanceof PlayerPokemon ? source.scene.getPlayerField() : source.scene.getEnemyField();
    alliedField.forEach(p => applyPreAttackAbAttrs(UserFieldMoveTypePowerBoostAbAttr, p, target, this, simulated, power));

    power.value *= typeChangeMovePowerMultiplier.value;

    const typeBoost = source.findTag(t => t instanceof TypeBoostTag && t.boostedType === this.type) as TypeBoostTag;
    if (typeBoost) {
      power.value *= typeBoost.boostValue;
    }

    if (source.scene.arena.getTerrainType() === TerrainType.GRASSY && target.isGrounded() && this.type === Type.GROUND && this.moveTarget === MoveTarget.ALL_NEAR_OTHERS) {
      power.value /= 2;
    }

    applyMoveAttrs(VariablePowerAttr, source, target, this, power);

    source.scene.applyModifiers(PokemonMultiHitModifier, source.isPlayer(), source, new Utils.IntegerHolder(0), power);

    if (!this.hasAttr(TypelessAttr)) {
      source.scene.arena.applyTags(WeakenMoveTypeTag, this.type, power);
      source.scene.applyModifiers(AttackTypeBoosterModifier, source.isPlayer(), source, this.type, power);
    }

    return power.value;
  }
}

export class AttackMove extends Move {
  constructor(id: Moves, type: Type, category: MoveCategory, power: integer, accuracy: integer, pp: integer, chance: integer, priority: integer, generation: integer) {
    super(id, type, category, MoveTarget.NEAR_OTHER, power, accuracy, pp, chance, priority, generation);

    /**
     * {@link https://bulbapedia.bulbagarden.net/wiki/Freeze_(status_condition)}
     * > All damaging Fire-type moves can now thaw a frozen target, regardless of whether or not they have a chance to burn;
     */
    if (this.type === Type.FIRE) {
      this.addAttr(new HealStatusEffectAttr(false, StatusEffect.FREEZE));
    }
  }

  getTargetBenefitScore(user: Pokemon, target: Pokemon, move: Move): integer {
    let ret = super.getTargetBenefitScore(user, target, move);

    let attackScore = 0;

    const effectiveness = target.getAttackTypeEffectiveness(this.type, user);
    attackScore = Math.pow(effectiveness - 1, 2) * effectiveness < 1 ? -2 : 2;
    if (attackScore) {
      if (this.category === MoveCategory.PHYSICAL) {
        const atk = new Utils.IntegerHolder(user.getBattleStat(Stat.ATK, target));
        applyMoveAttrs(VariableAtkAttr, user, target, move, atk);
        if (atk.value > user.getBattleStat(Stat.SPEC, target)) {
          const statRatio = user.getBattleStat(Stat.SPEC, target) / atk.value;
          if (statRatio <= 0.75) {
            attackScore *= 2;
          } else if (statRatio <= 0.875) {
            attackScore *= 1.5;
          }
        }
      } else {
        const spec = new Utils.IntegerHolder(user.getBattleStat(Stat.SPEC, target));
        applyMoveAttrs(VariableAtkAttr, user, target, move, spec);
        if (spec.value > user.getBattleStat(Stat.ATK, target)) {
          const statRatio = user.getBattleStat(Stat.ATK, target) / spec.value;
          if (statRatio <= 0.75) {
            attackScore *= 2;
          } else if (statRatio <= 0.875) {
            attackScore *= 1.5;
          }
        }
      }

      const power = new Utils.NumberHolder(this.power);
      applyMoveAttrs(VariablePowerAttr, user, target, move, power);

      attackScore += Math.floor(power.value / 5);
    }

    ret -= attackScore;

    return ret;
  }
}

export class StatusMove extends Move {
  constructor(id: Moves, type: Type, accuracy: integer, pp: integer, chance: integer, priority: integer, generation: integer) {
    super(id, type, MoveCategory.STATUS, MoveTarget.NEAR_OTHER, -1, accuracy, pp, chance, priority, generation);
  }
}

export class SelfStatusMove extends Move {
  constructor(id: Moves, type: Type, accuracy: integer, pp: integer, chance: integer, priority: integer, generation: integer) {
    super(id, type, MoveCategory.STATUS, MoveTarget.USER, -1, accuracy, pp, chance, priority, generation);
  }
}

/**
 * Base class defining all {@linkcode Move} Attributes
 * @abstract
 * @see {@linkcode apply}
 */
export abstract class MoveAttr {
  /** Should this {@linkcode Move} target the user? */
  public selfTarget: boolean;

  constructor(selfTarget: boolean = false) {
    this.selfTarget = selfTarget;
  }

  /**
   * Applies move attributes
   * @see {@linkcode applyMoveAttrsInternal}
   * @virtual
   * @param user {@linkcode Pokemon} using the move
   * @param target {@linkcode Pokemon} target of the move
   * @param move {@linkcode Move} with this attribute
   * @param args Set of unique arguments needed by this attribute
   * @returns true if application of the ability succeeds
   */
  apply(user: Pokemon | null, target: Pokemon | null, move: Move, args: any[]): boolean | Promise<boolean> {
    return true;
  }

  /**
   * @virtual
   * @returns the {@linkcode MoveCondition} or {@linkcode MoveConditionFunc} for this {@linkcode Move}
   */
  getCondition(): MoveCondition | MoveConditionFunc | null {
    return null;
  }

  /**
   * @virtual
   * @param user {@linkcode Pokemon} using the move
   * @param target {@linkcode Pokemon} target of the move
   * @param move {@linkcode Move} with this attribute
   * @param cancelled {@linkcode Utils.BooleanHolder} which stores if the move should fail
   * @returns the string representing failure of this {@linkcode Move}
   */
  getFailedText(user: Pokemon, target: Pokemon, move: Move, cancelled: Utils.BooleanHolder): string | null {
    return null;
  }

  /**
   * Used by the Enemy AI to rank an attack based on a given user
   * @see {@linkcode EnemyPokemon.getNextMove}
   * @virtual
   */
  getUserBenefitScore(user: Pokemon, target: Pokemon, move: Move): integer {
    return 0;
  }

  /**
   * Used by the Enemy AI to rank an attack based on a given target
   * @see {@linkcode EnemyPokemon.getNextMove}
   * @virtual
   */
  getTargetBenefitScore(user: Pokemon, target: Pokemon, move: Move): integer {
    return 0;
  }
}

export enum MoveEffectTrigger {
  PRE_APPLY,
  POST_APPLY,
  HIT,
  /** Triggers one time after all target effects have applied */
  POST_TARGET,
}

/** Base class defining all Move Effect Attributes
 * @extends MoveAttr
 * @see {@linkcode apply}
 */
export class MoveEffectAttr extends MoveAttr {
  /** Defines when this effect should trigger in the move's effect order
   * @see {@linkcode phases.MoveEffectPhase.start}
   */
  public trigger: MoveEffectTrigger;
  /** Should this effect only apply on the first hit? */
  public firstHitOnly: boolean;
  /** Should this effect only apply on the last hit? */
  public lastHitOnly: boolean;
  /** Should this effect only apply on the first target hit? */
  public firstTargetOnly: boolean;

  constructor(selfTarget?: boolean, trigger?: MoveEffectTrigger, firstHitOnly: boolean = false, lastHitOnly: boolean = false, firstTargetOnly: boolean = false) {
    super(selfTarget);
    this.trigger = trigger !== undefined ? trigger : MoveEffectTrigger.POST_APPLY;
    this.firstHitOnly = firstHitOnly;
    this.lastHitOnly = lastHitOnly;
    this.firstTargetOnly = firstTargetOnly;
  }

  /**
   * Determines whether the {@linkcode Move}'s effects are valid to {@linkcode apply}
   * @virtual
   * @param user {@linkcode Pokemon} using the move
   * @param target {@linkcode Pokemon} target of the move
   * @param move {@linkcode Move} with this attribute
   * @param args Set of unique arguments needed by this attribute
   * @returns true if basic application of the ability attribute should be possible
   */
  canApply(user: Pokemon, target: Pokemon, move: Move, args?: any[]) {
    return !! (this.selfTarget ? user.hp && !user.getTag(BattlerTagType.FRENZY) : target.hp)
           && (this.selfTarget || !target.getTag(BattlerTagType.PROTECTED) ||
                move.checkFlag(MoveFlags.IGNORE_PROTECT, user, target));
  }

  /** Applies move effects so long as they are able based on {@linkcode canApply} */
  apply(user: Pokemon, target: Pokemon, move: Move, args?: any[]): boolean | Promise<boolean> {
    return this.canApply(user, target, move, args);
  }

  /**
   * Gets the used move's additional effect chance.
   * If user's ability has MoveEffectChanceMultiplierAbAttr or IgnoreMoveEffectsAbAttr modifies the base chance.
   * @param user {@linkcode Pokemon} using this move
   * @param target {@linkcode Pokemon} target of this move
   * @param move {@linkcode Move} being used
   * @param selfEffect {@linkcode Boolean} if move targets user.
   * @returns Move chance value.
   */
  getMoveChance(user: Pokemon, target: Pokemon, move: Move, selfEffect?: Boolean, showAbility?: Boolean): integer {
    const moveChance = new Utils.NumberHolder(move.chance);
    applyAbAttrs(MoveEffectChanceMultiplierAbAttr, user, null, false, moveChance, move, target, selfEffect, showAbility);
    if (!selfEffect) {
      applyPreDefendAbAttrs(IgnoreMoveEffectsAbAttr, target, user, null, null, false, moveChance);
    }
    return moveChance.value;
  }
}

/**
 * Base class defining all Move Header attributes.
 * Move Header effects apply at the beginning of a turn before any moves are resolved.
 * They can be used to apply effects to the field (e.g. queueing a message) or to the user
 * (e.g. adding a battler tag).
 */
export class MoveHeaderAttr extends MoveAttr {
  constructor() {
    super(true);
  }
}

/**
 * Header attribute to queue a message at the beginning of a turn.
 * @see {@link MoveHeaderAttr}
 */
export class MessageHeaderAttr extends MoveHeaderAttr {
  private message: string | ((user: Pokemon, move: Move) => string);

  constructor(message: string | ((user: Pokemon, move: Move) => string)) {
    super();
    this.message = message;
  }

  apply(user: Pokemon, target: Pokemon, move: Move, args: any[]): boolean {
    const message = typeof this.message === "string"
      ? this.message
      : this.message(user, move);

    if (message) {
      user.scene.queueMessage(message);
      return true;
    }
    return false;
  }
}

/**
 * Header attribute to add a battler tag to the user at the beginning of a turn.
 * @see {@linkcode MoveHeaderAttr}
 */
export class AddBattlerTagHeaderAttr extends MoveHeaderAttr {
  private tagType: BattlerTagType;

  constructor(tagType: BattlerTagType) {
    super();
    this.tagType = tagType;
  }

  apply(user: Pokemon, target: Pokemon, move: Move, args: any[]): boolean {
    user.addTag(this.tagType);
    return true;
  }
}

/**
 * Header attribute to implement the "charge phase" of Beak Blast at the
 * beginning of a turn.
 * @see {@link https://bulbapedia.bulbagarden.net/wiki/Beak_Blast_(move) | Beak Blast}
 * @see {@linkcode BeakBlastChargingTag}
 */
export class BeakBlastHeaderAttr extends AddBattlerTagHeaderAttr {
  /** Required to initialize Beak Blast's charge animation correctly */
  public chargeAnim = ChargeAnim.BEAK_BLAST_CHARGING;

  constructor() {
    super(BattlerTagType.BEAK_BLAST_CHARGING);
  }
}

export class PreMoveMessageAttr extends MoveAttr {
  private message: string | ((user: Pokemon, target: Pokemon, move: Move) => string);

  constructor(message: string | ((user: Pokemon, target: Pokemon, move: Move) => string)) {
    super();
    this.message = message;
  }

  apply(user: Pokemon, target: Pokemon, move: Move, args: any[]): boolean {
    const message = typeof this.message === "string"
      ? this.message as string
      : this.message(user, target, move);
    if (message) {
      user.scene.queueMessage(message, 500);
      return true;
    }
    return false;
  }
}

/**
 * Attribute for Status moves that take attack type effectiveness
 * into consideration (i.e. {@linkcode https://bulbapedia.bulbagarden.net/wiki/Thunder_Wave_(move) | Thunder Wave})
 * @extends MoveAttr
 */
export class RespectAttackTypeImmunityAttr extends MoveAttr { }

export class IgnoreOpponentStatChangesAttr extends MoveAttr {
  apply(user: Pokemon, target: Pokemon, move: Move, args: any[]): boolean {
    (args[0] as Utils.IntegerHolder).value = 0;

    return true;
  }
}

export class HighCritAttr extends MoveAttr {
  apply(user: Pokemon, target: Pokemon, move: Move, args: any[]): boolean {
    (args[0] as Utils.IntegerHolder).value++;

    return true;
  }

  getUserBenefitScore(user: Pokemon, target: Pokemon, move: Move): integer {
    return 3;
  }
}

export class CritOnlyAttr extends MoveAttr {
  apply(user: Pokemon, target: Pokemon, move: Move, args: any[]): boolean {
    (args[0] as Utils.BooleanHolder).value = true;

    return true;
  }

  getUserBenefitScore(user: Pokemon, target: Pokemon, move: Move): integer {
    return 5;
  }
}

export class FixedDamageAttr extends MoveAttr {
  private damage: integer;

  constructor(damage: integer) {
    super();

    this.damage = damage;
  }

  apply(user: Pokemon, target: Pokemon, move: Move, args: any[]): boolean {
    (args[0] as Utils.IntegerHolder).value = this.getDamage(user, target, move);

    return true;
  }

  getDamage(user: Pokemon, target: Pokemon, move: Move): integer {
    return this.damage;
  }
}

export class UserHpDamageAttr extends FixedDamageAttr {
  constructor() {
    super(0);
  }

  apply(user: Pokemon, target: Pokemon, move: Move, args: any[]): boolean {
    (args[0] as Utils.IntegerHolder).value = user.hp;

    return true;
  }
}

export class TargetHalfHpDamageAttr extends FixedDamageAttr {
  constructor() {
    super(0);
  }

  apply(user: Pokemon, target: Pokemon, move: Move, args: any[]): boolean {
    (args[0] as Utils.IntegerHolder).value = Utils.toDmgValue(target.hp / 2);

    return true;
  }

  getTargetBenefitScore(user: Pokemon, target: Pokemon, move: Move): number {
    return target.getHpRatio() > 0.5 ? Math.floor(((target.getHpRatio() - 0.5) * -24) + 4) : -20;
  }
}

export class MatchHpAttr extends FixedDamageAttr {
  constructor() {
    super(0);
  }

  apply(user: Pokemon, target: Pokemon, move: Move, args: any[]): boolean {
    (args[0] as Utils.IntegerHolder).value = target.hp - user.hp;

    return true;
  }

  getCondition(): MoveConditionFunc {
    return (user, target, move) => user.hp <= target.hp;
  }

  // TODO
  /*getUserBenefitScore(user: Pokemon, target: Pokemon, move: Move): integer {
    return 0;
  }*/
}

type MoveFilter = (move: Move) => boolean;

export class CounterDamageAttr extends FixedDamageAttr {
  private moveFilter: MoveFilter;
  private multiplier: number;

  constructor(moveFilter: MoveFilter, multiplier: integer) {
    super(0);

    this.moveFilter = moveFilter;
    this.multiplier = multiplier;
  }

  apply(user: Pokemon, target: Pokemon, move: Move, args: any[]): boolean {
    const damage = user.turnData.attacksReceived.filter(ar => this.moveFilter(allMoves[ar.move])).reduce((total: integer, ar: AttackMoveResult) => total + ar.damage, 0);
    (args[0] as Utils.IntegerHolder).value = Utils.toDmgValue(damage * this.multiplier);

    return true;
  }

  getCondition(): MoveConditionFunc {
    return (user, target, move) => !!user.turnData.attacksReceived.filter(ar => this.moveFilter(allMoves[ar.move])).length;
  }
}

export class LevelDamageAttr extends FixedDamageAttr {
  constructor() {
    super(0);
  }

  getDamage(user: Pokemon, target: Pokemon, move: Move): number {
    return user.level;
  }
}

export class RandomLevelDamageAttr extends FixedDamageAttr {
  constructor() {
    super(0);
  }

  getDamage(user: Pokemon, target: Pokemon, move: Move): number {
    return Utils.toDmgValue(user.level * (user.randSeedIntRange(50, 150) * 0.01));
  }
}

export class ModifiedDamageAttr extends MoveAttr {
  apply(user: Pokemon, target: Pokemon, move: Move, args: any[]): boolean {
    const initialDamage = args[0] as Utils.IntegerHolder;
    initialDamage.value = this.getModifiedDamage(user, target, move, initialDamage.value);

    return true;
  }

  getModifiedDamage(user: Pokemon, target: Pokemon, move: Move, damage: integer): integer {
    return damage;
  }
}

export class SurviveDamageAttr extends ModifiedDamageAttr {
  getModifiedDamage(user: Pokemon, target: Pokemon, move: Move, damage: number): number {
    return Math.min(damage, target.hp - 1);
  }

  getCondition(): MoveConditionFunc {
    return (user, target, move) => target.hp > 1;
  }

  getUserBenefitScore(user: Pokemon, target: Pokemon, move: Move): integer {
    return target.hp > 1 ? 0 : -20;
  }
}

export class RecoilAttr extends MoveEffectAttr {
  private useHp: boolean;
  private damageRatio: number;
  private unblockable: boolean;

  constructor(useHp: boolean = false, damageRatio: number = 0.25, unblockable: boolean = false) {
    super(true, MoveEffectTrigger.POST_APPLY, false, true);

    this.useHp = useHp;
    this.damageRatio = damageRatio;
    this.unblockable = unblockable;
  }

  apply(user: Pokemon, target: Pokemon, move: Move, args: any[]): boolean {
    if (!super.apply(user, target, move, args)) {
      return false;
    }

    const cancelled = new Utils.BooleanHolder(false);
    if (!this.unblockable) {
      applyAbAttrs(BlockRecoilDamageAttr, user, cancelled);
      applyAbAttrs(BlockNonDirectDamageAbAttr, user, cancelled);
    }

    if (cancelled.value) {
      return false;
    }

    const damageValue = (!this.useHp ? user.turnData.damageDealt : user.getMaxHp()) * this.damageRatio;
    const minValue = user.turnData.damageDealt ? 1 : 0;
    const recoilDamage = Utils.toDmgValue(damageValue, minValue);
    if (!recoilDamage) {
      return false;
    }

    if (cancelled.value) {
      return false;
    }

    user.damageAndUpdate(recoilDamage, HitResult.OTHER, false, true, true);
    user.scene.queueMessage(i18next.t("moveTriggers:hitWithRecoil", {pokemonName: getPokemonNameWithAffix(user)}));
    user.turnData.damageTaken += recoilDamage;

    return true;
  }

  getUserBenefitScore(user: Pokemon, target: Pokemon, move: Move): integer {
    return Math.floor((move.power / 5) / -4);
  }
}


/**
 * Attribute used for moves which self KO the user regardless if the move hits a target
 * @extends MoveEffectAttr
 * @see {@linkcode apply}
 **/
export class SacrificialAttr extends MoveEffectAttr {
  constructor() {
    super(true, MoveEffectTrigger.POST_TARGET);
  }

  /**
   * Deals damage to the user equal to their current hp
   * @param user {@linkcode Pokemon} that used the move
   * @param target {@linkcode Pokemon} target of the move
   * @param move {@linkcode Move} with this attribute
   * @param args N/A
   * @returns true if the function succeeds
   **/
  apply(user: Pokemon, target: Pokemon, move: Move, args: any[]): boolean {
    user.damageAndUpdate(user.hp, HitResult.OTHER, false, true, true);
	  user.turnData.damageTaken += user.hp;

    return true;
  }

  getUserBenefitScore(user: Pokemon, target: Pokemon, move: Move): integer {
    if (user.isBoss()) {
      return -20;
    }
    return Math.ceil(((1 - user.getHpRatio()) * 10 - 10) * (target.getAttackTypeEffectiveness(move.type, user) - 0.5));
  }
}

/**
 * Attribute used for moves which self KO the user but only if the move hits a target
 * @extends MoveEffectAttr
 * @see {@linkcode apply}
 **/
export class SacrificialAttrOnHit extends MoveEffectAttr {
  constructor() {
    super(true, MoveEffectTrigger.HIT);
  }

  /**
   * Deals damage to the user equal to their current hp if the move lands
   * @param user {@linkcode Pokemon} that used the move
   * @param target {@linkcode Pokemon} target of the move
   * @param move {@linkcode Move} with this attribute
   * @param args N/A
   * @returns true if the function succeeds
   **/
  apply(user: Pokemon, target: Pokemon, move: Move, args: any[]): boolean {
    // If the move fails to hit a target, then the user does not faint and the function returns false
    if (!super.apply(user, target, move, args)) {
      return false;
    }

    user.damageAndUpdate(user.hp, HitResult.OTHER, false, true, true);
    user.turnData.damageTaken += user.hp;

    return true;
  }

  getUserBenefitScore(user: Pokemon, target: Pokemon, move: Move): integer {
    if (user.isBoss()) {
      return -20;
    }
    return Math.ceil(((1 - user.getHpRatio()) * 10 - 10) * (target.getAttackTypeEffectiveness(move.type, user) - 0.5));
  }
}

/**
 * Attribute used for moves which cut the user's Max HP in half.
 * Triggers using {@linkcode MoveEffectTrigger.POST_TARGET}.
 * @extends MoveEffectAttr
 * @see {@linkcode apply}
 */
export class HalfSacrificialAttr extends MoveEffectAttr {
  constructor() {
    super(true, MoveEffectTrigger.POST_TARGET);
  }

  /**
   * Cut's the user's Max HP in half and displays the appropriate recoil message
   * @param user {@linkcode Pokemon} that used the move
   * @param target N/A
   * @param move {@linkcode Move} with this attribute
   * @param args N/A
   * @returns true if the function succeeds
   */
  apply(user: Pokemon, target: Pokemon, move: Move, args: any[]): boolean {
    if (!super.apply(user, target, move, args)) {
      return false;
    }

    const cancelled = new Utils.BooleanHolder(false);
    // Check to see if the Pokemon has an ability that blocks non-direct damage
    applyAbAttrs(BlockNonDirectDamageAbAttr, user, cancelled);
    if (!cancelled.value) {
      user.damageAndUpdate(Utils.toDmgValue(user.getMaxHp()/2), HitResult.OTHER, false, true, true);
      user.scene.queueMessage(i18next.t("moveTriggers:cutHpPowerUpMove", {pokemonName: getPokemonNameWithAffix(user)})); // Queue recoil message
    }
    return true;
  }

  getUserBenefitScore(user: Pokemon, target: Pokemon, move: Move): integer {
    if (user.isBoss()) {
      return -10;
    }
    return Math.ceil(((1 - user.getHpRatio()/2) * 10 - 10) * (target.getAttackTypeEffectiveness(move.type, user) - 0.5));
  }
}

export enum MultiHitType {
  _2,
  _2_TO_5,
  _3,
  _10,
  BEAT_UP,
}

/**
 * Heals the user or target by {@linkcode healRatio} depending on the value of {@linkcode selfTarget}
 * @extends MoveEffectAttr
 * @see {@linkcode apply}
 */
export class HealAttr extends MoveEffectAttr {
  /** The percentage of {@linkcode Stat.HP} to heal */
  private healRatio: number;
  /** Should an animation be shown? */
  private showAnim: boolean;

  constructor(healRatio?: number, showAnim?: boolean, selfTarget?: boolean) {
    super(selfTarget === undefined || selfTarget);

    this.healRatio = healRatio || 1;
    this.showAnim = !!showAnim;
  }

  apply(user: Pokemon, target: Pokemon, move: Move, args: any[]): boolean {
    this.addHealPhase(this.selfTarget ? user : target, this.healRatio);
    return true;
  }

  /**
   * Creates a new {@linkcode PokemonHealPhase}.
   * This heals the target and shows the appropriate message.
   */
  addHealPhase(target: Pokemon, healRatio: number) {
    target.scene.unshiftPhase(new PokemonHealPhase(target.scene, target.getBattlerIndex(),
      Utils.toDmgValue(target.getMaxHp() * healRatio), i18next.t("moveTriggers:healHp", {pokemonName: getPokemonNameWithAffix(target)}), true, !this.showAnim));
  }

  getTargetBenefitScore(user: Pokemon, target: Pokemon, move: Move): integer {
    const score = ((1 - (this.selfTarget ? user : target).getHpRatio()) * 20) - this.healRatio * 10;
    return Math.round(score / (1 - this.healRatio / 2));
  }
}

/**
 * Cures the user's party of non-volatile status conditions, ie. Heal Bell, Aromatherapy
 * @extends MoveEffectAttr
 * @see {@linkcode apply}
 */
export class PartyStatusCureAttr extends MoveEffectAttr {
  /** Message to display after using move */
  private message: string;
  /** Skips mons with this ability, ie. Soundproof */
  private abilityCondition: Abilities;

  constructor(message: string | null, abilityCondition: Abilities) {
    super();

    this.message = message!; // TODO: is this bang correct?
    this.abilityCondition = abilityCondition;
  }

  //The same as MoveEffectAttr.canApply, except it doesn't check for the target's HP.
  canApply(user: Pokemon, target: Pokemon, move: Move, args: any[]) {
    const isTargetValid =
      (this.selfTarget && user.hp && !user.getTag(BattlerTagType.FRENZY)) ||
      (!this.selfTarget && (!target.getTag(BattlerTagType.PROTECTED) || move.hasFlag(MoveFlags.IGNORE_PROTECT)));
    return !!isTargetValid;
  }

  apply(user: Pokemon, target: Pokemon, move: Move, args: any[]): boolean {
    if (!this.canApply(user, target, move, args)) {
      return false;
    }
    this.addPartyCurePhase(user);
    return true;
  }

  addPartyCurePhase(user: Pokemon) {
    user.scene.unshiftPhase(new PartyStatusCurePhase(user.scene, user, this.message, this.abilityCondition));
  }
}

/**
 * Applies damage to the target's ally equal to 1/16 of that ally's max HP.
 * @extends MoveEffectAttr
 */
export class FlameBurstAttr extends MoveEffectAttr {
  /**
   * @param user - n/a
   * @param target - The target Pokémon.
   * @param move - n/a
   * @param args - n/a
   * @returns A boolean indicating whether the effect was successfully applied.
   */
  apply(user: Pokemon, target: Pokemon, move: Move, args: any[]): boolean | Promise<boolean> {
    const targetAlly = target.getAlly();
    const cancelled = new Utils.BooleanHolder(false);

    if (targetAlly) {
      applyAbAttrs(BlockNonDirectDamageAbAttr, targetAlly, cancelled);
    }

    if (cancelled.value || !targetAlly) {
      return false;
    }

    targetAlly.damageAndUpdate(Math.max(1, Math.floor(1/16 * targetAlly.getMaxHp())), HitResult.OTHER);
    return true;
  }

  getTargetBenefitScore(user: Pokemon, target: Pokemon, move: Move): integer {
    return target.getAlly() ? -5 : 0;
  }
}

export class SacrificialFullRestoreAttr extends SacrificialAttr {
  constructor() {
    super();
  }

  apply(user: Pokemon, target: Pokemon, move: Move, args: any[]): boolean {
    if (!super.apply(user, target, move, args)) {
      return false;
    }

    // We don't know which party member will be chosen, so pick the highest max HP in the party
    const maxPartyMemberHp = user.scene.getParty().map(p => p.getMaxHp()).reduce((maxHp: integer, hp: integer) => Math.max(hp, maxHp), 0);

    user.scene.pushPhase(new PokemonHealPhase(user.scene, user.getBattlerIndex(),
      maxPartyMemberHp, i18next.t("moveTriggers:sacrificialFullRestore", {pokemonName: getPokemonNameWithAffix(user)}), true, false, false, true), true);

    return true;
  }

  getUserBenefitScore(user: Pokemon, target: Pokemon, move: Move): integer {
    return -20;
  }

  getCondition(): MoveConditionFunc {
    return (user, target, move) => user.scene.getParty().filter(p => p.isActive()).length > user.scene.currentBattle.getBattlerCount();
  }
}

/**
 * Attribute used for moves which ignore type-based debuffs from weather, namely Hydro Steam.
 * Called during damage calculation after getting said debuff from getAttackTypeMultiplier in the Pokemon class.
 * @extends MoveAttr
 * @see {@linkcode apply}
 */
export class IgnoreWeatherTypeDebuffAttr extends MoveAttr {
  /** The {@linkcode WeatherType} this move ignores */
  public weather: WeatherType;

  constructor(weather: WeatherType) {
    super();
    this.weather = weather;
  }
  /**
   * Changes the type-based weather modifier if this move's power would be reduced by it
   * @param user {@linkcode Pokemon} that used the move
   * @param target N/A
   * @param move {@linkcode Move} with this attribute
   * @param args [0] {@linkcode Utils.NumberHolder} for arenaAttackTypeMultiplier
   * @returns true if the function succeeds
   */
  apply(user: Pokemon, target: Pokemon, move: Move, args: any[]): boolean {
    const weatherModifier=args[0] as Utils.NumberHolder;
    //If the type-based attack power modifier due to weather (e.g. Water moves in Sun) is below 1, set it to 1
    if (user.scene.arena.weather?.weatherType === this.weather) {
      weatherModifier.value = Math.max(weatherModifier.value, 1);
    }
    return true;
  }
}

export abstract class WeatherHealAttr extends HealAttr {
  constructor() {
    super(0.5);
  }

  apply(user: Pokemon, target: Pokemon, move: Move, args: any[]): boolean {
    let healRatio = 0.5;
    if (!user.scene.arena.weather?.isEffectSuppressed(user.scene)) {
      const weatherType = user.scene.arena.weather?.weatherType || WeatherType.NONE;
      healRatio = this.getWeatherHealRatio(weatherType);
    }
    this.addHealPhase(user, healRatio);
    return true;
  }

  abstract getWeatherHealRatio(weatherType: WeatherType): number;
}

export class PlantHealAttr extends WeatherHealAttr {
  getWeatherHealRatio(weatherType: WeatherType): number {
    switch (weatherType) {
    case WeatherType.SUNNY:
    case WeatherType.HARSH_SUN:
      return 2 / 3;
    case WeatherType.RAIN:
    case WeatherType.SANDSTORM:
    case WeatherType.HAIL:
    case WeatherType.SNOW:
    case WeatherType.HEAVY_RAIN:
      return 0.25;
    default:
      return 0.5;
    }
  }
}

export class SandHealAttr extends WeatherHealAttr {
  getWeatherHealRatio(weatherType: WeatherType): number {
    switch (weatherType) {
    case WeatherType.SANDSTORM:
      return 2 / 3;
    default:
      return 0.5;
    }
  }
}

/**
 * Heals the target or the user by either {@linkcode normalHealRatio} or {@linkcode boostedHealRatio}
 * depending on the evaluation of {@linkcode condition}
 * @extends HealAttr
 * @see {@linkcode apply}
 */
export class BoostHealAttr extends HealAttr {
  /** Healing received when {@linkcode condition} is false */
  private normalHealRatio: number;
  /** Healing received when {@linkcode condition} is true */
  private boostedHealRatio: number;
  /** The lambda expression to check against when boosting the healing value */
  private condition?: MoveConditionFunc;

  constructor(normalHealRatio?: number, boostedHealRatio?: number, showAnim?: boolean, selfTarget?: boolean, condition?: MoveConditionFunc) {
    super(normalHealRatio, showAnim, selfTarget);
    this.normalHealRatio = normalHealRatio!; // TODO: is this bang correct?
    this.boostedHealRatio = boostedHealRatio!; // TODO: is this bang correct?
    this.condition = condition;
  }

  /**
   * @param user {@linkcode Pokemon} using the move
   * @param target {@linkcode Pokemon} target of the move
   * @param move {@linkcode Move} with this attribute
   * @param args N/A
   * @returns true if the move was successful
   */
  apply(user: Pokemon, target: Pokemon, move: Move, args: any[]): boolean {
    const healRatio: number = (this.condition ? this.condition(user, target, move) : false) ? this.boostedHealRatio : this.normalHealRatio;
    this.addHealPhase(target, healRatio);
    return true;
  }
}

/**
 * Heals the target only if it is the ally
 * @extends HealAttr
 * @see {@linkcode apply}
 */
export class HealOnAllyAttr extends HealAttr {
  /**
   * @param user {@linkcode Pokemon} using the move
   * @param target {@linkcode Pokemon} target of the move
   * @param move {@linkcode Move} with this attribute
   * @param args N/A
   * @returns true if the function succeeds
   */
  apply(user: Pokemon, target: Pokemon, move: Move, args: any[]): boolean {
    if (user.getAlly() === target) {
      super.apply(user, target, move, args);
      return true;
    }

    return false;
  }
}

/**
 * Heals user as a side effect of a move that hits a target.
 * Healing is based on {@linkcode healRatio} * the amount of damage dealt or a stat of the target.
 * @extends MoveEffectAttr
 * @see {@linkcode apply}
 * @see {@linkcode getUserBenefitScore}
 */
export class HitHealAttr extends MoveEffectAttr {
  private healRatio: number;
  private message: string;
  private healStat: Stat | null;

  constructor(healRatio?: number | null, healStat?: Stat) {
    super(true, MoveEffectTrigger.HIT);

    this.healRatio = healRatio ?? 0.5;
    this.healStat = healStat ?? null;
  }
  /**
   * Heals the user the determined amount and possibly displays a message about regaining health.
   * If the target has the {@linkcode ReverseDrainAbAttr}, all healing is instead converted
   * to damage to the user.
   * @param user {@linkcode Pokemon} using this move
   * @param target {@linkcode Pokemon} target of this move
   * @param move {@linkcode Move} being used
   * @param args N/A
   * @returns true if the function succeeds
   */
  apply(user: Pokemon, target: Pokemon, move: Move, args: any[]): boolean {
    let healAmount = 0;
    let message = "";
    const reverseDrain = target.hasAbilityWithAttr(ReverseDrainAbAttr, false);
    if (this.healStat !== null) {
      // Strength Sap formula
      healAmount = target.getBattleStat(this.healStat);
      message = i18next.t("battle:drainMessage", {pokemonName: getPokemonNameWithAffix(target)});
    } else {
      // Default healing formula used by draining moves like Absorb, Draining Kiss, Bitter Blade, etc.
      healAmount = Utils.toDmgValue(user.turnData.currDamageDealt * this.healRatio);
      message = i18next.t("battle:regainHealth", {pokemonName: getPokemonNameWithAffix(user)});
    }
    if (reverseDrain) {
      if (user.hasAbilityWithAttr(BlockNonDirectDamageAbAttr)) {
        healAmount = 0;
        message = "";
      } else {
        user.turnData.damageTaken += healAmount;
        healAmount = healAmount * -1;
        message = "";
      }
    }
    user.scene.unshiftPhase(new PokemonHealPhase(user.scene, user.getBattlerIndex(), healAmount, message, false, true));
    return true;
  }

  /**
   * Used by the Enemy AI to rank an attack based on a given user
   * @param user {@linkcode Pokemon} using this move
   * @param target {@linkcode Pokemon} target of this move
   * @param move {@linkcode Move} being used
   * @returns an integer. Higher means enemy is more likely to use that move.
   */
  getUserBenefitScore(user: Pokemon, target: Pokemon, move: Move): integer {
    if (this.healStat) {
      const healAmount = target.getBattleStat(this.healStat);
      return Math.floor(Math.max(0, (Math.min(1, (healAmount+user.hp)/user.getMaxHp() - 0.33))) / user.getHpRatio());
    }
    return Math.floor(Math.max((1 - user.getHpRatio()) - 0.33, 0) * (move.power / 4));
  }
}

/**
 * Attribute used for moves that change priority in a turn given a condition,
 * e.g. Grassy Glide
 * Called when move order is calculated in {@linkcode TurnStartPhase}.
 * @extends MoveAttr
 * @see {@linkcode apply}
 */
export class IncrementMovePriorityAttr extends MoveAttr {
  /** The condition for a move's priority being incremented */
  private moveIncrementFunc: (pokemon: Pokemon, target:Pokemon, move: Move) => boolean;
  /** The amount to increment priority by, if condition passes. */
  private increaseAmount: integer;

  constructor(moveIncrementFunc: (pokemon: Pokemon, target:Pokemon, move: Move) => boolean, increaseAmount = 1) {
    super();

    this.moveIncrementFunc = moveIncrementFunc;
    this.increaseAmount = increaseAmount;
  }

  /**
   * Increments move priority by set amount if condition passes
   * @param user {@linkcode Pokemon} using this move
   * @param target {@linkcode Pokemon} target of this move
   * @param move {@linkcode Move} being used
   * @param args [0] {@linkcode Utils.IntegerHolder} for move priority.
   * @returns true if function succeeds
   */
  apply(user: Pokemon, target: Pokemon, move: Move, args: any[]): boolean {
    if (!this.moveIncrementFunc(user, target, move)) {
      return false;
    }

    (args[0] as Utils.IntegerHolder).value += this.increaseAmount;
    return true;
  }
}

/**
 * Attribute used for attack moves that hit multiple times per use, e.g. Bullet Seed.
 *
 * Applied at the beginning of {@linkcode MoveEffectPhase}.
 *
 * @extends MoveAttr
 * @see {@linkcode apply}
 */
export class MultiHitAttr extends MoveAttr {
  private multiHitType: MultiHitType;

  constructor(multiHitType?: MultiHitType) {
    super();

    this.multiHitType = multiHitType !== undefined ? multiHitType : MultiHitType._2_TO_5;
  }

  /**
   * Set the hit count of an attack based on this attribute instance's {@linkcode MultiHitType}.
   * If the target has an immunity to this attack's types, the hit count will always be 1.
   *
   * @param user {@linkcode Pokemon} that used the attack
   * @param target {@linkcode Pokemon} targeted by the attack
   * @param move {@linkcode Move} being used
   * @param args [0] {@linkcode Utils.IntegerHolder} storing the hit count of the attack
   * @returns True
   */
  apply(user: Pokemon, target: Pokemon, move: Move, args: any[]): boolean {
    const hitType = new Utils.NumberHolder(this.multiHitType);
    applyMoveAttrs(ChangeMultiHitTypeAttr, user, target, move, hitType);
    this.multiHitType = hitType.value;

    (args[0] as Utils.NumberHolder).value = this.getHitCount(user, target);
    return true;
  }

  getTargetBenefitScore(user: Pokemon, target: Pokemon, move: Move): number {
    return -5;
  }

  /**
   * Calculate the number of hits that an attack should have given this attribute's
   * {@linkcode MultiHitType}.
   *
   * @param user {@linkcode Pokemon} using the attack
   * @param target {@linkcode Pokemon} targeted by the attack
   * @returns The number of hits this attack should deal
   */
  getHitCount(user: Pokemon, target: Pokemon): integer {
    switch (this.multiHitType) {
    case MultiHitType._2_TO_5:
    {
      const rand = user.randSeedInt(16);
      const hitValue = new Utils.IntegerHolder(rand);
      applyAbAttrs(MaxMultiHitAbAttr, user, null, false, hitValue);
      if (hitValue.value >= 10) {
        return 2;
      } else if (hitValue.value >= 4) {
        return 3;
      } else if (hitValue.value >= 2) {
        return 4;
      } else {
        return 5;
      }
    }
    case MultiHitType._2:
      return 2;
    case MultiHitType._3:
      return 3;
    case MultiHitType._10:
      return 10;
    case MultiHitType.BEAT_UP:
      const party = user.isPlayer() ? user.scene.getParty() : user.scene.getEnemyParty();
      // No status means the ally pokemon can contribute to Beat Up
      return party.reduce((total, pokemon) => {
        return total + (pokemon.id === user.id ? 1 : pokemon?.status && pokemon.status.effect !== StatusEffect.NONE ? 0 : 1);
      }, 0);
    }
  }
}

export class ChangeMultiHitTypeAttr extends MoveAttr {
  apply(user: Pokemon, target: Pokemon, move: Move, args: any[]): boolean {
    //const hitType = args[0] as Utils.NumberHolder;
    return false;
  }
}

export class StatusEffectAttr extends MoveEffectAttr {
  public effect: StatusEffect;
  public cureTurn: integer | null;
  public overrideStatus: boolean;

  constructor(effect: StatusEffect, selfTarget?: boolean, cureTurn?: integer, overrideStatus?: boolean) {
    super(selfTarget, MoveEffectTrigger.HIT);

    this.effect = effect;
    this.cureTurn = cureTurn!; // TODO: is this bang correct?
    this.overrideStatus = !!overrideStatus;
  }

  apply(user: Pokemon, target: Pokemon, move: Move, args: any[]): boolean {
    const moveChance = this.getMoveChance(user, target, move, this.selfTarget, true);
    const statusCheck = moveChance < 0 || moveChance === 100 || user.randSeedInt(100) < moveChance;
    if (statusCheck) {
      const pokemon = this.selfTarget ? user : target;
      if (pokemon.status) {
        if (this.overrideStatus) {
          pokemon.resetStatus();
        } else {
          return false;
        }
      }
      if ((!pokemon.status || (pokemon.status.effect === this.effect && moveChance < 0))
        && pokemon.trySetStatus(this.effect, true, user, this.cureTurn)) {
        applyPostAttackAbAttrs(ConfusionOnStatusEffectAbAttr, user, target, move, null, false, this.effect);
        return true;
      }
    }
    return false;
  }

  getTargetBenefitScore(user: Pokemon, target: Pokemon, move: Move): number {
    const moveChance = this.getMoveChance(user, target, move, this.selfTarget, false);
    return !(this.selfTarget ? user : target).status && (this.selfTarget ? user : target).canSetStatus(this.effect, true, false, user) ? Math.floor(moveChance * -0.1) : 0;
  }
}

export class MultiStatusEffectAttr extends StatusEffectAttr {
  public effects: StatusEffect[];

  constructor(effects: StatusEffect[], selfTarget?: boolean, cureTurn?: integer, overrideStatus?: boolean) {
    super(effects[0], selfTarget, cureTurn, overrideStatus);
    this.effects = effects;
  }

  apply(user: Pokemon, target: Pokemon, move: Move, args: any[]): boolean {
    this.effect = Utils.randSeedItem(this.effects);
    const result = super.apply(user, target, move, args);
    return result;
  }

  getTargetBenefitScore(user: Pokemon, target: Pokemon, move: Move): number {
    const moveChance = this.getMoveChance(user, target, move, this.selfTarget, false);
    return !(this.selfTarget ? user : target).status && (this.selfTarget ? user : target).canSetStatus(this.effect, true, false, user) ? Math.floor(moveChance * -0.1) : 0;
  }
}

export class PsychoShiftEffectAttr extends MoveEffectAttr {
  constructor() {
    super(false, MoveEffectTrigger.HIT);
  }

  apply(user: Pokemon, target: Pokemon, move: Move, args: any[]): boolean {
    const statusToApply: StatusEffect | undefined = user.status?.effect ?? (user.hasAbility(Abilities.COMATOSE) ? StatusEffect.SLEEP : undefined);

    if (target.status) {
      return false;
    }
    //@ts-ignore - how can target.status.effect be checked when we return `false` before when it's defined?
    if (!target.status || (target.status.effect === statusToApply && move.chance < 0)) { // TODO: resolve ts-ignore
      const statusAfflictResult = target.trySetStatus(statusToApply, true, user);
      if (statusAfflictResult) {
        if (user.status) {
          user.scene.queueMessage(getStatusEffectHealText(user.status.effect, getPokemonNameWithAffix(user)));
        }
        user.resetStatus();
        user.updateInfo();
      }
      return statusAfflictResult;
    }

    return false;
  }

  getTargetBenefitScore(user: Pokemon, target: Pokemon, move: Move): number {
    return !(this.selfTarget ? user : target).status && (this.selfTarget ? user : target).canSetStatus(user.status?.effect, true, false, user) ? Math.floor(move.chance * -0.1) : 0;
  }
}
/**
 * The following needs to be implemented for Thief
 * "If the user faints due to the target's Ability (Rough Skin or Iron Barbs) or held Rocky Helmet, it cannot remove the target's held item."
 * "If Knock Off causes a Pokémon with the Sticky Hold Ability to faint, it can now remove that Pokémon's held item."
 */
export class StealHeldItemChanceAttr extends MoveEffectAttr {
  private chance: number;

  constructor(chance: number) {
    super(false, MoveEffectTrigger.HIT);
    this.chance = chance;
  }

  apply(user: Pokemon, target: Pokemon, move: Move, args: any[]): Promise<boolean> {
    return new Promise<boolean>(resolve => {
      const rand = Phaser.Math.RND.realInRange(0, 1);
      if (rand >= this.chance) {
        return resolve(false);
      }
      const heldItems = this.getTargetHeldItems(target).filter(i => i.isTransferrable);
      if (heldItems.length) {
        const poolType = target.isPlayer() ? ModifierPoolType.PLAYER : target.hasTrainer() ? ModifierPoolType.TRAINER : ModifierPoolType.WILD;
        const highestItemTier = heldItems.map(m => m.type.getOrInferTier(poolType)).reduce((highestTier, tier) => Math.max(tier!, highestTier), 0); // TODO: is the bang after tier correct?
        const tierHeldItems = heldItems.filter(m => m.type.getOrInferTier(poolType) === highestItemTier);
        const stolenItem = tierHeldItems[user.randSeedInt(tierHeldItems.length)];
        user.scene.tryTransferHeldItemModifier(stolenItem, user, false).then(success => {
          if (success) {
            user.scene.queueMessage(i18next.t("moveTriggers:stoleItem", {pokemonName: getPokemonNameWithAffix(user), targetName: getPokemonNameWithAffix(target), itemName: stolenItem.type.name}));
          }
          resolve(success);
        });
        return;
      }

      resolve(false);
    });
  }

  getTargetHeldItems(target: Pokemon): PokemonHeldItemModifier[] {
    return target.scene.findModifiers(m => m instanceof PokemonHeldItemModifier
      && m.pokemonId === target.id, target.isPlayer()) as PokemonHeldItemModifier[];
  }

  getUserBenefitScore(user: Pokemon, target: Pokemon, move: Move): number {
    const heldItems = this.getTargetHeldItems(target);
    return heldItems.length ? 5 : 0;
  }

  getTargetBenefitScore(user: Pokemon, target: Pokemon, move: Move): number {
    const heldItems = this.getTargetHeldItems(target);
    return heldItems.length ? -5 : 0;
  }
}

/**
 * Removes a random held item (or berry) from target.
 * Used for Incinerate and Knock Off.
 * Not Implemented Cases: (Same applies for Thief)
 * "If the user faints due to the target's Ability (Rough Skin or Iron Barbs) or held Rocky Helmet, it cannot remove the target's held item."
 * "If Knock Off causes a Pokémon with the Sticky Hold Ability to faint, it can now remove that Pokémon's held item."
 */
export class RemoveHeldItemAttr extends MoveEffectAttr {

  /** Optional restriction for item pool to berries only i.e. Differentiating Incinerate and Knock Off */
  private berriesOnly: boolean;

  constructor(berriesOnly: boolean) {
    super(false, MoveEffectTrigger.HIT);
    this.berriesOnly = berriesOnly;
  }

  /**
   *
   * @param user {@linkcode Pokemon} that used the move
   * @param target Target {@linkcode Pokemon} that the moves applies to
   * @param move {@linkcode Move} that is used
   * @param args N/A
   * @returns {boolean} True if an item was removed
   */
  apply(user: Pokemon, target: Pokemon, move: Move, args: any[]): boolean {
    if (!this.berriesOnly && target.isPlayer()) { // "Wild Pokemon cannot knock off Player Pokemon's held items" (See Bulbapedia)
      return false;
    }

    const cancelled = new Utils.BooleanHolder(false);
    applyAbAttrs(BlockItemTheftAbAttr, target, cancelled); // Check for abilities that block item theft

    if (cancelled.value === true) {
      return false;
    }

    // Considers entire transferrable item pool by default (Knock Off). Otherwise berries only if specified (Incinerate).
    let heldItems = this.getTargetHeldItems(target).filter(i => i.isTransferrable);

    if (this.berriesOnly) {
      heldItems = heldItems.filter(m => m instanceof BerryModifier && m.pokemonId === target.id, target.isPlayer());
    }

    if (heldItems.length) {
      const removedItem = heldItems[user.randSeedInt(heldItems.length)];

      // Decrease item amount and update icon
      !--removedItem.stackCount;
      target.scene.updateModifiers(target.isPlayer());

      if (this.berriesOnly) {
        user.scene.queueMessage(i18next.t("moveTriggers:incineratedItem", {pokemonName: getPokemonNameWithAffix(user), targetName: getPokemonNameWithAffix(target), itemName: removedItem.type.name}));
      } else {
        user.scene.queueMessage(i18next.t("moveTriggers:knockedOffItem", {pokemonName: getPokemonNameWithAffix(user), targetName: getPokemonNameWithAffix(target), itemName: removedItem.type.name}));
      }
    }

    return true;
  }

  getTargetHeldItems(target: Pokemon): PokemonHeldItemModifier[] {
    return target.scene.findModifiers(m => m instanceof PokemonHeldItemModifier
      && m.pokemonId === target.id, target.isPlayer()) as PokemonHeldItemModifier[];
  }

  getUserBenefitScore(user: Pokemon, target: Pokemon, move: Move): number {
    const heldItems = this.getTargetHeldItems(target);
    return heldItems.length ? 5 : 0;
  }

  getTargetBenefitScore(user: Pokemon, target: Pokemon, move: Move): number {
    const heldItems = this.getTargetHeldItems(target);
    return heldItems.length ? -5 : 0;
  }
}

/**
 * Attribute that causes targets of the move to eat a berry. Used for Teatime, Stuff Cheeks
 */
export class EatBerryAttr extends MoveEffectAttr {
  protected chosenBerry: BerryModifier | undefined;
  constructor() {
    super(true, MoveEffectTrigger.HIT);
  }
  /**
   * Causes the target to eat a berry.
   * @param user {@linkcode Pokemon} Pokemon that used the move
   * @param target {@linkcode Pokemon} Pokemon that will eat a berry
   * @param move {@linkcode Move} The move being used
   * @param args Unused
   * @returns {boolean} true if the function succeeds
   */
  apply(user: Pokemon, target: Pokemon, move: Move, args: any[]): boolean {
    if (!super.apply(user, target, move, args)) {
      return false;
    }

    const heldBerries = this.getTargetHeldBerries(target);
    if (heldBerries.length <= 0) {
      return false;
    }
    this.chosenBerry = heldBerries[user.randSeedInt(heldBerries.length)];
    const preserve = new Utils.BooleanHolder(false);
    target.scene.applyModifiers(PreserveBerryModifier, target.isPlayer(), target, preserve); // check for berry pouch preservation
    if (!preserve.value) {
      this.reduceBerryModifier(target);
    }
    this.eatBerry(target);
    return true;
  }

  getTargetHeldBerries(target: Pokemon): BerryModifier[] {
    return target.scene.findModifiers(m => m instanceof BerryModifier
      && (m as BerryModifier).pokemonId === target.id, target.isPlayer()) as BerryModifier[];
  }

  reduceBerryModifier(target: Pokemon) {
    if (this.chosenBerry?.stackCount === 1) {
      target.scene.removeModifier(this.chosenBerry, !target.isPlayer());
    } else if (this.chosenBerry !== undefined && this.chosenBerry.stackCount > 1) {
      this.chosenBerry.stackCount--;
    }
    target.scene.updateModifiers(target.isPlayer());
  }

  eatBerry(consumer: Pokemon) {
    getBerryEffectFunc(this.chosenBerry!.berryType)(consumer); // consumer eats the berry
    applyAbAttrs(HealFromBerryUseAbAttr, consumer, new Utils.BooleanHolder(false));
  }
}

/**
 *  Attribute used for moves that steal a random berry from the target. The user then eats the stolen berry.
 *  Used for Pluck & Bug Bite.
 */
export class StealEatBerryAttr extends EatBerryAttr {
  constructor() {
    super();
  }
  /**
   * User steals a random berry from the target and then eats it.
   * @param {Pokemon} user Pokemon that used the move and will eat the stolen berry
   * @param {Pokemon} target Pokemon that will have its berry stolen
   * @param {Move} move Move being used
   * @param {any[]} args Unused
   * @returns {boolean} true if the function succeeds
   */
  apply(user: Pokemon, target: Pokemon, move: Move, args: any[]): boolean {
    const cancelled = new Utils.BooleanHolder(false);
    applyAbAttrs(BlockItemTheftAbAttr, target, cancelled); // check for abilities that block item theft
    if (cancelled.value === true) {
      return false;
    }

    const heldBerries = this.getTargetHeldBerries(target);
    if (heldBerries.length <= 0) {
      return false;
    }
    // if the target has berries, pick a random berry and steal it
    this.chosenBerry = heldBerries[user.randSeedInt(heldBerries.length)];
    const message = i18next.t("battle:stealEatBerry", {pokemonName: user.name, targetName: target.name, berryName: this.chosenBerry.type.name});
    user.scene.queueMessage(message);
    this.reduceBerryModifier(target);
    this.eatBerry(user);
    return true;
  }
}

/**
 * Move attribute that signals that the move should cure a status effect
 * @extends MoveEffectAttr
 * @see {@linkcode apply()}
 */
export class HealStatusEffectAttr extends MoveEffectAttr {
  /** List of Status Effects to cure */
  private effects: StatusEffect[];

  /**
   * @param selfTarget - Whether this move targets the user
   * @param ...effects - List of status effects to cure
   */
  constructor(selfTarget: boolean, ...effects: StatusEffect[]) {
    super(selfTarget, MoveEffectTrigger.POST_APPLY, false, true);

    this.effects = effects;
  }

  /**
   * @param user {@linkcode Pokemon} source of the move
   * @param target {@linkcode Pokemon} target of the move
   * @param move the {@linkcode Move} being used
   * @returns true if the status is cured
   */
  apply(user: Pokemon, target: Pokemon, move: Move, args: any[]): boolean {
    if (!super.apply(user, target, move, args)) {
      return false;
    }

    const pokemon = this.selfTarget ? user : target;
    if (pokemon.status && this.effects.includes(pokemon.status.effect)) {
      pokemon.scene.queueMessage(getStatusEffectHealText(pokemon.status.effect, getPokemonNameWithAffix(pokemon)));
      pokemon.resetStatus();
      pokemon.updateInfo();

      return true;
    }

    return false;
  }

  isOfEffect(effect: StatusEffect): boolean {
    return this.effects.includes(effect);
  }

  getUserBenefitScore(user: Pokemon, target: Pokemon, move: Move): integer {
    return user.status ? 10 : 0;
  }
}

export class BypassSleepAttr extends MoveAttr {
  apply(user: Pokemon, target: Pokemon, move: Move, args: any[]): boolean {
    if (user.status?.effect === StatusEffect.SLEEP) {
      user.addTag(BattlerTagType.BYPASS_SLEEP, 1, move.id, user.id);
      return true;
    }

    return false;
  }
}

/**
 * Attribute used for moves that bypass the burn damage reduction of physical moves, currently only facade
 * Called during damage calculation
 * @extends MoveAttr
 * @see {@linkcode apply}
 */
export class BypassBurnDamageReductionAttr extends MoveAttr {
  /** Prevents the move's damage from being reduced by burn
   * @param user N/A
   * @param target N/A
   * @param move {@linkcode Move} with this attribute
   * @param args [0] {@linkcode Utils.BooleanHolder} for burnDamageReductionCancelled
   * @returns true if the function succeeds
   */
  apply(user: Pokemon, target: Pokemon, move: Move, args: any[]): boolean {
    (args[0] as Utils.BooleanHolder).value = true;

    return true;
  }
}

export class WeatherChangeAttr extends MoveEffectAttr {
  private weatherType: WeatherType;

  constructor(weatherType: WeatherType) {
    super();

    this.weatherType = weatherType;
  }

  apply(user: Pokemon, target: Pokemon, move: Move, args: any[]): boolean {
    return user.scene.arena.trySetWeather(this.weatherType, true);
  }

  getCondition(): MoveConditionFunc {
    return (user, target, move) => !user.scene.arena.weather || (user.scene.arena.weather.weatherType !== this.weatherType && !user.scene.arena.weather.isImmutable());
  }
}

export class ClearWeatherAttr extends MoveEffectAttr {
  private weatherType: WeatherType;

  constructor(weatherType: WeatherType) {
    super();

    this.weatherType = weatherType;
  }

  apply(user: Pokemon, target: Pokemon, move: Move, args: any[]): boolean {
    if (user.scene.arena.weather?.weatherType === this.weatherType) {
      return user.scene.arena.trySetWeather(WeatherType.NONE, true);
    }

    return false;
  }
}

export class TerrainChangeAttr extends MoveEffectAttr {
  private terrainType: TerrainType;

  constructor(terrainType: TerrainType) {
    super();

    this.terrainType = terrainType;
  }

  apply(user: Pokemon, target: Pokemon, move: Move, args: any[]): boolean {
    return user.scene.arena.trySetTerrain(this.terrainType, true, true);
  }

  getCondition(): MoveConditionFunc {
    return (user, target, move) => !user.scene.arena.terrain || (user.scene.arena.terrain.terrainType !== this.terrainType);
  }

  getUserBenefitScore(user: Pokemon, target: Pokemon, move: Move): number {
    // TODO: Expand on this
    return user.scene.arena.terrain ? 0 : 6;
  }
}

export class ClearTerrainAttr extends MoveEffectAttr {
  constructor() {
    super();
  }

  apply(user: Pokemon, target: Pokemon, move: Move, args: any[]): boolean {
    return user.scene.arena.trySetTerrain(TerrainType.NONE, true, true);
  }
}

export class OneHitKOAttr extends MoveAttr {
  apply(user: Pokemon, target: Pokemon, move: Move, args: any[]): boolean {
    if (target.isBossImmune()) {
      return false;
    }

    (args[0] as Utils.BooleanHolder).value = true;

    return true;
  }

  getCondition(): MoveConditionFunc {
    return (user, target, move) => {
      const cancelled = new Utils.BooleanHolder(false);
      applyAbAttrs(BlockOneHitKOAbAttr, target, cancelled);
      return !cancelled.value && user.level >= target.level;
    };
  }
}

export class OverrideMoveEffectAttr extends MoveAttr {
  apply(user: Pokemon, target: Pokemon, move: Move, args: any[]): boolean | Promise<boolean> {
    //const overridden = args[0] as Utils.BooleanHolder;
    //const virtual = arg[1] as boolean;
    return true;
  }
}

export class ChargeAttr extends OverrideMoveEffectAttr {
  public chargeAnim: ChargeAnim;
  private chargeText: string;
  private tagType: BattlerTagType | null;
  private chargeEffect: boolean;
  public followUpPriority: integer | null;

  constructor(chargeAnim: ChargeAnim, chargeText: string, tagType?: BattlerTagType | null, chargeEffect: boolean = false) {
    super();

    this.chargeAnim = chargeAnim;
    this.chargeText = chargeText;
    this.tagType = tagType!; // TODO: is this bang correct?
    this.chargeEffect = chargeEffect;
  }

  apply(user: Pokemon, target: Pokemon, move: Move, args: any[]): Promise<boolean> {
    return new Promise(resolve => {
      const lastMove = user.getLastXMoves().find(() => true);
      if (!lastMove || lastMove.move !== move.id || (lastMove.result !== MoveResult.OTHER && lastMove.turn !== user.scene.currentBattle.turn)) {
        (args[0] as Utils.BooleanHolder).value = true;
        new MoveChargeAnim(this.chargeAnim, move.id, user).play(user.scene, () => {
          user.scene.queueMessage(this.chargeText.replace("{TARGET}", getPokemonNameWithAffix(target)).replace("{USER}", getPokemonNameWithAffix(user)));
          if (this.tagType) {
            user.addTag(this.tagType, 1, move.id, user.id);
          }
          if (this.chargeEffect) {
            applyMoveAttrs(MoveEffectAttr, user, target, move);
          }
          user.pushMoveHistory({ move: move.id, targets: [ target.getBattlerIndex() ], result: MoveResult.OTHER });
          user.getMoveQueue().push({ move: move.id, targets: [ target.getBattlerIndex() ], ignorePP: true });
          user.addTag(BattlerTagType.CHARGING, 1, move.id, user.id);
          resolve(true);
        });
      } else {
        user.lapseTag(BattlerTagType.CHARGING);
        resolve(false);
      }
    });
  }

  usedChargeEffect(user: Pokemon, target: Pokemon | null, move: Move): boolean {
    if (!this.chargeEffect) {
      return false;
    }
    // Account for move history being populated when this function is called
    const lastMoves = user.getLastXMoves(2);
    return lastMoves.length === 2 && lastMoves[1].move === move.id && lastMoves[1].result === MoveResult.OTHER;
  }
}

export class SunlightChargeAttr extends ChargeAttr {
  constructor(chargeAnim: ChargeAnim, chargeText: string) {
    super(chargeAnim, chargeText);
  }

  apply(user: Pokemon, target: Pokemon, move: Move, args: any[]): Promise<boolean> {
    return new Promise(resolve => {
      const weatherType = user.scene.arena.weather?.weatherType;
      if (!user.scene.arena.weather?.isEffectSuppressed(user.scene) && (weatherType === WeatherType.SUNNY || weatherType === WeatherType.HARSH_SUN)) {
        resolve(false);
      } else {
        super.apply(user, target, move, args).then(result => resolve(result));
      }
    });
  }
}

export class ElectroShotChargeAttr extends ChargeAttr {
  private statIncreaseApplied: boolean;
  constructor() {
    super(ChargeAnim.ELECTRO_SHOT_CHARGING, i18next.t("moveTriggers:absorbedElectricity", {pokemonName: "{USER}"}), null, true);
    // Add a flag because ChargeAttr skills use themselves twice instead of once over one-to-two turns
    this.statIncreaseApplied = false;
  }

  apply(user: Pokemon, target: Pokemon, move: Move, args: any[]): Promise<boolean> {
    return new Promise(resolve => {
      const weatherType = user.scene.arena.weather?.weatherType;
      if (!user.scene.arena.weather?.isEffectSuppressed(user.scene) && (weatherType === WeatherType.RAIN || weatherType === WeatherType.HEAVY_RAIN)) {
        // Apply the SPEC increase every call when used in the rain
        const statChangeAttr = new StatChangeAttr(BattleStat.SPEC, 1, true);
        statChangeAttr.apply(user, target, move, args);
        // After the SPEC is raised, execute the move resolution e.g. deal damage
        resolve(false);
      } else {
        if (!this.statIncreaseApplied) {
          // Apply the SPEC increase only if it hasn't been applied before e.g. on the first turn charge up animation
          const statChangeAttr = new StatChangeAttr(BattleStat.SPEC, 1, true);
          statChangeAttr.apply(user, target, move, args);
          // Set the flag to true so that on the following turn it doesn't raise SPEC a second time
          this.statIncreaseApplied = true;
        }
        super.apply(user, target, move, args).then(result => {
          if (!result) {
            // On the second turn, reset the statIncreaseApplied flag without applying the SPEC increase
            this.statIncreaseApplied = false;
          }
          resolve(result);
        });
      }
    });
  }
}

export class DelayedAttackAttr extends OverrideMoveEffectAttr {
  public tagType: ArenaTagType;
  public chargeAnim: ChargeAnim;
  private chargeText: string;

  constructor(tagType: ArenaTagType, chargeAnim: ChargeAnim, chargeText: string) {
    super();

    this.tagType = tagType;
    this.chargeAnim = chargeAnim;
    this.chargeText = chargeText;
  }

  apply(user: Pokemon, target: Pokemon, move: Move, args: any[]): Promise<boolean> {
    return new Promise(resolve => {
      if (args.length < 2 || !args[1]) {
        new MoveChargeAnim(this.chargeAnim, move.id, user).play(user.scene, () => {
          (args[0] as Utils.BooleanHolder).value = true;
          user.scene.queueMessage(this.chargeText.replace("{TARGET}", getPokemonNameWithAffix(target)).replace("{USER}", getPokemonNameWithAffix(user)));
          user.pushMoveHistory({ move: move.id, targets: [ target.getBattlerIndex() ], result: MoveResult.OTHER });
          user.scene.arena.addTag(this.tagType, 3, move.id, user.id, ArenaTagSide.BOTH, false, target.getBattlerIndex());

          resolve(true);
        });
      } else {
        user.scene.ui.showText(i18next.t("moveTriggers:tookMoveAttack", {pokemonName: getPokemonNameWithAffix(user.scene.getPokemonById(target.id) ?? undefined), moveName: move.name}), null, () => resolve(true));
      }
    });
  }
}

export class StatChangeAttr extends MoveEffectAttr {
  public stats: BattleStat[];
  public levels: integer;
  private condition: MoveConditionFunc | null;
  private showMessage: boolean;

  constructor(stats: BattleStat | BattleStat[], levels: integer, selfTarget?: boolean, condition?: MoveConditionFunc | null, showMessage: boolean = true, firstHitOnly: boolean = false, moveEffectTrigger: MoveEffectTrigger = MoveEffectTrigger.HIT, firstTargetOnly: boolean = false) {
    super(selfTarget, moveEffectTrigger, firstHitOnly, false, firstTargetOnly);
    this.stats = typeof(stats) === "number"
      ? [ stats as BattleStat ]
      : stats as BattleStat[];
    this.levels = levels;
    this.condition = condition!; // TODO: is this bang correct?
    this.showMessage = showMessage;
  }

  apply(user: Pokemon, target: Pokemon, move: Move, args?: any[]): boolean | Promise<boolean> {
    if (!super.apply(user, target, move, args) || (this.condition && !this.condition(user, target, move))) {
      return false;
    }

    const moveChance = this.getMoveChance(user, target, move, this.selfTarget, true);
    if (moveChance < 0 || moveChance === 100 || user.randSeedInt(100) < moveChance) {
      const levels = this.getLevels(user);
      user.scene.unshiftPhase(new StatChangePhase(user.scene, (this.selfTarget ? user : target).getBattlerIndex(), this.selfTarget, this.stats, levels, this.showMessage));
      return true;
    }

    return false;
  }

  getLevels(_user: Pokemon): integer {
    return this.levels;
  }

  getTargetBenefitScore(user: Pokemon, target: Pokemon, move: Move): integer {
    let ret = 0;
    const moveLevels = this.getLevels(user);
    for (const stat of this.stats) {
      let levels = moveLevels;
      if (levels > 0) {
        levels = Math.min(target.summonData.battleStats[stat] + levels, 6) - target.summonData.battleStats[stat];
      } else {
        levels = Math.max(target.summonData.battleStats[stat] + levels, -6) - target.summonData.battleStats[stat];
      }
      let noEffect = false;
      switch (stat) {
      case BattleStat.ATK:
        if (this.selfTarget) {
          noEffect = !user.getMoveset().find(m => m instanceof AttackMove && m.category === MoveCategory.PHYSICAL);
        }
        break;
      case BattleStat.DEF:
        if (!this.selfTarget) {
          noEffect = !user.getMoveset().find(m => m instanceof AttackMove && m.category === MoveCategory.PHYSICAL);
        }
        break;
      case BattleStat.SPEC:
        if (this.selfTarget) {
          noEffect = !user.getMoveset().find(m => m instanceof AttackMove && m.category === MoveCategory.SPECIAL);
        }
        break;
      case BattleStat.SPEC:
        if (!this.selfTarget) {
          noEffect = !user.getMoveset().find(m => m instanceof AttackMove && m.category === MoveCategory.SPECIAL);
        }
        break;
      }
      if (noEffect) {
        continue;
      }
      ret += (levels * 4) + (levels > 0 ? -2 : 2);
    }
    return ret;
  }
}

export class PostVictoryStatChangeAttr extends MoveAttr {
  private stats: BattleStat[];
  private levels: integer;
  private condition: MoveConditionFunc | null;
  private showMessage: boolean;

  constructor(stats: BattleStat | BattleStat[], levels: integer, selfTarget?: boolean, condition?: MoveConditionFunc, showMessage: boolean = true, firstHitOnly: boolean = false) {
    super();
    this.stats = typeof(stats) === "number"
      ? [ stats as BattleStat ]
      : stats as BattleStat[];
    this.levels = levels;
    this.condition = condition!; // TODO: is this bang correct?
    this.showMessage = showMessage;
  }
  applyPostVictory(user: Pokemon, target: Pokemon, move: Move): void {
    if (this.condition && !this.condition(user, target, move)) {
      return;
    }
    const statChangeAttr = new StatChangeAttr(this.stats, this.levels, this.showMessage);
    statChangeAttr.apply(user, target, move);
  }
}

export class AcupressureStatChangeAttr extends MoveEffectAttr {
  constructor() {
    super();
  }

  apply(user: Pokemon, target: Pokemon, move: Move, args: any[]): boolean | Promise<boolean> {
    let randStats = [ BattleStat.ATK, BattleStat.DEF, BattleStat.SPEC, BattleStat.SPEC, BattleStat.SPD, BattleStat.ACC, BattleStat.EVA ];
    randStats = randStats.filter(s => target.summonData.battleStats[s] < 6);
    if (randStats.length > 0) {
      const boostStat = [randStats[Utils.randInt(randStats.length)]];
      user.scene.unshiftPhase(new StatChangePhase(user.scene, target.getBattlerIndex(), this.selfTarget, boostStat, 2));
      return true;
    }
    return false;
  }
}

export class GrowthStatChangeAttr extends StatChangeAttr {
  constructor() {
    super([ BattleStat.ATK, BattleStat.SPEC ], 1, true);
  }

  getLevels(user: Pokemon): number {
    if (!user.scene.arena.weather?.isEffectSuppressed(user.scene)) {
      const weatherType = user.scene.arena.weather?.weatherType;
      if (weatherType === WeatherType.SUNNY || weatherType === WeatherType.HARSH_SUN) {
        return this.levels + 1;
      }
    }
    return this.levels;
  }
}

export class CutHpStatBoostAttr extends StatChangeAttr {
  private cutRatio: integer;
  private messageCallback: ((user: Pokemon) => void) | undefined;

  constructor(stat: BattleStat | BattleStat[], levels: integer, cutRatio: integer, messageCallback?: ((user: Pokemon) => void) | undefined) {
    super(stat, levels, true, null, true);

    this.cutRatio = cutRatio;
    this.messageCallback = messageCallback;
  }

  apply(user: Pokemon, target: Pokemon, move: Move, args: any[]): Promise<boolean> {
    return new Promise<boolean>(resolve => {
      user.damageAndUpdate(Utils.toDmgValue(user.getMaxHp() / this.cutRatio), HitResult.OTHER, false, true);
      user.updateInfo().then(() => {
        const ret = super.apply(user, target, move, args);
        if (this.messageCallback) {
          this.messageCallback(user);
        }
        resolve(ret);
      });
    });
  }

  getCondition(): MoveConditionFunc {
    return (user, target, move) => user.getHpRatio() > 1 / this.cutRatio && this.stats.some(s => user.summonData.battleStats[s] < 6);
  }
}

export class CopyStatsAttr extends MoveEffectAttr {
  apply(user: Pokemon, target: Pokemon, move: Move, args: any[]): boolean {
    if (!super.apply(user, target, move, args)) {
      return false;
    }

    for (let s = 0; s < target.summonData.battleStats.length; s++) {
      user.summonData.battleStats[s] = target.summonData.battleStats[s];
    }
    if (target.getTag(BattlerTagType.CRIT_BOOST)) {
      user.addTag(BattlerTagType.CRIT_BOOST, 0, move.id);
    } else {
      user.removeTag(BattlerTagType.CRIT_BOOST);
    }
    target.updateInfo();
    user.updateInfo();
    target.scene.queueMessage(i18next.t("moveTriggers:copiedStatChanges", {pokemonName: getPokemonNameWithAffix(user), targetName: getPokemonNameWithAffix(target)}));

    return true;
  }
}

export class InvertStatsAttr extends MoveEffectAttr {
  apply(user: Pokemon, target: Pokemon, move: Move, args: any[]): boolean {
    if (!super.apply(user, target, move, args)) {
      return false;
    }

    for (let s = 0; s < target.summonData.battleStats.length; s++) {
      target.summonData.battleStats[s] *= -1;
    }
    target.updateInfo();
    user.updateInfo();

    target.scene.queueMessage(i18next.t("moveTriggers:invertStats", {pokemonName: getPokemonNameWithAffix(target)}));

    return true;
  }
}

export class ResetStatsAttr extends MoveEffectAttr {
  private targetAllPokemon: boolean;
  constructor(targetAllPokemon: boolean) {
    super();
    this.targetAllPokemon = targetAllPokemon;
  }
  apply(user: Pokemon, target: Pokemon, move: Move, args: any[]): boolean {
    if (!super.apply(user, target, move, args)) {
      return false;
    }

    if (this.targetAllPokemon) { // Target all pokemon on the field when Freezy Frost or Haze are used
      const activePokemon = user.scene.getField(true);
      activePokemon.forEach(p => this.resetStats(p));
      target.scene.queueMessage(i18next.t("moveTriggers:statEliminated"));
    } else { // Affects only the single target when Clear Smog is used
      this.resetStats(target);
      target.scene.queueMessage(i18next.t("moveTriggers:resetStats", {pokemonName: getPokemonNameWithAffix(target)}));
    }

    return true;
  }

  resetStats(pokemon: Pokemon) {
    for (let s = 0; s < pokemon.summonData.battleStats.length; s++) {
      pokemon.summonData.battleStats[s] = 0;
    }
    pokemon.updateInfo();
  }
}

/**
 * Attribute used for moves which swap the user and the target's stat changes.
 */
export class SwapStatsAttr extends MoveEffectAttr {
  /**
   * Swaps the user and the target's stat changes.
   * @param user Pokemon that used the move
   * @param target The target of the move
   * @param move Move with this attribute
   * @param args N/A
   * @returns true if the function succeeds
   */
  apply(user: Pokemon, target: Pokemon, move: Move, args: any []): boolean {
    if (!super.apply(user, target, move, args)) {
      return false;
    } //Exits if the move can't apply
    let priorBoost : integer; //For storing a stat boost
    for (let s = 0; s < target.summonData.battleStats.length; s++) {
      priorBoost = user.summonData.battleStats[s]; //Store user stat boost
      user.summonData.battleStats[s] = target.summonData.battleStats[s]; //Applies target boost to self
      target.summonData.battleStats[s] = priorBoost; //Applies stored boost to target
    }
    target.updateInfo();
    user.updateInfo();
    target.scene.queueMessage(i18next.t("moveTriggers:switchedStatChanges", {pokemonName: getPokemonNameWithAffix(user)}));
    return true;
  }
}

export class HpSplitAttr extends MoveEffectAttr {
  apply(user: Pokemon, target: Pokemon, move: Move, args: any[]): Promise<boolean> {
    return new Promise(resolve => {
      if (!super.apply(user, target, move, args)) {
        return resolve(false);
      }

      const infoUpdates: Promise<void>[] = [];

      const hpValue = Math.floor((target.hp + user.hp) / 2);
      if (user.hp < hpValue) {
        const healing = user.heal(hpValue - user.hp);
        if (healing) {
          user.scene.damageNumberHandler.add(user, healing, HitResult.HEAL);
        }
      } else if (user.hp > hpValue) {
        const damage = user.damage(user.hp - hpValue, true);
        if (damage) {
          user.scene.damageNumberHandler.add(user, damage);
        }
      }
      infoUpdates.push(user.updateInfo());

      if (target.hp < hpValue) {
        const healing = target.heal(hpValue - target.hp);
        if (healing) {
          user.scene.damageNumberHandler.add(user, healing, HitResult.HEAL);
        }
      } else if (target.hp > hpValue) {
        const damage = target.damage(target.hp - hpValue, true);
        if (damage) {
          target.scene.damageNumberHandler.add(target, damage);
        }
      }
      infoUpdates.push(target.updateInfo());

      return Promise.all(infoUpdates).then(() => resolve(true));
    });
  }
}

export class VariablePowerAttr extends MoveAttr {
  apply(user: Pokemon, target: Pokemon, move: Move, args: any[]): boolean {
    //const power = args[0] as Utils.NumberHolder;
    return false;
  }
}

export class LessPPMorePowerAttr extends VariablePowerAttr {
  /**
   * Power up moves when less PP user has
   * @param user {@linkcode Pokemon} using this move
   * @param target {@linkcode Pokemon} target of this move
   * @param move {@linkcode Move} being used
   * @param args [0] {@linkcode Utils.NumberHolder} of power
   * @returns true if the function succeeds
   */
  apply(user: Pokemon, target: Pokemon, move: Move, args: any[]): boolean {
    const ppMax = move.pp;
    const ppUsed = user.moveset.find((m) => m?.moveId === move.id)?.ppUsed!; // TODO: is the bang correct?

    let ppRemains = ppMax - ppUsed;
    /** Reduce to 0 to avoid negative numbers if user has 1PP before attack and target has Ability.PRESSURE */
    if (ppRemains < 0) {
      ppRemains = 0;
    }

    const power = args[0] as Utils.NumberHolder;

    switch (ppRemains) {
    case 0:
      power.value = 200;
      break;
    case 1:
      power.value = 80;
      break;
    case 2:
      power.value = 60;
      break;
    case 3:
      power.value = 50;
      break;
    default:
      power.value = 40;
      break;
    }
    return true;
  }
}

export class MovePowerMultiplierAttr extends VariablePowerAttr {
  private powerMultiplierFunc: (user: Pokemon, target: Pokemon, move: Move) => number;

  constructor(powerMultiplier: (user: Pokemon, target: Pokemon, move: Move) => number) {
    super();

    this.powerMultiplierFunc = powerMultiplier;
  }

  apply(user: Pokemon, target: Pokemon, move: Move, args: any[]): boolean {
    const power = args[0] as Utils.NumberHolder;
    power.value *= this.powerMultiplierFunc(user, target, move);

    return true;
  }
}

/**
 * Helper function to calculate the the base power of an ally's hit when using Beat Up.
 * @param user The Pokemon that used Beat Up.
 * @param allyIndex The party position of the ally contributing to Beat Up.
 * @returns The base power of the Beat Up hit.
 */
const beatUpFunc = (user: Pokemon, allyIndex: number): number => {
  const party = user.isPlayer() ? user.scene.getParty() : user.scene.getEnemyParty();

  for (let i = allyIndex; i < party.length; i++) {
    const pokemon = party[i];

    // The user contributes to Beat Up regardless of status condition.
    // Allies can contribute only if they do not have a non-volatile status condition.
    if (pokemon.id !== user.id && pokemon?.status && pokemon.status.effect !== StatusEffect.NONE) {
      continue;
    }
    return (pokemon.species.getBaseStat(Stat.ATK) / 10) + 5;
  }
  return 0;
};

export class BeatUpAttr extends VariablePowerAttr {

  /**
   * Gets the next party member to contribute to a Beat Up hit, and calculates the base power for it.
   * @param user Pokemon that used the move
   * @param _target N/A
   * @param _move Move with this attribute
   * @param args N/A
   * @returns true if the function succeeds
   */
  apply(user: Pokemon, target: Pokemon, move: Move, args: any[]): boolean {
    const power = args[0] as Utils.NumberHolder;

    const party = user.isPlayer() ? user.scene.getParty() : user.scene.getEnemyParty();
    const allyCount = party.filter(pokemon => {
      return pokemon.id === user.id || !pokemon.status?.effect;
    }).length;
    const allyIndex = (user.turnData.hitCount - user.turnData.hitsLeft) % allyCount;
    power.value = beatUpFunc(user, allyIndex);
    return true;
  }
}

export class DoublePowerChanceAttr extends VariablePowerAttr {
  apply(user: Pokemon, target: Pokemon, move: Move, args: any[]): boolean {
    let rand: integer;
    user.scene.executeWithSeedOffset(() => rand = Utils.randSeedInt(100), user.scene.currentBattle.turn << 6, user.scene.waveSeed);
    if (rand! < move.chance) {
      const power = args[0] as Utils.NumberHolder;
      power.value *= 2;
      return true;
    }

    return false;
  }
}

export abstract class ConsecutiveUsePowerMultiplierAttr extends MovePowerMultiplierAttr {
  constructor(limit: integer, resetOnFail: boolean, resetOnLimit?: boolean, ...comboMoves: Moves[]) {
    super((user: Pokemon, target: Pokemon, move: Move): number => {
      const moveHistory = user.getLastXMoves(limit + 1).slice(1);

      let count = 0;
      let turnMove: TurnMove | undefined;

      while (((turnMove = moveHistory.shift())?.move === move.id || (comboMoves.length && comboMoves.includes(turnMove?.move!))) && (!resetOnFail || turnMove?.result === MoveResult.SUCCESS)) { // TODO: is this bang correct?
        if (count < (limit - 1)) {
          count++;
        } else if (resetOnLimit) {
          count = 0;
        } else {
          break;
        }
      }

      return this.getMultiplier(count);
    });
  }

  abstract getMultiplier(count: integer): number;
}

export class ConsecutiveUseDoublePowerAttr extends ConsecutiveUsePowerMultiplierAttr {
  getMultiplier(count: number): number {
    return Math.pow(2, count);
  }
}

export class ConsecutiveUseMultiBasePowerAttr extends ConsecutiveUsePowerMultiplierAttr {
  getMultiplier(count: number): number {
    return (count + 1);
  }
}

export class WeightPowerAttr extends VariablePowerAttr {
  apply(user: Pokemon, target: Pokemon, move: Move, args: any[]): boolean {
    const power = args[0] as Utils.NumberHolder;

    const targetWeight = target.getWeight();
    const weightThresholds = [ 10, 25, 50, 100, 200 ];

    let w = 0;
    while (targetWeight >= weightThresholds[w]) {
      if (++w === weightThresholds.length) {
        break;
      }
    }

    power.value = (w + 1) * 20;

    return true;
  }
}

/**
 * Attribute used for Electro Ball move.
 * @extends VariablePowerAttr
 * @see {@linkcode apply}
 **/
export class ElectroBallPowerAttr extends VariablePowerAttr {
  /**
   * Move that deals more damage the faster {@linkcode BattleStat.SPD}
   * the user is compared to the target.
   * @param user Pokemon that used the move
   * @param target The target of the move
   * @param move Move with this attribute
   * @param args N/A
   * @returns true if the function succeeds
   */
  apply(user: Pokemon, target: Pokemon, move: Move, args: any[]): boolean {
    const power = args[0] as Utils.NumberHolder;

    const statRatio = target.getBattleStat(Stat.SPD) / user.getBattleStat(Stat.SPD);
    const statThresholds = [ 0.25, 1 / 3, 0.5, 1, -1 ];
    const statThresholdPowers = [ 150, 120, 80, 60, 40 ];

    let w = 0;
    while (w < statThresholds.length - 1 && statRatio > statThresholds[w]) {
      if (++w === statThresholds.length) {
        break;
      }
    }

    power.value = statThresholdPowers[w];
    return true;
  }
}


/**
 * Attribute used for Gyro Ball move.
 * @extends VariablePowerAttr
 * @see {@linkcode apply}
 **/
export class GyroBallPowerAttr extends VariablePowerAttr {
  /**
   * Move that deals more damage the slower {@linkcode BattleStat.SPD}
   * the user is compared to the target.
   * @param user Pokemon that used the move
   * @param target The target of the move
   * @param move Move with this attribute
   * @param args N/A
   * @returns true if the function succeeds
   */
  apply(user: Pokemon, target: Pokemon, move: Move, args: any[]): boolean {
    const power = args[0] as Utils.NumberHolder;
    const userSpeed = user.getBattleStat(Stat.SPD);
    if (userSpeed < 1) {
      // Gen 6+ always have 1 base power
      power.value = 1;
      return true;
    }

    power.value = Math.floor(Math.min(150, 25 * target.getBattleStat(Stat.SPD) / userSpeed + 1));
    return true;
  }
}

export class LowHpPowerAttr extends VariablePowerAttr {
  apply(user: Pokemon, target: Pokemon, move: Move, args: any[]): boolean {
    const power = args[0] as Utils.NumberHolder;
    const hpRatio = user.getHpRatio();

    switch (true) {
    case (hpRatio < 0.0417):
      power.value = 200;
      break;
    case (hpRatio < 0.1042):
      power.value = 150;
      break;
    case (hpRatio < 0.2083):
      power.value = 100;
      break;
    case (hpRatio < 0.3542):
      power.value = 80;
      break;
    case (hpRatio < 0.6875):
      power.value = 40;
      break;
    default:
      power.value = 20;
      break;
    }

    return true;
  }
}

export class CompareWeightPowerAttr extends VariablePowerAttr {
  apply(user: Pokemon, target: Pokemon, move: Move, args: any[]): boolean {
    const power = args[0] as Utils.NumberHolder;
    const userWeight = user.getWeight();
    const targetWeight = target.getWeight();

    if (!userWeight || userWeight === 0) {
      return false;
    }

    const relativeWeight = (targetWeight / userWeight) * 100;

    switch (true) {
    case (relativeWeight < 20.01):
      power.value = 120;
      break;
    case (relativeWeight < 25.01):
      power.value = 100;
      break;
    case (relativeWeight < 33.35):
      power.value = 80;
      break;
    case (relativeWeight < 50.01):
      power.value = 60;
      break;
    default:
      power.value = 40;
      break;
    }

    return true;
  }
}

export class HpPowerAttr extends VariablePowerAttr {
  apply(user: Pokemon, target: Pokemon, move: Move, args: any[]): boolean {
    (args[0] as Utils.NumberHolder).value = Utils.toDmgValue(150 * user.getHpRatio());

    return true;
  }
}

/**
 * Attribute used for moves whose base power scales with the opponent's HP
 * Used for Crush Grip, Wring Out, and Hard Press
 * maxBasePower 100 for Hard Press, 120 for others
 */
export class OpponentHighHpPowerAttr extends VariablePowerAttr {
  maxBasePower: number;

  constructor(maxBasePower: number) {
    super();
    this.maxBasePower = maxBasePower;
  }

  /**
   * Changes the base power of the move to be the target's HP ratio times the maxBasePower with a min value of 1
   * @param user n/a
   * @param target the Pokemon being attacked
   * @param move n/a
   * @param args holds the base power of the move at args[0]
   * @returns true
   */
  apply(user: Pokemon, target: Pokemon, move: Move, args: any[]): boolean {
    (args[0] as Utils.NumberHolder).value = Utils.toDmgValue(this.maxBasePower * target.getHpRatio());

    return true;
  }
}

export class FirstAttackDoublePowerAttr extends VariablePowerAttr {
  apply(user: Pokemon, target: Pokemon, move: Move, args: any[]): boolean {
    console.log(target.getLastXMoves(1), target.scene.currentBattle.turn);
    if (!target.getLastXMoves(1).find(m => m.turn === target.scene.currentBattle.turn)) {
      (args[0] as Utils.NumberHolder).value *= 2;
      return true;
    }

    return false;
  }
}


export class TurnDamagedDoublePowerAttr extends VariablePowerAttr {
  apply(user: Pokemon, target: Pokemon, move: Move, args: any[]): boolean {
    if (user.turnData.attacksReceived.find(r => r.damage && r.sourceId === target.id)) {
      (args[0] as Utils.NumberHolder).value *= 2;
      return true;
    }

    return false;
  }
}


export class AntiSunlightPowerDecreaseAttr extends VariablePowerAttr {
  apply(user: Pokemon, target: Pokemon, move: Move, args: any[]): boolean {
    if (!user.scene.arena.weather?.isEffectSuppressed(user.scene)) {
      const power = args[0] as Utils.NumberHolder;
      const weatherType = user.scene.arena.weather?.weatherType || WeatherType.NONE;
      switch (weatherType) {
      case WeatherType.RAIN:
      case WeatherType.SANDSTORM:
      case WeatherType.HAIL:
      case WeatherType.SNOW:
      case WeatherType.HEAVY_RAIN:
        power.value *= 0.5;
        return true;
      }
    }

    return false;
  }
}

export class FriendshipPowerAttr extends VariablePowerAttr {
  private invert: boolean;

  constructor(invert?: boolean) {
    super();

    this.invert = !!invert;
  }

  apply(user: Pokemon, target: Pokemon, move: Move, args: any[]): boolean {
    const power = args[0] as Utils.NumberHolder;

    const friendshipPower = Math.floor(Math.min(user instanceof PlayerPokemon ? user.friendship : user.species.baseFriendship, 255) / 2.5);
    power.value = Math.max(!this.invert ? friendshipPower : 102 - friendshipPower, 1);

    return true;
  }
}

export class HitCountPowerAttr extends VariablePowerAttr {
  apply(user: Pokemon, target: Pokemon, move: Move, args: any[]): boolean {
    (args[0] as Utils.NumberHolder).value += Math.min(user.battleData.hitCount, 6) * 50;

    return true;
  }
}

/**
 * Turning a once was (StatChangeCountPowerAttr) statement and making it available to call for any attribute.
 * @param {Pokemon} pokemon The pokemon that is being used to calculate the count of positive stats
 * @returns {number} Returns the amount of positive stats
 */
const countPositiveStats = (pokemon: Pokemon): number => {
  return pokemon.summonData.battleStats.reduce((total, stat) => (stat && stat > 0) ? total + stat : total, 0);
};

/**
 * Attribute that increases power based on the amount of positive stat increases.
 */
export class StatChangeCountPowerAttr extends VariablePowerAttr {

  /**
   * @param {Pokemon} user The pokemon that is being used to calculate the amount of positive stats
   * @param {Pokemon} target N/A
   * @param {Move} move N/A
   * @param {any[]} args The argument for VariablePowerAttr, accumulates and sets the amount of power multiplied by stats
   * @returns {boolean} Returns true if attribute is applied
   */
  apply(user: Pokemon, target: Pokemon, move: Move, args: any[]): boolean {
    const positiveStats: number = countPositiveStats(user);

    (args[0] as Utils.NumberHolder).value += positiveStats * 20;
    return true;
  }
}

/**
 * Punishment normally has a base power of 60,
 * but gains 20 power for every increased stat stage the target has,
 * up to a maximum of 200 base power in total.
 */
export class PunishmentPowerAttr extends VariablePowerAttr {
  private PUNISHMENT_MIN_BASE_POWER = 60;
  private PUNISHMENT_MAX_BASE_POWER = 200;

  /**
     * @param {Pokemon} user N/A
     * @param {Pokemon} target The pokemon that the move is being used against, as well as calculating the stats for the min/max base power
     * @param {Move} move N/A
     * @param {any[]} args The value that is being changed due to VariablePowerAttr
     * @returns Returns true if attribute is applied
     */
  apply(user: Pokemon, target: Pokemon, move: Move, args: any[]): boolean {
    const positiveStats: number = countPositiveStats(target);
    (args[0] as Utils.NumberHolder).value = Math.min(
      this.PUNISHMENT_MAX_BASE_POWER,
      this.PUNISHMENT_MIN_BASE_POWER + positiveStats * 20
    );
    return true;
  }
}

export class PresentPowerAttr extends VariablePowerAttr {
  apply(user: Pokemon, target: Pokemon, move: Move, args: any[]): boolean {
    /**
     * If this move is multi-hit, and this attribute is applied to any hit
     * other than the first, this move cannot result in a heal.
     */
    const firstHit = (user.turnData.hitCount === user.turnData.hitsLeft);

    const powerSeed = Utils.randSeedInt(firstHit ? 100 : 80);
    if (powerSeed <= 40) {
      (args[0] as Utils.NumberHolder).value = 40;
    } else if (40 < powerSeed && powerSeed <= 70) {
      (args[0] as Utils.NumberHolder).value = 80;
    } else if (70 < powerSeed && powerSeed <= 80) {
      (args[0] as Utils.NumberHolder).value = 120;
    } else if (80 < powerSeed && powerSeed <= 100) {
      // If this move is multi-hit, disable all other hits
      user.stopMultiHit();
      target.scene.unshiftPhase(new PokemonHealPhase(target.scene, target.getBattlerIndex(),
        Utils.toDmgValue(target.getMaxHp() / 4), i18next.t("moveTriggers:regainedHealth", {pokemonName: getPokemonNameWithAffix(target)}), true));
    }

    return true;
  }
}

/**
 * Attribute used to calculate the power of attacks that scale with Stockpile stacks (i.e. Spit Up).
 */
export class SpitUpPowerAttr extends VariablePowerAttr {
  private multiplier: number = 0;

  constructor(multiplier: number) {
    super();
    this.multiplier = multiplier;
  }

  apply(user: Pokemon, target: Pokemon, move: Move, args: any[]): boolean {
    const stockpilingTag = user.getTag(StockpilingTag);

    if (stockpilingTag !== null && stockpilingTag.stockpiledCount > 0) {
      const power = args[0] as Utils.IntegerHolder;
      power.value = this.multiplier * stockpilingTag.stockpiledCount;
      return true;
    }

    return false;
  }
}

/**
 * Attribute used to apply Swallow's healing, which scales with Stockpile stacks.
 * Does NOT remove stockpiled stacks.
 */
export class SwallowHealAttr extends HealAttr {
  apply(user: Pokemon, target: Pokemon, move: Move, args: any[]): boolean {
    const stockpilingTag = user.getTag(StockpilingTag);

    if (stockpilingTag !== null && stockpilingTag?.stockpiledCount > 0) {
      const stockpiled = stockpilingTag.stockpiledCount;
      let healRatio: number;

      if (stockpiled === 1) {
        healRatio = 0.25;
      } else if (stockpiled === 2) {
        healRatio = 0.50;
      } else { // stockpiled >= 3
        healRatio = 1.00;
      }

      if (healRatio) {
        this.addHealPhase(user, healRatio);
        return true;
      }
    }

    return false;
  }
}


/**
 * Attribute used for multi-hit moves that increase power in increments of the
 * move's base power for each hit, namely Triple Kick and Triple Axel.
 * @extends VariablePowerAttr
 * @see {@linkcode apply}
 */
export class MultiHitPowerIncrementAttr extends VariablePowerAttr {
  /** The max number of base power increments allowed for this move */
  private maxHits: integer;

  constructor(maxHits: integer) {
    super();

    this.maxHits = maxHits;
  }

  /**
   * Increases power of move in increments of the base power for the amount of times
   * the move hit. In the case that the move is extended, it will circle back to the
   * original base power of the move after incrementing past the maximum amount of
   * hits.
   * @param user {@linkcode Pokemon} that used the move
   * @param target {@linkcode Pokemon} that the move was used on
   * @param move {@linkcode Move} with this attribute
   * @param args [0] {@linkcode Utils.NumberHolder} for final calculated power of move
   * @returns true if attribute application succeeds
   */
  apply(user: Pokemon, target: Pokemon, move: Move, args: any[]): boolean {
    const hitsTotal = user.turnData.hitCount - Math.max(user.turnData.hitsLeft, 0);
    const power = args[0] as Utils.NumberHolder;

    power.value = move.power * (1 + hitsTotal % this.maxHits);

    return true;
  }
}

/**
 * Attribute used for moves that double in power if the given move immediately
 * preceded the move applying the attribute, namely Fusion Flare and
 * Fusion Bolt.
 * @extends VariablePowerAttr
 * @see {@linkcode apply}
 */
export class LastMoveDoublePowerAttr extends VariablePowerAttr {
  /** The move that must precede the current move */
  private move: Moves;

  constructor(move: Moves) {
    super();

    this.move = move;
  }

  /**
   * Doubles power of move if the given move is found to precede the current
   * move with no other moves being executed in between, only ignoring failed
   * moves if any.
   * @param user {@linkcode Pokemon} that used the move
   * @param target N/A
   * @param move N/A
   * @param args [0] {@linkcode Utils.NumberHolder} that holds the resulting power of the move
   * @returns true if attribute application succeeds, false otherwise
   */
  apply(user: Pokemon, _target: Pokemon, _move: Move, args: any[]): boolean {
    const power = args[0] as Utils.NumberHolder;
    const enemy = user.getOpponent(0);
    const pokemonActed: Pokemon[] = [];

    if (enemy?.turnData.acted) {
      pokemonActed.push(enemy);
    }

    if (user.scene.currentBattle.double) {
      const userAlly = user.getAlly();
      const enemyAlly = enemy?.getAlly();

      if (userAlly && userAlly.turnData.acted) {
        pokemonActed.push(userAlly);
      }
      if (enemyAlly && enemyAlly.turnData.acted) {
        pokemonActed.push(enemyAlly);
      }
    }

    pokemonActed.sort((a, b) => b.turnData.order - a.turnData.order);

    for (const p of pokemonActed) {
      const [ lastMove ] = p.getLastXMoves(1);
      if (lastMove.result !== MoveResult.FAIL) {
        if ((lastMove.result === MoveResult.SUCCESS) && (lastMove.move === this.move)) {
          power.value *= 2;
          return true;
        } else {
          break;
        }
      }
    }

    return false;
  }
}

export class VariableAtkAttr extends MoveAttr {
  constructor() {
    super();
  }

  apply(user: Pokemon, target: Pokemon, move: Move, args: any[]): boolean {
    //const atk = args[0] as Utils.IntegerHolder;
    return false;
  }
}

export class TargetAtkUserAtkAttr extends VariableAtkAttr {
  constructor() {
    super();
  }
  apply(user: Pokemon, target: Pokemon, move: Move, args: any[]): boolean {
    (args[0] as Utils.IntegerHolder).value = target.getBattleStat(Stat.ATK, target);
    return true;
  }
}

export class DefAtkAttr extends VariableAtkAttr {
  constructor() {
    super();
  }

  apply(user: Pokemon, target: Pokemon, move: Move, args: any[]): boolean {
    (args[0] as Utils.IntegerHolder).value = user.getBattleStat(Stat.DEF, target);
    return true;
  }
}

export class VariableDefAttr extends MoveAttr {
  constructor() {
    super();
  }

  apply(user: Pokemon, target: Pokemon, move: Move, args: any[]): boolean {
    //const def = args[0] as Utils.IntegerHolder;
    return false;
  }
}

export class DefDefAttr extends VariableDefAttr {
  constructor() {
    super();
  }

  apply(user: Pokemon, target: Pokemon, move: Move, args: any[]): boolean {
    (args[0] as Utils.IntegerHolder).value = target.getBattleStat(Stat.DEF, user);
    return true;
  }
}

export class VariableAccuracyAttr extends MoveAttr {
  apply(user: Pokemon, target: Pokemon, move: Move, args: any[]): boolean {
    //const accuracy = args[0] as Utils.NumberHolder;
    return false;
  }
}

/**
 * Attribute used for Thunder and Hurricane that sets accuracy to 50 in sun and never miss in rain
 */
export class ThunderAccuracyAttr extends VariableAccuracyAttr {
  apply(user: Pokemon, target: Pokemon, move: Move, args: any[]): boolean {
    if (!user.scene.arena.weather?.isEffectSuppressed(user.scene)) {
      const accuracy = args[0] as Utils.NumberHolder;
      const weatherType = user.scene.arena.weather?.weatherType || WeatherType.NONE;
      switch (weatherType) {
      case WeatherType.SUNNY:
      case WeatherType.HARSH_SUN:
        accuracy.value = 50;
        return true;
      case WeatherType.RAIN:
      case WeatherType.HEAVY_RAIN:
        accuracy.value = -1;
        return true;
      }
    }

    return false;
  }
}

/**
 * Attribute used for Bleakwind Storm, Wildbolt Storm, and Sandsear Storm that sets accuracy to never
 * miss in rain
 * Springtide Storm does NOT have this property
 */
export class StormAccuracyAttr extends VariableAccuracyAttr {
  apply(user: Pokemon, target: Pokemon, move: Move, args: any[]): boolean {
    if (!user.scene.arena.weather?.isEffectSuppressed(user.scene)) {
      const accuracy = args[0] as Utils.NumberHolder;
      const weatherType = user.scene.arena.weather?.weatherType || WeatherType.NONE;
      switch (weatherType) {
      case WeatherType.RAIN:
      case WeatherType.HEAVY_RAIN:
        accuracy.value = -1;
        return true;
      }
    }

    return false;
  }
}

/**
 * Attribute used for moves which never miss
 * against Pokemon with the {@linkcode BattlerTagType.MINIMIZED}
 * @extends VariableAccuracyAttr
 * @see {@linkcode apply}
 */
export class MinimizeAccuracyAttr extends VariableAccuracyAttr {
  /**
   * @see {@linkcode apply}
   * @param user N/A
   * @param target {@linkcode Pokemon} target of the move
   * @param move N/A
   * @param args [0] Accuracy of the move to be modified
   * @returns true if the function succeeds
   */
  apply(user: Pokemon, target: Pokemon, move: Move, args: any[]): boolean {
    if (target.getTag(BattlerTagType.MINIMIZED)) {
      const accuracy = args[0] as Utils.NumberHolder;
      accuracy.value = -1;

      return true;
    }

    return false;
  }
}

export class ToxicAccuracyAttr extends VariableAccuracyAttr {
  apply(user: Pokemon, target: Pokemon, move: Move, args: any[]): boolean {
    if (user.isOfType(Type.POISON)) {
      const accuracy = args[0] as Utils.NumberHolder;
      accuracy.value = -1;
      return true;
    }

    return false;
  }
}

export class BlizzardAccuracyAttr extends VariableAccuracyAttr {
  apply(user: Pokemon, target: Pokemon, move: Move, args: any[]): boolean {
    if (!user.scene.arena.weather?.isEffectSuppressed(user.scene)) {
      const accuracy = args[0] as Utils.NumberHolder;
      const weatherType = user.scene.arena.weather?.weatherType || WeatherType.NONE;
      if (weatherType === WeatherType.HAIL || weatherType === WeatherType.SNOW) {
        accuracy.value = -1;
        return true;
      }
    }

    return false;
  }
}

export class VariableMoveCategoryAttr extends MoveAttr {
  apply(user: Pokemon, target: Pokemon, move: Move, args: any[]): boolean {
    return false;
  }
}

export class PhotonGeyserCategoryAttr extends VariableMoveCategoryAttr {
  apply(user: Pokemon, target: Pokemon, move: Move, args: any[]): boolean {
    const category = (args[0] as Utils.NumberHolder);

    if (user.getBattleStat(Stat.ATK, target, move) > user.getBattleStat(Stat.SPEC, target, move)) {
      category.value = MoveCategory.PHYSICAL;
      return true;
    }

    return false;
  }
}

/**
 * Change the move category to status when used on the ally
 * @extends VariableMoveCategoryAttr
 * @see {@linkcode apply}
 */
export class StatusCategoryOnAllyAttr extends VariableMoveCategoryAttr {
  /**
   * @param user {@linkcode Pokemon} using the move
   * @param target {@linkcode Pokemon} target of the move
   * @param move {@linkcode Move} with this attribute
   * @param args [0] {@linkcode Utils.IntegerHolder} The category of the move
   * @returns true if the function succeeds
   */
  apply(user: Pokemon, target: Pokemon, move: Move, args: any[]): boolean {
    const category = (args[0] as Utils.IntegerHolder);

    if (user.getAlly() === target) {
      category.value = MoveCategory.STATUS;
      return true;
    }

    return false;
  }
}

export class ShellSideArmCategoryAttr extends VariableMoveCategoryAttr {
  apply(user: Pokemon, target: Pokemon, move: Move, args: any[]): boolean {
    const category = (args[0] as Utils.IntegerHolder);
    const atkRatio = user.getBattleStat(Stat.ATK, target, move) / target.getBattleStat(Stat.DEF, user, move);
    const specialRatio = user.getBattleStat(Stat.SPEC, target, move) / target.getBattleStat(Stat.SPEC, user, move);

    // Shell Side Arm is much more complicated than it looks, this is a partial implementation to try to achieve something similar to the games
    if (atkRatio > specialRatio) {
      category.value = MoveCategory.PHYSICAL;
      return true;
    } else if (atkRatio === specialRatio && user.randSeedInt(2) === 0) {
      category.value = MoveCategory.PHYSICAL;
      return true;
    }

    return false;
  }
}

export class VariableMoveTypeAttr extends MoveAttr {
  apply(user: Pokemon, target: Pokemon, move: Move, args: any[]): boolean {
    return false;
  }
}

export class MatchUserTypeAttr extends VariableMoveTypeAttr {
  apply(user: Pokemon, target: Pokemon, move: Move, args: any[]): boolean {
    const moveType = args[0];
    if (!(moveType instanceof Utils.NumberHolder)) {
      return false;
    }
    const userTypes = user.getTypes(true);

    if (userTypes.length > 0) {
      moveType.value = userTypes[0];
      return true;
    } else {
      return false;
    }

  }
}

export class VariableMoveTypeMultiplierAttr extends MoveAttr {
  apply(user: Pokemon, target: Pokemon, move: Move, args: any[]): boolean {
    return false;
  }
}

export class NeutralDamageAgainstFlyingTypeMultiplierAttr extends VariableMoveTypeMultiplierAttr {
  apply(user: Pokemon, target: Pokemon, move: Move, args: any[]): boolean {
    if (!target.getTag(BattlerTagType.IGNORE_FLYING)) {
      const multiplier = args[0] as Utils.NumberHolder;
      //When a flying type is hit, the first hit is always 1x multiplier.
      if (target.isOfType(Type.FLYING)) {
        multiplier.value = 1;
      }
      return true;
    }

    return false;
  }
}

export class WaterSuperEffectTypeMultiplierAttr extends VariableMoveTypeMultiplierAttr {
  apply(user: Pokemon, target: Pokemon, move: Move, args: any[]): boolean {
    const multiplier = args[0] as Utils.NumberHolder;
    if (target.isOfType(Type.WATER)) {
      const effectivenessAgainstWater = new Utils.NumberHolder(getTypeDamageMultiplier(move.type, Type.WATER));
      applyChallenges(user.scene.gameMode, ChallengeType.TYPE_EFFECTIVENESS, effectivenessAgainstWater);
      if (effectivenessAgainstWater.value !== 0) {
        multiplier.value *= 2 / effectivenessAgainstWater.value;
        return true;
      }
    }

    return false;
  }
}

export class IceNoEffectTypeAttr extends VariableMoveTypeMultiplierAttr {
  /**
   * Checks to see if the Target is Ice-Type or not. If so, the move will have no effect.
   * @param {Pokemon} user N/A
   * @param {Pokemon} target Pokemon that is being checked whether Ice-Type or not.
   * @param {Move} move N/A
   * @param {any[]} args Sets to false if the target is Ice-Type, so it should do no damage/no effect.
   * @returns {boolean} Returns true if move is successful, false if Ice-Type.
   */
  apply(user: Pokemon, target: Pokemon, move: Move, args: any[]): boolean {
    if (target.isOfType(Type.ICE)) {
      (args[0] as Utils.BooleanHolder).value = false;
      return false;
    }
    return true;
  }
}

export class FlyingTypeMultiplierAttr extends VariableMoveTypeMultiplierAttr {
  apply(user: Pokemon, target: Pokemon, move: Move, args: any[]): boolean {
    const multiplier = args[0] as Utils.NumberHolder;
    multiplier.value *= target.getAttackTypeEffectiveness(Type.FLYING, user);
    return true;
  }
}

export class OneHitKOAccuracyAttr extends VariableAccuracyAttr {
  apply(user: Pokemon, target: Pokemon, move: Move, args: any[]): boolean {
    const accuracy = args[0] as Utils.NumberHolder;
    if (user.level < target.level) {
      accuracy.value = 0;
    } else {
      accuracy.value = Math.min(Math.max(30 + 100 * (1 - target.level / user.level), 0), 100);
    }
    return true;
  }
}

export class SheerColdAccuracyAttr extends OneHitKOAccuracyAttr {
  /**
   * Changes the normal One Hit KO Accuracy Attr to implement the Gen VII changes,
   * where if the user is Ice-Type, it has more accuracy.
   * @param {Pokemon} user Pokemon that is using the move; checks the Pokemon's level.
   * @param {Pokemon} target Pokemon that is receiving the move; checks the Pokemon's level.
   * @param {Move} move N/A
   * @param {any[]} args Uses the accuracy argument, allowing to change it from either 0 if it doesn't pass
   * the first if/else, or 30/20 depending on the type of the user Pokemon.
   * @returns Returns true if move is successful, false if misses.
   */
  apply(user: Pokemon, target: Pokemon, move: Move, args: any[]): boolean {
    const accuracy = args[0] as Utils.NumberHolder;
    if (user.level < target.level) {
      accuracy.value = 0;
    } else {
      const baseAccuracy = user.isOfType(Type.ICE) ? 30 : 20;
      accuracy.value = Math.min(Math.max(baseAccuracy + 100 * (1 - target.level / user.level), 0), 100);
    }
    return true;
  }
}

export class MissEffectAttr extends MoveAttr {
  private missEffectFunc: UserMoveConditionFunc;

  constructor(missEffectFunc: UserMoveConditionFunc) {
    super();

    this.missEffectFunc = missEffectFunc;
  }

  apply(user: Pokemon, target: Pokemon, move: Move, args: any[]): boolean {
    this.missEffectFunc(user, move);
    return true;
  }
}

export class NoEffectAttr extends MoveAttr {
  private noEffectFunc: UserMoveConditionFunc;

  constructor(noEffectFunc: UserMoveConditionFunc) {
    super();

    this.noEffectFunc = noEffectFunc;
  }

  apply(user: Pokemon, target: Pokemon, move: Move, args: any[]): boolean {
    this.noEffectFunc(user, move);
    return true;
  }
}

const crashDamageFunc = (user: Pokemon, move: Move) => {
  const cancelled = new Utils.BooleanHolder(false);
  applyAbAttrs(BlockNonDirectDamageAbAttr, user, cancelled);
  if (cancelled.value) {
    return false;
  }

  user.damageAndUpdate(Utils.toDmgValue(user.getMaxHp() / 2), HitResult.OTHER, false, true);
  user.scene.queueMessage(i18next.t("moveTriggers:keptGoingAndCrashed", {pokemonName: getPokemonNameWithAffix(user)}));
  user.turnData.damageTaken += Utils.toDmgValue(user.getMaxHp() / 2);

  return true;
};

export class TypelessAttr extends MoveAttr { }
/**
* Attribute used for moves which ignore redirection effects, and always target their original target, i.e. Snipe Shot
* Bypasses Storm Drain, Follow Me, Ally Switch, and the like.
*/
export class BypassRedirectAttr extends MoveAttr { }

export class DisableMoveAttr extends MoveEffectAttr {
  constructor() {
    super(false);
  }

  apply(user: Pokemon, target: Pokemon, move: Move, args: any[]): boolean {
    if (!super.apply(user, target, move, args)) {
      return false;
    }

    const moveQueue = target.getLastXMoves();
    let turnMove: TurnMove | undefined;
    while (moveQueue.length) {
      turnMove = moveQueue.shift();
      if (turnMove?.virtual) {
        continue;
      }

      const moveIndex = target.getMoveset().findIndex(m => m?.moveId === turnMove?.move);
      if (moveIndex === -1) {
        return false;
      }

      const disabledMove = target.getMoveset()[moveIndex];
      target.summonData.disabledMove = disabledMove?.moveId!; // TODO: is this bang correct?
      target.summonData.disabledTurns = 4;

      user.scene.queueMessage(i18next.t("abilityTriggers:postDefendMoveDisable", { pokemonNameWithAffix: getPokemonNameWithAffix(target), moveName: disabledMove?.getName()}));

      return true;
    }

    return false;
  }

  getCondition(): MoveConditionFunc {
    return (user, target, move): boolean => { // TODO: Not sure what to do here
      if (target.summonData.disabledMove || target.isMax()) {
        return false;
      }

      const moveQueue = target.getLastXMoves();
      let turnMove: TurnMove | undefined;
      while (moveQueue.length) {
        turnMove = moveQueue.shift();
        if (turnMove?.virtual) {
          continue;
        }

        const move = target.getMoveset().find(m => m?.moveId === turnMove?.move);
        if (!move) {
          continue;
        }

        return true;
      }

      return false;
    };
  }

  getTargetBenefitScore(user: Pokemon, target: Pokemon, move: Move): integer {
    return -5;
  }
}

export class FrenzyAttr extends MoveEffectAttr {
  constructor() {
    super(true, MoveEffectTrigger.HIT, false, true);
  }

  canApply(user: Pokemon, target: Pokemon, move: Move, args: any[]) {
    return !(this.selfTarget ? user : target).isFainted();
  }

  apply(user: Pokemon, target: Pokemon, move: Move, args: any[]): boolean {
    if (!super.apply(user, target, move, args)) {
      return false;
    }

    if (!user.getTag(BattlerTagType.FRENZY) && !user.getMoveQueue().length) {
      const turnCount = user.randSeedIntRange(1, 2);
      new Array(turnCount).fill(null).map(() => user.getMoveQueue().push({ move: move.id, targets: [ target.getBattlerIndex() ], ignorePP: true }));
      user.addTag(BattlerTagType.FRENZY, turnCount, move.id, user.id);
    } else {
      applyMoveAttrs(AddBattlerTagAttr, user, target, move, args);
      user.lapseTag(BattlerTagType.FRENZY); // if FRENZY is already in effect (moveQueue.length > 0), lapse the tag
    }

    return true;
  }
}

export const frenzyMissFunc: UserMoveConditionFunc = (user: Pokemon, move: Move) => {
  while (user.getMoveQueue().length && user.getMoveQueue()[0].move === move.id) {
    user.getMoveQueue().shift();
  }
  user.removeTag(BattlerTagType.FRENZY); // FRENZY tag should be disrupted on miss/no effect

  return true;
};

export class AddBattlerTagAttr extends MoveEffectAttr {
  public tagType: BattlerTagType;
  public turnCountMin: integer;
  public turnCountMax: integer;
  protected cancelOnFail: boolean;
  private failOnOverlap: boolean;

  constructor(tagType: BattlerTagType, selfTarget: boolean = false, failOnOverlap: boolean = false, turnCountMin: integer = 0, turnCountMax?: integer, lastHitOnly: boolean = false, cancelOnFail: boolean = false) {
    super(selfTarget, MoveEffectTrigger.POST_APPLY, false, lastHitOnly);

    this.tagType = tagType;
    this.turnCountMin = turnCountMin;
    this.turnCountMax = turnCountMax !== undefined ? turnCountMax : turnCountMin;
    this.failOnOverlap = !!failOnOverlap;
    this.cancelOnFail = cancelOnFail;
  }

  canApply(user: Pokemon, target: Pokemon, move: Move, args: any[]): boolean {
    if (!super.canApply(user, target, move, args) || (this.cancelOnFail === true && user.getLastXMoves(1)[0].result === MoveResult.FAIL)) {
      return false;
    } else {
      return true;
    }
  }

  apply(user: Pokemon, target: Pokemon, move: Move, args: any[]): boolean {
    if (!super.apply(user, target, move, args)) {
      return false;
    }

    const moveChance = this.getMoveChance(user, target, move, this.selfTarget, true);
    if (moveChance < 0 || moveChance === 100 || user.randSeedInt(100) < moveChance) {
      return (this.selfTarget ? user : target).addTag(this.tagType,  user.randSeedInt(this.turnCountMax - this.turnCountMin, this.turnCountMin), move.id, user.id);
    }

    return false;
  }

  getCondition(): MoveConditionFunc | null {
    return this.failOnOverlap
      ? (user, target, move) => !(this.selfTarget ? user : target).getTag(this.tagType)
      : null;
  }

  getTagTargetBenefitScore(user: Pokemon, target: Pokemon, move: Move): integer | void {
    switch (this.tagType) {
    case BattlerTagType.RECHARGING:
    case BattlerTagType.PERISH_SONG:
      return -16;
    case BattlerTagType.FLINCHED:
    case BattlerTagType.CONFUSED:
    case BattlerTagType.INFATUATED:
    case BattlerTagType.NIGHTMARE:
    case BattlerTagType.DROWSY:
      return -5;
    case BattlerTagType.SEEDED:
    case BattlerTagType.SALT_CURED:
    case BattlerTagType.CURSED:
    case BattlerTagType.FRENZY:
    case BattlerTagType.TRAPPED:
    case BattlerTagType.BIND:
    case BattlerTagType.WRAP:
    case BattlerTagType.FIRE_SPIN:
    case BattlerTagType.WHIRLPOOL:
    case BattlerTagType.CLAMP:
    case BattlerTagType.SAND_TOMB:
    case BattlerTagType.MAGMA_STORM:
    case BattlerTagType.SNAP_TRAP:
    case BattlerTagType.THUNDER_CAGE:
    case BattlerTagType.INFESTATION:
      return -3;
    case BattlerTagType.ENCORE:
      return -2;
    case BattlerTagType.MINIMIZED:
      return 0;
    case BattlerTagType.INGRAIN:
    case BattlerTagType.IGNORE_ACCURACY:
    case BattlerTagType.AQUA_RING:
      return 3;
    case BattlerTagType.PROTECTED:
    case BattlerTagType.FLYING:
    case BattlerTagType.CRIT_BOOST:
    case BattlerTagType.ALWAYS_CRIT:
      return 5;
    }
  }

  getTargetBenefitScore(user: Pokemon, target: Pokemon, move: Move): integer {
    let moveChance = this.getMoveChance(user, target, move, this.selfTarget, false);
    if (moveChance < 0) {
      moveChance = 100;
    }
    return Math.floor(this.getTagTargetBenefitScore(user, target, move)! * (moveChance / 100)); // TODO: is the bang correct?
  }
}

/**
 * Attribute to implement Jaw Lock's linked trapping effect between the user and target
 * @extends AddBattlerTagAttr
 */
export class JawLockAttr extends AddBattlerTagAttr {
  constructor() {
    super(BattlerTagType.TRAPPED);
  }

  apply(user: Pokemon, target: Pokemon, move: Move, args: any[]): boolean {
    if (!super.canApply(user, target, move, args)) {
      return false;
    }

    // If either the user or the target already has the tag, do not apply
    if (user.getTag(TrappedTag) || target.getTag(TrappedTag)) {
      return false;
    }

    const moveChance = this.getMoveChance(user, target, move, this.selfTarget);
    if (moveChance < 0 || moveChance === 100 || user.randSeedInt(100) < moveChance) {
      /**
       * Add the tag to both the user and the target.
       * The target's tag source is considered to be the user and vice versa
       */
      return target.addTag(BattlerTagType.TRAPPED, 1, move.id, user.id)
          && user.addTag(BattlerTagType.TRAPPED, 1, move.id, target.id);
    }

    return false;
  }
}

export class CurseAttr extends MoveEffectAttr {

  apply(user: Pokemon, target: Pokemon, move:Move, args: any[]): boolean {
    if (user.getTypes(true).includes(Type.GHOST)) {
      if (target.getTag(BattlerTagType.CURSED)) {
        user.scene.queueMessage(i18next.t("battle:attackFailed"));
        return false;
      }
      const curseRecoilDamage = Math.max(1, Math.floor(user.getMaxHp() / 2));
      user.damageAndUpdate(curseRecoilDamage, HitResult.OTHER, false, true, true);
      user.scene.queueMessage(
        i18next.t("battlerTags:cursedOnAdd", {
          pokemonNameWithAffix: getPokemonNameWithAffix(user),
          pokemonName: getPokemonNameWithAffix(target)
        })
      );

      target.addTag(BattlerTagType.CURSED, 0, move.id, user.id);
      return true;
    } else {
      user.scene.unshiftPhase(new StatChangePhase(user.scene, user.getBattlerIndex(), true, [BattleStat.ATK, BattleStat.DEF], 1));
      user.scene.unshiftPhase(new StatChangePhase(user.scene, user.getBattlerIndex(), true, [BattleStat.SPD], -1));
      return true;
    }
  }
}

export class LapseBattlerTagAttr extends MoveEffectAttr {
  public tagTypes: BattlerTagType[];

  constructor(tagTypes: BattlerTagType[], selfTarget: boolean = false) {
    super(selfTarget);

    this.tagTypes = tagTypes;
  }

  apply(user: Pokemon, target: Pokemon, move: Move, args: any[]): boolean {
    if (!super.apply(user, target, move, args)) {
      return false;
    }

    for (const tagType of this.tagTypes) {
      (this.selfTarget ? user : target).lapseTag(tagType);
    }

    return true;
  }
}

export class RemoveBattlerTagAttr extends MoveEffectAttr {
  public tagTypes: BattlerTagType[];

  constructor(tagTypes: BattlerTagType[], selfTarget: boolean = false) {
    super(selfTarget);

    this.tagTypes = tagTypes;
  }

  apply(user: Pokemon, target: Pokemon, move: Move, args: any[]): boolean {
    if (!super.apply(user, target, move, args)) {
      return false;
    }

    for (const tagType of this.tagTypes) {
      (this.selfTarget ? user : target).removeTag(tagType);
    }

    return true;
  }
}

export class FlinchAttr extends AddBattlerTagAttr {
  constructor() {
    super(BattlerTagType.FLINCHED, false);
  }
}

export class ConfuseAttr extends AddBattlerTagAttr {
  constructor(selfTarget?: boolean) {
    super(BattlerTagType.CONFUSED, selfTarget, false, 2, 5);
  }
}

export class RechargeAttr extends AddBattlerTagAttr {
  constructor() {
    super(BattlerTagType.RECHARGING, true, false, 1, 1, true, true);
  }
}

export class TrapAttr extends AddBattlerTagAttr {
  constructor(tagType: BattlerTagType) {
    super(tagType, false, false, 4, 5);
  }
}

export class ProtectAttr extends AddBattlerTagAttr {
  constructor(tagType: BattlerTagType = BattlerTagType.PROTECTED) {
    super(tagType, true);
  }

  getCondition(): MoveConditionFunc {
    return ((user, target, move): boolean => {
      let timesUsed = 0;
      const moveHistory = user.getLastXMoves();
      let turnMove: TurnMove | undefined;

      while (moveHistory.length) {
        turnMove = moveHistory.shift();
        if (!allMoves[turnMove?.move!].hasAttr(ProtectAttr) || turnMove?.result !== MoveResult.SUCCESS) { // TODO: is the bang correct?
          break;
        }
        timesUsed++;
      }
      if (timesUsed) {
        return !user.randSeedInt(Math.pow(3, timesUsed));
      }
      return true;
    });
  }
}

export class IgnoreAccuracyAttr extends AddBattlerTagAttr {
  constructor() {
    super(BattlerTagType.IGNORE_ACCURACY, true, false, 2);
  }

  apply(user: Pokemon, target: Pokemon, move: Move, args: any[]): boolean {
    if (!super.apply(user, target, move, args)) {
      return false;
    }

    user.scene.queueMessage(i18next.t("moveTriggers:tookAimAtTarget", {pokemonName: getPokemonNameWithAffix(user), targetName: getPokemonNameWithAffix(target)}));

    return true;
  }
}

export class FaintCountdownAttr extends AddBattlerTagAttr {
  constructor() {
    super(BattlerTagType.PERISH_SONG, false, true, 4);
  }

  apply(user: Pokemon, target: Pokemon, move: Move, args: any[]): boolean {
    if (!super.apply(user, target, move, args)) {
      return false;
    }

    user.scene.queueMessage(i18next.t("moveTriggers:faintCountdown", {pokemonName: getPokemonNameWithAffix(target), turnCount: this.turnCountMin - 1}));

    return true;
  }
}

/**
 * Attribute used when a move hits a {@linkcode BattlerTagType} for double damage
 * @extends MoveAttr
*/
export class HitsTagAttr extends MoveAttr {
  /** The {@linkcode BattlerTagType} this move hits */
  public tagType: BattlerTagType;
  /** Should this move deal double damage against {@linkcode HitsTagAttr.tagType}? */
  public doubleDamage: boolean;

  constructor(tagType: BattlerTagType, doubleDamage?: boolean) {
    super();

    this.tagType = tagType;
    this.doubleDamage = !!doubleDamage;
  }

  getTargetBenefitScore(user: Pokemon, target: Pokemon, move: Move): integer {
    return target.getTag(this.tagType) ? this.doubleDamage ? 10 : 5 : 0;
  }
}

export class AddArenaTagAttr extends MoveEffectAttr {
  public tagType: ArenaTagType;
  public turnCount: integer;
  private failOnOverlap: boolean;
  public selfSideTarget: boolean;

  constructor(tagType: ArenaTagType, turnCount?: integer | null, failOnOverlap: boolean = false, selfSideTarget: boolean = false) {
    super(true, MoveEffectTrigger.POST_APPLY);

    this.tagType = tagType;
    this.turnCount = turnCount!; // TODO: is the bang correct?
    this.failOnOverlap = failOnOverlap;
    this.selfSideTarget = selfSideTarget;
  }

  apply(user: Pokemon, target: Pokemon, move: Move, args: any[]): boolean {
    if (!super.apply(user, target, move, args)) {
      return false;
    }

    if (move.chance < 0 || move.chance === 100 || user.randSeedInt(100) < move.chance) {
      user.scene.arena.addTag(this.tagType, this.turnCount, move.id, user.id, (this.selfSideTarget ? user : target).isPlayer() ? ArenaTagSide.PLAYER : ArenaTagSide.ENEMY);
      return true;
    }

    return false;
  }

  getCondition(): MoveConditionFunc | null {
    return this.failOnOverlap
      ? (user, target, move) => !user.scene.arena.getTagOnSide(this.tagType, target.isPlayer() ? ArenaTagSide.PLAYER : ArenaTagSide.ENEMY)
      : null;
  }
}

/**
 * Generic class for removing arena tags
 * @param tagTypes: The types of tags that can be removed
 * @param selfSideTarget: Is the user removing tags from its own side?
 */
export class RemoveArenaTagsAttr extends MoveEffectAttr {
  public tagTypes: ArenaTagType[];
  public selfSideTarget: boolean;

  constructor(tagTypes: ArenaTagType[], selfSideTarget: boolean) {
    super(true, MoveEffectTrigger.POST_APPLY);

    this.tagTypes = tagTypes;
    this.selfSideTarget = selfSideTarget;
  }

  apply(user: Pokemon, target: Pokemon, move: Move, args: any[]): boolean {
    if (!super.apply(user, target, move, args)) {
      return false;
    }

    const side = (this.selfSideTarget ? user : target).isPlayer() ? ArenaTagSide.PLAYER : ArenaTagSide.ENEMY;

    for (const tagType of this.tagTypes) {
      user.scene.arena.removeTagOnSide(tagType, side);
    }

    return true;
  }
}

export class AddArenaTrapTagAttr extends AddArenaTagAttr {
  getCondition(): MoveConditionFunc {
    return (user, target, move) => {
      const side = (this.selfSideTarget ? user : target).isPlayer() ? ArenaTagSide.PLAYER : ArenaTagSide.ENEMY;
      const tag = user.scene.arena.getTagOnSide(this.tagType, side) as ArenaTrapTag;
      if (!tag) {
        return true;
      }
      return tag.layers < tag.maxLayers;
    };
  }
}

/**
 * Attribute used for Stone Axe and Ceaseless Edge.
 * Applies the given ArenaTrapTag when move is used.
 * @extends AddArenaTagAttr
 * @see {@linkcode apply}
 */
export class AddArenaTrapTagHitAttr extends AddArenaTagAttr {
  /**
   * @param user {@linkcode Pokemon} using this move
   * @param target {@linkcode Pokemon} target of this move
   * @param move {@linkcode Move} being used
   */
  apply(user: Pokemon, target: Pokemon, move: Move, args: any[]): boolean {
    const moveChance = this.getMoveChance(user, target, move, this.selfTarget, true);
    const side = (this.selfSideTarget ? user : target).isPlayer() ? ArenaTagSide.PLAYER : ArenaTagSide.ENEMY;
    const tag = user.scene.arena.getTagOnSide(this.tagType, side) as ArenaTrapTag;
    if ((moveChance < 0 || moveChance === 100 || user.randSeedInt(100) < moveChance) && user.getLastXMoves(1)[0].result === MoveResult.SUCCESS) {
      user.scene.arena.addTag(this.tagType, 0, move.id, user.id, side);
      if (!tag) {
        return true;
      }
      return tag.layers < tag.maxLayers;
    }
    return false;
  }
}

export class RemoveArenaTrapAttr extends MoveEffectAttr {

  private targetBothSides: boolean;

  constructor(targetBothSides: boolean = false) {
    super(true, MoveEffectTrigger.PRE_APPLY);
    this.targetBothSides = targetBothSides;
  }

  apply(user: Pokemon, target: Pokemon, move: Move, args: any[]): boolean {

    if (!super.apply(user, target, move, args)) {
      return false;
    }

    return true;
  }
}

export class RemoveScreensAttr extends MoveEffectAttr {

  private targetBothSides: boolean;

  constructor(targetBothSides: boolean = false) {
    super(true, MoveEffectTrigger.PRE_APPLY);
    this.targetBothSides = targetBothSides;
  }

  apply(user: Pokemon, target: Pokemon, move: Move, args: any[]): boolean {

    if (!super.apply(user, target, move, args)) {
      return false;
    }

    if (this.targetBothSides) {
      user.scene.arena.removeTagOnSide(ArenaTagType.REFLECT, ArenaTagSide.PLAYER);
      user.scene.arena.removeTagOnSide(ArenaTagType.LIGHT_SCREEN, ArenaTagSide.PLAYER);

      user.scene.arena.removeTagOnSide(ArenaTagType.REFLECT, ArenaTagSide.ENEMY);
      user.scene.arena.removeTagOnSide(ArenaTagType.LIGHT_SCREEN, ArenaTagSide.ENEMY);
    } else {
      user.scene.arena.removeTagOnSide(ArenaTagType.REFLECT, target.isPlayer() ? ArenaTagSide.PLAYER : ArenaTagSide.ENEMY);
      user.scene.arena.removeTagOnSide(ArenaTagType.LIGHT_SCREEN, target.isPlayer() ? ArenaTagSide.PLAYER : ArenaTagSide.ENEMY);
    }

    return true;

  }
}

/*Swaps arena effects between the player and enemy side
  * @extends MoveEffectAttr
  * @see {@linkcode apply}
*/
export class SwapArenaTagsAttr extends MoveEffectAttr {
  public SwapTags: ArenaTagType[];


  constructor(SwapTags: ArenaTagType[]) {
    super(true, MoveEffectTrigger.POST_APPLY);
    this.SwapTags = SwapTags;
  }

  apply(user:Pokemon, target:Pokemon, move:Move, args: any[]): boolean {
    if (!super.apply(user, target, move, args)) {
      return false;
    }

    const tagPlayerTemp = user.scene.arena.findTagsOnSide((t => this.SwapTags.includes(t.tagType)), ArenaTagSide.PLAYER);
    const tagEnemyTemp = user.scene.arena.findTagsOnSide((t => this.SwapTags.includes(t.tagType)), ArenaTagSide.ENEMY);


    if (tagPlayerTemp) {
      for (const swapTagsType of tagPlayerTemp) {
        user.scene.arena.removeTagOnSide(swapTagsType.tagType, ArenaTagSide.PLAYER, true);
        user.scene.arena.addTag(swapTagsType.tagType, swapTagsType.turnCount, swapTagsType.sourceMove, swapTagsType.sourceId!, ArenaTagSide.ENEMY, true); // TODO: is the bang correct?
      }
    }
    if (tagEnemyTemp) {
      for (const swapTagsType of tagEnemyTemp) {
        user.scene.arena.removeTagOnSide(swapTagsType.tagType, ArenaTagSide.ENEMY, true);
        user.scene.arena.addTag(swapTagsType.tagType, swapTagsType.turnCount, swapTagsType.sourceMove, swapTagsType.sourceId!, ArenaTagSide.PLAYER, true); // TODO: is the bang correct?
      }
    }


    user.scene.queueMessage(i18next.t("moveTriggers:swapArenaTags", {pokemonName: getPokemonNameWithAffix(user)}));
    return true;
  }
}

/**
 * Attribute used for Revival Blessing.
 * @extends MoveEffectAttr
 * @see {@linkcode apply}
 */
export class RevivalBlessingAttr extends MoveEffectAttr {
  constructor(user?: boolean) {
    super(true);
  }

  /**
   *
   * @param user {@linkcode Pokemon} using this move
   * @param target {@linkcode Pokemon} target of this move
   * @param move {@linkcode Move} being used
   * @param args N/A
   * @returns Promise, true if function succeeds.
   */
  apply(user: Pokemon, target: Pokemon, move: Move, args: any[]): Promise<boolean> {
    return new Promise(resolve => {
      // If user is player, checks if the user has fainted pokemon
      if (user instanceof PlayerPokemon
        && user.scene.getParty().findIndex(p => p.isFainted())>-1) {
        (user as PlayerPokemon).revivalBlessing().then(() => {
          resolve(true);
        });
      // If user is enemy, checks that it is a trainer, and it has fainted non-boss pokemon in party
      } else if (user instanceof EnemyPokemon
        && user.hasTrainer()
        && user.scene.getEnemyParty().findIndex(p => p.isFainted() && !p.isBoss()) > -1) {
        // Selects a random fainted pokemon
        const faintedPokemon = user.scene.getEnemyParty().filter(p => p.isFainted() && !p.isBoss());
        const pokemon = faintedPokemon[user.randSeedInt(faintedPokemon.length)];
        const slotIndex = user.scene.getEnemyParty().findIndex(p => pokemon.id === p.id);
        pokemon.resetStatus();
        pokemon.heal(Math.min(Utils.toDmgValue(0.5 * pokemon.getMaxHp()), pokemon.getMaxHp()));
        user.scene.queueMessage(i18next.t("moveTriggers:revivalBlessing", {pokemonName: getPokemonNameWithAffix(pokemon)}), 0, true);

        if (user.scene.currentBattle.double && user.scene.getEnemyParty().length > 1) {
          const allyPokemon = user.getAlly();
          if (slotIndex<=1) {
            user.scene.unshiftPhase(new SwitchSummonPhase(user.scene, pokemon.getFieldIndex(), slotIndex, false, false, false));
          } else if (allyPokemon.isFainted()) {
            user.scene.unshiftPhase(new SwitchSummonPhase(user.scene, allyPokemon.getFieldIndex(), slotIndex, false, false, false));
          }
        }
        resolve(true);
      } else {
        user.scene.queueMessage(i18next.t("battle:attackFailed"));
        resolve(false);
      }
    });
  }

  getUserBenefitScore(user: Pokemon, target: Pokemon, move: Move): integer {
    if (user.hasTrainer() && user.scene.getEnemyParty().findIndex(p => p.isFainted() && !p.isBoss()) > -1) {
      return 20;
    }

    return -20;
  }
}

export class ForceSwitchOutAttr extends MoveEffectAttr {
  private user: boolean;
  private batonPass: boolean;

  constructor(user?: boolean, batonPass?: boolean) {
    super(false, MoveEffectTrigger.POST_APPLY, false, true);
    this.user = !!user;
    this.batonPass = !!batonPass;
  }

  isBatonPass() {
    return this.batonPass;
  }

  apply(user: Pokemon, target: Pokemon, move: Move, args: any[]): Promise<boolean> {
    return new Promise(resolve => {

  	// Check if the move category is not STATUS or if the switch out condition is not met
      if (!this.getSwitchOutCondition()(user, target, move)) {
        return resolve(false);
      }

  	// Move the switch out logic inside the conditional block
  	// This ensures that the switch out only happens when the conditions are met
	  const switchOutTarget = this.user ? user : target;
	  if (switchOutTarget instanceof PlayerPokemon) {
        switchOutTarget.leaveField(!this.batonPass);

        if (switchOutTarget.hp > 0) {
          user.scene.prependToPhase(new SwitchPhase(user.scene, switchOutTarget.getFieldIndex(), true, true), MoveEndPhase);
          resolve(true);
        } else {
          resolve(false);
        }
	  	return;
	  } else if (user.scene.currentBattle.battleType !== BattleType.WILD) {
	  	// Switch out logic for trainer battles
        switchOutTarget.leaveField(!this.batonPass);

	  	if (switchOutTarget.hp > 0) {
        // for opponent switching out
          user.scene.prependToPhase(new SwitchSummonPhase(user.scene, switchOutTarget.getFieldIndex(), (user.scene.currentBattle.trainer ? user.scene.currentBattle.trainer.getNextSummonIndex((switchOutTarget as EnemyPokemon).trainerSlot) : 0), false, this.batonPass, false), MoveEndPhase);
        }
	  } else {
	    // Switch out logic for everything else (eg: WILD battles)
	  	switchOutTarget.leaveField(false);

	  	if (switchOutTarget.hp) {
          switchOutTarget.setWildFlee(true);
	  	  user.scene.queueMessage(i18next.t("moveTriggers:fled", {pokemonName: getPokemonNameWithAffix(switchOutTarget)}), null, true, 500);

          // in double battles redirect potential moves off fled pokemon
          if (switchOutTarget.scene.currentBattle.double) {
            const allyPokemon = switchOutTarget.getAlly();
            switchOutTarget.scene.redirectPokemonMoves(switchOutTarget, allyPokemon);
          }
	  	}

	  	if (!switchOutTarget.getAlly()?.isActive(true)) {
	  	  user.scene.clearEnemyHeldItemModifiers();

	  	  if (switchOutTarget.hp) {
	  	  	user.scene.pushPhase(new BattleEndPhase(user.scene));
	  	  	user.scene.pushPhase(new NewBattlePhase(user.scene));
	  	  }
	  	}
	  }

	  resolve(true);
	  });
  }

  getCondition(): MoveConditionFunc {
    return (user, target, move) => (move.category !== MoveCategory.STATUS || this.getSwitchOutCondition()(user, target, move));
  }

  getFailedText(user: Pokemon, target: Pokemon, move: Move, cancelled: Utils.BooleanHolder): string | null {
    const blockedByAbility = new Utils.BooleanHolder(false);
    applyAbAttrs(ForceSwitchOutImmunityAbAttr, target, blockedByAbility);
    return blockedByAbility.value ? i18next.t("moveTriggers:cannotBeSwitchedOut", {pokemonName: getPokemonNameWithAffix(target)}) : null;
  }

  getSwitchOutCondition(): MoveConditionFunc {
    return (user, target, move) => {
      const switchOutTarget = (this.user ? user : target);
      const player = switchOutTarget instanceof PlayerPokemon;

      if (!this.user && move.category === MoveCategory.STATUS && (target.hasAbilityWithAttr(ForceSwitchOutImmunityAbAttr) || target.isMax())) {
        return false;
      }

      if (!player && !user.scene.currentBattle.battleType) {
        if (this.batonPass) {
          return false;
        }
        // Don't allow wild opponents to flee on the boss stage since it can ruin a run early on
        if (!(user.scene.currentBattle.waveIndex % 10)) {
          return false;
        }
      }

      const party = player ? user.scene.getParty() : user.scene.getEnemyParty();
      return (!player && !user.scene.currentBattle.battleType) || party.filter(p => p.isAllowedInBattle() && (player || (p as EnemyPokemon).trainerSlot === (switchOutTarget as EnemyPokemon).trainerSlot)).length > user.scene.currentBattle.getBattlerCount();
    };
  }

  getUserBenefitScore(user: Pokemon, target: Pokemon, move: Move): integer {
    if (!user.scene.getEnemyParty().find(p => p.isActive() && !p.isOnField())) {
      return -20;
    }
    let ret = this.user ? Math.floor((1 - user.getHpRatio()) * 20) : super.getUserBenefitScore(user, target, move);
    if (this.user && this.batonPass) {
      const battleStatTotal = user.summonData.battleStats.reduce((bs: integer, total: integer) => total += bs, 0);
      ret = ret / 2 + (Phaser.Tweens.Builders.GetEaseFunction("Sine.easeOut")(Math.min(Math.abs(battleStatTotal), 10) / 10) * (battleStatTotal >= 0 ? 10 : -10));
    }
    return ret;
  }
}

export class RemoveTypeAttr extends MoveEffectAttr {

  private removedType: Type;
  private messageCallback: ((user: Pokemon) => void) | undefined;

  constructor(removedType: Type, messageCallback?: (user: Pokemon) => void) {
    super(true, MoveEffectTrigger.POST_TARGET);
    this.removedType = removedType;
    this.messageCallback = messageCallback;

  }

  apply(user: Pokemon, target: Pokemon, move: Move, args: any[]): boolean {
    if (!super.apply(user, target, move, args)) {
      return false;
    }

    if (user.isTerastallized() && user.getTeraType() === this.removedType) { // active tera types cannot be removed
      return false;
    }

    const userTypes = user.getTypes(true);
    const modifiedTypes = userTypes.filter(type => type !== this.removedType);
    user.summonData.types = modifiedTypes;
    user.updateInfo();


    if (this.messageCallback) {
      this.messageCallback(user);
    }

    return true;
  }
}

export class CopyTypeAttr extends MoveEffectAttr {
  constructor() {
    super(false);
  }

  apply(user: Pokemon, target: Pokemon, move: Move, args: any[]): boolean {
    if (!super.apply(user, target, move, args)) {
      return false;
    }

    user.summonData.types = target.getTypes(true);
    user.updateInfo();

    user.scene.queueMessage(i18next.t("moveTriggers:copyType", {pokemonName: getPokemonNameWithAffix(user), targetPokemonName: getPokemonNameWithAffix(target)}));

    return true;
  }

  getCondition(): MoveConditionFunc {
    return (user, target, move) => target.getTypes()[0] !== Type.UNKNOWN;
  }
}

export class CopyBiomeTypeAttr extends MoveEffectAttr {
  constructor() {
    super(true);
  }

  apply(user: Pokemon, target: Pokemon, move: Move, args: any[]): boolean {
    if (!super.apply(user, target, move, args)) {
      return false;
    }

    const biomeType = user.scene.arena.getTypeForBiome();

    user.summonData.types = [ biomeType ];
    user.updateInfo();

    user.scene.queueMessage(i18next.t("moveTriggers:transformedIntoType", {pokemonName: getPokemonNameWithAffix(user), typeName: i18next.t(`pokemonInfo:Type.${Type[biomeType]}`)}));

    return true;
  }
}

export class ChangeTypeAttr extends MoveEffectAttr {
  private type: Type;

  constructor(type: Type) {
    super(false, MoveEffectTrigger.HIT);

    this.type = type;
  }

  apply(user: Pokemon, target: Pokemon, move: Move, args: any[]): boolean {
    target.summonData.types = [this.type];
    target.updateInfo();

    user.scene.queueMessage(i18next.t("moveTriggers:transformedIntoType", {pokemonName: getPokemonNameWithAffix(target), typeName: i18next.t(`pokemonInfo:Type.${Type[this.type]}`)}));

    return true;
  }

  getCondition(): MoveConditionFunc {
    return (user, target, move) => !target.isTerastallized() && !target.hasAbility(Abilities.MULTITYPE) && !target.hasAbility(Abilities.RKS_SYSTEM) && !(target.getTypes().length === 1 && target.getTypes()[0] === this.type);
  }
}

export class AddTypeAttr extends MoveEffectAttr {
  private type: Type;

  constructor(type: Type) {
    super(false, MoveEffectTrigger.HIT);

    this.type = type;
  }

  apply(user: Pokemon, target: Pokemon, move: Move, args: any[]): boolean {
    const types = target.getTypes().slice(0, 2).filter(t => t !== Type.UNKNOWN); // TODO: Figure out some way to actually check if another version of this effect is already applied
    if (this.type !== Type.UNKNOWN) {
      types.push(this.type);
    }
    target.summonData.types = types;
    target.updateInfo();

    user.scene.queueMessage(i18next.t("moveTriggers:addType", {typeName: i18next.t(`pokemonInfo:Type.${Type[this.type]}`), pokemonName: getPokemonNameWithAffix(target)}));

    return true;
  }

  getCondition(): MoveConditionFunc {
    return (user, target, move) => !target.isTerastallized()&& !target.getTypes().includes(this.type);
  }
}

export class FirstMoveTypeAttr extends MoveEffectAttr {
  constructor() {
    super(true);
  }

  apply(user: Pokemon, target: Pokemon, move: Move, args: any[]): boolean {
    if (!super.apply(user, target, move, args)) {
      return false;
    }

    const firstMoveType = target.getMoveset()[0]?.getMove().type!; // TODO: is this bang correct?
    user.summonData.types = [ firstMoveType ];
    user.scene.queueMessage(i18next.t("battle:transformedIntoType", {pokemonName: getPokemonNameWithAffix(user), type: i18next.t(`pokemonInfo:Type.${Type[firstMoveType]}`)}));

    return true;
  }
}

export class RandomMovesetMoveAttr extends OverrideMoveEffectAttr {
  private enemyMoveset: boolean | null;

  constructor(enemyMoveset?: boolean) {
    super();

    this.enemyMoveset = enemyMoveset!; // TODO: is this bang correct?
  }

  apply(user: Pokemon, target: Pokemon, move: Move, args: any[]): boolean {
    const moveset = (!this.enemyMoveset ? user : target).getMoveset();
    const moves = moveset.filter(m => !m?.getMove().hasFlag(MoveFlags.IGNORE_VIRTUAL));
    if (moves.length) {
      const move = moves[user.randSeedInt(moves.length)];
      const moveIndex = moveset.findIndex(m => m?.moveId === move?.moveId);
      const moveTargets = getMoveTargets(user, move?.moveId!); // TODO: is this bang correct?
      if (!moveTargets.targets.length) {
        return false;
      }
      let selectTargets: BattlerIndex[];
      switch (true) {
      case (moveTargets.multiple || moveTargets.targets.length === 1): {
        selectTargets = moveTargets.targets;
        break;
      }
      case (moveTargets.targets.indexOf(target.getBattlerIndex()) > -1): {
        selectTargets = [ target.getBattlerIndex() ];
        break;
      }
      default: {
        moveTargets.targets.splice(moveTargets.targets.indexOf(user.getAlly().getBattlerIndex()));
        selectTargets =  [ moveTargets.targets[user.randSeedInt(moveTargets.targets.length)] ];
        break;
      }
      }
      const targets = selectTargets;
      user.getMoveQueue().push({ move: move?.moveId!, targets: targets, ignorePP: true }); // TODO: is this bang correct?
      user.scene.unshiftPhase(new MovePhase(user.scene, user, targets, moveset[moveIndex]!, true)); // There's a PR to re-do the move(s) that use this Attr, gonna put `!` for now
      return true;
    }

    return false;
  }
}

export class RandomMoveAttr extends OverrideMoveEffectAttr {
  apply(user: Pokemon, target: Pokemon, move: Move, args: any[]): Promise<boolean> {
    return new Promise(resolve => {
      const moveIds = Utils.getEnumValues(Moves).filter(m => !allMoves[m].hasFlag(MoveFlags.IGNORE_VIRTUAL) && !allMoves[m].name.endsWith(" (N)"));
      const moveId = moveIds[user.randSeedInt(moveIds.length)];

      const moveTargets = getMoveTargets(user, moveId);
      if (!moveTargets.targets.length) {
        resolve(false);
        return;
      }
      const targets = moveTargets.multiple || moveTargets.targets.length === 1
        ? moveTargets.targets
        : moveTargets.targets.indexOf(target.getBattlerIndex()) > -1
          ? [ target.getBattlerIndex() ]
          : [ moveTargets.targets[user.randSeedInt(moveTargets.targets.length)] ];
      user.getMoveQueue().push({ move: moveId, targets: targets, ignorePP: true });
      user.scene.unshiftPhase(new MovePhase(user.scene, user, targets, new PokemonMove(moveId, 0, 0, true), true));
      initMoveAnim(user.scene, moveId).then(() => {
        loadMoveAnimAssets(user.scene, [ moveId ], true)
          .then(() => resolve(true));
      });
    });
  }
}

const lastMoveCopiableCondition: MoveConditionFunc = (user, target, move) => {
  const copiableMove = user.scene.currentBattle.lastMove;

  if (!copiableMove) {
    return false;
  }

  if (allMoves[copiableMove].hasAttr(ChargeAttr)) {
    return false;
  }

  // TODO: Add last turn of Bide

  return true;
};

export class CopyMoveAttr extends OverrideMoveEffectAttr {
  apply(user: Pokemon, target: Pokemon, move: Move, args: any[]): boolean {
    const lastMove = user.scene.currentBattle.lastMove;

    const moveTargets = getMoveTargets(user, lastMove);
    if (!moveTargets.targets.length) {
      return false;
    }

    const targets = moveTargets.multiple || moveTargets.targets.length === 1
      ? moveTargets.targets
      : moveTargets.targets.indexOf(target.getBattlerIndex()) > -1
        ? [ target.getBattlerIndex() ]
        : [ moveTargets.targets[user.randSeedInt(moveTargets.targets.length)] ];
    user.getMoveQueue().push({ move: lastMove, targets: targets, ignorePP: true });

    user.scene.unshiftPhase(new MovePhase(user.scene, user as PlayerPokemon, targets, new PokemonMove(lastMove, 0, 0, true), true));

    return true;
  }

  getCondition(): MoveConditionFunc {
    return lastMoveCopiableCondition;
  }
}

/**
 *  Attribute used for moves that reduce PP of the target's last used move.
 *  Used for Spite.
 */
export class ReducePpMoveAttr extends MoveEffectAttr {
  protected reduction: number;
  constructor(reduction: number) {
    super();
    this.reduction = reduction;
  }

  /**
   * Reduces the PP of the target's last-used move by an amount based on this attribute instance's {@linkcode reduction}.
   *
   * @param user {@linkcode Pokemon} that used the attack
   * @param target {@linkcode Pokemon} targeted by the attack
   * @param move {@linkcode Move} being used
   * @param args N/A
   * @returns {boolean} true
   */
  apply(user: Pokemon, target: Pokemon, move: Move, args: any[]): boolean {
    // Null checks can be skipped due to condition function
    const lastMove = target.getLastXMoves().find(() => true);
    const movesetMove = target.getMoveset().find(m => m?.moveId === lastMove?.move);
    const lastPpUsed = movesetMove?.ppUsed!; // TODO: is the bang correct?
    movesetMove!.ppUsed = Math.min((movesetMove?.ppUsed!) + this.reduction, movesetMove?.getMovePp()!); // TODO: is the bang correct?

    const message = i18next.t("battle:ppReduced", {targetName: getPokemonNameWithAffix(target), moveName: movesetMove?.getName(), reduction: (movesetMove?.ppUsed!) - lastPpUsed}); // TODO: is the bang correct?
    user.scene.eventTarget.dispatchEvent(new MoveUsedEvent(target?.id, movesetMove?.getMove()!, movesetMove?.ppUsed!)); // TODO: are these bangs correct?
    user.scene.queueMessage(message);

    return true;
  }

  getCondition(): MoveConditionFunc {
    return (user, target, move) => {
      const lastMove = target.getLastXMoves().find(() => true);
      if (lastMove) {
        const movesetMove = target.getMoveset().find(m => m?.moveId === lastMove.move);
        return !!movesetMove?.getPpRatio();
      }
      return false;
    };
  }

  getTargetBenefitScore(user: Pokemon, target: Pokemon, move: Move): number {
    const lastMove = target.getLastXMoves().find(() => true);
    if (lastMove) {
      const movesetMove = target.getMoveset().find(m => m?.moveId === lastMove.move);
      if (movesetMove) {
        const maxPp = movesetMove.getMovePp();
        const ppLeft = maxPp - movesetMove.ppUsed;
        const value = -(8 - Math.ceil(Math.min(maxPp, 30) / 5));
        if (ppLeft < 4) {
          return (value / 4) * ppLeft;
        }
        return value;
      }
    }

    return 0;
  }
}

/**
 *  Attribute used for moves that damage target, and then reduce PP of the target's last used move.
 *  Used for Eerie Spell.
 */
export class AttackReducePpMoveAttr extends ReducePpMoveAttr {
  constructor(reduction: number) {
    super(reduction);
  }

  /**
   * Checks if the target has used a move prior to the attack. PP-reduction is applied through the super class if so.
   *
   * @param user {@linkcode Pokemon} that used the attack
   * @param target {@linkcode Pokemon} targeted by the attack
   * @param move {@linkcode Move} being used
   * @param args N/A
   * @returns {boolean} true
   */
  apply(user: Pokemon, target: Pokemon, move: Move, args: any[]): boolean {
    const lastMove = target.getLastXMoves().find(() => true);
    if (lastMove) {
      const movesetMove = target.getMoveset().find(m => m?.moveId === lastMove.move);
      if (Boolean(movesetMove?.getPpRatio())) {
        super.apply(user, target, move, args);
      }
    }

    return true;
  }

  // Override condition function to always perform damage. Instead, perform pp-reduction condition check in apply function above
  getCondition(): MoveConditionFunc {
    return (user, target, move) => true;
  }
}

// TODO: Review this
const targetMoveCopiableCondition: MoveConditionFunc = (user, target, move) => {
  const targetMoves = target.getMoveHistory().filter(m => !m.virtual);
  if (!targetMoves.length) {
    return false;
  }

  const copiableMove = targetMoves[0];

  if (!copiableMove.move) {
    return false;
  }

  if (allMoves[copiableMove.move].hasAttr(ChargeAttr) && copiableMove.result === MoveResult.OTHER) {
    return false;
  }

  // TODO: Add last turn of Bide

  return true;
};

export class MovesetCopyMoveAttr extends OverrideMoveEffectAttr {
  apply(user: Pokemon, target: Pokemon, move: Move, args: any[]): boolean {
    const targetMoves = target.getMoveHistory().filter(m => !m.virtual);
    if (!targetMoves.length) {
      return false;
    }

    const copiedMove = allMoves[targetMoves[0].move];

    const thisMoveIndex = user.getMoveset().findIndex(m => m?.moveId === move.id);

    if (thisMoveIndex === -1) {
      return false;
    }

    user.summonData.moveset = user.getMoveset().slice(0);
    user.summonData.moveset[thisMoveIndex] = new PokemonMove(copiedMove.id, 0, 0);

    user.scene.queueMessage(i18next.t("moveTriggers:copiedMove", {pokemonName: getPokemonNameWithAffix(user), moveName: copiedMove.name}));

    return true;
  }

  getCondition(): MoveConditionFunc {
    return targetMoveCopiableCondition;
  }
}


export class TransformAttr extends MoveEffectAttr {
  apply(user: Pokemon, target: Pokemon, move: Move, args: any[]): Promise<boolean> {
    return new Promise(resolve => {
      if (!super.apply(user, target, move, args)) {
        return resolve(false);
      }

      user.summonData.speciesForm = target.getSpeciesForm();
      user.summonData.fusionSpeciesForm = target.getFusionSpeciesForm();
      user.summonData.gender = target.getGender();
      user.summonData.fusionGender = target.getFusionGender();
      user.summonData.stats = [ user.stats[Stat.HP] ].concat(target.stats.slice(1));
      user.summonData.battleStats = target.summonData.battleStats.slice(0);
      user.summonData.moveset = target.getMoveset().map(m => new PokemonMove(m?.moveId!, m?.ppUsed, m?.ppUp)); // TODO: is this bang correct?
      user.summonData.types = target.getTypes();

      user.scene.queueMessage(i18next.t("moveTriggers:transformedIntoTarget", {pokemonName: getPokemonNameWithAffix(user), targetName: getPokemonNameWithAffix(target)}));

      user.loadAssets(false).then(() => {
        user.playAnim();
        resolve(true);
      });
    });
  }
}

export class DiscourageFrequentUseAttr extends MoveAttr {
  getUserBenefitScore(user: Pokemon, target: Pokemon, move: Move): integer {
    const lastMoves = user.getLastXMoves(4);
    console.log(lastMoves);
    for (let m = 0; m < lastMoves.length; m++) {
      if (lastMoves[m].move === move.id) {
        return (4 - (m + 1)) * -10;
      }
    }

    return 0;
  }
}

export class MoneyAttr extends MoveEffectAttr {
  constructor() {
    super(true, MoveEffectTrigger.HIT, true);
  }

  apply(user: Pokemon, target: Pokemon, move: Move): boolean {
    user.scene.currentBattle.moneyScattered += user.scene.getWaveMoneyAmount(0.2);
    user.scene.queueMessage(i18next.t("moveTriggers:coinsScatteredEverywhere"));
    return true;
  }
}

/**
 * Applies {@linkcode BattlerTagType.DESTINY_BOND} to the user.
 *
 * @extends MoveEffectAttr
 */
export class DestinyBondAttr extends MoveEffectAttr {
  constructor() {
    super(true, MoveEffectTrigger.PRE_APPLY);
  }

  /**
   * Applies {@linkcode BattlerTagType.DESTINY_BOND} to the user.
   * @param user {@linkcode Pokemon} that is having the tag applied to.
   * @param target {@linkcode Pokemon} N/A
   * @param move {@linkcode Move} {@linkcode Move.DESTINY_BOND}
   * @param {any[]} args N/A
   * @returns true
   */
  apply(user: Pokemon, target: Pokemon, move: Move, args: any[]): boolean {
    user.scene.queueMessage(`${i18next.t("moveTriggers:tryingToTakeFoeDown", {pokemonName: getPokemonNameWithAffix(user)})}`);
    user.addTag(BattlerTagType.DESTINY_BOND, undefined, move.id, user.id);
    return true;
  }
}

export class LastResortAttr extends MoveAttr {
  getCondition(): MoveConditionFunc {
    return (user: Pokemon, target: Pokemon, move: Move) => {
      const uniqueUsedMoveIds = new Set<Moves>();
      const movesetMoveIds = user.getMoveset().map(m => m?.moveId);
      user.getMoveHistory().map(m => {
        if (m.move !== move.id && movesetMoveIds.find(mm => mm === m.move)) {
          uniqueUsedMoveIds.add(m.move);
        }
      });
      return uniqueUsedMoveIds.size >= movesetMoveIds.length - 1;
    };
  }
}


/**
 * The move only works if the target has a transferable held item
 * @extends MoveAttr
 * @see {@linkcode getCondition}
 */
export class AttackedByItemAttr extends MoveAttr {
  /**
   * @returns the {@linkcode MoveConditionFunc} for this {@linkcode Move}
   */
  getCondition(): MoveConditionFunc {
    return (user: Pokemon, target: Pokemon, move: Move) => {
      const heldItems = target.getHeldItems().filter(i => i.isTransferrable);
      if (heldItems.length === 0) {
        return false;
      }

      const itemName = heldItems[0]?.type?.name ?? "item";
      target.scene.queueMessage(i18next.t("moveTriggers:attackedByItem", {pokemonName: getPokemonNameWithAffix(target), itemName: itemName}));

      return true;
    };
  }
}

export class VariableTargetAttr extends MoveAttr {
  private targetChangeFunc: (user: Pokemon, target: Pokemon, move: Move) => number;

  constructor(targetChange: (user: Pokemon, target: Pokemon, move: Move) => number) {
    super();

    this.targetChangeFunc = targetChange;
  }

  apply(user: Pokemon, target: Pokemon, move: Move, args: any[]): boolean {
    const targetVal = args[0] as Utils.NumberHolder;
    targetVal.value = this.targetChangeFunc(user, target, move);
    return true;
  }
}

const failOnGravityCondition: MoveConditionFunc = (user, target, move) => !user.scene.arena.getTag(ArenaTagType.GRAVITY);

const failOnMaxCondition: MoveConditionFunc = (user, target, move) => !target.isMax();

const failIfDampCondition: MoveConditionFunc = (user, target, move) => {
  const cancelled = new Utils.BooleanHolder(false);
  user.scene.getField(true).map(p=>applyAbAttrs(FieldPreventExplosiveMovesAbAttr, p, cancelled));
  // Queue a message if an ability prevented usage of the move
  if (cancelled.value) {
    user.scene.queueMessage(i18next.t("moveTriggers:cannotUseMove", {pokemonName: getPokemonNameWithAffix(user), moveName: move.name}));
  }
  return !cancelled.value;
};


const targetSleptOrComatoseCondition: MoveConditionFunc = (user: Pokemon, target: Pokemon, move: Move) =>  target.status?.effect === StatusEffect.SLEEP || target.hasAbility(Abilities.COMATOSE);

export type MoveAttrFilter = (attr: MoveAttr) => boolean;

function applyMoveAttrsInternal(attrFilter: MoveAttrFilter, user: Pokemon | null, target: Pokemon | null, move: Move, args: any[]): Promise<void> {
  return new Promise(resolve => {
    const attrPromises: Promise<boolean>[] = [];
    const moveAttrs = move.attrs.filter(a => attrFilter(a));
    for (const attr of moveAttrs) {
      const result = attr.apply(user, target, move, args);
      if (result instanceof Promise) {
        attrPromises.push(result);
      }
    }
    Promise.allSettled(attrPromises).then(() => resolve());
  });
}

export function applyMoveAttrs(attrType: Constructor<MoveAttr>, user: Pokemon | null, target: Pokemon | null, move: Move, ...args: any[]): Promise<void> {
  return applyMoveAttrsInternal((attr: MoveAttr) => attr instanceof attrType, user, target, move, args);
}

export function applyFilteredMoveAttrs(attrFilter: MoveAttrFilter, user: Pokemon, target: Pokemon | null, move: Move, ...args: any[]): Promise<void> {
  return applyMoveAttrsInternal(attrFilter, user, target, move, args);
}

export class MoveCondition {
  protected func: MoveConditionFunc;

  constructor(func: MoveConditionFunc) {
    this.func = func;
  }

  apply(user: Pokemon, target: Pokemon, move: Move): boolean {
    return this.func(user, target, move);
  }

  getUserBenefitScore(user: Pokemon, target: Pokemon, move: Move): integer {
    return 0;
  }
}

export class FirstMoveCondition extends MoveCondition {
  constructor() {
    super((user, target, move) => user.battleSummonData?.turnCount === 1);
  }

  getUserBenefitScore(user: Pokemon, target: Pokemon, move: Move): integer {
    return this.apply(user, target, move) ? 10 : -20;
  }
}

export class hitsSameTypeAttr extends VariableMoveTypeMultiplierAttr {
  apply(user: Pokemon, target: Pokemon, move: Move, args: any[]): boolean {
    const multiplier = args[0] as Utils.NumberHolder;
    if (!user.getTypes().some(type => target.getTypes().includes(type))) {
      multiplier.value = 0;
      return true;
    }
    return false;
  }
}

/**
 * Attribute used for Conversion 2, to convert the user's type to a random type that resists the target's last used move.
 * Fails if the user already has ALL types that resist the target's last used move.
 * Fails if the opponent has not used a move yet
 * Fails if the type is unknown or stellar
 *
 * TODO:
 * If a move has its type changed (e.g. {@linkcode Moves.HIDDEN_POWER}), it will check the new type.
 */
export class ResistLastMoveTypeAttr extends MoveEffectAttr {
  constructor() {
    super(true);
  }
  /**
   * User changes its type to a random type that resists the target's last used move
   * @param {Pokemon} user Pokemon that used the move and will change types
   * @param {Pokemon} target Opposing pokemon that recently used a move
   * @param {Move} move Move being used
   * @param {any[]} args Unused
   * @returns {boolean} true if the function succeeds
   */
  apply(user: Pokemon, target: Pokemon, move: Move, args: any[]): boolean {
    if (!super.apply(user, target, move, args)) {
      return false;
    }

    const [targetMove] = target.getLastXMoves(1); // target's most recent move
    if (!targetMove) {
      return false;
    }

    const moveData = allMoves[targetMove.move];
    const userTypes = user.getTypes();
    const validTypes = this.getTypeResistances(user.scene.gameMode, moveData.type).filter(t => !userTypes.includes(t)); // valid types are ones that are not already the user's types
    if (!validTypes.length) {
      return false;
    }
    const type = validTypes[user.randSeedInt(validTypes.length)];
    user.summonData.types = [ type ];
    user.scene.queueMessage(i18next.t("battle:transformedIntoType", {pokemonName: getPokemonNameWithAffix(user), type: Utils.toReadableString(Type[type])}));
    user.updateInfo();

    return true;
  }

  /**
   * Retrieve the types resisting a given type. Used by Conversion 2
   * @returns An array populated with Types, or an empty array if no resistances exist (Unknown or Stellar type)
   */
  getTypeResistances(gameMode: GameMode, type: number): Type[] {
    const typeResistances: Type[] = [];

    for (let i = 0; i < Object.keys(Type).length; i++) {
      const multiplier = new NumberHolder(1);
      multiplier.value = getTypeDamageMultiplier(type, i);
      applyChallenges(gameMode, ChallengeType.TYPE_EFFECTIVENESS, multiplier);
      if (multiplier.value < 1) {
        typeResistances.push(i);
      }
    }

    return typeResistances;
  }

  getCondition(): MoveConditionFunc {
    return (user, target, move) => {
      const moveHistory = target.getLastXMoves();
      return moveHistory.length !== 0;
    };
  }
}

/**
 * Drops the target's immunity to types it is immune to
 * and makes its evasiveness be ignored during accuracy
 * checks. Used by: {@linkcode Moves.ODOR_SLEUTH | Odor Sleuth}, {@linkcode Moves.MIRACLE_EYE | Miracle Eye} and {@linkcode Moves.FORESIGHT | Foresight}
 *
 * @extends AddBattlerTagAttr
 * @see {@linkcode apply}
 */
export class ExposedMoveAttr extends AddBattlerTagAttr {
  constructor(tagType: BattlerTagType) {
    super(tagType, false, true);
  }

  /**
   * Applies {@linkcode ExposedTag} to the target.
   * @param user {@linkcode Pokemon} using this move
   * @param target {@linkcode Pokemon} target of this move
   * @param move {@linkcode Move} being used
   * @param args N/A
   * @returns `true` if the function succeeds
   */
  apply(user: Pokemon, target: Pokemon, move: Move, args: any[]): boolean {
    if (!super.apply(user, target, move, args)) {
      return false;
    }

    user.scene.queueMessage(i18next.t("moveTriggers:exposedMove", { pokemonName: getPokemonNameWithAffix(user), targetPokemonName: getPokemonNameWithAffix(target)}));

    return true;
  }
}


export type MoveTargetSet = {
  targets: BattlerIndex[];
  multiple: boolean;
};

export function getMoveTargets(user: Pokemon, move: Moves): MoveTargetSet {
  const variableTarget = new Utils.NumberHolder(0);
  user.getOpponents().forEach(p => applyMoveAttrs(VariableTargetAttr, user, p, allMoves[move], variableTarget));

  const moveTarget = allMoves[move].hasAttr(VariableTargetAttr) ? variableTarget.value : move ? allMoves[move].moveTarget : move === undefined ? MoveTarget.NEAR_ENEMY : [];
  const opponents = user.getOpponents();

  let set: Pokemon[] = [];
  let multiple = false;

  switch (moveTarget) {
  case MoveTarget.USER:
  case MoveTarget.PARTY:
    set = [ user ];
    break;
  case MoveTarget.NEAR_OTHER:
  case MoveTarget.OTHER:
  case MoveTarget.ALL_NEAR_OTHERS:
  case MoveTarget.ALL_OTHERS:
    set = (opponents.concat([ user.getAlly() ]));
    multiple = moveTarget === MoveTarget.ALL_NEAR_OTHERS || moveTarget === MoveTarget.ALL_OTHERS;
    break;
  case MoveTarget.NEAR_ENEMY:
  case MoveTarget.ALL_NEAR_ENEMIES:
  case MoveTarget.ALL_ENEMIES:
  case MoveTarget.ENEMY_SIDE:
    set = opponents;
    multiple = moveTarget !== MoveTarget.NEAR_ENEMY;
    break;
  case MoveTarget.RANDOM_NEAR_ENEMY:
    set = [ opponents[user.randSeedInt(opponents.length)] ];
    break;
  case MoveTarget.ATTACKER:
    return { targets: [ -1 as BattlerIndex ], multiple: false };
  case MoveTarget.NEAR_ALLY:
  case MoveTarget.ALLY:
    set = [ user.getAlly() ];
    break;
  case MoveTarget.USER_OR_NEAR_ALLY:
  case MoveTarget.USER_AND_ALLIES:
  case MoveTarget.USER_SIDE:
    set = [ user, user.getAlly() ];
    multiple = moveTarget !== MoveTarget.USER_OR_NEAR_ALLY;
    break;
  case MoveTarget.ALL:
  case MoveTarget.BOTH_SIDES:
    set = [ user, user.getAlly() ].concat(opponents);
    multiple = true;
    break;
  case MoveTarget.CURSE:
    set = user.getTypes(true).includes(Type.GHOST) ? (opponents.concat([ user.getAlly() ])) : [ user ];
    break;
  }

  return { targets: set.filter(p => p?.isActive(true)).map(p => p.getBattlerIndex()).filter(t => t !== undefined), multiple };
}

export const allMoves: { [id: number] : Move} = {};

export const selfStatLowerMoves: Moves[] = [];

export function initMoves() {
  [
    new AttackMove(Moves.POUND, Type.NORMAL, MoveCategory.PHYSICAL, 40, 100, 35, -1, 0, 1),
    new AttackMove(Moves.KARATE_CHOP, Type.FIGHTING, MoveCategory.PHYSICAL, 50, 100, 25, -1, 0, 1)
      .attr(HighCritAttr),
    new AttackMove(Moves.DOUBLE_SLAP, Type.NORMAL, MoveCategory.PHYSICAL, 15, 85, 10, -1, 0, 1)
      .attr(MultiHitAttr),
    new AttackMove(Moves.COMET_PUNCH, Type.NORMAL, MoveCategory.PHYSICAL, 18, 85, 15, -1, 0, 1)
      .attr(MultiHitAttr)
      .punchingMove(),
    new AttackMove(Moves.MEGA_PUNCH, Type.NORMAL, MoveCategory.PHYSICAL, 80, 85, 20, -1, 0, 1)
      .punchingMove(),
    new AttackMove(Moves.PAY_DAY, Type.NORMAL, MoveCategory.PHYSICAL, 40, 100, 20, -1, 0, 1)
      .attr(MoneyAttr)
      .makesContact(false),
    new AttackMove(Moves.FIRE_PUNCH, Type.FIRE, MoveCategory.PHYSICAL, 75, 100, 15, 10, 0, 1)
      .attr(StatusEffectAttr, StatusEffect.BURN)
      .punchingMove(),
    new AttackMove(Moves.ICE_PUNCH, Type.ICE, MoveCategory.PHYSICAL, 75, 100, 15, 10, 0, 1)
      .attr(StatusEffectAttr, StatusEffect.FREEZE)
      .punchingMove(),
    new AttackMove(Moves.THUNDER_PUNCH, Type.ELECTRIC, MoveCategory.PHYSICAL, 75, 100, 15, 10, 0, 1)
      .attr(StatusEffectAttr, StatusEffect.PARALYSIS)
      .punchingMove(),
    new AttackMove(Moves.SCRATCH, Type.NORMAL, MoveCategory.PHYSICAL, 40, 100, 35, -1, 0, 1),
    new AttackMove(Moves.VISE_GRIP, Type.NORMAL, MoveCategory.PHYSICAL, 55, 100, 30, -1, 0, 1),
    new AttackMove(Moves.GUILLOTINE, Type.NORMAL, MoveCategory.PHYSICAL, 200, 30, 5, -1, 0, 1)
      .attr(OneHitKOAttr)
      .attr(OneHitKOAccuracyAttr),
    new AttackMove(Moves.RAZOR_WIND, Type.NORMAL, MoveCategory.SPECIAL, 80, 100, 10, -1, 0, 1)
      .attr(ChargeAttr, ChargeAnim.RAZOR_WIND_CHARGING, i18next.t("moveTriggers:whippedUpAWhirlwind", {pokemonName: "{USER}"}))
      .attr(HighCritAttr)
      .windMove()
      .ignoresVirtual()
      .target(MoveTarget.ALL_NEAR_ENEMIES),
    new SelfStatusMove(Moves.SWORDS_DANCE, Type.NORMAL, -1, 20, -1, 0, 1)
      .attr(StatChangeAttr, BattleStat.ATK, 2, true)
      .danceMove(),
    new AttackMove(Moves.CUT, Type.NORMAL, MoveCategory.PHYSICAL, 50, 95, 30, -1, 0, 1)
      .slicingMove(),
    new AttackMove(Moves.GUST, Type.FLYING, MoveCategory.SPECIAL, 40, 100, 35, -1, 0, 1)
      .attr(HitsTagAttr, BattlerTagType.FLYING, true)
      .windMove(),
    new AttackMove(Moves.WING_ATTACK, Type.FLYING, MoveCategory.PHYSICAL, 60, 100, 35, -1, 0, 1),
    new StatusMove(Moves.WHIRLWIND, Type.NORMAL, -1, 20, -1, -6, 1)
      .attr(ForceSwitchOutAttr)
      .attr(HitsTagAttr, BattlerTagType.FLYING, false)
      .hidesTarget()
      .windMove(),
    new AttackMove(Moves.FLY, Type.FLYING, MoveCategory.PHYSICAL, 90, 95, 15, -1, 0, 1)
      .attr(ChargeAttr, ChargeAnim.FLY_CHARGING, i18next.t("moveTriggers:flewUpHigh", {pokemonName: "{USER}"}), BattlerTagType.FLYING)
      .condition(failOnGravityCondition)
      .ignoresVirtual(),
    new AttackMove(Moves.BIND, Type.NORMAL, MoveCategory.PHYSICAL, 15, 85, 20, -1, 0, 1)
      .attr(TrapAttr, BattlerTagType.BIND),
    new AttackMove(Moves.SLAM, Type.NORMAL, MoveCategory.PHYSICAL, 80, 75, 20, -1, 0, 1),
    new AttackMove(Moves.VINE_WHIP, Type.GRASS, MoveCategory.PHYSICAL, 45, 100, 25, -1, 0, 1),
    new AttackMove(Moves.STOMP, Type.NORMAL, MoveCategory.PHYSICAL, 65, 100, 20, 30, 0, 1)
      .attr(MinimizeAccuracyAttr)
      .attr(HitsTagAttr, BattlerTagType.MINIMIZED, true)
      .attr(FlinchAttr),
    new AttackMove(Moves.DOUBLE_KICK, Type.FIGHTING, MoveCategory.PHYSICAL, 30, 100, 30, -1, 0, 1)
      .attr(MultiHitAttr, MultiHitType._2),
    new AttackMove(Moves.MEGA_KICK, Type.NORMAL, MoveCategory.PHYSICAL, 120, 75, 5, -1, 0, 1),
    new AttackMove(Moves.JUMP_KICK, Type.FIGHTING, MoveCategory.PHYSICAL, 100, 95, 10, -1, 0, 1)
      .attr(MissEffectAttr, crashDamageFunc)
      .attr(NoEffectAttr, crashDamageFunc)
      .condition(failOnGravityCondition)
      .recklessMove(),
    new AttackMove(Moves.ROLLING_KICK, Type.FIGHTING, MoveCategory.PHYSICAL, 60, 85, 15, 30, 0, 1)
      .attr(FlinchAttr),
    new StatusMove(Moves.SAND_ATTACK, Type.GROUND, 100, 15, -1, 0, 1)
      .attr(StatChangeAttr, BattleStat.ACC, -1),
    new AttackMove(Moves.HEADBUTT, Type.NORMAL, MoveCategory.PHYSICAL, 70, 100, 15, 30, 0, 1)
      .attr(FlinchAttr),
    new AttackMove(Moves.HORN_ATTACK, Type.NORMAL, MoveCategory.PHYSICAL, 65, 100, 25, -1, 0, 1),
    new AttackMove(Moves.FURY_ATTACK, Type.NORMAL, MoveCategory.PHYSICAL, 15, 85, 20, -1, 0, 1)
      .attr(MultiHitAttr),
    new AttackMove(Moves.HORN_DRILL, Type.NORMAL, MoveCategory.PHYSICAL, 200, 30, 5, -1, 0, 1)
      .attr(OneHitKOAttr)
      .attr(OneHitKOAccuracyAttr),
    new AttackMove(Moves.TACKLE, Type.NORMAL, MoveCategory.PHYSICAL, 40, 100, 35, -1, 0, 1),
    new AttackMove(Moves.BODY_SLAM, Type.NORMAL, MoveCategory.PHYSICAL, 85, 100, 15, 30, 0, 1)
      .attr(MinimizeAccuracyAttr)
      .attr(HitsTagAttr, BattlerTagType.MINIMIZED, true)
      .attr(StatusEffectAttr, StatusEffect.PARALYSIS),
    new AttackMove(Moves.WRAP, Type.NORMAL, MoveCategory.PHYSICAL, 15, 90, 20, -1, 0, 1)
      .attr(TrapAttr, BattlerTagType.WRAP),
    new AttackMove(Moves.TAKE_DOWN, Type.NORMAL, MoveCategory.PHYSICAL, 90, 85, 20, -1, 0, 1)
      .attr(RecoilAttr)
      .recklessMove(),
    new AttackMove(Moves.THRASH, Type.NORMAL, MoveCategory.PHYSICAL, 120, 100, 10, -1, 0, 1)
      .attr(FrenzyAttr)
      .attr(MissEffectAttr, frenzyMissFunc)
      .attr(NoEffectAttr, frenzyMissFunc)
      .target(MoveTarget.RANDOM_NEAR_ENEMY),
    new AttackMove(Moves.DOUBLE_EDGE, Type.NORMAL, MoveCategory.PHYSICAL, 120, 100, 15, -1, 0, 1)
      .attr(RecoilAttr, false, 0.33)
      .recklessMove(),
    new StatusMove(Moves.TAIL_WHIP, Type.NORMAL, 100, 30, -1, 0, 1)
      .attr(StatChangeAttr, BattleStat.DEF, -1)
      .target(MoveTarget.ALL_NEAR_ENEMIES),
    new AttackMove(Moves.POISON_STING, Type.POISON, MoveCategory.PHYSICAL, 15, 100, 35, 30, 0, 1)
      .attr(StatusEffectAttr, StatusEffect.POISON)
      .makesContact(false),
    new AttackMove(Moves.TWINEEDLE, Type.BUG, MoveCategory.PHYSICAL, 25, 100, 20, 20, 0, 1)
      .attr(MultiHitAttr, MultiHitType._2)
      .attr(StatusEffectAttr, StatusEffect.POISON)
      .makesContact(false),
    new AttackMove(Moves.PIN_MISSILE, Type.BUG, MoveCategory.PHYSICAL, 25, 95, 20, -1, 0, 1)
      .attr(MultiHitAttr)
      .makesContact(false),
    new StatusMove(Moves.LEER, Type.NORMAL, 100, 30, -1, 0, 1)
      .attr(StatChangeAttr, BattleStat.DEF, -1)
      .target(MoveTarget.ALL_NEAR_ENEMIES),
    new AttackMove(Moves.BITE, Type.NORMAL, MoveCategory.PHYSICAL, 60, 100, 25, 30, 0, 1)
      .attr(FlinchAttr)
      .bitingMove(),
    new StatusMove(Moves.GROWL, Type.NORMAL, 100, 40, -1, 0, 1)
      .attr(StatChangeAttr, BattleStat.ATK, -1)
      .soundBased()
      .target(MoveTarget.ALL_NEAR_ENEMIES),
    new StatusMove(Moves.ROAR, Type.NORMAL, -1, 20, -1, -6, 1)
      .attr(ForceSwitchOutAttr)
      .soundBased()
      .hidesTarget(),
    new StatusMove(Moves.SING, Type.NORMAL, 55, 15, -1, 0, 1)
      .attr(StatusEffectAttr, StatusEffect.SLEEP)
      .soundBased(),
    new StatusMove(Moves.SUPERSONIC, Type.NORMAL, 55, 20, -1, 0, 1)
      .attr(ConfuseAttr)
      .soundBased(),
    new AttackMove(Moves.SONIC_BOOM, Type.NORMAL, MoveCategory.SPECIAL, -1, 90, 20, -1, 0, 1)
      .attr(FixedDamageAttr, 20),
    new StatusMove(Moves.DISABLE, Type.NORMAL, 100, 20, -1, 0, 1)
      .attr(DisableMoveAttr)
      .condition(failOnMaxCondition),
    new AttackMove(Moves.ACID, Type.POISON, MoveCategory.SPECIAL, 40, 100, 30, 10, 0, 1)
      .attr(StatChangeAttr, BattleStat.SPEC, -1)
      .target(MoveTarget.ALL_NEAR_ENEMIES),
    new AttackMove(Moves.EMBER, Type.FIRE, MoveCategory.SPECIAL, 40, 100, 25, 10, 0, 1)
      .attr(StatusEffectAttr, StatusEffect.BURN),
    new AttackMove(Moves.FLAMETHROWER, Type.FIRE, MoveCategory.SPECIAL, 90, 100, 15, 10, 0, 1)
      .attr(StatusEffectAttr, StatusEffect.BURN),
    new StatusMove(Moves.MIST, Type.ICE, -1, 30, -1, 0, 1)
      .attr(AddArenaTagAttr, ArenaTagType.MIST, 5, true)
      .target(MoveTarget.USER_SIDE),
    new AttackMove(Moves.WATER_GUN, Type.WATER, MoveCategory.SPECIAL, 40, 100, 25, -1, 0, 1),
    new AttackMove(Moves.HYDRO_PUMP, Type.WATER, MoveCategory.SPECIAL, 110, 80, 5, -1, 0, 1),
    new AttackMove(Moves.SURF, Type.WATER, MoveCategory.SPECIAL, 90, 100, 15, -1, 0, 1)
      .target(MoveTarget.ALL_NEAR_OTHERS)
      .attr(HitsTagAttr, BattlerTagType.UNDERWATER, true),
    new AttackMove(Moves.ICE_BEAM, Type.ICE, MoveCategory.SPECIAL, 90, 100, 10, 10, 0, 1)
      .attr(StatusEffectAttr, StatusEffect.FREEZE),
    new AttackMove(Moves.BLIZZARD, Type.ICE, MoveCategory.SPECIAL, 110, 70, 5, 10, 0, 1)
      .attr(BlizzardAccuracyAttr)
      .attr(StatusEffectAttr, StatusEffect.FREEZE)
      .windMove()
      .target(MoveTarget.ALL_NEAR_ENEMIES),
    new AttackMove(Moves.PSYBEAM, Type.PSYCHIC, MoveCategory.SPECIAL, 65, 100, 20, 10, 0, 1)
      .attr(ConfuseAttr),
    new AttackMove(Moves.BUBBLE_BEAM, Type.WATER, MoveCategory.SPECIAL, 65, 100, 20, 10, 0, 1)
      .attr(StatChangeAttr, BattleStat.SPD, -1),
    new AttackMove(Moves.AURORA_BEAM, Type.ICE, MoveCategory.SPECIAL, 65, 100, 20, 10, 0, 1)
      .attr(StatChangeAttr, BattleStat.ATK, -1),
    new AttackMove(Moves.HYPER_BEAM, Type.NORMAL, MoveCategory.SPECIAL, 150, 90, 5, -1, 0, 1)
      .attr(RechargeAttr),
    new AttackMove(Moves.PECK, Type.FLYING, MoveCategory.PHYSICAL, 35, 100, 35, -1, 0, 1),
    new AttackMove(Moves.DRILL_PECK, Type.FLYING, MoveCategory.PHYSICAL, 80, 100, 20, -1, 0, 1),
    new AttackMove(Moves.SUBMISSION, Type.FIGHTING, MoveCategory.PHYSICAL, 80, 80, 20, -1, 0, 1)
      .attr(RecoilAttr)
      .recklessMove(),
    new AttackMove(Moves.LOW_KICK, Type.FIGHTING, MoveCategory.PHYSICAL, -1, 100, 20, -1, 0, 1)
      .attr(WeightPowerAttr)
      .condition(failOnMaxCondition),
    new AttackMove(Moves.COUNTER, Type.FIGHTING, MoveCategory.PHYSICAL, -1, 100, 20, -1, -5, 1)
      .attr(CounterDamageAttr, (move: Move) => move.category === MoveCategory.PHYSICAL, 2)
      .target(MoveTarget.ATTACKER),
    new AttackMove(Moves.SEISMIC_TOSS, Type.FIGHTING, MoveCategory.PHYSICAL, -1, 100, 20, -1, 0, 1)
      .attr(LevelDamageAttr),
    new AttackMove(Moves.STRENGTH, Type.NORMAL, MoveCategory.PHYSICAL, 80, 100, 15, -1, 0, 1),
    new AttackMove(Moves.ABSORB, Type.GRASS, MoveCategory.SPECIAL, 20, 100, 25, -1, 0, 1)
      .attr(HitHealAttr)
      .triageMove(),
    new AttackMove(Moves.MEGA_DRAIN, Type.GRASS, MoveCategory.SPECIAL, 40, 100, 15, -1, 0, 1)
      .attr(HitHealAttr)
      .triageMove(),
    new StatusMove(Moves.LEECH_SEED, Type.GRASS, 90, 10, -1, 0, 1)
      .attr(AddBattlerTagAttr, BattlerTagType.SEEDED)
      .condition((user, target, move) => !target.getTag(BattlerTagType.SEEDED) && !target.isOfType(Type.GRASS)),
    new SelfStatusMove(Moves.GROWTH, Type.NORMAL, -1, 20, -1, 0, 1)
      .attr(GrowthStatChangeAttr),
    new AttackMove(Moves.RAZOR_LEAF, Type.GRASS, MoveCategory.PHYSICAL, 55, 95, 25, -1, 0, 1)
      .attr(HighCritAttr)
      .makesContact(false)
      .slicingMove()
      .target(MoveTarget.ALL_NEAR_ENEMIES),
    new AttackMove(Moves.SOLAR_BEAM, Type.GRASS, MoveCategory.SPECIAL, 120, 100, 10, -1, 0, 1)
      .attr(SunlightChargeAttr, ChargeAnim.SOLAR_BEAM_CHARGING, i18next.t("moveTriggers:tookInSunlight", {pokemonName: "{USER}"}))
      .attr(AntiSunlightPowerDecreaseAttr)
      .ignoresVirtual(),
    new StatusMove(Moves.POISON_POWDER, Type.POISON, 75, 35, -1, 0, 1)
      .attr(StatusEffectAttr, StatusEffect.POISON)
      .powderMove(),
    new StatusMove(Moves.STUN_SPORE, Type.GRASS, 75, 30, -1, 0, 1)
      .attr(StatusEffectAttr, StatusEffect.PARALYSIS)
      .powderMove(),
    new StatusMove(Moves.SLEEP_POWDER, Type.GRASS, 75, 15, -1, 0, 1)
      .attr(StatusEffectAttr, StatusEffect.SLEEP)
      .powderMove(),
    new AttackMove(Moves.PETAL_DANCE, Type.GRASS, MoveCategory.SPECIAL, 120, 100, 10, -1, 0, 1)
      .attr(FrenzyAttr)
      .attr(MissEffectAttr, frenzyMissFunc)
      .attr(NoEffectAttr, frenzyMissFunc)
      .makesContact()
      .danceMove()
      .target(MoveTarget.RANDOM_NEAR_ENEMY),
    new StatusMove(Moves.STRING_SHOT, Type.BUG, 95, 40, -1, 0, 1)
      .attr(StatChangeAttr, BattleStat.SPD, -2)
      .target(MoveTarget.ALL_NEAR_ENEMIES),
    new AttackMove(Moves.DRAGON_RAGE, Type.DRAGON, MoveCategory.SPECIAL, -1, 100, 10, -1, 0, 1)
      .attr(FixedDamageAttr, 40),
    new AttackMove(Moves.FIRE_SPIN, Type.FIRE, MoveCategory.SPECIAL, 35, 85, 15, -1, 0, 1)
      .attr(TrapAttr, BattlerTagType.FIRE_SPIN),
    new AttackMove(Moves.THUNDER_SHOCK, Type.ELECTRIC, MoveCategory.SPECIAL, 40, 100, 30, 10, 0, 1)
      .attr(StatusEffectAttr, StatusEffect.PARALYSIS),
    new AttackMove(Moves.THUNDERBOLT, Type.ELECTRIC, MoveCategory.SPECIAL, 90, 100, 15, 10, 0, 1)
      .attr(StatusEffectAttr, StatusEffect.PARALYSIS),
    new StatusMove(Moves.THUNDER_WAVE, Type.ELECTRIC, 90, 20, -1, 0, 1)
      .attr(StatusEffectAttr, StatusEffect.PARALYSIS)
      .attr(RespectAttackTypeImmunityAttr),
    new AttackMove(Moves.THUNDER, Type.ELECTRIC, MoveCategory.SPECIAL, 110, 70, 10, 30, 0, 1)
      .attr(StatusEffectAttr, StatusEffect.PARALYSIS)
      .attr(ThunderAccuracyAttr)
      .attr(HitsTagAttr, BattlerTagType.FLYING, false),
    new AttackMove(Moves.ROCK_THROW, Type.ROCK, MoveCategory.PHYSICAL, 50, 90, 15, -1, 0, 1)
      .makesContact(false),
    new AttackMove(Moves.EARTHQUAKE, Type.GROUND, MoveCategory.PHYSICAL, 100, 100, 10, -1, 0, 1)
      .attr(HitsTagAttr, BattlerTagType.UNDERGROUND, true)
      .makesContact(false)
      .target(MoveTarget.ALL_NEAR_OTHERS),
    new AttackMove(Moves.FISSURE, Type.GROUND, MoveCategory.PHYSICAL, 200, 30, 5, -1, 0, 1)
      .attr(OneHitKOAttr)
      .attr(OneHitKOAccuracyAttr)
      .attr(HitsTagAttr, BattlerTagType.UNDERGROUND, false)
      .makesContact(false),
    new AttackMove(Moves.DIG, Type.GROUND, MoveCategory.PHYSICAL, 80, 100, 10, -1, 0, 1)
      .attr(ChargeAttr, ChargeAnim.DIG_CHARGING, i18next.t("moveTriggers:dugAHole", {pokemonName: "{USER}"}), BattlerTagType.UNDERGROUND)
      .ignoresVirtual(),
    new StatusMove(Moves.TOXIC, Type.POISON, 90, 10, -1, 0, 1)
      .attr(StatusEffectAttr, StatusEffect.TOXIC)
      .attr(ToxicAccuracyAttr),
    new AttackMove(Moves.CONFUSION, Type.PSYCHIC, MoveCategory.SPECIAL, 50, 100, 25, 10, 0, 1)
      .attr(ConfuseAttr),
    new AttackMove(Moves.PSYCHIC, Type.PSYCHIC, MoveCategory.SPECIAL, 90, 100, 10, 10, 0, 1)
      .attr(StatChangeAttr, BattleStat.SPEC, -1),
    new StatusMove(Moves.HYPNOSIS, Type.PSYCHIC, 60, 20, -1, 0, 1)
      .attr(StatusEffectAttr, StatusEffect.SLEEP),
    new SelfStatusMove(Moves.AGILITY, Type.PSYCHIC, -1, 30, -1, 0, 1)
      .attr(StatChangeAttr, BattleStat.SPD, 2, true),
    new AttackMove(Moves.QUICK_ATTACK, Type.NORMAL, MoveCategory.PHYSICAL, 40, 100, 30, -1, 1, 1),
    new AttackMove(Moves.RAGE, Type.NORMAL, MoveCategory.PHYSICAL, 20, 100, 20, -1, 0, 1)
      .partial(),
    new SelfStatusMove(Moves.TELEPORT, Type.PSYCHIC, -1, 20, -1, -6, 1)
      .attr(ForceSwitchOutAttr, true)
      .hidesUser(),
    new AttackMove(Moves.NIGHT_SHADE, Type.GHOST, MoveCategory.SPECIAL, -1, 100, 15, -1, 0, 1)
      .attr(LevelDamageAttr),
    new StatusMove(Moves.MIMIC, Type.NORMAL, -1, 10, -1, 0, 1)
      .attr(MovesetCopyMoveAttr)
      .ignoresVirtual(),
    new StatusMove(Moves.SCREECH, Type.NORMAL, 85, 40, -1, 0, 1)
      .attr(StatChangeAttr, BattleStat.DEF, -2)
      .soundBased(),
    new SelfStatusMove(Moves.DOUBLE_TEAM, Type.NORMAL, -1, 15, -1, 0, 1)
      .attr(StatChangeAttr, BattleStat.EVA, 1, true),
    new SelfStatusMove(Moves.RECOVER, Type.NORMAL, -1, 5, -1, 0, 1)
      .attr(HealAttr, 0.5)
      .triageMove(),
    new SelfStatusMove(Moves.HARDEN, Type.NORMAL, -1, 30, -1, 0, 1)
      .attr(StatChangeAttr, BattleStat.DEF, 1, true),
    new SelfStatusMove(Moves.MINIMIZE, Type.NORMAL, -1, 10, -1, 0, 1)
      .attr(AddBattlerTagAttr, BattlerTagType.MINIMIZED, true, false)
      .attr(StatChangeAttr, BattleStat.EVA, 2, true),
    new StatusMove(Moves.SMOKESCREEN, Type.NORMAL, 100, 20, -1, 0, 1)
      .attr(StatChangeAttr, BattleStat.ACC, -1),
    new StatusMove(Moves.CONFUSE_RAY, Type.GHOST, 100, 10, -1, 0, 1)
      .attr(ConfuseAttr),
    new SelfStatusMove(Moves.WITHDRAW, Type.WATER, -1, 40, -1, 0, 1)
      .attr(StatChangeAttr, BattleStat.DEF, 1, true),
    new SelfStatusMove(Moves.DEFENSE_CURL, Type.NORMAL, -1, 40, -1, 0, 1)
      .attr(StatChangeAttr, BattleStat.DEF, 1, true),
    new SelfStatusMove(Moves.BARRIER, Type.PSYCHIC, -1, 20, -1, 0, 1)
      .attr(StatChangeAttr, BattleStat.DEF, 2, true),
    new StatusMove(Moves.LIGHT_SCREEN, Type.PSYCHIC, -1, 30, -1, 0, 1)
      .attr(AddArenaTagAttr, ArenaTagType.LIGHT_SCREEN, 5, true)
      .target(MoveTarget.USER_SIDE),
    new SelfStatusMove(Moves.HAZE, Type.ICE, -1, 30, -1, 0, 1)
      .attr(ResetStatsAttr, true),
    new StatusMove(Moves.REFLECT, Type.PSYCHIC, -1, 20, -1, 0, 1)
      .attr(AddArenaTagAttr, ArenaTagType.REFLECT, 5, true)
      .target(MoveTarget.USER_SIDE),
    new SelfStatusMove(Moves.FOCUS_ENERGY, Type.NORMAL, -1, 30, -1, 0, 1)
      .attr(AddBattlerTagAttr, BattlerTagType.CRIT_BOOST, true, true),
    new AttackMove(Moves.BIDE, Type.NORMAL, MoveCategory.PHYSICAL, -1, -1, 10, -1, 1, 1)
      .ignoresVirtual()
      .target(MoveTarget.USER)
      .unimplemented(),
    new SelfStatusMove(Moves.METRONOME, Type.NORMAL, -1, 10, -1, 0, 1)
      .attr(RandomMoveAttr)
      .ignoresVirtual(),
    new StatusMove(Moves.MIRROR_MOVE, Type.FLYING, -1, 20, -1, 0, 1)
      .attr(CopyMoveAttr)
      .ignoresVirtual(),
    new AttackMove(Moves.SELF_DESTRUCT, Type.NORMAL, MoveCategory.PHYSICAL, 200, 100, 5, -1, 0, 1)
      .attr(SacrificialAttr)
      .makesContact(false)
      .condition(failIfDampCondition)
      .target(MoveTarget.ALL_NEAR_OTHERS),
    new AttackMove(Moves.EGG_BOMB, Type.NORMAL, MoveCategory.PHYSICAL, 100, 75, 10, -1, 0, 1)
      .makesContact(false)
      .ballBombMove(),
    new AttackMove(Moves.LICK, Type.GHOST, MoveCategory.PHYSICAL, 30, 100, 30, 30, 0, 1)
      .attr(StatusEffectAttr, StatusEffect.PARALYSIS),
    new AttackMove(Moves.SMOG, Type.POISON, MoveCategory.SPECIAL, 30, 70, 20, 40, 0, 1)
      .attr(StatusEffectAttr, StatusEffect.POISON),
    new AttackMove(Moves.SLUDGE, Type.POISON, MoveCategory.SPECIAL, 65, 100, 20, 30, 0, 1)
      .attr(StatusEffectAttr, StatusEffect.POISON),
    new AttackMove(Moves.BONE_CLUB, Type.GROUND, MoveCategory.PHYSICAL, 65, 85, 20, 10, 0, 1)
      .attr(FlinchAttr)
      .makesContact(false),
    new AttackMove(Moves.FIRE_BLAST, Type.FIRE, MoveCategory.SPECIAL, 110, 85, 5, 10, 0, 1)
      .attr(StatusEffectAttr, StatusEffect.BURN),
    new AttackMove(Moves.WATERFALL, Type.WATER, MoveCategory.PHYSICAL, 80, 100, 15, 20, 0, 1)
      .attr(FlinchAttr),
    new AttackMove(Moves.CLAMP, Type.WATER, MoveCategory.PHYSICAL, 35, 85, 15, -1, 0, 1)
      .attr(TrapAttr, BattlerTagType.CLAMP),
    new AttackMove(Moves.SWIFT, Type.NORMAL, MoveCategory.SPECIAL, 60, -1, 20, -1, 0, 1)
      .target(MoveTarget.ALL_NEAR_ENEMIES),
    new AttackMove(Moves.SKULL_BASH, Type.NORMAL, MoveCategory.PHYSICAL, 130, 100, 10, -1, 0, 1)
      .attr(ChargeAttr, ChargeAnim.SKULL_BASH_CHARGING, i18next.t("moveTriggers:loweredItsHead", {pokemonName: "{USER}"}), null, true)
      .attr(StatChangeAttr, BattleStat.DEF, 1, true)
      .ignoresVirtual(),
    new AttackMove(Moves.SPIKE_CANNON, Type.NORMAL, MoveCategory.PHYSICAL, 20, 100, 15, -1, 0, 1)
      .attr(MultiHitAttr)
      .makesContact(false),
    new AttackMove(Moves.CONSTRICT, Type.NORMAL, MoveCategory.PHYSICAL, 10, 100, 35, 10, 0, 1)
      .attr(StatChangeAttr, BattleStat.SPD, -1),
    new SelfStatusMove(Moves.AMNESIA, Type.PSYCHIC, -1, 20, -1, 0, 1)
      .attr(StatChangeAttr, BattleStat.SPEC, 2, true),
    new StatusMove(Moves.KINESIS, Type.PSYCHIC, 80, 15, -1, 0, 1)
      .attr(StatChangeAttr, BattleStat.ACC, -1),
    new SelfStatusMove(Moves.SOFT_BOILED, Type.NORMAL, -1, 5, -1, 0, 1)
      .attr(HealAttr, 0.5)
      .triageMove(),
    new AttackMove(Moves.HIGH_JUMP_KICK, Type.FIGHTING, MoveCategory.PHYSICAL, 130, 90, 10, -1, 0, 1)
      .attr(MissEffectAttr, crashDamageFunc)
      .attr(NoEffectAttr, crashDamageFunc)
      .condition(failOnGravityCondition)
      .recklessMove(),
    new StatusMove(Moves.GLARE, Type.NORMAL, 100, 30, -1, 0, 1)
      .attr(StatusEffectAttr, StatusEffect.PARALYSIS),
    new AttackMove(Moves.DREAM_EATER, Type.PSYCHIC, MoveCategory.SPECIAL, 100, 100, 15, -1, 0, 1)
      .attr(HitHealAttr)
      .condition(targetSleptOrComatoseCondition)
      .triageMove(),
    new StatusMove(Moves.POISON_GAS, Type.POISON, 90, 40, -1, 0, 1)
      .attr(StatusEffectAttr, StatusEffect.POISON)
      .target(MoveTarget.ALL_NEAR_ENEMIES),
    new AttackMove(Moves.BARRAGE, Type.NORMAL, MoveCategory.PHYSICAL, 15, 85, 20, -1, 0, 1)
      .attr(MultiHitAttr)
      .makesContact(false)
      .ballBombMove(),
    new AttackMove(Moves.LEECH_LIFE, Type.BUG, MoveCategory.PHYSICAL, 80, 100, 10, -1, 0, 1)
      .attr(HitHealAttr)
      .triageMove(),
    new StatusMove(Moves.LOVELY_KISS, Type.NORMAL, 75, 10, -1, 0, 1)
      .attr(StatusEffectAttr, StatusEffect.SLEEP),
    new AttackMove(Moves.SKY_ATTACK, Type.FLYING, MoveCategory.PHYSICAL, 140, 90, 5, 30, 0, 1)
      .attr(ChargeAttr, ChargeAnim.SKY_ATTACK_CHARGING, i18next.t("moveTriggers:isGlowing", {pokemonName: "{USER}"}))
      .attr(HighCritAttr)
      .attr(FlinchAttr)
      .makesContact(false)
      .ignoresVirtual(),
    new StatusMove(Moves.TRANSFORM, Type.NORMAL, -1, 10, -1, 0, 1)
      .attr(TransformAttr)
      .ignoresProtect(),
    new AttackMove(Moves.BUBBLE, Type.WATER, MoveCategory.SPECIAL, 40, 100, 30, 10, 0, 1)
      .attr(StatChangeAttr, BattleStat.SPD, -1)
      .target(MoveTarget.ALL_NEAR_ENEMIES),
    new AttackMove(Moves.DIZZY_PUNCH, Type.NORMAL, MoveCategory.PHYSICAL, 70, 100, 10, 20, 0, 1)
      .attr(ConfuseAttr)
      .punchingMove(),
    new StatusMove(Moves.SPORE, Type.GRASS, 100, 15, -1, 0, 1)
      .attr(StatusEffectAttr, StatusEffect.SLEEP)
      .powderMove(),
    new StatusMove(Moves.FLASH, Type.NORMAL, 100, 20, -1, 0, 1)
      .attr(StatChangeAttr, BattleStat.ACC, -1),
    new AttackMove(Moves.PSYWAVE, Type.PSYCHIC, MoveCategory.SPECIAL, -1, 100, 15, -1, 0, 1)
      .attr(RandomLevelDamageAttr),
    new SelfStatusMove(Moves.SPLASH, Type.NORMAL, -1, 40, -1, 0, 1)
      .condition(failOnGravityCondition),
    new SelfStatusMove(Moves.ACID_ARMOR, Type.POISON, -1, 20, -1, 0, 1)
      .attr(StatChangeAttr, BattleStat.DEF, 2, true),
    new AttackMove(Moves.CRABHAMMER, Type.WATER, MoveCategory.PHYSICAL, 100, 90, 10, -1, 0, 1)
      .attr(HighCritAttr),
    new AttackMove(Moves.EXPLOSION, Type.NORMAL, MoveCategory.PHYSICAL, 250, 100, 5, -1, 0, 1)
      .condition(failIfDampCondition)
      .attr(SacrificialAttr)
      .makesContact(false)
      .target(MoveTarget.ALL_NEAR_OTHERS),
    new AttackMove(Moves.FURY_SWIPES, Type.NORMAL, MoveCategory.PHYSICAL, 18, 80, 15, -1, 0, 1)
      .attr(MultiHitAttr),
    new AttackMove(Moves.BONEMERANG, Type.GROUND, MoveCategory.PHYSICAL, 50, 90, 10, -1, 0, 1)
      .attr(MultiHitAttr, MultiHitType._2)
      .makesContact(false),
    new SelfStatusMove(Moves.REST, Type.PSYCHIC, -1, 5, -1, 0, 1)
      .attr(StatusEffectAttr, StatusEffect.SLEEP, true, 3, true)
      .attr(HealAttr, 1, true)
      .condition((user, target, move) => !user.isFullHp() && user.canSetStatus(StatusEffect.SLEEP, true, true))
      .triageMove(),
    new AttackMove(Moves.ROCK_SLIDE, Type.ROCK, MoveCategory.PHYSICAL, 75, 90, 10, 30, 0, 1)
      .attr(FlinchAttr)
      .makesContact(false)
      .target(MoveTarget.ALL_NEAR_ENEMIES),
    new AttackMove(Moves.HYPER_FANG, Type.NORMAL, MoveCategory.PHYSICAL, 80, 90, 15, 10, 0, 1)
      .attr(FlinchAttr)
      .bitingMove(),
    new SelfStatusMove(Moves.SHARPEN, Type.NORMAL, -1, 30, -1, 0, 1)
      .attr(StatChangeAttr, BattleStat.ATK, 1, true),
    new SelfStatusMove(Moves.CONVERSION, Type.NORMAL, -1, 30, -1, 0, 1)
      .attr(FirstMoveTypeAttr),
    new AttackMove(Moves.TRI_ATTACK, Type.NORMAL, MoveCategory.SPECIAL, 80, 100, 10, 20, 0, 1)
      .attr(MultiStatusEffectAttr, [StatusEffect.BURN, StatusEffect.FREEZE, StatusEffect.PARALYSIS]),
    new AttackMove(Moves.SUPER_FANG, Type.NORMAL, MoveCategory.PHYSICAL, -1, 90, 10, -1, 0, 1)
      .attr(TargetHalfHpDamageAttr),
    new AttackMove(Moves.SLASH, Type.NORMAL, MoveCategory.PHYSICAL, 70, 100, 20, -1, 0, 1)
      .attr(HighCritAttr)
      .slicingMove(),
    new SelfStatusMove(Moves.SUBSTITUTE, Type.NORMAL, -1, 10, -1, 0, 1)
      .attr(RecoilAttr)
      .unimplemented(),
    new AttackMove(Moves.STRUGGLE, Type.NORMAL, MoveCategory.PHYSICAL, 50, -1, 1, -1, 0, 1)
      .attr(RecoilAttr, true, 0.25, true)
      .attr(TypelessAttr)
      .ignoresVirtual()
      .target(MoveTarget.RANDOM_NEAR_ENEMY)
  ].forEach((move)=>allMoves[move.id] = move);

  Object.values(allMoves).map(m => {
    if (m.getAttrs(StatChangeAttr).some(a => a.selfTarget && a.levels < 0)) {
      selfStatLowerMoves.push(m.id);
    }
  });
}
