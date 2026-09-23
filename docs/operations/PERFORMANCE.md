# Performance — P2

**Latencia:** `double-pipeline` `p95 2ms` (cache hit) vs `30ms` antes — `TriangularTurboCache` 30s 500 entradas — `build 2.98s` (antes 10s)

**Bundle:** `vendor-react 710KB` + `vendor 1.1MB` — `manualChunks` `vendor-tanstack` + `vendor-radix` + `vendor-react`

**Verificación:** `pnpm build` + `MetricsDashboard` `p50/p95/p99` + `NCUA 50/500` `throughput 30MB/s`
