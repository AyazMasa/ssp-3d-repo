/**
 * 3D Model Viewer
 * Initialises a Three.js scene for STL / OBJ files.
 * GLB / GLTF files are handled by <model-viewer> in the EJS template.
 *
 * Usage: include this script AFTER the canvas element with id="viewer3d".
 * The global variable `window.__modelFileLink` must be set in the template.
 */
(function () {
  "use strict";

  const canvas = document.getElementById("viewer3d");
  if (!canvas) return;

  const fileLink = window.__modelFileLink || "";
  if (!fileLink) return;

  const ext = fileLink.split("?")[0].split(".").pop().toLowerCase();

  // GLB/GLTF handled by <model-viewer>, not this script
  if (ext === "glb" || ext === "gltf") return;

  // Only attempt Three.js for STL and OBJ
  if (ext !== "stl" && ext !== "obj") return;

  /* ── Dynamic Three.js import ────────────────────────── */
  const THREE_CDN = "https://unpkg.com/three@0.160.0";

  async function loadScript(src) {
    return new Promise((resolve, reject) => {
      const s = document.createElement("script");
      s.src = src;
      s.onload = resolve;
      s.onerror = reject;
      document.head.appendChild(s);
    });
  }

  async function init() {
    await loadScript(THREE_CDN + "/build/three.min.js");

    if (ext === "stl") {
      await loadScript(THREE_CDN + "/examples/js/loaders/STLLoader.js");
    } else if (ext === "obj") {
      await loadScript(THREE_CDN + "/examples/js/loaders/OBJLoader.js");
    }

    await loadScript(THREE_CDN + "/examples/js/controls/OrbitControls.js");

    buildScene();
  }

  function buildScene() {
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f2f5);

    const camera = new THREE.PerspectiveCamera(50, width / height, 0.01, 1000);
    camera.position.set(2, 2, 2);

    const controls = new THREE.OrbitControls(camera, canvas);
    controls.enableDamping = true;

    // Lights
    scene.add(new THREE.AmbientLight(0xffffff, 0.6));
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight.position.set(5, 10, 7);
    scene.add(dirLight);

    // Grid
    scene.add(new THREE.GridHelper(10, 20, 0xcccccc, 0xe0e0e0));

    // Load model
    let loader;
    if (ext === "stl") {
      loader = new THREE.STLLoader();
      loader.load(
        fileLink,
        (geometry) => {
          const material = new THREE.MeshStandardMaterial({ color: 0x2196f3, flatShading: true });
          const mesh = new THREE.Mesh(geometry, material);
          centreAndScale(mesh);
          scene.add(mesh);
        },
        undefined,
        (err) => showError("Could not load STL file")
      );
    } else if (ext === "obj") {
      loader = new THREE.OBJLoader();
      loader.load(
        fileLink,
        (obj) => {
          obj.traverse((child) => {
            if (child.isMesh) {
              child.material = new THREE.MeshStandardMaterial({ color: 0x2196f3, flatShading: true });
            }
          });
          centreAndScale(obj);
          scene.add(obj);
        },
        undefined,
        (err) => showError("Could not load OBJ file")
      );
    }

    function centreAndScale(object) {
      const box = new THREE.Box3().setFromObject(object);
      const centre = box.getCenter(new THREE.Vector3());
      const size = box.getSize(new THREE.Vector3()).length();
      object.position.sub(centre);
      const desired = 2;
      object.scale.multiplyScalar(desired / size);
    }

    function animate() {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    }
    animate();

    window.addEventListener("resize", () => {
      const w = canvas.parentElement.clientWidth;
      const h = canvas.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    });
  }

  function showError(msg) {
    const container = canvas.parentElement;
    container.innerHTML = `<p style="text-align:center;padding:2rem;color:#888;">${msg}. <a href="${fileLink}" target="_blank">Open file directly</a></p>`;
  }

  init().catch(() => showError("Could not load 3D viewer"));
})();
