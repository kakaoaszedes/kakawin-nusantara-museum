import { motion, type HTMLMotionProps } from "motion/react";
import { type ReactNode } from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ButtonProps extends HTMLMotionProps<"button"> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
}

export function Button({ 
  children, 
  variant = "primary", 
  size = "md", 
  className, 
  ...props 
}: ButtonProps) {
  const baseStyles = "inline-flex items-center justify-center rounded-md font-medium transition-all duration-300 focus:outline-none disabled:opacity-50 disabled:pointer-events-none";
  
  const variants = {
    primary: "bg-gold-elegant text-matte-black hover:bg-opacity-90 shadow-[0_0_15px_rgba(212,175,55,0.3)]",
    secondary: "bg-dark-brown text-cream hover:bg-opacity-90",
    outline: "border-2 border-gold-elegant text-gold-elegant hover:bg-gold-elegant hover:text-matte-black",
    ghost: "text-cream hover:bg-white/10"
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg"
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </motion.button>
  );
}
