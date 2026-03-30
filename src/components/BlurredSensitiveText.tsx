import { ReactNode } from 'react';

type BlurredSensitiveTextProps = {
  children: ReactNode;
};

export function BlurredSensitiveText({ children }: BlurredSensitiveTextProps) {
  return <span className="inline-block blur-xs select-none">{children}</span>;
}
