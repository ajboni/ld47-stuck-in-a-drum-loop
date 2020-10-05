<script>
  import { Channel, Loop, Player, Transport } from "tone";
  import { settings } from "./settings.js";
  import { playInstrumentAt } from "./engine";
  import { Tone } from "tone/build/esm/core/Tone";
  import MixerWidget from "./Mixer.svelte";

  const Mixer = {
    kick: new Channel(-6, 0).toDestination(),
    hats: new Channel(-6, 0),
    snare: new Channel(-6, 0),
    bongo: new Channel(-6, 0),
    cymbals: new Channel(-6, 0),
    cowbell: new Channel(-6, 0),
  };

  const kick = new Player("snd/kick.wav").connect(Mixer.kick.input);
  const kick2 = new Player("snd/kick.wav").connect(Mixer.kick.input);
  const kick3 = new Player("snd/kick.wav").connect(Mixer.kick.input);
  const hats = new Player("snd/hats.wav").toDestination();
  const hats2 = new Player("snd/hats.wav").toDestination();
  const snare = new Player("snd/snare.wav").toDestination();
  const bongo1 = new Player("snd/bongo1.wav").toDestination();
  const bongo2 = new Player("snd/bongo2.wav").toDestination();
  const bongo3 = new Player("snd/bongo3.wav").toDestination();
  const bongo4 = new Player("snd/bongo4.wav").toDestination();
  const crash = new Player("snd/crash.wav").toDestination();
  const cowbell = new Player("snd/cowbell.wav").toDestination();
  const { MAX_STEPS } = settings;

  let tracks = {
    kick: { channel: Mixer.kick, enabled: false, items: [] },
    hats: { enabled: false, items: [] },
    snare: { enabled: false, items: [] },
    bongo: { enabled: false, items: [] },
    cymbals: { enabled: false, items: [] },
    cowbell: { enabled: false, items: [] },
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
    console.log(Mixer.kick.volume.value);
    Mixer.kick.volume.value -= 1;
  }

  export function toggleAllTracks() {
    Object.keys(tracks).forEach((key) => {
      tracks[key].enabled = !tracks[key].enabled;
    });
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
      instrument: kick2,
      bars: [],
      beats: [0, 2],
      sixteenths: [0],
      time: time,
      trackName: "kick",
      mode: "sample",
      tracks: tracks,
      combine: true,
    });

    playInstrumentAt({
      instrument: kick3,
      bars: [1, 3],
      beats: [1],
      sixteenths: [1],
      time: time,
      trackName: "kick",
      mode: "sample",
      tracks: tracks,
      combine: true,
    });

    playInstrumentAt({
      instrument: kick,
      bars: [3],
      beats: [2],
      sixteenths: [3],
      time: time,
      trackName: "kick",
      mode: "sample",
      tracks: tracks,
      combine: true,
    });

    playInstrumentAt({
      instrument: hats,
      bars: [3],
      beats: [0, 2],
      sixteenths: [2],
      time: time,
      trackName: "hats",
      mode: "sample",
      tracks: tracks,
      combine: false,
    });

    playInstrumentAt({
      instrument: hats,
      bars: [],
      beats: [1, 3],
      sixteenths: [2],
      time: time,
      trackName: "hats",
      mode: "sample",
      tracks: tracks,
      combine: true,
    });

    playInstrumentAt({
      instrument: snare,
      bars: [],
      beats: [1, 3],
      sixteenths: [0],
      time: time,
      trackName: "snare",
      mode: "sample",
      tracks: tracks,
      combine: false,
    });

    playInstrumentAt({
      instrument: [bongo1, bongo2, bongo3, bongo4, null],
      bars: [],
      beats: [1, 2],
      sixteenths: [0, 1, 3],
      time: time,
      trackName: "bongo",
      mode: "sample",
      tracks: tracks,
      combine: false,
    });

    playInstrumentAt({
      instrument: crash,
      bars: [0],
      beats: [0],
      sixteenths: [0],
      time: time,
      trackName: "cymbals",
      mode: "sample",
      tracks: tracks,
      combine: false,
    });

    playInstrumentAt({
      instrument: cowbell,
      bars: [1, 3],
      beats: [1],
      sixteenths: [1, 2, 3],
      time: time,
      trackName: "cowbell",
      mode: "sample",
      tracks: tracks,
      combine: false,
    });

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

<MixerWidget channels={Mixer} />
