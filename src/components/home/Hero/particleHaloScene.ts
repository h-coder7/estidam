import {
    AdditiveBlending,
    BufferGeometry,
    Float32BufferAttribute,
    Group,
    NoToneMapping,
    PerspectiveCamera,
    Points,
    RawShaderMaterial,
    Scene,
    SRGBColorSpace,
    Vector2,
    WebGLRenderer,
} from "three";

const DESKTOP_COUNT = 1_250;
const MOBILE_COUNT = 480;
const MOBILE_BREAKPOINT = 768;
const INNER_RADIUS = 0.95;
const BAND_WIDTH = 0.9;
const PARTICLE_SIZE = 11;

const vertexShader = /* glsl */ `
precision highp float;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform vec2 uPointer;
uniform float uTime;
uniform float uSize;
uniform float uPixelRatio;

attribute vec3 position;
attribute float aScale;
attribute float aSeed;

varying float vHeight;
varying float vSeed;
varying float vInfluence;

void main() {
    float phase = aSeed * 6.2831853;
    vec2 drift = vec2(
        sin(uTime * 0.42 + phase) * 0.28 + cos(uTime * 0.23 + position.y + phase) * 0.16,
        cos(uTime * 0.31 + phase * 1.6) * 0.28 + sin(uTime * 0.19 + position.x + phase) * 0.16
    );

    vec2 base = position.xy + drift;
    vec2 pointer = uPointer * vec2(2.1, 1.35);
    vec2 delta = base - pointer;
    float dist = length(delta);
    float influence = smoothstep(1.15, 0.0, dist);
    vec2 push = dist > 0.0001 ? normalize(delta) * influence * 0.42 : vec2(0.0);

    vec3 pos = vec3(base + push, position.z + sin(uTime * 0.5 + phase) * 0.14);
    pos.z += influence * 0.2;

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPosition;

    float depth = max(0.35, -mvPosition.z);
    gl_PointSize = clamp(
        uSize * aScale * uPixelRatio * (4.2 / depth),
        1.0,
        18.0
    );

    vHeight = pos.y;
    vSeed = aSeed;
    vInfluence = influence;
}
`;

const fragmentShader = /* glsl */ `
precision highp float;

varying float vHeight;
varying float vSeed;
varying float vInfluence;

void main() {
    vec2 coord = gl_PointCoord - vec2(0.5);
    float dist = length(coord);
    if (dist > 0.5) discard;

    float edge = smoothstep(0.5, 0.12, dist);
    float height = smoothstep(-1.2, 1.3, vHeight);
    vec3 deepBlue = vec3(0.05, 0.18, 0.55);
    vec3 midBlue = vec3(0.20, 0.45, 0.95);
    vec3 coolWhite = vec3(0.80, 0.92, 1.00);
    vec3 color = mix(deepBlue, midBlue, smoothstep(0.0, 0.7, height));
    color = mix(color, coolWhite, smoothstep(0.55, 1.0, height) * 0.65);
    color += coolWhite * vInfluence * 0.35;

    float variation = 0.7 + vSeed * 0.45;
    gl_FragColor = vec4(color * variation * edge, edge);
}
`;

const randomGaussian = () => {
    let u = 0;
    let v = 0;

    while (u === 0) u = Math.random();
    while (v === 0) v = Math.random();

    return Math.sqrt(-2 * Math.log(u)) * Math.cos(Math.PI * 2 * v);
};

const createGeometry = (count: number) => {
    const positions = new Float32Array(count * 3);
    const scales = new Float32Array(count);
    const seeds = new Float32Array(count);

    for (let index = 0; index < count; index += 1) {
        const angle = Math.random() * Math.PI * 2;
        const radius = Math.max(
            0.85,
            INNER_RADIUS + BAND_WIDTH * 0.6 + randomGaussian() * (BAND_WIDTH * 0.58),
        );
        const offset = index * 3;

        positions[offset] = Math.cos(angle) * radius;
        positions[offset + 1] = Math.sin(angle) * radius;
        positions[offset + 2] = randomGaussian() * 0.28;
        scales[index] = 0.55 + Math.random() * 0.45;
        seeds[index] = Math.random();
    }

    const geometry = new BufferGeometry();
    geometry.setAttribute("position", new Float32BufferAttribute(positions, 3));
    geometry.setAttribute("aScale", new Float32BufferAttribute(scales, 1));
    geometry.setAttribute("aSeed", new Float32BufferAttribute(seeds, 1));

    return geometry;
};

const canUseWebGL = () => {
    try {
        const canvas = document.createElement("canvas");
        return Boolean(canvas.getContext("webgl2") || canvas.getContext("webgl"));
    } catch {
        return false;
    }
};

