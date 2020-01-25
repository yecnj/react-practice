import React, { useContext } from 'react';
import { ThemeContext } from './context';
import { useThemeStatus } from './useTheme';

function ThemeToggleButton(props){
  const context = useContext(ThemeContext)
  return <button onClick={context.toggle}>change</button>;
}

class ThemedLayout extends React.Component {
  static contextType = ThemeContext;
  render() {
    return (
      <div>
        <h1>{ this.context.theme }</h1>
        <ThemeToggleButton/>
      </div>
    );
  }
}

export default function Context(props){
  const status = useThemeStatus();
  return (
    <ThemeContext.Provider value={ status }>
      <ThemedLayout/>
    </ThemeContext.Provider>
  )
}