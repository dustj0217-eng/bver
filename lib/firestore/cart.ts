// lib/firestore/cart.ts
import { db } from '../firebase';
import { 
  collection, 
  doc, 
  setDoc, 
  getDocs, 
  deleteDoc,
  serverTimestamp
} from 'firebase/firestore';

/**
 * 장바구니에 상품 추가
 */
export async function addToCart(userId: string, productId: string, quantity: number = 1) {
  const cartRef = doc(db, 'users', userId, 'cart', productId);
  await setDoc(cartRef, {
    productId,
    quantity,
    addedAt: serverTimestamp()
  }, { merge: true });
}

/**
 * 장바구니 목록 가져오기
 */
export async function getCart(userId: string) {
  const cartRef = collection(db, 'users', userId, 'cart');
  const snapshot = await getDocs(cartRef);
  return snapshot.docs.map(doc => ({ 
    id: doc.id, 
    ...doc.data() 
  }));
}

/**
 * 장바구니에서 상품 삭제
 */
export async function removeFromCart(userId: string, productId: string) {
  const cartRef = doc(db, 'users', userId, 'cart', productId);
  await deleteDoc(cartRef);
}