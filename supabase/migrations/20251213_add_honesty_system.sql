-- Add honesty system fields
ALTER TABLE study_sessions
ADD COLUMN IF NOT EXISTS honesty_declared BOOLEAN DEFAULT TRUE,
ADD COLUMN IF NOT EXISTS honesty_impact INTEGER DEFAULT 0;
