CREATE TABLE USERS(
    email VARCHAR PRIMARY KEY,
	mobile VARCHAR UNIQUE,
    first_name VARCHAR NOT NULL,
    last_name VARCHAR NOT NULL,
    password VARCHAR NOT NULL,
	country VARCHAR,
    role INTEGER NOT NULL,
    company_name VARCHAR REFERENCES COMPANIES(company_name),
    experience INTEGER,
    college VARCHAR,
    job_role VARCHAR,
    resume VARCHAR,
	otp VARCHAR,
	refresh_token VARCHAR,
	email_verified BOOLEAN DEFAULT false,
	phone_verified BOOLEAN DEFAULT false,
	is_blocked BOOLEAN DEFAULT false,
	give_referrals BOOLEAN DEFAULT true,
    last_login TIMESTAMP,
	created_on TIMESTAMP NOT NULL DEFAULT NOW(),
);

CREATE INDEX USERS_EMAIL_PRIMARY_INDEX ON USERS (email);