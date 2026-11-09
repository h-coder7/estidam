import { gsap } from "gsap";
import {
    BufferGeometry,
    Color,
    Float32BufferAttribute,
    Group,
    LinearSRGBColorSpace,
    Matrix4,
    NoToneMapping,
    PerspectiveCamera,
    Points,
    Raycaster,
    Scene,
    ShaderMaterial,
    Vector2,
    Vector3,
    WebGLRenderer,
} from "three";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { ShaderPass } from "three/addons/postprocessing/ShaderPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";
import { CopyShader } from "three/addons/shaders/CopyShader.js";
import { GammaCorrectionShader } from "three/addons/shaders/GammaCorrectionShader.js";

const WAVE_COUNT = 40_000;
const YAW = (40 * Math.PI) / 180;
const CORE_COUNT = 1_600;
const MOTE_COUNT = 5_500;
const WAVE_RADIUS = 2.2;
const WAVE_HEIGHT = 0.1;
const POINTER_RADIUS = 0.35;
const POINTER_STRENGTH = 0.5;

function linearVec(hex: number) {
    const color = new Color(hex);
    return new Vector3(color.r, color.g, color.b);
}

const WAVE_COOL = linearVec(0xc5eeff);
const WAVE_WARM = linearVec(0x1496d4);
const WAVE_LIGHT = linearVec(0x7fd4f8);
const MOTE_COLOR = linearVec(0x5ec8f2);
const MOTE_EDGE = linearVec(0xa6e4fb);
const CORNER_BLUE = linearVec(0x10204a);
const CORNER_DEEP = linearVec(0x0a2e6b);

const waveVertex = /* glsl */ `
uniform float uTime;
uniform float uAnimate;
uniform float uAmplitude;
uniform float uExpand;
uniform float uSpin;
uniform float uChaos;
uniform float uOpacity;
uniform vec2 uPointer;
uniform float uPointerAmt;
uniform float uPixelRatio;
uniform float uHeight;

attribute float aRadius;
attribute float aAngle;
attribute float aSeed;
attribute float aSize;

varying float vRadius;
varying float vCrest;
varying float vSeed;

void main() {
    float radius = aRadius * mix(0.2, 1.0, uAnimate) * (1.0 + uExpand);
    float wind = 12.6;
    float angle = aAngle + radius * wind + uTime * 0.09 * uSpin + (aSeed - 0.5) * 0.34;
    float ripple = sin(radius * 9.5 - uTime * 1.25 + aSeed * 6.2831853) * 0.03 * uAmplitude;
    float armRadius = max(0.0, radius + ripple + (fract(aSeed * 13.7) - 0.5) * 0.1);

    vec3 pos = vec3(cos(angle) * armRadius, (aSeed - 0.5) * uHeight, sin(angle) * armRadius);
    float jitter = aSeed - 0.5;
    pos.x += jitter * uChaos * 0.35;
    pos.z += (fract(aSeed * 17.13) - 0.5) * uChaos * 0.35;

    vec2 delta = pos.xz - uPointer;
    float dist = length(delta);
    float influence = (1.0 - smoothstep(0.0, POINTER_RADIUS, dist)) * uPointerAmt;
    vec2 push = dist > 0.0001 ? normalize(delta) * influence * POINTER_STRENGTH : vec2(0.0);
    pos.xz += push;

    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = aSize * uPixelRatio * (3.4 / max(0.35, -mv.z)) * mix(0.35, 1.0, uAnimate);

    vRadius = armRadius;
    vCrest = 0.5 + 0.5 * sin(radius * 9.5 - uTime * 1.25);
    vSeed = aSeed;
}
`.replace("POINTER_RADIUS", POINTER_RADIUS.toFixed(2)).replace("POINTER_STRENGTH", POINTER_STRENGTH.toFixed(2));

const waveFragment = /* glsl */ `
uniform vec3 uCool;
uniform vec3 uWarm;
uniform vec3 uLight;
uniform float uOpacity;
uniform float uCore;
uniform float uGain;

varying float vRadius;
varying float vCrest;
varying float vSeed;

void main() {
    vec2 pc = gl_PointCoord * 2.0 - 1.0;
    float d = dot(pc, pc);
    if (d > 1.0) discard;

    float glow = exp(-d * 4.4);
    float sparkle = step(0.94, fract(vSeed * 13.7));
    float span = smoothstep(0.12, 1.0, vRadius / 2.2);
    vec3 color = mix(uWarm, uLight, span);
    color = mix(color, uCool, sparkle * 0.55);
    color = mix(color, uLight, uCore);
    float spark = 0.82 + 0.18 * fract(vSeed * 41.7);
    float alpha = glow * uOpacity * spark * uGain;

    gl_FragColor = vec4(color, alpha);
}
`;

