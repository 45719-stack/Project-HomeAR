import { useRef, useMemo, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, TransformControls, Grid, useCursor } from '@react-three/drei';
import * as THREE from 'three';

export interface FurnitureItem {
    id: string;
    type: string; // 'sofa', 'table', 'chair', 'lamp', 'rug', 'storage', 'bed', 'decor'
    name: string;
    position: [number, number, number];
    rotation: [number, number, number];
    scale: [number, number, number];
    color: string;
    dimensions: [number, number, number]; // w, h, d
    locked?: boolean;
}

export interface WallConfig {
    [key: string]: string; // 'front', 'back', 'left', 'right', 'ceiling', 'floor' -> color
}

interface ThreeRoomBuilderProps {
    width: number;
    length: number;
    height: number;
    wallConfig: WallConfig;
    floorType: 'wood' | 'tile' | 'carpet' | 'marble';
    items: FurnitureItem[];
    onItemsChange: (items: FurnitureItem[]) => void;
    selectedId: string | null;
    onSelect: (id: string | null, type: 'furniture' | 'wall' | 'floor' | null) => void;
    transformMode?: 'translate' | 'rotate' | 'scale';
    showGrid?: boolean;
}

const WALL_THICKNESS = 0.2;

// --- Furniture Component ---
function FurnitureObject({ item, isSelected, onSelect, onUpdate, transformMode, locked }: {
    item: FurnitureItem;
    isSelected: boolean;
    onSelect: () => void;
    onUpdate: (newItem: FurnitureItem) => void;
    transformMode: 'translate' | 'rotate' | 'scale';
    locked?: boolean;
}) {
    const meshRef = useRef<THREE.Group>(null);
    const [hovered, setHover] = useState(false);
    useCursor(hovered);

    // Simple procedural geometry based on type
    const renderGeometry = () => {
        const { dimensions: [w, h, d], color } = item;
        const material = new THREE.MeshStandardMaterial({ color, roughness: 0.7, metalness: 0.1 });

        switch (item.type) {
            case 'sofa':
                return (
                    <group position={[0, h / 2, 0]}>
                        {/* Base */}
                        <mesh position={[0, -h / 4, 0]} castShadow receiveShadow material={material}>
                            <boxGeometry args={[w, h / 2, d]} />
                        </mesh>
                        {/* Back */}
                        <mesh position={[0, h / 4, -d / 2 + d * 0.1]} castShadow receiveShadow material={material}>
                            <boxGeometry args={[w, h / 2, d * 0.2]} />
                        </mesh>
                        {/* Arms */}
                        <mesh position={[-w / 2 + w * 0.1, 0, 0]} castShadow receiveShadow material={material}>
                            <boxGeometry args={[w * 0.2, h / 2, d]} />
                        </mesh>
                        <mesh position={[w / 2 - w * 0.1, 0, 0]} castShadow receiveShadow material={material}>
                            <boxGeometry args={[w * 0.2, h / 2, d]} />
                        </mesh>
                    </group>
                );
            case 'table':
                return (
                    <group position={[0, h / 2, 0]}>
                        {/* Top */}
                        <mesh position={[0, h / 2 - 0.05, 0]} castShadow receiveShadow material={material}>
                            <boxGeometry args={[w, 0.1, d]} />
                        </mesh>
                        {/* Legs */}
                        {[-1, 1].map(x => [-1, 1].map(z => (
                            <mesh key={`${x}-${z}`} position={[x * (w / 2 - 0.1), -0.05, z * (d / 2 - 0.1)]} castShadow receiveShadow material={material}>
                                <cylinderGeometry args={[0.05, 0.05, h, 8]} />
                            </mesh>
                        )))}
                    </group>
                );
            case 'chair':
                return (
                    <group position={[0, h / 2, 0]}>
                        <mesh position={[0, 0, 0]} castShadow receiveShadow material={material}>
                            <boxGeometry args={[w, 0.1, d]} />
                        </mesh>
                        <mesh position={[0, h / 2, -d / 2 + 0.05]} castShadow receiveShadow material={material}>
                            <boxGeometry args={[w, h, 0.1]} />
                        </mesh>
                        {[-1, 1].map(x => [-1, 1].map(z => (
                            <mesh key={`${x}-${z}`} position={[x * (w / 2 - 0.05), -h / 2, z * (d / 2 - 0.05)]} castShadow receiveShadow material={material}>
                                <cylinderGeometry args={[0.03, 0.03, h, 8]} />
                            </mesh>
                        )))}
                    </group>
                );
            case 'bed':
                return (
                    <group position={[0, h / 2, 0]}>
                        <mesh position={[0, -h * 0.2, 0]} castShadow receiveShadow material={material}>
                            <boxGeometry args={[w, h * 0.6, d]} />
                        </mesh>
                        {/* Headboard */}
                        <mesh position={[0, h * 0.3, -d / 2 + 0.1]} castShadow receiveShadow material={material}>
                            <boxGeometry args={[w, h, 0.2]} />
                        </mesh>
                        {/* Pillow */}
                        <mesh position={[0, 0, -d / 2 + 0.6]} castShadow receiveShadow>
                            <boxGeometry args={[w * 0.6, 0.2, 0.4]} />
                            <meshStandardMaterial color="#fff" />
                        </mesh>
                    </group>
                );
            case 'lamp':
                return (
                    <group position={[0, h / 2, 0]}>
                        <mesh position={[0, h / 3, 0]} castShadow material={material}>
                            <coneGeometry args={[w / 2, h / 3, 32, 1, true]} />
                        </mesh>
                        <mesh position={[0, -h / 6, 0]} castShadow receiveShadow material={material}>
                            <cylinderGeometry args={[0.05, 0.05, h * 0.66, 12]} />
                        </mesh>
                        <pointLight position={[0, h / 3, 0]} intensity={1.5} distance={5} color="#fff" />
                    </group>
                );
            case 'shelf':
            case 'storage':
                return (
                    <group position={[0, h / 2, 0]}>
                        <mesh castShadow receiveShadow material={material}>
                            <boxGeometry args={[w, h, d]} />
                        </mesh>
                        {[-0.2, 0, 0.2].map(y => (
                            <mesh key={y} position={[0, y * h, d / 2 + 0.01]}>
                                <boxGeometry args={[w * 0.9, 0.02, 0.05]} />
                                <meshStandardMaterial color="#333" />
                            </mesh>
                        ))}
                    </group>
                );
            case 'rug':
                return (
                    <mesh position={[0, 0.01, 0]} receiveShadow material={material}>
                        <boxGeometry args={[w, 0.02, d]} />
                    </mesh>
                );
            case 'decor':
                return (
                    <mesh position={[0, h / 2, 0]} castShadow receiveShadow material={material}>
                        <sphereGeometry args={[w / 2, 32, 32]} />
                    </mesh>
                );
            default:
                return (
                    <mesh position={[0, h / 2, 0]} castShadow receiveShadow material={material}>
                        <boxGeometry args={[w, h, d]} />
                    </mesh>
                );
        }
    };

    return (
        <>
            <group
                ref={meshRef}
                position={item.position}
                rotation={item.rotation}
                scale={item.scale}
                onClick={(e) => {
                    e.stopPropagation();
                    onSelect();
                }}
                onPointerOver={() => setHover(true)}
                onPointerOut={() => setHover(false)}
            >
                {renderGeometry()}
                {isSelected && !locked && (
                    <mesh position={[0, item.dimensions[1] + 0.5, 0]}>
                        <sphereGeometry args={[0.1]} />
                        <meshBasicMaterial color="lime" transparent opacity={0.5} />
                    </mesh>
                )}
            </group>
            {isSelected && !locked && (
                <TransformControls
                    object={meshRef as any}
                    mode={transformMode}
                    onMouseUp={() => {
                        if (meshRef.current) {
                            const { position, rotation, scale } = meshRef.current;
                            onUpdate({
                                ...item,
                                position: [position.x, position.y, position.z],
                                rotation: [rotation.x, rotation.y, rotation.z],
                                scale: [scale.x, scale.y, scale.z],
                            });
                        }
                    }}
                />
            )}
        </>
    );
}

