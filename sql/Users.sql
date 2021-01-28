CREATE TABLE USERS(
    email VARCHAR PRIMARY KEY,
	mobile VARCHAR UNIQUE NOT NULL,
    first_name VARCHAR NOT NULL,
    last_name VARCHAR NOT NULL,
    password VARCHAR NOT NULL,
    role INTEGER NOT NULL,
    company_name VARCHAR REFERENCES COMPANIES(company_name),
    experience INTEGER,
    college VARCHAR NOT NULL,
    job_role VARCHAR,
    resume VARCHAR NOT NULL,
	otp VARCHAR,
	refresh_token VARCHAR,
    created_on TIMESTAMP NOT NULL DEFAULT NOW(),
    last_login TIMESTAMP
);

CREATE INDEX USERS_EMAIL_PRIMARY_INDEX ON USERS (email);
INSERT INTO USERS(email, first_name, last_name, password, role, company_name, experience, 
college, job_role, resume) VALUES( 'salwanrohit1998@gmail.com', 'Rohit', 'Salwan', 'Rohit1@', 1,
    'AMDOCS', 1, 'Thapar', 'SDE', 'JKBVKJAHSEBGV');
INSERT INTO USERS(email, first_name, last_name, password, role, company_name, experience, 
college, job_role, resume) VALUES( 'khajuriakanav5@gmail.com', 'Kanav', 'Khajuria', 'Kanav1@', 1,
    'CISCO', 1, 'Thapar', 'SDE', 'JKBVKJAHSEBGV');