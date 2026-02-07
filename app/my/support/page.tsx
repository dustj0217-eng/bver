// app/my/support/page.tsx

// app/my/support/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Accordion from '../components/Accordion';

export default function SupportPage() {
  const router = useRouter();
  const [openSection, setOpenSection] = useState<string | null>(null);

  const faqs = [
    {
      id: 'shipping',
      question: '배송은 얼마나 걸리나요?',
      answer: '주문 후 평균 2-3일 소요되며, 영업일 기준으로 계산됩니다.'
    },
    {
      id: 'return',
      question: '반품/교환은 어떻게 하나요?',
      answer: '수령 후 7일 이내 고객센터로 문의주시면 안내해드립니다.'
    },
    {
      id: 'payment',
      question: '결제 방법은 무엇이 있나요?',
      answer: '현재 계좌이체 결제를 지원하고 있습니다.'
    },
  ];

  return (
    <div className="min-h-screen bg-[#FAFAFA] pb-20">
      {/* 헤더 */}
      <div className="bg-white border-b">
        <div className="max-w-md mx-auto px-6 py-4 flex items-center gap-4">
          <button onClick={() => router.back()}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-lg font-bold">고객센터</h1>
        </div>
      </div>

      <div className="max-w-md mx-auto px-6 pt-6">
        {/* 빠른 문의 */}
        <div className="bg-white rounded-xl p-6 mb-6">
          <h2 className="text-base font-bold mb-4">빠른 문의</h2>
          <div className="space-y-3">
            <a
              href="mailto:support@example.com"
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-900 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold">이메일 문의</p>
                  <p className="text-xs text-gray-500">support@example.com</p>
                </div>
              </div>
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>

            <a
              href="tel:1588-0000"
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-900 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold">전화 문의</p>
                  <p className="text-xs text-gray-500">1588-0000 (평일 9-18시)</p>
                </div>
              </div>
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        </div>

        {/* FAQ */}
        <div className="bg-white rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b">
            <h2 className="text-base font-bold">자주 묻는 질문</h2>
          </div>
          <div>
            {faqs.map((faq) => (
              <Accordion
                key={faq.id}
                title={faq.question}
                open={openSection === faq.id}
                onClick={() => setOpenSection(openSection === faq.id ? null : faq.id)}
              >
                <div className="pt-2 text-sm text-gray-600 leading-relaxed">
                  {faq.answer}
                </div>
              </Accordion>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}