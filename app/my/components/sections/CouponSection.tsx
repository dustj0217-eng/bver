// app/my/components/sections/CouponSections.tsx
'use client';

import { useState, useEffect } from 'react';
import { collection, query, getDocs, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import EmptyState from '@/app/my/components/EmptyState';

interface Coupon {
  id: string;
  code: string;
  eventId: string;
  eventTitle: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minPurchase?: number;
  maxDiscount?: number;
  issuedAt: any;
  expiresAt: any;
  usedAt: any | null;
  isUsed: boolean;
}

interface CouponSectionProps {
  userId: string;
}

export default function CouponSection({ userId }: CouponSectionProps) {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [activeTab, setActiveTab] = useState<'available' | 'used'>('available');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        setLoading(true);
        const couponsRef = collection(db, `users/${userId}/coupons`);
        const q = query(couponsRef, orderBy('issuedAt', 'desc'));
        const snapshot = await getDocs(q);
        
        const couponList = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as Coupon[];
        
        setCoupons(couponList);
      } catch (error) {
        console.error('Failed to fetch coupons:', error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchCoupons();
    }
  }, [userId]);

  const now = new Date();
  const availableCoupons = coupons.filter(c => 
    !c.isUsed && c.expiresAt?.toDate() > now
  );
  const usedCoupons = coupons.filter(c => 
    c.isUsed || c.expiresAt?.toDate() <= now
  );

  const displayCoupons = activeTab === 'available' ? availableCoupons : usedCoupons;

  if (loading) {
    return (
      <div className="pt-2 py-8 text-center text-sm text-gray-400">
        쿠폰을 불러오는 중...
      </div>
    );
  }

  return (
    <div className="pt-2">
      {/* 탭 */}
      <div className="flex gap-2 mb-4 border-b">
        <button
          onClick={() => setActiveTab('available')}
          className={`px-4 py-2 font-medium text-sm ${
            activeTab === 'available'
              ? 'border-b-2 border-black text-black'
              : 'text-gray-500'
          }`}
        >
          사용 가능 ({availableCoupons.length})
        </button>
        <button
          onClick={() => setActiveTab('used')}
          className={`px-4 py-2 font-medium text-sm ${
            activeTab === 'used'
              ? 'border-b-2 border-black text-black'
              : 'text-gray-500'
          }`}
        >
          사용 완료/만료 ({usedCoupons.length})
        </button>
      </div>

      {/* 쿠폰 리스트 */}
      {displayCoupons.length === 0 ? (
        <EmptyState 
          text={activeTab === 'available' ? '사용 가능한 쿠폰이 없습니다' : '사용 내역이 없습니다'}
          subtext={activeTab === 'available' ? '이벤트에서 쿠폰을 받아보세요' : ''}
        />
      ) : (
        <div className="space-y-3">
          {displayCoupons.map(coupon => {
            const isExpired = coupon.expiresAt?.toDate() <= now;
            const isDisabled = coupon.isUsed || isExpired;
            
            return (
              <div
                key={coupon.id}
                className={`border rounded-xl p-4 transition-all ${
                  isDisabled
                    ? 'opacity-50 bg-gray-50 border-gray-200'
                    : 'bg-gradient-to-br from-yellow-50 to-white border-2 border-yellow-400 shadow-sm'
                }`}
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-bold text-sm">{coupon.eventTitle}</h3>
                  <span className="text-xs font-mono bg-gray-900 text-white px-2 py-1 rounded">
                    {coupon.code}
                  </span>
                </div>
                
                <p className="text-xl font-bold text-yellow-600 mb-2">
                  {coupon.discountType === 'percentage' 
                    ? `${coupon.discountValue}% 할인` 
                    : `${coupon.discountValue.toLocaleString()}원 할인`}
                </p>
                
                <div className="space-y-1">
                  {coupon.minPurchase && (
                    <p className="text-xs text-gray-600">
                      • {coupon.minPurchase.toLocaleString()}원 이상 구매시
                    </p>
                  )}
                  
                  {coupon.maxDiscount && coupon.discountType === 'percentage' && (
                    <p className="text-xs text-gray-600">
                      • 최대 {coupon.maxDiscount.toLocaleString()}원 할인
                    </p>
                  )}
                  
                  <p className="text-xs text-gray-500 pt-1">
                    {coupon.isUsed 
                      ? `✓ 사용 완료: ${coupon.usedAt?.toDate().toLocaleDateString()}`
                      : isExpired
                      ? '✕ 기간 만료'
                      : `유효기간: ~${coupon.expiresAt?.toDate().toLocaleDateString()}`
                    }
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}