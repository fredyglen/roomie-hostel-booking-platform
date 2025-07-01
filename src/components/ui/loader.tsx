/**
 * Professional Loader Component
 * Apple-Level design with smooth, elegant animation
 *
 * @fileoverview Premium loading spinner with professional aesthetics
 * @author ROOMi Development Team
 * @version 2.0.0
 * @since 2025-06-21
 */

import { cn } from "@/lib/utils";

interface LoaderProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  variant?: "professional" | "minimal" | "elegant";
}

export function Loader({ size = "md", className, variant = "professional" }: LoaderProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
  };

  const strokeWidths = {
    sm: "2",
    md: "2.5",
    lg: "3",
  };

  const sizes = {
    sm: 16,
    md: 24,
    lg: 32,
  };

  if (variant === "professional") {
    return (
      <div className={cn("inline-flex items-center justify-center", className)}>
        <svg
          className={cn("animate-spin", sizeClasses[size])}
          width={sizes[size]}
          height={sizes[size]}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth={strokeWidths[size]}
            strokeLinecap="round"
            strokeDasharray="31.416"
            strokeDashoffset="31.416"
            opacity="0.2"
          />
          <circle
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth={strokeWidths[size]}
            strokeLinecap="round"
            strokeDasharray="31.416"
            strokeDashoffset="23.562"
            className="animate-spin"
            style={{
              transformOrigin: 'center',
              animation: 'spin 1.2s cubic-bezier(0.4, 0.0, 0.2, 1) infinite'
            }}
          />
        </svg>
      </div>
    );
  }

  if (variant === "elegant") {
    return (
      <div className={cn("inline-flex items-center justify-center", className)}>
        <div className={cn("relative", sizeClasses[size])}>
          <div className="absolute inset-0 rounded-full border-2 border-gray-200"></div>
          <div
            className="absolute inset-0 rounded-full border-2 border-transparent border-t-current animate-spin"
            style={{
              animation: 'spin 1s cubic-bezier(0.68, -0.55, 0.265, 1.55) infinite'
            }}
          ></div>
        </div>
      </div>
    );
  }

  // Minimal variant (fallback)
  return (
    <div
      className={cn(
        "animate-spin rounded-full border-2 border-transparent border-t-current",
        sizeClasses[size],
        className
      )}
      style={{
        animation: 'spin 1s linear infinite'
      }}
    />
  );
}