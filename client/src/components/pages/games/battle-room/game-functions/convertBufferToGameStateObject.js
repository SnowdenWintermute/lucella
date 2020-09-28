import cloneDeep from "lodash.clonedeep";

export const convertBufferToGameStateObject = ({ data, model }) => {
  const packet = new Int32Array(data);
  console.log(packet);
  const decodedPacket = {
    lastProcessedCommands: {
      host: packet[0],
      challenger: packet[1],
    },
    orbs: {
      hostOrbs: [
        {
          xPos: packet[2],
          yPos: packet[3],
          heading: { xPos: packet[4], yPos: packet[5] },
        },
        {
          xPos: packet[6],
          yPos: packet[7],
          heading: { xPos: packet[8], yPos: packet[9] },
        },
        {
          xPos: packet[10],
          yPos: packet[11],
          heading: { xPos: packet[12], yPos: packet[13] },
        },
        {
          xPos: packet[14],
          yPos: packet[15],
          heading: { xPos: packet[16], yPos: packet[17] },
        },
        {
          xPos: packet[18],
          yPos: packet[19],
          heading: { xPos: packet[20], yPos: packet[21] },
        },
      ],
      challengerOrbs: [
        [
          {
            xPos: packet[22],
            yPos: packet[23],
            heading: { xPos: packet[24], yPos: packet[25] },
          },
          {
            xPos: packet[26],
            yPos: packet[27],
            heading: { xPos: packet[28], yPos: packet[29] },
          },
          {
            xPos: packet[30],
            yPos: packet[31],
            heading: { xPos: packet[32], yPos: packet[33] },
          },
          {
            xPos: packet[34],
            yPos: packet[35],
            heading: { xPos: packet[36], yPos: packet[37] },
          },
          {
            xPos: packet[38],
            yPos: packet[39],
            heading: { xPos: packet[40], yPos: packet[41] },
          },
        ],
      ],
    },
    score: {
      host: packet[42],
      challenger: packet[43],
      neededToWin: packet[44],
    },
    dashes: {
      host: {
        dashes: packet[45],
        recharging: packet[46],
        cooldown: packet[47],
      },
      challenger: {
        dashes: packet[48],
        recharging: packet[49],
        cooldown: packet[50],
      },
    },
    endzones: {
      host: {
        x: packet[51],
        y: packet[52],
        width: packet[53],
        height: packet[54],
      },
      challenger: {
        x: packet[55],
        y: packet[56],
        width: packet[57],
        height: packet[58],
      },
    },
  };
  return decodedPacket;
};
