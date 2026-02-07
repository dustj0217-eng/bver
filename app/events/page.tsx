// app/events/page.tsx
import { getAllEvents } from '@/lib/notion';
import Image from 'next/image';
import Link from 'next/link';

export default async function EventsPage() {
  const allEvents = await getAllEvents();
  const today = new Date().toISOString().split('T')[0];

  // 상태별 분류
  const activeEvents = allEvents.filter(e => 
    e.startDate <= today && e.endDate >= today
  );
  const upcomingEvents = allEvents.filter(e => 
    e.startDate > today
  );
  const endedEvents = allEvents.filter(e => 
    e.endDate < today
  );

  return (
    <div className="px-4 md:px-6 py-6 md:py-10 max-w-6xl mx-auto">
      <h1 className="text-2xl md:text-3xl font-display font-bold mb-8">
        이벤트
      </h1>

      {/* 진행중인 이벤트 */}
      {activeEvents.length > 0 && (
        <section className="mb-12">
          <h2 className="text-xl md:text-2xl font-display font-bold mb-6 flex items-center gap-2">
            <span className="inline-block w-2 h-2 bg-black rounded-full"></span>
            진행중인 이벤트
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeEvents.map(event => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </section>
      )}

      {/* 예정된 이벤트 */}
      {upcomingEvents.length > 0 && (
        <section className="mb-12">
          <h2 className="text-xl md:text-2xl font-display font-bold mb-6 flex items-center gap-2">
            <span className="inline-block w-2 h-2 bg-gray-400 rounded-full"></span>
            예정된 이벤트
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingEvents.map(event => (
              <EventCard key={event.id} event={event} upcoming />
            ))}
          </div>
        </section>
      )}

      {/* 종료된 이벤트 */}
      {endedEvents.length > 0 && (
        <section>
          <h2 className="text-xl md:text-2xl font-display font-bold mb-6 text-gray-400">
            종료된 이벤트
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 opacity-60">
            {endedEvents.map(event => (
              <EventCard key={event.id} event={event} ended />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

// 이벤트 카드 컴포넌트
function EventCard({ 
  event, 
  upcoming = false, 
  ended = false 
}: { 
  event: any; 
  upcoming?: boolean; 
  ended?: boolean;
}) {
  return (
    <Link href={event.linkUrl || `/events/${event.id}`}>
      <div className={`group cursor-pointer ${ended ? 'pointer-events-none' : ''}`}>
        {/* 이미지 컨테이너 - 크기 고정, 내부 이미지만 확대 */}
        <div 
          className="relative aspect-video mb-3 rounded-lg overflow-hidden border border-gray-200"
          style={{ backgroundColor: event.bgColor }}
        >
          {event.image && (
            <Image
              src={event.image}
              alt={event.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
          )}
          
          {/* 상태 뱃지 */}
          {upcoming && (
            <div className="absolute top-3 right-3 bg-white text-gray-700 text-xs font-medium px-3 py-1.5 rounded-full border border-gray-200">
              예정
            </div>
          )}
          {ended && (
            <div className="absolute top-3 right-3 bg-gray-100 text-gray-500 text-xs font-medium px-3 py-1.5 rounded-full">
              종료
            </div>
          )}
          {!upcoming && !ended && event.endDate && (
            <div className="absolute top-3 right-3 bg-black text-white text-xs font-medium px-3 py-1.5 rounded-full">
              {getDday(event.endDate)}
            </div>
          )}
        </div>

        {/* 텍스트 영역 */}
        <div>
          <h4 className="font-display font-bold mb-1.5 text-base md:text-lg group-hover:underline underline-offset-2 decoration-1">
            {event.title}
          </h4>
          <p className="text-sm md:text-base text-gray-600 mb-3">
            {event.description}
          </p>
          
          {/* 태그 - 있을 때만 표시 */}
          {event.tags && event.tags.length > 0 && (
            <div className="flex gap-1.5 flex-wrap">
              {event.tags.map((tag: string) => (
                <span 
                  key={tag} 
                  className="text-xs text-gray-500 bg-gray-50 px-2.5 py-1 rounded-full border border-gray-100"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}

function getDday(endDate: string): string {
  const today = new Date();
  const end = new Date(endDate);
  const diff = Math.ceil((end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  
  if (diff === 0) return '오늘 마감';
  if (diff < 0) return '종료';
  return `D-${diff}`;
}