let audioCtx = null;
let isAudioPlaying = false;
let masterGain = null;
let subOsc1 = null;
let subOsc2 = null;
let filterNode = null;
let noiseFilter = null;

function initWebAudio() {
  if (audioCtx) return;
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  audioCtx = new AudioContext();

  masterGain = audioCtx.createGain();
  masterGain.gain.setValueAtTime(0.0001, audioCtx.currentTime);
  masterGain.connect(audioCtx.destination);

  // Warm resonant filter
  filterNode = audioCtx.createBiquadFilter();
  filterNode.type = 'lowpass';
  filterNode.frequency.setValueAtTime(280, audioCtx.currentTime);
  filterNode.Q.setValueAtTime(3.5, audioCtx.currentTime);
  filterNode.connect(masterGain);

  // Sub drone 1: 55 Hz (A1)
  subOsc1 = audioCtx.createOscillator();
  subOsc1.type = 'sine';
  subOsc1.frequency.setValueAtTime(55, audioCtx.currentTime);

  // Sub drone 2: 82.4 Hz (E2)
  subOsc2 = audioCtx.createOscillator();
  subOsc2.type = 'sine';
  subOsc2.frequency.setValueAtTime(82.4, audioCtx.currentTime);

  const oscGain = audioCtx.createGain();
  oscGain.gain.setValueAtTime(0.35, audioCtx.currentTime);
  subOsc1.connect(oscGain);
  subOsc2.connect(oscGain);
  oscGain.connect(filterNode);

  // Procedural cosmic stellar wind (Brownian noise)
  const bufferSize = audioCtx.sampleRate * 2;
  const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
  const output = noiseBuffer.getChannelData(0);
  let lastOut = 0.0;
  for (let i = 0; i < bufferSize; i++) {
    const white = Math.random() * 2 - 1;
    output[i] = (lastOut + (0.02 * white)) / 1.02;
    lastOut = output[i];
    output[i] *= 3.5;
  }

  const whiteNoiseSource = audioCtx.createBufferSource();
  whiteNoiseSource.buffer = noiseBuffer;
  whiteNoiseSource.loop = true;

  noiseFilter = audioCtx.createBiquadFilter();
  noiseFilter.type = 'bandpass';
  noiseFilter.frequency.setValueAtTime(320, audioCtx.currentTime);
  noiseFilter.Q.setValueAtTime(1.8, audioCtx.currentTime);

  const noiseGain = audioCtx.createGain();
  noiseGain.gain.setValueAtTime(0.12, audioCtx.currentTime);

  whiteNoiseSource.connect(noiseFilter);
  noiseFilter.connect(noiseGain);
  noiseGain.connect(masterGain);

  subOsc1.start();
  subOsc2.start();
  whiteNoiseSource.start();
}

export function toggleCosmicAudio(enable) {
  initWebAudio();
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }

  if (enable) {
    masterGain.gain.linearRampToValueAtTime(0.35, audioCtx.currentTime + 1.5);
    isAudioPlaying = true;
  } else {
    masterGain.gain.linearRampToValueAtTime(0.0001, audioCtx.currentTime + 0.8);
    isAudioPlaying = false;
  }
  return isAudioPlaying;
}

export function updateAudioEntropy(progress) {
  if (!isAudioPlaying || !filterNode || !subOsc1 || !audioCtx) return;
  const targetFreq = 420 - (progress * 320); 
  filterNode.frequency.setTargetAtTime(Math.max(60, targetFreq), audioCtx.currentTime, 0.2);

  const targetPitch = 55 - (progress * 18);
  subOsc1.frequency.setTargetAtTime(Math.max(30, targetPitch), audioCtx.currentTime, 0.2);
}