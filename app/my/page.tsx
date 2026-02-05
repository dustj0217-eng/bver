'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function MyPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        {/* 로그인 필요 안내 */}
        <div className="flex-1 flex flex-col items-center justify-center px-4">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
            <span className="text-4xl">🦫</span>
          </div>
          <h2 className="text-xl font-bold mb-2">로그인이 필요합니다</h2>
          <p className="text-sm text-gray-600 mb-8 text-center">
            비버하우스의 다양한 서비스를<br/>이용하시려면 로그인해주세요
          </p>
          <Link
            href="/my/login"
            className="w-full max-w-sm py-4 bg-black text-white text-center rounded-lg font-bold"
          >
            로그인 / 회원가입
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* 헤더 */}
      <header className="sticky top-0 bg-white z-10 border-b">
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center">
          <Link href="/" className="text-2xl">←</Link>
          <h1 className="flex-1 text-center text-lg font-display font-bold">마이페이지</h1>
          <div className="w-8"></div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto">
        {/* 프로필 */}
        <div className="px-4 py-6 border-b">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
              <span className="text-3xl">🦫</span>
            </div>
            <div>
              <p className="font-bold text-lg mb-1">비버러버</p>
              <p className="text-sm text-gray-600">beaver@example.com</p>
            </div>
          </div>
        </div>

        {/* 주문 현황 */}
        <div className="px-4 py-6 border-b">
          <h3 className="font-bold mb-4">주문 현황</h3>
          <div className="grid grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold mb-1">0</p>
              <p className="text-xs text-gray-600">결제대기</p>
            </div>
            <div>
              <p className="text-2xl font-bold mb-1">0</p>
              <p className="text-xs text-gray-600">배송준비</p>
            </div>
            <div>
              <p className="text-2xl font-bold mb-1">0</p>
              <p className="text-xs text-gray-600">배송중</p>
            </div>
            <div>
              <p className="text-2xl font-bold mb-1">0</p>
              <p className="text-xs text-gray-600">배송완료</p>
            </div>
          </div>
        </div>

        {/* 메뉴 */}
        <div className="px-4 py-2">
          <Link href="/my/orders" className="flex items-center justify-between py-4 border-b">
            <span className="text-sm">주문 내역</span>
            <span className="text-gray-400">→</span>
          </Link>
          <Link href="#" className="flex items-center justify-between py-4 border-b">
            <span className="text-sm">찜한 상품</span>
            <span className="text-gray-400">→</span>
          </Link>
          <Link href="#" className="flex items-center justify-between py-4 border-b">
            <span className="text-sm">쿠폰</span>
            <span className="text-gray-400">→</span>
          </Link>
          <Link href="#" className="flex items-center justify-between py-4 border-b">
            <span className="text-sm">포인트</span>
            <span className="text-gray-400">→</span>
          </Link>
        </div>

        {/* 고객센터 */}
        <div className="px-4 py-6 border-t mt-4">
          <h3 className="font-bold mb-4">고객센터</h3>
          <Link href="#" className="flex items-center justify-between py-4 border-b">
            <span className="text-sm">공지사항</span>
            <span className="text-gray-400">→</span>
          </Link>
          <Link href="#" className="flex items-center justify-between py-4 border-b">
            <span className="text-sm">자주 묻는 질문</span>
            <span className="text-gray-400">→</span>
          </Link>
          <Link href="#" className="flex items-center justify-between py-4 border-b">
            <span className="text-sm">1:1 문의</span>
            <span className="text-gray-400">→</span>
          </Link>
        </div>

        {/* 설정 */}
        <div className="px-4 py-6 border-t">
          <Link href="#" className="flex items-center justify-between py-4 border-b">
            <span className="text-sm">설정</span>
            <span className="text-gray-400">→</span>
          </Link>
          <button className="w-full text-left py-4 text-sm text-gray-600">
            로그아웃
          </button>
        </div>
      </div>
    </div>
  );
}