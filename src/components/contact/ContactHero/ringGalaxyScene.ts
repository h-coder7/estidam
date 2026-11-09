import { gsap } from "gsap";
import {
    BufferGeometry,
    Float32BufferAttribute,
    Group,
    LinearSRGBColorSpace,
    NoToneMapping,
    NormalBlending,
    PerspectiveCamera,
    Points,
    Scene,
    ShaderMaterial,
    Vector2,
    Vector3,
    WebGLRenderer,
} from "three";

const POINT_COUNT = 120_000;
const POINT_COUNT_MOBILE = 45_000;
const PIXEL_RATIO_CAP = 1.5;

const RING_COUNT = 5;
const RING_RADIUS = 0.7;
const RING_SPACING = 0.46;
const RING_WIDTH = 0.23;
const HEIGHT_SPREAD = 0.045;

const SPIN_SPEED = 0.1;
const RIPPLE_AMOUNT = 0.065;
const RIPPLE_WAVES = 4;
const RIPPLE_SPEED = 2.45;
const SWEEP_SPEED = 2.45;
const BAND_POW = 2.6;
const OUTER_FADE = 1;

const POINTER_RADIUS = 1;
const POINTER_STRENGTH = 0.08;

const SCROLL_DIVE_Z = 3.2;
const SCROLL_SPIN = 3.36;
const SCROLL_EXPAND = 0.4;
const SCROLL_CHAOS = 0.4;

const MOTE_COUNT = 570;
const MOTE_SIZE = 28;
const MOTE_SPEED = 0.6;
const MOTE_ALPHA = 0.22;

const BASE_CAMERA_Z = 3;
const MAX_R = RING_RADIUS + (RING_COUNT - 1) * RING_SPACING + RING_WIDTH;

const ringVertex = /* glsl */ `
attribute float size; attribute float id; attribute float band;
uniform float iTime; uniform float iAnimate; uniform float uExpand;
uniform vec2 iMouse; uniform float uPointerAmt; uniform float uSpinPhase; uniform float uChaos;
uniform float uAspect; uniform float uPointerRadius; uniform float uPointerStrength;
uniform float uRippleAmount; uniform float uRippleWaves; uniform float uRippleSpeed;
varying float vBand; varying float vAngle; varying float vRadius;
void main() {
  float r = position.x;
  float h0 = position.y;
  float baseAngle = position.z;
  float ang = baseAngle + uSpinPhase;
  float h = h0 + sin(ang * uRippleWaves + iTime * uRippleSpeed) * uRippleAmount;
  float rr = r * uExpand;
  vec3 p = vec3(rr * cos(ang), h, rr * sin(ang));
  vec3 jitter = vec3(
    fract(sin(id * 12.9898) * 43758.5453) - 0.5,
    fract(sin(id * 78.233 ) * 12345.6789) - 0.5,
    fract(sin(id * 39.123 ) * 65432.1234) - 0.5
  );
  p += jitter * uChaos;
  vBand = band; vAngle = ang; vRadius = r;
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_PointSize = size / -mv.z * (0.5 + 0.5 * iAnimate);
  vec4 res = projectionMatrix * mv;
  vec2 ndc = res.xy / res.w;
  vec2 diff = ndc - iMouse;
  float pdist = length(diff * vec2(uAspect, 1.0));
  float f = clamp(uPointerRadius - pdist, 0.0, 1.0);
  vec2 dir = length(diff) > 1e-4 ? normalize(diff) : vec2(0.0);
  res.xy += dir * (f * f * uPointerStrength * uPointerAmt) * res.w;
  float a = pow(iAnimate, 0.6);
  res.xy *= clamp(2.0 * a + pow(id, 0.7) - 1.0, 0.0, 1.0);
  gl_Position = res;
}
`;

const ringFragment = /* glsl */ `
uniform float iTime; uniform float uOpacity;
uniform vec3 uMain; uniform vec3 uGlow; uniform vec3 uDeep;
uniform float uSweepSpeed; uniform float uBandPow; uniform float uOuterFade; uniform float uMaxR;
varying float vBand; varying float vAngle; varying float vRadius;
void main() {
  float across = 1.0 - pow(abs(vBand), uBandPow);
  float depth = clamp(vRadius / uMaxR, 0.0, 1.0);
  float sweep = 0.5 + 0.5 * sin(vAngle - iTime * uSweepSpeed);
  vec3 col = mix(uMain, uGlow, sweep * 0.45 * across);
  col = mix(col, uDeep, 0.35 * (1.0 - across));
  float strength = (1.0 - depth * uOuterFade) * (0.2 + 0.45 * across);
  float tex = 1.0 - smoothstep(0.5, 1.0, length(2.0 * gl_PointCoord - 1.0));
  gl_FragColor = vec4(col, tex * strength * uOpacity);
}
`;

