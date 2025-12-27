import { useRef, useMemo, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Html, MeshDistortMaterial, Float, Environment } from "@react-three/drei";
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
          args={[particlesPosition, 3] as any}
        />
      </bufferGeometry>
      <pointsMaterial size={0.07} color="#a3d8f4" transparent opacity={0.6} sizeAttenuation />
    </points>
  );
};

// --- کامپوننت قطره آب مرکزی و محتوا ---
const WaterDroplet = () => {
  const [hovered, setHover] = useState(false);

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <mesh onPointerOver={() => setHover(true)} onPointerOut={() => setHover(false)}>
        {/* هندسه قطره (کره) */}
        <sphereGeometry args={[1.7, 64, 64]} />

        {/* متریال شیشه‌ای/آبی برای شبیه‌سازی آب */}
        <MeshDistortMaterial
          color="#8ecae6"
          envMapIntensity={1}
          clearcoat={1}
          clearcoatRoughness={0}
          metalness={0.1}
          roughness={0}
          transmission={0.9} // شفافیت شیشه‌ای
          thickness={2} // ضخامت شکست نور
          distort={0.3} // اعوجاج برای طبیعی‌تر شدن قطره
          speed={4}
        />

        {/* --- محتوای متنی روی قطره (چرخش با قطره) --- */}

        {/* عنوان اصلی (روبرو) */}
        <Html position={[0, 0.5, 2.5]} center transform sprite>
          <div className="text-center pointer-events-none select-none w-64">
            <h2 className="text-3xl font-bold text-white drop-shadow-md mb-2">کانون مهرباران</h2>
            <p className="text-sm text-white/90 bg-black/20 p-2 rounded-lg backdrop-blur-sm">
              برای دیدن آمار، قطره را بچرخانید
            </p>
          </div>
        </Html>

        {/* گزینه‌ها/آمار در اطراف قطره پخش شده‌اند */}
        {STATS.map((stat, idx) => {
          // محاسبه موقعیت دایره‌ای برای هر آیتم
          const angle = (idx / STATS.length) * Math.PI * 2;
          const radius = 2.6;
          const x = Math.sin(angle) * radius;
          const z = Math.cos(angle) * radius;

          return (
            <Html key={idx} position={[x, 0, z]} transform sprite>
              <div className="bg-white/90 backdrop-blur-md p-4 rounded-xl shadow-xl border-2 border-blue-300 w-40 text-center transform transition-transform hover:scale-110 cursor-pointer">
                <div className="text-3xl font-bold text-[#007acc] mb-1">{stat.value}</div>
                <div className="text-xs font-bold text-gray-600">{stat.label}</div>
              </div>
            </Html>
          );
        })}
      </mesh>
    </Float>
  );
};

const AboutSection = () => {
  return (
    <div>
      <section className="h-[600px]  w-full relative overflow-hidden" style={{ backgroundColor: "#4083C4" }}>
        <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
          {/* نورپردازی محیطی */}
          <ambientLight intensity={0.5} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
          <pointLight position={[-10, -10, -10]} intensity={0.5} color="#007acc" />

          {/* محیط برای بازتاب روی قطره */}
          <Environment preset="night" />

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
        <div className="absolute bottom-4 left-0 right-0 text-center pointer-events-none">
          <p className="text-white/50 text-sm mb-3">
            کانون مهرباران، بخشی از سازمان دانشجویان جهاد دانشگاهی خراسان رضوی است که با هدف ایجاد تحول
            مثبت...
          </p>
          {STATS.map((stat, idx) => (
            <p key={idx} className="text-center inline-block pr-6">
              <span className="text-xl font-bold text-white/50 ml-1">{stat.value}</span>
              <span className="text-white/50">{stat.label}</span>
            </p>
          ))}
        </div>
      </section>
    </div>
  );
};

export default AboutSection;
