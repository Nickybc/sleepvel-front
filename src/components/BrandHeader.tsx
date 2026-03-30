import Image from 'next/image';

import { cn } from '@/lib/utils';

type BrandHeaderProps = {
  subtitle: string;
  title?: string;
  className?: string;
  titleClassName?: string;
  subtitleClassName?: string;
};

export function BrandHeader({
  subtitle,
  title = '齐鲁•乐眠智慧诊疗系统',
  className,
  titleClassName,
  subtitleClassName,
}: BrandHeaderProps) {
  const [left, right] = title.split('•');
  const hasDot = typeof right === 'string';

  return (
    <div className={cn('mb-6 space-y-3 text-center', className)}>
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
        <h1 className={cn('text-2xl font-bold tracking-tight text-foreground md:text-3xl', titleClassName)}>
          {hasDot ? (
            <>
              {left}
              <span className="mx-1.5 align-middle text-[0.6em] text-primary/60">
                •
              </span>
              <span className="text-primary">{right}</span>
            </>
          ) : (
            title
          )}
        </h1>
      </div>
      <h2
        className={cn(
          'text-base font-medium text-muted-foreground md:text-lg',
          subtitleClassName
        )}
      >
        {subtitle}
      </h2>
    </div>
  );
}
