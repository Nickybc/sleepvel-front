import SleepReportForm from '@/components/SleepReportForm';

export default function ReportPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* 顶部装饰条 */}
      <div className="h-1.5 bg-gradient-to-r from-primary via-primary/70 to-primary/40" />
      
      <div className="px-4 py-10 md:py-14">
        <div className="mx-auto max-w-3xl">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-lg shadow-primary/5 md:p-8">
            <SleepReportForm />
          </div>
        </div>
      </div>
    </div>
  );
}
