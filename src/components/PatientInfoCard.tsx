'use client';

import { Suspense, use } from 'react';

import { Patient } from '@/lib/schemas';

type PatientInfoCardProps = {
  patientInfoPromise: Promise<Patient>;
};

// Loading fallback component
function PatientLoading() {
  return (
    <div className="flex items-center justify-center rounded-xl border border-border bg-secondary/30 p-8">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent mx-auto"></div>
        <p className="mt-3 text-sm text-muted-foreground">正在从HIS获取患者信息...</p>
      </div>
    </div>
  );
}

// Patient display component
function PatientDisplay({ patient }: { patient: Patient }) {
  return (
    <div className="rounded-xl border border-border bg-secondary/30 p-5 space-y-4">
      <div className="flex items-center gap-2">
        <div className="h-1.5 w-1.5 rounded-full bg-primary" />
        <h3 className="font-semibold text-foreground">患者信息</h3>
        <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">HIS</span>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 text-sm">
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground min-w-[4rem]">姓名：</span>
          <span className="font-medium text-foreground">{patient.name}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground min-w-[4rem]">性别：</span>
          <span className="font-medium text-foreground">{patient.gender === 'male' ? '男' : '女'}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground min-w-[4rem]">年龄：</span>
          <span className="font-medium text-foreground">{patient.age}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground min-w-[4rem]">身份证号：</span>
          <span className="font-medium text-foreground">{patient.idCardNumber}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground min-w-[4rem]">科室：</span>
          <span className="font-medium text-foreground">{patient.department}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground min-w-[4rem]">住院号：</span>
          <span className="font-medium text-foreground">{patient.inpatientNumber}</span>
        </div>
      </div>
    </div>
  );
}

// Inner component that uses the `use` hook
function PatientInfoContent({ patientInfoPromise }: PatientInfoCardProps) {
  const patient = use(patientInfoPromise);

  return <PatientDisplay patient={patient} />;
}

// Public component with Suspense wrapper
export function PatientInfoCard({ ...props }: PatientInfoCardProps) {
  return (
    <Suspense fallback={<PatientLoading />}>
      <PatientInfoContent {...props} />
    </Suspense>
  );
}
