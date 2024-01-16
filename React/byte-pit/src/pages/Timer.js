import React, { useState, useEffect } from 'react';

const Timer = ({ endTime, onTimerExpired }) => {
  const calculateRemainingTime = () => {
    const currentTime = new Date();
    const [year, month, day, hour, minute, second, milisecond] = endTime;
    const endTimeDate = new Date(year, month - 1, day, hour, minute);

    if (isNaN(endTimeDate)) {
      console.error(`Invalid date format for endTime: ${endTime}`);
      return 0; // Return 0 seconds if the date is invalid
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
