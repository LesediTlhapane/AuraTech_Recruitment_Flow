import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { X, ExternalLink } from 'lucide-react';
import { NotificationItem } from '../types';

// Aura Tech Intelligence Color Palette
const COLORS = {
  primaryGreen: 0x1C4D3F,
  secondaryGreen: 0x2D6A4F,
  accentGreen: 0x4CAF50,
  brightMint: 0x34D399,
  subtleCyan: 0x0EA5E9,
  softGrey: 0x64748B,
  glowEmerald: 0x10B981,
};

// Micro-animation events list
const MICRO_EVENTS = [
  { id: 'ev-1', icon: '📄', title: 'CV Ingestion', detail: 'Parsing CV for Senior Full-Stack Engineer...', badge: 'Ingest' },
  { id: 'ev-2', icon: '🧠', title: 'Aura Candidate Screening', detail: 'Evaluating 12 suitability metrics (Score: 94%)...', badge: 'Screening' },
  { id: 'ev-3', icon: '🏷️', title: 'Skill Extraction', detail: 'Extracted: React, Node.js, AWS, System Design', badge: 'Parsing' },
  { id: 'ev-4', icon: '🛡️', title: 'Risk Concern Audit', detail: 'POPIA Compliance & Career Stability Verified', badge: 'Compliance' },
  { id: 'ev-5', icon: '🤝', title: 'Automated Match', detail: 'Candidate matched to Enterprise Vacancy', badge: 'Matching' },
  { id: 'ev-6', icon: '📅', title: 'Interview Coordinated', detail: 'Slot confirmed with Hiring Manager', badge: 'Calendar' },
  { id: 'ev-7', icon: '✉️', title: 'Offer Package Drafted', detail: 'Personalized offer generated with notice fit', badge: 'Communication' }
];

interface Recruitment3DBackgroundProps {
  activeNotification?: NotificationItem | null;
  onDismissNotification?: () => void;
  onNavigateToNotifications?: () => void;
  hasOpenedNotifications?: boolean;
  currentTheme?: 'light' | 'cyber' | 'horizon';
}

