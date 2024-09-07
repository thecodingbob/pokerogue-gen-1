import { Type } from "./type";
import * as Utils from "../utils";
import { pokemonEvolutions, SpeciesFormEvolution } from "./pokemon-evolutions";
import i18next from "i18next";
import { Biome } from "#enums/biome";
import { Species } from "#enums/species";
import { TimeOfDay } from "#enums/time-of-day";
import { TrainerType } from "#enums/trainer-type";
// import beautify from "json-beautify";

export function getBiomeName(biome: Biome | -1) {
  if (biome === -1) {
    return i18next.t("biome:unknownLocation");
  }
  switch (biome) {
  case Biome.GRASS:
    return i18next.t("biome:GRASS");
  case Biome.RUINS:
    return i18next.t("biome:RUINS");
  case Biome.END:
    return i18next.t("biome:END");
  default:
    return i18next.t(`biome:${Biome[biome].toUpperCase()}`);
  }
}

interface BiomeLinks {
  [key: integer]: Biome | (Biome | [Biome, integer])[]
}

interface BiomeDepths {
  [key: integer]: [integer, integer]
}

export const biomeLinks: BiomeLinks = {
  [Biome.TOWN]: Biome.PLAINS,
  [Biome.PLAINS]: [ Biome.GRASS, Biome.METROPOLIS, Biome.LAKE ],
  [Biome.GRASS]: Biome.TALL_GRASS,
  [Biome.TALL_GRASS]: [ Biome.FOREST, Biome.CAVE ],
  [Biome.SLUM]: [ Biome.CONSTRUCTION_SITE, [ Biome.SWAMP, 2 ] ],
  [Biome.FOREST]: [ Biome.JUNGLE, Biome.MEADOW ],
  [Biome.SEA]: [ Biome.SEABED, Biome.ICE_CAVE ],
  [Biome.SWAMP]: [ Biome.GRAVEYARD, Biome.TALL_GRASS ],
  [Biome.BEACH]: [ Biome.SEA, [ Biome.ISLAND, 2 ] ],
  [Biome.LAKE]: [ Biome.BEACH, Biome.SWAMP, Biome.CONSTRUCTION_SITE ],
  [Biome.SEABED]: [ Biome.CAVE, [ Biome.VOLCANO, 3 ] ],
  [Biome.MOUNTAIN]: [ Biome.VOLCANO, [ Biome.WASTELAND, 2 ], [ Biome.SPACE, 3 ] ],
  [Biome.BADLANDS]: [ Biome.DESERT, Biome.MOUNTAIN ],
  [Biome.CAVE]: [ Biome.BADLANDS, Biome.LAKE, [ Biome.LABORATORY, 2 ] ],
  [Biome.DESERT]: [ Biome.RUINS, [ Biome.CONSTRUCTION_SITE, 2 ] ],
  [Biome.ICE_CAVE]: Biome.SNOWY_FOREST,
  [Biome.MEADOW]: [ Biome.PLAINS, Biome.FAIRY_CAVE ],
  [Biome.POWER_PLANT]: Biome.FACTORY,
  [Biome.VOLCANO]: [ Biome.BEACH, [ Biome.ICE_CAVE, 3 ] ],
  [Biome.GRAVEYARD]: Biome.ABYSS,
  [Biome.DOJO]: [ Biome.PLAINS, [ Biome.JUNGLE, 2], [ Biome.TEMPLE, 2 ] ],
  [Biome.FACTORY]: [ Biome.PLAINS, [ Biome.LABORATORY, 2 ] ],
  [Biome.RUINS]: [ Biome.MOUNTAIN, [ Biome.FOREST, 2 ] ],
  [Biome.WASTELAND]: Biome.BADLANDS,
  [Biome.ABYSS]: [ Biome.CAVE, [ Biome.SPACE, 2 ], [ Biome.WASTELAND, 2 ] ],
  [Biome.SPACE]: Biome.RUINS,
  [Biome.CONSTRUCTION_SITE]: [ Biome.POWER_PLANT, [ Biome.DOJO, 2 ] ],
  [Biome.JUNGLE]: [ Biome.TEMPLE ],
  [Biome.FAIRY_CAVE]: [ Biome.ICE_CAVE, [ Biome.SPACE, 2 ] ],
  [Biome.TEMPLE]: [ Biome.DESERT, [ Biome.SWAMP, 2 ], [ Biome.RUINS, 2 ] ],
  [Biome.METROPOLIS]: Biome.SLUM,
  [Biome.SNOWY_FOREST]: [ Biome.FOREST, [ Biome.MOUNTAIN, 2 ], [ Biome.LAKE, 2 ] ],
  [Biome.ISLAND]: Biome.SEA,
  [Biome.LABORATORY]: Biome.CONSTRUCTION_SITE
};

export const biomeDepths: BiomeDepths = {};

export enum BiomePoolTier {
  COMMON,
  UNCOMMON,
  RARE,
  SUPER_RARE,
  ULTRA_RARE,
  BOSS,
  BOSS_RARE,
  BOSS_SUPER_RARE,
  BOSS_ULTRA_RARE
}

export const uncatchableSpecies: Species[] = [];

export interface SpeciesTree {
  [key: integer]: Species[]
}

export interface PokemonPools {
  [key: integer]: (Species | SpeciesTree)[]
}

export interface BiomeTierPokemonPools {
  [key: integer]: PokemonPools
}

export interface BiomePokemonPools {
  [key: integer]: BiomeTierPokemonPools
}

export interface BiomeTierTrainerPools {
  [key: integer]: TrainerType[]
}

export interface BiomeTrainerPools {
  [key: integer]: BiomeTierTrainerPools
}

