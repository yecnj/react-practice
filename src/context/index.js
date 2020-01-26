import React, { useContext } from 'react';
import { ThemeContext } from './context';
import { useThemeStatus } from './useTheme';

function ThemeToggleButton(props){
  const context = useContext(ThemeContext)
  return <button onClick={context.toggle}>change</button>;
}

class ThemedLayout extends React.Component {
  render() {
    return (
      <div>
        <ThemeContext.Consumer>
          { context =>  <h1>{ context.theme }</h1> }
        </ThemeContext.Consumer>
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