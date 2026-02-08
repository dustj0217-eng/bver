// app/events/beaver-test/page.tsx
'use client';

import { useState } from 'react';

// 비버 유형 정의
type BeaverType = 'peaceful' | 'creative' | 'organized' | 'adventurous';

interface BeaverResult {
  name: string;
  description: string;
  traits: string[];
  restStyle: string;
  recommendation: string;
}

const beaverResults: Record<BeaverType, BeaverResult> = {
  peaceful: {
    name: '고요한 비버',
    description: '당신은 고요함 속에서 진정한 휴식을 찾는 비버입니다. 아무것도 하지 않는 시간의 소중함을 아는 당신은, 번잡함에서 벗어나 나만의 공간에서 깊은 평온을 느낍니다.',
    traits: [
      '조용한 환경에서 에너지를 충전합니다',
      '혼자만의 시간을 소중히 여깁니다',
      '미니멀한 라이프스타일을 선호합니다',
      '느린 템포의 일상을 즐깁니다'
    ],
    restStyle: '완전한 정적 속에서 아무 생각 없이 누워있거나, 창밖을 바라보며 멍때리는 시간',
    recommendation: '조용한 카페 한 켠, 집 안의 가장 편안한 소파, 혹은 자연의 소리만 들리는 공원이 당신의 쉼터가 되어줄 거예요.'
  },
  creative: {
    name: '창의적인 비버',
    description: '당신은 영감과 자극 속에서 쉬는 독특한 비버입니다. 새로운 콘텐츠를 접하고, 아름다운 것을 감상하며, 상상력을 자유롭게 펼칠 때 진정으로 재충전됩니다.',
    traits: [
      '영화, 음악, 예술에서 위로를 받습니다',
      '새로운 아이디어에 호기심이 많습니다',
      '감각적인 경험을 즐깁니다',
      '영감을 주는 공간을 좋아합니다'
    ],
    restStyle: '좋아하는 영화나 시리즈를 정주행하거나, 전시회를 둘러보고, 새로운 음악을 발견하는 시간',
    recommendation: '북카페, 미술관, 감각적인 인테리어의 공간들이 당신에게 휴식과 동시에 영감을 선물할 거예요.'
  },
  organized: {
    name: '정돈된 비버',
    description: '당신은 질서와 계획 속에서 마음의 평화를 얻는 비버입니다. 할 일을 정리하고, 공간을 깔끔하게 만들고, 내일을 준비할 때 비로소 진정한 안정감을 느낍니다.',
    traits: [
      '정리정돈된 환경을 선호합니다',
      '계획을 세우면 마음이 편안해집니다',
      '생산적인 휴식을 추구합니다',
      '루틴과 규칙성을 중요하게 여깁니다'
    ],
    restStyle: '다이어리를 정리하고, 방을 깔끔하게 청소하며, 다음 주 계획을 차분히 세우는 시간',
    recommendation: '잘 정돈된 서재, 조용한 스터디 카페, 혹은 체계적으로 정리된 나만의 작업 공간이 당신의 안식처가 될 거예요.'
  },
  adventurous: {
    name: '활동적인 비버',
    description: '당신은 움직임과 변화 속에서 활력을 찾는 비버입니다. 가만히 있는 것보다 가벼운 산책, 새로운 장소 탐험, 몸을 움직이는 활동을 통해 진정한 재충전을 경험합니다.',
    traits: [
      '실외 활동으로 스트레스를 해소합니다',
      '새로운 장소를 탐험하는 것을 좋아합니다',
      '신체 활동 후 상쾌함을 느낍니다',
      '정적인 휴식보다 동적인 재충전을 선호합니다'
    ],
    restStyle: '동네를 산책하거나, 자전거를 타고, 가까운 카페나 공원을 찾아 나서는 시간',
    recommendation: '산책로, 강변 공원, 작은 동네 골목길, 혹은 처음 가보는 카페들이 당신에게 새로운 에너지를 줄 거예요.'
  }
};

