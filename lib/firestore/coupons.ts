// lib/firestore/coupons.ts
import { db } from '../firebase';
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc,
  updateDoc,
  query,
  where,
  orderBy,
  Timestamp 
} from 'firebase/firestore';

export interface Coupon {
  id: string;
  code: string;
  eventId: string;
  eventTitle: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minPurchase?: number;
  maxDiscount?: number;
  issuedAt: Timestamp;
  expiresAt: Timestamp;
  usedAt: Timestamp | null;
  isUsed: boolean;
}

/**
 * 사용자에게 쿠폰 발급
 */
export async function issueCoupon(
  userId: string,
  eventId: string,
  eventTitle: string,
  discountType: 'percentage' | 'fixed',
  discountValue: number,
  expirationDays: number = 30,
  options?: {
    minPurchase?: number;
    maxDiscount?: number;
  }
) {
  try {
    const couponCode = generateCouponCode();
    const now = new Date();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + expirationDays);

    const couponRef = doc(collection(db, `users/${userId}/coupons`));
    
    await setDoc(couponRef, {
      code: couponCode,
      eventId,
      eventTitle,
      discountType,
      discountValue,
      minPurchase: options?.minPurchase || 0,
      maxDiscount: options?.maxDiscount || null,
      issuedAt: Timestamp.fromDate(now),
      expiresAt: Timestamp.fromDate(expiresAt),
      usedAt: null,
      isUsed: false,
    });

    return {
      id: couponRef.id,
      code: couponCode,
    };
  } catch (error) {
    console.error('Failed to issue coupon:', error);
    throw error;
  }
}

/**
 * 쿠폰 사용 처리
 */
export async function useCoupon(userId: string, couponId: string) {
  try {
    const couponRef = doc(db, `users/${userId}/coupons/${couponId}`);
    const couponSnap = await getDoc(couponRef);

    if (!couponSnap.exists()) {
      throw new Error('쿠폰을 찾을 수 없습니다.');
    }

    const couponData = couponSnap.data();

    if (couponData.isUsed) {
      throw new Error('이미 사용된 쿠폰입니다.');
    }

    if (couponData.expiresAt.toDate() < new Date()) {
      throw new Error('만료된 쿠폰입니다.');
    }

    await updateDoc(couponRef, {
      isUsed: true,
      usedAt: Timestamp.fromDate(new Date()),
    });

    return {
      success: true,
      coupon: { id: couponSnap.id, ...couponData },
    };
  } catch (error) {
    console.error('Failed to use coupon:', error);
    throw error;
  }
}

/**
 * 쿠폰 코드로 쿠폰 찾기
 */
export async function findCouponByCode(userId: string, code: string) {
  try {
    const couponsRef = collection(db, `users/${userId}/coupons`);
    const q = query(couponsRef, where('code', '==', code));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return null;
    }

    const docSnap = snapshot.docs[0];
    return {
      id: docSnap.id,
      ...docSnap.data(),
    } as Coupon;
  } catch (error) {
    console.error('Failed to find coupon:', error);
    throw error;
  }
}

/**
 * 사용자의 모든 쿠폰 조회
 */
export async function getUserCoupons(userId: string) {
  try {
    const couponsRef = collection(db, `users/${userId}/coupons`);
    const q = query(couponsRef, orderBy('issuedAt', 'desc'));
    const snapshot = await getDocs(q);

    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as Coupon[];
  } catch (error) {
    console.error('Failed to get user coupons:', error);
    throw error;
  }
}

/**
 * 사용 가능한 쿠폰만 조회
 */
export async function getAvailableCoupons(userId: string) {
  try {
    const coupons = await getUserCoupons(userId);
    const now = new Date();

    return coupons.filter(coupon => 
      !coupon.isUsed && coupon.expiresAt.toDate() > now
    );
  } catch (error) {
    console.error('Failed to get available coupons:', error);
    throw error;
  }
}

/**
 * 쿠폰 할인 금액 계산
 */
export function calculateCouponDiscount(
  coupon: Coupon,
  orderAmount: number
): number {
  // 최소 구매 금액 체크
  if (coupon.minPurchase && orderAmount < coupon.minPurchase) {
    return 0;
  }

  let discount = 0;

  if (coupon.discountType === 'percentage') {
    discount = Math.floor(orderAmount * (coupon.discountValue / 100));
    
    // 최대 할인 금액 적용
    if (coupon.maxDiscount && discount > coupon.maxDiscount) {
      discount = coupon.maxDiscount;
    }
  } else {
    discount = coupon.discountValue;
  }

  // 할인 금액이 주문 금액을 초과하지 않도록
  return Math.min(discount, orderAmount);
}

/**
 * 쿠폰 코드 생성 (8자리 영숫자)
 */
function generateCouponCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}