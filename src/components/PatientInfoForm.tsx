'use client';

import { useState } from 'react';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export interface PatientInfoData {
  name: string;
  gender: string;
  age: string;
  idCardNumber: string;
  department: string;
  inpatientNumber: string;
}

interface PatientInfoFormProps {
  prefix?: string;
  onChange?: (data: PatientInfoData) => void;
}

export function PatientInfoForm({
  prefix = 'patient',
  onChange,
}: PatientInfoFormProps) {
  const [data, setData] = useState<PatientInfoData>({
    name: '',
    gender: '',
    age: '',
    idCardNumber: '',
    department: '',
    inpatientNumber: '',
  });

  const handleChange = (field: keyof PatientInfoData, value: string) => {
    const newData = { ...data, [field]: value };
    setData(newData);
    onChange?.(newData);
  };

  return (
    <div className="rounded-xl border border-border bg-secondary/30 p-5 space-y-5">
      <div className="flex items-center gap-2">
        <div className="h-1.5 w-1.5 rounded-full bg-primary" />
        <h3 className="font-semibold text-foreground">患者信息</h3>
        <span className="text-xs text-muted-foreground">（请填写）</span>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor={`${prefix}Name`} className="text-sm font-medium">
            姓名 <span className="text-destructive">*</span>
          </Label>
          <Input
            id={`${prefix}Name`}
            placeholder="请输入姓名"
            required
            className="bg-background transition-all focus:ring-2 focus:ring-primary/20"
            value={data.name}
            onChange={e => handleChange('name', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`${prefix}Gender`} className="text-sm font-medium">
            性别 <span className="text-destructive">*</span>
          </Label>
          <select
            id={`${prefix}Gender`}
            className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-ring"
            required
            value={data.gender}
            onChange={e => handleChange('gender', e.target.value)}
          >
            <option value="">请选择</option>
            <option value="male">男</option>
            <option value="female">女</option>
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor={`${prefix}Age`} className="text-sm font-medium">
            年龄 <span className="text-destructive">*</span>
          </Label>
          <Input
            id={`${prefix}Age`}
            type="number"
            placeholder="请输入年龄"
            required
            className="bg-background transition-all focus:ring-2 focus:ring-primary/20"
            value={data.age}
            onChange={e => handleChange('age', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`${prefix}IdCardNumber`} className="text-sm font-medium">身份证号</Label>
          <Input
            id={`${prefix}IdCardNumber`}
            placeholder="请输入身份证号"
            className="bg-background transition-all focus:ring-2 focus:ring-primary/20"
            value={data.idCardNumber}
            onChange={e => handleChange('idCardNumber', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`${prefix}Department`} className="text-sm font-medium">科室</Label>
          <Input
            id={`${prefix}Department`}
            placeholder="请输入科室"
            className="bg-background transition-all focus:ring-2 focus:ring-primary/20"
            value={data.department}
            onChange={e => handleChange('department', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`${prefix}InpatientNumber`} className="text-sm font-medium">住院号</Label>
          <Input
            id={`${prefix}InpatientNumber`}
            placeholder="请输入住院号"
            className="bg-background transition-all focus:ring-2 focus:ring-primary/20"
            value={data.inpatientNumber}
            onChange={e => handleChange('inpatientNumber', e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
