import { useState, useEffect } from 'react';

const Fruitlist = ['banana', 'apple', 'strawberry'];

// only recycle Hook code, not "sharing"
export function useHookStatus(){
  const [count, setCount] = useState(0);
  const [fruit, setFruit] = useState(0);

  // componentDidMount + componentDidUpdate
  useEffect(() => {
    document.title = `${count} ${Fruitlist[fruit]}`
  });

  function nextFruit(){
    setFruit(fruit => (fruit + 1) % Fruitlist.length);
  }

  return {
    "count": {
      "value": count,
      "update": setCount
    },
    "fruit": {
      "value": Fruitlist[fruit],
      "update": nextFruit
    }
  }
}