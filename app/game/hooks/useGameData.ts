'use client';

import { useState, useEffect } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/lib/firebase'; // ← 경로 수정
import { GameData, GameStats, Mission, ChatHistory } from '../types';
import { 
  getGameData, 
  initializeGameData, 
  updateGameStats, 
  updateMissions, 
  updateChatHistory,
  addAchievement,
  resetDailyMissions,
} from '@/lib/firestore/game'; // ← 경로 수정
import { STAT_INCREASE, POINT_REWARDS, getExpForLevel } from '../data/constants';

export function useGameData() {
  const [user, setUser] = useState<User | null>(null);
  const [gameData, setGameData] = useState<GameData | null>(null);
  const [loading, setLoading] = useState(true);

  // Firebase Auth 상태 구독
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      console.log('🔍 Auth user:', currentUser?.uid); // 디버깅
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    console.log('👤 Current user:', user?.uid); // 디버깅
    if (user) {
      loadGameData();
    } else {
      setGameData(null);
      setLoading(false);
    }
  }, [user]);

  const loadGameData = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      let data = await getGameData(user.uid);
      
      if (!data) {
        console.log('📝 Initializing new game data...');
        data = await initializeGameData(user.uid);
      } else {
        console.log('✅ Game data loaded:', data);
        // 일일 미션 리셋 체크
        const lastLogin = new Date(data.chatHistory.lastLoginDate);
        const today = new Date();
        
        if (lastLogin.toDateString() !== today.toDateString()) {
          console.log('🔄 Resetting daily missions...');
          await resetDailyMissions(user.uid);
          data = await getGameData(user.uid);
        }
      }
      
      setGameData(data);
    } catch (error) {
      console.error('❌ Failed to load game data:', error);
    } finally {
      setLoading(false);
    }
  };

  const increaseStat = async (stat: 'affection' | 'empathy' | 'rebellion', amount: number = STAT_INCREASE.perChoice) => {
    if (!user || !gameData) return;
    
    const newStats = { ...gameData.stats };
    newStats[stat] = Math.min(newStats[stat] + amount, 100);
    newStats.exp += amount;
    
    // 레벨업 체크
    const requiredExp = getExpForLevel(newStats.level);
    if (newStats.exp >= requiredExp) {
      newStats.level += 1;
      newStats.exp = newStats.exp - requiredExp;
    }
    
    await updateGameStats(user.uid, newStats);
    setGameData({ ...gameData, stats: newStats });
    
    // 업적 체크
    await checkAchievements(newStats);
  };

  const addPoints = async (points: number) => {
    if (!user || !gameData) return;
    
    const newStats = { ...gameData.stats, points: gameData.stats.points + points };
    await updateGameStats(user.uid, newStats);
    setGameData({ ...gameData, stats: newStats });
  };

  const incrementChatCount = async () => {
    if (!user || !gameData) return;
    
    const newChatHistory: ChatHistory = {
      ...gameData.chatHistory,
      lastChatTime: new Date().toISOString(),
      todayChats: gameData.chatHistory.todayChats + 1,
      totalChats: gameData.chatHistory.totalChats + 1,
    };
    
    await updateChatHistory(user.uid, newChatHistory);
    setGameData({ ...gameData, chatHistory: newChatHistory });
    
    // 포인트 지급
    await addPoints(POINT_REWARDS.chat);
    
    // 미션 진행도 업데이트
    await updateMissionProgress('chat_count', 1);
    await updateMissionProgress('choice_count', 1);
  };

  const updateMissionProgress = async (type: string, increment: number = 1) => {
    if (!user || !gameData) return;
    
    const updatedMissions = gameData.missions.map(mission => {
      if (mission.completed) return mission;
      
      let shouldUpdate = false;
      
      if (type === 'chat_count' && mission.requirement.type === 'chat_count') {
        shouldUpdate = true;
      } else if (type === 'choice_count' && mission.requirement.type === 'choice_count') {
        shouldUpdate = true;
      } else if (type === 'login_streak' && mission.requirement.type === 'login_streak') {
        shouldUpdate = true;
      } else if (type === 'shop_visit' && mission.requirement.type === 'shop_visit') {
        shouldUpdate = true;
      }
      
      if (shouldUpdate) {
        const newProgress = mission.progress + increment;
        const completed = newProgress >= mission.requirement.target;
        return { ...mission, progress: newProgress, completed };
      }
      
      return mission;
    });
    
    await updateMissions(user.uid, updatedMissions);
    setGameData({ ...gameData, missions: updatedMissions });
  };

  const claimMissionReward = async (missionId: string) => {
    if (!user || !gameData) return;
    
    const mission = gameData.missions.find(m => m.id === missionId);
    if (!mission || !mission.completed || mission.claimed) return;
    
    // 포인트 지급
    await addPoints(mission.reward.points);
    
    // 칭호 지급
    if (mission.reward.title) {
      await addAchievement(user.uid, mission.reward.title);
      setGameData({
        ...gameData,
        achievements: [...gameData.achievements, mission.reward.title],
      });
    }
    
    // 미션 claimed 처리
    const updatedMissions = gameData.missions.map(m =>
      m.id === missionId ? { ...m, claimed: true } : m
    );
    
    await updateMissions(user.uid, updatedMissions);
    setGameData({ ...gameData, missions: updatedMissions });
  };

  const checkAchievements = async (stats: GameStats) => {
    if (!user || !gameData) return;
    
    const updatedMissions = gameData.missions.map(mission => {
      if (mission.type !== 'achievement' || mission.completed) return mission;
      
      if (mission.requirement.type === 'stat_level' && mission.requirement.stat) {
        const statValue = stats[mission.requirement.stat];
        if (statValue >= mission.requirement.target) {
          return { ...mission, progress: mission.requirement.target, completed: true };
        }
      }
      
      return mission;
    });
    
    await updateMissions(user.uid, updatedMissions);
    setGameData({ ...gameData, missions: updatedMissions });
  };

  const recordShopVisit = async () => {
    if (!user || !gameData) return;
    await updateMissionProgress('shop_visit', 1);
  };

  return {
    gameData,
    loading,
    increaseStat,
    addPoints,
    incrementChatCount,
    claimMissionReward,
    recordShopVisit,
    refresh: loadGameData,
  };
}