export const biomePokemonPools: BiomePokemonPools = {
  [Biome.TOWN]: {
    [BiomePoolTier.COMMON]: {
      [TimeOfDay.DAWN]: [
        { 1: [ Species.CATERPIE ], 7: [ Species.METAPOD ] }],
      [TimeOfDay.DAY]: [
        { 1: [ Species.CATERPIE ], 7: [ Species.METAPOD ] }],
      [TimeOfDay.DUSK]: [ { 1: [ Species.WEEDLE ], 7: [ Species.KAKUNA ] }],
      [TimeOfDay.NIGHT]: [ { 1: [ Species.WEEDLE ], 7: [ Species.KAKUNA ] }],
      [TimeOfDay.ALL]: [ Species.PIDGEY, Species.RATTATA, Species.SPEAROW ]
    },
    [BiomePoolTier.UNCOMMON]: {
      [TimeOfDay.DAWN]: [ Species.BELLSPROUT],
      [TimeOfDay.DAY]: [ Species.NIDORAN_F, Species.NIDORAN_M, Species.BELLSPROUT ],
      [TimeOfDay.DUSK]: [ Species.EKANS, Species.ODDISH, Species.MEOWTH ],
      [TimeOfDay.NIGHT]: [ Species.EKANS, Species.ODDISH, Species.PARAS, Species.VENONAT, Species.MEOWTH],
      [TimeOfDay.ALL]: []
    },
    [BiomePoolTier.RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ Species.ABRA ] },
    [BiomePoolTier.SUPER_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ Species.EEVEE ] },
    [BiomePoolTier.ULTRA_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ Species.DITTO ] },
    [BiomePoolTier.BOSS]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [] },
    [BiomePoolTier.BOSS_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [] },
    [BiomePoolTier.BOSS_SUPER_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [] },
    [BiomePoolTier.BOSS_ULTRA_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [] }
  },
  [Biome.PLAINS]: {
    [BiomePoolTier.COMMON]: {
      [TimeOfDay.DAWN]: [],
      [TimeOfDay.DAY]: [],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [ { 1: [ Species.ZUBAT ], 22: [ Species.GOLBAT ] }, { 1: [ Species.MEOWTH ], 28: [ Species.PERSIAN ] }],
      [TimeOfDay.ALL]: [ { 1: [ Species.MEOWTH ], 28: [ Species.PERSIAN ] } ]
    },
    [BiomePoolTier.UNCOMMON]: {
      [TimeOfDay.DAWN]: [
        { 1: [ Species.DODUO ], 31: [ Species.DODRIO ] }
      ],
      [TimeOfDay.DAY]: [
        { 1: [ Species.DODUO ], 31: [ Species.DODRIO ] }
      ],
      [TimeOfDay.DUSK]: [ { 1: [ Species.MANKEY ], 28: [ Species.PRIMEAPE ] } ],
      [TimeOfDay.NIGHT]: [ { 1: [ Species.MANKEY ], 28: [ Species.PRIMEAPE ] } ],
      [TimeOfDay.ALL]: [
        { 1: [ Species.PIDGEY ], 18: [ Species.PIDGEOTTO ], 36: [ Species.PIDGEOT ] },
        { 1: [ Species.SPEAROW ], 20: [ Species.FEAROW ] },
        Species.PIKACHU]
    },
    [BiomePoolTier.RARE]: {
      [TimeOfDay.ALL]: [ { 1: [ Species.ABRA ], 16: [ Species.KADABRA ] } ]
    },
    [BiomePoolTier.SUPER_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ Species.FARFETCHD, Species.LICKITUNG, Species.CHANSEY, Species.EEVEE, Species.SNORLAX ] },
    [BiomePoolTier.ULTRA_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ Species.DITTO ] },
    [BiomePoolTier.BOSS]: {
      [TimeOfDay.DAWN]: [ Species.DODRIO ],
      [TimeOfDay.DAY]: [ Species.DODRIO ],
      [TimeOfDay.DUSK]: [ Species.PERSIAN ],
      [TimeOfDay.NIGHT]: [ Species.PERSIAN ],
      [TimeOfDay.ALL]: []
    },
    [BiomePoolTier.BOSS_RARE]: {
      [TimeOfDay.DAWN]: [],
      [TimeOfDay.DAY]: [],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [],
      [TimeOfDay.ALL]: [ Species.FARFETCHD, Species.SNORLAX ]
    },
    [BiomePoolTier.BOSS_SUPER_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [] },
    [BiomePoolTier.BOSS_ULTRA_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [] }
  },
  [Biome.GRASS]: {
    [BiomePoolTier.COMMON]: {
      [TimeOfDay.DAWN]: [],
      [TimeOfDay.DAY]: [],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [],
      [TimeOfDay.ALL]: [ Species.ODDISH ]
    },
    [BiomePoolTier.UNCOMMON]: {
      [TimeOfDay.DAWN]: [],
      [TimeOfDay.DAY]: [],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [ Species.PARAS ],
      [TimeOfDay.ALL]: []
    },
    [BiomePoolTier.RARE]: {
      [TimeOfDay.DAWN]: [],
      [TimeOfDay.DAY]: [],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [],
      [TimeOfDay.ALL]: [ { 1: [ Species.BULBASAUR ], 16: [ Species.IVYSAUR ], 32: [ Species.VENUSAUR ] }, Species.GROWLITHE ]
    },
    [BiomePoolTier.SUPER_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [] },
    [BiomePoolTier.ULTRA_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]:  [] },
    [BiomePoolTier.BOSS]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [] },
    [BiomePoolTier.BOSS_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ Species.VENUSAUR ] },
    [BiomePoolTier.BOSS_SUPER_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [] },
    [BiomePoolTier.BOSS_ULTRA_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [] }
  },
  [Biome.TALL_GRASS]: {
    [BiomePoolTier.COMMON]: {
      [TimeOfDay.DAWN]: [],
      [TimeOfDay.DAY]: [ { 1: [ Species.NIDORAN_F ], 16: [ Species.NIDORINA ] }, { 1: [ Species.NIDORAN_M ], 16: [ Species.NIDORINO ] } ],
      [TimeOfDay.DUSK]: [ { 1: [ Species.ODDISH ], 21: [ Species.GLOOM ] }],
      [TimeOfDay.NIGHT]: [ { 1: [ Species.ODDISH ], 21: [ Species.GLOOM ] }],
      [TimeOfDay.ALL]: []
    },
    [BiomePoolTier.UNCOMMON]: {
      [TimeOfDay.DAWN]: [],
      [TimeOfDay.DAY]: [],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [ { 1: [ Species.PARAS ], 24: [ Species.PARASECT ] }, { 1: [ Species.VENONAT ], 31: [ Species.VENOMOTH ] }],
      [TimeOfDay.ALL]: [ Species.VULPIX ]
    },
    [BiomePoolTier.RARE]: {
      [TimeOfDay.DAWN]: [],
      [TimeOfDay.DAY]: [],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [],
      [TimeOfDay.ALL]: [ Species.PINSIR ]
    },
    [BiomePoolTier.SUPER_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ Species.SCYTHER ] },
    [BiomePoolTier.ULTRA_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [] },
    [BiomePoolTier.BOSS]: {
      [TimeOfDay.DAWN]:  [],
      [TimeOfDay.DAY]: [ Species.NIDOQUEEN, Species.NIDOKING ],
      [TimeOfDay.DUSK]: [ Species.VILEPLUME],
      [TimeOfDay.NIGHT]: [ Species.VILEPLUME],
      [TimeOfDay.ALL]: []
    },
    [BiomePoolTier.BOSS_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ Species.PINSIR] },
    [BiomePoolTier.BOSS_SUPER_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [] },
    [BiomePoolTier.BOSS_ULTRA_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [] }
  },
  [Biome.METROPOLIS]: {
    [BiomePoolTier.COMMON]: {
      [TimeOfDay.DAWN]: [],
      [TimeOfDay.DAY]: [],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [],
      [TimeOfDay.ALL]: [ { 1: [ Species.RATTATA ], 20: [ Species.RATICATE ] } ]
    },
    [BiomePoolTier.UNCOMMON]: {
      [TimeOfDay.DAWN]: [],
      [TimeOfDay.DAY]: [],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [],
      [TimeOfDay.ALL]: [ Species.PIKACHU ]
    },
    [BiomePoolTier.RARE]: {
      [TimeOfDay.DAWN]: [],
      [TimeOfDay.DAY]: [],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [],
      [TimeOfDay.ALL]: []
    },
    [BiomePoolTier.SUPER_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ Species.DITTO, Species.EEVEE ] },
    [BiomePoolTier.ULTRA_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [] },
    [BiomePoolTier.BOSS]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [] },
    [BiomePoolTier.BOSS_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [] },
    [BiomePoolTier.BOSS_SUPER_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [] },
    [BiomePoolTier.BOSS_ULTRA_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [] }
  },
  [Biome.FOREST]: {
    [BiomePoolTier.COMMON]: {
      [TimeOfDay.DAWN]: [
        Species.BUTTERFREE,
        { 1: [ Species.BELLSPROUT ], 21: [ Species.WEEPINBELL ] }
      ],
      [TimeOfDay.DAY]: [
        Species.BUTTERFREE,
        { 1: [ Species.BELLSPROUT ], 21: [ Species.WEEPINBELL ] }],
      [TimeOfDay.DUSK]: [
        Species.BEEDRILL],
      [TimeOfDay.NIGHT]: [
        Species.BEEDRILL,
        { 1: [ Species.VENONAT ], 31: [ Species.VENOMOTH ] }],
      [TimeOfDay.ALL]: []
    },
    [BiomePoolTier.UNCOMMON]: {
      [TimeOfDay.DAWN]: [],
      [TimeOfDay.DAY]: [],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [],
      [TimeOfDay.ALL]: [
        { 1: [ Species.EKANS ], 22: [ Species.ARBOK ] }]
    },
    [BiomePoolTier.RARE]: {
      [TimeOfDay.DAWN]: [ Species.EXEGGCUTE],
      [TimeOfDay.DAY]: [ Species.EXEGGCUTE],
      [TimeOfDay.DUSK]: [ Species.SCYTHER ],
      [TimeOfDay.NIGHT]: [ Species.SCYTHER ],
      [TimeOfDay.ALL]: []
    },
    [BiomePoolTier.SUPER_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [] },
    [BiomePoolTier.ULTRA_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [] },
    [BiomePoolTier.BOSS]: {
      [TimeOfDay.DAWN]: [ Species.VICTREEBEL],
      [TimeOfDay.DAY]: [ Species.VICTREEBEL ],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [ Species.VENOMOTH ],
      [TimeOfDay.ALL]: []
    },
    [BiomePoolTier.BOSS_RARE]: {
      [TimeOfDay.DAWN]: [],
      [TimeOfDay.DAY]: [],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [],
      [TimeOfDay.ALL]: []
    },
    [BiomePoolTier.BOSS_SUPER_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [] },
    [BiomePoolTier.BOSS_ULTRA_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [] }
  },
  [Biome.SEA]: {
    [BiomePoolTier.COMMON]: {
      [TimeOfDay.DAWN]: [ { 1: [ Species.SLOWPOKE ], 37: [ Species.SLOWBRO ] }],
      [TimeOfDay.DAY]: [ { 1: [ Species.SLOWPOKE ], 37: [ Species.SLOWBRO ] }],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [],
      [TimeOfDay.ALL]: [ { 1: [ Species.TENTACOOL ], 30: [ Species.TENTACRUEL ] }, { 1: [ Species.MAGIKARP ], 20: [ Species.GYARADOS ] }]
    },
    [BiomePoolTier.UNCOMMON]: {
      [TimeOfDay.DAWN]: [ { 1: [ Species.STARYU ], 30: [ Species.STARMIE ] } ],
      [TimeOfDay.DAY]: [ { 1: [ Species.STARYU ], 30: [ Species.STARMIE ] } ],
      [TimeOfDay.DUSK]: [ { 1: [ Species.SLOWPOKE ], 37: [ Species.SLOWBRO ] }, Species.SHELLDER ],
      [TimeOfDay.NIGHT]: [ { 1: [ Species.SLOWPOKE ], 37: [ Species.SLOWBRO ] }, Species.SHELLDER ],
      [TimeOfDay.ALL]: [
        { 1: [ Species.POLIWAG ], 25: [ Species.POLIWHIRL ] },
        { 1: [ Species.HORSEA ], 32: [ Species.SEADRA ] },
        { 1: [ Species.GOLDEEN ], 33: [ Species.SEAKING ] }
      ]
    },
    [BiomePoolTier.RARE]: {
      [TimeOfDay.DAWN]: [],
      [TimeOfDay.DAY]: [],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [],
      [TimeOfDay.ALL]: [ Species.LAPRAS]
    },
    [BiomePoolTier.SUPER_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [] },
    [BiomePoolTier.ULTRA_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [] },
    [BiomePoolTier.BOSS]: {
      [TimeOfDay.DAWN]: [],
      [TimeOfDay.DAY]: [],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [],
      [TimeOfDay.ALL]: [ Species.TENTACRUEL]
    },
    [BiomePoolTier.BOSS_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [] },
    [BiomePoolTier.BOSS_SUPER_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [] },
    [BiomePoolTier.BOSS_ULTRA_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [] }
  },
  [Biome.SWAMP]: {
    [BiomePoolTier.COMMON]: {
      [TimeOfDay.DAWN]: [],
      [TimeOfDay.DAY]: [],
      [TimeOfDay.DUSK]: [ { 1: [ Species.EKANS ], 22: [ Species.ARBOK ] }],
      [TimeOfDay.NIGHT]: [ { 1: [ Species.EKANS ], 22: [ Species.ARBOK ] }],
      [TimeOfDay.ALL]: [
        { 1: [ Species.POLIWAG ], 25: [ Species.POLIWHIRL ] }]
    },
    [BiomePoolTier.UNCOMMON]: {
      [TimeOfDay.DAWN]: [ { 1: [ Species.EKANS ], 22: [ Species.ARBOK ] } ],
      [TimeOfDay.DAY]: [ { 1: [ Species.EKANS ], 22: [ Species.ARBOK ] } ],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [],
      [TimeOfDay.ALL]: [
        { 1: [ Species.PSYDUCK ], 33: [ Species.GOLDUCK ] },

      ]
    },
    [BiomePoolTier.RARE]: {
      [TimeOfDay.DAWN]: [],
      [TimeOfDay.DAY]: [],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [],
      [TimeOfDay.ALL]: []
    },
    [BiomePoolTier.SUPER_RARE]: {
      [TimeOfDay.DAWN]: [],
      [TimeOfDay.DAY]: [],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [],
      [TimeOfDay.ALL]: []
    },
    [BiomePoolTier.ULTRA_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [] },
    [BiomePoolTier.BOSS]: {
      [TimeOfDay.DAWN]: [],
      [TimeOfDay.DAY]: [],
      [TimeOfDay.DUSK]: [ Species.ARBOK],
      [TimeOfDay.NIGHT]: [ Species.ARBOK],
      [TimeOfDay.ALL]: [ Species.POLIWRATH]
    },
    [BiomePoolTier.BOSS_RARE]: {
      [TimeOfDay.DAWN]: [],
      [TimeOfDay.DAY]: [],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [],
      [TimeOfDay.ALL]: []
    },
    [BiomePoolTier.BOSS_SUPER_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [] },
    [BiomePoolTier.BOSS_ULTRA_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [] }
  },
  [Biome.BEACH]: {
    [BiomePoolTier.COMMON]: {
      [TimeOfDay.DAWN]: [ { 1: [ Species.STARYU ], 30: [ Species.STARMIE ] } ],
      [TimeOfDay.DAY]: [ { 1: [ Species.STARYU ], 30: [ Species.STARMIE ] } ],
      [TimeOfDay.DUSK]: [ Species.SHELLDER ],
      [TimeOfDay.NIGHT]: [ Species.SHELLDER ],
      [TimeOfDay.ALL]: [
        { 1: [ Species.KRABBY ], 28: [ Species.KINGLER ] }]
    },
    [BiomePoolTier.UNCOMMON]: {
      [TimeOfDay.DAWN]: [],
      [TimeOfDay.DAY]: [],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [],
      [TimeOfDay.ALL]: []
    },
    [BiomePoolTier.RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [] },
    [BiomePoolTier.SUPER_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [] },
    [BiomePoolTier.ULTRA_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [] },
    [BiomePoolTier.BOSS]: {
      [TimeOfDay.DAWN]: [ Species.STARMIE ],
      [TimeOfDay.DAY]: [ Species.STARMIE ],
      [TimeOfDay.DUSK]: [ Species.CLOYSTER ],
      [TimeOfDay.NIGHT]: [ Species.CLOYSTER ],
      [TimeOfDay.ALL]: [ Species.KINGLER]
    },
    [BiomePoolTier.BOSS_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [] },
    [BiomePoolTier.BOSS_SUPER_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [] },
    [BiomePoolTier.BOSS_ULTRA_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [] }
  },
  [Biome.LAKE]: {
    [BiomePoolTier.COMMON]: {
      [TimeOfDay.DAWN]: [],
      [TimeOfDay.DAY]: [],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [],
      [TimeOfDay.ALL]: [
        { 1: [ Species.PSYDUCK ], 33: [ Species.GOLDUCK ] },
        { 1: [ Species.GOLDEEN ], 33: [ Species.SEAKING ] },
        { 1: [ Species.MAGIKARP ], 20: [ Species.GYARADOS ] }]
    },
    [BiomePoolTier.UNCOMMON]: {
      [TimeOfDay.DAWN]: [],
      [TimeOfDay.DAY]: [],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [],
      [TimeOfDay.ALL]: [ { 1: [ Species.SLOWPOKE ], 37: [ Species.SLOWBRO ] }]
    },
    [BiomePoolTier.RARE]: {
      [TimeOfDay.DAWN]: [],
      [TimeOfDay.DAY]: [],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [],
      [TimeOfDay.ALL]: [
        { 1: [ Species.SQUIRTLE ], 16: [ Species.WARTORTLE ], 36: [ Species.BLASTOISE ] }]
    },
    [BiomePoolTier.SUPER_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ Species.VAPOREON] },
    [BiomePoolTier.ULTRA_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [] },
    [BiomePoolTier.BOSS]: {
      [TimeOfDay.DAWN]: [],
      [TimeOfDay.DAY]: [],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [],
      [TimeOfDay.ALL]: [ Species.GOLDUCK, Species.SLOWBRO, Species.SEAKING, Species.GYARADOS]
    },
    [BiomePoolTier.BOSS_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ Species.BLASTOISE, Species.VAPOREON] },
    [BiomePoolTier.BOSS_SUPER_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [] },
    [BiomePoolTier.BOSS_ULTRA_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [] }
  },
  [Biome.SEABED]: {
    [BiomePoolTier.COMMON]: {
      [TimeOfDay.DAWN]: [],
      [TimeOfDay.DAY]: [],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [],
      [TimeOfDay.ALL]: []
    },
    [BiomePoolTier.UNCOMMON]: {
      [TimeOfDay.DAWN]: [],
      [TimeOfDay.DAY]: [],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [],
      [TimeOfDay.ALL]: [
        { 1: [ Species.TENTACOOL ], 30: [ Species.TENTACRUEL ] },
        Species.SHELLDER,
      ]
    },
    [BiomePoolTier.RARE]: {
      [TimeOfDay.DAWN]: [],
      [TimeOfDay.DAY]: [],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [],
      [TimeOfDay.ALL]: []
    },
    [BiomePoolTier.SUPER_RARE]: {
      [TimeOfDay.DAWN]: [],
      [TimeOfDay.DAY]: [],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [],
      [TimeOfDay.ALL]: [
        { 1: [ Species.OMANYTE ], 40: [ Species.OMASTAR ] },
        { 1: [ Species.KABUTO ], 40: [ Species.KABUTOPS ] },
      ]
    },
    [BiomePoolTier.ULTRA_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [] },
    [BiomePoolTier.BOSS]: {
      [TimeOfDay.DAWN]: [],
      [TimeOfDay.DAY]: [],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [],
      [TimeOfDay.ALL]: []
    },
    [BiomePoolTier.BOSS_RARE]: {
      [TimeOfDay.DAWN]: [],
      [TimeOfDay.DAY]: [],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [],
      [TimeOfDay.ALL]: [ Species.OMASTAR, Species.KABUTOPS]
    },
    [BiomePoolTier.BOSS_SUPER_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [] },
    [BiomePoolTier.BOSS_ULTRA_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [] }
  },
  [Biome.MOUNTAIN]: {
    [BiomePoolTier.COMMON]: {
      [TimeOfDay.DAWN]: [],
      [TimeOfDay.DAY]: [],
      [TimeOfDay.DUSK]: [ { 1: [ Species.RHYHORN ], 42: [ Species.RHYDON ] }],
      [TimeOfDay.NIGHT]: [ { 1: [ Species.RHYHORN ], 42: [ Species.RHYDON ] }],
      [TimeOfDay.ALL]: [ { 1: [ Species.PIDGEY ], 18: [ Species.PIDGEOTTO ], 36: [ Species.PIDGEOT ] }, { 1: [ Species.SPEAROW ], 20: [ Species.FEAROW ] }]
    },
    [BiomePoolTier.UNCOMMON]: {
      [TimeOfDay.DAWN]: [
        { 1: [ Species.RHYHORN ], 42: [ Species.RHYDON ] }],
      [TimeOfDay.DAY]: [
        { 1: [ Species.RHYHORN ], 42: [ Species.RHYDON ] }],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [],
      [TimeOfDay.ALL]: [
        { 1: [ Species.MACHOP ], 28: [ Species.MACHOKE ] },
        { 1: [ Species.GEODUDE ], 25: [ Species.GRAVELER ] }]
    },
    [BiomePoolTier.RARE]: {
      [TimeOfDay.DAWN]: [],
      [TimeOfDay.DAY]: [],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [],
      [TimeOfDay.ALL]: []
    },
    [BiomePoolTier.SUPER_RARE]: {
      [TimeOfDay.DAWN]: [],
      [TimeOfDay.DAY]: [],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [],
      [TimeOfDay.ALL]: []
    },
    [BiomePoolTier.ULTRA_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [] },
    [BiomePoolTier.BOSS]: {
      [TimeOfDay.DAWN]: [],
      [TimeOfDay.DAY]: [],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [],
      [TimeOfDay.ALL]: [ Species.PIDGEOT, Species.FEAROW]
    },
    [BiomePoolTier.BOSS_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [] },
    [BiomePoolTier.BOSS_SUPER_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [] },
    [BiomePoolTier.BOSS_ULTRA_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [] }
  },
  [Biome.BADLANDS]: {
    [BiomePoolTier.COMMON]: {
      [TimeOfDay.DAWN]: [],
      [TimeOfDay.DAY]: [],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [ { 1: [ Species.CUBONE ], 28: [ Species.MAROWAK ] } ],
      [TimeOfDay.ALL]: [
        { 1: [ Species.DIGLETT ], 26: [ Species.DUGTRIO ] },
        { 1: [ Species.GEODUDE ], 25: [ Species.GRAVELER ] },
        { 1: [ Species.RHYHORN ], 42: [ Species.RHYDON ] }]
    },
    [BiomePoolTier.UNCOMMON]: {
      [TimeOfDay.DAWN]: [],
      [TimeOfDay.DAY]: [],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [],
      [TimeOfDay.ALL]: [
        { 1: [ Species.SANDSHREW ], 22: [ Species.SANDSLASH ] }]
    },
    [BiomePoolTier.RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ Species.ONIX] },
    [BiomePoolTier.SUPER_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [] },
    [BiomePoolTier.ULTRA_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [] },
    [BiomePoolTier.BOSS]: {
      [TimeOfDay.DAWN]: [],
      [TimeOfDay.DAY]: [],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [ Species.MAROWAK ],
      [TimeOfDay.ALL]: [ Species.DUGTRIO, Species.GOLEM]
    },
    [BiomePoolTier.BOSS_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [] },
    [BiomePoolTier.BOSS_SUPER_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [] },
    [BiomePoolTier.BOSS_ULTRA_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [] }
  },
  [Biome.CAVE]: {
    [BiomePoolTier.COMMON]: {
      [TimeOfDay.DAWN]: [],
      [TimeOfDay.DAY]: [],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [],
      [TimeOfDay.ALL]: [
        { 1: [ Species.ZUBAT ], 22: [ Species.GOLBAT ] },
        { 1: [ Species.PARAS ], 24: [ Species.PARASECT ] }]
    },
    [BiomePoolTier.UNCOMMON]: {
      [TimeOfDay.DAWN]: [],
      [TimeOfDay.DAY]: [],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [],
      [TimeOfDay.ALL]: [
        { 1: [ Species.GEODUDE ], 25: [ Species.GRAVELER ] }
      ]
    },
    [BiomePoolTier.RARE]: {
      [TimeOfDay.DAWN]: [],
      [TimeOfDay.DAY]: [],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [],
      [TimeOfDay.ALL]: [ Species.ONIX,  ]
    },
    [BiomePoolTier.SUPER_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [] },
    [BiomePoolTier.ULTRA_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [] },
    [BiomePoolTier.BOSS]: {
      [TimeOfDay.DAWN]: [],
      [TimeOfDay.DAY]: [],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [],
      [TimeOfDay.ALL]: [ Species.PARASECT, Species.ONIX]
    },
    [BiomePoolTier.BOSS_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [] },
    [BiomePoolTier.BOSS_SUPER_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [] },
    [BiomePoolTier.BOSS_ULTRA_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [] }
  },
  [Biome.DESERT]: {
    [BiomePoolTier.COMMON]: {
      [TimeOfDay.DAWN]: [],
      [TimeOfDay.DAY]: [],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [],
      [TimeOfDay.ALL]: [ { 1: [ Species.SANDSHREW ], 22: [ Species.SANDSLASH ] }]
    },
    [BiomePoolTier.UNCOMMON]: {
      [TimeOfDay.DAWN]: [],
      [TimeOfDay.DAY]: [],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [],
      [TimeOfDay.ALL]: []
    },
    [BiomePoolTier.RARE]: {
      [TimeOfDay.DAWN]: [],
      [TimeOfDay.DAY]: [],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [],
      [TimeOfDay.ALL]: []
    },
    [BiomePoolTier.SUPER_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [] },
    [BiomePoolTier.ULTRA_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [] },
    [BiomePoolTier.BOSS]: {
      [TimeOfDay.DAWN]: [],
      [TimeOfDay.DAY]: [],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [],
      [TimeOfDay.ALL]: [ Species.SANDSLASH]
    },
    [BiomePoolTier.BOSS_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [] },
    [BiomePoolTier.BOSS_SUPER_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [] },
    [BiomePoolTier.BOSS_ULTRA_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [] }
  },
  [Biome.ICE_CAVE]: {
    [BiomePoolTier.COMMON]: {
      [TimeOfDay.DAWN]: [],
      [TimeOfDay.DAY]: [],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [],
      [TimeOfDay.ALL]: [
        { 1: [ Species.SEEL ], 34: [ Species.DEWGONG ] },
      ]
    },
    [BiomePoolTier.UNCOMMON]: {
      [TimeOfDay.DAWN]: [],
      [TimeOfDay.DAY]: [],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [],
      [TimeOfDay.ALL]: []
    },
    [BiomePoolTier.RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ Species.JYNX, Species.LAPRAS] },
    [BiomePoolTier.SUPER_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [] },
    [BiomePoolTier.ULTRA_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ Species.ARTICUNO] },
    [BiomePoolTier.BOSS]: {
      [TimeOfDay.DAWN]: [],
      [TimeOfDay.DAY]: [],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [],
      [TimeOfDay.ALL]: [ Species.DEWGONG]
    },
    [BiomePoolTier.BOSS_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ Species.JYNX, Species.LAPRAS] },
    [BiomePoolTier.BOSS_SUPER_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ Species.ARTICUNO] },
    [BiomePoolTier.BOSS_ULTRA_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [] }
  },
  [Biome.MEADOW]: {
    [BiomePoolTier.COMMON]: {
      [TimeOfDay.DAWN]: [],
      [TimeOfDay.DAY]: [],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [],
      [TimeOfDay.ALL]: []
    },
    [BiomePoolTier.UNCOMMON]: {
      [TimeOfDay.DAWN]: [
        { 1: [ Species.PONYTA ], 40: [ Species.RAPIDASH ] },


      ],
      [TimeOfDay.DAY]: [
        { 1: [ Species.PONYTA ], 40: [ Species.RAPIDASH ] },
      ],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [],
      [TimeOfDay.ALL]: [
        { 1: [ Species.JIGGLYPUFF ], 30: [ Species.WIGGLYTUFF ] }]
    },
    [BiomePoolTier.RARE]: {
      [TimeOfDay.DAWN]: [],
      [TimeOfDay.DAY]: [],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [],
      [TimeOfDay.ALL]: [ Species.TAUROS, Species.EEVEE]
    },
    [BiomePoolTier.SUPER_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ Species.CHANSEY] },
    [BiomePoolTier.ULTRA_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [] },
    [BiomePoolTier.BOSS]: {
      [TimeOfDay.DAWN]: [],
      [TimeOfDay.DAY]: [],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [],
      [TimeOfDay.ALL]: [ Species.TAUROS]
    },
    [BiomePoolTier.BOSS_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [] },
    [BiomePoolTier.BOSS_SUPER_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [] },
    [BiomePoolTier.BOSS_ULTRA_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [] }
  },
  [Biome.POWER_PLANT]: {
    [BiomePoolTier.COMMON]: {
      [TimeOfDay.DAWN]: [],
      [TimeOfDay.DAY]: [],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [],
      [TimeOfDay.ALL]: [
        Species.PIKACHU,
        { 1: [ Species.MAGNEMITE ], 30: [ Species.MAGNETON ] },
        { 1: [ Species.VOLTORB ], 30: [ Species.ELECTRODE ] },
      ]
    },
    [BiomePoolTier.UNCOMMON]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ Species.ELECTABUZZ] },
    [BiomePoolTier.RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [] },
    [BiomePoolTier.SUPER_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ Species.JOLTEON] },
    [BiomePoolTier.ULTRA_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [] },
    [BiomePoolTier.BOSS]: {
      [TimeOfDay.DAWN]: [],
      [TimeOfDay.DAY]: [],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [],
      [TimeOfDay.ALL]: [ Species.RAICHU]
    },
    [BiomePoolTier.BOSS_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ Species.JOLTEON] },
    [BiomePoolTier.BOSS_SUPER_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ Species.ZAPDOS] },
    [BiomePoolTier.BOSS_ULTRA_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [] }
  },
  [Biome.VOLCANO]: {
    [BiomePoolTier.COMMON]: {
      [TimeOfDay.DAWN]: [],
      [TimeOfDay.DAY]: [],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [],
      [TimeOfDay.ALL]: [
        Species.VULPIX,
        Species.GROWLITHE,
        { 1: [ Species.PONYTA ], 40: [ Species.RAPIDASH ] }]
    },
    [BiomePoolTier.UNCOMMON]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ Species.MAGMAR] },
    [BiomePoolTier.RARE]: {
      [TimeOfDay.DAWN]: [],
      [TimeOfDay.DAY]: [],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [],
      [TimeOfDay.ALL]: [
        { 1: [ Species.CHARMANDER ], 16: [ Species.CHARMELEON ], 36: [ Species.CHARIZARD ] }]
    },
    [BiomePoolTier.SUPER_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ Species.FLAREON] },
    [BiomePoolTier.ULTRA_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [] },
    [BiomePoolTier.BOSS]: {
      [TimeOfDay.DAWN]: [],
      [TimeOfDay.DAY]: [],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [],
      [TimeOfDay.ALL]: [ Species.NINETALES, Species.ARCANINE, Species.RAPIDASH]
    },
    [BiomePoolTier.BOSS_RARE]: {
      [TimeOfDay.DAWN]: [],
      [TimeOfDay.DAY]: [],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [],
      [TimeOfDay.ALL]: [ Species.CHARIZARD, Species.FLAREON]
    },
    [BiomePoolTier.BOSS_SUPER_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ Species.MOLTRES] },
    [BiomePoolTier.BOSS_ULTRA_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [] }
  },
  [Biome.GRAVEYARD]: {
    [BiomePoolTier.COMMON]: {
      [TimeOfDay.DAWN]: [],
      [TimeOfDay.DAY]: [],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [],
      [TimeOfDay.ALL]: [
        { 1: [ Species.GASTLY ], 25: [ Species.HAUNTER ] },
      ]
    },
    [BiomePoolTier.UNCOMMON]: {
      [TimeOfDay.DAWN]: [],
      [TimeOfDay.DAY]: [],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [],
      [TimeOfDay.ALL]: [ { 1: [ Species.CUBONE ], 28: [ Species.MAROWAK ] }]
    },
    [BiomePoolTier.RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [] },
    [BiomePoolTier.SUPER_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [] },
    [BiomePoolTier.ULTRA_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [] },
    [BiomePoolTier.BOSS]: {
      [TimeOfDay.DAWN]: [ Species.MAROWAK ],
      [TimeOfDay.DAY]: [ Species.MAROWAK ],
      [TimeOfDay.DUSK]: [ Species.MAROWAK ],
      [TimeOfDay.NIGHT]: [],
      [TimeOfDay.ALL]: [ Species.GENGAR]
    },
    [BiomePoolTier.BOSS_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [] },
    [BiomePoolTier.BOSS_SUPER_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [] },
    [BiomePoolTier.BOSS_ULTRA_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [] }
  },
  [Biome.DOJO]: {
    [BiomePoolTier.COMMON]: {
      [TimeOfDay.DAWN]: [],
      [TimeOfDay.DAY]: [],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [],
      [TimeOfDay.ALL]: [
        { 1: [ Species.MANKEY ], 28: [ Species.PRIMEAPE ], 75: [] }]
    },
    [BiomePoolTier.UNCOMMON]: {
      [TimeOfDay.DAWN]: [],
      [TimeOfDay.DAY]: [],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [],
      [TimeOfDay.ALL]: []
    },
    [BiomePoolTier.RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ Species.HITMONLEE, Species.HITMONCHAN] },
    [BiomePoolTier.SUPER_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [] },
    [BiomePoolTier.ULTRA_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [] },
    [BiomePoolTier.BOSS]: {
      [TimeOfDay.DAWN]: [],
      [TimeOfDay.DAY]: [],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [],
      [TimeOfDay.ALL]: [ Species.HITMONLEE, Species.HITMONCHAN]
    },
    [BiomePoolTier.BOSS_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [] },
    [BiomePoolTier.BOSS_SUPER_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [] },
    [BiomePoolTier.BOSS_ULTRA_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [] }
  },
  [Biome.FACTORY]: {
    [BiomePoolTier.COMMON]: {
      [TimeOfDay.DAWN]: [],
      [TimeOfDay.DAY]: [],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [],
      [TimeOfDay.ALL]: [
        { 1: [ Species.MACHOP ], 28: [ Species.MACHOKE ] },
        { 1: [ Species.MAGNEMITE ], 30: [ Species.MAGNETON ] },
        { 1: [ Species.VOLTORB ], 30: [ Species.ELECTRODE ] }]
    },
    [BiomePoolTier.UNCOMMON]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [] },
    [BiomePoolTier.RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ { 1: [ Species.PORYGON ], 30: [] } ] },
    [BiomePoolTier.SUPER_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [] },
    [BiomePoolTier.ULTRA_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [] },
    [BiomePoolTier.BOSS]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [] },
    [BiomePoolTier.BOSS_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [] },
    [BiomePoolTier.BOSS_SUPER_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [] },
    [BiomePoolTier.BOSS_ULTRA_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [] }
  },
  [Biome.RUINS]: {
    [BiomePoolTier.COMMON]: {
      [TimeOfDay.DAWN]: [],
      [TimeOfDay.DAY]: [],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [],
      [TimeOfDay.ALL]: [
        { 1: [ Species.DROWZEE ], 26: [ Species.HYPNO ] },
      ]
    },
    [BiomePoolTier.UNCOMMON]: {
      [TimeOfDay.DAWN]: [],
      [TimeOfDay.DAY]: [],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [],
      [TimeOfDay.ALL]: [ { 1: [ Species.ABRA ], 16: [ Species.KADABRA ] }, ]
    },
    [BiomePoolTier.RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ Species.MR_MIME] },
    [BiomePoolTier.SUPER_RARE]: {
      [TimeOfDay.DAWN]: [],
      [TimeOfDay.DAY]: [],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [],
      [TimeOfDay.ALL]: []
    },
    [BiomePoolTier.ULTRA_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [] },
    [BiomePoolTier.BOSS]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ Species.ALAKAZAM, Species.HYPNO] },
    [BiomePoolTier.BOSS_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ Species.MR_MIME] },
    [BiomePoolTier.BOSS_SUPER_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [] },
    [BiomePoolTier.BOSS_ULTRA_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [] }
  },
  [Biome.WASTELAND]: {
    [BiomePoolTier.COMMON]: {
      [TimeOfDay.DAWN]: [],
      [TimeOfDay.DAY]: [],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [],
      [TimeOfDay.ALL]: []
    },
    [BiomePoolTier.UNCOMMON]: {
      [TimeOfDay.DAWN]: [],
      [TimeOfDay.DAY]: [],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [],
      [TimeOfDay.ALL]: []
    },
    [BiomePoolTier.RARE]: {
      [TimeOfDay.DAWN]: [],
      [TimeOfDay.DAY]: [],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [],
      [TimeOfDay.ALL]: [ { 1: [ Species.DRATINI ], 30: [ Species.DRAGONAIR ], 55: [ Species.DRAGONITE ] }]
    },
    [BiomePoolTier.SUPER_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ Species.AERODACTYL] },
    [BiomePoolTier.ULTRA_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [] },
    [BiomePoolTier.BOSS]: {
      [TimeOfDay.DAWN]: [],
      [TimeOfDay.DAY]: [],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [],
      [TimeOfDay.ALL]: [ Species.DRAGONITE]
    },
    [BiomePoolTier.BOSS_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ Species.AERODACTYL] },
    [BiomePoolTier.BOSS_SUPER_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [] },
    [BiomePoolTier.BOSS_ULTRA_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [] }
  },
  [Biome.ABYSS]: {
    [BiomePoolTier.COMMON]: {
      [TimeOfDay.DAWN]: [],
      [TimeOfDay.DAY]: [],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [],
      [TimeOfDay.ALL]: []
    },
    [BiomePoolTier.UNCOMMON]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [] },
    [BiomePoolTier.RARE]: {
      [TimeOfDay.DAWN]: [],
      [TimeOfDay.DAY]: [],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [],
      [TimeOfDay.ALL]: []
    },
    [BiomePoolTier.SUPER_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [] },
    [BiomePoolTier.ULTRA_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [] },
    [BiomePoolTier.BOSS]: {
      [TimeOfDay.DAWN]: [],
      [TimeOfDay.DAY]: [],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [],
      [TimeOfDay.ALL]: []
    },
    [BiomePoolTier.BOSS_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [] },
    [BiomePoolTier.BOSS_SUPER_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [] },
    [BiomePoolTier.BOSS_ULTRA_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [] }
  },
  [Biome.SPACE]: {
    [BiomePoolTier.COMMON]: {
      [TimeOfDay.DAWN]: [],
      [TimeOfDay.DAY]: [],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [],
      [TimeOfDay.ALL]: [ Species.CLEFAIRY]
    },
    [BiomePoolTier.UNCOMMON]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [] },
    [BiomePoolTier.RARE]: {
      [TimeOfDay.DAWN]: [],
      [TimeOfDay.DAY]: [],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [],
      [TimeOfDay.ALL]: []
    },
    [BiomePoolTier.SUPER_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ { 1: [ Species.PORYGON ], 30: [] } ] },
    [BiomePoolTier.ULTRA_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [] },
    [BiomePoolTier.BOSS]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ Species.CLEFABLE] },
    [BiomePoolTier.BOSS_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [] },
    [BiomePoolTier.BOSS_SUPER_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [] },
    [BiomePoolTier.BOSS_ULTRA_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [] }
  },
  [Biome.CONSTRUCTION_SITE]: {
    [BiomePoolTier.COMMON]: {
      [TimeOfDay.DAWN]: [],
      [TimeOfDay.DAY]: [],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [],
      [TimeOfDay.ALL]: [
        { 1: [ Species.MACHOP ], 28: [ Species.MACHOKE ] },
        { 1: [ Species.MAGNEMITE ], 30: [ Species.MAGNETON ] }]
    },
    [BiomePoolTier.UNCOMMON]: {
      [TimeOfDay.DAWN]: [],
      [TimeOfDay.DAY]: [],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [],
      [TimeOfDay.ALL]: [
        { 1: [ Species.GRIMER ], 38: [ Species.MUK ] },
        { 1: [ Species.KOFFING ], 35: [ Species.WEEZING ] },
        { 1: [ Species.RHYHORN ], 42: [ Species.RHYDON ] }]
    },
    [BiomePoolTier.RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ Species.ONIX, Species.HITMONLEE, Species.HITMONCHAN] },
    [BiomePoolTier.SUPER_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ Species.DITTO] },
    [BiomePoolTier.ULTRA_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [] },
    [BiomePoolTier.BOSS]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ Species.MACHAMP] },
    [BiomePoolTier.BOSS_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [] },
    [BiomePoolTier.BOSS_SUPER_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [] },
    [BiomePoolTier.BOSS_ULTRA_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [] }
  },
  [Biome.JUNGLE]: {
    [BiomePoolTier.COMMON]: {
      [TimeOfDay.DAWN]: [],
      [TimeOfDay.DAY]: [],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [],
      [TimeOfDay.ALL]: []
    },
    [BiomePoolTier.UNCOMMON]: {
      [TimeOfDay.DAWN]: [ Species.EXEGGCUTE],
      [TimeOfDay.DAY]: [ Species.EXEGGCUTE],
      [TimeOfDay.DUSK]: [ Species.TANGELA],
      [TimeOfDay.NIGHT]: [ Species.TANGELA],
      [TimeOfDay.ALL]: []
    },
    [BiomePoolTier.RARE]: {
      [TimeOfDay.DAWN]: [],
      [TimeOfDay.DAY]: [],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [],
      [TimeOfDay.ALL]: [
        Species.SCYTHER,
      ]
    },
    [BiomePoolTier.SUPER_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ Species.KANGASKHAN] },
    [BiomePoolTier.ULTRA_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [] },
    [BiomePoolTier.BOSS]: {
      [TimeOfDay.DAWN]: [ Species.EXEGGUTOR],
      [TimeOfDay.DAY]: [ Species.EXEGGUTOR],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [],
      [TimeOfDay.ALL]: []
    },
    [BiomePoolTier.BOSS_RARE]: {
      [TimeOfDay.DAWN]: [],
      [TimeOfDay.DAY]: [],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [],
      [TimeOfDay.ALL]: [ Species.KANGASKHAN]
    },
    [BiomePoolTier.BOSS_SUPER_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [] },
    [BiomePoolTier.BOSS_ULTRA_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [] }
  },
  [Biome.FAIRY_CAVE]: {
    [BiomePoolTier.COMMON]: {
      [TimeOfDay.DAWN]: [],
      [TimeOfDay.DAY]: [],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [],
      [TimeOfDay.ALL]: [
        { 1: [ Species.JIGGLYPUFF ], 30: [ Species.WIGGLYTUFF ] },
      ]
    },
    [BiomePoolTier.UNCOMMON]: {
      [TimeOfDay.DAWN]: [],
      [TimeOfDay.DAY]: [],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [],
      [TimeOfDay.ALL]: [
        Species.CLEFAIRY,
      ]
    },
    [BiomePoolTier.RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [] },
    [BiomePoolTier.SUPER_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [] },
    [BiomePoolTier.ULTRA_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [] },
    [BiomePoolTier.BOSS]: {
      [TimeOfDay.DAWN]: [],
      [TimeOfDay.DAY]: [],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [],
      [TimeOfDay.ALL]: [ Species.WIGGLYTUFF]
    },
    [BiomePoolTier.BOSS_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [] },
    [BiomePoolTier.BOSS_SUPER_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [] },
    [BiomePoolTier.BOSS_ULTRA_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [] }
  },
  [Biome.TEMPLE]: {
    [BiomePoolTier.COMMON]: {
      [TimeOfDay.DAWN]: [],
      [TimeOfDay.DAY]: [],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [],
      [TimeOfDay.ALL]: [
        { 1: [ Species.GASTLY ], 25: [ Species.HAUNTER ] }]
    },
    [BiomePoolTier.UNCOMMON]: {
      [TimeOfDay.DAWN]: [],
      [TimeOfDay.DAY]: [],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [],
      [TimeOfDay.ALL]: [
        { 1: [ Species.CUBONE ], 28: [ Species.MAROWAK ] }]
    },
    [BiomePoolTier.RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [] },
    [BiomePoolTier.SUPER_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [] },
    [BiomePoolTier.ULTRA_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [] },
    [BiomePoolTier.BOSS]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [] },
    [BiomePoolTier.BOSS_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [] },
    [BiomePoolTier.BOSS_SUPER_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [] },
    [BiomePoolTier.BOSS_ULTRA_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [] }
  },
  [Biome.SLUM]: {
    [BiomePoolTier.COMMON]: {
      [TimeOfDay.DAWN]: [],
      [TimeOfDay.DAY]: [],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [],
      [TimeOfDay.ALL]: [
        { 1: [ Species.RATTATA ], 20: [ Species.RATICATE ] },
        { 1: [ Species.GRIMER ], 38: [ Species.MUK ] },
        { 1: [ Species.KOFFING ], 35: [ Species.WEEZING ] }]
    },
    [BiomePoolTier.UNCOMMON]: {
      [TimeOfDay.DAWN]: [],
      [TimeOfDay.DAY]: [],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [],
      [TimeOfDay.ALL]: []
    },
    [BiomePoolTier.RARE]: {
      [TimeOfDay.DAWN]: [],
      [TimeOfDay.DAY]: [],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [],
      [TimeOfDay.ALL]: []
    },
    [BiomePoolTier.SUPER_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [] },
    [BiomePoolTier.ULTRA_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [] },
    [BiomePoolTier.BOSS]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ Species.MUK, Species.WEEZING] },
    [BiomePoolTier.BOSS_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [] },
    [BiomePoolTier.BOSS_SUPER_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [] },
    [BiomePoolTier.BOSS_ULTRA_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [] }
  },
  [Biome.SNOWY_FOREST]: {
    [BiomePoolTier.COMMON]: {
      [TimeOfDay.DAWN]: [],
      [TimeOfDay.DAY]: [],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [],
      [TimeOfDay.ALL]: []
    },
    [BiomePoolTier.UNCOMMON]: {
      [TimeOfDay.DAWN]: [],
      [TimeOfDay.DAY]: [],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [],
      [TimeOfDay.ALL]: []
    },
    [BiomePoolTier.RARE]: {
      [TimeOfDay.DAWN]: [],
      [TimeOfDay.DAY]: [],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [],
      [TimeOfDay.ALL]: []
    },
    [BiomePoolTier.SUPER_RARE]: {
      [TimeOfDay.DAWN]: [],
      [TimeOfDay.DAY]: [],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [],
      [TimeOfDay.ALL]: []
    },
    [BiomePoolTier.ULTRA_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [] },
    [BiomePoolTier.BOSS]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [] },
    [BiomePoolTier.BOSS_RARE]: {
      [TimeOfDay.DAWN]: [],
      [TimeOfDay.DAY]: [],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [],
      [TimeOfDay.ALL]: []
    },
    [BiomePoolTier.BOSS_SUPER_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [] },
    [BiomePoolTier.BOSS_ULTRA_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [] }
  },
  [Biome.ISLAND]: {
    [BiomePoolTier.COMMON]: {
      [TimeOfDay.DAWN]: [],
      [TimeOfDay.DAY]: [],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [],
      [TimeOfDay.ALL]: []
    },
    [BiomePoolTier.UNCOMMON]: {
      [TimeOfDay.DAWN]: [],
      [TimeOfDay.DAY]: [],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [],
      [TimeOfDay.ALL]: []
    },
    [BiomePoolTier.RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [] },
    [BiomePoolTier.SUPER_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [] },
    [BiomePoolTier.ULTRA_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [] },
    [BiomePoolTier.BOSS]: {
      [TimeOfDay.DAWN]: [],
      [TimeOfDay.DAY]: [],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [],
      [TimeOfDay.ALL]: []
    },
    [BiomePoolTier.BOSS_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [] },
    [BiomePoolTier.BOSS_SUPER_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [] },
    [BiomePoolTier.BOSS_ULTRA_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [] }
  },
  [Biome.LABORATORY]: {
    [BiomePoolTier.COMMON]: {
      [TimeOfDay.DAWN]: [],
      [TimeOfDay.DAY]: [],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [],
      [TimeOfDay.ALL]: [
        { 1: [ Species.MAGNEMITE ], 30: [ Species.MAGNETON ] },
        { 1: [ Species.GRIMER ], 38: [ Species.MUK ] },
        { 1: [ Species.VOLTORB ], 30: [ Species.ELECTRODE ] }]
    },
    [BiomePoolTier.UNCOMMON]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [] },
    [BiomePoolTier.RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ Species.DITTO, { 1: [ Species.PORYGON ], 30: [] } ] },
    [BiomePoolTier.SUPER_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [] },
    [BiomePoolTier.ULTRA_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [] },
    [BiomePoolTier.BOSS]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ Species.MUK, Species.ELECTRODE] },
    [BiomePoolTier.BOSS_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [] },
    [BiomePoolTier.BOSS_SUPER_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [] },
    [BiomePoolTier.BOSS_ULTRA_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [ Species.MEWTWO] }
  },
  [Biome.END]: {
    [BiomePoolTier.COMMON]: {
      [TimeOfDay.DAWN]: [],
      [TimeOfDay.DAY]: [],
      [TimeOfDay.DUSK]: [],
      [TimeOfDay.NIGHT]: [],
      [TimeOfDay.ALL]: []
    },
    [BiomePoolTier.UNCOMMON]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [] },
    [BiomePoolTier.RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [] },
    [BiomePoolTier.SUPER_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [] },
    [BiomePoolTier.ULTRA_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [] },
    [BiomePoolTier.BOSS]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [] },
    [BiomePoolTier.BOSS_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [] },
    [BiomePoolTier.BOSS_SUPER_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [] },
    [BiomePoolTier.BOSS_ULTRA_RARE]: { [TimeOfDay.DAWN]: [], [TimeOfDay.DAY]: [], [TimeOfDay.DUSK]: [], [TimeOfDay.NIGHT]: [], [TimeOfDay.ALL]: [] }
  }
};

