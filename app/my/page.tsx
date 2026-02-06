'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { getCart, removeFromCart, getLikes, getOrders, createOrder } from '@/lib/firestore';

// 배송지 타입
interface ShippingAddress {
  name: string;
  phone: string;
  zipcode: string;
  address: string;
  addressDetail: string;
  isDefault?: boolean;
}

export default function MyPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState('');
  const [editing, setEditing] = useState(false);

  const [openSection, setOpenSection] = useState<string | null>(null);

  const [cartItems, setCartItems] = useState<any[]>([]);
  const [likedProducts, setLikedProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);

  // 배송지 정보
  const [shippingInfo, setShippingInfo] = useState<ShippingAddress>({
    name: '',
    phone: '',
    zipcode: '',
    address: '',
    addressDetail: '',
    isDefault: true,
  });
  const [editingShipping, setEditingShipping] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        setUser(null);
        setLoading(false);
        return;
      }

      setUser(currentUser);

      const ref = doc(db, 'users', currentUser.uid);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        const data = snap.data();
        setName(data.name);
        // 배송지 정보 로드
        if (data.shippingAddress) {
          setShippingInfo(data.shippingAddress);
        }
      } else {
        await setDoc(ref, {
          name: '사용자',
          email: currentUser.email,
          createdAt: new Date(),
        });
        setName('사용자');
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user || !openSection) return;

    const loadData = async () => {
      if (openSection === 'cart') {
        const cart = await getCart(user.uid);
        const items = await Promise.all(
          cart.map(async (item: any) => {
            try {
              const res = await fetch(`/api/products/${item.productId}`);
              const product = await res.json();
              return { ...item, product };
            } catch (error) {
              console.error('Failed to fetch product:', error);
              return { ...item, product: null };
            }
          })
        );
        setCartItems(items);
      }

      if (openSection === 'likes') {
        const likes = await getLikes(user.uid);
        const products = await Promise.all(
          likes.map(async (id) => {
            try {
              const res = await fetch(`/api/products/${id}`);
              return await res.json();
            } catch {
              return null;
            }
          })
        );
        setLikedProducts(products.filter(Boolean));
      }

      if (openSection === 'orders') {
        const orderList = await getOrders(user.uid);
        setOrders(orderList);
      }
    };

    loadData();
  }, [user, openSection]);

  const handleSaveName = async () => {
    if (!user) return;
    await setDoc(
      doc(db, 'users', user.uid),
      { name },
      { merge: true }
    );
    setEditing(false);
  };

  const handleSaveShipping = async () => {
    if (!user) return;
    await setDoc(
      doc(db, 'users', user.uid),
      { shippingAddress: shippingInfo },
      { merge: true }
    );
    setEditingShipping(false);
  };

  const handleAddressSearch = () => {
    new window.daum.Postcode({
      oncomplete: (data) => {
        setShippingInfo(prev => ({
          ...prev,
          zipcode: data.zonecode,
          address: data.address,
        }));
      },
    }).open();
  };

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/my/login');
  };

  const handleRemoveCart = async (productId: string) => {
    if (!user) return;
    await removeFromCart(user.uid, productId);
    setCartItems(prev => prev.filter(item => item.productId !== productId));
  };

  const handleCheckout = async () => {
    if (!user) {
      alert('로그인이 필요합니다');
      return;
    }

    if (!hasShippingInfo) {
      alert('배송지를 먼저 등록해주세요');
      setOpenSection('shipping');
      return;
    }

    if (cartItems.length === 0) {
      alert('장바구니가 비었습니다');
      return;
    }

    if (!confirm(`${totalCartPrice.toLocaleString()}원을 주문하시겠습니까?`)) {
      return;
    }

    try {
      // 주문 생성
      await createOrder(user.uid, cartItems, totalCartPrice);
      
      // 장바구니 비우기
      for (const item of cartItems) {
        await removeFromCart(user.uid, item.productId);
      }
      
      setCartItems([]);
      alert('주문이 완료되었습니다!');
      
      // 주문 내역 탭 열기
      setOpenSection('orders');
    } catch (error) {
      console.error(error);
      alert('주문 중 오류가 발생했습니다');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-sm text-gray-400">
        로딩 중…
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="w-full max-w-md text-center">
          <h2 className="text-xl font-bold mb-2">로그인이 필요합니다</h2>
          <p className="text-sm text-gray-500 mb-6">
            마이페이지는 로그인 후 이용할 수 있어요
          </p>
          <Link
            href="/my/login"
            className="block w-full py-4 bg-black text-white rounded-xl font-semibold"
          >
            로그인 / 회원가입
          </Link>
        </div>
      </div>
    );
  }

  const totalCartPrice = cartItems.reduce(
    (sum, item) => sum + (item.product?.price || 0) * item.quantity,
    0
  );

  const hasShippingInfo = shippingInfo.name && shippingInfo.phone && shippingInfo.address;

  return (
    <div className="min-h-screen bg-[#FAFAFA] pb-20">
      {/* 프로필 카드 */}
      <div className="">
        <div className="max-w-md mx-auto px-6 py-8">
          {editing ? (
            <div className="flex items-center gap-3">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="flex-1 text-2xl font-bold border-b-2 border-gray-900 pb-1 outline-none"
                autoFocus
              />
              <button
                onClick={handleSaveName}
                className="text-sm font-semibold text-gray-900 bg-gray-100 px-4 py-2 rounded-lg"
              >
                완료
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold">{name}</h1>
              <button
                onClick={() => setEditing(true)}
                className="text-sm text-gray-500"
              >
                수정
              </button>
            </div>
          )}
          <p className="text-sm text-gray-500 mt-2">{user.email}</p>
        </div>
      </div>

      <div className="max-w-md mx-auto px-6 pt-6 space-y-3">
        {/* 배송지 관리 */}
        <Accordion
          title="배송지 관리"
          badge={hasShippingInfo ? undefined : '!'}
          open={openSection === 'shipping'}
          onClick={() => setOpenSection(openSection === 'shipping' ? null : 'shipping')}
        >
          {editingShipping ? (
            <div className="space-y-4 pt-2">
              <div>
                <label className="text-xs text-gray-500 block mb-1">받는 분</label>
                <input
                  type="text"
                  value={shippingInfo.name}
                  onChange={(e) => setShippingInfo(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="이름을 입력하세요"
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm"
                />
              </div>
              
              <div>
                <label className="text-xs text-gray-500 block mb-1">연락처</label>
                <input
                  type="tel"
                  value={shippingInfo.phone}
                  onChange={(e) => setShippingInfo(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="010-0000-0000"
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm"
                />
              </div>

              <div>
                <label className="text-xs text-gray-500 block mb-1">우편번호</label>

                <input
                  type="text"
                  value={shippingInfo.zipcode}
                  onChange={(e) => setShippingInfo(prev => ({ ...prev, zipcode: e.target.value }))}
                  placeholder="우편번호"
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm"
                />

                <button 
                  type="button"
                  onClick={handleAddressSearch}
                  className="mt-2 w-full px-4 py-3 bg-gray-100 rounded-lg text-sm font-medium"
                >
                  주소 검색
                </button>
              </div>

              <div>
                <label className="text-xs text-gray-500 block mb-1">주소</label>
                <input
                  type="text"
                  value={shippingInfo.address}
                  onChange={(e) => setShippingInfo(prev => ({ ...prev, address: e.target.value }))}
                  placeholder="기본 주소"
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm mb-2"
                />
                <input
                  type="text"
                  value={shippingInfo.addressDetail}
                  onChange={(e) => setShippingInfo(prev => ({ ...prev, addressDetail: e.target.value }))}
                  placeholder="상세 주소"
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => setEditingShipping(false)}
                  className="flex-1 py-3 bg-gray-100 rounded-lg text-sm font-medium"
                >
                  취소
                </button>
                <button
                  onClick={handleSaveShipping}
                  className="flex-1 py-3 bg-gray-900 text-white rounded-lg text-sm font-medium"
                >
                  저장
                </button>
              </div>
            </div>
          ) : hasShippingInfo ? (
            <div className="pt-2">
              <div className="bg-gray-50 rounded-lg p-4 mb-3">
                <div className="flex justify-between items-start mb-2">
                  <p className="text-sm font-semibold">{shippingInfo.name}</p>
                  <span className="text-xs bg-gray-900 text-white px-2 py-0.5 rounded">
                    기본 배송지
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-1">{shippingInfo.phone}</p>
                <p className="text-sm text-gray-600">
                  ({shippingInfo.zipcode}) {shippingInfo.address}
                </p>
                {shippingInfo.addressDetail && (
                  <p className="text-sm text-gray-600">{shippingInfo.addressDetail}</p>
                )}
              </div>
              <button
                onClick={() => setEditingShipping(true)}
                className="w-full py-3 border border-gray-200 rounded-lg text-sm font-medium"
              >
                배송지 수정
              </button>
            </div>
          ) : (
            <div className="pt-2">
              <EmptyState 
                text="등록된 배송지가 없습니다" 
                subtext="배송지를 등록하고 빠르게 주문하세요"
              />
              <button
                onClick={() => setEditingShipping(true)}
                className="w-full py-3 bg-gray-900 text-white rounded-lg text-sm font-medium mt-4"
              >
                배송지 등록
              </button>
            </div>
          )}
        </Accordion>

        {/* 장바구니 */}
        <Accordion
          title="장바구니"
          badge={cartItems.length > 0 ? cartItems.length : undefined}
          open={openSection === 'cart'}
          onClick={() => setOpenSection(openSection === 'cart' ? null : 'cart')}
        >
          {cartItems.length === 0 ? (
            <EmptyState 
              text="장바구니가 비었습니다" 
              subtext="상품을 담아보세요"
            />
          ) : (
            <div className="space-y-5 pt-2">
              {cartItems.map((item) => (
                <div
                  key={item.productId}
                  className="flex gap-4 pb-5 border-b last:border-0 last:pb-0"
                >
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
                    onClick={() => handleRemoveCart(item.productId)}
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
                  <span className="text-sm text-gray-600">총 상품 금액</span>
                  <span className="text-xl font-bold">
                    {totalCartPrice.toLocaleString()}원
                  </span>
                </div>
                <button 
                  onClick={handleCheckout}
                  className="w-full py-4 bg-gray-900 text-white rounded-xl font-semibold"
                >
                  주문하기
                </button>
              </div>
            </div>
          )}
        </Accordion>

        {/* 주문 내역 */}
        <Accordion
          title="주문 내역"
          open={openSection === 'orders'}
          onClick={() => setOpenSection(openSection === 'orders' ? null : 'orders')}
        >
          {orders.length === 0 ? (
            <EmptyState 
              text="주문 내역이 없습니다" 
              subtext="첫 주문을 시작해보세요"
            />
          ) : (
            <div className="space-y-4 pt-2">
              {orders.map((order) => (
                <div key={order.id} className="border-b pb-4 last:border-0">
                  <div className="flex justify-between items-start mb-2">
                    <p className="text-xs text-gray-400">{order.orderNumber}</p>
                    <span className={`text-xs px-2 py-1 rounded ${
                      order.status === 'pending' 
                        ? 'bg-yellow-50 text-yellow-700' 
                        : 'bg-green-50 text-green-700'
                    }`}>
                      {order.status === 'pending' ? '결제 대기' : '완료'}
                    </span>
                  </div>
                  <p className="text-base font-bold mb-1">
                    {order.totalPrice?.toLocaleString()}원
                  </p>
                  <p className="text-xs text-gray-500">
                    {order.items?.length || 0}개 상품
                  </p>
                </div>
              ))}
            </div>
          )}
        </Accordion>

        {/* 찜한 상품 */}
        <Accordion
          title="찜한 상품"
          badge={likedProducts.length > 0 ? likedProducts.length : undefined}
          open={openSection === 'likes'}
          onClick={() => setOpenSection(openSection === 'likes' ? null : 'likes')}
        >
          {likedProducts.length === 0 ? (
            <EmptyState 
              text="찜한 상품이 없습니다" 
              subtext="마음에 드는 상품을 저장해보세요"
            />
          ) : (
            <div className="grid grid-cols-2 gap-3 pt-2">
              {likedProducts.map((product) => (
                <Link
                  key={product.id}
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
              ))}
            </div>
          )}
        </Accordion>

        {/* 쿠폰/포인트 */}
        <Accordion
          title="쿠폰 / 포인트"
          open={openSection === 'coupon'}
          onClick={() => setOpenSection(openSection === 'coupon' ? null : 'coupon')}
        >
          <EmptyState 
            text="보유 중인 쿠폰이 없습니다" 
            subtext="이벤트에 참여해보세요"
          />
        </Accordion>

        <button
          onClick={handleLogout}
          className="w-full py-4 text-sm text-gray-400 hover:text-gray-600"
        >
          로그아웃
        </button>
      </div>
    </div>
  );
}

/* ---------- components ---------- */

function Accordion({
  title,
  badge,
  open,
  onClick,
  children,
}: {
  title: string;
  badge?: number | string;
  open: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="overflow-hidden">
      <button
        onClick={onClick}
        className="w-full px-5 py-5 flex justify-between items-center"
      >
        <div className="flex items-center gap-2">
          <span className="text-base font-semibold">{title}</span>
          {badge !== undefined && (
            <span className={`text-xs px-2 py-0.5 rounded-full min-w-[20px] text-center ${
              badge === '!' 
                ? 'bg-red-500 text-white' 
                : 'bg-gray-900 text-white'
            }`}>
              {badge}
            </span>
          )}
        </div>
        <svg 
          className={`w-5 h-5 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && <div className="px-5 pb-5 border-t">{children}</div>}
    </div>
  );
}

function EmptyState({ text, subtext }: { text: string; subtext: string }) {
  return (
    <div className="py-12 text-center">
      <p className="text-sm text-gray-900 font-medium mb-1">{text}</p>
      <p className="text-xs text-gray-400">{subtext}</p>
    </div>
  );
}