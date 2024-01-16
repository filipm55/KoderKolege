import React, { useState, useEffect } from 'react';

const Timer = ({ endTime, onTimerExpired }) => {
  const calculateRemainingTime = () => {
    const currentTime = new Date();
    const [year, month, day, hour, minute, second, millisecond] = endTime;

    let endTimeDate;
    
    if (endTime.length >= 6) {
        endTimeDate = new Date(year, month - 1, day, hour, minute, second, millisecond);
    } else {
        endTimeDate = new Date(year, month - 1, day, hour, minute, 0, 0);
    }

    if (isNaN(endTimeDate)) {
      console.error(`Invalid date format for endTime: ${endTime}`);
      return 0; 
    }

    const remainingSeconds = Math.max(0, Math.floor((endTimeDate - currentTime) / 1000));
    return remainingSeconds;
  };

  const [seconds, setSeconds] = useState(calculateRemainingTime());

  useEffect(() => {
    const intervalId = setInterval(() => {
      const newSeconds = Math.max(0, seconds - 1);
      setSeconds(newSeconds);

      if (newSeconds === 0) {
        // Call the callback function when the timer expires
        onTimerExpired();
        clearInterval(intervalId);
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [seconds, onTimerExpired]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
  };

  return <div>{formatTime(seconds)}</div>;
};

export default Timer;
