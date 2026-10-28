'use client';

import { FileDropzone } from '@/components/anticraft/FileDropzone';
import './file-dropzone-demo.css';

export function FileDropzoneDemo() {
  return <div className="demo practical-demo file-dropzone-demo"><div className="file-dropzone-demo-panel"><FileDropzone label="Project files" accept=".pdf,.png,.jpg,.jpeg,.zip" fileTypesLabel="PDF, PNG, JPG, or ZIP" maxFiles={5} maxSize={10 * 1024 * 1024}/><p className="file-dropzone-demo-note"><svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><rect x="4" y="7" width="8" height="6" rx="1.5"/><path d="M5.5 7V5a2.5 2.5 0 0 1 5 0v2"/></svg>Files stay in this preview.</p></div></div>;
}
