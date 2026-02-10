// app/my/components/OrderDetailModal.tsx
'use client';

import { useState } from 'react';
import Image from 'next/image';

interface OrderDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: any | null;
  onCancelOrder?: (orderId: string) => Promise<void>;
  onReorder?: (order: any) => Promise<void>;
}

export default function OrderDetailModal({
  isOpen,
  onClose,
  order,
  onCancelOrder,
  onReorder,
}: OrderDetailModalProps) {
  const [canceling, setCanceling] = useState(false);
  const [reordering, setReordering] = useState(false);

  if (!isOpen || !order) return null;

  const handleCancelOrder = async () => {
    if (!onCancelOrder) return;
    
    if (!confirm('정말로 주문을 취소하시겠습니까?')) {
      return;
    }

    setCanceling(true);
    try {
      await onCancelOrder(order.id);
      alert('주문이 취소되었습니다.');
      onClose();
    } catch (error) {
      console.error(error);
      alert('주문 취소 중 오류가 발생했습니다.');
    } finally {
      setCanceling(false);
    }
  };

  const handleReorder = async () => {
    if (!onReorder) return;

    setReordering(true);
    try {
      await onReorder(order);
      onClose();
    } catch (error) {
      console.error(error);
      alert('재구매 중 오류가 발생했습니다.');
    } finally {
      setReordering(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      <div className="relative bg-white rounded-2xl w-full max-w-md max-h-[85vh] flex flex-col">
        {/* 헤더 */}
        <div className="p-6 border-b flex-shrink-0">
          <h2 className="text-xl font-bold">주문 상세</h2>
          <p className="text-xs text-gray-400 mt-1">
            주문번호 {order.orderNumber}
          </p>
        </div>

        {/* 내용 */}
        <div className="overflow-y-auto flex-1 p-6 space-y-6">
          {/* 주문 상태 */}
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">주문 상태</span>
            <span
              className={`text-sm px-3 py-1 rounded-full ${
                order.status === 'pending'
                  ? 'bg-yellow-50 text-yellow-700'
                  : order.status === 'canceled'
                  ? 'bg-gray-100 text-gray-600'
                  : 'bg-green-50 text-green-700'
              }`}
            >
              {order.status === 'pending' 
                ? '결제 대기' 
                : order.status === 'canceled'
                ? '취소됨'
                : '주문 완료'}
            </span>
          </div>

          {/* 배송지 */}
          <div>
            <h3 className="text-sm font-semibold mb-3">배송지 정보</h3>
            <div className="bg-gray-50 rounded-lg p-4 text-sm space-y-1">
              <p className="font-medium">{order.shippingInfo?.name}</p>
              <p className="text-gray-600">{order.shippingInfo?.phone}</p>
              <p className="text-gray-600">
                ({order.shippingInfo?.zipcode}) {order.shippingInfo?.address}
              </p>
              {order.shippingInfo?.addressDetail && (
                <p className="text-gray-600">
                  {order.shippingInfo.addressDetail}
                </p>
              )}
            </div>
          </div>

          {/* 주문 상품 */}
          <div>
            <h3 className="text-sm font-semibold mb-3">
              주문 상품 ({order.items.length}개)
            </h3>

            <div className="space-y-3">
              {order.items.map((item: any, index: number) => (
                <div key={index} className="flex gap-3">
                  <div
                    className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0"
                    style={{ backgroundColor: item.bgColor || '#f3f4f6' }}
                  >
                    {item.image && (
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={64}
                        height={64}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {item.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      수량 {item.quantity}개
                    </p>
                    <p className="text-sm font-semibold mt-1">
                      {(item.price * item.quantity).toLocaleString()}원
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 결제 정보 */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600">결제 방식</span>
              <span>무통장 입금</span>
            </div>
            <div className="flex justify-between font-semibold">
              <span>총 결제 금액</span>
              <span>{order.totalPrice.toLocaleString()}원</span>
            </div>
          </div>

          {/* 취소 안내 (pending 상태일 때만) */}
          {order.status === 'pending' && onCancelOrder && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-xs text-yellow-800">
                💡 입금 전이라면 언제든지 주문을 취소할 수 있습니다
              </p>
            </div>
          )}
        </div>

        {/* 하단 버튼 */}
        <div className="p-6 border-t flex-shrink-0 space-y-2">
          {order.status === 'pending' && onCancelOrder && (
            <button
              onClick={handleCancelOrder}
              disabled={canceling || reordering}
              className="w-full py-4 bg-red-500 text-white rounded-lg font-semibold disabled:bg-gray-400"
            >
              {canceling ? '취소 처리 중...' : '주문 취소하기'}
            </button>
          )}
          <button
            onClick={onClose}
            disabled={canceling || reordering}
            className="w-full py-4 bg-gray-900 text-white rounded-lg font-semibold disabled:bg-gray-400"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}