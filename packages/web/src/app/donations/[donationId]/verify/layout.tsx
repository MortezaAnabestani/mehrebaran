import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'تایید پرداخت | کانون مهرباران',
  robots: {
    index: false,
    follow: false,
  },
};

export default function VerifyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
