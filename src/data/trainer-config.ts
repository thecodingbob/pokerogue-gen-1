import BattleScene, {startingWave} from "../battle-scene";
import {ModifierTypeFunc, modifierTypes} from "../modifier/modifier-type";
import {EnemyPokemon} from "../field/pokemon";
import * as Utils from "../utils";
import {PokeballType} from "./pokeball";
import {pokemonEvolutions, pokemonPrevolutions} from "./pokemon-evolutions";
import PokemonSpecies, {getPokemonSpecies, PokemonSpeciesFilter} from "./pokemon-species";
import {tmSpecies} from "./tms";
import {Type} from "./type";
import {doubleBattleDialogue} from "./dialogue";
import {PersistentModifier} from "../modifier/modifier";
import {TrainerVariant} from "../field/trainer";
import {getIsInitialized, initI18n} from "#app/plugins/i18n";
import i18next from "i18next";
import {Moves} from "#enums/moves";
import {PartyMemberStrength} from "#enums/party-member-strength";
import {Species} from "#enums/species";
import {TrainerType} from "#enums/trainer-type";

export enum TrainerPoolTier {
    COMMON,
    UNCOMMON,
    RARE,
    SUPER_RARE,
    ULTRA_RARE
}

export interface TrainerTierPools {
    [key: integer]: Species[]
}

export enum TrainerSlot {
    NONE,
    TRAINER,
    TRAINER_PARTNER
}

export class TrainerPartyTemplate {
  public size: integer;
  public strength: PartyMemberStrength;
  public sameSpecies: boolean;
  public balanced: boolean;

  constructor(size: integer, strength: PartyMemberStrength, sameSpecies?: boolean, balanced?: boolean) {
    this.size = size;
    this.strength = strength;
    this.sameSpecies = !!sameSpecies;
    this.balanced = !!balanced;
  }

  getStrength(index: integer): PartyMemberStrength {
    return this.strength;
  }

  isSameSpecies(index: integer): boolean {
    return this.sameSpecies;
  }

  isBalanced(index: integer): boolean {
    return this.balanced;
  }
}

export class TrainerPartyCompoundTemplate extends TrainerPartyTemplate {
  public templates: TrainerPartyTemplate[];

  constructor(...templates: TrainerPartyTemplate[]) {
    super(templates.reduce((total: integer, template: TrainerPartyTemplate) => {
      total += template.size;
      return total;
    }, 0), PartyMemberStrength.AVERAGE);
    this.templates = templates;
  }

  getStrength(index: integer): PartyMemberStrength {
    let t = 0;
    for (const template of this.templates) {
      if (t + template.size > index) {
        return template.getStrength(index - t);
      }
      t += template.size;
    }

    return super.getStrength(index);
  }

  isSameSpecies(index: integer): boolean {
    let t = 0;
    for (const template of this.templates) {
      if (t + template.size > index) {
        return template.isSameSpecies(index - t);
      }
      t += template.size;
    }

    return super.isSameSpecies(index);
  }

  isBalanced(index: integer): boolean {
    let t = 0;
    for (const template of this.templates) {
      if (t + template.size > index) {
        return template.isBalanced(index - t);
      }
      t += template.size;
    }

    return super.isBalanced(index);
  }
}

export const trainerPartyTemplates = {
  ONE_WEAK_ONE_STRONG: new TrainerPartyCompoundTemplate(new TrainerPartyTemplate(1, PartyMemberStrength.WEAK), new TrainerPartyTemplate(1, PartyMemberStrength.STRONG)),
  ONE_AVG: new TrainerPartyTemplate(1, PartyMemberStrength.AVERAGE),
  ONE_AVG_ONE_STRONG: new TrainerPartyCompoundTemplate(new TrainerPartyTemplate(1, PartyMemberStrength.AVERAGE), new TrainerPartyTemplate(1, PartyMemberStrength.STRONG)),
  ONE_STRONG: new TrainerPartyTemplate(1, PartyMemberStrength.STRONG),
  ONE_STRONGER: new TrainerPartyTemplate(1, PartyMemberStrength.STRONGER),
  TWO_WEAKER: new TrainerPartyTemplate(2, PartyMemberStrength.WEAKER),
  TWO_WEAK: new TrainerPartyTemplate(2, PartyMemberStrength.WEAK),
  TWO_WEAK_ONE_AVG: new TrainerPartyCompoundTemplate(new TrainerPartyTemplate(2, PartyMemberStrength.WEAK), new TrainerPartyTemplate(1, PartyMemberStrength.AVERAGE)),
  TWO_WEAK_SAME_ONE_AVG: new TrainerPartyCompoundTemplate(new TrainerPartyTemplate(2, PartyMemberStrength.WEAK, true), new TrainerPartyTemplate(1, PartyMemberStrength.AVERAGE)),
  TWO_WEAK_SAME_TWO_WEAK_SAME: new TrainerPartyCompoundTemplate(new TrainerPartyTemplate(2, PartyMemberStrength.WEAK, true), new TrainerPartyTemplate(2, PartyMemberStrength.WEAK, true)),
  TWO_WEAK_ONE_STRONG: new TrainerPartyCompoundTemplate(new TrainerPartyTemplate(2, PartyMemberStrength.WEAK), new TrainerPartyTemplate(1, PartyMemberStrength.STRONG)),
  TWO_AVG: new TrainerPartyTemplate(2, PartyMemberStrength.AVERAGE),
  TWO_AVG_ONE_STRONG: new TrainerPartyCompoundTemplate(new TrainerPartyTemplate(2, PartyMemberStrength.AVERAGE), new TrainerPartyTemplate(1, PartyMemberStrength.STRONG)),
  TWO_AVG_SAME_ONE_AVG: new TrainerPartyCompoundTemplate(new TrainerPartyTemplate(2, PartyMemberStrength.AVERAGE, true), new TrainerPartyTemplate(1, PartyMemberStrength.AVERAGE)),
  TWO_AVG_SAME_ONE_STRONG: new TrainerPartyCompoundTemplate(new TrainerPartyTemplate(2, PartyMemberStrength.AVERAGE, true), new TrainerPartyTemplate(1, PartyMemberStrength.STRONG)),
  TWO_AVG_SAME_TWO_AVG_SAME: new TrainerPartyCompoundTemplate(new TrainerPartyTemplate(2, PartyMemberStrength.AVERAGE, true), new TrainerPartyTemplate(2, PartyMemberStrength.AVERAGE, true)),
  TWO_STRONG: new TrainerPartyTemplate(2, PartyMemberStrength.STRONG),
  THREE_WEAK: new TrainerPartyTemplate(3, PartyMemberStrength.WEAK),
  THREE_WEAK_SAME: new TrainerPartyTemplate(3, PartyMemberStrength.WEAK, true),
  THREE_AVG: new TrainerPartyTemplate(3, PartyMemberStrength.AVERAGE),
  THREE_AVG_SAME: new TrainerPartyTemplate(3, PartyMemberStrength.AVERAGE, true),
  THREE_WEAK_BALANCED: new TrainerPartyTemplate(3, PartyMemberStrength.WEAK, false, true),
  FOUR_WEAKER: new TrainerPartyTemplate(4, PartyMemberStrength.WEAKER),
  FOUR_WEAKER_SAME: new TrainerPartyTemplate(4, PartyMemberStrength.WEAKER, true),
  FOUR_WEAK: new TrainerPartyTemplate(4, PartyMemberStrength.WEAK),
  FOUR_WEAK_SAME: new TrainerPartyTemplate(4, PartyMemberStrength.WEAK, true),
  FOUR_WEAK_BALANCED: new TrainerPartyTemplate(4, PartyMemberStrength.WEAK, false, true),
  FIVE_WEAKER: new TrainerPartyTemplate(5, PartyMemberStrength.WEAKER),
  FIVE_WEAK: new TrainerPartyTemplate(5, PartyMemberStrength.WEAK),
  FIVE_WEAK_BALANCED: new TrainerPartyTemplate(5, PartyMemberStrength.WEAK, false, true),
  SIX_WEAKER: new TrainerPartyTemplate(6, PartyMemberStrength.WEAKER),
  SIX_WEAKER_SAME: new TrainerPartyTemplate(6, PartyMemberStrength.WEAKER, true),
  SIX_WEAK_SAME: new TrainerPartyTemplate(6, PartyMemberStrength.WEAK, true),
  SIX_WEAK_BALANCED: new TrainerPartyTemplate(6, PartyMemberStrength.WEAK, false, true),

  GYM_LEADER_1: new TrainerPartyCompoundTemplate(new TrainerPartyTemplate(1, PartyMemberStrength.AVERAGE), new TrainerPartyTemplate(1, PartyMemberStrength.STRONG)),
  GYM_LEADER_2: new TrainerPartyCompoundTemplate(new TrainerPartyTemplate(1, PartyMemberStrength.AVERAGE), new TrainerPartyTemplate(1, PartyMemberStrength.STRONG), new TrainerPartyTemplate(1, PartyMemberStrength.STRONGER)),
  GYM_LEADER_3: new TrainerPartyCompoundTemplate(new TrainerPartyTemplate(2, PartyMemberStrength.AVERAGE), new TrainerPartyTemplate(1, PartyMemberStrength.STRONG), new TrainerPartyTemplate(1, PartyMemberStrength.STRONGER)),
  GYM_LEADER_4: new TrainerPartyCompoundTemplate(new TrainerPartyTemplate(3, PartyMemberStrength.AVERAGE), new TrainerPartyTemplate(1, PartyMemberStrength.STRONG), new TrainerPartyTemplate(1, PartyMemberStrength.STRONGER)),
  GYM_LEADER_5: new TrainerPartyCompoundTemplate(new TrainerPartyTemplate(3, PartyMemberStrength.AVERAGE), new TrainerPartyTemplate(2, PartyMemberStrength.STRONG), new TrainerPartyTemplate(1, PartyMemberStrength.STRONGER)),

  ELITE_FOUR: new TrainerPartyCompoundTemplate(new TrainerPartyTemplate(2, PartyMemberStrength.AVERAGE), new TrainerPartyTemplate(3, PartyMemberStrength.STRONG), new TrainerPartyTemplate(1, PartyMemberStrength.STRONGER)),

  CHAMPION: new TrainerPartyCompoundTemplate(new TrainerPartyTemplate(1, PartyMemberStrength.STRONGER), new TrainerPartyTemplate(5, PartyMemberStrength.STRONG, false, true)),

  RIVAL: new TrainerPartyCompoundTemplate(new TrainerPartyTemplate(1, PartyMemberStrength.STRONG), new TrainerPartyTemplate(1, PartyMemberStrength.AVERAGE)),
  RIVAL_2: new TrainerPartyCompoundTemplate(new TrainerPartyTemplate(1, PartyMemberStrength.STRONG), new TrainerPartyTemplate(1, PartyMemberStrength.AVERAGE), new TrainerPartyTemplate(1, PartyMemberStrength.WEAK, false, true)),
  RIVAL_3: new TrainerPartyCompoundTemplate(new TrainerPartyTemplate(1, PartyMemberStrength.STRONG), new TrainerPartyTemplate(1, PartyMemberStrength.AVERAGE), new TrainerPartyTemplate(1, PartyMemberStrength.AVERAGE, false, true), new TrainerPartyTemplate(1, PartyMemberStrength.WEAK, false, true)),
  RIVAL_4: new TrainerPartyCompoundTemplate(new TrainerPartyTemplate(1, PartyMemberStrength.STRONG), new TrainerPartyTemplate(1, PartyMemberStrength.AVERAGE), new TrainerPartyTemplate(2, PartyMemberStrength.AVERAGE, false, true), new TrainerPartyTemplate(1, PartyMemberStrength.WEAK, false, true)),
  RIVAL_5: new TrainerPartyCompoundTemplate(new TrainerPartyTemplate(1, PartyMemberStrength.STRONG), new TrainerPartyTemplate(1, PartyMemberStrength.AVERAGE), new TrainerPartyTemplate(3, PartyMemberStrength.AVERAGE, false, true), new TrainerPartyTemplate(1, PartyMemberStrength.STRONG)),
  RIVAL_6: new TrainerPartyCompoundTemplate(new TrainerPartyTemplate(1, PartyMemberStrength.STRONG), new TrainerPartyTemplate(1, PartyMemberStrength.AVERAGE), new TrainerPartyTemplate(3, PartyMemberStrength.AVERAGE, false, true), new TrainerPartyTemplate(1, PartyMemberStrength.STRONGER))
};

