CREATE TABLE REQUESTS(
    id BIGSERIAL PRIMARY KEY,
    request_from BIGINT REFERENCES USERS(id) NOT NULL,
    request_to BIGINT REFERENCES USERS(id) NOT NULL,
    job_id varchar NOT NULL,
    company_id BIGINT REFERENCES COMPANIES(id) NOT NULL,
    job_url varchar NOT NULL,
    job_name varchar NOT NULL,
    referral_status SMALLINT NOT NULL DEFAULT 0,
	referral_acknowledge 
)