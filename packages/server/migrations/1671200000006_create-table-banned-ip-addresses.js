/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.sql(`
        CREATE TABLE banned_ip_addresses (
            id SERIAL PRIMARY KEY,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            ip_address INET NOT NULL UNIQUE,
            expires_at TIMESTAMP WITH TIME ZONE,
            reason ban_reason
        );
    `);
};

exports.down = (pgm) => {
  pgm.sql(`
        DROP TABLE banned_ip_addresses;
    `);
};
