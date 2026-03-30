import SleepReportForm from '@/components/SleepReportForm';

export default async function ReportPage({
  searchParams,
}: {
  searchParams: Promise<{ patientId?: string; mode?: 'his' | 'manual' }>;
}) {
  const patientId = await searchParams.then(params => params.patientId);
  const mode = await searchParams.then(params => params.mode);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#dbeafe_0%,#eef2ff_35%,#f8fafc_70%)] py-12 px-4">
      <div className="mx-auto max-w-3xl">
        <div className="rounded-lg bg-white/90 p-6 shadow-md backdrop-blur-sm">
          <SleepReportForm patientId={patientId} mode={mode ?? 'his'} />
        </div>
      </div>
    </div>
  );
}
