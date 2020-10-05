<script>
  import { Channel } from "tone";
  import { SHOW_MIXER } from "./settings.js";
  export let channels;
  export function sliderChange(e) {}
</script>

<style>
  /* your styles go here */
</style>

<!-- markup (zero or more items) goes here -->
{#if $SHOW_MIXER}
  <h1>Mixer</h1>
  {#each Object.keys(channels) as key}
    <div class="mixer-channel-container">
      <div>{key}</div>
      <div class="mixer-channel-sliders">
        <input
          type="range"
          min="-50"
          max="0"
          bind:value={channels[key].volume.value}
          step="0.1"
          class="slider" />
        <div class="value">{channels[key].volume.value.toFixed(2)}</div>
        <input
          type="range"
          min="-1"
          max="1"
          bind:value={channels[key].pan.value}
          step="0.1"
          class="slider pan" />
        <div class="value">{channels[key].pan.value.toFixed(2)}</div>
      </div>
    </div>
  {/each}
{/if}
