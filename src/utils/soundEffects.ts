class SoundManager {
  play(sound: string) {
    // Audio synthesis fallback / no-op if audio context or assets are unavailable
  }
  playChime() {}
  playPulse() {}
  playWarning() {}
}

export const soundManager = new SoundManager();
