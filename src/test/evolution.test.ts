import { pokemonEvolutions, SpeciesFormEvolution, SpeciesWildEvolutionDelay } from "#app/data/pokemon-evolutions";
import { Abilities } from "#app/enums/abilities";
import { Moves } from "#app/enums/moves";
import { Species } from "#app/enums/species";
import GameManager from "#test/utils/gameManager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { SPLASH_ONLY } from "./utils/testUtils";

describe("Evolution", () => {
  let phaserGame: Phaser.Game;
  let game: GameManager;
  const TIMEOUT = 1000 * 20;

  beforeAll(() => {
    phaserGame = new Phaser.Game({
      type: Phaser.HEADLESS,
    });
  });

  afterEach(() => {
    game.phaseInterceptor.restoreOg();
  });

  beforeEach(() => {
    game = new GameManager(phaserGame);

    game.override.battleType("single");

    game.override.enemySpecies(Species.MAGIKARP);
    game.override.enemyAbility(Abilities.BALL_FETCH);

    game.override.startingLevel(60);
  });

  it("should keep hidden ability after evolving", async () => {
    await game.classicMode.runToSummon([Species.EEVEE, Species.DRATINI]);

    const eevee = game.scene.getParty()[0];
    const dratini = game.scene.getParty()[1];
    eevee.abilityIndex = 2;
    dratini.abilityIndex = 2;

    eevee.evolve(pokemonEvolutions[Species.EEVEE][6], eevee.getSpeciesForm());
    expect(eevee.abilityIndex).toBe(2);

    dratini.evolve(pokemonEvolutions[Species.DRATINI][0], dratini.getSpeciesForm());
    expect(dratini.abilityIndex).toBe(1);
  }, TIMEOUT);

  it("should keep same ability slot after evolving", async () => {
    await game.classicMode.runToSummon([Species.BULBASAUR, Species.CHARMANDER]);

    const bulbasaur = game.scene.getParty()[0];
    const charmander = game.scene.getParty()[1];
    bulbasaur.abilityIndex = 0;
    charmander.abilityIndex = 1;

    bulbasaur.evolve(pokemonEvolutions[Species.BULBASAUR][0], bulbasaur.getSpeciesForm());
    expect(bulbasaur.abilityIndex).toBe(0);

    charmander.evolve(pokemonEvolutions[Species.CHARMANDER][0], charmander.getSpeciesForm());
    expect(charmander.abilityIndex).toBe(1);
  }, TIMEOUT);

  it("should handle illegal abilityIndex values", async () => {
    await game.classicMode.runToSummon([Species.SQUIRTLE]);

    const squirtle = game.scene.getPlayerPokemon()!;
    squirtle.abilityIndex = 5;

    squirtle.evolve(pokemonEvolutions[Species.SQUIRTLE][0], squirtle.getSpeciesForm());
    expect(squirtle.abilityIndex).toBe(0);
  }, TIMEOUT);

  it("should set wild delay to NONE by default", () => {
    const speciesFormEvo = new SpeciesFormEvolution(Species.ABRA, null, null, 1000, null, null);

    expect(speciesFormEvo.wildDelay).toBe(SpeciesWildEvolutionDelay.NONE);
  });

  it("should increase both HP and max HP when evolving", async () => {
    game.override.moveset([Moves.SURF])
      .enemySpecies(Species.GOLEM)
      .enemyMoveset(SPLASH_ONLY)
      .startingWave(21)
      .startingLevel(16)
      .enemyLevel(50);

    await game.startBattle([Species.SQUIRTLE]);

    const squirtle = game.scene.getPlayerPokemon()!;
    const hpBefore = squirtle.hp;

    expect(squirtle.hp).toBe(squirtle.getMaxHp());

    const golem = game.scene.getEnemyPokemon()!;
    golem.hp = 1;

    expect(golem.hp).toBe(1);

    game.move.select(Moves.SURF);
    await game.phaseInterceptor.to("EndEvolutionPhase");

    expect(squirtle.hp).toBe(squirtle.getMaxHp());
    expect(squirtle.hp).toBeGreaterThan(hpBefore);
  }, TIMEOUT);

  it("should not fully heal HP when evolving", async () => {
    game.override.moveset([Moves.SURF])
      .enemySpecies(Species.GOLEM)
      .enemyMoveset(SPLASH_ONLY)
      .startingWave(21)
      .startingLevel(13)
      .enemyLevel(30);

    await game.startBattle([Species.CHARMANDER]);

    const charmander = game.scene.getPlayerPokemon()!;
    charmander.hp = Math.floor(charmander.getMaxHp() / 2);
    const hpBefore = charmander.hp;
    const maxHpBefore = charmander.getMaxHp();

    expect(charmander.hp).toBe(Math.floor(charmander.getMaxHp() / 2));

    const golem = game.scene.getEnemyPokemon()!;
    golem.hp = 1;

    expect(golem.hp).toBe(1);

    game.move.select(Moves.SURF);
    await game.phaseInterceptor.to("EndEvolutionPhase");

    expect(charmander.getMaxHp()).toBeGreaterThan(maxHpBefore);
    expect(charmander.hp).toBeGreaterThan(hpBefore);
    expect(charmander.hp).toBeLessThan(charmander.getMaxHp());
  }, TIMEOUT);
});
