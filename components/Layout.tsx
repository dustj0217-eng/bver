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
    <footer className="bg-black text-white px-4 md:px-6 py-10 text-sm">
      <div className="max-w-3xl mx-auto space-y-6">

        {/* 상호 */}
        <p className="font-bold text-lg">BEAVER HOUSE</p>

        {/* 사업자 정보 */}
        <div className="text-gray-600 space-y-1 leading-relaxed">
          <p>상호명: 비버하우스 (BEAVER HOUSE)</p>
          <p>대표자: 이경빈</p>
          <p>사업자등록번호: 582-22-02273</p>
        </div>

        {/* 고객 문의 */}
        <div className="text-gray-400 space-y-1">
          <p>이메일: bverhouse@gmail.com</p>
          <p className="text-xs">고객 문의는 현재 이메일로만 접수받습니다.</p>
        </div>

        {/* SNS */}
        <div className="flex gap-4">
          <a
            href="#"
            className="text-gray-400 hover:text-white transition-colors"
            aria-label="Instagram"
          >
            <Instagram size={22} />
          </a>
          <a
            href="#"
            className="text-gray-400 hover:text-white transition-colors"
            aria-label="Youtube"
          >
            <Youtube size={22} />
          </a>
        </div>

        {/* 약관 */}
        <div className="flex gap-4 text-xs text-gray-400">
          <button className="hover:text-white transition-colors">
            이용약관
          </button>
          <button className="font-semibold text-white">
            개인정보처리방침
          </button>
        </div>

        {/* 저작권 */}
        <p className="text-xs text-gray-500 pt-4">
          © 2026 BEAVER HOUSE. All rights reserved.
        </p>
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
