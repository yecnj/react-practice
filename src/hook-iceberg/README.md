# The Iceberg of React Hooks
> 원글: https://medium.com/@sdolidze/the-iceberg-of-react-hooks-af0b588f43fb 

## 소개
React Hooks는 클래스 컴포넌트와 다르게 기본적인 코드만으로 어플리케이션에 필요한 요소 구성, 코드의 재사용 등을 간단하게 이뤄냅니다.

하지만, 잘 모르고 사용할 경우 파악하기 어려운 버그들이나 성능 문제가 발생할 수 있습니다.

이 글에서는 Hook에서 발생하는 일반적인 문제들과 해결방법 12가지를 준비했습니다.

* * *

## 목표
목표는 500ms마다 증가하는 카운터를 만드는 것입니다.
는
start, stop, clear 세가지 버튼이 구현되어야합니다.

![Alt text](./img/goal.gif "목표")

* * * 

## Level 00: Hello World
```javascript
// levels/level00.js
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
```
`useState`를 이용해서 구현된 간단한 카운터입니다.   
각 버튼을 이용해 count를 올리거나, 내릴 수 있습니다.

## Level 01: setInterval
```javascript
// levels/level01.js
import React, { useState } from 'react';

export default function Level01() {
  const [count, setCount] = useState(0);

  setInterval(() => {
    setCount(count + 1);
  }, 500);

  return <div>count => {count}</div>;
}
```
위 코드는 500ms마다 카운터를 올리기 위해 작성되었습니다.   
하지만, 의도와는 다르게 랜더링이 발생할 때마다 새로운 인터벌이 작성됩니다.  

