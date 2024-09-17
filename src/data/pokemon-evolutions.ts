import Pokemon from "../field/pokemon";
import { SpeciesFormKey } from "./pokemon-species";
import { Species } from "#enums/species";

export enum SpeciesWildEvolutionDelay {
  NONE = "NONE",
  SHORT = "SHORT",
  MEDIUM = "MEDIUM",
  LONG = "LONG",
  VERY_LONG = "VERY_LONG",
}

export enum EvolutionItem {
  NONE = "NONE",

  LINKING_CORD = "LINKING_CORD",
  SUN_STONE = "SUN_STONE",
  MOON_STONE = "MOON_STONE",
  LEAF_STONE = "LEAF_STONE",
  FIRE_STONE = "FIRE_STONE",
  WATER_STONE = "WATER_STONE",
  THUNDER_STONE = "THUNDER_STONE",
  ICE_STONE = "ICE_STONE",
  DUSK_STONE = "DUSK_STONE",
  DAWN_STONE = "DAWN_STONE",
  SHINY_STONE = "SHINY_STONE",
  CRACKED_POT = "CRACKED_POT",
  SWEET_APPLE = "SWEET_APPLE",
  TART_APPLE = "TART_APPLE",
  STRAWBERRY_SWEET = "STRAWBERRY_SWEET",
  UNREMARKABLE_TEACUP = "UNREMARKABLE_TEACUP",

  CHIPPED_POT = "CHIPPED_POT",
  BLACK_AUGURITE = "BLACK_AUGURITE",
  GALARICA_CUFF = "GALARICA_CUFF",
  GALARICA_WREATH = "GALARICA_WREATH",
  PEAT_BLOCK = "PEAT_BLOCK",
  AUSPICIOUS_ARMOR = "AUSPICIOUS_ARMOR",
  MALICIOUS_ARMOR = "MALICIOUS_ARMOR",
  MASTERPIECE_TEACUP = "MASTERPIECE_TEACUP",
  METAL_ALLOY = "METAL_ALLOY",
  SCROLL_OF_DARKNESS = "SCROLL_OF_DARKNESS",
  SCROLL_OF_WATERS = "SCROLL_OF_WATERS",
  SYRUPY_APPLE = "SYRUPY_APPLE",
}

/**
 * Pokemon Evolution tuple type consisting of:
 * @property 0 {@linkcode Species} The species of the Pokemon.
 * @property 1 {@linkcode integer} The level at which the Pokemon evolves.
 */
export type EvolutionLevel = [species: Species, level: integer];

export type EvolutionConditionPredicate = (p: Pokemon) => boolean;
export type EvolutionConditionEnforceFunc = (p: Pokemon) => void;

export class SpeciesFormEvolution {
  public speciesId: Species;
  public preFormKey: string | null;
  public evoFormKey: string | null;
  public level: integer;
  public item: EvolutionItem | null;
  public condition: SpeciesEvolutionCondition | null;
  public wildDelay: SpeciesWildEvolutionDelay;

  constructor(speciesId: Species, preFormKey: string | null, evoFormKey: string | null, level: integer, item: EvolutionItem | null, condition: SpeciesEvolutionCondition | null, wildDelay?: SpeciesWildEvolutionDelay) {
    this.speciesId = speciesId;
    this.preFormKey = preFormKey;
    this.evoFormKey = evoFormKey;
    this.level = level;
    this.item = item || EvolutionItem.NONE;
    this.condition = condition;
    this.wildDelay = wildDelay ?? SpeciesWildEvolutionDelay.NONE;
  }
}

export class SpeciesEvolution extends SpeciesFormEvolution {
  constructor(speciesId: Species, level: integer, item: EvolutionItem | null, condition: SpeciesEvolutionCondition | null, wildDelay?: SpeciesWildEvolutionDelay) {
    super(speciesId, null, null, level, item, condition, wildDelay);
  }
}

export class FusionSpeciesFormEvolution extends SpeciesFormEvolution {
  public primarySpeciesId: Species;

  constructor(primarySpeciesId: Species, evolution: SpeciesFormEvolution) {
    super(evolution.speciesId, evolution.preFormKey, evolution.evoFormKey, evolution.level, evolution.item, evolution.condition, evolution.wildDelay);

    this.primarySpeciesId = primarySpeciesId;
  }
}

