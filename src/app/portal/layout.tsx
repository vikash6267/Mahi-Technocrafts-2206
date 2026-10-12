import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Client & Staff Portal | Mahi TechnoCrafts',
  robots: { index: false, follow: false },
};

export default function PortalLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
