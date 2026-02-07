// app/my/components/RewardAdButton.tsx

'use client';

import { useState, useEffect } from 'react';
import { ADMOB_CONFIG, getPlatform, getAdUnitId, REWARD_POINTS } from '@/lib/admob';

interface RewardAdButtonProps {
  onRewardEarned: (points: number) => void;
  disabled?: boolean;
}

/* =========================
   🚫 광고 비활성화 플래그
   (심사 중: true / 운영 시: false)
========================= */
const ADS_DISABLED = true;

/* =========================
   AdMob 타입 선언
========================= */
declare global {
  interface Window {
    admob?: {
      rewardvideo: {
        config: (options: {
          id: string;
          isTesting?: boolean;
          autoShow?: boolean;
        }) => void;
        load: () => void;
        show: () => void;
      };
      addEventListener: (event: string, callback: () => void) => void;
      removeEventListener: (event: string, callback: () => void) => void;
    };
    adsbygoogle?: any[];
  }
}

export default function RewardAdButton({
  onRewardEarned,
  disabled,
}: RewardAdButtonProps) {
  const [loading, setLoading] = useState(false);
  const [adReady, setAdReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const platform = getPlatform();

  /* =========================
     WEB (AdSense)
     - 현재 완전 차단
  ========================= */
  useEffect(() => {
    if (platform !== 'web') return;

    if (ADS_DISABLED) {
      // 광고 준비된 척만
      setAdReady(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js';
    script.async = true;
    script.crossOrigin = 'anonymous';
    script.setAttribute('data-ad-client', ADMOB_CONFIG.adSenseClientId);

    script.onload = () => {
      setAdReady(true);
    };

    script.onerror = () => {
      setError('광고를 불러올 수 없습니다');
    };

    document.head.appendChild(script);

    return () => {
      script.remove();
    };
  }, [platform]);

  /* =========================
     MOBILE (AdMob)
     - 현재 완전 차단
  ========================= */
  useEffect(() => {
    if (platform === 'web') return;
    if (ADS_DISABLED) {
      setAdReady(true);
      return;
    }

    if (!window.admob) {
      setError('광고를 불러올 수 없습니다');
      return;
    }

    const adUnitId = getAdUnitId();

    window.admob.rewardvideo.config({
      id: adUnitId,
      isTesting: true,
      autoShow: false,
    });

    loadMobileAd();

    const handleLoad = () => {
      setAdReady(true);
      setLoading(false);
    };

    const handleFail = () => {
      setError('광고를 불러올 수 없습니다');
      setLoading(false);
      setAdReady(false);
    };

    const handleClose = () => {
      setAdReady(false);
      loadMobileAd();
    };

    const handleReward = () => {
      onRewardEarned(REWARD_POINTS);
    };

    window.admob.addEventListener('admob.rewardvideo.events.LOAD', handleLoad);
    window.admob.addEventListener('admob.rewardvideo.events.LOAD_FAIL', handleFail);
    window.admob.addEventListener('admob.rewardvideo.events.CLOSE', handleClose);
    window.admob.addEventListener('admob.rewardvideo.events.REWARD', handleReward);

    return () => {
      window.admob?.removeEventListener('admob.rewardvideo.events.LOAD', handleLoad);
      window.admob?.removeEventListener('admob.rewardvideo.events.LOAD_FAIL', handleFail);
      window.admob?.removeEventListener('admob.rewardvideo.events.CLOSE', handleClose);
      window.admob?.removeEventListener('admob.rewardvideo.events.REWARD', handleReward);
    };
  }, [platform, onRewardEarned]);

  /* =========================
     Mobile Ad Load
  ========================= */
  const loadMobileAd = () => {
    if (!window.admob) return;
    setLoading(true);
    setError(null);

    try {
      window.admob.rewardvideo.load();
    } catch {
      setError('광고를 불러올 수 없습니다');
      setLoading(false);
    }
  };

  /* =========================
     Click Handlers
  ========================= */
  const showWebAd = () => {
    setLoading(true);

    if (ADS_DISABLED) {
      // 🔒 무한 로딩 상태 유지
      return;
    }
  };

  const showMobileAd = () => {
    setLoading(true);

    if (ADS_DISABLED) {
      // 🔒 무한 로딩 상태 유지
      return;
    }

    if (!window.admob || !adReady) {
      setError('광고가 준비되지 않았습니다');
      setLoading(false);
      return;
    }

    try {
      window.admob.rewardvideo.show();
    } catch {
      setError('광고 표시 중 오류가 발생했습니다');
      setLoading(false);
    }
  };

  const handleClick = () => {
    platform === 'web' ? showWebAd() : showMobileAd();
  };

  /* =========================
     UI
  ========================= */
  if (error && !loading) {
    return (
      <button
        onClick={() => {
          setError(null);
          setAdReady(true);
        }}
        className="w-full py-3 border rounded-lg"
      >
        다시 시도
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      disabled={disabled || !adReady}
      className="w-full py-4 border rounded-lg font-semibold disabled:opacity-40 hover:bg-gray-100"
    >
      {loading
        ? '광고 불러오는 중…'
        : `광고 보고 ${REWARD_POINTS}P 받기`}
    </button>
  );
}
