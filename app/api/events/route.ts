// app/api/events/route.ts
import { getAllEvents } from '@/lib/notion';

export async function GET() {
  try {
    const events = await getAllEvents();
    return Response.json(events);
  } catch (error) {
    console.error('이벤트 로드 에러:', error);
    return Response.json([], { status: 500 });
  }
}