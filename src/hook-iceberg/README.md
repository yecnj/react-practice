# The Iceberg of React Hooks

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

함수형 컴포넌트 자체에서는 뮤테이션, 구독, 타이머, 로깅 및 기타 Side effect가 허용되지 않습니다([UseEffect](https://reactjs.org/docs/hooks-reference.html#useeffect, "useeffect link"))

## Level 02: [UseEffect](https://reactjs.org/docs/hooks-reference.html#useeffect, "useeffect link")
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
대부분의 Side effect는 [UseEffect](https://reactjs.org/docs/hooks-reference.html#useeffect, "useeffect link") 내에서 행해집니다. 하지만 이 코드도 랜더링이 발생할 때마다 새로운 인터벌이 작성되고, 결과적으로 리소스 낭비가 일어납니다.


## Level 03: run only once ([Timing of Effect](https://reactjs.org/docs/hooks-reference.html#timing-of-effects))
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


## Level 04: cleanup ([Cleaning up an effect](https://reactjs.org/docs/hooks-reference.html#cleaning-up-an-effect))
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

## Level 05: use `count` as dependency ([Contditionally firing an effect](https://reactjs.org/docs/hooks-reference.html#conditionally-firing-an-effect))
 

```javascript
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

## Level 07: [functional update](https://reactjs.org/docs/hooks-reference.html#functional-updates) for useState
```javascript
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
앞서 작성된 `Level 3, 4`에서 위의 Warning이 나타나는데요. 각각 `Level 6, 7`에 해당되는 
내용입니다.

1. count를 DependencyList에 추가하거나 DependencyList를 제거하세요.
2. setCount에서만 count를 사용할 경우 functioinal update를 사용하세요.



* * * 
## 출처
> 원글: https://medium.com/@sdolidze/the-iceberg-of-react-hooks-af0b588f43fb 