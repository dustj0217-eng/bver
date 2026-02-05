'use client';

import { usePathname, useRouter } from 'next/navigation';
import { Header, Footer, MobileNav } from '@/components/Layout';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const activeTab = (() => {
    if (pathname.startsWith('/goods')) return 'goods';
    if (pathname.startsWith('/popup')) return 'popup';
    if (pathname.startsWith('/my')) return 'my';
    return 'home';
  })();

  return (
    <>
      <Header />

      <main className="pt-14 md:pt-16 pb-14 md:pb-0">
        {children}
      </main>

      <MobileNav
        activeTab={activeTab}
        onTabChange={(tab) => {
          if (tab === 'home') router.push('/');
          if (tab === 'goods') router.push('/goods');
          if (tab === 'popup') router.push('/popup');
          if (tab === 'my') router.push('/my');
        }}
      />

      <Footer />
    </>
  );
}
