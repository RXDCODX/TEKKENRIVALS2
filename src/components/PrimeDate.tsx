import { useEffect, useState, useMemo } from 'react';

const TOURNAMENT_DATE = new Date('2026-08-02T15:00:00+03:00');

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
      onMouseEnter={() => hasCountdown && setHovered(true)}
      onMouseLeave={() => setHovered(false)}
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
          02.09.2026
          <br />
          15:00
        </span>
      )}
    </div>
  );
};

export default PrimeDate;
