import { gsap } from "gsap";
import {
    ACESFilmicToneMapping,
    AdditiveBlending,
    AmbientLight,
    AnimationMixer,
    BackSide,
    Box3,
    BoxGeometry,
    BufferGeometry,
    CircleGeometry,
    DirectionalLight,
    Float32BufferAttribute,
    Group,
    HemisphereLight,
    InstancedBufferAttribute,
    InstancedMesh,
    LoopOnce,
    Mesh,
    MeshBasicMaterial,
    PerspectiveCamera,
    Plane,
    PMREMGenerator,
    Points,
    Quaternion,
    Raycaster,
    Scene,
    ShaderMaterial,
    SkinnedMesh,
    SphereGeometry,
    SRGBColorSpace,
    Vector2,
    Vector3,
    Vector4,
    WebGLRenderer,
    type AnimationAction,
    type MeshStandardMaterial,
    type Object3D,
} from "three";
import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { FilmPass } from "three/addons/postprocessing/FilmPass.js";
import { OutputPass } from "three/addons/postprocessing/OutputPass.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { ShaderPass } from "three/addons/postprocessing/ShaderPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";

const ROBOT_URL = "/models/contact-hero-astronaut.glb";

const heightGlsl = /* glsl */ `
float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

float pylonHeight(vec2 xz) {
    float n1 = noise(xz * 0.42 + vec2(uTime * 0.045, -uTime * 0.03));
    float n2 = noise(xz * 0.18 + vec2(-uTime * 0.02, uTime * 0.025));
    float wave = sin(xz.x * 0.62 + xz.y * 0.18 + uTime * 0.85) * 0.5 + 0.5;
    float h = 0.16 + n1 * 1.08 + n2 * 0.7 + wave * 0.26;

    vec2 delta = xz - uPointer;
    h += exp(-dot(delta, delta) * 1.85) * 0.95 * uPointerAmt;

    float age = uTime - uRipple.z;
    if (uRipple.w > 0.5 && age >= 0.0 && age < 3.2) {
        float rd = length(xz - uRipple.xy);
        float front = age * 3.4;
        float ring = sin((rd - front) * 9.0);
        float env = exp(-pow(rd - front, 2.0) * 2.2) * exp(-age * 0.55);
        h += ring * env * 0.85;
    }

    return h;
}
`;

const pylonVertex = /* glsl */ `
uniform float uTime;
uniform vec2 uPointer;
uniform float uPointerAmt;
uniform vec4 uRipple;
uniform float uReveal;
uniform float uCap;

attribute vec2 aOffset;
attribute float aSeed;

varying vec3 vNormal;
varying vec3 vWorld;
varying float vTip;
varying float vSeed;

${heightGlsl}

void main() {
    float h = max(pylonHeight(aOffset), 0.12) * uReveal;
    float along = position.y + 0.5;
    vec3 p = position;
    float width = mix(0.055, 0.092, aSeed);
    vec2 pull = uPointer - aOffset;
    float influence = exp(-dot(pull, pull) * 1.7) * uPointerAmt;

    if (uCap > 0.5) {
        p.xz *= width * 1.45;
        p.y = h + along * 0.055;
        p.xz += pull * influence * 0.14;
    } else {
        p.xz *= width;
        p.y = along * h;
        p.xz += pull * influence * 0.16 * along;
    }

    vec4 world = modelMatrix * instanceMatrix * vec4(aOffset.x + p.x, p.y, aOffset.y + p.z, 1.0);
    vWorld = world.xyz;
    vNormal = normalize(mat3(modelMatrix) * normal);
    vTip = along;
    vSeed = aSeed;
    gl_Position = projectionMatrix * viewMatrix * world;
}
`;

