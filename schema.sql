DROP TABLE IF EXISTS search_result;

CREATE TABLE search_result (
    id SERIAL PRIMARY KEY,
    pet_type VARCHAR(255),
    pet_name VARCHAR(255),
    gender VARCHAR(255),
    breed VARCHAR(255),
    pet_weight VARCHAR(255),
    img VARCHAR(255),
    description TEXT,
    origin VARCHAR(255),
    search_req VARCHAR(255)
);