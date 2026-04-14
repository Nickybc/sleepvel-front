import Image from 'next/image';

import { cn } from '@/lib/utils';

type BrandHeaderProps = {
  title?: string;
  className?: string;
  titleClassName?: string;
};

export function BrandHeader({
  title = '齐鲁•乐眠智慧诊疗系统',
  className,
  titleClassName,
}: BrandHeaderProps) {
  // 分割标题：齐鲁•乐眠 | 智慧诊疗系统
  const parts = title.split('智慧诊疗系统');
  const leftPart = parts[0]; // 齐鲁•乐眠
  const hasRightPart = title.includes('智慧诊疗系统');

  return (
    <div className={cn('mb-6 text-center', className)}>
      <div className="flex items-center justify-center gap-4">
        <div className="relative">
          <div className="absolute -inset-1 rounded-full bg-primary/10 blur-sm" />
          <Image
            src="/images/logo.png"
            alt="齐鲁医院乐眠智慧诊疗系统 Logo"
            width={64}
            height={64}
            className="relative h-16 w-16 object-contain drop-shadow-md"
            priority
          />
        </div>
        <h1 className={cn('text-2xl font-bold tracking-tight md:text-3xl', titleClassName)}>
          {hasRightPart ? (
            <>
              <span className="text-primary">{leftPart}</span>
              <span className="text-foreground">智慧诊疗系统</span>
            </>
          ) : (
            <span className="text-foreground">{title}</span>
          )}
        </h1>
      </div>
    </div>
  );
}
