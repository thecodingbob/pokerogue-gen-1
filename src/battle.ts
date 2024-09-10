import BattleScene from "./battle-scene";
import { EnemyPokemon, PlayerPokemon, QueuedMove } from "./field/pokemon";
import { Command } from "./ui/command-ui-handler";
import * as Utils from "./utils";
import Trainer, { TrainerVariant } from "./field/trainer";
import { GameMode } from "./game-mode";
import { MoneyMultiplierModifier, PokemonHeldItemModifier } from "./modifier/modifier";
import { PokeballType } from "./data/pokeball";
import {trainerConfigs} from "#app/data/trainer-config";
import { ArenaTagType } from "#enums/arena-tag-type";
import { BattleSpec } from "#enums/battle-spec";
import { Moves } from "#enums/moves";
import { PlayerGender } from "#enums/player-gender";
import { Species } from "#enums/species";
import { TrainerType } from "#enums/trainer-type";
import i18next from "#app/plugins/i18n";

export enum BattleType {
    WILD,
    TRAINER,
    CLEAR
}

export enum BattlerIndex {
    ATTACKER = -1,
    PLAYER,
    PLAYER_2,
    ENEMY,
    ENEMY_2
}

export interface TurnCommand {
    command: Command;
    cursor?: integer;
    move?: QueuedMove;
    targets?: BattlerIndex[];
    skip?: boolean;
    args?: any[];
}

interface TurnCommands {
    [key: integer]: TurnCommand | null
}

export default class Battle {
  protected gameMode: GameMode;
  public waveIndex: integer;
  public battleType: BattleType;
  public battleSpec: BattleSpec;
  public trainer: Trainer | null;
  public enemyLevels: integer[] | undefined;
  public enemyParty: EnemyPokemon[];
  public seenEnemyPartyMemberIds: Set<integer>;
  public double: boolean;
  public started: boolean;
  public enemySwitchCounter: integer;
  public turn: integer;
  public turnCommands: TurnCommands;
  public playerParticipantIds: Set<integer>;
  public battleScore: integer;
  public postBattleLoot: PokemonHeldItemModifier[];
  public escapeAttempts: integer;
  public lastMove: Moves;
  public battleSeed: string;
  private battleSeedState: string | null;
  public moneyScattered: number;
  public lastUsedPokeball: PokeballType | null;
  public playerFaints: number; // The amount of times pokemon on the players side have fainted
  public enemyFaints: number; // The amount of times pokemon on the enemies side have fainted

  private rngCounter: integer = 0;

  constructor(gameMode: GameMode, waveIndex: integer, battleType: BattleType, trainer?: Trainer, double?: boolean) {
    this.gameMode = gameMode;
    this.waveIndex = waveIndex;
    this.battleType = battleType;
    this.trainer = trainer ?? null;
    this.initBattleSpec();
    this.enemyLevels = battleType !== BattleType.TRAINER
      ? new Array(double ? 2 : 1).fill(null).map(() => this.getLevelForWave())
      : trainer?.getPartyLevels(this.waveIndex);
    this.enemyParty = [];
    this.seenEnemyPartyMemberIds = new Set<integer>();
    this.double = !!double;
    this.enemySwitchCounter = 0;
    this.turn = 0;
    this.playerParticipantIds = new Set<integer>();
    this.battleScore = 0;
    this.postBattleLoot = [];
    this.escapeAttempts = 0;
    this.started = false;
    this.battleSeed = Utils.randomString(16, true);
    this.battleSeedState = null;
    this.moneyScattered = 0;
    this.lastUsedPokeball = null;
    this.playerFaints = 0;
    this.enemyFaints = 0;
  }

  private initBattleSpec(): void {
    let spec = BattleSpec.DEFAULT;
    if (this.gameMode.isWaveFinal(this.waveIndex) && this.gameMode.isClassic) {
      spec = BattleSpec.FINAL_BOSS;
    }
    this.battleSpec = spec;
  }

