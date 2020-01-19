import React, { useState } from "react";
import { Count } from "../presentational/Count";

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
