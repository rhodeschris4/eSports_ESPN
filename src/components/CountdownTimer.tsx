import React, { useEffect, useState } from 'react';

interface CountdownTimerProps {
  targetDate: Date;
}

const getTimeRemaining = (target: Date) => {
  const total = target.getTime() - new Date().getTime();
  const seconds = Math.floor((total / 1000) % 60);
  const minutes = Math.floor((total / 1000 / 60) % 60);
  const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
  const days = Math.floor(total / (1000 * 60 * 60 * 24));
  return { total, days, hours, minutes, seconds };
};

const CountdownTimer: React.FC<CountdownTimerProps> = ({ targetDate }) => {
  const [time, setTime] = useState(getTimeRemaining(targetDate));

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(getTimeRemaining(targetDate));
    }, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  if (time.total <= 0) return <span className="text-green-400 font-bold">LIVE</span>;

  return (
    <span className="text-yellow-400 font-mono">
      {time.days > 0 && `${time.days}d `}
      {time.hours}h {time.minutes}m {time.seconds}s
    </span>
  );
};

export default CountdownTimer; 