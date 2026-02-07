// app/my/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { 
  getCart, 
  removeFromCart, 
  getLikes, 
  getOrders, 
  getPoints,
  addPoints,
  cancelOrder,
  addToCart
} from '@/lib/firestore';

import Accordion from './components/Accordion';
import ProfileHeader from './components/ProfileHeader';
import ShippingSection, { ShippingAddress } from './components/ShippingSection';
import CartSection from './components/sections/CartSection';
import OrdersSection from './components/sections/OrdersSection';
import LikesSection from './components/sections/LikesSection';
import PointsSection from './components/sections/PointsSection';
import CouponSection from './components/sections/CouponSection';
import CheckoutModal from './components/CheckoutModal';
import OrderDetailModal from './components/OrderDetailModal';

export default function MyPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [openSection, setOpenSection] = useState<string | null>(null);

  // 데이터 상태
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [likedProducts, setLikedProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [points, setPoints] = useState(0);
  const [shippingInfo, setShippingInfo] = useState<ShippingAddress>({
    name: '',
    phone: '',
    zipcode: '',
    address: '',
    addressDetail: '',
    isDefault: true,
  });

  // 선택 상태
  const [selectedCartItems, setSelectedCartItems] = useState<string[]>([]);
  const [selectedLikedProducts, setSelectedLikedProducts] = useState<string[]>([]);

  // 모달 상태
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);

  // 초기 로딩
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

      const userPoints = await getPoints(currentUser.uid);
      setPoints(userPoints);

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // 섹션별 데이터 로딩
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
        setSelectedCartItems(items.map(item => item.productId));
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
        setSelectedLikedProducts([]);
      }

      if (openSection === 'orders') {
        const orderList = await getOrders(user.uid);
        setOrders(orderList);
      }
    };

    loadData();
  }, [user, openSection]);

  // 핸들러
  const handleLogout = async () => {
    await signOut(auth);
    router.push('/my/login');
  };

  const handleRemoveCart = async (productId: string) => {
    if (!user) return;
    await removeFromCart(user.uid, productId);
    setCartItems(prev => prev.filter(item => item.productId !== productId));
    setSelectedCartItems(prev => prev.filter(id => id !== productId));
  };

  const handleToggleCartItem = (productId: string) => {
    setSelectedCartItems(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const handleToggleAllCart = () => {
    if (selectedCartItems.length === cartItems.length) {
      setSelectedCartItems([]);
    } else {
      setSelectedCartItems(cartItems.map(item => item.productId));
    }
  };

  const handleToggleLikedProduct = (productId: string) => {
    setSelectedLikedProducts(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const handleAddSelectedLikesToCart = async () => {
    if (!user) return;
    if (selectedLikedProducts.length === 0) {
      alert('상품을 선택해주세요');
      return;
    }

    try {
      for (const productId of selectedLikedProducts) {
        await addToCart(user.uid, productId, 1);
      }
      alert(`${selectedLikedProducts.length}개 상품을 장바구니에 담았습니다`);
      setSelectedLikedProducts([]);
    } catch (error) {
      console.error(error);
      alert('장바구니 담기 중 오류가 발생했습니다');
    }
  };

  const handleOpenCheckout = () => {
    if (!user) {
      alert('로그인이 필요합니다');
      return;
    }

    if (!hasShippingInfo) {
      alert('배송지를 먼저 등록해주세요');
      setOpenSection('shipping');
      return;
    }

    if (selectedCartItems.length === 0) {
      alert('구매할 상품을 선택해주세요');
      return;
    }

    setShowCheckoutModal(true);
  };

  const handlePaymentComplete = async (transferInfo: any) => {
    if (!user) return;

    const selectedItems = cartItems.filter(item => 
      selectedCartItems.includes(item.productId)
    );

    const { createOrder } = await import('@/lib/firestore');
    const selectedTotalPrice = selectedItems.reduce(
      (sum, item) => sum + (item.product?.price || 0) * item.quantity,
      0
    );

    // 쿠폰이 있으면 사용 처리
    if (transferInfo.coupon) {
      try {
        const { useCoupon } = await import('@/lib/firestore/coupons');
        await useCoupon(user.uid, transferInfo.coupon.id);
      } catch (error) {
        console.error('Failed to use coupon:', error);
        alert('쿠폰 사용 처리 중 오류가 발생했습니다.');
        return;
      }
    }

    await createOrder(
      user.uid, 
      selectedItems, 
      selectedTotalPrice, 
      {
        paymentMethod: 'transfer',
        transferInfo,
        status: 'pending'
      },
      shippingInfo
    );
    
    for (const item of selectedItems) {
      await removeFromCart(user.uid, item.productId);
    }
    
    setCartItems(prev => prev.filter(item => 
      !selectedCartItems.includes(item.productId)
    ));
    setSelectedCartItems([]);
    setShowCheckoutModal(false);
    
    const message = transferInfo.coupon 
      ? `입금 정보가 접수되었습니다!\n\n입금자명: ${transferInfo.depositorName}\n입금 금액: ${selectedTotalPrice.toLocaleString()}원\n쿠폰 할인: -${transferInfo.coupon.discountAmount.toLocaleString()}원\n최종 금액: ${(selectedTotalPrice - transferInfo.coupon.discountAmount).toLocaleString()}원\n\n입금 확인 후 주문이 처리됩니다.`
      : `입금 정보가 접수되었습니다!\n\n입금자명: ${transferInfo.depositorName}\n입금 금액: ${selectedTotalPrice.toLocaleString()}원\n\n입금 확인 후 주문이 처리됩니다.`;
    
    alert(message);
    
    setOpenSection('orders');
  };

  const handleRewardEarned = async (earnedPoints: number) => {
    if (!user) return;
    await addPoints(user.uid, earnedPoints);
    setPoints(prev => prev + earnedPoints);
  };

  const handleCancelOrder = async (orderId: string) => {
    if (!user) return;
    await cancelOrder(user.uid, orderId);
    const orderList = await getOrders(user.uid);
    setOrders(orderList);
  };

  const handleReorder = async (order: any) => {
    if (!user) return;
    
    try {
      for (const item of order.items) {
        await addToCart(user.uid, item.productId, item.quantity);
      }
      alert('장바구니에 담았습니다!');
      setOpenSection('cart');
    } catch (error) {
      console.error(error);
      alert('장바구니 담기 중 오류가 발생했습니다');
    }
  };

  // 로딩 및 미로그인 상태
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

  const selectedTotalPrice = cartItems
    .filter(item => selectedCartItems.includes(item.productId))
    .reduce((sum, item) => sum + (item.product?.price || 0) * item.quantity, 0);

  const hasShippingInfo = shippingInfo.name && shippingInfo.phone && shippingInfo.address;

  return (
    <div className="min-h-screen bg-[#FAFAFA] pb-20">
      {/* 모달 */}
      <CheckoutModal
        isOpen={showCheckoutModal}
        onClose={() => setShowCheckoutModal(false)}
        cartItems={cartItems.filter(item => selectedCartItems.includes(item.productId))}
        totalPrice={selectedTotalPrice}
        shippingInfo={shippingInfo}
        userId={user.uid}
        onPaymentComplete={handlePaymentComplete}
      />

      <OrderDetailModal
        isOpen={showOrderModal}
        order={selectedOrder}
        onClose={() => {
          setShowOrderModal(false);
          setSelectedOrder(null);
        }}
        onCancelOrder={handleCancelOrder}
        onReorder={handleReorder}
      />

      {/* 프로필 헤더 */}
      <ProfileHeader
        userId={user.uid}
        name={name}
        email={user.email || ''}
        onUpdate={setName}
      />

      <div className="max-w-md mx-auto px-6 pt-6 space-y-3">
        {/* 배송지 관리 */}
        <Accordion
          title="배송지 관리"
          badge={hasShippingInfo ? undefined : '!'}
          open={openSection === 'shipping'}
          onClick={() => setOpenSection(openSection === 'shipping' ? null : 'shipping')}
        >
          <ShippingSection
            userId={user.uid}
            shippingInfo={shippingInfo}
            onUpdate={setShippingInfo}
          />
        </Accordion>

        {/* 장바구니 */}
        <Accordion
          title="장바구니"
          badge={cartItems.length > 0 ? cartItems.length : undefined}
          open={openSection === 'cart'}
          onClick={() => setOpenSection(openSection === 'cart' ? null : 'cart')}
        >
          <CartSection
            cartItems={cartItems}
            selectedItems={selectedCartItems}
            onToggleItem={handleToggleCartItem}
            onToggleAll={handleToggleAllCart}
            onRemove={handleRemoveCart}
            onCheckout={handleOpenCheckout}
          />
        </Accordion>

        {/* 주문 내역 */}
        <Accordion
          title="주문 내역"
          open={openSection === 'orders'}
          onClick={() => setOpenSection(openSection === 'orders' ? null : 'orders')}
        >
          <OrdersSection
            orders={orders}
            onViewDetail={(order: any) => {
              setSelectedOrder(order);
              setShowOrderModal(true);
            }}
            onReorder={handleReorder}
          />
        </Accordion>

        {/* 찜한 상품 */}
        <Accordion
          title="찜한 상품"
          badge={likedProducts.length > 0 ? likedProducts.length : undefined}
          open={openSection === 'likes'}
          onClick={() => setOpenSection(openSection === 'likes' ? null : 'likes')}
        >
          <LikesSection
            products={likedProducts}
            selectedProducts={selectedLikedProducts}
            onToggleProduct={handleToggleLikedProduct}
            onAddToCart={handleAddSelectedLikesToCart}
          />
        </Accordion>

        {/* 쿠폰 */}
        <Accordion
          title="쿠폰"
          open={openSection === 'coupons'}
          onClick={() => setOpenSection(openSection === 'coupons' ? null : 'coupons')}
        >
          <CouponSection userId={user.uid} />
        </Accordion>

        {/* 포인트 */}
        <Accordion
          title="포인트"
          open={openSection === 'coupon'}
          onClick={() => setOpenSection(openSection === 'coupon' ? null : 'coupon')}
        >
          <PointsSection
            points={points}
            onRewardEarned={handleRewardEarned}
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