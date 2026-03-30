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
    <div className="space-y-6 max-w-2xl">
      <BrandHeader
        subtitle="多模态睡眠大模型智能辅助诊疗系统"
        titleClassName="tracking-wide"
      />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Fullscreen loading overlay */}
        {isSubmitting && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/30 backdrop-blur-xs border border-white/20 flex-col gap-4">
            <img
              src="/images/loading.png"
              alt="正在分析"
              className="rounded-lg shadow-xl border-4 border-white/50 max-w-4xl "
            />
            <p className="text-lg font-medium">正在分析睡眠数据...</p>
          </div>
        )}

        {showPatientInfoCard ? (
          <PatientInfoCard patientInfoPromise={patient} />
        ) : (
          <PatientInfoForm onChange={handleManualPatientChange} />
        )}

        {!showDelayedSections && (
          <div className="rounded-lg border border-dashed border-gray-300 p-4 text-sm text-gray-500">
            正在从HIS加载主诉、现病史与附件信息...
          </div>
        )}
        {showDelayedSections && (
          <>
            <div className="space-y-2">
              <Label htmlFor="chiefComplaint">
                主诉 <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="chiefComplaint"
                placeholder="请输入主诉"
                rows={3}
                {...register('chiefComplaint')}
              />
              {errors.chiefComplaint && (
                <p className="text-sm text-red-500">
                  {errors.chiefComplaint.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="presentIllness">
                现病史 <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="presentIllness"
                placeholder="请输入现病史"
                rows={4}
                {...register('presentIllness')}
              />
              {errors.presentIllness && (
                <p className="text-sm text-red-500">
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
          disabled={isSubmitting || isAnyFileUploading || !isValid}
          className="w-full"
        >
          {isSubmitting && '提交中...'}
          {!isSubmitting && '分析睡眠'}
        </Button>
      </form>
    </div>
  );
}
