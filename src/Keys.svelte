<!--<script>
  import * as Tone from "tone";
  import { SampleLibrary } from "../tonejs-instruments/Tonejs-Instruments.js";
  import { Loop, Player } from "tone";
  import { settings } from "./settings.js";
  import { playInstrumentAt } from "./engine";
  const { MAX_STEPS } = settings;

  var piano = SampleLibrary.load({
    instruments: "piano",
  });

  piano.toDestination();

  let tracks = {
    piano: { enabled: false, items: [] },
  };

  for (let index = 0; index < MAX_STEPS; index++) {
    Object.keys(tracks).forEach((key) => {
      tracks[key].items.push("");
    });
  }

  // schedule an event on the 16th measure
  Tone.Transport.scheduleRepeat((time) => {
    tickDrums(time);
  }, "16n");

  export function toggleTrack(trackName) {
    tracks[trackName].enabled = !tracks[trackName].enabled;
  }

  export function tickDrums(time) {
    playInstrumentAt(
      piano,
      [],
      [1],
      [0],
      time,
      "piano",
      false,
      tracks,
      "instrument"
    );
    tracks = tracks;
  }
</script>-->
