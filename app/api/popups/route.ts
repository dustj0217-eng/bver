// app/api/popups/route.ts
import { getAllPopups } from '@/lib/notion';

export async function GET() {
  try {
    const popups = await getAllPopups();
    return Response.json(popups);
  } catch (error) {
    console.error('팝업 로드 에러:', error);
    return Response.json([], { status: 500 });
  }
}