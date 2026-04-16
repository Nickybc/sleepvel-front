'use client';

import {
  Activity,
  BookOpen,
  Brain,
  Clock,
  FileText,
  Pill,
  Scale,
  Stethoscope,
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

import { BrandHeader } from '@/components/BrandHeader';
import { SleepReportResponse } from '@/lib/schemas';

interface ReportProps {
  report: SleepReportResponse;
}

export function Report({ report }: ReportProps) {
  const getRangeArrow = (value: number, min: number, max: number) => {
    if (value > max) return '↑';
    if (value < min) return '↓';
    return '';
  };

  const sleepTotalDurationHour = report.sleepTotalDurationHour;
  const sleepEfficiency = report.sleepEfficiency;
  const sleepLatencyMinute = report.sleepLatencyMinute;
  const ahiIndex = report.ahiIndex;
  const lowestOxygenSaturation = report.lowestOxygenSaturation;
  const hasSleepTotalDurationHour = sleepTotalDurationHour != null;
  const sleepEfficiencyPercent =
    sleepEfficiency != null
      ? sleepEfficiency <= 1
        ? sleepEfficiency * 100
        : sleepEfficiency
      : null;
  const hasSleepEfficiency = sleepEfficiencyPercent != null;
  const hasSleepLatencyMinute = sleepLatencyMinute != null;
  const hasAhiIndex = ahiIndex != null;
  const hasLowestOxygenSaturation = lowestOxygenSaturation != null;
  const hasSleepIndicators =
    hasSleepTotalDurationHour ||
    hasSleepEfficiency ||
    hasSleepLatencyMinute ||
    hasAhiIndex ||
    hasLowestOxygenSaturation;
  const physiologicalAgePrediction =
    report.prediction.physiologicalAgePrediction;

  return (
    <div className="space-y-6">
      {/* Report Header */}
      <BrandHeader className="mb-8" />
      {/* 睡眠分期分布图 + 睡眠指标 */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* 睡眠分期分布图 */}
        {report.sleepStageDistributionChart && (
          <div className="rounded-2xl border border-border bg-card p-6 flex flex-col w-full flex-1 shrink-0 shadow-sm">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-foreground">
              <Activity className="w-5 h-5 text-primary" />
              睡眠分期分布图
            </h2>
            <img
              src={report.sleepStageDistributionChart}
              alt="睡眠分期分布图"
              className="w-full h-auto object-contain rounded-lg"
            />
          </div>
        )}

        {/* 睡眠指标 */}
        {hasSleepIndicators && (
          <div className="rounded-2xl border border-border bg-card p-6 flex-[0.8] shadow-sm">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-foreground">
              <Scale className="w-5 h-5 text-primary" />
              睡眠指标
            </h2>
            <div className="grid grid-cols-1 gap-3 text-sm">
              {hasSleepTotalDurationHour && (
                <div className="rounded-xl bg-secondary/50 border border-border p-4">
                  <div className="text-muted-foreground text-xs uppercase tracking-wide">睡眠总时长</div>
                  <div className="text-lg font-semibold text-foreground mt-1">
                    {sleepTotalDurationHour.toFixed(1)} <span className="text-sm font-normal text-muted-foreground">小时</span>
                  </div>
                </div>
              )}
              {hasSleepEfficiency && (
                <div className="rounded-xl bg-secondary/50 border border-border p-4">
                  <div className="text-muted-foreground text-xs uppercase tracking-wide">睡眠效率</div>
                  <div className="text-lg font-semibold text-foreground mt-1">
                    {sleepEfficiencyPercent.toFixed(1)}<span className="text-sm font-normal text-muted-foreground">%</span>
                  </div>
                </div>
              )}
              {hasSleepLatencyMinute && (
                <div className="rounded-xl bg-secondary/50 border border-border p-4">
                  <div className="text-muted-foreground text-xs uppercase tracking-wide">睡眠潜伏期</div>
                  <div className="text-lg font-semibold text-foreground mt-1">
                    {sleepLatencyMinute} <span className="text-sm font-normal text-muted-foreground">分钟</span>
                  </div>
                </div>
              )}

              {hasAhiIndex && (
                <div className="rounded-xl bg-secondary/50 border border-border p-4">
                  <div className="text-muted-foreground text-xs uppercase tracking-wide">AHI指数</div>
                  <div className="text-lg font-semibold text-foreground mt-1">{ahiIndex}</div>
                </div>
              )}

              {hasLowestOxygenSaturation && (
                <div className="rounded-xl bg-secondary/50 border border-border p-4">
                  <div className="text-muted-foreground text-xs uppercase tracking-wide">最低血氧饱和度</div>
                  <div className="text-lg font-semibold text-foreground mt-1">
                    {lowestOxygenSaturation}<span className="text-sm font-normal text-muted-foreground">%</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* 诊断意见 */}
      {report.diagnosis && (
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-foreground">
            <Stethoscope className="w-5 h-5 text-primary" />
            诊断意见
          </h2>
          <div className="text-foreground/80 prose prose-sm max-w-none prose-headings:text-foreground prose-strong:text-foreground">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {report.diagnosis}
            </ReactMarkdown>
          </div>
        </div>
      )}

      {/* 诊断依据 */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-foreground">
          <FileText className="w-5 h-5 text-primary" />
          诊断依据
        </h2>
        <div className="space-y-2">
          <div>
            <span className="font-medium hidden">详细证据：</span>
            <div className="text-foreground/80 prose prose-sm max-w-none mt-1 prose-headings:text-foreground prose-strong:text-foreground">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {report.diagnosisBasis.detailEvidence}
              </ReactMarkdown>
            </div>
          </div>
          <div className="hidden">
            <span className="font-medium">诊断依据：</span>
            <p className="text-foreground/80">{report.diagnosisBasis.basis}</p>
          </div>
        </div>
      </div>

      {/* 病因分析 */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-foreground">
          <Brain className="w-5 h-5 text-primary" />
          病因分析
        </h2>
        <div className="text-foreground/80 prose prose-sm max-w-none prose-headings:text-foreground prose-strong:text-foreground">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {report.possibleCauses}
          </ReactMarkdown>
        </div>
      </div>

      {/* 睡眠处方 */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-foreground">
          <Pill className="w-5 h-5 text-primary" />
          睡眠处方
        </h2>
        <div className="text-foreground/80 prose prose-sm max-w-none prose-headings:text-foreground prose-strong:text-foreground">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {report.sleepPrescription}
          </ReactMarkdown>
        </div>
      </div>

      {/* 预测分析 */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-foreground">
          <Scale className="w-5 h-5 text-primary" />
          预测分析
        </h2>
        <div className="grid grid-cols-1 gap-6">
          {/* 认知功能评估 */}
          {report.scalesData?.cognitivePrediction && (
            <div>
              <h3 className="font-medium mb-3 text-foreground flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                认知功能评估
              </h3>
              <div className="overflow-x-auto rounded-xl border border-border">
                <table className="w-full text-sm table-auto">
                  <thead>
                    <tr className="border-b border-border bg-secondary/30">
                      <th className="w-[40%] text-left py-3 px-4 font-medium text-muted-foreground">
                        名称
                      </th>
                      <th className="w-[28%] text-left py-3 px-4 font-medium text-muted-foreground">
                        预测值
                      </th>
                      <th className="w-[8%] text-left py-3 px-4 font-medium text-muted-foreground"></th>
                      <th className="w-[24%] text-left py-3 px-4 font-medium text-muted-foreground">
                        参考范围
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-border">
                      <td className="py-3 px-4 text-foreground">蒙特利尔认知量表</td>
                      <td className="py-3 px-4 font-medium text-foreground">
                        {report.scalesData.cognitivePrediction.MOCA} 分
                      </td>
                      <td className="py-3 px-4 text-left">
                        <span className="text-primary font-medium">
                          {getRangeArrow(
                            report.scalesData.cognitivePrediction.MOCA,
                            26,
                            30
                          ) || '-'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-muted-foreground">26-30</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 text-foreground">简易智能精神状态检查</td>
                      <td className="py-3 px-4 font-medium text-foreground">
                        {report.scalesData.cognitivePrediction.MMSE} 分
                      </td>
                      <td className="py-3 px-4 text-left">
                        <span className="text-primary font-medium">
                          {getRangeArrow(
                            report.scalesData.cognitivePrediction.MMSE,
                            27,
                            30
                          ) || '-'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-muted-foreground">27-30</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 情绪状态评估 */}
          {report.scalesData?.emotionPrediction && (
            <div>
              <h3 className="font-medium mb-3 text-foreground flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                情绪状态评估
              </h3>
              <div className="overflow-x-auto rounded-xl border border-border">
                <table className="w-full text-sm table-auto">
                  <thead>
                    <tr className="border-b border-border bg-secondary/30">
                      <th className="w-[40%] text-left py-3 px-4 font-medium text-muted-foreground">
                        名称
                      </th>
                      <th className="w-[28%] text-left py-3 px-4 font-medium text-muted-foreground">
                        预测值
                      </th>
                      <th className="w-[8%] text-left py-3 px-4 font-medium text-muted-foreground"></th>
                      <th className="w-[24%] text-left py-3 px-4 font-medium text-muted-foreground">
                        参考范围
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-border">
                      <td className="py-3 px-4 text-foreground">汉密尔顿焦虑量表</td>
                      <td className="py-3 px-4 font-medium text-foreground">
                        {report.scalesData.emotionPrediction.HAMA} 分
                      </td>
                      <td className="py-3 px-4 text-left">
                        <span className="text-primary font-medium">
                          {getRangeArrow(
                            report.scalesData.emotionPrediction.HAMA,
                            0,
                            6
                          ) || '-'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-muted-foreground">0-6</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 text-foreground">汉密尔顿抑郁量表</td>
                      <td className="py-3 px-4 font-medium text-foreground">
                        {report.scalesData.emotionPrediction.HAMD} 分
                      </td>
                      <td className="py-3 px-4 text-left">
                        <span className="text-primary font-medium">
                          {getRangeArrow(
                            report.scalesData.emotionPrediction.HAMD,
                            0,
                            6
                          ) || '-'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-muted-foreground">0-6</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
          {/* 生理年龄预测值 */}
          {physiologicalAgePrediction != null && (
            <div>
              <h3 className="font-medium mb-3 text-foreground flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                生理年龄预测值
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="rounded-xl bg-secondary/50 border border-border p-4">
                  <div className="text-muted-foreground text-xs uppercase tracking-wide">实际年龄</div>
                  <div className="text-lg font-semibold text-foreground mt-1">{report.prediction.actualAge} <span className="text-sm font-normal text-muted-foreground">岁</span></div>
                </div>
                <div className="rounded-xl bg-secondary/50 border border-border p-4">
                  <div className="text-muted-foreground text-xs uppercase tracking-wide">生理年龄预测</div>
                  <div className="text-lg font-semibold text-foreground mt-1">{physiologicalAgePrediction} <span className="text-sm font-normal text-muted-foreground">岁</span></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 引用出处 */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-foreground">
          <BookOpen className="w-5 h-5 text-primary" />
          引用出处
        </h2>
        <div className="space-y-3">
          {report.referenceGuidelines.map((guideline, index) => (
            <div key={index} className="flex gap-3 items-start">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                {index + 1}
              </div>
              <div className="flex-1 rounded-xl bg-secondary/30 border border-border p-4">
                <div className="font-medium text-foreground">{guideline.name}</div>
                <p className="text-sm text-muted-foreground mt-1">{guideline.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 创建时间 */}
      <div className="text-center text-sm text-muted-foreground flex items-center justify-center gap-2 py-2">
        <Clock className="w-4 h-4 text-primary/60" />
        报告生成时间：{new Date().toLocaleString('zh-CN')}
      </div>

      <p className="text-center text-xs text-muted-foreground/70 pb-4">
        以上内容仅为参考，最终请以专业医生意见为准
      </p>
    </div>
  );
}
