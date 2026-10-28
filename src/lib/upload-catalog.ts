import type { ComponentDefinition } from './catalog';

export const uploadComponents: ComponentDefinition[] = [{
  slug: 'file-dropzone', title: 'File Dropzone', category: 'Forms', tag: 'New',
  description: 'Select or drop files, validate type and size, and remove attachments before uploading.',
  file: 'FileDropzone.tsx', cssFile: 'file-dropzone.css',
  useCases: ['Project attachments', 'Document submissions', 'Image selection'],
  usage: `'use client';

import { FileDropzone } from '@/components/anticraft/FileDropzone';

export function Example() {
  return <FileDropzone
    label="Attachments"
    accept=".pdf,.png,.jpg,.jpeg"
    fileTypesLabel="PDF, PNG, or JPG"
    maxFiles={5}
    maxSize={10 * 1024 * 1024}
    onFilesChange={files => {
      // Store these File objects for your own submit or upload handler.
      console.log(files);
    }}
  />;
}`,
  props: [
    { name: 'label', type: 'string', default: "'Attachments'", description: 'Visible heading and accessible name for the selected-file section.' },
    { name: 'accept', type: 'string', default: "''", description: 'Comma-separated filename extensions, MIME types, or MIME wildcards, such as .pdf,image/*. Used by both the native picker and drop validation; an empty value permits all types. File extensions match without case sensitivity. When a browser supplies no MIME type, only an explicit matching extension (or */*) can accept that file. Client validation does not replace checks on your server.' },
    { name: 'fileTypesLabel', type: 'string', default: 'accept or Any file type', description: 'Readable format hint, such as PDF, PNG, or JPG. Does not affect validation.' },
    { name: 'multiple', type: 'boolean', default: 'true', description: 'Allows additional selections to append files. When false, the first valid file in a selection replaces the current file; rejected selections retain the current file. A drop containing several valid files keeps the first and reports the remainder.' },
    { name: 'maxFiles', type: 'number', default: '5', description: 'Maximum accepted count when multiple is true. Files are processed in input order, retaining accepted files and reporting rejected ones. Nonfinite or values below 1 fall back to 5; fractional values round down. Changing this limit does not discard existing files.' },
    { name: 'maxSize', type: 'number', default: '10485760 (10 MB)', description: 'Maximum bytes per file, inclusive. Zero permits only empty files; negative or nonfinite values fall back to 10 MB. Changing the limit affects subsequent selections.' },
    { name: 'onFilesChange', type: '(files: File[]) => void', default: 'undefined', description: 'Receives a new array of actual File objects after accepted additions or removals. No callback on initial mount or a wholly rejected selection. This is local selection state: connect it to your upload handler or FormData when submitting. The native input is reset after each selection and is not a form-submission source.' },
    { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables the picker, drop acceptance, and remove buttons while retaining selected files.' },
    { name: 'className', type: 'string', default: "''", description: 'Additional root classes. Theme --ac-file-paper, --ac-file-ink, --ac-file-muted, --ac-file-line, --ac-file-accent, and --ac-file-focus. Maximum width is 640px.' },
  ],
  motion: 'Native file selection and file drag-and-drop. Duplicate files with identical name, size, lastModified, and type are rejected. Mixed selections retain valid files and announce the rejected names and reasons in a polite live region. Remove buttons are keyboard accessible; removing a file permits selecting it again. Attachment lists scroll when long. No uploads, network requests, object URLs, or simulated progress are created. The demo accepts PDF, PNG, JPG, and ZIP files, up to five files at 10 MB each. Reduced motion removes surface and button transitions.',
}];
