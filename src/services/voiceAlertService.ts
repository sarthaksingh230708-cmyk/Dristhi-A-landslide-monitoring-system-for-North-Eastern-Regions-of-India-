/**
 * Voice Alert System with Web Speech API and Web Audio API Emergency Siren
 */
class VoiceAlertService {
  private synth: SpeechSynthesis | null = null;
  private audioCtx: AudioContext | null = null;
  private speakingState: boolean = false;
  private enabled: boolean = true;
  private volume: number = 1.0;
  private rate: number = 0.95;
  private pitch: number = 1.05;
  private listeners: Set<(active: boolean) => void> = new Set();

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
    }
  }

  public setEnabled(enabled: boolean) {
    this.enabled = enabled;
    if (!enabled) {
      this.stopAll();
    }
  }

  public isEnabled(): boolean {
    return this.enabled;
  }

  public isVoiceEnabled(): boolean {
    return this.enabled;
  }

  public isSpeaking(): boolean {
    return this.speakingState;
  }

  public subscribe(listener: (active: boolean) => void): () => void {
    this.listeners.add(listener);
    listener(this.speakingState);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private setSpeaking(val: boolean) {
    this.speakingState = val;
    this.listeners.forEach((fn) => fn(val));
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
  }

  public getVolume(): number {
    return this.volume;
  }

  public playEmergencySiren(_durationMs: number = 0): Promise<void> {
    // Removed annoying siren/buzzing sound as requested by user
    return Promise.resolve();
  }

  public async broadcastAlert(
    text: string,
    languageCode: string = 'en-IN',
    withSiren: boolean = false
  ): Promise<void> {
    if (!this.enabled) return;

    if (withSiren) {
      await this.playEmergencySiren();
    }

    if (!this.synth) return;

    this.synth.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.volume = this.volume;
    utterance.rate = this.rate;
    utterance.pitch = this.pitch;

    const voices = this.synth.getVoices();
    const matchedVoice = voices.find((v) => {
      const vLang = v.lang.toLowerCase();
      const target = languageCode.toLowerCase();
      return vLang.startsWith(target) || vLang.includes('in') || vLang.includes('hi');
    });

    if (matchedVoice) {
      utterance.voice = matchedVoice;
    }

    utterance.onstart = () => {
      this.setSpeaking(true);
    };

    utterance.onend = () => {
      this.setSpeaking(false);
    };

    utterance.onerror = () => {
      this.setSpeaking(false);
    };

    this.synth.speak(utterance);
  }

  public async speakAlert(
    text: string,
    languageCode: string = 'en-IN',
    options?: { playSiren?: boolean }
  ): Promise<void> {
    return this.broadcastAlert(text, languageCode, options?.playSiren ?? false);
  }

  public stopAll() {
    if (this.synth) {
      this.synth.cancel();
    }
    this.setSpeaking(false);
  }

  public stop() {
    this.stopAll();
  }
}

export const voiceAlert = new VoiceAlertService();
