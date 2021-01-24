CREATE TABLE COMPANIES(
    id BIGSERIAL PRIMARY KEY,
    total_employees BIGINT NOT NULL DEFAULT 0,
	created_on TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX COMPANIES_PRIMARY_INDEX ON COMPANIES (id);