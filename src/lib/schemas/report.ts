import { z } from 'zod';


export const patientInfoSchema = z.object({
  id: z.string().optional(),
  name: z.string(),
  gender: z.enum(['male', 'female']),
  age: z.number(),
  idCardNumber: z.string(),
  department: z.string(),
  inpatientNumber: z.string(),
});

export const sleepReportSchema = z.object({
  patientInfo: patientInfoSchema,
  chiefComplaint: z.string().min(1, '主诉不能为空'),
  presentIllness: z.string().min(1, '现病史不能为空'),
  originalSequenceFile: z.string().optional(),
  diagnosticReport: z
    .string()
    .optional(),
  scalesUrls: z
    .array(z.string())
    .optional(),
});

export type SleepReportFormData = z.infer<typeof sleepReportSchema>;

// Response types
export const diagnosisBasisSchema = z.object({
  detailEvidence: z.string(),
  basis: z.string(),
});

export const cognitivePredictionSchema = z.object({
  MOCA: z.number(),
  MMSE: z.number(),
});

export const emotionPredictionSchema = z.object({
  HAMA: z.number(),
  HAMD: z.number(),
});

export const scalesDataSchema = z.object({
  cognitivePrediction: cognitivePredictionSchema,
  emotionPrediction: emotionPredictionSchema,
});

export const predictionSchema = z.object({
  actualAge: z.number(),
  physiologicalAgePrediction: z.number().nullish(),
});

export const referenceGuidelineSchema = z.object({
  name: z.string(),
  description: z.string(),
});

export const sleepReportResponseSchema = z.object({
  diagnosis: z.string(),
  diagnosisBasis: diagnosisBasisSchema,
  possibleCauses: z.string(),
  sleepPrescription: z.string(),
  scalesData: scalesDataSchema.nullish(),
  prediction: predictionSchema,
  referenceGuidelines: z.array(referenceGuidelineSchema),
  sleepStageDistributionChart: z.string().nullish(),
  sleepTotalDurationHour: z.number().nullish(),
  sleepEfficiency: z.number().nullish(),
  sleepLatencyMinute: z.number().nullish(),
  ahiIndex: z.number().nullish(),
  lowestOxygenSaturation: z.number().nullish(),
  createdAt: z.string(),
});

export type DiagnosisBasis = z.infer<typeof diagnosisBasisSchema>;
export type CognitivePrediction = z.infer<typeof cognitivePredictionSchema>;
export type EmotionPrediction = z.infer<typeof emotionPredictionSchema>;
export type ScalesData = z.infer<typeof scalesDataSchema>;
export type Prediction = z.infer<typeof predictionSchema>;
export type ReferenceGuideline = z.infer<typeof referenceGuidelineSchema>;
export type PatientInfo = z.infer<typeof patientInfoSchema>;
export type SleepReportResponse = z.infer<typeof sleepReportResponseSchema>;
