import { allMoves } from "./move";
import * as Utils from "../utils";
import { Moves } from "#enums/moves";
import { Species } from "#enums/species";


export const speciesEggMoves = {
  [Species.BULBASAUR]: [ Moves.SAPPY_SEED, Moves.SLUDGE_WAVE, Moves.EARTH_POWER, Moves.MATCHA_GOTCHA ],
  [Species.CHARMANDER]: [ Moves.DRAGON_DANCE, Moves.BITTER_BLADE, Moves.EARTH_POWER, Moves.OBLIVION_WING ],
  [Species.SQUIRTLE]: [ Moves.FREEZE_DRY, Moves.SHORE_UP, Moves.BOUNCY_BUBBLE, Moves.ORIGIN_PULSE ],
  [Species.CATERPIE]: [ Moves.SANDSEAR_STORM, Moves.SILK_TRAP, Moves.TWIN_BEAM, Moves.BLEAKWIND_STORM ],
  [Species.WEEDLE]: [ Moves.THOUSAND_ARROWS, Moves.SWORDS_DANCE, Moves.ATTACK_ORDER, Moves.NOXIOUS_TORQUE ],
  [Species.PIDGEY]: [ Moves.WILDBOLT_STORM, Moves.SANDSEAR_STORM, Moves.CALM_MIND, Moves.BOOMBURST ],
  [Species.RATTATA]: [ Moves.HYPER_FANG, Moves.PSYCHIC_FANGS, Moves.FIRE_FANG, Moves.EXTREME_SPEED ],
  [Species.SPEAROW]: [ Moves.FLOATY_FALL, Moves.EXTREME_SPEED, Moves.TIDY_UP, Moves.TRIPLE_ARROWS ],
  [Species.EKANS]: [ Moves.NOXIOUS_TORQUE, Moves.DRAGON_DANCE, Moves.SLACK_OFF, Moves.SHED_TAIL ],
  [Species.SANDSHREW]: [ Moves.HIGH_HORSEPOWER, Moves.DIRE_CLAW, Moves.SHORE_UP, Moves.MIGHTY_CLEAVE ],
  [Species.NIDORAN_F]: [ Moves.NO_RETREAT, Moves.BANEFUL_BUNKER, Moves.SANDSEAR_STORM, Moves.MALIGNANT_CHAIN ],
  [Species.NIDORAN_M]: [ Moves.NOXIOUS_TORQUE, Moves.KINGS_SHIELD, Moves.NO_RETREAT, Moves.PRECIPICE_BLADES ],
  [Species.VULPIX]: [ Moves.MOONBLAST, Moves.INFERNAL_PARADE, Moves.MORNING_SUN, Moves.TAIL_GLOW ],
  [Species.ZUBAT]: [ Moves.FLOATY_FALL, Moves.DIRE_CLAW, Moves.SWORDS_DANCE, Moves.COLLISION_COURSE ],
  [Species.ODDISH]: [ Moves.SLUDGE_BOMB, Moves.FIERY_DANCE, Moves.STRENGTH_SAP, Moves.SPORE ],
  [Species.PARAS]: [ Moves.LEECH_LIFE, Moves.HORN_LEECH, Moves.CRABHAMMER, Moves.SAPPY_SEED ],
  [Species.VENONAT]: [ Moves.SLUDGE_BOMB, Moves.MOONLIGHT, Moves.EARTH_POWER, Moves.MYSTICAL_POWER ],
  [Species.DIGLETT]: [ Moves.TRIPLE_DIVE, Moves.SWORDS_DANCE, Moves.TRIPLE_AXEL, Moves.HEADLONG_RUSH ],
  [Species.MEOWTH]: [ Moves.COVET, Moves.SWORDS_DANCE, Moves.DOUBLE_KICK, Moves.TAIL_SLAP ],
  [Species.PSYDUCK]: [ Moves.SPLISHY_SPLASH, Moves.AQUA_STEP, Moves.AURA_SPHERE, Moves.MYSTICAL_POWER ],
  [Species.MANKEY]: [ Moves.DRAIN_PUNCH, Moves.PLAY_ROUGH, Moves.METEOR_MASH, Moves.NO_RETREAT ],
  [Species.GROWLITHE]: [ Moves.ZING_ZAP, Moves.PARTING_SHOT, Moves.MORNING_SUN, Moves.SACRED_FIRE ],
  [Species.POLIWAG]: [ Moves.SLACK_OFF, Moves.WILDBOLT_STORM, Moves.DRAIN_PUNCH, Moves.SURGING_STRIKES ],
  [Species.ABRA]: [ Moves.AURA_SPHERE, Moves.BADDY_BAD, Moves.THUNDERBOLT, Moves.PSYSTRIKE ],
  [Species.MACHOP]: [ Moves.COMBAT_TORQUE, Moves.METEOR_MASH, Moves.MOUNTAIN_GALE, Moves.FISSURE ],
  [Species.BELLSPROUT]: [ Moves.SOLAR_BLADE, Moves.STRENGTH_SAP, Moves.FIRE_LASH, Moves.VICTORY_DANCE ],
  [Species.TENTACOOL]: [ Moves.BANEFUL_BUNKER, Moves.STRENGTH_SAP, Moves.BOUNCY_BUBBLE, Moves.MALIGNANT_CHAIN ],
  [Species.GEODUDE]: [ Moves.BODY_PRESS, Moves.BULK_UP, Moves.SHORE_UP, Moves.HEAD_SMASH ],
  [Species.PONYTA]: [ Moves.HIGH_HORSEPOWER, Moves.FIRE_LASH, Moves.SWORDS_DANCE, Moves.VOLT_TACKLE ],
  [Species.SLOWPOKE]: [ Moves.BOUNCY_BUBBLE, Moves.FLAMETHROWER, Moves.MYSTICAL_POWER, Moves.SHED_TAIL ],
  [Species.MAGNEMITE]: [ Moves.PARABOLIC_CHARGE, Moves.BODY_PRESS, Moves.ICE_BEAM, Moves.THUNDERCLAP ],
  [Species.FARFETCHD]: [ Moves.IVY_CUDGEL, Moves.TRIPLE_ARROWS, Moves.ROOST, Moves.VICTORY_DANCE ],
  [Species.DODUO]: [ Moves.TRIPLE_AXEL, Moves.MULTI_ATTACK, Moves.FLOATY_FALL, Moves.TRIPLE_ARROWS ],
  [Species.SEEL]: [ Moves.FREEZE_DRY, Moves.BOUNCY_BUBBLE, Moves.SLACK_OFF, Moves.STEAM_ERUPTION ],
  [Species.GRIMER]: [ Moves.SUCKER_PUNCH, Moves.CURSE, Moves.STRENGTH_SAP, Moves.NOXIOUS_TORQUE ],
  [Species.SHELLDER]: [ Moves.ROCK_BLAST, Moves.WATER_SHURIKEN, Moves.BANEFUL_BUNKER, Moves.BONE_RUSH ],
  [Species.GASTLY]: [ Moves.SLUDGE_BOMB, Moves.AURA_SPHERE, Moves.NASTY_PLOT, Moves.ASTRAL_BARRAGE ],
  [Species.ONIX]: [ Moves.SHORE_UP, Moves.BODY_PRESS, Moves.HEAVY_SLAM, Moves.DIAMOND_STORM ],
  [Species.DROWZEE]: [ Moves.BADDY_BAD, Moves.STRENGTH_SAP, Moves.LUMINA_CRASH, Moves.DARK_VOID ],
  [Species.KRABBY]: [ Moves.FIRE_LASH, Moves.PLAY_ROUGH, Moves.IVY_CUDGEL, Moves.SHELL_SMASH ],
  [Species.VOLTORB]: [ Moves.NASTY_PLOT, Moves.OVERHEAT, Moves.FROST_BREATH, Moves.ELECTRO_DRIFT ],
  [Species.EXEGGCUTE]: [ Moves.FICKLE_BEAM, Moves.APPLE_ACID, Moves.TRICK_ROOM, Moves.LUMINA_CRASH ],
  [Species.CUBONE]: [ Moves.HEAD_SMASH, Moves.WOOD_HAMMER, Moves.SHADOW_SNEAK, Moves.BITTER_BLADE ],
  [Species.LICKITUNG]: [ Moves.BODY_SLAM, Moves.FIRE_LASH, Moves.GRAV_APPLE, Moves.MILK_DRINK ],
  [Species.KOFFING]: [ Moves.SCALD, Moves.RECOVER, Moves.BODY_PRESS, Moves.MALIGNANT_CHAIN ],
  [Species.RHYHORN]: [ Moves.SHORE_UP, Moves.ICE_HAMMER, Moves.ACCELEROCK, Moves.HEAD_SMASH ],
  [Species.TANGELA]: [ Moves.STRENGTH_SAP, Moves.SNAP_TRAP, Moves.PARTING_SHOT, Moves.SAPPY_SEED ],
  [Species.KANGASKHAN]: [ Moves.POWER_UP_PUNCH, Moves.TRAILBLAZE, Moves.FACADE, Moves.SEISMIC_TOSS ],
  [Species.HORSEA]: [ Moves.SNIPE_SHOT, Moves.FROST_BREATH, Moves.HURRICANE, Moves.SPACIAL_REND ],
  [Species.GOLDEEN]: [ Moves.DRILL_RUN, Moves.FLIP_TURN, Moves.DRAGON_DANCE, Moves.FISHIOUS_REND ],
  [Species.STARYU]: [ Moves.CALM_MIND, Moves.BOUNCY_BUBBLE, Moves.MOONBLAST, Moves.MYSTICAL_POWER ],
  [Species.SCYTHER]: [ Moves.MIGHTY_CLEAVE, Moves.BUG_BITE, Moves.STORM_THROW, Moves.DOUBLE_IRON_BASH ],
  [Species.PINSIR]: [ Moves.EARTHQUAKE, Moves.LEECH_LIFE, Moves.CLOSE_COMBAT, Moves.EXTREME_SPEED ],
  [Species.TAUROS]: [ Moves.HIGH_HORSEPOWER, Moves.BLAZING_TORQUE, Moves.LIQUIDATION, Moves.COMBAT_TORQUE ],
  [Species.MAGIKARP]: [ Moves.FLIP_TURN, Moves.ICE_SPINNER, Moves.DRAGON_ASCENT, Moves.SURGING_STRIKES ],
  [Species.LAPRAS]: [ Moves.RECOVER, Moves.FREEZE_DRY, Moves.SHELL_SMASH, Moves.STEAM_ERUPTION ],
  [Species.DITTO]: [ Moves.MIMIC, Moves.SKETCH, Moves.METRONOME, Moves.IMPRISON ],
  [Species.EEVEE]: [ Moves.WISH, Moves.NO_RETREAT, Moves.ZIPPY_ZAP, Moves.BOOMBURST ],
  [Species.PORYGON]: [ Moves.THUNDERCLAP, Moves.AURA_SPHERE, Moves.FLAMETHROWER, Moves.TECHNO_BLAST ],
  [Species.OMANYTE]: [ Moves.FREEZE_DRY, Moves.EARTH_POWER, Moves.POWER_GEM, Moves.STEAM_ERUPTION ],
  [Species.KABUTO]: [ Moves.CEASELESS_EDGE, Moves.HIGH_HORSEPOWER, Moves.TRIPLE_DIVE, Moves.MIGHTY_CLEAVE ],
  [Species.AERODACTYL]: [ Moves.FLOATY_FALL, Moves.FLARE_BLITZ, Moves.SWORDS_DANCE, Moves.MIGHTY_CLEAVE ],
  [Species.ARTICUNO]: [ Moves.EARTH_POWER, Moves.CALM_MIND, Moves.AURORA_VEIL, Moves.AEROBLAST ],
  [Species.ZAPDOS]: [ Moves.WEATHER_BALL, Moves.CALM_MIND, Moves.SANDSEAR_STORM, Moves.ELECTRO_SHOT ],
  [Species.MOLTRES]: [ Moves.SCORCHING_SANDS, Moves.CALM_MIND, Moves.AEROBLAST, Moves.TORCH_SONG ],
  [Species.DRATINI]: [ Moves.DRAGON_HAMMER, Moves.CRUSH_GRIP, Moves.FIRE_LASH, Moves.GIGATON_HAMMER ],
  [Species.MEWTWO]: [ Moves.METEOR_MASH, Moves.MOONBLAST, Moves.THUNDEROUS_KICK, Moves.PHOTON_GEYSER ],
  [Species.MEW]: [ Moves.PHOTON_GEYSER, Moves.MOONBLAST, Moves.ASTRAL_BARRAGE, Moves.SHELL_SMASH ],
};

