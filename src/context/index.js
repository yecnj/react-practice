import React, { useContext } from 'react';
import { ThemeContext, UserContext } from './context';
import { useThemeStatus } from './useTheme';

function ThemeToggleButton(props){
  const context = useContext(ThemeContext)
  return <button onClick={context.toggle}>change</button>;
}

class ThemedLayout extends React.Component {
  static contextType = UserContext;
  render() {
    return (
      <div>
        <ThemeContext.Consumer>
          { context =>  <h1>{ context.theme }</h1> }
        </ThemeContext.Consumer>
        <h1>{ this.context }</h1>
        <ThemeToggleButton/>
      </div>
    );
  }
}

export default function Context(props){
  const status = useThemeStatus();
  return (
    <UserContext.Provider value={ 'root' }>
      <ThemeContext.Provider value={ status }>
        <ThemedLayout/>
      </ThemeContext.Provider>
    </UserContext.Provider>
  )
}