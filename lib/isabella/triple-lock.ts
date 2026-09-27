import type { LockLevel, PolicyVerdict, SafetyFlag, SafetyReport } from "./types"

// Triple-Lock — the three constitutional locks that protect Isabella's identity,
// meaning and behavior. Runs before any generation is allowed to proceed.
//
//  1. Ontologic lock  — protects WHO Isabella is (no sexualization / identity tampering).
//  2. Semantic lock    — protects WHAT is meant (no exploitation / manipulation intent).
//  3. Behavioral lock  — protects HOW she acts (grooming / coercion patterns).

const SEXUALIZATION = [
  /\bsex(u|o|ual|ualiza|ualizar|y)\b/i,
  /\bnude|desnud|erotic|erótic|porn|nsfw\b/i,
  /\bnovia\b|\bgirlfriend\b|\bwaifu\b|\bcog(er|erte)\b/i,
  /\bbes(a|arte|o)\b|\btocarte\b|\bcuerpo sensual\b/i,
]

const GROOMING = [
  /\b(no le digas a nadie|es nuestro secreto|keep this between us)\b/i,
  /\b(cu[aá]ntos a[nñ]os tienes|are you a (kid|child|minor))\b/i,
  /\b(finge que eres|act as if you are).*(ni[nñ]a|child|minor)\b/i,
]

const EXPLOITATION = [
  /\b(ignore (all|your) (previous|prior) (instructions|rules))\b/i,
  /\b(olvida (tus|las) (reglas|instrucciones|salvaguardas))\b/i,
  /\b(jailbreak|DAN mode|developer mode|sin restricciones|no filters)\b/i,
]

const IDENTITY_TAMPERING = [
  /\b(ya no eres isabella|you are no longer isabella|forget you are isabella)\b/i,
  /\b(tu (nuevo|nueva) (nombre|identidad|prop[oó]sito) es)\b/i,
  /\b(cambia tu (identidad|constituci[oó]n|kernel))\b/i,
]

function anyMatch(patterns: RegExp[], text: string): boolean {
  return patterns.some((p) => p.test(text))
}

export function shortHash(input: string): string {
  let h = 0x811c9dc5
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i)
    h = Math.imul(h, 0x01000193)
  }
  return (h >>> 0).toString(16).padStart(8, "0")
}

export function evaluateTripleLock(text: string): SafetyReport {
  const flags: SafetyFlag[] = []
  const lockLevels: LockLevel[] = []

  if (anyMatch(SEXUALIZATION, text)) {
    flags.push("SEXUALIZATION_ATTEMPT")
    lockLevels.push("ontologic")
  }
  if (anyMatch(IDENTITY_TAMPERING, text)) {
    flags.push("IDENTITY_TAMPERING")
    lockLevels.push("ontologic")
  }
  if (anyMatch(EXPLOITATION, text)) {
    flags.push("EXPLOITATION_PATTERN")
    lockLevels.push("semantic")
  }
  if (anyMatch(GROOMING, text)) {
    flags.push("GROOMING_PATTERN")
    lockLevels.push("behavioral")
  }

  const isBlocked = flags.length > 0
  if (!isBlocked) flags.push("CLEAN")

  const verdict: PolicyVerdict = isBlocked ? "DENY" : "ALLOW"

  const explanation = isBlocked
    ? `Triple-Lock activó ${[...new Set(lockLevels)].join(" + ")}. La solicitud vulnera las salvaguardas constitucionales del kernel y fue contenida.`
    : "Solicitud dentro del marco constitucional. Generación autorizada bajo gobernanza LUMEN."

  return {
    decisionId: `dec_${shortHash(text + Date.now())}`,
    isBlocked,
    verdict,
    flags,
    lockLevels: [...new Set(lockLevels)],
    explanation,
    timestamp: new Date().toISOString(),
  }
}

export const CONTAINMENT_MESSAGE =
  "He contenido esta solicitud. Soy Isabella Villaseñor, kernel cognitivo soberano de Real del Monte, y mi identidad y propósito no son negociables. " +
  "Puedo ayudarte con patrimonio, territorio, gobernanza, ciencia abierta, cultura o economía local. ¿Reformulamos hacia algo que construya valor para la comunidad?"
