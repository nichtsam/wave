import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { Pane } from "tweakpane";
import waterVertexShaders from "./shaders/water/vertex.glsl";
import waterFragmentShaders from "./shaders/water/fragment.glsl";

/**
 * Base
 */
// Debug
const pane = new Pane({ title: "pane", expanded: false });

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();
{
  const color = "rgb(196, 235, 255)";
  const near = 0;
  const far = 10;
  scene.fog = new THREE.Fog(color, near, far);
  scene.background = new THREE.Color("rgb(196, 235, 255)");

  pane
    .addInput({ color: scene.fog.color.getStyle() }, "color", {
      label: "fogColor",
    })
    .on("change", ({ value }) => {
      scene.fog.color.set(value);
    });

  pane
    .addInput({ color: scene.background.getStyle() }, "color", {
      label: "backgroundColor",
    })
    .on("change", ({ value }) => {
      scene.background.set(value);
    });
}

/**
 * Water
 */
// Geometry
const waterGeometry = new THREE.PlaneGeometry(20, 20, 512, 512);

const crestColor = new THREE.Color("rgb(226, 245, 255)");
const troughColor = new THREE.Color("rgb(10, 10, 166)");
// Material
const waterMaterial = new THREE.ShaderMaterial({
  side: THREE.DoubleSide,
  vertexShader: waterVertexShaders,
  fragmentShader: waterFragmentShaders,
  fog: true,
  uniforms: {
    uTime: { value: 0 },

    uWaveElevation: { value: 0.4 },
    uWaveFrequency: { value: new THREE.Vector2(1, 1) },
    uWaveSpeed: { value: new THREE.Vector2(1.2, 1) },

    uCrestColor: { value: crestColor },
    uTroughColor: { value: troughColor },
    uColorDifference: { value: 0.7 },
    uColorOffset: { value: 0.4 },

    uSmallWavesElevation: { value: 0.15 },
    uSmallWavesFrequency: { value: 3 },
    uSmallWavesSpeed: { value: 0.2 },
    uSmallIterations: { value: 4 },

    fogColor: { value: scene.fog.color },
    fogNear: { value: scene.fog.near },
    fogFar: { value: scene.fog.far },
  },
});

pane.addInput(waterMaterial.uniforms.uWaveElevation, "value", {
  label: "uWaveElevation",
  min: 0.01,
  max: 1,
  step: 0.01,
});

pane.addInput(waterMaterial.uniforms.uWaveFrequency.value, "x", {
  label: "uWaveFrequencyX",
  min: 0,
  max: 10,
  step: 0.01,
});

pane.addInput(waterMaterial.uniforms.uWaveFrequency.value, "y", {
  label: "uWaveFrequencyZ",
  min: 0,
  max: 10,
  step: 0.01,
});

pane.addInput(waterMaterial.uniforms.uWaveSpeed.value, "x", {
  label: "uWaveSpeedX",
  min: 0,
  max: 10,
  step: 0.01,
});

pane.addInput(waterMaterial.uniforms.uWaveSpeed.value, "y", {
  label: "uWaveSpeedZ",
  min: 0,
  max: 10,
  step: 0.01,
});

pane
  .addInput({ color: crestColor.getStyle() }, "color", { label: "crestColor" })
  .on("change", ({ value }) => {
    crestColor.set(value);
  });

pane
  .addInput({ color: troughColor.getStyle() }, "color", {
    label: "troughColor",
  })
  .on("change", ({ value }) => {
    troughColor.set(value);
  });

pane.addInput(waterMaterial.uniforms.uColorDifference, "value", {
  label: "uColorDifference",
  min: 0,
  max: 10,
  step: 0.01,
});

pane.addInput(waterMaterial.uniforms.uColorOffset, "value", {
  label: "uColorOffset",
  min: 0,
  max: 1,
  step: 0.01,
});

pane.addInput(waterMaterial.uniforms.uSmallWavesElevation, "value", {
  label: "uSmallWavesElevation",
  min: 0,
  max: 1,
  step: 0.001,
});

pane.addInput(waterMaterial.uniforms.uSmallWavesFrequency, "value", {
  label: "uSmallWavesFrequency",
  min: 0,
  max: 30,
  step: 0.001,
});

pane.addInput(waterMaterial.uniforms.uSmallWavesSpeed, "value", {
  label: "uSmallWavesSpeed",
  min: 0,
  max: 4,
  step: 0.001,
});

pane.addInput(waterMaterial.uniforms.uSmallIterations, "value", {
  label: "uSmallIterations",
  min: 0,
  max: 5,
  step: 1,
});

// Light

{
  const color = 0xffffff;
  const intensity = 1;
  const light = new THREE.DirectionalLight(color, intensity);
  light.position.set(-1, 2, 4);
  scene.add(light);
}

// Mesh
const water = new THREE.Mesh(waterGeometry, waterMaterial);
water.rotation.x = -Math.PI * 0.5;
scene.add(water);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.set(-2, 1, 0);
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  waterMaterial.uniforms.uTime.value = elapsedTime;

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
