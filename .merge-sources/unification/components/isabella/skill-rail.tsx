"use client"

import type { SkillId } from "@/lib/isabella/types"
import { SKILLS, SKILL_ORDER } from "@/lib/isabella/skills"
import { cn } from "@/lib/utils"

interface SkillRailProps {
  active: SkillId
  onSelect: (id: SkillId) => void
}

export function SkillRail({ active, onSelect }: SkillRailProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <p className="px-2 text-[0.7rem] font-medium uppercase tracking-[0.18em] text-muted-foreground">
        Habilidades cognitivas
      </p>
      <div className="grid gap-1.5">
        {SKILL_ORDER.map((id) => {
          const skill = SKILLS[id]
          const isActive = id === active
          return (
            <button
              key={id}
              type="button"
              onClick={() => onSelect(id)}
              aria-pressed={isActive}
              className={cn(
                "group rounded-lg border px-3 py-2.5 text-left transition-colors",
                isActive
                  ? "border-gold/60 bg-gold/10"
                  : "border-border/60 bg-card/40 hover:border-gold/30 hover:bg-card/70",
              )}
            >
              <div className="flex items-center justify-between gap-2">
                <span
                  className={cn(
                    "font-display text-base font-semibold tracking-wide",
                    isActive ? "text-gold" : "text-foreground",
                  )}
                >
                  {skill.name}
                </span>
                {id === "LUMEN" && (
                  <span className="rounded-full border border-jade/40 bg-jade/10 px-1.5 py-0.5 text-[0.6rem] font-medium uppercase tracking-wider text-jade">
                    Gobierna
                  </span>
                )}
              </div>
              <p className="mt-0.5 text-[0.72rem] leading-tight text-muted-foreground">{skill.engine}</p>
            </button>
          )
        })}
      </div>
    </div>
  )
}
