/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.sql(`
        CREATE TABLE battle_room_score_cards (
            id SERIAL PRIMARY KEY,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            elo INTEGER NOT NULL DEFAULT 1500 CHECK (elo > 0 AND elo < 4000),
            wins INTEGER NOT NULL DEFAULT 0,
            losses INTEGER NOT NULL DEFAULT 0,
            draws INTEGER NOT NULL DEFAULT 0
        );
    `);
};

exports.down = (pgm) => {
  pgm.sql(`
        DROP TABLE battle_room_score_cards;
    `);
};
