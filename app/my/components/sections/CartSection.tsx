// app/my/components/sections/CartSection.tsx

'use client';

import Link from 'next/link';
import Image from 'next/image';
import EmptyState from '@/app/my/components/EmptyState';

interface CartItem {
  productId: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    price: number;
    image?: string;
    bgColor?: string;
  } | null;
}

interface CartSectionProps {
  cartItems: CartItem[];
  selectedItems: string[];
  onToggleItem: (productId: string) => void;
  onToggleAll: () => void;
  onRemove: (productId: string) => void;
  onCheckout: () => void;
}

export default function CartSection({
  cartItems,
  selectedItems,
  onToggleItem,
  onToggleAll,
  onRemove,
  onCheckout,
}: CartSectionProps) {
  if (cartItems.length === 0) {
    return (
      <EmptyState 
        text="장바구니가 비었습니다" 
        subtext="상품을 담아보세요"
      />
    );
  }

  const selectedTotalPrice = cartItems
    .filter(item => selectedItems.includes(item.productId))
    .reduce((sum, item) => sum + (item.product?.price || 0) * item.quantity, 0);

  return (
    <div className="space-y-5 pt-2">
      {/* 전체 선택 */}
      <div className="flex items-center justify-between pb-3 border-b">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={selectedItems.length === cartItems.length}
            onChange={onToggleAll}
            className="w-4 h-4 rounded border-gray-300"
          />
          <span className="text-sm">
            전체선택 ({selectedItems.length}/{cartItems.length})
          </span>
        </label>
      </div>

      {cartItems.map((item) => (
        <div
          key={item.productId}
          className="flex gap-4 pb-5 border-b last:border-0 last:pb-0"
        >
          <label className="flex items-start pt-1 cursor-pointer">
            <input
              type="checkbox"
              checked={selectedItems.includes(item.productId)}
              onChange={() => onToggleItem(item.productId)}
              className="w-4 h-4 rounded border-gray-300"
            />
          </label>
          
          <Link 
            href={`/goods/${item.productId}`}
            className="w-24 h-24 rounded-xl flex-shrink-0 overflow-hidden"
            style={{ backgroundColor: item.product?.bgColor || '#f3f4f6' }}
          >
            {item.product?.image && (
              <Image
                src={item.product.image}
                alt={item.product.name}
                width={96}
                height={96}
                className="w-full h-full object-cover"
              />
            )}
          </Link>
          <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
            <div>
              <Link href={`/goods/${item.productId}`}>
                <p className="text-sm font-semibold truncate mb-1">
                  {item.product?.name}
                </p>
              </Link>
              <p className="text-xs text-gray-500">
                수량 {item.quantity}개
              </p>
            </div>
            <p className="text-base font-bold">
              {((item.product?.price || 0) * item.quantity).toLocaleString()}원
            </p>
          </div>
          <button
            onClick={() => onRemove(item.productId)}
            className="text-gray-400 self-start mt-1"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      ))}
      
      <div className="pt-5">
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm text-gray-600">선택 상품 금액</span>
          <span className="text-xl font-bold">
            {selectedTotalPrice.toLocaleString()}원
          </span>
        </div>
        <button 
          onClick={onCheckout}
          disabled={selectedItems.length === 0}
          className="w-full py-4 bg-gray-900 text-white rounded-xl font-semibold disabled:bg-gray-400"
        >
          선택 상품 주문하기 ({selectedItems.length}개)
        </button>
      </div>
    </div>
  );
}