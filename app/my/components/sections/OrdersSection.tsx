// app/my/components/sections/OrdersSectionn.tsx

'use client';

import EmptyState from '@/app/my/components/EmptyState';

interface Order {
  id: string;
  orderNumber: string;
  status: 'pending' | 'completed' | 'canceled';
  totalPrice: number;
  items: any[];
  createdAt: any;
}

interface OrdersSectionProps {
  orders: Order[];
  onViewDetail: (order: Order) => void;
  onReorder: (order: Order) => void;
}

export default function OrdersSection({
  orders,
  onViewDetail,
  onReorder,
}: OrdersSectionProps) {
  if (orders.length === 0) {
    return (
      <EmptyState 
        text="주문 내역이 없습니다" 
        subtext="첫 주문을 시작해보세요"
      />
    );
  }

  return (
    <div className="space-y-4 pt-2">
      {orders.map((order) => (
        <div key={order.id} className="border-b pb-4 last:border-0">
          <button
            onClick={() => onViewDetail(order)}
            className="w-full text-left mb-3"
          >
            <div className="flex justify-between items-start mb-2">
              <p className="text-xs text-gray-400">{order.orderNumber}</p>
              <span
                className={`text-xs px-2 py-1 rounded ${
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
                  : '완료'}
              </span>
            </div>

            <p className="text-base font-bold mb-1">
              {order.totalPrice.toLocaleString()}원
            </p>
            <p className="text-xs text-gray-500">
              {order.items.length}개 상품 · 상세 보기
            </p>
          </button>
          
          {order.status !== 'canceled' && (
            <button
              onClick={() => onReorder(order)}
              className="w-full py-3 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50"
            >
              재구매하기
            </button>
          )}
        </div>
      ))}
    </div>
  );
}