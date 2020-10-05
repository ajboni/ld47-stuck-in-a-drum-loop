<script>
  import { Channel } from "tone";

  export let channels;
  console.log(channels.kick.volume.value);

  export function sliderChange(e) {}
</script>

<style>
  /* your styles go here */
</style>

<!-- markup (zero or more items) goes here -->
<h1>Mixer</h1>
Kick Drum
<input type="range" min="-50" max="0" value=".6" class="slider" />

{#each Object.keys(channels) as key}
  <div class="mixer-channel-container">
    <div>{key}</div>
    <input
      type="range"
      min="-50"
      max="0"
      bind:value={channels[key].volume.value}
      class="slider" />
  </div>
{/each}
