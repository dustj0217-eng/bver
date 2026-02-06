'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function PopupPage() {
  const [tab] = useState<'ongoing' | 'past'>('ongoing');
  const [popups, setPopups] = useState([
    {
      id: '1',
      title: '',
      date: '',
      time: '',
      location: '',
      description: [''],
      bgColor: '#F5F5F5',
      image: '',
    }
  ]);

  // Notion에서 데이터 가져오기
  useEffect(() => {
    fetch('/api/popups')
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) {
          setPopups(data);
        }
      })
      .catch(err => console.error('팝업 로드 실패:', err));
  }, []);

  const ongoingPopups = popups;
  const pastPopups: typeof popups = [];

  const currentPopups = tab === 'ongoing' ? ongoingPopups : pastPopups;

  // 각 포스터마다 랜덤 회전값
  const rotations = [2, -1.5, 1, -2, 1.5, -1];

  return (
    <div className="min-h-screen bg-white">
      {/* 팝업 목록 - 포스터 느낌 */}
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="space-y-20">
          {currentPopups.map((popup, index) => (
            <div
              key={popup.id}
              className="grid grid-cols-2 gap-6 items-center"
            >
              {/* 포스터 */}
              <div
                className="relative aspect-[3/4] rounded-lg overflow-hidden"
                style={{
                  backgroundColor: popup.bgColor,
                  transform: `rotate(${rotations[index % rotations.length]}deg)`,
                  transition: 'transform 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'rotate(0deg) scale(1.03)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = `rotate(${rotations[index % rotations.length]}deg)`;
                }}
              >
                {popup.image ? (
                  <Image
                    src={popup.image}
                    alt={popup.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-6xl"></span>
                  </div>
                )}
              </div>

              {/* 정보 영역 */}
              <div className="flex flex-col justify-center">
                <h3 className="text-xl font-display font-bold mb-3">
                  {popup.title}
                </h3>

                <p className="text-sm text-gray-700 mb-1">
                  {popup.date}
                </p>

                {popup.time && (
                  <p className="text-sm text-gray-700 mb-1">
                    {popup.time}
                  </p>
                )}

                <p className="text-sm text-gray-500 mb-4">
                  {popup.location}
                </p>

                {/* 설명 */}
                <div className="text-sm text-gray-600 leading-relaxed space-y-1">
                  {popup.description.map((line, i) => (
                    <p key={i}>{line}</p>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}