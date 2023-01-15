import IpBanRepo from "../database/repos/ip-bans";

export default async function ipAddressIsBanned(ipAddress: string) {
  const ban = await IpBanRepo.findOne(ipAddress);
  if (ban) {
    if (Date.now() > new Date(ban.expiresAt).getTime()) await IpBanRepo.delete(ipAddress);
    else {
      console.log(`banned ip ${ipAddress} attempted to send http request`);
      return true;
    }
  }
  return false;
}
