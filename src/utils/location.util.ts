import geoip from 'geoip-lite';

export function getLocationFromIP(ip: string) {
  if (ip === '127.0.0.1' || ip === '::1' || ip === 'Unknown IP') {
    return undefined;
  }
  
  const geo = geoip.lookup(ip);
  if (geo) {
    return `${geo.city}, ${geo.country}`;
  }
  return undefined;
}