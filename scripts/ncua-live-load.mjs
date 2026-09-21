#!/usr/bin/env node
/**
 * Live NCUA evidence runner.
 *
 * Required:
 *   NCUA_LIVE_BASE_URL=https://...
 *   NCUA_AUTHORIZATION="Bearer ..."
 *
 * Optional:
 *   NCUA_STAGES=50,100,250,500
 */
const baseUrl = process.env.NCUA_LIVE_BASE_URL;
const authorization = process.env.NCUA_AUTHORIZATION;
if (!baseUrl || !authorization) {
  console.error("NCUA_LIVE_BASE_URL and NCUA_AUTHORIZATION are required.");
  process.exit(2);
}

const stages = (process.env.NCUA_STAGES ?? "50,100,250,500")
  .split(",")
  .map((value) => Number(value.trim()))
  .filter((value) => Number.isInteger(value) && value > 0 && value <= 500);

if (stages.length === 0) {
  console.error("NCUA_STAGES contains no valid values.");
  process.exit(2);
}

const results = [];
for (const count of stages) {
  const response = await fetch(new URL("/api/ncua-load", baseUrl), {
    method: "POST",
    headers: {
      authorization,
      "content-type": "application/json",
    },
    body: JSON.stringify({ count, label: `live-${count}` }),
  });

  const text = await response.text();
  let body;
  try {
    body = JSON.parse(text);
  } catch {
    body = { raw: text };
  }

  results.push({ count, httpStatus: response.status, body });
  console.log(JSON.stringify(results.at(-1)));

  if (!response.ok || body.status !== "PASS") {
    console.error("NCUA live evidence failed at concurrency", count);
    process.exit(1);
  }
}

console.log(
  JSON.stringify(
    {
      schema: "isabella.ncua.live-load-suite.v1",
      completedAt: new Date().toISOString(),
      stages: results,
    },
    null,
    2,
  ),
);