const shaftFragment = /* glsl */ `
varying vec3 vNormal;
varying vec3 vWorld;
varying float vTip;
varying float vSeed;

void main() {
    vec3 metal = mix(vec3(0.90, 0.93, 0.97), vec3(0.96, 0.97, 0.99), vSeed);
    vec3 normal = normalize(vNormal);
    vec3 viewDir = normalize(cameraPosition - vWorld);
    vec3 lightDir = normalize(vec3(-0.25, 0.86, 0.4));
    float ndl = dot(normal, lightDir) * 0.5 + 0.5;
    float fresnel = pow(1.0 - max(dot(normal, viewDir), 0.0), 2.6);
    vec3 color = metal * (0.94 + 0.1 * ndl);
    color += vec3(0.55, 0.72, 1.0) * fresnel * 0.12;
    float spec = pow(max(dot(reflect(-lightDir, normal), viewDir), 0.0), 40.0);
    color += vec3(1.0, 1.0, 1.0) * spec * 0.18;
    float tip = smoothstep(0.82, 1.0, vTip);
    color = mix(color, vec3(0.48, 0.68, 1.0), tip);
    float dist = distance(cameraPosition, vWorld);
    float fog = smoothstep(10.0, 28.0, dist);
    color = mix(color, vec3(0.96, 0.97, 0.99), fog * 0.55);
    gl_FragColor = vec4(color, 1.0);
}
`;

const capFragment = /* glsl */ `
varying vec3 vNormal;
varying vec3 vWorld;
varying float vTip;
varying float vSeed;

void main() {
    vec3 color = vec3(0.62, 0.78, 1.05);
    float dist = distance(cameraPosition, vWorld);
    float fog = smoothstep(9.0, 24.0, dist);
    color = mix(color, vec3(0.82, 0.90, 1.0), fog);
    gl_FragColor = vec4(color, 1.0);
}
`;

const skyVertex = /* glsl */ `
varying vec3 vDir;
void main() {
    vDir = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const skyFragment = /* glsl */ `
varying vec3 vDir;
void main() {
    vec3 dir = normalize(vDir);
    float height = dir.y;
    vec3 zenith = vec3(0.90, 0.94, 0.99);
    vec3 mid = vec3(0.90, 0.94, 0.99);
    vec3 horizon = vec3(0.97, 0.98, 0.99);
    vec3 sunColor = vec3(0.55, 0.72, 1.0);
    vec3 color = mix(mid, zenith, smoothstep(0.05, 0.75, height));
    color = mix(color, horizon, smoothstep(0.18, -0.08, height));
    vec3 sunDir = normalize(vec3(-0.75, 0.28, -1.0));
    float sunDist = distance(dir, sunDir);
    color += sunColor * smoothstep(0.28, 0.0, sunDist) * 0.18;
    color += sunColor * smoothstep(0.05, 0.0, sunDist) * 0.35;
    gl_FragColor = vec4(color, 1.0);
}
`;

const groundVertex = /* glsl */ `
varying vec3 vWorld;
void main() {
    vec4 world = modelMatrix * vec4(position, 1.0);
    vWorld = world.xyz;
    gl_Position = projectionMatrix * viewMatrix * world;
}
`;

const groundFragment = /* glsl */ `
varying vec3 vWorld;
void main() {
    float dist = length(vWorld.xz);
    // --light-gray ground with soft brand blue fade
    vec3 nearColor = vec3(0.945, 0.953, 0.965);
    vec3 farColor = vec3(0.82, 0.88, 0.96);
    vec3 color = mix(nearColor, farColor, smoothstep(2.0, 16.0, dist));
    gl_FragColor = vec4(color, 1.0);
}
`;

const dustVertex = /* glsl */ `
uniform float uTime;
uniform float uPixelRatio;
attribute float aSeed;
varying float vSeed;
void main() {
    vSeed = aSeed;
    vec3 pos = position;
    pos.y += sin(uTime * 0.4 + aSeed * 6.283) * 0.22;
    pos.x += cos(uTime * 0.25 + aSeed * 4.0) * 0.16;
    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = (3.0 * uPixelRatio) / max(-mv.z, 0.2);
}
`;

const dustFragment = /* glsl */ `
varying float vSeed;
void main() {
    vec2 coord = gl_PointCoord - 0.5;
    float dist = dot(coord, coord);
    if (dist > 0.25) discard;
    float alpha = smoothstep(0.25, 0.02, dist) * mix(0.12, 0.32, vSeed);
    gl_FragColor = vec4(0.35, 0.55, 0.92, alpha);
}
`;

const vignetteShader = {
    uniforms: {
        tDiffuse: { value: null },
        uStrength: { value: 0.06 },
    },
    vertexShader: /* glsl */ `
        varying vec2 vUv;
        void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,
    fragmentShader: /* glsl */ `
        uniform sampler2D tDiffuse;
        uniform float uStrength;
        varying vec2 vUv;
        void main() {
            vec4 color = texture2D(tDiffuse, vUv);
            vec2 p = vUv * (1.0 - vUv.yx);
            float vig = pow(clamp(p.x * p.y * 18.0, 0.0, 1.0), 0.42);
            color.rgb *= mix(1.0 - uStrength, 1.0, vig);
            color.rgb = mix(color.rgb, color.rgb * vec3(0.97, 0.98, 1.02), 0.12);
            gl_FragColor = color;
        }
    `,
};

