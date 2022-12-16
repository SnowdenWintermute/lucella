/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.sql(`
        CREATE TABLE battle_room_game_records (
            id SERIAL PRIMARY KEY,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            player_1_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
            player_2_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
            player_1_score INTEGER NOT NULL,
            player_2_score INTEGER NOT NULL
        );
    `);
};

exports.down = (pgm) => {
  pgm.sql(`
        DROP TABLE battle_room_game_records;
    `);
};
