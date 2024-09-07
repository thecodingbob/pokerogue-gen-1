import { Localizable } from "#app/interfaces/locales";
import { Abilities } from "#enums/abilities";
import { PartyMemberStrength } from "#enums/party-member-strength";
import { Species } from "#enums/species";
import { QuantizerCelebi, argbFromRgba, rgbaFromArgb } from "@material/material-color-utilities";
import i18next from "i18next";
import BattleScene, { AnySound } from "../battle-scene";
import { GameMode } from "../game-mode";
import { StarterMoveset } from "../system/game-data";
import * as Utils from "../utils";
import { uncatchableSpecies } from "./biomes";
import { speciesEggMoves } from "./egg-moves";
import { GrowthRate } from "./exp";
import { EvolutionLevel, SpeciesWildEvolutionDelay, pokemonEvolutions, pokemonPrevolutions } from "./pokemon-evolutions";
import { Type } from "./type";
import { LevelMoves, pokemonFormLevelMoves, pokemonFormLevelMoves as pokemonSpeciesFormLevelMoves, pokemonSpeciesLevelMoves } from "./pokemon-level-moves";
import { Stat } from "./pokemon-stat";
import { Variant, VariantSet, variantColorCache, variantData } from "./variant";

export enum Region {
  NORMAL,
  ALOLA,
  GALAR,
  HISUI,
  PALDEA
}

/**
 * Gets the {@linkcode PokemonSpecies} object associated with the {@linkcode Species} enum given
 * @param species The species to fetch
 * @returns The associated {@linkcode PokemonSpecies} object
 */
export function getPokemonSpecies(species: Species | Species[] | undefined): PokemonSpecies {
  if (!species) {
    throw new Error("`species` must not be undefined in `getPokemonSpecies()`");
  }
  // If a special pool (named trainers) is used here it CAN happen that they have a array as species (which means choose one of those two). So we catch that with this code block
  if (Array.isArray(species)) {
    // Pick a random species from the list
    species = species[Math.floor(Math.random() * species.length)];
  }
  if (species >= 2000) {
    return allSpecies.find(s => s.speciesId === species)!; // TODO: is this bang correct?
  }
  return allSpecies[species - 1];
}

export function getPokemonSpeciesForm(species: Species, formIndex: integer): PokemonSpeciesForm {
  const retSpecies: PokemonSpecies = species >= 2000
    ? allSpecies.find(s => s.speciesId === species)! // TODO: is the bang correct?
    : allSpecies[species - 1];
  if (formIndex < retSpecies.forms?.length) {
    return retSpecies.forms[formIndex];
  }
  return retSpecies;
}

