// lib/firestore/game.ts
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { GameData, GameStats, Mission, ChatHistory } from '@/app/game/types';
import { initializeMissions } from '@/app/game/data/missions';

export async function getGameData(userId: string): Promise<GameData | null> {
  try {
    // games/{userId} → users/{userId}/gameData/main
    const docRef = doc(db, 'users', userId, 'gameData', 'main');
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return docSnap.data() as GameData;
    }
    return null;
  } catch (error) {
    console.error('Error getting game data:', error);
    return null;
  }
}

export async function initializeGameData(userId: string): Promise<GameData> {
  const initialData: GameData = {
    userId,
    stats: {
      level: 1,
      affection: 0,
      empathy: 0,
      rebellion: 0,
      points: 0,
      exp: 0,
    },
    missions: initializeMissions(),
    chatHistory: {
      lastChatTime: new Date().toISOString(),
      todayChats: 0,
      totalChats: 0,
      loginStreak: 1,
      lastLoginDate: new Date().toISOString().split('T')[0],
      maxLoginStreak: undefined
    },
    achievements: [],
    lastUpdated: new Date().toISOString(),
  };
  
  // games/{userId} → users/{userId}/gameData/main
  const docRef = doc(db, 'users', userId, 'gameData', 'main');
  await setDoc(docRef, initialData);
  return initialData;
}

export async function updateGameStats(userId: string, stats: Partial<GameStats>): Promise<void> {
  try {
    const docRef = doc(db, 'users', userId, 'gameData', 'main');
    await updateDoc(docRef, {
      stats,
      lastUpdated: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error updating stats:', error);
    throw error;
  }
}

export async function updateMissions(userId: string, missions: Mission[]): Promise<void> {
  try {
    const docRef = doc(db, 'users', userId, 'gameData', 'main');
    await updateDoc(docRef, {
      missions,
      lastUpdated: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error updating missions:', error);
    throw error;
  }
}

export async function updateChatHistory(userId: string, chatHistory: Partial<ChatHistory>): Promise<void> {
  try {
    const docRef = doc(db, 'users', userId, 'gameData', 'main');
    await updateDoc(docRef, {
      chatHistory,
      lastUpdated: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error updating chat history:', error);
    throw error;
  }
}

export async function addAchievement(userId: string, achievementId: string): Promise<void> {
  try {
    const gameData = await getGameData(userId);
    if (!gameData) return;
    
    if (!gameData.achievements.includes(achievementId)) {
      const docRef = doc(db, 'users', userId, 'gameData', 'main');
      await updateDoc(docRef, {
        achievements: [...gameData.achievements, achievementId],
        lastUpdated: new Date().toISOString(),
      });
    }
  } catch (error) {
    console.error('Error adding achievement:', error);
    throw error;
  }
}

export async function resetDailyMissions(userId: string): Promise<void> {
  try {
    const gameData = await getGameData(userId);
    if (!gameData) return;
    
    const resetMissions = gameData.missions.map(mission => {
      if (mission.type === 'daily') {
        return { ...mission, progress: 0, completed: false, claimed: false };
      }
      return mission;
    });
    
    await updateMissions(userId, resetMissions);
  } catch (error) {
    console.error('Error resetting daily missions:', error);
    throw error;
  }
}