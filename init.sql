-- Active: 1670843585452@@127.0.0.1@5432@postgres
CREATE TABLE person (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  isactivated BOOLEAN,
  activationlink VARCHAR(255),
  name VARCHAR(255),
  surname VARCHAR(255)
);

CREATE TABLE token (
  id SERIAL PRIMARY KEY,
  refreshtoken VARCHAR NOT NULL,
  userid SERIAL,
  CONSTRAINT fk_id
    FOREIGN KEY(userId)
      REFERENCES person(id)
);