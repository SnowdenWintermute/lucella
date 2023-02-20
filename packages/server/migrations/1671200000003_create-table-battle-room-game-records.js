/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.sql(`
        CREATE TABLE battle_room_game_records (
            id SERIAL PRIMARY KEY,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            first_player_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
            first_player_score INTEGER NOT NULL,
            first_player_pre_game_elo INTEGER NOT NULL,
            first_player_post_game_elo INTEGER NOT NULL,
            first_player_pre_game_rank INTEGER,
            first_player_post_game_rank INTEGER NOT NULL,
            second_player_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
            second_player_score INTEGER NOT NULL,
            second_player_pre_game_elo INTEGER NOT NULL,
            second_player_post_game_elo INTEGER NOT NULL,
            second_player_pre_game_rank INTEGER,
            second_player_post_game_rank INTEGER NOT NULL
        );
    `);
};

exports.down = (pgm) => {
  pgm.sql(`
        DROP TABLE battle_room_game_records;
    `);
};
