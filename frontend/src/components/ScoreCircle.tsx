interface Props {
  score: number;
}

function scoreColor(score: number): string {
  if (score >= 80) return '#059669';
  if (score >= 60) return '#d97706';
  return '#dc2626';
}

function scoreLabel(score: number): string {
  if (score >= 80) return 'Sharp';
  if (score >= 65) return 'Solid';
  if (score >= 50) return 'Fair';
  return 'Needs work';
}

export function ScoreCircle({ score }: Props) {
  const color = scoreColor(score);
  return (
    <div>
      <div style={{ fontSize: '2rem', fontWeight: 800, color, lineHeight: 1, letterSpacing: '-0.03em' }}>
        {scoreLabel(score)}
      </div>
      <div style={{ fontSize: '0.7rem', color: '#9ca3af', fontWeight: 500, marginTop: 4 }}>
        Score {score} / 100
      </div>
    </div>
  );
}
