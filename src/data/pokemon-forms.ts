import { PokemonFormChangeItemModifier } from "../modifier/modifier";
import Pokemon from "../field/pokemon";
import { SpeciesFormKey } from "./pokemon-species";
import { StatusEffect } from "./status-effect";
import { Constructor } from "#app/utils";
import { Abilities } from "#enums/abilities";
import { Moves } from "#enums/moves";
import { Species } from "#enums/species";
import { TimeOfDay } from "#enums/time-of-day";
import { getPokemonNameWithAffix } from "#app/messages.js";
import i18next from "i18next";
import { WeatherType } from "./weather";

export enum FormChangeItem {
  NONE,

  ABOMASITE,
  ABSOLITE,
  AERODACTYLITE,
  AGGRONITE,
  ALAKAZITE,
  ALTARIANITE,
  AMPHAROSITE,
  AUDINITE,
  BANETTITE,
  BEEDRILLITE,
  BLASTOISINITE,
  BLAZIKENITE,
  CAMERUPTITE,
  CHARIZARDITE_X,
  CHARIZARDITE_Y,
  DIANCITE,
  GALLADITE,
  GARCHOMPITE,
  GARDEVOIRITE,
  GENGARITE,
  GLALITITE,
  GYARADOSITE,
  HERACRONITE,
  HOUNDOOMINITE,
  KANGASKHANITE,
  LATIASITE,
  LATIOSITE,
  LOPUNNITE,
  LUCARIONITE,
  MANECTITE,
  MAWILITE,
  MEDICHAMITE,
  METAGROSSITE,
  MEWTWONITE_X,
  MEWTWONITE_Y,
  PIDGEOTITE,
  PINSIRITE,
  RAYQUAZITE,
  SABLENITE,
  SALAMENCITE,
  SCEPTILITE,
  SCIZORITE,
  SHARPEDONITE,
  SLOWBRONITE,
  STEELIXITE,
  SWAMPERTITE,
  TYRANITARITE,
  VENUSAURITE,

  BLUE_ORB = 50,
  RED_ORB,
  SHARP_METEORITE,
  HARD_METEORITE,
  SMOOTH_METEORITE,
  ADAMANT_CRYSTAL,
  LUSTROUS_GLOBE,
  GRISEOUS_CORE,
  REVEAL_GLASS,
  GRACIDEA,
  MAX_MUSHROOMS,
  DARK_STONE,
  LIGHT_STONE,
  PRISON_BOTTLE,
  N_LUNARIZER,
  N_SOLARIZER,
  RUSTED_SWORD,
  RUSTED_SHIELD,
  ICY_REINS_OF_UNITY,
  SHADOW_REINS_OF_UNITY,
  WELLSPRING_MASK,
  HEARTHFLAME_MASK,
  CORNERSTONE_MASK,
  SHOCK_DRIVE,
  BURN_DRIVE,
  CHILL_DRIVE,
  DOUSE_DRIVE,
  ULTRANECROZIUM_Z,

  FIST_PLATE = 100,
  SKY_PLATE,
  TOXIC_PLATE,
  EARTH_PLATE,
  STONE_PLATE,
  INSECT_PLATE,
  SPOOKY_PLATE,
  IRON_PLATE,
  FLAME_PLATE,
  SPLASH_PLATE,
  MEADOW_PLATE,
  ZAP_PLATE,
  MIND_PLATE,
  ICICLE_PLATE,
  DRACO_PLATE,
  DREAD_PLATE,
  PIXIE_PLATE,
  BLANK_PLATE,  // TODO: Find a potential use for this
  LEGEND_PLATE, // TODO: Find a potential use for this
  FIGHTING_MEMORY,
  FLYING_MEMORY,
  POISON_MEMORY,
  GROUND_MEMORY,
  ROCK_MEMORY,
  BUG_MEMORY,
  GHOST_MEMORY,
  STEEL_MEMORY,
  FIRE_MEMORY,
  WATER_MEMORY,
  GRASS_MEMORY,
  ELECTRIC_MEMORY,
  PSYCHIC_MEMORY,
  ICE_MEMORY,
  DRAGON_MEMORY,
  DARK_MEMORY,
  FAIRY_MEMORY,
  BLANK_MEMORY  // TODO: Find a potential use for this
}

