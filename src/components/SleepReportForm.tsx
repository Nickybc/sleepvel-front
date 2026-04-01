'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Database } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';

import { BrandHeader } from '@/components/BrandHeader';
import { FileUpload } from '@/components/FileUpload';
import { PatientInfoCard } from '@/components/PatientInfoCard';
import { PatientInfoData, PatientInfoForm } from '@/components/PatientInfoForm';
import { Report } from '@/components/Report';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { createReport, getPatient } from '@/lib/api';
import {
  SleepReportFormData,
  SleepReportResponse,
  sleepReportSchema,
} from '@/lib/schemas';

export default function SleepReportForm() {
  const [reportResult, setReportResult] = useState<SleepReportResponse | null>(
    null
  );
  
  // 患者ID状态管理
  const [patientIdInput, setPatientIdInput] = useState('');
  const [currentPatientId, setCurrentPatientId] = useState<string | null>(null);
  const [isLoadingPatient, setIsLoadingPatient] = useState(false);
  const [patientLoadError, setPatientLoadError] = useState<string | null>(null);
  
  const [showDelayedSections, setShowDelayedSections] = useState(false);
  const [uploadingStates, setUploadingStates] = useState({
    originalSequenceFile: false,
    diagnosticReport: false,
    scalesUrls: false,
  });

  const [manualPatientData, setManualPatientData] =
    useState<PatientInfoData | null>(null);

  // Handle manual patient data change - update both state and form
  const handleManualPatientChange = (data: PatientInfoData) => {
    setManualPatientData(data);
    // Also set patientInfo in the form for validation
    if (data.name && data.gender && data.age) {
      setValue('patientInfo', {
        id: currentPatientId ?? '',
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
    reset,
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

  // 患者数据Promise - 仅在有currentPatientId时获取
  const patient = useMemo(
    () =>
      currentPatientId
        ? getPatient(currentPatientId)
        : Promise.resolve(null as any),
    [currentPatientId]
  );

  // 从HIS获取患者数据
  const handleFetchFromHIS = async () => {
    const trimmedId = patientIdInput.trim();
    if (!trimmedId) {
      setPatientLoadError('请输入患者ID');
      return;
    }
    
    setIsLoadingPatient(true);
    setPatientLoadError(null);
    setShowDelayedSections(false);
    
    try {
      // 设置当前患者ID，触发数据加载
      setCurrentPatientId(trimmedId);
    } catch {
      setPatientLoadError('获取患者数据失败，请重试');
      setCurrentPatientId(null);
    }
  };

  // Set patientInfo when patient data loads
  useEffect(() => {
    if (currentPatientId) {
      patient.then(data => {
        setIsLoadingPatient(false);
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
          setShowDelayedSections(true);
        } else {
          // 没有找到患者数据，显示手动输入表单
          setShowDelayedSections(true);
        }
      }).catch(() => {
        setIsLoadingPatient(false);
        setPatientLoadError('获取患者数据失败');
        setShowDelayedSections(true);
      });
    }
  }, [currentPatientId, patient, setValue]);

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
          id: currentPatientId ?? '',
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
      <BrandHeader titleClassName="tracking-tight" />

      {/* 患者ID输入区域 */}
      <div className="rounded-xl border border-border bg-secondary/30 p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
          <div className="flex-1 space-y-2">
            <Label htmlFor="patientId" className="text-sm font-medium text-foreground">
              患者ID
            </Label>
            <Input
              id="patientId"
              value={patientIdInput}
              placeholder="请输入患者ID"
              onChange={e => {
                setPatientIdInput(e.target.value);
                setPatientLoadError(null);
              }}
              className="h-11 bg-background transition-all focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <Button
            type="button"
            onClick={handleFetchFromHIS}
            disabled={isLoadingPatient || !patientIdInput.trim()}
            className="h-11 gap-2 px-6 shadow-sm"
          >
            <Database className="h-4 w-4" />
            {isLoadingPatient ? '获取中...' : '从HIS获取数据'}
          </Button>
        </div>
        {patientLoadError && (
          <p className="mt-2 text-sm text-destructive">{patientLoadError}</p>
        )}
      </div>

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

        {/* 加载患者数据中 */}
        {isLoadingPatient && (
          <div className="flex items-center gap-3 rounded-xl border-2 border-dashed border-border bg-muted/30 p-5 text-sm text-muted-foreground">
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-primary border-t-transparent" />
            正在从HIS加载患者信息...
          </div>
        )}

        {/* 患者信息展示 - 只有在获取到患者ID后才显示 */}
        {!isLoadingPatient && currentPatientId && (
          <PatientInfoCard patientInfoPromise={patient} />
        )}

        {/* 手动输入患者信息 - 如果没有从HIS获取 */}
        {!isLoadingPatient && !currentPatientId && showDelayedSections && (
          <PatientInfoForm onChange={handleManualPatientChange} />
        )}

        {/* 表单字段 - 只有在获取数据后才显示 */}
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

            <Button
              type="submit"
              size="lg"
              disabled={isSubmitting || isAnyFileUploading || !isValid}
              className="w-full h-14 text-base font-medium shadow-md shadow-primary/20 transition-all hover:shadow-lg hover:shadow-primary/30"
            >
              {isSubmitting && '正在提交...'}
              {!isSubmitting && '开始分析睡眠数据'}
            </Button>
          </>
        )}

        {/* 提示用户先获取数据 */}
        {!showDelayedSections && !isLoadingPatient && (
          <div className="rounded-xl border-2 border-dashed border-border bg-muted/20 p-8 text-center">
            <Database className="mx-auto h-12 w-12 text-muted-foreground/50" />
            <p className="mt-4 text-sm text-muted-foreground">
              请输入患者ID并点击"从HIS获取数据"按钮
            </p>
            <p className="mt-1 text-xs text-muted-foreground/70">
              或直接开始手动录入患者信息
            </p>
            <Button
              type="button"
              variant="outline"
              className="mt-4"
              onClick={() => setShowDelayedSections(true)}
            >
              手动录入
            </Button>
          </div>
        )}
      </form>
    </div>
  );
}
