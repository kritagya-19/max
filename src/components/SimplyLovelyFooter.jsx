import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './SimplyLovelyFooter.css';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Custom WebGL Shaders for Cosmic Racing Background
 */
const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform sampler2D uTexture;
  uniform float uTime;
  uniform float uDisplacement;
  uniform vec2 uResolution;
  uniform vec2 uTextureSize;
  uniform vec2 uMouse;

  varying vec2 vUv;

  void main() {
    // 1. Maintain cover aspect ratio mapping without stretching
    vec2 s = uResolution;
    vec2 i = uTextureSize;
    float rs = s.x / s.y;
    float ri = i.x / i.y;
    vec2 newUv = vUv;
    if (rs > ri) {
      newUv.y = (vUv.y - 0.5) * (ri / rs) + 0.5;
    } else {
      newUv.x = (vUv.x - 0.5) * (rs / ri) + 0.5;
    }

    // 2. Mouse parallax shift
    vec2 mouseOffset = uMouse * 0.022;
    newUv += mouseOffset;

    // 3. Atmospheric breathing wave
    float wave = sin(newUv.x * 7.0 + uTime * 0.8) * cos(newUv.y * 7.0 + uTime * 0.6) * 0.0035;
    newUv += vec2(wave, -wave * 0.5);

    // 4. Entrance Shockwave / Liquid Displacement
    float distFromCenter = length(vUv - vec2(0.5, 0.65));
    float shock = sin(distFromCenter * 15.0 - uTime * 3.5) * uDisplacement * 0.038;
    vec2 dispUv = newUv + vec2(shock, shock * 0.65);

    // 5. Chromatic aberration split during displacement
    float split = uDisplacement * 0.009;
    vec4 cr = texture2D(uTexture, dispUv + vec2(split, 0.0));
    vec4 cg = texture2D(uTexture, dispUv);
    vec4 cb = texture2D(uTexture, dispUv - vec2(split, 0.0));

    vec3 color = vec3(cr.r, cg.g, cb.b);

    // Subtle atmospheric nebula pulse
    float pulse = (sin(uTime * 1.4) * 0.5 + 0.5) * 0.08;
    color += vec3(0.02, 0.07, 0.16) * pulse;

    // Cinematic edge vignette
    float vignette = smoothstep(1.35, 0.45, length(vUv - 0.5));
    color *= (0.78 + 0.22 * vignette);

    gl_FragColor = vec4(color, 1.0);
  }
