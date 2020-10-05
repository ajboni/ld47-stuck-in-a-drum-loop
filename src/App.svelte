<script>
  import { Loop, Player, Transport, start, Synth } from "tone";
  import Drums from "./Drums.svelte";
  //   import Keys from "./Keys.svelte";
  export const name = "";
  let t = "";

  Transport.loop = true;
  Transport.loopStart = "0:0:0";
  Transport.loopEnd = "4:0:0";

  //create a synth and connect it to the main output (your speakers)
  const synth = new Synth().toDestination();

  //play a middle 'C' for the duration of an 8th note
  synth.triggerAttackRelease("C4", "8n");

  let drumsCp;
  let keysCp;
</script>

<main>
  <h1>Stuck in a loop...</h1>
  {t}
  <button
    on:click={() => {
      Transport.start();
    }}>Start Engine</button>
  <button on:click={() => drumsCp.toggleTrack('kick')}>Bass Drum</button>
  <button on:click={() => drumsCp.toggleTrack('snare')}>Snare</button>
  <button on:click={() => drumsCp.toggleTrack('hats')}>Hats</button>
  <button on:click={() => drumsCp.toggleTrack('piano')}>Piano</button>
  c
  <Drums bind:this={drumsCp} />
  <!-- <Keys bind:this={keysCp} /> -->
</main>
