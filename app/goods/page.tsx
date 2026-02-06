import { getAllProducts } from '@/lib/notion';
import Link from 'next/link';
import Image from 'next/image';

export const revalidate = 60;

interface PageProps {
  searchParams: { search?: string; category?: string };
}

export default async function GoodsPage({ searchParams }: PageProps) {
  const allProducts = await getAllProducts();
  
  // 카테고리 목록 추출
  const categories = Array.from(
    new Set(allProducts.map(p => p.category).filter(Boolean))
  );

  // 필터링
  const search = searchParams.search?.toLowerCase() || '';
  const category = searchParams.category || 'all';

  const filteredProducts = allProducts.filter(product => {
    const matchesSearch = !search || product.name.toLowerCase().includes(search);
    const matchesCategory = category === 'all' || product.category === category;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-white">
      <main className="max-w-6xl mx-auto px-4 py-6">
        {/* 검색 및 필터 */}
        <div className="mb-6 space-y-4">
          {/* 검색 폼 */}
          <form className="relative">
            <input
              type="text"
              name="search"
              defaultValue={search}
              placeholder="상품 검색..."
              className="w-full px-4 py-3 pl-10 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
            />
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </form>

          {/* 카테고리 필터 */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            <Link
              href="/goods"
              className={`px-4 py-2 rounded-full text-sm whitespace-nowrap ${
                category === 'all'
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              전체
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat}
                href={`/goods?category=${cat}${search ? `&search=${search}` : ''}`}
                className={`px-4 py-2 rounded-full text-sm whitespace-nowrap ${
                  category === cat
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                {cat}
              </Link>
            ))}
          </div>

          {/* 결과 개수 */}
          <div className="text-sm text-gray-500">
            {filteredProducts.length}개의 상품
          </div>
        </div>

        {/* 상품 목록 */}
        {filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="text-5xl mb-4">📦</div>
            <p className="text-gray-400 text-sm">
              {search || category !== 'all'
                ? '검색 결과가 없습니다'
                : '등록된 상품이 없습니다'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredProducts.map((product) => (
              <Link
                key={product.id}
                href={`/goods/${product.id}`}
                className="block"
              >
                <div>
                  <div
                    className="relative aspect-square rounded-lg overflow-hidden mb-3"
                    style={{ backgroundColor: product.bgColor }}
                  >
                    {product.image ? (
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-4xl opacity-20">📦</span>
                      </div>
                    )}
                    
                    {product.stock === 0 && (
                      <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                        품절
                      </div>
                    )}
                  </div>

                  <div>
                    {product.category && (
                      <div className="text-xs text-gray-400 mb-1">
                        {product.category}
                      </div>
                    )}
                    
                    <h3 className="text-sm text-gray-900 mb-2 line-clamp-2 leading-snug">
                      {product.name}
                    </h3>
                    
                    <div className="font-semibold text-gray-900">
                      {product.price.toLocaleString()}원
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}