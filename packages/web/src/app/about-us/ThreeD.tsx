"use client";

import { Canvas, useThree, useFrame } from "@react-three/fiber";
import { useLayoutEffect, useRef, useMemo } from "react";
import { useTransform, useScroll, useTime } from "framer-motion";
import { degreesToRadians, mix } from "popmotion";
import { useGLTF, MeshDistortMaterial, Sphere } from "@react-three/drei";
import * as THREE from "three";

function MyModel() {
  const { scene } = useGLTF("/models/myModel.glb");
  const modelRef = useRef<THREE.Group>(null!);

  // تغییر رنگ همه متریال‌ها با افکت درخشان
  useLayoutEffect(() => {
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        if (Array.isArray(mesh.material)) {
          mesh.material.forEach((mat) => {
            if (mat instanceof THREE.MeshStandardMaterial) {
              mat.color = new THREE.Color("#ffffff");
              mat.emissive = new THREE.Color("#4a90e2");
              mat.emissiveIntensity = 0.3;
              mat.metalness = 0.8;
              mat.roughness = 0.2;
            }
          });
        } else if (mesh.material instanceof THREE.MeshStandardMaterial) {
          mesh.material.color = new THREE.Color("#ffffff");
          mesh.material.emissive = new THREE.Color("#4a90e2");
          mesh.material.emissiveIntensity = 0.3;
          mesh.material.metalness = 0.8;
          mesh.material.roughness = 0.2;
        }
      }
    });
  }, [scene]);

  // انیمیشن چرخش ملایم
  useFrame((state) => {
    if (modelRef.current) {
      modelRef.current.rotation.y += 0.002;
      modelRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  return <primitive ref={modelRef} object={scene} scale={1.5} />;
}

// Particle System حرفه‌ای
interface ParticlesProps {
  count?: number;
}

function Particles({ count = 1000 }: ParticlesProps) {
  const meshRef = useRef<THREE.Points>(null!);

  const [positions, colors] = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      // Position
      positions[i * 3] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20;

      // Colors - gradient از آبی به سفید
      const colorChoice = Math.random();
      if (colorChoice > 0.7) {
        colors[i * 3] = 1; // R
        colors[i * 3 + 1] = 1; // G
        colors[i * 3 + 2] = 1; // B
      } else {
        colors[i * 3] = 0.29; // R
        colors[i * 3 + 1] = 0.56; // G
        colors[i * 3 + 2] = 0.89; // B
      }
    }

    return [positions, colors];
  }, [count]);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.05;
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.03;
    }
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={colors.length / 3}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        vertexColors
        transparent
        opacity={0.8}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// Glow Sphere در پس‌زمینه
function GlowSphere() {
  const sphereRef = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    if (sphereRef.current) {
      sphereRef.current.rotation.x = state.clock.elapsedTime * 0.1;
      sphereRef.current.rotation.z = state.clock.elapsedTime * 0.15;
    }
  });

  return (
    <Sphere ref={sphereRef} args={[2, 64, 64]} position={[0, 0, -5]}>
      <MeshDistortMaterial
        color="#4a90e2"
        attach="material"
        distort={0.4}
        speed={2}
        roughness={0}
        metalness={0.8}
        emissive="#2563eb"
        emissiveIntensity={0.5}
      />
    </Sphere>
  );
}

interface SceneProps {
  particleCount?: number;
}

function Scene({ particleCount = 1000 }: SceneProps) {
  const gl = useThree((state) => state.gl);
  const { scrollYProgress } = useScroll();
  const yAngle = useTransform(scrollYProgress, [0, 1], [0.001, degreesToRadians(180)]);
  const distance = useTransform(scrollYProgress, [0, 1], [10, 3]);
  const time = useTime();

  useFrame(({ camera }) => {
    camera.position.setFromSphericalCoords(distance.get(), yAngle.get(), time.get() * 0.0003);
    camera.updateProjectionMatrix();
    camera.lookAt(0, 0, 0);
  });

  useLayoutEffect(() => gl.setPixelRatio(Math.min(window.devicePixelRatio, 2)), [gl]);

  return (
    <>
      {/* Lighting Setup */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1.5} castShadow />
      <pointLight position={[-10, -10, -5]} intensity={0.5} color="#4a90e2" />
      <spotLight position={[0, 10, 0]} angle={0.3} penumbra={1} intensity={1} color="#60a5fa" />

      {/* Glow Sphere Background */}
      <GlowSphere />

      {/* Main 3D Model */}
      <MyModel />

      {/* Particle System */}
      <Particles count={particleCount} />

      {/* Fog for depth */}
      <fog attach="fog" args={["#1e3a8a", 5, 25]} />
    </>
  );
}

export default function ThreeD() {
  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [0, 0, 10], fov: 75 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance"
        }}
      >
        <Scene particleCount={800} />
      </Canvas>
    </div>
  );
}
