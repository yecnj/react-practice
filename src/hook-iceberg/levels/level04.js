import React, { useState, useEffect } from 'react';

export default function Level04() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCount(count + 1);
    }, 300);
    return () => clearInterval(interval);
  }, []);

  return <div>count => {count}</div>;
}