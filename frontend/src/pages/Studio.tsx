import { useState, useEffect, useRef, useCallback, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { analyzeText, rewriteText } from '../api/client';
import { Annotation, AnalysisResult, ContentType, StudioStatus } from '../types';
import { AnnotatedText } from '../components/AnnotatedText';
import { FeedbackPanel } from '../components/FeedbackPanel';
import { EnhancedPanel } from '../components/EnhancedPanel';
import { SkeletonText } from '../components/SkeletonText';
import { Tooltip } from '../components/Tooltip';

const CONTENT_TYPE_ICONS: Record<ContentType, ReactNode> = {
  email: (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  ),
  product_copy: (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
      <circle cx="7" cy="7" r="1.2" fill="currentColor" stroke="none" />
    </svg>
  ),
  resume: (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
      <path d="M10 9H8" /><path d="M16 13H8" /><path d="M16 17H8" />
    </svg>
  ),
  ux_copy: (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="M2 9h20" />
      <circle cx="5.5" cy="6.5" r="0.9" fill="currentColor" stroke="none" />
      <circle cx="8.5" cy="6.5" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  ),
  essay: (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4Z" />
    </svg>
  ),
  general: (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
    </svg>
  ),
};

const CONTENT_TYPES: { value: ContentType; label: string; placeholder: string }[] = [
  { value: 'email',        label: 'Email',         placeholder: 'Paste your email draft here…' },
  { value: 'product_copy', label: 'Product Copy',  placeholder: 'Paste your product description, landing page copy, or marketing text here…' },
  { value: 'resume',       label: 'Resume',        placeholder: 'Paste a section of your resume or cover letter here…' },
  { value: 'ux_copy',      label: 'UX Copy',       placeholder: 'Paste your UI text, button labels, error messages, or onboarding copy here…' },
  { value: 'essay',        label: 'Essay',         placeholder: 'Paste your essay, article, or long-form writing here…' },
  { value: 'general',      label: 'General',       placeholder: 'Paste any text you want feedback on here…' },
];

const SAMPLE_TEXT: Record<ContentType, string> = {
  email: `Hi there,

I am writing to you in order to follow up on the meeting that we had last week regarding the project proposal. I wanted to touch base and get a status update.

As per our previous discussion, I was under the impression that we would be moving forward with the initial phase. I would really appreciate it if you could provide me with some clarity on the timeline and next steps.

Please do not hesitate to reach out to me if you have any questions or concerns. I look forward to hearing from you at your earliest convenience.

Best regards`,

  product_copy: `Our software solution is a comprehensive platform that enables businesses of all sizes to streamline their operations and improve their overall efficiency. Leveraging cutting-edge technology, our product has the ability to transform the way you work.

Featuring an intuitive interface, robust analytics capabilities, and seamless integration with your existing tools, it is the perfect solution for teams that are looking to optimise their workflow. Get started today and experience the difference.`,

  resume: `Results-driven professional with over 5 years of experience in the field of software development. Possess strong problem-solving skills and the ability to work well in a team environment. Have a proven track record of successfully delivering projects on time and within budget.

Responsible for the development and maintenance of multiple web applications. Collaborated with cross-functional teams to ensure project requirements were met. Utilised various technologies to build scalable solutions.`,

  ux_copy: `Welcome to the onboarding process! Please click on the button below in order to get started with the setup of your account. You will need to provide us with some information.

Error: Something went wrong with your request. Please try again later. If the problem persists, contact our support team for assistance.

Are you sure you want to delete this item? This action cannot be undone and the data will be permanently removed from our system.`,

  essay: `The impact of technology on modern society has been a subject of much debate in recent years. Many people argue that technology has had a positive effect on our lives, while others believe that it has created new problems and challenges that we must address.

In this essay, I will attempt to explore both sides of the argument and come to a conclusion about the overall impact of technology. It is important to note that this is a complex issue and there are no simple answers.`,

  general: `I wanted to reach out to you because I think that there might be an opportunity for us to work together on something that could be mutually beneficial. I have been following your work for some time and I am very impressed with what you have been doing.

I would love to set up a call at some point in the near future to discuss this further. Please let me know if you would be interested in having a conversation about this.`,
};

export default function Studio() {
  const [contentType, setContentType] = useState<ContentType>('email');
  const [inputText, setInputText]     = useState('');
  const [status, setStatus]           = useState<StudioStatus>('idle');
  const [result, setResult]           = useState<AnalysisResult | null>(null);
  const [revealedCount, setRevealedCount]           = useState(0);
  const [selectedAnnotation, setSelectedAnnotation] = useState<Annotation | null>(null);
  const [error, setError]             = useState('');
  const [rewriteStatus, setRewriteStatus] = useState<'idle' | 'loading' | 'complete' | 'error'>('idle');
  const [improvedText, setImprovedText]   = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const liveRef     = useRef<HTMLDivElement>(null);

  const currentPlaceholder = CONTENT_TYPES.find(t => t.value === contentType)?.placeholder ?? '';

  // Reveal annotations one by one after analysis completes
  useEffect(() => {
    if (status !== 'complete' || !result) return;
    setRevealedCount(0);
    let count = 0;
    const id = setInterval(() => {
      count++;
      setRevealedCount(count);
      if (count >= result.annotations.length) clearInterval(id);
    }, 160);
    return () => clearInterval(id);
  }, [status, result]);

  const handleAnalyze = useCallback(async () => {
    if (!inputText.trim() || inputText.trim().length < 20) return;
    setStatus('analyzing');
    setResult(null);
    setSelectedAnnotation(null);
    setError('');
    setRewriteStatus('loading');
    setImprovedText(null);

    // Announce to screen readers
    if (liveRef.current) liveRef.current.textContent = 'Analysing your text. Please wait.';

    // Fire rewrite in parallel — don't block analysis on it
    rewriteText(inputText, contentType)
      .then(text => { setImprovedText(text); setRewriteStatus('complete'); })
      .catch(() => setRewriteStatus('error'));

    try {
      const data = await analyzeText(inputText, contentType);
      setResult(data);
      setStatus('complete');
      if (liveRef.current) liveRef.current.textContent = `Analysis complete. Found ${data.annotations.length} issues.`;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Analysis failed';
      setError(msg);
      setStatus('error');
      setRewriteStatus('idle');
      if (liveRef.current) liveRef.current.textContent = `Error: ${msg}`;
    }
  }, [inputText, contentType]);

  const handleReset = () => {
    setStatus('idle');
    setResult(null);
    setSelectedAnnotation(null);
    setError('');
    setInputText('');
    setRewriteStatus('idle');
    setImprovedText(null);
    setTimeout(() => textareaRef.current?.focus(), 50);
  };

  const charCount = inputText.length;
  const charMax   = 5000;

  return (
    <div className="studio-page">
      {/* ARIA live region */}
      <div ref={liveRef} aria-live="polite" aria-atomic="true" className="sr-only" />

      {/* Header */}
      <header className="studio-header">
        <div className="studio-brand">
          <span className="studio-logo" aria-hidden="true">✦</span>
          <span>AI Feedback Studio</span>
        </div>
        <p className="studio-tagline">Paste any text — get structured, actionable feedback in seconds</p>
      </header>

      {/* Content type selector */}
      <nav className="content-type-nav" aria-label="Content type">
        {CONTENT_TYPES.map(ct => (
          <button
            key={ct.value}
            className={`content-type-btn ${contentType === ct.value ? 'active' : ''}`}
            onClick={() => { setContentType(ct.value); if (status === 'complete') handleReset(); }}
            aria-pressed={contentType === ct.value}
            disabled={status === 'analyzing'}
          >
            <span aria-hidden="true" style={{ display: 'flex', alignItems: 'center' }}>{CONTENT_TYPE_ICONS[ct.value]}</span>
            <span>{ct.label}</span>
          </button>
        ))}
      </nav>

      {/* Main layout — two or three columns */}
      <main className="studio-layout" id="main-content">

        {/* Left panel — input / annotated text */}
        <section className="text-panel" aria-label="Text input and annotations">
          <div className="panel-header">
            <h1 className="panel-title">
              {status === 'complete' ? 'Annotated Text' : 'Your Text'}
            </h1>
            <div className="panel-actions">
              {status === 'idle' && (
                <button
                  className="sample-btn"
                  onClick={() => setInputText(SAMPLE_TEXT[contentType])}
                  aria-label="Load sample text"
                >
                  Load sample
                </button>
              )}
              {status === 'complete' && (
                <Tooltip text="Start over">
                  <button
                    onClick={handleReset}
                    aria-label="Start over with new text"
                    style={{
                      background: 'none',
                      border: 'none',
                      padding: 6,
                      borderRadius: 6,
                      cursor: 'pointer',
                      color: '#d1d5db',
                      display: 'flex',
                      alignItems: 'center',
                      transition: 'color 0.15s',
                    }}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#9ca3af'}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = '#d1d5db'}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                      <path d="M3 3v5h5" />
                    </svg>
                  </button>
                </Tooltip>
              )}
            </div>
          </div>

          <div className="text-area-wrap">
            <AnimatePresence mode="wait">
              {status === 'analyzing' && (
                <motion.div key="skeleton" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <SkeletonText />
                </motion.div>
              )}

              {status === 'complete' && result && (
                <motion.div key="annotated" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <AnnotatedText
                    text={inputText}
                    annotations={result.annotations}
                    selectedId={selectedAnnotation?.id ?? null}
                    revealedCount={revealedCount}
                    onSelect={setSelectedAnnotation}
                  />
                  {revealedCount < result.annotations.length && (
                    <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span className="pulse-dot" aria-hidden="true" />
                      <span style={{ fontSize: '0.78rem', color: '#6b7280' }}>
                        Finding issues… {revealedCount} / {result.annotations.length}
                      </span>
                    </div>
                  )}
                </motion.div>
              )}

              {(status === 'idle' || status === 'error') && (
                <motion.div key="input" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <textarea
                    ref={textareaRef}
                    className="text-input"
                    placeholder={currentPlaceholder}
                    value={inputText}
                    onChange={e => setInputText(e.target.value)}
                    aria-label="Text to analyse"
                    aria-describedby="char-count"
                    maxLength={charMax}
                    autoFocus
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Footer */}
          <div className="panel-footer">
            {status === 'complete' && result ? (
              <span style={{ fontSize: '0.78rem', color: '#6b7280' }}>
                Click any highlighted passage to see feedback
              </span>
            ) : (
              <>
                <span id="char-count" style={{ fontSize: '0.78rem', color: charCount > charMax * 0.9 ? '#d97706' : '#9ca3af' }}>
                  {status === 'analyzing' ? '' : `${charCount.toLocaleString()} / ${charMax.toLocaleString()}`}
                </span>
                <button
                  className={`analyze-btn${status === 'analyzing' ? ' analyzing' : ''}`}
                  onClick={handleAnalyze}
                  disabled={status === 'analyzing' || inputText.trim().length < 20}
                  aria-label="Analyse text"
                >
                  <span className="analyze-icon" aria-hidden="true">✦</span>
                  {status === 'analyzing' ? 'Analysing…' : 'Analyse'}
                </button>
              </>
            )}
          </div>

          {error && (
            <div className="error-banner" role="alert">
              ⚠ {error}
            </div>
          )}
        </section>

        {/* Middle panel — feedback */}
        <aside className="feedback-panel-wrap" aria-label="Feedback panel">
          <FeedbackPanel
            result={result}
            selectedAnnotation={selectedAnnotation}
            onSelect={setSelectedAnnotation}
          />
        </aside>

        {/* Right panel — improved version, slides in after analysis */}
        <AnimatePresence>
          {status === 'complete' && (
            <motion.aside
              className="enhanced-panel-wrap"
              aria-label="Improved version"
              initial={{ width: 0 }}
              animate={{ width: 320 }}
              exit={{ width: 0 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
            >
              <EnhancedPanel
                improvedText={improvedText}
                isLoading={rewriteStatus === 'loading'}
                hasError={rewriteStatus === 'error'}
              />
            </motion.aside>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