export type SpeciesFormChangeConditionPredicate = (p: Pokemon) => boolean;
export type SpeciesFormChangeConditionEnforceFunc = (p: Pokemon) => void;

export class SpeciesFormChange {
  public speciesId: Species;
  public preFormKey: string;
  public formKey: string;
  public trigger: SpeciesFormChangeTrigger;
  public quiet: boolean;
  public readonly conditions: SpeciesFormChangeCondition[];

  constructor(speciesId: Species, preFormKey: string, evoFormKey: string, trigger: SpeciesFormChangeTrigger, quiet: boolean = false, ...conditions: SpeciesFormChangeCondition[]) {
    this.speciesId = speciesId;
    this.preFormKey = preFormKey;
    this.formKey = evoFormKey;
    this.trigger = trigger;
    this.quiet = quiet;
    this.conditions = conditions;
  }

  canChange(pokemon: Pokemon): boolean {
    if (pokemon.species.speciesId !== this.speciesId) {
      return false;
    }

    if (!pokemon.species.forms.length) {
      return false;
    }

    const formKeys = pokemon.species.forms.map(f => f.formKey);
    if (formKeys[pokemon.formIndex] !== this.preFormKey) {
      return false;
    }

    if (formKeys[pokemon.formIndex] === this.formKey) {
      return false;
    }

    for (const condition of this.conditions) {
      if (!condition.predicate(pokemon)) {
        return false;
      }
    }

    if (!this.trigger.canChange(pokemon)) {
      return false;
    }

    return true;
  }

  findTrigger(triggerType: Constructor<SpeciesFormChangeTrigger>): SpeciesFormChangeTrigger | null {
    if (!this.trigger.hasTriggerType(triggerType)) {
      return null;
    }

    const trigger = this.trigger;

    if (trigger instanceof SpeciesFormChangeCompoundTrigger) {
      return trigger.triggers.find(t => t.hasTriggerType(triggerType))!; // TODO: is this bang correct?
    }

    return trigger;
  }
}

export class SpeciesFormChangeCondition {
  public predicate: SpeciesFormChangeConditionPredicate;
  public enforceFunc: SpeciesFormChangeConditionEnforceFunc | null;

  constructor(predicate: SpeciesFormChangeConditionPredicate, enforceFunc?: SpeciesFormChangeConditionEnforceFunc) {
    this.predicate = predicate;
    this.enforceFunc = enforceFunc!; // TODO: is this bang correct?
  }
}

export abstract class SpeciesFormChangeTrigger {
  canChange(pokemon: Pokemon): boolean {
    return true;
  }

  hasTriggerType(triggerType: Constructor<SpeciesFormChangeTrigger>): boolean {
    return this instanceof triggerType;
  }
}

export class SpeciesFormChangeManualTrigger extends SpeciesFormChangeTrigger {
  canChange(pokemon: Pokemon): boolean {
    return true;
  }
}

export class SpeciesFormChangeCompoundTrigger {
  public triggers: SpeciesFormChangeTrigger[];

  constructor(...triggers: SpeciesFormChangeTrigger[]) {
    this.triggers = triggers;
  }

  canChange(pokemon: Pokemon): boolean {
    for (const trigger of this.triggers) {
      if (!trigger.canChange(pokemon)) {
        return false;
      }
    }

    return true;
  }

  hasTriggerType(triggerType: Constructor<SpeciesFormChangeTrigger>): boolean {
    return !!this.triggers.find(t => t.hasTriggerType(triggerType));
  }
}

export class SpeciesFormChangeItemTrigger extends SpeciesFormChangeTrigger {
  public item: FormChangeItem;
  public active: boolean;

