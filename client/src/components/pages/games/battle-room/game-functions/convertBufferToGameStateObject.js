export const convertBufferToGameStateObject = ({ data }) => {
  const packet = new Int32Array(data);
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
          isGhost: packet[6],
        },
        {
          xPos: packet[7],
          yPos: packet[8],
          heading: { xPos: packet[9], yPos: packet[10] },
          isGhost: packet[11],
        },
        {
          xPos: packet[12],
          yPos: packet[13],
          heading: { xPos: packet[14], yPos: packet[15] },
          isGhost: packet[16],
        },
        {
          xPos: packet[17],
          yPos: packet[18],
          heading: { xPos: packet[19], yPos: packet[20] },
          isGhost: packet[21],
        },
        {
          xPos: packet[22],
          yPos: packet[23],
          heading: { xPos: packet[24], yPos: packet[25] },
          isGhost: packet[26],
        },
      ],
      challengerOrbs: [
        {
          xPos: packet[27],
          yPos: packet[28],
          heading: { xPos: packet[29], yPos: packet[30] },
          isGhost: packet[31],
        },
        {
          xPos: packet[32],
          yPos: packet[33],
          heading: { xPos: packet[34], yPos: packet[35] },
          isGhost: packet[36],
        },
        {
          xPos: packet[37],
          yPos: packet[38],
          heading: { xPos: packet[39], yPos: packet[40] },
          isGhost: packet[41],
        },
        {
          xPos: packet[42],
          yPos: packet[43],
          heading: { xPos: packet[44], yPos: packet[45] },
          isGhost: packet[46],
        },
        {
          xPos: packet[47],
          yPos: packet[48],
          heading: { xPos: packet[49], yPos: packet[50] },
          isGhost: packet[51],
        },
      ],
    },
    score: {
      host: packet[52],
      challenger: packet[53],
    },
  };
  return decodedPacket;
};
