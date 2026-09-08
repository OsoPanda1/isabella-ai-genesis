-- FGAIS Memory Plane Schema
-- Episodic, Semantic, Procedural Memory with pgvector embeddings

CREATE EXTENSION IF NOT EXISTS vector;

-- EPISODIC MEMORY: Specific events, experiences, time-bound context
CREATE TABLE IF NOT EXISTS episodic_memory (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id VARCHAR(255) NOT NULL,
    actor_id VARCHAR(255) NOT NULL,
    trace_id VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    embedding vector(1536),
    provenance_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP WITH TIME ZONE,
    metadata JSONB DEFAULT '{}'::jsonb
);

CREATE INDEX IF NOT EXISTS idx_episodic_tenant ON episodic_memory(tenant_id);
CREATE INDEX IF NOT EXISTS idx_episodic_expires ON episodic_memory(expires_at);

-- SEMANTIC MEMORY: Facts, general knowledge, concepts independent of time
CREATE TABLE IF NOT EXISTS semantic_memory (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id VARCHAR(255) NOT NULL,
    concept VARCHAR(255) NOT NULL,
    definition TEXT NOT NULL,
    embedding vector(1536),
    provenance_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP WITH TIME ZONE,
    metadata JSONB DEFAULT '{}'::jsonb
);

CREATE INDEX IF NOT EXISTS idx_semantic_tenant ON semantic_memory(tenant_id);
CREATE INDEX IF NOT EXISTS idx_semantic_concept ON semantic_memory(concept);

-- PROCEDURAL MEMORY: Skills, workflows, rulesets, heuristics
CREATE TABLE IF NOT EXISTS procedural_memory (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id VARCHAR(255) NOT NULL,
    action_type VARCHAR(255) NOT NULL,
    rules JSONB NOT NULL,
    provenance_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    metadata JSONB DEFAULT '{}'::jsonb
);

CREATE INDEX IF NOT EXISTS idx_procedural_tenant ON procedural_memory(tenant_id);
CREATE INDEX IF NOT EXISTS idx_procedural_action ON procedural_memory(action_type);

-- AUDIT EVENTS: Ledger for policy decisions and ingestion events
CREATE TABLE IF NOT EXISTS audit_events (
    event_id UUID PRIMARY KEY,
    trace_id VARCHAR(255) NOT NULL,
    actor_id VARCHAR(255) NOT NULL,
    tenant_id VARCHAR(255) NOT NULL,
    action VARCHAR(255) NOT NULL,
    resource VARCHAR(255) NOT NULL,
    decision VARCHAR(50) NOT NULL,
    risk_score INTEGER NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    previous_hash VARCHAR(255) NOT NULL,
    event_hash VARCHAR(255) NOT NULL UNIQUE,
    signature VARCHAR(255) NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_audit_tenant_time ON audit_events(tenant_id, timestamp DESC);
