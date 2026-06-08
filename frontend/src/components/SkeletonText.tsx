interface SkeletonLineProps {
  width?: string;
}

function SkeletonLine({ width = '100%' }: SkeletonLineProps) {
  return (
    <div
      aria-hidden="true"
      style={{
        height: 14,
        width,
        background: 'linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%)',
        backgroundSize: '200% 100%',
        borderRadius: 4,
        animation: 'skeleton-shimmer 1.5s ease-in-out infinite',
      }}
    />
  );
}

export function SkeletonText() {
  return (
    <div
      role="status"
      aria-label="Analysing your text…"
      style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: '4px 0' }}
    >
      <SkeletonLine />
      <SkeletonLine />
      <SkeletonLine width="88%" />
      <SkeletonLine />
      <SkeletonLine width="75%" />
      <div style={{ height: 8 }} />
      <SkeletonLine />
      <SkeletonLine width="92%" />
      <SkeletonLine />
      <SkeletonLine width="60%" />
      <div style={{ height: 8 }} />
      <SkeletonLine />
      <SkeletonLine width="80%" />
      <SkeletonLine />
    </div>
  );
}
