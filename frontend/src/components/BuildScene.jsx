import { useRef } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, RoundedBox, Edges, ContactShadows, Environment } from '@react-three/drei';

// Animates a group's scale toward 1 (visible) or 0 (hidden) each frame,
// so parts smoothly grow into place instead of popping in.
function Part({ visible, position, children }) {
  const ref = useRef();
  useFrame((_, delta) => {
    if (!ref.current) return;
    const target = visible ? 1 : 0;
    const next = ref.current.scale.x + (target - ref.current.scale.x) * Math.min(delta * 6, 1);
    ref.current.scale.set(next, next, next);
  });
  return (
    <group ref={ref} position={position} scale={0}>
      {children}
    </group>
  );
}

function Matte({ color, roughness = 0.5, metalness = 0.15 }) {
  return <meshStandardMaterial color={color} roughness={roughness} metalness={metalness} />;
}

function Metal({ color, roughness = 0.2, metalness = 0.8 }) {
  return <meshStandardMaterial color={color} roughness={roughness} metalness={metalness} />;
}

// CPU: graphite/charcoal substrate (distinct from the green motherboard) with
// gold contact pins around the edge and a brushed-metal integrated heat spreader on top.
function Cpu() {
  const pinPositions = [];
  const count = 8;
  for (let i = 0; i < count; i++) {
    const t = i / (count - 1);
    const edgeOffset = -0.24 + t * 0.48;
    pinPositions.push([edgeOffset, -0.24]);
    pinPositions.push([edgeOffset, 0.24]);
  }

  return (
    <group>
      <RoundedBox args={[0.55, 0.55, 0.05]} radius={0.02} smoothness={4}>
        <Matte color="#1c1c1f" roughness={0.55} metalness={0.2} />
      </RoundedBox>
      {pinPositions.map(([x, y]) => (
        <mesh key={`${x}-${y}`} position={[x, y, 0.026]}>
          <cylinderGeometry args={[0.012, 0.012, 0.008, 8]} />
          <Metal color="#d4af37" roughness={0.3} metalness={0.8} />
        </mesh>
      ))}
      <RoundedBox args={[0.32, 0.32, 0.05]} radius={0.015} smoothness={4} position={[0, 0, 0.05]}>
        <Metal color="#e2e5e8" roughness={0.25} metalness={0.65} />
      </RoundedBox>
    </group>
  );
}

