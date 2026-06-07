'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="fa" dir="rtl">
      <body>
        <div className="flex bg-white text-black min-h-screen items-center justify-center">
          <div className="text-center font-noora">
            <h1 className="text-4xl font-bold mb-4">خطای سیستمی رخ داد!</h1>
            <p className="text-lg text-gray-600 mb-6">{error.message || 'متاسفانه مشکلی پیش آمده است.'}</p>
            <button
              onClick={() => reset()}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
            >
              تلاش مجدد
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
