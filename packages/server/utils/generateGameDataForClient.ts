const cloneDeep = require("lodash.clonedeep");

export default function ({ gameData }) {
  const gameDataForClient = {};
  Object.keys(gameData).forEach((key) => {
    if (key !== "intervals") gameDataForClient[key] = cloneDeep(gameData[key]);
  });
  return gameDataForClient;
}
