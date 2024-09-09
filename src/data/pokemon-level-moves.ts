import { Moves } from "#enums/moves";
import { Species } from "#enums/species";

export type LevelMoves = ([integer, Moves])[];

interface PokemonSpeciesLevelMoves {
  [key: integer]: LevelMoves
}

interface PokemonFormLevelMoves {
  [key: integer]: LevelMoves
}

interface PokemonSpeciesFormLevelMoves {
  [key: integer]: PokemonFormLevelMoves
}

export const pokemonSpeciesLevelMoves: PokemonSpeciesLevelMoves = {
  [Species.BULBASAUR]: [
    [ 1, Moves.GROWL ],
    [ 1, Moves.TACKLE ],
    [ 7, Moves.LEECH_SEED ],
    [ 13, Moves.VINE_WHIP ],
    [ 20, Moves.POISON_POWDER ],
    [ 27, Moves.RAZOR_LEAF ],
    [ 34, Moves.GROWTH ],
    [ 41, Moves.SLEEP_POWDER ],
    [ 48, Moves.SOLAR_BEAM ]
  ],
  [Species.IVYSAUR]: [
    [ 1, Moves.GROWL ],
    [ 1, Moves.LEECH_SEED ],
    [ 1, Moves.TACKLE ],
    [ 7, Moves.LEECH_SEED ],
    [ 13, Moves.VINE_WHIP ],
    [ 22, Moves.POISON_POWDER ],
    [ 30, Moves.RAZOR_LEAF ],
    [ 38, Moves.GROWTH ],
    [ 46, Moves.SLEEP_POWDER ],
    [ 54, Moves.SOLAR_BEAM ]
  ],
  [Species.VENUSAUR]: [
    [ 1, Moves.GROWL ],
    [ 1, Moves.LEECH_SEED ],
    [ 1, Moves.TACKLE ],
    [ 1, Moves.VINE_WHIP ],
    [ 7, Moves.LEECH_SEED ],
    [ 13, Moves.VINE_WHIP ],
    [ 22, Moves.POISON_POWDER ],
    [ 30, Moves.RAZOR_LEAF ],
    [ 43, Moves.GROWTH ],
    [ 55, Moves.SLEEP_POWDER ],
    [ 65, Moves.SOLAR_BEAM ]
  ],
  [Species.CHARMANDER]: [
    [ 1, Moves.GROWL ],
    [ 1, Moves.SCRATCH ],
    [ 9, Moves.EMBER ],
    [ 15, Moves.LEER ],
    [ 22, Moves.RAGE ],
    [ 30, Moves.SLASH ],
    [ 38, Moves.FLAMETHROWER ],
    [ 46, Moves.FIRE_SPIN ]
  ],
  [Species.CHARMELEON]: [
    [ 1, Moves.EMBER ],
    [ 1, Moves.GROWL ],
    [ 1, Moves.SCRATCH ],
    [ 9, Moves.EMBER ],
    [ 15, Moves.LEER ],
    [ 24, Moves.RAGE ],
    [ 33, Moves.SLASH ],
    [ 42, Moves.FLAMETHROWER ],
    [ 56, Moves.FIRE_SPIN ]
  ],
  [Species.CHARIZARD]: [
    [ 1, Moves.EMBER ],
    [ 1, Moves.GROWL ],
    [ 1, Moves.LEER ],
    [ 1, Moves.SCRATCH ],
    [ 9, Moves.EMBER ],
    [ 15, Moves.LEER ],
    [ 24, Moves.RAGE ],
    [ 36, Moves.SLASH ],
    [ 46, Moves.FLAMETHROWER ],
    [ 55, Moves.FIRE_SPIN ]
  ],
  [Species.SQUIRTLE]: [
    [ 1, Moves.TACKLE ],
    [ 1, Moves.TAIL_WHIP ],
    [ 8, Moves.BUBBLE ],
    [ 15, Moves.WATER_GUN ],
    [ 22, Moves.BITE ],
    [ 28, Moves.WITHDRAW ],
    [ 35, Moves.SKULL_BASH ],
    [ 42, Moves.HYDRO_PUMP ]
  ],
  [Species.WARTORTLE]: [
    [ 1, Moves.BUBBLE ],
    [ 1, Moves.TACKLE ],
    [ 1, Moves.TAIL_WHIP ],
    [ 8, Moves.BUBBLE ],
    [ 15, Moves.WATER_GUN ],
    [ 24, Moves.BITE ],
    [ 31, Moves.WITHDRAW ],
    [ 39, Moves.SKULL_BASH ],
    [ 47, Moves.HYDRO_PUMP ]
  ],
  [Species.BLASTOISE]: [
    [ 1, Moves.BUBBLE ],
    [ 1, Moves.TACKLE ],
    [ 1, Moves.TAIL_WHIP ],
    [ 1, Moves.WATER_GUN ],
    [ 8, Moves.BUBBLE ],
    [ 15, Moves.WATER_GUN ],
    [ 24, Moves.BITE ],
    [ 31, Moves.WITHDRAW ],
    [ 42, Moves.SKULL_BASH ],
    [ 52, Moves.HYDRO_PUMP ]
  ],
  [Species.CATERPIE]: [
    [ 1, Moves.STRING_SHOT ],
    [ 1, Moves.TACKLE ]
  ],
  [Species.METAPOD]: [
    [ 1, Moves.HARDEN ]
  ],
  [Species.BUTTERFREE]: [
    [ 1, Moves.CONFUSION ],
    [ 12, Moves.CONFUSION ],
    [ 15, Moves.POISON_POWDER ],
    [ 16, Moves.STUN_SPORE ],
    [ 17, Moves.SLEEP_POWDER ],
    [ 21, Moves.SUPERSONIC ],
    [ 26, Moves.WHIRLWIND ],
    [ 32, Moves.PSYBEAM ]
  ],
  [Species.WEEDLE]: [
    [ 1, Moves.POISON_STING ],
    [ 1, Moves.STRING_SHOT ]
  ],
  [Species.KAKUNA]: [
    [ 1, Moves.HARDEN ]
  ],
  [Species.BEEDRILL]: [
    [ 1, Moves.FURY_ATTACK ],
    [ 12, Moves.FURY_ATTACK ],
    [ 16, Moves.FOCUS_ENERGY ],
    [ 20, Moves.TWINEEDLE ],
    [ 25, Moves.RAGE ],
    [ 30, Moves.PIN_MISSILE ],
    [ 35, Moves.AGILITY ]
  ],
  [Species.PIDGEY]: [
    [ 1, Moves.GUST ],
    [ 5, Moves.SAND_ATTACK ],
    [ 12, Moves.QUICK_ATTACK ],
    [ 19, Moves.WHIRLWIND ],
    [ 28, Moves.WING_ATTACK ],
    [ 36, Moves.AGILITY ],
    [ 44, Moves.MIRROR_MOVE ]
  ],
  [Species.PIDGEOTTO]: [
    [ 1, Moves.GUST ],
    [ 1, Moves.SAND_ATTACK ],
    [ 5, Moves.SAND_ATTACK ],
    [ 12, Moves.QUICK_ATTACK ],
    [ 21, Moves.WHIRLWIND ],
    [ 31, Moves.WING_ATTACK ],
    [ 40, Moves.AGILITY ],
    [ 49, Moves.MIRROR_MOVE ]
  ],
  [Species.PIDGEOT]: [
    [ 1, Moves.GUST ],
    [ 1, Moves.QUICK_ATTACK ],
    [ 1, Moves.SAND_ATTACK ],
    [ 5, Moves.SAND_ATTACK ],
    [ 12, Moves.QUICK_ATTACK ],
    [ 21, Moves.WHIRLWIND ],
    [ 31, Moves.WING_ATTACK ],
    [ 44, Moves.AGILITY ],
    [ 54, Moves.MIRROR_MOVE ]
  ],
  [Species.RATTATA]: [
    [ 1, Moves.TACKLE ],
    [ 1, Moves.TAIL_WHIP ],
    [ 7, Moves.QUICK_ATTACK ],
    [ 14, Moves.HYPER_FANG ],
    [ 23, Moves.FOCUS_ENERGY ],
    [ 34, Moves.SUPER_FANG ]
  ],
  [Species.RATICATE]: [
    [ 1, Moves.QUICK_ATTACK ],
    [ 1, Moves.TACKLE ],
    [ 1, Moves.TAIL_WHIP ],
    [ 7, Moves.QUICK_ATTACK ],
    [ 14, Moves.HYPER_FANG ],
    [ 27, Moves.FOCUS_ENERGY ],
    [ 41, Moves.SUPER_FANG ]
  ],
  [Species.SPEAROW]: [
    [ 1, Moves.GROWL ],
    [ 1, Moves.PECK ],
    [ 9, Moves.LEER ],
    [ 15, Moves.FURY_ATTACK ],
    [ 22, Moves.MIRROR_MOVE ],
    [ 29, Moves.DRILL_PECK ],
    [ 36, Moves.AGILITY ]
  ],
  [Species.FEAROW]: [
    [ 1, Moves.GROWL ],
    [ 1, Moves.LEER ],
    [ 1, Moves.PECK ],
    [ 9, Moves.LEER ],
    [ 15, Moves.FURY_ATTACK ],
    [ 25, Moves.MIRROR_MOVE ],
    [ 34, Moves.DRILL_PECK ],
    [ 43, Moves.AGILITY ]
  ],
  [Species.EKANS]: [
    [ 1, Moves.LEER ],
    [ 1, Moves.WRAP ],
    [ 10, Moves.POISON_STING ],
    [ 17, Moves.BITE ],
    [ 24, Moves.GLARE ],
    [ 31, Moves.SCREECH ],
    [ 38, Moves.ACID ]
  ],
  [Species.ARBOK]: [
    [ 1, Moves.LEER ],
    [ 1, Moves.POISON_STING ],
    [ 1, Moves.WRAP ],
    [ 10, Moves.POISON_STING ],
    [ 17, Moves.BITE ],
    [ 27, Moves.GLARE ],
    [ 36, Moves.SCREECH ],
    [ 47, Moves.ACID ]
  ],
  [Species.PIKACHU]: [
    [ 1, Moves.GROWL ],
    [ 1, Moves.THUNDER_SHOCK ],
    [ 9, Moves.THUNDER_WAVE ],
    [ 16, Moves.QUICK_ATTACK ],
    [ 26, Moves.SWIFT ],
    [ 33, Moves.AGILITY ],
    [ 43, Moves.THUNDER ]
  ],
  [Species.RAICHU]: [
    [ 1, Moves.GROWL ],
    [ 1, Moves.THUNDER_SHOCK ],
    [ 1, Moves.THUNDER_WAVE ]
  ],
  [Species.SANDSHREW]: [
    [ 1, Moves.SCRATCH ],
    [ 10, Moves.SAND_ATTACK ],
    [ 17, Moves.SLASH ],
    [ 24, Moves.POISON_STING ],
    [ 31, Moves.SWIFT ],
    [ 38, Moves.FURY_SWIPES ]
  ],
  [Species.SANDSLASH]: [
    [ 1, Moves.SAND_ATTACK ],
    [ 1, Moves.SCRATCH ],
    [ 10, Moves.SAND_ATTACK ],
    [ 17, Moves.SLASH ],
    [ 27, Moves.POISON_STING ],
    [ 36, Moves.SWIFT ],
    [ 47, Moves.FURY_SWIPES ]
  ],
  [Species.NIDORAN_F]: [
    [ 1, Moves.GROWL ],
    [ 1, Moves.TACKLE ],
    [ 8, Moves.SCRATCH ],
    [ 14, Moves.POISON_STING ],
    [ 21, Moves.TAIL_WHIP ],
    [ 29, Moves.BITE ],
    [ 36, Moves.FURY_SWIPES ],
    [ 43, Moves.DOUBLE_KICK ]
  ],
  [Species.NIDORINA]: [
    [ 1, Moves.GROWL ],
    [ 1, Moves.SCRATCH ],
    [ 1, Moves.TACKLE ],
    [ 8, Moves.SCRATCH ],
    [ 14, Moves.POISON_STING ],
    [ 23, Moves.TAIL_WHIP ],
    [ 32, Moves.BITE ],
    [ 41, Moves.FURY_SWIPES ],
    [ 50, Moves.DOUBLE_KICK ]
  ],
  [Species.NIDOQUEEN]: [
    [ 1, Moves.BODY_SLAM ],
    [ 1, Moves.SCRATCH ],
    [ 1, Moves.TACKLE ],
    [ 1, Moves.TAIL_WHIP ],
    [ 8, Moves.SCRATCH ],
    [ 14, Moves.POISON_STING ],
    [ 23, Moves.BODY_SLAM ]
  ],
  [Species.NIDORAN_M]: [
    [ 1, Moves.LEER ],
    [ 1, Moves.TACKLE ],
    [ 8, Moves.HORN_ATTACK ],
    [ 14, Moves.POISON_STING ],
    [ 21, Moves.FOCUS_ENERGY ],
    [ 29, Moves.FURY_ATTACK ],
    [ 36, Moves.HORN_DRILL ],
    [ 43, Moves.DOUBLE_KICK ]
  ],
  [Species.NIDORINO]: [
    [ 1, Moves.HORN_ATTACK ],
    [ 1, Moves.LEER ],
    [ 1, Moves.TACKLE ],
    [ 8, Moves.HORN_ATTACK ],
    [ 14, Moves.POISON_STING ],
    [ 23, Moves.FOCUS_ENERGY ],
    [ 32, Moves.FURY_ATTACK ],
    [ 41, Moves.HORN_DRILL ],
    [ 50, Moves.DOUBLE_KICK ]
  ],
  [Species.NIDOKING]: [
    [ 1, Moves.HORN_ATTACK ],
    [ 1, Moves.POISON_STING ],
    [ 1, Moves.TACKLE ],
    [ 1, Moves.THRASH ],
    [ 8, Moves.HORN_ATTACK ],
    [ 14, Moves.POISON_STING ],
    [ 23, Moves.THRASH ]
  ],
  [Species.CLEFAIRY]: [
    [ 1, Moves.GROWL ],
    [ 1, Moves.POUND ],
    [ 13, Moves.SING ],
    [ 18, Moves.DOUBLE_SLAP ],
    [ 24, Moves.MINIMIZE ],
    [ 31, Moves.METRONOME ],
    [ 39, Moves.DEFENSE_CURL ],
    [ 48, Moves.LIGHT_SCREEN ]
  ],
  [Species.CLEFABLE]: [
    [ 1, Moves.DOUBLE_SLAP ],
    [ 1, Moves.METRONOME ],
    [ 1, Moves.MINIMIZE ],
    [ 1, Moves.SING ]
  ],
  [Species.VULPIX]: [
    [ 1, Moves.EMBER ],
    [ 1, Moves.TAIL_WHIP ],
    [ 16, Moves.QUICK_ATTACK ],
    [ 21, Moves.ROAR ],
    [ 28, Moves.CONFUSE_RAY ],
    [ 35, Moves.FLAMETHROWER ],
    [ 42, Moves.FIRE_SPIN ]
  ],
  [Species.NINETALES]: [
    [ 1, Moves.EMBER ],
    [ 1, Moves.QUICK_ATTACK ],
    [ 1, Moves.ROAR ],
    [ 1, Moves.TAIL_WHIP ]
  ],
  [Species.JIGGLYPUFF]: [
    [ 1, Moves.SING ],
    [ 9, Moves.POUND ],
    [ 14, Moves.DISABLE ],
    [ 19, Moves.DEFENSE_CURL ],
    [ 24, Moves.DOUBLE_SLAP ],
    [ 29, Moves.REST ],
    [ 34, Moves.BODY_SLAM ],
    [ 39, Moves.DOUBLE_EDGE ]
  ],
  [Species.WIGGLYTUFF]: [
    [ 1, Moves.DEFENSE_CURL ],
    [ 1, Moves.DISABLE ],
    [ 1, Moves.DOUBLE_SLAP ],
    [ 1, Moves.SING ]
  ],
  [Species.ZUBAT]: [
    [ 1, Moves.LEECH_LIFE ],
    [ 10, Moves.SUPERSONIC ],
    [ 15, Moves.BITE ],
    [ 21, Moves.CONFUSE_RAY ],
    [ 28, Moves.WING_ATTACK ],
    [ 36, Moves.HAZE ]
  ],
  [Species.GOLBAT]: [
    [ 1, Moves.BITE ],
    [ 1, Moves.LEECH_LIFE ],
    [ 1, Moves.SCREECH ],
    [ 10, Moves.SUPERSONIC ],
    [ 15, Moves.BITE ],
    [ 21, Moves.CONFUSE_RAY ],
    [ 32, Moves.WING_ATTACK ],
    [ 43, Moves.HAZE ]
  ],
  [Species.ODDISH]: [
    [ 1, Moves.ABSORB ],
    [ 15, Moves.POISON_POWDER ],
    [ 17, Moves.STUN_SPORE ],
    [ 19, Moves.SLEEP_POWDER ],
    [ 24, Moves.ACID ],
    [ 33, Moves.PETAL_DANCE ],
    [ 46, Moves.SOLAR_BEAM ]
  ],
  [Species.GLOOM]: [
    [ 1, Moves.ABSORB ],
    [ 1, Moves.POISON_POWDER ],
    [ 1, Moves.STUN_SPORE ],
    [ 15, Moves.POISON_POWDER ],
    [ 17, Moves.STUN_SPORE ],
    [ 19, Moves.SLEEP_POWDER ],
    [ 28, Moves.ACID ],
    [ 38, Moves.PETAL_DANCE ],
    [ 52, Moves.SOLAR_BEAM ]
  ],
  [Species.VILEPLUME]: [
    [ 1, Moves.ACID ],
    [ 1, Moves.PETAL_DANCE ],
    [ 1, Moves.SLEEP_POWDER ],
    [ 1, Moves.STUN_SPORE ],
    [ 15, Moves.POISON_POWDER ],
    [ 17, Moves.STUN_SPORE ],
    [ 19, Moves.SLEEP_POWDER ]
  ],
  [Species.PARAS]: [
    [ 1, Moves.SCRATCH ],
    [ 13, Moves.STUN_SPORE ],
    [ 20, Moves.LEECH_LIFE ],
    [ 27, Moves.SPORE ],
    [ 34, Moves.SLASH ],
    [ 41, Moves.GROWTH ]
  ],
  [Species.PARASECT]: [
    [ 1, Moves.LEECH_LIFE ],
    [ 1, Moves.SCRATCH ],
    [ 1, Moves.STUN_SPORE ],
    [ 13, Moves.STUN_SPORE ],
    [ 20, Moves.LEECH_LIFE ],
    [ 30, Moves.SPORE ],
    [ 39, Moves.SLASH ],
    [ 48, Moves.GROWTH ]
  ],
  [Species.VENONAT]: [
    [ 1, Moves.DISABLE ],
    [ 1, Moves.TACKLE ],
    [ 24, Moves.POISON_POWDER ],
    [ 27, Moves.LEECH_LIFE ],
    [ 30, Moves.STUN_SPORE ],
    [ 35, Moves.PSYBEAM ],
    [ 38, Moves.SLEEP_POWDER ],
    [ 43, Moves.PSYCHIC ]
  ],
  [Species.VENOMOTH]: [
    [ 1, Moves.DISABLE ],
    [ 1, Moves.LEECH_LIFE ],
    [ 1, Moves.POISON_POWDER ],
    [ 1, Moves.TACKLE ],
    [ 24, Moves.POISON_POWDER ],
    [ 27, Moves.LEECH_LIFE ],
    [ 30, Moves.STUN_SPORE ],
    [ 38, Moves.PSYBEAM ],
    [ 43, Moves.SLEEP_POWDER ],
    [ 50, Moves.PSYCHIC ]
  ],
  [Species.DIGLETT]: [
    [ 1, Moves.SCRATCH ],
    [ 15, Moves.GROWL ],
    [ 19, Moves.DIG ],
    [ 24, Moves.SAND_ATTACK ],
    [ 31, Moves.SLASH ],
    [ 40, Moves.EARTHQUAKE ]
  ],
  [Species.DUGTRIO]: [
    [ 1, Moves.DIG ],
    [ 1, Moves.GROWL ],
    [ 1, Moves.SCRATCH ],
    [ 15, Moves.GROWL ],
    [ 19, Moves.DIG ],
    [ 24, Moves.SAND_ATTACK ],
    [ 35, Moves.SLASH ],
    [ 47, Moves.EARTHQUAKE ]
  ],
  [Species.MEOWTH]: [
    [ 1, Moves.GROWL ],
    [ 1, Moves.SCRATCH ],
    [ 12, Moves.BITE ],
    [ 17, Moves.PAY_DAY ],
    [ 24, Moves.SCREECH ],
    [ 33, Moves.FURY_SWIPES ],
    [ 44, Moves.SLASH ]
  ],
  [Species.PERSIAN]: [
    [ 1, Moves.BITE ],
    [ 1, Moves.GROWL ],
    [ 1, Moves.SCRATCH ],
    [ 1, Moves.SCREECH ],
    [ 12, Moves.BITE ],
    [ 17, Moves.PAY_DAY ],
    [ 24, Moves.SCREECH ],
    [ 37, Moves.FURY_SWIPES ],
    [ 51, Moves.SLASH ]
  ],
  [Species.PSYDUCK]: [
    [ 1, Moves.SCRATCH ],
    [ 28, Moves.TAIL_WHIP ],
    [ 31, Moves.DISABLE ],
    [ 36, Moves.CONFUSION ],
    [ 43, Moves.FURY_SWIPES ],
    [ 52, Moves.HYDRO_PUMP ]
  ],
  [Species.GOLDUCK]: [
    [ 1, Moves.DISABLE ],
    [ 1, Moves.SCRATCH ],
    [ 1, Moves.TAIL_WHIP ],
    [ 28, Moves.TAIL_WHIP ],
    [ 31, Moves.DISABLE ],
    [ 39, Moves.CONFUSION ],
    [ 48, Moves.FURY_SWIPES ],
    [ 59, Moves.HYDRO_PUMP ]
  ],
  [Species.MANKEY]: [
    [ 1, Moves.LEER ],
    [ 1, Moves.SCRATCH ],
    [ 15, Moves.KARATE_CHOP ],
    [ 21, Moves.FURY_SWIPES ],
    [ 27, Moves.FOCUS_ENERGY ],
    [ 33, Moves.SEISMIC_TOSS ],
    [ 39, Moves.THRASH ]
  ],
  [Species.PRIMEAPE]: [
    [ 1, Moves.FURY_SWIPES ],
    [ 1, Moves.KARATE_CHOP ],
    [ 1, Moves.LEER ],
    [ 1, Moves.SCRATCH ],
    [ 15, Moves.KARATE_CHOP ],
    [ 21, Moves.FURY_SWIPES ],
    [ 27, Moves.FOCUS_ENERGY ],
    [ 37, Moves.SEISMIC_TOSS ],
    [ 46, Moves.THRASH ]
  ],
  [Species.GROWLITHE]: [
    [ 1, Moves.BITE ],
    [ 1, Moves.ROAR ],
    [ 18, Moves.EMBER ],
    [ 23, Moves.LEER ],
    [ 30, Moves.TAKE_DOWN ],
    [ 39, Moves.AGILITY ],
    [ 50, Moves.FLAMETHROWER ]
  ],
  [Species.ARCANINE]: [
    [ 1, Moves.EMBER ],
    [ 1, Moves.LEER ],
    [ 1, Moves.ROAR ],
    [ 1, Moves.TAKE_DOWN ]
  ],
  [Species.POLIWAG]: [
    [ 1, Moves.BUBBLE ],
    [ 16, Moves.HYPNOSIS ],
    [ 19, Moves.WATER_GUN ],
    [ 25, Moves.DOUBLE_SLAP ],
    [ 31, Moves.BODY_SLAM ],
    [ 38, Moves.AMNESIA ],
    [ 45, Moves.HYDRO_PUMP ]
  ],
  [Species.POLIWHIRL]: [
    [ 1, Moves.BUBBLE ],
    [ 1, Moves.HYPNOSIS ],
    [ 1, Moves.WATER_GUN ],
    [ 16, Moves.HYPNOSIS ],
    [ 19, Moves.WATER_GUN ],
    [ 26, Moves.DOUBLE_SLAP ],
    [ 33, Moves.BODY_SLAM ],
    [ 41, Moves.AMNESIA ],
    [ 49, Moves.HYDRO_PUMP ]
  ],
  [Species.POLIWRATH]: [
    [ 1, Moves.BODY_SLAM ],
    [ 1, Moves.DOUBLE_SLAP ],
    [ 1, Moves.HYPNOSIS ],
    [ 1, Moves.WATER_GUN ],
    [ 16, Moves.HYPNOSIS ],
    [ 19, Moves.WATER_GUN ]
  ],
  [Species.ABRA]: [
    [ 1, Moves.TELEPORT ]
  ],
  [Species.KADABRA]: [
    [ 1, Moves.CONFUSION ],
    [ 1, Moves.DISABLE ],
    [ 1, Moves.TELEPORT ],
    [ 16, Moves.CONFUSION ],
    [ 20, Moves.DISABLE ],
    [ 27, Moves.PSYBEAM ],
    [ 31, Moves.RECOVER ],
    [ 38, Moves.PSYCHIC ],
    [ 42, Moves.REFLECT ]
  ],
  [Species.ALAKAZAM]: [
    [ 1, Moves.CONFUSION ],
    [ 1, Moves.DISABLE ],
    [ 1, Moves.TELEPORT ],
    [ 16, Moves.CONFUSION ],
    [ 20, Moves.DISABLE ],
    [ 27, Moves.PSYBEAM ],
    [ 31, Moves.RECOVER ],
    [ 38, Moves.PSYCHIC ],
    [ 42, Moves.REFLECT ]
  ],
  [Species.MACHOP]: [
    [ 1, Moves.KARATE_CHOP ],
    [ 20, Moves.LOW_KICK ],
    [ 25, Moves.LEER ],
    [ 32, Moves.FOCUS_ENERGY ],
    [ 39, Moves.SEISMIC_TOSS ],
    [ 46, Moves.SUBMISSION ]
  ],
  [Species.MACHOKE]: [
    [ 1, Moves.KARATE_CHOP ],
    [ 1, Moves.LEER ],
    [ 1, Moves.LOW_KICK ],
    [ 20, Moves.LOW_KICK ],
    [ 25, Moves.LEER ],
    [ 36, Moves.FOCUS_ENERGY ],
    [ 44, Moves.SEISMIC_TOSS ],
    [ 52, Moves.SUBMISSION ]
  ],
  [Species.MACHAMP]: [
    [ 1, Moves.KARATE_CHOP ],
    [ 1, Moves.LEER ],
    [ 1, Moves.LOW_KICK ],
    [ 20, Moves.LOW_KICK ],
    [ 25, Moves.LEER ],
    [ 36, Moves.FOCUS_ENERGY ],
    [ 44, Moves.SEISMIC_TOSS ],
    [ 52, Moves.SUBMISSION ]
  ],
  [Species.BELLSPROUT]: [
    [ 1, Moves.GROWTH ],
    [ 1, Moves.VINE_WHIP ],
    [ 13, Moves.WRAP ],
    [ 15, Moves.POISON_POWDER ],
    [ 18, Moves.SLEEP_POWDER ],
    [ 21, Moves.STUN_SPORE ],
    [ 26, Moves.ACID ],
    [ 33, Moves.RAZOR_LEAF ],
    [ 42, Moves.SLAM ]
  ],
  [Species.WEEPINBELL]: [
    [ 1, Moves.GROWTH ],
    [ 1, Moves.VINE_WHIP ],
    [ 1, Moves.WRAP ],
    [ 13, Moves.WRAP ],
    [ 15, Moves.POISON_POWDER ],
    [ 18, Moves.SLEEP_POWDER ],
    [ 23, Moves.STUN_SPORE ],
    [ 29, Moves.ACID ],
    [ 38, Moves.RAZOR_LEAF ],
    [ 49, Moves.SLAM ]
  ],
  [Species.VICTREEBEL]: [
    [ 1, Moves.ACID ],
    [ 1, Moves.RAZOR_LEAF ],
    [ 1, Moves.SLEEP_POWDER ],
    [ 1, Moves.STUN_SPORE ],
    [ 13, Moves.WRAP ],
    [ 15, Moves.POISON_POWDER ],
    [ 18, Moves.SLEEP_POWDER ]
  ],
  [Species.TENTACOOL]: [
    [ 1, Moves.ACID ],
    [ 7, Moves.SUPERSONIC ],
    [ 13, Moves.WRAP ],
    [ 18, Moves.POISON_STING ],
    [ 22, Moves.WATER_GUN ],
    [ 27, Moves.CONSTRICT ],
    [ 33, Moves.BARRIER ],
    [ 40, Moves.SCREECH ],
    [ 48, Moves.HYDRO_PUMP ]
  ],
  [Species.TENTACRUEL]: [
    [ 1, Moves.ACID ],
    [ 1, Moves.SUPERSONIC ],
    [ 1, Moves.WRAP ],
    [ 7, Moves.SUPERSONIC ],
    [ 13, Moves.WRAP ],
    [ 18, Moves.POISON_STING ],
    [ 22, Moves.WATER_GUN ],
    [ 27, Moves.CONSTRICT ],
    [ 35, Moves.BARRIER ],
    [ 43, Moves.SCREECH ],
    [ 50, Moves.HYDRO_PUMP ]
  ],
  [Species.GEODUDE]: [
    [ 1, Moves.TACKLE ],
    [ 11, Moves.DEFENSE_CURL ],
    [ 16, Moves.ROCK_THROW ],
    [ 21, Moves.SELF_DESTRUCT ],
    [ 26, Moves.HARDEN ],
    [ 31, Moves.EARTHQUAKE ],
    [ 36, Moves.EXPLOSION ]
  ],
  [Species.GRAVELER]: [
    [ 1, Moves.DEFENSE_CURL ],
    [ 1, Moves.TACKLE ],
    [ 11, Moves.DEFENSE_CURL ],
    [ 16, Moves.ROCK_THROW ],
    [ 21, Moves.SELF_DESTRUCT ],
    [ 29, Moves.HARDEN ],
    [ 36, Moves.EARTHQUAKE ],
    [ 43, Moves.EXPLOSION ]
  ],
  [Species.GOLEM]: [
    [ 1, Moves.DEFENSE_CURL ],
    [ 1, Moves.TACKLE ],
    [ 11, Moves.DEFENSE_CURL ],
    [ 16, Moves.ROCK_THROW ],
    [ 21, Moves.SELF_DESTRUCT ],
    [ 29, Moves.HARDEN ],
    [ 36, Moves.EARTHQUAKE ],
    [ 43, Moves.EXPLOSION ]
  ],
  [Species.PONYTA]: [
    [ 1, Moves.EMBER ],
    [ 30, Moves.TAIL_WHIP ],
    [ 32, Moves.STOMP ],
    [ 35, Moves.GROWL ],
    [ 39, Moves.FIRE_SPIN ],
    [ 43, Moves.TAKE_DOWN ],
    [ 48, Moves.AGILITY ]
  ],
  [Species.RAPIDASH]: [
    [ 1, Moves.EMBER ],
    [ 1, Moves.GROWL ],
    [ 1, Moves.STOMP ],
    [ 1, Moves.TAIL_WHIP ],
    [ 30, Moves.TAIL_WHIP ],
    [ 32, Moves.STOMP ],
    [ 35, Moves.GROWL ],
    [ 39, Moves.FIRE_SPIN ],
    [ 47, Moves.TAKE_DOWN ],
    [ 55, Moves.AGILITY ]
  ],
  [Species.SLOWPOKE]: [
    [ 1, Moves.CONFUSION ],
    [ 18, Moves.DISABLE ],
    [ 22, Moves.HEADBUTT ],
    [ 27, Moves.GROWL ],
    [ 33, Moves.WATER_GUN ],
    [ 40, Moves.AMNESIA ],
    [ 48, Moves.PSYCHIC ]
  ],
  [Species.SLOWBRO]: [
    [ 1, Moves.CONFUSION ],
    [ 1, Moves.DISABLE ],
    [ 1, Moves.HEADBUTT ],
    [ 18, Moves.DISABLE ],
    [ 22, Moves.HEADBUTT ],
    [ 27, Moves.GROWL ],
    [ 33, Moves.WATER_GUN ],
    [ 37, Moves.WITHDRAW ],
    [ 44, Moves.AMNESIA ],
    [ 55, Moves.PSYCHIC ]
  ],
  [Species.MAGNEMITE]: [
    [ 1, Moves.TACKLE ],
    [ 21, Moves.SONIC_BOOM ],
    [ 25, Moves.THUNDER_SHOCK ],
    [ 29, Moves.SUPERSONIC ],
    [ 35, Moves.THUNDER_WAVE ],
    [ 41, Moves.SWIFT ],
    [ 47, Moves.SCREECH ]
  ],
  [Species.MAGNETON]: [
    [ 1, Moves.SONIC_BOOM ],
    [ 1, Moves.TACKLE ],
    [ 1, Moves.THUNDER_SHOCK ],
    [ 21, Moves.SONIC_BOOM ],
    [ 25, Moves.THUNDER_SHOCK ],
    [ 29, Moves.SUPERSONIC ],
    [ 38, Moves.THUNDER_WAVE ],
    [ 46, Moves.SWIFT ],
    [ 54, Moves.SCREECH ]
  ],
  [Species.FARFETCHD]: [
    [ 1, Moves.PECK ],
    [ 1, Moves.SAND_ATTACK ],
    [ 7, Moves.LEER ],
    [ 15, Moves.FURY_ATTACK ],
    [ 23, Moves.SWORDS_DANCE ],
    [ 31, Moves.AGILITY ],
    [ 39, Moves.SLASH ]
  ],
  [Species.DODUO]: [
    [ 1, Moves.PECK ],
    [ 20, Moves.GROWL ],
    [ 24, Moves.FURY_ATTACK ],
    [ 30, Moves.DRILL_PECK ],
    [ 36, Moves.RAGE ],
    [ 40, Moves.TRI_ATTACK ],
    [ 44, Moves.AGILITY ]
  ],
  [Species.DODRIO]: [
    [ 1, Moves.FURY_ATTACK ],
    [ 1, Moves.GROWL ],
    [ 1, Moves.PECK ],
    [ 20, Moves.GROWL ],
    [ 24, Moves.FURY_ATTACK ],
    [ 30, Moves.DRILL_PECK ],
    [ 39, Moves.RAGE ],
    [ 45, Moves.TRI_ATTACK ],
    [ 51, Moves.AGILITY ]
  ],
  [Species.SEEL]: [
    [ 1, Moves.HEADBUTT ],
    [ 30, Moves.GROWL ],
    [ 35, Moves.AURORA_BEAM ],
    [ 40, Moves.REST ],
    [ 45, Moves.TAKE_DOWN ],
    [ 50, Moves.ICE_BEAM ]
  ],
  [Species.DEWGONG]: [
    [ 1, Moves.AURORA_BEAM ],
    [ 1, Moves.GROWL ],
    [ 1, Moves.HEADBUTT ],
    [ 30, Moves.GROWL ],
    [ 35, Moves.AURORA_BEAM ],
    [ 44, Moves.REST ],
    [ 50, Moves.TAKE_DOWN ],
    [ 56, Moves.ICE_BEAM ]
  ],
  [Species.GRIMER]: [
    [ 1, Moves.DISABLE ],
    [ 1, Moves.POUND ],
    [ 30, Moves.POISON_GAS ],
    [ 33, Moves.MINIMIZE ],
    [ 37, Moves.SLUDGE ],
    [ 42, Moves.HARDEN ],
    [ 48, Moves.SCREECH ],
    [ 55, Moves.ACID_ARMOR ]
  ],
  [Species.MUK]: [
    [ 1, Moves.DISABLE ],
    [ 1, Moves.POISON_GAS ],
    [ 1, Moves.POUND ],
    [ 30, Moves.POISON_GAS ],
    [ 33, Moves.MINIMIZE ],
    [ 37, Moves.SLUDGE ],
    [ 45, Moves.HARDEN ],
    [ 53, Moves.SCREECH ],
    [ 60, Moves.ACID_ARMOR ]
  ],
  [Species.SHELLDER]: [
    [ 1, Moves.TACKLE ],
    [ 1, Moves.WITHDRAW ],
    [ 18, Moves.SUPERSONIC ],
    [ 23, Moves.CLAMP ],
    [ 30, Moves.AURORA_BEAM ],
    [ 39, Moves.LEER ],
    [ 50, Moves.ICE_BEAM ]
  ],
  [Species.CLOYSTER]: [
    [ 1, Moves.AURORA_BEAM ],
    [ 1, Moves.CLAMP ],
    [ 1, Moves.SUPERSONIC ],
    [ 1, Moves.WITHDRAW ],
    [ 50, Moves.SPIKE_CANNON ]
  ],
  [Species.GASTLY]: [
    [ 1, Moves.CONFUSE_RAY ],
    [ 1, Moves.LICK ],
    [ 1, Moves.NIGHT_SHADE ],
    [ 27, Moves.HYPNOSIS ],
    [ 35, Moves.DREAM_EATER ]
  ],
  [Species.HAUNTER]: [
    [ 1, Moves.CONFUSE_RAY ],
    [ 1, Moves.LICK ],
    [ 1, Moves.NIGHT_SHADE ],
    [ 29, Moves.HYPNOSIS ],
    [ 38, Moves.DREAM_EATER ]
  ],
  [Species.GENGAR]: [
    [ 1, Moves.CONFUSE_RAY ],
    [ 1, Moves.LICK ],
    [ 1, Moves.NIGHT_SHADE ],
    [ 29, Moves.HYPNOSIS ],
    [ 38, Moves.DREAM_EATER ]
  ],
  [Species.ONIX]: [
    [ 1, Moves.SCREECH ],
    [ 1, Moves.TACKLE ],
    [ 15, Moves.BIND ],
    [ 19, Moves.ROCK_THROW ],
    [ 25, Moves.RAGE ],
    [ 33, Moves.SLAM ],
    [ 43, Moves.HARDEN ]
  ],
  [Species.DROWZEE]: [
    [ 1, Moves.HYPNOSIS ],
    [ 1, Moves.POUND ],
    [ 12, Moves.DISABLE ],
    [ 17, Moves.CONFUSION ],
    [ 24, Moves.HEADBUTT ],
    [ 29, Moves.POISON_GAS ],
    [ 32, Moves.PSYCHIC ],
    [ 37, Moves.MEDITATE ]
  ],
  [Species.HYPNO]: [
    [ 1, Moves.CONFUSION ],
    [ 1, Moves.DISABLE ],
    [ 1, Moves.HYPNOSIS ],
    [ 1, Moves.POUND ],
    [ 12, Moves.DISABLE ],
    [ 17, Moves.CONFUSION ],
    [ 24, Moves.HEADBUTT ],
    [ 33, Moves.POISON_GAS ],
    [ 37, Moves.PSYCHIC ],
    [ 43, Moves.MEDITATE ]
  ],
  [Species.KRABBY]: [
    [ 1, Moves.BUBBLE ],
    [ 1, Moves.LEER ],
    [ 20, Moves.VISE_GRIP ],
    [ 25, Moves.GUILLOTINE ],
    [ 30, Moves.STOMP ],
    [ 35, Moves.CRABHAMMER ],
    [ 40, Moves.HARDEN ]
  ],
  [Species.KINGLER]: [
    [ 1, Moves.BUBBLE ],
    [ 1, Moves.LEER ],
    [ 1, Moves.VISE_GRIP ],
    [ 20, Moves.VISE_GRIP ],
    [ 25, Moves.GUILLOTINE ],
    [ 34, Moves.STOMP ],
    [ 42, Moves.CRABHAMMER ],
    [ 49, Moves.HARDEN ]
  ],
  [Species.VOLTORB]: [
    [ 1, Moves.SCREECH ],
    [ 1, Moves.TACKLE ],
    [ 17, Moves.SONIC_BOOM ],
    [ 22, Moves.SELF_DESTRUCT ],
    [ 29, Moves.LIGHT_SCREEN ],
    [ 36, Moves.SWIFT ],
    [ 43, Moves.EXPLOSION ]
  ],
  [Species.ELECTRODE]: [
    [ 1, Moves.SCREECH ],
    [ 1, Moves.SONIC_BOOM ],
    [ 1, Moves.TACKLE ],
    [ 17, Moves.SONIC_BOOM ],
    [ 22, Moves.SELF_DESTRUCT ],
    [ 29, Moves.LIGHT_SCREEN ],
    [ 40, Moves.SWIFT ],
    [ 50, Moves.EXPLOSION ]
  ],
  [Species.EXEGGCUTE]: [
    [ 1, Moves.BARRAGE ],
    [ 1, Moves.HYPNOSIS ],
    [ 25, Moves.REFLECT ],
    [ 28, Moves.LEECH_SEED ],
    [ 32, Moves.STUN_SPORE ],
    [ 37, Moves.POISON_POWDER ],
    [ 42, Moves.SOLAR_BEAM ],
    [ 48, Moves.SLEEP_POWDER ]
  ],
  [Species.EXEGGUTOR]: [
    [ 1, Moves.BARRAGE ],
    [ 1, Moves.HYPNOSIS ],
    [ 28, Moves.STOMP ]
  ],
  [Species.CUBONE]: [
    [ 1, Moves.BONE_CLUB ],
    [ 1, Moves.GROWL ],
    [ 25, Moves.LEER ],
    [ 31, Moves.FOCUS_ENERGY ],
    [ 38, Moves.THRASH ],
    [ 43, Moves.BONEMERANG ],
    [ 46, Moves.RAGE ]
  ],
  [Species.MAROWAK]: [
    [ 1, Moves.BONE_CLUB ],
    [ 1, Moves.FOCUS_ENERGY ],
    [ 1, Moves.GROWL ],
    [ 1, Moves.LEER ],
    [ 25, Moves.LEER ],
    [ 33, Moves.FOCUS_ENERGY ],
    [ 41, Moves.THRASH ],
    [ 48, Moves.BONEMERANG ],
    [ 55, Moves.RAGE ]
  ],
  [Species.HITMONLEE]: [
    [ 1, Moves.DOUBLE_KICK ],
    [ 1, Moves.MEDITATE ],
    [ 33, Moves.ROLLING_KICK ],
    [ 38, Moves.JUMP_KICK ],
    [ 43, Moves.FOCUS_ENERGY ],
    [ 48, Moves.HIGH_JUMP_KICK ],
    [ 53, Moves.MEGA_KICK ]
  ],
  [Species.HITMONCHAN]: [
    [ 1, Moves.AGILITY ],
    [ 1, Moves.COMET_PUNCH ],
    [ 33, Moves.FIRE_PUNCH ],
    [ 38, Moves.ICE_PUNCH ],
    [ 43, Moves.THUNDER_PUNCH ],
    [ 48, Moves.MEGA_PUNCH ],
    [ 53, Moves.COUNTER ]
  ],
  [Species.LICKITUNG]: [
    [ 1, Moves.SUPERSONIC ],
    [ 1, Moves.WRAP ],
    [ 7, Moves.STOMP ],
    [ 15, Moves.DISABLE ],
    [ 23, Moves.DEFENSE_CURL ],
    [ 31, Moves.SLAM ],
    [ 39, Moves.SCREECH ]
  ],
  [Species.KOFFING]: [
    [ 1, Moves.SMOG ],
    [ 1, Moves.TACKLE ],
    [ 32, Moves.SLUDGE ],
    [ 37, Moves.SMOKESCREEN ],
    [ 40, Moves.SELF_DESTRUCT ],
    [ 45, Moves.HAZE ],
    [ 48, Moves.EXPLOSION ]
  ],
  [Species.WEEZING]: [
    [ 1, Moves.SLUDGE ],
    [ 1, Moves.SMOG ],
    [ 1, Moves.TACKLE ],
    [ 32, Moves.SLUDGE ],
    [ 39, Moves.SMOKESCREEN ],
    [ 43, Moves.SELF_DESTRUCT ],
    [ 49, Moves.HAZE ],
    [ 53, Moves.EXPLOSION ]
  ],
  [Species.RHYHORN]: [
    [ 1, Moves.HORN_ATTACK ],
    [ 30, Moves.STOMP ],
    [ 35, Moves.TAIL_WHIP ],
    [ 40, Moves.FURY_ATTACK ],
    [ 45, Moves.HORN_DRILL ],
    [ 50, Moves.LEER ],
    [ 55, Moves.TAKE_DOWN ]
  ],
  [Species.RHYDON]: [
    [ 1, Moves.FURY_ATTACK ],
    [ 1, Moves.HORN_ATTACK ],
    [ 1, Moves.STOMP ],
    [ 1, Moves.TAIL_WHIP ],
    [ 30, Moves.STOMP ],
    [ 35, Moves.TAIL_WHIP ],
    [ 40, Moves.FURY_ATTACK ],
    [ 48, Moves.HORN_DRILL ],
    [ 55, Moves.LEER ],
    [ 64, Moves.TAKE_DOWN ]
  ],
  [Species.CHANSEY]: [
    [ 1, Moves.DOUBLE_SLAP ],
    [ 1, Moves.POUND ],
    [ 24, Moves.SING ],
    [ 30, Moves.GROWL ],
    [ 38, Moves.MINIMIZE ],
    [ 44, Moves.DEFENSE_CURL ],
    [ 48, Moves.LIGHT_SCREEN ],
    [ 54, Moves.DOUBLE_EDGE ]
  ],
  [Species.TANGELA]: [
    [ 1, Moves.BIND ],
    [ 1, Moves.CONSTRICT ],
    [ 29, Moves.ABSORB ],
    [ 32, Moves.POISON_POWDER ],
    [ 36, Moves.STUN_SPORE ],
    [ 39, Moves.SLEEP_POWDER ],
    [ 45, Moves.SLAM ],
    [ 49, Moves.GROWTH ]
  ],
  [Species.KANGASKHAN]: [
    [ 1, Moves.COMET_PUNCH ],
    [ 1, Moves.RAGE ],
    [ 26, Moves.BITE ],
    [ 31, Moves.TAIL_WHIP ],
    [ 36, Moves.MEGA_PUNCH ],
    [ 41, Moves.LEER ],
    [ 46, Moves.DIZZY_PUNCH ]
  ],
  [Species.HORSEA]: [
    [ 1, Moves.BUBBLE ],
    [ 19, Moves.SMOKESCREEN ],
    [ 24, Moves.LEER ],
    [ 30, Moves.WATER_GUN ],
    [ 37, Moves.AGILITY ],
    [ 45, Moves.HYDRO_PUMP ]
  ],
  [Species.SEADRA]: [
    [ 1, Moves.BUBBLE ],
    [ 1, Moves.SMOKESCREEN ],
    [ 19, Moves.SMOKESCREEN ],
    [ 24, Moves.LEER ],
    [ 30, Moves.WATER_GUN ],
    [ 41, Moves.AGILITY ],
    [ 52, Moves.HYDRO_PUMP ]
  ],
  [Species.GOLDEEN]: [
    [ 1, Moves.PECK ],
    [ 1, Moves.TAIL_WHIP ],
    [ 19, Moves.SUPERSONIC ],
    [ 24, Moves.HORN_ATTACK ],
    [ 30, Moves.FURY_ATTACK ],
    [ 37, Moves.WATERFALL ],
    [ 45, Moves.HORN_DRILL ],
    [ 54, Moves.AGILITY ]
  ],
  [Species.SEAKING]: [
    [ 1, Moves.PECK ],
    [ 1, Moves.SUPERSONIC ],
    [ 1, Moves.TAIL_WHIP ],
    [ 19, Moves.SUPERSONIC ],
    [ 24, Moves.HORN_ATTACK ],
    [ 30, Moves.FURY_ATTACK ],
    [ 39, Moves.WATERFALL ],
    [ 48, Moves.HORN_DRILL ],
    [ 54, Moves.AGILITY ]
  ],
  [Species.STARYU]: [
    [ 1, Moves.TACKLE ],
    [ 17, Moves.WATER_GUN ],
    [ 22, Moves.HARDEN ],
    [ 27, Moves.RECOVER ],
    [ 32, Moves.SWIFT ],
    [ 37, Moves.MINIMIZE ],
    [ 42, Moves.LIGHT_SCREEN ],
    [ 47, Moves.HYDRO_PUMP ]
  ],
  [Species.STARMIE]: [
    [ 1, Moves.HARDEN ],
    [ 1, Moves.TACKLE ],
    [ 1, Moves.WATER_GUN ]
  ],
  [Species.MR_MIME]: [
    [ 1, Moves.BARRIER ],
    [ 1, Moves.CONFUSION ],
    [ 15, Moves.CONFUSION ],
    [ 23, Moves.LIGHT_SCREEN ],
    [ 31, Moves.DOUBLE_SLAP ],
    [ 39, Moves.MEDITATE ],
    [ 47, Moves.SUBSTITUTE ]
  ],
  [Species.SCYTHER]: [
    [ 1, Moves.QUICK_ATTACK ],
    [ 17, Moves.LEER ],
    [ 20, Moves.FOCUS_ENERGY ],
    [ 24, Moves.DOUBLE_TEAM ],
    [ 29, Moves.SLASH ],
    [ 35, Moves.SWORDS_DANCE ],
    [ 42, Moves.AGILITY ]
  ],
  [Species.JYNX]: [
    [ 1, Moves.LOVELY_KISS ],
    [ 1, Moves.POUND ],
    [ 18, Moves.LICK ],
    [ 23, Moves.DOUBLE_SLAP ],
    [ 31, Moves.ICE_PUNCH ],
    [ 39, Moves.BODY_SLAM ],
    [ 47, Moves.THRASH ],
    [ 58, Moves.BLIZZARD ]
  ],
  [Species.ELECTABUZZ]: [
    [ 1, Moves.LEER ],
    [ 1, Moves.QUICK_ATTACK ],
    [ 34, Moves.THUNDER_SHOCK ],
    [ 37, Moves.SCREECH ],
    [ 42, Moves.THUNDER_PUNCH ],
    [ 49, Moves.LIGHT_SCREEN ],
    [ 54, Moves.THUNDER ]
  ],
  [Species.MAGMAR]: [
    [ 1, Moves.EMBER ],
    [ 36, Moves.LEER ],
    [ 39, Moves.CONFUSE_RAY ],
    [ 43, Moves.FIRE_PUNCH ],
    [ 48, Moves.SMOKESCREEN ],
    [ 52, Moves.SMOG ],
    [ 55, Moves.FLAMETHROWER ]
  ],
  [Species.PINSIR]: [
    [ 1, Moves.VISE_GRIP ],
    [ 25, Moves.SEISMIC_TOSS ],
    [ 30, Moves.GUILLOTINE ],
    [ 36, Moves.FOCUS_ENERGY ],
    [ 43, Moves.HARDEN ],
    [ 49, Moves.SLASH ],
    [ 54, Moves.SWORDS_DANCE ]
  ],
  [Species.TAUROS]: [
    [ 1, Moves.TACKLE ],
    [ 21, Moves.STOMP ],
    [ 28, Moves.TAIL_WHIP ],
    [ 35, Moves.LEER ],
    [ 44, Moves.RAGE ],
    [ 51, Moves.TAKE_DOWN ]
  ],
  [Species.MAGIKARP]: [
    [ 1, Moves.SPLASH ],
    [ 15, Moves.TACKLE ]
  ],
  [Species.GYARADOS]: [
    [ 1, Moves.BITE ],
    [ 1, Moves.DRAGON_RAGE ],
    [ 1, Moves.HYDRO_PUMP ],
    [ 1, Moves.LEER ],
    [ 20, Moves.BITE ],
    [ 25, Moves.DRAGON_RAGE ],
    [ 32, Moves.LEER ],
    [ 41, Moves.HYDRO_PUMP ],
    [ 52, Moves.HYPER_BEAM ]
  ],
  [Species.LAPRAS]: [
    [ 1, Moves.GROWL ],
    [ 1, Moves.WATER_GUN ],
    [ 16, Moves.SING ],
    [ 20, Moves.MIST ],
    [ 25, Moves.BODY_SLAM ],
    [ 31, Moves.CONFUSE_RAY ],
    [ 38, Moves.ICE_BEAM ],
    [ 46, Moves.HYDRO_PUMP ]
  ],
  [Species.DITTO]: [
    [ 1, Moves.TRANSFORM ]
  ],
  [Species.EEVEE]: [
    [ 1, Moves.SAND_ATTACK ],
    [ 1, Moves.TACKLE ],
    [ 27, Moves.QUICK_ATTACK ],
    [ 31, Moves.TAIL_WHIP ],
    [ 37, Moves.BITE ],
    [ 45, Moves.TAKE_DOWN ]
  ],
  [Species.VAPOREON]: [
    [ 1, Moves.QUICK_ATTACK ],
    [ 1, Moves.SAND_ATTACK ],
    [ 1, Moves.TACKLE ],
    [ 1, Moves.WATER_GUN ],
    [ 27, Moves.QUICK_ATTACK ],
    [ 31, Moves.WATER_GUN ],
    [ 37, Moves.TAIL_WHIP ],
    [ 40, Moves.BITE ],
    [ 42, Moves.ACID_ARMOR ],
    [ 44, Moves.HAZE ],
    [ 48, Moves.MIST ],
    [ 54, Moves.HYDRO_PUMP ]
  ],
  [Species.JOLTEON]: [
    [ 1, Moves.QUICK_ATTACK ],
    [ 1, Moves.SAND_ATTACK ],
    [ 1, Moves.TACKLE ],
    [ 1, Moves.THUNDER_SHOCK ],
    [ 27, Moves.QUICK_ATTACK ],
    [ 31, Moves.THUNDER_SHOCK ],
    [ 37, Moves.TAIL_WHIP ],
    [ 40, Moves.THUNDER_WAVE ],
    [ 42, Moves.DOUBLE_KICK ],
    [ 44, Moves.AGILITY ],
    [ 48, Moves.PIN_MISSILE ],
    [ 54, Moves.THUNDER ]
  ],
  [Species.FLAREON]: [
    [ 1, Moves.EMBER ],
    [ 1, Moves.QUICK_ATTACK ],
    [ 1, Moves.SAND_ATTACK ],
    [ 1, Moves.TACKLE ],
    [ 27, Moves.QUICK_ATTACK ],
    [ 31, Moves.EMBER ],
    [ 37, Moves.TAIL_WHIP ],
    [ 40, Moves.BITE ],
    [ 42, Moves.LEER ],
    [ 44, Moves.FIRE_SPIN ],
    [ 48, Moves.RAGE ],
    [ 54, Moves.FLAMETHROWER ]
  ],
  [Species.PORYGON]: [
    [ 1, Moves.CONVERSION ],
    [ 1, Moves.SHARPEN ],
    [ 1, Moves.TACKLE ],
    [ 23, Moves.PSYBEAM ],
    [ 28, Moves.RECOVER ],
    [ 35, Moves.AGILITY ],
    [ 42, Moves.TRI_ATTACK ]
  ],
  [Species.OMANYTE]: [
    [ 1, Moves.WATER_GUN ],
    [ 1, Moves.WITHDRAW ],
    [ 34, Moves.HORN_ATTACK ],
    [ 39, Moves.LEER ],
    [ 46, Moves.SPIKE_CANNON ],
    [ 53, Moves.HYDRO_PUMP ]
  ],
  [Species.OMASTAR]: [
    [ 1, Moves.HORN_ATTACK ],
    [ 1, Moves.WATER_GUN ],
    [ 1, Moves.WITHDRAW ],
    [ 34, Moves.HORN_ATTACK ],
    [ 39, Moves.LEER ],
    [ 44, Moves.SPIKE_CANNON ],
    [ 49, Moves.HYDRO_PUMP ]
  ],
  [Species.KABUTO]: [
    [ 1, Moves.HARDEN ],
    [ 1, Moves.SCRATCH ],
    [ 34, Moves.ABSORB ],
    [ 39, Moves.SLASH ],
    [ 44, Moves.LEER ],
    [ 49, Moves.HYDRO_PUMP ]
  ],
  [Species.KABUTOPS]: [
    [ 1, Moves.ABSORB ],
    [ 1, Moves.HARDEN ],
    [ 1, Moves.SCRATCH ],
    [ 34, Moves.ABSORB ],
    [ 39, Moves.SLASH ],
    [ 46, Moves.LEER ],
    [ 53, Moves.HYDRO_PUMP ]
  ],
  [Species.AERODACTYL]: [
    [ 1, Moves.AGILITY ],
    [ 1, Moves.WING_ATTACK ],
    [ 33, Moves.SUPERSONIC ],
    [ 38, Moves.BITE ],
    [ 45, Moves.TAKE_DOWN ],
    [ 54, Moves.HYPER_BEAM ]
  ],
  [Species.SNORLAX]: [
    [ 1, Moves.AMNESIA ],
    [ 1, Moves.HEADBUTT ],
    [ 1, Moves.REST ],
    [ 35, Moves.BODY_SLAM ],
    [ 41, Moves.HARDEN ],
    [ 48, Moves.DOUBLE_EDGE ],
    [ 56, Moves.HYPER_BEAM ]
  ],
  [Species.ARTICUNO]: [
    [ 1, Moves.ICE_BEAM ],
    [ 1, Moves.PECK ],
    [ 51, Moves.BLIZZARD ],
    [ 55, Moves.AGILITY ],
    [ 60, Moves.MIST ]
  ],
  [Species.ZAPDOS]: [
    [ 1, Moves.DRILL_PECK ],
    [ 1, Moves.THUNDER_SHOCK ],
    [ 51, Moves.THUNDER ],
    [ 55, Moves.AGILITY ],
    [ 60, Moves.LIGHT_SCREEN ]
  ],
  [Species.MOLTRES]: [
    [ 1, Moves.FIRE_SPIN ],
    [ 1, Moves.PECK ],
    [ 51, Moves.LEER ],
    [ 55, Moves.AGILITY ],
    [ 60, Moves.SKY_ATTACK ]
  ],
  [Species.DRATINI]: [
    [ 1, Moves.LEER ],
    [ 1, Moves.WRAP ],
    [ 10, Moves.THUNDER_WAVE ],
    [ 20, Moves.AGILITY ],
    [ 30, Moves.SLAM ],
    [ 40, Moves.DRAGON_RAGE ],
    [ 50, Moves.HYPER_BEAM ]
  ],
  [Species.DRAGONAIR]: [
    [ 1, Moves.LEER ],
    [ 1, Moves.THUNDER_WAVE ],
    [ 1, Moves.WRAP ],
    [ 10, Moves.THUNDER_WAVE ],
    [ 20, Moves.AGILITY ],
    [ 35, Moves.SLAM ],
    [ 45, Moves.DRAGON_RAGE ],
    [ 55, Moves.HYPER_BEAM ]
  ],
  [Species.DRAGONITE]: [
    [ 1, Moves.AGILITY ],
    [ 1, Moves.LEER ],
    [ 1, Moves.THUNDER_WAVE ],
    [ 1, Moves.WRAP ],
    [ 10, Moves.THUNDER_WAVE ],
    [ 20, Moves.AGILITY ],
    [ 35, Moves.SLAM ],
    [ 45, Moves.DRAGON_RAGE ],
    [ 60, Moves.HYPER_BEAM ]
  ],
  [Species.MEWTWO]: [
    [ 1, Moves.CONFUSION ],
    [ 1, Moves.DISABLE ],
    [ 1, Moves.PSYCHIC ],
    [ 1, Moves.SWIFT ],
    [ 63, Moves.BARRIER ],
    [ 66, Moves.PSYCHIC ],
    [ 70, Moves.RECOVER ],
    [ 75, Moves.MIST ],
    [ 81, Moves.AMNESIA ]
  ],
  [Species.MEW]: [
    [ 1, Moves.POUND ],
    [ 10, Moves.TRANSFORM ],
    [ 20, Moves.MEGA_PUNCH ],
    [ 30, Moves.METRONOME ],
    [ 40, Moves.PSYCHIC ]
  ]
};

