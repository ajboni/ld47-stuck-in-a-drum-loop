<script>
  import { Channel, Loop, Player, Transport } from "tone";
  import {
    BPM,
    COLLECTED_PRIZES,
    endGame,
    gameState,
    GAME_STARTED,
    settings,
  } from "./settings.js";
  import { playInstrumentAt } from "./engine";
  import { Tone } from "tone/build/esm/core/Tone";
  import MixerWidget from "./Mixer.svelte";

  var qeuedPlayerMovement = "";

  document.onkeydown = processKey;
  function processKey(e) {
    if (!$GAME_STARTED) return;
    e = e || window.event;
    if (e.keyCode == "38") {
      // up arrow
      qeuedPlayerMovement = "up";
    } else if (e.keyCode == "40") {
      // down arrow
      qeuedPlayerMovement = "down";
    } else if (e.keyCode == "37") {
      qeuedPlayerMovement = "left";

      // left arrow
    } else if (e.keyCode == "39") {
      qeuedPlayerMovement = "right";
    }
  }

  const Mixer = {
    kick: new Channel(-6, 0).toDestination(),
    snare: new Channel(-2, 0.2).toDestination(),
    bongo: new Channel(0, -0.5).toDestination(),
    hats: new Channel(-6, -0.2).toDestination(),
    maracas: new Channel(-10, 0.5).toDestination(),
    cymbals: new Channel(-10, -0.8).toDestination(),
    cowbell: new Channel(-20, 0.5).toDestination(),
  };

  const kick = new Player("snd/kick.wav").connect(Mixer.kick.input);
  const kick2 = new Player("snd/kick.wav").connect(Mixer.kick.input);
  const kick3 = new Player("snd/kick.wav").connect(Mixer.kick.input);
  const hats = new Player("snd/hats.wav").connect(Mixer.hats.input);
  const maracas = new Player("snd/maraca.wav").connect(Mixer.maracas.input);
  const cowbell = new Player("snd/cowbell.wav").connect(Mixer.cowbell.input);
  const snare = new Player("snd/snare.wav").connect(Mixer.snare.input);
  const bongo1 = new Player("snd/bongo1.wav").connect(Mixer.bongo.input);
  const bongo2 = new Player("snd/bongo2.wav").connect(Mixer.bongo.input);
  const bongo3 = new Player("snd/bongo3.wav").connect(Mixer.bongo.input);
  const bongo4 = new Player("snd/bongo4.wav").connect(Mixer.bongo.input);
  const crash = new Player("snd/crash.wav").connect(Mixer.cymbals.input);
  const triangle = new Player("snd/triangle.wav").connect(Mixer.cymbals.input);
  const bell = new Player("snd/bell.wav").connect(Mixer.cymbals.input);
  const ride = new Player("snd/ride.wav").connect(Mixer.cymbals.input);

  const { MAX_STEPS } = settings;

  export let tracks = {
    prizes: { enabled: false, items: [] },
    snare: { enabled: false, items: [], icon: "s" },
    bongo: { enabled: false, items: [], icon: "b" },
    hats: { enabled: false, items: [], icon: "hh" },
    kick: { channel: Mixer.kick, enabled: false, items: [], icon: "k" },

    maracas: { enabled: false, items: [], icon: "m" },
    cymbals: { enabled: false, items: [], icon: "c" },
    cowbell: { enabled: false, items: [], icon: "cb" },
    player: { enabled: false, items: [], icon: "X" },
  };

  //   substract pkayer and prize track
  gameState.TOTAL_TRACKS = Object.keys(tracks).length - 2;

  /* Initialize Tracks */
  for (let index = 0; index < MAX_STEPS; index++) {
    Object.keys(tracks).forEach((key) => {
      tracks[key].items.push({
        class: "",
        hasPlayer: false,
        hasPrize: false,
        prizeIcon: null,
      });
    });
  }

  /* Prizes */
  const prizes = Object.keys(tracks).filter(
    (x) => x !== "player" && x !== "prizes"
  );

  prizes.forEach((prize) => {
    placePrize(prize);
  });

  tracks.prizes.items.forEach((i) => {
    if (!i.hasPrize) {
      i.class = "wall";
    }
  });

  function placePrize(prize) {
    const index = randomRange(2, MAX_STEPS - 2);

    if (!tracks.prizes.items[index]) placePrize(prize);
    if (tracks.prizes.items[index].hasPrize) placePrize(prize);
    else {
      tracks.prizes.items[index].hasPrize = true;
      tracks.prizes.items[index].prizeIcon = tracks[prize].icon;
      tracks.prizes.items[index].prizeName = prize;
    }
  }

  const player = {
    position: {
      track: Object.keys(tracks).length - 1,
      step: MAX_STEPS / 2,
    },
  };

  function movePlayer(direction) {
    if (!$GAME_STARTED) return;
    if (direction) console.log(direction);

    if (direction === "left") {
      if (!getTrackStepFromPlayer(-1)) return;
      if (getTrackStepFromPlayer(-1).class === "wall") return;
      if (player.position.step > 1) {
        getTrackStepFromPlayer().hasPlayer = false;

        player.position.step -= 1;
      }
    }

    if (direction === "right") {
      if (!getTrackStepFromPlayer(1)) return;
      if (getTrackStepFromPlayer(1).class === "wall") return;
      if (player.position.step < MAX_STEPS - 2) {
        getTrackStepFromPlayer().hasPlayer = false;
        player.position.step += 1;
      }
    }

    if (direction === "up") {
      if (!getTrackStepFromPlayer(0, -1)) return;
      if (getTrackStepFromPlayer(0, -1).class === "wall") return;
      if (player.position.track > 0) {
        getTrackStepFromPlayer().hasPlayer = false;
        player.position.track -= 1;
      }
    }
    if (direction === "down") {
      if (!getTrackStepFromPlayer(0, 1)) return;
      if (getTrackStepFromPlayer(0, 1).class === "wall") return;
      if (player.position.track < Object.keys(tracks).length - 1) {
        getTrackStepFromPlayer().hasPlayer = false;

        player.position.track += 1;
      }
    }
    renderPlayer();
  }

  function getTrackStepFromPlayer(stepOffset = 0, trackOffset = 0) {
    if (!Object.values(tracks)[player.position.track + trackOffset])
      return null;
    return Object.values(tracks)[player.position.track + trackOffset].items[
      player.position.step + stepOffset
    ];
  }

  function renderPlayer() {
    Object.values(tracks)[player.position.track].items[
      player.position.step
    ].hasPlayer = true;
  }

  function getCollisions() {
    if (getTrackStepFromPlayer().class === "filled") {
      console.log("collision");
      endGame("lose");
    }

    /* Get Prize */
    if (getTrackStepFromPlayer().hasPrize) {
      getTrackStepFromPlayer().hasPrize = false;
      getTrackStepFromPlayer().hasPlayer = false;
      getTrackStepFromPlayer().class = "wall";
      toggleTrack(getTrackStepFromPlayer().prizeName);

      $COLLECTED_PRIZES++;
      player.position.track = Object.keys(tracks).length - 1;
      player.position.step = randomRange(2, MAX_STEPS);
      $BPM += 5;
      Transport.bpm.value = $BPM;

      if ($COLLECTED_PRIZES === gameState.TOTAL_TRACKS) {
        endGame("win");
      }
    }
  }

  // Function to generate random number
  function randomRange(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
  }

  renderPlayer();

  // schedule an event on the 16th measure
  Transport.scheduleRepeat((time) => {
    if (player.position.step > 0) {
      //   if (
      //     player.position.track > 0 &&
      //     player.position.track > Object.keys(tracks).length - 1
      //   ) {
      getTrackStepFromPlayer().hasPlayer = false;
      let offset = -1;
      if (
        player.position.track === 0 ||
        player.position.track === Object.keys(tracks).length - 1
      ) {
        offset = 0;
      }

      getTrackStepFromPlayer(offset).hasPlayer = true;

      getCollisions();
    }

    tickDrums(time);
  }, "16n");

  export function toggleTrack(trackName) {
    tracks[trackName].enabled = !tracks[trackName].enabled;
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
      instrument: [null, triangle, bell, ride],
      bars: [1, 2, 3, 4],
      beats: [3],
      sixteenths: [0],
      time: time,
      trackName: "cymbals",
      mode: "sample",
      tracks: tracks,
      combine: true,
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

    playInstrumentAt({
      instrument: maracas,
      bars: [],
      beats: [],
      sixteenths: [2, 3],
      time: time,
      trackName: "maracas",
      mode: "sample",
      tracks: tracks,
      combine: false,
    });

    movePlayer(qeuedPlayerMovement);
    qeuedPlayerMovement = null;
    tracks = tracks;
  }
</script>

<h1>Drums</h1>

{#each Object.values(tracks) as item}
  <div class="track">
    {#each item.items as i}
      <div class="track-item {i.class} {i.hasPrize ? 'prize' : ''}">
        {#if i.hasPrize}<span>{i.prizeIcon}</span>{/if}
        {#if i.hasPlayer}
          <div id="player" />
        {/if}
      </div>
    {/each}
  </div>
{/each}

<MixerWidget channels={Mixer} />
