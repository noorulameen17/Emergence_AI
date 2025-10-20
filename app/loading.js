"use client";

import { Treadmill } from "ldrs/react";
import "ldrs/react/Treadmill.css";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-background/80 backdrop-blur-sm">
      <Treadmill size="70" speed="1.25" color="black" />
    </div>
  );
}
