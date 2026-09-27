import { createHash, randomUUID } from "node:crypto";

export type AtlasVisibility = "private" | "internal" | "public";
export type AtlasEventType =
  | "document.created"
  | "document.versioned"
  | "identity.linked"
  | "publication.requested"
  | "federation.synced";

export interface AtlasDocumentInput {
  tenantId: string;
  title: string;
  content: string;
  contentType: "text/plain" | "text/markdown" | "application/json";
  authorId: string;
  visibility?: AtlasVisibility;
  tags?: string[];
  sourceUri?: string;
}

export interface AtlasDocument {
  id: string;
  tenantId: string;
  title: string;
  content: string;
  contentType: AtlasDocumentInput["contentType"];
  authorId: string;
  visibility: AtlasVisibility;
  tags: string[];
  sourceUri?: string;
  version: number;
  contentDigest: string;
  createdAt: string;
  updatedAt: string;
}

export interface AtlasEvent {
  id: string;
  tenantId: string;
  type: AtlasEventType;
  aggregateId: string;
  actorId: string;
  occurredAt: string;
  metadata: Record<string, string>;
}

export interface AtlasFederationAdapter {
  readonly id: string;
  publish(document: AtlasDocument): Promise<{ externalId: string; uri?: string }>;
}

export interface AtlasRepository {
  saveDocument(document: AtlasDocument): Promise<void>;
  appendEvent(event: AtlasEvent): Promise<void>;
}

export class AtlasValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AtlasValidationError";
  }
}

export class AtlasCore {
  constructor(private readonly repository: AtlasRepository) {}

  async registerDocument(input: AtlasDocumentInput): Promise<AtlasDocument> {
    const document = normalizeDocument(input);
    await this.repository.saveDocument(document);
    await this.repository.appendEvent({
      id: randomUUID(),
      tenantId: document.tenantId,
      type: "document.created",
      aggregateId: document.id,
      actorId: document.authorId,
      occurredAt: document.createdAt,
      metadata: { contentDigest: document.contentDigest, version: "1" },
    });
    return document;
  }

  async publishDocument(
    document: AtlasDocument,
    adapter: AtlasFederationAdapter,
    actorId: string,
  ): Promise<{ externalId: string; uri?: string }> {
    if (document.visibility !== "public") {
      throw new AtlasValidationError("Only public documents may be federated.");
    }
    const result = await adapter.publish(document);
    await this.repository.appendEvent({
      id: randomUUID(),
      tenantId: document.tenantId,
      type: "federation.synced",
      aggregateId: document.id,
      actorId,
      occurredAt: new Date().toISOString(),
      metadata: { adapter: adapter.id, externalId: result.externalId },
    });
    return result;
  }
}

function normalizeDocument(input: AtlasDocumentInput): AtlasDocument {
  const tenantId = input.tenantId.trim();
  const authorId = input.authorId.trim();
  const title = input.title.trim();
  const content = input.content.trim();
  if (!tenantId || !authorId || !title || !content) {
    throw new AtlasValidationError("tenantId, authorId, title and content are required.");
  }
  if (title.length > 240) throw new AtlasValidationError("Document title is too long.");
  if (content.length > 5_000_000)
    throw new AtlasValidationError("Document content exceeds the 5 MB limit.");
  const now = new Date().toISOString();
  return {
    id: randomUUID(),
    tenantId,
    title,
    content,
    contentType: input.contentType,
    authorId,
    visibility: input.visibility ?? "private",
    tags: [
      ...new Set((input.tags ?? []).map((tag) => tag.trim().toLowerCase()).filter(Boolean)),
    ].slice(0, 32),
    sourceUri: input.sourceUri?.trim() || undefined,
    version: 1,
    contentDigest: createHash("sha256").update(content).digest("hex"),
    createdAt: now,
    updatedAt: now,
  };
}

export function createInMemoryAtlasRepository(): AtlasRepository & {
  documents: AtlasDocument[];
  events: AtlasEvent[];
} {
  const documents: AtlasDocument[] = [];
  const events: AtlasEvent[] = [];
  return {
    documents,
    events,
    async saveDocument(document) {
      documents.push(document);
    },
    async appendEvent(event) {
      events.push(event);
    },
  };
}

export function createAtlasEventIdempotencyKey(
  event: Pick<AtlasEvent, "tenantId" | "type" | "aggregateId">,
): string {
  return createHash("sha256")
    .update(`${event.tenantId}:${event.type}:${event.aggregateId}`)
    .digest("hex");
}