type Tier = {
    cols: number;
    rows: number;
    spacing: number;
    pixelCap: number;
    post: boolean;
    dust: number;
};

type Layout = {
    fov: number;
    cam: Vector3;
    look: Vector3;
    robot: Vector3;
    side: number;
    yaw: number;
};

const canUseWebGL = () => {
    try {
        const canvas = document.createElement("canvas");
        return Boolean(canvas.getContext("webgl2") || canvas.getContext("webgl"));
    } catch {
        return false;
    }
};

const tierFor = (width: number): Tier => {
    if (width < 768) {
        return { cols: 26, rows: 18, spacing: 0.62, pixelCap: 1.15, post: false, dust: 0 };
    }
    if (width < 1100) {
        return { cols: 46, rows: 32, spacing: 0.5, pixelCap: 1.35, post: true, dust: 80 };
    }
    return { cols: 70, rows: 46, spacing: 0.44, pixelCap: 1.5, post: true, dust: 140 };
};

const buildGrid = (tier: Tier) => {
    const count = tier.cols * tier.rows;
    const offsets = new Float32Array(count * 2);
    const seeds = new Float32Array(count);
    let index = 0;

    for (let row = 0; row < tier.rows; row += 1) {
        for (let col = 0; col < tier.cols; col += 1) {
            offsets[index * 2] =
                (col - (tier.cols - 1) / 2) * tier.spacing + (row % 2 ? tier.spacing * 0.5 : 0);
            offsets[index * 2 + 1] = 1.35 - row * tier.spacing * 0.86;
            seeds[index] = Math.random();
            index += 1;
        }
    }

    return { count, offsets, seeds };
};

const disposeObject = (root: Object3D) => {
    root.traverse((obj) => {
        const mesh = obj as Mesh;
        if (!mesh.isMesh) return;
        mesh.geometry?.dispose();
        const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
        materials.forEach((material) => material?.dispose());
    });
};

