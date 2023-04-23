/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.sql(`
  CREATE TABLE battle_room_game_settings (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    acceleration INTEGER,
    top_speed INTEGER,
    turning_speed_modifier INTEGER,
    hard_braking_speed INTEGER,
    speed_increment_rate INTEGER,
    number_of_rounds_required_to_win INTEGER
);
    `);
};

exports.down = (pgm) => {
  pgm.sql(`
        DROP TABLE battle_room_game_settings;
    `);
};
