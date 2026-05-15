CREATE TABLE IF NOT EXISTS runs (
  id text PRIMARY KEY,
  created_at timestamptz NOT NULL,
  mode text NOT NULL CHECK (
    mode IN ('founder', 'student_builder', 'operator', 'creator')
  ),
  input_summary text NOT NULL,
  daily_dump text NOT NULL,
  voice_samples text NOT NULL DEFAULT '',
  response_json jsonb NOT NULL,
  inserted_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS runs_created_at_idx ON runs (created_at DESC);
