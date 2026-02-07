// app/my/components/sections/LikesSection.tsx

'use client';

import Link from 'next/link';
import Image from 'next/image';
import EmptyState from '@/app/my/components/EmptyState';

interface Product {
  id: string;
  name: string;
  price: number;
  image?: string;
  bgColor?: string;
}

interface LikesSectionProps {
  products: Product[];
  selectedProducts: string[];
  onToggleProduct: (productId: string) => void;
  onAddToCart: () => void;
}

export default function LikesSection({
  products,
  selectedProducts,
  onToggleProduct,
  onAddToCart,
}: LikesSectionProps) {
  if (products.length === 0) {
    return (
      <EmptyState 
        text="찜한 상품이 없습니다" 
        subtext="마음에 드는 상품을 저장해보세요"
      />
    );
  }

  return (
    <div className="pt-2 space-y-4">
      {selectedProducts.length > 0 && (
        <button
          onClick={onAddToCart}
          className="w-full py-3 bg-gray-900 text-white rounded-lg font-semibold"
        >
          선택 상품 장바구니 담기 ({selectedProducts.length}개)
        </button>
      )}

      <div className="grid grid-cols-2 gap-3">
        {products.map((product) => (
          <div key={product.id} className="relative">
            <label className="absolute top-2 left-2 z-10 w-6 h-6 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center cursor-pointer">
              <input
                type="checkbox"
                checked={selectedProducts.includes(product.id)}
                onChange={() => onToggleProduct(product.id)}
                className="w-4 h-4 rounded border-gray-300"
              />
            </label>

            <Link
              href={`/goods/${product.id}`}
              className="block"
            >
              <div
                className="aspect-square rounded-xl mb-2 overflow-hidden"
                style={{ backgroundColor: product.bgColor }}
              >
                {product.image && (
                  <Image
                    src={product.image}
                    alt={product.name}
                    width={200}
                    height={200}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <p className="text-xs truncate text-gray-600 mb-1">{product.name}</p>
              <p className="text-sm font-semibold">
                {product.price?.toLocaleString()}원
              </p>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}