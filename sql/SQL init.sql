CREATE ROLE username WITH LOGIN PASSWORD 'password’;
ALTER ROLE username CREATEDB; 
CREATE DATABASE MoneyManager;
GRANT ALL PRIVILEGES ON DATABASE MoneyManager TO username;
CREATE TABLE test(
Id int
);
INSERT INTO test VALUES(1);

CREATE TABLE USERS(
    user_id BIGSERIAL PRIMARY KEY,
    email varchar(255),
    f_name varchar(255) NOT NULL,
    l_name varchar(255) NOT NULL,
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
    f_name,
    l_name,
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