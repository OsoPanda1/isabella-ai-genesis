export function isStrictlyFemaleVoice(voice: SpeechSynthesisVoice): boolean {
  const name = voice.name.toLowerCase();
  const femaleKeywords = [
    "female",
    "femenino",
    "mujer",
    "woman",
    "girl",
    "monica",
    "paulina",
    "soledad",
    "lucia",
    "carmen",
    "helena",
    "sabina",
    "laura",
    "elena",
    "rosa",
    "mia",
    "victoria",
    "paloma",
    "isabella",
    "sofia",
    "valeria",
    "camila",
    "esperanza",
    "alva",
    "zira",
    "samantha",
    "karen",
  ];
  const maleKeywords = [
    "male",
    "masculino",
    "hombre",
    "man",
    "boy",
    "jorge",
    "diego",
    "carlos",
    "david",
    "enrique",
    "miguel",
  ];

  const hasFemale = femaleKeywords.some((k) => name.includes(k));
  const hasMale = maleKeywords.some((k) => name.includes(k));

  if (hasFemale && !hasMale) return true;
  if (hasMale) return false;

  return true;
}

export function getAvailableFemaleVoices(voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice[] {
  if (!voices || !voices.length) return [];
  const female = voices.filter(isStrictlyFemaleVoice);
  return female.length > 0 ? female : voices;
}

export function selectBestFemaleVoice(
  voices: SpeechSynthesisVoice[],
  preferredName?: string,
): { voice: SpeechSynthesisVoice | null; pitchMultiplier: number } {
  if (!voices || !voices.length) {
    return { voice: null, pitchMultiplier: 1.05 };
  }

  if (preferredName) {
    const preferred = voices.find((v) => v.name.toLowerCase() === preferredName.toLowerCase());
    if (preferred) {
      return { voice: preferred, pitchMultiplier: 1.08 };
    }
  }

  // 1. Spanish (MX/ES/US/419) female voices
  const spanishVoices = voices.filter(
    (v) =>
      v.lang.startsWith("es") ||
      v.lang.includes("ES") ||
      v.lang.includes("MX") ||
      v.lang.includes("419"),
  );
  const spanishFemale = spanishVoices.filter(isStrictlyFemaleVoice);

  if (spanishFemale.length > 0) {
    const premium = spanishFemale.find(
      (v) =>
        v.name.toLowerCase().includes("natural") ||
        v.name.toLowerCase().includes("neural") ||
        v.name.toLowerCase().includes("google") ||
        v.name.toLowerCase().includes("monica") ||
        v.name.toLowerCase().includes("paulina") ||
        v.name.toLowerCase().includes("sabina"),
    );
    return { voice: premium ?? spanishFemale[0], pitchMultiplier: 1.08 };
  }

  if (spanishVoices.length > 0) {
    return { voice: spanishVoices[0], pitchMultiplier: 1.08 };
  }

  // 2. Any female voice
  const anyFemale = voices.filter(isStrictlyFemaleVoice);
  if (anyFemale.length > 0) {
    return { voice: anyFemale[0], pitchMultiplier: 1.08 };
  }

  return { voice: voices[0] ?? null, pitchMultiplier: 1.1 };
}
