import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { BodyProfile } from '../types';
import { RotateCw, ZoomIn, ZoomOut, Eye, Maximize2, Sparkles, Check, AlertTriangle } from 'lucide-react';

export interface ClothingItem {
  id: string;
  brand: string;
  name: string;
  category: 'top' | 'bottom' | 'full';
  size: string;
  color: string;
  price: string;
  url?: string;
  // Specific clothing measurements (in inches)
  chestWidthInches: number;
  waistWidthInches: number;
  shoulderWidthInches: number;
  totalLengthInches: number;
  inseamInches?: number;
  sleeveLengthInches?: number;
  fabricStretch: 'None' | 'Slight' | 'High';
  fitType: 'Petite / Slim' | 'Regular Fit' | 'Oversized / Loose';
  imagePlaceholderColor: string;
}

interface Clothing3DCanvasProps {
  bodyProfile: BodyProfile;
  selectedTop?: ClothingItem;
  selectedBottom?: ClothingItem;
  heightCm?: number;
}

export const Clothing3DCanvas: React.FC<Clothing3DCanvasProps> = ({
  bodyProfile,
  selectedTop,
  selectedBottom,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [wireframe, setWireframe] = useState(false);
  const [autoRotate, setAutoRotate] = useState(true);
  const [rotationAngle, setRotationAngle] = useState(0);

  // Parse height in inches
  const parseHeightInches = (hStr: string): number => {
    if (!hStr) return 62; // Default 5'2" = 62 inches
    const ftMatch = hStr.match(/(\d+)'/);
    const inMatch = hStr.match(/(\d+)"/);
    let total = 62;
    if (ftMatch) total = parseInt(ftMatch[1], 10) * 12;
    if (inMatch) total += parseInt(inMatch[1], 10);
    return total || 62;
  };

  // Parse weight in lbs
  const parseWeightLbs = (wStr: string): number => {
    if (!wStr) return 118;
    const match = wStr.match(/(\d+)/);
    return match ? parseInt(match[1], 10) : 118;
  };

  const heightInches = parseHeightInches(bodyProfile?.height || "5'2\"");
  const weightLbs = parseWeightLbs(bodyProfile?.weight || "118 lbs");

  // Derive body proportions factor (relative to standard 68 inch / 150lb mannequin)
  const heightScale = heightInches / 66.0; // Normalized height scale
  const buildStr = (bodyProfile?.bodyBuild || 'Petite Slim Build').toLowerCase();
  const buildFactor = buildStr.includes('petite') ? 0.88
    : buildStr.includes('athletic') ? 1.05
    : buildStr.includes('muscular') ? 1.15
    : buildStr.includes('curvy') ? 1.10
    : 0.95;

  const weightScale = (weightLbs / 130.0) * buildFactor;

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 320;
    const height = container.clientHeight || 420;

    // 1. Scene Setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x121110); // Matches app dark theme

    // 2. Camera Setup
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 1.2, 4.2);

    // 3. Renderer Setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // Clear previous canvas
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 4. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xfcf8f2, 1.2);
    dirLight1.position.set(3, 5, 4);
    dirLight1.castShadow = true;
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x38bdf8, 0.4); // Subtle cool rim light
    dirLight2.position.set(-3, 2, -3);
    scene.add(dirLight2);

    const goldRimLight = new THREE.DirectionalLight(0xf59e0b, 0.5); // Warm gold accent light
    goldRimLight.position.set(2, -1, 3);
    scene.add(goldRimLight);

    // Ground platform
    const platformGeo = new THREE.CylinderGeometry(1.2, 1.3, 0.1, 32);
    const platformMat = new THREE.MeshStandardMaterial({
      color: 0x262320,
      roughness: 0.8,
      metalness: 0.2,
    });
    const platform = new THREE.Mesh(platformGeo, platformMat);
    platform.position.y = -1.05;
    platform.receiveShadow = true;
    scene.add(platform);

    // Grid ring on platform
    const ringGeo = new THREE.RingGeometry(1.0, 1.15, 32);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0xd97706, side: THREE.DoubleSide });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 2;
    ring.position.y = -0.99;
    scene.add(ring);

    // 5. MANNEQUIN GROUP
    const bodyGroup = new THREE.Group();
    scene.add(bodyGroup);

    // Material definitions
    const skinMat = new THREE.MeshStandardMaterial({
      color: 0xd6c0b0,
      roughness: 0.6,
      metalness: 0.1,
      wireframe,
    });

    const mannequinJointMat = new THREE.MeshStandardMaterial({
      color: 0xb09888,
      roughness: 0.5,
      metalness: 0.2,
      wireframe,
    });

    // Body Dimensions based on user parameters
    const torsoHeight = 0.75 * heightScale;
    const shoulderWidth = 0.55 * Math.sqrt(weightScale);
    const waistWidth = 0.38 * Math.sqrt(weightScale);
    const hipWidth = 0.46 * Math.sqrt(weightScale);
    const legLength = 0.85 * heightScale;
    const armLength = 0.65 * heightScale;

    // --- HEAD & NECK ---
    const headGeo = new THREE.SphereGeometry(0.18 * heightScale, 24, 24);
    headGeo.scale(1, 1.25, 1);
    const head = new THREE.Mesh(headGeo, skinMat);
    head.position.y = torsoHeight / 2 + 0.32 * heightScale;
    head.castShadow = true;
    bodyGroup.add(head);

    const neckGeo = new THREE.CylinderGeometry(0.06 * weightScale, 0.08 * weightScale, 0.12 * heightScale, 16);
    const neck = new THREE.Mesh(neckGeo, skinMat);
    neck.position.y = torsoHeight / 2 + 0.12 * heightScale;
    bodyGroup.add(neck);

    // --- CHEST & TORSO ---
    const chestGeo = new THREE.CylinderGeometry(shoulderWidth / 2, waistWidth / 2, torsoHeight * 0.55, 24);
    const chest = new THREE.Mesh(chestGeo, skinMat);
    chest.position.y = torsoHeight * 0.22;
    chest.castShadow = true;
    bodyGroup.add(chest);

    const waistGeo = new THREE.CylinderGeometry(waistWidth / 2, hipWidth / 2, torsoHeight * 0.45, 24);
    const waist = new THREE.Mesh(waistGeo, skinMat);
    waist.position.y = -torsoHeight * 0.22;
    waist.castShadow = true;
    bodyGroup.add(waist);

    // --- ARMS ---
    [-1, 1].forEach((side) => {
      const shoulderJointGeo = new THREE.SphereGeometry(0.065, 16, 16);
      const shoulderJoint = new THREE.Mesh(shoulderJointGeo, mannequinJointMat);
      shoulderJoint.position.set((side * shoulderWidth) / 1.8, torsoHeight * 0.42, 0);
      bodyGroup.add(shoulderJoint);

      const armGeo = new THREE.CylinderGeometry(0.048 * weightScale, 0.038 * weightScale, armLength, 16);
      const arm = new THREE.Mesh(armGeo, skinMat);
      arm.position.set(side * (shoulderWidth / 1.8 + 0.06), torsoHeight * 0.42 - armLength / 2, 0);
      arm.rotation.z = side * -0.12;
      arm.castShadow = true;
      bodyGroup.add(arm);
    });

    // --- LEGS ---
    [-1, 1].forEach((side) => {
      const hipJointGeo = new THREE.SphereGeometry(0.07, 16, 16);
      const hipJoint = new THREE.Mesh(hipJointGeo, mannequinJointMat);
      hipJoint.position.set((side * hipWidth) / 3, -torsoHeight * 0.45, 0);
      bodyGroup.add(hipJoint);

      const legGeo = new THREE.CylinderGeometry(0.072 * weightScale, 0.048 * weightScale, legLength, 20);
      const leg = new THREE.Mesh(legGeo, skinMat);
      leg.position.set((side * hipWidth) / 3, -torsoHeight * 0.45 - legLength / 2, 0);
      leg.castShadow = true;
      bodyGroup.add(leg);

      // Foot
      const footGeo = new THREE.BoxGeometry(0.08, 0.06, 0.2);
      const foot = new THREE.Mesh(footGeo, mannequinJointMat);
      foot.position.set((side * hipWidth) / 3, -torsoHeight * 0.45 - legLength + 0.03, 0.06);
      bodyGroup.add(foot);
    });

    // 6. CLOTHING OVERLAYS

    // TOP CLOTHING OVERLAY
    if (selectedTop) {
      // Calculate fit ratio relative to mannequin chest
      const topColorHex = parseInt(selectedTop.imagePlaceholderColor.replace('#', '0x'), 16) || 0xf59e0b;

      const topMat = new THREE.MeshStandardMaterial({
        color: topColorHex,
        roughness: 0.4,
        metalness: 0.1,
        wireframe,
        side: THREE.DoubleSide,
      });

      // Clothing scale relative to clothing item measurements
      const topFitScale = selectedTop.fitType.includes('Oversized') ? 1.12 : selectedTop.fitType.includes('Petite') ? 0.94 : 1.02;
      const topWidth = (shoulderWidth / 1.7) * topFitScale;
      const topHeight = (selectedTop.totalLengthInches / 26.0) * torsoHeight;

      const shirtGeo = new THREE.CylinderGeometry(topWidth, topWidth * 0.95, topHeight, 24);
      const shirt = new THREE.Mesh(shirtGeo, topMat);
      shirt.position.y = torsoHeight * 0.42 - topHeight / 2;
      shirt.castShadow = true;
      bodyGroup.add(shirt);

      // Sleeves
      const sleeveLen = ((selectedTop.sleeveLengthInches || 22) / 24.0) * (armLength * 0.8);
      [-1, 1].forEach((side) => {
        const sleeveGeo = new THREE.CylinderGeometry(0.065 * topFitScale, 0.055 * topFitScale, sleeveLen, 16);
        const sleeve = new THREE.Mesh(sleeveGeo, topMat);
        sleeve.position.set(side * (shoulderWidth / 1.8 + 0.06), torsoHeight * 0.42 - sleeveLen / 2, 0);
        sleeve.rotation.z = side * -0.12;
        bodyGroup.add(sleeve);
      });
    }

    // BOTTOM CLOTHING OVERLAY
    if (selectedBottom) {
      const botColorHex = parseInt(selectedBottom.imagePlaceholderColor.replace('#', '0x'), 16) || 0x1e293b;

      const botMat = new THREE.MeshStandardMaterial({
        color: botColorHex,
        roughness: 0.6,
        metalness: 0.1,
        wireframe,
      });

      const pantsInseamInches = selectedBottom.inseamInches || selectedBottom.totalLengthInches || 28;
      const pantsLen = (pantsInseamInches / 30.0) * legLength;

      // Pants waist / hips
      const waistPantsGeo = new THREE.CylinderGeometry((hipWidth / 2) * 1.04, (hipWidth / 2) * 1.04, torsoHeight * 0.25, 20);
      const waistPants = new THREE.Mesh(waistPantsGeo, botMat);
      waistPants.position.y = -torsoHeight * 0.35;
      bodyGroup.add(waistPants);

      // Pants legs
      [-1, 1].forEach((side) => {
        const pantLegGeo = new THREE.CylinderGeometry(0.082 * weightScale, 0.065 * weightScale, pantsLen, 20);
        const pantLeg = new THREE.Mesh(pantLegGeo, botMat);
        pantLeg.position.set((side * hipWidth) / 3, -torsoHeight * 0.45 - pantsLen / 2, 0);
        bodyGroup.add(pantLeg);
      });
    }

    // 7. Mouse drag rotation interaction
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - previousMousePosition.x;
      const deltaY = e.clientY - previousMousePosition.y;

      bodyGroup.rotation.y += deltaX * 0.01;
      camera.position.y = Math.max(0.2, Math.min(2.5, camera.position.y - deltaY * 0.005));

      previousMousePosition = { x: e.clientX, y: e.clientY };
      setRotationAngle(Math.round(((bodyGroup.rotation.y % (Math.PI * 2)) * 180) / Math.PI));
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    const domCanvas = renderer.domElement;
    domCanvas.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    // 8. Animation loop
    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      if (autoRotate && !isDragging) {
        bodyGroup.rotation.y += 0.008;
      }

      renderer.render(scene, camera);
    };

    animate();

    // Clean up
    return () => {
      cancelAnimationFrame(animationFrameId);
      domCanvas.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      renderer.dispose();
    };
  }, [bodyProfile, selectedTop, selectedBottom, wireframe, autoRotate, heightScale, weightScale]);

  return (
    <div className="relative bg-stone-950 border border-stone-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col items-center justify-center min-h-[460px]">
      {/* Canvas Mount */}
      <div ref={mountRef} className="w-full h-[440px] cursor-grab active:cursor-grabbing" />

      {/* Floating 3D Control Overlay */}
      <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 pointer-events-none">
        <div className="bg-stone-900/90 backdrop-blur-md border border-stone-800 px-3 py-1.5 rounded-xl text-[11px] text-stone-200 pointer-events-auto flex items-center gap-2 shadow-lg">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          <span className="font-bold text-amber-300">3D Fit Simulator</span>
          <span className="text-stone-500">• {bodyProfile.height}, {bodyProfile.weight}</span>
        </div>

        <div className="flex items-center gap-1.5 pointer-events-auto">
          <button
            onClick={() => setAutoRotate(!autoRotate)}
            className={`p-2 rounded-xl border text-xs font-semibold transition-all backdrop-blur-md ${
              autoRotate
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                : 'bg-stone-900/80 text-stone-400 border-stone-800 hover:text-white'
            }`}
            title="Toggle 360 Auto-Rotation"
          >
            <RotateCw className={`w-3.5 h-3.5 ${autoRotate ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={() => setWireframe(!wireframe)}
            className={`p-2 rounded-xl border text-xs font-semibold transition-all backdrop-blur-md ${
              wireframe
                ? 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                : 'bg-stone-900/80 text-stone-400 border-stone-800 hover:text-white'
            }`}
            title="Toggle Wireframe Mesh"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Bottom Measurement Overlay Pills */}
      <div className="absolute bottom-3 left-3 right-3 flex flex-wrap items-center justify-between gap-2 pointer-events-none text-[10px]">
        <div className="bg-stone-900/90 backdrop-blur-md border border-stone-800 px-3 py-1.5 rounded-xl text-stone-300 pointer-events-auto flex items-center gap-3">
          <span>Build: <strong className="text-white">{bodyProfile?.bodyBuild || 'Petite'}</strong></span>
          <span>Top Size: <strong className="text-amber-300">{bodyProfile?.topSize || 'XS'}</strong></span>
          <span>Bottom: <strong className="text-amber-300">{bodyProfile?.bottomSize || '0 Petite'}</strong></span>
        </div>

        <div className="bg-stone-900/90 backdrop-blur-md border border-stone-800 px-2.5 py-1 rounded-xl text-stone-400 pointer-events-auto">
          Drag mouse to rotate 360°
        </div>
      </div>
    </div>
  );
};
