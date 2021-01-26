CREATE TABLE REQUESTS(
    id BIGSERIAL PRIMARY KEY,
    request_from BIGINT REFERENCES USERS(id) NOT NULL,
    request_to BIGINT REFERENCES USERS(id) NOT NULL,
    job_id VARCHAR NOT NULL,
    company_id BIGINT REFERENCES COMPANIES(id) NOT NULL,
    job_url VARCHAR NOT NULL,
    job_name VARCHAR NOT NULL,
    referral_status SMALLINT NOT NULL DEFAULT 0,
	referral_acknowledge SMALLINT NOT NULL DEFAULT 0,
	created_on TIMESTAMP NOT NULL DEFAULT NOW(),
	referrer_comment VARCHAR,
	referee_comment VARCHAR
);

CREATE INDEX REQUESTS_PRIMARY_INDEX ON REQUESTS (id);

INSERT INTO REQUESTS(request_from, request_to, job_id, company_id, job_url, job_name ) 
VALUES(2, 1, 'AMDOCS-231312', 2, 'amdocs.com/job/231312', 'AMDOCS CEO');