  constructor(item: FormChangeItem, active: boolean = true) {
    super();
    this.item = item;
    this.active = active;
  }

  canChange(pokemon: Pokemon): boolean {
    return !!pokemon.scene.findModifier(m => m instanceof PokemonFormChangeItemModifier && m.pokemonId === pokemon.id && m.formChangeItem === this.item && m.active === this.active);
  }
}

export class SpeciesFormChangeTimeOfDayTrigger extends SpeciesFormChangeTrigger {
  public timesOfDay: TimeOfDay[];

  constructor(...timesOfDay: TimeOfDay[]) {
    super();
    this.timesOfDay = timesOfDay;
  }

  canChange(pokemon: Pokemon): boolean {
    return this.timesOfDay.indexOf(pokemon.scene.arena.getTimeOfDay()) > -1;
  }
}

export class SpeciesFormChangeActiveTrigger extends SpeciesFormChangeTrigger {
  public active: boolean;

  constructor(active: boolean = false) {
    super();
    this.active = active;
  }

  canChange(pokemon: Pokemon): boolean {
    return pokemon.isActive(true) === this.active;
  }
}

export class SpeciesFormChangeStatusEffectTrigger extends SpeciesFormChangeTrigger {
  public statusEffects: StatusEffect[];
  public invert: boolean;

  constructor(statusEffects: StatusEffect | StatusEffect[], invert: boolean = false) {
    super();
    if (!Array.isArray(statusEffects)) {
      statusEffects = [ statusEffects ];
    }
    this.statusEffects = statusEffects;
    this.invert = invert;
  }

  canChange(pokemon: Pokemon): boolean {
    return (this.statusEffects.indexOf(pokemon.status?.effect || StatusEffect.NONE) > -1) !== this.invert;
  }
}

export class SpeciesFormChangeMoveLearnedTrigger extends SpeciesFormChangeTrigger {
  public move: Moves;
  public known: boolean;

  constructor(move: Moves, known: boolean = true) {
    super();
    this.move = move;
    this.known = known;
  }

  canChange(pokemon: Pokemon): boolean {
    return (!!pokemon.moveset.filter(m => m?.moveId === this.move).length) === this.known;
  }
}

export abstract class SpeciesFormChangeMoveTrigger extends SpeciesFormChangeTrigger {
  public movePredicate: (m: Moves) => boolean;
  public used: boolean;

  constructor(move: Moves | ((m: Moves) => boolean), used: boolean = true) {
    super();
    this.movePredicate = typeof move === "function" ? move : (m: Moves) => m === move;
    this.used = used;
  }
}

export class SpeciesFormChangePreMoveTrigger extends SpeciesFormChangeMoveTrigger {
  canChange(pokemon: Pokemon): boolean {
    const command = pokemon.scene.currentBattle.turnCommands[pokemon.getBattlerIndex()];
    return !!command?.move && this.movePredicate(command.move.move) === this.used;
  }
}

export class SpeciesFormChangePostMoveTrigger extends SpeciesFormChangeMoveTrigger {
  canChange(pokemon: Pokemon): boolean {
    return pokemon.summonData && !!pokemon.getLastXMoves(1).filter(m => this.movePredicate(m.move)).length === this.used;
  }
}

export class SpeciesDefaultFormMatchTrigger extends SpeciesFormChangeTrigger {
  private formKey: string;

  constructor(formKey: string) {
    super();
    this.formKey = formKey;
  }

  canChange(pokemon: Pokemon): boolean {
    return this.formKey === pokemon.species.forms[pokemon.scene.getSpeciesFormIndex(pokemon.species, pokemon.gender, true)].formKey;
  }
}

/**
 * Class used for triggering form changes based on weather.
 * Used by Castform.
 * @extends SpeciesFormChangeTrigger
 */
export class SpeciesFormChangeWeatherTrigger extends SpeciesFormChangeTrigger {
  /** The ability that  triggers the form change */
  public ability: Abilities;
  /** The list of weathers that trigger the form change */
  public weathers: WeatherType[];

