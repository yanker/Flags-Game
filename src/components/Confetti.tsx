import { h } from 'preact';
import { useEffect } from 'preact/hooks';
import confetti from 'canvas-confetti';

export function Confetti() {
  useEffect(() => {
    const duration = 3000;
    const end = Date.now() + duration;

    function frame() {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#FFD700'],
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#FFD700'],
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    }
    frame();
  }, []);

  return null;
}
