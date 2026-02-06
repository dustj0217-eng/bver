// app/my/RewardAdButton.tsx
'use client';

import { useState, useEffect } from 'react';
import { ADMOB_CONFIG, getPlatform } from '@/lib/admob';

interface RewardAdButtonProps {
  onRewardEarned: (points: number) => void;
  disabled?: boolean;
}

// AdMob 타입 선언
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
        isReady: (callback: (isReady: boolean) => void) => void;
      };
      addEventListener: (event: string, callback: () => void) => void;
      removeEventListener: (event: string, callback: () => void) => void;
    };
  }
}

export default function RewardAdButton({ onRewardEarned, disabled }: RewardAdButtonProps) {
  const [loading, setLoading] = useState(false);
  const [adReady, setAdReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const platform = getPlatform();

  useEffect(() => {
    if (platform === 'web') {
      setError('광고는 모바일 앱에서만 사용 가능합니다');
      return;
    }

    // AdMob SDK 확인
    if (!window.admob) {
      setError('광고 SDK를 로드할 수 없습니다');
      return;
    }

    // 광고 설정
    window.admob.rewardvideo.config({
      id: ADMOB_CONFIG.rewardAdUnitId,
      isTesting: false,
      autoShow: false,
    });

    // 광고 로드
    loadAd();

    // 이벤트 리스너 등록
    const handleAdLoaded = () => {
      console.log('광고 로드 완료');
      setAdReady(true);
      setLoading(false);
    };

    const handleAdFailedToLoad = () => {
      console.error('광고 로드 실패');
      setError('광고를 불러올 수 없습니다');
      setLoading(false);
      setAdReady(false);
    };

    const handleAdClosed = () => {
      console.log('광고 닫힘');
      setAdReady(false);
      loadAd();
    };

    const handleRewarded = () => {
      console.log('광고 시청 완료 - 보상 지급');
      onRewardEarned(100);
    };

    window.admob.addEventListener('admob.rewardvideo.events.LOAD', handleAdLoaded);
    window.admob.addEventListener('admob.rewardvideo.events.LOAD_FAIL', handleAdFailedToLoad);
    window.admob.addEventListener('admob.rewardvideo.events.CLOSE', handleAdClosed);
    window.admob.addEventListener('admob.rewardvideo.events.REWARD', handleRewarded);

    return () => {
      if (window.admob) {
        window.admob.removeEventListener('admob.rewardvideo.events.LOAD', handleAdLoaded);
        window.admob.removeEventListener('admob.rewardvideo.events.LOAD_FAIL', handleAdFailedToLoad);
        window.admob.removeEventListener('admob.rewardvideo.events.CLOSE', handleAdClosed);
        window.admob.removeEventListener('admob.rewardvideo.events.REWARD', handleRewarded);
      }
    };
  }, [platform, onRewardEarned]);

  const loadAd = () => {
    if (!window.admob) return;
    
    setLoading(true);
    setError(null);
    
    try {
      window.admob.rewardvideo.load();
    } catch (err) {
      console.error('광고 로드 오류:', err);
      setError('광고 로드 중 오류가 발생했습니다');
      setLoading(false);
    }
  };

  const showAd = () => {
    if (!window.admob || !adReady) {
      setError('광고가 준비되지 않았습니다');
      return;
    }

    try {
      window.admob.rewardvideo.show();
    } catch (err) {
      console.error('광고 표시 오류:', err);
      setError('광고 표시 중 오류가 발생했습니다');
    }
  };

  // 웹 환경인 경우
  if (platform === 'web') {
    return (
      <div className="w-full p-4 bg-white border border-gray-200 rounded-lg text-center">
        <p className="text-sm text-gray-500">
          광고는 모바일 앱에서만 사용 가능합니다
        </p>
      </div>
    );
  }

  // 에러 상태
  if (error && !loading) {
    return (
      <div className="space-y-2">
        <div className="w-full p-4 bg-white border border-red-200 rounded-lg text-center">
          <p className="text-sm text-red-600">{error}</p>
        </div>
        <button
          onClick={loadAd}
          className="w-full py-3 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium text-sm hover:bg-gray-50 transition-colors"
        >
          다시 시도
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={showAd}
      disabled={loading || disabled || !adReady}
      className="w-full py-4 bg-white border border-gray-900 text-gray-900 rounded-lg font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
    >
      {loading ? (
        <span className="flex items-center justify-center gap-2">
          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          광고 불러오는 중
        </span>
      ) : adReady ? (
        '광고 보고 100P 받기'
      ) : (
        '광고 준비 중'
      )}
    </button>
  );
}