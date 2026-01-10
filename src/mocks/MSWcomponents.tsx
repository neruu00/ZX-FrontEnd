'use client';

import { Suspense, use } from 'react';

const mswPromise =
  typeof window !== 'undefined'
    ? Promise.all([
        import('@/mocks/browser'),
        import('@/mocks/handlers'), // 3. 핸들러도 동적으로 import
      ]).then(async ([{ default: worker }, { handlers }]) => {
        // 프로덕션 환경에서는 MSW 비활성화
        if (
          process.env.NODE_ENV === 'production' ||
          process.env.NEXT_PUBLIC_MSW_ENABLED === 'false'
        ) {
          return;
        }

        console.log('클라이언트 사이드 MSW 설정');

        await worker.start({
          onUnhandledRequest(request, print) {
            if (request.url.includes('_next')) {
              return;
            }
            print.warning();
          },
        });

        // 4. 동적으로 가져온 핸들러 주입
        worker.use(...handlers);

        // HMR 대응 (타입 안전성 확보)
        if (typeof module !== 'undefined' && (module as any).hot) {
          (module as any).hot.dispose(() => {
            worker.stop();
          });
        }

        console.log(worker.listHandlers());
      })
    : Promise.resolve();

export function MSWProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
  use(mswPromise);
  return children;
}
