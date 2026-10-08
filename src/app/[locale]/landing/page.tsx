import type { Metadata } from 'next';

import LandingView from '@/sections/landing/view';

export const metadata: Metadata = {
  title: 'Trade Global',
  description: 'Trade Global — منصة تربطك بالموردين المعتمدين',
};

export default function LandingPage() {
  return <LandingView />;
}