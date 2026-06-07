"use client";
import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, MeshDistortMaterial, Float, useTexture } from "@react-three/drei";
import * as THREE from "three";
import { STATS } from "./AboutUs_Constants";

// --- کامپوننت ذرات باران (Matrix Rain Effect) ---
const Rain = ({ count = 1000 }) => {
  const mesh = useRef<THREE.Points>(null!);

  // ایجاد موقعیت‌های تصادفی برای قطرات باران
  const particlesPosition = useMemo(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20; // X
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20; // Y
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10 - 5; // Z (عقب‌تر از قطره اصلی)
    }
    return positions;
  }, [count]);

  useFrame((state, delta) => {
    if (!mesh.current) return;
    // حرکت قطرات به سمت پایین
    const positions = mesh.current.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < count; i++) {
      positions[i * 3 + 1] -= delta * 2 * (Math.random() * 0.5 + 0.5); // سرعت سقوط
      // اگر از پایین صفحه خارج شد، برگردد به بالا
      if (positions[i * 3 + 1] < -10) {
        positions[i * 3 + 1] = 10;
      }
    }
    mesh.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particlesPosition.length / 3}
          array={particlesPosition}
          itemSize={3}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          args={[particlesPosition, 3] as any}
        />
      </bufferGeometry>
      <pointsMaterial size={0.07} color="#a3d8f4" transparent opacity={0.6} sizeAttenuation />
    </points>
  );
};

// --- کامپوننت قطره آب مرکزی و محتوا ---
const WaterDroplet = () => {
  const envTexture = useTexture("/images/2.png");
  envTexture.mapping = THREE.EquirectangularReflectionMapping;

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <mesh>
        <sphereGeometry args={[1.7, 64, 64]} />
        <MeshDistortMaterial
          color="#8ecae6"
          envMap={envTexture}
          envMapIntensity={1}
          clearcoat={1}
          clearcoatRoughness={0}
          metalness={0.1}
          roughness={0}
          transmission={0.9}
          thickness={2}
          distort={0.3}
          speed={4}
        />
        {/* بقیه Html ها... */}
      </mesh>
    </Float>
  );
};
const AboutSection = () => {
  return (
    <div>
      <section className="h-[500px] md:h-[600px] w-full relative overflow-hidden" style={{ backgroundColor: "#4083C4" }}>
        <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
          {/* نورپردازی محیطی */}
          <ambientLight intensity={0.5} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
          <pointLight position={[-10, -10, -10]} intensity={0.5} color="#007acc" />

          {/* افکت باران پس‌زمینه */}
          <Rain count={1500} />

          {/* قطره مرکزی */}
          <WaterDroplet />

          {/* کنترل چرخش */}
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            autoRotate={true} // چرخش خودکار ملایم
            autoRotateSpeed={0.5}
          />
        </Canvas>

        {/* راهنمای تعامل */}
        <div className="absolute bottom-6 left-0 right-0 text-center pointer-events-none px-4 md:px-0">
          <p className="text-white/80 text-sm mb-4 max-w-2xl mx-auto drop-shadow-md">
            کانون مهرباران، بخشی از سازمان دانشجویان جهاد دانشگاهی خراسان رضوی است که با هدف ایجاد تحول مثبت
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {STATS.map((stat, idx) => (
              <div key={idx} className="text-center px-2">
                <span className="text-lg md:text-xl font-bold text-white ml-2 drop-shadow-sm">{stat.value}</span>
                <span className="text-white/80 text-sm md:text-base drop-shadow-sm">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutSection;
