import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  ArrowRight, 
  Play, 
  ShieldCheck, 
  Cpu, 
  Users, 
  BarChart3, 
  Zap, 
  CheckCircle2, 
  Globe, 
  ChevronRight, 
  X, 
  Lock, 
  Calendar, 
  Award,
  Layers,
  FileText,
  Clock,
  Workflow,
  Search,
  Check,
  Building,
  GraduationCap,
  Briefcase
} from 'lucide-react';
import { AuraLogo } from './AuraLogo';
import * as THREE from 'three';

interface AuraLandingPageProps {
  onLaunchPlatform: () => void;
}

// Nav Section Details Data Map for Top Bar Links
const NAV_SECTIONS: Record<string, {
  title: string;
  badge: string;
  description: string;
  icon: any;
  items: Array<{ title: string; desc: string; metric?: string }>;
  ctaText?: string;
}> = {
  'Features': {
    title: 'Core AI Recruitment Capabilities',
    badge: 'AUTOMATED TALENT ENGINE',
    description: 'Purpose-built AI tools designed to streamline high-volume talent acquisition for eStudy and South African enterprises.',
    icon: Cpu,
    items: [
      { title: 'Multi-Format CV Parsing', desc: 'Extracts candidates, work experience, NQF qualifications, and technical skills from PDFs and Word documents in seconds.', metric: '< 3s / CV' },
      { title: '12-Factor Semantic Suitability Matrix', desc: 'Evaluates candidates across education, skills, industry depth, salary expectations, and notice period alignment.', metric: '96.4% Accuracy' },
      { title: 'POPIA Compliance Audit Trail', desc: 'Tracks candidate consent, stores IP timestamps, and supports one-click anonymization for unbiased shortlisting.', metric: '100% Compliant' },
      { title: 'Automated Recruiter Executive Summaries', desc: 'Generates structured candidate headlines, key strengths, potential risks, and interview recommendations.', metric: 'Instant' },
    ],
    ctaText: 'Explore Features in Platform'
  },
  'Solutions': {
    title: 'Tailored Hiring Solutions',
    badge: 'INDUSTRY ADAPTIVITY',
    description: 'Custom AI screening workflows designed for South African educational institutions, corporate HR teams, and tech enterprises.',
    icon: Layers,
    items: [
      { title: 'EdTech & Higher Education (eStudy)', desc: 'Specialized screening models for Learning Designers, Curriculum Specialists, and EdTech Software Engineers.' },
      { title: 'High-Volume Graduate Intake', desc: 'Automated bulk processing that screens thousands of university applicants without recruiter burnout.' },
      { title: 'Technical Sourcing & Software Engineering', desc: 'Deep stack matching across React, Node, Python, AWS, and database engineering profiles.' },
      { title: 'POPIA-Regulated Sourcing', desc: 'Built-in privacy safeguards protecting sensitive South African applicant identity and contact records.' }
    ],
    ctaText: 'View Industry Solutions'
  },
  'Workflow': {
    title: 'End-to-End AI Recruitment Pipeline',
    badge: 'N8N & GEMINI INTEGRATED',
    description: 'Seamless 6-step automation architecture connecting applicant submission directly to interview booking.',
    icon: Workflow,
    items: [
      { title: '1. Applicant Ingestion', desc: 'CVs submitted via careers website or job boards trigger the automated workflow.' },
      { title: '2. Structuring & Entity Extraction', desc: 'Gemini AI extracts structured candidate JSON schema from raw CV text.' },
      { title: '3. 12-Factor Scoring & Ranking', desc: 'Aura reasoning engine scores education match, skills, and industry experience.' },
      { title: '4. Risk & POPIA Consent Audit', desc: 'Identifies employment gaps or location mismatches while logging compliance consent.' },
      { title: '5. Executive Summary Generation', desc: 'Recruiters receive a 1-page action summary with interview recommendations.' },
      { title: '6. Automated Communication & Scheduling', desc: 'Sends personalized emails and coordinates interview slots with candidates.' }
    ],
    ctaText: 'Launch Live Pipeline'
  },
  'Analytics': {
    title: 'Recruitment & Talent Intelligence',
    badge: 'REAL-TIME DASHBOARDS',
    description: 'Comprehensive analytics providing clear visibility into hiring funnels, time-to-fill, and candidate demographics.',
    icon: BarChart3,
    items: [
      { title: 'Shortlist Velocity & Time Saved', desc: 'Reduces candidate screening time from 14 days down to less than 24 hours.' },
      { title: 'Suitability Distribution Funnel', desc: 'Visual charts categorizing applicants into Excellent, Strong, and Potential matches.' },
      { title: 'Salary & Notice Period Alignment', desc: 'Real-time benchmarking against job budget and vacancy timeline constraints.' },
      { title: 'Recruiter Productivity Audits', desc: 'Tracks team review velocity, interview conversion rates, and offer acceptance rates.' }
    ],
    ctaText: 'Open Analytics Engine'
  },
  'Security & POPIA': {
    title: 'POPIA Compliance & Enterprise Security',
    badge: 'SOUTH AFRICAN PRIVACY LAW',
    description: 'Built according to the Protection of Personal Information Act (POPIA) principles for ethical, transparent data management.',
    icon: ShieldCheck,
    items: [
      { title: 'Explicit Candidate Consent Engine', desc: 'Records consent timestamps, IP addresses, and clear opt-in tracking for every applicant.' },
      { title: 'Anonymized Unbiased Mode', desc: 'Option to mask candidate names and photos during initial screening to prevent implicit bias.' },
      { title: 'Data Retention & Purge Policy', desc: 'Automated data lifecycle controls ensuring candidate information is securely archived or purged.' },
      { title: 'Role-Based Access Control (RBAC)', desc: 'Encrypted database storage and strict recruiter access permissions via Supabase.' }
    ],
    ctaText: 'Review Security Controls'
  },
  'Enterprise Pricing': {
    title: 'Scalable Enterprise Plans',
    badge: 'ESTUDY & CORPORATE TIERS',
    description: 'Transparent pricing structured around team size, vacancy volume, and customized AI model configurations.',
    icon: Zap,
    items: [
      { title: 'Growth Tier (R4,500 / mo)', desc: 'Up to 5 active vacancies, 200 candidate screenings/mo, standard POPIA compliance.' },
      { title: 'Professional Tier (R12,000 / mo)', desc: 'Up to 25 active vacancies, unlimited screening, custom NQF matching, n8n automation.' },
      { title: 'Enterprise Unlimited (Custom)', desc: 'Unlimited vacancies, dedicated Supabase instance, custom LLM fine-tuning, SLA support.' }
    ],
    ctaText: 'Request Custom Quote'
  },
  'Resources': {
    title: 'Recruitment Knowledge Base & Docs',
    badge: 'DOCS & WHITE PAPERS',
    description: 'Guides, prompts, and documentation to help your HR team maximize AI-assisted recruitment.',
    icon: FileText,
    items: [
      { title: 'POPIA Compliance Checklist for HR', desc: 'Comprehensive guide to candidate consent management in South Africa.' },
      { title: 'Prompts for Recruiter Summaries', desc: 'Best practices for customizing Gemini AI candidate evaluation rules.' },
      { title: 'Supabase & n8n Integration Guide', desc: 'Developer documentation for connecting custom HRIS and ATS webhooks.' },
      { title: 'NQF Level Qualification Reference', desc: 'South African SAQA framework mapping for academic degree evaluation.' }
    ],
    ctaText: 'Browse Knowledge Base'
  }
};

