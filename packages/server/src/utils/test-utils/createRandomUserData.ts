const randomstring = require("randomstring");

export default function createRandomUserData() {
  const name = `test-${randomstring.generate({
    length: 8,
    charset: "alphanumeric",
  })}`;
  const email = `${name}@gmail.com`;
  const password = "111111";
  const elo = Math.ceil(Math.random() * 2000 + 200);
  const wins = Math.ceil(Math.random() * 200);
  const losses = Math.ceil(Math.random() * 200);
  return { name, email, password, elo, wins, losses };
}
