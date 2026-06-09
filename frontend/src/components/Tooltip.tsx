import { useRef, useState } from 'react';
import { createPortal } from 'react-dom';

interface Props {
  text: string;
  children: React.ReactNode;
}

export function Tooltip({ text, children }: Props) {
  const [visible, setVisible] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const ref = useRef<HTMLDivElement>(null);

  const show = () => {
    if (ref.current) {
      const r = ref.current.getBoundingClientRect();
      setPos({ top: r.bottom + 6, left: r.left + r.width / 2 });
    }
    setVisible(true);
  };

  return (
    <div ref={ref} style={{ display: 'inline-flex' }} onMouseEnter={show} onMouseLeave={() => setVisible(false)}>
      {children}
      {visible && createPortal(
        <div style={{
          position: 'fixed',
          top: pos.top,
          left: pos.left,
          transform: 'translateX(-50%)',
          background: 'rgba(17, 24, 39, 0.78)',
          backdropFilter: 'blur(6px)',
          WebkitBackdropFilter: 'blur(6px)',
          color: '#f9fafb',
          fontSize: '0.7rem',
          fontWeight: 500,
          padding: '4px 10px',
          borderRadius: 8,
          whiteSpace: 'nowrap',
          pointerEvents: 'none',
          zIndex: 9999,
          letterSpacing: '0.01em',
        }}>
          {text}
        </div>,
        document.body
      )}
    </div>
  );
}