export const pokemonFormLevelMoves: PokemonSpeciesFormLevelMoves = {
  [Species.PIKACHU]: { //Custom
    1: [
      [ 1, Moves.TAIL_WHIP ],
      [ 1, Moves.GROWL ],
      [ 1, Moves.THUNDER_SHOCK ],
      [ 1, Moves.QUICK_ATTACK ],
      [ 1, Moves.SWEET_KISS ],
      [ 1, Moves.CHARM ],
      [ 1, Moves.NASTY_PLOT ],
      [ 1, Moves.PLAY_NICE ],
      [ 1, Moves.NUZZLE ],
      [ 4, Moves.THUNDER_WAVE ],
      [ 8, Moves.DOUBLE_TEAM ],
      [ 12, Moves.ELECTRO_BALL ],
      [ 16, Moves.FEINT ],
      [ 20, Moves.ZIPPY_ZAP ], //Custom
      [ 24, Moves.AGILITY ],
      [ 28, Moves.IRON_TAIL ],
      [ 32, Moves.DISCHARGE ],
      [ 34, Moves.FLOATY_FALL ], //Custom
      [ 36, Moves.THUNDERBOLT ],
      [ 40, Moves.LIGHT_SCREEN ],
      [ 42, Moves.SPLISHY_SPLASH ], //Custom
      [ 44, Moves.THUNDER ],
      [ 48, Moves.PIKA_PAPOW ],
    ],
    2: [
      [ 1, Moves.TAIL_WHIP ],
      [ 1, Moves.GROWL ],
      [ 1, Moves.THUNDER_SHOCK ],
      [ 1, Moves.QUICK_ATTACK ],
      [ 1, Moves.SWEET_KISS ],
      [ 1, Moves.CHARM ],
      [ 1, Moves.NASTY_PLOT ],
      [ 1, Moves.PLAY_NICE ],
      [ 1, Moves.NUZZLE ],
      [ 4, Moves.THUNDER_WAVE ],
      [ 8, Moves.DOUBLE_TEAM ],
      [ 12, Moves.ELECTRO_BALL ],
      [ 16, Moves.FEINT ],
      [ 20, Moves.SPARK ],
      [ 24, Moves.AGILITY ],
      [ 28, Moves.IRON_TAIL ],
      [ 32, Moves.DISCHARGE ],
      [ 36, Moves.THUNDERBOLT ],
      [ 40, Moves.LIGHT_SCREEN ],
      [ 44, Moves.THUNDER ],
      [ 48, Moves.PIKA_PAPOW ],
    ],
    3: [
      [ 1, Moves.METEOR_MASH ],
      [ 1, Moves.TAIL_WHIP ],
      [ 1, Moves.GROWL ],
      [ 1, Moves.THUNDER_SHOCK ],
      [ 1, Moves.QUICK_ATTACK ],
      [ 1, Moves.SWEET_KISS ],
      [ 1, Moves.CHARM ],
      [ 1, Moves.NASTY_PLOT ],
      [ 1, Moves.PLAY_NICE ],
      [ 1, Moves.NUZZLE ],
      [ 4, Moves.THUNDER_WAVE ],
      [ 8, Moves.DOUBLE_TEAM ],
      [ 12, Moves.ELECTRO_BALL ],
      [ 16, Moves.FEINT ],
      [ 20, Moves.SPARK ],
      [ 24, Moves.AGILITY ],
      [ 28, Moves.IRON_TAIL ],
      [ 32, Moves.DISCHARGE ],
      [ 36, Moves.THUNDERBOLT ],
      [ 40, Moves.LIGHT_SCREEN ],
      [ 44, Moves.THUNDER ],
      [ 48, Moves.PIKA_PAPOW ],
    ],
    4: [
      [ 1, Moves.ICICLE_CRASH ],
      [ 1, Moves.TAIL_WHIP ],
      [ 1, Moves.GROWL ],
      [ 1, Moves.THUNDER_SHOCK ],
      [ 1, Moves.QUICK_ATTACK ],
      [ 1, Moves.SWEET_KISS ],
      [ 1, Moves.CHARM ],
      [ 1, Moves.NASTY_PLOT ],
      [ 1, Moves.PLAY_NICE ],
      [ 1, Moves.NUZZLE ],
      [ 4, Moves.THUNDER_WAVE ],
      [ 8, Moves.DOUBLE_TEAM ],
      [ 12, Moves.ELECTRO_BALL ],
      [ 16, Moves.FEINT ],
      [ 20, Moves.SPARK ],
      [ 24, Moves.AGILITY ],
      [ 28, Moves.IRON_TAIL ],
      [ 32, Moves.DISCHARGE ],
      [ 36, Moves.THUNDERBOLT ],
      [ 40, Moves.LIGHT_SCREEN ],
      [ 44, Moves.THUNDER ],
      [ 48, Moves.PIKA_PAPOW ],
    ],
    5: [
      [ 1, Moves.DRAINING_KISS ],
      [ 1, Moves.TAIL_WHIP ],
      [ 1, Moves.GROWL ],
      [ 1, Moves.THUNDER_SHOCK ],
      [ 1, Moves.QUICK_ATTACK ],
      [ 1, Moves.SWEET_KISS ],
      [ 1, Moves.CHARM ],
      [ 1, Moves.NASTY_PLOT ],
      [ 1, Moves.PLAY_NICE ],
      [ 1, Moves.NUZZLE ],
      [ 4, Moves.THUNDER_WAVE ],
      [ 8, Moves.DOUBLE_TEAM ],
      [ 12, Moves.ELECTRO_BALL ],
      [ 16, Moves.FEINT ],
      [ 20, Moves.SPARK ],
      [ 24, Moves.AGILITY ],
      [ 28, Moves.IRON_TAIL ],
      [ 32, Moves.DISCHARGE ],
      [ 36, Moves.THUNDERBOLT ],
      [ 40, Moves.LIGHT_SCREEN ],
      [ 44, Moves.THUNDER ],
      [ 48, Moves.PIKA_PAPOW ],
    ],
    6: [
      [ 1, Moves.ELECTRIC_TERRAIN ],
      [ 1, Moves.TAIL_WHIP ],
      [ 1, Moves.GROWL ],
      [ 1, Moves.THUNDER_SHOCK ],
      [ 1, Moves.QUICK_ATTACK ],
      [ 1, Moves.SWEET_KISS ],
      [ 1, Moves.CHARM ],
      [ 1, Moves.NASTY_PLOT ],
      [ 1, Moves.PLAY_NICE ],
      [ 1, Moves.NUZZLE ],
      [ 4, Moves.THUNDER_WAVE ],
      [ 8, Moves.DOUBLE_TEAM ],
      [ 12, Moves.ELECTRO_BALL ],
      [ 16, Moves.FEINT ],
      [ 20, Moves.SPARK ],
      [ 24, Moves.AGILITY ],
      [ 28, Moves.IRON_TAIL ],
      [ 32, Moves.DISCHARGE ],
      [ 36, Moves.THUNDERBOLT ],
      [ 40, Moves.LIGHT_SCREEN ],
      [ 44, Moves.THUNDER ],
      [ 48, Moves.PIKA_PAPOW ],
    ],
    7: [
      [ 1, Moves.FLYING_PRESS ],
      [ 1, Moves.TAIL_WHIP ],
      [ 1, Moves.GROWL ],
      [ 1, Moves.THUNDER_SHOCK ],
      [ 1, Moves.QUICK_ATTACK ],
      [ 1, Moves.SWEET_KISS ],
      [ 1, Moves.CHARM ],
      [ 1, Moves.NASTY_PLOT ],
      [ 1, Moves.PLAY_NICE ],
      [ 1, Moves.NUZZLE ],
      [ 4, Moves.THUNDER_WAVE ],
      [ 8, Moves.DOUBLE_TEAM ],
      [ 12, Moves.ELECTRO_BALL ],
      [ 16, Moves.FEINT ],
      [ 20, Moves.SPARK ],
      [ 24, Moves.AGILITY ],
      [ 28, Moves.IRON_TAIL ],
      [ 32, Moves.DISCHARGE ],
      [ 36, Moves.THUNDERBOLT ],
      [ 40, Moves.LIGHT_SCREEN ],
      [ 44, Moves.THUNDER ],
      [ 48, Moves.PIKA_PAPOW ],
    ],
    8: [
      [ 1, Moves.TAIL_WHIP ],
      [ 1, Moves.GROWL ],
      [ 1, Moves.THUNDER_SHOCK ],
      [ 1, Moves.QUICK_ATTACK ],
      [ 1, Moves.SWEET_KISS ],
      [ 1, Moves.CHARM ],
      [ 1, Moves.NASTY_PLOT ],
      [ 1, Moves.PLAY_NICE ],
      [ 1, Moves.NUZZLE ],
      [ 4, Moves.THUNDER_WAVE ],
      [ 8, Moves.DOUBLE_TEAM ],
      [ 12, Moves.ELECTRO_BALL ],
      [ 16, Moves.FEINT ],
      [ 20, Moves.ZIPPY_ZAP ], //Custom
      [ 24, Moves.AGILITY ],
      [ 28, Moves.IRON_TAIL ],
      [ 32, Moves.DISCHARGE ],
      [ 34, Moves.FLOATY_FALL ], //Custom
      [ 36, Moves.THUNDERBOLT ],
      [ 40, Moves.LIGHT_SCREEN ],
      [ 42, Moves.SPLISHY_SPLASH ], //Custom
      [ 44, Moves.THUNDER ],
      [ 48, Moves.PIKA_PAPOW ],
    ],
  },
  [Species.EEVEE]: { //Custom
    1: [
      [ 1, Moves.TACKLE ],
      [ 1, Moves.TAIL_WHIP ],
      [ 1, Moves.GROWL ],
      [ 1, Moves.HELPING_HAND ],
      [ 1, Moves.COVET ],
      [ 5, Moves.SAND_ATTACK ],
      [ 10, Moves.QUICK_ATTACK ],
      [ 15, Moves.BABY_DOLL_EYES ],
      [ 18, Moves.BOUNCY_BUBBLE ], //Custom
      [ 18, Moves.SIZZLY_SLIDE ], //Custom
      [ 18, Moves.BUZZY_BUZZ ], //Custom
      [ 20, Moves.SWIFT ],
      [ 25, Moves.BITE ],
      [ 30, Moves.COPYCAT ],
      [ 33, Moves.BADDY_BAD ], //Custom
      [ 33, Moves.GLITZY_GLOW ], //Custom
      [ 35, Moves.BATON_PASS ],
      [ 40, Moves.VEEVEE_VOLLEY ], //Custom, replaces Take Down
      [ 43, Moves.FREEZY_FROST ], //Custom
      [ 43, Moves.SAPPY_SEED ], //Custom
      [ 45, Moves.CHARM ],
      [ 50, Moves.DOUBLE_EDGE ],
      [ 53, Moves.SPARKLY_SWIRL ], //Custom
      [ 55, Moves.LAST_RESORT ],
    ],
    2: [
      [ 1, Moves.TACKLE ],
      [ 1, Moves.TAIL_WHIP ],
      [ 1, Moves.GROWL ],
      [ 1, Moves.HELPING_HAND ],
      [ 1, Moves.COVET ],
      [ 5, Moves.SAND_ATTACK ],
      [ 10, Moves.QUICK_ATTACK ],
      [ 15, Moves.BABY_DOLL_EYES ],
      [ 18, Moves.BOUNCY_BUBBLE ], //Custom
      [ 18, Moves.SIZZLY_SLIDE ], //Custom
      [ 18, Moves.BUZZY_BUZZ ], //Custom
      [ 20, Moves.SWIFT ],
      [ 25, Moves.BITE ],
      [ 30, Moves.COPYCAT ],
      [ 33, Moves.BADDY_BAD ], //Custom
      [ 33, Moves.GLITZY_GLOW ], //Custom
      [ 35, Moves.BATON_PASS ],
      [ 40, Moves.VEEVEE_VOLLEY ], //Custom, replaces Take Down
      [ 43, Moves.FREEZY_FROST ], //Custom
      [ 43, Moves.SAPPY_SEED ], //Custom
      [ 45, Moves.CHARM ],
      [ 50, Moves.DOUBLE_EDGE ],
      [ 53, Moves.SPARKLY_SWIRL ], //Custom
      [ 55, Moves.LAST_RESORT ],
    ],
  }
};

