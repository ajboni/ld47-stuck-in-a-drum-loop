<script>
  import { Loop, Player, Transport, start, Synth } from "tone";
  import Drums from "./Drums.svelte";
  //   import Keys from "./Keys.svelte";
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
</script>

<main>
  <h1>Stuck in a loop...</h1>
  {t}
  <button on:click={toggleTransport}>Play/Pause</button>
  <button on:click={() => drumsCp.toggleAllTracks()}>Play All</button>
  <button on:click={() => drumsCp.toggleTrack('kick')}>Bass Drum</button>
  <button on:click={() => drumsCp.toggleTrack('snare')}>Snare</button>
  <button on:click={() => drumsCp.toggleTrack('hats')}>Hats</button>
  <button on:click={() => drumsCp.toggleTrack('bongo')}>Bongo</button>
  <button on:click={() => drumsCp.toggleTrack('cymbals')}>Cymbals</button>
  <button on:click={() => drumsCp.toggleTrack('piano')}>Piano</button>

  <Drums bind:this={drumsCp} />
  <!-- <Keys bind:this={keysCp} /> -->
</main>
