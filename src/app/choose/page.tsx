/* eslint-disable react/no-unknown-property */
'use client';

import { Moon, Database, Edit3 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { BrandHeader } from '@/components/BrandHeader';
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
    <div className="min-h-screen bg-background">
      {/* 顶部装饰条 */}
      <div className="h-1.5 bg-gradient-to-r from-primary via-primary/70 to-primary/40" />
      
      <div className="px-4 py-12 md:py-16">
        <div className="mx-auto max-w-xl">
          {/* 品牌头部 */}
          <BrandHeader 
            subtitle="多模态睡眠大模型智能辅助诊疗系统"
            className="mb-10"
          />

          {/* 主卡片 */}
          <div className="rounded-2xl border border-border bg-card p-8 shadow-lg shadow-primary/5">
            {/* 标题区域 */}
            <div className="mb-8 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                <Moon className="h-7 w-7 text-primary" />
              </div>
              <h2 className="text-xl font-semibold text-foreground">选择数据来源</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                同一个编号可用于 HIS 回填或手动录入
              </p>
            </div>

            <div className="space-y-6">
              {/* 患者编号输入 */}
              <div className="space-y-2">
                <Label htmlFor="patientId" className="text-sm font-medium text-foreground">
                  患者编号
                </Label>
                <Input
                  id="patientId"
                  value={patientId}
                  placeholder="请输入 patientId / patient_code"
                  onChange={e => setPatientId(e.target.value)}
                  className="h-12 bg-background text-base transition-all focus:ring-2 focus:ring-primary/20"
                />
              </div>

              {/* 操作按钮 */}
              <div className="grid grid-cols-1 gap-3 pt-2">
                <Button
                  size="lg"
                  className="h-14 gap-3 text-base font-medium shadow-md shadow-primary/20 transition-all hover:shadow-lg hover:shadow-primary/30"
                  disabled={!patientId.trim()}
                  onClick={() => go('his')}
                >
                  <Database className="h-5 w-5" />
                  HIS系统获取数据
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="h-14 gap-3 border-2 text-base font-medium transition-all hover:bg-secondary"
                  disabled={!patientId.trim()}
                  onClick={() => go('manual')}
                >
                  <Edit3 className="h-5 w-5" />
                  手动录入数据
                </Button>
              </div>
            </div>
          </div>

          {/* 底部说明 */}
          <p className="mt-6 text-center text-xs text-muted-foreground">
            齐鲁医院睡眠科 - 智慧诊疗系统
          </p>
        </div>
      </div>
    </div>
  );
}

