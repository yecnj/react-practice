import React, { useState, useEffect } from 'react';

export default function Level07() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCount(c => c + 1);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return <div>count => {count}</div>;
}