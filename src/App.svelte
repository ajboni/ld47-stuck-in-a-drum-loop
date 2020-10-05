<script>
  import { Loop, Player, Transport, start, Synth } from "tone";
  import {
    gameState,
    restartGameState,
    settings,
    SHOW_MIXER,
  } from "./settings";
  import Drums from "./Drums.svelte";
  import Mixer from "./Mixer.svelte";
  import { Tone } from "tone/build/esm/core/Tone";
  import { writable } from "svelte/store";
  //   import Keys from "./Keys.svelte";

  var { GAME_MODE, COLLECTED_PRIZES, STARTED } = gameState;

  export const name = "";
  let t = "stopped";

  Transport.loop = true;
  Transport.loopStart = "0:0:0";
  Transport.loopEnd = "4:0:0";

  let drumsCp;
  let keysCp;

  // schedule an event on the 16th measure
  Transport.scheduleRepeat((time) => {
    t = Transport.position;
  }, "16n");

  function toggleTransport() {
    if (Transport.state !== "started") {
      Transport.start();
    } else {
      Transport.pause();
    }
  }

  function startGame() {
    start();
    restartGameState();
    STARTED = true;
    if (GAME_MODE === "sandbox") {
    } else {
      drumsCp.toggleTrack("kick");
      Transport.start();
    }
  }

  function resetGame() {}

  function endGame() {}

  function toggleSandboxMode() {
    if (GAME_MODE === "sandbox") GAME_MODE = "normal";
    else GAME_MODE = "sandbox";
  }

  function toggleMixer() {
    $SHOW_MIXER = !$SHOW_MIXER;
  }
</script>

<main>
  <h1>Stuck in a loop...</h1>
  <div class="game-buttons">
    <button class:hidden={STARTED} on:click={startGame}>Start Game</button>
    <button on:click={toggleMixer}>Toggle Mixer</button>
    <button on:click={toggleSandboxMode}>Toggle Sandbox Mode</button>
  </div>
  <div class="info-bar">
    <span>Time: {t}</span>
    <span>Collected Prizes: {COLLECTED_PRIZES}</span>
  </div>

  <div class:hidden={GAME_MODE !== 'sandbox'}>
    <button on:click={toggleTransport}>Play/Pause</button>
    <button on:click={() => drumsCp.toggleAllTracks()}>Play All</button>
    <button on:click={() => drumsCp.toggleTrack('kick')}>Bass Drum</button>
    <button on:click={() => drumsCp.toggleTrack('snare')}>Snare</button>
    <button on:click={() => drumsCp.toggleTrack('hats')}>Hats</button>
    <button on:click={() => drumsCp.toggleTrack('bongo')}>Bongo</button>
    <button on:click={() => drumsCp.toggleTrack('maracas')}>Maracas</button>
    <button on:click={() => drumsCp.toggleTrack('cymbals')}>Cymbals</button>
    <button on:click={() => drumsCp.toggleTrack('cowbell')}>Cowbell</button>
  </div>
  <Drums bind:this={drumsCp} settings />
  <!-- <Keys bind:this={keysCp} /> -->
</main>
