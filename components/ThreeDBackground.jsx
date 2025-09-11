"use client";

import { Suspense } from "react";
import dynamic from "next/dynamic";
import { SafeCanvas } from "@/components/WebGLManager";

// Dynamically import the 3D scene components
const Scene3D = dynamic(
  () => import("./Scene3D").then((mod) => ({ default: mod.default })),
  { 
    ssr: false,
    loading: () => null
  }
);

export default function ThreeDBackground() {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none three-js-container">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-orange-500/5 dark:from-blue-400/10 dark:to-orange-400/10"></div>
      <SafeCanvas
        camera={{ position: [0, 0, 5], fov: 60 }}
        style={{ 
          background: "transparent",
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%"
        }}
      >
        <Suspense fallback={null}>
          <Scene3D />
        </Suspense>
      </SafeCanvas>
    </div>
  );
}