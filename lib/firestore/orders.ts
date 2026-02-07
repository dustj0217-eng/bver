// lib/firestore/orders.ts
import { db } from '../firebase';
import { 
  collection, 
  doc, 
  setDoc, 
  getDocs,
  updateDoc,
  serverTimestamp
} from 'firebase/firestore';

export interface ShippingInfo {
  name: string;
  phone: string;
  zipcode: string;
  address: string;
  addressDetail: string;
}

export interface PaymentInfo {
  paymentMethod: string;
  transferInfo: any;
  status: string;
}

/**
 * 주문 생성
 */
export async function createOrder(
  userId: string, 
  items: any[], 
  totalPrice: number, 
  paymentInfo: PaymentInfo,
  shippingInfo: ShippingInfo
) {
  const ordersRef = collection(db, 'users', userId, 'orders');
  const orderDoc = doc(ordersRef);
  
  await setDoc(orderDoc, {
    orderNumber: `ORD-${Date.now()}`,
    items: items.map(item => ({
      productId: item.productId,
      name: item.product?.name,
      price: item.product?.price,
      quantity: item.quantity,
      image: item.product?.image,
      bgColor: item.product?.bgColor,
    })),
    totalPrice,
    status: paymentInfo.status,
    paymentMethod: paymentInfo.paymentMethod,
    transferInfo: paymentInfo.transferInfo,
    shippingInfo: {
      name: shippingInfo.name,
      phone: shippingInfo.phone,
      zipcode: shippingInfo.zipcode,
      address: shippingInfo.address,
      addressDetail: shippingInfo.addressDetail,
    },
    createdAt: serverTimestamp()
  });
  
  return orderDoc.id;
}

/**
 * 주문 내역 가져오기
 */
export async function getOrders(userId: string) {
  const ordersRef = collection(db, 'users', userId, 'orders');
  const snapshot = await getDocs(ordersRef);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
}

/**
 * 주문 취소
 */
export async function cancelOrder(userId: string, orderId: string) {
  const orderRef = doc(db, 'users', userId, 'orders', orderId);
  await updateDoc(orderRef, {
    status: 'canceled',
    canceledAt: new Date().toISOString(),
  });
}