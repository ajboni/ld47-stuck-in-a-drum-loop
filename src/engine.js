import * as Tone from "tone";
import { Sampler } from "tone";

import { settings } from "./settings.js";
const { MAX_STEPS } = settings;

/**
 * @export
 * @param {Object} obj - An object.
 * @param {*} obj.instrument
 * @param {*} obj.bars
 * @param {*} obj.beats
 * @param {*} obj.sixteenths
 * @param {*} obj.time
 * @param {*} obj.trackName
 * @param {boolean} [obj.combine=false]
 * @param {*} obj.tracks
 * @param {'sample' | 'instrument'} obj.mode
 */
export function playInstrumentAt({
  instrument,
  bars,
  beats,
  sixteenths,
  time,
  trackName,
  combine = false,
  tracks,
  mode,
}) {
  const t = {
    bar: parseInt(Tone.Transport.position.split(":")[0]),
    beat: parseInt(Tone.Transport.position.split(":")[1]),
    sixteenth: parseInt(Tone.Transport.position.split(":")[2]),
  };
  let trackValue = "";
  let trackItem = tracks[trackName];

  if (bars === "*" || bars.length === 0) bars = [0, 1, 2, 3];
  if (beats === "*" || beats.length === 0) beats = [0, 1, 2, 3];
  if (sixteenths === "*" || sixteenths.length === 0) sixteenths = [0, 1, 2, 3];

  if (!combine && trackItem.items.length === MAX_STEPS) {
    trackItem.items.pop();
  }

  if (trackItem.enabled) {
    if (
      bars.includes(t.bar) &&
      beats.includes(t.beat) &&
      sixteenths.includes(t.sixteenth)
    ) {
      if (combine) {
        tracks[trackName].items[0] = "filled";
      }

      trackValue = "filled";

      if (mode === "instrument") instrument.triggerAttack("A3");
      if (mode === "sample") instrument.start(time);
    }
  }

  if (!combine) {
    trackItem.items = [trackValue, ...trackItem.items];
    tracks[trackName] = trackItem;
  }
}
