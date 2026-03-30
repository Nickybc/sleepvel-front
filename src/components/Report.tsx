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
      <BrandHeader subtitle="多模态睡眠大模型诊断报告" className="mb-8" />
      {/* 睡眠分期分布图 + 睡眠指标 */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* 睡眠分期分布图 */}
        {report.sleepStageDistributionChart && (
          <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center justify-center w-full flex-1 shrink-0">
            <img
              src={report.sleepStageDistributionChart}
              alt="睡眠分期分布图"
              className="w-full h-auto object-contain"
            />
            <h2 className="text-sm font-medium mt-2 text-gray-600 flex items-center gap-2">
              <Activity className="w-4 h-4 text-blue-400" /> 睡眠分期分布图
            </h2>
          </div>
        )}

        {/* 睡眠指标 */}
        {hasSleepIndicators && (
          <div className="bg-white rounded-lg shadow p-6 flex-[0.8]">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Scale className="w-5 h-5 text-gray-400" />
              睡眠指标
            </h2>
            <div className="grid grid-cols-1 gap-3 text-sm">
              {hasSleepTotalDurationHour && (
                <div className="rounded-md bg-gray-50 border border-gray-100 p-3">
                  <div className="text-gray-500">睡眠总时长</div>
                  <div className="text-base font-medium mt-1">
                    {sleepTotalDurationHour.toFixed(1)} 小时
                  </div>
                </div>
              )}
              {hasSleepEfficiency && (
                <div className="rounded-md bg-gray-50 border border-gray-100 p-3">
                  <div className="text-gray-500">睡眠效率</div>
                  <div className="text-base font-medium mt-1">
                    {sleepEfficiencyPercent.toFixed(1)}%
                  </div>
                </div>
              )}
              {hasSleepLatencyMinute && (
                <div className="rounded-md bg-gray-50 border border-gray-100 p-3">
                  <div className="text-gray-500">睡眠潜伏期</div>
                  <div className="text-base font-medium mt-1">
                    {sleepLatencyMinute} 分钟
                  </div>
                </div>
              )}

              {hasAhiIndex && (
                <div className="rounded-md bg-gray-50 border border-gray-100 p-3">
                  <div className="text-gray-500">AHI指数</div>
                  <div className="text-base font-medium mt-1">{ahiIndex}</div>
                </div>
              )}

              {hasLowestOxygenSaturation && (
                <div className="rounded-md bg-gray-50 border border-gray-100 p-3">
                  <div className="text-gray-500">最低血氧饱和度</div>
                  <div className="text-base font-medium mt-1">
                    {lowestOxygenSaturation}%
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* 诊断意见 */}
      {report.diagnosis && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Stethoscope className="w-5 h-5 text-gray-400" />
            诊断意见
          </h2>
          <div className="text-gray-700 prose prose-sm max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {report.diagnosis}
            </ReactMarkdown>
          </div>
        </div>
      )}

      {/* 诊断依据 */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <FileText className="w-5 h-5 text-gray-400" />
          诊断依据
        </h2>
        <div className="space-y-2">
          <div>
            <span className="font-medium hidden">详细证据：</span>
            <div className="text-gray-700 prose prose-sm max-w-none mt-1">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {report.diagnosisBasis.detailEvidence}
              </ReactMarkdown>
            </div>
          </div>
          <div className="hidden">
            <span className="font-medium">诊断依据：</span>
            <p className="text-gray-700">{report.diagnosisBasis.basis}</p>
          </div>
        </div>
      </div>

      {/* 病因分析 */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Brain className="w-5 h-5 text-gray-400" />
          病因分析
        </h2>
        <div className="text-gray-700 prose prose-sm max-w-none">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {report.possibleCauses}
          </ReactMarkdown>
        </div>
      </div>

      {/* 睡眠处方 */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Pill className="w-5 h-5 text-gray-400" />
          睡眠处方
        </h2>
        <div className="text-gray-700 prose prose-sm max-w-none">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {report.sleepPrescription}
          </ReactMarkdown>
        </div>
      </div>

      {/* 预测分析 */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Scale className="w-5 h-5 text-gray-400" />
          预测分析
        </h2>
        <div className="grid grid-cols-1 gap-6">
          {/* 认知功能评估 */}
          {report.scalesData?.cognitivePrediction && (
            <div>
              <h3 className="font-medium mb-2">认知功能评估</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm table-auto">
                  <thead>
                    <tr className="border-b">
                      <th className="w-[40%] text-left py-2 font-medium text-gray-500">
                        名称
                      </th>
                      <th className="w-[28%] text-left py-2 font-medium text-gray-500">
                        预测值
                      </th>
                      <th className="w-[8%] text-left py-2 font-medium text-gray-500"></th>
                      <th className="w-[24%] text-left py-2 font-medium text-gray-500">
                        参考范围
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="py-2">蒙特利尔认知量表</td>
                      <td className="py-2">
                        {report.scalesData.cognitivePrediction.MOCA} 分
                      </td>
                      <td className="py-2 text-left pl-1">
                        {getRangeArrow(
                          report.scalesData.cognitivePrediction.MOCA,
                          26,
                          30
                        ) || '-'}
                      </td>
                      <td className="py-2">26-30</td>
                    </tr>
                    <tr>
                      <td className="py-2">简易智能精神状态检查</td>
                      <td className="py-2">
                        {report.scalesData.cognitivePrediction.MMSE} 分
                      </td>
                      <td className="py-2 text-left pl-1">
                        {getRangeArrow(
                          report.scalesData.cognitivePrediction.MMSE,
                          27,
                          30
                        ) || '-'}
                      </td>
                      <td className="py-2">27-30</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 情绪状态评估 */}
          {report.scalesData?.emotionPrediction && (
            <div>
              <h3 className="font-medium mb-2">情绪状态评估</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm table-auto">
                  <thead>
                    <tr className="border-b">
                      <th className="w-[40%] text-left py-2 font-medium text-gray-500">
                        名称
                      </th>
                      <th className="w-[28%] text-left py-2 font-medium text-gray-500">
                        预测值
                      </th>
                      <th className="w-[8%] text-left py-2 font-medium text-gray-500"></th>
                      <th className="w-[24%] text-left py-2 font-medium text-gray-500">
                        参考范围
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="py-2">汉密尔顿焦虑量表</td>
                      <td className="py-2">
                        {report.scalesData.emotionPrediction.HAMA} 分
                      </td>
                      <td className="py-2 text-left pl-1">
                        {getRangeArrow(
                          report.scalesData.emotionPrediction.HAMA,
                          0,
                          6
                        ) || '-'}
                      </td>
                      <td className="py-2">0-6</td>
                    </tr>
                    <tr>
                      <td className="py-2">汉密尔顿抑郁量表</td>
                      <td className="py-2">
                        {report.scalesData.emotionPrediction.HAMD} 分
                      </td>
                      <td className="py-2 text-left pl-1">
                        {getRangeArrow(
                          report.scalesData.emotionPrediction.HAMD,
                          0,
                          6
                        ) || '-'}
                      </td>
                      <td className="py-2">0-6</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
          {/* 生理年龄预测值 */}
          {physiologicalAgePrediction != null && (
            <div>
              <h3 className="font-medium mb-2">生理年龄预测值</h3>
              <div className="grid grid-cols-2 text-sm">
                <div>
                  <span className="text-gray-500">实际年龄：</span>
                  {report.prediction.actualAge}岁
                </div>
                <div>
                  <span className="text-gray-500">生理年龄预测：</span>
                  {physiologicalAgePrediction}岁
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 引用出处 */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-gray-400" />
          引用出处
        </h2>
        <div className="space-y-2">
          {report.referenceGuidelines.map((guideline, index) => (
            <div key={index} className="flex gap-2 items-center">
              <div className="text-blue-400">{index + 1}.</div>
              <div className="flex-1 p-3 bg-accent rounded-xl">
                <div className="font-medium">{guideline.name}</div>
                <p className="text-sm text-gray-600">{guideline.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 创建时间 */}
      <div className="text-center text-sm text-gray-500 flex items-center justify-center gap-2">
        <Clock className="w-4 h-4 text-gray-400" />
        报告生成时间：{new Date().toLocaleString('zh-CN')}
      </div>

      <p className="text-center text-xs text-gray-400">
        以上内容仅为参考，最终请以专业医生意见为准
      </p>
    </div>
  );
}
