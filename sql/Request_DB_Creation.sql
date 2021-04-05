CREATE TABLE REQUESTS(
    id VARCHAR PRIMARY KEY,
    request_from VARCHAR REFERENCES USERS(email) NOT NULL,
    request_to VARCHAR REFERENCES USERS(email) NOT NULL,
    job_id VARCHAR NOT NULL,
    company_id VARCHAR REFERENCES COMPANIES(company_name) NOT NULL,
    job_url VARCHAR NOT NULL,
    referral_status SMALLINT NOT NULL DEFAULT 0,
	referral_acknowledge SMALLINT NOT NULL DEFAULT 0,
	created_on TIMESTAMP NOT NULL DEFAULT NOW(),
	referrer_comment VARCHAR,
	referee_comment VARCHAR
);

CREATE INDEX REQUESTS_PRIMARY_INDEX ON REQUESTS (id);

INSERT INTO REQUESTS(request_from, request_to, job_id, company_id, job_url) 
VALUES('salwanrohit1998@gmail.com', 'khajuriakanav5@gmail.com', 'AMDOCS-231312','amdocs', 'amdocs.com/job/231312', 'AMDOCS CEO');
