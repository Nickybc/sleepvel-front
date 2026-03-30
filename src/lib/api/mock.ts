import {
  Patient,
  SleepReportResponse,
  sleepReportResponseSchema,
} from '@/lib/schemas';

// Mock patient data
export const mockPatient: Patient = {
  id: 'patient-001',
  name: '张三',
  gender: 'male',
  age: 22,
  idCardNumber: '370102200403151234',
  department: '老年医学科',
  inpatientNumber: 'ZY20260320001',
};

const MOCK_SLEEP_REPORT_RESPONSE_URL =
  process.env.NEXT_PUBLIC_MOCK_SLEEP_REPORT_RESPONSE_URL ||
  '/mock/sleep-report-response.json';

async function loadMockSleepReportResponse(): Promise<SleepReportResponse> {
  const response = await fetch(MOCK_SLEEP_REPORT_RESPONSE_URL, {
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error('加载模拟报告数据失败');
  }

  const json = await response.json();
  return sleepReportResponseSchema.parse(json);
}

// Mock API functions
export async function mockGetPatient(id: string): Promise<Patient> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));

  // Simulate patient not found for certain IDs
  if (id === 'not-found' || id === 'invalid') {
    throw new Error('NOT_FOUND');
  }

  // Return mock patient (ignore id for demo)
  return mockPatient;
}

export async function mockCreateReport(
  formData: FormData
): Promise<SleepReportResponse> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 15000));

  return loadMockSleepReportResponse();
}
