"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

const NODE_POSITIONS: [number, number, number][] = [
  [0, 0, 0],
  [-2.2, 1.4, -1],
  [2.4, 0.8, -0.5],
  [-1.8, -1.6, 0.5],
  [2.0, -1.4, -1.2],
  [0.4, 2.2, -0.8],
  [-0.6, -2.2, -0.3],
];

const CONNECTIONS: [number, number][] = [
  [0, 1],
  [0, 2],
  [0, 3],
  [0, 4],
  [0, 5],
  [0, 6],
  [1, 5],
  [2, 4],
];

function Nodes() {
  const group = useRef<THREE.Group>(null);
  const { viewport } = useThree();
  const target = useRef({ x: 0, y: 0 });

  useFrame((state) => {
    const { pointer } = state;
    target.current.x = pointer.x * 0.3;
    target.current.y = pointer.y * 0.2;

    if (group.current) {
      group.current.rotation.y +=
        (target.current.x - group.current.rotation.y) * 0.03;
      group.current.rotation.x +=
        (-target.current.y - group.current.rotation.x) * 0.03;
      group.current.rotation.z += 0.0008;
    }
  });

  const lines = useMemo(() => {
    return CONNECTIONS.map(([a, b], i) => {
      const start = new THREE.Vector3(...NODE_POSITIONS[a]);
      const end = new THREE.Vector3(...NODE_POSITIONS[b]);
      const points = [start, end];
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      return <primitive key={i} object={new THREE.Line(geometry, new THREE.LineBasicMaterial({ color: "#212938", transparent: true, opacity: 0.6 }))} />;
    });
  }, []);

  return (
    <group ref={group} scale={Math.min(viewport.width, viewport.height) / 6}>
      {lines}
      {NODE_POSITIONS.map((pos, i) => (
        <mesh key={i} position={pos}>
          <sphereGeometry args={[i === 0 ? 0.14 : 0.09, 16, 16]} />
          <meshBasicMaterial
            color={i === 0 ? "#4c8bf5" : i % 2 === 0 ? "#7fe0a8" : "#f2a93b"}
          />
        </mesh>
      ))}
    </group>
  );
}

export default function NodeNetwork() {
  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 45 }}
      gl={{ antialias: true, alpha: true }}
      className="!absolute inset-0"
    >
      <Nodes />
    </Canvas>
  );
}