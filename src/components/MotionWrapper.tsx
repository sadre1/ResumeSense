"use client";

import { motion } from "framer-motion";

export default function MotionWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <motion.div
      whileHover={{ x: [-2, 2, -2, 2, 0] }}
      transition={{ duration: 0.4 }}
    >
      {children}
    </motion.div>
  );
}