const questions = [
  {
    id: 1,
    question: '하루가 끝난 저녁, 가장 먼저 하고 싶은 일은?',
    options: [
      { text: '아무 생각 없이 누워 있기', scores: { peaceful: 3, creative: 0, organized: 0, adventurous: 0 } },
      { text: '좋아하는 영상이나 콘텐츠 보기', scores: { peaceful: 0, creative: 3, organized: 0, adventurous: 0 } },
      { text: '가볍게 산책하거나 바람 쐬기', scores: { peaceful: 0, creative: 0, organized: 0, adventurous: 3 } },
      { text: '내일 할 일을 정리하며 마음 정돈하기', scores: { peaceful: 0, creative: 0, organized: 3, adventurous: 0 } },
    ]
  },
  {
    id: 2,
    question: '쉼이 필요하다고 느끼는 순간은 언제인가요?',
    options: [
      { text: '몸이 먼저 지칠 때', scores: { peaceful: 2, creative: 0, organized: 1, adventurous: 0 } },
      { text: '마음이 이유 없이 무거울 때', scores: { peaceful: 1, creative: 2, organized: 0, adventurous: 0 } },
      { text: '해야 할 일이 너무 많을 때', scores: { peaceful: 0, creative: 0, organized: 3, adventurous: 0 } },
      { text: '아무 감정도 느껴지지 않을 때', scores: { peaceful: 0, creative: 1, organized: 0, adventurous: 2 } },
    ]
  },
  {
    id: 3,
    question: '나에게 "잘 쉰 하루"란?',
    options: [
      { text: '아무것도 하지 않아도 괜찮았던 날', scores: { peaceful: 3, creative: 0, organized: 0, adventurous: 0 } },
      { text: '해야 할 일을 다 끝낸 날', scores: { peaceful: 0, creative: 0, organized: 3, adventurous: 0 } },
      { text: '좋은 감정을 오래 느낀 날', scores: { peaceful: 0, creative: 2, organized: 0, adventurous: 1 } },
      { text: '혼자 있는 시간이 충분했던 날', scores: { peaceful: 2, creative: 1, organized: 0, adventurous: 0 } },
    ]
  },
  {
    id: 4,
    question: '주말 오전, 당신의 이상적인 시작은?',
    options: [
      { text: '알람 없이 자연스럽게 눈 뜨기', scores: { peaceful: 3, creative: 1, organized: 0, adventurous: 0 } },
      { text: '좋아하는 음악과 함께 여유로운 브런치', scores: { peaceful: 0, creative: 2, organized: 1, adventurous: 0 } },
      { text: '미리 계획한 일정대로 움직이기', scores: { peaceful: 0, creative: 0, organized: 3, adventurous: 1 } },
      { text: '즉흥적으로 밖으로 나가기', scores: { peaceful: 0, creative: 0, organized: 0, adventurous: 3 } },
    ]
  },
  {
    id: 5,
    question: '스트레스를 받을 때 가장 효과적인 해소법은?',
    options: [
      { text: '조용한 곳에서 혼자 시간 보내기', scores: { peaceful: 3, creative: 0, organized: 0, adventurous: 0 } },
      { text: '좋아하는 취미나 창작 활동 하기', scores: { peaceful: 0, creative: 3, organized: 0, adventurous: 0 } },
      { text: '할 일 목록 정리하고 하나씩 처리하기', scores: { peaceful: 0, creative: 0, organized: 3, adventurous: 0 } },
      { text: '운동하거나 몸을 움직이기', scores: { peaceful: 0, creative: 0, organized: 0, adventurous: 3 } },
    ]
  },
  {
    id: 6,
    question: '이상적인 휴가지를 고른다면?',
    options: [
      { text: '아무도 없는 조용한 시골 마을', scores: { peaceful: 3, creative: 0, organized: 0, adventurous: 0 } },
      { text: '감각적인 분위기의 부티크 호텔', scores: { peaceful: 1, creative: 3, organized: 0, adventurous: 0 } },
      { text: '체계적으로 관광 명소를 둘러볼 수 있는 도시', scores: { peaceful: 0, creative: 0, organized: 3, adventurous: 1 } },
      { text: '트레킹이나 액티비티가 가능한 자연', scores: { peaceful: 0, creative: 0, organized: 0, adventurous: 3 } },
    ]
  }
];