type PartyTemplateFunc = (scene: BattleScene) => TrainerPartyTemplate;
type PartyMemberFunc = (scene: BattleScene, level: integer, strength: PartyMemberStrength) => EnemyPokemon;
type GenModifiersFunc = (party: EnemyPokemon[]) => PersistentModifier[];

export interface PartyMemberFuncs {
    [key: integer]: PartyMemberFunc
}

export class TrainerConfig {
  public trainerType: TrainerType;
  public trainerTypeDouble: TrainerType;
  public name: string;
  public nameFemale: string;
  public nameDouble: string;
  public title: string;
  public titleDouble: string;
  public hasGenders: boolean = false;
  public hasDouble: boolean = false;
  public hasCharSprite: boolean = false;
  public doubleOnly: boolean = false;
  public moneyMultiplier: number = 1;
  public isBoss: boolean = false;
  public hasStaticParty: boolean = false;
  public useSameSeedForAllMembers: boolean = false;
  public mixedBattleBgm: string;
  public battleBgm: string;
  public encounterBgm: string;
  public femaleEncounterBgm: string;
  public doubleEncounterBgm: string;
  public victoryBgm: string;
  public genModifiersFunc: GenModifiersFunc;
  public modifierRewardFuncs: ModifierTypeFunc[] = [];
  public partyTemplates: TrainerPartyTemplate[];
  public partyTemplateFunc: PartyTemplateFunc;
  public partyMemberFuncs: PartyMemberFuncs = {};
  public speciesPools: TrainerTierPools;
  public speciesFilter: PokemonSpeciesFilter;
  public specialtyTypes: Type[] = [];
  public hasVoucher: boolean = false;

  public encounterMessages: string[] = [];
  public victoryMessages: string[] = [];
  public defeatMessages: string[] = [];

  public femaleEncounterMessages: string[];
  public femaleVictoryMessages: string[];
  public femaleDefeatMessages: string[];

  public doubleEncounterMessages: string[];
  public doubleVictoryMessages: string[];
  public doubleDefeatMessages: string[];

  constructor(trainerType: TrainerType, allowLegendaries?: boolean) {
    this.trainerType = trainerType;
    this.name = Utils.toReadableString(TrainerType[this.getDerivedType()]);
    this.battleBgm = "battle_trainer";
    this.mixedBattleBgm = "battle_trainer";
    this.victoryBgm = "victory_trainer";
    this.partyTemplates = [trainerPartyTemplates.TWO_AVG];
    this.speciesFilter = species => (allowLegendaries || (!species.legendary && !species.subLegendary && !species.mythical));
  }

  getKey(): string {
    return TrainerType[this.getDerivedType()].toString().toLowerCase();
  }

  getSpriteKey(female?: boolean, isDouble: boolean = false): string {
    let ret = this.getKey();
    if (this.hasGenders) {
      ret += `_${female ? "f" : "m"}`;
    }
    // If a special double trainer class was set, set it as the sprite key
    if (this.trainerTypeDouble && female && isDouble) {
      // Get the derived type for the double trainer since the sprite key is based on the derived type
      ret = TrainerType[this.getDerivedType(this.trainerTypeDouble)].toString().toLowerCase();
    }
    return ret;
  }

  setName(name: string): TrainerConfig {
    if (name === "Finn") {
      // Give the rival a localized name
      // First check if i18n is initialized
      if (!getIsInitialized()) {
        initI18n();
      }
      // This is only the male name, because the female name is handled in a different function (setHasGenders)
      if (name === "Finn") {
        name = i18next.t("trainerNames:rival");
      }
    }
    this.name = name;
    return this;
  }

  /**
   * Sets if a boss trainer will have a voucher or not.
   * @param hasVoucher - If the boss trainer will have a voucher.
   */
  setHasVoucher(hasVoucher: boolean): void {
    this.hasVoucher = hasVoucher;
  }

  setTitle(title: string): TrainerConfig {
    // First check if i18n is initialized
    if (!getIsInitialized()) {
      initI18n();
    }

    // Make the title lowercase and replace spaces with underscores
    title = title.toLowerCase().replace(/\s/g, "_");

    // Get the title from the i18n file
    this.title = i18next.t(`titles:${title}`);


    return this;
  }


  /**
     * Returns the derived trainer type for a given trainer type.
     * @param trainerTypeToDeriveFrom - The trainer type to derive from. (If null, the this.trainerType property will be used.)
     * @returns {TrainerType} - The derived trainer type.
     */
  getDerivedType(trainerTypeToDeriveFrom: TrainerType | null = null): TrainerType {
    let trainerType = trainerTypeToDeriveFrom ? trainerTypeToDeriveFrom : this.trainerType;
    switch (trainerType) {
    case TrainerType.RIVAL_2:
    case TrainerType.RIVAL_3:
    case TrainerType.RIVAL_4:
    case TrainerType.RIVAL_5:
    case TrainerType.RIVAL_6:
      trainerType = TrainerType.RIVAL;
      break;
    case TrainerType.ROCKET_BOSS_GIOVANNI_1:
    case TrainerType.ROCKET_BOSS_GIOVANNI_2:
      trainerType = TrainerType.GIOVANNI;
      break;
    }

    return trainerType;
  }

  /**
     * Sets the configuration for trainers with genders, including the female name and encounter background music (BGM).
     * @param {string} [nameFemale] - The name of the female trainer. If 'Ivy', a localized name will be assigned.
     * @param {TrainerType | string} [femaleEncounterBgm] - The encounter BGM for the female trainer, which can be a TrainerType or a string.
     * @returns {TrainerConfig} - The updated TrainerConfig instance.
     **/
  setHasGenders(nameFemale?: string, femaleEncounterBgm?: TrainerType | string): TrainerConfig {
    // If the female name is 'Ivy' (the rival), assign a localized name.
    if (nameFemale === "Ivy") {
      // Check if the internationalization (i18n) system is initialized.
      if (!getIsInitialized()) {
        // Initialize the i18n system if it is not already initialized.
        initI18n();
      }
      // Set the localized name for the female rival.
      this.nameFemale = i18next.t("trainerNames:rival_female");
    } else {
      // Otherwise, assign the provided female name.
      this.nameFemale = nameFemale!; // TODO: is this bang correct?
    }

    // Indicate that this trainer configuration includes genders.
    this.hasGenders = true;

    // If a female encounter BGM is provided.
    if (femaleEncounterBgm) {
      // If the BGM is a TrainerType (number), convert it to a string, replace underscores with spaces, and convert to lowercase.
      // Otherwise, assign the provided string as the BGM.
      this.femaleEncounterBgm = typeof femaleEncounterBgm === "number"
        ? TrainerType[femaleEncounterBgm].toString().replace(/_/g, " ").toLowerCase()
        : femaleEncounterBgm;
    }

    // Return the updated TrainerConfig instance.
    return this;
  }

  /**
     * Sets the configuration for trainers with double battles, including the name of the double trainer and the encounter BGM.
     * @param nameDouble - The name of the double trainer (e.g., "Ace Duo" for Trainer Class Doubles or "red_blue_double" for NAMED trainer doubles).
     * @param doubleEncounterBgm - The encounter BGM for the double trainer, which can be a TrainerType or a string.
     * @returns {TrainerConfig} - The updated TrainerConfig instance.
     */
  setHasDouble(nameDouble: string, doubleEncounterBgm?: TrainerType | string): TrainerConfig {
    this.hasDouble = true;
    this.nameDouble = nameDouble;
    if (doubleEncounterBgm) {
      this.doubleEncounterBgm = typeof doubleEncounterBgm === "number" ? TrainerType[doubleEncounterBgm].toString().replace(/\_/g, " ").toLowerCase() : doubleEncounterBgm;
    }
    return this;
  }

  /**
     * Sets the trainer type for double battles.
     * @param trainerTypeDouble - The TrainerType of the partner in a double battle.
     * @returns {TrainerConfig} - The updated TrainerConfig instance.
     */
  setDoubleTrainerType(trainerTypeDouble: TrainerType): TrainerConfig {
    this.trainerTypeDouble = trainerTypeDouble;
    this.setDoubleMessages(this.nameDouble);
    return this;
  }

  /**
     * Sets the encounter and victory messages for double trainers.
     * @param nameDouble - The name of the pair (e.g. "red_blue_double").
     */
  setDoubleMessages(nameDouble: string) {
    // Check if there is double battle dialogue for this trainer
    if (doubleBattleDialogue[nameDouble]) {
      // Set encounter and victory messages for double trainers
      this.doubleEncounterMessages = doubleBattleDialogue[nameDouble].encounter;
      this.doubleVictoryMessages = doubleBattleDialogue[nameDouble].victory;
      this.doubleDefeatMessages = doubleBattleDialogue[nameDouble].defeat;
    }
  }

  /**
     * Sets the title for double trainers
     * @param titleDouble - the key for the title in the i18n file. (e.g., "champion_double").
     * @returns {TrainerConfig} - The updated TrainerConfig instance.
     */
  setDoubleTitle(titleDouble: string): TrainerConfig {
    // First check if i18n is initialized
    if (!getIsInitialized()) {
      initI18n();
    }

    // Make the title lowercase and replace spaces with underscores
    titleDouble = titleDouble.toLowerCase().replace(/\s/g, "_");

    // Get the title from the i18n file
    this.titleDouble = i18next.t(`titles:${titleDouble}`);

    return this;
  }

