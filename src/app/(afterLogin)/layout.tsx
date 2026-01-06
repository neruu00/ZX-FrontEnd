import { SessionProvider } from 'next-auth/react';

import ReactQueryProvider from '@/components/ReactQueryProvider';
import Sidebar from '@/components/Sidebar';

export default async function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <SessionProvider>
      <ReactQueryProvider>
        <Sidebar>{children}</Sidebar>
      </ReactQueryProvider>
    </SessionProvider>
  );
}