export const mountParticleHalo = (container: HTMLElement) => {
    if (!canUseWebGL()) return () => {};

    const reducedQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let reducedMotion = reducedQuery.matches;
    const count = window.innerWidth <= MOBILE_BREAKPOINT ? MOBILE_COUNT : DESKTOP_COUNT;

    let renderer: WebGLRenderer;

    try {
        renderer = new WebGLRenderer({
            antialias: false,
            alpha: true,
            powerPreference: "high-performance",
        });
    } catch {
        return () => {};
    }

    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.outputColorSpace = SRGBColorSpace;
    renderer.toneMapping = NoToneMapping;
    renderer.domElement.setAttribute("aria-hidden", "true");
    container.appendChild(renderer.domElement);

    const scene = new Scene();
    const camera = new PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.z = 4.2;

    const geometry = createGeometry(count);
    const pointerUniform = new Vector2(0, 0);
    const uniforms = {
        uPointer: { value: pointerUniform },
        uTime: { value: 0 },
        uSize: { value: PARTICLE_SIZE },
        uPixelRatio: { value: renderer.getPixelRatio() },
    };

    const material = new RawShaderMaterial({
        uniforms,
        vertexShader,
        fragmentShader,
        transparent: true,
        blending: AdditiveBlending,
        depthWrite: false,
        depthTest: false,
    });

    const points = new Points(geometry, material);
    points.frustumCulled = false;

    const group = new Group();
    group.add(points);
    scene.add(group);

    const pointer = { x: window.innerWidth * 0.5, y: window.innerHeight * 0.5 };
    const current = { x: 0, y: 0 };
    let rotationX = 0;
    let rotationY = 0;
    let elapsed = 0;
    let lastTime = performance.now();
    let frameId = 0;
    let visible = true;
    let disposed = false;

    const resize = () => {
        const width = container.clientWidth;
        const height = container.clientHeight;

        if (width === 0 || height === 0) return;

        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
        renderer.setSize(width, height, false);
        uniforms.uPixelRatio.value = renderer.getPixelRatio();

        const wide = width / height > 1.05;
        const offset = wide ? 1.65 : 0;
        const rtl = document.documentElement.dir === "rtl";
        group.position.x = rtl ? -offset : offset;
        group.position.y = wide ? 0.02 : -0.15;
        renderer.render(scene, camera);
    };

    const scheduleFrame = () => {
        if (disposed || reducedMotion || frameId !== 0) return;
        if (!visible || document.visibilityState === "hidden") return;
        lastTime = performance.now();
        frameId = window.requestAnimationFrame(renderFrame);
    };

    const renderFrame = (now: number) => {
        frameId = 0;
        if (disposed || !visible || document.visibilityState === "hidden") return;

        const delta = Math.min(0.05, (now - lastTime) / 1000);
        lastTime = now;
        elapsed += delta;
        uniforms.uTime.value = elapsed;

        const width = window.innerWidth || 1;
        const height = window.innerHeight || 1;
        const targetX = (pointer.x / width - 0.5) * 2;
        const targetY = (0.5 - pointer.y / height) * 2;
        const targetRotY = (pointer.x / width - 0.5) * 0.22;
        const targetRotX = (pointer.y / height - 0.5) * 0.16;

        current.x += (targetX - current.x) * 0.12;
        current.y += (targetY - current.y) * 0.12;
        rotationY += (targetRotY - rotationY) * 0.1;
        rotationX += (targetRotX - rotationX) * 0.1;

        pointerUniform.set(current.x, current.y);
        group.rotation.y = rotationY;
        group.rotation.x = rotationX;
        renderer.render(scene, camera);
        scheduleFrame();
    };

    const onPointerMove = (event: PointerEvent) => {
        pointer.x = event.clientX;
        pointer.y = event.clientY;
        scheduleFrame();
    };

    const onMotionChange = () => {
        reducedMotion = reducedQuery.matches;
        if (reducedMotion) {
            window.cancelAnimationFrame(frameId);
            frameId = 0;
            pointerUniform.set(0, 0);
            group.rotation.set(0, 0, 0);
            renderer.render(scene, camera);
            return;
        }

        scheduleFrame();
    };

    const observer = new IntersectionObserver(([entry]) => {
        visible = entry?.isIntersecting ?? true;
        if (visible) scheduleFrame();
    });

    const resizeObserver = new ResizeObserver(() => resize());

    resize();
    observer.observe(container);
    resizeObserver.observe(container);
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    reducedQuery.addEventListener("change", onMotionChange);
    scheduleFrame();

    return () => {
        disposed = true;
        window.cancelAnimationFrame(frameId);
        window.removeEventListener("pointermove", onPointerMove);
        reducedQuery.removeEventListener("change", onMotionChange);
        resizeObserver.disconnect();
        observer.disconnect();

        if (renderer.domElement.parentElement === container) {
            container.removeChild(renderer.domElement);
        }

        geometry.dispose();
        material.dispose();
        renderer.dispose();
        renderer.forceContextLoss();
    };
};
