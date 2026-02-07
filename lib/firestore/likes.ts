// lib/firestore/likes.ts
import { db } from '../firebase';
import { 
  collection, 
  doc, 
  setDoc, 
  getDoc,
  getDocs, 
  deleteDoc,
  serverTimestamp
} from 'firebase/firestore';

/**
 * 찜하기 토글
 * @returns true: 찜 추가, false: 찜 해제
 */
export async function toggleLike(userId: string, productId: string) {
  const likeRef = doc(db, 'users', userId, 'likes', productId);
  const snapshot = await getDoc(likeRef);
  
  if (snapshot.exists()) {
    await deleteDoc(likeRef);
    return false; // 찜 해제
  } else {
    await setDoc(likeRef, {
      productId,
      likedAt: serverTimestamp()
    });
    return true; // 찜 추가
  }
}

/**
 * 찜 목록 가져오기
 * @returns productId 배열
 */
export async function getLikes(userId: string) {
  const likesRef = collection(db, 'users', userId, 'likes');
  const snapshot = await getDocs(likesRef);
  return snapshot.docs.map(doc => doc.id);
}