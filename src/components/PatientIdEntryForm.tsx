'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { getPatient } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function PatientIdEntryForm() {
  const [patientId, setPatientId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLookup = async () => {
    if (!patientId.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      await getPatient(patientId.trim());
      router.push(`/report?patientId=${encodeURIComponent(patientId.trim())}`);
    } catch (err) {
      if (err instanceof Error && err.message === 'NOT_FOUND') {
        setError('患者未找到，请检查ID后重试');
      } else {
        setError('查询失败，请稍后重试');
      }
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && patientId.trim() && !isLoading) {
      handleLookup();
    }
  };

  return (
    <div className="mx-auto max-w-full space-y-6">
      <div className="space-y-2">
        <Label htmlFor="patientId" className="text-base">
          患者ID
        </Label>
        <Input
          id="patientId"
          type="text"
          placeholder="请输入患者ID"
          value={patientId}
          onChange={e => setPatientId(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
          className="h-12 text-base"
        />
      </div>

      <Button
        onClick={handleLookup}
        disabled={!patientId.trim() || isLoading}
        className="w-full h-12 text-base"
        size="lg"
      >
        {isLoading ? '查询中...' : '查询'}
      </Button>

      {error && <p className="text-sm text-red-500 text-center">{error}</p>}
    </div>
  );
}
