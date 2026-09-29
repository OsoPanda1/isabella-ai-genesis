export function selectBestFemaleVoice(voices: SpeechSynthesisVoice[] = []): {
  voice: SpeechSynthesisVoice | null;
  pitchMultiplier: number;
} {
  const spanishVoice = voices.find(
    (v) => (v.lang.startsWith("es") || v.lang.startsWith("es-MX")) && /female|sabina|paulina|monica|helena|laura/i.test(v.name)
  ) || voices.find((v) => v.lang.startsWith("es"));

  return {
    voice: spanishVoice || voices[0] || null,
    pitchMultiplier: 1.05,
  };
}
