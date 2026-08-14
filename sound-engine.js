(function attachEmotionIslandSound(global) {
  const AudioContextConstructor = global.AudioContext || global.webkitAudioContext;
  const interactiveSelector = 'button, a[href], summary, input, select, textarea, [role="button"], .life-palette-canvas';
  const exitSelector = '[data-sound="exit"], button[value="close"], [aria-label*="关闭"]';
  const soundAssetBase = (() => {
    try {
      const scriptSource = global.document?.currentScript?.src;
      return new URL("./assets/sounds/", scriptSource || global.location.href);
    } catch {
      return null;
    }
  })();
  const recordedSoundFiles = {
    click: "ui-click.wav",
    exit: "ui-exit.wav",
  };
  const recordedAudio = new Map();
  let audioContext = null;
  let masterGain = null;
  let noiseBuffer = null;

  function ensureContext() {
    if (!AudioContextConstructor) return null;

    if (!audioContext) {
      audioContext = new AudioContextConstructor();
      masterGain = audioContext.createGain();
      masterGain.gain.value = 0.075;
      masterGain.connect(audioContext.destination);
    }

    if (audioContext.state === "suspended") {
      audioContext.resume().catch(() => {});
    }
    return audioContext;
  }

  function createEnvelope(context, start, duration, peak, attack = 0.01, release = 0.08) {
    const gain = context.createGain();
    const end = start + Math.max(0.035, duration);
    const attackEnd = Math.min(start + attack, end - 0.02);
    const releaseStart = Math.max(attackEnd, end - release);
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.linearRampToValueAtTime(peak, attackEnd);
    gain.gain.setValueAtTime(peak, releaseStart);
    gain.gain.exponentialRampToValueAtTime(0.0001, end);
    gain.connect(masterGain);
    return { gain, end };
  }

  function playTone({ frequency, endFrequency = frequency, duration = 0.12, type = "sine", gain = 0.25, delay = 0, detune = 0 }) {
    const context = ensureContext();
    if (!context) return;

    const start = context.currentTime + delay;
    const envelope = createEnvelope(context, start, duration, gain, Math.min(0.018, duration * 0.25), Math.min(0.1, duration * 0.55));
    const oscillator = context.createOscillator();
    oscillator.type = type;
    oscillator.detune.value = detune;
    oscillator.frequency.setValueAtTime(Math.max(1, frequency), start);
    if (endFrequency !== frequency) {
      oscillator.frequency.exponentialRampToValueAtTime(Math.max(1, endFrequency), envelope.end);
    }
    oscillator.connect(envelope.gain);
    oscillator.start(start);
    oscillator.stop(envelope.end + 0.025);
  }

  function getNoiseBuffer(context) {
    if (noiseBuffer && noiseBuffer.sampleRate === context.sampleRate) return noiseBuffer;

    const buffer = context.createBuffer(1, context.sampleRate * 2, context.sampleRate);
    const data = buffer.getChannelData(0);
    for (let index = 0; index < data.length; index += 1) {
      data[index] = Math.random() * 2 - 1;
    }
    noiseBuffer = buffer;
    return buffer;
  }

  function playNoise({ duration = 0.2, delay = 0, gain = 0.14, filterType = "bandpass", frequency = 800, endFrequency = frequency, q = 0.7 }) {
    const context = ensureContext();
    if (!context) return;

    const start = context.currentTime + delay;
    const envelope = createEnvelope(context, start, duration, gain, Math.min(0.025, duration * 0.18), Math.min(0.16, duration * 0.58));
    const source = context.createBufferSource();
    const filter = context.createBiquadFilter();
    source.buffer = getNoiseBuffer(context);
    source.loop = true;
    filter.type = filterType;
    filter.Q.value = q;
    filter.frequency.setValueAtTime(Math.max(1, frequency), start);
    if (endFrequency !== frequency) {
      filter.frequency.exponentialRampToValueAtTime(Math.max(1, endFrequency), envelope.end);
    }
    source.connect(filter);
    filter.connect(envelope.gain);
    source.start(start);
    source.stop(envelope.end + 0.03);
  }

  function playRecorded(name, fallback) {
    ensureContext();
    if (!soundAssetBase || typeof global.Audio !== "function") {
      fallback?.();
      return false;
    }

    let audio = recordedAudio.get(name);
    if (!audio) {
      const fileName = recordedSoundFiles[name];
      if (!fileName) {
        fallback?.();
        return false;
      }
      audio = new global.Audio(new URL(fileName, soundAssetBase).href);
      audio.preload = "auto";
      audio.volume = 1;
      recordedAudio.set(name, audio);
    }

    try {
      audio.pause();
      audio.currentTime = 0;
      const playback = audio.play();
      playback?.catch?.(() => fallback?.());
      return true;
    } catch {
      fallback?.();
      return false;
    }
  }

  function preloadRecordedSounds() {
    if (!soundAssetBase || typeof global.Audio !== "function") return;
    Object.keys(recordedSoundFiles).forEach((name) => {
      const fileName = recordedSoundFiles[name];
      const audio = new global.Audio(new URL(fileName, soundAssetBase).href);
      audio.preload = "auto";
      audio.volume = 1;
      audio.load?.();
      recordedAudio.set(name, audio);
    });
  }

  function playProceduralClick() {
    playTone({ frequency: 760, endFrequency: 470, duration: 0.055, type: "triangle", gain: 0.18 });
  }

  function playClick() {
    playRecorded("click", playProceduralClick);
  }

  function playExit() {
    playRecorded("exit", playProceduralClick);
  }

  function playWave() {
    playTone({ frequency: 230, endFrequency: 165, duration: 0.34, type: "sine", gain: 0.12 });
    playTone({ frequency: 360, endFrequency: 470, duration: 0.28, type: "sine", gain: 0.1, delay: 0.09 });
  }

  function playRain() {
    playNoise({ duration: 0.22, gain: 0.09, filterType: "highpass", frequency: 1500, endFrequency: 2300, q: 0.45 });
    [0, 0.07, 0.14, 0.2].forEach((delay, index) => {
      playTone({ frequency: 1260 + index * 170, duration: 0.035, type: "sine", gain: 0.12, delay });
    });
  }

  function playWind() {
    playNoise({ duration: 0.62, gain: 0.15, filterType: "bandpass", frequency: 520, endFrequency: 210, q: 0.45 });
    playTone({ frequency: 190, endFrequency: 125, duration: 0.58, type: "sine", gain: 0.08 });
  }

  function playStorm() {
    playNoise({ duration: 0.72, gain: 0.18, filterType: "lowpass", frequency: 260, endFrequency: 110, q: 0.35 });
    playNoise({ duration: 0.3, gain: 0.08, filterType: "highpass", frequency: 1200, endFrequency: 1900, q: 0.5, delay: 0.08 });
    playTone({ frequency: 120, endFrequency: 86, duration: 0.66, type: "sine", gain: 0.1 });
  }

  function playSun() {
    playTone({ frequency: 523, duration: 0.22, type: "sine", gain: 0.13 });
    playTone({ frequency: 659, duration: 0.24, type: "sine", gain: 0.12, delay: 0.08 });
    playTone({ frequency: 784, duration: 0.3, type: "sine", gain: 0.11, delay: 0.16 });
  }

  function playCloud() {
    playTone({ frequency: 220, endFrequency: 175, duration: 0.52, type: "sine", gain: 0.1 });
    playNoise({ duration: 0.36, gain: 0.055, filterType: "lowpass", frequency: 330, endFrequency: 220, q: 0.4, delay: 0.04 });
  }

  function playWeather(kind) {
    const sounds = {
      wave: playWave,
      calm: playWave,
      rain: playRain,
      wind: playWind,
      storm: playStorm,
      sun: playSun,
      cloud: playCloud,
    };
    (sounds[kind] || playWave)();
  }

  function playFeature(family) {
    const featureSounds = {
      home() {
        playTone({ frequency: 520, duration: 0.12, type: "triangle", gain: 0.14 });
        playTone({ frequency: 780, duration: 0.2, type: "triangle", gain: 0.11, delay: 0.1 });
      },
      travel() {
        playTone({ frequency: 235, endFrequency: 285, duration: 0.28, type: "sine", gain: 0.12 });
        playTone({ frequency: 470, duration: 0.16, type: "triangle", gain: 0.1, delay: 0.18 });
      },
      family() {
        playTone({ frequency: 330, duration: 0.25, type: "sine", gain: 0.11 });
        playTone({ frequency: 494, duration: 0.34, type: "sine", gain: 0.1, delay: 0.12 });
      },
      nature() {
        playTone({ frequency: 280, endFrequency: 420, duration: 0.2, type: "triangle", gain: 0.1 });
        playTone({ frequency: 560, duration: 0.18, type: "sine", gain: 0.08, delay: 0.14 });
      },
      social() {
        playNoise({ duration: 0.16, gain: 0.1, filterType: "bandpass", frequency: 1100, endFrequency: 700, q: 0.65 });
        playTone({ frequency: 180, endFrequency: 230, duration: 0.22, type: "triangle", gain: 0.12, delay: 0.08 });
        playTone({ frequency: 360, duration: 0.14, type: "sine", gain: 0.09, delay: 0.2 });
      },
      learning() {
        playNoise({ duration: 0.16, gain: 0.07, filterType: "highpass", frequency: 1900, endFrequency: 1200, q: 0.4 });
        playTone({ frequency: 660, duration: 0.22, type: "sine", gain: 0.1, delay: 0.1 });
      },
      food() {
        playTone({ frequency: 420, duration: 0.12, type: "triangle", gain: 0.12 });
        playTone({ frequency: 610, duration: 0.2, type: "sine", gain: 0.1, delay: 0.11 });
      },
      work() {
        playTone({ frequency: 145, endFrequency: 120, duration: 0.3, type: "sine", gain: 0.11 });
        playTone({ frequency: 220, duration: 0.16, type: "triangle", gain: 0.08, delay: 0.16 });
      },
      drink() {
        playTone({ frequency: 740, duration: 0.11, type: "triangle", gain: 0.1 });
        playTone({ frequency: 980, duration: 0.18, type: "sine", gain: 0.08, delay: 0.09 });
      },
      leisure() {
        playTone({ frequency: 392, duration: 0.28, type: "sine", gain: 0.09 });
        playTone({ frequency: 523, duration: 0.34, type: "sine", gain: 0.08, delay: 0.12 });
      },
      direction() {
        playTone({ frequency: 300, endFrequency: 500, duration: 0.28, type: "triangle", gain: 0.1 });
      },
      conflict() {
        playTone({ frequency: 180, endFrequency: 110, duration: 0.3, type: "sawtooth", gain: 0.055 });
      },
      health() {
        playNoise({ duration: 0.3, gain: 0.06, filterType: "bandpass", frequency: 320, endFrequency: 180, q: 0.4 });
      },
    };
    (featureSounds[family] || playCloud)();
  }

  function bindClickSounds() {
    if (!global.document || global.__emotionIslandClickSoundBound) return;
    global.__emotionIslandClickSoundBound = true;
    global.document.addEventListener("click", (event) => {
      const target = event.target?.closest?.(interactiveSelector);
      if (!target || target.disabled || target.getAttribute("aria-disabled") === "true") return;
      if (target.matches(exitSelector)) {
        playExit();
        return;
      }
      playClick();
    }, true);
  }

  const api = {
    supported: Boolean(AudioContextConstructor),
    playClick,
    playExit,
    playWeather,
    playFeature,
  };
  global.EmotionIslandSound = api;
  bindClickSounds();
  preloadRecordedSounds();
})(window);
