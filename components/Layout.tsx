'use client';

import { useState } from 'react';
import { Menu, X, Instagram, Youtube } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image'

interface HeaderProps {
  onMenuOpen: () => void;
}

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems = [
    { text: 'HOME', href: '/', delay: 0 },
    { text: 'SHOP', href: '/goods', delay: 100 },
    { text: 'EVENTS', href: '/events', delay: 200 },
    { text: 'POPUP STORE', href: '/popup', delay: 300 },
    { text: 'MY BEAVER', href: '/my', delay: 400},
  ];

  return (
    <>
      {/* 헤더 */}
      <header className="fixed top-0 left-0 right-0 bg-white z-40 h-14 md:h-16 border-b">
        <button
          onClick={() => setIsMenuOpen(true)}
          className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2"
          aria-label="메뉴 열기"
        >
          <Menu size={24} />
        </button>

        <Link
          href="/"
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        >
          <div className="flex items-center gap-2">
            <Image
              src="/logo.png"
              alt="Beaver House logo"
              width={30}
              height={30}
              priority
              className="h-6 md:h-7 w-auto"
            />
            <Image
              src="/logo-text.png"
              alt="Beaver House text logo"
              width={129}
              height={40}
              priority
              className="h-6 md:h-7 w-auto"
            />
          </div>
        </Link>
      </header>

      {/* 풀스크린 메뉴 */}
      <div
        aria-hidden={!isMenuOpen}
        className={`fixed inset-0 z-50 bg-black transition-all duration-500
          ${isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}
        `}
      >
        {/* 닫기 버튼 */}
        <button
          onClick={() => setIsMenuOpen(false)}
          className="absolute top-4 right-4 md:top-6 md:right-6 text-white"
          aria-label="메뉴 닫기"
        >
          <X size={28} />
        </button>

        {/* 메뉴 리스트 */}
        <nav className="flex h-full flex-col justify-center px-12 md:px-16">
          {menuItems.map((item) => {
            const commonClass = `
              text-white text-4xl md:text-5xl font-bold
              mb-8 md:mb-9 text-left
              transition-all duration-700
              ${isMenuOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}
            `;

            const style = {
              transitionDelay: isMenuOpen ? `${item.delay}ms` : '0ms',
            };

            if (item.href) {
              return (
                <Link
                  key={item.text}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={commonClass}
                  style={style}
                >
                  {item.text}
                </Link>
              );
            }

            return (
              <button
                key={item.text}
                type="button"
                onClick={() => setIsMenuOpen(false)}
                className={commonClass}
                style={style}
              >
                {item.text}
              </button>
            );
          })}
        </nav>
      </div>
    </>
  );
}

export function Footer() {
  return (
    <footer className="bg-black text-white px-4 md:px-6 py-10 md:py-12 text-sm md:text-base">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <p className="font-bold text-lg md:text-xl mb-4">BEAVER HOUSE</p>
          <div className="text-gray-400 space-y-1 text-sm md:text-base mb-6">
            <p>대표: 홍길동</p>
            <p>사업자등록번호: 123-45-67890</p>
            <p>통신판매업신고: 2026-서울마포-0001</p>
            <p>주소: 서울시 마포구 비버로 123</p>
          </div>
          
          <div className="text-gray-400 space-y-1 text-sm md:text-base mb-6">
            <p>이메일: contact@beaverhouse.co.kr</p>
            <p>고객센터: 02-1234-5678</p>
            <p className="text-xs md:text-sm">평일 10:00-18:00 (주말 및 공휴일 휴무)</p>
          </div>

          <div className="flex gap-4 mb-4">
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              <Instagram size={24} />
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              <Youtube size={24} />
            </a>
          </div>
          
          <div className="flex gap-4 text-xs md:text-sm text-gray-400 mb-6">
            <button className="hover:text-white transition-colors">이용약관</button>
            <button className="font-bold text-white">개인정보처리방침</button>
          </div>
        </div>

        <p className="text-xs md:text-sm text-gray-500">© 2026 BEAVER HOUSE. All rights reserved.</p>
      </div>
    </footer>
  );
}

interface MobileNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function MobileNav({ activeTab, onTabChange }: MobileNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t z-40 md:hidden">
      <div className="flex">
        {[
          { key: 'home', label: '홈' },
          { key: 'goods', label: '상점' },
          { key: 'popup', label: '팝업' },
          { key: 'my', label: 'MY' },
        ].map(item => (
          <button
            key={item.key}
            onClick={() => onTabChange(item.key)}
            className={`flex-1 py-3 text-center text-xs ${
              activeTab === item.key
                ? 'text-black font-medium'
                : 'text-gray-400'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
    </nav>
  );
}
