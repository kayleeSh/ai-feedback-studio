import { useState } from 'react';
import { SkeletonText } from './SkeletonText';

interface Props {
  improvedText: string | null;
  isLoading: boolean;
  hasError: boolean;
}

export function EnhancedPanel({ improvedText, isLoading, hasError }: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!improvedText) return;
    await navigator.clipboard.writeText(improvedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', width: 320 }}>
      <div style={{
        padding: '16px 24px 12px',
        borderBottom: '1px solid #f3f4f6',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexShrink: 0,
      }}>
        <h2 className="panel-title" style={{ margin: 0 }}>Improved Version</h2>
        {improvedText && (
          <button
            onClick={handleCopy}
            aria-label="Copy improved text to clipboard"
            style={{
              background: 'none',
              border: '1px solid #e5e7eb',
              borderRadius: 6,
              padding: '4px 12px',
              fontSize: '0.78rem',
              color: '#4f46e5',
              cursor: 'pointer',
              fontFamily: 'inherit',
              transition: 'all 0.12s',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#eef2ff'; (e.currentTarget as HTMLElement).style.borderColor = '#c7d2fe'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'none'; (e.currentTarget as HTMLElement).style.borderColor = '#e5e7eb'; }}
          >
            {copied ? '✓ Copied' : 'Copy'}
          </button>
        )}
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px', scrollbarWidth: 'thin' }}>
        {isLoading && <SkeletonText />}

        {hasError && !isLoading && (
          <p style={{ fontSize: '0.875rem', color: '#9ca3af', fontStyle: 'italic', margin: 0 }}>
            Could not generate improved version.
          </p>
        )}

        {improvedText && !isLoading && (
          <p style={{ fontSize: '0.95rem', color: '#1f2937', lineHeight: 1.85, whiteSpace: 'pre-wrap', margin: 0 }}>
            {improvedText}
          </p>
        )}
      </div>
    </div>
  );
}
