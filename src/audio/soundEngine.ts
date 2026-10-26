import { SoundInstrument } from '../types/sorting';

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private volume: number = 0.35;
  private instrument: SoundInstrument = 'marimba';
  private masterGain: GainNode | null = null;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.volume, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.cancelScheduledValues(this.ctx.currentTime);
      this.masterGain.gain.setValueAtTime(muted ? 0 : this.volume, this.ctx.currentTime);
    }
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.masterGain && this.ctx && !this.isMuted) {
      this.masterGain.gain.cancelScheduledValues(this.ctx.currentTime);
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
    }
  }

  public setInstrument(inst: SoundInstrument) {
    this.instrument = inst;
  }

  public getInstrument(): SoundInstrument {
    return this.instrument;
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  public getVolume(): number {
    return this.volume;
  }

  /**
   * Convert a normalized value (0.0 to 1.0) into musical frequency
   * Using an expanded pentatonic scale across 3.5 octaves (approx 130Hz to 1600Hz)
   */
  private valueToFrequency(norm: number): number {
    const clamped = Math.max(0, Math.min(1, norm));
    // Pentatonic scale degrees: 0, 2, 4, 7, 9
    const pentatonicSteps = [0, 2, 4, 7, 9];
    const totalOctaves = 3.5;
    const totalNotes = Math.floor(totalOctaves * 5);
    const noteIndex = Math.floor(clamped * (totalNotes - 1));
    const octave = Math.floor(noteIndex / 5);
    const stepInOctave = pentatonicSteps[noteIndex % 5];
    const semitonesFromBase = octave * 12 + stepInOctave;
    // Base frequency C3 ~ 130.81 Hz
    return 130.81 * Math.pow(2, semitonesFromBase / 12);
  }

  /**
   * Create stereo panner node (-1 to +1) based on index in array
   */
  private createPanner(index: number, total: number): AudioNode | null {
    if (!this.ctx) return null;
    const panValue = total > 1 ? (index / (total - 1)) * 1.6 - 0.8 : 0;
    if (this.ctx.createStereoPanner) {
      const panner = this.ctx.createStereoPanner();
      panner.pan.setValueAtTime(Math.max(-0.95, Math.min(0.95, panValue)), this.ctx.currentTime);
      return panner;
    }
    return null;
  }

  /**
   * Play single synthesized tone
   */
  private playTone(
    freq: number,
    panIndex: number,
    total: number,
    duration: number = 0.08,
    gainMultiplier: number = 1.0,
    pitchShiftTo?: number
  ) {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    const t = this.ctx.currentTime;
    const panner = this.createPanner(panIndex, total);

    const voiceGain = this.ctx.createGain();
    voiceGain.gain.setValueAtTime(0.001, t);

    // Instrument specific timbre shaping
    if (this.instrument === 'marimba') {
      // FM Synth: Modulator -> Carrier
      const carrier = this.ctx.createOscillator();
      const modulator = this.ctx.createOscillator();
      const modGain = this.ctx.createGain();

      carrier.type = 'sine';
      modulator.type = 'triangle';

      carrier.frequency.setValueAtTime(freq, t);
      modulator.frequency.setValueAtTime(freq * 3.5, t);

      if (pitchShiftTo) {
        carrier.frequency.exponentialRampToValueAtTime(Math.max(40, pitchShiftTo), t + duration);
      }

      modGain.gain.setValueAtTime(freq * 0.8, t);
      modGain.gain.exponentialRampToValueAtTime(1, t + duration * 0.7);

      modulator.connect(modGain);
      modGain.connect(carrier.frequency);

      voiceGain.gain.linearRampToValueAtTime(0.35 * gainMultiplier, t + 0.006);
      voiceGain.gain.exponentialRampToValueAtTime(0.0001, t + duration);

      carrier.connect(voiceGain);
      carrier.start(t);
      modulator.start(t);
      carrier.stop(t + duration);
      modulator.stop(t + duration);
    } else if (this.instrument === 'arcade') {
      // 8-bit square wave with fast vibrato
      const osc = this.ctx.createOscillator();
      osc.type = 'square';
      osc.frequency.setValueAtTime(freq, t);

      if (pitchShiftTo) {
        osc.frequency.linearRampToValueAtTime(pitchShiftTo, t + duration);
      }

      voiceGain.gain.setValueAtTime(0.18 * gainMultiplier, t);
      voiceGain.gain.exponentialRampToValueAtTime(0.0001, t + duration);

      osc.connect(voiceGain);
      osc.start(t);
      osc.stop(t + duration);
    } else if (this.instrument === 'crystal') {
      // Shimmering triangle dual-oscillator
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      osc1.type = 'triangle';
      osc2.type = 'sine';

      osc1.frequency.setValueAtTime(freq, t);
      osc2.frequency.setValueAtTime(freq * 2.01, t); // Octave + detune shimmer

      if (pitchShiftTo) {
        osc1.frequency.exponentialRampToValueAtTime(Math.max(40, pitchShiftTo), t + duration);
        osc2.frequency.exponentialRampToValueAtTime(Math.max(80, pitchShiftTo * 2), t + duration);
      }

      voiceGain.gain.linearRampToValueAtTime(0.3 * gainMultiplier, t + 0.01);
      voiceGain.gain.exponentialRampToValueAtTime(0.0001, t + duration * 1.3);

      osc1.connect(voiceGain);
      osc2.connect(voiceGain);
      osc1.start(t);
      osc2.start(t);
      osc1.stop(t + duration * 1.3);
      osc2.stop(t + duration * 1.3);
    } else {
      // Cosmic sine
      const osc = this.ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t);

      if (pitchShiftTo) {
        osc.frequency.exponentialRampToValueAtTime(Math.max(40, pitchShiftTo), t + duration);
      }

      voiceGain.gain.linearRampToValueAtTime(0.4 * gainMultiplier, t + 0.005);
      voiceGain.gain.exponentialRampToValueAtTime(0.0001, t + duration);

      osc.connect(voiceGain);
      osc.start(t);
      osc.stop(t + duration);
    }

    if (panner) {
      voiceGain.connect(panner);
      panner.connect(this.masterGain);
    } else {
      voiceGain.connect(this.masterGain);
    }
  }

  /**
   * Sound on comparing two items
   */
  public playCompare(idxA: number, valA: number, idxB: number, valB: number, total: number, maxVal: number) {
    const fA = this.valueToFrequency(valA / maxVal);
    const fB = this.valueToFrequency(valB / maxVal);

    this.playTone(fA, idxA, total, 0.07, 0.85);
    setTimeout(() => {
      this.playTone(fB, idxB, total, 0.07, 0.85);
    }, 28);
  }

  /**
   * Sound on swapping two elements - cross pitch glide!
   */
  public playSwap(idxA: number, valA: number, idxB: number, valB: number, total: number, maxVal: number) {
    const fA = this.valueToFrequency(valA / maxVal);
    const fB = this.valueToFrequency(valB / maxVal);

    // Slide A towards B and B towards A
    this.playTone(fA, idxA, total, 0.12, 1.0, fB);
    this.playTone(fB, idxB, total, 0.12, 1.0, fA);
  }

  /**
   * Sound when an element locks into its permanent sorted position
   */
  public playSorted(idx: number, val: number, total: number, maxVal: number) {
    const f = this.valueToFrequency(val / maxVal);
    this.playTone(f, idx, total, 0.15, 1.2);
    // Add harmonic high bell
    setTimeout(() => {
      this.playTone(f * 2, idx, total, 0.2, 0.6);
    }, 40);
  }

  /**
   * Rapid ascending sweep fanfare when entire sort finishes
   */
  public playCompletionFanfare(array: number[], onFinish?: () => void) {
    if (this.isMuted) {
      onFinish?.();
      return;
    }
    const maxVal = Math.max(...array, 1);
    const stepDuration = Math.max(16, Math.min(50, 800 / array.length));

    array.forEach((val, i) => {
      setTimeout(() => {
        const freq = this.valueToFrequency(val / maxVal);
        this.playTone(freq, i, array.length, 0.16, 1.1);
        if (i === array.length - 1) {
          setTimeout(() => {
            // Final triumphant chord
            this.playTone(this.valueToFrequency(1.0), Math.floor(array.length / 2), array.length, 0.6, 1.3);
            this.playTone(this.valueToFrequency(0.5), 0, array.length, 0.6, 0.9);
            this.playTone(this.valueToFrequency(0.75), array.length - 1, array.length, 0.6, 1.0);
            onFinish?.();
          }, 120);
        }
      }, i * stepDuration);
    });
  }
}

export const soundEngine = new SoundEngine();