  setHasCharSprite(): TrainerConfig {
    this.hasCharSprite = true;
    return this;
  }

  setDoubleOnly(): TrainerConfig {
    this.doubleOnly = true;
    return this;
  }

  setMoneyMultiplier(moneyMultiplier: number): TrainerConfig {
    this.moneyMultiplier = moneyMultiplier;
    return this;
  }

  setBoss(): TrainerConfig {
    this.isBoss = true;
    return this;
  }

  setStaticParty(): TrainerConfig {
    this.hasStaticParty = true;
    return this;
  }

  setUseSameSeedForAllMembers(): TrainerConfig {
    this.useSameSeedForAllMembers = true;
    return this;
  }

  setMixedBattleBgm(mixedBattleBgm: string): TrainerConfig {
    this.mixedBattleBgm = mixedBattleBgm;
    return this;
  }

  setBattleBgm(battleBgm: string): TrainerConfig {
    this.battleBgm = battleBgm;
    return this;
  }

  setEncounterBgm(encounterBgm: TrainerType | string): TrainerConfig {
    this.encounterBgm = typeof encounterBgm === "number" ? TrainerType[encounterBgm].toString().toLowerCase() : encounterBgm;
    return this;
  }

  setVictoryBgm(victoryBgm: string): TrainerConfig {
    this.victoryBgm = victoryBgm;
    return this;
  }

  setPartyTemplates(...partyTemplates: TrainerPartyTemplate[]): TrainerConfig {
    this.partyTemplates = partyTemplates;
    return this;
  }

  setPartyTemplateFunc(partyTemplateFunc: PartyTemplateFunc): TrainerConfig {
    this.partyTemplateFunc = partyTemplateFunc;
    return this;
  }

  setPartyMemberFunc(slotIndex: integer, partyMemberFunc: PartyMemberFunc): TrainerConfig {
    this.partyMemberFuncs[slotIndex] = partyMemberFunc;
    return this;
  }

  setSpeciesPools(speciesPools: TrainerTierPools | Species[]): TrainerConfig {
    this.speciesPools = (Array.isArray(speciesPools) ? {[TrainerPoolTier.COMMON]: speciesPools} : speciesPools) as unknown as TrainerTierPools;
    return this;
  }

  setSpeciesFilter(speciesFilter: PokemonSpeciesFilter, allowLegendaries?: boolean): TrainerConfig {
    const baseFilter = this.speciesFilter;
    this.speciesFilter = allowLegendaries ? speciesFilter : species => speciesFilter(species) && baseFilter(species);
    return this;
  }

  setSpecialtyTypes(...specialtyTypes: Type[]): TrainerConfig {
    this.specialtyTypes = specialtyTypes;
    return this;
  }

  setGenModifiersFunc(genModifiersFunc: GenModifiersFunc): TrainerConfig {
    this.genModifiersFunc = genModifiersFunc;
    return this;
  }

  setModifierRewardFuncs(...modifierTypeFuncs: (() => ModifierTypeFunc)[]): TrainerConfig {
    this.modifierRewardFuncs = modifierTypeFuncs.map(func => () => {
      const modifierTypeFunc = func();
      const modifierType = modifierTypeFunc();
      modifierType.withIdFromFunc(modifierTypeFunc);
      return modifierType;
    });
    return this;
  }

  /**
  * Returns the pool of species for an evil team admin
  * @param team - The evil team the admin belongs to.
  * @returns {TrainerTierPools}
  */
  speciesPoolPerEvilTeamAdmin(team): TrainerTierPools {
    team = team.toLowerCase();
    switch (team) {
    case "rocket": {
      return {
        [TrainerPoolTier.COMMON]: [Species.RATTATA, Species.KOFFING, Species.EKANS, Species.GYARADOS, Species.TAUROS, Species.SCYTHER, Species.CUBONE, Species.GROWLITHE, Species.GASTLY, Species.EXEGGCUTE, Species.VOLTORB],
        [TrainerPoolTier.UNCOMMON]: [Species.PORYGON],
        [TrainerPoolTier.RARE]: [Species.DRATINI]
      };
    }
    case "magma": {
      return {
        // placeholder
        [TrainerPoolTier.COMMON]: [Species.RATTATA, Species.KOFFING, Species.EKANS, Species.GYARADOS, Species.TAUROS, Species.SCYTHER, Species.CUBONE, Species.GROWLITHE, Species.GASTLY, Species.EXEGGCUTE, Species.VOLTORB],
        [TrainerPoolTier.UNCOMMON]: [Species.PORYGON],
        [TrainerPoolTier.RARE]: [Species.DRATINI]
      };
    }
    case "aqua": {
      return {
        // placeholder
        [TrainerPoolTier.COMMON]: [Species.RATTATA, Species.KOFFING, Species.EKANS, Species.GYARADOS, Species.TAUROS, Species.SCYTHER, Species.CUBONE, Species.GROWLITHE, Species.GASTLY, Species.EXEGGCUTE, Species.VOLTORB],
        [TrainerPoolTier.UNCOMMON]: [Species.PORYGON],
        [TrainerPoolTier.RARE]: [Species.DRATINI]
      };
    }
    case "galactic": {
      return {
        [TrainerPoolTier.COMMON]: [Species.RATTATA, Species.KOFFING, Species.EKANS, Species.GYARADOS, Species.TAUROS, Species.SCYTHER, Species.CUBONE, Species.GROWLITHE, Species.GASTLY, Species.EXEGGCUTE, Species.VOLTORB],
        [TrainerPoolTier.UNCOMMON]: [Species.PORYGON],
        [TrainerPoolTier.RARE]: [Species.DRATINI]
      };
    }
    case "plasma": {
      return {
        // placeholder
        [TrainerPoolTier.COMMON]: [Species.RATTATA, Species.KOFFING, Species.EKANS, Species.GYARADOS, Species.TAUROS, Species.SCYTHER, Species.CUBONE, Species.GROWLITHE, Species.GASTLY, Species.EXEGGCUTE, Species.VOLTORB],
        [TrainerPoolTier.UNCOMMON]: [Species.PORYGON],
        [TrainerPoolTier.RARE]: [Species.DRATINI]
      };
    }
    case "flare": {
      return {
        // placeholder
        [TrainerPoolTier.COMMON]: [Species.RATTATA, Species.KOFFING, Species.EKANS, Species.GYARADOS, Species.TAUROS, Species.SCYTHER, Species.CUBONE, Species.GROWLITHE, Species.GASTLY, Species.EXEGGCUTE, Species.VOLTORB],
        [TrainerPoolTier.UNCOMMON]: [Species.PORYGON],
        [TrainerPoolTier.RARE]: [Species.DRATINI]
      };
    }
    case "aether": {
      return {
        [TrainerPoolTier.COMMON]: [Species.SLOWPOKE, Species.EXEGGCUTE],
        [TrainerPoolTier.UNCOMMON]: [Species.ABRA],
        [TrainerPoolTier.RARE]: [Species.PORYGON]
      };
    }
    case "skull": {
      return {
        [TrainerPoolTier.COMMON]: [Species.ZUBAT, Species.KOFFING],
        [TrainerPoolTier.UNCOMMON]: [Species.GASTLY],
        [TrainerPoolTier.RARE]: [Species.NIDORAN_F]
      };
    }
    case "macro": {
      return {
        // placeholder
        [TrainerPoolTier.COMMON]: [Species.RATTATA, Species.KOFFING, Species.EKANS, Species.GYARADOS, Species.TAUROS, Species.SCYTHER, Species.CUBONE, Species.GROWLITHE, Species.GASTLY, Species.EXEGGCUTE, Species.VOLTORB],
        [TrainerPoolTier.UNCOMMON]: [Species.PORYGON],
        [TrainerPoolTier.RARE]: [Species.DRATINI]
      };
    }
    }

    console.warn(`Evil team admin for ${team} not found. Returning empty species pools.`);
    return [];
  }

  /**
     * Initializes the trainer configuration for an evil team admin.
     * @param title - The title of the evil team admin.
     * @param poolName - The evil team the admin belongs to.
     * @param {Species | Species[]} signatureSpecies - The signature species for the evil team leader.
     * @returns {TrainerConfig} - The updated TrainerConfig instance.
     * **/
  initForEvilTeamAdmin(title: string, poolName: string, signatureSpecies: (Species | Species[])[],): TrainerConfig {
    if (!getIsInitialized()) {
      initI18n();
    }
    this.setPartyTemplates(trainerPartyTemplates.RIVAL_5);

    // Set the species pools for the evil team admin.
    this.speciesPools = this.speciesPoolPerEvilTeamAdmin(poolName);

    signatureSpecies.forEach((speciesPool, s) => {
      if (!Array.isArray(speciesPool)) {
        speciesPool = [speciesPool];
      }
      this.setPartyMemberFunc(-(s + 1), getRandomPartyMemberFunc(speciesPool));
    });

    const nameForCall = this.name.toLowerCase().replace(/\s/g, "_");
    this.name = i18next.t(`trainerNames:${nameForCall}`);
    this.setHasVoucher(false);
    this.setTitle(title);
    this.setMoneyMultiplier(1.5);
    this.setBoss();
    this.setStaticParty();
    this.setBattleBgm("battle_plasma_boss");
    this.setVictoryBgm("victory_team_plasma");

    return this;
  }

  /**
     * Initializes the trainer configuration for an evil team leader. Temporarily hardcoding evil leader teams though.
     * @param {Species | Species[]} signatureSpecies - The signature species for the evil team leader.
     * @param {Type[]} specialtyTypes - The specialty types for the evil team Leader.
     * @param boolean whether or not this is the rematch fight
     * @returns {TrainerConfig} - The updated TrainerConfig instance.
     * **/
  initForEvilTeamLeader(title: string, signatureSpecies: (Species | Species[])[], rematch: boolean = false, ...specialtyTypes: Type[]): TrainerConfig {
    if (!getIsInitialized()) {
      initI18n();
    }
    if (rematch) {
      this.setPartyTemplates(trainerPartyTemplates.ELITE_FOUR);
    } else {
      this.setPartyTemplates(trainerPartyTemplates.RIVAL_5);
    }
    signatureSpecies.forEach((speciesPool, s) => {
      if (!Array.isArray(speciesPool)) {
        speciesPool = [speciesPool];
      }
      this.setPartyMemberFunc(-(s + 1), getRandomPartyMemberFunc(speciesPool));
    });
    if (specialtyTypes.length) {
      this.setSpeciesFilter(p => specialtyTypes.find(t => p.isOfType(t)) !== undefined);
      this.setSpecialtyTypes(...specialtyTypes);
    }
    const nameForCall = this.name.toLowerCase().replace(/\s/g, "_");
    this.name = i18next.t(`trainerNames:${nameForCall}`);
    this.setTitle(title);
    this.setMoneyMultiplier(2.5);
    this.setBoss();
    this.setStaticParty();
    this.setHasVoucher(true);
    this.setBattleBgm("battle_plasma_boss");
    this.setVictoryBgm("victory_team_plasma");

    return this;
  }

