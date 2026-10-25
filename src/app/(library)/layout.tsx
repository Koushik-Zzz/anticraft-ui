import type { ReactNode } from 'react';
import { DocsShell } from '@/components/site/docs-shell';

export default function LibraryLayout({ children }: { children: ReactNode }) {
  return <DocsShell>{children}</DocsShell>;
}
