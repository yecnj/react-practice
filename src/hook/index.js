import React, { useState, useEffect } from 'react';

const Fruitlist = ['banana', 'apple', 'strawberry'];

export default function Hook (props) {
  const [count, setCount] = useState(0);
  const [fruit, setFruit] = useState(0);

  useEffect(() => {
    document.title = `${count} ${Fruitlist[fruit]}`
  });

  function nextFruit(){
    // updating state based on previous state
    setFruit(fruit => (fruit + 1) % Fruitlist.length);
  }

  return (
    <div>
      <p>Clicked: { count } times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
      <p>Your fruit: { Fruitlist[fruit] } </p>
      <button onClick={ nextFruit }>
        Click me
      </button>
    </div>
  )
}