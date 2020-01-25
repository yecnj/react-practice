import React from 'react';
import { useHookStatus } from './useHook'

export default function Hook (props) {
  // Only call Hook at the top level.
  // Only call Hook from React function components.
  const {count, fruit} = useHookStatus()

  return (
    <div>
      <p>Clicked: { count.value } times</p>
      <button onClick={() => count.update(count.value + 1)}>
        Click me
      </button>
      <p>Your fruit: { fruit.value } </p>
      <button onClick={ fruit.update }>
        Click me
      </button>
    </div>
  )
}