export interface MachineLearningResource {
  id: string;
  title: string;
  category: "courses" | "papers" | "frameworks" | "datasets" | "ethics";
  source: string;
  provenance: "curated" | "external-catalog";
  reviewedAt: string;
}

export const MACHINE_LEARNING_CATALOG: readonly MachineLearningResource[] = [
  {
    id: "ml-ethics-governance",
    title: "ML ethics and governance",
    category: "ethics",
    source: "awesome-machine-learning",
    provenance: "external-catalog",
    reviewedAt: "2026-09-29",
  },
  {
    id: "ml-frameworks",
    title: "Machine learning frameworks",
    category: "frameworks",
    source: "awesome-machine-learning",
    provenance: "external-catalog",
    reviewedAt: "2026-09-29",
  },
];
