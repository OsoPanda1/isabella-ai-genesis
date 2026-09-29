import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
describe("data erasure contract",()=>{
  it("deletes mutable records and preserves immutable evidence",()=>{
    const sql=readFileSync("supabase/migrations/20260927010000_data_erasure_cascade.sql","utf8");
    expect(sql).toContain("erase_subject_data");
    expect(sql).toContain("DELETE FROM public.memories");
    expect(sql).toContain("DELETE FROM public.economic_events");
    expect(sql).toContain("immutable_evidence_retained");
    expect(sql).toContain("pg_advisory_xact_lock");
  });
});
