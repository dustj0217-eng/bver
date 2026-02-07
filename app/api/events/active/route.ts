// app/api/events/active/route.ts
import { getActiveEvents } from '@/lib/notion';

export async function GET() {
  try {
    const events = await getActiveEvents();
    return Response.json(events);
  } catch (error) {
    console.error('진행중 이벤트 로드 에러:', error);
    return Response.json([], { status: 500 });
  }
}