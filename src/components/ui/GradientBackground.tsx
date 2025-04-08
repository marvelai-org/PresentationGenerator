"use client";

import React from "react";

interface GradientBackgroundProps {
  className?: string;
}

export default function GradientBackground({
  className = "",
}: GradientBackgroundProps) {
  return (
    <div className={`fixed inset-0 z-[-1] overflow-hidden ${className}`}>
      {/* Soft gradient background base */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-900 to-black opacity-60" />

      {/* Abstract shapes */}
      <div className="absolute top-0 left-1/4 w-32 h-32 bg-primary/20 rounded-full filter blur-3xl opacity-20" />
      <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-indigo-500/20 rounded-full filter blur-3xl opacity-10" />
      <div className="absolute bottom-1/4 left-1/3 w-48 h-48 bg-blue-500/20 rounded-full filter blur-3xl opacity-15" />

      {/* Stars/dots effect */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.5 + 0.25,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${Math.random() * 10 + 10}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