export const mountContactHeroScene = (container: HTMLElement) => {
    if (!canUseWebGL()) return () => {};

    const reducedQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let reduced = reducedQuery.matches;
    const tier = tierFor(container.clientWidth || window.innerWidth);
    const { count, offsets, seeds } = buildGrid(tier);

    let renderer: WebGLRenderer;
    try {
        renderer = new WebGLRenderer({
            antialias: false,
            alpha: false,
            powerPreference: "high-performance",
        });
    } catch {
        return () => {};
    }

    renderer.setClearColor(0xf7f8fa, 1);
    renderer.outputColorSpace = SRGBColorSpace;
    renderer.toneMapping = ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    renderer.domElement.className = "contact_hero_canvas";
    renderer.domElement.setAttribute("aria-hidden", "true");
    container.appendChild(renderer.domElement);

    const scene = new Scene();
    const camera = new PerspectiveCamera(36, 1, 0.1, 80);
    const raycaster = new Raycaster();
    const groundPlane = new Plane(new Vector3(0, 1, 0), 0);
    const pointer = new Vector2(0, -6);
    const targetPointer = new Vector2(0, -6);
    const pointerNdc = new Vector2();
    const ndc = new Vector2();
    const hitPoint = new Vector3();

    const uTime = { value: reduced ? 2.4 : 0 };
    const uPointer = { value: pointer };
    const uPointerAmt = { value: 0 };
    const uRipple = { value: new Vector4(0, 0, -10, 0) };
    const uReveal = { value: reduced ? 1 : 0 };
    const shared = { uTime, uPointer, uPointerAmt, uRipple, uReveal };

    const sky = new Mesh(
        new SphereGeometry(48, 32, 20),
        new ShaderMaterial({
            vertexShader: skyVertex,
            fragmentShader: skyFragment,
            side: BackSide,
            depthWrite: false,
        }),
    );
    sky.renderOrder = -2;
    sky.frustumCulled = false;
    scene.add(sky);

    const ground = new Mesh(
        new CircleGeometry(42, 48),
        new ShaderMaterial({ vertexShader: groundVertex, fragmentShader: groundFragment }),
    );
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.02;
    ground.renderOrder = -1;
    scene.add(ground);

    const offsetAttr = new InstancedBufferAttribute(offsets, 2);
    const seedAttr = new InstancedBufferAttribute(seeds, 1);
    const shaftGeo = new BoxGeometry(1, 1, 1);
    const capGeo = new BoxGeometry(1, 1, 1);
    shaftGeo.setAttribute("aOffset", offsetAttr);
    shaftGeo.setAttribute("aSeed", seedAttr);
    capGeo.setAttribute("aOffset", offsetAttr);
    capGeo.setAttribute("aSeed", seedAttr);

    const shaftMat = new ShaderMaterial({
        uniforms: { ...shared, uCap: { value: 0 } },
        vertexShader: pylonVertex,
        fragmentShader: shaftFragment,
        toneMapped: false,
    });
    const capMat = new ShaderMaterial({
        uniforms: { ...shared, uCap: { value: 1 } },
        vertexShader: pylonVertex,
        fragmentShader: capFragment,
        toneMapped: false,
    });
    const shafts = new InstancedMesh(shaftGeo, shaftMat, count);
    const caps = new InstancedMesh(capGeo, capMat, count);
    shafts.count = count;
    caps.count = count;
    shafts.frustumCulled = false;
    caps.frustumCulled = false;
    scene.add(shafts, caps);

    let dust: Points | null = null;
    let dustMat: ShaderMaterial | null = null;
    const uPixelRatio = { value: 1 };
    if (tier.dust > 0 && !reduced) {
        const dustGeo = new BufferGeometry();
        const dustPositions = new Float32Array(tier.dust * 3);
        const dustSeeds = new Float32Array(tier.dust);
        for (let index = 0; index < tier.dust; index += 1) {
            dustPositions[index * 3] = (Math.random() - 0.5) * 14;
            dustPositions[index * 3 + 1] = Math.random() * 2.2 + 0.15;
            dustPositions[index * 3 + 2] = 2 - Math.random() * 14;
            dustSeeds[index] = Math.random();
        }
        dustGeo.setAttribute("position", new Float32BufferAttribute(dustPositions, 3));
        dustGeo.setAttribute("aSeed", new Float32BufferAttribute(dustSeeds, 1));
        dustMat = new ShaderMaterial({
            uniforms: { uTime, uPixelRatio },
            vertexShader: dustVertex,
            fragmentShader: dustFragment,
            transparent: true,
            depthWrite: false,
            blending: AdditiveBlending,
        });
        dust = new Points(dustGeo, dustMat);
        dust.frustumCulled = false;
        scene.add(dust);
    }

    scene.add(new HemisphereLight(0xffffff, 0xc5d4ea, 0.22));
    scene.add(new AmbientLight(0xd5deea, 0.08));
    const sun = new DirectionalLight(0xffffff, 1.9);
    sun.position.set(-5.5, 6.2, 3.5);
    scene.add(sun);
    const rim = new DirectionalLight(0x295cc7, 0.55);
    rim.position.set(4.2, 2.4, 5.5);
    scene.add(rim);
    const fill = new DirectionalLight(0x1691d0, 0.28);
    fill.position.set(-2.5, 1.8, -4);
    scene.add(fill);

    const environment = new RoomEnvironment();
    const pmrem = new PMREMGenerator(renderer);
    scene.environment = pmrem.fromScene(environment, 0.04).texture;
    environment.dispose();
    pmrem.dispose();

    const rig = new Group();
    scene.add(rig);
    const shadow = new Mesh(
        new CircleGeometry(0.55, 28),
        new MeshBasicMaterial({ color: 0x0b1a33, transparent: true, opacity: 0.28, depthWrite: false }),
    );
    shadow.rotation.x = -Math.PI / 2;
    shadow.position.y = 0.02;
    scene.add(shadow);

    let composer: EffectComposer | null = null;
    if (tier.post) {
        try {
            composer = new EffectComposer(renderer);
            composer.addPass(new RenderPass(scene, camera));
            const bloom = new UnrealBloomPass(new Vector2(1, 1), 0.04, 0.3, 1.2);
            composer.addPass(bloom);
            composer.addPass(new FilmPass(0.045, false));
            composer.addPass(new ShaderPass(vignetteShader));
            composer.addPass(new OutputPass());
        } catch {
            composer = null;
        }
    }

    const draco = new DRACOLoader();
    draco.setDecoderPath("/draco/");
    const loader = new GLTFLoader();
    loader.setDRACOLoader(draco);

    let mixer: AnimationMixer | null = null;
    let levitateAction: AnimationAction | null = null;
    let waveAction: AnimationAction | null = null;
    let head: Object3D | null = null;
    const headPose = new Quaternion();
    let headReady = false;
    let waveTimer = 0;
    let alive = true;
    const enter = { t: reduced ? 1 : 0 };

    const playWave = () => {
        if (!waveAction || !levitateAction || reduced) return;
        waveAction.reset();
        waveAction.setLoop(LoopOnce, 1);
        waveAction.clampWhenFinished = true;
        waveAction.fadeIn(0.25).play();
        levitateAction.fadeOut(0.25);
    };

    const scheduleWave = () => {
        waveTimer = window.setTimeout(() => {
            playWave();
            scheduleWave();
        }, 6800);
    };

    const onMixerFinished = (event: { action: AnimationAction }) => {
        if (!waveAction || event.action !== waveAction || !levitateAction) return;
        levitateAction.reset().fadeIn(0.35).play();
        waveAction.fadeOut(0.35);
    };

    loader.load(
        ROBOT_URL,
        (gltf) => {
            if (!alive) {
                disposeObject(gltf.scene);
                return;
            }

            const model = gltf.scene;
            mixer = new AnimationMixer(model);
            const levitateClip = gltf.animations.find((clip) => clip.name.toLowerCase().includes("levitate"));
            const waveClip = gltf.animations.find((clip) => clip.name.toLowerCase().includes("wave"));

            if (levitateClip) {
                levitateAction = mixer.clipAction(levitateClip);
                levitateAction.play();
                mixer.update(reduced ? 1.1 : 0.4);
                if (reduced) mixer.timeScale = 0;
            }

            if (waveClip && !reduced) {
                waveAction = mixer.clipAction(waveClip);
                waveAction.setLoop(LoopOnce, 1);
                waveAction.clampWhenFinished = true;
                mixer.addEventListener("finished", onMixerFinished);
                waveTimer = window.setTimeout(() => {
                    playWave();
                    scheduleWave();
                }, 2600);
            }

            model.traverse((obj) => {
                obj.frustumCulled = false;
                if (obj.name === "head") {
                    head = obj;
                    headPose.copy(obj.quaternion);
                    headReady = true;
                }
                const mesh = obj as Mesh;
                if (!mesh.isMesh) return;
                const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
                materials.forEach((material) => {
                    if (material && "envMapIntensity" in material) {
                        const standard = material as MeshStandardMaterial;
                        standard.transparent = false;
                        standard.opacity = 1;
                        standard.depthWrite = true;
                        if ("transmission" in standard) {
                            (standard as MeshStandardMaterial & { transmission: number }).transmission = 0;
                        }
                        const matName = standard.name;
                        if (matName === "M_Visor_Black") {
                            standard.envMapIntensity = 0.4;
                            standard.roughness = 0.16;
                            standard.metalness = 0.9;
                            standard.color.setRGB(0.02, 0.03, 0.05);
                        } else if (matName === "M_Eye_Glow" || matName === "M_Glow_Orange") {
                            standard.envMapIntensity = 0.2;
                            standard.emissiveIntensity = 1.4;
                        } else if (matName === "M_Copper") {
                            standard.envMapIntensity = 1.15;
                            standard.roughness = 0.22;
                            standard.metalness = 1;
                        } else if (matName === "M_Plastic_White") {
                            standard.envMapIntensity = 0.5;
                            standard.roughness = 0.36;
                            standard.metalness = 0.04;
                        } else {
                            standard.envMapIntensity = 0.7;
                        }
                    }
                });
            });

            model.updateMatrixWorld(true);
            const probe = new Box3().setFromObject(model);
            let size = probe.getSize(new Vector3());
            if (size.y < 0.2 || size.y > 8) {
                const geomBox = new Box3();
                model.traverse((obj) => {
                    const mesh = obj as SkinnedMesh;
                    if (!mesh.isMesh) return;
                    if (!mesh.geometry.boundingBox) mesh.geometry.computeBoundingBox();
                    if (!mesh.geometry.boundingBox) return;
                    geomBox.union(mesh.geometry.boundingBox.clone().applyMatrix4(mesh.matrixWorld));
                });
                size = geomBox.getSize(new Vector3());
            }
            const scale = size.y > 0.05 && size.y < 30 ? 1.675 / size.y : 1;
            model.scale.setScalar(scale);
            model.updateMatrixWorld(true);
            const fitted = new Box3().setFromObject(model);
            const center = fitted.getCenter(new Vector3());
            model.position.x -= center.x;
            model.position.z -= center.z;
            model.position.y -= fitted.min.y;
            rig.add(model);

            if (!reduced) {
                enter.t = 0;
                gsap.to(enter, { t: 1, duration: 1.75, ease: "power3.out", delay: 0.12 });
            }
            placeRig();
            render();
        },
        undefined,
        () => {
            enter.t = 1;
        },
    );

    let layout = readLayout();
    let hovering = false;
    let disposed = false;
    let visible = true;
    let ticking = false;
    let last = performance.now();
    let elapsed = reduced ? 2.4 : 0;

    function readLayout(): Layout {
        const width = container.clientWidth || window.innerWidth;
        const side = document.documentElement.dir === "rtl" ? -1 : 1;
        if (width < 768) {
            return {
                fov: 50,
                cam: new Vector3(0, 2.7, 6.6),
                look: new Vector3(0, 0.05, -1.8),
                robot: new Vector3(0, 0.02, 2.55),
                side,
                yaw: 0,
            };
        }
        if (width < 1100) {
            return {
                fov: 42,
                cam: new Vector3(0, 2.15, 5.7),
                look: new Vector3(0, 0.3, -2.8),
                robot: new Vector3(0, 0.04, 2.25),
                side,
                yaw: 0,
            };
        }
        return {
            fov: 36,
            cam: new Vector3(0, 1.82, 5.05),
            look: new Vector3(0, 0.38, -3.5),
            robot: new Vector3(0, 0.06, 2.05),
            side,
            yaw: 0,
        };
    }

    const applyLayout = () => {
        layout = readLayout();
        camera.fov = layout.fov;
        camera.position.copy(layout.cam);
        camera.lookAt(layout.look);
    };

    const resize = () => {
        const width = container.clientWidth;
        const height = container.clientHeight;
        if (width === 0 || height === 0) return;

        const ratio = Math.min(window.devicePixelRatio || 1, tier.pixelCap);
        applyLayout();
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setPixelRatio(ratio);
        renderer.setSize(width, height, false);
        uPixelRatio.value = ratio;
        composer?.setPixelRatio(ratio);
        composer?.setSize(width, height);
        placeRig();
        render();
    };

    const project = (clientX: number, clientY: number) => {
        const rect = container.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) return null;
        ndc.x = ((clientX - rect.left) / rect.width) * 2 - 1;
        ndc.y = -(((clientY - rect.top) / rect.height) * 2 - 1);
        raycaster.setFromCamera(ndc, camera);
        return raycaster.ray.intersectPlane(groundPlane, hitPoint) ? hitPoint : null;
    };

    const section = (container.closest(".contact_hero") as HTMLElement | null) ?? container;

    const onPointerMove = (event: PointerEvent) => {
        if (reduced) return;
        const rect = section.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) return;
        pointerNdc.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        pointerNdc.y = -(((event.clientY - rect.top) / rect.height) * 2 - 1);
        hovering = true;
        const hit = project(event.clientX, event.clientY);
        if (hit) targetPointer.set(hit.x, hit.z);
    };

    const onPointerLeave = () => {
        hovering = false;
    };

    const onPointerDown = (event: PointerEvent) => {
        if (reduced) return;
        const target = event.target;
        if (target instanceof Element && target.closest("a, button, input, textarea, select, label")) return;
        const hit = project(event.clientX, event.clientY);
        if (!hit) return;
        uRipple.value.set(hit.x, hit.z, uTime.value, 1);
    };

    function render() {
        if (disposed) return;
        if (composer) composer.render();
        else renderer.render(scene, camera);
    }

    const onTick = () => {
        if (disposed || reduced) return;
        if (!visible || document.visibilityState === "hidden") return;

        const now = performance.now();
        const delta = Math.min(0.05, (now - last) / 1000);
        last = now;
        elapsed += delta;
        uTime.value = elapsed;

        pointer.lerp(targetPointer, 0.08);
        const amountTarget = hovering ? 1 : 0;
        uPointerAmt.value += (amountTarget - uPointerAmt.value) * 0.08;

        const camX = layout.cam.x + pointerNdc.x * 0.22;
        const camY = layout.cam.y + pointerNdc.y * 0.1;
        camera.position.x += (camX - camera.position.x) * 0.06;
        camera.position.y += (camY - camera.position.y) * 0.06;
        camera.position.z = layout.cam.z;
        camera.lookAt(layout.look);

        placeRig();
        mixer?.update(delta);
        if (head && headReady && !reduced) {
            head.quaternion.copy(headPose);
            head.rotateY(pointerNdc.x * 0.4);
            head.rotateX(pointerNdc.y * -0.18);
        }

        render();
    };

    function placeRig() {
        const fromY = layout.robot.y - 0.85;
        rig.position.x = layout.robot.x;
        rig.position.y = fromY + (layout.robot.y - fromY) * enter.t + (reduced ? 0 : Math.sin(elapsed * 0.85) * 0.04 * enter.t);
        rig.position.z = layout.robot.z;
        const targetYaw = layout.yaw + (reduced ? 0 : pointerNdc.x * 0.18);
        if (reduced) {
            rig.rotation.set(0, targetYaw, 0);
        } else {
            rig.rotation.y += (targetYaw - rig.rotation.y) * 0.06;
            rig.rotation.x += (pointerNdc.y * -0.08 - rig.rotation.x) * 0.06;
        }
        shadow.position.x = rig.position.x;
        shadow.position.z = rig.position.z;
        const fit = (container.clientWidth || window.innerWidth) < 768 ? 0.92 : (container.clientWidth || window.innerWidth) < 1100 ? 1.05 : 1.2;
        rig.scale.setScalar(fit);
        shadow.scale.setScalar((0.35 + enter.t * 0.65) * fit);
    }

    const start = () => {
        if (ticking || disposed || reduced) return;
        ticking = true;
        last = performance.now();
        gsap.ticker.add(onTick);
    };

    const stop = () => {
        if (!ticking) return;
        ticking = false;
        gsap.ticker.remove(onTick);
    };

    const onMotionChange = () => {
        reduced = reducedQuery.matches;
        if (reduced) {
            stop();
            uReveal.value = 1;
            uPointerAmt.value = 0;
            enter.t = 1;
            if (mixer) mixer.timeScale = 0;
            render();
            return;
        }
        if (mixer) mixer.timeScale = 1;
        start();
    };

    const onContextLost = (event: Event) => {
        event.preventDefault();
        container.classList.add("is-lost");
        stop();
    };

    const observer = new IntersectionObserver(([entry]) => {
        visible = entry?.isIntersecting ?? true;
        if (visible) {
            last = performance.now();
            if (reduced) render();
        }
    });

    const resizeObserver = new ResizeObserver(() => resize());

    if (!reduced) {
        gsap.to(uReveal, { value: 1, duration: 1.9, ease: "power2.out", delay: 0.08 });
    }

    resize();
    observer.observe(container);
    resizeObserver.observe(container);
    section.addEventListener("pointermove", onPointerMove);
    section.addEventListener("pointerleave", onPointerLeave);
    section.addEventListener("pointerdown", onPointerDown);
    reducedQuery.addEventListener("change", onMotionChange);
    renderer.domElement.addEventListener("webglcontextlost", onContextLost);
    start();
    if (reduced) render();

    return () => {
        alive = false;
        disposed = true;
        stop();
        window.clearTimeout(waveTimer);
        gsap.killTweensOf(uReveal);
        gsap.killTweensOf(enter);
        section.removeEventListener("pointermove", onPointerMove);
        section.removeEventListener("pointerleave", onPointerLeave);
        section.removeEventListener("pointerdown", onPointerDown);
        reducedQuery.removeEventListener("change", onMotionChange);
        renderer.domElement.removeEventListener("webglcontextlost", onContextLost);
        resizeObserver.disconnect();
        observer.disconnect();
        mixer?.stopAllAction();
        mixer?.uncacheRoot(mixer.getRoot());

        if (renderer.domElement.parentElement === container) {
            container.removeChild(renderer.domElement);
        }

        shaftGeo.dispose();
        capGeo.dispose();
        shaftMat.dispose();
        capMat.dispose();
        sky.geometry.dispose();
        (sky.material as ShaderMaterial).dispose();
        ground.geometry.dispose();
        (ground.material as ShaderMaterial).dispose();
        shadow.geometry.dispose();
        (shadow.material as MeshBasicMaterial).dispose();
        dust?.geometry.dispose();
        dustMat?.dispose();
        disposeObject(rig);
        scene.environment?.dispose();
        composer?.dispose();
        draco.dispose();
        renderer.dispose();
        renderer.forceContextLoss();
    };
};
