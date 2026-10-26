import type { Metadata } from 'next';
import { ButtonPlayground } from '@/components/site/button-playground';

export const metadata: Metadata = {
  title: 'Button Playground',
  description: 'Make an Anticraft UI button your own. Customize seven interactions, your label, colors, size, corner radius, and disabled state, then copy a working React example.',
};

export default function ButtonPlaygroundPage() {
  return <ButtonPlayground/>;
}
