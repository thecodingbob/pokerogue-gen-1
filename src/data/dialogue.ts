import { BattleSpec } from "#enums/battle-spec";
import { TrainerType } from "#enums/trainer-type";
import {trainerConfigs} from "./trainer-config";

export interface TrainerTypeMessages {
    encounter?: string | string[],
    victory?: string | string[],
    defeat?: string | string[]
}

export interface TrainerTypeDialogue {
    [key: integer]: TrainerTypeMessages | Array<TrainerTypeMessages>
}

export function getTrainerTypeDialogue(): TrainerTypeDialogue {
  return trainerTypeDialogue;
}

export const trainerTypeDialogue: TrainerTypeDialogue = {
  [TrainerType.YOUNGSTER]: [
    {
      encounter: [
        "dialogue:youngster.encounter.1",
        "dialogue:youngster.encounter.2",
        "dialogue:youngster.encounter.3",
        "dialogue:youngster.encounter.4",
        "dialogue:youngster.encounter.5",
        "dialogue:youngster.encounter.6",
        "dialogue:youngster.encounter.7",
        "dialogue:youngster.encounter.8",
        "dialogue:youngster.encounter.9",
        "dialogue:youngster.encounter.10",
        "dialogue:youngster.encounter.11",
        "dialogue:youngster.encounter.12",
        "dialogue:youngster.encounter.13"
      ],
      victory: [
        "dialogue:youngster.victory.1",
        "dialogue:youngster.victory.2",
        "dialogue:youngster.victory.3",
        "dialogue:youngster.victory.4",
        "dialogue:youngster.victory.5",
        "dialogue:youngster.victory.6",
        "dialogue:youngster.victory.7",
        "dialogue:youngster.victory.8",
        "dialogue:youngster.victory.9",
        "dialogue:youngster.victory.10",
        "dialogue:youngster.victory.11",
        "dialogue:youngster.victory.12",
        "dialogue:youngster.victory.13",
      ]
    },
    //LASS
    {
      encounter: [
        "dialogue:lass.encounter.1",
        "dialogue:lass.encounter.2",
        "dialogue:lass.encounter.3",
        "dialogue:lass.encounter.4",
        "dialogue:lass.encounter.5",
        "dialogue:lass.encounter.6",
        "dialogue:lass.encounter.7",
        "dialogue:lass.encounter.8",
        "dialogue:lass.encounter.9"
      ],
      victory: [
        "dialogue:lass.victory.1",
        "dialogue:lass.victory.2",
        "dialogue:lass.victory.3",
        "dialogue:lass.victory.4",
        "dialogue:lass.victory.5",
        "dialogue:lass.victory.6",
        "dialogue:lass.victory.7",
        "dialogue:lass.victory.8",
        "dialogue:lass.victory.9"
      ]
    }
  ],
  [TrainerType.BREEDER]: [
    {
      encounter: [
        "dialogue:breeder.encounter.1",
        "dialogue:breeder.encounter.2",
        "dialogue:breeder.encounter.3",
      ],
      victory: [
        "dialogue:breeder.victory.1",
        "dialogue:breeder.victory.2",
        "dialogue:breeder.victory.3",
      ],
      defeat: [
        "dialogue:breeder.defeat.1",
        "dialogue:breeder.defeat.2",
        "dialogue:breeder.defeat.3",
      ]
    },
    {
      encounter: [
        "dialogue:breeder_female.encounter.1",
        "dialogue:breeder_female.encounter.2",
        "dialogue:breeder_female.encounter.3",
      ],
      victory: [
        "dialogue:breeder_female.victory.1",
        "dialogue:breeder_female.victory.2",
        "dialogue:breeder_female.victory.3",
      ],
      defeat: [
        "dialogue:breeder_female.defeat.1",
        "dialogue:breeder_female.defeat.2",
        "dialogue:breeder_female.defeat.3",
      ]
    }
  ],
  [TrainerType.FISHERMAN]: [
    {
      encounter: [
        "dialogue:fisherman.encounter.1",
        "dialogue:fisherman.encounter.2",
        "dialogue:fisherman.encounter.3",
      ],
      victory: [
        "dialogue:fisherman.victory.1",
        "dialogue:fisherman.victory.2",
        "dialogue:fisherman.victory.3",
      ]
    },
    {
      encounter: [
        "dialogue:fisherman_female.encounter.1",
        "dialogue:fisherman_female.encounter.2",
        "dialogue:fisherman_female.encounter.3",
      ],
      victory: [
        "dialogue:fisherman_female.victory.1",
        "dialogue:fisherman_female.victory.2",
        "dialogue:fisherman_female.victory.3",
      ]
    }
  ],
  [TrainerType.SWIMMER]: [
    {
      encounter: [
        "dialogue:swimmer.encounter.1",
        "dialogue:swimmer.encounter.2",
        "dialogue:swimmer.encounter.3",
      ],
      victory: [
        "dialogue:swimmer.victory.1",
        "dialogue:swimmer.victory.2",
        "dialogue:swimmer.victory.3",
      ]
    }
  ],
  [TrainerType.BACKPACKER]: [
    {
      encounter: [
        "dialogue:backpacker.encounter.1",
        "dialogue:backpacker.encounter.2",
        "dialogue:backpacker.encounter.3",
        "dialogue:backpacker.encounter.4",
      ],
      victory: [
        "dialogue:backpacker.victory.1",
        "dialogue:backpacker.victory.2",
        "dialogue:backpacker.victory.3",
        "dialogue:backpacker.victory.4",
      ]
    }
  ],
  [TrainerType.ACE_TRAINER]: [
    {
      encounter: [
        "dialogue:ace_trainer.encounter.1",
        "dialogue:ace_trainer.encounter.2",
        "dialogue:ace_trainer.encounter.3",
        "dialogue:ace_trainer.encounter.4",
      ],
      victory: [
        "dialogue:ace_trainer.victory.1",
        "dialogue:ace_trainer.victory.2",
        "dialogue:ace_trainer.victory.3",
        "dialogue:ace_trainer.victory.4",
      ],
      defeat: [
        "dialogue:ace_trainer.defeat.1",
        "dialogue:ace_trainer.defeat.2",
        "dialogue:ace_trainer.defeat.3",
        "dialogue:ace_trainer.defeat.4",
      ]
    }
  ],
  [TrainerType.PARASOL_LADY]: [
    {
      encounter: [
        "dialogue:parasol_lady.encounter.1",
      ],
      victory: [
        "dialogue:parasol_lady.victory.1",
      ]
    }
  ],
  [TrainerType.TWINS]: [
    {
      encounter: [
        "dialogue:twins.encounter.1",
        "dialogue:twins.encounter.2",
        "dialogue:twins.encounter.3",
      ],
      victory: [
        "dialogue:twins.victory.1",
        "dialogue:twins.victory.2",
        "dialogue:twins.victory.3",
      ],
      defeat: [
        "dialogue:twins.defeat.1",
        "dialogue:twins.defeat.2",
        "dialogue:twins.defeat.3",
      ],
    }
  ],
  [TrainerType.BLACK_BELT]: [
    {
      encounter: [
        "dialogue:black_belt.encounter.1",
        "dialogue:black_belt.encounter.2",
      ],
      victory: [
        "dialogue:black_belt.victory.1",
        "dialogue:black_belt.victory.2",
      ]
    },
    //BATTLE GIRL
    {
      encounter: [
        "dialogue:battle_girl.encounter.1",
      ],
      victory: [
        "dialogue:battle_girl.victory.1",
      ]
    }
  ],
  [TrainerType.HIKER]: [
    {
      encounter: [
        "dialogue:hiker.encounter.1",
        "dialogue:hiker.encounter.2",
      ],
      victory: [
        "dialogue:hiker.victory.1",
        "dialogue:hiker.victory.2",
      ]
    }
  ],
  [TrainerType.RANGER]: [
    {
      encounter: [
        "dialogue:ranger.encounter.1",
        "dialogue:ranger.encounter.2",
      ],
      victory: [
        "dialogue:ranger.victory.1",
        "dialogue:ranger.victory.2",
      ],
      defeat: [
        "dialogue:ranger.defeat.1",
        "dialogue:ranger.defeat.2",
      ]
    }
  ],
  [TrainerType.SCIENTIST]: [
    {
      encounter: [
        "dialogue:scientist.encounter.1",
      ],
      victory: [
        "dialogue:scientist.victory.1",
      ]
    }
  ],
  [TrainerType.SCHOOL_KID]: [
    {
      encounter: [
        "dialogue:school_kid.encounter.1",
        "dialogue:school_kid.encounter.2",
      ],
      victory: [
        "dialogue:school_kid.victory.1",
        "dialogue:school_kid.victory.2",
      ]
    }
  ],
  [TrainerType.ARTIST]: [
    {
      encounter: [
        "dialogue:artist.encounter.1",
      ],
      victory: [
        "dialogue:artist.victory.1",
      ]
    }
  ],
  [TrainerType.GUITARIST]: [
    {
      encounter: [
        "dialogue:guitarist.encounter.1",
      ],
      victory: [
        "dialogue:guitarist.victory.1",
      ]
    }
  ],
  [TrainerType.WORKER]: [
    {
      encounter: [
        "dialogue:worker.encounter.1",
      ],
      victory: [
        "dialogue:worker.victory.1",
      ]
    },
    {
      encounter: [
        "dialogue:worker_female.encounter.1",
      ],
      victory: [
        "dialogue:worker_female.victory.1",
      ],
      defeat: [
        "dialogue:worker_female.defeat.1",
      ]
    },
    {
      encounter: [
        "dialogue:worker_double.encounter.1",
      ],
      victory: [
        "dialogue:worker_double.victory.1",
      ]
    },
  ],
  [TrainerType.HEX_MANIAC]: [
    {
      encounter: [
        "dialogue:hex_maniac.encounter.1",
        "dialogue:hex_maniac.encounter.2",
      ],
      victory: [
        "dialogue:hex_maniac.victory.1",
        "dialogue:hex_maniac.victory.2",
      ],
      defeat: [
        "dialogue:hex_maniac.defeat.1",
        "dialogue:hex_maniac.defeat.2",
      ]
    }
  ],
  [TrainerType.PSYCHIC]: [
    {
      encounter: [
        "dialogue:psychic.encounter.1",
      ],
      victory: [
        "dialogue:psychic.victory.1",
      ]
    }
  ],
  [TrainerType.OFFICER]: [
    {
      encounter: [
        "dialogue:officer.encounter.1",
        "dialogue:officer.encounter.2",
      ],
      victory: [
        "dialogue:officer.victory.1",
        "dialogue:officer.victory.2",
      ],
    }
  ],
  [TrainerType.BEAUTY]: [
    {
      encounter: [
        "dialogue:beauty.encounter.1",
      ],
      victory: [
        "dialogue:beauty.victory.1",
      ]
    }
  ],
  [TrainerType.BAKER]: [
    {
      encounter: [
        "dialogue:baker.encounter.1",
      ],
      victory: [
        "dialogue:baker.victory.1",
      ]
    }
  ],
  [TrainerType.BIKER]: [
    {
      encounter: [
        "dialogue:biker.encounter.1",
      ],
      victory: [
        "dialogue:biker.victory.1",
      ]
    }
  ],
  [TrainerType.FIREBREATHER]: [
    {
      encounter: [
        "dialogue:firebreather.encounter.1",
        "dialogue:firebreather.encounter.2",
        "dialogue:firebreather.encounter.3",
      ],
      victory: [
        "dialogue:firebreather.victory.1",
        "dialogue:firebreather.victory.2",
        "dialogue:firebreather.victory.3",
      ]
    }
  ],
  [TrainerType.SAILOR]: [
    {
      encounter: [
        "dialogue:sailor.encounter.1",
        "dialogue:sailor.encounter.2",
        "dialogue:sailor.encounter.3",
      ],
      victory: [
        "dialogue:sailor.victory.1",
        "dialogue:sailor.victory.2",
        "dialogue:sailor.victory.3",
      ]
    }
  ],
  [TrainerType.ROCKET_GRUNT]: [
    {
      encounter: [
        "dialogue:rocket_grunt.encounter.1",
        "dialogue:rocket_grunt.encounter.2",
        "dialogue:rocket_grunt.encounter.3",
        "dialogue:rocket_grunt.encounter.4",
        "dialogue:rocket_grunt.encounter.5",
      ],
      victory: [
        "dialogue:rocket_grunt.victory.1",
        "dialogue:rocket_grunt.victory.2",
        "dialogue:rocket_grunt.victory.3",
        "dialogue:rocket_grunt.victory.4",
        "dialogue:rocket_grunt.victory.5",
      ]
    }
  ],
  [TrainerType.ARIANA]: [
    {
      encounter: [
        "dialogue:ariana.encounter.1",
        "dialogue:ariana.encounter.2",
        "dialogue:ariana.encounter.3",
      ],
      victory: [
        "dialogue:ariana.victory.1",
        "dialogue:ariana.victory.2",
        "dialogue:ariana.victory.3",
      ]
    }
  ],
  [TrainerType.PROTON]: [
    {
      encounter: [
        "dialogue:proton.encounter.1",
        "dialogue:proton.encounter.2",
        "dialogue:proton.encounter.3",
      ],
      victory: [
        "dialogue:proton.victory.1",
        "dialogue:proton.victory.2",
        "dialogue:proton.victory.3",
      ]
    }
  ],
  [TrainerType.PETREL]: [
    {
      encounter: [
        "dialogue:petrel.encounter.1",
        "dialogue:petrel.encounter.2",
        "dialogue:petrel.encounter.3",
      ],
      victory: [
        "dialogue:petrel.victory.1",
        "dialogue:petrel.victory.2",
        "dialogue:petrel.victory.3",
      ]
    }
  ],
  [TrainerType.ROCKET_BOSS_GIOVANNI_1]: [
    {
      encounter: [
        "dialogue:rocket_boss_giovanni_1.encounter.1"
      ],
      victory: [
        "dialogue:rocket_boss_giovanni_1.victory.1"
      ],
      defeat: [
        "dialogue:rocket_boss_giovanni_1.defeat.1"
      ]
    }
  ],
  [TrainerType.ROCKET_BOSS_GIOVANNI_2]: [
    {
      encounter: [
        "dialogue:rocket_boss_giovanni_2.encounter.1"
      ],
      victory: [
        "dialogue:rocket_boss_giovanni_2.victory.1"
      ],
      defeat: [
        "dialogue:rocket_boss_giovanni_2.defeat.1"
      ]
    }
  ],
  [TrainerType.BROCK]: {
    encounter: [
      "dialogue:brock.encounter.1",
      "dialogue:brock.encounter.2",
      "dialogue:brock.encounter.3",
    ],
    victory: [
      "dialogue:brock.victory.1",
      "dialogue:brock.victory.2",
      "dialogue:brock.victory.3",
    ],
    defeat: [
      "dialogue:brock.defeat.1",
      "dialogue:brock.defeat.2",
      "dialogue:brock.defeat.3",
    ]
  },
  [TrainerType.MISTY]: {
    encounter: [
      "dialogue:misty.encounter.1",
      "dialogue:misty.encounter.2",
      "dialogue:misty.encounter.3",
    ],
    victory: [
      "dialogue:misty.victory.1",
      "dialogue:misty.victory.2",
      "dialogue:misty.victory.3",
    ],
    defeat: [
      "dialogue:misty.defeat.1",
      "dialogue:misty.defeat.2",
      "dialogue:misty.defeat.3",
    ]
  },
  [TrainerType.LT_SURGE]: {
    encounter: [
      "dialogue:lt_surge.encounter.1",
      "dialogue:lt_surge.encounter.2",
      "dialogue:lt_surge.encounter.3",
    ],
    victory: [
      "dialogue:lt_surge.victory.1",
      "dialogue:lt_surge.victory.2",
      "dialogue:lt_surge.victory.3",
    ],
    defeat: [
      "dialogue:lt_surge.defeat.1",
      "dialogue:lt_surge.defeat.2",
      "dialogue:lt_surge.defeat.3",
    ]
  },
  [TrainerType.ERIKA]: {
    encounter: [
      "dialogue:erika.encounter.1",
      "dialogue:erika.encounter.2",
      "dialogue:erika.encounter.3",
      "dialogue:erika.encounter.4",
    ],
    victory: [
      "dialogue:erika.victory.1",
      "dialogue:erika.victory.2",
      "dialogue:erika.victory.3",
      "dialogue:erika.victory.4",
    ],
    defeat: [
      "dialogue:erika.defeat.1",
      "dialogue:erika.defeat.2",
      "dialogue:erika.defeat.3",
      "dialogue:erika.defeat.4",
    ]
  },
  [TrainerType.JANINE]: {
    encounter: [
      "dialogue:janine.encounter.1",
      "dialogue:janine.encounter.2",
      "dialogue:janine.encounter.3",
    ],
    victory: [
      "dialogue:janine.victory.1",
      "dialogue:janine.victory.2",
      "dialogue:janine.victory.3",
    ],
    defeat: [
      "dialogue:janine.defeat.1",
      "dialogue:janine.defeat.2",
      "dialogue:janine.defeat.3",
    ]
  },
  [TrainerType.SABRINA]: {
    encounter: [
      "dialogue:sabrina.encounter.1",
      "dialogue:sabrina.encounter.2",
      "dialogue:sabrina.encounter.3",
    ],
    victory: [
      "dialogue:sabrina.victory.1",
      "dialogue:sabrina.victory.2",
      "dialogue:sabrina.victory.3",
    ],
    defeat: [
      "dialogue:sabrina.defeat.1",
      "dialogue:sabrina.defeat.2",
      "dialogue:sabrina.defeat.3",
    ]
  },
  [TrainerType.BLAINE]: {
    encounter: [
      "dialogue:blaine.encounter.1",
      "dialogue:blaine.encounter.2",
      "dialogue:blaine.encounter.3",
    ],
    victory: [
      "dialogue:blaine.victory.1",
      "dialogue:blaine.victory.2",
      "dialogue:blaine.victory.3",
    ],
    defeat: [
      "dialogue:blaine.defeat.1",
      "dialogue:blaine.defeat.2",
      "dialogue:blaine.defeat.3",
    ]
  },
  [TrainerType.GIOVANNI]: {
    encounter: [
      "dialogue:giovanni.encounter.1",
      "dialogue:giovanni.encounter.2",
      "dialogue:giovanni.encounter.3",
    ],
    victory: [
      "dialogue:giovanni.victory.1",
      "dialogue:giovanni.victory.2",
      "dialogue:giovanni.victory.3",
    ],
    defeat: [
      "dialogue:giovanni.defeat.1",
      "dialogue:giovanni.defeat.2",
      "dialogue:giovanni.defeat.3",
    ]
  },
  [TrainerType.LORELEI]: {
    encounter: [
      "dialogue:lorelei.encounter.1"
    ],
    victory: [
      "dialogue:lorelei.victory.1"
    ],
    defeat: [
      "dialogue:lorelei.defeat.1"
    ]
  },
  [TrainerType.BRUNO]: {
    encounter: [
      "dialogue:bruno.encounter.1"
    ],
    victory: [
      "dialogue:bruno.victory.1"
    ],
    defeat: [
      "dialogue:bruno.defeat.1"
    ]
  },
  [TrainerType.AGATHA]: {
    encounter: [
      "dialogue:agatha.encounter.1"
    ],
    victory: [
      "dialogue:agatha.victory.1"
    ],
    defeat: [
      "dialogue:agatha.defeat.1"
    ]
  },
  [TrainerType.LANCE]: {
    encounter: [
      "dialogue:lance.encounter.1",
      "dialogue:lance.encounter.2"
    ],
    victory: [
      "dialogue:lance.victory.1",
      "dialogue:lance.victory.2"
    ],
    defeat: [
      "dialogue:lance.defeat.1",
      "dialogue:lance.defeat.2"
    ]
  },
  [TrainerType.BLUE]: {
    encounter: [
      "dialogue:blue.encounter.1"
    ],
    victory: [
      "dialogue:blue.victory.1"
    ],
    defeat: [
      "dialogue:blue.defeat.1"
    ]
  },
  [TrainerType.RED]: {
    encounter: [
      "dialogue:red.encounter.1"
    ],
    victory: [
      "dialogue:red.victory.1"
    ],
    defeat: [
      "dialogue:red.defeat.1"
    ]
  },
  [TrainerType.RIVAL]: [
    {
      encounter: [
        "dialogue:rival.encounter.1",
      ],
      victory: [
        "dialogue:rival.victory.1",
      ],

    },
    {
      encounter: [
        "dialogue:rival_female.encounter.1",
      ],
      victory: [
        "dialogue:rival_female.victory.1",
      ]
    }
  ],
  [TrainerType.RIVAL_2]: [
    {
      encounter: [
        "dialogue:rival_2.encounter.1",
      ],
      victory: [
        "dialogue:rival_2.victory.1",
      ],

    },
    {
      encounter: [
        "dialogue:rival_2_female.encounter.1",
      ],
      victory: [
        "dialogue:rival_2_female.victory.1",
      ],
      defeat: [
        "dialogue:rival_2_female.defeat.1",
      ]
    },
  ],
  [TrainerType.RIVAL_3]: [
    {
      encounter: [
        "dialogue:rival_3.encounter.1",
      ],
      victory: [
        "dialogue:rival_3.victory.1",
      ]
    },
    {
      encounter: [
        "dialogue:rival_3_female.encounter.1",
      ],
      victory: [
        "dialogue:rival_3_female.victory.1",
      ],
      defeat: [
        "dialogue:rival_3_female.defeat.1",
      ]
    }
  ],
  [TrainerType.RIVAL_4]: [
    {
      encounter: [
        "dialogue:rival_4.encounter.1",
      ],
      victory: [
        "dialogue:rival_4.victory.1",
      ]
    },
    {
      encounter: [
        "dialogue:rival_4_female.encounter.1",
      ],
      victory: [
        "dialogue:rival_4_female.victory.1",
      ],
      defeat: [
        "dialogue:rival_4_female.defeat.1",
      ]
    }
  ],
  [TrainerType.RIVAL_5]: [
    {
      encounter: [
        "dialogue:rival_5.encounter.1",
      ],
      victory: [
        "dialogue:rival_5.victory.1",
      ]
    },
    {
      encounter: [
        "dialogue:rival_5_female.encounter.1",
      ],
      victory: [
        "dialogue:rival_5_female.victory.1",
      ],
      defeat: [
        "dialogue:rival_5_female.defeat.1",
      ]
    }
  ],
  [TrainerType.RIVAL_6]: [
    {
      encounter: [
        "dialogue:rival_6.encounter.1",
      ],
      victory: [
        "dialogue:rival_6.victory.1",
      ]
    },
    {
      encounter: [
        "dialogue:rival_6_female.encounter.1",
      ],
      victory: [
        "dialogue:rival_6_female.victory.1",
      ],
    }
  ]
};