  constructor(ability: Abilities, weathers: WeatherType[]) {
    super();
    this.ability = ability;
    this.weathers = weathers;
  }

  /**
   * Checks if the Pokemon has the required ability and is in the correct weather while
   * the weather or ability is also not suppressed.
   * @param {Pokemon} pokemon the pokemon that is trying to do the form change
   * @returns `true` if the Pokemon can change forms, `false` otherwise
   */
  canChange(pokemon: Pokemon): boolean {
    const currentWeather = pokemon.scene.arena.weather?.weatherType ?? WeatherType.NONE;
    const isWeatherSuppressed = pokemon.scene.arena.weather?.isEffectSuppressed(pokemon.scene);
    const isAbilitySuppressed = pokemon.summonData.abilitySuppressed;

    return !isAbilitySuppressed && !isWeatherSuppressed && (pokemon.hasAbility(this.ability) && this.weathers.includes(currentWeather));
  }
}

/**
 * Class used for reverting to the original form when the weather runs out
 * or when the user loses the ability/is suppressed.
 * Used by Castform.
 * @extends SpeciesFormChangeTrigger
 */
export class SpeciesFormChangeRevertWeatherFormTrigger extends SpeciesFormChangeTrigger {
  /** The ability that triggers the form change*/
  public ability: Abilities;
  /** The list of weathers that will also trigger a form change to original form */
  public weathers: WeatherType[];

  constructor(ability: Abilities, weathers: WeatherType[]) {
    super();
    this.ability = ability;
    this.weathers = weathers;
  }

  /**
   * Checks if the Pokemon has the required ability and the weather is one that will revert
   * the Pokemon to its original form or the weather or ability is suppressed
   * @param {Pokemon} pokemon the pokemon that is trying to do the form change
   * @returns `true` if the Pokemon will revert to its original form, `false` otherwise
   */
  canChange(pokemon: Pokemon): boolean {
    if (pokemon.hasAbility(this.ability, false, true)) {
      const currentWeather = pokemon.scene.arena.weather?.weatherType ?? WeatherType.NONE;
      const isWeatherSuppressed = pokemon.scene.arena.weather?.isEffectSuppressed(pokemon.scene);
      const isAbilitySuppressed = pokemon.summonData.abilitySuppressed;
      const summonDataAbility = pokemon.summonData.ability;
      const isAbilityChanged = summonDataAbility !== this.ability && summonDataAbility !== Abilities.NONE;

      if (this.weathers.includes(currentWeather) || isWeatherSuppressed || isAbilitySuppressed || isAbilityChanged) {
        return true;
      }
    }
    return false;
  }
}

export function getSpeciesFormChangeMessage(pokemon: Pokemon, formChange: SpeciesFormChange, preName: string): string {
  const isMega = formChange.formKey.indexOf(SpeciesFormKey.MEGA) > -1;
  const isGmax = formChange.formKey.indexOf(SpeciesFormKey.GIGANTAMAX) > -1;
  const isEmax = formChange.formKey.indexOf(SpeciesFormKey.ETERNAMAX) > -1;
  const isRevert = !isMega && formChange.formKey === pokemon.species.forms[0].formKey;
  if (isMega) {
    return i18next.t("battlePokemonForm:megaChange", { preName, pokemonName: pokemon.name });
  }
  if (isGmax) {
    return i18next.t("battlePokemonForm:gigantamaxChange", { preName, pokemonName: pokemon.name });
  }
  if (isEmax) {
    return i18next.t("battlePokemonForm:eternamaxChange", { preName, pokemonName: pokemon.name });
  }
  if (isRevert) {
    return i18next.t("battlePokemonForm:revertChange", { pokemonName: getPokemonNameWithAffix(pokemon) });
  }
  return i18next.t("battlePokemonForm:formChange", { preName });
}

