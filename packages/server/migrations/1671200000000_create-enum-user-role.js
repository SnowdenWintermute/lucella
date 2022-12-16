/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.sql(`
        CREATE TYPE user_role as ENUM ('user', 'moderator', 'admin');
    `);
};

exports.down = (pgm) => {
  pgm.sql(`
        DROP TYPE user_role;
    `);
};
