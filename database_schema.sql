-- NecroNet Supabase Database Schema
-- Run this in Supabase SQL Editor to set up the PostgreSQL tables

-- Create artifacts table
CREATE TABLE artifacts (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    artifact_id UUID NOT NULL UNIQUE DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    artifact_type VARCHAR(50) NOT NULL, -- "flash", "html", "image", "other"
    original_url VARCHAR(2048),
    storage_key VARCHAR(2048) NOT NULL, -- S3 key
    status VARCHAR(50) NOT NULL DEFAULT 'uploaded', -- "uploaded", "migrating", "ready", "failed"
    ghost_narration_url VARCHAR(2048),
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Create index for faster queries
CREATE INDEX idx_artifacts_artifact_id ON artifacts(artifact_id);
CREATE INDEX idx_artifacts_status ON artifacts(status);
CREATE INDEX idx_artifacts_created_at ON artifacts(created_at DESC);
CREATE INDEX idx_artifacts_artifact_type ON artifacts(artifact_type);

-- Enable Row Level Security (optional but recommended)
ALTER TABLE artifacts ENABLE ROW LEVEL SECURITY;

-- Create public read-only policy
CREATE POLICY "Enable read access for all users" ON artifacts
  FOR SELECT USING (true);

-- Create INSERT policy (allow authenticated or public uploads)
CREATE POLICY "Enable insert access for all users" ON artifacts
  FOR INSERT WITH CHECK (true);

-- Create UPDATE policy (allow updates by owner or authenticated users)
CREATE POLICY "Enable update for artifact status" ON artifacts
  FOR UPDATE USING (true) WITH CHECK (true);

-- Create migration_logs table (for audit trail)
CREATE TABLE migration_logs (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    artifact_id UUID NOT NULL REFERENCES artifacts(artifact_id) ON DELETE CASCADE,
    event VARCHAR(100) NOT NULL, -- "upload", "migrate_start", "migrate_complete", "error"
    details JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_migration_logs_artifact_id ON migration_logs(artifact_id);
CREATE INDEX idx_migration_logs_created_at ON migration_logs(created_at DESC);