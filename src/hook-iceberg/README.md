# The Iceberg of React Hooks

## 소개
React Hooks트 클래스 컴포넌트와 다르게 기본적인 코드만으로 어플리케이션에 필요한 요소 구성, 코드의 재사용 등을 간단하게 이뤄냅니다.

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

```
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
useState를 이용해서 구현된 간단한 카운터입니다.   
각 버튼을 이용해 count를 올리거나, 내릴 수 있습니다.

## Level 01: setInterval

```
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

함수형 컴포넌트 내에서 이러한 코드의 작성은 허용되지않습니다.



* * * 
## 출처
> 원글: https://medium.com/@sdolidze/the-iceberg-of-react-hooks-af0b588f43fb  표