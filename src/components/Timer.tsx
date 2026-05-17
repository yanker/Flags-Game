import { h } from 'preact';
import { useEffect, useRef, useState } from 'preact/hooks';
import { playTick } from '../lib/sound';

interface TimerProps {
  totalSeconds: number;
  onTimeout: () => void;
  running: boolean;
  soundEnabled: boolean;
}

export function Timer({ totalSeconds, onTimeout, running, soundEnabled }: TimerProps) {
  const [remaining, setRemaining] = useState(totalSeconds);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const calledRef = useRef(false);

  useEffect(() => {
    setRemaining(totalSeconds);
    calledRef.current = false;
  }, [totalSeconds]);

  useEffect(() => {
    if (!running) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }
    intervalRef.current = setInterval(() => {
      setRemaining(prev => {
        const next = prev - 1;
        if (soundEnabled && next > 0) playTick();
        if (next <= 0) {
          clearInterval(intervalRef.current!);
          if (!calledRef.current) {
            calledRef.current = true;
            onTimeout();
          }
          return 0;
        }
        return next;
      });
    }, 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running, totalSeconds, soundEnabled]);

  const pct = remaining / totalSeconds;
  const isUrgent = remaining <= 3;

  // SVG circle progress
  const r = 28;
  const circ = 2 * Math.PI * r;
  const dash = circ * pct;

  return (
    <div class={`timer${isUrgent ? ' timer--urgent' : ''}`} aria-label={`${remaining} segundos restantes`}>
      <svg width="72" height="72" viewBox="0 0 72 72">
        <circle cx="36" cy="36" r={r} fill="none" stroke="var(--color-surface)" stroke-width="6" />
        <circle
          cx="36"
          cy="36"
          r={r}
          fill="none"
          stroke={isUrgent ? 'var(--color-wrong)' : 'var(--color-correct)'}
          stroke-width="6"
          stroke-dasharray={`${dash} ${circ}`}
          stroke-linecap="round"
          transform="rotate(-90 36 36)"
          style="transition: stroke-dasharray 0.9s linear, stroke 0.3s"
        />
        <text x="36" y="41" text-anchor="middle" font-size="20" font-weight="bold" fill="var(--color-text)">
          {remaining}
        </text>
      </svg>
    </div>
  );
}
