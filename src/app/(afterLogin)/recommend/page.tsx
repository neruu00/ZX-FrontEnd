import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import BookRecommendedContainer from './_components/BookRecommendedContainer';
import { fetchBookListProxy } from '@/lib/aladin.api';

export default async function RecommendPage() {
  const queryClient = new QueryClient();
  const dehydratedState = dehydrate(queryClient);
  await queryClient.prefetchQuery({
    queryKey: ['books'],
    queryFn: fetchBookListProxy,
  });

  return (
    <main className="m-auto min-h-dvh w-[920px] p-4">
      <h1>Books Recommended Page</h1>
      <HydrationBoundary state={dehydratedState}>
        <BookRecommendedContainer />
      </HydrationBoundary>
    </main>
  );
}
