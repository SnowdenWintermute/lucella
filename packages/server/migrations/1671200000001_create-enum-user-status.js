/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.sql(`
        CREATE TYPE user_status as ENUM ('active', 'deleted', 'banned');
    `);
};

exports.down = (pgm) => {
  pgm.sql(`
        DROP TYPE user_status;
    `);
};
