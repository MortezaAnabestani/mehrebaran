"use client";

import { Canvas, useThree, useFrame } from "@react-three/fiber";
import { useLayoutEffect, useRef } from "react";
import { useTransform, useScroll, useTime } from "framer-motion";
import { degreesToRadians, mix } from "popmotion";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

function MyModel() {
  const { scene } = useGLTF("/models/myModel.glb");

  // تغییر رنگ همه متریال‌ها به سفید
  scene.traverse((child) => {
    if ((child as THREE.Mesh).isMesh) {
      const mesh = child as THREE.Mesh;
      if (Array.isArray(mesh.material)) {
        mesh.material.forEach((mat) => {
          if ((mat as any).color) {
            (mat as any).color = new THREE.Color("#ffffff");
          }
        });
      } else if ((mesh.material as any).color) {
        (mesh.material as any).color = new THREE.Color("#ffffff");
      }
    }
  });

  return <primitive object={scene} scale={1.5} />;
}

interface RainProps {
  count?: number;
}

function Rain({ count = 500 }: RainProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null!);
  const positions = useRef<Float32Array>(new Float32Array(count * 3));
  const speeds = useRef<Float32Array>(new Float32Array(count));

  useLayoutEffect(() => {
    // مقداردهی اولیه قطره‌ها
    for (let i = 0; i < count; i++) {
      positions.current[i * 3] = mix(-5, 5, Math.random()); // x
      positions.current[i * 3 + 1] = mix(-5, 5, Math.random()); // y
      positions.current[i * 3 + 2] = mix(-5, 5, Math.random()); // z
      speeds.current[i] = mix(0.05, 0.15, Math.random()); // سرعت سقوط
    }
  }, [count]);

  useFrame(() => {
    const dummy = new THREE.Object3D();
    for (let i = 0; i < count; i++) {
      positions.current[i * 3 + 1] -= speeds.current[i]; // حرکت به پایین
      if (positions.current[i * 3 + 1] < -5) {
        positions.current[i * 3 + 1] = 5; // برگشت به بالا
      }
      dummy.position.set(
        positions.current[i * 3],
        positions.current[i * 3 + 1],
        positions.current[i * 3 + 2]
      );
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <cylinderGeometry args={[0.01, 0.01, 0.3, 8]} />
      <meshBasicMaterial color="#88ccff" />
    </instancedMesh>
  );
}

interface SceneProps {
  rainCount?: number;
}

function Scene({ rainCount = 500 }: SceneProps) {
  const gl = useThree((state) => state.gl);
  const { scrollYProgress } = useScroll();
  const yAngle = useTransform(scrollYProgress, [0, 1], [0.001, degreesToRadians(180)]);
  const distance = useTransform(scrollYProgress, [0, 1], [10, 3]);
  const time = useTime();

  useFrame(({ camera }) => {
    camera.position.setFromSphericalCoords(distance.get(), yAngle.get(), time.get() * 0.0005);
    camera.updateProjectionMatrix();
    camera.lookAt(0, 0, 0);
  });

  useLayoutEffect(() => gl.setPixelRatio(0.3), [gl]);

  return (
    <>
      {/* نور */}
      <ambientLight intensity={3} />
      <pointLight position={[10, 10, 10]} intensity={3} />

      {/* مدل سه‌بعدی */}
      <MyModel />

      {/* باران */}
      <Rain count={rainCount} />
    </>
  );
}

export default function ThreeD() {
  return (
    <div className="container3D" style={{ height: "90vh" }}>
      <Canvas gl={{ antialias: false }}>
        <Scene rainCount={800} />
      </Canvas>
    </div>
  );
}