export const AuraLandingPage: React.FC<AuraLandingPageProps> = ({ onLaunchPlatform }) => {
  // Cursor Spotlight Position state & lerp ref
  const mousePosRef = useRef({ x: typeof window !== 'undefined' ? window.innerWidth / 2 : 500, y: 300 });
  const targetMouseRef = useRef({ x: typeof window !== 'undefined' ? window.innerWidth / 2 : 500, y: 300 });
  const [spotlightPos, setSpotlightPos] = useState({ x: 500, y: 300 });

  // Page Transition state
  const [isLaunching, setIsLaunching] = useState(false);

  // Modals state
  const [activeModal, setActiveModal] = useState<'demo' | 'screening' | 'navSection' | null>(null);
  const [navSectionKey, setNavSectionKey] = useState<string>('Features');

  // Watch AI Screening Interactive Stage state (0: Ingestion & Parsing, 1: 12-Factor Scoring, 2: POPIA Audit, 3: Recruiter Brief)
  const [screeningStage, setScreeningStage] = useState<number>(0);
  const [isAutoPlayingScreening, setIsAutoPlayingScreening] = useState<boolean>(true);

  // Canvas 3D Ref for R3F / Three.js
  const canvasContainerRef = useRef<HTMLDivElement>(null);

  // 1. Mouse Spotlight Lerp Loop
  useEffect(() => {
    let animationFrameId: number;

    const handleMouseMove = (e: MouseEvent) => {
      targetMouseRef.current = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener('mousemove', handleMouseMove);

    const updateSpotlight = () => {
      mousePosRef.current.x += (targetMouseRef.current.x - mousePosRef.current.x) * 0.12;
      mousePosRef.current.y += (targetMouseRef.current.y - mousePosRef.current.y) * 0.12;
      setSpotlightPos({ x: mousePosRef.current.x, y: mousePosRef.current.y });
      animationFrameId = requestAnimationFrame(updateSpotlight);
    };

    animationFrameId = requestAnimationFrame(updateSpotlight);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // 2. Screening Stage Auto-Play Interval
  useEffect(() => {
    if (activeModal !== 'screening' || !isAutoPlayingScreening) return;
    const interval = setInterval(() => {
      setScreeningStage((prev) => (prev + 1) % 4);
    }, 3500);
    return () => clearInterval(interval);
  }, [activeModal, isAutoPlayingScreening]);

  // 3. Three.js Background & Holographic AI Neural Core
  useEffect(() => {
    if (!canvasContainerRef.current) return;

    const container = canvasContainerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    camera.position.z = 18;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Group for Holographic Neural Orb
    const orbGroup = new THREE.Group();
    orbGroup.position.set(width > 1024 ? 6.2 : (width > 768 ? 4.2 : 0), 0, 0);
    scene.add(orbGroup);

    // Inner Core Sphere
    const coreGeo = new THREE.IcosahedronGeometry(2.8, 3);
    const coreMat = new THREE.MeshBasicMaterial({
      color: 0x5E60FF,
      wireframe: true,
      transparent: true,
      opacity: 0.35,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    orbGroup.add(coreMesh);

    // Solid inner core glow
    const innerGeo = new THREE.SphereGeometry(1.6, 32, 32);
    const innerMat = new THREE.MeshBasicMaterial({
      color: 0x1C4D3F,
      transparent: true,
      opacity: 0.6,
    });
    const innerMesh = new THREE.Mesh(innerGeo, innerMat);
    orbGroup.add(innerMesh);

    // Rotating Concentric Rings
    const ringMat1 = new THREE.MeshBasicMaterial({ color: 0x06B6D4, wireframe: true, transparent: true, opacity: 0.5 });
    const ring1 = new THREE.Mesh(new THREE.TorusGeometry(4.2, 0.03, 16, 100), ringMat1);
    ring1.rotation.x = Math.PI / 3;
    orbGroup.add(ring1);

    const ringMat2 = new THREE.MeshBasicMaterial({ color: 0x8B5CF6, wireframe: true, transparent: true, opacity: 0.4 });
    const ring2 = new THREE.Mesh(new THREE.TorusGeometry(5.2, 0.02, 16, 100), ringMat2);
    ring2.rotation.y = Math.PI / 4;
    orbGroup.add(ring2);

    const ringMat3 = new THREE.MeshBasicMaterial({ color: 0x2D6A4F, wireframe: true, transparent: true, opacity: 0.5 });
    const ring3 = new THREE.Mesh(new THREE.TorusGeometry(6.2, 0.015, 16, 100), ringMat3);
    ring3.rotation.z = Math.PI / 6;
    orbGroup.add(ring3);

    // Particle Swarm (2200 Neural Data Points)
    const particleCount = 2200;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const colorOptions = [
      new THREE.Color('#06B6D4'),
      new THREE.Color('#3B82F6'),
      new THREE.Color('#5E60FF'),
      new THREE.Color('#2D6A4F'),
      new THREE.Color('#EC4899'),
    ];

    for (let i = 0; i < particleCount; i++) {
      const radius = 12 + Math.random() * 25;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);

      const col = colorOptions[Math.floor(Math.random() * colorOptions.length)];
      colors[i * 3] = col.r;
      colors[i * 3 + 1] = col.g;
      colors[i * 3 + 2] = col.b;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.12,
      vertexColors: true,
      transparent: true,
      opacity: 0.65,
    });
    const particleSystem = new THREE.Points(particleGeo, particleMat);
    scene.add(particleSystem);

    // Animation Loop
    let reqId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      reqId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      orbGroup.rotation.y = elapsedTime * 0.18;
      orbGroup.rotation.x = Math.sin(elapsedTime * 0.1) * 0.15;

      coreMesh.rotation.y = -elapsedTime * 0.25;
      ring1.rotation.z = elapsedTime * 0.3;
      ring2.rotation.x = elapsedTime * 0.2;
      ring3.rotation.y = elapsedTime * 0.15;

      particleSystem.rotation.y = elapsedTime * 0.04;
      particleSystem.rotation.x = Math.cos(elapsedTime * 0.03) * 0.05;

      const targetX = (targetMouseRef.current.x / window.innerWidth - 0.5) * 1.5;
      const targetY = (targetMouseRef.current.y / window.innerHeight - 0.5) * 1.5;
      camera.position.x += (targetX - camera.position.x) * 0.05;
      camera.position.y += (-targetY - camera.position.y) * 0.05;
      camera.lookAt(scene.position);

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!canvasContainerRef.current) return;
      const newW = canvasContainerRef.current.clientWidth;
      const newH = canvasContainerRef.current.clientHeight;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
      orbGroup.position.set(newW > 1024 ? 6.2 : (newW > 768 ? 4.2 : 0), 0, 0);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(reqId);
      window.removeEventListener('resize', handleResize);
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  // Launch transition handler
  const handleStartLaunch = () => {
    setIsLaunching(true);
    setTimeout(() => {
      onLaunchPlatform();
    }, 1000);
  };

  const handleOpenNavSection = (key: string) => {
    setNavSectionKey(key);
    setActiveModal('navSection');
  };

  const selectedNavData = NAV_SECTIONS[navSectionKey] || NAV_SECTIONS['Features'];

  return (
    <div className="relative w-full min-h-dvh bg-[#08111A] text-white font-sans overflow-hidden select-none">
      {/* BACKGROUND 3D CANVAS */}
      <div ref={canvasContainerRef} className="absolute inset-0 z-0 pointer-events-none opacity-80" />

      {/* AMBIENT GLOW GRADIENTS */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-gradient-to-br from-[#1C4D3F]/30 via-[#2D6A4F]/20 to-transparent rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[700px] h-[700px] bg-gradient-to-tr from-[#5E60FF]/25 via-[#3B82F6]/15 to-transparent rounded-full blur-[160px] pointer-events-none" />

      {/* NOISE & GRID OVERLAY */}
      <div 
        className="absolute inset-0 z-[1] pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(#ffffff 1px, transparent 0)`,
          backgroundSize: '28px 28px'
        }}
      />

      {/* SPOTLIGHT REVEAL LAYER MASK */}
      <div 
        className="absolute inset-0 z-[2] pointer-events-none transition-opacity duration-300"
        style={{
          background: `radial-gradient(340px circle at ${spotlightPos.x}px ${spotlightPos.y}px, rgba(94, 96, 255, 0.18), transparent 80%)`,
        }}
      />

      {/* PAGE WRAPPER / HERO (100dvh) */}
      <div className="relative z-10 min-h-dvh flex flex-col justify-between max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
        
        {/* TOP NAVIGATION BAR */}
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: 'easeOut' }}
          className="flex items-center justify-between py-3 px-4 rounded-2xl bg-slate-900/40 backdrop-blur-md border border-white/10 shadow-2xl"
        >
          {/* Left Logo */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => handleOpenNavSection('Features')}>
            <AuraLogo size="md" showText={true} variant="dark" />
          </div>

          {/* Center Links */}
          <nav className="hidden md:flex items-center space-x-6 text-xs font-medium text-slate-300">
            {[
              { id: 'Features', label: 'Features' },
              { id: 'Solutions', label: 'Solutions' },
              { id: 'Workflow', label: 'Workflow' },
              { id: 'Analytics', label: 'Analytics' },
              { id: 'Security & POPIA', label: 'Security & POPIA' },
              { id: 'Enterprise Pricing', label: 'Enterprise Pricing' },
              { id: 'Resources', label: 'Resources' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => handleOpenNavSection(item.id)}
                className="hover:text-white transition-colors py-1 relative group"
              >
                <span>{item.label}</span>
                <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-gradient-to-r from-cyan-400 to-indigo-500 transition-all duration-300 group-hover:w-full" />
              </button>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <button
              onClick={() => setActiveModal('demo')}
              className="text-xs font-semibold text-slate-200 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 px-3.5 py-2 rounded-xl transition backdrop-blur-xs"
            >
              Book Demo
            </button>
            <button
              onClick={handleStartLaunch}
              className="group relative inline-flex items-center gap-2 text-xs font-bold text-white bg-gradient-to-r from-[#1C4D3F] via-[#2D6A4F] to-[#5E60FF] hover:from-[#256a57] hover:to-[#6d6eff] px-5 py-2.5 rounded-xl shadow-lg shadow-[#1C4D3F]/30 hover:shadow-[#5E60FF]/40 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-300 animate-pulse" />
              <span>Launch Platform</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </motion.header>

        {/* HERO MAIN BODY */}
        <div className="my-auto py-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* LEFT COLUMN: TEXT & ACTIONS */}
          <div className="lg:col-span-7 space-y-6 text-left flex flex-col items-start">
            
            {/* Enterprise Badge */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-800/80 border border-indigo-500/30 text-indigo-300 text-xs font-semibold backdrop-blur-md shadow-inner"
            >
              <span className="flex h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
              <Cpu className="w-3.5 h-3.5 text-cyan-400" />
              <span>AURA RECRUITMENT FLOW AI 3.0 • ENTERPRISE SUITE</span>
              <span className="text-slate-500">|</span>
              <span className="text-emerald-400 text-[11px] font-mono">POPIA COMPLIANT</span>
            </motion.div>

            {/* Main Headline */}
            <div className="space-y-1.5">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1 }}
                className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.05] text-white"
              >
                Hire Smarter.
              </motion.h1>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.25 }}
                className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.08] text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-300 to-purple-400"
              >
                Powered by Artificial Intelligence.
              </motion.h1>
            </div>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-xl font-light"
            >
              Transform recruitment with enterprise AI that screens applicants, ranks candidates, automates communication, and accelerates hiring while recruiters stay in complete control.
            </motion.p>

            {/* ACTION BUTTONS */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.55 }}
              className="flex flex-wrap items-center gap-4 pt-1"
            >
              <button
                onClick={handleStartLaunch}
                className="group relative inline-flex items-center gap-3 text-sm font-bold text-white bg-gradient-to-r from-[#1C4D3F] via-[#2D6A4F] to-[#5E60FF] hover:from-[#226150] hover:to-[#6c6dff] px-8 py-3.5 rounded-2xl shadow-xl shadow-[#1C4D3F]/40 hover:shadow-[#5E60FF]/50 transition-all transform hover:-translate-y-1 active:translate-y-0"
              >
                <Zap className="w-4 h-4 text-cyan-300" />
                <span>Launch Platform</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
              </button>

              <button
                onClick={() => { setScreeningStage(0); setActiveModal('screening'); }}
                className="inline-flex items-center gap-2.5 text-sm font-semibold text-slate-200 hover:text-white bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 px-6 py-3.5 rounded-2xl transition backdrop-blur-md shadow-lg group"
              >
                <div className="w-5 h-5 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
                  <Play className="w-3 h-3 fill-indigo-400" />
                </div>
                <span>Watch AI Screening</span>
              </button>
            </motion.div>

            {/* REVEAL LAYER SPOTLIGHT INFORMER */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="pt-1 flex items-center gap-3 text-xs text-slate-400"
            >
              <div className="w-2 h-2 rounded-full bg-indigo-500 animate-ping" />
              <span>Hover cursor over screen to reveal the <strong className="text-cyan-300 font-semibold">AI Intelligence Layer</strong></span>
            </motion.div>

          </div>

          {/* RIGHT COLUMN: DEDICATED SPACE FOR ROTATING 3D NEURAL PLANET */}
          <div className="hidden lg:flex lg:col-span-5 h-[380px] w-full items-center justify-center relative pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="absolute top-4 right-2 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-cyan-500/30 text-[11px] font-mono text-cyan-300 backdrop-blur-md shadow-xl flex items-center gap-2"
            >
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span>Neural Core Active</span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="absolute bottom-6 left-2 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-indigo-500/30 text-[11px] font-mono text-indigo-300 backdrop-blur-md shadow-xl flex items-center gap-2"
            >
              <span className="w-2 h-2 rounded-full bg-indigo-400 animate-ping" />
              <span>Candidate Scoring: 96%</span>
            </motion.div>
          </div>

        </div>

        {/* BOTTOM STATS BAR - INFORMATION IS STRICTLY BELOW THE NUMBERS */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="mt-auto py-5 px-6 rounded-2xl bg-slate-900/85 border border-slate-800/90 backdrop-blur-xl shadow-2xl grid grid-cols-2 md:grid-cols-5 gap-6 divide-y md:divide-y-0 md:divide-x divide-slate-800 text-center"
        >
          {/* Stat 1: Speed */}
          <div className="p-3 space-y-2 flex flex-col items-center justify-center">
            <div className="text-2xl sm:text-3xl font-black text-cyan-400 font-mono tracking-tight flex items-center justify-center gap-1.5">
              <Zap className="w-5 h-5 text-cyan-400 inline-block" />
              <span>&lt; 30s</span>
            </div>
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-white block">Screening Speed</span>
              <span className="text-[11px] text-slate-400 block leading-tight">
                Instant CV parsing &amp; 12-factor evaluation
              </span>
            </div>
          </div>

          {/* Stat 2: 12-Factor */}
          <div className="p-3 space-y-2 flex flex-col items-center justify-center pt-4 md:pt-3">
            <div className="text-2xl sm:text-3xl font-black text-indigo-400 font-mono tracking-tight flex items-center justify-center gap-1.5">
              <Cpu className="w-5 h-5 text-indigo-400 inline-block" />
              <span>12-Factor</span>
            </div>
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-white block">Suitability Matrix</span>
              <span className="text-[11px] text-slate-400 block leading-tight">
                NQF degree, skills, salary &amp; notice fit
              </span>
            </div>
          </div>

          {/* Stat 3: POPIA */}
          <div className="p-3 space-y-2 flex flex-col items-center justify-center pt-4 md:pt-3">
            <div className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono tracking-tight flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-5 h-5 text-emerald-400 inline-block" />
              <span>100%</span>
            </div>
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-white block">POPIA Compliant</span>
              <span className="text-[11px] text-slate-400 block leading-tight">
                Candidate privacy consent &amp; audit logging
              </span>
            </div>
          </div>

          {/* Stat 4: Accuracy */}
          <div className="p-3 space-y-2 flex flex-col items-center justify-center pt-4 md:pt-3">
            <div className="text-2xl sm:text-3xl font-black text-amber-400 font-mono tracking-tight flex items-center justify-center gap-1.5">
              <BarChart3 className="w-5 h-5 text-amber-400 inline-block" />
              <span>96.4%</span>
            </div>
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-white block">Scoring Accuracy</span>
              <span className="text-[11px] text-slate-400 block leading-tight">
                Calibrated with hiring manager decisions
              </span>
            </div>
          </div>

          {/* Stat 5: Time Saved */}
          <div className="p-3 space-y-2 flex flex-col items-center justify-center pt-4 md:pt-3 col-span-2 md:col-span-1">
            <div className="text-2xl sm:text-3xl font-black text-purple-400 font-mono tracking-tight flex items-center justify-center gap-1.5">
              <Clock className="w-5 h-5 text-purple-400 inline-block" />
              <span>85%</span>
            </div>
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-white block">Time Saved</span>
              <span className="text-[11px] text-slate-400 block leading-tight">
                Accelerated shortlist-to-interview velocity
              </span>
            </div>
          </div>
        </motion.div>

      </div>

      {/* FULLPAGE WARP TRANSITION OVERLAY */}
      <AnimatePresence>
        {isLaunching && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9 }}
            className="fixed inset-0 z-50 bg-gradient-to-tr from-[#08111A] via-[#1C4D3F] to-[#5E60FF] flex flex-col items-center justify-center text-center p-6 backdrop-blur-3xl"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1.1, opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="space-y-4"
            >
              <div className="w-16 h-16 mx-auto rounded-2xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300 animate-spin">
                <Cpu className="w-8 h-8" />
              </div>
              <h2 className="text-3xl font-black text-white tracking-tight">Launching Aura Recruitment Flow AI</h2>
              <p className="text-sm text-cyan-200 font-light">Initializing recruiter workbench, Supabase candidate data & POPIA engine...</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MODAL 1: BOOK DEMO MODAL */}
      <AnimatePresence>
        {activeModal === 'demo' && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-slate-900 border border-slate-700/80 rounded-3xl p-6 sm:p-8 max-w-lg w-full text-white shadow-2xl relative space-y-5"
            >
              <button
                onClick={() => setActiveModal(null)}
                className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-full bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="space-y-1">
                <div className="inline-flex items-center gap-2 text-xs font-semibold text-cyan-400 bg-cyan-950/60 border border-cyan-800 px-3 py-1 rounded-full">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Enterprise VIP Consultation</span>
                </div>
                <h3 className="text-2xl font-black tracking-tight text-white">Book an Aura Product Demo</h3>
                <p className="text-xs text-slate-400">
                  Experience how South Africa's leading enterprises automate screening, scoring, and compliance.
                </p>
              </div>

              <form onSubmit={(e) => { e.preventDefault(); alert('Demo request submitted! An Aura Enterprise representative will contact you shortly.'); setActiveModal(null); }} className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Work Email</label>
                  <input
                    type="email"
                    required
                    placeholder="recruiter@estudy.co.za"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Company Name</label>
                    <input
                      type="text"
                      required
                      placeholder="eStudy South Africa"
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Team Size</label>
                    <select className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-cyan-400">
                      <option>10 - 50 employees</option>
                      <option>50 - 250 employees</option>
                      <option>250+ Enterprise</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Primary Hiring Goal</label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Automating CV screening for Learning Designers & Software Engineers..."
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-bold py-3 rounded-xl transition shadow-lg text-xs flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Confirm Demo Request</span>
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 2: ENHANCED & INFORMATIVE "WATCH AI SCREENING" SIMULATION */}
      <AnimatePresence>
        {activeModal === 'screening' && (
          <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-slate-900 border border-slate-700 rounded-3xl p-6 sm:p-8 max-w-3xl w-full text-white shadow-2xl relative space-y-6 max-h-[90vh] overflow-y-auto"
            >
              <button
                onClick={() => setActiveModal(null)}
                className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-full bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Header */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 bg-emerald-950/80 border border-emerald-700/80 px-3 py-1 rounded-full">
                    <Cpu className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Aura AI Reasoning Engine • Interactive Simulation</span>
                  </span>
                  <button
                    onClick={() => setIsAutoPlayingScreening(!isAutoPlayingScreening)}
                    className="text-[11px] font-mono text-slate-400 hover:text-white bg-slate-800 px-2.5 py-1 rounded-full border border-slate-700"
                  >
                    {isAutoPlayingScreening ? 'Pause Auto-Play' : 'Resume Auto-Play'}
                  </button>
                </div>

                <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  How Aura Evaluates Applicants in Real-Time
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-light">
                  Step through the 4 automated stages used by Aura to process unstructured CV files, evaluate 12-factor fit against job vacancies, perform POPIA regulatory checks, and generate recruiter-ready briefings.
                </p>
              </div>

              {/* STAGE TAB SELECTOR */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-slate-950 p-1.5 rounded-2xl border border-slate-800">
                {[
                  { id: 0, title: '1. CV Parsing', icon: FileText },
                  { id: 1, title: '2. 12-Factor Scoring', icon: Cpu },
                  { id: 2, title: '3. POPIA & Risk', icon: ShieldCheck },
                  { id: 3, title: '4. Recruiter Brief', icon: CheckCircle2 },
                ].map((st) => {
                  const IconComp = st.icon;
                  const isActive = screeningStage === st.id;
                  return (
                    <button
                      key={st.id}
                      onClick={() => { setScreeningStage(st.id); setIsAutoPlayingScreening(false); }}
                      className={`flex items-center justify-center gap-1.5 text-xs font-semibold py-2.5 px-2 rounded-xl transition ${
                        isActive
                          ? 'bg-gradient-to-r from-cyan-600 to-indigo-600 text-white shadow-md'
                          : 'text-slate-400 hover:text-white hover:bg-slate-900'
                      }`}
                    >
                      <IconComp className="w-3.5 h-3.5" />
                      <span className="truncate">{st.title}</span>
                    </button>
                  );
                })}
              </div>

              {/* DYNAMIC STAGE CONTENT CONTAINER */}
              <div className="bg-slate-950 rounded-2xl p-5 border border-slate-800 space-y-4 font-mono text-xs relative overflow-hidden">
                
                {/* STAGE 0: CV PARSING & ENTITY EXTRACTION */}
                {screeningStage === 0 && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                    <div className="flex justify-between items-center text-[11px] border-b border-slate-800 pb-2">
                      <span className="text-cyan-400 font-bold flex items-center gap-1.5">
                        <FileText className="w-4 h-4" /> STAGE 1: MULTI-FORMAT CV PARSING
                      </span>
                      <span className="text-emerald-400 font-bold bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800">
                        Extraction Confidence: 98.6%
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <span className="text-[10px] text-slate-400 block uppercase tracking-wider">Raw Input CV (Sipho_Ndlovu_CV.pdf)</span>
                        <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800 text-[11px] text-slate-300 italic font-sans leading-relaxed">
                          "Full Stack Developer with 5 years experience at EduTech Innovations SA. BSc Computer Science (Wits, NQF Level 7). Proficient in React, TypeScript, Node.js, REST APIs, and MySQL. Expected Salary: R750,000/annum. Notice: 30 days."
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <span className="text-[10px] text-cyan-300 block uppercase tracking-wider">Structured JSON Entities Extracted</span>
                        <div className="bg-slate-900 p-3 rounded-xl border border-cyan-900/60 text-[11px] text-cyan-200 space-y-1">
                          <div><span className="text-slate-400">Name:</span> Sipho Ndlovu</div>
                          <div><span className="text-slate-400">Qualification:</span> BSc Computer Science (Wits) [NQF 7]</div>
                          <div><span className="text-slate-400">Commercial Exp:</span> 5.0 Years (EdTech Industry)</div>
                          <div><span className="text-slate-400">Expected Salary:</span> R750,000 ZAR / annum</div>
                          <div><span className="text-slate-400">Notice Period:</span> 30 Days (1 Month)</div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-400 block mb-1.5 uppercase tracking-wider">Extracted Technical Stack</span>
                      <div className="flex flex-wrap gap-1.5 font-sans">
                        {['JavaScript', 'TypeScript', 'React 18', 'Node.js', 'REST APIs', 'MySQL', 'Git/GitHub', 'Generative AI APIs', 'Agile'].map((skill) => (
                          <span key={skill} className="bg-indigo-950/80 text-indigo-300 border border-indigo-700/60 px-2.5 py-1 rounded-lg text-xs font-semibold">
                            ✓ {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* STAGE 1: 12-FACTOR SEMANTIC SUITABILITY MATRIX */}
                {screeningStage === 1 && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4 font-sans">
                    <div className="flex justify-between items-center text-[11px] border-b border-slate-800 pb-2 font-mono">
                      <span className="text-indigo-400 font-bold flex items-center gap-1.5">
                        <Cpu className="w-4 h-4" /> STAGE 2: 12-FACTOR SEMANTIC SUITABILITY MATCH
                      </span>
                      <span className="text-emerald-400 font-bold bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800">
                        Overall Score: 94 / 100
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                      {[
                        { label: 'Education & NQF Match', score: 95, color: 'bg-emerald-500' },
                        { label: 'Technical Skills Match', score: 96, color: 'bg-cyan-500' },
                        { label: 'Commercial Experience', score: 94, color: 'bg-indigo-500' },
                        { label: 'EdTech Industry Fit', score: 95, color: 'bg-emerald-500' },
                        { label: 'Salary Alignment (R750k)', score: 95, color: 'bg-cyan-500' },
                        { label: 'Notice Period (30 Days)', score: 90, color: 'bg-amber-500' },
                      ].map((factor) => (
                        <div key={factor.label} className="bg-slate-900 p-2.5 rounded-xl border border-slate-800 space-y-1">
                          <div className="flex justify-between text-[11px] font-medium text-slate-300">
                            <span className="truncate">{factor.label}</span>
                            <span className="font-bold font-mono text-white">{factor.score}%</span>
                          </div>
                          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                            <div className={`h-full ${factor.color}`} style={{ width: `${factor.score}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="p-3 bg-indigo-950/40 border border-indigo-800/60 rounded-xl text-xs text-indigo-200 leading-relaxed font-sans">
                      <strong className="text-white block mb-0.5">Aura AI Reasoning Evaluation:</strong>
                      Candidate exceeds the 3-year minimum experience requirement for Job #101 (Software Developer) with 5 years in South African digital learning platform engineering. Education (BSc Computer Science, Wits - NQF Level 7) fully satisfies qualifications.
                    </div>
                  </motion.div>
                )}

                {/* STAGE 2: POPIA REGULATORY COMPLIANCE & RISK AUDIT */}
                {screeningStage === 2 && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4 font-sans">
                    <div className="flex justify-between items-center text-[11px] border-b border-slate-800 pb-2 font-mono">
                      <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                        <ShieldCheck className="w-4 h-4" /> STAGE 3: POPIA REGULATORY COMPLIANCE & RISK AUDIT
                      </span>
                      <span className="text-emerald-400 font-bold bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800">
                        0 Critical Risks
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="bg-slate-900 p-3 rounded-xl border border-emerald-800/80 space-y-2">
                        <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
                          <ShieldCheck className="w-4 h-4" />
                          <span>POPIA Candidate Consent Verified</span>
                        </div>
                        <div className="text-[11px] text-slate-300 font-mono space-y-0.5">
                          <div>Timestamp: 2026-08-04T09:15:00Z</div>
                          <div>IP Address: 102.132.214.12</div>
                          <div>Consent Scope: Recruitment & Skill Evaluation</div>
                        </div>
                      </div>

                      <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 space-y-2">
                        <div className="flex items-center gap-2 text-xs font-bold text-cyan-400">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Employment Stability & Location Check</span>
                        </div>
                        <div className="text-[11px] text-slate-300 font-mono space-y-0.5">
                          <div>Employment Gaps: None detected (100%)</div>
                          <div>Location: Johannesburg, Gauteng (Hybrid Fit)</div>
                          <div>Notice Period: 30 Days (Standard)</div>
                        </div>
                      </div>
                    </div>

                    <div className="p-3 bg-emerald-950/40 border border-emerald-800/60 rounded-xl text-xs text-emerald-200">
                      <strong className="text-white block mb-0.5">Compliance Summary:</strong>
                      Candidate data is fully encrypted and stored according to South African POPIA regulations. No anonymization flags raised. Proceed to shortlist.
                    </div>
                  </motion.div>
                )}

                {/* STAGE 3: RECRUITER BRIEF & RECOMMENDATION */}
                {screeningStage === 3 && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4 font-sans">
                    <div className="flex justify-between items-center text-[11px] border-b border-slate-800 pb-2 font-mono">
                      <span className="text-purple-400 font-bold flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4" /> STAGE 4: EXECUTIVE RECRUITER ACTION BRIEF
                      </span>
                      <span className="text-emerald-400 font-bold bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800">
                        Status: Shortlisted
                      </span>
                    </div>

                    <div className="bg-slate-900 p-4 rounded-xl border border-indigo-800/80 space-y-3">
                      <div>
                        <span className="text-[10px] text-cyan-400 block font-mono uppercase tracking-wider mb-0.5">AI Executive Headline</span>
                        <h4 className="text-sm font-bold text-white">
                          Outstanding Software Developer with 5 Years EdTech & React/TypeScript Experience
                        </h4>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                          <strong className="text-emerald-400 block mb-1">Key Strengths:</strong>
                          <p className="text-slate-300 text-[11px] leading-relaxed">
                            Flawless technical alignment with eStudy stack (React, TypeScript, Node.js, REST APIs). Strong academic background from Wits.
                          </p>
                        </div>
                        <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                          <strong className="text-cyan-400 block mb-1">Budget & Notice Fit:</strong>
                          <p className="text-slate-300 text-[11px] leading-relaxed">
                            Expected salary R750k sits comfortably within the R650k-R880k job budget. 30 days availability.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-1 border-t border-slate-800">
                        <span className="text-xs text-slate-400">Recruiter Recommendation:</span>
                        <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold px-3 py-1 rounded-full">
                          ★ Fast-Track to Technical Panel Interview
                        </span>
                      </div>
                    </div>
                  </motion.div>
                )}

              </div>

              {/* FOOTER ACTIONS */}
              <div className="flex flex-wrap justify-between items-center gap-3 pt-2">
                <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
                  <span>Stage {screeningStage + 1} of 4</span>
                  <span className="text-slate-600">•</span>
                  <span>Click tabs above or launch full platform to test your own CVs</span>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setActiveModal(null)}
                    className="text-xs text-slate-400 hover:text-white px-3 py-2"
                  >
                    Close Demo
                  </button>
                  <button
                    onClick={() => { setActiveModal(null); handleStartLaunch(); }}
                    className="bg-gradient-to-r from-emerald-600 via-cyan-600 to-indigo-600 hover:from-emerald-500 hover:to-indigo-500 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition shadow-lg flex items-center gap-2"
                  >
                    <span>Try Live on Recruiter Platform</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 3: NAV SECTION INFORMATION DRAWER (UNIQUE CONTENT PER TOP NAV LINK) */}
      <AnimatePresence>
        {activeModal === 'navSection' && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-900 border border-slate-700 rounded-3xl p-6 sm:p-8 max-w-xl w-full text-white shadow-2xl relative space-y-5"
            >
              <button
                onClick={() => setActiveModal(null)}
                className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-full bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Header */}
              <div className="space-y-1.5">
                <div className="inline-flex items-center gap-2 text-xs font-semibold text-cyan-400 bg-cyan-950/80 border border-cyan-800 px-3 py-1 rounded-full">
                  <Award className="w-3.5 h-3.5" />
                  <span>{selectedNavData.badge}</span>
                </div>
                <h3 className="text-2xl font-black text-white">{selectedNavData.title}</h3>
                <p className="text-xs sm:text-sm text-slate-300 font-light leading-relaxed">
                  {selectedNavData.description}
                </p>
              </div>

              {/* Items List */}
              <div className="space-y-3 text-xs text-slate-300 bg-slate-950/80 p-4.5 rounded-2xl border border-slate-800">
                {selectedNavData.items.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3 py-1">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <div className="flex justify-between items-center">
                        <strong className="text-white block font-semibold">{item.title}</strong>
                        {item.metric && (
                          <span className="text-[10px] font-mono text-cyan-300 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">
                            {item.metric}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 leading-normal mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer Actions */}
              <div className="flex justify-between items-center pt-2">
                <button
                  onClick={() => setActiveModal('demo')}
                  className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1"
                >
                  <span>Book VIP Enterprise Consult</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => { setActiveModal(null); handleStartLaunch(); }}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition shadow-lg flex items-center gap-2"
                >
                  <span>{selectedNavData.ctaText || 'Enter Platform'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