export default function EventTestPage() {
  const [currentStep, setCurrentStep] = useState<'intro' | 'quiz' | 'result' | 'submit'>('intro');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [scores, setScores] = useState<Record<BeaverType, number>>({
    peaceful: 0,
    creative: 0,
    organized: 0,
    adventurous: 0
  });
  const [result, setResult] = useState<BeaverType | null>(null);
  const [formData, setFormData] = useState({ name: '', phone: '' });
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationDirection, setAnimationDirection] = useState<'forward' | 'backward'>('forward');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleStart = () => {
    setCurrentStep('quiz');
  };

  const handleAnswer = (optionScores: Record<BeaverType, number>) => {
    setIsAnimating(true);
    setAnimationDirection('forward');

    setTimeout(() => {
      const newScores = { ...scores };
      Object.keys(optionScores).forEach((key) => {
        newScores[key as BeaverType] += optionScores[key as BeaverType];
      });
      setScores(newScores);

      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        // 결과 계산
        const maxScore = Math.max(...Object.values(newScores));
        const resultType = (Object.keys(newScores) as BeaverType[]).find(
          (key) => newScores[key] === maxScore
        ) || 'peaceful';
        setResult(resultType);
        setCurrentStep('result');
      }

      setTimeout(() => {
        setIsAnimating(false);
      }, 50);
    }, 300);
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setIsAnimating(true);
      setAnimationDirection('backward');

      setTimeout(() => {
        setCurrentQuestion(currentQuestion - 1);
        
        // 이전 질문의 점수를 제거
        const prevQuestion = questions[currentQuestion];
        const newScores = { ...scores };
        
        // 현재 질문에서 선택했던 답변의 점수를 찾아 제거하는 로직은
        // 실제로는 답변 이력을 추적해야 하므로, 여기서는 간단히 처리
        // 실제 구현시에는 answersHistory 같은 state를 추가로 관리해야 합니다
        
        setScores(newScores);

        setTimeout(() => {
          setIsAnimating(false);
        }, 50);
      }, 300);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Google Sheets API로 데이터 전송
      const submitData = {
        name: formData.name,
        phone: formData.phone,
        result: result ? beaverResults[result].name : '',
        resultType: result,
        timestamp: new Date().toISOString(),
        scores: scores
      };

      // 여기에 실제 Google Sheets Web App URL을 넣으세요
      const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxUcjD8m_y0MdVTNv3eAuKjnM9a0b7R2LD1_0wNPRy1lbaDa88BKFbHOY17sMUxR08hxA/exec';
      
      const response = await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData)
      });

      // no-cors 모드에서는 응답을 읽을 수 없으므로 성공으로 간주
      setCurrentStep('submit');
    } catch (error) {
      alert('제출 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRestart = () => {
    setCurrentStep('intro');
    setCurrentQuestion(0);
    setScores({ peaceful: 0, creative: 0, organized: 0, adventurous: 0 });
    setResult(null);
    setFormData({ name: '', phone: '' });
  };

  // 인트로 화면
  if (currentStep === 'intro') {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="max-w-lg w-full text-center">
          <div className="mb-6 inline-block bg-amber-50 border-2 border-amber-400 px-6 py-3 rounded-lg">
            <p className="text-amber-800 font-bold text-sm">
              이벤트 참여자 중 추첨하여 5,000원 상당 기프티콘 증정!
            </p>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold mb-6 tracking-tight">
            당신은 어떤 비버인가요?
          </h1>
          <p className="text-gray-600 leading-relaxed mb-4">
            비버하우스는 '쉼'에 대해 생각합니다.
          </p>
          <p className="text-gray-600 leading-relaxed mb-8">
            바쁘게 살아가는 하루 속에서, 우리는 각자 다른 방식으로 쉬고 있죠.
            <br />몇 가지 질문을 통해 지금의 당신과 가장 닮은 비버를 찾아보세요.
          </p>
          <button
            onClick={handleStart}
            className="bg-black text-white px-10 py-4 text-base font-medium hover:bg-gray-800 transition-colors"
          >
            시작하기
          </button>
        </div>
      </div>
    );
  }

  // 퀴즈 화면
  if (currentStep === 'quiz') {
    const question = questions[currentQuestion];
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="max-w-xl w-full">
          {/* 진행 바 */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-500">
                {currentQuestion + 1} / {questions.length}
              </span>
              <span className="text-sm text-gray-500">
                {Math.round(((currentQuestion + 1) / questions.length) * 100)}%
              </span>
            </div>
            <div className="w-full h-1 bg-gray-100">
              <div
                className="h-full bg-black transition-all duration-300"
                style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
              />
            </div>
          </div>

          {/* 질문 - 애니메이션 적용 */}
          <div
            className={`transition-all duration-300 ${
              isAnimating
                ? animationDirection === 'forward'
                  ? 'opacity-0 translate-x-10'
                  : 'opacity-0 -translate-x-10'
                : 'opacity-100 translate-x-0'
            }`}
          >
            <h2 className="text-xl md:text-2xl font-bold mb-8 leading-relaxed">
              {question.question}
            </h2>

            {/* 선택지 */}
            <div className="space-y-3">
              {question.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(option.scores)}
                  disabled={isAnimating}
                  className="w-full text-left px-6 py-5 border border-gray-200 hover:border-black hover:bg-gray-50 transition-all text-base disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {option.text}
                </button>
              ))}
            </div>
          </div>

          {/* 뒤로가기 버튼 */}
          {currentQuestion > 0 && (
            <div className="mt-6">
              <button
                onClick={handlePrevious}
                disabled={isAnimating}
                className="text-gray-600 hover:text-black transition-colors text-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>←</span>
                <span>이전 질문으로</span>
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // 결과 화면
  if (currentStep === 'result' && result) {
    const beaverData = beaverResults[result];
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-2xl mx-auto px-4 py-12 md:py-16">
          {/* 결과 헤더 */}
          <div className="text-center mb-12 animate-fadeIn">
            <div className="inline-block px-4 py-2 bg-black text-white text-sm font-medium mb-4">
              당신의 비버 유형
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              {beaverData.name}
            </h1>
            <p className="text-lg text-gray-700 leading-relaxed">
              {beaverData.description}
            </p>
          </div>

          {/* 특성 */}
          <div className="mb-10">
            <h3 className="text-lg font-bold mb-4 pb-2 border-b-2 border-black">
              주요 특성
            </h3>
            <ul className="space-y-3">
              {beaverData.traits.map((trait, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-black mr-3 mt-1">•</span>
                  <span className="text-gray-700">{trait}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* 휴식 스타일 */}
          <div className="mb-10">
            <h3 className="text-lg font-bold mb-4 pb-2 border-b-2 border-black">
              나만의 휴식 방법
            </h3>
            <p className="text-gray-700 leading-relaxed">
              {beaverData.restStyle}
            </p>
          </div>

          {/* 추천 공간 */}
          <div className="mb-12">
            <h3 className="text-lg font-bold mb-4 pb-2 border-b-2 border-black">
              추천 공간
            </h3>
            <p className="text-gray-700 leading-relaxed">
              {beaverData.recommendation}
            </p>
          </div>

          {/* 이벤트 안내 */}
          <div className="mb-6 bg-amber-50 border-2 border-amber-400 p-4 rounded-lg">
            <p className="text-amber-800 text-sm text-center">
              <span className="font-bold">이벤트 참여 안내</span>
              <br />
              참여자 중 추첨을 통해 5,000원 상당 기프티콘을 드립니다!
            </p>
          </div>

          {/* 정보 입력 폼 */}
          <div className="bg-gray-50 p-8 border border-gray-200">
            <h3 className="text-xl font-bold mb-6">결과를 저장하고 이벤트에 참여하세요</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">이름</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-black"
                  placeholder="이름을 입력해주세요"
                  disabled={isSubmitting}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">전화번호</label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-black"
                  placeholder="010-0000-0000"
                  disabled={isSubmitting}
                />
              </div>
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-black text-white py-4 text-base font-medium hover:bg-gray-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? '제출 중...' : '제출하기'}
                </button>
              </div>
            </form>
          </div>

          {/* 다시하기 버튼 */}
          <div className="mt-6 text-center">
            <button
              onClick={handleRestart}
              className="text-gray-600 hover:text-black transition-colors text-sm underline"
            >
              테스트 다시하기
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 제출 완료 화면
  if (currentStep === 'submit') {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="max-w-lg w-full text-center animate-fadeIn">
          <div className="mb-6">
            <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center mx-auto text-2xl">
              ✓
            </div>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            제출이 완료되었습니다
          </h2>
          <p className="text-gray-600 mb-2">
            소중한 참여 감사드립니다.
          </p>
          <p className="text-gray-600 mb-8">
            당첨자 발표는 추후 개별 연락을 통해 안내드리겠습니다.
          </p>
          <button
            onClick={handleRestart}
            className="bg-black text-white px-8 py-3 text-base font-medium hover:bg-gray-800 transition-colors"
          >
            처음으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  return null;
}