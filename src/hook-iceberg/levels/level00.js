import React, { useState } from 'react';

export default function Level00() {
  const [count, setCount] = useState(0);

  return (
    <div>
      count => {count}
      <button onClick={() => setCount(count + 1)}>+</button>
      <button onClick={() => setCount(count - 1)}>-</button>
    </div>
  );
}