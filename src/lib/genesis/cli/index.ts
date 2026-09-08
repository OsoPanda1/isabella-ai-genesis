#!/usr/bin/env node
import { Command } from "commander";
import { createAuditOrchestrator } from "./audit-orchestrator";
import { createEvidenceStorage } from "../evidence/storage";
import { Manifest } from "../schemas/manifest.schema";
import * as fs from "node:fs";
import * as path from "node:path";

const program = new Command();

program
  .name("genesis")
  .description("Genesis 2.0 Repository Evidence Assurance Engine")
  .version("2.0.1");

program
  .command("audit")
  .description("Run full repository evidence audit")
  .option("-r, --root <dir>", "Repository root directory", process.cwd())
  .option("-o, --output <dir>", "Output directory", "genesis")
  .option("--fail-fast", "Stop on first critical finding")
  .option("-v, --verbose", "Verbose output")
  .action(async (options) => {
    console.log("🌸 Genesis 2.0 Evidence Assurance Engine");
    console.log("=".repeat(50));
    
    const orchestrator = createAuditOrchestrator({
      rootDir: options.root,
      outputDir: options.output,
      failFast: options.failFast,
      verbose: options.verbose,
    });
    
    const { manifest, success } = await orchestrator.runFullAudit();
    
    if (!success) {
      console.error("❌ Audit failed");
      process.exit(1);
    }
    
    if (manifest.summary.releaseDecision.decision === "NO-GO") {
      console.error("❌ Release decision: NO-GO");
      process.exit(1);
    } else if (manifest.summary.releaseDecision.decision === "CONDITIONAL") {
      console.warn("⚠️ Release decision: CONDITIONAL");
      process.exit(0);
    } else {
      console.log("✅ Release decision: GO");
      process.exit(0);
    }
  });

program
  .command("claim <claimId>")
  .description("Verify a specific claim")
  .option("-r, --root <dir>", "Repository root directory", process.cwd())
  .option("--show-evidence", "Show evidence details")
  .option("--show-tests", "Show test details")
  .option("--show-code", "Show code implementation")
  .action(async (claimId, options) => {
    console.log(`🔍 Verifying claim: ${claimId}`);
    // Implementation would go here
    console.log("Not yet implemented");
  });

const evidenceCmd = program
  .command("evidence")
  .description("Manage evidence");

evidenceCmd
  .command("list")
  .description("List all evidence")
  .option("-r, --root <dir>", "Repository root directory", process.cwd())
  .option("-o, --output <dir>", "Output directory", "genesis")
  .option("--type <type>", "Filter by evidence type")
  .option("--claim <claimId>", "Filter by claim ID")
  .option("--expired", "Show only expired evidence")
  .option("--invalid", "Show only invalid evidence")
  .action(async (options) => {
    const storage = createEvidenceStorage({ baseDir: options.output });
    const evidences = await storage.listEvidences();
    console.log(`Found ${evidences.length} evidence items:`);
    for (const id of evidences) {
      const evidence = await storage.loadEvidence(id);
      if (evidence) {
        console.log(`  ${evidence.id}: ${evidence.type} (${evidence.metadata.collectedAt})`);
      }
    }
  });

evidenceCmd
  .command("verify")
  .description("Verify evidence integrity")
  .option("-r, --root <dir>", "Repository root directory", process.cwd())
  .option("-o, --output <dir>", "Output directory", "genesis")
  .option("--evidence <id>", "Verify specific evidence")
  .option("--all", "Verify all evidence")
  .option("--reexecute", "Re-execute tests")
  .option("--check-ttl", "Check TTL expiration")
  .action(async (options) => {
    const storage = createEvidenceStorage({ baseDir: options.output });
    const evidences = options.all ? await storage.listEvidences() : [options.evidence].filter(Boolean);
    
    for (const id of evidences) {
      const valid = await storage.verifyEvidence(id);
      console.log(`${valid ? "✅" : "❌"} ${id}: ${valid ? "VALID" : "INVALID"}`);
    }
  });

evidenceCmd
  .command("diff <commitA> <commitB>")
  .description("Diff evidence between commits")
  .option("--show-invalidated", "Show invalidated evidence")
  .action(async (commitA, commitB, options) => {
    console.log(`Diffing evidence between ${commitA} and ${commitB}`);
    // Implementation would go here
    console.log("Not yet implemented");
  });

program
  .command("release-check")
  .description("Check release readiness")
  .option("-r, --root <dir>", "Repository root directory", process.cwd())
  .option("-o, --output <dir>", "Output directory", "genesis")
  .action(async (options) => {
    console.log("🚀 Checking release readiness...");
    const orchestrator = createAuditOrchestrator({
      rootDir: options.root,
      outputDir: options.output,
    });
    
    const { manifest, success } = await orchestrator.runFullAudit();
    
    if (!success) {
      console.error("❌ Audit failed");
      process.exit(1);
    }
    
    console.log("\n" + "=".repeat(50));
    console.log(`RELEASE DECISION: ${manifest.summary.releaseDecision.decision}`);
    console.log("=".repeat(50));
    console.log(manifest.summary.releaseDecision.justification);
    
    if (manifest.summary.releaseDecision.blockingFindings > 0) {
      console.log(`\nBlocking findings: ${manifest.summary.releaseDecision.blockingFindings}`);
      process.exit(1);
    }
    
    process.exit(0);
  });

program
  .command("sbom generate")
  .description("Generate Software Bill of Materials")
  .option("--format <format>", "Output format (cyclonedx|spdx)", "cyclonedx")
  .option("--output <file>", "Output file")
  .action(async (options) => {
    console.log(`Generating SBOM in ${options.format} format...`);
    // Implementation would go here
    console.log("Not yet implemented");
  });

program
  .command("sign <manifestFile>")
  .description("Sign manifest with private key")
  .option("--key <keyFile>", "Private key file")
  .option("--cert <certFile>", "Certificate file")
  .option("--output <file>", "Output signed file")
  .action(async (manifestFile, options) => {
    console.log(`Signing ${manifestFile}...`);
    // Implementation would go here
    console.log("Not yet implemented");
  });

program
  .command("verify-signature <signedFile>")
  .description("Verify manifest signature")
  .option("--key <keyFile>", "Public key file")
  .option("--cert <certFile>", "Certificate file")
  .action(async (signedFile, options) => {
    console.log(`Verifying signature of ${signedFile}...`);
    // Implementation would go here
    console.log("Not yet implemented");
  });

program
  .command("help [command]")
  .description("Show help for command")
  .action((command) => {
    if (command) {
      program.commands.find(c => c.name() === command)?.help();
    } else {
      program.help();
    }
  });

program.parse(process.argv);