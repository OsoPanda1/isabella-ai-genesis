import { SKILLS, SKILL_ORDER } from "@/lib/isabella/skills"

export async function GET() {
  return Response.json({ order: SKILL_ORDER, skills: SKILL_ORDER.map((id) => SKILLS[id]) })
}
