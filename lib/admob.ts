// lib/admob.ts
export const ADMOB_CONFIG = {
  appId: 'ca-app-pub-1547398510185840~6055500088',
  rewardAdUnitId: 'ca-app-pub-1547398510185840/4143652613',
};

// 플랫폼 감지
export function getPlatform(): 'ios' | 'android' | 'web' {
  if (typeof window === 'undefined') return 'web';
  
  const userAgent = window.navigator.userAgent.toLowerCase();
  if (/iphone|ipad|ipod/.test(userAgent)) return 'ios';
  if (/android/.test(userAgent)) return 'android';
  return 'web';
}