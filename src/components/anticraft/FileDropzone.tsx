'use client';

import { useId, useRef, useState, type DragEvent } from 'react';
import './file-dropzone.css';

export type FileDropzoneProps = {
  label?: string;
  accept?: string;
  fileTypesLabel?: string;
  multiple?: boolean;
  maxFiles?: number;
  maxSize?: number;
  disabled?: boolean;
  onFilesChange?: (files: File[]) => void;
  className?: string;
};

const DEFAULT_MAX_SIZE = 10 * 1024 * 1024;

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(bytes < 10 * 1024 ? 1 : 0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(bytes < 10 * 1024 * 1024 ? 1 : 0)} MB`;
}

function fileKey(file: File) {
  return JSON.stringify([file.name, file.size, file.lastModified, file.type]);
}

function matchesAccept(file: File, accept: string) {
  const rules = accept.split(',').map(rule => rule.trim().toLowerCase()).filter(Boolean);
  if (rules.length === 0) return true;
  const name = file.name.toLowerCase();
  const type = file.type.toLowerCase();
  return rules.some(rule => {
    if (rule.startsWith('.')) return name.endsWith(rule);
    if (rule === '*/*') return true;
    if (!type) return false;
    if (rule.endsWith('/*')) return type.startsWith(rule.slice(0, -1));
    return type === rule;
  });
}

/** Local file selection with validation. Connect onFilesChange to your own upload flow. */
export function FileDropzone({ label = 'Attachments', accept = '', fileTypesLabel, multiple = true, maxFiles = 5, maxSize = DEFAULT_MAX_SIZE, disabled = false, onFilesChange, className = '' }: FileDropzoneProps) {
  const uid = useId();
  const input = useRef<HTMLInputElement>(null);
  const browse = useRef<HTMLButtonElement>(null);
  const removeButtons = useRef(new Map<string, HTMLButtonElement>());
  const dragDepth = useRef(0);
  const selected = useRef<File[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [dragging, setDragging] = useState(false);
  const [announcement, setAnnouncement] = useState('');
  const countLimit = multiple ? (Number.isFinite(maxFiles) && maxFiles >= 1 ? Math.floor(maxFiles) : 5) : 1;
  const sizeLimit = Number.isFinite(maxSize) && maxSize >= 0 ? maxSize : DEFAULT_MAX_SIZE;
  const totalSize = files.reduce((total, file) => total + file.size, 0);
  const typesLabel = fileTypesLabel ?? (accept || 'Any file type');

  function commit(next: File[]) {
    selected.current = next;
    setFiles(next);
    onFilesChange?.([...next]);
  }

  function addFiles(incoming: File[]) {
    if (disabled || incoming.length === 0) return;
    const next = multiple ? [...selected.current] : [];
    const rejected: string[] = [];
    let added = 0;
    for (const file of incoming) {
      if (!matchesAccept(file, accept)) {
        rejected.push(`${file.name}: file type is not accepted.`);
      } else if (file.size > sizeLimit) {
        rejected.push(`${file.name}: exceeds ${formatBytes(sizeLimit)} per file.`);
      } else if (next.some(item => fileKey(item) === fileKey(file)) || (!multiple && added === 0 && selected.current.some(item => fileKey(item) === fileKey(file)))) {
        rejected.push(`${file.name}: already selected.`);
      } else if (next.length >= countLimit) {
        rejected.push(`${file.name}: maximum of ${countLimit} ${countLimit === 1 ? 'file' : 'files'} reached.`);
      } else {
        next.push(file);
        added += 1;
      }
    }
    if (added > 0) commit(next);
    setErrors(rejected);
    setAnnouncement([added > 0 ? `${added} ${added === 1 ? 'file' : 'files'} selected. ${next.length} total.` : 'No files added.', ...rejected].join(' '));
  }

  function removeFile(file: File) {
    if (disabled) return;
    const index = selected.current.findIndex(item => fileKey(item) === fileKey(file));
    const next = selected.current.filter(item => fileKey(item) !== fileKey(file));
    const adjacent = next[index] ?? next[index - 1];
    const focusTarget = adjacent ? removeButtons.current.get(fileKey(adjacent)) : browse.current;
    // Move focus to a surviving control before React removes the activated button.
    (focusTarget ?? browse.current)?.focus();
    commit(next);
    setErrors([]);
    setAnnouncement(`${file.name} removed. ${next.length} ${next.length === 1 ? 'file' : 'files'} selected.`);
  }

  function hasFiles(event: DragEvent<HTMLDivElement>) {
    return Array.from(event.dataTransfer.types).includes('Files');
  }

  return <section className={`ac-file-dropzone ${className}`.trim()} aria-labelledby={`${uid}-label`} aria-disabled={disabled} data-disabled={disabled}>
    <header className="ac-file-header"><h3 id={`${uid}-label`}>{label}</h3><span className="ac-file-count" aria-label={`${files.length} of ${countLimit} files selected`}>{files.length}<span aria-hidden="true"> / {countLimit}</span></span></header>
    <div className="ac-file-drop-area" data-dragging={dragging && !disabled} aria-describedby={`${uid}-hint${errors.length ? ` ${uid}-errors` : ''}`}
      onDragEnter={event => { if (!hasFiles(event)) return; event.preventDefault(); dragDepth.current += 1; if (!disabled) setDragging(true); }}
      onDragOver={event => { if (!hasFiles(event)) return; event.preventDefault(); event.dataTransfer.dropEffect = disabled ? 'none' : 'copy'; }}
      onDragLeave={event => { if (!hasFiles(event)) return; event.preventDefault(); dragDepth.current = Math.max(0, dragDepth.current - 1); if (dragDepth.current === 0) setDragging(false); }}
      onDrop={event => { event.preventDefault(); dragDepth.current = 0; setDragging(false); addFiles(Array.from(event.dataTransfer.files)); }}>
      <div className="ac-file-drop-icon" aria-hidden="true"><svg viewBox="0 0 28 32" fill="none"><path d="M5 1.5h12L26.5 11v17a2.5 2.5 0 0 1-2.5 2.5H5A2.5 2.5 0 0 1 2.5 28V4A2.5 2.5 0 0 1 5 1.5Z"/><path d="M17 2v9h9M9 21h11m-5.5-5.5v11"/></svg><span>+</span></div>
      <p className="ac-file-drop-title">{dragging && !disabled ? 'Release to select' : 'Drop files here'}</p>
      <p className="ac-file-drop-or">or choose from your device</p>
      <button ref={browse} type="button" className="ac-file-browse" disabled={disabled} onClick={() => input.current?.click()}>Choose {multiple ? 'files' : 'a file'}<span aria-hidden="true">↗</span></button>
      <input ref={input} className="ac-file-native-input" id={`${uid}-input`} type="file" accept={accept || undefined} multiple={multiple} disabled={disabled} tabIndex={-1} aria-label={`Choose ${label.toLowerCase()}`} onChange={event => { addFiles(Array.from(event.currentTarget.files ?? [])); event.currentTarget.value = ''; }}/>
      <p className="ac-file-hint" id={`${uid}-hint`}>{typesLabel}<span>{formatBytes(sizeLimit)} per file · {countLimit} {countLimit === 1 ? 'file' : 'files'} maximum</span></p>
    </div>
    {errors.length > 0 && <ul className="ac-file-errors" id={`${uid}-errors`}>{errors.map((error, index) => <li key={`${index}-${error}`}>{error}</li>)}</ul>}
    {files.length > 0 && <ul className="ac-file-list" aria-label="Selected files">{files.map(file => <li key={fileKey(file)}><span className="ac-file-type" aria-hidden="true">{file.name.includes('.') ? file.name.split('.').pop()?.slice(0, 4).toUpperCase() : 'FILE'}</span><span className="ac-file-meta"><strong title={file.name}>{file.name}</strong><span>{formatBytes(file.size)}</span></span><span className="ac-file-selected-mark" aria-hidden="true">✓</span><button ref={element => { if (element) removeButtons.current.set(fileKey(file), element); else removeButtons.current.delete(fileKey(file)); }} type="button" className="ac-file-remove" disabled={disabled} aria-label={`Remove ${file.name}`} onClick={() => removeFile(file)}><span aria-hidden="true">×</span></button></li>)}</ul>}
    <footer className="ac-file-footer"><span>{files.length ? `${files.length} ${files.length === 1 ? 'file' : 'files'} selected` : 'No files selected'}</span><span>{files.length ? formatBytes(totalSize) : `${countLimit} slots available`}</span></footer>
    <p className="ac-file-sr" aria-live="polite" aria-atomic="true">{announcement}</p>
  </section>;
}
