// app/my/CheckoutModal.tsx
'use client';

import { useState } from 'react';
import Image from 'next/image';

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
  onPaymentComplete: (transferInfo: any) => Promise<void>;
}

export default function CheckoutModal({
  isOpen,
  onClose,
  cartItems,
  totalPrice,
  shippingInfo,
  onPaymentComplete,
}: CheckoutModalProps) {
  const [processing, setProcessing] = useState(false);
  
  // 입금자명
  const [depositorName, setDepositorName] = useState('');

  if (!isOpen) return null;

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

          {/* 무통장 입금 안내 */}
          <div>
            <h3 className="text-sm font-semibold mb-3">결제 정보</h3>
            <div className="bg-blue-50 rounded-lg p-4 space-y-4">
              <div>
                <p className="text-xs text-gray-600 mb-2">입금 계좌</p>
                <div className="bg-white rounded-lg p-3 border border-blue-100">
                  <p className="font-semibold">국민은행 123456-78-901234</p>
                  <p className="text-xs text-gray-500 mt-1">예금주: (주)비버컴퍼니</p>
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
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">배송비</span>
              <span className="text-sm">무료</span>
            </div>
            <div className="border-t border-gray-200 my-3"></div>
            <div className="flex justify-between items-center">
              <span className="font-semibold">입금하실 금액</span>
              <span className="text-xl font-bold text-blue-600">{totalPrice.toLocaleString()}원</span>
            </div>
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