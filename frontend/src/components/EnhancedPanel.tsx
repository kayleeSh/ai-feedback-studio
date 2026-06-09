import { useState } from 'react';
import { SkeletonText } from './SkeletonText';
import { Tooltip } from './Tooltip';

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
          <Tooltip text={copied ? 'Copied!' : 'Copy'}>
            <button
              onClick={handleCopy}
              aria-label="Copy improved text to clipboard"
              style={{
                background: 'none',
                border: 'none',
                padding: 6,
                borderRadius: 6,
                cursor: 'pointer',
                color: copied ? '#059669' : '#d1d5db',
                display: 'flex',
                alignItems: 'center',
                transition: 'color 0.15s',
              }}
              onMouseEnter={e => { if (!copied) (e.currentTarget as HTMLElement).style.color = '#9ca3af'; }}
              onMouseLeave={e => { if (!copied) (e.currentTarget as HTMLElement).style.color = '#d1d5db'; }}
            >
              {copied ? (
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              ) : (
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="14" height="14" x="8" y="8" rx="2" />
                  <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                </svg>
              )}
            </button>
          </Tooltip>
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
