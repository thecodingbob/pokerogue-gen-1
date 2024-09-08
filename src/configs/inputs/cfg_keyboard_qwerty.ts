import {Button} from "#enums/buttons";
import {SettingKeyboard} from "#app/system/settings/settings-keyboard";

const cfg_keyboard_qwerty = {
  padID: "default",
  padType: "keyboard",
  deviceMapping: {
    KEY_A: Phaser.Input.Keyboard.KeyCodes.A,
    KEY_B: Phaser.Input.Keyboard.KeyCodes.B,
    KEY_C: Phaser.Input.Keyboard.KeyCodes.C,
    KEY_D: Phaser.Input.Keyboard.KeyCodes.D,
    KEY_E: Phaser.Input.Keyboard.KeyCodes.E,
    KEY_F: Phaser.Input.Keyboard.KeyCodes.F,
    KEY_G: Phaser.Input.Keyboard.KeyCodes.G,
    KEY_H: Phaser.Input.Keyboard.KeyCodes.H,
    KEY_I: Phaser.Input.Keyboard.KeyCodes.I,
    KEY_J: Phaser.Input.Keyboard.KeyCodes.J,
    KEY_K: Phaser.Input.Keyboard.KeyCodes.K,
    KEY_L: Phaser.Input.Keyboard.KeyCodes.L,
    KEY_M: Phaser.Input.Keyboard.KeyCodes.M,
    KEY_N: Phaser.Input.Keyboard.KeyCodes.N,
    KEY_O: Phaser.Input.Keyboard.KeyCodes.O,
    KEY_P: Phaser.Input.Keyboard.KeyCodes.P,
    KEY_Q: Phaser.Input.Keyboard.KeyCodes.Q,
    KEY_R: Phaser.Input.Keyboard.KeyCodes.R,
    KEY_S: Phaser.Input.Keyboard.KeyCodes.S,
    KEY_T: Phaser.Input.Keyboard.KeyCodes.T,
    KEY_U: Phaser.Input.Keyboard.KeyCodes.U,
    KEY_V: Phaser.Input.Keyboard.KeyCodes.V,
    KEY_W: Phaser.Input.Keyboard.KeyCodes.W,
    KEY_X: Phaser.Input.Keyboard.KeyCodes.X,
    KEY_Y: Phaser.Input.Keyboard.KeyCodes.Y,
    KEY_Z: Phaser.Input.Keyboard.KeyCodes.Z,
    KEY_0: Phaser.Input.Keyboard.KeyCodes.ZERO,
    KEY_1: Phaser.Input.Keyboard.KeyCodes.ONE,
    KEY_2: Phaser.Input.Keyboard.KeyCodes.TWO,
    KEY_3: Phaser.Input.Keyboard.KeyCodes.THREE,
    KEY_4: Phaser.Input.Keyboard.KeyCodes.FOUR,
    KEY_5: Phaser.Input.Keyboard.KeyCodes.FIVE,
    KEY_6: Phaser.Input.Keyboard.KeyCodes.SIX,
    KEY_7: Phaser.Input.Keyboard.KeyCodes.SEVEN,
    KEY_8: Phaser.Input.Keyboard.KeyCodes.EIGHT,
    KEY_9: Phaser.Input.Keyboard.KeyCodes.NINE,
    KEY_CTRL: Phaser.Input.Keyboard.KeyCodes.CTRL,
    KEY_DEL: Phaser.Input.Keyboard.KeyCodes.DELETE,
    KEY_END: Phaser.Input.Keyboard.KeyCodes.END,
    KEY_ENTER: Phaser.Input.Keyboard.KeyCodes.ENTER,
    KEY_ESC: Phaser.Input.Keyboard.KeyCodes.ESC,
    KEY_F1: Phaser.Input.Keyboard.KeyCodes.F1,
    KEY_F2: Phaser.Input.Keyboard.KeyCodes.F2,
    KEY_F3: Phaser.Input.Keyboard.KeyCodes.F3,
    KEY_F4: Phaser.Input.Keyboard.KeyCodes.F4,
    KEY_F5: Phaser.Input.Keyboard.KeyCodes.F5,
    KEY_F6: Phaser.Input.Keyboard.KeyCodes.F6,
    KEY_F7: Phaser.Input.Keyboard.KeyCodes.F7,
    KEY_F8: Phaser.Input.Keyboard.KeyCodes.F8,
    KEY_F9: Phaser.Input.Keyboard.KeyCodes.F9,
    KEY_F10: Phaser.Input.Keyboard.KeyCodes.F10,
    KEY_F11: Phaser.Input.Keyboard.KeyCodes.F11,
    KEY_F12: Phaser.Input.Keyboard.KeyCodes.F12,
    KEY_HOME: Phaser.Input.Keyboard.KeyCodes.HOME,
    KEY_INSERT: Phaser.Input.Keyboard.KeyCodes.INSERT,
    KEY_PAGE_DOWN: Phaser.Input.Keyboard.KeyCodes.PAGE_DOWN,
    KEY_PAGE_UP: Phaser.Input.Keyboard.KeyCodes.PAGE_UP,
    KEY_PLUS: Phaser.Input.Keyboard.KeyCodes.NUMPAD_ADD, // Assuming numpad plus
    KEY_MINUS: Phaser.Input.Keyboard.KeyCodes.NUMPAD_SUBTRACT, // Assuming numpad minus
    KEY_QUOTATION: Phaser.Input.Keyboard.KeyCodes.QUOTES,
    KEY_SHIFT: Phaser.Input.Keyboard.KeyCodes.SHIFT,
    KEY_SPACE: Phaser.Input.Keyboard.KeyCodes.SPACE,
    KEY_TAB: Phaser.Input.Keyboard.KeyCodes.TAB,
    KEY_TILDE: Phaser.Input.Keyboard.KeyCodes.BACKTICK,
    KEY_ARROW_UP: Phaser.Input.Keyboard.KeyCodes.UP,
    KEY_ARROW_DOWN: Phaser.Input.Keyboard.KeyCodes.DOWN,
    KEY_ARROW_LEFT: Phaser.Input.Keyboard.KeyCodes.LEFT,
    KEY_ARROW_RIGHT: Phaser.Input.Keyboard.KeyCodes.RIGHT,
    KEY_LEFT_BRACKET: Phaser.Input.Keyboard.KeyCodes.OPEN_BRACKET,
    KEY_RIGHT_BRACKET: Phaser.Input.Keyboard.KeyCodes.CLOSED_BRACKET,
    KEY_SEMICOLON: Phaser.Input.Keyboard.KeyCodes.SEMICOLON,
    KEY_BACKSPACE: Phaser.Input.Keyboard.KeyCodes.BACKSPACE,
    KEY_ALT: Phaser.Input.Keyboard.KeyCodes.ALT
  },
  icons: {
    KEY_A: "A.png",
    KEY_B: "B.png",
    KEY_C: "C.png",
    KEY_D: "D.png",
    KEY_E: "E.png",
    KEY_F: "F.png",
    KEY_G: "G.png",
    KEY_H: "H.png",
    KEY_I: "I.png",
    KEY_J: "J.png",
    KEY_K: "K.png",
    KEY_L: "L.png",
    KEY_M: "M.png",
    KEY_N: "N.png",
    KEY_O: "O.png",
    KEY_P: "P.png",
    KEY_Q: "Q.png",
    KEY_R: "R.png",
    KEY_S: "S.png",
    KEY_T: "T.png",
    KEY_U: "U.png",
    KEY_V: "V.png",
    KEY_W: "W.png",
    KEY_X: "X.png",
    KEY_Y: "Y.png",
    KEY_Z: "Z.png",

    KEY_0: "0.png",
    KEY_1: "1.png",
    KEY_2: "2.png",
    KEY_3: "3.png",
    KEY_4: "4.png",
    KEY_5: "5.png",
    KEY_6: "6.png",
    KEY_7: "7.png",
    KEY_8: "8.png",
    KEY_9: "9.png",

    KEY_F1: "F1.png",
    KEY_F2: "F2.png",
    KEY_F3: "F3.png",
    KEY_F4: "F4.png",
    KEY_F5: "F5.png",
    KEY_F6: "F6.png",
    KEY_F7: "F7.png",
    KEY_F8: "F8.png",
    KEY_F9: "F9.png",
    KEY_F10: "F10.png",
    KEY_F11: "F11.png",
    KEY_F12: "F12.png",


    KEY_PAGE_DOWN: "PAGE_DOWN.png",
    KEY_PAGE_UP: "PAGE_UP.png",

    KEY_CTRL: "CTRL.png",
    KEY_DEL: "DEL.png",
    KEY_END: "END.png",
    KEY_ENTER: "ENTER.png",
    KEY_ESC: "ESC.png",
    KEY_HOME: "HOME.png",
    KEY_INSERT: "INS.png",

    KEY_PLUS: "PLUS.png",
    KEY_MINUS: "MINUS.png",
    KEY_QUOTATION: "QUOTE.png",
    KEY_SHIFT: "SHIFT.png",

    KEY_SPACE: "SPACE.png",
    KEY_TAB: "TAB.png",
    KEY_TILDE: "TILDE.png",

    KEY_ARROW_UP: "KEY_ARROW_UP.png",
    KEY_ARROW_DOWN: "KEY_ARROW_DOWN.png",
    KEY_ARROW_LEFT: "KEY_ARROW_LEFT.png",
    KEY_ARROW_RIGHT: "KEY_ARROW_RIGHT.png",

    KEY_LEFT_BRACKET: "LEFT_BRACKET.png",
    KEY_RIGHT_BRACKET: "RIGHT_BRACKET.png",

    KEY_SEMICOLON: "SEMICOLON.png",

    KEY_BACKSPACE: "BACK.png",
    KEY_ALT: "ALT.png"
  },
  settings: {
    [SettingKeyboard.Button_Up]: Button.UP,
    [SettingKeyboard.Button_Down]: Button.DOWN,
    [SettingKeyboard.Button_Left]: Button.LEFT,
    [SettingKeyboard.Button_Right]: Button.RIGHT,
    [SettingKeyboard.Button_Submit]: Button.SUBMIT,
    [SettingKeyboard.Button_Action]: Button.ACTION,
    [SettingKeyboard.Button_Cancel]: Button.CANCEL,
    [SettingKeyboard.Button_Menu]: Button.MENU,
    [SettingKeyboard.Button_Stats]: Button.STATS,
    [SettingKeyboard.Button_Cycle_Shiny]: Button.CYCLE_SHINY,
    [SettingKeyboard.Button_Cycle_Form]: Button.CYCLE_FORM,
    [SettingKeyboard.Button_Cycle_Gender]: Button.CYCLE_GENDER,
    [SettingKeyboard.Button_Cycle_Variant]: Button.V,
    [SettingKeyboard.Button_Speed_Up]: Button.SPEED_UP,
    [SettingKeyboard.Button_Slow_Down]: Button.SLOW_DOWN,
    [SettingKeyboard.Alt_Button_Up]: Button.UP,
    [SettingKeyboard.Alt_Button_Down]: Button.DOWN,
    [SettingKeyboard.Alt_Button_Left]: Button.LEFT,
    [SettingKeyboard.Alt_Button_Right]: Button.RIGHT,
    [SettingKeyboard.Alt_Button_Submit]: Button.SUBMIT,
    [SettingKeyboard.Alt_Button_Action]: Button.ACTION,
    [SettingKeyboard.Alt_Button_Cancel]: Button.CANCEL,
    [SettingKeyboard.Alt_Button_Menu]: Button.MENU,
    [SettingKeyboard.Alt_Button_Stats]: Button.STATS,
    [SettingKeyboard.Alt_Button_Cycle_Shiny]: Button.CYCLE_SHINY,
    [SettingKeyboard.Alt_Button_Cycle_Form]: Button.CYCLE_FORM,
    [SettingKeyboard.Alt_Button_Cycle_Gender]: Button.CYCLE_GENDER,
    [SettingKeyboard.Alt_Button_Cycle_Variant]: Button.V,
    [SettingKeyboard.Alt_Button_Speed_Up]: Button.SPEED_UP,
    [SettingKeyboard.Alt_Button_Slow_Down]: Button.SLOW_DOWN,
  },
  default: {
    KEY_ARROW_UP: SettingKeyboard.Button_Up,
    KEY_ARROW_DOWN: SettingKeyboard.Button_Down,
    KEY_ARROW_LEFT: SettingKeyboard.Button_Left,
    KEY_ARROW_RIGHT: SettingKeyboard.Button_Right,
    KEY_ENTER: SettingKeyboard.Button_Submit,
    KEY_SPACE: SettingKeyboard.Button_Action,
    KEY_BACKSPACE: SettingKeyboard.Button_Cancel,
    KEY_ESC: SettingKeyboard.Button_Menu,
    KEY_C: SettingKeyboard.Button_Stats,
    KEY_R: SettingKeyboard.Button_Cycle_Shiny,
    KEY_F: SettingKeyboard.Button_Cycle_Form,
    KEY_G: SettingKeyboard.Button_Cycle_Gender,
    KEY_V: SettingKeyboard.Button_Cycle_Variant,
    KEY_PLUS: -1,
    KEY_MINUS: -1,
    KEY_A: SettingKeyboard.Alt_Button_Left,
    KEY_B: -1,
    KEY_D: SettingKeyboard.Alt_Button_Right,
    KEY_H: -1,
    KEY_I: -1,
    KEY_J: -1,
    KEY_K: -1,
    KEY_L: -1,
    KEY_M: SettingKeyboard.Alt_Button_Menu,
    KEY_O: -1,
    KEY_P: -1,
    KEY_Q: -1,
    KEY_S: SettingKeyboard.Alt_Button_Down,
    KEY_T: SettingKeyboard.Alt_Button_Cycle_Form,
    KEY_U: -1,
    KEY_W: SettingKeyboard.Alt_Button_Up,
    KEY_X: SettingKeyboard.Alt_Button_Cancel,
    KEY_Y: SettingKeyboard.Alt_Button_Cycle_Shiny,
    KEY_Z: SettingKeyboard.Alt_Button_Action,
    KEY_0: -1,
    KEY_1: -1,
    KEY_2: -1,
    KEY_3: -1,
    KEY_4: -1,
    KEY_5: -1,
    KEY_6: -1,
    KEY_7: -1,
    KEY_8: -1,
    KEY_9: -1,
    KEY_CTRL: -1,
    KEY_DEL: -1,
    KEY_END: -1,
    KEY_F1: -1,
    KEY_F2: -1,
    KEY_F3: -1,
    KEY_F4: -1,
    KEY_F5: -1,
    KEY_F6: -1,
    KEY_F7: -1,
    KEY_F8: -1,
    KEY_F9: -1,
    KEY_F10: -1,
    KEY_F11: -1,
    KEY_F12: -1,
    KEY_HOME: -1,
    KEY_INSERT: -1,
    KEY_PAGE_DOWN: SettingKeyboard.Button_Slow_Down,
    KEY_PAGE_UP: SettingKeyboard.Button_Speed_Up,
    KEY_QUOTATION: -1,
    KEY_SHIFT: SettingKeyboard.Alt_Button_Stats,
    KEY_TAB: -1,
    KEY_TILDE: -1,
    KEY_LEFT_BRACKET: -1,
    KEY_RIGHT_BRACKET: -1,
    KEY_SEMICOLON: -1,
    KEY_ALT: -1
  },
  blacklist: [
    "KEY_ENTER",
    "KEY_ESC",
    "KEY_SPACE",
    "KEY_BACKSPACE",
    "KEY_ARROW_UP",
    "KEY_ARROW_DOWN",
    "KEY_ARROW_LEFT",
    "KEY_ARROW_RIGHT",
    "KEY_DEL",
    "KEY_HOME",
  ]
};

export default cfg_keyboard_qwerty;
