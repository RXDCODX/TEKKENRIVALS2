import { useEffect, useState, useMemo } from 'react';

const TOURNAMENT_DATE = new Date('2026-09-02T15:00:00+03:00');

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function getTimeLeft(): TimeLeft | null {
  const diff = TOURNAMENT_DATE.getTime() - Date.now();
  if (diff <= 0) return null;

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

const localDate = TOURNAMENT_DATE.toLocaleDateString('ru-RU');
const localTime = TOURNAMENT_DATE.toLocaleTimeString('ru-RU', {
  hour: '2-digit',
  minute: '2-digit',
});

const PrimeDate: React.FC = () => {
  const [hovered, setHovered] = useState(false);
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(() =>
    getTimeLeft()
  );

  useEffect(() => {
    if (!hovered || !timeLeft) return;
    const interval = setInterval(() => {
      setTimeLeft(getTimeLeft());
    }, 1000);
    return () => clearInterval(interval);
  }, [hovered, timeLeft]);

  const hasCountdown = useMemo(() => getTimeLeft() !== null, []);

  return (
    <div
      className='prime-date'
      // Hover alone would hide the countdown from every touch device, so the
      // same reveal is also a tap (and a keyboard activation) away.
      role={hasCountdown ? 'button' : undefined}
      tabIndex={hasCountdown ? 0 : undefined}
      aria-expanded={hasCountdown ? hovered : undefined}
      aria-label={
        hasCountdown ? 'Показать обратный отсчёт до турнира' : undefined
      }
      onMouseEnter={() => hasCountdown && setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => hasCountdown && setHovered(prev => !prev)}
      onKeyDown={event => {
        if (hasCountdown && (event.key === 'Enter' || event.key === ' ')) {
          event.preventDefault();
          setHovered(prev => !prev);
        }
      }}
    >
      {hovered && timeLeft ? (
        <span className='prime-date__countdown'>
          до возни:
          <br />
          {timeLeft.days}д {timeLeft.hours}ч {timeLeft.minutes}м{' '}
          {timeLeft.seconds}с
        </span>
      ) : (
        <span className='prime-date__original'>
          {hovered ? 'возня идёт!' : 'начало возни'}
          <br />
          {localDate}
          <br />
          {localTime}
        </span>
      )}
    </div>
  );
};

export default PrimeDate;
