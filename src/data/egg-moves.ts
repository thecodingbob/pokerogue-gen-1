import { allMoves } from "./move";
import * as Utils from "../utils";
import { Moves } from "#enums/moves";
import { Species } from "#enums/species";


export const speciesEggMoves = {
  // TODO: fill with moves only learnable in gen II
  [Species.BULBASAUR]: [],
  [Species.CHARMANDER]: [],
  [Species.SQUIRTLE]: [],
  [Species.CATERPIE]: [],
  [Species.WEEDLE]: [],
  [Species.PIDGEY]: [],
  [Species.RATTATA]: [],
  [Species.SPEAROW]: [],
  [Species.EKANS]: [],
  [Species.SANDSHREW]: [],
  [Species.NIDORAN_F]: [],
  [Species.NIDORAN_M]: [],
  [Species.VULPIX]: [],
  [Species.ZUBAT]: [],
  [Species.ODDISH]: [],
  [Species.PARAS]: [],
  [Species.VENONAT]: [],
  [Species.DIGLETT]: [],
  [Species.MEOWTH]: [],
  [Species.PSYDUCK]: [],
  [Species.MANKEY]: [],
  [Species.GROWLITHE]: [],
  [Species.POLIWAG]: [],
  [Species.ABRA]: [],
  [Species.MACHOP]: [],
  [Species.BELLSPROUT]: [],
  [Species.TENTACOOL]: [],
  [Species.GEODUDE]: [],
  [Species.PONYTA]: [],
  [Species.SLOWPOKE]: [],
  [Species.MAGNEMITE]: [],
  [Species.FARFETCHD]: [],
  [Species.DODUO]: [],
  [Species.SEEL]: [],
  [Species.GRIMER]: [],
  [Species.SHELLDER]: [],
  [Species.GASTLY]: [],
  [Species.ONIX]: [],
  [Species.DROWZEE]: [],
  [Species.KRABBY]: [],
  [Species.VOLTORB]: [],
  [Species.EXEGGCUTE]: [],
  [Species.CUBONE]: [],
  [Species.LICKITUNG]: [],
  [Species.KOFFING]: [],
  [Species.RHYHORN]: [],
  [Species.TANGELA]: [],
  [Species.KANGASKHAN]: [],
  [Species.HORSEA]: [],
  [Species.GOLDEEN]: [],
  [Species.STARYU]: [],
  [Species.SCYTHER]: [],
  [Species.PINSIR]: [],
  [Species.TAUROS]: [],
  [Species.MAGIKARP]: [],
  [Species.LAPRAS]: [],
  [Species.DITTO]: [],
  [Species.EEVEE]: [],
  [Species.PORYGON]: [],
  [Species.OMANYTE]: [],
  [Species.KABUTO]: [],
  [Species.AERODACTYL]: [],
  [Species.ARTICUNO]: [],
  [Species.ZAPDOS]: [],
  [Species.MOLTRES]: [],
  [Species.DRATINI]: [],
  [Species.MEWTWO]: [],
  [Species.MEW]: [],
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
