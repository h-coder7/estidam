"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { OutputPass } from "three/addons/postprocessing/OutputPass.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";

const VERTEX = /* glsl */ `
varying vec3 vObjNormal;
varying vec3 vViewNormal;
varying vec3 vViewPos;

void main() {
  vObjNormal = normalize(normal);
  vViewNormal = normalize(normalMatrix * normal);
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  vViewPos = mv.xyz;
  gl_Position = projectionMatrix * mv;
}
`;

const FRAGMENT = /* glsl */ `
precision highp float;

uniform float iTime, iAlpha, iPointer;
uniform vec3  uMouseDir;
uniform vec3  uDeep, uNebula, uBright, uHot, uStar;
uniform float uScale, uFlow, uStarDensity, uTwinkle, uSwirl, uGlow, uBrightness;
uniform float uCenterDark;
uniform float uCenterSize;

varying vec3 vObjNormal;
varying vec3 vViewNormal;
varying vec3 vViewPos;

float hash13(vec3 p){
  p = fract(p * 0.1031);
  p += dot(p, p.zyx + 31.32);
  return fract((p.x + p.y) * p.z);
}
float vnoise(vec3 p){
  vec3 i = floor(p), f = fract(p);
  vec3 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(mix(hash13(i + vec3(0,0,0)), hash13(i + vec3(1,0,0)), u.x),
        mix(hash13(i + vec3(0,1,0)), hash13(i + vec3(1,1,0)), u.x), u.y),
    mix(mix(hash13(i + vec3(0,0,1)), hash13(i + vec3(1,0,1)), u.x),
        mix(hash13(i + vec3(0,1,1)), hash13(i + vec3(1,1,1)), u.x), u.y),
    u.z);
}

const mat3 M3 = mat3( 0.00,  0.80,  0.60,
                     -0.80,  0.36, -0.48,
                     -0.60, -0.48,  0.64 );

float fbm(vec3 p){
  float v = 0., a = 0.5;
  for (int i = 0; i < 5; i++){ v += a * vnoise(p); p = M3 * p * 2.0 + 7.0; a *= 0.5; }
  return v;
}
float fbmw(vec3 p){
  float v = 0., a = 0.5;
  for (int i = 0; i < 3; i++){ v += a * vnoise(p); p = M3 * p * 2.0 + 7.0; a *= 0.5; }
  return v;
}

vec3 rotAxis(vec3 v, vec3 k, float a){
  float c = cos(a), s = sin(a);
  return v * c + cross(k, v) * s + k * dot(k, v) * (1.0 - c);
}

float starLayer(vec3 x, float thr, float tw){
  vec3 i = floor(x), f = fract(x) - 0.5;
  float h = hash13(i);
  if (h < thr) return 0.0;
  float b = (h - thr) / (1.0 - thr);
  vec3 off = 0.7 * (vec3(hash13(i + 7.3), hash13(i + 13.1), hash13(i + 23.7)) - 0.5);
  float d = length(f - off);
  float tw2 = 0.5 + 0.5 * sin(iTime * tw + h * 42.0);
  return smoothstep(0.09, 0.0, d) * b * tw2;
}

void main() {
  vec3 dir = normalize(vObjNormal);
  float t = iTime * uFlow;

  float md = distance(dir, uMouseDir);
  float stir = uSwirl * iPointer / (1.0 + md * md * 6.0);
  vec3 sdir = rotAxis(dir, normalize(uMouseDir), stir);

  vec3 p = sdir * uScale + vec3(0.0, t, 0.0);
  vec3 w1 = vec3(fbmw(p + 11.0), fbmw(p + 27.0), fbmw(p + 41.0));
  vec3 w2 = vec3(
    fbmw(p * 1.5 + 4.0 * w1 + vec3(t, 0.0, 0.0)),
    fbmw(p * 1.5 + 4.0 * w1 + vec3(0.0, 0.0, -t)),
    fbmw(p * 1.5 + 4.0 * w1 + vec3(0.0, t, 0.0))
  );
  float n    = fbm(p + 3.0 * w2);
  float fine = fbmw(p * 3.0 + 6.0 * w2);

  float dens = pow(smoothstep(0.25, 0.95, n), 1.3);

  vec3 col = uDeep;
  col = mix(col, uNebula, smoothstep(0.20, 0.60, n));
  col = mix(col, uBright, smoothstep(0.55, 0.95, n) * (0.5 + 0.5 * fine));
  col = mix(col, uHot,    smoothstep(0.75, 1.00, n) * smoothstep(0.40, 1.0, fine) * 0.8);
  col *= 0.3 + 1.15 * dens;

  float st = starLayer(sdir * 8.0  + 20.0, 0.86, uTwinkle)
           + starLayer(sdir * 16.0 + 50.0, 0.90, uTwinkle * 1.3) * 0.8
           + starLayer(sdir * 32.0 + 80.0, 0.93, uTwinkle * 0.7) * 0.6;
  col += uStar * st * uStarDensity;

  vec3 hero = normalize(vec3(0.45, 0.55, 0.7));
  float hd = distance(dir, hero);
  float twH = 0.7 + 0.3 * sin(iTime * 1.5);
  col += uStar * exp(-hd * hd * 500.0) * 1.6 * twH * uStarDensity;

  float cg = exp(-md * md * 7.0) * uGlow * (0.25 + 0.85 * iPointer);
  col += mix(uBright, uHot, 0.5) * cg;

  vec3 V = normalize(-vViewPos);
  vec3 N = normalize(vViewNormal);
  float ndv = clamp(dot(N, V), 0.0, 1.0);
  float rim = pow(1.0 - ndv, 3.0);
  col *= mix(0.5, 1.0, ndv);
  col += mix(uBright, uHot, 0.5) * rim * 0.6;

  float inner = mix(0.97, 0.4, clamp(uCenterSize, 0.0, 1.0));
  float centre = smoothstep(inner, min(inner + 0.12, 0.999), ndv);
  float hole = centre * uCenterDark;
  col *= 1.0 - hole;

  col *= uBrightness;
  gl_FragColor = vec4(col, iAlpha * (1.0 - hole));
}
`;