  private getLevelForWave(): integer {
    const levelWaveIndex = this.gameMode.getWaveForDifficulty(this.waveIndex);
    const baseLevel = 1 + levelWaveIndex / 2 + Math.pow(levelWaveIndex / 25, 2);
    const bossMultiplier = 1.2;

    if (this.gameMode.isBoss(this.waveIndex)) {
      const ret = Math.floor(baseLevel * bossMultiplier);
      if (this.battleSpec === BattleSpec.FINAL_BOSS || !(this.waveIndex % 250)) {
        return Math.ceil(ret / 25) * 25;
      }
      let levelOffset = 0;
      if (!this.gameMode.isWaveFinal(this.waveIndex)) {
        levelOffset = Math.round(Phaser.Math.RND.realInRange(-1, 1) * Math.floor(levelWaveIndex / 10));
      }
      return ret + levelOffset;
    }

    let levelOffset = 0;

    const deviation = 10 / levelWaveIndex;
    levelOffset = Math.abs(this.randSeedGaussForLevel(deviation));

    return Math.max(Math.round(baseLevel + levelOffset), 1);
  }

  randSeedGaussForLevel(value: number): number {
    let rand = 0;
    for (let i = value; i > 0; i--) {
      rand += Phaser.Math.RND.realInRange(0, 1);
    }
    return rand / value;
  }

  getBattlerCount(): integer {
    return this.double ? 2 : 1;
  }

  incrementTurn(scene: BattleScene): void {
    this.turn++;
    this.turnCommands = Object.fromEntries(Utils.getEnumValues(BattlerIndex).map(bt => [ bt, null ]));
    this.battleSeedState = null;
  }

  addParticipant(playerPokemon: PlayerPokemon): void {
    this.playerParticipantIds.add(playerPokemon.id);
  }

  removeFaintedParticipant(playerPokemon: PlayerPokemon): void {
    this.playerParticipantIds.delete(playerPokemon.id);
  }

  addPostBattleLoot(enemyPokemon: EnemyPokemon): void {
    this.postBattleLoot.push(...enemyPokemon.scene.findModifiers(m => m instanceof PokemonHeldItemModifier && m.pokemonId === enemyPokemon.id && m.isTransferrable, false).map(i => {
      const ret = i as PokemonHeldItemModifier;
      //@ts-ignore - this is awful to fix/change
      ret.pokemonId = null;
      return ret;
    }));
  }

  pickUpScatteredMoney(scene: BattleScene): void {
    const moneyAmount = new Utils.IntegerHolder(scene.currentBattle.moneyScattered);
    scene.applyModifiers(MoneyMultiplierModifier, true, moneyAmount);

    if (scene.arena.getTag(ArenaTagType.HAPPY_HOUR)) {
      moneyAmount.value *= 2;
    }

    scene.addMoney(moneyAmount.value);

    const userLocale = navigator.language || "en-US";
    const formattedMoneyAmount = moneyAmount.value.toLocaleString(userLocale);
    const message = i18next.t("battle:moneyPickedUp", { moneyAmount: formattedMoneyAmount });
    scene.queueMessage(message, undefined, true);

    scene.currentBattle.moneyScattered = 0;
  }

  addBattleScore(scene: BattleScene): void {
    let partyMemberTurnMultiplier = scene.getEnemyParty().length / 2 + 0.5;
    if (this.double) {
      partyMemberTurnMultiplier /= 1.5;
    }
    for (const p of scene.getEnemyParty()) {
      if (p.isBoss()) {
        partyMemberTurnMultiplier *= (p.bossSegments / 1.5) / scene.getEnemyParty().length;
      }
    }
    const turnMultiplier = Phaser.Tweens.Builders.GetEaseFunction("Sine.easeIn")(1 - Math.min(this.turn - 2, 10 * partyMemberTurnMultiplier) / (10 * partyMemberTurnMultiplier));
    const finalBattleScore = Math.ceil(this.battleScore * turnMultiplier);
    scene.score += finalBattleScore;
    console.log(`Battle Score: ${finalBattleScore} (${this.turn - 1} Turns x${Math.floor(turnMultiplier * 100) / 100})`);
    console.log(`Total Score: ${scene.score}`);
    scene.updateScoreText();
  }

