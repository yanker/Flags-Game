// WebAudio synthesized sounds — no audio files needed

let ctx: AudioContext | null = null;

function getCtx(): AudioContext {
  if (!ctx) ctx = new AudioContext();
  return ctx;
}

function resume() {
  const c = getCtx();
  if (c.state === 'suspended') c.resume();
}

function playTone(
  frequency: number,
  duration: number,
  type: OscillatorType = 'sine',
  gain = 0.3,
  delay = 0
): void {
  const c = getCtx();
  const osc = c.createOscillator();
  const gainNode = c.createGain();
  osc.connect(gainNode);
  gainNode.connect(c.destination);
  osc.type = type;
  osc.frequency.setValueAtTime(frequency, c.currentTime + delay);
  gainNode.gain.setValueAtTime(0, c.currentTime + delay);
  gainNode.gain.linearRampToValueAtTime(gain, c.currentTime + delay + 0.01);
  gainNode.gain.exponentialRampToValueAtTime(0.001, c.currentTime + delay + duration);
  osc.start(c.currentTime + delay);
  osc.stop(c.currentTime + delay + duration + 0.05);
}

let soundEnabled = true;

export function setSoundEnabled(enabled: boolean): void {
  soundEnabled = enabled;
}

export function playCorrect(): void {
  if (!soundEnabled) return;
  resume();
  // cheerful up-arpeggio
  playTone(523, 0.1, 'triangle', 0.3, 0);
  playTone(659, 0.1, 'triangle', 0.3, 0.1);
  playTone(784, 0.15, 'triangle', 0.35, 0.2);
  playTone(1047, 0.2, 'triangle', 0.35, 0.35);
}

export function playWrong(): void {
  if (!soundEnabled) return;
  resume();
  // low buzz
  playTone(220, 0.12, 'square', 0.25, 0);
  playTone(180, 0.15, 'square', 0.2, 0.12);
  playTone(150, 0.2, 'sawtooth', 0.18, 0.25);
}

export function playTick(): void {
  if (!soundEnabled) return;
  resume();
  // short click/blip
  playTone(880, 0.04, 'square', 0.1, 0);
}

export function playFinish(): void {
  if (!soundEnabled) return;
  resume();
  // little fanfare
  const notes = [523, 659, 784, 659, 784, 1047];
  const times = [0, 0.12, 0.24, 0.36, 0.46, 0.58];
  notes.forEach((freq, i) => playTone(freq, 0.18, 'triangle', 0.3, times[i]));
}
