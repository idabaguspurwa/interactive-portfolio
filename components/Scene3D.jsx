"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import {
  Float,
  Environment,
  Sparkles,
} from "@react-three/drei";
import { useTheme } from "@/components/ThemeProvider";

function CreativeDataSphere() {
  const groupRef = useRef();
  const sphereRef = useRef();
  const { theme } = useTheme();

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.2;
      groupRef.current.position.y =
        Math.sin(state.clock.elapsedTime * 0.5) * 0.3;
    }
    if (sphereRef.current) {
      sphereRef.current.rotation.x += delta * 0.1;
      sphereRef.current.rotation.z += delta * 0.05;
    }
  });

  return (
    <group ref={groupRef} position={[3, 0, -1]}>
      {/* Main data sphere */}
      <Float speed={1.2} rotationIntensity={0.3} floatIntensity={0.4}>
        <mesh ref={sphereRef}>
          <icosahedronGeometry args={[1.5, 2]} />
          <meshStandardMaterial
            color={theme === "dark" ? "#50A6FF" : "#4B7BEC"}
            wireframe={true}
            transparent={true}
            opacity={0.7}
          />
        </mesh>
      </Float>

      {/* Orbiting data nodes */}
      {Array.from({ length: 8 }, (_, i) => (
        <Float
          key={i}
          speed={0.8 + i * 0.1}
          rotationIntensity={0.2}
          floatIntensity={0.3}
        >
          <mesh
            position={[
              Math.cos((i / 8) * Math.PI * 2) * 2.5,
              Math.sin((i / 8) * Math.PI * 2) * 0.5,
              Math.sin((i / 8) * Math.PI * 2) * 2.5,
            ]}
          >
            <boxGeometry args={[0.2, 0.2, 0.2]} />
            <meshStandardMaterial
              color={theme === "dark" ? "#FF8A5C" : "#FF6F61"}
              emissive={theme === "dark" ? "#FF8A5C" : "#FF6F61"}
              emissiveIntensity={0.2}
            />
          </mesh>
        </Float>
      ))}

      {/* Connecting particles */}
      <Sparkles
        count={20}
        scale={6}
        size={2}
        speed={0.4}
        color={theme === "dark" ? "#50A6FF" : "#4B7BEC"}
        opacity={0.4}
      />
    </group>
  );
}

function DataVisualization3D() {
  const groupRef = useRef();
  const { theme } = useTheme();

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.05;
    }
  });

  const dataPoints = Array.from({ length: 20 }, (_, i) => ({
    position: [
      (Math.random() - 0.5) * 6,
      (Math.random() - 0.5) * 4,
      (Math.random() - 0.5) * 6,
    ],
    scale: Math.random() * 0.5 + 0.2,
    delay: i * 0.1,
  }));

  return (
    <group ref={groupRef} position={[0, 0, -2]}>
      {dataPoints.map((point, i) => (
        <mesh key={i} position={point.position} scale={point.scale}>
          <boxGeometry args={[0.3, 0.3, 0.3]} />
          <meshStandardMaterial
            color={theme === "dark" ? "#50A6FF" : "#4B7BEC"}
            transparent={true}
            opacity={0.7}
            emissive={theme === "dark" ? "#1a365d" : "#2d5aa0"}
            emissiveIntensity={0.2}
          />
        </mesh>
      ))}

      {/* Connecting lines effect */}
      <Sparkles
        count={15}
        scale={8}
        size={1}
        speed={0.1}
        color={theme === "dark" ? "#FF8A5C" : "#FF6F61"}
        opacity={0.3}
      />
    </group>
  );
}

export default function Scene3D() {
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 10, 5]} intensity={0.6} />
      <pointLight
        position={[-10, -10, -5]}
        intensity={0.3}
        color="#4B7BEC"
      />
      <Environment preset="dawn" background={false} />
      <CreativeDataSphere />
      <DataVisualization3D />
    </>
  );
}

// Also export as named export to ensure compatibility
export { Scene3D };