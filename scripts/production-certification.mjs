#!/usr/bin/env node
import { existsSync, readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
const root = process.cwd(); const errors = []; const warnings = [];
function readJson(path) { try { return JSON.parse(readFileSync(path, "utf8")); } catch { return null; } }
function requireFile(path) { if (!existsSync(path)) errors.push("missing:" + path); }
for (const file of ["package.json","pnpm-lock.yaml","vercel.json",".nvmrc",".github/workflows/ci.yml",".github/workflows/fgais-gate.yml",".github/workflows/deploy-production.yml","scripts/production-preflight.mjs","scripts/production-integrity-gate.mjs","scripts/production-evidence.mjs","scripts/production-smoke.mjs","scripts/verify-lock-contract.mjs"]) requireFile(file);
const pkg = readJson("package.json"); const vercel = readJson("vercel.json");
if (pkg?.packageManager !== "pnpm@10.15.4") errors.push("packageManager no está fijado a pnpm@10.15.4");
if (pkg?.engines?.node !== ">=22 <25") errors.push("engines.node no es >=22 <25");
if (vercel?.framework !== "tanstack-start") errors.push("Vercel framework incorrecto");
if (vercel?.installCommand !== "pnpm install --frozen-lockfile") errors.push("Vercel installCommand no es reproducible");
if (readFileSync(".nvmrc", "utf8").trim() !== "24.11.0") errors.push(".nvmrc no fija Node 24.11.0");
if (existsSync("scripts/verify-lock-contract.mjs")) { try { execFileSync(process.execPath,["scripts/verify-lock-contract.mjs"],{cwd:root,stdio:"inherit"}); } catch { errors.push("verify-lock-contract FAILED"); } }
const status = execFileSync("git",["status","--porcelain"],{cwd:root,encoding:"utf8"}).trim(); if (status) errors.push("git working tree no está limpio");
const buildRoots=[".vercel/output",".output","dist"].filter(existsSync); if(!buildRoots.length) warnings.push("No existe build output todavía; ejecutar después de build.");
for(const key of ["DATABASE_URL","AUTH_JWT_SECRET","BOOKPI_SIGNING_KEY","AEGIS_AUDIT_SECRET"]) if(!process.env[key]) warnings.push("No visible en este proceso: "+key+" (debe existir en entorno productivo).");
if(errors.length){ console.error("PRODUCTION-CERTIFICATION: FAILED"); for(const e of errors) console.error("- "+e); process.exit(1); }
console.log(JSON.stringify({schema:"isabella.production-certification.v1",status:warnings.length?"CODE_READY_EXTERNAL_EVIDENCE_REQUIRED":"PASS",errors:[],warnings,generatedAt:new Date().toISOString()},null,2));