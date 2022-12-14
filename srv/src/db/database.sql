CREATE TABLE IF NOT EXISTS person (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        isActivated BOOLEAN,
        activationLink VARCHAR(255),
        name VARCHAR(255),
        surname VARCHAR(255)
    );

CREATE TABLE IF NOT EXISTS token(
        id SERIAL PRIMARY KEY,
        refreshToken VARCHAR NOT NULL,
        userId INTEGER,
        FOREIGN KEY (userId) REFERENCES person (id)
    );