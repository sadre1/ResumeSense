import React, { useEffect, useState } from "react";

export default function useDimensions<T extends HTMLElement>(
  containerRef: React.RefObject<T | null>,
) {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const currentRef = containerRef.current;
    if (!currentRef) return;

    function getDimensions() {
      return {
        width: currentRef?.offsetWidth || 0,
        height: currentRef?.offsetHeight || 0,
      };
    }

    const resizeObserver = new ResizeObserver(() => {
      setDimensions(getDimensions());
    });

    resizeObserver.observe(currentRef);
    setDimensions(getDimensions());

    return () => {
      resizeObserver.unobserve(currentRef);
      resizeObserver.disconnect();
    };
  }, [containerRef]);

  return dimensions;
}
