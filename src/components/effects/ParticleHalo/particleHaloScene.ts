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

const MOBILE_BREAKPOINT = 768;

const variants = {
    hero: {
        desktopCount: 1_250,
        mobileCount: 480,
        size: 11,
        driftA: 0.28,
        driftB: 0.16,
        zAmp: 0.14,
        pointMin: 1,
        pointMax: 18,
    },
    ring: {
        desktopCount: 1_600,
        mobileCount: 640,
        size: 3.2,
        driftA: 0.05,
        driftB: 0.028,
        zAmp: 0.04,
        pointMin: 0.7,
        pointMax: 4.2,
    },
} as const;

const vertexShader = /* glsl */ `
precision highp float;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform vec2 uPointer;
uniform float uHover;
uniform float uTime;
uniform float uSize;
uniform float uPixelRatio;
uniform float uDriftA;
uniform float uDriftB;
uniform float uZAmp;
uniform float uPointMin;
uniform float uPointMax;

attribute vec3 position;
attribute float aScale;
attribute float aSeed;

varying float vHeight;
varying float vSeed;
varying float vInfluence;

void main() {
    float phase = aSeed * 6.2831853;
    vec2 drift = vec2(
        sin(uTime * 0.42 + phase) * uDriftA + cos(uTime * 0.23 + position.y + phase) * uDriftB,
        cos(uTime * 0.31 + phase * 1.6) * uDriftA + sin(uTime * 0.19 + position.x + phase) * uDriftB
    );

    vec2 base = position.xy + drift;
    vec2 pointer = uPointer * vec2(2.1, 1.35);
    vec2 delta = base - pointer;
    float dist = length(delta);
    float influence = smoothstep(1.15, 0.0, dist) * uHover;
    vec2 push = dist > 0.0001 ? normalize(delta) * influence * 0.42 : vec2(0.0);

    vec3 pos = vec3(base + push, position.z + sin(uTime * 0.5 + phase) * uZAmp);
    pos.z += influence * 0.2;

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPosition;

    float depth = max(0.35, -mvPosition.z);
    gl_PointSize = clamp(
        uSize * aScale * uPixelRatio * (4.2 / depth),
        uPointMin,
        uPointMax
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

const createGeometry = (count: number, variant: keyof typeof variants) => {
    const positions = new Float32Array(count * 3);
    const scales = new Float32Array(count);
    const seeds = new Float32Array(count);

    for (let index = 0; index < count; index += 1) {
        const angle = Math.random() * Math.PI * 2;
        const radius =
            variant === "hero"
                ? Math.max(0.85, 0.95 + 0.9 * 0.6 + randomGaussian() * (0.9 * 0.58))
                : Math.max(0.55, 1.48 + randomGaussian() * 0.16);
        const offset = index * 3;

        positions[offset] = Math.cos(angle) * radius;
        positions[offset + 1] = Math.sin(angle) * radius;
        positions[offset + 2] = randomGaussian() * (variant === "hero" ? 0.28 : 0.06);
        scales[index] =
            variant === "hero" ? 0.55 + Math.random() * 0.45 : 0.45 + Math.random() * 0.55;
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

export type ParticleHaloOptions = {
    placement?: "center" | "side";
    variant?: keyof typeof variants;
};

export const mountParticleHalo = (
    container: HTMLElement,
    options: ParticleHaloOptions = {},
) => {
    const placement = options.placement ?? "center";
    const variantName = options.variant ?? "ring";
    const variant = variants[variantName];
    const trackWindow = variantName === "hero";
    if (!canUseWebGL()) return () => {};

    const reducedQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let reducedMotion = reducedQuery.matches;
    const count =
        window.innerWidth <= MOBILE_BREAKPOINT ? variant.mobileCount : variant.desktopCount;

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

    const geometry = createGeometry(count, options.variant ?? "ring");
    const pointerUniform = new Vector2(0, 0);
    const uniforms = {
        uPointer: { value: pointerUniform },
        uHover: { value: trackWindow ? 1 : 0 },
        uTime: { value: 0 },
        uSize: { value: variant.size },
        uPixelRatio: { value: renderer.getPixelRatio() },
        uDriftA: { value: variant.driftA },
        uDriftB: { value: variant.driftB },
        uZAmp: { value: variant.zAmp },
        uPointMin: { value: variant.pointMin },
        uPointMax: { value: variant.pointMax },
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

    const host = container.parentElement ?? container;
    const pointer = trackWindow
        ? { x: window.innerWidth * 0.5, y: window.innerHeight * 0.5 }
        : { x: 0.5, y: 0.5 };
    const current = { x: 0, y: 0 };
    let hovering = trackWindow;
    let hoverAmount = trackWindow ? 1 : 0;
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

        if (placement === "side") {
            const wide = width / height > 1.05;
            const offset = wide ? 1.65 : 0;
            const rtl = document.documentElement.dir === "rtl";
            group.position.x = rtl ? -offset : offset;
            group.position.y = wide ? 0.02 : -0.15;
        } else {
            group.position.x = 0;
            group.position.y = 0;
        }
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

        if (trackWindow) {
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
            uniforms.uHover.value = 1;
        } else {
            const hoverTarget = hovering ? 1 : 0;
            hoverAmount += (hoverTarget - hoverAmount) * 0.14;
            uniforms.uHover.value = hoverAmount;

            if (hovering) {
                const targetX = (pointer.x - 0.5) * 2;
                const targetY = (0.5 - pointer.y) * 2;
                current.x += (targetX - current.x) * 0.12;
                current.y += (targetY - current.y) * 0.12;
            }

            const targetRotY = (pointer.x - 0.5) * 0.22 * hoverAmount;
            const targetRotX = (pointer.y - 0.5) * 0.16 * hoverAmount;
            rotationY += (targetRotY - rotationY) * 0.1;
            rotationX += (targetRotX - rotationX) * 0.1;
        }

        pointerUniform.set(current.x, current.y);
        group.rotation.y = rotationY;
        group.rotation.x = rotationX;
        renderer.render(scene, camera);
        scheduleFrame();
    };

    const onPointerMove = (event: PointerEvent) => {
        if (trackWindow) {
            pointer.x = event.clientX;
            pointer.y = event.clientY;
            scheduleFrame();
            return;
        }

        const rect = host.getBoundingClientRect();

        if (rect.width === 0 || rect.height === 0) return;

        pointer.x = (event.clientX - rect.left) / rect.width;
        pointer.y = (event.clientY - rect.top) / rect.height;
        hovering = true;
        scheduleFrame();
    };

    const onPointerLeave = () => {
        hovering = false;
        scheduleFrame();
    };

    const onMotionChange = () => {
        reducedMotion = reducedQuery.matches;
        if (reducedMotion) {
            window.cancelAnimationFrame(frameId);
            frameId = 0;
            hovering = false;
            hoverAmount = 0;
            uniforms.uHover.value = 0;
            pointerUniform.set(0, 0);
            group.rotation.set(0, 0, 0);
            renderer.render(scene, camera);
            return;
        }

        if (trackWindow) {
            hovering = true;
            hoverAmount = 1;
            uniforms.uHover.value = 1;
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
    if (trackWindow) {
        window.addEventListener("pointermove", onPointerMove, { passive: true });
    } else {
        host.addEventListener("pointermove", onPointerMove);
        host.addEventListener("pointerleave", onPointerLeave);
    }
    reducedQuery.addEventListener("change", onMotionChange);
    scheduleFrame();

    return () => {
        disposed = true;
        window.cancelAnimationFrame(frameId);
        if (trackWindow) {
            window.removeEventListener("pointermove", onPointerMove);
        } else {
            host.removeEventListener("pointermove", onPointerMove);
            host.removeEventListener("pointerleave", onPointerLeave);
        }
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
