/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.sql(`
        CREATE TYPE ban_reason as ENUM ('rate_limit_abuse', 'chat');
    `);
};

exports.down = (pgm) => {
  pgm.sql(`
        DROP TYPE ban_reason;
    `);
};