export const doubleBattleDialogue = {
  "blue_red_double": {
    encounter: ["doubleBattleDialogue:blue_red_double.encounter.1"],
    victory: ["doubleBattleDialogue:blue_red_double.victory.1"]
  },
  "red_blue_double": {
    encounter: ["doubleBattleDialogue:red_blue_double.encounter.1"],
    victory: ["doubleBattleDialogue:red_blue_double.victory.1"]
  },
  "tate_liza_double": {
    encounter: ["doubleBattleDialogue:tate_liza_double.encounter.1"],
    victory: ["doubleBattleDialogue:tate_liza_double.victory.1"]
  },
  "liza_tate_double": {
    encounter: ["doubleBattleDialogue:liza_tate_double.encounter.1"],
    victory: [ "doubleBattleDialogue:liza_tate_double.victory.1"]
  },
  "wallace_steven_double": {
    encounter: [ "doubleBattleDialogue:wallace_steven_double.encounter.1"],
    victory: [ "doubleBattleDialogue:wallace_steven_double.victory.1"]
  },
  "steven_wallace_double": {
    encounter: [ "doubleBattleDialogue:steven_wallace_double.encounter.1"],
    victory: [ "doubleBattleDialogue:steven_wallace_double.victory.1"]
  },
  "alder_iris_double": {
    encounter: [ "doubleBattleDialogue:alder_iris_double.encounter.1"],
    victory: [ "doubleBattleDialogue:alder_iris_double.victory.1"]
  },
  "iris_alder_double": {
    encounter: [ "doubleBattleDialogue:iris_alder_double.encounter.1"],
    victory: [ "doubleBattleDialogue:iris_alder_double.victory.1"]
  },
  "marnie_piers_double": {
    encounter: [ "doubleBattleDialogue:marnie_piers_double.encounter.1"],
    victory: [ "doubleBattleDialogue:marnie_piers_double.victory.1"]
  },
  "piers_marnie_double": {
    encounter: [ "doubleBattleDialogue:piers_marnie_double.encounter.1"],
    victory: [ "doubleBattleDialogue:piers_marnie_double.victory.1"]
  },


};

