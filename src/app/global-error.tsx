'use client';

type GlobalErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  console.error(error);
  const errorMessage = error.message || 'Unknown error';

  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 px-4 py-12 antialiased">
        <div className="mx-auto max-w-xl rounded-lg bg-white p-6 shadow-md">
          <h2 className="text-2xl font-bold text-gray-900">系统发生错误</h2>
          <p className="mt-3 text-sm text-gray-700">
            应用遇到未处理异常，请稍后重试。如问题持续出现，请联系管理员。
          </p>

          <div className="mt-4 rounded-md border border-red-200 bg-red-50 p-3">
            <p className="text-xs font-medium text-red-700">错误详情</p>
            <p className="mt-1 break-all text-sm text-red-800">
              {errorMessage}
            </p>
            {error.digest ? (
              <p className="mt-1 text-xs text-red-700">
                错误编号: {error.digest}
              </p>
            ) : null}
          </div>

          <div className="mt-6 flex gap-3">
            <button
              type="button"
              onClick={reset}
              className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700"
            >
              重试
            </button>
            <a
              href="/choose"
              className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
            >
              返回首页
            </a>
          </div>
        </div>
      </body>
    </html>
  );
}
