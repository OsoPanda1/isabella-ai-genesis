import { existsSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

const ROOT = process.cwd();
const PUBLIC_URL = (process.env.VITE_PUBLIC_APP_URL || "").replace(/\/+$/, "");

const STATIC_CANDIDATES = [
  join(ROOT, ".vercel", "output", "static"),
  join(ROOT, ".output", "public"),
  join(ROOT, "dist"),
];

const MANIFEST_GLOBS = [join(ROOT, ".output", "server"), join(ROOT, ".vercel", "output")];

function walk(dir, depth = 0) {
  if (depth > 6 || !existsSync(dir)) return [];
  const out = [];
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    let st;
    try {
      st = statSync(full);
    } catch {
      continue;
    }
    if (st.isDirectory()) out.push(...walk(full, depth + 1));
    else out.push(full);
  }
  return out;
}

function findStaticDirs() {
  return STATIC_CANDIDATES.filter(
    (dir) =>
      existsSync(join(dir, "assets")) &&
      readdirSync(join(dir, "assets")).some((f) => /^index-.*\.js$/.test(f)),
  );
}

function findEntryAssets(staticDir) {
  const files = readdirSync(join(staticDir, "assets"));
  const scripts = files.filter((f) => /^index-.*\.js$/.test(f)).map((f) => `/assets/${f}`);
  const css = files.filter((f) => /^index-.*\.css$/.test(f)).map((f) => `/assets/${f}`);
  return { scripts, css };
}

function findManifestAssets() {
  for (const base of MANIFEST_GLOBS) {
    const manifests = walk(base).filter((f) => /_tanstack-start-manifest_.*\.mjs$/.test(f));
    for (const file of manifests) {
      const text = readFileSync(file, "utf8");
      const cssMatch = text.match(/css:\[([^\]]*)\]/);
      const scriptsMatch = text.match(/scripts:\[\{attrs:\{([^}]*)\}\}\]/);
      const css = cssMatch
        ? [...cssMatch[1].matchAll(/"([^"]+)"/g)]
            .map((m) => m[1])
            .filter((u) => u.startsWith("/assets/"))
        : [];
      let scripts = [];
      if (scriptsMatch) {
        const src = scriptsMatch[1].match(/src:"([^"]+)"/);
        if (src && src[1].startsWith("/assets/")) scripts = [src[1]];
      }
      if (scripts.length) return { scripts, css, source: file };
    }
  }
  return null;
}

function buildShell(html, scripts, css) {
  let out = html;
  out = out.replace(/[ \t]*<script[^>]*src="\/src\/[^"]*"[^>]*><\/script>\s*/g, "");
  out = out.replace(/%VITE_PUBLIC_APP_URL%\/?/g, PUBLIC_URL);
  if (PUBLIC_URL === "") {
    out = out.replace(/<link rel="canonical" href="\/" \/>/, "");
    out = out.replace(/\s*<link rel="canonical"[^>]*\/>/, "");
  }
  const links = css
    .map((href) => `    <link rel="stylesheet" crossorigin href="${href}" />`)
    .join("\n");
  if (links) out = out.replace(/(\s*)<\/head>/i, `\n${links}\n  </head>`);
  const tags = scripts
    .map((src) => `    <script type="module" crossorigin src="${src}"></script>`)
    .join("\n");
  out = out.replace(/(\s*)<\/body>/i, `\n${tags}\n  </body>`);
  return out;
}

function main() {
  const sourcePath = join(ROOT, "index.html");
  if (!existsSync(sourcePath)) {
    console.error("CLIENT-SHELL: FAIL — index.html de origen no encontrado.");
    process.exit(1);
  }
  const staticDirs = findStaticDirs();
  if (staticDirs.length === 0) {
    console.error(
      "CLIENT-SHELL: FAIL — no existe ningún directorio estático con assets/index-*.js.",
    );
    process.exit(1);
  }
  const manifest = findManifestAssets();
  const html = readFileSync(sourcePath, "utf8");

  for (const dir of staticDirs) {
    const fallback = findEntryAssets(dir);
    const scripts = manifest?.scripts?.length ? manifest.scripts : fallback.scripts;
    const css = manifest?.css?.length ? manifest.css : fallback.css;
    if (!scripts.length) {
      console.error(`CLIENT-SHELL: FAIL — sin script de entrada en ${dir}.`);
      process.exit(1);
    }
    const shell = buildShell(html, scripts, css);
    writeFileSync(join(dir, "index.html"), shell, "utf8");
    console.log(
      `CLIENT-SHELL: OK — ${join(dir, "index.html")} ← ${scripts.join(", ")}${css.length ? " + " + css.join(", ") : ""}` +
        `${manifest ? " (manifiesto TanStack)" : " (fallback assets/)"}`,
    );
  }
}

main();
