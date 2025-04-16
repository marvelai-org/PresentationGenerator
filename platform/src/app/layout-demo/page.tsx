import dynamic from 'next/dynamic';

// Use dynamic import with no SSR for the LayoutDemo component
// as it relies on client-side functionality like useState
const LayoutDemo = dynamic(() => import('../../pages/LayoutDemo'), {
  ssr: false,
});

export const metadata = {
  title: 'Layout Demo - Presentation Generator',
  description: 'Demo page for the layout feature of Presentation Generator',
};

export default function LayoutDemoPage() {
  return <LayoutDemo />;
} 