export const Recruitment3DBackground: React.FC<Recruitment3DBackgroundProps> = ({
  activeNotification,
  onDismissNotification,
  onNavigateToNotifications,
  hasOpenedNotifications = false,
  currentTheme = 'cyber',
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [currentEventIdx, setCurrentEventIdx] = useState(0);
  const [eventVisible, setEventVisible] = useState(true);
  const [isToastDismissed, setIsToastDismissed] = useState(false);

  // Cycle micro-animations every 6 seconds if activeNotification isn't overridden
  useEffect(() => {
    const interval = setInterval(() => {
      setEventVisible(false);
      setTimeout(() => {
        setCurrentEventIdx((prev) => (prev + 1) % MICRO_EVENTS.length);
        setEventVisible(true);
        setIsToastDismissed(false); // Reset dismissal on new event cycle
      }, 500);
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;


    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;
    const isMobile = width < 768;

    // --- THREE.JS SCENE SETUP ---
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0xeef4fb, 0.015);

    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.set(0, 0, 32);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);

    // --- LIGHTING ---
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0x4CAF50, 2.0);
    dirLight1.position.set(20, 30, 20);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x0EA5E9, 1.5);
    dirLight2.position.set(-20, -20, 10);
    scene.add(dirLight2);

    // Group to hold all 3D recruitment objects
    const mainGroup = new THREE.Group();
    scene.add(mainGroup);

    // --- HELPER TO CREATE TEXTURE CANVASES ---
    const createCardTexture = (
      title: string,
      subtitle: string,
      score: string,
      tag: string,
      bgColor = '#ffffff',
      accentColor = '#1C4D3F'
    ) => {
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 280;
      const ctx = canvas.getContext('2d');
      if (!ctx) return new THREE.CanvasTexture(canvas);

      // Card Background with Rounded Rect
      ctx.fillStyle = bgColor;
      ctx.shadowColor = 'rgba(28, 77, 63, 0.15)';
      ctx.shadowBlur = 15;
      
      const r = 24;
      ctx.beginPath();
      ctx.moveTo(r, 0);
      ctx.lineTo(512 - r, 0);
      ctx.quadraticCurveTo(512, 0, 512, r);
      ctx.lineTo(512, 280 - r);
      ctx.quadraticCurveTo(512, 280, 512 - r, 280);
      ctx.lineTo(r, 280);
      ctx.quadraticCurveTo(0, 280, 0, 280 - r);
      ctx.lineTo(0, r);
      ctx.quadraticCurveTo(0, 0, r, 0);
      ctx.closePath();
      ctx.fill();

      // Border
      ctx.lineWidth = 4;
      ctx.strokeStyle = '#2D6A4F';
      ctx.stroke();

      // Header Bar
      ctx.fillStyle = accentColor;
      ctx.fillRect(0, 0, 512, 12);

      // Avatar circle
      ctx.fillStyle = '#E2E8F0';
      ctx.beginPath();
      ctx.arc(50, 70, 24, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = accentColor;
      ctx.font = 'bold 20px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(title.charAt(0), 50, 77);

      // Title & Subtitle
      ctx.textAlign = 'left';
      ctx.font = 'bold 28px Inter, sans-serif';
      ctx.fillStyle = '#0F172A';
      ctx.fillText(title, 90, 68);

      ctx.font = '500 20px Inter, sans-serif';
      ctx.fillStyle = '#475569';
      ctx.fillText(subtitle, 90, 96);

      // Match Score Pill
      ctx.fillStyle = '#DCFCE7';
      ctx.beginPath();
      ctx.roundRect(350, 45, 135, 45, 20);
      ctx.fill();
      ctx.font = 'bold 22px Inter, sans-serif';
      ctx.fillStyle = '#15803D';
      ctx.fillText(score, 370, 75);

      // Divider Line
      ctx.strokeStyle = '#CBD5E1';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(30, 125);
      ctx.lineTo(482, 125);
      ctx.stroke();

      // Tag Pill
      ctx.fillStyle = '#F0FDF4';
      ctx.beginPath();
      ctx.roundRect(30, 150, 220, 40, 12);
      ctx.fill();
      ctx.strokeStyle = '#86EFAC';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.font = '600 18px Inter, sans-serif';
      ctx.fillStyle = '#166534';
      ctx.fillText(`✓ ${tag}`, 45, 176);

      // AI Status Line
      ctx.font = 'bold 18px Inter, sans-serif';
      ctx.fillStyle = '#2563EB';
      ctx.fillText('⚡ AI Engine Verified • POPIA Compliant', 30, 235);

      const texture = new THREE.CanvasTexture(canvas);
      texture.colorSpace = THREE.SRGBColorSpace;
      return texture;
    };

    // Helper for Skill Badge Textures
    const createSkillBadgeTexture = (skill: string) => {
      const canvas = document.createElement('canvas');
      canvas.width = 256;
      canvas.height = 90;
      const ctx = canvas.getContext('2d');
      if (!ctx) return new THREE.CanvasTexture(canvas);

      ctx.fillStyle = '#1C4D3F';
      ctx.beginPath();
      ctx.roundRect(4, 4, 248, 82, 41);
      ctx.fill();
      ctx.lineWidth = 3;
      ctx.strokeStyle = '#4CAF50';
      ctx.stroke();

      ctx.font = 'bold 26px Inter, sans-serif';
      ctx.fillStyle = '#FFFFFF';
      ctx.textAlign = 'center';
      ctx.fillText(skill, 128, 54);

      const texture = new THREE.CanvasTexture(canvas);
      texture.colorSpace = THREE.SRGBColorSpace;
      return texture;
    };

    // Helper for Document CV Textures
    const createCvDocumentTexture = (docName: string) => {
      const canvas = document.createElement('canvas');
      canvas.width = 280;
      canvas.height = 360;
      const ctx = canvas.getContext('2d');
      if (!ctx) return new THREE.CanvasTexture(canvas);

      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.roundRect(0, 0, 280, 360, 16);
      ctx.fill();
      ctx.lineWidth = 3;
      ctx.strokeStyle = '#2D6A4F';
      ctx.stroke();

      // Top corner folded accent
      ctx.fillStyle = '#2D6A4F';
      ctx.beginPath();
      ctx.moveTo(220, 0);
      ctx.lineTo(280, 60);
      ctx.lineTo(220, 60);
      ctx.closePath();
      ctx.fill();

      // Title
      ctx.font = 'bold 22px Inter, sans-serif';
      ctx.fillStyle = '#1C4D3F';
      ctx.textAlign = 'left';
      ctx.fillText('CURRICULUM VITAE', 24, 45);

      ctx.font = '600 18px Inter, sans-serif';
      ctx.fillStyle = '#334155';
      ctx.fillText(docName, 24, 75);

      // Line placeholders representing CV text
      ctx.fillStyle = '#CBD5E1';
      const lines = [110, 130, 150, 180, 200, 220, 240, 270, 290];
      lines.forEach((y, i) => {
        const w = i % 3 === 0 ? 160 : i % 2 === 0 ? 220 : 190;
        ctx.fillRect(24, y, w, 8);
      });

      // AI Stamp
      ctx.fillStyle = '#DCFCE7';
      ctx.fillRect(24, 310, 140, 30);
      ctx.font = 'bold 14px Inter, sans-serif';
      ctx.fillStyle = '#15803D';
      ctx.fillText('AI PARSED 100%', 34, 330);

      const texture = new THREE.CanvasTexture(canvas);
      texture.colorSpace = THREE.SRGBColorSpace;
      return texture;
    };

    // --- 1. CANDIDATE CARDS (3D Planes) ---
    const cardData = [
      { name: 'Sarah Jenkins', role: 'Full-Stack Lead', score: '98% Match', tag: 'Top Contender', pos: [-20, 8, -5], rot: [0.1, 0.2, -0.05] },
      { name: 'Thabo Mokoena', role: 'DevOps Engineer', score: '94% Match', tag: 'High Suitability', pos: [20, -6, -8], rot: [-0.1, -0.2, 0.05] },
      { name: 'Lesedi Tlhapane', role: 'AI / Data Scientist', score: '96% Match', tag: 'Excellent Fit', pos: [-18, -10, -12], rot: [0.15, -0.1, 0.08] },
      { name: 'Michael Chen', role: 'Cloud Architect', score: '91% Match', tag: 'Strong Match', pos: [18, 10, -10], rot: [-0.08, 0.15, -0.04] },
    ];

    const cardPlanes: THREE.Mesh[] = [];
    cardData.forEach((cd) => {
      const texture = createCardTexture(cd.name, cd.role, cd.score, cd.tag);
      const geom = new THREE.PlaneGeometry(7, 3.8);
      const mat = new THREE.MeshStandardMaterial({
        map: texture,
        transparent: true,
        roughness: 0.2,
        metalness: 0.1,
        side: THREE.DoubleSide,
      });
      const mesh = new THREE.Mesh(geom, mat);
      mesh.position.set(cd.pos[0], cd.pos[1], cd.pos[2]);
      mesh.rotation.set(cd.rot[0], cd.rot[1], cd.rot[2]);
      mainGroup.add(mesh);
      cardPlanes.push(mesh);
    });

    // --- 2. FLOATING RESUME DOCUMENTS ---
    const cvDocs = ['S_Jenkins_CV.pdf', 'T_Mokoena_Resume.docx', 'L_Tlhapane_Profile.pdf'];
    const cvMeshes: THREE.Mesh[] = [];
    cvDocs.forEach((doc, idx) => {
      const texture = createCvDocumentTexture(doc);
      const geom = new THREE.PlaneGeometry(4, 5.1);
      const mat = new THREE.MeshStandardMaterial({
        map: texture,
        transparent: true,
        roughness: 0.3,
        side: THREE.DoubleSide,
      });
      const mesh = new THREE.Mesh(geom, mat);
      const x = (idx - 1) * 22;
      mesh.position.set(x, idx % 2 === 0 ? 11 : -11, -15);
      mesh.rotation.set(0.1 * (idx + 1), -0.15 * (idx + 1), 0.05 * idx);
      mainGroup.add(mesh);
      cvMeshes.push(mesh);
    });

    // --- 3. FLOATING SKILL BADGES ---
    const skills = ['React 19', 'TypeScript', 'Python AI', 'AWS Cloud', 'Docker', 'POPIA Audit', 'System Architecture'];
    const skillMeshes: THREE.Mesh[] = [];
    skills.forEach((skill, idx) => {
      const texture = createSkillBadgeTexture(skill);
      const geom = new THREE.PlaneGeometry(3.2, 1.1);
      const mat = new THREE.MeshStandardMaterial({
        map: texture,
        transparent: true,
        roughness: 0.1,
        metalness: 0.2,
        side: THREE.DoubleSide,
      });
      const mesh = new THREE.Mesh(geom, mat);
      const angle = (idx / skills.length) * Math.PI * 2;
      const radius = 22;
      mesh.position.set(Math.cos(angle) * radius, Math.sin(angle) * 9, -12);
      mainGroup.add(mesh);
      skillMeshes.push(mesh);
    });

    // --- 4. HOLOGRAPHIC AI RINGS ---
    const ringGroup = new THREE.Group();
    const ringGeom1 = new THREE.TorusGeometry(8, 0.08, 16, 100);
    const ringMat1 = new THREE.MeshBasicMaterial({ color: COLORS.accentGreen, transparent: true, opacity: 0.2 });
    const ring1 = new THREE.Mesh(ringGeom1, ringMat1);
    ring1.rotation.x = Math.PI / 3;
    ringGroup.add(ring1);

    const ringGeom2 = new THREE.TorusGeometry(12, 0.05, 16, 100);
    const ringMat2 = new THREE.MeshBasicMaterial({ color: COLORS.subtleCyan, transparent: true, opacity: 0.1 });
    const ring2 = new THREE.Mesh(ringGeom2, ringMat2);
    ring2.rotation.y = Math.PI / 4;
    ringGroup.add(ring2);

    ringGroup.position.set(0, 0, -20);
    mainGroup.add(ringGroup);

    // --- 5. NEURAL NETWORK PARTICLES & DYNAMIC CONNECTIONS ---
    const particleCount = isMobile ? 35 : 100;
    const particlePositions = new Float32Array(particleCount * 3);
    const particleVelocities: { x: number; y: number; z: number }[] = [];

    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3] = (Math.random() - 0.5) * 60;
      particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 40;
      particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 30 - 10;

      particleVelocities.push({
        x: (Math.random() - 0.5) * 0.007,
        y: (Math.random() - 0.5) * 0.007,
        z: (Math.random() - 0.5) * 0.004,
      });
    }

    const particleGeom = new THREE.BufferGeometry();
    particleGeom.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

    // Circle sprite texture for particle points
    const particleCanvas = document.createElement('canvas');
    particleCanvas.width = 64;
    particleCanvas.height = 64;
    const pCtx = particleCanvas.getContext('2d');
    if (pCtx) {
      const grad = pCtx.createRadialGradient(32, 32, 0, 32, 32, 32);
      grad.addColorStop(0, '#4CAF50');
      grad.addColorStop(0.5, 'rgba(45, 106, 79, 0.3)');
      grad.addColorStop(1, 'rgba(28, 77, 63, 0)');
      pCtx.fillStyle = grad;
      pCtx.beginPath();
      pCtx.arc(32, 32, 32, 0, Math.PI * 2);
      pCtx.fill();
    }
    const particleTex = new THREE.CanvasTexture(particleCanvas);

    const particleMat = new THREE.PointsMaterial({
      size: 0.5,
      map: particleTex,
      transparent: true,
      opacity: 0.08,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const particleSystem = new THREE.Points(particleGeom, particleMat);
    mainGroup.add(particleSystem);

    // Connecting lines geometry
    const maxConnections = isMobile ? 20 : 50;
    const linePositions = new Float32Array(maxConnections * 2 * 3);
    const lineGeom = new THREE.BufferGeometry();
    lineGeom.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));

    const lineMat = new THREE.LineBasicMaterial({
      color: COLORS.accentGreen,
      transparent: true,
      opacity: 0.03,
      blending: THREE.AdditiveBlending,
    });
    const lineSystem = new THREE.LineSegments(lineGeom, lineMat);
    mainGroup.add(lineSystem);

    // --- MOUSE PARALLAX TRACKING ---
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const halfW = window.innerWidth / 2;
      const halfH = window.innerHeight / 2;
      mouseX = (e.clientX - halfW) / halfW;
      mouseY = (e.clientY - halfH) / halfH;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // --- RESIZE HANDLER ---
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    // --- ANIMATION RENDER LOOP ---
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      if (document.hidden) return; // Pause rendering if tab inactive

      const elapsedTime = clock.getElapsedTime();

      // Smooth parallax camera offset (reduced motion by ~50%)
      targetX += (mouseX * 1.0 - targetX) * 0.02;
      targetY += (-mouseY * 0.75 - targetY) * 0.02;

      camera.position.x = targetX;
      camera.position.y = targetY;
      camera.lookAt(0, 0, 0);

      // Slow gentle scene rotation & float (reduced intensity by 50%)
      mainGroup.rotation.y = Math.sin(elapsedTime * 0.05) * 0.025;
      mainGroup.rotation.x = Math.cos(elapsedTime * 0.04) * 0.015;

      // Animate candidate cards gentle floating
      cardPlanes.forEach((plane, i) => {
        plane.position.y += Math.sin(elapsedTime * 0.6 + i) * 0.0025;
        plane.rotation.z = cdRotations[i].z + Math.sin(elapsedTime * 0.4 + i) * 0.01;
      });

      // Animate CV documents gently floating
      cvMeshes.forEach((mesh, i) => {
        mesh.position.y += Math.cos(elapsedTime * 0.5 + i) * 0.003;
        mesh.rotation.y += 0.001;
      });

      // Animate Skill badges rotation circle
      skillMeshes.forEach((mesh, idx) => {
        const angle = (idx / skills.length) * Math.PI * 2 + elapsedTime * 0.075;
        mesh.position.x = Math.cos(angle) * 22;
        mesh.position.z = Math.sin(angle) * 12 - 12;
        mesh.position.y = Math.sin(elapsedTime * 0.75 + idx) * 0.25;
      });

      // Rotate AI Rings
      ring1.rotation.z = elapsedTime * 0.1;
      ring2.rotation.z = -elapsedTime * 0.075;

      // Update Particle Positions
      const positions = particleGeom.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        positions[i3] += particleVelocities[i].x;
        positions[i3 + 1] += particleVelocities[i].y;
        positions[i3 + 2] += particleVelocities[i].z;

        // Bounce boundaries
        if (Math.abs(positions[i3]) > 30) particleVelocities[i].x *= -1;
        if (Math.abs(positions[i3 + 1]) > 20) particleVelocities[i].y *= -1;
        if (Math.abs(positions[i3 + 2]) > 20) particleVelocities[i].z *= -1;
      }
      particleGeom.attributes.position.needsUpdate = true;

      // Update Neural Connection Lines between close particles
      let lineVertexIdx = 0;
      const linePosArray = lineGeom.attributes.position.array as Float32Array;
      const connectDist = 9.0;

      for (let i = 0; i < particleCount && lineVertexIdx < maxConnections * 6; i++) {
        for (let j = i + 1; j < particleCount && lineVertexIdx < maxConnections * 6; j++) {
          const dx = positions[i * 3] - positions[j * 3];
          const dy = positions[i * 3 + 1] - positions[j * 3 + 1];
          const dz = positions[i * 3 + 2] - positions[j * 3 + 2];
          const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

          if (dist < connectDist) {
            linePosArray[lineVertexIdx++] = positions[i * 3];
            linePosArray[lineVertexIdx++] = positions[i * 3 + 1];
            linePosArray[lineVertexIdx++] = positions[i * 3 + 2];

            linePosArray[lineVertexIdx++] = positions[j * 3];
            linePosArray[lineVertexIdx++] = positions[j * 3 + 1];
            linePosArray[lineVertexIdx++] = positions[j * 3 + 2];
          }
        }
      }

      lineGeom.attributes.position.needsUpdate = true;
      lineMat.opacity = 0.015 + Math.sin(elapsedTime * 0.5) * 0.005;

      renderer.render(scene, camera);
    };

    // Keep initial rotation baseline
    const cdRotations = cardData.map((d) => ({ z: d.rot[2] }));

    animate();

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  const activeEvent = activeNotification || MICRO_EVENTS[currentEventIdx];

  const handleCloseToast = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsToastDismissed(true);
    if (onDismissNotification) {
      onDismissNotification();
    }
  };

  const isDark = currentTheme === 'cyber' || currentTheme === 'horizon';

  return (
    <>
      {/* 3D WebGL Canvas Layer - Enhanced AI atmosphere */}
      <div
        ref={mountRef}
        className={`fixed inset-0 pointer-events-none z-0 overflow-hidden bg-transparent transition-opacity duration-1000 ${
          currentTheme === 'cyber'
            ? 'opacity-30'
            : currentTheme === 'horizon'
            ? 'opacity-25'
            : 'opacity-[0.06]'
        }`}
        aria-hidden="true"
      />

      {/* Micro-Animation AI Live HUD Ticker Popup (Bottom Left) */}
      {!isToastDismissed && !hasOpenedNotifications && (
        <div className="fixed bottom-6 left-6 z-50 pointer-events-auto hidden sm:block">
          <div
            onClick={onNavigateToNotifications}
            className={`group backdrop-blur-2xl border rounded-2xl p-3.5 max-w-sm transition-all duration-500 transform cursor-pointer ${
              isDark
                ? 'bg-slate-900/95 border-cyan-500/30 hover:border-cyan-400 shadow-[0_15px_40px_rgba(0,0,0,0.5)] text-slate-100'
                : 'bg-white/95 border-slate-200/90 hover:border-indigo-400 shadow-[0_15px_40px_rgba(15,23,42,0.18)] text-slate-900'
            } ${
              eventVisible ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-4 opacity-0 scale-95'
            }`}
          >
            <div className="flex items-start space-x-3">
              <span className={`text-xl p-2 rounded-xl border flex-shrink-0 mt-0.5 ${
                isDark ? 'bg-cyan-950/60 border-cyan-500/40 text-cyan-300' : 'bg-emerald-50 border-emerald-200/80'
              }`}>
                {activeEvent.icon}
              </span>
              <div className="flex-1 min-w-0 pr-4">
                <div className="flex items-center justify-between gap-2">
                  <span className={`text-xs font-extrabold uppercase tracking-wide transition ${
                    isDark ? 'text-slate-100 group-hover:text-cyan-300' : 'text-slate-900 group-hover:text-indigo-600'
                  }`}>
                    {activeEvent.title}
                  </span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border shrink-0 ${
                    isDark ? 'bg-cyan-950 text-cyan-300 border-cyan-500/40' : 'bg-emerald-50 text-emerald-800 border-emerald-200/80'
                  }`}>
                    {activeEvent.badge}
                  </span>
                </div>
                <p className={`text-xs font-medium truncate mt-0.5 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                  {activeEvent.detail}
                </p>
                <div className={`flex items-center space-x-1 text-[10px] font-bold mt-1.5 opacity-0 group-hover:opacity-100 transition-opacity ${
                  isDark ? 'text-cyan-400' : 'text-indigo-600'
                }`}>
                  <span>Open Notifications Page</span>
                  <ExternalLink className="w-3 h-3" />
                </div>
              </div>

              {/* Close Button (X) to remove/dismiss popup */}
              <button
                onClick={handleCloseToast}
                title="Dismiss notification popup"
                className={`p-1 rounded-lg transition flex-shrink-0 ${
                  isDark ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800' : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
                }`}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

