CREATE TABLE IF NOT EXISTS jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    company VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    salary_min INTEGER,
    salary_max INTEGER,
    is_active BOOLEAN NOT NULL DEFAULT true,
    posted_by UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_jobs_posted_by ON jobs (posted_by);
CREATE INDEX IF NOT EXISTS idx_jobs_is_active ON jobs (is_active) WHERE is_active = true;