interface PokemonFormChanges {
  [key: string]: SpeciesFormChange[]
}

export const pokemonFormChanges: PokemonFormChanges = {
  [Species.VENUSAUR]: [
    new SpeciesFormChange(Species.VENUSAUR, "", SpeciesFormKey.MEGA, new SpeciesFormChangeItemTrigger(FormChangeItem.VENUSAURITE)),
    new SpeciesFormChange(Species.VENUSAUR, "", SpeciesFormKey.GIGANTAMAX, new SpeciesFormChangeItemTrigger(FormChangeItem.MAX_MUSHROOMS))
  ],
  [Species.BLASTOISE]: [
    new SpeciesFormChange(Species.BLASTOISE, "", SpeciesFormKey.MEGA, new SpeciesFormChangeItemTrigger(FormChangeItem.BLASTOISINITE)),
    new SpeciesFormChange(Species.BLASTOISE, "", SpeciesFormKey.GIGANTAMAX, new SpeciesFormChangeItemTrigger(FormChangeItem.MAX_MUSHROOMS))
  ],
  [Species.CHARIZARD]: [
    new SpeciesFormChange(Species.CHARIZARD, "", SpeciesFormKey.MEGA_X, new SpeciesFormChangeItemTrigger(FormChangeItem.CHARIZARDITE_X)),
    new SpeciesFormChange(Species.CHARIZARD, "", SpeciesFormKey.MEGA_Y, new SpeciesFormChangeItemTrigger(FormChangeItem.CHARIZARDITE_Y)),
    new SpeciesFormChange(Species.CHARIZARD, "", SpeciesFormKey.GIGANTAMAX, new SpeciesFormChangeItemTrigger(FormChangeItem.MAX_MUSHROOMS))
  ],
  [Species.BUTTERFREE]: [
    new SpeciesFormChange(Species.BUTTERFREE, "", SpeciesFormKey.GIGANTAMAX, new SpeciesFormChangeItemTrigger(FormChangeItem.MAX_MUSHROOMS))
  ],
  [Species.BEEDRILL]: [
    new SpeciesFormChange(Species.BEEDRILL, "", SpeciesFormKey.MEGA, new SpeciesFormChangeItemTrigger(FormChangeItem.BEEDRILLITE))
  ],
  [Species.PIDGEOT]: [
    new SpeciesFormChange(Species.PIDGEOT, "", SpeciesFormKey.MEGA, new SpeciesFormChangeItemTrigger(FormChangeItem.PIDGEOTITE))
  ],
  [Species.PIKACHU]: [
    new SpeciesFormChange(Species.PIKACHU, "", SpeciesFormKey.GIGANTAMAX, new SpeciesFormChangeItemTrigger(FormChangeItem.MAX_MUSHROOMS)),
    new SpeciesFormChange(Species.PIKACHU, "partner", SpeciesFormKey.GIGANTAMAX, new SpeciesFormChangeItemTrigger(FormChangeItem.MAX_MUSHROOMS))
  ],
  [Species.MEOWTH]: [
    new SpeciesFormChange(Species.MEOWTH, "", SpeciesFormKey.GIGANTAMAX, new SpeciesFormChangeItemTrigger(FormChangeItem.MAX_MUSHROOMS))
  ],
  [Species.ALAKAZAM]: [
    new SpeciesFormChange(Species.ALAKAZAM, "", SpeciesFormKey.MEGA, new SpeciesFormChangeItemTrigger(FormChangeItem.ALAKAZITE))
  ],
  [Species.MACHAMP]: [
    new SpeciesFormChange(Species.MACHAMP, "", SpeciesFormKey.GIGANTAMAX, new SpeciesFormChangeItemTrigger(FormChangeItem.MAX_MUSHROOMS))
  ],
  [Species.SLOWBRO]: [
    new SpeciesFormChange(Species.SLOWBRO, "", SpeciesFormKey.MEGA, new SpeciesFormChangeItemTrigger(FormChangeItem.SLOWBRONITE))
  ],
  [Species.GENGAR]: [
    new SpeciesFormChange(Species.GENGAR, "", SpeciesFormKey.MEGA, new SpeciesFormChangeItemTrigger(FormChangeItem.GENGARITE)),
    new SpeciesFormChange(Species.GENGAR, "", SpeciesFormKey.GIGANTAMAX, new SpeciesFormChangeItemTrigger(FormChangeItem.MAX_MUSHROOMS))
  ],
  [Species.KINGLER]: [
    new SpeciesFormChange(Species.KINGLER, "", SpeciesFormKey.GIGANTAMAX, new SpeciesFormChangeItemTrigger(FormChangeItem.MAX_MUSHROOMS))
  ],
  [Species.KANGASKHAN]: [
    new SpeciesFormChange(Species.KANGASKHAN, "", SpeciesFormKey.MEGA, new SpeciesFormChangeItemTrigger(FormChangeItem.KANGASKHANITE))
  ],
  [Species.PINSIR]: [
    new SpeciesFormChange(Species.PINSIR, "", SpeciesFormKey.MEGA, new SpeciesFormChangeItemTrigger(FormChangeItem.PINSIRITE))
  ],
  [Species.GYARADOS]: [
    new SpeciesFormChange(Species.GYARADOS, "", SpeciesFormKey.MEGA, new SpeciesFormChangeItemTrigger(FormChangeItem.GYARADOSITE))
  ],
  [Species.LAPRAS]: [
    new SpeciesFormChange(Species.LAPRAS, "", SpeciesFormKey.GIGANTAMAX, new SpeciesFormChangeItemTrigger(FormChangeItem.MAX_MUSHROOMS))
  ],
  [Species.EEVEE]: [
    new SpeciesFormChange(Species.EEVEE, "", SpeciesFormKey.GIGANTAMAX, new SpeciesFormChangeItemTrigger(FormChangeItem.MAX_MUSHROOMS)),
    new SpeciesFormChange(Species.EEVEE, "partner", SpeciesFormKey.GIGANTAMAX, new SpeciesFormChangeItemTrigger(FormChangeItem.MAX_MUSHROOMS))
  ],
  [Species.SNORLAX]: [
    new SpeciesFormChange(Species.SNORLAX, "", SpeciesFormKey.GIGANTAMAX, new SpeciesFormChangeItemTrigger(FormChangeItem.MAX_MUSHROOMS))
  ],
  [Species.AERODACTYL]: [
    new SpeciesFormChange(Species.AERODACTYL, "", SpeciesFormKey.MEGA, new SpeciesFormChangeItemTrigger(FormChangeItem.AERODACTYLITE))
  ],
  [Species.MEWTWO]: [
    new SpeciesFormChange(Species.MEWTWO, "", SpeciesFormKey.MEGA_X, new SpeciesFormChangeItemTrigger(FormChangeItem.MEWTWONITE_X)),
    new SpeciesFormChange(Species.MEWTWO, "", SpeciesFormKey.MEGA_Y, new SpeciesFormChangeItemTrigger(FormChangeItem.MEWTWONITE_Y))
  ],
};

export function initPokemonForms() {
  const formChangeKeys = Object.keys(pokemonFormChanges);
  formChangeKeys.forEach(pk => {
    const formChanges = pokemonFormChanges[pk];
    const newFormChanges: SpeciesFormChange[] = [];
    for (const fc of formChanges) {
      const itemTrigger = fc.findTrigger(SpeciesFormChangeItemTrigger) as SpeciesFormChangeItemTrigger;
      if (itemTrigger && !formChanges.find(c => fc.formKey === c.preFormKey && fc.preFormKey === c.formKey)) {
        newFormChanges.push(new SpeciesFormChange(fc.speciesId, fc.formKey, fc.preFormKey, new SpeciesFormChangeItemTrigger(itemTrigger.item, false)));
      }
    }
    formChanges.push(...newFormChanges);
  });
}
