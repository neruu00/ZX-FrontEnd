import { useDroppable } from '@dnd-kit/core';

// Shelf 컨테이너 컴포넌트
export default function Shelf({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) {
  const { setNodeRef } = useDroppable({ id });

  return <div ref={setNodeRef}>{children}</div>;
}
