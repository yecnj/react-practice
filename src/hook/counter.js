// Additional Hooks: Reducer
import { useReducer } from 'react';

const initialCount = {value: 0};

function counter(state, action) {
  switch (action.type){
    case 'increment':
      return {value: state.value + 1};
    case 'decrement':
      return {value: state.value - 1};
    default:
      throw new Error();
  }
}

export function useReducerStatus(){
  return useReducer(counter, initialCount);
} 