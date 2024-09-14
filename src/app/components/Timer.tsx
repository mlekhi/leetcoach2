import React, { useState, useEffect } from "react";

const Timer = () => {
  const [timeLeft, setTimeLeft] = useState(30 * 60); // 30 minutes in seconds

  useEffect(() => {
    if (timeLeft > 0) {
      const intervalId = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
      return () => clearInterval(intervalId);
    }
  }, [timeLeft]);

  const formatTime = (seconds : number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes < 10 ? "0" : ""}${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return <div>{formatTime(timeLeft)}</div>;
};

export default Timer;
