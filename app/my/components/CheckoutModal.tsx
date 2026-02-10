'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { getAvailableCoupons, calculateCouponDiscount, type Coupon } from '@/lib/firestore/coupons';

interface ShippingAddress {
  name: string;
  phone: string;
  zipcode: string;
  address: string;
  addressDetail: string;
}

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: any[];
  totalPrice: number;
  shippingInfo: ShippingAddress;
  userId: string;
  onPaymentComplete: (transferInfo: any) => Promise<void>;
}

export default function CheckoutModal({
  isOpen,
  onClose,
  cartItems,
  totalPrice,
  shippingInfo,
  userId,
  onPaymentComplete,
}: CheckoutModalProps) {
  const [processing, setProcessing] = useState(false);
  const [depositorName, setDepositorName] = useState('');
  
  // 쿠폰 관련 상태
  const [availableCoupons, setAvailableCoupons] = useState<Coupon[]>([]);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);
  const [showCouponList, setShowCouponList] = useState(false);
  const [loadingCoupons, setLoadingCoupons] = useState(false);

  // 쿠폰 목록 불러오기
  useEffect(() => {
    if (!isOpen || !userId) return;

    const loadCoupons = async () => {
      try {
        setLoadingCoupons(true);
        const coupons = await getAvailableCoupons(userId);
        setAvailableCoupons(coupons);
      } catch (error) {
        console.error('Failed to load coupons:', error);
      } finally {
        setLoadingCoupons(false);
      }
    };

    loadCoupons();
  }, [isOpen, userId]);

  if (!isOpen) return null;

  // 할인 금액 계산
  const discountAmount = selectedCoupon 
    ? calculateCouponDiscount(selectedCoupon, totalPrice)
    : 0;

  const finalPrice = totalPrice - discountAmount;

  const handleCouponSelect = (coupon: Coupon) => {
    // 최소 구매 금액 체크
    if (coupon.minPurchase && totalPrice < coupon.minPurchase) {
      alert(`이 쿠폰은 ${coupon.minPurchase.toLocaleString()}원 이상 구매시 사용 가능합니다.`);
      return;
    }

    setSelectedCoupon(coupon);
    setShowCouponList(false);
  };

  const handleCouponRemove = () => {
    setSelectedCoupon(null);
  };

  const handleSubmit = async () => {
    if (!depositorName.trim()) {
      alert('입금자명을 입력해주세요');
      return;
    }

    setProcessing(true);
    try {
      await onPaymentComplete({
        depositorName,
        submittedAt: new Date().toISOString(),
        coupon: selectedCoupon ? {
          id: selectedCoupon.id,
          code: selectedCoupon.code,
          discountAmount,
        } : null,
      });
    } catch (error) {
      console.error(error);
      alert('주문 중 오류가 발생했습니다');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div 
        className="absolute inset-0 bg-black/50"
        onClick={() => !processing && onClose()}
      />
      <div className="relative bg-white rounded-2xl w-full max-w-md max-h-[85vh] flex flex-col">
        {/* 헤더 */}
        <div className="p-6 border-b flex-shrink-0">
          <h2 className="text-xl font-bold">주문/결제</h2>
        </div>

        {/* 스크롤 가능한 컨텐츠 */}
        <div className="overflow-y-auto flex-1 p-6 space-y-6">
          {/* 배송지 정보 */}
          <div>
            <h3 className="text-sm font-semibold mb-3">배송지</h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm font-medium mb-1">{shippingInfo.name}</p>
              <p className="text-sm text-gray-600 mb-1">{shippingInfo.phone}</p>
              <p className="text-sm text-gray-600">
                ({shippingInfo.zipcode}) {shippingInfo.address}
              </p>
              {shippingInfo.addressDetail && (
                <p className="text-sm text-gray-600">{shippingInfo.addressDetail}</p>
              )}
            </div>
          </div>

          {/* 주문 상품 */}
          <div>
            <h3 className="text-sm font-semibold mb-3">주문 상품 ({cartItems.length}개)</h3>
            <div className="space-y-3">
              {cartItems.map((item) => (
                <div key={item.productId} className="flex gap-3 text-sm">
                  <div 
                    className="w-16 h-16 rounded-lg flex-shrink-0 overflow-hidden"
                    style={{ backgroundColor: item.product?.bgColor || '#f3f4f6' }}
                  >
                    {item.product?.image && (
                      <Image
                        src={item.product.image}
                        alt={item.product.name}
                        width={64}
                        height={64}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{item.product?.name}</p>
                    <p className="text-gray-500 text-xs">수량 {item.quantity}개</p>
                    <p className="font-semibold mt-1">
                      {((item.product?.price || 0) * item.quantity).toLocaleString()}원
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 쿠폰 선택 */}
          <div>
            <h3 className="text-sm font-semibold mb-3">
              쿠폰 {availableCoupons.length > 0 && `(${availableCoupons.length}개 사용 가능)`}
            </h3>
            
            {selectedCoupon ? (
              // 선택된 쿠폰 표시
              <div className="bg-gradient-to-br from-yellow-50 to-white border-2 border-yellow-400 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <p className="font-bold text-sm mb-1">{selectedCoupon.eventTitle}</p>
                    <p className="text-lg font-bold text-yellow-600">
                      {selectedCoupon.discountType === 'percentage' 
                        ? `${selectedCoupon.discountValue}% 할인` 
                        : `${selectedCoupon.discountValue.toLocaleString()}원 할인`}
                    </p>
                    <p className="text-xs text-gray-600 mt-1">
                      -{discountAmount.toLocaleString()}원 할인 적용
                    </p>
                  </div>
                  <button
                    onClick={handleCouponRemove}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            ) : (
              // 쿠폰 선택 버튼
              <button
                onClick={() => setShowCouponList(!showCouponList)}
                disabled={loadingCoupons || availableCoupons.length === 0}
                className="w-full border-2 border-dashed border-gray-300 rounded-lg p-4 text-sm font-medium text-gray-600 hover:border-gray-400 hover:text-gray-900 disabled:opacity-50"
              >
                {loadingCoupons 
                  ? '쿠폰 불러오는 중...'
                  : availableCoupons.length > 0 
                  ? '쿠폰 선택하기' 
                  : '사용 가능한 쿠폰이 없습니다'}
              </button>
            )}

            {/* 쿠폰 목록 */}
            {showCouponList && availableCoupons.length > 0 && (
              <div className="mt-3 space-y-2 max-h-64 overflow-y-auto border border-gray-200 rounded-lg p-3">
                {availableCoupons.map((coupon) => {
                  const canUse = !coupon.minPurchase || totalPrice >= coupon.minPurchase;
                  const discount = calculateCouponDiscount(coupon, totalPrice);
                  
                  return (
                    <button
                      key={coupon.id}
                      onClick={() => handleCouponSelect(coupon)}
                      disabled={!canUse}
                      className={`w-full text-left border rounded-lg p-3 transition-all ${
                        canUse
                          ? 'border-yellow-300 bg-yellow-50 hover:bg-yellow-100'
                          : 'border-gray-200 bg-gray-50 opacity-50'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <p className="font-bold text-xs">{coupon.eventTitle}</p>
                        <span className="text-xs font-mono bg-gray-900 text-white px-2 py-0.5 rounded">
                          {coupon.code}
                        </span>
                      </div>
                      <p className="text-sm font-bold text-yellow-600 mb-1">
                        {coupon.discountType === 'percentage' 
                          ? `${coupon.discountValue}% 할인` 
                          : `${coupon.discountValue.toLocaleString()}원 할인`}
                      </p>
                      {canUse ? (
                        <p className="text-xs text-green-600">
                          -{discount.toLocaleString()}원 할인 가능
                        </p>
                      ) : (
                        <p className="text-xs text-red-600">
                          {coupon.minPurchase!.toLocaleString()}원 이상 구매시 사용 가능
                        </p>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* 무통장 입금 안내 */}
          <div>
            <h3 className="text-sm font-semibold mb-3">결제 정보</h3>
            <div className="bg-blue-50 rounded-lg p-4 space-y-4">
              <div>
                <p className="text-xs text-gray-600 mb-2">입금 계좌</p>
                <div className="bg-white rounded-lg p-3 border border-blue-100">
                  <p className="font-semibold text-red-500">토스뱅크 1002-4269-1138</p>
                  <p className="text-xs text-gray-500 mt-1">예금주: 비버하우스</p>
                </div>
              </div>
              
              <div>
                <label className="text-xs text-gray-600 block mb-2">
                  입금자명 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={depositorName}
                  onChange={(e) => setDepositorName(e.target.value)}
                  placeholder="홍길동"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                />
                <p className="text-xs text-gray-500 mt-2">
                  입금 확인 후 주문이 처리됩니다
                </p>
              </div>
            </div>
          </div>

          {/* 최종 결제 금액 */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">상품 금액</span>
              <span className="text-sm">{totalPrice.toLocaleString()}원</span>
            </div>
            {selectedCoupon && (
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-yellow-600">쿠폰 할인</span>
                <span className="text-sm text-yellow-600 font-semibold">
                  -{discountAmount.toLocaleString()}원
                </span>
              </div>
            )}
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">배송비</span>
              <span className="text-sm">무료</span>
            </div>
            <div className="border-t border-gray-200 my-3"></div>
            <div className="flex justify-between items-center">
              <span className="font-semibold">입금하실 금액</span>
              <span className="text-xl font-bold text-blue-600">
                {finalPrice.toLocaleString()}원
              </span>
            </div>
            {selectedCoupon && discountAmount > 0 && (
              <p className="text-xs text-gray-500 text-right mt-1">
                ({discountAmount.toLocaleString()}원 할인 적용)
              </p>
            )}
          </div>
        </div>

        {/* 하단 버튼 */}
        <div className="p-6 border-t space-y-2 flex-shrink-0">
          <button
            onClick={handleSubmit}
            disabled={processing}
            className="w-full py-4 bg-gray-900 text-white rounded-lg font-semibold disabled:bg-gray-400"
          >
            {processing ? '처리 중...' : '주문 접수하기'}
          </button>
          <button
            onClick={onClose}
            disabled={processing}
            className="w-full py-4 bg-gray-100 text-gray-900 rounded-lg font-semibold disabled:bg-gray-300"
          >
            취소
          </button>
        </div>
      </div>
    </div>
  );
}