function Ram() {
  const chipOffsets = [-0.28, 0, 0.28];
  return (
    <group>
      {[-0.11, 0.11].map((x) => (
        <group key={x} position={[x, 0, 0]}>
          <mesh>
            <boxGeometry args={[0.11, 1.05, 0.14]} />
            <Metal color="#71717a" roughness={0.3} metalness={0.6} />
          </mesh>
          <mesh position={[0, 0, 0.071]}>
            <boxGeometry args={[0.085, 0.78, 0.001]} />
            <Matte color="#f4f4f5" roughness={0.75} metalness={0} />
          </mesh>
          {chipOffsets.map((y) => (
            <mesh key={y} position={[0, y, 0.076]}>
              <boxGeometry args={[0.06, 0.095, 0.007]} />
              <Matte color="#18181b" roughness={0.5} metalness={0.2} />
            </mesh>
          ))}
          {/* Gold connector edge */}
          <mesh position={[0, -0.55, 0]}>
            <boxGeometry args={[0.11, 0.07, 0.12]} />
            <Metal color="#d4af37" roughness={0.25} metalness={0.8} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function Gpu() {
  const fanX = [-0.55, 0.05, 0.6];
  return (
    <group>
      <RoundedBox args={[1.9, 0.42, 0.65]} radius={0.04} smoothness={4}>
        <Matte color="#27272a" roughness={0.4} metalness={0.3} />
      </RoundedBox>
      {fanX.map((x) => (
        <group key={x} position={[x, 0.24, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <mesh>
            <torusGeometry args={[0.16, 0.028, 8, 24]} />
            <Metal color="#a1a1aa" roughness={0.25} metalness={0.6} />
          </mesh>
          <mesh>
            <circleGeometry args={[0.13, 24]} />
            <Matte color="#18181b" roughness={0.6} metalness={0.15} />
          </mesh>
        </group>
      ))}
      <mesh position={[0, 0, -0.33]}>
        <boxGeometry args={[1.85, 0.4, 0.02]} />
        <Metal color="#3f3f46" roughness={0.35} metalness={0.5} />
      </mesh>
      {/* Exposed heatsink fins at one end */}
      {[...Array(6)].map((_, i) => (
        <mesh key={i} position={[0.95 + i * 0.015, 0, 0]}>
          <boxGeometry args={[0.008, 0.38, 0.6]} />
          <Metal color="#a1a1aa" roughness={0.3} metalness={0.6} />
        </mesh>
      ))}
      {/* PCIe power connector */}
      <mesh position={[-0.25, 0.23, -0.28]}>
        <boxGeometry args={[0.22, 0.1, 0.12]} />
        <Matte color="#0a0a0a" roughness={0.6} metalness={0.2} />
      </mesh>
      <mesh position={[0, -0.19, 0.331]}>
        <boxGeometry args={[1.85, 0.03, 0.001]} />
        <meshStandardMaterial color="#3b82f6" emissive="#3b82f6" emissiveIntensity={0.6} />
      </mesh>
    </group>
  );
}

function Storage() {
  return (
    <group>
      <RoundedBox args={[0.75, 0.26, 0.045]} radius={0.014} smoothness={4}>
        <Matte color="#4c1d95" roughness={0.5} metalness={0.15} />
      </RoundedBox>
      {/* Controller chip */}
      <RoundedBox args={[0.19, 0.14, 0.03]} radius={0.005} smoothness={4} position={[-0.16, 0, 0.038]}>
        <Matte color="#18181b" roughness={0.45} metalness={0.3} />
      </RoundedBox>
      {/* NAND flash chip */}
      <RoundedBox args={[0.27, 0.16, 0.03]} radius={0.005} smoothness={4} position={[0.16, 0, 0.038]}>
        <Matte color="#27272a" roughness={0.45} metalness={0.3} />
      </RoundedBox>
      {/* Gold M.2 connector edge */}
      <mesh position={[-0.39, 0, 0]}>
        <boxGeometry args={[0.04, 0.19, 0.04]} />
        <Metal color="#d4af37" roughness={0.25} metalness={0.8} />
      </mesh>
      {/* Screw hole at the far end */}
      <mesh position={[0.34, 0, 0.03]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 0.012, 10]} />
        <Matte color="#000000" roughness={0.8} />
      </mesh>
    </group>
  );
}

function Psu() {
  const vents = [];
  for (let x = -2; x <= 2; x++) {
    for (let y = -1; y <= 1; y++) {
      vents.push([x * 0.16, y * 0.16]);
    }
  }
  const cablePorts = [-0.24, -0.08, 0.08, 0.24];
  return (
    <group>
      <RoundedBox args={[0.9, 0.6, 0.9]} radius={0.03} smoothness={4}>
        <Matte color="#27272a" roughness={0.45} metalness={0.3} />
      </RoundedBox>
      <group position={[0, 0, 0.455]}>
        {vents.map(([x, y]) => (
          <mesh key={`${x}-${y}`} position={[x, y, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.045, 0.045, 0.02, 12]} />
            <Matte color="#09090b" roughness={0.85} metalness={0} />
          </mesh>
        ))}
      </group>
      {/* Top fan */}
      <Fan radius={0.22} position={[0, 0.31, 0]} rotation={[-Math.PI / 2, 0, 0]} />
      {/* Modular cable ports on the back */}
      <group position={[0, -0.15, -0.455]}>
        {cablePorts.map((x) => (
          <mesh key={x} position={[x, 0, 0]}>
            <boxGeometry args={[0.09, 0.05, 0.01]} />
            <Matte color="#000000" roughness={0.8} />
          </mesh>
        ))}
      </group>
      {/* Power switch */}
      <mesh position={[-0.35, 0.15, -0.455]}>
        <boxGeometry args={[0.12, 0.08, 0.01]} />
        <Matte color="#000000" roughness={0.7} />
      </mesh>
      {/* AC power socket */}
      <mesh position={[0.3, 0.15, -0.455]}>
        <boxGeometry args={[0.14, 0.1, 0.01]} />
        <Matte color="#09090b" roughness={0.8} />
      </mesh>
    </group>
  );
}

// Motherboard: green PCB with a CPU socket outline, RAM slot marks, a PCIe slot,
// a chipset heatsink, VRM heatsinks near the socket, and small capacitors.
function Motherboard() {
  const standoffs = [
    [-1.05, 1.1],
    [1.05, 1.1],
    [-1.05, -1.1],
    [1.05, -1.1],
  ];

  const capacitorAngles = [0, 60, 120, 180, 240, 300];

  return (
    <group>
      <RoundedBox args={[2.6, 2.6, 0.05]} radius={0.02} smoothness={4}>
        <Matte color="#166534" roughness={0.6} metalness={0.05} />
      </RoundedBox>

      {standoffs.map(([x, y]) => (
        <mesh key={`${x}-${y}`} position={[x, y, 0.026]}>
          <cylinderGeometry args={[0.03, 0.03, 0.02, 12]} />
          <Metal color="#d4af37" roughness={0.25} metalness={0.75} />
        </mesh>
      ))}

      {/* CPU socket outline */}
      <mesh position={[0, 0.45, 0.026]}>
        <ringGeometry args={[0.3, 0.33, 32]} />
        <meshStandardMaterial color="#0a0a0a" roughness={0.6} metalness={0.2} />
      </mesh>

      {/* Capacitors ringed around the socket */}
      {capacitorAngles.map((deg) => {
        const rad = (deg * Math.PI) / 180;
        const x = Math.cos(rad) * 0.42;
        const y = 0.45 + Math.sin(rad) * 0.42;
        return (
          <mesh key={deg} position={[x, y, 0.036]}>
            <cylinderGeometry args={[0.025, 0.025, 0.02, 10]} />
            <Metal color="#c0c0c0" roughness={0.3} metalness={0.7} />
          </mesh>
        );
      })}

      {/* VRM heatsinks flanking the socket */}
      {[-0.55, 0.55].map((x) => (
        <mesh key={x} position={[x, 0.8, 0.04]}>
          <boxGeometry args={[0.18, 0.5, 0.03]} />
          <Metal color="#71717a" roughness={0.3} metalness={0.6} />
        </mesh>
      ))}

      {/* RAM slot marks */}
      {[0.76, 0.94].map((x) => (
        <mesh key={x} position={[x, 0.45, 0.028]}>
          <boxGeometry args={[0.05, 1, 0.006]} />
          <Matte color="#0a0a0a" roughness={0.7} metalness={0.1} />
        </mesh>
      ))}

      {/* PCIe slot for the GPU */}
      <mesh position={[0, -0.55, 0.028]}>
        <boxGeometry args={[1.5, 0.08, 0.008]} />
        <Matte color="#18181b" roughness={0.6} metalness={0.2} />
      </mesh>

      {/* Chipset heatsink */}
      <mesh position={[0, -1, 0.04]}>
        <boxGeometry args={[0.4, 0.3, 0.04]} />
        <Metal color="#52525b" roughness={0.3} metalness={0.55} />
      </mesh>
    </group>
  );
}

function Fan({ radius = 0.35, position, rotation = [0, 0, 0] }) {
  const blades = 7;
  return (
    <group position={position} rotation={rotation}>
      <mesh>
        <torusGeometry args={[radius, 0.02, 8, 32]} />
        <Matte color="#3f3f46" roughness={0.5} metalness={0.2} />
      </mesh>
      {[...Array(blades)].map((_, i) => (
        <mesh key={i} rotation={[0, 0, (i / blades) * Math.PI * 2]}>
          <boxGeometry args={[radius * 0.85, radius * 0.16, 0.01]} />
          <Matte color="#52525b" roughness={0.45} metalness={0.25} />
        </mesh>
      ))}
      <mesh>
        <circleGeometry args={[radius * 0.16, 16]} />
        <Matte color="#18181b" roughness={0.6} metalness={0.1} />
      </mesh>
    </group>
  );
}

function TopVents() {
  const slots = [-0.9, -0.6, -0.3, 0, 0.3, 0.6, 0.9];
  return (
    <group position={[0, 1.58, 0]}>
      {slots.map((z) => (
        <mesh key={z} position={[0, 0, z]}>
          <boxGeometry args={[2.6, 0.02, 0.08]} />
          <Matte color="#3f3f46" roughness={0.6} metalness={0.2} />
        </mesh>
      ))}
    </group>
  );
}

function CaseShell() {
  return (
    <group>
      <mesh>
        <boxGeometry args={[3.4, 3.2, 2.2]} />
        <meshBasicMaterial transparent opacity={0} />
        <Edges color="#71717a" linewidth={1.2} />
      </mesh>

      <mesh position={[1.7, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[2.2, 3.2]} />
        <meshPhysicalMaterial color="#38bdf8" transparent opacity={0.05} roughness={0.1} side={THREE.DoubleSide} />
      </mesh>

      {/* Rear exhaust fan */}
      <Fan radius={0.28} position={[0.2, 0.6, -1.09]} />
      {/* Top exhaust vents */}
      <TopVents />

      <mesh position={[-1.68, 1.4, 0.5]}>
        <sphereGeometry args={[0.03, 12, 12]} />
        <meshStandardMaterial color="#3b82f6" emissive="#3b82f6" emissiveIntensity={1.4} />
      </mesh>
    </group>
  );
}

function Scene({ selected }) {
  const has = (key) => Boolean(selected[key]);
  const groupRef = useRef();

  useFrame((_, delta) => {
    if (groupRef.current) groupRef.current.rotation.y += delta * 0.12;
  });

  return (
    <group ref={groupRef}>
      <Part visible={has('case')} position={[0, 0, 0]}>
        <CaseShell />
      </Part>
      <Part visible={has('motherboard')} position={[0, 0, -0.95]}>
        <Motherboard />
      </Part>
      <Part visible={has('cpu')} position={[0, 0.45, -0.85]}>
        <Cpu />
      </Part>
      <Part visible={has('ram')} position={[0.85, 0.45, -0.85]}>
        <Ram />
      </Part>
      <Part visible={has('gpu')} position={[0, -0.55, -0.35]}>
        <Gpu />
      </Part>
      <Part visible={has('storage')} position={[-1.25, -1.2, -0.9]}>
        <Storage />
      </Part>
      <Part visible={has('psu')} position={[1.25, -1.25, 0.35]}>
        <Psu />
      </Part>
    </group>
  );
}

export default function BuildScene({ selected }) {
  return (
    <Canvas camera={{ position: [3.6, 2.4, 5], fov: 42 }} shadows>
      <color attach="background" args={['#fafafa']} />
      <hemisphereLight intensity={0.7} groundColor="#e5e5e5" />
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 6, 5]} intensity={1.2} castShadow />
      <directionalLight position={[-4, 2, -3]} intensity={0.4} />
      <pointLight position={[-3, -2, 3]} intensity={0.3} color="#3b82f6" />
      <Environment preset="city" environmentIntensity={0.5} />

      <Scene selected={selected} />
      <ContactShadows position={[0, -1.8, 0]} opacity={0.3} scale={8} blur={2.5} far={4} color="#000000" />

      <OrbitControls enablePan={false} minDistance={2.2} maxDistance={8} enableDamping dampingFactor={0.08} />
    </Canvas>
  );
}
