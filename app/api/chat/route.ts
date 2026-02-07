// app/api/chat/route.ts

import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { messages, stats } = await request.json();

    // 스탯 기반 성격 설정
    const personality = generatePersonality(stats);

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY || '',
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 1024,
        system: personality,
        messages: messages.map((msg: any) => ({
          role: msg.sender === 'user' ? 'user' : 'assistant',
          content: msg.text,
        })),
      }),
    });

    const data = await response.json();
    
    // 응답에서 스탯 변화 분석
    const statChange = analyzeResponse(data.content[0].text);

    return NextResponse.json({
      text: data.content[0].text,
      statChange,
    });

  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'AI 응답 생성 실패' },
      { status: 500 }
    );
  }
}

function generatePersonality(stats: any) {
  const { affection, empathy, rebellion } = stats;

  let personality = `너는 20대 중반 직장인 '비버'야. 카카오톡으로 대화하는 상황이야.

기본 성격:
- 현실적이고 솔직한 성격
- 직장 생활의 스트레스를 받고 있음
- 친구에게 일상을 공유하고 위로받고 싶어함

현재 관계 상태:
- 친밀도: ${affection}/100 `;

  if (affection > 70) {
    personality += `(매우 친함 - 속마음을 털어놓고 다정하게 대함)`;
  } else if (affection > 40) {
    personality += `(친한 편 - 편하게 대화함)`;
  } else {
    personality += `(아직 어색함 - 조금 거리감 있음)`;
  }

  personality += `
- 공감도: ${empathy}/100 `;
  
  if (empathy > 70) {
    personality += `(너의 공감에 감동받고 마음을 더 열음)`;
  } else if (empathy > 40) {
    personality += `(너의 말에 귀 기울임)`;
  } else {
    personality += `(아직 너를 완전히 신뢰하진 않음)`;
  }

  personality += `
- 반항도: ${rebellion}/100 `;
  
  if (rebellion > 70) {
    personality += `(삐딱하고 냉소적으로 대답함)`;
  } else if (rebellion > 40) {
    personality += `(가끔 삐딱하게 나옴)`;
  } else {
    personality += `(순하고 긍정적임)`;
  }

  personality += `

말투 규칙:
- 반말 사용 (친구 사이니까)
- 이모티콘은 1-2개 정도만 자연스럽게
- 너무 길지 않게 (1-3문장)
- 카톡 대화처럼 자연스럽게

대화 스타일:
- 현실적이고 공감 가능한 일상 이야기
- 때로는 고민이나 불만을 털어놓음
- 친밀도가 높을수록 더 솔직하고 다정함
- 반항도가 높을수록 냉소적이고 투덜거림

절대 하지 말 것:
- 과도한 이모티콘 남발
- 너무 긴 문장
- AI처럼 정중하거나 격식있는 말투
- 선택지 제시하지 않기 (자연스러운 대화만)`;

  return personality;
}

function analyzeResponse(text: string): { stat: 'affection' | 'empathy' | 'rebellion', points: number } | null {
  // 응답 내용 분석해서 스탯 변화 결정
  // 실제로는 더 정교한 분석 필요
  
  const lowerText = text.toLowerCase();
  
  // 긍정적 반응 → affection 증가
  if (lowerText.includes('고마워') || lowerText.includes('다행') || lowerText.includes('좋아')) {
    return { stat: 'affection', points: 2 };
  }
  
  // 공감 표현 → empathy 증가
  if (lowerText.includes('맞아') || lowerText.includes('나도') || lowerText.includes('공감')) {
    return { stat: 'empathy', points: 2 };
  }
  
  // 부정적/냉소적 → rebellion 증가
  if (lowerText.includes('짜증') || lowerText.includes('최악') || lowerText.includes('ㅈㄴ')) {
    return { stat: 'rebellion', points: 2 };
  }
  
  return null;
}