const moteVertex = /* glsl */ `
attribute float size; attribute float seed; uniform float uTime; uniform vec2 uRes;
varying float vA;
vec3 warp(vec3 p, float t){ float c=0.9,a=1.9,b=0.02,s=0.05; p*=2.;
  p.x+=c*sin(s*t+a*p.y)+t*b; p.y+=c*cos(s*t+a*p.x); p.y+=c*sin(s*t+a*p.z)+t*b;
  p.z+=c*cos(s*t+a*p.y); p.z+=c*sin(s*t+a*p.x)+t*b; p.x+=c*cos(s*t+a*p.z);
  return cos(p+vec3(1,2,4)); }
void main(){
  vec3 v = position*4.0 + warp(position, uTime)*1.2;
  vec4 mv = modelViewMatrix * vec4(v, 1.0);
  float r = length(v); float farF = 1.0 - smoothstep(5.0, 6.5, r); float nearF = smoothstep(0.0, 0.5, -mv.z);
  vA = farF * nearF;
  gl_PointSize = size * uRes.y / 900.0 / -mv.z; gl_PointSize = max(gl_PointSize, 1.0);
  gl_Position = projectionMatrix * mv;
}
`;

const moteFragment = /* glsl */ `
uniform vec3 uColor; uniform float uAlpha; uniform float uOpacity; varying float vA;
void main(){ vec2 p = gl_PointCoord - 0.5; float l = length(p); if (l > 0.5) discard;
  float tex = smoothstep(0.5, 0.0, l); gl_FragColor = vec4(uColor, tex * vA * uAlpha * uOpacity); }
`;

function readToken(name: string, fallback: string) {
    const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    return value || fallback;
}

