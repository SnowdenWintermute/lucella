const randomFourNumbers = require("./randomFourNumbers");
const uuid = require("uuid");

function makeRandomAnonUsername({ socket, connectedSockets, connectedGuests }) {
  // give them a rand 4 string and if duplicate run it again - danger of loop?
  const randomNums = randomFourNumbers().join("");
  const randomAnonUsername = "Anon" + randomNums;
  try {
    connectedGuests[randomAnonUsername] = {
      username: randomAnonUsername,
      connectedSockets: [socket.id],
    };
    connectedSockets[socket.id] = {
      ...connectedSockets[socket.id],
      username: randomAnonUsername,
      uuid: uuid.v4(),
    };
    console.log(randomAnonUsername);
  } catch (err) {
    console.log(err);
    console.log("error generating random anon name - duplicate?");
    makeRandomAnonName();
  }
  return randomAnonUsername;
}
module.exports = makeRandomAnonUsername;
