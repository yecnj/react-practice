import React, { useContext } from 'react';
import { ThemeContext, UserContext } from './context';
import { useThemeStatus, useUserStatus } from './useTheme';

function ThemeToggleButton(props){
  const context = useContext(ThemeContext)
  return <button onClick={context.toggle}>change</button>;
}

function UserRootButton(props){
  const { setUser } = useContext(UserContext);
  return <button onClick={() => setUser('root')}>change root</button>
}

class ThemedLayout extends React.Component {
  static contextType = UserContext;
  render() {
    return (
      <div>
        <ThemeContext.Consumer>
          { context =>  <h1>{ context.theme }</h1> }
        </ThemeContext.Consumer>
        <ThemeToggleButton/>
        <h1>{ this.context.user }</h1>
        <UserRootButton/>
      </div>
    );
  }
}

export default function Context(props){
  const status = useThemeStatus();
  const [user, setUser] = useUserStatus();
  return (
    <UserContext.Provider value={ { user, setUser } }>
      <ThemeContext.Provider value={ status }>
        <ThemedLayout/>
      </ThemeContext.Provider>
    </UserContext.Provider>
  )
}