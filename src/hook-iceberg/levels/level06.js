import React, { useState, useEffect } from 'react';

export default function Level06() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setCount(count + 1);
    }, 500);
    return () => clearTimeout(timeout);
  }, [count]);

  return <div>count => {count}</div>;
}