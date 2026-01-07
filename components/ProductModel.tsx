
import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh, Group, Color } from 'three';

interface ProductModelProps {
  type: string;
}

const ProductModel: React.FC<ProductModelProps> = ({ type }) => {
  const groupRef = useRef<Group>(null);

  // Subtle rotation animation
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
    }
  });

  // Render different procedural models based on product type
  switch (type) {
    case 'iron':
      return (
        <group ref={groupRef} scale={[0.8, 0.8, 0.8]}>
          {[ -0.8, -0.4, 0, 0.4, 0.8 ].map((x, i) => (
            <mesh key={i} position={[x, 0, 0]} rotation={[0, 0, 0]} castShadow receiveShadow>
              <cylinderGeometry args={[0.1, 0.1, 4, 16]} />
              <meshStandardMaterial color="#333" roughness={0.7} metalness={0.9} />
            </mesh>
          ))}
          <mesh position={[0, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow receiveShadow>
             <cylinderGeometry args={[0.12, 0.12, 2.5, 16]} />
             <meshStandardMaterial color="#444" roughness={0.6} metalness={0.8} />
          </mesh>
        </group>
      );
    
    case 'copper':
      return (
        <group ref={groupRef}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[3, 0.05, 3]} />
            <meshStandardMaterial color="#b87333" roughness={0.2} metalness={1} />
          </mesh>
          <mesh position={[0, 0.1, 0]} rotation={[0, 0, 0]} castShadow>
            <cylinderGeometry args={[0.5, 0.5, 0.8, 32]} />
            <meshStandardMaterial color="#cd7f32" roughness={0.3} metalness={1} />
          </mesh>
        </group>
      );

    case 'steel':
      return (
        <group ref={groupRef}>
          {[ -0.6, 0.6 ].map((x, i) => (
            <mesh key={i} position={[x, 0, 0]} rotation={[Math.PI / 2.2, 0, 0]} castShadow receiveShadow>
              <torusGeometry args={[1.5, 0.2, 16, 100]} />
              <meshStandardMaterial color="#e5e5e5" roughness={0.1} metalness={1} />
            </mesh>
          ))}
          <mesh rotation={[Math.PI / 2, 0, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.4, 0.4, 4, 32]} />
            <meshStandardMaterial color="#ffffff" roughness={0.1} metalness={1} />
          </mesh>
        </group>
      );

    case 'gabion':
      return (
        <group ref={groupRef}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[2.5, 1.5, 1.5]} />
            <meshStandardMaterial color="#556b2f" wireframe transparent opacity={0.6} />
          </mesh>
          {/* Internal "stones" */}
          {Array.from({ length: 15 }).map((_, i) => (
            <mesh 
              key={i} 
              position={[Math.random() * 2 - 1, Math.random() * 1 - 0.5, Math.random() * 1 - 0.5]} 
              castShadow
            >
              <dodecahedronGeometry args={[0.3, 0]} />
              <meshStandardMaterial color="#666" roughness={1} />
            </mesh>
          ))}
        </group>
      );

    case 'motor':
      return (
        <group ref={groupRef}>
          {/* Main Body */}
          <mesh castShadow receiveShadow>
            <cylinderGeometry args={[1, 1, 2.5, 32]} rotation={[0, 0, Math.PI / 2]} />
            <meshStandardMaterial color="#2b506e" roughness={0.5} metalness={0.7} />
          </mesh>
          {/* Fins */}
          {Array.from({ length: 8 }).map((_, i) => (
            <mesh key={i} rotation={[ (i * Math.PI) / 4, 0, 0]} position={[0, 0, 0]}>
              <boxGeometry args={[2.5, 0.05, 1.2]} />
              <meshStandardMaterial color="#1a3a4f" roughness={0.4} />
            </mesh>
          ))}
          {/* Shaft */}
          <mesh position={[1.5, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.2, 0.2, 1, 32]} />
            <meshStandardMaterial color="#999" roughness={0.1} metalness={1} />
          </mesh>
          {/* Junction Box */}
          <mesh position={[0, 1.1, 0]} castShadow>
             <boxGeometry args={[0.8, 0.5, 0.8]} />
             <meshStandardMaterial color="#2b506e" roughness={0.5} />
          </mesh>
        </group>
      );

    default:
      return null;
  }
};

export default ProductModel;