export const battleSpecDialogue = {
  [BattleSpec.FINAL_BOSS]: {
    encounter: "battleSpecDialogue:encounter",
    firstStageWin: "battleSpecDialogue:firstStageWin",
    secondStageWin: "battleSpecDialogue:secondStageWin",
  }
};

export const miscDialogue = {
  ending: [
    "miscDialogue:ending",
    "miscDialogue:ending_female"
  ]
};

export function getCharVariantFromDialogue(message: string): string {
  const variantMatch = /@c\{(.*?)\}/.exec(message);
  if (variantMatch) {
    return variantMatch[1];
  }
  return "neutral";
}

export function initTrainerTypeDialogue(): void {
  const trainerTypes = Object.keys(trainerTypeDialogue).map(t => parseInt(t) as TrainerType);
  for (const trainerType of trainerTypes) {
    const messages = trainerTypeDialogue[trainerType];
    const messageTypes = ["encounter", "victory", "defeat"];
    for (const messageType of messageTypes) {
      if (Array.isArray(messages)) {
        if (messages[0][messageType]) {
          trainerConfigs[trainerType][`${messageType}Messages`] = messages[0][messageType];
        }
        if (messages.length > 1) {
          trainerConfigs[trainerType][`female${messageType.slice(0, 1).toUpperCase()}${messageType.slice(1)}Messages`] = messages[1][messageType];
        }
      } else {
        trainerConfigs[trainerType][`${messageType}Messages`] = messages[messageType];
      }
    }
  }
}
