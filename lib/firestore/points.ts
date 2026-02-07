// lib/firestore/points.ts
import { db } from '../firebase';
import { 
  doc, 
  getDoc,
  setDoc
} from 'firebase/firestore';

/**
 * 포인트 조회
 */
export async function getPoints(userId: string): Promise<number> {
  const userDoc = await getDoc(doc(db, 'users', userId));
  return userDoc.data()?.points || 0;
}

/**
 * 포인트 적립
 */
export async function addPoints(userId: string, points: number): Promise<void> {
  const userRef = doc(db, 'users', userId);
  const userDoc = await getDoc(userRef);
  const currentPoints = userDoc.data()?.points || 0;
  
  await setDoc(userRef, {
    points: currentPoints + points,
    lastPointsEarned: new Date(),
  }, { merge: true });
}

/**
 * 포인트 사용
 * @returns true: 성공, false: 포인트 부족
 */
export async function usePoints(userId: string, points: number): Promise<boolean> {
  const userRef = doc(db, 'users', userId);
  const userDoc = await getDoc(userRef);
  const currentPoints = userDoc.data()?.points || 0;
  
  if (currentPoints < points) {
    return false; // 포인트 부족
  }
  
  await setDoc(userRef, {
    points: currentPoints - points,
  }, { merge: true });
  
  return true;
}