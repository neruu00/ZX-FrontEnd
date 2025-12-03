import { Star } from 'lucide-react';

interface Props {
  value: number;
}

export default function StarScore({ value }: Props) {
  return (
    <div className="flex items-center gap-0.5">
      {[...Array(Math.round(value / 2))].map((_, i) => (
        <Star key={i} size={12} className="text-brand fill-brand" />
      ))}
    </div>
  );
}