function rgb(hex: number) {
    return new THREE.Vector3(((hex >> 16) & 255) / 255, ((hex >> 8) & 255) / 255, (hex & 255) / 255);
}

function paintMeshes(root: THREE.Object3D, material: THREE.Material) {
    root.traverse((obj) => {
        const mesh = obj as THREE.Mesh;
        if (!mesh.isMesh) return;
        const previous = mesh.material;
        mesh.material = material;
        const list = Array.isArray(previous) ? previous : [previous];
        list.forEach((item) => item?.dispose());
    });
}

type HandPart = {
    obj: THREE.Object3D;
    restY: number;
    dir: number;
};

export default function HeroOrbScene() {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        let disposed = false;
        let teardown = () => {};

        const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        const narrow = window.matchMedia("(max-width: 767px)").matches;
        const lowPower = narrow || (navigator.hardwareConcurrency || 8) <= 4;

        let renderer: THREE.WebGLRenderer;
        try {
            renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        } catch {
            return;
        }
        if (!renderer.getContext()) {
            renderer.dispose();
            return;
        }

        renderer.setClearColor(0x000000, 0);
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        renderer.domElement.setAttribute("aria-hidden", "true");
        container.appendChild(renderer.domElement);

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 80);
        camera.position.set(0, 0, 3);
        camera.lookAt(0, 0, 0);

        const rig = new THREE.Group();
        scene.add(rig);

        const cubeRT = new THREE.WebGLCubeRenderTarget(128, {
            generateMipmaps: true,
            minFilter: THREE.LinearMipmapLinearFilter,
        });
        const cubeCamera = new THREE.CubeCamera(0.1, 100, cubeRT);
        rig.add(cubeCamera);
        scene.environment = cubeRT.texture;

        const uniforms = {
            iTime: { value: 0 },
            iAlpha: { value: 0 },
            iPointer: { value: 0 },
            uMouseDir: { value: new THREE.Vector3(0, 0, 1) },
            uDeep: { value: rgb(0x000000) },
            uNebula: { value: rgb(0x001eff) },
            uBright: { value: rgb(0x858dff) },
            uHot: { value: rgb(0x006eff) },
            uStar: { value: rgb(0x000000) },
            uScale: { value: 2.4 },
            uFlow: { value: 0.295 },
            uStarDensity: { value: 0.85 },
            uTwinkle: { value: 2.0 },
            uSwirl: { value: 0.35 },
            uGlow: { value: 0.34 },
            uBrightness: { value: 1.73 },
            uCenterDark: { value: 0.37 },
            uCenterSize: { value: 0.44 },
        };

        const segments = narrow ? 64 : 96;
        const sphere = new THREE.Mesh(
            new THREE.SphereGeometry(1, segments, segments),
            new THREE.ShaderMaterial({
                uniforms,
                vertexShader: VERTEX,
                fragmentShader: FRAGMENT,
                transparent: true,
            }),
        );
        sphere.scale.setScalar(0.62);
        rig.add(sphere);

        rig.add(new THREE.AmbientLight(0x241a33, 0.6));
        const point = new THREE.PointLight(0x7c9cfe, 6, 12, 2);
        rig.add(point);
        const sun = new THREE.DirectionalLight(0x6a7bbf, 0.45);
        sun.position.set(0.6, 0.8, 2);
        rig.add(sun);

        const width = container.clientWidth || 1;
        const height = container.clientHeight || 1;
        const composer = new EffectComposer(renderer);
        composer.addPass(new RenderPass(scene, camera));
        const bloom = new UnrealBloomPass(new THREE.Vector2(width, height), 0.19, 0.5, 0.2);
        composer.addPass(bloom);
        composer.addPass(new OutputPass());

        const mouseDir = uniforms.uMouseDir.value;
        const mouseTargetDir = new THREE.Vector3(0, 0, 1);
        const parallax = new THREE.Vector2();
        const parallaxTarget = new THREE.Vector2();
        const raycaster = new THREE.Raycaster();
        const pointerNdc = new THREE.Vector2();
        let pointer = 0;
        let pointerTarget = 0;
        let lastX = 0;
        let lastY = 0;
        let logoFit = 1;
        let iconTexture: THREE.Texture | null = null;
        let logo: THREE.Object3D | null = null;
        let handsRoot: THREE.Object3D | null = null;
        const hands: HandPart[] = [];
        let appearStart = 0;
        let raf = 0;
        let running = true;
        let visible = true;
        let scrolling = false;
        let scrollTimer = 0;
        let lastCube = 0;

        const draco = new DRACOLoader();
        draco.setDecoderPath("/draco/");
        const loader = new GLTFLoader();
        loader.setDRACOLoader(draco);

        const placeRig = () => {
            const rtl = document.documentElement.dir === "rtl";
            const compact = container.clientWidth < 992;
            const side = rtl ? -1 : 1;
            rig.position.set(compact ? side * 0.48 : side * 0.55, compact ? -0.55 : 0.05, 0);
            rig.scale.setScalar(compact ? 0.52 : 0.92);
        };

        const resize = () => {
            const w = container.clientWidth;
            const h = container.clientHeight;
            if (w === 0 || h === 0) return;
            const ratio = Math.min(window.devicePixelRatio || 1, lowPower ? 1 : 1.25);
            camera.aspect = w / h;
            camera.updateProjectionMatrix();
            renderer.setPixelRatio(ratio);
            renderer.setSize(w, h, false);
            composer.setPixelRatio(ratio);
            composer.setSize(w, h);
            bloom.setSize(Math.max(1, Math.floor(w * ratio * 0.5)), Math.max(1, Math.floor(h * ratio * 0.5)));
            placeRig();
        };

        const draw = (now: number) => {
            if (!reduced) {
                mouseDir.lerp(mouseTargetDir, 0.25).normalize();
                pointerTarget *= 0.94;
                pointer += (pointerTarget - pointer) * 0.1;
                uniforms.iTime.value = now / 1000;
                uniforms.iPointer.value = pointer;
                const fade = (now - appearStart - 400) / 1000;
                uniforms.iAlpha.value = Math.min(1, Math.max(0, fade));
                sphere.position.y = Math.sin((now / 1000) * 0.6) * 0.08;
                parallax.lerp(parallaxTarget, 0.06);
                camera.position.set(parallax.x * 0.79, parallax.y * 0.79, 3);
                camera.lookAt(0, 0, 0);
                sphere.lookAt(camera.position);
                sphere.rotateY(((now / 1000) * 0.15) % (Math.PI * 2));
                const tt = (now - appearStart - 300) / 1000;
                const omega = 5.8 / 1.7;
                const off = tt <= 0 ? 4 : (1 + omega * tt) * Math.exp(-omega * tt) * 4;
                hands.forEach((hand) => {
                    hand.obj.position.y = hand.restY + hand.dir * off;
                });
            }

            if (logo) {
                logo.scale.setScalar(0.49 * logoFit);
                logo.position.set(0, sphere.position.y, -0.37);
                logo.lookAt(camera.position);
            }

            if (scrolling) return;

            if (now - lastCube > 320) {
                lastCube = now;
                if (handsRoot) handsRoot.visible = false;
                if (logo) logo.visible = false;
                cubeCamera.update(renderer, scene);
                if (handsRoot) handsRoot.visible = true;
                if (logo) logo.visible = true;
            }
            composer.render();
        };

        const tick = (now: number) => {
            if (!running) return;
            raf = requestAnimationFrame(tick);
            if (!visible || document.hidden) return;
            draw(now);
        };

        const onScrollActivity = () => {
            scrolling = true;
            window.clearTimeout(scrollTimer);
            scrollTimer = window.setTimeout(() => {
                scrolling = false;
            }, 180);
        };

        const onPointerMove = (event: PointerEvent) => {
            if (reduced) return;
            const rect = container.getBoundingClientRect();
            if (rect.width === 0 || rect.height === 0) return;
            const nx = ((event.clientX - rect.left) / rect.width) * 2 - 1;
            const ny = -((event.clientY - rect.top) / rect.height) * 2 + 1;
            pointerTarget = Math.min(1, pointerTarget + Math.hypot(nx - lastX, ny - lastY) * 4);
            lastX = nx;
            lastY = ny;
            parallaxTarget.set(nx, ny);
            pointerNdc.set(nx, ny);
            raycaster.setFromCamera(pointerNdc, camera);
            const hit = raycaster.intersectObject(sphere, false)[0];
            if (!hit) return;
            mouseTargetDir.copy(sphere.worldToLocal(hit.point.clone())).normalize();
        };

        const onVisibility = () => {
            if (!document.hidden && visible && !reduced && raf === 0) raf = requestAnimationFrame(tick);
        };

        const hero = container.closest(".hero_readiness") as HTMLElement | null;
        hero?.addEventListener("pointermove", onPointerMove);
        window.addEventListener("wheel", onScrollActivity, { passive: true });
        window.addEventListener("touchmove", onScrollActivity, { passive: true });
        window.addEventListener("scroll", onScrollActivity, { passive: true });
        document.addEventListener("visibilitychange", onVisibility);

        const resizeObserver = new ResizeObserver(() => {
            resize();
            if (reduced && appearStart) draw(appearStart);
        });
        resizeObserver.observe(container);

        const intersection = new IntersectionObserver(
            ([entry]) => {
                visible = entry.isIntersecting;
            },
            { threshold: 0.01 },
        );
        intersection.observe(container);
        resize();

        const loadModel = async (url: string) => {
            try {
                return await loader.loadAsync(url);
            } catch {
                return null;
            }
        };

        void (async () => {
            const handsGltf = await loadModel("/models/hands.glb");
            if (!disposed) {
                try {
                    iconTexture = await new THREE.TextureLoader().loadAsync("/images/icon.png");
                } catch {
                    iconTexture = null;
                }
            }
            if (disposed) {
                iconTexture?.dispose();
                return;
            }

            if (handsGltf) {
                const root = handsGltf.scene;
                const handMaterial = new THREE.MeshStandardMaterial({
                    color: 0xb8b8ff,
                    roughness: 0.31,
                    metalness: 0.83,
                    envMap: cubeRT.texture,
                    envMapIntensity: 2.25,
                });
                paintMeshes(root, handMaterial);
                root.scale.setScalar(1.72);
                root.position.set(0, 0, 0);
                rig.add(root);
                root.updateMatrixWorld(true);

                let parts: THREE.Object3D[] = [...root.children];
                if (parts.length < 2) {
                    parts = [];
                    root.traverse((obj) => {
                        if ((obj as THREE.Mesh).isMesh) parts.push(obj);
                    });
                }

                const centers = parts.map((part) => new THREE.Box3().setFromObject(part).getCenter(new THREE.Vector3()).y);
                const mean = centers.reduce((sum, value) => sum + value, 0) / (centers.length || 1);
                parts.forEach((part, index) => {
                    const dir = centers[index] >= mean ? 1 : -1;
                    const restY = part.position.y;
                    hands.push({ obj: part, restY, dir });
                    part.position.y = reduced ? restY : restY + dir * 4;
                });
                handsRoot = root;
            }

            if (iconTexture) {
                iconTexture.colorSpace = THREE.SRGBColorSpace;
                iconTexture.magFilter = THREE.LinearFilter;
                iconTexture.minFilter = THREE.LinearFilter;
                iconTexture.generateMipmaps = false;
                const image = iconTexture.image as { width?: number; height?: number };
                const aspect = (image.width || 1) / (image.height || 1);
                const mark = new THREE.Mesh(
                    new THREE.PlaneGeometry(aspect, 1),
                    new THREE.MeshBasicMaterial({
                        map: iconTexture,
                        transparent: true,
                        depthWrite: false,
                        toneMapped: false,
                    }),
                );
                logoFit = 1;
                const group = new THREE.Group();
                group.add(mark);
                group.scale.setScalar(0.49);
                rig.add(group);
                logo = group;
            }

            if (disposed) return;

            if (reduced) {
                uniforms.iAlpha.value = 1;
                uniforms.iTime.value = 0;
                sphere.position.y = 0;
                camera.position.set(0, 0, 3);
                camera.lookAt(0, 0, 0);
                sphere.lookAt(camera.position);
            }

            appearStart = performance.now();
            container.classList.add("is_ready");
            if (reduced) draw(appearStart);
            else raf = requestAnimationFrame(tick);
        })();

        let closed = false;
        teardown = () => {
            if (closed) return;
            closed = true;
            running = false;
            if (raf) cancelAnimationFrame(raf);
            window.clearTimeout(scrollTimer);
            hero?.removeEventListener("pointermove", onPointerMove);
            window.removeEventListener("wheel", onScrollActivity);
            window.removeEventListener("touchmove", onScrollActivity);
            window.removeEventListener("scroll", onScrollActivity);
            document.removeEventListener("visibilitychange", onVisibility);
            resizeObserver.disconnect();
            intersection.disconnect();
            draco.dispose();
            scene.traverse((obj) => {
                const mesh = obj as THREE.Mesh;
                if (!mesh.isMesh) return;
                mesh.geometry?.dispose();
                const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
                materials.forEach((material) => material?.dispose());
            });
            iconTexture?.dispose();
            cubeRT.dispose();
            composer.dispose();
            renderer.dispose();
            renderer.domElement.remove();
        };

        return () => {
            disposed = true;
            teardown();
        };
    }, []);

    return <div className="aiHeroScene" ref={containerRef} aria-hidden="true" />;
}
