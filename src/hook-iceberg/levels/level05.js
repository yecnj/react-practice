import React, { useState, useEffect } from 'react';

export default function Level05() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCount(count + 1);
    }, 500);
    return () => clearInterval(interval);
  }, [count]);

  return <div>count => {count}</div>;
}