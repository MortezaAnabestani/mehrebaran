import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'صفحه پیدا نشد',
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFound() {
  return (
    <div className="flex bg-white text-black min-h-screen items-center justify-center">
      <div className="text-center font-noora">
        <h1 className="text-5xl font-black mb-4">۴۰۴</h1>
        <p className="text-lg">صفحه مورد نظر شما پیدا نشد.</p>
      </div>
    </div>
  );
}
