import React, { useState, useRef } from 'react';

export default function Level09() {
  const [count, setCount] = useState(0);
  const intervalRef = useRef(null);

  const start = () => {
    intervalRef.current = setInterval(() => {
      setCount(c => c + 1);
    }, 500);
  };
  const stop = () => {
    clearInterval(intervalRef.current);
  };
  
  return (
    <div>
      count => {count}
      <button onClick={start}>start</button>
      <button onClick={stop}>stop</button>
    </div>
  );
}