function hexToVec3(hex: string) {
    const n = parseInt(hex.replace("#", ""), 16);
    return new Vector3(((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255);
}

function createRingGeometry(count: number) {
    const positions = new Float32Array(count * 3);
    const bands = new Float32Array(count);
    const sizes = new Float32Array(count);
    const ids = new Float32Array(count);

    for (let i = 0; i < count; i += 1) {
        const k = Math.floor(Math.random() * RING_COUNT);
        const ringR = RING_RADIUS + k * RING_SPACING;
        const g = (Math.random() + Math.random() + Math.random() - 1.5) / 1.5;
        const i3 = i * 3;
        positions[i3] = ringR + g * RING_WIDTH;
        positions[i3 + 1] = (Math.random() * 2 - 1) * HEIGHT_SPREAD;
        positions[i3 + 2] = Math.random() * Math.PI * 2;
        bands[i] = g;
        sizes[i] = 3 + 5 * Math.random();
        ids[i] = Math.random();
    }

    const geometry = new BufferGeometry();
    geometry.setAttribute("position", new Float32BufferAttribute(positions, 3));
    geometry.setAttribute("band", new Float32BufferAttribute(bands, 1));
    geometry.setAttribute("size", new Float32BufferAttribute(sizes, 1));
    geometry.setAttribute("id", new Float32BufferAttribute(ids, 1));
    return geometry;
}

function createMoteGeometry() {
    const positions = new Float32Array(MOTE_COUNT * 3);
    const sizes = new Float32Array(MOTE_COUNT);
    const seeds = new Float32Array(MOTE_COUNT);

    for (let i = 0; i < MOTE_COUNT; i += 1) {
        const i3 = i * 3;
        positions[i3] = 2 * Math.random() - 1;
        positions[i3 + 1] = 2 * Math.random() - 1;
        positions[i3 + 2] = 2 * Math.random() - 1;
        sizes[i] = MOTE_SIZE * (0.4 + Math.random());
        seeds[i] = Math.random();
    }

    const geometry = new BufferGeometry();
    geometry.setAttribute("position", new Float32BufferAttribute(positions, 3));
    geometry.setAttribute("size", new Float32BufferAttribute(sizes, 1));
    geometry.setAttribute("seed", new Float32BufferAttribute(seeds, 1));
    return geometry;
}

export function mountRingGalaxy(container: HTMLElement) {
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || 1;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const count = width < 768 ? POINT_COUNT_MOBILE : POINT_COUNT;

    let renderer: WebGLRenderer;
    try {
        renderer = new WebGLRenderer({
            antialias: true,
            alpha: true,
            powerPreference: "high-performance",
        });
    } catch {
        return () => {};
    }

    const pixelRatio = Math.min(window.devicePixelRatio || 1, PIXEL_RATIO_CAP);
    renderer.setPixelRatio(pixelRatio);
    renderer.setSize(container.clientWidth, container.clientHeight, false);
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = LinearSRGBColorSpace;
    renderer.toneMapping = NoToneMapping;
    renderer.domElement.className = "ring_galaxy_canvas";
    container.appendChild(renderer.domElement);

    const scene = new Scene();
    const camera = new PerspectiveCamera(45, width / height, 0.1, 80);
    camera.position.set(0, 0, BASE_CAMERA_Z);

    const group = new Group();
    group.position.z = reduced ? 0 : -20;
    scene.add(group);

    const opacity = { value: reduced ? 1 : 0 };
    const animate = { value: reduced ? 1 : 0 };
    const expand = { value: 1 };
    const chaos = { value: 0 };
    const spinPhaseUniform = { value: 0 };
    const time = { value: 0 };
    const pointer = new Vector2(0, 0);
    const pointerTarget = new Vector2(0, 0);
    const pointerAmt = { value: 0 };
    const aspect = { value: width / Math.max(height, 1) };
    const moteTime = { value: 0 };
    const moteRes = new Vector2(width * pixelRatio, height * pixelRatio);

    const ringMaterial = new ShaderMaterial({
        uniforms: {
            iTime: time,
            iAnimate: animate,
            uOpacity: opacity,
            uExpand: expand,
            iMouse: { value: pointer },
            uPointerAmt: pointerAmt,
            uAspect: aspect,
            uPointerRadius: { value: POINTER_RADIUS },
            uPointerStrength: { value: POINTER_STRENGTH },
            uSpinPhase: spinPhaseUniform,
            uChaos: chaos,
            uRippleAmount: { value: RIPPLE_AMOUNT },
            uRippleWaves: { value: RIPPLE_WAVES },
            uRippleSpeed: { value: RIPPLE_SPEED },
            uMain: { value: hexToVec3(readToken("--secondary", "#1691D0")) },
            uGlow: { value: hexToVec3(readToken("--blue", "#295CC7")) },
            uDeep: { value: hexToVec3(readToken("--dark", "#0b1a33")) },
            uSweepSpeed: { value: SWEEP_SPEED },
            uBandPow: { value: BAND_POW },
            uOuterFade: { value: OUTER_FADE },
            uMaxR: { value: MAX_R },
        },
        vertexShader: ringVertex,
        fragmentShader: ringFragment,
        transparent: true,
        depthTest: false,
        depthWrite: false,
        blending: NormalBlending,
    });

    ringMaterial.uniforms.iTime = time;
    ringMaterial.uniforms.iAnimate = animate;
    ringMaterial.uniforms.uOpacity = opacity;
    ringMaterial.uniforms.uExpand = expand;
    ringMaterial.uniforms.iMouse.value = pointer;
    ringMaterial.uniforms.uPointerAmt = pointerAmt;
    ringMaterial.uniforms.uAspect = aspect;
    ringMaterial.uniforms.uSpinPhase = spinPhaseUniform;
    ringMaterial.uniforms.uChaos = chaos;

    const points = new Points(createRingGeometry(count), ringMaterial);
    points.position.set(0, 0, -0.8);
    points.rotation.set(0.55, 0, 0);
    points.frustumCulled = false;
    group.add(points);

    const moteMaterial = new ShaderMaterial({
        uniforms: {
            uTime: moteTime,
            uColor: { value: hexToVec3(readToken("--secondary", "#1691D0")) },
            uAlpha: { value: MOTE_ALPHA },
            uOpacity: opacity,
            uRes: { value: moteRes },
        },
        vertexShader: moteVertex,
        fragmentShader: moteFragment,
        transparent: true,
        depthTest: false,
        depthWrite: false,
        blending: NormalBlending,
    });
    moteMaterial.uniforms.uTime = moteTime;
    moteMaterial.uniforms.uOpacity = opacity;
    moteMaterial.uniforms.uRes.value = moteRes;

    const motes = new Points(createMoteGeometry(), moteMaterial);
    motes.frustumCulled = false;
    scene.add(motes);

    const section = (container.closest(".contact_hero") ?? container) as HTMLElement;
    let hovering = false;
    let disposed = false;
    let contextLost = false;
    let ticking = false;
    let last = performance.now();
    let elapsed = 0;
    let scrollCurrent = 0;
    let spinPhase = 0;

    const heroOffScreen = () => {
        const rect = section.getBoundingClientRect();
        return rect.bottom <= 0 || rect.top >= window.innerHeight;
    };

    const renderFrame = () => {
        if (disposed || contextLost) return;
        renderer.render(scene, camera);
    };

    const resize = () => {
        const nextWidth = container.clientWidth || 1;
        const nextHeight = container.clientHeight || 1;
        const nextRatio = Math.min(window.devicePixelRatio || 1, PIXEL_RATIO_CAP);
        renderer.setPixelRatio(nextRatio);
        renderer.setSize(nextWidth, nextHeight, false);
        camera.aspect = nextWidth / nextHeight;
        camera.updateProjectionMatrix();
        aspect.value = nextWidth / nextHeight;
        moteRes.set(nextWidth * nextRatio, nextHeight * nextRatio);
        if (reduced) renderFrame();
    };

    const onPointer = (event: PointerEvent) => {
        const rect = container.getBoundingClientRect();
        if (rect.width < 1 || rect.height < 1) return;
        pointerTarget.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        pointerTarget.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
        hovering = true;
    };

    const onPointerLeave = () => {
        hovering = false;
    };

    const onTick = () => {
        if (disposed) return;
        if (heroOffScreen()) {
            stop();
            return;
        }

        const now = performance.now();
        const dt = Math.min(0.05, (now - last) / 1000);
        last = now;
        elapsed += dt;

        const rect = section.getBoundingClientRect();
        const traveled = Math.min(Math.max(-rect.top, 0), Math.max(rect.height, 1));
        const scrollTarget = rect.height > 0 ? traveled / rect.height : 0;
        scrollCurrent += (scrollTarget - scrollCurrent) * 0.08;

        camera.position.z = BASE_CAMERA_Z - scrollCurrent * SCROLL_DIVE_Z;
        spinPhase += SPIN_SPEED * (1 + scrollCurrent * SCROLL_SPIN) * dt;
        spinPhaseUniform.value = spinPhase;
        expand.value = 1 + scrollCurrent * SCROLL_EXPAND;
        chaos.value = scrollCurrent * scrollCurrent * SCROLL_CHAOS;
        time.value = elapsed;
        moteTime.value = elapsed * MOTE_SPEED * 8;
        motes.position.copy(camera.position);

        pointer.lerp(pointerTarget, 0.09);
        const amountTarget = hovering ? 1 : 0;
        pointerAmt.value += (amountTarget - pointerAmt.value) * 0.08;

        renderFrame();
    };

    const start = () => {
        if (ticking || disposed || reduced || contextLost || document.visibilityState === "hidden") return;
        if (heroOffScreen()) return;
        renderer.domElement.style.visibility = "";
        ticking = true;
        last = performance.now();
        gsap.ticker.add(onTick);
    };

    const stop = () => {
        if (ticking) {
            ticking = false;
            gsap.ticker.remove(onTick);
        }
        if (!disposed && heroOffScreen()) renderer.domElement.style.visibility = "hidden";
    };

    const syncVisibility = () => {
        if (heroOffScreen() || document.visibilityState === "hidden") stop();
        else start();
    };

    resize();
    if (!reduced) {
        gsap.to(group.position, { z: 0, duration: 1.5, delay: 0.5, ease: "power3.out" });
        gsap.to(opacity, { value: 1, duration: 1.5, delay: 0.5, ease: "power3.out" });
        gsap.to(animate, { value: 1, duration: 2, ease: (t: number) => t * t * (3 - 2 * t) });
    }

    const observer = new IntersectionObserver(() => {
        syncVisibility();
    });
    observer.observe(section);

    const onVisibility = () => {
        syncVisibility();
    };

    const onContextLost = (event: Event) => {
        event.preventDefault();
        contextLost = true;
        stop();
        renderer.domElement.style.visibility = "hidden";
    };

    if (!reduced) {
        section.addEventListener("pointermove", onPointer);
        section.addEventListener("pointerleave", onPointerLeave);
    }
    window.addEventListener("resize", resize);
    window.addEventListener("scroll", syncVisibility, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);
    renderer.domElement.addEventListener("webglcontextlost", onContextLost);

    if (reduced) renderFrame();
    else if (document.visibilityState !== "hidden") start();

    return () => {
        disposed = true;
        stop();
        observer.disconnect();
        section.removeEventListener("pointermove", onPointer);
        section.removeEventListener("pointerleave", onPointerLeave);
        window.removeEventListener("resize", resize);
        window.removeEventListener("scroll", syncVisibility);
        document.removeEventListener("visibilitychange", onVisibility);
        renderer.domElement.removeEventListener("webglcontextlost", onContextLost);
        gsap.killTweensOf([group.position, opacity, animate]);
        points.geometry.dispose();
        motes.geometry.dispose();
        ringMaterial.dispose();
        moteMaterial.dispose();
        renderer.dispose();
        renderer.domElement.remove();
    };
}
