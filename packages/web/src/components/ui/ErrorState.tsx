'use client';

import React from 'react';
import Link from 'next/link';

interface ErrorStateProps {
  error: Error & { digest?: string };
  reset?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ reset }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] p-8 text-center bg-slate-50 rounded-2xl border border-red-100 mx-4 my-8 shadow-sm">
      <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mb-6">
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      </div>
      <h3 className="text-xl font-bold text-slate-800 mb-2">
        متأسفانه خطایی رخ داده است
      </h3>
      <p className="text-slate-600 mb-6 max-w-md leading-relaxed">
        در هنگام پردازش درخواست شما مشکلی پیش آمد. در صورت تکرار مشکل، لطفاً با پشتیبانی تماس بگیرید.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-4">
        {reset && (
          <button
            onClick={reset}
            className="px-6 py-2.5 bg-mblue text-white rounded-xl font-medium hover:bg-blue-600 transition-colors shadow-sm flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            تلاش مجدد
          </button>
        )}
        <Link
          href="/"
          className="px-6 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl font-medium hover:bg-slate-50 transition-colors shadow-sm"
        >
          بازگشت به خانه
        </Link>
      </div>
    </div>
  );
};

export default ErrorState;
