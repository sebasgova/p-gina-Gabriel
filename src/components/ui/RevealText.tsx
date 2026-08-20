"use client";

import { motion, type Variants } from "framer-motion";
import { cn } from "@/lib/utils";

type RevealTextProps = {
  text: string;
  as?: "h1" | "h2" | "h3" | "p" | "span";
  className?: string;
  wordClassName?: string;
  delay?: number;
  stagger?: number;
  once?: boolean;
};

const wordVariants: Variants = {
  hidden: { y: "110%", opacity: 0, filter: "blur(6px)" },
  visible: {
    y: "0%",
    opacity: 1,
    filter: "blur(0px)",
    transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] },
  },
};

export function RevealText({
  text,
  as: Tag = "span",
  className,
  wordClassName,
  delay = 0,
  stagger = 0.045,
  once = true,
}: RevealTextProps) {
  const words = text.split(" ");

  return (
    <Tag className={cn("flex flex-wrap", className)}>
      <motion.span
        className="flex flex-wrap"
        initial="hidden"
        whileInView="visible"
        viewport={{ once, amount: 0.4 }}
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: stagger, delayChildren: delay } },
        }}
      >
        {words.map((word, i) => (
          <span key={`${word}-${i}`} className="mr-[0.28em] overflow-hidden pb-[0.14em]">
            <motion.span
              className={cn("inline-block will-change-transform", wordClassName)}
              variants={wordVariants}
            >
              {word}
            </motion.span>
          </span>
        ))}
      </motion.span>
    </Tag>
  );
}
