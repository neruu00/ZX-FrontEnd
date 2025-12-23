'use client';

import { Suspense, use } from 'react';

import { handlers } from '@/mocks/handlers';

const mockingEnabledPromise =
  // client-side MSW 설정
  typeof window !== 'undefined'
    ? import('@/mocks/browser').then(async ({ default: worker }) => {
        //NOTE - 프로덕션 환경에서는 MSW 비활성화
        if (
          process.env.NODE_ENV !== 'production' ||
          process.env.MSW_ENABLED === 'false'
        ) {
          return;
        }
        console.log('클라이언트 사이드 MSW 설정');
        await worker.start({
          onUnhandledRequest(request, print) {
            //NOTE - _next 경로는 무시
            if (request.url.includes('_next')) {
              return;
            }
            print.warning();
          },
        });
        worker.use(...handlers);
        /**
         * NOTE - 핫 모듈 교체(HMR) 시 워커 중지
         * > https://github.com/vercel/next.js/issues/69098
         */
        (module as any).hot?.dispose(() => {
          worker.stop();
        });
        console.log(worker.listHandlers());
      })
    : Promise.resolve();

export function MSWProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // If MSW is enabled, we need to wait for the worker to start,
  // so we wrap the children in a Suspense boundary until it's ready.
  return (
    <Suspense fallback={null}>
      <MSWProviderWrapper>{children}</MSWProviderWrapper>
    </Suspense>
  );
}

function MSWProviderWrapper({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  use(mockingEnabledPromise);
  return children;
}
