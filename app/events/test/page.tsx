'use client';

import { useState } from 'react';

export default function EventTestPage() {
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const handleChange = (key: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-2xl mx-auto px-4 py-10 md:py-14">
        {/* 헤더 설명 */}
        <section className="mb-12 md:mb-16">
          <h1 className="text-2xl md:text-3xl font-display font-bold mb-4">
            당신은 어떤 비버인가요?
          </h1>
          <p className="text-sm md:text-base text-gray-600 leading-relaxed">
            비버하우스는 ‘쉼’에 대해 생각합니다.<br />
            바쁘게 살아가는 하루 속에서, 우리는 각자 다른 방식으로 쉬고 있죠.<br /><br />
            몇 가지 질문을 통해<br className="hidden md:block" />
            지금의 당신과 가장 닮은 비버를 찾아보세요.
          </p>
        </section>

        {/* 질문 폼 */}
        <section className="space-y-10">
          {/* Q1 */}
          <div>
            <p className="font-medium mb-3">
              1. 하루가 끝난 저녁, 가장 먼저 하고 싶은 일은?
            </p>
            <div className="space-y-2">
              {[
                '아무 생각 없이 누워 있기',
                '좋아하는 영상이나 콘텐츠 보기',
                '가볍게 산책하거나 바람 쐬기',
                '내일 할 일을 정리하며 마음 정돈하기',
              ].map((option) => (
                <label
                  key={option}
                  className="flex items-center gap-2 text-sm md:text-base cursor-pointer"
                >
                  <input
                    type="radio"
                    name="q1"
                    value={option}
                    checked={answers.q1 === option}
                    onChange={() => handleChange('q1', option)}
                  />
                  {option}
                </label>
              ))}
            </div>
          </div>

          {/* Q2 */}
          <div>
            <p className="font-medium mb-3">
              2. 쉼이 필요하다고 느끼는 순간은 언제인가요?
            </p>
            <div className="space-y-2">
              {[
                '몸이 먼저 지칠 때',
                '마음이 이유 없이 무거울 때',
                '해야 할 일이 너무 많을 때',
                '아무 감정도 느껴지지 않을 때',
              ].map((option) => (
                <label
                  key={option}
                  className="flex items-center gap-2 text-sm md:text-base cursor-pointer"
                >
                  <input
                    type="radio"
                    name="q2"
                    value={option}
                    checked={answers.q2 === option}
                    onChange={() => handleChange('q2', option)}
                  />
                  {option}
                </label>
              ))}
            </div>
          </div>

          {/* Q3 */}
          <div>
            <p className="font-medium mb-3">
              3. 나에게 ‘잘 쉰 하루’란?
            </p>
            <div className="space-y-2">
              {[
                '아무것도 하지 않아도 괜찮았던 날',
                '해야 할 일을 다 끝낸 날',
                '좋은 감정을 오래 느낀 날',
                '혼자 있는 시간이 충분했던 날',
              ].map((option) => (
                <label
                  key={option}
                  className="flex items-center gap-2 text-sm md:text-base cursor-pointer"
                >
                  <input
                    type="radio"
                    name="q3"
                    value={option}
                    checked={answers.q3 === option}
                    onChange={() => handleChange('q3', option)}
                  />
                  {option}
                </label>
              ))}
            </div>
          </div>
        </section>

        {/* 하단 안내 */}
        <section className="mt-14 md:mt-20 text-center">
          <p className="text-sm text-gray-500">
            모든 질문에 정답은 없습니다.<br />
            지금의 당신에게 가장 가까운 답을 골라주세요.
          </p>
        </section>
      </div>
    </div>
  );
}
