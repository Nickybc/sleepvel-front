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
    <div className={cn('mb-6 space-y-2 text-center', className)}>
      <div className="flex items-center justify-center gap-3">
        <Image
          src="/images/logo.png"
          alt="齐鲁医院乐眠智慧诊疗系统 Logo"
          width={64}
          height={64}
          className="h-14 w-14 object-contain"
          priority
        />
        <h1 className={cn('text-3xl font-bold text-slate-700', titleClassName)}>
          {hasDot ? (
            <>
              {left}
              <span className="mx-1 align-middle text-[0.55em] text-blue-300">
                •
              </span>
              <span className="">{right}</span>
            </>
          ) : (
            title
          )}
        </h1>
      </div>
      <h2
        className={cn(
          'text-xl font-semibold text-slate-600',
          subtitleClassName
        )}
      >
        {subtitle}
      </h2>
    </div>
  );
}