export const biomeTrainerPools: BiomeTrainerPools = {
  [Biome.TOWN]: {
    [BiomePoolTier.COMMON]: [ TrainerType.YOUNGSTER ],
    [BiomePoolTier.UNCOMMON]: [],
    [BiomePoolTier.RARE]: [],
    [BiomePoolTier.SUPER_RARE]: [],
    [BiomePoolTier.ULTRA_RARE]: [],
    [BiomePoolTier.BOSS]: [],
    [BiomePoolTier.BOSS_RARE]: [],
    [BiomePoolTier.BOSS_SUPER_RARE]: [],
    [BiomePoolTier.BOSS_ULTRA_RARE]: []
  },
  [Biome.PLAINS]: {
    [BiomePoolTier.COMMON]: [ TrainerType.BREEDER, TrainerType.TWINS ],
    [BiomePoolTier.UNCOMMON]: [ TrainerType.ACE_TRAINER],
    [BiomePoolTier.RARE]: [ TrainerType.BLACK_BELT ],
    [BiomePoolTier.SUPER_RARE]: [],
    [BiomePoolTier.ULTRA_RARE]: [],
    [BiomePoolTier.BOSS]: [],
    [BiomePoolTier.BOSS_RARE]: [],
    [BiomePoolTier.BOSS_SUPER_RARE]: [],
    [BiomePoolTier.BOSS_ULTRA_RARE]: []
  },
  [Biome.GRASS]: {
    [BiomePoolTier.COMMON]: [ TrainerType.BREEDER, TrainerType.SCHOOL_KID ],
    [BiomePoolTier.UNCOMMON]: [ TrainerType.ACE_TRAINER ],
    [BiomePoolTier.RARE]: [ TrainerType.BLACK_BELT ],
    [BiomePoolTier.SUPER_RARE]: [],
    [BiomePoolTier.ULTRA_RARE]: [],
    [BiomePoolTier.BOSS]: [ TrainerType.ERIKA ],
    [BiomePoolTier.BOSS_RARE]: [],
    [BiomePoolTier.BOSS_SUPER_RARE]: [],
    [BiomePoolTier.BOSS_ULTRA_RARE]: []
  },
  [Biome.TALL_GRASS]: {
    [BiomePoolTier.COMMON]: [],
    [BiomePoolTier.UNCOMMON]: [ TrainerType.ACE_TRAINER, TrainerType.BREEDER, TrainerType.RANGER ],
    [BiomePoolTier.RARE]: [],
    [BiomePoolTier.SUPER_RARE]: [],
    [BiomePoolTier.ULTRA_RARE]: [],
    [BiomePoolTier.BOSS]: [],
    [BiomePoolTier.BOSS_RARE]: [],
    [BiomePoolTier.BOSS_SUPER_RARE]: [],
    [BiomePoolTier.BOSS_ULTRA_RARE]: []
  },
  [Biome.METROPOLIS]: {
    [BiomePoolTier.COMMON]: [ TrainerType.CLERK, TrainerType.OFFICER ],
    [BiomePoolTier.UNCOMMON]: [ TrainerType.BREEDER, TrainerType.DEPOT_AGENT, TrainerType.GUITARIST ],
    [BiomePoolTier.RARE]: [ TrainerType.ARTIST ],
    [BiomePoolTier.SUPER_RARE]: [],
    [BiomePoolTier.ULTRA_RARE]: [],
    [BiomePoolTier.BOSS]: [],
    [BiomePoolTier.BOSS_RARE]: [],
    [BiomePoolTier.BOSS_SUPER_RARE]: [],
    [BiomePoolTier.BOSS_ULTRA_RARE]: []
  },
  [Biome.FOREST]: {
    [BiomePoolTier.COMMON]: [ TrainerType.RANGER ],
    [BiomePoolTier.UNCOMMON]: [],
    [BiomePoolTier.RARE]: [],
    [BiomePoolTier.SUPER_RARE]: [],
    [BiomePoolTier.ULTRA_RARE]: [],
    [BiomePoolTier.BOSS]: [],
    [BiomePoolTier.BOSS_RARE]: [],
    [BiomePoolTier.BOSS_SUPER_RARE]: [],
    [BiomePoolTier.BOSS_ULTRA_RARE]: []
  },
  [Biome.SEA]: {
    [BiomePoolTier.COMMON]: [ TrainerType.SWIMMER, TrainerType.SAILOR ],
    [BiomePoolTier.UNCOMMON]: [],
    [BiomePoolTier.RARE]: [],
    [BiomePoolTier.SUPER_RARE]: [],
    [BiomePoolTier.ULTRA_RARE]: [],
    [BiomePoolTier.BOSS]: [],
    [BiomePoolTier.BOSS_RARE]: [],
    [BiomePoolTier.BOSS_SUPER_RARE]: [],
    [BiomePoolTier.BOSS_ULTRA_RARE]: []
  },
  [Biome.SWAMP]: {
    [BiomePoolTier.COMMON]: [],
    [BiomePoolTier.UNCOMMON]: [ TrainerType.ACE_TRAINER ],
    [BiomePoolTier.RARE]: [ TrainerType.BLACK_BELT ],
    [BiomePoolTier.SUPER_RARE]: [],
    [BiomePoolTier.ULTRA_RARE]: [],
    [BiomePoolTier.BOSS]: [ TrainerType.JANINE],
    [BiomePoolTier.BOSS_RARE]: [],
    [BiomePoolTier.BOSS_SUPER_RARE]: [],
    [BiomePoolTier.BOSS_ULTRA_RARE]: []
  },
  [Biome.BEACH]: {
    [BiomePoolTier.COMMON]: [ TrainerType.FISHERMAN, TrainerType.PARASOL_LADY, TrainerType.SAILOR ],
    [BiomePoolTier.UNCOMMON]: [ TrainerType.ACE_TRAINER, TrainerType.BREEDER ],
    [BiomePoolTier.RARE]: [ TrainerType.BLACK_BELT ],
    [BiomePoolTier.SUPER_RARE]: [],
    [BiomePoolTier.ULTRA_RARE]: [],
    [BiomePoolTier.BOSS]: [ TrainerType.MISTY ],
    [BiomePoolTier.BOSS_RARE]: [],
    [BiomePoolTier.BOSS_SUPER_RARE]: [],
    [BiomePoolTier.BOSS_ULTRA_RARE]: []
  },
  [Biome.LAKE]: {
    [BiomePoolTier.COMMON]: [ TrainerType.BREEDER, TrainerType.FISHERMAN ],
    [BiomePoolTier.UNCOMMON]: [ TrainerType.ACE_TRAINER ],
    [BiomePoolTier.RARE]: [ TrainerType.BLACK_BELT ],
    [BiomePoolTier.SUPER_RARE]: [],
    [BiomePoolTier.ULTRA_RARE]: [],
    [BiomePoolTier.BOSS]: [ ],
    [BiomePoolTier.BOSS_RARE]: [],
    [BiomePoolTier.BOSS_SUPER_RARE]: [],
    [BiomePoolTier.BOSS_ULTRA_RARE]: []
  },
  [Biome.SEABED]: {
    [BiomePoolTier.COMMON]: [],
    [BiomePoolTier.UNCOMMON]: [],
    [BiomePoolTier.RARE]: [],
    [BiomePoolTier.SUPER_RARE]: [],
    [BiomePoolTier.ULTRA_RARE]: [],
    [BiomePoolTier.BOSS]: [ ],
    [BiomePoolTier.BOSS_RARE]: [],
    [BiomePoolTier.BOSS_SUPER_RARE]: [],
    [BiomePoolTier.BOSS_ULTRA_RARE]: []
  },
  [Biome.MOUNTAIN]: {
    [BiomePoolTier.COMMON]: [ TrainerType.BACKPACKER, TrainerType.BLACK_BELT, TrainerType.HIKER ],
    [BiomePoolTier.UNCOMMON]: [ TrainerType.ACE_TRAINER ],
    [BiomePoolTier.RARE]: [],
    [BiomePoolTier.SUPER_RARE]: [],
    [BiomePoolTier.ULTRA_RARE]: [],
    [BiomePoolTier.BOSS]: [ ],
    [BiomePoolTier.BOSS_RARE]: [],
    [BiomePoolTier.BOSS_SUPER_RARE]: [],
    [BiomePoolTier.BOSS_ULTRA_RARE]: []
  },
  [Biome.BADLANDS]: {
    [BiomePoolTier.COMMON]: [ TrainerType.BACKPACKER, TrainerType.HIKER ],
    [BiomePoolTier.UNCOMMON]: [ TrainerType.ACE_TRAINER ],
    [BiomePoolTier.RARE]: [],
    [BiomePoolTier.SUPER_RARE]: [],
    [BiomePoolTier.ULTRA_RARE]: [],
    [BiomePoolTier.BOSS]: [],
    [BiomePoolTier.BOSS_RARE]: [],
    [BiomePoolTier.BOSS_SUPER_RARE]: [],
    [BiomePoolTier.BOSS_ULTRA_RARE]: []
  },
  [Biome.CAVE]: {
    [BiomePoolTier.COMMON]: [ TrainerType.BACKPACKER, TrainerType.HIKER ],
    [BiomePoolTier.UNCOMMON]: [ TrainerType.ACE_TRAINER, TrainerType.BLACK_BELT ],
    [BiomePoolTier.RARE]: [],
    [BiomePoolTier.SUPER_RARE]: [],
    [BiomePoolTier.ULTRA_RARE]: [],
    [BiomePoolTier.BOSS]: [ TrainerType.BROCK],
    [BiomePoolTier.BOSS_RARE]: [],
    [BiomePoolTier.BOSS_SUPER_RARE]: [],
    [BiomePoolTier.BOSS_ULTRA_RARE]: []
  },
  [Biome.DESERT]: {
    [BiomePoolTier.COMMON]: [ TrainerType.SCIENTIST ],
    [BiomePoolTier.UNCOMMON]: [],
    [BiomePoolTier.RARE]: [],
    [BiomePoolTier.SUPER_RARE]: [],
    [BiomePoolTier.ULTRA_RARE]: [],
    [BiomePoolTier.BOSS]: [ ],
    [BiomePoolTier.BOSS_RARE]: [],
    [BiomePoolTier.BOSS_SUPER_RARE]: [],
    [BiomePoolTier.BOSS_ULTRA_RARE]: []
  },
  [Biome.ICE_CAVE]: {
    [BiomePoolTier.COMMON]: [ TrainerType.SNOW_WORKER ],
    [BiomePoolTier.UNCOMMON]: [],
    [BiomePoolTier.RARE]: [],
    [BiomePoolTier.SUPER_RARE]: [],
    [BiomePoolTier.ULTRA_RARE]: [],
    [BiomePoolTier.BOSS]: [ ],
    [BiomePoolTier.BOSS_RARE]: [],
    [BiomePoolTier.BOSS_SUPER_RARE]: [],
    [BiomePoolTier.BOSS_ULTRA_RARE]: []
  },
  [Biome.MEADOW]: {
    [BiomePoolTier.COMMON]: [ TrainerType.PARASOL_LADY ],
    [BiomePoolTier.UNCOMMON]: [ TrainerType.ACE_TRAINER, TrainerType.BREEDER ],
    [BiomePoolTier.RARE]: [],
    [BiomePoolTier.SUPER_RARE]: [],
    [BiomePoolTier.ULTRA_RARE]: [],
    [BiomePoolTier.BOSS]: [ ],
    [BiomePoolTier.BOSS_RARE]: [],
    [BiomePoolTier.BOSS_SUPER_RARE]: [],
    [BiomePoolTier.BOSS_ULTRA_RARE]: []
  },
  [Biome.POWER_PLANT]: {
    [BiomePoolTier.COMMON]: [ TrainerType.GUITARIST, TrainerType.WORKER ],
    [BiomePoolTier.UNCOMMON]: [],
    [BiomePoolTier.RARE]: [],
    [BiomePoolTier.SUPER_RARE]: [],
    [BiomePoolTier.ULTRA_RARE]: [],
    [BiomePoolTier.BOSS]: [ ],
    [BiomePoolTier.BOSS_RARE]: [],
    [BiomePoolTier.BOSS_SUPER_RARE]: [],
    [BiomePoolTier.BOSS_ULTRA_RARE]: []
  },
  [Biome.VOLCANO]: {
    [BiomePoolTier.COMMON]: [ TrainerType.FIREBREATHER ],
    [BiomePoolTier.UNCOMMON]: [],
    [BiomePoolTier.RARE]: [],
    [BiomePoolTier.SUPER_RARE]: [],
    [BiomePoolTier.ULTRA_RARE]: [],
    [BiomePoolTier.BOSS]: [ TrainerType.BLAINE],
    [BiomePoolTier.BOSS_RARE]: [],
    [BiomePoolTier.BOSS_SUPER_RARE]: [],
    [BiomePoolTier.BOSS_ULTRA_RARE]: []
  },
  [Biome.GRAVEYARD]: {
    [BiomePoolTier.COMMON]: [ TrainerType.PSYCHIC ],
    [BiomePoolTier.UNCOMMON]: [ TrainerType.HEX_MANIAC ],
    [BiomePoolTier.RARE]: [],
    [BiomePoolTier.SUPER_RARE]: [],
    [BiomePoolTier.ULTRA_RARE]: [],
    [BiomePoolTier.BOSS]: [ ],
    [BiomePoolTier.BOSS_RARE]: [],
    [BiomePoolTier.BOSS_SUPER_RARE]: [],
    [BiomePoolTier.BOSS_ULTRA_RARE]: []
  },
  [Biome.DOJO]: {
    [BiomePoolTier.COMMON]: [ TrainerType.BLACK_BELT ],
    [BiomePoolTier.UNCOMMON]: [],
    [BiomePoolTier.RARE]: [],
    [BiomePoolTier.SUPER_RARE]: [],
    [BiomePoolTier.ULTRA_RARE]: [],
    [BiomePoolTier.BOSS]: [ ],
    [BiomePoolTier.BOSS_RARE]: [],
    [BiomePoolTier.BOSS_SUPER_RARE]: [],
    [BiomePoolTier.BOSS_ULTRA_RARE]: []
  },
  [Biome.FACTORY]: {
    [BiomePoolTier.COMMON]: [ TrainerType.WORKER ],
    [BiomePoolTier.UNCOMMON]: [],
    [BiomePoolTier.RARE]: [],
    [BiomePoolTier.SUPER_RARE]: [],
    [BiomePoolTier.ULTRA_RARE]: [],
    [BiomePoolTier.BOSS]: [ ],
    [BiomePoolTier.BOSS_RARE]: [],
    [BiomePoolTier.BOSS_SUPER_RARE]: [],
    [BiomePoolTier.BOSS_ULTRA_RARE]: []
  },
  [Biome.RUINS]: {
    [BiomePoolTier.COMMON]: [ TrainerType.PSYCHIC, TrainerType.SCIENTIST ],
    [BiomePoolTier.UNCOMMON]: [ TrainerType.ACE_TRAINER, TrainerType.BLACK_BELT ],
    [BiomePoolTier.RARE]: [],
    [BiomePoolTier.SUPER_RARE]: [],
    [BiomePoolTier.ULTRA_RARE]: [],
    [BiomePoolTier.BOSS]: [ TrainerType.SABRINA ],
    [BiomePoolTier.BOSS_RARE]: [],
    [BiomePoolTier.BOSS_SUPER_RARE]: [],
    [BiomePoolTier.BOSS_ULTRA_RARE]: []
  },
  [Biome.WASTELAND]: {
    [BiomePoolTier.COMMON]: [ TrainerType.VETERAN ],
    [BiomePoolTier.UNCOMMON]: [],
    [BiomePoolTier.RARE]: [],
    [BiomePoolTier.SUPER_RARE]: [],
    [BiomePoolTier.ULTRA_RARE]: [],
    [BiomePoolTier.BOSS]: [ ],
    [BiomePoolTier.BOSS_RARE]: [],
    [BiomePoolTier.BOSS_SUPER_RARE]: [],
    [BiomePoolTier.BOSS_ULTRA_RARE]: []
  },
  [Biome.ABYSS]: {
    [BiomePoolTier.COMMON]: [],
    [BiomePoolTier.UNCOMMON]: [ TrainerType.ACE_TRAINER ],
    [BiomePoolTier.RARE]: [],
    [BiomePoolTier.SUPER_RARE]: [],
    [BiomePoolTier.ULTRA_RARE]: [],
    [BiomePoolTier.BOSS]: [],
    [BiomePoolTier.BOSS_RARE]: [],
    [BiomePoolTier.BOSS_SUPER_RARE]: [],
    [BiomePoolTier.BOSS_ULTRA_RARE]: []
  },
  [Biome.SPACE]: {
    [BiomePoolTier.COMMON]: [],
    [BiomePoolTier.UNCOMMON]: [],
    [BiomePoolTier.RARE]: [],
    [BiomePoolTier.SUPER_RARE]: [],
    [BiomePoolTier.ULTRA_RARE]: [],
    [BiomePoolTier.BOSS]: [ ],
    [BiomePoolTier.BOSS_RARE]: [],
    [BiomePoolTier.BOSS_SUPER_RARE]: [],
    [BiomePoolTier.BOSS_ULTRA_RARE]: []
  },
  [Biome.CONSTRUCTION_SITE]: {
    [BiomePoolTier.COMMON]: [ TrainerType.OFFICER, TrainerType.WORKER ],
    [BiomePoolTier.UNCOMMON]: [],
    [BiomePoolTier.RARE]: [],
    [BiomePoolTier.SUPER_RARE]: [],
    [BiomePoolTier.ULTRA_RARE]: [],
    [BiomePoolTier.BOSS]: [ TrainerType.LT_SURGE ],
    [BiomePoolTier.BOSS_RARE]: [],
    [BiomePoolTier.BOSS_SUPER_RARE]: [],
    [BiomePoolTier.BOSS_ULTRA_RARE]: []
  },
  [Biome.JUNGLE]: {
    [BiomePoolTier.COMMON]: [ TrainerType.BACKPACKER, TrainerType.RANGER ],
    [BiomePoolTier.UNCOMMON]: [],
    [BiomePoolTier.RARE]: [],
    [BiomePoolTier.SUPER_RARE]: [],
    [BiomePoolTier.ULTRA_RARE]: [],
    [BiomePoolTier.BOSS]: [ ],
    [BiomePoolTier.BOSS_RARE]: [],
    [BiomePoolTier.BOSS_SUPER_RARE]: [],
    [BiomePoolTier.BOSS_ULTRA_RARE]: []
  },
  [Biome.FAIRY_CAVE]: {
    [BiomePoolTier.COMMON]: [ TrainerType.BEAUTY ],
    [BiomePoolTier.UNCOMMON]: [ TrainerType.ACE_TRAINER, TrainerType.BREEDER ],
    [BiomePoolTier.RARE]: [],
    [BiomePoolTier.SUPER_RARE]: [],
    [BiomePoolTier.ULTRA_RARE]: [],
    [BiomePoolTier.BOSS]: [ ],
    [BiomePoolTier.BOSS_RARE]: [],
    [BiomePoolTier.BOSS_SUPER_RARE]: [],
    [BiomePoolTier.BOSS_ULTRA_RARE]: []
  },
  [Biome.TEMPLE]: {
    [BiomePoolTier.COMMON]: [],
    [BiomePoolTier.UNCOMMON]: [ TrainerType.ACE_TRAINER ],
    [BiomePoolTier.RARE]: [],
    [BiomePoolTier.SUPER_RARE]: [],
    [BiomePoolTier.ULTRA_RARE]: [],
    [BiomePoolTier.BOSS]: [ ],
    [BiomePoolTier.BOSS_RARE]: [],
    [BiomePoolTier.BOSS_SUPER_RARE]: [],
    [BiomePoolTier.BOSS_ULTRA_RARE]: []
  },
  [Biome.SLUM]: {
    [BiomePoolTier.COMMON]: [ TrainerType.BIKER, TrainerType.OFFICER, TrainerType.ROUGHNECK ],
    [BiomePoolTier.UNCOMMON]: [ TrainerType.BAKER ],
    [BiomePoolTier.RARE]: [],
    [BiomePoolTier.SUPER_RARE]: [],
    [BiomePoolTier.ULTRA_RARE]: [],
    [BiomePoolTier.BOSS]: [],
    [BiomePoolTier.BOSS_RARE]: [],
    [BiomePoolTier.BOSS_SUPER_RARE]: [],
    [BiomePoolTier.BOSS_ULTRA_RARE]: []
  },
  [Biome.SNOWY_FOREST]: {
    [BiomePoolTier.COMMON]: [ TrainerType.SNOW_WORKER ],
    [BiomePoolTier.UNCOMMON]: [],
    [BiomePoolTier.RARE]: [],
    [BiomePoolTier.SUPER_RARE]: [],
    [BiomePoolTier.ULTRA_RARE]: [],
    [BiomePoolTier.BOSS]: [ ],
    [BiomePoolTier.BOSS_RARE]: [],
    [BiomePoolTier.BOSS_SUPER_RARE]: [],
    [BiomePoolTier.BOSS_ULTRA_RARE]: []
  },
  [Biome.ISLAND]: {
    [BiomePoolTier.COMMON]: [],
    [BiomePoolTier.UNCOMMON]: [],
    [BiomePoolTier.RARE]: [],
    [BiomePoolTier.SUPER_RARE]: [],
    [BiomePoolTier.ULTRA_RARE]: [],
    [BiomePoolTier.BOSS]: [ ],
    [BiomePoolTier.BOSS_RARE]: [],
    [BiomePoolTier.BOSS_SUPER_RARE]: [],
    [BiomePoolTier.BOSS_ULTRA_RARE]: []
  },
  [Biome.LABORATORY]: {
    [BiomePoolTier.COMMON]: [],
    [BiomePoolTier.UNCOMMON]: [],
    [BiomePoolTier.RARE]: [],
    [BiomePoolTier.SUPER_RARE]: [],
    [BiomePoolTier.ULTRA_RARE]: [],
    [BiomePoolTier.BOSS]: [ TrainerType.GIOVANNI ],
    [BiomePoolTier.BOSS_RARE]: [],
    [BiomePoolTier.BOSS_SUPER_RARE]: [],
    [BiomePoolTier.BOSS_ULTRA_RARE]: []
  },
  [Biome.END]: {
    [BiomePoolTier.COMMON]: [],
    [BiomePoolTier.UNCOMMON]: [],
    [BiomePoolTier.RARE]: [],
    [BiomePoolTier.SUPER_RARE]: [],
    [BiomePoolTier.ULTRA_RARE]: [],
    [BiomePoolTier.BOSS]: [],
    [BiomePoolTier.BOSS_RARE]: [],
    [BiomePoolTier.BOSS_SUPER_RARE]: [],
    [BiomePoolTier.BOSS_ULTRA_RARE]: []
  }
};