  /**
     * Initializes the trainer configuration for a Gym Leader.
     * @param {Species | Species[]} signatureSpecies - The signature species for the Gym Leader.
     * @param {Type[]} specialtyTypes - The specialty types for the Gym Leader.
     * @param isMale - Whether the Gym Leader is Male or Not (for localization of the title).
     * @returns {TrainerConfig} - The updated TrainerConfig instance.
     * **/
  initForGymLeader(signatureSpecies: (Species | Species[])[], isMale: boolean, ...specialtyTypes: Type[]): TrainerConfig {
    // Check if the internationalization (i18n) system is initialized.
    if (!getIsInitialized()) {
      initI18n();
    }

    // Set the function to generate the Gym Leader's party template.
    this.setPartyTemplateFunc(getGymLeaderPartyTemplate);

    // Set up party members with their corresponding species.
    signatureSpecies.forEach((speciesPool, s) => {
      // Ensure speciesPool is an array.
      if (!Array.isArray(speciesPool)) {
        speciesPool = [speciesPool];
      }
      // Set a function to get a random party member from the species pool.
      this.setPartyMemberFunc(-(s + 1), getRandomPartyMemberFunc(speciesPool));
    });

    // If specialty types are provided, set species filter and specialty types.
    if (specialtyTypes.length) {
      this.setSpeciesFilter(p => specialtyTypes.find(t => p.isOfType(t)) !== undefined);
      this.setSpecialtyTypes(...specialtyTypes);
    }

    // Localize the trainer's name by converting it to lowercase and replacing spaces with underscores.
    const nameForCall = this.name.toLowerCase().replace(/\s/g, "_");
    this.name = i18next.t(`trainerNames:${nameForCall}`);

    // Set the title to "gym_leader". (this is the key in the i18n file)
    this.setTitle("gym_leader");
    if (!isMale) {
      this.setTitle("gym_leader_female");
    }

    // Configure various properties for the Gym Leader.
    this.setMoneyMultiplier(2.5);
    this.setBoss();
    this.setStaticParty();
    this.setHasVoucher(true);
    this.setBattleBgm("battle_unova_gym");
    this.setVictoryBgm("victory_gym");
    this.setGenModifiersFunc(party => {
      const waveIndex = party[0].scene.currentBattle.waveIndex;
      return getRandomTeraModifiers(party, waveIndex >= 100 ? 1 : 0, specialtyTypes.length ? specialtyTypes : undefined);
    });

    return this;
  }

  /**
     * Initializes the trainer configuration for an Elite Four member.
     * @param {Species | Species[]} signatureSpecies - The signature species for the Elite Four member.
     * @param {Type[]} specialtyTypes - The specialty types for the Elite Four member.
     * @param isMale - Whether the Elite Four Member is Male or Female (for localization of the title).
     * @returns {TrainerConfig} - The updated TrainerConfig instance.
     **/
  initForEliteFour(signatureSpecies: (Species | Species[])[], isMale: boolean, ...specialtyTypes: Type[]): TrainerConfig {
    // Check if the internationalization (i18n) system is initialized.
    if (!getIsInitialized()) {
      initI18n();
    }

    // Set the party templates for the Elite Four.
    this.setPartyTemplates(trainerPartyTemplates.ELITE_FOUR);

    // Set up party members with their corresponding species.
    signatureSpecies.forEach((speciesPool, s) => {
      // Ensure speciesPool is an array.
      if (!Array.isArray(speciesPool)) {
        speciesPool = [speciesPool];
      }
      // Set a function to get a random party member from the species pool.
      this.setPartyMemberFunc(-(s + 1), getRandomPartyMemberFunc(speciesPool));
    });

    // Set species filter and specialty types if provided, otherwise filter by base total.
    if (specialtyTypes.length) {
      this.setSpeciesFilter(p => specialtyTypes.some(t => p.isOfType(t)) && p.baseTotal >= 450);
      this.setSpecialtyTypes(...specialtyTypes);
    } else {
      this.setSpeciesFilter(p => p.baseTotal >= 450);
    }

    // Localize the trainer's name by converting it to lowercase and replacing spaces with underscores.
    const nameForCall = this.name.toLowerCase().replace(/\s/g, "_");
    this.name = i18next.t(`trainerNames:${nameForCall}`);

    // Set the title to "elite_four". (this is the key in the i18n file)
    this.setTitle("elite_four");
    if (!isMale) {
      this.setTitle("elite_four_female");
    }

    // Configure various properties for the Elite Four member.
    this.setMoneyMultiplier(3.25);
    this.setBoss();
    this.setStaticParty();
    this.setHasVoucher(true);
    this.setBattleBgm("battle_unova_elite");
    this.setVictoryBgm("victory_gym");
    this.setGenModifiersFunc(party => getRandomTeraModifiers(party, 2, specialtyTypes.length ? specialtyTypes : undefined));

    return this;
  }

  /**
     * Initializes the trainer configuration for a Champion.
     * @param {Species | Species[]} signatureSpecies - The signature species for the Champion.
     * @param isMale - Whether the Champion is Male or Female (for localization of the title).
     * @returns {TrainerConfig} - The updated TrainerConfig instance.
     **/
  initForChampion(signatureSpecies: (Species | Species[])[], isMale: boolean): TrainerConfig {
    // Check if the internationalization (i18n) system is initialized.
    if (!getIsInitialized()) {
      initI18n();
    }

    // Set the party templates for the Champion.
    this.setPartyTemplates(trainerPartyTemplates.CHAMPION);

    // Set up party members with their corresponding species.
    signatureSpecies.forEach((speciesPool, s) => {
      // Ensure speciesPool is an array.
      if (!Array.isArray(speciesPool)) {
        speciesPool = [speciesPool];
      }
      // Set a function to get a random party member from the species pool.
      this.setPartyMemberFunc(-(s + 1), getRandomPartyMemberFunc(speciesPool));
    });

    // Set species filter to only include species with a base total of 470 or higher.
    this.setSpeciesFilter(p => p.baseTotal >= 470);

    // Localize the trainer's name by converting it to lowercase and replacing spaces with underscores.
    const nameForCall = this.name.toLowerCase().replace(/\s/g, "_");
    this.name = i18next.t(`trainerNames:${nameForCall}`);

    // Set the title to "champion". (this is the key in the i18n file)
    this.setTitle("champion");
    if (!isMale) {
      this.setTitle("champion_female");
    }


    // Configure various properties for the Champion.
    this.setMoneyMultiplier(10);
    this.setBoss();
    this.setStaticParty();
    this.setHasVoucher(true);
    this.setBattleBgm("battle_champion_alder");
    this.setVictoryBgm("victory_champion");
    this.setGenModifiersFunc(party => getRandomTeraModifiers(party, 3));

    return this;
  }

  /**
     * Retrieves the title for the trainer based on the provided trainer slot and variant.
     * @param {TrainerSlot} trainerSlot - The slot to determine which title to use. Defaults to TrainerSlot.NONE.
     * @param {TrainerVariant} variant - The variant of the trainer to determine the specific title.
     * @returns {string} - The title of the trainer.
     **/
  getTitle(trainerSlot: TrainerSlot = TrainerSlot.NONE, variant: TrainerVariant): string {
    const ret = this.name;

    // Check if the variant is double and the name for double exists
    if (!trainerSlot && variant === TrainerVariant.DOUBLE && this.nameDouble) {
      return this.nameDouble;
    }

    // Female variant
    if (this.hasGenders) {
      // If the name is already set
      if (this.nameFemale) {
        // Check if the variant is either female or this is for the partner in a double battle
        if (variant === TrainerVariant.FEMALE || (variant === TrainerVariant.DOUBLE && trainerSlot === TrainerSlot.TRAINER_PARTNER)) {
          return this.nameFemale;
        }
      } else
      // Check if !variant is true, if so return the name, else return the name with _female appended
        if (variant) {
          if (!getIsInitialized()) {
            initI18n();
          }
          // Check if the female version exists in the i18n file
          if (i18next.exists(`trainerClasses:${this.name.toLowerCase()}`)) {
            // If it does, return
            return ret + "_female";
          } else {
            // If it doesn't, we do not do anything and go to the normal return
            // This is to prevent the game from displaying an error if a female version of the trainer does not exist in the localization
          }
        }
    }

    return ret;
  }

  loadAssets(scene: BattleScene, variant: TrainerVariant): Promise<void> {
    return new Promise(resolve => {
      const isDouble = variant === TrainerVariant.DOUBLE;
      const trainerKey = this.getSpriteKey(variant === TrainerVariant.FEMALE, false);
      const partnerTrainerKey = this.getSpriteKey(true, true);
      scene.loadAtlas(trainerKey, "trainer");
      if (isDouble) {
        scene.loadAtlas(partnerTrainerKey, "trainer");
      }
      scene.load.once(Phaser.Loader.Events.COMPLETE, () => {
        const originalWarn = console.warn;
        // Ignore warnings for missing frames, because there will be a lot
        console.warn = () => {
        };
        const frameNames = scene.anims.generateFrameNames(trainerKey, {
          zeroPad: 4,
          suffix: ".png",
          start: 1,
          end: 128
        });
        const partnerFrameNames = isDouble
          ? scene.anims.generateFrameNames(partnerTrainerKey, {
            zeroPad: 4,
            suffix: ".png",
            start: 1,
            end: 128
          })
          : "";
        console.warn = originalWarn;
        if (!(scene.anims.exists(trainerKey))) {
          scene.anims.create({
            key: trainerKey,
            frames: frameNames,
            frameRate: 24,
            repeat: -1
          });
        }
        if (isDouble && !(scene.anims.exists(partnerTrainerKey))) {
          scene.anims.create({
            key: partnerTrainerKey,
            frames: partnerFrameNames,
            frameRate: 24,
            repeat: -1
          });
        }
        resolve();
      });
      if (!scene.load.isLoading()) {
        scene.load.start();
      }
    });
  }
}

let t = 0;

interface TrainerConfigs {
    [key: integer]: TrainerConfig
}

/**
 * The function to get variable strength grunts
 * @param scene the singleton scene being passed in
 * @returns the correct TrainerPartyTemplate
 */
