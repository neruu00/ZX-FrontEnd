import { cn } from '@/lib/utils';

interface Props extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  as?: React.ElementType;
  areaVisible?: boolean;
}

export default function PageContainer({
  children,
  as: Component = 'div',
  className,
  areaVisible = false, //FIXME - container 영역 확인용 속성
  ...props
}: Props) {
  return (
    <Component
      className={cn([
        'no-scrollbar overflow-y-scroll',
        'mx-auto w-[clamp(24rem,100%,64rem)] overflow-y-scroll p-8',
        //FIXME - remove desktop breakpoint style
        areaVisible
          ? 'tablet:bg-amber-200 laptop:bg-cyan-200 desktop:bg-lime-200'
          : '',
        className,
      ])}
      {...props}
    >
      {children}
    </Component>
  );
}
