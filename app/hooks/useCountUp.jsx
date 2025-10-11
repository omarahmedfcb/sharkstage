import { useState, useEffect, useRef } from "react";

export function useCountUp(target, duration = 2000, inView) {
  const [count, setCount] = useState(0);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!inView) {
      console.log(inView);
      return;
    }
    // hasAnimated.current = true;

    let start = null;

    function animate(timestamp) {
      if (!start) start = timestamp;
      const progress = timestamp - start;
      const newNumber = Math.min(
        Math.floor((progress / duration) * target),
        target
      );
      setCount(newNumber);

      if (newNumber < target) requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);
  }, [target, duration, inView]);

  return count;
}