// --- Room Scene ---
function RoomScene({ width, length, height, wallConfig, floorType, items, onItemsChange, selectedId, onSelect, transformMode, showGrid }: ThreeRoomBuilderProps) {
    const floorMaterial = useMemo(() => new THREE.MeshStandardMaterial({
        color: floorType === 'wood' ? '#d4a373' : (floorType === 'tile' ? '#e5e5e5' : (floorType === 'marble' ? '#f5f5f5' : '#8d99ae')),
        roughness: floorType === 'marble' ? 0.1 : 0.8,
        metalness: floorType === 'marble' ? 0.2 : 0.1
    }), [floorType]);

    // Helper for wall materials
    const getWallMat = (side: string) => {
        return new THREE.MeshStandardMaterial({
            color: wallConfig[side] || '#fff',
            roughness: 0.9,
            side: THREE.FrontSide
        });
    };

    const handleWallClick = (side: string, e: any) => {
        e.stopPropagation();
        onSelect(side, 'wall');
    };

    return (
        <>
            {/* Lights */}
            <ambientLight intensity={0.6} />
            <pointLight position={[0, height - 1, 0]} intensity={items.length > 5 ? 0.5 : 0.8} decay={2} castShadow />
            <hemisphereLight intensity={0.5} groundColor="#444" />
            <directionalLight position={[5, 10, 5]} intensity={0.5} castShadow />

            {/* Grid */}
            {showGrid && <Grid position={[0, 0.01, 0]} args={[width, length]} cellSize={1} cellThickness={1} cellColor="#6f6f6f" sectionSize={3} sectionThickness={1.5} sectionColor="#9d4b4b" fadeDistance={30} />}

            {/* Floor */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow onClick={(e) => { e.stopPropagation(); onSelect('floor', 'floor'); }}>
                <planeGeometry args={[width, length]} />
                <primitive object={floorMaterial} />
            </mesh>

            {/* Ceiling */}
            <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, height, 0]} receiveShadow={false} onClick={(e) => handleWallClick('ceiling', e)}>
                <planeGeometry args={[width, length]} />
                <meshStandardMaterial color={wallConfig['ceiling'] || '#ffffff'} side={THREE.BackSide} />
            </mesh>

            {/* Walls */}
            {/* Back (-z) */}
            <mesh position={[0, height / 2, -length / 2 - WALL_THICKNESS / 2]} castShadow receiveShadow onClick={(e) => handleWallClick('back', e)}>
                <boxGeometry args={[width + WALL_THICKNESS * 2, height, WALL_THICKNESS]} />
                <primitive object={getWallMat('back')} />
            </mesh>
            {/* Front (+z) */}
            <mesh position={[0, height / 2, length / 2 + WALL_THICKNESS / 2]} castShadow receiveShadow onClick={(e) => handleWallClick('front', e)}>
                <boxGeometry args={[width + WALL_THICKNESS * 2, height, WALL_THICKNESS]} />
                <primitive object={getWallMat('front')} />
            </mesh>
            {/* Left (-x) */}
            <mesh position={[-width / 2 - WALL_THICKNESS / 2, height / 2, 0]} castShadow receiveShadow onClick={(e) => handleWallClick('left', e)}>
                <boxGeometry args={[WALL_THICKNESS, height, length]} />
                <primitive object={getWallMat('left')} />
            </mesh>
            {/* Right (+x) */}
            <mesh position={[width / 2 + WALL_THICKNESS / 2, height / 2, 0]} castShadow receiveShadow onClick={(e) => handleWallClick('right', e)}>
                <boxGeometry args={[WALL_THICKNESS, height, length]} />
                <primitive object={getWallMat('right')} />
            </mesh>

            {/* Furniture Items */}
            {items.map(item => (
                <FurnitureObject
                    key={item.id}
                    item={item}
                    isSelected={selectedId === item.id}
                    onSelect={() => onSelect(item.id, 'furniture')}
                    onUpdate={(newItem) => {
                        const newItems = items.map(i => i.id === newItem.id ? newItem : i);
                        onItemsChange(newItems);
                    }}
                    transformMode={transformMode || 'translate'}
                    locked={item.locked}
                />
            ))}
        </>
    );
}



// --- Main Export ---
export default function ThreeRoomBuilder(props: ThreeRoomBuilderProps) {
    return (
        <div className="w-full h-full relative bg-gray-900 overflow-hidden">
            <Canvas shadows gl={{ preserveDrawingBuffer: true }}>
                <PerspectiveCamera
                    makeDefault
                    position={[0, props.height, props.length + 2]}
                    fov={60}
                />
                <OrbitControls
                    makeDefault
                    enableDamping
                    maxPolarAngle={Math.PI / 1.8} // Don't go below floor
                    maxDistance={30}
                    minDistance={2}
                />
                <RoomScene {...props} />
            </Canvas>

            {/* Minimap / Directions Label */}
            <div className="absolute top-4 right-4 bg-black/50 text-white/70 px-3 py-1 rounded text-xs pointer-events-none backdrop-blur-sm">
                FOV: 60°
            </div>

            <div className="absolute bottom-4 left-0 right-0 text-center pointer-events-none z-10">
                <span className="text-white/70 text-xs bg-black/40 px-3 py-1 rounded-full backdrop-blur-sm shadow-sm">
                    Left Click: Select | Right Click: Pan | Scroll: Zoom
                </span>
            </div>
        </div>
    );
}
