'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';

import { BrandHeader } from '@/components/BrandHeader';
import { FileUpload } from '@/components/FileUpload';
import { PatientInfoCard } from '@/components/PatientInfoCard';
import { PatientInfoData, PatientInfoForm } from '@/components/PatientInfoForm';
import { Report } from '@/components/Report';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { createReport, getPatient } from '@/lib/api';
import {
  SleepReportFormData,
  SleepReportResponse,
  sleepReportSchema,
} from '@/lib/schemas';

type SleepReportFormProps = {
  patientId?: string;
  mode?: 'his' | 'manual';
};

export default function SleepReportForm({
  patientId,
  mode = 'his',
}: SleepReportFormProps) {
  const [reportResult, setReportResult] = useState<SleepReportResponse | null>(
    null
  );
  const isHisMode = mode === 'his';
  const [showDelayedSections, setShowDelayedSections] = useState(
    !isHisMode || !patientId
  );
  const [uploadingStates, setUploadingStates] = useState({
    originalSequenceFile: false,
    diagnosticReport: false,
    scalesUrls: false,
  });

  const hasPatientId = !!patientId;
  const showPatientInfoCard = isHisMode && hasPatientId;
  const [manualPatientData, setManualPatientData] =
    useState<PatientInfoData | null>(null);

  // Handle manual patient data change - update both state and form
  const handleManualPatientChange = (data: PatientInfoData) => {
    setManualPatientData(data);
    // Also set patientInfo in the form for validation
    if (data.name && data.gender && data.age) {
      setValue('patientInfo', {
        id: patientId ?? '',
        name: data.name,
        gender: data.gender as 'male' | 'female',
        age: parseInt(data.age, 10),
        idCardNumber: data.idCardNumber || '',
        department: data.department || '',
        inpatientNumber: data.inpatientNumber || '',
      });
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
    setValue,
    watch,
  } = useForm<SleepReportFormData>({
    resolver: zodResolver(sleepReportSchema),
    mode: 'onChange',
  });

  const originalSequenceFile = watch('originalSequenceFile');
  const diagnosticReport = watch('diagnosticReport');
  const scalesUrls = watch('scalesUrls');
  const isAnyFileUploading = Object.values(uploadingStates).some(Boolean);

  const setUploaderState = (
    key: keyof typeof uploadingStates,
    isUploading: boolean
  ) => {
    setUploadingStates(prev => {
      if (prev[key] === isUploading) {
        return prev;
      }

      return {
        ...prev,
        [key]: isUploading,
      };
    });
  };

  const patient = useMemo(
    () =>
      showPatientInfoCard && patientId
        ? getPatient(patientId)
        : Promise.resolve(null as any),
    [patientId, showPatientInfoCard]
  );

  // Set patientInfo when patient data loads (only if patientId provided)
  useEffect(() => {
    if (showPatientInfoCard) {
      patient.then(data => {
        if (data) {
          setValue('patientInfo', data);
          if (data.chiefComplaint) {
            setValue('chiefComplaint', data.chiefComplaint, {
              shouldValidate: true,
            });
          }
          if (data.presentIllness) {
            setValue('presentIllness', data.presentIllness, {
              shouldValidate: true,
            });
          }
        }
        setShowDelayedSections(true);
      });
    } else {
      setShowDelayedSections(true);
    }
  }, [showPatientInfoCard, patient, setValue]);

  const onSubmit = async (data: SleepReportFormData) => {
    if (isAnyFileUploading) {
      return;
    }

    const formData = new FormData();

    // Build patientInfo - from form or manual entry
    let patientInfo = data.patientInfo;
    if (!patientInfo && manualPatientData) {
      const { name, gender, age, idCardNumber, department, inpatientNumber } =
        manualPatientData;
      if (name && gender && age) {
        patientInfo = {
          id: patientId ?? '',
          name,
          gender: gender as 'male' | 'female',
          age: parseInt(age, 10),
          idCardNumber: idCardNumber || '',
          department: department || '',
          inpatientNumber: inpatientNumber || '',
        };
      }
    }

    if (patientInfo) {
      // Parse and re-stringify to ensure proper JSON format
      formData.append('patientInfo', JSON.stringify(patientInfo));
    }
    formData.append('chiefComplaint', data.chiefComplaint);
    formData.append('presentIllness', data.presentIllness);
    if (data.originalSequenceFile) {
      formData.append('originalSequenceFile', data.originalSequenceFile);
    }
    if (data.diagnosticReport) {
      formData.append('diagnosticReport', data.diagnosticReport);
    }
    if (data.scalesUrls && data.scalesUrls.length > 0) {
      // Fallback transport for parsers that don't preserve repeated keys.
      formData.append('scalesUrls', JSON.stringify(data.scalesUrls));
    }

    try {
      const result = await createReport(formData);
      setReportResult(result);
    } catch (err) {
      console.error('Error:', err);
      alert('提交失败，请重试');
    }
  };

  // If report is generated, show the report
  if (reportResult) {
    return <Report report={reportResult} />;
  }

  return (
    <div className="space-y-8 max-w-2xl">
      <BrandHeader
        subtitle="多模态睡眠大模型智能辅助诊疗系统"
        titleClassName="tracking-tight"
      />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" aria-label="睡眠报告表单">
        {/* Fullscreen loading overlay */}
        {isSubmitting && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/60 backdrop-blur-sm flex-col gap-6">
            <div className="rounded-2xl bg-card p-8 shadow-2xl shadow-primary/10 border border-border">
              <img
                src="/images/loading.png"
                alt="正在分析"
                className="rounded-xl shadow-lg max-w-md mx-auto"
              />
              <div className="mt-6 flex flex-col items-center gap-3">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 animate-pulse rounded-full bg-primary" />
                  <div className="h-2 w-2 animate-pulse rounded-full bg-primary/70 animation-delay-150" />
                  <div className="h-2 w-2 animate-pulse rounded-full bg-primary/40 animation-delay-300" />
                </div>
                <p className="text-lg font-medium text-foreground">正在分析睡眠数据...</p>
                <p className="text-sm text-muted-foreground">请稍候，AI正在处理您的数据</p>
              </div>
            </div>
          </div>
        )}

        {showPatientInfoCard ? (
          <PatientInfoCard patientInfoPromise={patient} />
        ) : (
          <PatientInfoForm onChange={handleManualPatientChange} />
        )}

        {!showDelayedSections && (
          <div className="flex items-center gap-3 rounded-xl border-2 border-dashed border-border bg-muted/30 p-5 text-sm text-muted-foreground">
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-primary border-t-transparent" />
            正在从HIS加载主诉、现病史与附件信息...
          </div>
        )}
        {showDelayedSections && (
          <>
            <div className="space-y-3">
              <Label htmlFor="chiefComplaint" className="text-sm font-medium text-foreground">
                主诉 <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="chiefComplaint"
                placeholder="请输入主诉"
                rows={3}
                className="resize-none bg-background transition-all focus:ring-2 focus:ring-primary/20"
                {...register('chiefComplaint')}
              />
              {errors.chiefComplaint && (
                <p className="text-sm text-destructive">
                  {errors.chiefComplaint.message}
                </p>
              )}
            </div>

            <div className="space-y-3">
              <Label htmlFor="presentIllness" className="text-sm font-medium text-foreground">
                现病史 <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="presentIllness"
                placeholder="请输入现病史"
                rows={4}
                className="resize-none bg-background transition-all focus:ring-2 focus:ring-primary/20"
                {...register('presentIllness')}
              />
              {errors.presentIllness && (
                <p className="text-sm text-destructive">
                  {errors.presentIllness.message}
                </p>
              )}
            </div>

            <FileUpload
              label="睡眠监测时序数据"
              typeIndicator="EDF"
              accept=".edf"
              value={originalSequenceFile}
              onUploadingChange={isUploading =>
                setUploaderState('originalSequenceFile', isUploading)
              }
              onChange={url =>
                setValue(
                  'originalSequenceFile',
                  (typeof url === 'string' ? url : url?.[0]) || ''
                )
              }
              error={errors.originalSequenceFile?.message}
            />

            <FileUpload
              label="睡眠仪器监测报告"
              typeIndicator="PDF"
              accept=".pdf"
              value={diagnosticReport}
              onUploadingChange={isUploading =>
                setUploaderState('diagnosticReport', isUploading)
              }
              onChange={url =>
                setValue(
                  'diagnosticReport',
                  typeof url === 'string' ? url : url?.[0] || undefined
                )
              }
              error={errors.diagnosticReport?.message}
            />

            <FileUpload
              label="量表文件"
              typeIndicator="Word"
              accept=".doc,.docx"
              multiple
              value={scalesUrls}
              onUploadingChange={isUploading =>
                setUploaderState('scalesUrls', isUploading)
              }
              onChange={urls =>
                setValue(
                  'scalesUrls',
                  Array.isArray(urls) ? urls : urls ? [urls] : undefined
                )
              }
              error={errors.scalesUrls?.message}
            />
          </>
        )}

        <Button
          type="submit"
          size="lg"
          disabled={isSubmitting || isAnyFileUploading || !isValid}
          className="w-full h-14 text-base font-medium shadow-md shadow-primary/20 transition-all hover:shadow-lg hover:shadow-primary/30"
        >
          {isSubmitting && '正在提交...'}
          {!isSubmitting && '开始分析睡眠数据'}
        </Button>
      </form>
    </div>
  );
}