export function initBiomes() {
  const pokemonBiomes = [
    [ Species.BULBASAUR, Type.GRASS, Type.POISON, [
      [ Biome.GRASS, BiomePoolTier.RARE ]
    ]
    ],
    [ Species.IVYSAUR, Type.GRASS, Type.POISON, [
      [ Biome.GRASS, BiomePoolTier.RARE ]
    ]
    ],
    [ Species.VENUSAUR, Type.GRASS, Type.POISON, [
      [ Biome.GRASS, BiomePoolTier.RARE ],
      [ Biome.GRASS, BiomePoolTier.BOSS_RARE ]
    ]
    ],
    [ Species.CHARMANDER, Type.FIRE, -1, [
      [ Biome.VOLCANO, BiomePoolTier.RARE ]
    ]
    ],
    [ Species.CHARMELEON, Type.FIRE, -1, [
      [ Biome.VOLCANO, BiomePoolTier.RARE ]
    ]
    ],
    [ Species.CHARIZARD, Type.FIRE, Type.FLYING, [
      [ Biome.VOLCANO, BiomePoolTier.RARE ],
      [ Biome.VOLCANO, BiomePoolTier.BOSS_RARE ]
    ]
    ],
    [ Species.SQUIRTLE, Type.WATER, -1, [
      [ Biome.LAKE, BiomePoolTier.RARE ]
    ]
    ],
    [ Species.WARTORTLE, Type.WATER, -1, [
      [ Biome.LAKE, BiomePoolTier.RARE ]
    ]
    ],
    [ Species.BLASTOISE, Type.WATER, -1, [
      [ Biome.LAKE, BiomePoolTier.RARE ],
      [ Biome.LAKE, BiomePoolTier.BOSS_RARE ]
    ]
    ],
    [ Species.CATERPIE, Type.BUG, -1, [
      [ Biome.TOWN, BiomePoolTier.COMMON, [ TimeOfDay.DAWN, TimeOfDay.DAY ] ]
    ]
    ],
    [ Species.METAPOD, Type.BUG, -1, [
      [ Biome.TOWN, BiomePoolTier.COMMON, [ TimeOfDay.DAWN, TimeOfDay.DAY ] ]
    ]
    ],
    [ Species.BUTTERFREE, Type.BUG, Type.FLYING, [
      [ Biome.FOREST, BiomePoolTier.COMMON, [ TimeOfDay.DAWN, TimeOfDay.DAY ] ]
    ]
    ],
    [ Species.WEEDLE, Type.BUG, Type.POISON, [
      [ Biome.TOWN, BiomePoolTier.COMMON, [ TimeOfDay.DUSK, TimeOfDay.NIGHT ] ]
    ]
    ],
    [ Species.KAKUNA, Type.BUG, Type.POISON, [
      [ Biome.TOWN, BiomePoolTier.COMMON, [ TimeOfDay.DUSK, TimeOfDay.NIGHT ] ]
    ]
    ],
    [ Species.BEEDRILL, Type.BUG, Type.POISON, [
      [ Biome.FOREST, BiomePoolTier.COMMON, [ TimeOfDay.DUSK, TimeOfDay.NIGHT ] ]
    ]
    ],
    [ Species.PIDGEY, Type.NORMAL, Type.FLYING, [
      [ Biome.TOWN, BiomePoolTier.COMMON ],
      [ Biome.PLAINS, BiomePoolTier.UNCOMMON ],
      [ Biome.MOUNTAIN, BiomePoolTier.COMMON ]
    ]
    ],
    [ Species.PIDGEOTTO, Type.NORMAL, Type.FLYING, [
      [ Biome.PLAINS, BiomePoolTier.UNCOMMON ],
      [ Biome.MOUNTAIN, BiomePoolTier.COMMON ]
    ]
    ],
    [ Species.PIDGEOT, Type.NORMAL, Type.FLYING, [
      [ Biome.PLAINS, BiomePoolTier.UNCOMMON ],
      [ Biome.MOUNTAIN, BiomePoolTier.COMMON ],
      [ Biome.MOUNTAIN, BiomePoolTier.BOSS ]
    ]
    ],
    [ Species.RATTATA, Type.NORMAL, -1, [
      [ Biome.TOWN, BiomePoolTier.COMMON ],
      [ Biome.METROPOLIS, BiomePoolTier.COMMON ],
      [ Biome.SLUM, BiomePoolTier.COMMON ]
    ]
    ],
    [ Species.RATICATE, Type.NORMAL, -1, [
      [ Biome.METROPOLIS, BiomePoolTier.COMMON ],
      [ Biome.SLUM, BiomePoolTier.COMMON ]
    ]
    ],
    [ Species.SPEAROW, Type.NORMAL, Type.FLYING, [
      [ Biome.TOWN, BiomePoolTier.COMMON ],
      [ Biome.PLAINS, BiomePoolTier.UNCOMMON ],
      [ Biome.MOUNTAIN, BiomePoolTier.COMMON ]
    ]
    ],
    [ Species.FEAROW, Type.NORMAL, Type.FLYING, [
      [ Biome.PLAINS, BiomePoolTier.UNCOMMON ],
      [ Biome.MOUNTAIN, BiomePoolTier.COMMON ],
      [ Biome.MOUNTAIN, BiomePoolTier.BOSS ]
    ]
    ],
    [ Species.EKANS, Type.POISON, -1, [
      [ Biome.TOWN, BiomePoolTier.UNCOMMON, [ TimeOfDay.DUSK, TimeOfDay.NIGHT ] ],
      [ Biome.FOREST, BiomePoolTier.UNCOMMON ],
      [ Biome.SWAMP, BiomePoolTier.UNCOMMON, [ TimeOfDay.DAWN, TimeOfDay.DAY ] ],
      [ Biome.SWAMP, BiomePoolTier.COMMON, [ TimeOfDay.DUSK, TimeOfDay.NIGHT ] ]
    ]
    ],
    [ Species.ARBOK, Type.POISON, -1, [
      [ Biome.FOREST, BiomePoolTier.UNCOMMON ],
      [ Biome.SWAMP, BiomePoolTier.UNCOMMON, [ TimeOfDay.DAWN, TimeOfDay.DAY ] ],
      [ Biome.SWAMP, BiomePoolTier.COMMON, [ TimeOfDay.DUSK, TimeOfDay.NIGHT ] ],
      [ Biome.SWAMP, BiomePoolTier.BOSS, [ TimeOfDay.DUSK, TimeOfDay.NIGHT ] ]
    ]
    ],
    [ Species.PIKACHU, Type.ELECTRIC, -1, [
      [ Biome.PLAINS, BiomePoolTier.UNCOMMON ],
      [ Biome.METROPOLIS, BiomePoolTier.UNCOMMON ],
      [ Biome.POWER_PLANT, BiomePoolTier.COMMON ]
    ]
    ],
    [ Species.RAICHU, Type.ELECTRIC, -1, [
      [ Biome.POWER_PLANT, BiomePoolTier.BOSS ]
    ]
    ],
    [ Species.SANDSHREW, Type.GROUND, -1, [
      [ Biome.BADLANDS, BiomePoolTier.UNCOMMON ],
      [ Biome.DESERT, BiomePoolTier.COMMON ]
    ]
    ],
    [ Species.SANDSLASH, Type.GROUND, -1, [
      [ Biome.BADLANDS, BiomePoolTier.UNCOMMON ],
      [ Biome.DESERT, BiomePoolTier.COMMON ],
      [ Biome.DESERT, BiomePoolTier.BOSS ]
    ]
    ],
    [ Species.NIDORAN_F, Type.POISON, -1, [
      [ Biome.TOWN, BiomePoolTier.UNCOMMON, TimeOfDay.DAY ],
      [ Biome.TALL_GRASS, BiomePoolTier.COMMON, TimeOfDay.DAY ]
    ]
    ],
    [ Species.NIDORINA, Type.POISON, -1, [
      [ Biome.TALL_GRASS, BiomePoolTier.COMMON, TimeOfDay.DAY ]
    ]
    ],
    [ Species.NIDOQUEEN, Type.POISON, Type.GROUND, [
      [ Biome.TALL_GRASS, BiomePoolTier.BOSS, TimeOfDay.DAY ]
    ]
    ],
    [ Species.NIDORAN_M, Type.POISON, -1, [
      [ Biome.TOWN, BiomePoolTier.UNCOMMON, TimeOfDay.DAY ],
      [ Biome.TALL_GRASS, BiomePoolTier.COMMON, TimeOfDay.DAY ]
    ]
    ],
    [ Species.NIDORINO, Type.POISON, -1, [
      [ Biome.TALL_GRASS, BiomePoolTier.COMMON, TimeOfDay.DAY ]
    ]
    ],
    [ Species.NIDOKING, Type.POISON, Type.GROUND, [
      [ Biome.TALL_GRASS, BiomePoolTier.BOSS, TimeOfDay.DAY ]
    ]
    ],
    [ Species.CLEFAIRY, Type.FAIRY, -1, [
      [ Biome.FAIRY_CAVE, BiomePoolTier.UNCOMMON ],
      [ Biome.SPACE, BiomePoolTier.COMMON ]
    ]
    ],
    [ Species.CLEFABLE, Type.FAIRY, -1, [
      [ Biome.SPACE, BiomePoolTier.BOSS ]
    ]
    ],
    [ Species.VULPIX, Type.FIRE, -1, [
      [ Biome.TALL_GRASS, BiomePoolTier.UNCOMMON ],
      [ Biome.VOLCANO, BiomePoolTier.COMMON ]
    ]
    ],
    [ Species.NINETALES, Type.FIRE, -1, [
      [ Biome.VOLCANO, BiomePoolTier.BOSS ]
    ]
    ],
    [ Species.JIGGLYPUFF, Type.NORMAL, Type.FAIRY, [
      [ Biome.MEADOW, BiomePoolTier.UNCOMMON ],
      [ Biome.FAIRY_CAVE, BiomePoolTier.COMMON ]
    ]
    ],
    [ Species.WIGGLYTUFF, Type.NORMAL, Type.FAIRY, [
      [ Biome.MEADOW, BiomePoolTier.UNCOMMON ],
      [ Biome.FAIRY_CAVE, BiomePoolTier.COMMON ],
      [ Biome.FAIRY_CAVE, BiomePoolTier.BOSS ]
    ]
    ],
    [ Species.ZUBAT, Type.POISON, Type.FLYING, [
      [ Biome.PLAINS, BiomePoolTier.COMMON, TimeOfDay.NIGHT ],
      [ Biome.CAVE, BiomePoolTier.COMMON ]
    ]
    ],
    [ Species.GOLBAT, Type.POISON, Type.FLYING, [
      [ Biome.PLAINS, BiomePoolTier.COMMON, TimeOfDay.NIGHT ],
      [ Biome.CAVE, BiomePoolTier.COMMON ]
    ]
    ],
    [ Species.ODDISH, Type.GRASS, Type.POISON, [
      [ Biome.TOWN, BiomePoolTier.UNCOMMON, [ TimeOfDay.DUSK, TimeOfDay.NIGHT ] ],
      [ Biome.TALL_GRASS, BiomePoolTier.COMMON, [ TimeOfDay.DUSK, TimeOfDay.NIGHT ] ]
    ]
    ],
    [ Species.GLOOM, Type.GRASS, Type.POISON, [
      [ Biome.TALL_GRASS, BiomePoolTier.COMMON, [ TimeOfDay.DUSK, TimeOfDay.NIGHT ] ]
    ]
    ],
    [ Species.VILEPLUME, Type.GRASS, Type.POISON, [
      [ Biome.TALL_GRASS, BiomePoolTier.BOSS, [ TimeOfDay.DUSK, TimeOfDay.NIGHT ] ]
    ]
    ],
    [ Species.PARAS, Type.BUG, Type.GRASS, [
      [ Biome.TOWN, BiomePoolTier.UNCOMMON, TimeOfDay.NIGHT ],
      [ Biome.TALL_GRASS, BiomePoolTier.UNCOMMON, TimeOfDay.NIGHT ],
      [ Biome.CAVE, BiomePoolTier.COMMON ]
    ]
    ],
    [ Species.PARASECT, Type.BUG, Type.GRASS, [
      [ Biome.TALL_GRASS, BiomePoolTier.UNCOMMON, TimeOfDay.NIGHT ],
      [ Biome.CAVE, BiomePoolTier.COMMON ],
      [ Biome.CAVE, BiomePoolTier.BOSS ]
    ]
    ],
    [ Species.VENONAT, Type.BUG, Type.POISON, [
      [ Biome.TOWN, BiomePoolTier.UNCOMMON, TimeOfDay.NIGHT ],
      [ Biome.TALL_GRASS, BiomePoolTier.UNCOMMON, TimeOfDay.NIGHT ],
      [ Biome.FOREST, BiomePoolTier.COMMON, TimeOfDay.NIGHT ]
    ]
    ],
    [ Species.VENOMOTH, Type.BUG, Type.POISON, [
      [ Biome.TALL_GRASS, BiomePoolTier.UNCOMMON, TimeOfDay.NIGHT ],
      [ Biome.FOREST, BiomePoolTier.COMMON, TimeOfDay.NIGHT ],
      [ Biome.FOREST, BiomePoolTier.BOSS, TimeOfDay.NIGHT ]
    ]
    ],
    [ Species.DIGLETT, Type.GROUND, -1, [
      [ Biome.BADLANDS, BiomePoolTier.COMMON ]
    ]
    ],
    [ Species.DUGTRIO, Type.GROUND, -1, [
      [ Biome.BADLANDS, BiomePoolTier.COMMON ],
      [ Biome.BADLANDS, BiomePoolTier.BOSS ]
    ]
    ],
    [ Species.MEOWTH, Type.NORMAL, -1, [
      [ Biome.TOWN, BiomePoolTier.UNCOMMON, [ TimeOfDay.DUSK, TimeOfDay.NIGHT ] ],
      [ Biome.PLAINS, BiomePoolTier.COMMON, [ TimeOfDay.DUSK, TimeOfDay.NIGHT ] ]
    ]
    ],
    [ Species.PERSIAN, Type.NORMAL, -1, [
      [ Biome.PLAINS, BiomePoolTier.COMMON, [ TimeOfDay.DUSK, TimeOfDay.NIGHT ] ],
      [ Biome.PLAINS, BiomePoolTier.BOSS, [ TimeOfDay.DUSK, TimeOfDay.NIGHT ] ]
    ]
    ],
    [ Species.PSYDUCK, Type.WATER, -1, [
      [ Biome.SWAMP, BiomePoolTier.UNCOMMON ],
      [ Biome.LAKE, BiomePoolTier.COMMON ]
    ]
    ],
    [ Species.GOLDUCK, Type.WATER, -1, [
      [ Biome.SWAMP, BiomePoolTier.UNCOMMON ],
      [ Biome.LAKE, BiomePoolTier.COMMON ],
      [ Biome.LAKE, BiomePoolTier.BOSS ]
    ]
    ],
    [ Species.MANKEY, Type.FIGHTING, -1, [
      [ Biome.PLAINS, BiomePoolTier.UNCOMMON, [ TimeOfDay.DUSK, TimeOfDay.NIGHT ] ],
      [ Biome.DOJO, BiomePoolTier.COMMON ]
    ]
    ],
    [ Species.PRIMEAPE, Type.FIGHTING, -1, [
      [ Biome.PLAINS, BiomePoolTier.UNCOMMON, [ TimeOfDay.DUSK, TimeOfDay.NIGHT ] ],
      [ Biome.DOJO, BiomePoolTier.COMMON ]
    ]
    ],
    [ Species.GROWLITHE, Type.FIRE, -1, [
      [ Biome.GRASS, BiomePoolTier.RARE ],
      [ Biome.VOLCANO, BiomePoolTier.COMMON ]
    ]
    ],
    [ Species.ARCANINE, Type.FIRE, -1, [
      [ Biome.VOLCANO, BiomePoolTier.BOSS ]
    ]
    ],
    [ Species.POLIWAG, Type.WATER, -1, [
      [ Biome.SEA, BiomePoolTier.UNCOMMON ],
      [ Biome.SWAMP, BiomePoolTier.COMMON ]
    ]
    ],
    [ Species.POLIWHIRL, Type.WATER, -1, [
      [ Biome.SEA, BiomePoolTier.UNCOMMON ],
      [ Biome.SWAMP, BiomePoolTier.COMMON ]
    ]
    ],
    [ Species.POLIWRATH, Type.WATER, Type.FIGHTING, [
      [ Biome.SWAMP, BiomePoolTier.BOSS ]
    ]
    ],
    [ Species.ABRA, Type.PSYCHIC, -1, [
      [ Biome.TOWN, BiomePoolTier.RARE ],
      [ Biome.PLAINS, BiomePoolTier.RARE ],
      [ Biome.RUINS, BiomePoolTier.UNCOMMON ]
    ]
    ],
    [ Species.KADABRA, Type.PSYCHIC, -1, [
      [ Biome.PLAINS, BiomePoolTier.RARE ],
      [ Biome.RUINS, BiomePoolTier.UNCOMMON ]
    ]
    ],
    [ Species.ALAKAZAM, Type.PSYCHIC, -1, [
      [ Biome.RUINS, BiomePoolTier.BOSS ]
    ]
    ],
    [ Species.MACHOP, Type.FIGHTING, -1, [
      [ Biome.MOUNTAIN, BiomePoolTier.UNCOMMON ],
      [ Biome.FACTORY, BiomePoolTier.COMMON ],
      [ Biome.CONSTRUCTION_SITE, BiomePoolTier.COMMON ]
    ]
    ],
    [ Species.MACHOKE, Type.FIGHTING, -1, [
      [ Biome.MOUNTAIN, BiomePoolTier.UNCOMMON ],
      [ Biome.FACTORY, BiomePoolTier.COMMON ],
      [ Biome.CONSTRUCTION_SITE, BiomePoolTier.COMMON ]
    ]
    ],
    [ Species.MACHAMP, Type.FIGHTING, -1, [
      [ Biome.CONSTRUCTION_SITE, BiomePoolTier.BOSS ]
    ]
    ],
    [ Species.BELLSPROUT, Type.GRASS, Type.POISON, [
      [ Biome.TOWN, BiomePoolTier.UNCOMMON, [ TimeOfDay.DAWN, TimeOfDay.DAY ] ],
      [ Biome.FOREST, BiomePoolTier.COMMON, [ TimeOfDay.DAWN, TimeOfDay.DAY ] ]
    ]
    ],
    [ Species.WEEPINBELL, Type.GRASS, Type.POISON, [
      [ Biome.FOREST, BiomePoolTier.COMMON, [ TimeOfDay.DAWN, TimeOfDay.DAY ] ]
    ]
    ],
    [ Species.VICTREEBEL, Type.GRASS, Type.POISON, [
      [ Biome.FOREST, BiomePoolTier.BOSS, [ TimeOfDay.DAWN, TimeOfDay.DAY ] ]
    ]
    ],
    [ Species.TENTACOOL, Type.WATER, Type.POISON, [
      [ Biome.SEA, BiomePoolTier.COMMON ],
      [ Biome.SEABED, BiomePoolTier.UNCOMMON ]
    ]
    ],
    [ Species.TENTACRUEL, Type.WATER, Type.POISON, [
      [ Biome.SEA, BiomePoolTier.COMMON ],
      [ Biome.SEA, BiomePoolTier.BOSS ],
      [ Biome.SEABED, BiomePoolTier.UNCOMMON ]
    ]
    ],
    [ Species.GEODUDE, Type.ROCK, Type.GROUND, [
      [ Biome.MOUNTAIN, BiomePoolTier.UNCOMMON ],
      [ Biome.BADLANDS, BiomePoolTier.COMMON ],
      [ Biome.CAVE, BiomePoolTier.UNCOMMON ]
    ]
    ],
    [ Species.GRAVELER, Type.ROCK, Type.GROUND, [
      [ Biome.MOUNTAIN, BiomePoolTier.UNCOMMON ],
      [ Biome.BADLANDS, BiomePoolTier.COMMON ],
      [ Biome.CAVE, BiomePoolTier.UNCOMMON ]
    ]
    ],
    [ Species.GOLEM, Type.ROCK, Type.GROUND, [
      [ Biome.BADLANDS, BiomePoolTier.BOSS ]
    ]
    ],
    [ Species.PONYTA, Type.FIRE, -1, [
      [ Biome.MEADOW, BiomePoolTier.UNCOMMON, [ TimeOfDay.DAWN, TimeOfDay.DAY ] ],
      [ Biome.VOLCANO, BiomePoolTier.COMMON ]
    ]
    ],
    [ Species.RAPIDASH, Type.FIRE, -1, [
      [ Biome.MEADOW, BiomePoolTier.UNCOMMON, [ TimeOfDay.DAWN, TimeOfDay.DAY ] ],
      [ Biome.VOLCANO, BiomePoolTier.COMMON ],
      [ Biome.VOLCANO, BiomePoolTier.BOSS ]
    ]
    ],
    [ Species.SLOWPOKE, Type.WATER, Type.PSYCHIC, [
      [ Biome.SEA, BiomePoolTier.COMMON, [ TimeOfDay.DAWN, TimeOfDay.DAY ] ],
      [ Biome.SEA, BiomePoolTier.UNCOMMON, [ TimeOfDay.DUSK, TimeOfDay.NIGHT ] ],
      [ Biome.LAKE, BiomePoolTier.UNCOMMON ]
    ]
    ],
    [ Species.SLOWBRO, Type.WATER, Type.PSYCHIC, [
      [ Biome.SEA, BiomePoolTier.COMMON, [ TimeOfDay.DAWN, TimeOfDay.DAY ] ],
      [ Biome.SEA, BiomePoolTier.UNCOMMON, [ TimeOfDay.DUSK, TimeOfDay.NIGHT ] ],
      [ Biome.LAKE, BiomePoolTier.UNCOMMON ],
      [ Biome.LAKE, BiomePoolTier.BOSS ]
    ]
    ],
    [ Species.MAGNEMITE, Type.ELECTRIC, Type.STEEL, [
      [ Biome.POWER_PLANT, BiomePoolTier.COMMON ],
      [ Biome.FACTORY, BiomePoolTier.COMMON ],
      [ Biome.CONSTRUCTION_SITE, BiomePoolTier.COMMON ],
      [ Biome.LABORATORY, BiomePoolTier.COMMON ]
    ]
    ],
    [ Species.MAGNETON, Type.ELECTRIC, Type.STEEL, [
      [ Biome.POWER_PLANT, BiomePoolTier.COMMON ],
      [ Biome.FACTORY, BiomePoolTier.COMMON ],
      [ Biome.CONSTRUCTION_SITE, BiomePoolTier.COMMON ],
      [ Biome.LABORATORY, BiomePoolTier.COMMON ]
    ]
    ],
    [ Species.FARFETCHD, Type.NORMAL, Type.FLYING, [
      [ Biome.PLAINS, BiomePoolTier.SUPER_RARE ],
      [ Biome.PLAINS, BiomePoolTier.BOSS_RARE ]
    ]
    ],
    [ Species.DODUO, Type.NORMAL, Type.FLYING, [
      [ Biome.PLAINS, BiomePoolTier.UNCOMMON, [ TimeOfDay.DAWN, TimeOfDay.DAY ] ]
    ]
    ],
    [ Species.DODRIO, Type.NORMAL, Type.FLYING, [
      [ Biome.PLAINS, BiomePoolTier.UNCOMMON, [ TimeOfDay.DAWN, TimeOfDay.DAY ] ],
      [ Biome.PLAINS, BiomePoolTier.BOSS, [ TimeOfDay.DAWN, TimeOfDay.DAY ] ]
    ]
    ],
    [ Species.SEEL, Type.WATER, -1, [
      [ Biome.ICE_CAVE, BiomePoolTier.COMMON ]
    ]
    ],
    [ Species.DEWGONG, Type.WATER, Type.ICE, [
      [ Biome.ICE_CAVE, BiomePoolTier.COMMON ],
      [ Biome.ICE_CAVE, BiomePoolTier.BOSS ]
    ]
    ],
    [ Species.GRIMER, Type.POISON, -1, [
      [ Biome.SLUM, BiomePoolTier.COMMON ],
      [ Biome.CONSTRUCTION_SITE, BiomePoolTier.UNCOMMON ],
      [ Biome.LABORATORY, BiomePoolTier.COMMON ]
    ]
    ],
    [ Species.MUK, Type.POISON, -1, [
      [ Biome.CONSTRUCTION_SITE, BiomePoolTier.UNCOMMON ],
      [ Biome.SLUM, BiomePoolTier.COMMON ],
      [ Biome.SLUM, BiomePoolTier.BOSS ],
      [ Biome.LABORATORY, BiomePoolTier.COMMON ],
      [ Biome.LABORATORY, BiomePoolTier.BOSS ]
    ]
    ],
    [ Species.SHELLDER, Type.WATER, -1, [
      [ Biome.SEA, BiomePoolTier.UNCOMMON, [ TimeOfDay.DUSK, TimeOfDay.NIGHT ] ],
      [ Biome.BEACH, BiomePoolTier.COMMON, [ TimeOfDay.DUSK, TimeOfDay.NIGHT ] ],
      [ Biome.SEABED, BiomePoolTier.UNCOMMON ]
    ]
    ],
    [ Species.CLOYSTER, Type.WATER, Type.ICE, [
      [ Biome.BEACH, BiomePoolTier.BOSS, [ TimeOfDay.DUSK, TimeOfDay.NIGHT ] ]
    ]
    ],
    [ Species.GASTLY, Type.GHOST, Type.POISON, [
      [ Biome.GRAVEYARD, BiomePoolTier.COMMON ],
      [ Biome.TEMPLE, BiomePoolTier.COMMON ]
    ]
    ],
    [ Species.HAUNTER, Type.GHOST, Type.POISON, [
      [ Biome.GRAVEYARD, BiomePoolTier.COMMON ],
      [ Biome.TEMPLE, BiomePoolTier.COMMON ]
    ]
    ],
    [ Species.GENGAR, Type.GHOST, Type.POISON, [
      [ Biome.GRAVEYARD, BiomePoolTier.BOSS ]
    ]
    ],
    [ Species.ONIX, Type.ROCK, Type.GROUND, [
      [ Biome.BADLANDS, BiomePoolTier.RARE ],
      [ Biome.CAVE, BiomePoolTier.RARE ],
      [ Biome.CAVE, BiomePoolTier.BOSS ],
      [ Biome.CONSTRUCTION_SITE, BiomePoolTier.RARE ]
    ]
    ],
    [ Species.DROWZEE, Type.PSYCHIC, -1, [
      [ Biome.RUINS, BiomePoolTier.COMMON ]
    ]
    ],
    [ Species.HYPNO, Type.PSYCHIC, -1, [
      [ Biome.RUINS, BiomePoolTier.COMMON ],
      [ Biome.RUINS, BiomePoolTier.BOSS ]
    ]
    ],
    [ Species.KRABBY, Type.WATER, -1, [
      [ Biome.BEACH, BiomePoolTier.COMMON ]
    ]
    ],
    [ Species.KINGLER, Type.WATER, -1, [
      [ Biome.BEACH, BiomePoolTier.COMMON ],
      [ Biome.BEACH, BiomePoolTier.BOSS ]
    ]
    ],
    [ Species.VOLTORB, Type.ELECTRIC, -1, [
      [ Biome.POWER_PLANT, BiomePoolTier.COMMON ],
      [ Biome.FACTORY, BiomePoolTier.COMMON ],
      [ Biome.LABORATORY, BiomePoolTier.COMMON ]
    ]
    ],
    [ Species.ELECTRODE, Type.ELECTRIC, -1, [
      [ Biome.POWER_PLANT, BiomePoolTier.COMMON ],
      [ Biome.FACTORY, BiomePoolTier.COMMON ],
      [ Biome.LABORATORY, BiomePoolTier.COMMON ],
      [ Biome.LABORATORY, BiomePoolTier.BOSS ]
    ]
    ],
    [ Species.EXEGGCUTE, Type.GRASS, Type.PSYCHIC, [
      [ Biome.FOREST, BiomePoolTier.RARE, [ TimeOfDay.DAWN, TimeOfDay.DAY ] ],
      [ Biome.JUNGLE, BiomePoolTier.UNCOMMON, [ TimeOfDay.DAWN, TimeOfDay.DAY ] ]
    ]
    ],
    [ Species.EXEGGUTOR, Type.GRASS, Type.PSYCHIC, [
      [ Biome.JUNGLE, BiomePoolTier.BOSS, [ TimeOfDay.DAWN, TimeOfDay.DAY ] ]
    ]
    ],
    [ Species.CUBONE, Type.GROUND, -1, [
      [ Biome.BADLANDS, BiomePoolTier.COMMON, TimeOfDay.NIGHT ],
      [ Biome.GRAVEYARD, BiomePoolTier.UNCOMMON ],
      [ Biome.TEMPLE, BiomePoolTier.UNCOMMON ]
    ]
    ],
    [ Species.MAROWAK, Type.GROUND, -1, [
      [ Biome.BADLANDS, BiomePoolTier.COMMON, TimeOfDay.NIGHT ],
      [ Biome.GRAVEYARD, BiomePoolTier.UNCOMMON ],
      [ Biome.TEMPLE, BiomePoolTier.UNCOMMON ],
      [ Biome.BADLANDS, BiomePoolTier.BOSS, TimeOfDay.NIGHT ],
      [ Biome.GRAVEYARD, BiomePoolTier.BOSS, [ TimeOfDay.DAWN, TimeOfDay.DAY, TimeOfDay.DUSK ] ]
    ]
    ],
    [ Species.HITMONLEE, Type.FIGHTING, -1, [
      [ Biome.DOJO, BiomePoolTier.RARE ],
      [ Biome.DOJO, BiomePoolTier.BOSS ],
      [ Biome.CONSTRUCTION_SITE, BiomePoolTier.RARE ]
    ]
    ],
    [ Species.HITMONCHAN, Type.FIGHTING, -1, [
      [ Biome.DOJO, BiomePoolTier.RARE ],
      [ Biome.DOJO, BiomePoolTier.BOSS ],
      [ Biome.CONSTRUCTION_SITE, BiomePoolTier.RARE ]
    ]
    ],
    [ Species.LICKITUNG, Type.NORMAL, -1, [
      [ Biome.PLAINS, BiomePoolTier.SUPER_RARE ]
    ]
    ],
    [ Species.KOFFING, Type.POISON, -1, [
      [ Biome.SLUM, BiomePoolTier.COMMON ],
      [ Biome.CONSTRUCTION_SITE, BiomePoolTier.UNCOMMON ]
    ]
    ],
    [ Species.WEEZING, Type.POISON, -1, [
      [ Biome.SLUM, BiomePoolTier.COMMON ],
      [ Biome.SLUM, BiomePoolTier.BOSS ],
      [ Biome.CONSTRUCTION_SITE, BiomePoolTier.UNCOMMON ]
    ]
    ],
    [ Species.RHYHORN, Type.GROUND, Type.ROCK, [
      [ Biome.MOUNTAIN, BiomePoolTier.COMMON, [ TimeOfDay.DUSK, TimeOfDay.NIGHT ] ],
      [ Biome.MOUNTAIN, BiomePoolTier.UNCOMMON, [ TimeOfDay.DAWN, TimeOfDay.DAY ] ],
      [ Biome.BADLANDS, BiomePoolTier.COMMON ],
      [ Biome.CONSTRUCTION_SITE, BiomePoolTier.UNCOMMON ]
    ]
    ],
    [ Species.RHYDON, Type.GROUND, Type.ROCK, [
      [ Biome.MOUNTAIN, BiomePoolTier.COMMON, [ TimeOfDay.DUSK, TimeOfDay.NIGHT ] ],
      [ Biome.MOUNTAIN, BiomePoolTier.UNCOMMON, [ TimeOfDay.DAWN, TimeOfDay.DAY ] ],
      [ Biome.BADLANDS, BiomePoolTier.COMMON ],
      [ Biome.CONSTRUCTION_SITE, BiomePoolTier.UNCOMMON ]
    ]
    ],
    [ Species.CHANSEY, Type.NORMAL, -1, [
      [ Biome.PLAINS, BiomePoolTier.SUPER_RARE ],
      [ Biome.MEADOW, BiomePoolTier.SUPER_RARE ]
    ]
    ],
    [ Species.TANGELA, Type.GRASS, -1, [
      [ Biome.JUNGLE, BiomePoolTier.UNCOMMON, [ TimeOfDay.DUSK, TimeOfDay.NIGHT ] ]
    ]
    ],
    [ Species.KANGASKHAN, Type.NORMAL, -1, [
      [ Biome.JUNGLE, BiomePoolTier.SUPER_RARE ],
      [ Biome.JUNGLE, BiomePoolTier.BOSS_RARE ]
    ]
    ],
    [ Species.HORSEA, Type.WATER, -1, [
      [ Biome.SEA, BiomePoolTier.UNCOMMON ]
    ]
    ],
    [ Species.SEADRA, Type.WATER, -1, [
      [ Biome.SEA, BiomePoolTier.UNCOMMON ]
    ]
    ],
    [ Species.GOLDEEN, Type.WATER, -1, [
      [ Biome.LAKE, BiomePoolTier.COMMON ],
      [ Biome.SEA, BiomePoolTier.UNCOMMON ]
    ]
    ],
    [ Species.SEAKING, Type.WATER, -1, [
      [ Biome.LAKE, BiomePoolTier.COMMON ],
      [ Biome.LAKE, BiomePoolTier.BOSS ],
      [ Biome.SEA, BiomePoolTier.UNCOMMON ]
    ]
    ],
    [ Species.STARYU, Type.WATER, -1, [
      [ Biome.BEACH, BiomePoolTier.COMMON, [ TimeOfDay.DAWN, TimeOfDay.DAY ] ],
      [ Biome.SEA, BiomePoolTier.UNCOMMON, [ TimeOfDay.DAWN, TimeOfDay.DAY ] ]
    ]
    ],
    [ Species.STARMIE, Type.WATER, Type.PSYCHIC, [
      [ Biome.BEACH, BiomePoolTier.COMMON, [ TimeOfDay.DAWN, TimeOfDay.DAY ] ],
      [ Biome.BEACH, BiomePoolTier.BOSS, [ TimeOfDay.DAWN, TimeOfDay.DAY ] ],
      [ Biome.SEA, BiomePoolTier.UNCOMMON, [ TimeOfDay.DAWN, TimeOfDay.DAY ] ]
    ]
    ],
    [ Species.MR_MIME, Type.PSYCHIC, Type.FAIRY, [
      [ Biome.RUINS, BiomePoolTier.RARE ],
      [ Biome.RUINS, BiomePoolTier.BOSS_RARE ]
    ]
    ],
    [ Species.SCYTHER, Type.BUG, Type.FLYING, [
      [ Biome.TALL_GRASS, BiomePoolTier.SUPER_RARE ],
      [ Biome.FOREST, BiomePoolTier.RARE, [ TimeOfDay.DUSK, TimeOfDay.NIGHT ] ],
      [ Biome.JUNGLE, BiomePoolTier.RARE ]
    ]
    ],
    [ Species.JYNX, Type.ICE, Type.PSYCHIC, [
      [ Biome.ICE_CAVE, BiomePoolTier.RARE ],
      [ Biome.ICE_CAVE, BiomePoolTier.BOSS_RARE ]
    ]
    ],
    [ Species.ELECTABUZZ, Type.ELECTRIC, -1, [
      [ Biome.POWER_PLANT, BiomePoolTier.UNCOMMON ]
    ]
    ],
    [ Species.MAGMAR, Type.FIRE, -1, [
      [ Biome.VOLCANO, BiomePoolTier.UNCOMMON ]
    ]
    ],
    [ Species.PINSIR, Type.BUG, -1, [
      [ Biome.TALL_GRASS, BiomePoolTier.RARE ],
      [ Biome.TALL_GRASS, BiomePoolTier.BOSS_RARE ]
    ]
    ],
    [ Species.TAUROS, Type.NORMAL, -1, [
      [ Biome.MEADOW, BiomePoolTier.RARE ],
      [ Biome.MEADOW, BiomePoolTier.BOSS ]
    ]
    ],
    [ Species.MAGIKARP, Type.WATER, -1, [
      [ Biome.SEA, BiomePoolTier.COMMON ],
      [ Biome.LAKE, BiomePoolTier.COMMON ]
    ]
    ],
    [ Species.GYARADOS, Type.WATER, Type.FLYING, [
      [ Biome.SEA, BiomePoolTier.COMMON ],
      [ Biome.LAKE, BiomePoolTier.COMMON ],
      [ Biome.LAKE, BiomePoolTier.BOSS ]
    ]
    ],
    [ Species.LAPRAS, Type.WATER, Type.ICE, [
      [ Biome.SEA, BiomePoolTier.RARE ],
      [ Biome.ICE_CAVE, BiomePoolTier.RARE ],
      [ Biome.ICE_CAVE, BiomePoolTier.BOSS_RARE ]
    ]
    ],
    [ Species.DITTO, Type.NORMAL, -1, [
      [ Biome.TOWN, BiomePoolTier.ULTRA_RARE ],
      [ Biome.PLAINS, BiomePoolTier.ULTRA_RARE ],
      [ Biome.METROPOLIS, BiomePoolTier.SUPER_RARE ],
      [ Biome.CONSTRUCTION_SITE, BiomePoolTier.SUPER_RARE ],
      [ Biome.LABORATORY, BiomePoolTier.RARE ]
    ]
    ],
    [ Species.EEVEE, Type.NORMAL, -1, [
      [ Biome.TOWN, BiomePoolTier.SUPER_RARE ],
      [ Biome.PLAINS, BiomePoolTier.SUPER_RARE ],
      [ Biome.METROPOLIS, BiomePoolTier.SUPER_RARE ],
      [ Biome.MEADOW, BiomePoolTier.RARE ]
    ]
    ],
    [ Species.VAPOREON, Type.WATER, -1, [
      [ Biome.LAKE, BiomePoolTier.SUPER_RARE ],
      [ Biome.LAKE, BiomePoolTier.BOSS_RARE ]
    ]
    ],
    [ Species.JOLTEON, Type.ELECTRIC, -1, [
      [ Biome.POWER_PLANT, BiomePoolTier.SUPER_RARE ],
      [ Biome.POWER_PLANT, BiomePoolTier.BOSS_RARE ]
    ]
    ],
    [ Species.FLAREON, Type.FIRE, -1, [
      [ Biome.VOLCANO, BiomePoolTier.SUPER_RARE ],
      [ Biome.VOLCANO, BiomePoolTier.BOSS_RARE ]
    ]
    ],
    [ Species.PORYGON, Type.NORMAL, -1, [
      [ Biome.FACTORY, BiomePoolTier.RARE ],
      [ Biome.SPACE, BiomePoolTier.SUPER_RARE ],
      [ Biome.LABORATORY, BiomePoolTier.RARE ]
    ]
    ],
    [ Species.OMANYTE, Type.ROCK, Type.WATER, [
      [ Biome.SEABED, BiomePoolTier.SUPER_RARE ]
    ]
    ],
    [ Species.OMASTAR, Type.ROCK, Type.WATER, [
      [ Biome.SEABED, BiomePoolTier.SUPER_RARE ],
      [ Biome.SEABED, BiomePoolTier.BOSS_RARE ]
    ]
    ],
    [ Species.KABUTO, Type.ROCK, Type.WATER, [
      [ Biome.SEABED, BiomePoolTier.SUPER_RARE ]
    ]
    ],
    [ Species.KABUTOPS, Type.ROCK, Type.WATER, [
      [ Biome.SEABED, BiomePoolTier.SUPER_RARE ],
      [ Biome.SEABED, BiomePoolTier.BOSS_RARE ]
    ]
    ],
    [ Species.AERODACTYL, Type.ROCK, Type.FLYING, [
      [ Biome.WASTELAND, BiomePoolTier.SUPER_RARE ],
      [ Biome.WASTELAND, BiomePoolTier.BOSS_RARE ]
    ]
    ],
    [ Species.SNORLAX, Type.NORMAL, -1, [
      [ Biome.PLAINS, BiomePoolTier.SUPER_RARE ],
      [ Biome.PLAINS, BiomePoolTier.BOSS_RARE ]
    ]
    ],
    [ Species.ARTICUNO, Type.ICE, Type.FLYING, [
      [ Biome.ICE_CAVE, BiomePoolTier.ULTRA_RARE ],
      [ Biome.ICE_CAVE, BiomePoolTier.BOSS_SUPER_RARE ]
    ]
    ],
    [ Species.ZAPDOS, Type.ELECTRIC, Type.FLYING, [
      [ Biome.POWER_PLANT, BiomePoolTier.BOSS_SUPER_RARE ]
    ]
    ],
    [ Species.MOLTRES, Type.FIRE, Type.FLYING, [
      [ Biome.VOLCANO, BiomePoolTier.BOSS_SUPER_RARE ]
    ]
    ],
    [ Species.DRATINI, Type.DRAGON, -1, [
      [ Biome.WASTELAND, BiomePoolTier.RARE ]
    ]
    ],
    [ Species.DRAGONAIR, Type.DRAGON, -1, [
      [ Biome.WASTELAND, BiomePoolTier.RARE ]
    ]
    ],
    [ Species.DRAGONITE, Type.DRAGON, Type.FLYING, [
      [ Biome.WASTELAND, BiomePoolTier.RARE ],
      [ Biome.WASTELAND, BiomePoolTier.BOSS ]
    ]
    ],
    [ Species.MEWTWO, Type.PSYCHIC, -1, [
      [ Biome.LABORATORY, BiomePoolTier.BOSS_ULTRA_RARE ]
    ]
    ],
    [ Species.MEW, Type.PSYCHIC, -1, []
    ],
  ];


  const trainerBiomes = [
    [ TrainerType.ACE_TRAINER, [
      [ Biome.PLAINS, BiomePoolTier.UNCOMMON ],
      [ Biome.GRASS, BiomePoolTier.UNCOMMON ],
      [ Biome.TALL_GRASS, BiomePoolTier.UNCOMMON ],
      [ Biome.SWAMP, BiomePoolTier.UNCOMMON ],
      [ Biome.BEACH, BiomePoolTier.UNCOMMON ],
      [ Biome.LAKE, BiomePoolTier.UNCOMMON ],
      [ Biome.MOUNTAIN, BiomePoolTier.UNCOMMON ],
      [ Biome.BADLANDS, BiomePoolTier.UNCOMMON ],
      [ Biome.CAVE, BiomePoolTier.UNCOMMON ],
      [ Biome.MEADOW, BiomePoolTier.UNCOMMON ],
      [ Biome.RUINS, BiomePoolTier.UNCOMMON ],
      [ Biome.ABYSS, BiomePoolTier.UNCOMMON ],
      [ Biome.FAIRY_CAVE, BiomePoolTier.UNCOMMON ],
      [ Biome.TEMPLE, BiomePoolTier.UNCOMMON ]
    ]
    ],
    [ TrainerType.ARTIST, [
      [ Biome.METROPOLIS, BiomePoolTier.RARE ]
    ]
    ],
    [ TrainerType.BACKERS, [] ],
    [ TrainerType.BACKPACKER, [
      [ Biome.MOUNTAIN, BiomePoolTier.COMMON ],
      [ Biome.CAVE, BiomePoolTier.COMMON ],
      [ Biome.BADLANDS, BiomePoolTier.COMMON ],
      [ Biome.JUNGLE, BiomePoolTier.COMMON ]
    ]
    ],
    [ TrainerType.BAKER, [
      [ Biome.SLUM, BiomePoolTier.UNCOMMON ]
    ]
    ],
    [ TrainerType.BEAUTY, [
      [ Biome.FAIRY_CAVE, BiomePoolTier.COMMON ]
    ] ],
    [ TrainerType.BIKER, [
      [ Biome.SLUM, BiomePoolTier.COMMON ]
    ]
    ],
    [ TrainerType.BLACK_BELT, [
      [ Biome.DOJO, BiomePoolTier.COMMON ],
      [ Biome.PLAINS, BiomePoolTier.RARE ],
      [ Biome.GRASS, BiomePoolTier.RARE ],
      [ Biome.SWAMP, BiomePoolTier.RARE ],
      [ Biome.BEACH, BiomePoolTier.RARE ],
      [ Biome.LAKE, BiomePoolTier.RARE ],
      [ Biome.MOUNTAIN, BiomePoolTier.COMMON ],
      [ Biome.CAVE, BiomePoolTier.UNCOMMON ],
      [ Biome.RUINS, BiomePoolTier.UNCOMMON ]
    ]
    ],
    [ TrainerType.BREEDER, [
      [ Biome.PLAINS, BiomePoolTier.COMMON ],
      [ Biome.GRASS, BiomePoolTier.COMMON ],
      [ Biome.TALL_GRASS, BiomePoolTier.UNCOMMON ],
      [ Biome.METROPOLIS, BiomePoolTier.UNCOMMON ],
      [ Biome.BEACH, BiomePoolTier.UNCOMMON ],
      [ Biome.LAKE, BiomePoolTier.COMMON ],
      [ Biome.MEADOW, BiomePoolTier.UNCOMMON ],
      [ Biome.FAIRY_CAVE, BiomePoolTier.UNCOMMON ]
    ]
    ],
    [ TrainerType.CLERK, [
      [ Biome.METROPOLIS, BiomePoolTier.COMMON ]
    ] ],
    [ TrainerType.DEPOT_AGENT, [
      [ Biome.METROPOLIS, BiomePoolTier.UNCOMMON ]
    ] ],
    [ TrainerType.DOCTOR, [] ],
    [ TrainerType.FISHERMAN, [
      [ Biome.LAKE, BiomePoolTier.COMMON ],
      [ Biome.BEACH, BiomePoolTier.COMMON ]
    ]
    ],
    [ TrainerType.RICH, [] ],
    [ TrainerType.GUITARIST, [
      [ Biome.METROPOLIS, BiomePoolTier.UNCOMMON ],
      [ Biome.POWER_PLANT, BiomePoolTier.COMMON ]
    ] ],
    [ TrainerType.HARLEQUIN, [] ],
    [ TrainerType.HIKER, [
      [ Biome.MOUNTAIN, BiomePoolTier.COMMON ],
      [ Biome.CAVE, BiomePoolTier.COMMON ],
      [ Biome.BADLANDS, BiomePoolTier.COMMON ]
    ]
    ],
    [ TrainerType.HOOLIGANS, [] ],
    [ TrainerType.HOOPSTER, [] ],
    [ TrainerType.INFIELDER, [] ],
    [ TrainerType.JANITOR, [] ],
    [ TrainerType.LINEBACKER, [] ],
    [ TrainerType.MAID, [] ],
    [ TrainerType.MUSICIAN, [] ],
    [ TrainerType.NURSERY_AIDE, [] ],
    [ TrainerType.OFFICER, [
      [ Biome.METROPOLIS, BiomePoolTier.COMMON ],
      [ Biome.CONSTRUCTION_SITE, BiomePoolTier.COMMON ],
      [ Biome.SLUM, BiomePoolTier.COMMON ]
    ]
    ],
    [ TrainerType.PARASOL_LADY, [
      [ Biome.BEACH, BiomePoolTier.COMMON ],
      [ Biome.MEADOW, BiomePoolTier.COMMON ]
    ]
    ],
    [ TrainerType.PILOT, [] ],
    [ TrainerType.POKEFAN, [] ],
    [ TrainerType.PRESCHOOLER, [] ],
    [ TrainerType.PSYCHIC, [
      [ Biome.GRAVEYARD, BiomePoolTier.COMMON ],
      [ Biome.RUINS, BiomePoolTier.COMMON ]
    ]
    ],
    [ TrainerType.RANGER, [
      [ Biome.TALL_GRASS, BiomePoolTier.UNCOMMON ],
      [ Biome.FOREST, BiomePoolTier.COMMON ],
      [ Biome.JUNGLE, BiomePoolTier.COMMON ]
    ]
    ],
    [ TrainerType.RICH_KID, [] ],
    [ TrainerType.ROUGHNECK, [
      [ Biome.SLUM, BiomePoolTier.COMMON ]
    ]
    ],
    [ TrainerType.SCIENTIST, [
      [ Biome.DESERT, BiomePoolTier.COMMON ],
      [ Biome.RUINS, BiomePoolTier.COMMON ]
    ]
    ],
    [ TrainerType.SMASHER, [] ],
    [ TrainerType.SNOW_WORKER, [
      [ Biome.ICE_CAVE, BiomePoolTier.COMMON ],
      [ Biome.SNOWY_FOREST, BiomePoolTier.COMMON ]
    ]
    ],
    [ TrainerType.STRIKER, [] ],
    [ TrainerType.SCHOOL_KID, [
      [ Biome.GRASS, BiomePoolTier.COMMON ]
    ]
    ],
    [ TrainerType.SWIMMER, [
      [ Biome.SEA, BiomePoolTier.COMMON ]
    ]
    ],
    [ TrainerType.TWINS, [
      [ Biome.PLAINS, BiomePoolTier.COMMON ]
    ]
    ],
    [ TrainerType.VETERAN, [
      [ Biome.WASTELAND, BiomePoolTier.COMMON ]
    ]
    ],
    [ TrainerType.WORKER, [
      [ Biome.POWER_PLANT, BiomePoolTier.COMMON ],
      [ Biome.FACTORY, BiomePoolTier.COMMON ],
      [ Biome.CONSTRUCTION_SITE, BiomePoolTier.COMMON ]
    ]
    ],
    [ TrainerType.YOUNGSTER, [
      [ Biome.TOWN, BiomePoolTier.COMMON ]
    ]
    ],
    [ TrainerType.HEX_MANIAC, [
      [ Biome.GRAVEYARD, BiomePoolTier.UNCOMMON ]
    ]
    ],
    [ TrainerType.FIREBREATHER, [
      [ Biome.VOLCANO, BiomePoolTier.COMMON ]
    ]
    ],
    [ TrainerType.SAILOR, [
      [ Biome.SEA, BiomePoolTier.COMMON ],
      [ Biome.BEACH, BiomePoolTier.COMMON ]
    ]
    ],
    [ TrainerType.BROCK, [
      [ Biome.CAVE, BiomePoolTier.BOSS ]
    ]
    ],
    [ TrainerType.MISTY, [
      [ Biome.BEACH, BiomePoolTier.BOSS ]
    ]
    ],
    [ TrainerType.LT_SURGE, [
      [ Biome.CONSTRUCTION_SITE, BiomePoolTier.BOSS ]
    ]
    ],
    [ TrainerType.ERIKA, [
      [ Biome.GRASS, BiomePoolTier.BOSS ]
    ]
    ],
    [ TrainerType.JANINE, [
      [ Biome.SWAMP, BiomePoolTier.BOSS ]
    ]
    ],
    [ TrainerType.SABRINA, [
      [ Biome.RUINS, BiomePoolTier.BOSS ]
    ]
    ],
    [ TrainerType.GIOVANNI, [
      [ Biome.LABORATORY, BiomePoolTier.BOSS ]
    ]
    ],
    [ TrainerType.BLAINE, [
      [ Biome.VOLCANO, BiomePoolTier.BOSS ]
    ]
    ],
    [ TrainerType.LORELEI, [] ],
    [ TrainerType.BRUNO, [] ],
    [ TrainerType.AGATHA, [] ],
    [ TrainerType.LANCE, [] ],
    [ TrainerType.BLUE, [] ],
    [ TrainerType.RED, [] ],
    [ TrainerType.RIVAL, [] ]
  ];

  biomeDepths[Biome.TOWN] = [ 0, 1 ];

  const traverseBiome = (biome: Biome, depth: integer) => {
    if (biome === Biome.END) {
      const biomeList = Object.keys(Biome).filter(key => !isNaN(Number(key)));
      biomeList.pop(); // Removes Biome.END from the list
      const randIndex = Utils.randInt(biomeList.length, 1); // Will never be Biome.TOWN
      biome = Biome[biomeList[randIndex]];
    }
    const linkedBiomes: (Biome | [ Biome, integer ])[] = Array.isArray(biomeLinks[biome])
      ? biomeLinks[biome] as (Biome | [ Biome, integer ])[]
      : [ biomeLinks[biome] as Biome ];
    for (const linkedBiomeEntry of linkedBiomes) {
      const linkedBiome = !Array.isArray(linkedBiomeEntry)
        ? linkedBiomeEntry as Biome
        : linkedBiomeEntry[0];
      const biomeChance = !Array.isArray(linkedBiomeEntry)
        ? 1
        : linkedBiomeEntry[1];
      if (!biomeDepths.hasOwnProperty(linkedBiome) || biomeChance < biomeDepths[linkedBiome][1] || (depth < biomeDepths[linkedBiome][0] && biomeChance === biomeDepths[linkedBiome][1])) {
        biomeDepths[linkedBiome] = [ depth + 1, biomeChance ];
        traverseBiome(linkedBiome, depth + 1);
      }
    }
  };

  traverseBiome(Biome.TOWN, 0);
  biomeDepths[Biome.END] = [ Object.values(biomeDepths).map(d => d[0]).reduce((max: integer, value: integer) => Math.max(max, value), 0) + 1, 1 ];

  for (const biome of Utils.getEnumValues(Biome)) {
    biomePokemonPools[biome] = {};
    biomeTrainerPools[biome] = {};

    for (const tier of Utils.getEnumValues(BiomePoolTier)) {
      biomePokemonPools[biome][tier] = {};
      biomeTrainerPools[biome][tier] = [];

      for (const tod of Utils.getEnumValues(TimeOfDay)) {
        biomePokemonPools[biome][tier][tod] = [];
      }
    }
  }

  for (const pb of pokemonBiomes) {
    const speciesId = pb[0] as Species;
    const biomeEntries = pb[3] as (Biome | BiomePoolTier)[][];

    const speciesEvolutions: SpeciesFormEvolution[] = pokemonEvolutions.hasOwnProperty(speciesId)
      ? pokemonEvolutions[speciesId]
      : [];
    if (!biomeEntries.filter(b => b[0] !== Biome.END).length && !speciesEvolutions.filter(es => !!((pokemonBiomes.find(p => p[0] === es.speciesId)!)[3] as any[]).filter(b => b[0] !== Biome.END).length).length) { // TODO: is the bang on the `find()` correct?
      uncatchableSpecies.push(speciesId);
    }

    for (const b of biomeEntries) {
      const biome = b[0];
      const tier = b[1];
      const timesOfDay = b.length > 2
        ? Array.isArray(b[2])
          ? b[2]
          : [ b[2] ]
        : [ TimeOfDay.ALL ];

      for (const tod of timesOfDay) {
        if (!biomePokemonPools.hasOwnProperty(biome) || !biomePokemonPools[biome].hasOwnProperty(tier) || !biomePokemonPools[biome][tier].hasOwnProperty(tod)) {
          continue;
        }

        const biomeTierPool = biomePokemonPools[biome][tier][tod];

        let treeIndex = -1;
        let arrayIndex = 0;

        for (let t = 0; t < biomeTierPool.length; t++) {
          const existingSpeciesIds = biomeTierPool[t] as unknown as Species[];
          for (let es = 0; es < existingSpeciesIds.length; es++) {
            const existingSpeciesId = existingSpeciesIds[es];
            if (pokemonEvolutions.hasOwnProperty(existingSpeciesId) && (pokemonEvolutions[existingSpeciesId] as SpeciesFormEvolution[]).find(ese => ese.speciesId === speciesId)) {
              treeIndex = t;
              arrayIndex = es + 1;
              break;
            } else if (speciesEvolutions && speciesEvolutions.find(se => se.speciesId === existingSpeciesId)) {
              treeIndex = t;
              arrayIndex = es;
              break;
            }
          }
          if (treeIndex > -1) {
            break;
          }
        }

        if (treeIndex > -1) {
          (biomeTierPool[treeIndex] as unknown as Species[]).splice(arrayIndex, 0, speciesId);
        } else {
          (biomeTierPool as unknown as Species[][]).push([ speciesId ]);
        }
      }
    }
  }

  for (const b of Object.keys(biomePokemonPools)) {
    for (const t of Object.keys(biomePokemonPools[b])) {
      const tier = parseInt(t) as BiomePoolTier;
      for (const tod of Object.keys(biomePokemonPools[b][t])) {
        const biomeTierTimePool = biomePokemonPools[b][t][tod];
        for (let e = 0; e < biomeTierTimePool.length; e++) {
          const entry = biomeTierTimePool[e];
          if (entry.length === 1) {
            biomeTierTimePool[e] = entry[0];
          } else {
            const newEntry = {
              1: [ entry[0] ]
            };
            for (let s = 1; s < entry.length; s++) {
              const speciesId = entry[s];
              const prevolution = entry.map(s => pokemonEvolutions[s]).flat().find(e => e && e.speciesId === speciesId);
              const level = prevolution.level - (prevolution.level === 1 ? 1 : 0) + (prevolution.wildDelay * 10) - (tier >= BiomePoolTier.BOSS ? 10 : 0);
              if (!newEntry.hasOwnProperty(level)) {
                newEntry[level] = [ speciesId ];
              } else {
                newEntry[level].push(speciesId);
              }
            }
            biomeTierTimePool[e] = newEntry;
          }
        }
      }
    }
  }

  for (const tb of trainerBiomes) {
    const trainerType = tb[0] as TrainerType;
    const biomeEntries = tb[1] as BiomePoolTier[][];

    for (const b of biomeEntries) {
      const biome = b[0];
      const tier = b[1];

      if (!biomeTrainerPools.hasOwnProperty(biome) || !biomeTrainerPools[biome].hasOwnProperty(tier)) {
        continue;
      }

      const biomeTierPool = biomeTrainerPools[biome][tier];
      biomeTierPool.push(trainerType);
    }
    //outputPools();
  }


  // used in a commented code
  // function outputPools() {
  //   const pokemonOutput = {};
  //   const trainerOutput = {};

  //   for (const b of Object.keys(biomePokemonPools)) {
  //     const biome = Biome[b];
  //     pokemonOutput[biome] = {};
  //     trainerOutput[biome] = {};

  //     for (const t of Object.keys(biomePokemonPools[b])) {
  //       const tier = BiomePoolTier[t];

  //       pokemonOutput[biome][tier] = {};

  //       for (const tod of Object.keys(biomePokemonPools[b][t])) {
  //         const timeOfDay = TimeOfDay[tod];

  //         pokemonOutput[biome][tier][timeOfDay] = [];

  //         for (const f of biomePokemonPools[b][t][tod]) {
  //           if (typeof f === "number") {
  //             pokemonOutput[biome][tier][timeOfDay].push(Species[f]);
  //           } else {
  //             const tree = {};

  //             for (const l of Object.keys(f)) {
  //               tree[l] = f[l].map(s => Species[s]);
  //             }

  //             pokemonOutput[biome][tier][timeOfDay].push(tree);
  //           }
  //         }

  //       }
  //     }

  //     for (const t of Object.keys(biomeTrainerPools[b])) {
  //       const tier = BiomePoolTier[t];

  //       trainerOutput[biome][tier] = [];

  //       for (const f of biomeTrainerPools[b][t]) {
  //         trainerOutput[biome][tier].push(TrainerType[f]);
  //       }
  //     }
  //   }

  //   console.log(beautify(pokemonOutput, null, 2, 180).replace(/(        |        (?:\{ "\d+": \[ )?|    "(?:.*?)": \[ |(?:,|\[) (?:"\w+": \[ |(?:\{ )?"\d+": \[ )?)"(\w+)"(?= |,|\n)/g, "$1Species.$2").replace(/"(\d+)": /g, "$1: ").replace(/((?:      )|(?:(?!\n)    "(?:.*?)": \{) |\[(?: .*? )?\], )"(\w+)"/g, "$1[TimeOfDay.$2]").replace(/(    )"(.*?)"/g, "$1[BiomePoolTier.$2]").replace(/(  )"(.*?)"/g, "$1[Biome.$2]"));
  //   console.log(beautify(trainerOutput, null, 2, 120).replace(/(      |      (?:\{ "\d+": \[ )?|    "(?:.*?)": \[ |, (?:(?:\{ )?"\d+": \[ )?)"(.*?)"/g, "$1TrainerType.$2").replace(/"(\d+)": /g, "$1: ").replace(/(    )"(.*?)"/g, "$1[BiomePoolTier.$2]").replace(/(  )"(.*?)"/g, "$1[Biome.$2]"));
  // }

  /*for (let pokemon of allSpecies) {
    if (pokemon.speciesId >= )
      break;
    pokemonBiomes[pokemon.speciesId - 1][0] = Species[pokemonBiomes[pokemon.speciesId - 1][0]];
    pokemonBiomes[pokemon.speciesId - 1][1] = Type[pokemonBiomes[pokemon.speciesId - 1][1]];
    if (pokemonBiomes[pokemon.speciesId - 1][2] > -1)
      pokemonBiomes[pokemon.speciesId - 1][2] = Type[pokemonBiomes[pokemon.speciesId - 1][2]];
    for (let b of Utils.getEnumValues(Biome)) {
      if (biomePools.hasOwnProperty(b)) {
        let poolTier = -1;
        for (let t of Object.keys(biomePools[b])) {
          for (let p = 0; p < biomePools[b][t].length; p++) {
            if (biomePools[b][t][p] === pokemon.speciesId) {
              poolTier = parseInt(t) as BiomePoolTier;
              break;
            }
          }
        }
        if (poolTier > -1)
          pokemonBiomes[pokemon.speciesId - 1][3].push([ Biome[b], BiomePoolTier[poolTier] ]);
      } else if (biomePoolPredicates[b](pokemon)) {
        pokemonBiomes[pokemon.speciesId - 1][3].push([ Biome[b], BiomePoolTier[BiomePoolTier.COMMON] ]);
      }
    }
  }

  console.log(JSON.stringify(pokemonBiomes, null, '  '));*/
}
