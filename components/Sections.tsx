import { useEffect, useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import { popupStores, allProducts } from '../lib/data';
import Link from 'next/link';
import Image from 'next/image';

interface HomeSectionProps {
  visibleSections: Set<string>;
  sectionRefs: React.MutableRefObject<{ [key: string]: HTMLElement | null }>;
}

export function HomeSection({ visibleSections, sectionRefs }: HomeSectionProps) {
  const [products, setProducts] = useState(allProducts);
  const [popups, setPopups] = useState(popupStores);

  // 컴포넌트 마운트되면 Notion 데이터 가져오기
  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) {
          setProducts(data); // Notion 데이터로 교체
        }
      })
      .catch(err => {
        console.error('상품 못 가져옴:', err);
        // 에러나도 그냥 기본 더미 데이터 쓰면 됨
      });
  }, []);

  // 팝업 데이터 가져오기 ⭐ 추가
  useEffect(() => {
    fetch('/api/popups')
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) {
          setPopups(data);
        }
      })
      .catch(err => console.error('팝업 못 가져옴:', err));
  }, []);

  return (
    <>
      {/* 메인 배너 */}
      <section className="overflow-hidden">
        <div className="max-w-3xl mx-auto">
          <Swiper
            modules={[Autoplay, Pagination]}
            slidesPerView={1}
            loop
            speed={700}
            autoplay={{ delay: 3000, disableOnInteraction: false }}
            pagination={{ clickable: true }}
            className="hero-swiper"
          >
            {[
              { id: 1, src: '/poster-1.png', title: 'GAME OVER?' },
              { id: 2, src: '/poster-2.png', title: 'BEAVER ESCAPE' },
            ].map((poster) => (
              <SwiperSlide key={poster.id}>
                <div className="relative h-80 md:h-96 overflow-hidden">
                  {/* 이미지 */}
                  <img
                    src={poster.src}
                    alt={poster.title}
                    className="absolute inset-0 w-full h-full object-cover"
                  />

                  {/* 오버레이 */}
                  <div className="absolute inset-0 bg-black/30" />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>

      {/* 무한 스크롤 텍스트 */}
      <section className="bg-white text-black py-2 mb-6 md:mb-8 max-w-3xl mx-auto overflow-hidden whitespace-nowrap border-y border-gray-200">
        <div className="inline-block animate-marquee">
          <span className="text-xs md:text-sm font-medium mx-4">NEW ARRIVALS</span>
          <img src="/logo.png" alt="Beaver House" className="inline h-4 md:h-5 mx-4 align-middle" />
          <span className="text-xs md:text-sm font-medium mx-4">POPUP STORE OPEN</span>
          <img src="/logo.png" alt="Beaver House" className="inline h-4 md:h-5 mx-4 align-middle" />
          <span className="text-xs md:text-sm font-medium mx-4">FREE SHIPPING OVER 50,000₩</span>
          <img src="/logo.png" alt="Beaver House" className="inline h-4 md:h-5 mx-4 align-middle" />
          <span className="text-xs md:text-sm font-medium mx-4">BEAVER HOUSE OFFICIAL</span>
          <img src="/logo.png" alt="Beaver House" className="inline h-4 md:h-5 mx-4 align-middle" />
          <span className="text-xs md:text-sm font-medium mx-4">NEW ARRIVALS</span>
          <img src="/logo.png" alt="Beaver House" className="inline h-4 md:h-5 mx-4 align-middle" />
          <span className="text-xs md:text-sm font-medium mx-4">POPUP STORE OPEN</span>
          <img src="/logo.png" alt="Beaver House" className="inline h-4 md:h-5 mx-4 align-middle" />
          <span className="text-xs md:text-sm font-medium mx-4">FREE SHIPPING OVER 50,000₩</span>
          <img src="/logo.png" alt="Beaver House" className="inline h-4 md:h-5 mx-4 align-middle" />
          <span className="text-xs md:text-sm font-medium mx-4">BEAVER HOUSE OFFICIAL</span>
          <img src="/logo.png" alt="Beaver House" className="inline h-4 md:h-5 mx-4 align-middle" />
        </div>
      </section>

      {/* 팝업 */}
      <section
        id="popup-section"
        ref={(el) => { sectionRefs.current['popup-section'] = el; }}
        className={`mb-8 md:mb-12 transition-all duration-1000 ${
          visibleSections.has('popup-section')
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 translate-y-10'
        }`}
      >
        <div className="max-w-3xl mx-auto px-4 mb-3 md:mb-4">
          <h2 className="text-lg md:text-xl font-display font-bold">Popup</h2>
        </div>
        <div className="max-w-3xl mx-auto">
          <Swiper 
            spaceBetween={12} 
            slidesPerView={1.2}
            breakpoints={{
              640: {
                slidesPerView: 2,
                spaceBetween: 12,
              },
            }}
            style={{ paddingLeft: '16px' }}
          >
            {popups.map((popup) => (
              <SwiperSlide key={popup.id}>
                <Link href={`/popup`}>
                  <div
                    className="relative h-80 md:h-96 rounded-lg overflow-hidden group cursor-pointer transition-transform duration-300"
                  >
                    {/* 배경 이미지 */}
                    {popup.image ? (
                      <div 
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                        style={{ 
                          backgroundImage: `url(${popup.image})`,
                        }}
                      />
                    ) : (
                      <div 
                        className="absolute inset-0"
                        style={{ backgroundColor: popup.bgColor }}
                      />
                    )}
                    
                    {/* 그라데이션 오버레이 */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                    
                    {/* 텍스트 컨텐츠 */}
                    <div className="absolute inset-0 p-5 md:p-6 flex flex-col justify-end text-white">
                      <h3 className="font-display font-bold text-xl md:text-2xl mb-2">
                        {popup.title}
                      </h3>
                      
                      <div className="space-y-1 text-sm md:text-base text-white/90">
                        {popup.date && (
                          <p className="flex items-center gap-1.5">
                            {popup.date}<br/>{popup.time}
                          </p>
                        )}
                        {popup.location && (
                          <p className="flex items-center gap-1.5">
                            {popup.location}
                          </p>
                        )}
                      </div>
                      
                      {popup.description && popup.description.length > 0 && (
                        <p className="mt-3 text-sm text-white/80 line-clamp-2">
                          {popup.description}
                        </p>
                      )}
                    </div>
                  </div>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>

      {/* 신상품 섹션 */}
      <section
        id="products-section"
        ref={(el) => { sectionRefs.current['products-section'] = el; }}
        className={`mb-8 md:mb-12 transition-all duration-1000 delay-200 ${
          visibleSections.has('products-section')
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 translate-y-10'
        }`}
      >
        <div className="max-w-3xl mx-auto px-4 mb-3 md:mb-4">
          <h2 className="text-lg md:text-xl font-display font-bold">Shop</h2>
        </div>
        <div className="max-w-3xl mx-auto">
          <Swiper 
            spaceBetween={12} 
            slidesPerView={2.3}
            breakpoints={{
              640: {
                slidesPerView: 3,
                spaceBetween: 12,
              },
            }}
            style={{ paddingLeft: '16px' }}
          >
            {products.slice(0, 8).map((product) => (
              <SwiperSlide key={product.id}>
                <Link href={`/goods/${product.id}`}>
                  <div className="cursor-pointer">
                    <div
                      className="relative aspect-square mb-2 overflow-hidden border border-gray-100"
                      style={{
                        backgroundColor: product.bgColor,
                        backgroundImage: product.image ? `url(${product.image})` : undefined,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                      }}
                    />

                    <p className="text-sm md:text-base font-medium mb-1">
                      {product.name}
                    </p>
                    <p className="text-sm md:text-base font-bold">
                      {product.price.toLocaleString()}원
                    </p>
                  </div>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>

      {/* 비버 소개 섹션 */}
      <section className="px-4 mb-8 md:mb-12 max-w-3xl mx-auto">
        <div className="border-y border-gray-200 mb-10"></div>

        {/* INTRO */}
        <div
          id="intro-section"
          ref={(el) => { sectionRefs.current['intro-section'] = el; }}
          className={`mb-16 transition-all duration-1000 ${
            visibleSections.has('intro-section')
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-10'
          }`}
        >
          <h2 className="text-2xl md:text-3xl font-display font-bold mb-7">
            BEAVER HOUSE
          </h2>
          <div className="space-y-4 text-sm md:text-base leading-relaxed">
            <p>비버하우스(Beaver House)는 쉼 없이 오늘을 살아가는 비버들의 이야기에서 출발했습니다.</p>
            <p>성실함이 미덕이 된 세상 속에서, 우리는 늘 다음을 향해 달려왔습니다.</p>
            <p>
              하지만 비버하우스는 묻습니다. 열심히 사는 것만이 전부일까?
              우리는 잠시 숨을 고르고, 몸과 마음을 달랠 수 있는 하우스의 필요성에 주목합니다.
            </p>
            <p>
              지친 일상 한가운데서 미소를 건네는 콘텐츠.
              아무것도 하지 않아도 괜찮다고 말하는 이야기.
              비버하우스는 치열한 댐 너머, 당신만의 안식처가 되겠습니다.
            </p>
          </div>
        </div>

        {/* LOGO */}
        <div
          id="logo-section"
          ref={(el) => { sectionRefs.current['logo-section'] = el; }}
          className={`mb-16 transition-all duration-1000 delay-200 ${
            visibleSections.has('logo-section')
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-10'
          }`}
        >
          <div className="flex flex-col md:flex-row gap-8 items-center">
            {/* 이미지 */}
            <div className="w-full md:w-1/3 flex justify-center">
              <img src="/logo.png" alt="Beaver House Logo" className="w-48 md:w-full object-contain" />
            </div>

            {/* 텍스트 */}
            <div className="md:w-2/3">
              <h3 className="text-lg md:text-xl font-display font-bold mb-4">
                우리의 로고
              </h3>
              <div className="space-y-3 text-sm md:text-base leading-relaxed">
                <p>
                  우리의 로고는 '비버의 집'에서 시작되었습니다.
                  나뭇가지가 켜켜이 쌓인 비버의 집은 우리가 떠올리는 '집'의 모습과 닮아 있습니다.
                </p>
                <p>
                  쉬지 않고 댐을 짓는 비버의 모습은
                  정신없이 하루를 살아가는 우리와 닮아 있습니다.
                  일하는 존재의 집이자, 쉬는 존재의 집이라는 의미를 담고 있습니다.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CHARACTER */}
        <div
          id="character-section"
          ref={(el) => { sectionRefs.current['character-section'] = el; }}
          className={`mb-16 transition-all duration-1000 delay-300 ${
            visibleSections.has('character-section')
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-10'
          }`}
        >
          <div className="flex flex-col md:flex-row-reverse gap-8 items-center">
            {/* 이미지 */}
            <div className="w-full md:w-1/3 flex justify-center">
              <img src="/bver.png" alt="Beaver Character" className="w-48 md:w-full object-contain" />
            </div>

            {/* 텍스트 */}
            <div className="md:w-2/3">
              <h3 className="text-lg md:text-xl font-display font-bold mb-4">
                비버 캐릭터
              </h3>
              <div className="space-y-3 text-sm md:text-base leading-relaxed">
                <p>
                  비버는 댐을 짓는 동물입니다.
                  살아갈 보금자리를 만들기 위해 끊임없이 나무를 모아 쌓습니다.
                </p>
                <p>
                  쉬지 않고 움직이며 집을 만들어내는 모습은
                  오늘을 치열하게 살아가고,
                  결국 ‘나의 집’으로 돌아가는 우리와 닮아 있습니다.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 mb-20 md:mb-24 max-w-3xl mx-auto">
        <div className='border-y border-gray-200 mb-8 md:mb-10'></div>
        <div
          id="events-section"
          ref={(el) => { sectionRefs.current['events-section'] = el; }}
          className={`transition-all duration-1000 ${
            visibleSections.has('events-section')
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-10'
          }`}
        >
          <h3 className="text-lg md:text-xl font-display font-bold mb-4 md:mb-6 grid md:grid-cols-2">진행중 이벤트</h3>
          {/* 이벤트 1 */}
          <Link href="/events/test">
            <div className="cursor-pointer">
              <div className="relative aspect-video mb-3 rounded-lg overflow-hidden bg-gray-100">
                <Image
                  src="/test.jpg"
                  alt="비버 테스트"
                  fill
                  className="object-cover"
                />
              </div>
              <h4 className="font-display font-bold mb-2 text-base md:text-lg">
                비버 테스트
              </h4>
              <p className="text-sm md:text-base text-gray-600">
                나는 어떤 비버일까?
              </p>
            </div>
          </Link>
        </div>
      </section>
    </>
  );
}