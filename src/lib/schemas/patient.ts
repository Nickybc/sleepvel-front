import { z } from 'zod';

export const patientSchema = z.object({
  id: z.string(),
  name: z.string(),
  gender: z.enum(['male', 'female']),
  age: z.number(),
  idCardNumber: z.string(),
  department: z.string(),
  inpatientNumber: z.string(),
  chiefComplaint: z.string().optional(),
  presentIllness: z.string().optional(),
});

export type Patient = z.infer<typeof patientSchema>;

export const patientIdSchema = z.string().min(1, '患者ID不能为空');

export type PatientId = z.infer<typeof patientIdSchema>;
