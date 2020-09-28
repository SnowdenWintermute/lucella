const isEqual = require("lodash.isequal");
const cloneDeep = require("lodash.clonedeep");

function createGameUpdateInterval({ io, gameData }) {
  return setInterval(() => {
    // create a packet with any data that changed to send to client
    const { gameState } = gameData;

    const createArrayFromObject = (obj) => {
      const arr = [];
      if (Object.keys(obj).length > 0) {
        Object.keys(obj).forEach((key) => {
          if (!obj[key]) {
            arr.push(0);
          } else if (Object.keys(obj[key]).length > 1) {
            createArrayFromObject(obj[key]).forEach((item) => {
              if (typeof item === "number") arr.push(item);
            });
          } else {
            arr.push(obj[key]);
          }
        });
      }
      return arr;
    };

    function getDeepKeys(obj) {
      var keys = [];
      for (var key in obj) {
        keys.push(key);
        if (typeof obj[key] === "object") {
          var subkeys = getDeepKeys(obj[key]);
          keys = keys.concat(
            subkeys.map(function (subkey) {
              return key + "." + subkey;
            }),
          );
        }
      }
      return keys;
    }
    console.log(getDeepKeys(gameState));
    console.log(getDeepKeys(gameState).length);
    console.log(createArrayFromObject(gameState).flat(4).length);
    const testPacket = new Int32Array(createArrayFromObject(gameState).flat(4));

    let newPacket = {};
    Object.keys(gameData.lastUpdatePacket).forEach((key) => {
      if (key == "intervals" || key == "lastUpdatePacket") return;
      if (!isEqual(gameData.lastUpdatePacket[key], gameData[key])) {
        if (
          typeof gameData[key] === "object" ||
          typeof gameData[key] === "array"
        ) {
          newPacket[key] = cloneDeep(gameData[key]);
          gameData.lastUpdatePacket[key] = cloneDeep(gameData[key]);
        } else {
          newPacket[key] = gameData[key];
          gameData.lastUpdatePacket[key] = gameData[key];
        }
      }
    });

    console.log(Buffer.byteLength(testPacket.buffer));
    io.to(`game-${gameData.gameName}`).emit(
      "bufferTickFromServer",
      testPacket.buffer,
    );
    io.to(`game-${gameData.gameName}`).emit("tickFromServer", newPacket);
  }, 45);
}

module.exports = createGameUpdateInterval;