function getEvilGruntPartyTemplate(scene: BattleScene): TrainerPartyTemplate {
  const waveIndex = scene.currentBattle?.waveIndex;
  if (waveIndex < 40) {
    return trainerPartyTemplates.TWO_AVG;
  } else if (waveIndex < 63) {
    return trainerPartyTemplates.THREE_AVG;
  } else if (waveIndex < 65) {
    return trainerPartyTemplates.TWO_AVG_ONE_STRONG;
  } else if (waveIndex < 112) {
    return trainerPartyTemplates.GYM_LEADER_4; // 3avg 1 strong 1 stronger
  } else {
    return trainerPartyTemplates.GYM_LEADER_5; // 3 avg 2 strong 1 stronger
  }
}

function getWavePartyTemplate(scene: BattleScene, ...templates: TrainerPartyTemplate[]) {
  return templates[Math.min(Math.max(Math.ceil((scene.gameMode.getWaveForDifficulty(scene.currentBattle?.waveIndex || startingWave, true) - 20) / 30), 0), templates.length - 1)];
}

function getGymLeaderPartyTemplate(scene: BattleScene) {
  return getWavePartyTemplate(scene, trainerPartyTemplates.GYM_LEADER_1, trainerPartyTemplates.GYM_LEADER_2, trainerPartyTemplates.GYM_LEADER_3, trainerPartyTemplates.GYM_LEADER_4, trainerPartyTemplates.GYM_LEADER_5);
}

function getRandomPartyMemberFunc(speciesPool: Species[], trainerSlot: TrainerSlot = TrainerSlot.TRAINER, ignoreEvolution: boolean = false, postProcess?: (enemyPokemon: EnemyPokemon) => void): PartyMemberFunc {
  return (scene: BattleScene, level: integer, strength: PartyMemberStrength) => {
    let species = Utils.randSeedItem(speciesPool);
    if (!ignoreEvolution) {
      species = getPokemonSpecies(species).getTrainerSpeciesForLevel(level, true, strength, scene.currentBattle.waveIndex);
    }
    return scene.addEnemyPokemon(getPokemonSpecies(species), level, trainerSlot, undefined, undefined, postProcess);
  };
}

function getSpeciesFilterRandomPartyMemberFunc(speciesFilter: PokemonSpeciesFilter, trainerSlot: TrainerSlot = TrainerSlot.TRAINER, allowLegendaries?: boolean, postProcess?: (EnemyPokemon: EnemyPokemon) => void): PartyMemberFunc {
  const originalSpeciesFilter = speciesFilter;
  speciesFilter = (species: PokemonSpecies) => (allowLegendaries || (!species.legendary && !species.subLegendary && !species.mythical)) && originalSpeciesFilter(species);
  return (scene: BattleScene, level: integer, strength: PartyMemberStrength) => {
    const ret = scene.addEnemyPokemon(getPokemonSpecies(scene.randomSpecies(scene.currentBattle.waveIndex, level, false, speciesFilter).getTrainerSpeciesForLevel(level, true, strength, scene.currentBattle.waveIndex)), level, trainerSlot, undefined, undefined, postProcess);
    return ret;
  };
}

function getRandomTeraModifiers(party: EnemyPokemon[], count: integer, types?: Type[]): PersistentModifier[] {
  const ret: PersistentModifier[] = [];
  const partyMemberIndexes = new Array(party.length).fill(null).map((_, i) => i);
  for (let t = 0; t < Math.min(count, party.length); t++) {
    const randomIndex = Utils.randSeedItem(partyMemberIndexes);
    partyMemberIndexes.splice(partyMemberIndexes.indexOf(randomIndex), 1);
    ret.push(modifierTypes.TERA_SHARD().generateType([], [Utils.randSeedItem(types ? types : party[randomIndex].getTypes())])!.withIdFromFunc(modifierTypes.TERA_SHARD).newModifier(party[randomIndex]) as PersistentModifier); // TODO: is the bang correct?
  }
  return ret;
}

type SignatureSpecies = {
    [key in string]: (Species | Species[])[];
};

/*
 * The signature species for each Gym Leader, Elite Four member, and Champion.
 * The key is the trainer type, and the value is an array of Species or Species arrays.
 * This is in a separate const so it can be accessed from other places and not just the trainerConfigs
 */
export const signatureSpecies: SignatureSpecies = {
  BROCK: [Species.GEODUDE, Species.ONIX],
  MISTY: [Species.STARYU, Species.PSYDUCK],
  LT_SURGE: [Species.VOLTORB, Species.PIKACHU, Species.ELECTABUZZ],
  ERIKA: [Species.ODDISH, Species.BELLSPROUT, Species.TANGELA],
  JANINE: [Species.VENONAT, Species.ZUBAT],
  SABRINA: [Species.ABRA, Species.MR_MIME],
  BLAINE: [Species.GROWLITHE, Species.PONYTA, Species.MAGMAR],
  GIOVANNI: [Species.NIDORAN_M, Species.NIDORAN_F],
  LORELEI: [Species.JYNX, Species.SLOWBRO, Species.LAPRAS, Species.CLOYSTER],
  BRUNO: [Species.MACHAMP, Species.HITMONCHAN, Species.HITMONLEE, Species.GOLEM],
  AGATHA: [Species.GENGAR, [Species.ARBOK, Species.WEEZING], Species.GOLBAT],
  LANCE: [Species.DRAGONITE, Species.GYARADOS, Species.AERODACTYL, Species.EXEGGUTOR],
  BLUE: [[Species.GYARADOS, Species.EXEGGUTOR, Species.ARCANINE], Species.MOLTRES, [Species.RHYDON, Species.MAGNETON]], // Alakazam lead, Mega Pidgeot
  RED: [Species.ARTICUNO, Species.SNORLAX, [Species.JOLTEON, Species.FLAREON, Species.VAPOREON]], // GMax Pikachu lead, Mega gen 1 starter
};

