import { describe, expect, it } from "vitest";
import { AtlasCore, AtlasValidationError, createInMemoryAtlasRepository } from "@/lib/atlas";

describe("AtlasCore", () => {
  it("registers normalized documents and emits an auditable event", async () => {
    const repository = createInMemoryAtlasRepository();
    const atlas = new AtlasCore(repository);
    const document = await atlas.registerDocument({
      tenantId: " tamv ",
      authorId: "author-1",
      title: "Atlas record",
      content: "Knowledge with provenance",
      contentType: "text/plain",
      visibility: "public",
      tags: ["Knowledge", "knowledge"],
    });

    expect(document.tenantId).toBe("tamv");
    expect(document.tags).toEqual(["knowledge"]);
    expect(document.contentDigest).toHaveLength(64);
    expect(repository.events[0]).toMatchObject({
      type: "document.created",
      aggregateId: document.id,
    });
  });

  it("fails closed when invalid or non-public data is published", async () => {
    const repository = createInMemoryAtlasRepository();
    const atlas = new AtlasCore(repository);
    await expect(
      atlas.registerDocument({
        tenantId: "tenant",
        authorId: "author",
        title: "",
        content: "content",
        contentType: "text/plain",
      }),
    ).rejects.toBeInstanceOf(AtlasValidationError);

    const document = await atlas.registerDocument({
      tenantId: "tenant",
      authorId: "author",
      title: "Private record",
      content: "content",
      contentType: "text/plain",
    });
    await expect(
      atlas.publishDocument(
        document,
        { id: "zenodo", publish: async () => ({ externalId: "x" }) },
        "author",
      ),
    ).rejects.toBeInstanceOf(AtlasValidationError);
  });
});
