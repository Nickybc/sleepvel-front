import { SleepReportResponse, sleepReportResponseSchema } from '@/lib/schemas';
import { mockCreateReport } from './mock';

// Backend URL from environment variable
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

// Flag to enable mock mode - set to 'true' to use mock data
const USE_MOCK = process.env.NEXT_PUBLIC_ENABLE_MOCK === 'true';

function shouldUseMockByPatientAge(formData: FormData): boolean {
  const patientInfo = formData.get('patientInfo');

  if (typeof patientInfo !== 'string') {
    return false;
  }

  try {
    const parsed = JSON.parse(patientInfo) as { age?: number | string };
    return Number(parsed.age) === 25;
  } catch {
    return false;
  }
}

async function realCreateReport(
  formData: FormData
): Promise<SleepReportResponse> {
  const response = await fetch(`${BACKEND_URL}/api/reports`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('提交失败');
  }

  const json = await response.json();
  return sleepReportResponseSchema.parse(json);
}

export async function createReport(
  formData: FormData
): Promise<SleepReportResponse> {
  console.log(
    'Submitting report with data:',
    Object.fromEntries(formData.entries())
  );

  if (USE_MOCK || shouldUseMockByPatientAge(formData)) {
    return mockCreateReport(formData);
  }

  return realCreateReport(formData);
}

// Export for explicit testing
export { realCreateReport };