function parseEggMoves(content: string): void {
  let output = "";

  const speciesNames = Utils.getEnumKeys(Species);
  const speciesValues = Utils.getEnumValues(Species);
  const lines = content.split(/\n/g);

  lines.forEach((line, l) => {
    const cols = line.split(",").slice(0, 5);
    const moveNames = allMoves.map(m => m.name.replace(/ \([A-Z]\)$/, "").toLowerCase());
    const enumSpeciesName = cols[0].toUpperCase().replace(/[ -]/g, "_");
    const species = speciesValues[speciesNames.findIndex(s => s === enumSpeciesName)];

    const eggMoves: Moves[] = [];

    for (let m = 0; m < 4; m++) {
      const moveName = cols[m + 1].trim();
      const moveIndex = moveName !== "N/A" ? moveNames.findIndex(mn => mn === moveName.toLowerCase()) : -1;
      eggMoves.push(moveIndex > -1 ? moveIndex as Moves : Moves.NONE);

      if (moveIndex === -1) {
        console.warn(moveName, "could not be parsed");
      }
    }

    if (eggMoves.find(m => m !== Moves.NONE)) {
      output += `[Species.${Species[species]}]: [ ${eggMoves.map(m => `Moves.${Moves[m]}`).join(", ")} ],\n`;
    }
  });

  console.log(output);
}

export function initEggMoves() {
  const eggMovesStr = "";
  if (eggMovesStr) {
    setTimeout(() => {
      parseEggMoves(eggMovesStr);
    }, 1000);
  }
}
