import { Progress } from './ui/progress';

interface Props {
  className?: string;
  description?: string;
  value: number;
}

export default function ProgressCard({ className, description, value }: Props) {
  return (
    <div className={className}>
      <div className="flex w-full items-end justify-between">
        <span className="text-muted-foreground text-xs">{description}</span>
        <span className="text-brand text-sm">{value}%</span>
      </div>
      <Progress value={value} />
    </div>
  );
}
