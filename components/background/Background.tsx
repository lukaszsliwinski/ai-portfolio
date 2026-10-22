"use client";

import { useEffect, useRef } from "react";
import {
  AdditiveBlending,
  BufferGeometry,
  Color,
  Float32BufferAttribute,
  PerspectiveCamera,
  Points,
  PointsMaterial,
  Scene,
  WebGLRenderer,
} from "three";
import { motion } from "motion/react";

// Three.js starfield that drifts as the page scrolls.
// Inspired by https://www.youtube.com/watch?v=1qpeo5ewz_8
export default function Background() {
  const bgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    const scene = new Scene();

    const camera = new PerspectiveCamera(75, w / h, 0.1, 1000);
    camera.position.z = 5;

    // alpha: true keeps the canvas transparent, so the CSS gradient shows through.
    const renderer = new WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(w, h);

    if (bgRef.current) {
      bgRef.current.appendChild(renderer.domElement);
    }

    const verts: number[] = [];
    const colors: number[] = [];

    for (let i = 0; i < 2000; i++) {
      // Uniformly distributed point in a spherical shell, radius 25-50.
      const radius = Math.random() * 25 + 25;
      const u = Math.random();
      const v = Math.random();
      const theta = 2 * Math.PI * u;
      const phi = Math.acos(2 * v - 1);
      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);

      // Same hue for every star, random lightness.
      const col = new Color().setHSL(0.6, 0.2, Math.random());
      verts.push(x, y, z);
      colors.push(col.r, col.g, col.b);
    }

    const geo = new BufferGeometry();
    geo.setAttribute("position", new Float32BufferAttribute(verts, 3));
    geo.setAttribute("color", new Float32BufferAttribute(colors, 3));
    const mat = new PointsMaterial({
      size: 0.05,
      vertexColors: true,
      blending: AdditiveBlending,
    });

    const stars = new Points(geo, mat);
    scene.add(stars);

    let scrollPosY = 0;
    const rate = 0.1;
    let goalPos = 0;

    function animate() {
      requestAnimationFrame(animate);
      goalPos = Math.PI * scrollPosY;
      // Ease towards the target instead of jumping, so scrolling feels smooth.
      stars.position.z -= (stars.position.z - goalPos * 8) * rate;
      renderer.render(scene, camera);
    }
    animate();

    // Scroll progress (0-1) sets the star depth.
    const handleScroll = () => {
      const scrollTop = document.documentElement.scrollTop;
      const scrollHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      scrollPosY = scrollHeight > 0 ? scrollTop / scrollHeight : 0;
    };

    const handleResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
    };
  }, []);

  // Fades in on mount, not on scroll. Wrapped in Reveal, this fixed layer would
  // sit in a stacking context above the page and block clicks.
  // pointer-events-none is a safety net.
  return (
    <motion.div
      ref={bgRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="pointer-events-none fixed top-0 left-0 -z-10 h-screen w-screen overflow-hidden"
      id="site-background"
    />
  );
}
