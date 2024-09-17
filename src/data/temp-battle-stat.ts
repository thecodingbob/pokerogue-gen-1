import { BattleStat, getBattleStatName } from "./battle-stat";
import i18next from "i18next";

export enum TempBattleStat {
  ATK = "ATK",
  DEF = "DEF",
  SPEC = "SPEC",
  SPD = "SPD",
  ACC = "ACC",
  CRIT = "CRIT",
}

export function getTempBattleStatName(tempBattleStat: TempBattleStat) {
  if (tempBattleStat === TempBattleStat.CRIT) {
    return i18next.t("modifierType:TempBattleStatBoosterStatName.CRIT");
  }
  return getBattleStatName(tempBattleStat as string as BattleStat);
}

export function getTempBattleStatBoosterItemName(tempBattleStat: TempBattleStat) {
  switch (tempBattleStat) {
  case TempBattleStat.ATK:
    return "X Attack";
  case TempBattleStat.DEF:
    return "X Defense";
  case TempBattleStat.SPEC:
    return "X Special";
  case TempBattleStat.SPD:
    return "X Speed";
  case TempBattleStat.ACC:
    return "X Accuracy";
  case TempBattleStat.CRIT:
    return "Dire Hit";
  }
}
