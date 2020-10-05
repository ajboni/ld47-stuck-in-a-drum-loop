<script>
  import { Loop, Player, Transport, start, Synth } from "tone";
  import {
    BPM,
    COLLECTED_PRIZES,
    gameState,
    GAME_RESULT,
    GAME_STARTED,
    restartGameState,
    settings,
    SHOW_END_MODAL,
    SHOW_MIXER,
  } from "./settings";
  import Drums from "./Drums.svelte";
  import Mixer from "./Mixer.svelte";
  import { Tone } from "tone/build/esm/core/Tone";
  import { writable } from "svelte/store";
  //   import Keys from "./Keys.svelte";

  var { GAME_MODE } = gameState;

  export let name = "";
  let t = "stopped";

  Transport.bpm.value = $BPM;
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

    if (GAME_MODE === "sandbox") {
    } else {
      //   drumsCp.toggleTrack("kick");
      Transport.start();
    }
  }

  function resetGame() {
    window.location.reload();
  }

  function endGame() {}

  function toggleSandboxMode() {
    if (GAME_MODE === "sandbox") GAME_MODE = "normal";
    else GAME_MODE = "sandbox";
  }

  function toggleMixer() {
    $SHOW_MIXER = !$SHOW_MIXER;
  }

  function setBPM(e) {
    $BPM = e.target.value;
    Transport.bpm.value = $BPM;
  }
</script>

<main>
  {#if $SHOW_END_MODAL}
    <div id="myModal" class="modal">
      <!-- Modal content -->
      <div class="modal-content">
		  <span class="close">&times;</span>
		  <h2>{$GAME_RESULT.outcome}</h2>
		  <p>Collected Drum Parts: {$COLLECTED_PRIZES}</p>
		  <br>
		  <button on:click={resetGame}>Try Again!</button>

		</div>
    </div>
  {/if}

  <h1>Stuck in a (drum) loop...</h1>
  <p>
    This game is an experiment done in 72hs for for Ludum Dare 47 game jam.
    Theme: Stuck in a loop.
    <br />
    The goal is to collect all drum parts (the purple blocks).
    <br />
    Each time a new drum part is collected its associated track starts playing
    and the beat gets faster.
    <br />
    Use Arrow Keys to move.
    <strong>Good Luck!</strong>
  </p>
  <div class="game-buttons">
    <button
      class:hidden={$GAME_STARTED}
      class="primary"
      on:click={startGame}>Start Game</button>
    <button on:click={toggleMixer}>Toggle Mixer</button>
    <button on:click={toggleSandboxMode}>Toggle Sandbox Mode</button>
  </div>
  <div class="info-bar">
    <span>Time: {t}</span>
    <span>BPM: {$BPM}</span>
    <span>Collected drum parts: {$COLLECTED_PRIZES}</span>
  </div>

  <div class:hidden={GAME_MODE !== 'sandbox'} class="sandbox-buttons">
    <button on:click={toggleTransport}>Play/Pause</button>
    <button on:click={() => drumsCp.toggleAllTracks()}>Play All</button>
    <button on:click={() => drumsCp.toggleTrack('kick')}>Bass Drum</button>
    <button on:click={() => drumsCp.toggleTrack('snare')}>Snare</button>
    <button on:click={() => drumsCp.toggleTrack('hats')}>Hats</button>
    <button on:click={() => drumsCp.toggleTrack('bongo')}>Bongo</button>
    <button on:click={() => drumsCp.toggleTrack('maracas')}>Maracas</button>
    <button on:click={() => drumsCp.toggleTrack('cymbals')}>Cymbals</button>
    <button on:click={() => drumsCp.toggleTrack('cowbell')}>Cowbell</button>
    BPM
    <input on:change={setBPM} />
  </div>
  <Drums bind:this={drumsCp} />
  <!-- <Keys bind:this={keysCp} /> -->
</main>
