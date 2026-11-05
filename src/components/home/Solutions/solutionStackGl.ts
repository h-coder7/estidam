import { gsap } from "gsap";
import {
    LinearFilter,
    LinearSRGBColorSpace,
    Mesh,
    NoColorSpace,
    PerspectiveCamera,
    PlaneGeometry,
    Scene,
    ShaderMaterial,
    Texture,
    TextureLoader,
    WebGLRenderer,
} from "three";

export type StackPose = {
    y: number;
    tx: number;
    rotate: number;
    tilt: number;
    scale: number;
    opacity: number;
    depth: number;
};

const vertexShader = /* glsl */ `
varying vec2 vUv;
void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const fragmentShader = /* glsl */ `
uniform sampler2D uMap;
uniform float uTime;
uniform float uAmount;
uniform float uOpacity;
varying vec2 vUv;

void main() {
    vec2 box = abs(vUv - 0.5) - vec2(0.455);
    float corner = length(max(box, 0.0)) - 0.045;
    if (corner > 0.0) discard;

    float a = clamp(uAmount, 0.0, 1.0);
    float live = mix(0.22, 1.0, a);
    vec2 uv = vUv;
    uv.x += sin(uv.y * 10.0 + uTime * 1.6) * 0.02 * live;
    uv.y += sin(uv.x * 8.0 - uTime * 1.2) * 0.012 * live;
    uv = (uv - 0.5) * (1.0 - 0.04 * a) + 0.5;

    float shift = 0.01 * a;
    vec3 color = vec3(
        texture2D(uMap, uv + vec2(shift, 0.0)).r,
        texture2D(uMap, uv).g,
        texture2D(uMap, uv - vec2(shift, 0.0)).b
    );
    float luma = dot(color, vec3(0.299, 0.587, 0.114));
    color = mix(color, vec3(luma), 0.22 * a);
    color *= mix(1.0, 0.82, a);

    gl_FragColor = vec4(color, uOpacity);
}
`;

function textureUrl(src: string) {
    try {
        const url = new URL(src, window.location.origin);
        if (url.origin === window.location.origin) return src;
    } catch {
        return src;
    }
    return `/api/media/?url=${encodeURIComponent(src)}`;
}

export type SolutionStackGl = {
    setPoses: (poses: StackPose[]) => void;
    setHover: (scale: number) => void;
    dispose: () => void;
};

export function mountSolutionStack(host: HTMLElement, sources: string[]): Promise<SolutionStackGl | null> {
    return new Promise((resolve) => {
        let renderer: WebGLRenderer;
        try {
            renderer = new WebGLRenderer({
                antialias: true,
                alpha: true,
                powerPreference: "high-performance",
            });
        } catch {
            resolve(null);
            return;
        }

        const canvas = renderer.domElement;
        canvas.className = "solutions_stack_gl";
        canvas.setAttribute("aria-hidden", "true");
        host.appendChild(canvas);
        renderer.setClearColor(0x000000, 0);
        renderer.outputColorSpace = LinearSRGBColorSpace;
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));

        const scene = new Scene();
        const camera = new PerspectiveCamera(30, 1, 0.1, 40);
        camera.position.set(0, 0, 5.4);

        const geometry = new PlaneGeometry(1, 0.75);
        const meshes: Mesh[] = [];
        const materials: ShaderMaterial[] = [];
        const textures: Texture[] = [];
        const loader = new TextureLoader();
        let disposed = false;
        let ticking = false;
        let visible = true;
        let ready = 0;
        const hover = { value: 1 };
        let poses: StackPose[] = [];
        const time = { value: 0 };

        const resize = () => {
            const width = host.clientWidth || 1;
            const height = host.clientHeight || 1;
            renderer.setSize(width, height, false);
            camera.aspect = width / Math.max(height, 1);
            camera.updateProjectionMatrix();
        };

        const cardWidth = () => {
            const height = host.clientHeight || 1;
            const visible = 2 * camera.position.z * Math.tan((camera.fov * Math.PI) / 360);
            return host.clientWidth * 0.84 * (visible / height);
        };

        const apply = () => {
            const width = cardWidth();
            let front = 0;
            poses.forEach((pose, index) => {
                if (pose.depth < (poses[front]?.depth ?? 1)) front = index;
            });
            meshes.forEach((mesh, index) => {
                const pose = poses[index];
                const material = materials[index];
                if (!pose || !material) return;
                const px = width / (host.clientWidth * 0.84 || 1);
                const lift = index === front ? hover.value : 1;
                mesh.position.set(pose.tx * px, -pose.y * px, 0.45 - pose.depth * 1.35);
                mesh.rotation.set(
                    (pose.tilt * Math.PI) / 180,
                    pose.tx * -0.004,
                    (-pose.rotate * Math.PI) / 180,
                );
                mesh.scale.set(width * pose.scale * lift, width * pose.scale * lift, 1);
                mesh.renderOrder = Math.round(20 - pose.depth * 10);
                material.uniforms.uAmount.value = Math.min(pose.depth, 1);
                material.uniforms.uOpacity.value = pose.opacity;
                material.depthWrite = pose.opacity > 0.9;
            });
        };

        const render = () => {
            if (disposed || ready === 0) return;
            time.value += 0.016;
            materials.forEach((material) => {
                material.uniforms.uTime.value = time.value;
            });
            apply();
            renderer.render(scene, camera);
        };

        const onTick = () => {
            if (disposed || !visible || document.visibilityState === "hidden") return;
            render();
        };

        const start = () => {
            if (ticking || disposed) return;
            ticking = true;
            gsap.ticker.add(onTick);
        };

        const stop = () => {
            if (!ticking) return;
            ticking = false;
            gsap.ticker.remove(onTick);
        };

        const observer = new ResizeObserver(resize);
        observer.observe(host);
        const view = new IntersectionObserver((entries) => {
            visible = entries.some((entry) => entry.isIntersecting);
            if (visible) start();
            else stop();
        });
        view.observe(host);
        const onVisibility = () => {
            if (document.visibilityState === "hidden" || !visible) stop();
            else start();
        };
        document.addEventListener("visibilitychange", onVisibility);
        resize();

        const dispose = () => {
            if (disposed) return;
            disposed = true;
            stop();
            gsap.killTweensOf(hover);
            observer.disconnect();
            view.disconnect();
            document.removeEventListener("visibilitychange", onVisibility);
            textures.forEach((texture) => texture.dispose());
            materials.forEach((material) => material.dispose());
            geometry.dispose();
            renderer.dispose();
            canvas.remove();
            host.classList.remove("has_gl");
        };

        sources.forEach((src, index) => {
            if (!src) return;
            const material = new ShaderMaterial({
                uniforms: {
                    uMap: { value: null },
                    uTime: time,
                    uAmount: { value: 1 },
                    uOpacity: { value: 0 },
                },
                vertexShader,
                fragmentShader,
                transparent: true,
                depthTest: true,
                depthWrite: false,
            });
            const mesh = new Mesh(geometry, material);
            mesh.visible = false;
            mesh.frustumCulled = false;
            scene.add(mesh);
            meshes[index] = mesh;
            materials[index] = material;

            loader.load(
                textureUrl(src),
                (map) => {
                    if (disposed) {
                        map.dispose();
                        return;
                    }
                    map.colorSpace = NoColorSpace;
                    map.minFilter = LinearFilter;
                    map.magFilter = LinearFilter;
                    map.generateMipmaps = false;
                    textures.push(map);
                    material.uniforms.uMap.value = map;
                    mesh.visible = true;
                    ready += 1;
                    if (ready === 1) host.classList.add("has_gl");
                    render();
                    start();
                },
                undefined,
                () => {
                    mesh.visible = false;
                },
            );
        });

        if (!sources.length) {
            dispose();
            resolve(null);
            return;
        }

        resolve({
            setPoses: (next) => {
                poses = next;
            },
            setHover: (scale) => {
                gsap.to(hover, {
                    value: scale,
                    duration: 0.25,
                    ease: "power2.out",
                    overwrite: "auto",
                });
            },
            dispose,
        });
    });
}
