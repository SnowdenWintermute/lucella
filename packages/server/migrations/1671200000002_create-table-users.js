/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.sql(`
        CREATE TABLE users (
            id SERIAL PRIMARY KEY,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            name VARCHAR(24) NOT NULL UNIQUE,        
            email VARCHAR(254) NOT NULL UNIQUE,
            password VARCHAR(60) NOT NULL,
            role user_role NOT NULL DEFAULT 'user',
            status user_status NOT NULL DEFAULT 'active'
        );
    `);
};

exports.down = (pgm) => {
  pgm.sql(`
        DROP TABLE users;
    `);
};