  getBgmOverride(scene: BattleScene): string | null {
    const battlers = this.enemyParty.slice(0, this.getBattlerCount());
    if (this.battleType === BattleType.TRAINER) {
      if (!this.started && this.trainer?.config.encounterBgm && this.trainer?.getEncounterMessages()?.length) {
        return `encounter_${this.trainer?.getEncounterBgm()}`;
      }
      if (scene.musicPreference === 0) {
        return this.trainer?.getBattleBgm() ?? null;
      } else {
        return this.trainer?.getMixedBattleBgm() ?? null;
      }
    } else if (this.gameMode.isClassic && this.waveIndex > 195 && this.battleSpec !== BattleSpec.FINAL_BOSS) {
      return "end_summit";
    }
    for (const pokemon of battlers) {
      if (this.battleSpec === BattleSpec.FINAL_BOSS) {
        if (pokemon.formIndex) {
          return "battle_final";
        }
        return "battle_final_encounter";
      }
      if (pokemon.species.legendary || pokemon.species.subLegendary || pokemon.species.mythical) {
        if (scene.musicPreference === 0) {
          if (pokemon.species.legendary) {
            return "battle_legendary_res_zek";
          }
          return "battle_legendary_unova";
        } else {
          if (pokemon.species.speciesId === Species.ARTICUNO || pokemon.species.speciesId === Species.ZAPDOS || pokemon.species.speciesId === Species.MOLTRES || pokemon.species.speciesId === Species.MEWTWO || pokemon.species.speciesId === Species.MEW) {
            return "battle_legendary_kanto";
          }
          if (pokemon.species.legendary) {
            return "battle_legendary_res_zek";
          }
          return "battle_legendary_unova";
        }
      }
    }

    if (scene.gameMode.isClassic && this.waveIndex <= 4) {
      return "battle_wild";
    }

    return null;
  }

  randSeedInt(scene: BattleScene, range: integer, min: integer = 0): integer {
    if (range <= 1) {
      return min;
    }
    const tempRngCounter = scene.rngCounter;
    const tempSeedOverride = scene.rngSeedOverride;
    const state = Phaser.Math.RND.state();
    if (this.battleSeedState) {
      Phaser.Math.RND.state(this.battleSeedState);
    } else {
      Phaser.Math.RND.sow([ Utils.shiftCharCodes(this.battleSeed, this.turn << 6) ]);
      console.log("Battle Seed:", this.battleSeed);
    }
    scene.rngCounter = this.rngCounter++;
    scene.rngSeedOverride = this.battleSeed;
    const ret = Utils.randSeedInt(range, min);
    this.battleSeedState = Phaser.Math.RND.state();
    Phaser.Math.RND.state(state);
    scene.rngCounter = tempRngCounter;
    scene.rngSeedOverride = tempSeedOverride;
    return ret;
  }
}

export class FixedBattle extends Battle {
  constructor(scene: BattleScene, waveIndex: integer, config: FixedBattleConfig) {
    super(scene.gameMode, waveIndex, config.battleType, config.battleType === BattleType.TRAINER ? config.getTrainer(scene) : undefined, config.double);
    if (config.getEnemyParty) {
      this.enemyParty = config.getEnemyParty(scene);
    }
  }
}

type GetTrainerFunc = (scene: BattleScene) => Trainer;
type GetEnemyPartyFunc = (scene: BattleScene) => EnemyPokemon[];

export class FixedBattleConfig {
  public battleType: BattleType;
  public double: boolean;
  public getTrainer: GetTrainerFunc;
  public getEnemyParty: GetEnemyPartyFunc;
  public seedOffsetWaveIndex: integer;

  setBattleType(battleType: BattleType): FixedBattleConfig {
    this.battleType = battleType;
    return this;
  }

  setDouble(double: boolean): FixedBattleConfig {
    this.double = double;
    return this;
  }

  setGetTrainerFunc(getTrainerFunc: GetTrainerFunc): FixedBattleConfig {
    this.getTrainer = getTrainerFunc;
    return this;
  }

