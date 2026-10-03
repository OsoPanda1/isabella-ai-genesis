import type { ServerFnDescriptor } from "./tanstack-polyfill";

/**
 * Descriptores de server functions (canonicalización: `endpoint` + `method`).
 * `rpc()` mantiene el literal de método tipado para que `useServerFn` no
 * tenga que hacer cast en cada call site.
 */
const rpc = (endpoint: string, method: ServerFnDescriptor["method"]): ServerFnDescriptor => ({
  endpoint,
  method,
});

export const getCockpitSnapshot = rpc("/api/atlas/getCockpitSnapshot", "GET");
export const getFederationGraph = rpc("/api/atlas/getFederationGraph", "GET");
export const emitEoctEvent = rpc("/api/atlas/emitEoctEvent", "POST");
export const getLedger = rpc("/api/atlas/getLedger", "POST");
export const evalAnubisPolicy = rpc("/api/atlas/evalAnubisPolicy", "POST");
export const getSeguimientos = rpc("/api/atlas/getSeguimientos", "POST");
export const isabellaAsk = rpc("/api/atlas/isabellaAsk", "POST");
export const isabellaRecommend = rpc("/api/atlas/isabellaRecommend", "POST");
export const isabellaModerate = rpc("/api/atlas/isabellaModerate", "POST");
export const setEmotional = rpc("/api/atlas/setEmotional", "POST");
export const getEconomySnapshot = rpc("/api/atlas/getEconomySnapshot", "GET");
export const purchaseProduct = rpc("/api/atlas/purchaseProduct", "POST");
export const mintUserCredits = rpc("/api/atlas/mintUserCredits", "POST");
export const getDaoSnapshot = rpc("/api/atlas/getDaoSnapshot", "GET");
export const daoVote = rpc("/api/atlas/daoVote", "POST");
export const daoCreateProposal = rpc("/api/atlas/daoCreateProposal", "POST");
export const getRegistrySnapshot = rpc("/api/registry/rpcRegistrySnapshot", "GET");
export const getQuantumReflection = rpc("/api/atlas/quantumReflection", "GET");
