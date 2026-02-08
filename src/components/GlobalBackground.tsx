"use client";

import FloatingLines from "@/components/react-bits/FloatingLines";

export default function GlobalBackground() {
  return (
    <div className="fixed inset-0 -z-10 pointer-events-none">
      <FloatingLines
        enabledWaves={["top", "middle", "bottom"]}
        lineCount={5}
        lineDistance={5}
        bendRadius={5}
        bendStrength={-0.5}
        interactive
        parallax
      />
    </div>
  );
}
