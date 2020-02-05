import React, { useState } from 'react';
import { levels } from './levels'

export default function Iceberg() {
  const [level, setlevel] = useState(0);
  const SelectedLevel = levels[level]
  
  return (
    <div>
      <h2>Iceberg - Interval</h2>
      <label>Level: </label>
      <select value={level} onChange={e => setlevel(e.target.value)}>
        {levels.map((_, i) => <option keys={i} value={i}>{i}</option>)}
      </select>
      <SelectedLevel/>
    </div>
  );
}