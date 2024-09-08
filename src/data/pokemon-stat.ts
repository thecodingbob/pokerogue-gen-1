import { Stat } from "#enums/stat";
import i18next from "i18next";

export { Stat };

export function getStatName(stat: Stat, shorten: boolean = false) {
  let ret: string = "";
  switch (stat) {
  case Stat.HP:
    ret = !shorten ? i18next.t("pokemonInfo:Stat.HP") : i18next.t("pokemonInfo:Stat.HPshortened");
    break;
  case Stat.ATK:
    ret = !shorten ? i18next.t("pokemonInfo:Stat.ATK") : i18next.t("pokemonInfo:Stat.ATKshortened");
    break;
  case Stat.DEF:
    ret = !shorten ? i18next.t("pokemonInfo:Stat.DEF") : i18next.t("pokemonInfo:Stat.DEFshortened");
    break;
  case Stat.SPEC:
    ret = !shorten ? i18next.t("pokemonInfo:Stat.SPEC") : i18next.t("pokemonInfo:Stat.SPECshortened");
    break;
  case Stat.SPD:
    ret = !shorten ? i18next.t("pokemonInfo:Stat.SPD") : i18next.t("pokemonInfo:Stat.SPDshortened");
    break;
  }
  return ret;
}