const moteVertex = /* glsl */ `
uniform float uTime;
uniform float uOpacity;
uniform float uPixelRatio;

attribute float aSeed;
attribute float aSize;

varying float vSeed;

void main() {
    float phase = aSeed * 6.2831853;
    vec3 pos = position;
    pos.x += sin(uTime * 0.17 + phase) * 0.18;
    pos.y += cos(uTime * 0.13 + phase * 1.4) * 0.12;
    pos.z += sin(uTime * 0.11 + phase * 0.7) * 0.18;

    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = aSize * uPixelRatio * (1.6 / max(0.2, -mv.z));
    vSeed = aSeed;
}
`;

const moteFragment = /* glsl */ `
uniform vec3 uColor;
uniform vec3 uColorEdge;
uniform float uOpacity;

varying float vSeed;

void main() {
    vec2 pc = gl_PointCoord * 2.0 - 1.0;
    float d = dot(pc, pc);
    if (d > 1.0) discard;
    float glow = exp(-d * 2.6);
    float alpha = glow * uOpacity * (0.35 + 0.65 * fract(vSeed * 19.0));
    vec3 color = mix(uColor, uColorEdge, fract(vSeed * 7.0));
    gl_FragColor = vec4(color, alpha);
}
`;

const finalShader = {
    uniforms: {
        tDiffuse: { value: null },
        tTorus: { value: null },
        tBloom: { value: null },
        uAtmosphere: { value: WAVE_COOL.clone() },
        uCornerBlue: { value: CORNER_BLUE.clone() },
        uCornerDeep: { value: CORNER_DEEP.clone() },
    },
    vertexShader: /* glsl */ `
        varying vec2 vUv;
        void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,
    fragmentShader: /* glsl */ `
        uniform sampler2D tTorus;
        uniform sampler2D tBloom;
        uniform vec3 uAtmosphere;
        uniform vec3 uCornerBlue;
        uniform vec3 uCornerDeep;
        varying vec2 vUv;

        void main() {
            vec4 disc = texture2D(tTorus, vUv);
            vec4 glow = texture2D(tBloom, vUv);
            vec3 color = vec3(1.0) * (1.0 - disc.a) + disc.rgb;
            color += glow.rgb * 0.22;

            gl_FragColor = vec4(min(color, vec3(1.0)), 1.0);
        }
    `,
};

type Tier = {
    wave: number;
    core: number;
    motes: number;
    pixelCap: number;
    dual: boolean;
    side: number;
    camera: Vector3;
    look: Vector3;
};

function tierFor(width: number, rtl: boolean): Tier {
    const side = rtl ? -1 : 1;
    if (width < 768) {
        return {
            wave: 16_000,
            core: 700,
            motes: 1_600,
            pixelCap: 1.15,
            dual: false,
            side,
            camera: new Vector3(0, 3.85, 1.05),
            look: new Vector3(0, 0, 0),
        };
    }
    return {
        wave: WAVE_COUNT,
        core: CORE_COUNT,
        motes: MOTE_COUNT,
        pixelCap: 1.5,
        dual: true,
        side,
        camera: new Vector3(side * 0.05, 3.45, 2.2),
        look: new Vector3(side * 0.05, 0, 0),
    };
}

function fillDisc(count: number, radius: number, height: number, sizeMin: number, sizeMax: number) {
    const arms = 2;
    const positions = new Float32Array(count * 3);
    const aRadius = new Float32Array(count);
    const aAngle = new Float32Array(count);
    const aSeed = new Float32Array(count);
    const aSize = new Float32Array(count);

    for (let i = 0; i < count; i += 1) {
        const r = Math.pow(Math.random(), 0.92) * radius;
        const arm = (i % arms) / arms;
        const spread = (Math.random() - 0.5) * (0.2 + r * 0.14);
        const angle = arm * Math.PI * 2 + spread;
        aRadius[i] = r;
        aAngle[i] = angle;
        aSeed[i] = Math.random();
        aSize[i] = sizeMin + Math.random() * (sizeMax - sizeMin);
        const i3 = i * 3;
        positions[i3] = Math.cos(angle) * r;
        positions[i3 + 1] = (Math.random() - 0.5) * height;
        positions[i3 + 2] = Math.sin(angle) * r;
    }

    const geometry = new BufferGeometry();
    geometry.setAttribute("position", new Float32BufferAttribute(positions, 3));
    geometry.setAttribute("aRadius", new Float32BufferAttribute(aRadius, 1));
    geometry.setAttribute("aAngle", new Float32BufferAttribute(aAngle, 1));
    geometry.setAttribute("aSeed", new Float32BufferAttribute(aSeed, 1));
    geometry.setAttribute("aSize", new Float32BufferAttribute(aSize, 1));
    return geometry;
}

function fillMotes(count: number) {
    const positions = new Float32Array(count * 3);
    const aSeed = new Float32Array(count);
    const aSize = new Float32Array(count);
    for (let i = 0; i < count; i += 1) {
        const i3 = i * 3;
        const r = Math.pow(Math.random(), 0.85) * 2.35;
        const angle = Math.random() * Math.PI * 2;
        positions[i3] = Math.cos(angle) * r;
        positions[i3 + 1] = (Math.random() - 0.5) * 0.06;
        positions[i3 + 2] = Math.sin(angle) * r;
        aSeed[i] = Math.random();
        aSize[i] = 3.4 + Math.random() * 4.2;
    }
    const geometry = new BufferGeometry();
    geometry.setAttribute("position", new Float32BufferAttribute(positions, 3));
    geometry.setAttribute("aSeed", new Float32BufferAttribute(aSeed, 1));
    geometry.setAttribute("aSize", new Float32BufferAttribute(aSize, 1));
    return geometry;
}

export function mountWaveGalaxy(container: HTMLElement) {
    const width = container.clientWidth || window.innerWidth;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const rtl = document.documentElement.dir === "rtl";
    let tier = tierFor(width, rtl);

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

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, tier.pixelCap));
    renderer.setSize(container.clientWidth, container.clientHeight, false);
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = LinearSRGBColorSpace;
    renderer.toneMapping = NoToneMapping;
    renderer.domElement.className = "wave_galaxy_canvas";
    container.appendChild(renderer.domElement);

    const scene = new Scene();
    const camera = new PerspectiveCamera(42, 1, 0.1, 80);
    camera.position.copy(tier.camera);
    camera.lookAt(tier.look);

    const group = new Group();
    group.rotation.x = 0.18;
    group.rotation.y = YAW;
    group.scale.setScalar(1.32);
    group.position.set(0, -0.05, reduced ? 0 : -20);
    const viewDir = new Vector3();
    const placeDisc = () => {
        camera.getWorldDirection(viewDir);
        if (viewDir.z >= -0.05) return;
        const depth =
            (group.position.y - camera.position.y) * viewDir.y + (0 - camera.position.z) * viewDir.z;
        if (depth < 0.5) return;
        const halfH = Math.tan((camera.fov * Math.PI) / 360) * Math.max(camera.aspect, 0.5);
        const centerNdc = 0.54;
        group.position.x = tier.look.x + centerNdc * halfH * depth;
    };
    scene.add(group);

    const opacity = { value: reduced ? 1 : 0 };
    const animate = { value: reduced ? 1 : 0 };
    const amplitude = { value: 1 };
    const expand = { value: 0 };
    const spin = { value: 1 };
    const chaos = { value: 0 };
    const pointer = new Vector2(8, 8);
    const pointerTarget = new Vector2(8, 8);
    const pointerAmt = { value: 0 };
    const time = { value: 0 };

    const shared = {
        uTime: time,
        uAnimate: animate,
        uAmplitude: amplitude,
        uExpand: expand,
        uSpin: spin,
        uChaos: chaos,
        uOpacity: opacity,
        uPointer: { value: pointer },
        uPointerAmt: pointerAmt,
        uPixelRatio: { value: renderer.getPixelRatio() },
        uHeight: { value: WAVE_HEIGHT },
    };

    const waveMaterial = new ShaderMaterial({
        uniforms: {
            ...shared,
            uCool: { value: WAVE_COOL },
            uWarm: { value: WAVE_WARM },
            uLight: { value: WAVE_LIGHT },
            uCore: { value: 0 },
            uGain: { value: 0.7 },
        },
        vertexShader: waveVertex,
        fragmentShader: waveFragment,
        transparent: true,
        depthWrite: false,
    });

    const coreMaterial = new ShaderMaterial({
        uniforms: {
            ...shared,
            uCool: { value: WAVE_COOL },
            uWarm: { value: WAVE_WARM },
            uLight: { value: WAVE_LIGHT },
            uCore: { value: 0 },
            uGain: { value: 0.7 },
        },
        vertexShader: waveVertex,
        fragmentShader: waveFragment,
        transparent: true,
        depthWrite: false,
    });

    const bindDisc = (material: ShaderMaterial) => {
        material.uniforms.uTime = time;
        material.uniforms.uAnimate = animate;
        material.uniforms.uAmplitude = amplitude;
        material.uniforms.uExpand = expand;
        material.uniforms.uSpin = spin;
        material.uniforms.uChaos = chaos;
        material.uniforms.uOpacity = opacity;
        material.uniforms.uPointer.value = pointer;
        material.uniforms.uPointerAmt = pointerAmt;
        material.uniforms.uPixelRatio = shared.uPixelRatio;
        material.uniforms.uHeight = shared.uHeight;
    };
    bindDisc(waveMaterial);
    bindDisc(coreMaterial);

    const wavePoints = new Points(fillDisc(tier.wave, WAVE_RADIUS, WAVE_HEIGHT, 2.6, 4.6), waveMaterial);
    const corePoints = new Points(fillDisc(tier.core, WAVE_RADIUS * 0.96, WAVE_HEIGHT, 3.4, 5.8), coreMaterial);
    wavePoints.frustumCulled = false;
    corePoints.frustumCulled = false;
    group.add(wavePoints, corePoints);

    const moteMaterial = new ShaderMaterial({
        uniforms: {
            uTime: time,
            uOpacity: opacity,
            uPixelRatio: shared.uPixelRatio,
            uColor: { value: MOTE_COLOR },
            uColorEdge: { value: MOTE_EDGE },
        },
        vertexShader: moteVertex,
        fragmentShader: moteFragment,
        transparent: true,
        depthWrite: false,
    });
    const motes = new Points(fillMotes(tier.motes), moteMaterial);
    motes.frustumCulled = false;
    group.add(motes);
    moteMaterial.uniforms.uTime = time;
    moteMaterial.uniforms.uOpacity = opacity;
    moteMaterial.uniforms.uPixelRatio = shared.uPixelRatio;

    const size = new Vector2();
    renderer.getSize(size);

    const torusComposer = new EffectComposer(renderer);
    torusComposer.addPass(new RenderPass(scene, camera));
    const torusBloom = new UnrealBloomPass(size, 0.18, 0.22, 0.08);
    torusComposer.addPass(torusBloom);

    const bloomComposer = new EffectComposer(renderer);
    bloomComposer.addPass(new RenderPass(scene, camera));
    const wideBloom = new UnrealBloomPass(size, 0.22, 0.4, 0.15);
    bloomComposer.addPass(wideBloom);

    const finalPass = new ShaderPass(finalShader);
    const finalComposer = new EffectComposer(renderer);
    finalComposer.addPass(finalPass);
    finalComposer.addPass(new ShaderPass(GammaCorrectionShader));
    finalComposer.addPass(new ShaderPass(CopyShader));

    torusComposer.renderToScreen = false;
    bloomComposer.renderToScreen = false;

    const section = (container.closest(".hero_section") ?? container) as HTMLElement;
    const raycaster = new Raycaster();
    const ndc = new Vector2();
    const localOrigin = new Vector3();
    const localDir = new Vector3();
    const inverseMatrix = new Matrix4();
    let hovering = false;
    let disposed = false;
    let ticking = false;
    let last = performance.now();

    const resize = () => {
        const nextWidth = container.clientWidth || 1;
        const nextHeight = container.clientHeight || 1;
        const rtlNow = document.documentElement.dir === "rtl";
        const nextTier = tierFor(nextWidth, rtlNow);
        const pixelRatio = Math.min(window.devicePixelRatio || 1, nextTier.pixelCap);
        renderer.setPixelRatio(pixelRatio);
        renderer.setSize(nextWidth, nextHeight, false);
        shared.uPixelRatio.value = pixelRatio;
        camera.aspect = nextWidth / nextHeight;
        if (nextTier.side !== tier.side || nextTier.dual !== tier.dual) {
            tier = nextTier;
            group.rotation.y = YAW;
            camera.position.copy(tier.camera);
        }
        camera.lookAt(tier.look);
        camera.updateProjectionMatrix();
        placeDisc();
        torusComposer.setPixelRatio(pixelRatio);
        bloomComposer.setPixelRatio(pixelRatio);
        finalComposer.setPixelRatio(pixelRatio);
        torusComposer.setSize(nextWidth, nextHeight);
        bloomComposer.setSize(nextWidth, nextHeight);
        finalComposer.setSize(nextWidth, nextHeight);
    };

    const onPointer = (event: PointerEvent) => {
        const rect = container.getBoundingClientRect();
        if (rect.width < 1 || rect.height < 1) return;
        ndc.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        ndc.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
        hovering = true;
    };

    const onPointerLeave = () => {
        hovering = false;
    };

    const renderFrame = () => {
        if (tier.dual) {
            wavePoints.visible = true;
            corePoints.visible = false;
            motes.visible = false;
            torusComposer.render();
            wavePoints.visible = false;
            corePoints.visible = true;
            motes.visible = true;
            bloomComposer.render();
            wavePoints.visible = true;
            corePoints.visible = true;
            motes.visible = true;
            finalPass.uniforms.tTorus.value = torusComposer.readBuffer.texture;
            finalPass.uniforms.tBloom.value = bloomComposer.readBuffer.texture;
            finalComposer.render();
            return;
        }

        wavePoints.visible = true;
        corePoints.visible = true;
        motes.visible = true;
        torusComposer.render();
        finalPass.uniforms.tTorus.value = torusComposer.readBuffer.texture;
        finalPass.uniforms.tBloom.value = torusComposer.readBuffer.texture;
        finalComposer.render();
    };

    const heroOffScreen = () => {
        const rect = section.getBoundingClientRect();
        return rect.bottom <= 0 || rect.top >= window.innerHeight;
    };

    const onTick = () => {
        if (disposed) return;
        // The galaxy is a full-screen WebGL pass. Once the hero has left the
        // viewport, drop the ticker the same frame so later scrolling is not
        // paying for it.
        if (heroOffScreen()) {
            stop();
            return;
        }

        const now = performance.now();
        const delta = Math.min(0.05, (now - last) / 1000);
        last = now;
        if (!reduced) time.value += delta;

        const rect = section.getBoundingClientRect();
        const traveled = Math.min(Math.max(-rect.top, 0), Math.max(rect.height, 1));
        const progress = rect.height > 0 ? traveled / rect.height : 0;
        amplitude.value = 1 + 5 * progress;
        expand.value = 0.55 * progress;
        spin.value = 1 + 1.15 * progress;
        chaos.value = 0.35 * progress;
        const zTravel = Math.max(tier.camera.z - 1.15, 0);
        camera.position.z = tier.camera.z - zTravel * progress;
        camera.position.y = tier.camera.y - progress * 0.35;
        camera.lookAt(tier.look);
        placeDisc();

        if (!reduced && hovering) {
            raycaster.setFromCamera(ndc, camera);
            group.updateMatrixWorld();
            inverseMatrix.copy(group.matrixWorld).invert();
            localOrigin.copy(raycaster.ray.origin).applyMatrix4(inverseMatrix);
            localDir.copy(raycaster.ray.direction).transformDirection(inverseMatrix);
            if (Math.abs(localDir.y) > 0.0001) {
                const t = -localOrigin.y / localDir.y;
                if (t > 0) pointerTarget.set(localOrigin.x + localDir.x * t, localOrigin.z + localDir.z * t);
            }
        }
        pointer.lerp(pointerTarget, 0.12);
        const amountTarget = hovering && !reduced ? 1 : 0;
        pointerAmt.value += (amountTarget - pointerAmt.value) * 0.08;

        renderFrame();
    };

    const start = () => {
        if (ticking || disposed || reduced || document.visibilityState === "hidden") return;
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
        // A live WebGL canvas stays a compositor layer even after drawing
        // stops, and that layer is what keeps scrolling heavy.
        if (!disposed && heroOffScreen()) renderer.domElement.style.visibility = "hidden";
    };

    const syncVisibility = () => {
        if (!heroOffScreen() && document.visibilityState !== "hidden") start();
        else stop();
    };

    resize();
    if (!reduced) {
        gsap.to(group.position, { z: 0, duration: 2, ease: "power4.out" });
        gsap.to(opacity, { value: 1, duration: 1.5, delay: 0.5, ease: "power2.out" });
        gsap.to(animate, { value: 1, duration: 2, ease: "power4.out" });
    }

    const observer = new IntersectionObserver(() => {
        syncVisibility();
    });
    observer.observe(section);

    const onVisibility = () => {
        syncVisibility();
    };

    section.addEventListener("pointermove", onPointer);
    section.addEventListener("pointerleave", onPointerLeave);
    window.addEventListener("resize", resize);
    window.addEventListener("scroll", syncVisibility, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);
    const onContextLost = (event: Event) => {
        event.preventDefault();
        stop();
        renderer.domElement.style.display = "none";
    };

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
        wavePoints.geometry.dispose();
        corePoints.geometry.dispose();
        motes.geometry.dispose();
        waveMaterial.dispose();
        coreMaterial.dispose();
        moteMaterial.dispose();
        torusBloom.dispose();
        wideBloom.dispose();
        torusComposer.dispose();
        bloomComposer.dispose();
        finalComposer.dispose();
        renderer.dispose();
        renderer.domElement.remove();
    };
}