함수형 컴포넌트 자체에서는 뮤테이션, 구독, 타이머, 로깅 및 기타 Side effect가 허용되지 않습니다([UseEffect](https://ko.reactjs.org/docs/hooks-reference.html#useeffect))

## Level 02: [UseEffect](https://ko.reactjs.org/docs/hooks-reference.html#useeffect)
```javascript
// levels/level02.js
import React, { useState, useEffect } from 'react';

export default function Level02() {
  const [count, setCount] = useState(0);

  useEffect(() =>
    setInterval(() => {
      setCount(count + 1);
    }, 500);
  });

  return <div>count => {count}</div>;
}
```
대부분의 Side effect는 [UseEffect](https://ko.reactjs.org/docs/hooks-reference.html#useeffect) 내에서 행해집니다. 하지만 이 코드도 랜더링이 발생할 때마다 새로운 인터벌이 작성되고, 결과적으로 리소스 낭비가 일어납니다.


## Level 03: run only once ([effect 타이밍](https://ko.reactjs.org/docs/hooks-reference.html#timing-of-effects))
```javascript
// levels/level03.js
import React, { useState, useEffect } from 'react';

export default function Level03() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    setInterval(() => {
      setCount(count + 1);
    }, 300);
  }, []);

  return <div>count => {count}</div>;
}
```
`useEffect`에 `[]`를 두번째 인수로 지정할 경우 컴포넌트 마운트 이후 함수가 한번만 호출됩니다.

하지만, 결과적으로 count는 0에서 1로 증가한 뒤 유지됩니다.   
화살표 함수 역시 첫 사이클 한번만 생성되며 이 때의 count는 0으로 `setCount(1)` 이 계속해서 호출되기 때문입니다.

또한, 이 코드는 컴포넌트를 마운트 해제한 이후에도 계속해서 `setCount`가 호출되는 리소스 낭비가 있습니다.


## Level 04: cleanup ([effect 정리](https://ko.reactjs.org/docs/hooks-reference.html#cleaning-up-an-effect))
```javascript
// levels/level04.js
...

  useEffect(() => {
    const interval = setInterval(() => {
      setCount(count + 1);
    }, 300);
    return () => clearInterval(interval);
  }, []);

...
```
리소스 낭비를 없애기 위해서는 생명주기가 끝날 때 모든 effect를 정리해야합니다.   
구독 또는 타이머 같은 리소스는 `useEffect`에서 사용한 뒤 clean-up function을 반환해야합니다.

다만, 리소스 낭비가 해결되었을 뿐 `count`는 1로 변한채 계속 유지됩니다.

## Level 05: use `count` as dependency ([조건부 effect 발생](https://ko.reactjs.org/docs/hooks-reference.html#conditionally-firing-an-effect))
 

```javascript
// levels/level05.js
...

  useEffect(() => {
    const interval = setInterval(() => {
      setCount(count + 1);
    }, 500);
    return () => clearInterval(interval);
  }, [count]);

...
```
앞서 사용했던 `useEffect`의 두번째 인수는 `DependencyList`로 각 Dependency가 업데이트 될때마다 clean-up function과 새로운 `useEffect`가 호출됩니다.

이 코드는 버그없이 작동합니다. 하지만, `setInterval`이 500ms 마다 폐기와 생성을 반복한다는 점에서 완벽한 코드는 아닙니다.

## Level 06: setTimeout
```javascript
// levels/level06.js
...

  useEffect(() => {
    const timeout = setTimeout(() => {
      setCount(count + 1);
    }, 500);
    return () => clearTimeout(timeout);
  }, [count]);

...
```
Level 5의 코드와 마찬가지로 정상적으로 작동합니다. `count`가 바뀔때마다 `useEffect`가 호출되고 `setTimeout`과 `setInteval`은 똑같이 작동해냅니다.

하지만, React에는 이 둘보다 더 나은 해결방안이 있습니다.

## Level 07: [functional update(함수적 갱신)](https://ko.reactjs.org/docs/hooks-reference.html#functional-updates) for useState
```javascript
// levels/level07.js
...

  useEffect(() => {
    const interval = setInterval(() => {
      setCount(c => c + 1);
    }, 500);
    return () => clearInterval(interval);
  }, []);

...
```
`useState`의 `functional update`를 이용하면 함수 실행시 값, 즉 이전 상태를 기준으로 다음 상태를 결정할 수 있습니다.

`DependencyList`가 비어있기 때문에 `clearInterval`은 컴포넌트 마운트 해제시에만 작동하고, `useEffect` 역시 컴포넌트 마운트시 단 한번만 작동합니다.

따라서, 이 코드는 우리가 원하는대로 정확하게 작동합니다.

```powershell
./src/hook-iceberg/levels/level03.js
  Line 10:6:  React Hook useEffect has a missing dependency: 'count'. Either include it or remove the dependency array. You can also do a functional update 'setCount(c => ...)' if you only need 'count' in
the 'setCount' call  react-hooks/exhaustive-deps
```
앞서 작성된 `Level 3, 4`에서 위의 Warning이 나타나는데요. 각각 `Level 6, 7`에 해당되는 내용입니다.

1. count를 DependencyList에 추가하거나 DependencyList를 제거하세요.
2. setCount에서만 count를 사용할 경우 functioinal update를 사용하세요.

## Level 08: local variable
```javascript
// levels/level08.js
import React, { useState } from 'react';

export default function Level08() {
  const [count, setCount] = useState(0);
  let interval = null;

  const start = () => {
    interval = setInterval(() => {
      setCount(c => c + 1);
    }, 500);
  };
  const stop = () => {
    clearInterval(interval);
  };

  return (
    <div>
      count => {count}
      <button onClick={start}>start</button>
      <button onClick={stop}>stop</button>
    </div>
  );
}
```
`start`와 `stop` 버튼을 구현했습니다.

`start` 버튼에 의해서 시작되기 때문에 `useEffect`는 사라졌습니다. `start`는 앞서 구현한대로 `interval`을 생성하고, `stop`은 `clearinterval`을 실행합니다.

하지만 이 코드는 정상적으로 작동하지 않습니다. Render 시에 새로운 Reference가 생성되기 때문에, `stop`함수는 null을 참조하게됩니다.

마찬가지로, `start`함수가 여러번 호출되면 그만큼 `setInterval`도 누적되는 버그가 있습니다.

## Level 09: [useRef](https://ko.reactjs.org/docs/hooks-reference.html#useref)
```javascript
// levels/level09.js
import React, { useState, useRef } from 'react';

export default function Level09() {
  const [count, setCount] = useState(0);
  const intervalRef = useRef(null);

  const start = () => {
    intervalRef.current = setInterval(() => {
      setCount(c => c + 1);
    }, 500);
  };
  const stop = () => {
    clearInterval(intervalRef.current);
  };
  
  return (
    <div>
      count => {count}
      <button onClick={start}>start</button>
      <button onClick={stop}>stop</button>
    </div>
  );
}
```
`useRef`를 사용하면 `local variable`과는 다르게 같은 변수를 계속해서 참조할 수 있습니다.

다음은 `start`함수를 여러번 호출할 때 interval이 겹치는 문제를 해결해야합니다.

## Level 10: useCallback
```javascript
// levels/level10.js
...
  const start = () => {
    if (intervalRef.current !== null) {
      return;
    }
    ...
  };
  const stop = () => {
    if (intervalRef.current === null) {
      return;
    }
    ...
  };
...
```
`start`의 시작시 간격이 이미 생성된 경우, `stop`의 시작시 간격이 이미 없는 경우를 체크해 바로 함수를 끝냄으로써 리소스 낭비를 피했습니다. 다만, 성능에 문제가 조금 있습니다.

[memoization](https://medium.com/@sdolidze/react-hooks-memoization-99a9a91c8853)은 React에서 자주 사용하는 성능 최적화 도구입니다. `React.memo`는 얕은 비교(shallow comparison)를 수행한 뒤, 레퍼런스가 같으면 랜더링을 건너뜁니다. `start`와 `stop`이 `memoized` component에 전달되면 매 랜더링마다 새로운 참조가 리턴되기때문에 최적화에 실패합니다.

## Level 11: [useCallback](https://ko.reactjs.org/docs/hooks-reference.html#usecallback)
```javascript
// levels/level11.js
import React, { useState, useRef } from 'react';

export default function Level11() {
  const [count, setCount] = useState(0);
  const intervalRef = useRef(null);

  const start = useCallback(() => {
    if (intervalRef.current !== null) {
      return;
    }
    intervalRef.current = setInterval(() => {
      setCount(c => c + 1);
    }, 500);
  }, []);

  const stop = useCallback(() => {
    if (intervalRef.current === null) {
      return;
    }
    clearInterval(intervalRef.current);
    intervalRef.current = null;
  }, []);

  return (
    <div>
      count => {count}
      <button onClick={start}>start</button>
      <button onClick={stop}>stop</button>
    </div>
  );
}
```
`useCallback`을 이용해서 함수를 작성하면 랜더링 후에도 같은 레퍼런스를 줄 수 있습니다. 

이 코드의 경우 정상적으로 작동하며 리소스 낭비도 없고 성능에도 문제가 없지만, 고작 카운터 구현에 많고 복잡한 코드가 작성되고 말았습니다.

## Level 12: [Custom hook](https://ko.reactjs.org/docs/hooks-custom.html#using-a-custom-hook)
```javascript
// levels/useCounter.js
import { useState, useRef, useCallback } from 'react';

export default function useCounter(initialValue) {
  const [count, setCount] = useState(initialValue);
  const intervalRef = useRef(null);

  const start = useCallback(() => {
    if (intervalRef.current !== null) {
      return;
    }
    intervalRef.current = setInterval(() => {
      setCount(c => c + 1);
    }, 500);
  }, []);

  const stop = useCallback(() => {
    if (intervalRef.current === null) {
      return;
    }
    clearInterval(intervalRef.current);
    intervalRef.current = null;
  }, []);

  const reset = useCallback(() => {
    setCount(0);
  }, []);

  return { count, start, stop, reset };
}

```

```javascript
// levels/level12.js
import React from 'react';
import useCounter from './useCounter';

export default function Level12() {
  const { count, start, stop, reset } = useCounter(0);
  return (
    <div>
      count => {count}
      <button onClick={start}>start</button>
      <button onClick={stop}>stop</button>
      <button onClick={reset}>reset</button>
    </div>
  );
}
```
Custom hook을 통해서 코드를 정리했습니다. 이 카운터는 이제 재사용도 가능합니다.

## React Hooks Radar
### :white_check_mark: Green
Green hook들은 최신 React를 위한 메인 블록입니다. 큰 고민하고 사용하지 않아도 좋습니다.
* useReducer
* useState
* useContext

### :full_moon: Yellow
Yellow hook들은 `memoization`을 사용하여 유용한 성능 최적화를 제공합니다.  
다만, 라이프사이클과 입력은 주의해서 관리해야합니다.
* useCallback
* useMemo

### :red_circle: Red
Red hook들은 `Side effect`를 사용해 변수들과 상호작용합니다. 매우 강력하지만 그만큼 주의해서 사용해야합니다. `Custom Hooks`는 non-trivial한 케이스에 모두 권장됩니다.
* useRef
* useEffect
* useLayoutEffect

## React Hooks Checklist
1. [Hook 규칙](https://ko.reactjs.org/docs/hooks-rules.html)을 준수하세요.
2. 메인 렌더링 함수에서 직접 Side effect를 생성하지 마세요.
3. 사용했던 리소스는 모두 구독 취소, 삭제, 파기하세요.
4. 동일한 값을 읽고쓰는걸 막기 위해서는 `useState` 대신 `useReducer` 또는 `functional update`를 사용하세요.
5. 메인 랜더링 함수안에서 직접 변수를 사용하지말고 `useRef`를 사용하세요.
6. `uesRef`에서 사용한 값이 컴포넌트보다 짧은 라이프사이클을 가지기 때문에, 리소스를 파기할때 값을 해제하는것을 잊지마세요.
7. 무한재귀와 리소스 낭비에 주의하세요.
8. 성능향상이 필요한경우 함수나 객체를 `Memoize`하세요.
9. `dependency list`를 정확하게 작성하세요.
    * `undefiend` &rarr; 매 랜더링 마다
    * `[a, b]` &rarr; a 또는 b가 변경될 때
    * `[]` &rarr; 랜더링 이후 한 번만
10. non-trivial한 케이스에는 `Custom Hooks`를 사용하세요.

* * * 
## 출처
> 원글: https://medium.com/@sdolidze/the-iceberg-of-react-hooks-af0b588f43fb 