export const trainerConfigs: TrainerConfigs = {
  [TrainerType.UNKNOWN]: new TrainerConfig(0).setHasGenders(),
  [TrainerType.ACE_TRAINER]: new TrainerConfig(++t).setHasGenders("Ace Trainer Female").setHasDouble("Ace Duo").setMoneyMultiplier(2.25).setEncounterBgm(TrainerType.ACE_TRAINER)
    .setPartyTemplateFunc(scene => getWavePartyTemplate(scene, trainerPartyTemplates.THREE_WEAK_BALANCED, trainerPartyTemplates.FOUR_WEAK_BALANCED, trainerPartyTemplates.FIVE_WEAK_BALANCED, trainerPartyTemplates.SIX_WEAK_BALANCED)),
  [TrainerType.ARTIST]: new TrainerConfig(++t).setEncounterBgm(TrainerType.RICH).setPartyTemplates(trainerPartyTemplates.ONE_STRONG, trainerPartyTemplates.TWO_AVG, trainerPartyTemplates.THREE_AVG)
    .setSpeciesPools([Species.FARFETCHD]),
  [TrainerType.BACKERS]: new TrainerConfig(++t).setHasGenders("Backers").setDoubleOnly().setEncounterBgm(TrainerType.ACE_TRAINER),
  [TrainerType.BACKPACKER]: new TrainerConfig(++t).setHasGenders("Backpacker Female").setHasDouble("Backpackers").setSpeciesFilter(s => s.isOfType(Type.FLYING) || s.isOfType(Type.ROCK)).setEncounterBgm(TrainerType.BACKPACKER)
    .setPartyTemplates(trainerPartyTemplates.ONE_STRONG, trainerPartyTemplates.ONE_WEAK_ONE_STRONG, trainerPartyTemplates.ONE_AVG_ONE_STRONG)
    .setSpeciesPools({
      [TrainerPoolTier.COMMON]: [Species.RHYHORN],
      [TrainerPoolTier.UNCOMMON]: [Species.JYNX],
      [TrainerPoolTier.RARE]: [Species.TAUROS],
      [TrainerPoolTier.SUPER_RARE]: [Species.DRATINI]
    }),
  [TrainerType.BAKER]: new TrainerConfig(++t).setEncounterBgm(TrainerType.CLERK).setMoneyMultiplier(1.35).setSpeciesFilter(s => s.isOfType(Type.GRASS) || s.isOfType(Type.FIRE)),
  [TrainerType.BEAUTY]: new TrainerConfig(++t).setMoneyMultiplier(1.55).setEncounterBgm(TrainerType.PARASOL_LADY),
  [TrainerType.BIKER]: new TrainerConfig(++t).setMoneyMultiplier(1.4).setEncounterBgm(TrainerType.ROUGHNECK).setSpeciesFilter(s => s.isOfType(Type.POISON)),
  [TrainerType.BLACK_BELT]: new TrainerConfig(++t).setHasGenders("Battle Girl", TrainerType.PSYCHIC).setHasDouble("Crush Kin").setEncounterBgm(TrainerType.ROUGHNECK).setSpecialtyTypes(Type.FIGHTING)
    .setPartyTemplates(trainerPartyTemplates.TWO_WEAK_ONE_AVG, trainerPartyTemplates.TWO_WEAK_ONE_AVG, trainerPartyTemplates.TWO_AVG, trainerPartyTemplates.TWO_AVG, trainerPartyTemplates.TWO_WEAK_ONE_STRONG, trainerPartyTemplates.THREE_AVG, trainerPartyTemplates.TWO_AVG_ONE_STRONG)
    .setSpeciesPools({
      [TrainerPoolTier.COMMON]: [Species.NIDORAN_F, Species.NIDORAN_M, Species.MACHOP],
      [TrainerPoolTier.UNCOMMON]: [Species.MANKEY, Species.POLIWRATH],
      [TrainerPoolTier.RARE]: [Species.MACHOKE],
      [TrainerPoolTier.SUPER_RARE]: [Species.PRIMEAPE],
      [TrainerPoolTier.ULTRA_RARE]: [Species.MACHAMP]
    }),
  [TrainerType.BREEDER]: new TrainerConfig(++t).setMoneyMultiplier(1.325).setEncounterBgm(TrainerType.POKEFAN).setHasGenders("Breeder Female").setHasDouble("Breeders")
    .setPartyTemplateFunc(scene => getWavePartyTemplate(scene, trainerPartyTemplates.FOUR_WEAKER, trainerPartyTemplates.FIVE_WEAKER, trainerPartyTemplates.SIX_WEAKER))
    .setSpeciesFilter(s => s.baseTotal < 450),
  [TrainerType.CLERK]: new TrainerConfig(++t).setHasGenders("Clerk Female").setHasDouble("Colleagues").setEncounterBgm(TrainerType.CLERK)
    .setPartyTemplates(trainerPartyTemplates.TWO_WEAK, trainerPartyTemplates.THREE_WEAK, trainerPartyTemplates.ONE_AVG, trainerPartyTemplates.TWO_AVG, trainerPartyTemplates.TWO_WEAK_ONE_AVG)
    .setSpeciesPools({
      [TrainerPoolTier.COMMON]: [Species.MEOWTH, Species.PSYDUCK],
      [TrainerPoolTier.UNCOMMON]: [Species.JIGGLYPUFF, Species.MAGNEMITE]
    }),
  [TrainerType.DEPOT_AGENT]: new TrainerConfig(++t).setMoneyMultiplier(1.45).setEncounterBgm(TrainerType.CLERK),
  [TrainerType.DOCTOR]: new TrainerConfig(++t).setHasGenders("Nurse", "lass").setHasDouble("Medical Team").setMoneyMultiplier(3).setEncounterBgm(TrainerType.CLERK)
    .setSpeciesFilter(s => !!s.getLevelMoves().find(plm => plm[1] === Moves.SOFT_BOILED)),
  [TrainerType.FIREBREATHER]: new TrainerConfig(++t).setMoneyMultiplier(1.4).setEncounterBgm(TrainerType.ROUGHNECK)
    .setSpeciesFilter(s => !!s.getLevelMoves().find(plm => plm[1] === Moves.SMOG) || s.isOfType(Type.FIRE)),
  [TrainerType.FISHERMAN]: new TrainerConfig(++t).setMoneyMultiplier(1.25).setEncounterBgm(TrainerType.BACKPACKER).setSpecialtyTypes(Type.WATER)
    .setPartyTemplates(trainerPartyTemplates.TWO_WEAK_SAME_ONE_AVG, trainerPartyTemplates.ONE_AVG, trainerPartyTemplates.THREE_WEAK_SAME, trainerPartyTemplates.ONE_STRONG, trainerPartyTemplates.SIX_WEAKER)
    .setSpeciesPools({
      [TrainerPoolTier.COMMON]: [Species.TENTACOOL, Species.MAGIKARP, Species.GOLDEEN, Species.STARYU],
      [TrainerPoolTier.UNCOMMON]: [Species.POLIWAG, Species.SHELLDER, Species.KRABBY, Species.HORSEA]
    }),
  [TrainerType.GUITARIST]: new TrainerConfig(++t).setMoneyMultiplier(1.2).setEncounterBgm(TrainerType.ROUGHNECK).setSpecialtyTypes(Type.ELECTRIC).setSpeciesFilter(s => s.isOfType(Type.ELECTRIC)),
  [TrainerType.HARLEQUIN]: new TrainerConfig(++t).setEncounterBgm(TrainerType.PSYCHIC).setSpecialtyTypes(Type.PSYCHIC, Type.GHOST),
  [TrainerType.HIKER]: new TrainerConfig(++t).setEncounterBgm(TrainerType.BACKPACKER)
    .setPartyTemplates(trainerPartyTemplates.TWO_AVG_SAME_ONE_AVG, trainerPartyTemplates.TWO_AVG_SAME_ONE_STRONG, trainerPartyTemplates.TWO_AVG, trainerPartyTemplates.FOUR_WEAK, trainerPartyTemplates.ONE_STRONG)
    .setSpeciesPools({
      [TrainerPoolTier.COMMON]: [Species.SANDSHREW, Species.DIGLETT, Species.GEODUDE, Species.MACHOP],
      [TrainerPoolTier.UNCOMMON]: [Species.ZUBAT, Species.RHYHORN, Species.ONIX, Species.CUBONE]
    }),
  [TrainerType.HOOLIGANS]: new TrainerConfig(++t).setDoubleOnly().setEncounterBgm(TrainerType.ROUGHNECK).setSpeciesFilter(s => s.isOfType(Type.POISON)),
  [TrainerType.HOOPSTER]: new TrainerConfig(++t).setMoneyMultiplier(1.2).setEncounterBgm(TrainerType.ACE_TRAINER),
  [TrainerType.INFIELDER]: new TrainerConfig(++t).setMoneyMultiplier(1.2).setEncounterBgm(TrainerType.ACE_TRAINER),
  [TrainerType.JANITOR]: new TrainerConfig(++t).setMoneyMultiplier(1.1).setEncounterBgm(TrainerType.CLERK),
  [TrainerType.LINEBACKER]: new TrainerConfig(++t).setMoneyMultiplier(1.2).setEncounterBgm(TrainerType.ACE_TRAINER),
  [TrainerType.MAID]: new TrainerConfig(++t).setMoneyMultiplier(1.6).setEncounterBgm(TrainerType.RICH),
  [TrainerType.MUSICIAN]: new TrainerConfig(++t).setEncounterBgm(TrainerType.ROUGHNECK).setSpeciesFilter(s => !!s.getLevelMoves().find(plm => plm[1] === Moves.SING)),
  [TrainerType.HEX_MANIAC]: new TrainerConfig(++t).setMoneyMultiplier(1.5).setEncounterBgm(TrainerType.PSYCHIC)
    .setPartyTemplates(trainerPartyTemplates.TWO_AVG, trainerPartyTemplates.ONE_AVG_ONE_STRONG, trainerPartyTemplates.TWO_AVG_SAME_ONE_AVG, trainerPartyTemplates.THREE_AVG, trainerPartyTemplates.TWO_STRONG)
    .setSpeciesFilter(s => s.isOfType(Type.GHOST)),
  [TrainerType.NURSERY_AIDE]: new TrainerConfig(++t).setMoneyMultiplier(1.3).setEncounterBgm("lass"),
  [TrainerType.OFFICER]: new TrainerConfig(++t).setMoneyMultiplier(1.55).setEncounterBgm(TrainerType.CLERK)
    .setPartyTemplates(trainerPartyTemplates.ONE_AVG, trainerPartyTemplates.ONE_STRONG, trainerPartyTemplates.TWO_AVG, trainerPartyTemplates.TWO_WEAK_SAME_ONE_AVG)
    .setSpeciesPools({
      [TrainerPoolTier.COMMON]: [Species.VULPIX, Species.GROWLITHE],
    }),
  [TrainerType.PARASOL_LADY]: new TrainerConfig(++t).setMoneyMultiplier(1.55).setEncounterBgm(TrainerType.PARASOL_LADY).setSpeciesFilter(s => s.isOfType(Type.WATER)),
  [TrainerType.PILOT]: new TrainerConfig(++t).setEncounterBgm(TrainerType.CLERK).setSpeciesFilter(s => tmSpecies[Moves.FLY].indexOf(s.speciesId) > -1),
  [TrainerType.POKEFAN]: new TrainerConfig(++t).setMoneyMultiplier(1.4).setName("PokéFan").setHasGenders("PokéFan Female").setHasDouble("PokéFan Family").setEncounterBgm(TrainerType.POKEFAN)
    .setPartyTemplates(trainerPartyTemplates.SIX_WEAKER, trainerPartyTemplates.FOUR_WEAK, trainerPartyTemplates.TWO_AVG, trainerPartyTemplates.ONE_STRONG, trainerPartyTemplates.FOUR_WEAK_SAME, trainerPartyTemplates.FIVE_WEAK, trainerPartyTemplates.SIX_WEAKER_SAME),
  [TrainerType.PRESCHOOLER]: new TrainerConfig(++t).setMoneyMultiplier(0.2).setEncounterBgm(TrainerType.YOUNGSTER).setHasGenders("Preschooler Female", "lass").setHasDouble("Preschoolers")
    .setPartyTemplates(trainerPartyTemplates.THREE_WEAK, trainerPartyTemplates.FOUR_WEAKER, trainerPartyTemplates.TWO_WEAK_SAME_ONE_AVG, trainerPartyTemplates.FIVE_WEAKER)
    .setSpeciesPools({
      [TrainerPoolTier.COMMON]: [Species.CATERPIE, Species.SANDSHREW],
      [TrainerPoolTier.UNCOMMON]: [Species.EEVEE]
    }),
  [TrainerType.PSYCHIC]: new TrainerConfig(++t).setHasGenders("Psychic Female").setHasDouble("Psychics").setMoneyMultiplier(1.4).setEncounterBgm(TrainerType.PSYCHIC)
    .setPartyTemplates(trainerPartyTemplates.TWO_WEAK, trainerPartyTemplates.TWO_AVG, trainerPartyTemplates.TWO_WEAK_SAME_ONE_AVG, trainerPartyTemplates.TWO_WEAK_SAME_TWO_WEAK_SAME, trainerPartyTemplates.ONE_STRONGER)
    .setSpeciesPools({
      [TrainerPoolTier.COMMON]: [Species.ABRA, Species.DROWZEE],
      [TrainerPoolTier.UNCOMMON]: [Species.MR_MIME, Species.EXEGGCUTE]
    }),
  [TrainerType.RANGER]: new TrainerConfig(++t).setMoneyMultiplier(1.4).setName("Pokémon Ranger").setEncounterBgm(TrainerType.BACKPACKER).setHasGenders("Pokémon Ranger Female").setHasDouble("Pokémon Rangers")
    .setSpeciesPools({
      [TrainerPoolTier.COMMON]: [Species.PIKACHU, Species.GROWLITHE, Species.PONYTA],
      [TrainerPoolTier.UNCOMMON]: [Species.TAUROS, Species.FARFETCHD],
      [TrainerPoolTier.RARE]: [Species.EEVEE, Species.SCYTHER, Species.KANGASKHAN],
    }),
  [TrainerType.RICH]: new TrainerConfig(++t).setMoneyMultiplier(5).setName("Gentleman").setHasGenders("Madame").setHasDouble("Rich Couple"),
  [TrainerType.RICH_KID]: new TrainerConfig(++t).setMoneyMultiplier(3.75).setName("Rich Boy").setHasGenders("Lady").setHasDouble("Rich Kids").setEncounterBgm(TrainerType.RICH),
  [TrainerType.ROUGHNECK]: new TrainerConfig(++t).setMoneyMultiplier(1.4).setEncounterBgm(TrainerType.ROUGHNECK),
  [TrainerType.SAILOR]: new TrainerConfig(++t).setMoneyMultiplier(1.4).setEncounterBgm(TrainerType.BACKPACKER).setSpeciesFilter(s => s.isOfType(Type.WATER) || s.isOfType(Type.FIGHTING)),
  [TrainerType.SCIENTIST]: new TrainerConfig(++t).setHasGenders("Scientist Female").setHasDouble("Scientists").setMoneyMultiplier(1.7).setEncounterBgm(TrainerType.SCIENTIST)
    .setSpeciesPools({
      [TrainerPoolTier.COMMON]: [Species.MAGNEMITE, Species.GRIMER, Species.DROWZEE, Species.VOLTORB, Species.KOFFING],
      [TrainerPoolTier.RARE]: [Species.ABRA, Species.DITTO, Species.PORYGON],
      [TrainerPoolTier.SUPER_RARE]: [Species.OMANYTE, Species.KABUTO, Species.AERODACTYL],
    }),
  [TrainerType.SMASHER]: new TrainerConfig(++t).setMoneyMultiplier(1.2).setEncounterBgm(TrainerType.ACE_TRAINER),
  [TrainerType.SNOW_WORKER]: new TrainerConfig(++t).setName("Worker").setHasGenders("Worker Female").setHasDouble("Workers").setMoneyMultiplier(1.7).setEncounterBgm(TrainerType.CLERK).setSpeciesFilter(s => s.isOfType(Type.ICE)),
  [TrainerType.STRIKER]: new TrainerConfig(++t).setMoneyMultiplier(1.2).setEncounterBgm(TrainerType.ACE_TRAINER),
  [TrainerType.SCHOOL_KID]: new TrainerConfig(++t).setMoneyMultiplier(0.75).setEncounterBgm(TrainerType.YOUNGSTER).setHasGenders("School Kid Female", "lass").setHasDouble("School Kids")
    .setSpeciesPools({
      [TrainerPoolTier.COMMON]: [Species.ODDISH, Species.EXEGGCUTE],
      [TrainerPoolTier.UNCOMMON]: [Species.VOLTORB],
      [TrainerPoolTier.RARE]: [Species.TANGELA, Species.EEVEE],
    }),
  [TrainerType.SWIMMER]: new TrainerConfig(++t).setMoneyMultiplier(1.3).setEncounterBgm(TrainerType.PARASOL_LADY).setHasGenders("Swimmer Female").setHasDouble("Swimmers").setSpecialtyTypes(Type.WATER).setSpeciesFilter(s => s.isOfType(Type.WATER)),
  [TrainerType.TWINS]: new TrainerConfig(++t).setDoubleOnly().setMoneyMultiplier(0.65).setUseSameSeedForAllMembers()
    .setPartyTemplateFunc(scene => getWavePartyTemplate(scene, trainerPartyTemplates.TWO_WEAK, trainerPartyTemplates.TWO_AVG, trainerPartyTemplates.TWO_STRONG))
    .setPartyMemberFunc(0, getRandomPartyMemberFunc([Species.METAPOD, Species.JIGGLYPUFF, Species.EEVEE]))
    .setPartyMemberFunc(1, getRandomPartyMemberFunc([Species.KAKUNA, Species.CLEFAIRY, Species.EEVEE], TrainerSlot.TRAINER_PARTNER))
    .setEncounterBgm(TrainerType.TWINS),
  [TrainerType.VETERAN]: new TrainerConfig(++t).setHasGenders("Veteran Female").setHasDouble("Veteran Duo").setMoneyMultiplier(2.5).setEncounterBgm(TrainerType.ACE_TRAINER).setSpeciesFilter(s => s.isOfType(Type.DRAGON)),
  [TrainerType.WORKER]: new TrainerConfig(++t).setHasGenders("Worker Female").setHasDouble("Workers").setEncounterBgm(TrainerType.CLERK).setMoneyMultiplier(1.7).setSpeciesFilter(s => s.isOfType(Type.ROCK)),
  [TrainerType.YOUNGSTER]: new TrainerConfig(++t).setMoneyMultiplier(0.5).setEncounterBgm(TrainerType.YOUNGSTER).setHasGenders("Lass", "lass").setHasDouble("Beginners").setPartyTemplates(trainerPartyTemplates.TWO_WEAKER)
    .setSpeciesPools(
      [Species.CATERPIE, Species.WEEDLE, Species.RATTATA]
    ),
  [TrainerType.ROCKET_GRUNT]: new TrainerConfig(++t).setHasGenders("Rocket Grunt Female").setHasDouble("Rocket Grunts").setMoneyMultiplier(1.0).setEncounterBgm(TrainerType.ROCKET_GRUNT).setBattleBgm("battle_plasma_grunt").setMixedBattleBgm("battle_rocket_grunt").setVictoryBgm("victory_team_plasma").setPartyTemplateFunc(scene => getEvilGruntPartyTemplate(scene))
    .setSpeciesPools({
      [TrainerPoolTier.COMMON]: [Species.WEEDLE, Species.RATTATA, Species.EKANS, Species.SANDSHREW, Species.ZUBAT, Species.GEODUDE, Species.KOFFING, Species.GRIMER, Species.ODDISH],
      [TrainerPoolTier.UNCOMMON]: [Species.GYARADOS, Species.TAUROS, Species.SCYTHER, Species.CUBONE, Species.GROWLITHE, Species.GASTLY, Species.EXEGGCUTE, Species.VOLTORB],
      [TrainerPoolTier.RARE]: [Species.PORYGON],
      [TrainerPoolTier.SUPER_RARE]: [Species.DRATINI]
    }),
  [TrainerType.ARIANA]: new TrainerConfig(++t).setMoneyMultiplier(1.5).initForEvilTeamAdmin("rocket_admin_female", "rocket", [Species.ARBOK]).setEncounterBgm(TrainerType.ROCKET_GRUNT).setBattleBgm("battle_plasma_grunt").setMixedBattleBgm("battle_rocket_grunt").setVictoryBgm("victory_team_plasma").setPartyTemplateFunc(scene => getEvilGruntPartyTemplate(scene)),
  [TrainerType.PROTON]: new TrainerConfig(++t).setMoneyMultiplier(1.5).initForEvilTeamAdmin("rocket_admin", "rocket", [Species.GOLBAT]).setEncounterBgm(TrainerType.ROCKET_GRUNT).setBattleBgm("battle_plasma_grunt").setMixedBattleBgm("battle_rocket_grunt").setVictoryBgm("victory_team_plasma").setPartyTemplateFunc(scene => getEvilGruntPartyTemplate(scene)),
  [TrainerType.PETREL]: new TrainerConfig(++t).setMoneyMultiplier(1.5).initForEvilTeamAdmin("rocket_admin", "rocket", [Species.WEEZING]).setEncounterBgm(TrainerType.ROCKET_GRUNT).setBattleBgm("battle_plasma_grunt").setMixedBattleBgm("battle_rocket_grunt").setVictoryBgm("victory_team_plasma").setPartyTemplateFunc(scene => getEvilGruntPartyTemplate(scene)),
  [TrainerType.BROCK]: new TrainerConfig((t = TrainerType.BROCK)).initForGymLeader(signatureSpecies["BROCK"], true, Type.ROCK).setBattleBgm("battle_kanto_gym").setMixedBattleBgm("battle_kanto_gym"),
  [TrainerType.MISTY]: new TrainerConfig(++t).initForGymLeader(signatureSpecies["MISTY"], false, Type.WATER).setBattleBgm("battle_kanto_gym").setMixedBattleBgm("battle_kanto_gym"),
  [TrainerType.LT_SURGE]: new TrainerConfig(++t).initForGymLeader(signatureSpecies["LT_SURGE"], true, Type.ELECTRIC).setBattleBgm("battle_kanto_gym").setMixedBattleBgm("battle_kanto_gym"),
  [TrainerType.ERIKA]: new TrainerConfig(++t).initForGymLeader(signatureSpecies["ERIKA"], false, Type.GRASS).setBattleBgm("battle_kanto_gym").setMixedBattleBgm("battle_kanto_gym"),
  [TrainerType.JANINE]: new TrainerConfig(++t).initForGymLeader(signatureSpecies["JANINE"], false, Type.POISON).setBattleBgm("battle_kanto_gym").setMixedBattleBgm("battle_kanto_gym"),
  [TrainerType.SABRINA]: new TrainerConfig(++t).initForGymLeader(signatureSpecies["SABRINA"], false, Type.PSYCHIC).setBattleBgm("battle_kanto_gym").setMixedBattleBgm("battle_kanto_gym"),
  [TrainerType.BLAINE]: new TrainerConfig(++t).initForGymLeader(signatureSpecies["BLAINE"], true, Type.FIRE).setBattleBgm("battle_kanto_gym").setMixedBattleBgm("battle_kanto_gym"),
  [TrainerType.GIOVANNI]: new TrainerConfig(++t).initForGymLeader(signatureSpecies["GIOVANNI"], true, Type.GROUND).setBattleBgm("battle_kanto_gym").setMixedBattleBgm("battle_kanto_gym"),
  [TrainerType.LORELEI]: new TrainerConfig((t = TrainerType.LORELEI)).initForEliteFour(signatureSpecies["LORELEI"], false, Type.ICE).setBattleBgm("battle_kanto_gym").setMixedBattleBgm("battle_kanto_gym"),
  [TrainerType.BRUNO]: new TrainerConfig(++t).initForEliteFour(signatureSpecies["BRUNO"], true, Type.FIGHTING).setBattleBgm("battle_kanto_gym").setMixedBattleBgm("battle_kanto_gym"),
  [TrainerType.AGATHA]: new TrainerConfig(++t).initForEliteFour(signatureSpecies["AGATHA"], false, Type.GHOST).setBattleBgm("battle_kanto_gym").setMixedBattleBgm("battle_kanto_gym"),
  [TrainerType.LANCE]: new TrainerConfig(++t).setName("Lance").initForEliteFour(signatureSpecies["LANCE"], true, Type.DRAGON).setBattleBgm("battle_kanto_gym").setMixedBattleBgm("battle_kanto_gym"),
  [TrainerType.BLUE]: new TrainerConfig((t = TrainerType.BLUE)).initForChampion(signatureSpecies["BLUE"], true).setBattleBgm("battle_kanto_champion").setMixedBattleBgm("battle_kanto_champion").setHasDouble("blue_red_double").setDoubleTrainerType(TrainerType.RED).setDoubleTitle("champion_double")
    .setPartyMemberFunc(0, getRandomPartyMemberFunc([Species.ALAKAZAM], TrainerSlot.TRAINER, true, p => {
      p.generateAndPopulateMoveset();
    }))
    .setPartyMemberFunc(1, getRandomPartyMemberFunc([Species.PIDGEOT], TrainerSlot.TRAINER, true, p => {
      p.formIndex = 1;
      p.generateAndPopulateMoveset();
      p.generateName();
    })),
  [TrainerType.RED]: new TrainerConfig(++t).initForChampion(signatureSpecies["RED"], true).setBattleBgm("battle_johto_champion").setMixedBattleBgm("battle_johto_champion").setHasDouble("red_blue_double").setDoubleTrainerType(TrainerType.BLUE).setDoubleTitle("champion_double")
    .setPartyMemberFunc(0, getRandomPartyMemberFunc([Species.PIKACHU], TrainerSlot.TRAINER, true, p => {
      p.formIndex = 8;
      p.generateAndPopulateMoveset();
      p.generateName();
    }))
    .setPartyMemberFunc(1, getRandomPartyMemberFunc([Species.VENUSAUR, Species.CHARIZARD, Species.BLASTOISE], TrainerSlot.TRAINER, true, p => {
      p.formIndex = 1;
      p.generateAndPopulateMoveset();
      p.generateName();
    })),
  [TrainerType.RIVAL]: new TrainerConfig((t = TrainerType.RIVAL)).setName("Finn").setHasGenders("Ivy").setHasCharSprite().setTitle("Rival").setStaticParty().setEncounterBgm(TrainerType.RIVAL).setBattleBgm("battle_rival").setMixedBattleBgm("battle_rival").setPartyTemplates(trainerPartyTemplates.RIVAL)
    .setModifierRewardFuncs(() => modifierTypes.SUPER_EXP_CHARM, () => modifierTypes.EXP_SHARE)
    .setPartyMemberFunc(0, getRandomPartyMemberFunc([Species.BULBASAUR, Species.CHARMANDER, Species.SQUIRTLE], TrainerSlot.TRAINER, true))
    .setPartyMemberFunc(1, getRandomPartyMemberFunc([Species.PIDGEY], TrainerSlot.TRAINER, true)),
  [TrainerType.RIVAL_2]: new TrainerConfig(++t).setName("Finn").setHasGenders("Ivy").setHasCharSprite().setTitle("Rival").setStaticParty().setMoneyMultiplier(1.25).setEncounterBgm(TrainerType.RIVAL).setBattleBgm("battle_rival").setMixedBattleBgm("battle_rival").setPartyTemplates(trainerPartyTemplates.RIVAL_2)
    .setModifierRewardFuncs(() => modifierTypes.EXP_SHARE)
    .setPartyMemberFunc(0, getRandomPartyMemberFunc([Species.IVYSAUR, Species.CHARMELEON, Species.WARTORTLE], TrainerSlot.TRAINER, true))
    .setPartyMemberFunc(1, getRandomPartyMemberFunc([Species.PIDGEOTTO], TrainerSlot.TRAINER, true))
    .setPartyMemberFunc(2, getSpeciesFilterRandomPartyMemberFunc((species: PokemonSpecies) => !pokemonEvolutions.hasOwnProperty(species.speciesId) && !pokemonPrevolutions.hasOwnProperty(species.speciesId) && species.baseTotal >= 450)),
  [TrainerType.RIVAL_3]: new TrainerConfig(++t).setName("Finn").setHasGenders("Ivy").setHasCharSprite().setTitle("Rival").setStaticParty().setMoneyMultiplier(1.5).setEncounterBgm(TrainerType.RIVAL).setBattleBgm("battle_rival").setMixedBattleBgm("battle_rival").setPartyTemplates(trainerPartyTemplates.RIVAL_3)
    .setPartyMemberFunc(0, getRandomPartyMemberFunc([Species.VENUSAUR, Species.CHARIZARD, Species.BLASTOISE], TrainerSlot.TRAINER, true))
    .setPartyMemberFunc(1, getRandomPartyMemberFunc([Species.PIDGEOT], TrainerSlot.TRAINER, true))
    .setPartyMemberFunc(2, getSpeciesFilterRandomPartyMemberFunc((species: PokemonSpecies) => !pokemonEvolutions.hasOwnProperty(species.speciesId) && !pokemonPrevolutions.hasOwnProperty(species.speciesId) && species.baseTotal >= 450))
    .setSpeciesFilter(species => species.baseTotal >= 540),
  [TrainerType.RIVAL_4]: new TrainerConfig(++t).setName("Finn").setHasGenders("Ivy").setHasCharSprite().setTitle("Rival").setBoss().setStaticParty().setMoneyMultiplier(1.75).setEncounterBgm(TrainerType.RIVAL).setBattleBgm("battle_rival_2").setMixedBattleBgm("battle_rival_2").setPartyTemplates(trainerPartyTemplates.RIVAL_4)
    .setPartyMemberFunc(0, getRandomPartyMemberFunc([Species.VENUSAUR, Species.CHARIZARD, Species.BLASTOISE], TrainerSlot.TRAINER, true))
    .setPartyMemberFunc(1, getRandomPartyMemberFunc([Species.PIDGEOT], TrainerSlot.TRAINER, true))
    .setPartyMemberFunc(2, getSpeciesFilterRandomPartyMemberFunc((species: PokemonSpecies) => !pokemonEvolutions.hasOwnProperty(species.speciesId) && !pokemonPrevolutions.hasOwnProperty(species.speciesId) && species.baseTotal >= 450))
    .setSpeciesFilter(species => species.baseTotal >= 540)
    .setGenModifiersFunc(party => {
      const starter = party[0];
      return [modifierTypes.TERA_SHARD().generateType([], [starter.species.type1])!.withIdFromFunc(modifierTypes.TERA_SHARD).newModifier(starter) as PersistentModifier]; // TODO: is the bang correct?
    }),
  [TrainerType.RIVAL_5]: new TrainerConfig(++t).setName("Finn").setHasGenders("Ivy").setHasCharSprite().setTitle("Rival").setBoss().setStaticParty().setMoneyMultiplier(2.25).setEncounterBgm(TrainerType.RIVAL).setBattleBgm("battle_rival_3").setMixedBattleBgm("battle_rival_3").setPartyTemplates(trainerPartyTemplates.RIVAL_5)
    .setPartyMemberFunc(0, getRandomPartyMemberFunc([Species.VENUSAUR, Species.CHARIZARD, Species.BLASTOISE], TrainerSlot.TRAINER, true,
      p => p.setBoss(true, 2)))
    .setPartyMemberFunc(1, getRandomPartyMemberFunc([Species.PIDGEOT], TrainerSlot.TRAINER, true))
    .setPartyMemberFunc(2, getSpeciesFilterRandomPartyMemberFunc((species: PokemonSpecies) => !pokemonEvolutions.hasOwnProperty(species.speciesId) && !pokemonPrevolutions.hasOwnProperty(species.speciesId) && species.baseTotal >= 450))
    .setSpeciesFilter(species => species.baseTotal >= 540)
    .setPartyMemberFunc(5, getRandomPartyMemberFunc([Species.MEWTWO], TrainerSlot.TRAINER, true, p => {
      p.setBoss(true, 3);
      p.pokeball = PokeballType.MASTER_BALL;
      p.shiny = true;
      p.variant = 1;
    }))
    .setGenModifiersFunc(party => {
      const starter = party[0];
      return [modifierTypes.TERA_SHARD().generateType([], [starter.species.type1])!.withIdFromFunc(modifierTypes.TERA_SHARD).newModifier(starter) as PersistentModifier]; //TODO: is the bang correct?
    }),
  [TrainerType.RIVAL_6]: new TrainerConfig(++t).setName("Finn").setHasGenders("Ivy").setHasCharSprite().setTitle("Rival").setBoss().setStaticParty().setMoneyMultiplier(3).setEncounterBgm("final").setBattleBgm("battle_rival_3").setMixedBattleBgm("battle_rival_3").setPartyTemplates(trainerPartyTemplates.RIVAL_6)
    .setPartyMemberFunc(0, getRandomPartyMemberFunc([Species.VENUSAUR, Species.CHARIZARD, Species.BLASTOISE], TrainerSlot.TRAINER, true,
      p => {
        p.setBoss(true, 3);
        p.generateAndPopulateMoveset();
      }))
    .setPartyMemberFunc(1, getRandomPartyMemberFunc([Species.PIDGEOT], TrainerSlot.TRAINER, true,
      p => {
        p.setBoss(true, 2);
        p.generateAndPopulateMoveset();
      }))
    .setPartyMemberFunc(2, getSpeciesFilterRandomPartyMemberFunc((species: PokemonSpecies) => !pokemonEvolutions.hasOwnProperty(species.speciesId) && !pokemonPrevolutions.hasOwnProperty(species.speciesId) && species.baseTotal >= 450))
    .setSpeciesFilter(species => species.baseTotal >= 540)
    .setPartyMemberFunc(5, getRandomPartyMemberFunc([Species.MEWTWO], TrainerSlot.TRAINER, true, p => {
      p.setBoss();
      p.generateAndPopulateMoveset();
      p.pokeball = PokeballType.MASTER_BALL;
      p.shiny = true;
      p.variant = 1;
      p.formIndex = 1;
      p.generateName();
    }))
    .setGenModifiersFunc(party => {
      const starter = party[0];
      return [modifierTypes.TERA_SHARD().generateType([], [starter.species.type1])!.withIdFromFunc(modifierTypes.TERA_SHARD).newModifier(starter) as PersistentModifier]; // TODO: is the bang correct?
    }),

  [TrainerType.ROCKET_BOSS_GIOVANNI_1]: new TrainerConfig(t = TrainerType.ROCKET_BOSS_GIOVANNI_1).setName("Giovanni").initForEvilTeamLeader("Rocket Boss", []).setMixedBattleBgm("battle_rocket_boss").setVictoryBgm("victory_team_plasma")
    .setPartyMemberFunc(0, getRandomPartyMemberFunc([Species.PERSIAN]))
    .setPartyMemberFunc(1, getRandomPartyMemberFunc([Species.NIDOKING, Species.NIDOQUEEN]))
    .setPartyMemberFunc(2, getRandomPartyMemberFunc([Species.RHYDON]))
    .setPartyMemberFunc(3, getRandomPartyMemberFunc([Species.DUGTRIO]))
    .setPartyMemberFunc(4, getRandomPartyMemberFunc([Species.MAROWAK]))
    .setPartyMemberFunc(5, getRandomPartyMemberFunc([Species.KANGASKHAN], TrainerSlot.TRAINER, true, p => {
      p.setBoss(true, 2);
      p.generateAndPopulateMoveset();
      p.pokeball = PokeballType.ULTRA_BALL;
      p.formIndex = 1;
      p.generateName();
    })),
  [TrainerType.ROCKET_BOSS_GIOVANNI_2]: new TrainerConfig(++t).setName("Giovanni").initForEvilTeamLeader("Rocket Boss", [], true).setMixedBattleBgm("battle_rocket_boss").setVictoryBgm("victory_team_plasma")
    .setPartyMemberFunc(0, getRandomPartyMemberFunc([Species.RHYDON], TrainerSlot.TRAINER, true, p => {
      p.setBoss(true, 2);
      p.generateAndPopulateMoveset();
      p.pokeball = PokeballType.ULTRA_BALL;
    }))
    .setPartyMemberFunc(1, getRandomPartyMemberFunc([Species.NIDOKING]))
    .setPartyMemberFunc(2, getRandomPartyMemberFunc([Species.NIDOQUEEN]))
    .setPartyMemberFunc(3, getRandomPartyMemberFunc([Species.KANGASKHAN], TrainerSlot.TRAINER, true, p => {
      p.setBoss(true, 2);
      p.generateAndPopulateMoveset();
      p.pokeball = PokeballType.ULTRA_BALL;
      p.formIndex = 1;
      p.generateName();
    }))
    .setPartyMemberFunc(4, getRandomPartyMemberFunc([Species.GOLEM]))
    .setPartyMemberFunc(5, getRandomPartyMemberFunc([Species.MEWTWO], TrainerSlot.TRAINER, true, p => {
      p.setBoss(true, 2);
      p.generateAndPopulateMoveset();
      p.pokeball = PokeballType.MASTER_BALL;
    }))
};
