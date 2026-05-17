import { h } from 'preact';
import { useState, useEffect } from 'preact/hooks';

interface FlagCardProps {
  code: string;
  name: string;
}

export function FlagCard({ code, name }: FlagCardProps) {
  const [visible, setVisible] = useState(false);
  const [currentCode, setCurrentCode] = useState(code);

  useEffect(() => {
    if (code !== currentCode) {
      setVisible(false);
      const t = setTimeout(() => {
        setCurrentCode(code);
        setVisible(true);
      }, 150);
      return () => clearTimeout(t);
    } else {
      setVisible(true);
    }
  }, [code]);

  const src = `https://flagcdn.com/w320/${currentCode}.png`;
  const srcSet = `https://flagcdn.com/w320/${currentCode}.png 1x, https://flagcdn.com/w640/${currentCode}.png 2x`;

  return (
    <div class="flag-card-wrapper">
      <img
        class={`flag-card${visible ? ' flag-card--visible' : ''}`}
        src={src}
        srcset={srcSet}
        alt={`Bandera de ${name}`}
        width={320}
        height={213}
        loading="eager"
        decoding="async"
      />
    </div>
  );
}
