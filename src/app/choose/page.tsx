/* eslint-disable react/no-unknown-property */
'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type Mode = 'his' | 'manual';

export default function ChoosePage() {
  const router = useRouter();
  const [patientId, setPatientId] = useState('');

  const go = (mode: Mode) => {
    const trimmed = patientId.trim();
    if (!trimmed) return;
    router.push(
      `/report?patientId=${encodeURIComponent(trimmed)}&mode=${mode}`
    );
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#dbeafe_0%,#eef2ff_35%,#f8fafc_70%)] py-12 px-4">
      <div className="mx-auto max-w-3xl">
        <div className="rounded-lg bg-white/90 p-6 shadow-md backdrop-blur-sm">
          <div className="mb-6 text-center">
            <div className="text-2xl font-bold text-slate-700">选择数据来源</div>
            <div className="mt-2 text-sm text-slate-500">
              同一个编号可用于 HIS 回填或手动录入。
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="patientId" className="text-base">
                患者编号
              </Label>
              <Input
                id="patientId"
                value={patientId}
                placeholder="请输入 patientId / patient_code"
                onChange={e => setPatientId(e.target.value)}
                className="h-12 text-base"
              />
            </div>

            <div className="grid grid-cols-1 gap-3">
              <Button
                size="lg"
                className="h-12 text-base"
                disabled={!patientId.trim()}
                onClick={() => go('his')}
              >
                HIS系统（从后端拿数据）
              </Button>
              <Button
                size="lg"
                variant="secondary"
                className="h-12 text-base"
                disabled={!patientId.trim()}
                onClick={() => go('manual')}
              >
                手动输入（不走 HIS）
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

