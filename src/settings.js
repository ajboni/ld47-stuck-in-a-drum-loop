import { get, writable } from "svelte/store";
import * as Tone from "tone";
export var settings = {
  MAX_STEPS: 64,
};

export var gameState = {
  GAME_MODE: "normal",
  TOTAL_TRACKS: 0,
};

export let GAME_STARTED = writable(false);
export let SHOW_MIXER = writable(false);
export let COLLECTED_PRIZES = writable(0);
export let SHOW_END_MODAL = writable(false);
export let GAME_RESULT = writable({
  outcome: "YOU LOSE!",
  collectedPrizes: 0,
});

export let DARK_MODE = writable(true);
export let BPM = writable(100);

export function restartGameState() {
  gameState.COLLECTED_PRIZES = 0;
  GAME_STARTED.set(true);
}

export function endGame(result) {
  SHOW_END_MODAL.set(true);
  let outcome = "YOU LOSE!";
  if (get(COLLECTED_PRIZES) === gameState.TOTAL_TRACKS) {
    outcome = "YOU WIN";
  }

  GAME_RESULT.set({
    outcome: outcome,
    collectedPrizes: get(COLLECTED_PRIZES),
  });

  if (result !== "win") {
    Tone.Transport.pause();
  }
  GAME_STARTED.set(false);
}
