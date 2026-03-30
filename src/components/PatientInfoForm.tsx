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
    <div className="bg-muted p-4 rounded-lg space-y-4">
      <h3 className="font-semibold">患者信息（请填写）</h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label htmlFor={`${prefix}Name`}>
            姓名 <span className="text-red-500">*</span>
          </Label>
          <Input
            id={`${prefix}Name`}
            placeholder="请输入姓名"
            required
            className="bg-white"
            value={data.name}
            onChange={e => handleChange('name', e.target.value)}
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor={`${prefix}Gender`}>
            性别 <span className="text-red-500">*</span>
          </Label>
          <select
            id={`${prefix}Gender`}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm bg-white"
            required
            value={data.gender}
            onChange={e => handleChange('gender', e.target.value)}
          >
            <option value="">请选择</option>
            <option value="male">男</option>
            <option value="female">女</option>
          </select>
        </div>
        <div className="space-y-1">
          <Label htmlFor={`${prefix}Age`}>
            年龄 <span className="text-red-500">*</span>
          </Label>
          <Input
            id={`${prefix}Age`}
            type="number"
            placeholder="请输入年龄"
            required
            className="bg-white"
            value={data.age}
            onChange={e => handleChange('age', e.target.value)}
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor={`${prefix}IdCardNumber`}>身份证号</Label>
          <Input
            id={`${prefix}IdCardNumber`}
            placeholder="请输入身份证号"
            className="bg-white"
            value={data.idCardNumber}
            onChange={e => handleChange('idCardNumber', e.target.value)}
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor={`${prefix}Department`}>科室</Label>
          <Input
            id={`${prefix}Department`}
            placeholder="请输入科室"
            className="bg-white"
            value={data.department}
            onChange={e => handleChange('department', e.target.value)}
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor={`${prefix}InpatientNumber`}>住院号</Label>
          <Input
            id={`${prefix}InpatientNumber`}
            placeholder="请输入住院号"
            className="bg-white"
            value={data.inpatientNumber}
            onChange={e => handleChange('inpatientNumber', e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
