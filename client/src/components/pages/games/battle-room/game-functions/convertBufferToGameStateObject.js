export const convertBufferToGameStateObject = ({ data, gameState }) => {
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
          isSelected: packet[7],
        },
        {
          xPos: packet[8],
          yPos: packet[9],
          heading: { xPos: packet[10], yPos: packet[11] },
          isGhost: packet[12],
          isSelected: packet[13],
        },
        {
          xPos: packet[14],
          yPos: packet[15],
          heading: { xPos: packet[16], yPos: packet[17] },
          isGhost: packet[18],
          isSelected: packet[19],
        },
        {
          xPos: packet[20],
          yPos: packet[21],
          heading: { xPos: packet[22], yPos: packet[23] },
          isGhost: packet[24],
          isSelected: packet[25],
        },
        {
          xPos: packet[26],
          yPos: packet[27],
          heading: { xPos: packet[28], yPos: packet[29] },
          isGhost: packet[30],
          isSelected: packet[31],
        },
      ],
      challengerOrbs: [
        {
          xPos: packet[32],
          yPos: packet[33],
          heading: { xPos: packet[34], yPos: packet[35] },
          isGhost: packet[36],
          isSelected: packet[37],
        },
        {
          xPos: packet[38],
          yPos: packet[39],
          heading: { xPos: packet[40], yPos: packet[41] },
          isGhost: packet[42],
          isSelected: packet[43],
        },
        {
          xPos: packet[44],
          yPos: packet[45],
          heading: { xPos: packet[46], yPos: packet[47] },
          isGhost: packet[48],
          isSelected: packet[49],
        },
        {
          xPos: packet[50],
          yPos: packet[51],
          heading: { xPos: packet[52], yPos: packet[53] },
          isGhost: packet[54],
          isSelected: packet[55],
        },
        {
          xPos: packet[56],
          yPos: packet[57],
          heading: { xPos: packet[58], yPos: packet[59] },
          isGhost: packet[60],
          isSelected: packet[61],
        },
      ],
    },
    score: {
      host: packet[62],
      challenger: packet[63],
    },
  };

  return decodedPacket;
};
