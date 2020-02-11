import React from 'react';
import useCounter from './useCounter';

export default function Level12() {
  const { count, start, stop, reset } = useCounter(0);
  return (
    <div>
      count => {count}
      <button onClick={start}>start</button>
      <button onClick={stop}>stop</button>
      <button onClick={reset}>reset</button>
    </div>
  );
}