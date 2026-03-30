import { Patient } from '@/lib/schemas';
import { mockGetPatient } from './mock';

// Backend URL from environment variable
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

// Flag to enable mock mode - set to 'true' to use mock data
const USE_MOCK = process.env.NEXT_PUBLIC_ENABLE_MOCK === 'true';

async function realGetPatient(id: string): Promise<Patient> {
  const response = await fetch(`${BACKEND_URL}/api/patients/${id}`);
  if (!response.ok) {
    throw new Error('获取患者信息失败');
  }
  return response.json();
}

async function fetchPatient(id: string): Promise<Patient> {
  if (USE_MOCK) {
    console.log('mockGetPatient', id);
    return mockGetPatient(id);
  }
  return realGetPatient(id);
}

export const getPatient = async (id: string): Promise<Patient> => {
  return fetchPatient(id);
};

// Export for explicit testing
export { realGetPatient };