export function getFusedSpeciesName(speciesAName: string, speciesBName: string): string {
  const fragAPattern = /([a-z]{2}.*?[aeiou(?:y$)\-\']+)(.*?)$/i;
  const fragBPattern = /([a-z]{2}.*?[aeiou(?:y$)\-\'])(.*?)$/i;

  const [ speciesAPrefixMatch, speciesBPrefixMatch ] = [ speciesAName, speciesBName ].map(n => /^(?:[^ ]+) /.exec(n));
  const [ speciesAPrefix, speciesBPrefix ] = [ speciesAPrefixMatch, speciesBPrefixMatch ].map(m => m ? m[0] : "");

  if (speciesAPrefix) {
    speciesAName = speciesAName.slice(speciesAPrefix.length);
  }
  if (speciesBPrefix) {
    speciesBName = speciesBName.slice(speciesBPrefix.length);
  }

  const [ speciesASuffixMatch, speciesBSuffixMatch ] = [ speciesAName, speciesBName ].map(n => / (?:[^ ]+)$/.exec(n));
  const [ speciesASuffix, speciesBSuffix ] = [ speciesASuffixMatch, speciesBSuffixMatch ].map(m => m ? m[0] : "");

  if (speciesASuffix) {
    speciesAName = speciesAName.slice(0, -speciesASuffix.length);
  }
  if (speciesBSuffix) {
    speciesBName = speciesBName.slice(0, -speciesBSuffix.length);
  }

  const splitNameA = speciesAName.split(/ /g);
  const splitNameB = speciesBName.split(/ /g);

  const fragAMatch = fragAPattern.exec(speciesAName);
  const fragBMatch = fragBPattern.exec(speciesBName);

  let fragA: string;
  let fragB: string;

  fragA = splitNameA.length === 1
    ? fragAMatch ? fragAMatch[1] : speciesAName
    : splitNameA[splitNameA.length - 1];

  if (splitNameB.length === 1) {
    if (fragBMatch) {
      const lastCharA = fragA.slice(fragA.length - 1);
      const prevCharB = fragBMatch[1].slice(fragBMatch.length - 1);
      fragB = (/[\-']/.test(prevCharB) ? prevCharB : "") + fragBMatch[2] || prevCharB;
      if (lastCharA === fragB[0]) {
        if (/[aiu]/.test(lastCharA)) {
          fragB = fragB.slice(1);
        } else {
          const newCharMatch = new RegExp(`[^${lastCharA}]`).exec(fragB);
          if (newCharMatch?.index !== undefined && newCharMatch.index > 0) {
            fragB = fragB.slice(newCharMatch.index);
          }
        }
      }
    } else {
      fragB = speciesBName;
    }
  } else {
    fragB = splitNameB[splitNameB.length - 1];
  }

  if (splitNameA.length > 1) {
    fragA = `${splitNameA.slice(0, splitNameA.length - 1).join(" ")} ${fragA}`;
  }

  fragB = `${fragB.slice(0, 1).toLowerCase()}${fragB.slice(1)}`;

  return `${speciesAPrefix || speciesBPrefix}${fragA}${fragB}${speciesBSuffix || speciesASuffix}`;
}

export type PokemonSpeciesFilter = (species: PokemonSpecies) => boolean;

export abstract class PokemonSpeciesForm {
  public speciesId: Species;
  public formIndex: integer;
  public generation: integer;
  public type1: Type;
  public type2: Type | null;
  public height: number;
  public weight: number;
  public ability1: Abilities;
  public ability2: Abilities;
  public abilityHidden: Abilities;
  public baseTotal: integer;
  public baseStats: integer[];
  public catchRate: integer;
  public baseFriendship: integer;
  public baseExp: integer;
  public genderDiffs: boolean;
  public isStarterSelectable: boolean;

  constructor(type1: Type, type2: Type | null, height: number, weight: number, ability1: Abilities, ability2: Abilities, abilityHidden: Abilities,
    baseTotal: integer, baseHp: integer, baseAtk: integer, baseDef: integer, baseSpatk: integer, baseSpdef: integer, baseSpd: integer,
    catchRate: integer, baseFriendship: integer, baseExp: integer, genderDiffs: boolean, isStarterSelectable: boolean) {
    this.type1 = type1;
    this.type2 = type2;
    this.height = height;
    this.weight = weight;
    this.ability1 = ability1;
    this.ability2 = ability2 === Abilities.NONE ? ability1 : ability2;
    this.abilityHidden = abilityHidden;
    this.baseTotal = baseTotal;
    this.baseStats = [ baseHp, baseAtk, baseDef, baseSpatk, baseSpdef, baseSpd ];
    this.catchRate = catchRate;
    this.baseFriendship = baseFriendship;
    this.baseExp = baseExp;
    this.genderDiffs = genderDiffs;
    this.isStarterSelectable = isStarterSelectable;
  }

  /**
   * Method to get the root species id of a Pokemon.
   * Magmortar.getRootSpeciesId(true) => Magmar
   * Magmortar.getRootSpeciesId(false) => Magby
   * @param forStarter boolean to get the nonbaby form of a starter
   * @returns The species
   */
  getRootSpeciesId(forStarter: boolean = false): Species {
    let ret = this.speciesId;
    while (pokemonPrevolutions.hasOwnProperty(ret) && (!forStarter || !speciesStarters.hasOwnProperty(ret))) {
      ret = pokemonPrevolutions[ret];
    }
    return ret;
  }

  isOfType(type: integer): boolean {
    return this.type1 === type || (this.type2 !== null && this.type2 === type);
  }

  /**
   * Method to get the total number of abilities a Pokemon species has.
   * @returns Number of abilities
   */
  getAbilityCount(): integer {
    return this.abilityHidden !== Abilities.NONE ? 3 : 2;
  }

  /**
   * Method to get the ability of a Pokemon species.
   * @param abilityIndex Which ability to get (should only be 0-2)
   * @returns The id of the Ability
   */
  getAbility(abilityIndex: integer): Abilities {
    let ret: Abilities;
    if (abilityIndex === 0) {
      ret = this.ability1;
    } else if (abilityIndex === 1) {
      ret = this.ability2;
    } else {
      ret = this.abilityHidden;
    }
    return ret;
  }

  getLevelMoves(): LevelMoves {
    if (pokemonSpeciesFormLevelMoves.hasOwnProperty(this.speciesId) && pokemonSpeciesFormLevelMoves[this.speciesId].hasOwnProperty(this.formIndex)) {
      return pokemonSpeciesFormLevelMoves[this.speciesId][this.formIndex].slice(0);
    }
    return pokemonSpeciesLevelMoves[this.speciesId].slice(0);
  }

  getRegion(): Region {
    return Math.floor(this.speciesId / 2000) as Region;
  }

  isObtainable(): boolean {
    return (this.generation <= 9 || pokemonPrevolutions.hasOwnProperty(this.speciesId));
  }

  isCatchable(): boolean {
    return this.isObtainable() && uncatchableSpecies.indexOf(this.speciesId) === -1;
  }

  isRegional(): boolean {
    return this.getRegion() > Region.NORMAL;
  }

  isRareRegional(): boolean {
    switch (this.getRegion()) {
    case Region.HISUI:
      return true;
    }

    return false;
  }

  /**
   * Gets the species' base stat amount for the given stat.
   * @param stat  The desired stat.
   * @returns The species' base stat amount.
   */
  getBaseStat(stat: Stat): integer {
    return this.baseStats[stat];
  }

  getBaseExp(): integer {
    let ret = this.baseExp;
    switch (this.getFormSpriteKey()) {
    case SpeciesFormKey.MEGA:
    case SpeciesFormKey.MEGA_X:
    case SpeciesFormKey.MEGA_Y:
    case SpeciesFormKey.PRIMAL:
    case SpeciesFormKey.GIGANTAMAX:
    case SpeciesFormKey.ETERNAMAX:
      ret *= 1.5;
      break;
    }
    return ret;
  }

  getSpriteAtlasPath(female: boolean, formIndex?: integer, shiny?: boolean, variant?: integer): string {
    const spriteId = this.getSpriteId(female, formIndex, shiny, variant).replace(/\_{2}/g, "/");
    return `${/_[1-3]$/.test(spriteId) ? "variant/" : ""}${spriteId}`;
  }

  getSpriteId(female: boolean, formIndex?: integer, shiny?: boolean, variant: integer = 0, back?: boolean): string {
    if (formIndex === undefined || this instanceof PokemonForm) {
      formIndex = this.formIndex;
    }

    const formSpriteKey = this.getFormSpriteKey(formIndex);
    const showGenderDiffs = this.genderDiffs && female && ![ SpeciesFormKey.MEGA, SpeciesFormKey.GIGANTAMAX ].find(k => formSpriteKey === k);

    const baseSpriteKey = `${showGenderDiffs ? "female__" : ""}${this.speciesId}${formSpriteKey ? `-${formSpriteKey}` : ""}`;

    let config = variantData;
    `${back ? "back__" : ""}${baseSpriteKey}`.split("__").map(p => config ? config = config[p] : null);
    const variantSet = config as VariantSet;

    return `${back ? "back__" : ""}${shiny && (!variantSet || (!variant && !variantSet[variant || 0])) ? "shiny__" : ""}${baseSpriteKey}${shiny && variantSet && variantSet[variant] === 2 ? `_${variant + 1}` : ""}`;
  }

  getSpriteKey(female: boolean, formIndex?: integer, shiny?: boolean, variant?: integer): string {
    return `pkmn__${this.getSpriteId(female, formIndex, shiny, variant)}`;
  }

  abstract getFormSpriteKey(formIndex?: integer): string;


  /**
   * Variant Data key/index is either species id or species id followed by -formkey
   * @param formIndex optional form index for pokemon with different forms
   * @returns species id if no additional forms, index with formkey if a pokemon with a form
   */
  getVariantDataIndex(formIndex?: integer) {
    let formkey: string | null = null;
    let variantDataIndex: integer | string = this.speciesId;
    const species = getPokemonSpecies(this.speciesId);
    if (species.forms.length > 0 && formIndex !== undefined) {
      formkey = species.forms[formIndex]?.getFormSpriteKey(formIndex);
      if (formkey) {
        variantDataIndex = `${this.speciesId}-${formkey}`;
      }
    }
    return variantDataIndex;
  }

  getIconAtlasKey(formIndex?: integer, shiny?: boolean, variant?: integer): string {
    const variantDataIndex = this.getVariantDataIndex(formIndex);
    const isVariant = shiny && variantData[variantDataIndex] && (variant !== undefined && variantData[variantDataIndex][variant]);
    return `pokemon_icons_${this.generation}${isVariant ? "v" : ""}`;
  }

  getIconId(female: boolean, formIndex?: integer, shiny?: boolean, variant?: integer): string {
    if (formIndex === undefined) {
      formIndex = this.formIndex;
    }

    const variantDataIndex = this.getVariantDataIndex(formIndex);

    let ret = this.speciesId.toString();

    const isVariant = shiny && variantData[variantDataIndex] && (variant !== undefined && variantData[variantDataIndex][variant]);

    if (shiny && !isVariant) {
      ret += "s";
    }

    const formSpriteKey = this.getFormSpriteKey(formIndex);
    if (formSpriteKey) {
      ret += `-${formSpriteKey}`;
    }

    if (isVariant) {
      ret += `_${variant + 1}`;
    }

    return ret;
  }

  getCryKey(formIndex?: integer): string {
    let speciesId = this.speciesId;
    if (this.speciesId > 2000) {
      speciesId = speciesId % 2000;
    }
    let ret = speciesId.toString();
    const forms = getPokemonSpecies(speciesId).forms;
    if (forms.length) {
      if (formIndex !== undefined && formIndex >= forms.length) {
        console.warn(`Attempted accessing form with index ${formIndex} of species ${getPokemonSpecies(speciesId).getName()} with only ${forms.length || 0} forms`);
        formIndex = Math.min(formIndex, forms.length - 1);
      }
      const formKey = forms[formIndex || 0].formKey;
      switch (formKey) {
      case SpeciesFormKey.MEGA:
      case SpeciesFormKey.MEGA_X:
      case SpeciesFormKey.MEGA_Y:
      case SpeciesFormKey.GIGANTAMAX:
      case SpeciesFormKey.GIGANTAMAX_SINGLE:
      case SpeciesFormKey.GIGANTAMAX_RAPID:
      case "white":
      case "black":
      case "therian":
      case "sky":
      case "gorging":
      case "gulping":
      case "no-ice":
      case "hangry":
      case "crowned":
      case "eternamax":
      case "four":
      case "droopy":
      case "stretchy":
      case "hero":
      case "roaming":
      case "complete":
      case "10":
      case "10-pc":
      case "super":
      case "unbound":
      case "pau":
      case "pompom":
      case "sensu":
      case "dusk":
      case "midnight":
      case "school":
      case "dawn-wings":
      case "dusk-mane":
      case "ultra":
        ret += `-${formKey}`;
        break;
      }
    }
    return ret;
  }

  validateStarterMoveset(moveset: StarterMoveset, eggMoves: integer): boolean {
    const rootSpeciesId = this.getRootSpeciesId();
    for (const moveId of moveset) {
      if (speciesEggMoves.hasOwnProperty(rootSpeciesId)) {
        const eggMoveIndex = speciesEggMoves[rootSpeciesId].findIndex(m => m === moveId);
        if (eggMoveIndex > -1 && (eggMoves & (1 << eggMoveIndex))) {
          continue;
        }
      }
      if (pokemonFormLevelMoves.hasOwnProperty(this.speciesId) && pokemonFormLevelMoves[this.speciesId].hasOwnProperty(this.formIndex)) {
        if (!pokemonFormLevelMoves[this.speciesId][this.formIndex].find(lm => lm[0] <= 5 && lm[1] === moveId)) {
          return false;
        }
      } else if (!pokemonSpeciesLevelMoves[this.speciesId].find(lm => lm[0] <= 5 && lm[1] === moveId)) {
        return false;
      }
    }

    return true;
  }

  loadAssets(scene: BattleScene, female: boolean, formIndex?: integer, shiny?: boolean, variant?: Variant, startLoad?: boolean): Promise<void> {
    return new Promise(resolve => {
      const spriteKey = this.getSpriteKey(female, formIndex, shiny, variant);
      scene.loadPokemonAtlas(spriteKey, this.getSpriteAtlasPath(female, formIndex, shiny, variant));
      scene.load.audio(`cry/${this.getCryKey(formIndex)}`, `audio/cry/${this.getCryKey(formIndex)}.m4a`);
      scene.load.once(Phaser.Loader.Events.COMPLETE, () => {
        const originalWarn = console.warn;
        // Ignore warnings for missing frames, because there will be a lot
        console.warn = () => {};
        const frameNames = scene.anims.generateFrameNames(spriteKey, { zeroPad: 4, suffix: ".png", start: 1, end: 400 });
        console.warn = originalWarn;
        if (!(scene.anims.exists(spriteKey))) {
          scene.anims.create({
            key: this.getSpriteKey(female, formIndex, shiny, variant),
            frames: frameNames,
            frameRate: 12,
            repeat: -1
          });
        }
        let spritePath = this.getSpriteAtlasPath(female, formIndex, shiny, variant).replace("variant/", "").replace(/_[1-3]$/, "");
        const useExpSprite = scene.experimentalSprites && scene.hasExpSprite(spriteKey);
        if (useExpSprite) {
          spritePath = `exp/${spritePath}`;
        }
        let config = variantData;
        spritePath.split("/").map(p => config ? config = config[p] : null);
        const variantSet = config as VariantSet;
        if (variantSet && (variant !== undefined && variantSet[variant] === 1)) {
          const populateVariantColors = (key: string): Promise<void> => {
            return new Promise(resolve => {
              if (variantColorCache.hasOwnProperty(key)) {
                return resolve();
              }
              scene.cachedFetch(`./images/pokemon/variant/${spritePath}.json`).then(res => res.json()).then(c => {
                variantColorCache[key] = c;
                resolve();
              });
            });
          };
          populateVariantColors(spriteKey).then(() => resolve());
          return;
        }
        resolve();
      });
      if (startLoad) {
        if (!scene.load.isLoading()) {
          scene.load.start();
        }
      } else {
        resolve();
      }
    });
  }

  cry(scene: BattleScene, soundConfig?: Phaser.Types.Sound.SoundConfig, ignorePlay?: boolean): AnySound {
    const cryKey = this.getCryKey(this.formIndex);
    let cry: AnySound | null = scene.sound.get(cryKey) as AnySound;
    if (cry?.pendingRemove) {
      cry = null;
    }
    cry = scene.playSound(`cry/${(cry ?? cryKey)}`, soundConfig);
    if (ignorePlay) {
      cry.stop();
    }
    return cry;
  }

  generateCandyColors(scene: BattleScene): integer[][] {
    const sourceTexture = scene.textures.get(this.getSpriteKey(false));

    const sourceFrame = sourceTexture.frames[sourceTexture.firstFrame];
    const sourceImage = sourceTexture.getSourceImage() as HTMLImageElement;

    const canvas = document.createElement("canvas");

    const spriteColors: integer[][] = [];

    const context = canvas.getContext("2d");
    const frame = sourceFrame;
    canvas.width = frame.width;
    canvas.height = frame.height;
    context?.drawImage(sourceImage, frame.cutX, frame.cutY, frame.width, frame.height, 0, 0, frame.width, frame.height);
    const imageData = context?.getImageData(frame.cutX, frame.cutY, frame.width, frame.height);
    const pixelData = imageData?.data;
    const pixelColors: number[] = [];

    if (pixelData?.length !== undefined) {
      for (let i = 0; i < pixelData.length; i += 4) {
        if (pixelData[i + 3]) {
          const pixel = pixelData.slice(i, i + 4);
          const [ r, g, b, a ] = pixel;
          if (!spriteColors.find(c => c[0] === r && c[1] === g && c[2] === b)) {
            spriteColors.push([ r, g, b, a ]);
          }
        }
      }

      for (let i = 0; i < pixelData.length; i += 4) {
        const total = pixelData.slice(i, i + 3).reduce((total: integer, value: integer) => total + value, 0);
        if (!total) {
          continue;
        }
        pixelColors.push(argbFromRgba({ r: pixelData[i], g: pixelData[i + 1], b: pixelData[i + 2], a: pixelData[i + 3] }));
      }
    }

    let paletteColors: Map<number, number> = new Map();

    const originalRandom = Math.random;
    Math.random = () => Phaser.Math.RND.realInRange(0, 1);

    scene.executeWithSeedOffset(() => {
      paletteColors = QuantizerCelebi.quantize(pixelColors, 2);
    }, 0, "This result should not vary");

    Math.random = originalRandom;

    return Array.from(paletteColors.keys()).map(c => Object.values(rgbaFromArgb(c)) as integer[]);
  }
}

export default class PokemonSpecies extends PokemonSpeciesForm implements Localizable {
  public name: string;
  public subLegendary: boolean;
  public legendary: boolean;
  public mythical: boolean;
  public species: string;
  public growthRate: GrowthRate;
  public malePercent: number | null;
  public genderDiffs: boolean;
  public canChangeForm: boolean;
  public forms: PokemonForm[];

  constructor(id: Species, generation: integer, subLegendary: boolean, legendary: boolean, mythical: boolean, species: string,
    type1: Type, type2: Type | null, height: number, weight: number, ability1: Abilities, ability2: Abilities, abilityHidden: Abilities,
    baseTotal: integer, baseHp: integer, baseAtk: integer, baseDef: integer, baseSpatk: integer, baseSpdef: integer, baseSpd: integer,
    catchRate: integer, baseFriendship: integer, baseExp: integer, growthRate: GrowthRate, malePercent: number | null,
    genderDiffs: boolean, canChangeForm?: boolean, ...forms: PokemonForm[]) {
    super(type1, type2, height, weight, ability1, ability2, abilityHidden, baseTotal, baseHp, baseAtk, baseDef, baseSpatk, baseSpdef, baseSpd,
      catchRate, baseFriendship, baseExp, genderDiffs, false);
    this.speciesId = id;
    this.formIndex = 0;
    this.generation = generation;
    this.subLegendary = subLegendary;
    this.legendary = legendary;
    this.mythical = mythical;
    this.species = species;
    this.growthRate = growthRate;
    this.malePercent = malePercent;
    this.genderDiffs = genderDiffs;
    this.canChangeForm = !!canChangeForm;
    this.forms = forms;

    this.localize();

    forms.forEach((form, f) => {
      form.speciesId = id;
      form.formIndex = f;
      form.generation = generation;
    });
  }

  getName(formIndex?: integer): string {
    if (formIndex !== undefined && this.forms.length) {
      const form = this.forms[formIndex];
      let key: string | null;
      switch (form.formKey) {
      case SpeciesFormKey.MEGA:
      case SpeciesFormKey.PRIMAL:
      case SpeciesFormKey.ETERNAMAX:
      case SpeciesFormKey.MEGA_X:
      case SpeciesFormKey.MEGA_Y:
        key = form.formKey;
        break;
      default:
        if (form.formKey.indexOf(SpeciesFormKey.GIGANTAMAX) > -1) {
          key = "gigantamax";
        } else {
          key = null;
        }
      }

      if (key) {
        return i18next.t(`battlePokemonForm:${key}`, {pokemonName: this.name});
      }
    }
    return this.name;
  }

  localize(): void {
    this.name = i18next.t(`pokemon:${Species[this.speciesId].toLowerCase()}`);
  }

  getWildSpeciesForLevel(level: integer, allowEvolving: boolean, isBoss: boolean, gameMode: GameMode): Species {
    return this.getSpeciesForLevel(level, allowEvolving, false, (isBoss ? PartyMemberStrength.WEAKER : PartyMemberStrength.AVERAGE) + (gameMode?.isEndless ? 1 : 0));
  }

  getTrainerSpeciesForLevel(level: integer, allowEvolving: boolean = false, strength: PartyMemberStrength, currentWave: number = 0): Species {
    return this.getSpeciesForLevel(level, allowEvolving, true, strength, currentWave);
  }

  private getStrengthLevelDiff(strength: PartyMemberStrength): integer {
    switch (Math.min(strength, PartyMemberStrength.STRONGER)) {
    case PartyMemberStrength.WEAKEST:
      return 60;
    case PartyMemberStrength.WEAKER:
      return 40;
    case PartyMemberStrength.WEAK:
      return 20;
    case PartyMemberStrength.AVERAGE:
      return 10;
    case PartyMemberStrength.STRONG:
      return 5;
    default:
      return 0;
    }
  }

  getSpeciesForLevel(level: integer, allowEvolving: boolean = false, forTrainer: boolean = false, strength: PartyMemberStrength = PartyMemberStrength.WEAKER, currentWave: number = 0): Species {
    const prevolutionLevels = this.getPrevolutionLevels();

    if (prevolutionLevels.length) {
      for (let pl = prevolutionLevels.length - 1; pl >= 0; pl--) {
        const prevolutionLevel = prevolutionLevels[pl];
        if (level < prevolutionLevel[1]) {
          return prevolutionLevel[0];
        }
      }
    }

    if (!allowEvolving || !pokemonEvolutions.hasOwnProperty(this.speciesId)) {
      return this.speciesId;
    }

    const evolutions = pokemonEvolutions[this.speciesId];

    const easeInFunc = Phaser.Tweens.Builders.GetEaseFunction("Sine.easeIn");
    const easeOutFunc = Phaser.Tweens.Builders.GetEaseFunction("Sine.easeOut");

    const evolutionPool: Map<number, Species> = new Map();
    let totalWeight = 0;
    let noEvolutionChance = 1;

    for (const ev of evolutions) {
      if (ev.level > level) {
        continue;
      }

      let evolutionChance: number;

      const evolutionSpecies = getPokemonSpecies(ev.speciesId);
      const isRegionalEvolution = !this.isRegional() && evolutionSpecies.isRegional();

      if (!forTrainer && isRegionalEvolution) {
        evolutionChance = 0;
      } else {
        if (ev.wildDelay === SpeciesWildEvolutionDelay.NONE) {
          if (strength === PartyMemberStrength.STRONGER) {
            evolutionChance = 1;
          } else {
            const maxLevelDiff = this.getStrengthLevelDiff(strength);
            const minChance: number = 0.875 - 0.125 * strength;

            evolutionChance = Math.min(minChance + easeInFunc(Math.min(level - ev.level, maxLevelDiff) / maxLevelDiff) * (1 - minChance), 1);
          }
        } else {
          const preferredMinLevel = Math.max((ev.level - 1) + (ev.wildDelay!) * this.getStrengthLevelDiff(strength), 1); // TODO: is the bang correct?
          let evolutionLevel = Math.max(ev.level > 1 ? ev.level : Math.floor(preferredMinLevel / 2), 1);

          if (ev.level <= 1 && pokemonPrevolutions.hasOwnProperty(this.speciesId)) {
            const prevolutionLevel = pokemonEvolutions[pokemonPrevolutions[this.speciesId]].find(ev => ev.speciesId === this.speciesId)!.level; // TODO: is the bang correct?
            if (prevolutionLevel > 1) {
              evolutionLevel = prevolutionLevel;
            }
          }

          evolutionChance = Math.min(0.65 * easeInFunc(Math.min(Math.max(level - evolutionLevel, 0), preferredMinLevel) / preferredMinLevel) + 0.35 * easeOutFunc(Math.min(Math.max(level - evolutionLevel, 0), preferredMinLevel * 2.5) / (preferredMinLevel * 2.5)), 1);
        }
      }
      /* (Most) Trainers shouldn't be using unevolved Pokemon by the third gym leader / wave 80. Exceptions to this include Breeders, whose large teams are balanced by the use of weaker pokemon */
      if (currentWave >= 80 && forTrainer && strength > PartyMemberStrength.WEAKER) {
        evolutionChance = 1;
        noEvolutionChance = 0;
      }

      if (evolutionChance > 0) {
        if (isRegionalEvolution) {
          evolutionChance /= (evolutionSpecies.isRareRegional() ? 16 : 4);
        }

        totalWeight += evolutionChance;

        evolutionPool.set(totalWeight, ev.speciesId);

        if ((1 - evolutionChance) < noEvolutionChance) {
          noEvolutionChance = 1 - evolutionChance;
        }
      }
    }

    if (noEvolutionChance === 1 || Phaser.Math.RND.realInRange(0, 1) < noEvolutionChance) {
      return this.speciesId;
    }

    const randValue = evolutionPool.size === 1 ? 0 : Utils.randSeedInt(totalWeight);

    for (const weight of evolutionPool.keys()) {
      if (randValue < weight) {
        return getPokemonSpecies(evolutionPool.get(weight)).getSpeciesForLevel(level, true, forTrainer, strength, currentWave);
      }
    }

    return this.speciesId;
  }

  getEvolutionLevels(): EvolutionLevel[] {
    const evolutionLevels: EvolutionLevel[] = [];

    //console.log(Species[this.speciesId], pokemonEvolutions[this.speciesId])

    if (pokemonEvolutions.hasOwnProperty(this.speciesId)) {
      for (const e of pokemonEvolutions[this.speciesId]) {
        const speciesId = e.speciesId;
        const level = e.level;
        evolutionLevels.push([ speciesId, level ]);
        //console.log(Species[speciesId], getPokemonSpecies(speciesId), getPokemonSpecies(speciesId).getEvolutionLevels());
        const nextEvolutionLevels = getPokemonSpecies(speciesId).getEvolutionLevels();
        for (const npl of nextEvolutionLevels) {
          evolutionLevels.push(npl);
        }
      }
    }

    return evolutionLevels;
  }

  getPrevolutionLevels(): EvolutionLevel[] {
    const prevolutionLevels: EvolutionLevel[] = [];

    const allEvolvingPokemon = Object.keys(pokemonEvolutions);
    for (const p of allEvolvingPokemon) {
      for (const e of pokemonEvolutions[p]) {
        if (e.speciesId === this.speciesId && (!this.forms.length || !e.evoFormKey || e.evoFormKey === this.forms[this.formIndex].formKey) && prevolutionLevels.every(pe => pe[0] !== parseInt(p))) {
          const speciesId = parseInt(p) as Species;
          const level = e.level;
          prevolutionLevels.push([ speciesId, level ]);
          const subPrevolutionLevels = getPokemonSpecies(speciesId).getPrevolutionLevels();
          for (const spl of subPrevolutionLevels) {
            prevolutionLevels.push(spl);
          }
        }
      }
    }

    return prevolutionLevels;
  }

  // This could definitely be written better and more accurate to the getSpeciesForLevel logic, but it is only for generating movesets for evolved Pokemon
  getSimulatedEvolutionChain(currentLevel: integer, forTrainer: boolean = false, isBoss: boolean = false, player: boolean = false): EvolutionLevel[] {
    const ret: EvolutionLevel[] = [];
    if (pokemonPrevolutions.hasOwnProperty(this.speciesId)) {
      const prevolutionLevels = this.getPrevolutionLevels().reverse();
      const levelDiff = player ? 0 : forTrainer || isBoss ? forTrainer && isBoss ? 2.5 : 5 : 10;
      ret.push([ prevolutionLevels[0][0], 1 ]);
      for (let l = 1; l < prevolutionLevels.length; l++) {
        const evolution = pokemonEvolutions[prevolutionLevels[l - 1][0]].find(e => e.speciesId === prevolutionLevels[l][0]);
        ret.push([ prevolutionLevels[l][0], Math.min(Math.max((evolution?.level!) + Math.round(Utils.randSeedGauss(0.5, 1 + levelDiff * 0.2) * Math.max((evolution?.wildDelay!), 0.5) * 5) - 1, 2, (evolution?.level!)), currentLevel - 1) ]); // TODO: are those bangs correct?
      }
      const lastPrevolutionLevel = ret[prevolutionLevels.length - 1][1];
      const evolution = pokemonEvolutions[prevolutionLevels[prevolutionLevels.length - 1][0]].find(e => e.speciesId === this.speciesId);
      ret.push([ this.speciesId, Math.min(Math.max(lastPrevolutionLevel + Math.round(Utils.randSeedGauss(0.5, 1 + levelDiff * 0.2) * Math.max((evolution?.wildDelay!), 0.5) * 5), lastPrevolutionLevel + 1, (evolution?.level!)), currentLevel) ]); // TODO: are those bangs correct?
    } else {
      ret.push([ this.speciesId, 1 ]);
    }

    return ret;
  }

  getCompatibleFusionSpeciesFilter(): PokemonSpeciesFilter {
    const hasEvolution = pokemonEvolutions.hasOwnProperty(this.speciesId);
    const hasPrevolution = pokemonPrevolutions.hasOwnProperty(this.speciesId);
    const pseudoLegendary = this.subLegendary;
    const legendary = this.legendary;
    const mythical = this.mythical;
    return species => {
      return (pseudoLegendary || legendary || mythical ||
        (pokemonEvolutions.hasOwnProperty(species.speciesId) === hasEvolution
        && pokemonPrevolutions.hasOwnProperty(species.speciesId) === hasPrevolution))
        && species.subLegendary === pseudoLegendary
        && species.legendary === legendary
        && species.mythical === mythical;
    };
  }

  isObtainable() {
    return super.isObtainable();
  }

  hasVariants() {
    let variantDataIndex: string | number = this.speciesId;
    if (this.forms.length > 0) {
      const formKey = this.forms[this.formIndex]?.formKey;
      if (formKey) {
        variantDataIndex = `${variantDataIndex}-${formKey}`;
      }
    }
    return variantData.hasOwnProperty(variantDataIndex) || variantData.hasOwnProperty(this.speciesId);
  }

  getFormSpriteKey(formIndex?: integer) {
    if (this.forms.length && (formIndex !== undefined && formIndex >= this.forms.length)) {
      console.warn(`Attempted accessing form with index ${formIndex} of species ${this.getName()} with only ${this.forms.length || 0} forms`);
      formIndex = Math.min(formIndex, this.forms.length - 1);
    }
    return this.forms?.length
      ? this.forms[formIndex || 0].getFormSpriteKey()
      : "";
  }
}

export class PokemonForm extends PokemonSpeciesForm {
  public formName: string;
  public formKey: string;
  public formSpriteKey: string | null;

  // This is a collection of form keys that have in-run form changes, but should still be separately selectable from the start screen
  private starterSelectableKeys: string[] = ["10", "50", "10-pc", "50-pc", "red", "orange", "yellow", "green", "blue", "indigo", "violet"];

  constructor(formName: string, formKey: string, type1: Type, type2: Type | null, height: number, weight: number, ability1: Abilities, ability2: Abilities, abilityHidden: Abilities,
    baseTotal: integer, baseHp: integer, baseAtk: integer, baseDef: integer, baseSpatk: integer, baseSpdef: integer, baseSpd: integer,
    catchRate: integer, baseFriendship: integer, baseExp: integer, genderDiffs?: boolean, formSpriteKey?: string | null, isStarterSelectable?: boolean, ) {
    super(type1, type2, height, weight, ability1, ability2, abilityHidden, baseTotal, baseHp, baseAtk, baseDef, baseSpatk, baseSpdef, baseSpd,
      catchRate, baseFriendship, baseExp, !!genderDiffs, (!!isStarterSelectable || !formKey));
    this.formName = formName;
    this.formKey = formKey;
    this.formSpriteKey = formSpriteKey !== undefined ? formSpriteKey : null;
  }

  getFormSpriteKey(_formIndex?: integer) {
    return this.formSpriteKey !== null ? this.formSpriteKey : this.formKey;
  }
}

export enum SpeciesFormKey {
  MEGA = "mega",
  MEGA_X = "mega-x",
  MEGA_Y = "mega-y",
  PRIMAL = "primal",
  ORIGIN = "origin",
  INCARNATE = "incarnate",
  THERIAN = "therian",
  GIGANTAMAX = "gigantamax",
  GIGANTAMAX_SINGLE = "gigantamax-single",
  GIGANTAMAX_RAPID = "gigantamax-rapid",
  ETERNAMAX = "eternamax"
}

export const allSpecies: PokemonSpecies[] = [];

export function initSpecies() {
  allSpecies.push(
    new PokemonSpecies(Species.BULBASAUR, 1, false, false, false, "Seed Pokémon", Type.GRASS, Type.POISON, 0.7, 6.9, Abilities.OVERGROW, Abilities.NONE, Abilities.CHLOROPHYLL, 318, 45, 49, 49, 65, 65, 45, 45, 50, 64, GrowthRate.MEDIUM_SLOW, 87.5, false),
    new PokemonSpecies(Species.IVYSAUR, 1, false, false, false, "Seed Pokémon", Type.GRASS, Type.POISON, 1, 13, Abilities.OVERGROW, Abilities.NONE, Abilities.CHLOROPHYLL, 405, 60, 62, 63, 80, 80, 60, 45, 50, 142, GrowthRate.MEDIUM_SLOW, 87.5, false),
    new PokemonSpecies(Species.VENUSAUR, 1, false, false, false, "Seed Pokémon", Type.GRASS, Type.POISON, 2, 100, Abilities.OVERGROW, Abilities.NONE, Abilities.CHLOROPHYLL, 525, 80, 82, 83, 100, 100, 80, 45, 50, 263, GrowthRate.MEDIUM_SLOW, 87.5, true, true,
      new PokemonForm("Normal", "", Type.GRASS, Type.POISON, 2, 100, Abilities.OVERGROW, Abilities.NONE, Abilities.CHLOROPHYLL, 525, 80, 82, 83, 100, 100, 80, 45, 50, 263, true, null, true),
      new PokemonForm("Mega", SpeciesFormKey.MEGA, Type.GRASS, Type.POISON, 2.4, 155.5, Abilities.THICK_FAT, Abilities.THICK_FAT, Abilities.THICK_FAT, 625, 80, 100, 123, 122, 120, 80, 45, 50, 263, true),
      new PokemonForm("G-Max", SpeciesFormKey.GIGANTAMAX, Type.GRASS, Type.POISON, 24, 100, Abilities.CHLOROPHYLL, Abilities.CHLOROPHYLL, Abilities.CHLOROPHYLL, 625, 120, 82, 98, 130, 115, 80, 45, 50, 263, true),
    ),
    new PokemonSpecies(Species.CHARMANDER, 1, false, false, false, "Lizard Pokémon", Type.FIRE, null, 0.6, 8.5, Abilities.BLAZE, Abilities.NONE, Abilities.SOLAR_POWER, 309, 39, 52, 43, 60, 50, 65, 45, 50, 62, GrowthRate.MEDIUM_SLOW, 87.5, false),
    new PokemonSpecies(Species.CHARMELEON, 1, false, false, false, "Flame Pokémon", Type.FIRE, null, 1.1, 19, Abilities.BLAZE, Abilities.NONE, Abilities.SOLAR_POWER, 405, 58, 64, 58, 80, 65, 80, 45, 50, 142, GrowthRate.MEDIUM_SLOW, 87.5, false),
    new PokemonSpecies(Species.CHARIZARD, 1, false, false, false, "Flame Pokémon", Type.FIRE, Type.FLYING, 1.7, 90.5, Abilities.BLAZE, Abilities.NONE, Abilities.SOLAR_POWER, 534, 78, 84, 78, 109, 85, 100, 45, 50, 267, GrowthRate.MEDIUM_SLOW, 87.5, false, true,
      new PokemonForm("Normal", "", Type.FIRE, Type.FLYING, 1.7, 90.5, Abilities.BLAZE, Abilities.NONE, Abilities.SOLAR_POWER, 534, 78, 84, 78, 109, 85, 100, 45, 50, 267, false, null, true),
      new PokemonForm("Mega X", SpeciesFormKey.MEGA_X, Type.FIRE, Type.DRAGON, 1.7, 110.5, Abilities.TOUGH_CLAWS, Abilities.NONE, Abilities.TOUGH_CLAWS, 634, 78, 130, 111, 130, 85, 100, 45, 50, 267),
      new PokemonForm("Mega Y", SpeciesFormKey.MEGA_Y, Type.FIRE, Type.FLYING, 1.7, 100.5, Abilities.DROUGHT, Abilities.NONE, Abilities.DROUGHT, 634, 78, 104, 78, 159, 115, 100, 45, 50, 267),
      new PokemonForm("G-Max", SpeciesFormKey.GIGANTAMAX, Type.FIRE, Type.FLYING, 28, 90.5, Abilities.SOLAR_POWER, Abilities.SOLAR_POWER, Abilities.SOLAR_POWER, 634, 118, 84, 93, 139, 110, 100, 45, 50, 267),
    ),
    new PokemonSpecies(Species.SQUIRTLE, 1, false, false, false, "Tiny Turtle Pokémon", Type.WATER, null, 0.5, 9, Abilities.TORRENT, Abilities.NONE, Abilities.RAIN_DISH, 314, 44, 48, 65, 50, 64, 43, 45, 50, 63, GrowthRate.MEDIUM_SLOW, 87.5, false),
    new PokemonSpecies(Species.WARTORTLE, 1, false, false, false, "Turtle Pokémon", Type.WATER, null, 1, 22.5, Abilities.TORRENT, Abilities.NONE, Abilities.RAIN_DISH, 405, 59, 63, 80, 65, 80, 58, 45, 50, 142, GrowthRate.MEDIUM_SLOW, 87.5, false),
    new PokemonSpecies(Species.BLASTOISE, 1, false, false, false, "Shellfish Pokémon", Type.WATER, null, 1.6, 85.5, Abilities.TORRENT, Abilities.NONE, Abilities.RAIN_DISH, 530, 79, 83, 100, 85, 105, 78, 45, 50, 265, GrowthRate.MEDIUM_SLOW, 87.5, false, true,
      new PokemonForm("Normal", "", Type.WATER, null, 1.6, 85.5, Abilities.TORRENT, Abilities.NONE, Abilities.RAIN_DISH, 530, 79, 83, 100, 85, 105, 78, 45, 50, 265, false, null, true),
      new PokemonForm("Mega", SpeciesFormKey.MEGA, Type.WATER, null, 1.6, 101.1, Abilities.MEGA_LAUNCHER, Abilities.NONE, Abilities.MEGA_LAUNCHER, 630, 79, 103, 120, 135, 115, 78, 45, 50, 265),
      new PokemonForm("G-Max", SpeciesFormKey.GIGANTAMAX, Type.WATER, Type.STEEL, 25, 85.5, Abilities.SHELL_ARMOR, Abilities.SHELL_ARMOR, Abilities.SHELL_ARMOR, 630, 119, 83, 130, 115, 115, 68, 45, 50, 265),
    ),
    new PokemonSpecies(Species.CATERPIE, 1, false, false, false, "Worm Pokémon", Type.BUG, null, 0.3, 2.9, Abilities.SHIELD_DUST, Abilities.NONE, Abilities.RUN_AWAY, 195, 45, 30, 35, 20, 20, 45, 255, 50, 39, GrowthRate.MEDIUM_FAST, 50, false),
    new PokemonSpecies(Species.METAPOD, 1, false, false, false, "Cocoon Pokémon", Type.BUG, null, 0.7, 9.9, Abilities.SHED_SKIN, Abilities.NONE, Abilities.SHED_SKIN, 205, 50, 20, 55, 25, 25, 30, 120, 50, 72, GrowthRate.MEDIUM_FAST, 50, false),
    new PokemonSpecies(Species.BUTTERFREE, 1, false, false, false, "Butterfly Pokémon", Type.BUG, Type.FLYING, 1.1, 32, Abilities.COMPOUND_EYES, Abilities.NONE, Abilities.TINTED_LENS, 395, 60, 45, 50, 90, 80, 70, 45, 50, 198, GrowthRate.MEDIUM_FAST, 50, true, true,
      new PokemonForm("Normal", "", Type.BUG, Type.FLYING, 1.1, 32, Abilities.COMPOUND_EYES, Abilities.NONE, Abilities.TINTED_LENS, 395, 60, 45, 50, 90, 80, 70, 45, 50, 198, true, null, true),
      new PokemonForm("G-Max", SpeciesFormKey.GIGANTAMAX, Type.BUG, Type.FLYING, 17, 32, Abilities.COMPOUND_EYES, Abilities.COMPOUND_EYES, Abilities.COMPOUND_EYES, 495, 85, 35, 80, 120, 90, 85, 45, 50, 198, true),
    ),
    new PokemonSpecies(Species.WEEDLE, 1, false, false, false, "Hairy Bug Pokémon", Type.BUG, Type.POISON, 0.3, 3.2, Abilities.SHIELD_DUST, Abilities.NONE, Abilities.RUN_AWAY, 195, 40, 35, 30, 20, 20, 50, 255, 70, 39, GrowthRate.MEDIUM_FAST, 50, false),
    new PokemonSpecies(Species.KAKUNA, 1, false, false, false, "Cocoon Pokémon", Type.BUG, Type.POISON, 0.6, 10, Abilities.SHED_SKIN, Abilities.NONE, Abilities.SHED_SKIN, 205, 45, 25, 50, 25, 25, 35, 120, 70, 72, GrowthRate.MEDIUM_FAST, 50, false),
    new PokemonSpecies(Species.BEEDRILL, 1, false, false, false, "Poison Bee Pokémon", Type.BUG, Type.POISON, 1, 29.5, Abilities.SWARM, Abilities.NONE, Abilities.SNIPER, 395, 65, 90, 40, 45, 80, 75, 45, 70, 178, GrowthRate.MEDIUM_FAST, 50, false, true,
      new PokemonForm("Normal", "", Type.BUG, Type.POISON, 1, 29.5, Abilities.SWARM, Abilities.NONE, Abilities.SNIPER, 395, 65, 90, 40, 45, 80, 75, 45, 70, 178, false, null, true),
      new PokemonForm("Mega", SpeciesFormKey.MEGA, Type.BUG, Type.POISON, 1.4, 40.5, Abilities.ADAPTABILITY, Abilities.NONE, Abilities.ADAPTABILITY, 495, 65, 150, 40, 15, 80, 145, 45, 70, 178),
    ),
    new PokemonSpecies(Species.PIDGEY, 1, false, false, false, "Tiny Bird Pokémon", Type.NORMAL, Type.FLYING, 0.3, 1.8, Abilities.KEEN_EYE, Abilities.TANGLED_FEET, Abilities.BIG_PECKS, 251, 40, 45, 40, 35, 35, 56, 255, 70, 50, GrowthRate.MEDIUM_SLOW, 50, false),
    new PokemonSpecies(Species.PIDGEOTTO, 1, false, false, false, "Bird Pokémon", Type.NORMAL, Type.FLYING, 1.1, 30, Abilities.KEEN_EYE, Abilities.TANGLED_FEET, Abilities.BIG_PECKS, 349, 63, 60, 55, 50, 50, 71, 120, 70, 122, GrowthRate.MEDIUM_SLOW, 50, false),
    new PokemonSpecies(Species.PIDGEOT, 1, false, false, false, "Bird Pokémon", Type.NORMAL, Type.FLYING, 1.5, 39.5, Abilities.KEEN_EYE, Abilities.TANGLED_FEET, Abilities.BIG_PECKS, 479, 83, 80, 75, 70, 70, 101, 45, 70, 216, GrowthRate.MEDIUM_SLOW, 50, false, true,
      new PokemonForm("Normal", "", Type.NORMAL, Type.FLYING, 1.5, 39.5, Abilities.KEEN_EYE, Abilities.TANGLED_FEET, Abilities.BIG_PECKS, 479, 83, 80, 75, 70, 70, 101, 45, 70, 216, false, null, true),
      new PokemonForm("Mega", SpeciesFormKey.MEGA, Type.NORMAL, Type.FLYING, 2.2, 50.5, Abilities.NO_GUARD, Abilities.NO_GUARD, Abilities.NO_GUARD, 579, 83, 80, 80, 135, 80, 121, 45, 70, 216),
    ),
    new PokemonSpecies(Species.RATTATA, 1, false, false, false, "Mouse Pokémon", Type.NORMAL, null, 0.3, 3.5, Abilities.RUN_AWAY, Abilities.GUTS, Abilities.HUSTLE, 253, 30, 56, 35, 25, 35, 72, 255, 70, 51, GrowthRate.MEDIUM_FAST, 50, true),
    new PokemonSpecies(Species.RATICATE, 1, false, false, false, "Mouse Pokémon", Type.NORMAL, null, 0.7, 18.5, Abilities.RUN_AWAY, Abilities.GUTS, Abilities.HUSTLE, 413, 55, 81, 60, 50, 70, 97, 127, 70, 145, GrowthRate.MEDIUM_FAST, 50, true),
    new PokemonSpecies(Species.SPEAROW, 1, false, false, false, "Tiny Bird Pokémon", Type.NORMAL, Type.FLYING, 0.3, 2, Abilities.KEEN_EYE, Abilities.NONE, Abilities.SNIPER, 262, 40, 60, 30, 31, 31, 70, 255, 70, 52, GrowthRate.MEDIUM_FAST, 50, false),
    new PokemonSpecies(Species.FEAROW, 1, false, false, false, "Beak Pokémon", Type.NORMAL, Type.FLYING, 1.2, 38, Abilities.KEEN_EYE, Abilities.NONE, Abilities.SNIPER, 442, 65, 90, 65, 61, 61, 100, 90, 70, 155, GrowthRate.MEDIUM_FAST, 50, false),
    new PokemonSpecies(Species.EKANS, 1, false, false, false, "Snake Pokémon", Type.POISON, null, 2, 6.9, Abilities.INTIMIDATE, Abilities.SHED_SKIN, Abilities.UNNERVE, 288, 35, 60, 44, 40, 54, 55, 255, 70, 58, GrowthRate.MEDIUM_FAST, 50, false),
    new PokemonSpecies(Species.ARBOK, 1, false, false, false, "Cobra Pokémon", Type.POISON, null, 3.5, 65, Abilities.INTIMIDATE, Abilities.SHED_SKIN, Abilities.UNNERVE, 448, 60, 95, 69, 65, 79, 80, 90, 70, 157, GrowthRate.MEDIUM_FAST, 50, false),
    new PokemonSpecies(Species.PIKACHU, 1, false, false, false, "Mouse Pokémon", Type.ELECTRIC, null, 0.4, 6, Abilities.STATIC, Abilities.NONE, Abilities.LIGHTNING_ROD, 320, 35, 55, 40, 50, 50, 90, 190, 50, 112, GrowthRate.MEDIUM_FAST, 50, true, true,
      new PokemonForm("Normal", "", Type.ELECTRIC, null, 0.4, 6, Abilities.STATIC, Abilities.NONE, Abilities.LIGHTNING_ROD, 320, 35, 55, 40, 50, 50, 90, 190, 50, 112, true, null, true),
      new PokemonForm("Partner", "partner", Type.ELECTRIC, null, 0.4, 6, Abilities.STATIC, Abilities.NONE, Abilities.LIGHTNING_ROD, 430, 45, 80, 50, 75, 60, 120, 190, 50, 112, true, null, true),
      new PokemonForm("Cosplay", "cosplay", Type.ELECTRIC, null, 0.4, 6, Abilities.STATIC, Abilities.NONE, Abilities.LIGHTNING_ROD, 430, 45, 80, 50, 75, 60, 120, 190, 50, 112, true, null, true), //Custom
      new PokemonForm("Cool Cosplay", "cool-cosplay", Type.ELECTRIC, null, 0.4, 6, Abilities.STATIC, Abilities.NONE, Abilities.LIGHTNING_ROD, 430, 45, 80, 50, 75, 60, 120, 190, 50, 112, true, null, true), //Custom
      new PokemonForm("Beauty Cosplay", "beauty-cosplay", Type.ELECTRIC, null, 0.4, 6, Abilities.STATIC, Abilities.NONE, Abilities.LIGHTNING_ROD, 430, 45, 80, 50, 75, 60, 120, 190, 50, 112, true, null, true), //Custom
      new PokemonForm("Cute Cosplay", "cute-cosplay", Type.ELECTRIC, null, 0.4, 6, Abilities.STATIC, Abilities.NONE, Abilities.LIGHTNING_ROD, 430, 45, 80, 50, 75, 60, 120, 190, 50, 112, true, null, true), //Custom
      new PokemonForm("Smart Cosplay", "smart-cosplay", Type.ELECTRIC, null, 0.4, 6, Abilities.STATIC, Abilities.NONE, Abilities.LIGHTNING_ROD, 430, 45, 80, 50, 75, 60, 120, 190, 50, 112, true, null, true), //Custom
      new PokemonForm("Tough Cosplay", "tough-cosplay", Type.ELECTRIC, null, 0.4, 6, Abilities.STATIC, Abilities.NONE, Abilities.LIGHTNING_ROD, 430, 45, 80, 50, 75, 60, 120, 190, 50, 112, true, null, true), //Custom
      new PokemonForm("G-Max", SpeciesFormKey.GIGANTAMAX, Type.ELECTRIC, null, 21, 6, Abilities.LIGHTNING_ROD, Abilities.LIGHTNING_ROD, Abilities.LIGHTNING_ROD, 530, 125, 95, 60, 90, 70, 90, 190, 50, 112), //+100 BST from Partner Form
    ),
    new PokemonSpecies(Species.RAICHU, 1, false, false, false, "Mouse Pokémon", Type.ELECTRIC, null, 0.8, 30, Abilities.STATIC, Abilities.NONE, Abilities.LIGHTNING_ROD, 485, 60, 90, 55, 90, 80, 110, 75, 50, 243, GrowthRate.MEDIUM_FAST, 50, true),
    new PokemonSpecies(Species.SANDSHREW, 1, false, false, false, "Mouse Pokémon", Type.GROUND, null, 0.6, 12, Abilities.SAND_VEIL, Abilities.NONE, Abilities.SAND_RUSH, 300, 50, 75, 85, 20, 30, 40, 255, 50, 60, GrowthRate.MEDIUM_FAST, 50, false),
    new PokemonSpecies(Species.SANDSLASH, 1, false, false, false, "Mouse Pokémon", Type.GROUND, null, 1, 29.5, Abilities.SAND_VEIL, Abilities.NONE, Abilities.SAND_RUSH, 450, 75, 100, 110, 45, 55, 65, 90, 50, 158, GrowthRate.MEDIUM_FAST, 50, false),
    new PokemonSpecies(Species.NIDORAN_F, 1, false, false, false, "Poison Pin Pokémon", Type.POISON, null, 0.4, 7, Abilities.POISON_POINT, Abilities.RIVALRY, Abilities.HUSTLE, 275, 55, 47, 52, 40, 40, 41, 235, 50, 55, GrowthRate.MEDIUM_SLOW, 0, false),
    new PokemonSpecies(Species.NIDORINA, 1, false, false, false, "Poison Pin Pokémon", Type.POISON, null, 0.8, 20, Abilities.POISON_POINT, Abilities.RIVALRY, Abilities.HUSTLE, 365, 70, 62, 67, 55, 55, 56, 120, 50, 128, GrowthRate.MEDIUM_SLOW, 0, false),
    new PokemonSpecies(Species.NIDOQUEEN, 1, false, false, false, "Drill Pokémon", Type.POISON, Type.GROUND, 1.3, 60, Abilities.POISON_POINT, Abilities.RIVALRY, Abilities.SHEER_FORCE, 505, 90, 92, 87, 75, 85, 76, 45, 50, 253, GrowthRate.MEDIUM_SLOW, 0, false),
    new PokemonSpecies(Species.NIDORAN_M, 1, false, false, false, "Poison Pin Pokémon", Type.POISON, null, 0.5, 9, Abilities.POISON_POINT, Abilities.RIVALRY, Abilities.HUSTLE, 273, 46, 57, 40, 40, 40, 50, 235, 50, 55, GrowthRate.MEDIUM_SLOW, 100, false),
    new PokemonSpecies(Species.NIDORINO, 1, false, false, false, "Poison Pin Pokémon", Type.POISON, null, 0.9, 19.5, Abilities.POISON_POINT, Abilities.RIVALRY, Abilities.HUSTLE, 365, 61, 72, 57, 55, 55, 65, 120, 50, 128, GrowthRate.MEDIUM_SLOW, 100, false),
    new PokemonSpecies(Species.NIDOKING, 1, false, false, false, "Drill Pokémon", Type.POISON, Type.GROUND, 1.4, 62, Abilities.POISON_POINT, Abilities.RIVALRY, Abilities.SHEER_FORCE, 505, 81, 102, 77, 85, 75, 85, 45, 50, 253, GrowthRate.MEDIUM_SLOW, 100, false),
    new PokemonSpecies(Species.CLEFAIRY, 1, false, false, false, "Fairy Pokémon", Type.FAIRY, null, 0.6, 7.5, Abilities.CUTE_CHARM, Abilities.MAGIC_GUARD, Abilities.FRIEND_GUARD, 323, 70, 45, 48, 60, 65, 35, 150, 140, 113, GrowthRate.FAST, 25, false),
    new PokemonSpecies(Species.CLEFABLE, 1, false, false, false, "Fairy Pokémon", Type.FAIRY, null, 1.3, 40, Abilities.CUTE_CHARM, Abilities.MAGIC_GUARD, Abilities.UNAWARE, 483, 95, 70, 73, 95, 90, 60, 25, 140, 242, GrowthRate.FAST, 25, false),
    new PokemonSpecies(Species.VULPIX, 1, false, false, false, "Fox Pokémon", Type.FIRE, null, 0.6, 9.9, Abilities.FLASH_FIRE, Abilities.NONE, Abilities.DROUGHT, 299, 38, 41, 40, 50, 65, 65, 190, 50, 60, GrowthRate.MEDIUM_FAST, 25, false),
    new PokemonSpecies(Species.NINETALES, 1, false, false, false, "Fox Pokémon", Type.FIRE, null, 1.1, 19.9, Abilities.FLASH_FIRE, Abilities.NONE, Abilities.DROUGHT, 505, 73, 76, 75, 81, 100, 100, 75, 50, 177, GrowthRate.MEDIUM_FAST, 25, false),
    new PokemonSpecies(Species.JIGGLYPUFF, 1, false, false, false, "Balloon Pokémon", Type.NORMAL, Type.FAIRY, 0.5, 5.5, Abilities.CUTE_CHARM, Abilities.COMPETITIVE, Abilities.FRIEND_GUARD, 270, 115, 45, 20, 45, 25, 20, 170, 50, 95, GrowthRate.FAST, 25, false),
    new PokemonSpecies(Species.WIGGLYTUFF, 1, false, false, false, "Balloon Pokémon", Type.NORMAL, Type.FAIRY, 1, 12, Abilities.CUTE_CHARM, Abilities.COMPETITIVE, Abilities.FRISK, 435, 140, 70, 45, 85, 50, 45, 50, 50, 218, GrowthRate.FAST, 25, false),
    new PokemonSpecies(Species.ZUBAT, 1, false, false, false, "Bat Pokémon", Type.POISON, Type.FLYING, 0.8, 7.5, Abilities.INNER_FOCUS, Abilities.NONE, Abilities.INFILTRATOR, 245, 40, 45, 35, 30, 40, 55, 255, 50, 49, GrowthRate.MEDIUM_FAST, 50, true),
    new PokemonSpecies(Species.GOLBAT, 1, false, false, false, "Bat Pokémon", Type.POISON, Type.FLYING, 1.6, 55, Abilities.INNER_FOCUS, Abilities.NONE, Abilities.INFILTRATOR, 455, 75, 80, 70, 65, 75, 90, 90, 50, 159, GrowthRate.MEDIUM_FAST, 50, true),
    new PokemonSpecies(Species.ODDISH, 1, false, false, false, "Weed Pokémon", Type.GRASS, Type.POISON, 0.5, 5.4, Abilities.CHLOROPHYLL, Abilities.NONE, Abilities.RUN_AWAY, 320, 45, 50, 55, 75, 65, 30, 255, 50, 64, GrowthRate.MEDIUM_SLOW, 50, false),
    new PokemonSpecies(Species.GLOOM, 1, false, false, false, "Weed Pokémon", Type.GRASS, Type.POISON, 0.8, 8.6, Abilities.CHLOROPHYLL, Abilities.NONE, Abilities.STENCH, 395, 60, 65, 70, 85, 75, 40, 120, 50, 138, GrowthRate.MEDIUM_SLOW, 50, true),
    new PokemonSpecies(Species.VILEPLUME, 1, false, false, false, "Flower Pokémon", Type.GRASS, Type.POISON, 1.2, 18.6, Abilities.CHLOROPHYLL, Abilities.NONE, Abilities.EFFECT_SPORE, 490, 75, 80, 85, 110, 90, 50, 45, 50, 245, GrowthRate.MEDIUM_SLOW, 50, true),
    new PokemonSpecies(Species.PARAS, 1, false, false, false, "Mushroom Pokémon", Type.BUG, Type.GRASS, 0.3, 5.4, Abilities.EFFECT_SPORE, Abilities.DRY_SKIN, Abilities.DAMP, 285, 35, 70, 55, 45, 55, 25, 190, 70, 57, GrowthRate.MEDIUM_FAST, 50, false),
    new PokemonSpecies(Species.PARASECT, 1, false, false, false, "Mushroom Pokémon", Type.BUG, Type.GRASS, 1, 29.5, Abilities.EFFECT_SPORE, Abilities.DRY_SKIN, Abilities.DAMP, 405, 60, 95, 80, 60, 80, 30, 75, 70, 142, GrowthRate.MEDIUM_FAST, 50, false),
    new PokemonSpecies(Species.VENONAT, 1, false, false, false, "Insect Pokémon", Type.BUG, Type.POISON, 1, 30, Abilities.COMPOUND_EYES, Abilities.TINTED_LENS, Abilities.RUN_AWAY, 305, 60, 55, 50, 40, 55, 45, 190, 70, 61, GrowthRate.MEDIUM_FAST, 50, false),
    new PokemonSpecies(Species.VENOMOTH, 1, false, false, false, "Poison Moth Pokémon", Type.BUG, Type.POISON, 1.5, 12.5, Abilities.SHIELD_DUST, Abilities.TINTED_LENS, Abilities.WONDER_SKIN, 450, 70, 65, 60, 90, 75, 90, 75, 70, 158, GrowthRate.MEDIUM_FAST, 50, false),
    new PokemonSpecies(Species.DIGLETT, 1, false, false, false, "Mole Pokémon", Type.GROUND, null, 0.2, 0.8, Abilities.SAND_VEIL, Abilities.ARENA_TRAP, Abilities.SAND_FORCE, 265, 10, 55, 25, 35, 45, 95, 255, 50, 53, GrowthRate.MEDIUM_FAST, 50, false),
    new PokemonSpecies(Species.DUGTRIO, 1, false, false, false, "Mole Pokémon", Type.GROUND, null, 0.7, 33.3, Abilities.SAND_VEIL, Abilities.ARENA_TRAP, Abilities.SAND_FORCE, 425, 35, 100, 50, 50, 70, 120, 50, 50, 149, GrowthRate.MEDIUM_FAST, 50, false),
    new PokemonSpecies(Species.MEOWTH, 1, false, false, false, "Scratch Cat Pokémon", Type.NORMAL, null, 0.4, 4.2, Abilities.PICKUP, Abilities.TECHNICIAN, Abilities.UNNERVE, 290, 40, 45, 35, 40, 40, 90, 255, 50, 58, GrowthRate.MEDIUM_FAST, 50, false, true,
      new PokemonForm("Normal", "", Type.NORMAL, null, 0.4, 4.2, Abilities.PICKUP, Abilities.TECHNICIAN, Abilities.UNNERVE, 290, 40, 45, 35, 40, 40, 90, 255, 50, 58, false, null, true),
      new PokemonForm("G-Max", SpeciesFormKey.GIGANTAMAX, Type.NORMAL, null, 33, 4.2, Abilities.TECHNICIAN, Abilities.TECHNICIAN, Abilities.TECHNICIAN, 540, 115, 110, 65, 65, 70, 115, 255, 50, 58), //+100 BST from Persian
    ),
    new PokemonSpecies(Species.PERSIAN, 1, false, false, false, "Classy Cat Pokémon", Type.NORMAL, null, 1, 32, Abilities.LIMBER, Abilities.TECHNICIAN, Abilities.UNNERVE, 440, 65, 70, 60, 65, 65, 115, 90, 50, 154, GrowthRate.MEDIUM_FAST, 50, false),
    new PokemonSpecies(Species.PSYDUCK, 1, false, false, false, "Duck Pokémon", Type.WATER, null, 0.8, 19.6, Abilities.DAMP, Abilities.CLOUD_NINE, Abilities.SWIFT_SWIM, 320, 50, 52, 48, 65, 50, 55, 190, 50, 64, GrowthRate.MEDIUM_FAST, 50, false),
    new PokemonSpecies(Species.GOLDUCK, 1, false, false, false, "Duck Pokémon", Type.WATER, null, 1.7, 76.6, Abilities.DAMP, Abilities.CLOUD_NINE, Abilities.SWIFT_SWIM, 500, 80, 82, 78, 95, 80, 85, 75, 50, 175, GrowthRate.MEDIUM_FAST, 50, false),
    new PokemonSpecies(Species.MANKEY, 1, false, false, false, "Pig Monkey Pokémon", Type.FIGHTING, null, 0.5, 28, Abilities.VITAL_SPIRIT, Abilities.ANGER_POINT, Abilities.DEFIANT, 305, 40, 80, 35, 35, 45, 70, 190, 70, 61, GrowthRate.MEDIUM_FAST, 50, false),
    new PokemonSpecies(Species.PRIMEAPE, 1, false, false, false, "Pig Monkey Pokémon", Type.FIGHTING, null, 1, 32, Abilities.VITAL_SPIRIT, Abilities.ANGER_POINT, Abilities.DEFIANT, 455, 65, 105, 60, 60, 70, 95, 75, 70, 159, GrowthRate.MEDIUM_FAST, 50, false),
    new PokemonSpecies(Species.GROWLITHE, 1, false, false, false, "Puppy Pokémon", Type.FIRE, null, 0.7, 19, Abilities.INTIMIDATE, Abilities.FLASH_FIRE, Abilities.JUSTIFIED, 350, 55, 70, 45, 70, 50, 60, 190, 50, 70, GrowthRate.SLOW, 75, false),
    new PokemonSpecies(Species.ARCANINE, 1, false, false, false, "Legendary Pokémon", Type.FIRE, null, 1.9, 155, Abilities.INTIMIDATE, Abilities.FLASH_FIRE, Abilities.JUSTIFIED, 555, 90, 110, 80, 100, 80, 95, 75, 50, 194, GrowthRate.SLOW, 75, false),
    new PokemonSpecies(Species.POLIWAG, 1, false, false, false, "Tadpole Pokémon", Type.WATER, null, 0.6, 12.4, Abilities.WATER_ABSORB, Abilities.DAMP, Abilities.SWIFT_SWIM, 300, 40, 50, 40, 40, 40, 90, 255, 50, 60, GrowthRate.MEDIUM_SLOW, 50, false),
    new PokemonSpecies(Species.POLIWHIRL, 1, false, false, false, "Tadpole Pokémon", Type.WATER, null, 1, 20, Abilities.WATER_ABSORB, Abilities.DAMP, Abilities.SWIFT_SWIM, 385, 65, 65, 65, 50, 50, 90, 120, 50, 135, GrowthRate.MEDIUM_SLOW, 50, false),
    new PokemonSpecies(Species.POLIWRATH, 1, false, false, false, "Tadpole Pokémon", Type.WATER, Type.FIGHTING, 1.3, 54, Abilities.WATER_ABSORB, Abilities.DAMP, Abilities.SWIFT_SWIM, 510, 90, 95, 95, 70, 90, 70, 45, 50, 255, GrowthRate.MEDIUM_SLOW, 50, false),
    new PokemonSpecies(Species.ABRA, 1, false, false, false, "Psi Pokémon", Type.PSYCHIC, null, 0.9, 19.5, Abilities.SYNCHRONIZE, Abilities.INNER_FOCUS, Abilities.MAGIC_GUARD, 310, 25, 20, 15, 105, 55, 90, 200, 50, 62, GrowthRate.MEDIUM_SLOW, 75, false),
    new PokemonSpecies(Species.KADABRA, 1, false, false, false, "Psi Pokémon", Type.PSYCHIC, null, 1.3, 56.5, Abilities.SYNCHRONIZE, Abilities.INNER_FOCUS, Abilities.MAGIC_GUARD, 400, 40, 35, 30, 120, 70, 105, 100, 50, 140, GrowthRate.MEDIUM_SLOW, 75, true),
    new PokemonSpecies(Species.ALAKAZAM, 1, false, false, false, "Psi Pokémon", Type.PSYCHIC, null, 1.5, 48, Abilities.SYNCHRONIZE, Abilities.INNER_FOCUS, Abilities.MAGIC_GUARD, 500, 55, 50, 45, 135, 95, 120, 50, 50, 250, GrowthRate.MEDIUM_SLOW, 75, true, true,
      new PokemonForm("Normal", "", Type.PSYCHIC, null, 1.5, 48, Abilities.SYNCHRONIZE, Abilities.INNER_FOCUS, Abilities.MAGIC_GUARD, 500, 55, 50, 45, 135, 95, 120, 50, 50, 250, true, null, true),
      new PokemonForm("Mega", SpeciesFormKey.MEGA, Type.PSYCHIC, null, 1.2, 48, Abilities.TRACE, Abilities.TRACE, Abilities.TRACE, 600, 55, 50, 65, 175, 105, 150, 50, 50, 250, true),
    ),
    new PokemonSpecies(Species.MACHOP, 1, false, false, false, "Superpower Pokémon", Type.FIGHTING, null, 0.8, 19.5, Abilities.GUTS, Abilities.NO_GUARD, Abilities.STEADFAST, 305, 70, 80, 50, 35, 35, 35, 180, 50, 61, GrowthRate.MEDIUM_SLOW, 75, false),
    new PokemonSpecies(Species.MACHOKE, 1, false, false, false, "Superpower Pokémon", Type.FIGHTING, null, 1.5, 70.5, Abilities.GUTS, Abilities.NO_GUARD, Abilities.STEADFAST, 405, 80, 100, 70, 50, 60, 45, 90, 50, 142, GrowthRate.MEDIUM_SLOW, 75, false),
    new PokemonSpecies(Species.MACHAMP, 1, false, false, false, "Superpower Pokémon", Type.FIGHTING, null, 1.6, 130, Abilities.GUTS, Abilities.NO_GUARD, Abilities.STEADFAST, 505, 90, 130, 80, 65, 85, 55, 45, 50, 253, GrowthRate.MEDIUM_SLOW, 75, false, true,
      new PokemonForm("Normal", "", Type.FIGHTING, null, 1.6, 130, Abilities.GUTS, Abilities.NO_GUARD, Abilities.STEADFAST, 505, 90, 130, 80, 65, 85, 55, 45, 50, 253, false, null, true),
      new PokemonForm("G-Max", SpeciesFormKey.GIGANTAMAX, Type.FIGHTING, null, 25, 130, Abilities.GUTS, Abilities.GUTS, Abilities.GUTS, 605, 115, 170, 95, 65, 95, 65, 45, 50, 253),
    ),
    new PokemonSpecies(Species.BELLSPROUT, 1, false, false, false, "Flower Pokémon", Type.GRASS, Type.POISON, 0.7, 4, Abilities.CHLOROPHYLL, Abilities.NONE, Abilities.GLUTTONY, 300, 50, 75, 35, 70, 30, 40, 255, 70, 60, GrowthRate.MEDIUM_SLOW, 50, false),
    new PokemonSpecies(Species.WEEPINBELL, 1, false, false, false, "Flycatcher Pokémon", Type.GRASS, Type.POISON, 1, 6.4, Abilities.CHLOROPHYLL, Abilities.NONE, Abilities.GLUTTONY, 390, 65, 90, 50, 85, 45, 55, 120, 70, 137, GrowthRate.MEDIUM_SLOW, 50, false),
    new PokemonSpecies(Species.VICTREEBEL, 1, false, false, false, "Flycatcher Pokémon", Type.GRASS, Type.POISON, 1.7, 15.5, Abilities.CHLOROPHYLL, Abilities.NONE, Abilities.GLUTTONY, 490, 80, 105, 65, 100, 70, 70, 45, 70, 221, GrowthRate.MEDIUM_SLOW, 50, false),
    new PokemonSpecies(Species.TENTACOOL, 1, false, false, false, "Jellyfish Pokémon", Type.WATER, Type.POISON, 0.9, 45.5, Abilities.CLEAR_BODY, Abilities.LIQUID_OOZE, Abilities.RAIN_DISH, 335, 40, 40, 35, 50, 100, 70, 190, 50, 67, GrowthRate.SLOW, 50, false),
    new PokemonSpecies(Species.TENTACRUEL, 1, false, false, false, "Jellyfish Pokémon", Type.WATER, Type.POISON, 1.6, 55, Abilities.CLEAR_BODY, Abilities.LIQUID_OOZE, Abilities.RAIN_DISH, 515, 80, 70, 65, 80, 120, 100, 60, 50, 180, GrowthRate.SLOW, 50, false),
    new PokemonSpecies(Species.GEODUDE, 1, false, false, false, "Rock Pokémon", Type.ROCK, Type.GROUND, 0.4, 20, Abilities.ROCK_HEAD, Abilities.STURDY, Abilities.SAND_VEIL, 300, 40, 80, 100, 30, 30, 20, 255, 70, 60, GrowthRate.MEDIUM_SLOW, 50, false),
    new PokemonSpecies(Species.GRAVELER, 1, false, false, false, "Rock Pokémon", Type.ROCK, Type.GROUND, 1, 105, Abilities.ROCK_HEAD, Abilities.STURDY, Abilities.SAND_VEIL, 390, 55, 95, 115, 45, 45, 35, 120, 70, 137, GrowthRate.MEDIUM_SLOW, 50, false),
    new PokemonSpecies(Species.GOLEM, 1, false, false, false, "Megaton Pokémon", Type.ROCK, Type.GROUND, 1.4, 300, Abilities.ROCK_HEAD, Abilities.STURDY, Abilities.SAND_VEIL, 495, 80, 120, 130, 55, 65, 45, 45, 70, 223, GrowthRate.MEDIUM_SLOW, 50, false),
    new PokemonSpecies(Species.PONYTA, 1, false, false, false, "Fire Horse Pokémon", Type.FIRE, null, 1, 30, Abilities.RUN_AWAY, Abilities.FLASH_FIRE, Abilities.FLAME_BODY, 410, 50, 85, 55, 65, 65, 90, 190, 50, 82, GrowthRate.MEDIUM_FAST, 50, false),
    new PokemonSpecies(Species.RAPIDASH, 1, false, false, false, "Fire Horse Pokémon", Type.FIRE, null, 1.7, 95, Abilities.RUN_AWAY, Abilities.FLASH_FIRE, Abilities.FLAME_BODY, 500, 65, 100, 70, 80, 80, 105, 60, 50, 175, GrowthRate.MEDIUM_FAST, 50, false),
    new PokemonSpecies(Species.SLOWPOKE, 1, false, false, false, "Dopey Pokémon", Type.WATER, Type.PSYCHIC, 1.2, 36, Abilities.OBLIVIOUS, Abilities.OWN_TEMPO, Abilities.REGENERATOR, 315, 90, 65, 65, 40, 40, 15, 190, 50, 63, GrowthRate.MEDIUM_FAST, 50, false),
    new PokemonSpecies(Species.SLOWBRO, 1, false, false, false, "Hermit Crab Pokémon", Type.WATER, Type.PSYCHIC, 1.6, 78.5, Abilities.OBLIVIOUS, Abilities.OWN_TEMPO, Abilities.REGENERATOR, 490, 95, 75, 110, 100, 80, 30, 75, 50, 172, GrowthRate.MEDIUM_FAST, 50, false, true,
      new PokemonForm("Normal", "", Type.WATER, Type.PSYCHIC, 1.6, 78.5, Abilities.OBLIVIOUS, Abilities.OWN_TEMPO, Abilities.REGENERATOR, 490, 95, 75, 110, 100, 80, 30, 75, 50, 172, false, null, true),
      new PokemonForm("Mega", SpeciesFormKey.MEGA, Type.WATER, Type.PSYCHIC, 2, 120, Abilities.SHELL_ARMOR, Abilities.SHELL_ARMOR, Abilities.SHELL_ARMOR, 590, 95, 75, 180, 130, 80, 30, 75, 50, 172),
    ),
    new PokemonSpecies(Species.MAGNEMITE, 1, false, false, false, "Magnet Pokémon", Type.ELECTRIC, Type.STEEL, 0.3, 6, Abilities.MAGNET_PULL, Abilities.STURDY, Abilities.ANALYTIC, 325, 25, 35, 70, 95, 55, 45, 190, 50, 65, GrowthRate.MEDIUM_FAST, null, false),
    new PokemonSpecies(Species.MAGNETON, 1, false, false, false, "Magnet Pokémon", Type.ELECTRIC, Type.STEEL, 1, 60, Abilities.MAGNET_PULL, Abilities.STURDY, Abilities.ANALYTIC, 465, 50, 60, 95, 120, 70, 70, 60, 50, 163, GrowthRate.MEDIUM_FAST, null, false),
    new PokemonSpecies(Species.FARFETCHD, 1, false, false, false, "Wild Duck Pokémon", Type.NORMAL, Type.FLYING, 0.8, 15, Abilities.KEEN_EYE, Abilities.INNER_FOCUS, Abilities.DEFIANT, 377, 52, 90, 55, 58, 62, 60, 45, 50, 132, GrowthRate.MEDIUM_FAST, 50, false),
    new PokemonSpecies(Species.DODUO, 1, false, false, false, "Twin Bird Pokémon", Type.NORMAL, Type.FLYING, 1.4, 39.2, Abilities.RUN_AWAY, Abilities.EARLY_BIRD, Abilities.TANGLED_FEET, 310, 35, 85, 45, 35, 35, 75, 190, 70, 62, GrowthRate.MEDIUM_FAST, 50, true),
    new PokemonSpecies(Species.DODRIO, 1, false, false, false, "Triple Bird Pokémon", Type.NORMAL, Type.FLYING, 1.8, 85.2, Abilities.RUN_AWAY, Abilities.EARLY_BIRD, Abilities.TANGLED_FEET, 470, 60, 110, 70, 60, 60, 110, 45, 70, 165, GrowthRate.MEDIUM_FAST, 50, true),
    new PokemonSpecies(Species.SEEL, 1, false, false, false, "Sea Lion Pokémon", Type.WATER, null, 1.1, 90, Abilities.THICK_FAT, Abilities.HYDRATION, Abilities.ICE_BODY, 325, 65, 45, 55, 45, 70, 45, 190, 70, 65, GrowthRate.MEDIUM_FAST, 50, false),
    new PokemonSpecies(Species.DEWGONG, 1, false, false, false, "Sea Lion Pokémon", Type.WATER, Type.ICE, 1.7, 120, Abilities.THICK_FAT, Abilities.HYDRATION, Abilities.ICE_BODY, 475, 90, 70, 80, 70, 95, 70, 75, 70, 166, GrowthRate.MEDIUM_FAST, 50, false),
    new PokemonSpecies(Species.GRIMER, 1, false, false, false, "Sludge Pokémon", Type.POISON, null, 0.9, 30, Abilities.STENCH, Abilities.STICKY_HOLD, Abilities.POISON_TOUCH, 325, 80, 80, 50, 40, 50, 25, 190, 70, 65, GrowthRate.MEDIUM_FAST, 50, false),
    new PokemonSpecies(Species.MUK, 1, false, false, false, "Sludge Pokémon", Type.POISON, null, 1.2, 30, Abilities.STENCH, Abilities.STICKY_HOLD, Abilities.POISON_TOUCH, 500, 105, 105, 75, 65, 100, 50, 75, 70, 175, GrowthRate.MEDIUM_FAST, 50, false),
    new PokemonSpecies(Species.SHELLDER, 1, false, false, false, "Bivalve Pokémon", Type.WATER, null, 0.3, 4, Abilities.SHELL_ARMOR, Abilities.SKILL_LINK, Abilities.OVERCOAT, 305, 30, 65, 100, 45, 25, 40, 190, 50, 61, GrowthRate.SLOW, 50, false),
    new PokemonSpecies(Species.CLOYSTER, 1, false, false, false, "Bivalve Pokémon", Type.WATER, Type.ICE, 1.5, 132.5, Abilities.SHELL_ARMOR, Abilities.SKILL_LINK, Abilities.OVERCOAT, 525, 50, 95, 180, 85, 45, 70, 60, 50, 184, GrowthRate.SLOW, 50, false),
    new PokemonSpecies(Species.GASTLY, 1, false, false, false, "Gas Pokémon", Type.GHOST, Type.POISON, 1.3, 0.1, Abilities.LEVITATE, Abilities.NONE, Abilities.NONE, 310, 30, 35, 30, 100, 35, 80, 190, 50, 62, GrowthRate.MEDIUM_SLOW, 50, false),
    new PokemonSpecies(Species.HAUNTER, 1, false, false, false, "Gas Pokémon", Type.GHOST, Type.POISON, 1.6, 0.1, Abilities.LEVITATE, Abilities.NONE, Abilities.NONE, 405, 45, 50, 45, 115, 55, 95, 90, 50, 142, GrowthRate.MEDIUM_SLOW, 50, false),
    new PokemonSpecies(Species.GENGAR, 1, false, false, false, "Shadow Pokémon", Type.GHOST, Type.POISON, 1.5, 40.5, Abilities.CURSED_BODY, Abilities.NONE, Abilities.NONE, 500, 60, 65, 60, 130, 75, 110, 45, 50, 250, GrowthRate.MEDIUM_SLOW, 50, false, true,
      new PokemonForm("Normal", "", Type.GHOST, Type.POISON, 1.5, 40.5, Abilities.CURSED_BODY, Abilities.NONE, Abilities.NONE, 500, 60, 65, 60, 130, 75, 110, 45, 50, 250, false, null, true),
      new PokemonForm("Mega", SpeciesFormKey.MEGA, Type.GHOST, Type.POISON, 1.4, 40.5, Abilities.SHADOW_TAG, Abilities.NONE, Abilities.NONE, 600, 60, 65, 80, 170, 95, 130, 45, 50, 250),
      new PokemonForm("G-Max", SpeciesFormKey.GIGANTAMAX, Type.GHOST, Type.POISON, 20, 40.5, Abilities.CURSED_BODY, Abilities.CURSED_BODY, Abilities.CURSED_BODY, 600, 140, 65, 70, 140, 85, 100, 45, 50, 250),
    ),
    new PokemonSpecies(Species.ONIX, 1, false, false, false, "Rock Snake Pokémon", Type.ROCK, Type.GROUND, 8.8, 210, Abilities.ROCK_HEAD, Abilities.STURDY, Abilities.WEAK_ARMOR, 385, 35, 45, 160, 30, 45, 70, 45, 50, 77, GrowthRate.MEDIUM_FAST, 50, false),
    new PokemonSpecies(Species.DROWZEE, 1, false, false, false, "Hypnosis Pokémon", Type.PSYCHIC, null, 1, 32.4, Abilities.INSOMNIA, Abilities.FOREWARN, Abilities.INNER_FOCUS, 328, 60, 48, 45, 43, 90, 42, 190, 70, 66, GrowthRate.MEDIUM_FAST, 50, false),
    new PokemonSpecies(Species.HYPNO, 1, false, false, false, "Hypnosis Pokémon", Type.PSYCHIC, null, 1.6, 75.6, Abilities.INSOMNIA, Abilities.FOREWARN, Abilities.INNER_FOCUS, 483, 85, 73, 70, 73, 115, 67, 75, 70, 169, GrowthRate.MEDIUM_FAST, 50, true),
    new PokemonSpecies(Species.KRABBY, 1, false, false, false, "River Crab Pokémon", Type.WATER, null, 0.4, 6.5, Abilities.HYPER_CUTTER, Abilities.SHELL_ARMOR, Abilities.SHEER_FORCE, 325, 30, 105, 90, 25, 25, 50, 225, 50, 65, GrowthRate.MEDIUM_FAST, 50, false),
    new PokemonSpecies(Species.KINGLER, 1, false, false, false, "Pincer Pokémon", Type.WATER, null, 1.3, 60, Abilities.HYPER_CUTTER, Abilities.SHELL_ARMOR, Abilities.SHEER_FORCE, 475, 55, 130, 115, 50, 50, 75, 60, 50, 166, GrowthRate.MEDIUM_FAST, 50, false, true,
      new PokemonForm("Normal", "", Type.WATER, null, 1.3, 60, Abilities.HYPER_CUTTER, Abilities.SHELL_ARMOR, Abilities.SHEER_FORCE, 475, 55, 130, 115, 50, 50, 75, 60, 50, 166, false, null, true),
      new PokemonForm("G-Max", SpeciesFormKey.GIGANTAMAX, Type.WATER, null, 19, 60, Abilities.TOUGH_CLAWS, Abilities.TOUGH_CLAWS, Abilities.TOUGH_CLAWS, 575, 90, 155, 140, 50, 80, 70, 60, 50, 166),
    ),
    new PokemonSpecies(Species.VOLTORB, 1, false, false, false, "Ball Pokémon", Type.ELECTRIC, null, 0.5, 10.4, Abilities.SOUNDPROOF, Abilities.STATIC, Abilities.AFTERMATH, 330, 40, 30, 50, 55, 55, 100, 190, 70, 66, GrowthRate.MEDIUM_FAST, null, false),
    new PokemonSpecies(Species.ELECTRODE, 1, false, false, false, "Ball Pokémon", Type.ELECTRIC, null, 1.2, 66.6, Abilities.SOUNDPROOF, Abilities.STATIC, Abilities.AFTERMATH, 490, 60, 50, 70, 80, 80, 150, 60, 70, 172, GrowthRate.MEDIUM_FAST, null, false),
    new PokemonSpecies(Species.EXEGGCUTE, 1, false, false, false, "Egg Pokémon", Type.GRASS, Type.PSYCHIC, 0.4, 2.5, Abilities.CHLOROPHYLL, Abilities.NONE, Abilities.HARVEST, 325, 60, 40, 80, 60, 45, 40, 90, 50, 65, GrowthRate.SLOW, 50, false),
    new PokemonSpecies(Species.EXEGGUTOR, 1, false, false, false, "Coconut Pokémon", Type.GRASS, Type.PSYCHIC, 2, 120, Abilities.CHLOROPHYLL, Abilities.NONE, Abilities.HARVEST, 530, 95, 95, 85, 125, 75, 55, 45, 50, 186, GrowthRate.SLOW, 50, false),
    new PokemonSpecies(Species.CUBONE, 1, false, false, false, "Lonely Pokémon", Type.GROUND, null, 0.4, 6.5, Abilities.ROCK_HEAD, Abilities.LIGHTNING_ROD, Abilities.BATTLE_ARMOR, 320, 50, 50, 95, 40, 50, 35, 190, 50, 64, GrowthRate.MEDIUM_FAST, 50, false),
    new PokemonSpecies(Species.MAROWAK, 1, false, false, false, "Bone Keeper Pokémon", Type.GROUND, null, 1, 45, Abilities.ROCK_HEAD, Abilities.LIGHTNING_ROD, Abilities.BATTLE_ARMOR, 425, 60, 80, 110, 50, 80, 45, 75, 50, 149, GrowthRate.MEDIUM_FAST, 50, false),
    new PokemonSpecies(Species.HITMONLEE, 1, false, false, false, "Kicking Pokémon", Type.FIGHTING, null, 1.5, 49.8, Abilities.LIMBER, Abilities.RECKLESS, Abilities.UNBURDEN, 455, 50, 120, 53, 35, 110, 87, 45, 50, 159, GrowthRate.MEDIUM_FAST, 100, false),
    new PokemonSpecies(Species.HITMONCHAN, 1, false, false, false, "Punching Pokémon", Type.FIGHTING, null, 1.4, 50.2, Abilities.KEEN_EYE, Abilities.IRON_FIST, Abilities.INNER_FOCUS, 455, 50, 105, 79, 35, 110, 76, 45, 50, 159, GrowthRate.MEDIUM_FAST, 100, false),
    new PokemonSpecies(Species.LICKITUNG, 1, false, false, false, "Licking Pokémon", Type.NORMAL, null, 1.2, 65.5, Abilities.OWN_TEMPO, Abilities.OBLIVIOUS, Abilities.CLOUD_NINE, 385, 90, 55, 75, 60, 75, 30, 45, 50, 77, GrowthRate.MEDIUM_FAST, 50, false),
    new PokemonSpecies(Species.KOFFING, 1, false, false, false, "Poison Gas Pokémon", Type.POISON, null, 0.6, 1, Abilities.LEVITATE, Abilities.NEUTRALIZING_GAS, Abilities.STENCH, 340, 40, 65, 95, 60, 45, 35, 190, 50, 68, GrowthRate.MEDIUM_FAST, 50, false),
    new PokemonSpecies(Species.WEEZING, 1, false, false, false, "Poison Gas Pokémon", Type.POISON, null, 1.2, 9.5, Abilities.LEVITATE, Abilities.NEUTRALIZING_GAS, Abilities.STENCH, 490, 65, 90, 120, 85, 70, 60, 60, 50, 172, GrowthRate.MEDIUM_FAST, 50, false),
    new PokemonSpecies(Species.RHYHORN, 1, false, false, false, "Spikes Pokémon", Type.GROUND, Type.ROCK, 1, 115, Abilities.LIGHTNING_ROD, Abilities.ROCK_HEAD, Abilities.RECKLESS, 345, 80, 85, 95, 30, 30, 25, 120, 50, 69, GrowthRate.SLOW, 50, true),
    new PokemonSpecies(Species.RHYDON, 1, false, false, false, "Drill Pokémon", Type.GROUND, Type.ROCK, 1.9, 120, Abilities.LIGHTNING_ROD, Abilities.ROCK_HEAD, Abilities.RECKLESS, 485, 105, 130, 120, 45, 45, 40, 60, 50, 170, GrowthRate.SLOW, 50, true),
    new PokemonSpecies(Species.CHANSEY, 1, false, false, false, "Egg Pokémon", Type.NORMAL, null, 1.1, 34.6, Abilities.NATURAL_CURE, Abilities.SERENE_GRACE, Abilities.HEALER, 450, 250, 5, 5, 35, 105, 50, 30, 140, 395, GrowthRate.FAST, 0, false),
    new PokemonSpecies(Species.TANGELA, 1, false, false, false, "Vine Pokémon", Type.GRASS, null, 1, 35, Abilities.CHLOROPHYLL, Abilities.LEAF_GUARD, Abilities.REGENERATOR, 435, 65, 55, 115, 100, 40, 60, 45, 50, 87, GrowthRate.MEDIUM_FAST, 50, false),
    new PokemonSpecies(Species.KANGASKHAN, 1, false, false, false, "Parent Pokémon", Type.NORMAL, null, 2.2, 80, Abilities.EARLY_BIRD, Abilities.SCRAPPY, Abilities.INNER_FOCUS, 490, 105, 95, 80, 40, 80, 90, 45, 50, 172, GrowthRate.MEDIUM_FAST, 0, false, true,
      new PokemonForm("Normal", "", Type.NORMAL, null, 2.2, 80, Abilities.EARLY_BIRD, Abilities.SCRAPPY, Abilities.INNER_FOCUS, 490, 105, 95, 80, 40, 80, 90, 45, 50, 172, false, null, true),
      new PokemonForm("Mega", SpeciesFormKey.MEGA, Type.NORMAL, null, 2.2, 100, Abilities.PARENTAL_BOND, Abilities.PARENTAL_BOND, Abilities.PARENTAL_BOND, 590, 105, 125, 100, 60, 100, 100, 45, 50, 172),
    ),
    new PokemonSpecies(Species.HORSEA, 1, false, false, false, "Dragon Pokémon", Type.WATER, null, 0.4, 8, Abilities.SWIFT_SWIM, Abilities.SNIPER, Abilities.DAMP, 295, 30, 40, 70, 70, 25, 60, 225, 50, 59, GrowthRate.MEDIUM_FAST, 50, false),
    new PokemonSpecies(Species.SEADRA, 1, false, false, false, "Dragon Pokémon", Type.WATER, null, 1.2, 25, Abilities.POISON_POINT, Abilities.SNIPER, Abilities.DAMP, 440, 55, 65, 95, 95, 45, 85, 75, 50, 154, GrowthRate.MEDIUM_FAST, 50, false),
    new PokemonSpecies(Species.GOLDEEN, 1, false, false, false, "Goldfish Pokémon", Type.WATER, null, 0.6, 15, Abilities.SWIFT_SWIM, Abilities.WATER_VEIL, Abilities.LIGHTNING_ROD, 320, 45, 67, 60, 35, 50, 63, 225, 50, 64, GrowthRate.MEDIUM_FAST, 50, true),
    new PokemonSpecies(Species.SEAKING, 1, false, false, false, "Goldfish Pokémon", Type.WATER, null, 1.3, 39, Abilities.SWIFT_SWIM, Abilities.WATER_VEIL, Abilities.LIGHTNING_ROD, 450, 80, 92, 65, 65, 80, 68, 60, 50, 158, GrowthRate.MEDIUM_FAST, 50, true),
    new PokemonSpecies(Species.STARYU, 1, false, false, false, "Star Shape Pokémon", Type.WATER, null, 0.8, 34.5, Abilities.ILLUMINATE, Abilities.NATURAL_CURE, Abilities.ANALYTIC, 340, 30, 45, 55, 70, 55, 85, 225, 50, 68, GrowthRate.SLOW, null, false),
    new PokemonSpecies(Species.STARMIE, 1, false, false, false, "Mysterious Pokémon", Type.WATER, Type.PSYCHIC, 1.1, 80, Abilities.ILLUMINATE, Abilities.NATURAL_CURE, Abilities.ANALYTIC, 520, 60, 75, 85, 100, 85, 115, 60, 50, 182, GrowthRate.SLOW, null, false),
    new PokemonSpecies(Species.MR_MIME, 1, false, false, false, "Barrier Pokémon", Type.PSYCHIC, Type.FAIRY, 1.3, 54.5, Abilities.SOUNDPROOF, Abilities.FILTER, Abilities.TECHNICIAN, 460, 40, 45, 65, 100, 120, 90, 45, 50, 161, GrowthRate.MEDIUM_FAST, 50, false),
    new PokemonSpecies(Species.SCYTHER, 1, false, false, false, "Mantis Pokémon", Type.BUG, Type.FLYING, 1.5, 56, Abilities.SWARM, Abilities.TECHNICIAN, Abilities.STEADFAST, 500, 70, 110, 80, 55, 80, 105, 45, 50, 100, GrowthRate.MEDIUM_FAST, 50, true),
    new PokemonSpecies(Species.JYNX, 1, false, false, false, "Human Shape Pokémon", Type.ICE, Type.PSYCHIC, 1.4, 40.6, Abilities.OBLIVIOUS, Abilities.FOREWARN, Abilities.DRY_SKIN, 455, 65, 50, 35, 115, 95, 95, 45, 50, 159, GrowthRate.MEDIUM_FAST, 0, false),
    new PokemonSpecies(Species.ELECTABUZZ, 1, false, false, false, "Electric Pokémon", Type.ELECTRIC, null, 1.1, 30, Abilities.STATIC, Abilities.NONE, Abilities.VITAL_SPIRIT, 490, 65, 83, 57, 95, 85, 105, 45, 50, 172, GrowthRate.MEDIUM_FAST, 75, false),
    new PokemonSpecies(Species.MAGMAR, 1, false, false, false, "Spitfire Pokémon", Type.FIRE, null, 1.3, 44.5, Abilities.FLAME_BODY, Abilities.NONE, Abilities.VITAL_SPIRIT, 495, 65, 95, 57, 100, 85, 93, 45, 50, 173, GrowthRate.MEDIUM_FAST, 75, false),
    new PokemonSpecies(Species.PINSIR, 1, false, false, false, "Stag Beetle Pokémon", Type.BUG, null, 1.5, 55, Abilities.HYPER_CUTTER, Abilities.MOLD_BREAKER, Abilities.MOXIE, 500, 65, 125, 100, 55, 70, 85, 45, 50, 175, GrowthRate.SLOW, 50, false, true,
      new PokemonForm("Normal", "", Type.BUG, null, 1.5, 55, Abilities.HYPER_CUTTER, Abilities.MOLD_BREAKER, Abilities.MOXIE, 500, 65, 125, 100, 55, 70, 85, 45, 50, 175, false, null, true),
      new PokemonForm("Mega", SpeciesFormKey.MEGA, Type.BUG, Type.FLYING, 1.7, 59, Abilities.AERILATE, Abilities.AERILATE, Abilities.AERILATE, 600, 65, 155, 120, 65, 90, 105, 45, 50, 175),
    ),
    new PokemonSpecies(Species.TAUROS, 1, false, false, false, "Wild Bull Pokémon", Type.NORMAL, null, 1.4, 88.4, Abilities.INTIMIDATE, Abilities.ANGER_POINT, Abilities.SHEER_FORCE, 490, 75, 100, 95, 40, 70, 110, 45, 50, 172, GrowthRate.SLOW, 100, false),
    new PokemonSpecies(Species.MAGIKARP, 1, false, false, false, "Fish Pokémon", Type.WATER, null, 0.9, 10, Abilities.SWIFT_SWIM, Abilities.NONE, Abilities.RATTLED, 200, 20, 10, 55, 15, 20, 80, 255, 50, 40, GrowthRate.SLOW, 50, true),
    new PokemonSpecies(Species.GYARADOS, 1, false, false, false, "Atrocious Pokémon", Type.WATER, Type.FLYING, 6.5, 235, Abilities.INTIMIDATE, Abilities.NONE, Abilities.MOXIE, 540, 95, 125, 79, 60, 100, 81, 45, 50, 189, GrowthRate.SLOW, 50, true, true,
      new PokemonForm("Normal", "", Type.WATER, Type.FLYING, 6.5, 235, Abilities.INTIMIDATE, Abilities.NONE, Abilities.MOXIE, 540, 95, 125, 79, 60, 100, 81, 45, 50, 189, true, null, true),
      new PokemonForm("Mega", SpeciesFormKey.MEGA, Type.WATER, Type.DARK, 6.5, 305, Abilities.MOLD_BREAKER, Abilities.MOLD_BREAKER, Abilities.MOLD_BREAKER, 640, 95, 155, 109, 70, 130, 81, 45, 50, 189, true),
    ),
    new PokemonSpecies(Species.LAPRAS, 1, false, false, false, "Transport Pokémon", Type.WATER, Type.ICE, 2.5, 220, Abilities.WATER_ABSORB, Abilities.SHELL_ARMOR, Abilities.HYDRATION, 535, 130, 85, 80, 85, 95, 60, 45, 50, 187, GrowthRate.SLOW, 50, false, true,
      new PokemonForm("Normal", "", Type.WATER, Type.ICE, 2.5, 220, Abilities.WATER_ABSORB, Abilities.SHELL_ARMOR, Abilities.HYDRATION, 535, 130, 85, 80, 85, 95, 60, 45, 50, 187, false, null, true),
      new PokemonForm("G-Max", SpeciesFormKey.GIGANTAMAX, Type.WATER, Type.ICE, 24, 220, Abilities.SHELL_ARMOR, Abilities.SHELL_ARMOR, Abilities.SHELL_ARMOR, 635, 170, 85, 95, 115, 110, 60, 45, 50, 187),
    ),
    new PokemonSpecies(Species.DITTO, 1, false, false, false, "Transform Pokémon", Type.NORMAL, null, 0.3, 4, Abilities.LIMBER, Abilities.NONE, Abilities.IMPOSTER, 288, 48, 48, 48, 48, 48, 48, 35, 50, 101, GrowthRate.MEDIUM_FAST, null, false),
    new PokemonSpecies(Species.EEVEE, 1, false, false, false, "Evolution Pokémon", Type.NORMAL, null, 0.3, 6.5, Abilities.RUN_AWAY, Abilities.ADAPTABILITY, Abilities.ANTICIPATION, 325, 55, 55, 50, 45, 65, 55, 45, 50, 65, GrowthRate.MEDIUM_FAST, 87.5, false, true,
      new PokemonForm("Normal", "", Type.NORMAL, null, 0.3, 6.5, Abilities.RUN_AWAY, Abilities.ADAPTABILITY, Abilities.ANTICIPATION, 325, 55, 55, 50, 45, 65, 55, 45, 50, 65, false, null, true),
      new PokemonForm("Partner", "partner", Type.NORMAL, null, 0.3, 6.5, Abilities.RUN_AWAY, Abilities.ADAPTABILITY, Abilities.ANTICIPATION, 435, 65, 75, 70, 65, 85, 75, 45, 50, 65, false, null, true),
      new PokemonForm("G-Max", SpeciesFormKey.GIGANTAMAX, Type.NORMAL, null, 18, 6.5, Abilities.PROTEAN, Abilities.PROTEAN, Abilities.PROTEAN, 535, 105, 95, 70, 95, 85, 85, 45, 50, 65), //+100 BST from Partner Form
    ),
    new PokemonSpecies(Species.VAPOREON, 1, false, false, false, "Bubble Jet Pokémon", Type.WATER, null, 1, 29, Abilities.WATER_ABSORB, Abilities.NONE, Abilities.HYDRATION, 525, 130, 65, 60, 110, 95, 65, 45, 50, 184, GrowthRate.MEDIUM_FAST, 87.5, false),
    new PokemonSpecies(Species.JOLTEON, 1, false, false, false, "Lightning Pokémon", Type.ELECTRIC, null, 0.8, 24.5, Abilities.VOLT_ABSORB, Abilities.NONE, Abilities.QUICK_FEET, 525, 65, 65, 60, 110, 95, 130, 45, 50, 184, GrowthRate.MEDIUM_FAST, 87.5, false),
    new PokemonSpecies(Species.FLAREON, 1, false, false, false, "Flame Pokémon", Type.FIRE, null, 0.9, 25, Abilities.FLASH_FIRE, Abilities.NONE, Abilities.GUTS, 525, 65, 130, 60, 95, 110, 65, 45, 50, 184, GrowthRate.MEDIUM_FAST, 87.5, false),
    new PokemonSpecies(Species.PORYGON, 1, false, false, false, "Virtual Pokémon", Type.NORMAL, null, 0.8, 36.5, Abilities.TRACE, Abilities.DOWNLOAD, Abilities.ANALYTIC, 395, 65, 60, 70, 85, 75, 40, 45, 50, 79, GrowthRate.MEDIUM_FAST, null, false),
    new PokemonSpecies(Species.OMANYTE, 1, false, false, false, "Spiral Pokémon", Type.ROCK, Type.WATER, 0.4, 7.5, Abilities.SWIFT_SWIM, Abilities.SHELL_ARMOR, Abilities.WEAK_ARMOR, 355, 35, 40, 100, 90, 55, 35, 45, 50, 71, GrowthRate.MEDIUM_FAST, 87.5, false),
    new PokemonSpecies(Species.OMASTAR, 1, false, false, false, "Spiral Pokémon", Type.ROCK, Type.WATER, 1, 35, Abilities.SWIFT_SWIM, Abilities.SHELL_ARMOR, Abilities.WEAK_ARMOR, 495, 70, 60, 125, 115, 70, 55, 45, 50, 173, GrowthRate.MEDIUM_FAST, 87.5, false),
    new PokemonSpecies(Species.KABUTO, 1, false, false, false, "Shellfish Pokémon", Type.ROCK, Type.WATER, 0.5, 11.5, Abilities.SWIFT_SWIM, Abilities.BATTLE_ARMOR, Abilities.WEAK_ARMOR, 355, 30, 80, 90, 55, 45, 55, 45, 50, 71, GrowthRate.MEDIUM_FAST, 87.5, false),
    new PokemonSpecies(Species.KABUTOPS, 1, false, false, false, "Shellfish Pokémon", Type.ROCK, Type.WATER, 1.3, 40.5, Abilities.SWIFT_SWIM, Abilities.BATTLE_ARMOR, Abilities.WEAK_ARMOR, 495, 60, 115, 105, 65, 70, 80, 45, 50, 173, GrowthRate.MEDIUM_FAST, 87.5, false),
    new PokemonSpecies(Species.AERODACTYL, 1, false, false, false, "Fossil Pokémon", Type.ROCK, Type.FLYING, 1.8, 59, Abilities.ROCK_HEAD, Abilities.PRESSURE, Abilities.UNNERVE, 515, 80, 105, 65, 60, 75, 130, 45, 50, 180, GrowthRate.SLOW, 87.5, false, true,
      new PokemonForm("Normal", "", Type.ROCK, Type.FLYING, 1.8, 59, Abilities.ROCK_HEAD, Abilities.PRESSURE, Abilities.UNNERVE, 515, 80, 105, 65, 60, 75, 130, 45, 50, 180, false, null, true),
      new PokemonForm("Mega", SpeciesFormKey.MEGA, Type.ROCK, Type.FLYING, 2.1, 79, Abilities.TOUGH_CLAWS, Abilities.TOUGH_CLAWS, Abilities.TOUGH_CLAWS, 615, 80, 135, 85, 70, 95, 150, 45, 50, 180),
    ),
    new PokemonSpecies(Species.SNORLAX, 1, false, false, false, "Sleeping Pokémon", Type.NORMAL, null, 2.1, 460, Abilities.IMMUNITY, Abilities.THICK_FAT, Abilities.GLUTTONY, 540, 160, 110, 65, 65, 110, 30, 25, 50, 189, GrowthRate.SLOW, 87.5, false, true,
      new PokemonForm("Normal", "", Type.NORMAL, null, 2.1, 460, Abilities.IMMUNITY, Abilities.THICK_FAT, Abilities.GLUTTONY, 540, 160, 110, 65, 65, 110, 30, 25, 50, 189, false, null, true),
      new PokemonForm("G-Max", SpeciesFormKey.GIGANTAMAX, Type.NORMAL, null, 35, 460, Abilities.HARVEST, Abilities.HARVEST, Abilities.HARVEST, 640, 200, 135, 80, 80, 125, 20, 25, 50, 189),
    ),
    new PokemonSpecies(Species.ARTICUNO, 1, true, false, false, "Freeze Pokémon", Type.ICE, Type.FLYING, 1.7, 55.4, Abilities.PRESSURE, Abilities.NONE, Abilities.SNOW_CLOAK, 580, 90, 85, 100, 95, 125, 85, 3, 35, 290, GrowthRate.SLOW, null, false),
    new PokemonSpecies(Species.ZAPDOS, 1, true, false, false, "Electric Pokémon", Type.ELECTRIC, Type.FLYING, 1.6, 52.6, Abilities.PRESSURE, Abilities.NONE, Abilities.STATIC, 580, 90, 90, 85, 125, 90, 100, 3, 35, 290, GrowthRate.SLOW, null, false),
    new PokemonSpecies(Species.MOLTRES, 1, true, false, false, "Flame Pokémon", Type.FIRE, Type.FLYING, 2, 60, Abilities.PRESSURE, Abilities.NONE, Abilities.FLAME_BODY, 580, 90, 100, 90, 125, 85, 90, 3, 35, 290, GrowthRate.SLOW, null, false),
    new PokemonSpecies(Species.DRATINI, 1, false, false, false, "Dragon Pokémon", Type.DRAGON, null, 1.8, 3.3, Abilities.SHED_SKIN, Abilities.NONE, Abilities.MARVEL_SCALE, 300, 41, 64, 45, 50, 50, 50, 45, 35, 60, GrowthRate.SLOW, 50, false),
    new PokemonSpecies(Species.DRAGONAIR, 1, false, false, false, "Dragon Pokémon", Type.DRAGON, null, 4, 16.5, Abilities.SHED_SKIN, Abilities.NONE, Abilities.MARVEL_SCALE, 420, 61, 84, 65, 70, 70, 70, 45, 35, 147, GrowthRate.SLOW, 50, false),
    new PokemonSpecies(Species.DRAGONITE, 1, false, false, false, "Dragon Pokémon", Type.DRAGON, Type.FLYING, 2.2, 210, Abilities.INNER_FOCUS, Abilities.NONE, Abilities.MULTISCALE, 600, 91, 134, 95, 100, 100, 80, 45, 35, 300, GrowthRate.SLOW, 50, false),
    new PokemonSpecies(Species.MEWTWO, 1, false, true, false, "Genetic Pokémon", Type.PSYCHIC, null, 2, 122, Abilities.PRESSURE, Abilities.NONE, Abilities.UNNERVE, 680, 106, 110, 90, 154, 90, 130, 3, 0, 340, GrowthRate.SLOW, null, false, true,
      new PokemonForm("Normal", "", Type.PSYCHIC, null, 2, 122, Abilities.PRESSURE, Abilities.NONE, Abilities.UNNERVE, 680, 106, 110, 90, 154, 90, 130, 3, 0, 340, false, null, true),
      new PokemonForm("Mega X", SpeciesFormKey.MEGA_X, Type.PSYCHIC, Type.FIGHTING, 2.3, 127, Abilities.STEADFAST, Abilities.NONE, Abilities.STEADFAST, 780, 106, 190, 100, 154, 100, 130, 3, 0, 340),
      new PokemonForm("Mega Y", SpeciesFormKey.MEGA_Y, Type.PSYCHIC, null, 1.5, 33, Abilities.INSOMNIA, Abilities.NONE, Abilities.INSOMNIA, 780, 106, 150, 70, 194, 120, 140, 3, 0, 340),
    ),
    new PokemonSpecies(Species.MEW, 1, false, false, true, "New Species Pokémon", Type.PSYCHIC, null, 0.4, 4, Abilities.SYNCHRONIZE, Abilities.NONE, Abilities.NONE, 600, 100, 100, 100, 100, 100, 100, 45, 100, 300, GrowthRate.MEDIUM_SLOW, null, false),
  );
}

export const speciesStarters = {
  [Species.BULBASAUR]: 3,
  [Species.CHARMANDER]: 3,
  [Species.SQUIRTLE]: 3,
  [Species.CATERPIE]: 2,
  [Species.WEEDLE]: 1,
  [Species.PIDGEY]: 1,
  [Species.RATTATA]: 1,
  [Species.SPEAROW]: 1,
  [Species.EKANS]: 2,
  [Species.PIKACHU]: 3,
  [Species.SANDSHREW]: 2,
  [Species.NIDORAN_F]: 3,
  [Species.NIDORAN_M]: 3,
  [Species.CLEFAIRY]: 3,
  [Species.VULPIX]: 3,
  [Species.JIGGLYPUFF]: 2,
  [Species.ZUBAT]: 3,
  [Species.ODDISH]: 3,
  [Species.PARAS]: 2,
  [Species.VENONAT]: 2,
  [Species.DIGLETT]: 2,
  [Species.MEOWTH]: 3,
  [Species.PSYDUCK]: 2,
  [Species.MANKEY]: 4,
  [Species.GROWLITHE]: 4,
  [Species.POLIWAG]: 2,
  [Species.ABRA]: 4,
  [Species.MACHOP]: 3,
  [Species.BELLSPROUT]: 2,
  [Species.TENTACOOL]: 3,
  [Species.GEODUDE]: 3,
  [Species.PONYTA]: 2,
  [Species.SLOWPOKE]: 3,
  [Species.MAGNEMITE]: 4,
  [Species.FARFETCHD]: 2,
  [Species.DODUO]: 3,
  [Species.SEEL]: 1,
  [Species.GRIMER]: 2,
  [Species.SHELLDER]: 5,
  [Species.GASTLY]: 4,
  [Species.ONIX]: 3,
  [Species.DROWZEE]: 2,
  [Species.KRABBY]: 3,
  [Species.VOLTORB]: 2,
  [Species.EXEGGCUTE]: 3,
  [Species.CUBONE]: 3,
  [Species.HITMONLEE]: 4,
  [Species.HITMONCHAN]: 4,
  [Species.LICKITUNG]: 3,
  [Species.KOFFING]: 2,
  [Species.RHYHORN]: 3,
  [Species.CHANSEY]: 3,
  [Species.TANGELA]: 3,
  [Species.KANGASKHAN]: 4,
  [Species.HORSEA]: 3,
  [Species.GOLDEEN]: 2,
  [Species.STARYU]: 3,
  [Species.MR_MIME]: 3,
  [Species.SCYTHER]: 5,
  [Species.JYNX]: 4,
  [Species.ELECTABUZZ]: 4,
  [Species.MAGMAR]: 4,
  [Species.PINSIR]: 4,
  [Species.TAUROS]: 4,
  [Species.MAGIKARP]: 4,
  [Species.LAPRAS]: 4,
  [Species.DITTO]: 2,
  [Species.EEVEE]: 3,
  [Species.PORYGON]: 4,
  [Species.OMANYTE]: 3,
  [Species.KABUTO]: 3,
  [Species.AERODACTYL]: 5,
  [Species.SNORLAX]: 5,
  [Species.ARTICUNO]: 6,
  [Species.ZAPDOS]: 6,
  [Species.MOLTRES]: 6,
  [Species.DRATINI]: 4,
  [Species.MEWTWO]: 8,
  [Species.MEW]: 6,
};

export const noStarterFormKeys: string[] = [
  SpeciesFormKey.MEGA,
  SpeciesFormKey.MEGA_X,
  SpeciesFormKey.MEGA_Y,
  SpeciesFormKey.PRIMAL,
  SpeciesFormKey.ORIGIN,
  SpeciesFormKey.THERIAN,
  SpeciesFormKey.GIGANTAMAX,
  SpeciesFormKey.GIGANTAMAX_RAPID,
  SpeciesFormKey.GIGANTAMAX_SINGLE,
  SpeciesFormKey.ETERNAMAX
].map(k => k.toString());

export function getStarterValueFriendshipCap(value: integer): integer {
  switch (value) {
  case 1:
    return 20;
  case 2:
    return 40;
  case 3:
    return 60;
  case 4:
    return 100;
  case 5:
    return 140;
  case 6:
    return 200;
  case 7:
    return 280;
  case 8:
  case 9:
    return 450;
  default:
    return 600;
  }
}

/**
* Method to get the daily list of starters with Pokerus.
* @param scene {@linkcode BattleScene} used as part of RNG
* @returns A list of starters with Pokerus
*/
export function getPokerusStarters(scene: BattleScene): PokemonSpecies[] {
  const pokerusStarters: PokemonSpecies[] = [];
  const date = new Date();
  const starterCount = 3; //for easy future adjustment!
  date.setUTCHours(0, 0, 0, 0);
  scene.executeWithSeedOffset(() => {
    while (pokerusStarters.length < starterCount) {
      const randomSpeciesId = parseInt(Utils.randSeedItem(Object.keys(speciesStarters)), 10);
      const species = getPokemonSpecies(randomSpeciesId);
      if (!pokerusStarters.includes(species)) {
        pokerusStarters.push(species);
      }
    }
  }, 0, date.getTime().toString());
  return pokerusStarters;
}

export const starterPassiveAbilities = {
  [Species.BULBASAUR]: Abilities.GRASSY_SURGE,
  [Species.CHARMANDER]: Abilities.BEAST_BOOST,
  [Species.SQUIRTLE]: Abilities.STURDY,
  [Species.CATERPIE]: Abilities.MAGICIAN,
  [Species.WEEDLE]: Abilities.TINTED_LENS,
  [Species.PIDGEY]: Abilities.FLARE_BOOST,
  [Species.RATTATA]: Abilities.STRONG_JAW,
  [Species.SPEAROW]: Abilities.MOXIE,
  [Species.EKANS]: Abilities.REGENERATOR,
  [Species.PIKACHU]: Abilities.ELECTRIC_SURGE,
  [Species.SANDSHREW]: Abilities.TOUGH_CLAWS,
  [Species.NIDORAN_F]: Abilities.FLARE_BOOST,
  [Species.NIDORAN_M]: Abilities.GUTS,
  [Species.CLEFAIRY]: Abilities.ANALYTIC,
  [Species.VULPIX]: Abilities.FUR_COAT,
  [Species.JIGGLYPUFF]: Abilities.HUGE_POWER,
  [Species.ZUBAT]: Abilities.INTIMIDATE,
  [Species.ODDISH]: Abilities.TRIAGE,
  [Species.PARAS]: Abilities.TRIAGE,
  [Species.VENONAT]: Abilities.SIMPLE,
  [Species.DIGLETT]: Abilities.STURDY,
  [Species.MEOWTH]: Abilities.TOUGH_CLAWS,
  [Species.PSYDUCK]: Abilities.SIMPLE,
  [Species.MANKEY]: Abilities.IRON_FIST,
  [Species.GROWLITHE]: Abilities.SPEED_BOOST,
  [Species.POLIWAG]: Abilities.NO_GUARD,
  [Species.ABRA]: Abilities.PSYCHIC_SURGE,
  [Species.MACHOP]: Abilities.QUICK_FEET,
  [Species.BELLSPROUT]: Abilities.PROTOSYNTHESIS,
  [Species.TENTACOOL]: Abilities.TOXIC_CHAIN,
  [Species.GEODUDE]: Abilities.DRY_SKIN,
  [Species.PONYTA]: Abilities.MAGIC_GUARD,
  [Species.SLOWPOKE]: Abilities.UNAWARE,
  [Species.MAGNEMITE]: Abilities.LEVITATE,
  [Species.FARFETCHD]: Abilities.SNIPER,
  [Species.DODUO]: Abilities.PARENTAL_BOND,
  [Species.SEEL]: Abilities.WATER_BUBBLE,
  [Species.GRIMER]: Abilities.WATER_ABSORB,
  [Species.SHELLDER]: Abilities.ICE_SCALES,
  [Species.GASTLY]: Abilities.SHADOW_SHIELD,
  [Species.ONIX]: Abilities.ROCKY_PAYLOAD,
  [Species.DROWZEE]: Abilities.MAGICIAN,
  [Species.KRABBY]: Abilities.UNBURDEN,
  [Species.VOLTORB]: Abilities.TRANSISTOR,
  [Species.EXEGGCUTE]: Abilities.RIPEN,
  [Species.CUBONE]: Abilities.PARENTAL_BOND,
  [Species.LICKITUNG]: Abilities.THICK_FAT,
  [Species.KOFFING]: Abilities.PARENTAL_BOND,
  [Species.RHYHORN]: Abilities.FILTER,
  [Species.TANGELA]: Abilities.SEED_SOWER,
  [Species.KANGASKHAN]: Abilities.GUTS,
  [Species.HORSEA]: Abilities.DRAGONS_MAW,
  [Species.GOLDEEN]: Abilities.MULTISCALE,
  [Species.STARYU]: Abilities.REGENERATOR,
  [Species.SCYTHER]: Abilities.TINTED_LENS,
  [Species.PINSIR]: Abilities.TINTED_LENS,
  [Species.TAUROS]: Abilities.SCRAPPY,
  [Species.MAGIKARP]: Abilities.MULTISCALE,
  [Species.LAPRAS]: Abilities.LIGHTNING_ROD,
  [Species.DITTO]: Abilities.ADAPTABILITY,
  [Species.EEVEE]: Abilities.PICKUP,
  [Species.PORYGON]: Abilities.PROTEAN,
  [Species.OMANYTE]: Abilities.STURDY,
  [Species.KABUTO]: Abilities.TOUGH_CLAWS,
  [Species.AERODACTYL]: Abilities.ORICHALCUM_PULSE,
  [Species.ARTICUNO]: Abilities.SNOW_WARNING,
  [Species.ZAPDOS]: Abilities.DRIZZLE,
  [Species.MOLTRES]: Abilities.DROUGHT,
  [Species.DRATINI]: Abilities.AERILATE,
  [Species.MEWTWO]: Abilities.NEUROFORCE,
  [Species.MEW]: Abilities.PROTEAN,
};

