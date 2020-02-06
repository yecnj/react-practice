import React, { useState, useEffect } from 'react';

export default function Level02() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    setInterval(() => {
      setCount(count + 1);
    }, 500);
  });

  return <div>count => {count}</div>;
}