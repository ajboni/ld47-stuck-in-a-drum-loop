<script>
  import { Loop, Player, Transport } from "tone";
  import { settings } from "./settings.js";
  import { playInstrumentAt } from "./engine";
  import { tick } from "svelte";

  const kick = new Player("snd/kick.wav").toDestination();
  const kick2 = new Player("snd/kick.wav").toDestination();
  const kick3 = new Player("snd/kick.wav").toDestination();
  const hats = new Player("snd/hats.wav").toDestination();
  const hats2 = new Player("snd/hats.wav").toDestination();
  const snare = new Player("snd/snare.wav").toDestination();
  const { MAX_STEPS } = settings;

  let tracks = {
    kick: { enabled: false, items: [] },
    hats: { enabled: false, items: [] },
    snare: { enabled: false, items: [] },
  };

  for (let index = 0; index < MAX_STEPS; index++) {
    Object.keys(tracks).forEach((key) => {
      tracks[key].items.push("");
    });
  }

  // schedule an event on the 16th measure
  Transport.scheduleRepeat((time) => {
    tickDrums(time);
  }, "16n");

  export function toggleTrack(trackName) {
    tracks[trackName].enabled = !tracks[trackName].enabled;
  }

  export function tickDrums(time) {
    playInstrumentAt({
      instrument: kick,
      bars: [],
      beats: [0, 2],
      sixteenths: [0],
      time: time,
      trackName: "kick",
      mode: "sample",
      tracks: tracks,
      combine: false,
    });

    playInstrumentAt({
      instrument: kick,
      bars: [],
      beats: [0, 2],
      sixteenths: [0],
      time: time,
      trackName: "kick",
      mode: "sample",
      tracks: tracks,
      combine: true,
    });

    playInstrumentAt(kick2, [1, 3], [1], [1], time, "kick", true, tracks);
    playInstrumentAt(kick3, [3], [2], [3], time, "kick", true, tracks);
    playInstrumentAt(hats, [], [0, 2], [2], time, "hats", false, tracks);
    playInstrumentAt(hats2, [], [1, 3], [2], time, "hats", true, tracks);
    playInstrumentAt(snare, [], [1, 3], [0], time, "snare", false, tracks);
    tracks = tracks;
  }
</script>

<h1>Drums</h1>

{#each Object.values(tracks) as item}
  <div class="track">
    {#each item.items as i}
      <div class="track-item {i}" />
    {/each}
  </div>
{/each}
