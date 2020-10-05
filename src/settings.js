import { writable } from "svelte/store";

export var settings = {
  MAX_STEPS: 64,
};

export var gameState = {
  STARTED: false,
  GAME_MODE: "normal",
  COLLECTED_PRIZES: 0,
};

export let SHOW_MIXER = writable(false);

export function restartGameState() {
  gameState.COLLECTED_PRIZES = 0;
}
