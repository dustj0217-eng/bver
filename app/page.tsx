'use client';

import { useState, useEffect, useRef } from 'react';
import { HomeSection } from '../components/Sections';
import { useRouter } from 'next/navigation';

export default function MainPage() {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set());
  
  const sectionRefs = useRef<{ [key: string]: HTMLElement | null }>({});

  // Intersection Observer로 스크롤 애니메이션
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections((prev) => new Set(prev).add(entry.target.id));
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -100px 0px' }
    );

    Object.values(sectionRefs.current).forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <main className="">
        <HomeSection visibleSections={visibleSections} sectionRefs={sectionRefs} />
      </main>

      <style jsx global>{`
        html {
          scroll-behavior: smooth;
        }

        .swiper-pagination-bullet {
          background: rgba(0, 0, 0, 0.3);
        }
        .swiper-pagination-bullet-active {
          background: black;
        }

        .hero-swiper .swiper-slide {
          transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        }

        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-marquee {
          animation: marquee 20s linear infinite;
        }
      `}</style>
    </div>
  );
}