export class SpeciesEvolutionCondition {
  public predicate: EvolutionConditionPredicate;
  public enforceFunc: EvolutionConditionEnforceFunc | undefined;

  constructor(predicate: EvolutionConditionPredicate, enforceFunc?: EvolutionConditionEnforceFunc) {
    this.predicate = predicate;
    this.enforceFunc = enforceFunc;
  }
}

export class SpeciesFriendshipEvolutionCondition extends SpeciesEvolutionCondition {
  constructor(friendshipAmount: integer, predicate?: EvolutionConditionPredicate, enforceFunc?: EvolutionConditionEnforceFunc) {
    super(p => p.friendship >= friendshipAmount && (!predicate || predicate(p)), enforceFunc);
  }
}

interface PokemonEvolutions {
  [key: string]: SpeciesFormEvolution[]
}

export const pokemonEvolutions: PokemonEvolutions = {
  [Species.BULBASAUR]: [
    new SpeciesEvolution(Species.IVYSAUR, 16, null, null)
  ],
  [Species.IVYSAUR]: [
    new SpeciesEvolution(Species.VENUSAUR, 32, null, null)
  ],
  [Species.CHARMANDER]: [
    new SpeciesEvolution(Species.CHARMELEON, 16, null, null)
  ],
  [Species.CHARMELEON]: [
    new SpeciesEvolution(Species.CHARIZARD, 36, null, null)
  ],
  [Species.SQUIRTLE]: [
    new SpeciesEvolution(Species.WARTORTLE, 16, null, null)
  ],
  [Species.WARTORTLE]: [
    new SpeciesEvolution(Species.BLASTOISE, 36, null, null)
  ],
  [Species.CATERPIE]: [
    new SpeciesEvolution(Species.METAPOD, 7, null, null)
  ],
  [Species.METAPOD]: [
    new SpeciesEvolution(Species.BUTTERFREE, 10, null, null)
  ],
  [Species.WEEDLE]: [
    new SpeciesEvolution(Species.KAKUNA, 7, null, null)
  ],
  [Species.KAKUNA]: [
    new SpeciesEvolution(Species.BEEDRILL, 10, null, null)
  ],
  [Species.PIDGEY]: [
    new SpeciesEvolution(Species.PIDGEOTTO, 18, null, null)
  ],
  [Species.PIDGEOTTO]: [
    new SpeciesEvolution(Species.PIDGEOT, 36, null, null)
  ],
  [Species.RATTATA]: [
    new SpeciesEvolution(Species.RATICATE, 20, null, null)
  ],
  [Species.SPEAROW]: [
    new SpeciesEvolution(Species.FEAROW, 20, null, null)
  ],
  [Species.EKANS]: [
    new SpeciesEvolution(Species.ARBOK, 22, null, null)
  ],
  [Species.SANDSHREW]: [
    new SpeciesEvolution(Species.SANDSLASH, 22, null, null)
  ],
  [Species.NIDORAN_F]: [
    new SpeciesEvolution(Species.NIDORINA, 16, null, null)
  ],
  [Species.NIDORAN_M]: [
    new SpeciesEvolution(Species.NIDORINO, 16, null, null)
  ],
  [Species.ZUBAT]: [
    new SpeciesEvolution(Species.GOLBAT, 22, null, null)
  ],
  [Species.ODDISH]: [
    new SpeciesEvolution(Species.GLOOM, 21, null, null)
  ],
  [Species.PARAS]: [
    new SpeciesEvolution(Species.PARASECT, 24, null, null)
  ],
  [Species.VENONAT]: [
    new SpeciesEvolution(Species.VENOMOTH, 31, null, null)
  ],
  [Species.DIGLETT]: [
    new SpeciesEvolution(Species.DUGTRIO, 26, null, null)
  ],
  [Species.MEOWTH]: [
    new SpeciesFormEvolution(Species.PERSIAN, "", "", 28, null, null)
  ],
  [Species.PSYDUCK]: [
    new SpeciesEvolution(Species.GOLDUCK, 33, null, null)
  ],
  [Species.MANKEY]: [
    new SpeciesEvolution(Species.PRIMEAPE, 28, null, null)
  ],
  [Species.POLIWAG]: [
    new SpeciesEvolution(Species.POLIWHIRL, 25, null, null)
  ],
  [Species.ABRA]: [
    new SpeciesEvolution(Species.KADABRA, 16, null, null)
  ],
  [Species.MACHOP]: [
    new SpeciesEvolution(Species.MACHOKE, 28, null, null)
  ],
  [Species.BELLSPROUT]: [
    new SpeciesEvolution(Species.WEEPINBELL, 21, null, null)
  ],
  [Species.TENTACOOL]: [
    new SpeciesEvolution(Species.TENTACRUEL, 30, null, null)
  ],
  [Species.GEODUDE]: [
    new SpeciesEvolution(Species.GRAVELER, 25, null, null)
  ],
  [Species.PONYTA]: [
    new SpeciesEvolution(Species.RAPIDASH, 40, null, null)
  ],
  [Species.SLOWPOKE]: [
    new SpeciesEvolution(Species.SLOWBRO, 37, null, null),
  ],
  [Species.MAGNEMITE]: [
    new SpeciesEvolution(Species.MAGNETON, 30, null, null)
  ],
  [Species.DODUO]: [
    new SpeciesEvolution(Species.DODRIO, 31, null, null)
  ],
  [Species.SEEL]: [
    new SpeciesEvolution(Species.DEWGONG, 34, null, null)
  ],
  [Species.GRIMER]: [
    new SpeciesEvolution(Species.MUK, 38, null, null)
  ],
  [Species.GASTLY]: [
    new SpeciesEvolution(Species.HAUNTER, 25, null, null)
  ],
  [Species.DROWZEE]: [
    new SpeciesEvolution(Species.HYPNO, 26, null, null)
  ],
  [Species.KRABBY]: [
    new SpeciesEvolution(Species.KINGLER, 28, null, null)
  ],
  [Species.VOLTORB]: [
    new SpeciesEvolution(Species.ELECTRODE, 30, null, null)
  ],
  [Species.CUBONE]: [
    new SpeciesEvolution(Species.MAROWAK, 28, null, null)
  ],
  [Species.KOFFING]: [
    new SpeciesEvolution(Species.WEEZING, 35, null, null)
  ],
  [Species.RHYHORN]: [
    new SpeciesEvolution(Species.RHYDON, 42, null, null)
  ],
  [Species.HORSEA]: [
    new SpeciesEvolution(Species.SEADRA, 32, null, null)
  ],
  [Species.GOLDEEN]: [
    new SpeciesEvolution(Species.SEAKING, 33, null, null)
  ],
  [Species.MAGIKARP]: [
    new SpeciesEvolution(Species.GYARADOS, 20, null, null)
  ],
  [Species.OMANYTE]: [
    new SpeciesEvolution(Species.OMASTAR, 40, null, null)
  ],
  [Species.KABUTO]: [
    new SpeciesEvolution(Species.KABUTOPS, 40, null, null)
  ],
  [Species.DRATINI]: [
    new SpeciesEvolution(Species.DRAGONAIR, 30, null, null)
  ],
  [Species.DRAGONAIR]: [
    new SpeciesEvolution(Species.DRAGONITE, 55, null, null)
  ],
};

interface PokemonPrevolutions {
  [key: string]: Species
}

export const pokemonPrevolutions: PokemonPrevolutions = {};

export function initPokemonPrevolutions(): void {
  const megaFormKeys = [ SpeciesFormKey.MEGA, "", SpeciesFormKey.MEGA_X, "", SpeciesFormKey.MEGA_Y ].map(sfk => sfk as string);
  const prevolutionKeys = Object.keys(pokemonEvolutions);
  prevolutionKeys.forEach(pk => {
    const evolutions = pokemonEvolutions[pk];
    for (const ev of evolutions) {
      if (ev.evoFormKey && megaFormKeys.indexOf(ev.evoFormKey) > -1) {
        continue;
      }
      pokemonPrevolutions[ev.speciesId] = parseInt(pk) as Species;
    }
  });
}