`;

/**
 * SimplyLovelyFooter Component
 *
 * A premium, cinematic, scroll-animated footer for high-end Formula 1 web experiences.
 * Recreates the iconic "SIMPLY LOVELY" composition featuring Max Verstappen,
 * layered typography spanning 80–85% viewport width, custom WebGL displacement background,
 * and pinned GSAP ScrollTrigger timeline sequence.
 */
export const SimplyLovelyFooter = ({
  characterSrc = '/assets/max.png',
  bgSrc = '/assets/bg.png',
  titleTop = 'SIMPLY',
  titleBottom = 'LOVELY'
}) => {
  const wrapperRef = useRef(null);
  const footerRef = useRef(null);
  const canvasRef = useRef(null);
  const wordSimplyRef = useRef(null);
  const wordLovelyRef = useRef(null);
  const characterWrapRef = useRef(null);
  const characterImgRef = useRef(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const footer = footerRef.current;
    const canvas = canvasRef.current;
    if (!wrapper || !footer || !canvas) return;

    // --- 1. THREE.JS WEBGL SETUP ---
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance'
    });

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    renderer.setPixelRatio(dpr);

    const textureLoader = new THREE.TextureLoader();
    const bgTexture = textureLoader.load(bgSrc, () => {
      if (material && bgTexture.image) {
        material.uniforms.uTextureSize.value.set(
          bgTexture.image.naturalWidth || 1672,
          bgTexture.image.naturalHeight || 941
        );
      }
    });
    bgTexture.minFilter = THREE.LinearFilter;
    bgTexture.magFilter = THREE.LinearFilter;
    bgTexture.generateMipmaps = false;

    const geometry = new THREE.PlaneGeometry(2, 2);
    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTexture: { value: bgTexture },
        uTime: { value: 0 },
        uDisplacement: { value: 0.0 },
        uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
        uTextureSize: { value: new THREE.Vector2(1672, 941) },
        uMouse: { value: new THREE.Vector2(0, 0) }
      },
      depthWrite: false,
      depthTest: false
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const handleResize = () => {
      const width = footer.clientWidth || window.innerWidth;
      const height = footer.clientHeight || window.innerHeight;
      renderer.setSize(width, height, false);
      material.uniforms.uResolution.value.set(width, height);
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    // --- 2. MOUSE PARALLAX TRACKING ---
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    const handleMouseMove = (e) => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      mouse.targetX = (e.clientX - cx) / cx;
      mouse.targetY = (e.clientY - cy) / cy;
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // --- 3. ANIMATION LOOP (WebGL + Smooth Lerp) ---
    let animationFrameId;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Smooth mouse lerping
      mouse.x += (mouse.targetX - mouse.x) * 0.06;
      mouse.y += (mouse.targetY - mouse.y) * 0.06;

      material.uniforms.uTime.value = elapsed;
      material.uniforms.uMouse.value.set(mouse.x, mouse.y);

      // Subtle mouse parallax on DOM elements when settled
      if (wordSimplyRef.current) {
        gsap.set(wordSimplyRef.current, {
          x: mouse.x * 12,
          y: mouse.y * 6
        });
      }
      if (characterWrapRef.current) {
        gsap.set(characterWrapRef.current, {
          x: mouse.x * 24,
          y: mouse.y * 12,
          rotationY: mouse.x * 2.5
        });
      }
      if (wordLovelyRef.current) {
        gsap.set(wordLovelyRef.current, {
          x: mouse.x * 32,
          y: mouse.y * 16
        });
      }

      renderer.render(scene, camera);
    };
    animate();

    // --- 4. GSAP SCROLLTRIGGER PINNED ENTRANCE TIMELINE ---
    // Animation Timeline Specification:
    // 0–20%:   Footer begins covering the previous section with WebGL distortion and depth transition.
    // 20–45%:  "SIMPLY" descends from above while the background settles.
    // 35–70%:  Character enters with subtle 3D zoom-in & perspective rotation.
    // 50–85%:  "LOVELY" rises from below with a weighty landing.
    // 85–100%: All elements settle into the exact reference composition. Distortion fades to 0.

    gsap.set(wordSimplyRef.current, { yPercent: -130, opacity: 0 });
    gsap.set(wordLovelyRef.current, { yPercent: 130, opacity: 0 });
    gsap.set(characterWrapRef.current, {
      yPercent: 26,
      scale: 0.82,
      rotationX: 8,
      rotationY: -5,
      opacity: 0,
      transformOrigin: '50% 100%'
    });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: wrapper,
        start: 'top top',
        end: 'bottom bottom',
        pin: footer,
        scrub: 1,
        anticipatePin: 1,
        onUpdate: (self) => {
          const p = self.progress;
          if (p < 0.2) {
            material.uniforms.uDisplacement.value = (p / 0.2) * 0.85;
          } else if (p < 0.85) {
            const decay = 1 - (p - 0.2) / 0.65;
            material.uniforms.uDisplacement.value = decay * 0.85;
          } else {
            material.uniforms.uDisplacement.value = 0.0;
          }
        }
      }
    });

    // 0–20%: Background initial zoom settlement & transition
    tl.fromTo(
      material.uniforms.uDisplacement,
      { value: 0 },
      { value: 0.85, ease: 'power1.out', duration: 0.2 },
      0
    );

    // 20–45%: "SIMPLY" slides vertically downward with smooth overshoot
    tl.to(
      wordSimplyRef.current,
      {
        yPercent: 0,
        opacity: 1,
        ease: 'back.out(1.2)',
        duration: 0.25
      },
      0.20
    );

    // 35–70%: Character enters with subtle 3D motion and perspective rotation
    tl.to(
      characterWrapRef.current,
      {
        yPercent: 0,
        scale: 1.0,
        rotationX: 0,
        rotationY: 0,
        opacity: 1,
        ease: 'power2.out',
        duration: 0.35
      },
      0.35
    );

    // 50–85%: "LOVELY" rises vertically upward with weighty overshoot landing
    tl.to(
      wordLovelyRef.current,
      {
        yPercent: 0,
        opacity: 1,
        ease: 'back.out(1.15)',
        duration: 0.35
      },
      0.50
    );

    // 85–100%: Settlement & distortion clearance
    tl.to(
      material.uniforms.uDisplacement,
      {
        value: 0.0,
        ease: 'power1.out',
        duration: 0.15
      },
      0.85
    );

    // --- 5. CLEANUP ON UNMOUNT ---
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);

      if (tl.scrollTrigger) {
        tl.scrollTrigger.kill();
      }
      tl.kill();

      scene.remove(mesh);
      geometry.dispose();
      material.dispose();
      bgTexture.dispose();
      renderer.dispose();
    };
  }, [bgSrc]);

  return (
    <div className="footer-pinned-wrapper" ref={wrapperRef}>
      <footer className="simply-lovely-footer" ref={footerRef}>
        {/* WebGL Displacement Background Canvas */}
        <canvas
          ref={canvasRef}
          className="footer-webgl-canvas"
          aria-label="Cosmic racing atmosphere with stadium lights"
        />

        {/* Ambient Vignette & Racing Atmospheric Glow */}
        <div className="footer-ambient-glow" aria-hidden="true" />

        {/* Typography Layer 1: SIMPLY (Behind Character) */}
        <div className="footer-type-layer layer-simply" aria-hidden="true">
          <span className="footer-word word-simply" ref={wordSimplyRef}>
            <span className="footer-word-inner">{titleTop}</span>
          </span>
        </div>

        {/* Character Portrait Layer: Max Verstappen Cutout (Between SIMPLY & LOVELY) */}
        <div className="footer-character-layer" ref={characterWrapRef}>
          <img
            ref={characterImgRef}
            src={characterSrc}
            alt="Max Verstappen World Champion"
            className="footer-character-img"
            loading="eager"
            decoding="async"
          />
        </div>

        {/* Typography Layer 2: LOVELY (Overlapping Lower Body) */}
        <div className="footer-type-layer layer-lovely" aria-hidden="true">
          <span className="footer-word word-lovely" ref={wordLovelyRef}>
            <span className="footer-word-inner">{titleBottom}</span>
          </span>
        </div>

        {/* Screen Reader Semantic Header */}
        <h2 className="sr-only">
          {titleTop} {titleBottom} — Max Verstappen Formula 1 World Champion
        </h2>
      </footer>
    </div>
  );
};

export default SimplyLovelyFooter;
