"use client";

import { Canvas, useThree, useFrame } from "@react-three/fiber";
import { useLayoutEffect, useRef } from "react";
import { useScroll, useMotionValue, useSpring } from "framer-motion";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

function MehrebaranLogo() {
  const { scene } = useGLTF("/models/myModel.glb");
  const modelRef = useRef<THREE.Group>(null!);

  // تغییر رنگ به سفید درخشان
  useLayoutEffect(() => {
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        if (Array.isArray(mesh.material)) {
          mesh.material.forEach((mat) => {
            if (mat instanceof THREE.MeshStandardMaterial) {
              mat.color = new THREE.Color("#ffffff");
              mat.metalness = 0.3;
              mat.roughness = 0.4;
            }
          });
        } else if (mesh.material instanceof THREE.MeshStandardMaterial) {
          mesh.material.color = new THREE.Color("#ffffff");
          mesh.material.metalness = 0.3;
          mesh.material.roughness = 0.4;
        }
      }
    });
  }, [scene]);

  return <primitive ref={modelRef} object={scene} scale={2} />;
}

// باران با کیفیت بهتر
interface RainProps {
  count?: number;
}

function Rain({ count = 1000 }: RainProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null!);
  const positions = useRef<Float32Array>(new Float32Array(count * 3));
  const speeds = useRef<Float32Array>(new Float32Array(count));

  useLayoutEffect(() => {
    for (let i = 0; i < count; i++) {
      positions.current[i * 3] = (Math.random() - 0.5) * 20; // x
      positions.current[i * 3 + 1] = Math.random() * 20 - 10; // y
      positions.current[i * 3 + 2] = (Math.random() - 0.5) * 20; // z
      speeds.current[i] = 0.08 + Math.random() * 0.12; // سرعت متنوع
    }
  }, [count]);

  useFrame(() => {
    const dummy = new THREE.Object3D();
    for (let i = 0; i < count; i++) {
      positions.current[i * 3 + 1] -= speeds.current[i];

      if (positions.current[i * 3 + 1] < -10) {
        positions.current[i * 3 + 1] = 10;
        positions.current[i * 3] = (Math.random() - 0.5) * 20;
        positions.current[i * 3 + 2] = (Math.random() - 0.5) * 20;
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
      <cylinderGeometry args={[0.015, 0.015, 0.4, 8]} />
      <meshStandardMaterial color="#4a9eff" transparent opacity={0.3} metalness={0.2} roughness={0.1} />
    </instancedMesh>
  );
}

interface SceneProps {
  rainCount?: number;
  mouseX: any;
  mouseY: any;
}

function Scene({ rainCount = 1000, mouseX, mouseY }: SceneProps) {
  const gl = useThree((state) => state.gl);
  const { scrollYProgress } = useScroll();

  useFrame(({ camera }) => {
    // حرکت دوربین با موس - ملایم‌تر
    const targetX = mouseX.get() * 2;
    const targetY = mouseY.get() * 2;

    camera.position.x += (targetX - camera.position.x) * 0.05;
    camera.position.y += (targetY - camera.position.y) * 0.05;

    // فاصله دوربین با scroll
    const scrollDistance = 8 + scrollYProgress.get() * 2;
    camera.position.z += (scrollDistance - camera.position.z) * 0.05;

    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();
  });

  useLayoutEffect(() => {
    gl.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }, [gl]);

  return (
    <>
      {/* نورپردازی ساده و طبیعی */}
      <ambientLight intensity={1.2} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <directionalLight position={[-5, -5, -5]} intensity={0.5} />

      {/* لوگو مهرباران */}
      <MehrebaranLogo />

      {/* باران */}
      <Rain count={rainCount} />

      {/* مه برای عمق */}
      <fog attach="fog" args={["##ffffff", 4, 15]} />
    </>
  );
}

export default function ThreeD() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 20, stiffness: 100 };
  const smoothMouseX = useSpring(mouseX, springConfig);
  const smoothMouseY = useSpring(mouseY, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { clientX, clientY, currentTarget } = e;
    const { width, height } = currentTarget.getBoundingClientRect();

    mouseX.set((clientX / width - 0.5) * 2);
    mouseY.set(-(clientY / height - 0.5) * 2);
  };

  return (
    <div className="w-full h-full cursor-grab active:cursor-grabbing" onMouseMove={handleMouseMove}>
      <Canvas
        camera={{ position: [0, 0, 8], fov: 50 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
      >
        <Scene rainCount={1000} mouseX={smoothMouseX} mouseY={smoothMouseY} />
      </Canvas>
    </div>
  );
}
