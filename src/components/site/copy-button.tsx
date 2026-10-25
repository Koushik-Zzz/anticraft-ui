"use client";

import { useState } from 'react';
import { Icon } from './icon';

export function CopyButton({ text, label = 'Copy', iconOnly = false }: { text: string; label?: string; iconOnly?: boolean }) {
  const [copied, setCopied] = useState(false);
  const [failed, setFailed] = useState(false);
  return <button className="copy-button" aria-label={copied ? 'Copied' : label} onClick={async () => {
    try { await navigator.clipboard.writeText(text); setCopied(true); setFailed(false); } catch { setFailed(true); }
  }}><Icon name={copied ? 'check' : 'copy'} size={14}/>{!iconOnly && <span>{failed ? 'Select text to copy' : copied ? 'Copied!' : label}</span>}<span className="sr-only" role="status">{copied ? 'Copied to clipboard' : failed ? 'Clipboard unavailable. Select the code and copy it.' : ''}</span></button>;
}
