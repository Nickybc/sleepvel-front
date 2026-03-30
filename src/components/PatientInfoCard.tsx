'use client';

import { Suspense, use } from 'react';

import { Patient } from '@/lib/schemas';

type PatientInfoCardProps = {
  patientInfoPromise: Promise<Patient>;
};

// Loading fallback component
function PatientLoading() {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
        <p className="mt-2 text-sm text-gray-500">HIS获取患者信息中...</p>
      </div>
    </div>
  );
}

// Patient display component
function PatientDisplay({ patient }: { patient: Patient }) {
  return (
    <div className="bg-muted p-4 rounded-lg space-y-2">
      <h3 className="font-semibold">患者信息</h3>
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div>
          <span className="text-muted-foreground">姓名：</span>
          {patient.name}
        </div>
        <div>
          <span className="text-muted-foreground">性别：</span>
          {patient.gender === 'male' ? '男' : '女'}
        </div>
        <div>
          <span className="text-muted-foreground">年龄：</span>
          {patient.age}
        </div>
        <div>
          <span className="text-muted-foreground">身份证号：</span>
          {patient.idCardNumber}
        </div>
        <div>
          <span className="text-muted-foreground">科室：</span>
          {patient.department}
        </div>
        <div>
          <span className="text-muted-foreground">住院号：</span>
          {patient.inpatientNumber}
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
