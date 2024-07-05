import * as Tone from "tone";

let sampler;

async function initAudio() {
  console.log("Initializing audio...");
  if (!sampler) {
    try {
      sampler = new Tone.Sampler({
        urls: {
          C4: "C4.mp3",
          "D#4": "Ds4.mp3",
          "F#4": "Fs4.mp3",
          A4: "A4.mp3",
        },
        release: 1,
        baseUrl: "https://tonejs.github.io/audio/salamander/",
      }).toDestination();

      await Tone.loaded();
      await Tone.start();
      console.log("Tone.js started");
    } catch (error) {
      console.error("Error initializing audio:", error);
    }
  }
}

function playNote(note, duration = 1) {
  if (sampler) {
    sampler.triggerAttackRelease(note, duration);
  } else {
    console.warn("Sampler not initialized. Current state:", {
      sampler: !!sampler,
    });
  }
}

function playChord(notes, duration = 1) {
  if (sampler) {
    sampler.triggerAttackRelease(notes, duration);
  } else {
    console.warn("Sampler not initialized. Current state:", {
      sampler: !!sampler,
    });
  }
}

function playProgression(chords, duration = 0.95, interval = 0.05) {
  if (sampler) {
    const now = Tone.now();
    chords.forEach((chord, index) => {
      sampler.triggerAttackRelease(
        chord,
        duration,
        now + index * (duration + interval)
      );
    });
  } else {
    console.warn("Sampler not initialized. Current state:", {
      sampler: !!sampler,
    });
  }
}

export { initAudio, playNote, playChord, playProgression };
