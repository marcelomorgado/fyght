import React, { useState } from "react";

type Props = {
  count: number;
};

export const Count = ({ count }: Props) => <h1>{count}</h1>;

export const Counter = () => {
  const [count, setCount] = useState(0);

  return (
    <div>
      <Count count={count} />
      <button onClick={() => setCount(count + 1)}>Increment</button>
      <button onClick={() => setCount(count - 1)}>Decrement</button>
    </div>
  );
};

export default Counter;
