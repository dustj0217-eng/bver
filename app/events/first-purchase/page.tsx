// app/events/first-purchase/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc, setDoc, collection } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

export default function FirstPurchaseEvent() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState(false);
  const [hasCoupon, setHasCoupon] = useState(false);

  // 이벤트 정보 (나중에 노션에서 가져오기)
  const eventData = {
    id: 'first-purchase-2026-02',
    title: '첫 구매 30% 할인',
    couponCode: 'BEAVER2602',
    discountType: 'percentage',
    discountValue: 30,
    endDate: '2026-02-28',
    minPurchase: 0,
    maxDiscount: 20000,
  };

  // 로그인 상태 확인
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      
      if (currentUser) {
        // 이미 쿠폰 받았는지 확인
        const couponRef = doc(db, `users/${currentUser.uid}/coupons/${eventData.id}`);
        const couponDoc = await getDoc(couponRef);
        setHasCoupon(couponDoc.exists());
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // 쿠폰 받기
  const handleClaimCoupon = async () => {
    if (!user) {
      // 로그인 안 되어 있으면 로그인 페이지로
      alert('로그인이 필요합니다!');
      router.push('/my/login');
      return;
    }

    if (hasCoupon) {
      alert('이미 받으신 쿠폰입니다!');
      return;
    }

    setClaiming(true);

    try {
      const couponRef = doc(db, `users/${user.uid}/coupons/${eventData.id}`);
      
      await setDoc(couponRef, {
        code: eventData.couponCode,
        eventId: eventData.id,
        eventTitle: eventData.title,
        discountType: eventData.discountType,
        discountValue: eventData.discountValue,
        minPurchase: eventData.minPurchase,
        maxDiscount: eventData.maxDiscount,
        issuedAt: new Date(),
        expiresAt: new Date(eventData.endDate),
        usedAt: null,
        isUsed: false,
      });

      setHasCoupon(true);
      alert('쿠폰이 발급되었습니다!\nMY 페이지에서 확인하세요.');
    } catch (error) {
      console.error('쿠폰 발급 실패:', error);
      alert('쿠폰 발급에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setClaiming(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>로딩 중...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* 히어로 섹션 */}
      <div className="max-w-3xl mx-auto px-4 py-12">
        {/* 배너 이미지 */}
        <div className="relative aspect-video mb-8 rounded-2xl overflow-hidden">
          <Image
            src="/follow.jpg"
            alt="첫 구매 30% 할인"
            fill
            className="object-cover"
          />
        </div>

        {/* 제목 */}
        <h1 className="text-3xl md:text-4xl font-display font-bold text-center mb-4">
          첫 구매 30% 할인
        </h1>
        <p className="text-center text-gray-600 mb-8">
          비버하우스에 오신 것을 환영합니다!<br />
          첫 구매 고객님을 위한 특별 혜택을 준비했어요.
        </p>

        {/* 쿠폰 정보 박스 */}
        <div className="bg-white rounded-2xl p-8 mb-8 border-2">
          <div className="text-center mb-6">
            <p className="text-sm text-gray-600 mb-2">쿠폰 코드</p>
            <div className="inline-block bg-yellow-100 px-6 py-3 rounded-lg">
              <code className="text-2xl font-mono font-bold text-yellow-900">
                {eventData.couponCode}
              </code>
            </div>
          </div>

          {/* 할인 정보 */}
          <div className="text-center mb-6">
            <p className="text-4xl font-bold text-yellow-600 mb-2">
              {eventData.discountValue}% 할인
            </p>
            <p className="text-sm text-gray-600">
              최대 {eventData.maxDiscount.toLocaleString()}원까지
            </p>
          </div>

          {/* 쿠폰 받기 버튼 */}
          <button
            onClick={handleClaimCoupon}
            disabled={claiming || hasCoupon}
            className={`w-full py-4 rounded-lg font-bold text-lg transition-all ${
              hasCoupon
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                : 'bg-black text-white hover:bg-gray-800'
            }`}
          >
            {claiming ? '발급 중...' : hasCoupon ? '✓ 쿠폰 받기 완료' : '쿠폰 받기'}
          </button>

          {!user && (
            <p className="text-xs text-center text-gray-500 mt-3">
              * 로그인 후 쿠폰을 받을 수 있습니다
            </p>
          )}
        </div>

        {/* 혜택 안내 */}
        <div className="bg-gray-50 rounded-xl p-6 mb-8">
          <h3 className="font-bold mb-4">혜택 안내</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>• 모든 상품 30% 할인</li>
            <li>• 최대 할인 금액: 20,000원</li>
            <li>• 1인 1회 사용 가능</li>
            <li>• 유효기간: ~2025.02.28</li>
            <li>• 다른 쿠폰과 중복 사용 불가</li>
          </ul>
        </div>

        {/* CTA */}
        <div className="flex gap-3">
          <a
            href="/shop"
            className="flex-1 py-4 bg-black text-white text-center rounded-lg font-bold hover:bg-gray-800"
          >
            상점 바로가기
          </a>
          <a
            href="/my"
            className="flex-1 py-4 bg-white border-2 border-black text-black text-center rounded-lg font-bold hover:bg-gray-50"
          >
            내 쿠폰 확인
          </a>
        </div>
      </div>
    </div>
  );
}