  setGetEnemyPartyFunc(getEnemyPartyFunc: GetEnemyPartyFunc): FixedBattleConfig {
    this.getEnemyParty = getEnemyPartyFunc;
    return this;
  }

  setSeedOffsetWave(seedOffsetWaveIndex: integer): FixedBattleConfig {
    this.seedOffsetWaveIndex = seedOffsetWaveIndex;
    return this;
  }
}


/**
 * Helper function to generate a random trainer for evil team trainers and the elite 4/champion
 * @param trainerPool The TrainerType or list of TrainerTypes that can possibly be generated
 * @param randomGender whether or not to randomly (50%) generate a female trainer (for use with evil team grunts)
 * @param seedOffset the seed offset to use for the random generation of the trainer
 * @returns the generated trainer
 */
function getRandomTrainerFunc(trainerPool: (TrainerType | TrainerType[])[], randomGender: boolean = false, seedOffset: number  = 0): GetTrainerFunc {
  return (scene: BattleScene) => {
    const rand = Utils.randSeedInt(trainerPool.length);
    const trainerTypes: TrainerType[] = [];

    scene.executeWithSeedOffset(() => {
      for (const trainerPoolEntry of trainerPool) {
        const trainerType = Array.isArray(trainerPoolEntry)
          ? Utils.randSeedItem(trainerPoolEntry)
          : trainerPoolEntry;
        trainerTypes.push(trainerType);
      }
    }, seedOffset);

    let trainerGender = TrainerVariant.DEFAULT;
    if (randomGender) {
      trainerGender = (Utils.randInt(2) === 0) ? TrainerVariant.FEMALE : TrainerVariant.DEFAULT;
    }

    /* 1/3 chance for evil team grunts to be double battles */
    const evilTeamGrunts = [TrainerType.ROCKET_GRUNT];
    const isEvilTeamGrunt = evilTeamGrunts.includes(trainerTypes[rand]);

    if (trainerConfigs[trainerTypes[rand]].hasDouble && isEvilTeamGrunt) {
      return new Trainer(scene, trainerTypes[rand], (Utils.randInt(3) === 0) ? TrainerVariant.DOUBLE : trainerGender);
    }

    return new Trainer(scene, trainerTypes[rand], trainerGender);
  };
}

export interface FixedBattleConfigs {
    [key: integer]: FixedBattleConfig
}
/**
 * Youngster/Lass on 5
 * Rival on 8, 55, 95, 145, 195
 * Evil team grunts on 35, 62, 64, and 112
 * Evil team admin on 66 and 114
 * Evil leader on 115, 165
 * E4 on 182, 184, 186, 188
 * Champion on 190
 */
