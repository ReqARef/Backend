CREATE TABLE USERS(
    id BIGSERIAL PRIMARY KEY,
    email varchar(255) UNIQUE,
    first_name varchar(255) NOT NULL,
    last_name varchar(255) NOT NULL,
    password varchar(255) NOT NULL,
    role INTEGER NOT NULL,
    company_name varchar(255),
    experience INTEGER,
    college varchar(255) NOT NULL,
    job_role varchar(255),
    resume varchar(255) NOT NULL,
    created_on TIMESTAMP NOT NULL DEFAULT NOW(),
    last_login TIMESTAMP
);

INSERT INTO 
USERS(
    email,
    first_name,
    last_name,
    password,
    role,
    company_name,
    experience,
    college,
    job_role,
    resume
)
VALUES(
    'salwanrohit1998@gmail.com',
    'Rohit',
    'Salwan',
    'Rohit1@',
    1,
    'Amdocs',
    1,
    'Thapar',
    'SDE',
    'JKBVKJAHSEBGV'
);