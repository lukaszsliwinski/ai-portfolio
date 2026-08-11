"use client";

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

// 3D background component with animated stars, rendered using Three.js
// inspired by: https://www.youtube.com/watch?v=1qpeo5ewz_8
export default function Background() {
  const bgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    const scene = new THREE.Scene();

    // Perspective camera
    const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);
    camera.position.z = 5;

    // WebGL renderer z przezroczystością
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(w, h);

    if (bgRef.current) {
      bgRef.current.appendChild(renderer.domElement);
    }

    // Generate star positions and colors
    const verts: number[] = [];
    const colors: number[] = [];

    for (let i = 0; i < 2000; i++) {
      // Random position on a sphere
      const radius = Math.random() * 25 + 25;
      const u = Math.random();
      const v = Math.random();
      const theta = 2 * Math.PI * u;
      const phi = Math.acos(2 * v - 1);
      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);

      // Random star color
      const col = new THREE.Color().setHSL(0.6, 0.2, Math.random());
      verts.push(x, y, z);
      colors.push(col.r, col.g, col.b);
    }

    // Buffer geometry and material for stars
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(verts, 3));
    geo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    const mat = new THREE.PointsMaterial({
      size: 0.05,
      vertexColors: true,
      blending: THREE.AdditiveBlending
    });

    // Create star points and add to scene
    const stars = new THREE.Points(geo, mat);
    scene.add(stars);

    // Add hemisphere light
    scene.add(new THREE.HemisphereLight(0xffffff, 0x444444));

    // Animation variables for star movement based on scroll
    let scrollPosY = 0;
    const rate = 0.1;
    let goalPos = 0;

    // Animation loop
    function animate() {
      requestAnimationFrame(animate);
      goalPos = Math.PI * scrollPosY;
      // Smoothly move stars along Z axis
      stars.position.z -= (stars.position.z - goalPos * 8) * rate;
      renderer.render(scene, camera);
    }
    animate();

    // Scroll handler - update position
    const handleScroll = () => {
      const scrollTop = document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      scrollPosY = scrollHeight > 0 ? scrollTop / scrollHeight : 0;
    };

    // Window resize handler
    const handleResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);
    // Cleanup on component unmount
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={bgRef}
      className="fixed top-0 left-0 w-screen h-screen -z-10 overflow-hidden"
      id="site-background"
    ></div>
  );
}