export const classicFixedBattles: FixedBattleConfigs = {
  [5]: new FixedBattleConfig().setBattleType(BattleType.TRAINER)
    .setGetTrainerFunc(scene => new Trainer(scene, TrainerType.YOUNGSTER, Utils.randSeedInt(2) ? TrainerVariant.FEMALE : TrainerVariant.DEFAULT)),
  [8]: new FixedBattleConfig().setBattleType(BattleType.TRAINER)
    .setGetTrainerFunc(scene => new Trainer(scene, TrainerType.RIVAL, scene.gameData.gender === PlayerGender.MALE ? TrainerVariant.FEMALE : TrainerVariant.DEFAULT)),
  [25]: new FixedBattleConfig().setBattleType(BattleType.TRAINER)
    .setGetTrainerFunc(scene => new Trainer(scene, TrainerType.RIVAL_2, scene.gameData.gender === PlayerGender.MALE ? TrainerVariant.FEMALE : TrainerVariant.DEFAULT)),
  [35]: new FixedBattleConfig().setBattleType(BattleType.TRAINER)
    .setGetTrainerFunc(getRandomTrainerFunc([ TrainerType.ROCKET_GRUNT], true)),
  [55]: new FixedBattleConfig().setBattleType(BattleType.TRAINER)
    .setGetTrainerFunc(scene => new Trainer(scene, TrainerType.RIVAL_3, scene.gameData.gender === PlayerGender.MALE ? TrainerVariant.FEMALE : TrainerVariant.DEFAULT)),
  [62]: new FixedBattleConfig().setBattleType(BattleType.TRAINER).setSeedOffsetWave(35)
    .setGetTrainerFunc(getRandomTrainerFunc([ TrainerType.ROCKET_GRUNT ], true)),
  [64]: new FixedBattleConfig().setBattleType(BattleType.TRAINER).setSeedOffsetWave(35)
    .setGetTrainerFunc(getRandomTrainerFunc([ TrainerType.ROCKET_GRUNT],  true)),
  [66]: new FixedBattleConfig().setBattleType(BattleType.TRAINER).setSeedOffsetWave(35)
    .setGetTrainerFunc(getRandomTrainerFunc([[TrainerType.ARIANA, TrainerType.PROTON, TrainerType.PETREL ]], true)),
  [95]: new FixedBattleConfig().setBattleType(BattleType.TRAINER)
    .setGetTrainerFunc(scene => new Trainer(scene, TrainerType.RIVAL_4, scene.gameData.gender === PlayerGender.MALE ? TrainerVariant.FEMALE : TrainerVariant.DEFAULT)),
  [112]: new FixedBattleConfig().setBattleType(BattleType.TRAINER).setSeedOffsetWave(35)
    .setGetTrainerFunc(getRandomTrainerFunc([ TrainerType.ROCKET_GRUNT], true)),
  [114]: new FixedBattleConfig().setBattleType(BattleType.TRAINER).setSeedOffsetWave(35)
    .setGetTrainerFunc(getRandomTrainerFunc([[TrainerType.ARIANA, TrainerType.PROTON, TrainerType.PETREL ]], true, 1)),
  [115]: new FixedBattleConfig().setBattleType(BattleType.TRAINER).setSeedOffsetWave(35)
    .setGetTrainerFunc(getRandomTrainerFunc([ TrainerType.ROCKET_BOSS_GIOVANNI_1])),
  [145]: new FixedBattleConfig().setBattleType(BattleType.TRAINER)
    .setGetTrainerFunc(scene => new Trainer(scene, TrainerType.RIVAL_5, scene.gameData.gender === PlayerGender.MALE ? TrainerVariant.FEMALE : TrainerVariant.DEFAULT)),
  [165]: new FixedBattleConfig().setBattleType(BattleType.TRAINER).setSeedOffsetWave(35)
    .setGetTrainerFunc(getRandomTrainerFunc([ TrainerType.ROCKET_BOSS_GIOVANNI_2])),
  [182]: new FixedBattleConfig().setBattleType(BattleType.TRAINER)
    .setGetTrainerFunc(getRandomTrainerFunc([ TrainerType.LORELEI])),
  [184]: new FixedBattleConfig().setBattleType(BattleType.TRAINER).setSeedOffsetWave(182)
    .setGetTrainerFunc(getRandomTrainerFunc([ TrainerType.BRUNO])),
  [186]: new FixedBattleConfig().setBattleType(BattleType.TRAINER).setSeedOffsetWave(182)
    .setGetTrainerFunc(getRandomTrainerFunc([ TrainerType.AGATHA, TrainerType.BRUNO])),
  [188]: new FixedBattleConfig().setBattleType(BattleType.TRAINER).setSeedOffsetWave(182)
    .setGetTrainerFunc(getRandomTrainerFunc([ TrainerType.LANCE])),
  [190]: new FixedBattleConfig().setBattleType(BattleType.TRAINER).setSeedOffsetWave(182)
    .setGetTrainerFunc(getRandomTrainerFunc([ TrainerType.BLUE, TrainerType.RED])),
  [195]: new FixedBattleConfig().setBattleType(BattleType.TRAINER)
    .setGetTrainerFunc(scene => new Trainer(scene, TrainerType.RIVAL_6, scene.gameData.gender === PlayerGender.MALE ? TrainerVariant.FEMALE : TrainerVariant.DEFAULT))
};
