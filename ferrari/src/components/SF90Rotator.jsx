import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment';
import { SoundManager } from '../utils/SoundManager';
import './SF90Rotator.css';

// Ambient lighting and showroom configs per model
const MODEL_CONFIGS = {
  sf90: {
    name: 'SF90 Stradale',
    glbPath: '/sf90.glb',
    roughness: 0.25,
    metalness: 0.9,
    clearcoat: 1.0,
    clearcoatRoughness: 0.02,
    ambientColor: '#ffffff',
    ambientIntensity: 0.7
  },
  '296gtb': {
    name: '296 GTB',
    glbPath: '/296gtb.glb',
    roughness: 0.28,
    metalness: 0.85,
    clearcoat: 0.95,
    clearcoatRoughness: 0.04,
    ambientColor: '#ffead0', // Warm yellow/orange glow
    ambientIntensity: 0.8
  },
  '812': {
    name: '812 Superfast',
    glbPath: '/812.glb',
    roughness: 0.18,
    metalness: 1.0,
    clearcoat: 1.0,
    clearcoatRoughness: 0.01,
    ambientColor: '#d6e5ff', // Cool blue industrial wash
    ambientIntensity: 0.9
  },
  roma: {
    name: 'Roma',
    glbPath: '/roma.glb',
    roughness: 0.45, // Elegant Satin Matte paint
    metalness: 0.6,
    clearcoat: 0.3,
    clearcoatRoughness: 0.1,
    ambientColor: '#ffcc99', // Crimson sunset tone
    ambientIntensity: 0.6
  }
};

const SF90Rotator = ({ model, color }) => {
  const [autoRotate, setAutoRotate] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  
  const mountRef = useRef(null);
  
  // Persistent WebGL refs
  const sceneRef = useRef(null);
  const gltfLoaderRef = useRef(null);
  const controlsRef = useRef(null);
  const bodyMaterialRef = useRef(null);
  const detailsMaterialRef = useRef(null);
  const glassMaterialRef = useRef(null);
  const tireMaterialRef = useRef(null);
  const brakeCaliperMaterialRef = useRef(null);
  
  // Loaded model refs
  const carModelRef = useRef(null);
  const shadowMeshRef = useRef(null);
  const wheelsRef = useRef([]);
  const ambientLightRef = useRef(null);
  
  // HUD refs for direct DOM updates
  const dialRingRef = useRef(null);
  const dialTextRef = useRef(null);
  const rotationHudRef = useRef(null);

  const activeConfig = MODEL_CONFIGS[model?.id] || MODEL_CONFIGS.sf90;

  // 1. Color change effect (updates paint color dynamically)
  useEffect(() => {
    if (bodyMaterialRef.current) {
      bodyMaterialRef.current.color.set(color?.hex || '#CC1200');
    }
    if (brakeCaliperMaterialRef.current) {
      brakeCaliperMaterialRef.current.color.set(color?.hex || '#CC1200');
    }
  }, [color]);

  // 2. Auto-rotate state change effect
  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.autoRotate = autoRotate;
    }
  }, [autoRotate]);

  // 3. WebGL Scene initialization (Runs once on mount)
  useEffect(() => {
    if (!mountRef.current) return;

    const container = mountRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // A. Scene setup
    const scene = new THREE.Scene();
    scene.background = null; // transparent
    scene.fog = new THREE.Fog(0x0a0a0a, 8, 16);
    sceneRef.current = scene;

    // B. Camera setup
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(4.25, 1.4, -4.5);

    // C. Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.95;
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);

    // D. OrbitControls setup
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxDistance = 8;
    controls.minDistance = 3.2;
    controls.maxPolarAngle = Math.PI / 2 - 0.05;
    controls.target.set(0, 0.5, 0);
    controls.autoRotate = autoRotate;
    controls.autoRotateSpeed = 2.0;
    controlsRef.current = controls;

    // E. PMREM reflection mapping setup
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    pmremGenerator.compileEquirectangularShader();
    const roomEnv = new RoomEnvironment();
    const envTexture = pmremGenerator.fromScene(roomEnv, 0.04).texture;
    scene.environment = envTexture;
    roomEnv.dispose();
    pmremGenerator.dispose();

    // F. Lighting setup
    const ambientLight = new THREE.AmbientLight(activeConfig.ambientColor, activeConfig.ambientIntensity);
    scene.add(ambientLight);
    ambientLightRef.current = ambientLight;

    const mainLight = new THREE.DirectionalLight(0xffffff, 1.5);
    mainLight.position.set(5, 10, 7.5);
    scene.add(mainLight);

    const backLight = new THREE.DirectionalLight(0xffffff, 1.0);
    backLight.position.set(-5, 5, -5);
    scene.add(backLight);

    // G. Floor grid helper
    const gridHelper = new THREE.GridHelper(20, 40, 0x333333, 0x181818);
    gridHelper.position.y = 0;
    scene.add(gridHelper);

    // H. Materials setup
    const bodyMaterial = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(color?.hex || '#CC1200'),
      metalness: activeConfig.metalness,
      roughness: activeConfig.roughness,
      clearcoat: activeConfig.clearcoat,
      clearcoatRoughness: activeConfig.clearcoatRoughness
    });
    bodyMaterialRef.current = bodyMaterial;

    const detailsMaterial = new THREE.MeshStandardMaterial({
      color: 0xcccccc, // Silver color for rims
      metalness: 0.9,
      roughness: 0.25
    });
    detailsMaterialRef.current = detailsMaterial;

    const tireMaterial = new THREE.MeshStandardMaterial({
      color: 0x181818, // Matte black tire rubber
      metalness: 0.1,
      roughness: 0.85
    });
    tireMaterialRef.current = tireMaterial;

    const brakeCaliperMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color(color?.hex || '#CC1200'), // Brake caliper matches selected color
      metalness: 0.8,
      roughness: 0.2
    });
    brakeCaliperMaterialRef.current = brakeCaliperMaterial;

    const glassMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      metalness: 0.1,
      roughness: 0,
      transmission: 1.0,
      transparent: true,
      opacity: 0.35
    });
    glassMaterialRef.current = glassMaterial;

    // I. Ambient Occlusion Floor Shadow Load
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load('/ferrari_ao.png', (shadowTexture) => {
      const shadowMesh = new THREE.Mesh(
        new THREE.PlaneGeometry(0.655 * 4, 1.3 * 4),
        new THREE.MeshBasicMaterial({
          map: shadowTexture,
          blending: THREE.MultiplyBlending,
          toneMapped: false,
          transparent: true,
          opacity: 0.85,
          premultipliedAlpha: true
        })
      );
      shadowMesh.rotation.x = -Math.PI / 2;
      shadowMesh.position.y = 0.005;
      scene.add(shadowMesh);
      shadowMeshRef.current = shadowMesh;
    });

    // J. Draco and GLTFLoader setup
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/');
    const gltfLoader = new GLTFLoader();
    gltfLoader.setDRACOLoader(dracoLoader);
    gltfLoaderRef.current = gltfLoader;

    // K. Animation loop
    let animationFrameId;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      
      controls.update();

      // Spin wheels
      if (wheelsRef.current.length > 0) {
        const time = -performance.now() / 1500;
        if (autoRotate) {
          wheelsRef.current.forEach((wheel) => {
            wheel.rotation.x = time * Math.PI * 2;
          });
        }
      }

      // Calculate camera angle for HUD direct DOM updates
      const dx = camera.position.x - controls.target.x;
      const dz = camera.position.z - controls.target.z;
      let angleRad = Math.atan2(dz, dx);
      let angleDeg = (angleRad * 180) / Math.PI;
      if (angleDeg < 0) angleDeg += 360;
      const roundedAngle = Math.round(angleDeg);

      if (dialRingRef.current) dialRingRef.current.style.transform = `rotate(${-roundedAngle}deg)`;
      if (dialTextRef.current) dialTextRef.current.innerText = `${roundedAngle}°`;
      if (rotationHudRef.current) rotationHudRef.current.innerText = `${roundedAngle}°`;

      renderer.render(scene, camera);
    };

    animate();

    // L. Resize Handling
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    const resizeObserver = new ResizeObserver(() => handleResize());
    resizeObserver.observe(container);

    // M. Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      scene.clear();
    };
  }, []);

  // 4. Dynamic Model Loading Effect (Triggers when model ID changes)
  useEffect(() => {
    let isCurrent = true;
    const scene = sceneRef.current;
    const loader = gltfLoaderRef.current;
    
    if (!scene || !loader) return;

    const config = MODEL_CONFIGS[model?.id] || MODEL_CONFIGS.sf90;
    
    setIsLoading(true);

    // Remove previous model if exists
    if (carModelRef.current) {
      scene.remove(carModelRef.current);
      carModelRef.current = null;
    }

    // Apply lighting configurations immediately
    if (ambientLightRef.current) {
      ambientLightRef.current.color.set(config.ambientColor);
      ambientLightRef.current.intensity = config.ambientIntensity;
    }

    // Apply materials parameters immediately
    if (bodyMaterialRef.current) {
      bodyMaterialRef.current.roughness = config.roughness;
      bodyMaterialRef.current.metalness = config.metalness;
      bodyMaterialRef.current.clearcoat = config.clearcoat;
      bodyMaterialRef.current.clearcoatRoughness = config.clearcoatRoughness;
      bodyMaterialRef.current.color.set(color?.hex || '#CC1200');
    }

    // Load the model from glbPath with a fallback to /ferrari.glb if missing
    const loadGLB = (url, isFallback = false) => {
      loader.load(
        url,
        (gltf) => {
          if (!isCurrent) {
            // Discard loaded model as it's no longer current
            gltf.scene.traverse((child) => {
              if (child.isMesh && child.geometry) {
                child.geometry.dispose();
              }
            });
            return;
          }

          const carModel = gltf.scene;
          carModel.position.set(0, 0, 0);

          // Wildcard material matcher (matches standard names in third-party models)
          carModel.traverse((child) => {
            if (child.isMesh) {
              const name = child.name.toLowerCase();
              if (name.includes('body') || name.includes('paint') || name.includes('car_shell') || name.includes('chassis')) {
                child.material = bodyMaterialRef.current;
              } else if (name.includes('glass') || name.includes('window') || name.includes('windshield')) {
                child.material = glassMaterialRef.current;
              } else if (name.includes('caliper') || name.includes('calliper')) {
                child.material = brakeCaliperMaterialRef.current;
              }
            }
          });

          // If fallback model, apply morph geometry scaling
          if (isFallback) {
            const scale = config.scale || [1.0, 1.0, 1.0];
            const position = config.position || [0, 0.05, 0];
            const wheelbaseFactor = config.wheelbaseFactor !== undefined ? config.wheelbaseFactor : 1.0;
            const trackFactor = config.trackFactor !== undefined ? config.trackFactor : 1.0;
            const wheelScale = config.wheelScale !== undefined ? config.wheelScale : 1.0;

            // Apply scale
            carModel.traverse((child) => {
              if (child.isMesh) {
                if (child.name === 'body' || child.name === 'trim' || child.name === 'glass') {
                  child.scale.set(scale[0], scale[1], scale[2]);
                }
              }
            });

            // Adjust wheelbase positioning to avoid wheel ovals
            const wheelNames = ['wheel_fl', 'wheel_fr', 'wheel_rl', 'wheel_rr'];
            wheelNames.forEach((name) => {
              const wheel = carModel.getObjectByName(name);
              if (wheel) {
                if (!wheel.userData.originalPosition) {
                  wheel.userData.originalPosition = wheel.position.clone();
                }
                wheel.position.z = wheel.userData.originalPosition.z * wheelbaseFactor;
                wheel.position.x = wheel.userData.originalPosition.x * trackFactor;
                wheel.scale.set(wheelScale, wheelScale, wheelScale);
              }
            });

            // Adjust shadow size and position
            if (shadowMeshRef.current) {
              shadowMeshRef.current.scale.set(scale[0], 1, scale[2]);
              shadowMeshRef.current.position.set(position[0], 0.005, position[2]);
            }
          } else {
            // Auto-scale and center custom models to fit the showroom perfectly
            
            // 1. Reset scale and position to identity
            carModel.scale.set(1, 1, 1);
            carModel.position.set(0, 0, 0);

            // 2. Compute bounding box in local coordinates
            const box = new THREE.Box3().setFromObject(carModel);
            const size = box.getSize(new THREE.Vector3());

            // 3. Scale the model so that its length (Z axis) is exactly 4.4 meters
            const currentLength = size.z;
            if (currentLength > 0) {
              const targetLength = 4.4;
              const scaleFactor = targetLength / currentLength;
              carModel.scale.set(scaleFactor, scaleFactor, scaleFactor);
            }

            // 4. Compute the scaled bounding box to calculate translation offsets
            const scaledBox = new THREE.Box3().setFromObject(carModel);
            const scaledCenter = scaledBox.getCenter(new THREE.Vector3());

            // 5. Offset the model so its center in X and Z is at 0, and the bottom Y is at 0 (touching the grid)
            carModel.position.x = -scaledCenter.x;
            carModel.position.y = -scaledBox.min.y;
            carModel.position.z = -scaledCenter.z;

            // Reset shadow to normal scale for custom models
            if (shadowMeshRef.current) {
              shadowMeshRef.current.scale.set(1.0, 1.0, 1.0);
              shadowMeshRef.current.position.set(0, 0.005, 0);
            }
          }

          // Save wheel refs for rotation
          wheelsRef.current = [];
          const foundWheels = new Set();
          
          carModel.traverse((child) => {
            const name = child.name;
            if (
              name && (
                name.startsWith('Combined3DWheel_3DWheel_') ||
                name === 'wheel_fl' || name === 'wheel_fr' || name === 'wheel_rl' || name === 'wheel_rr'
              )
            ) {
              foundWheels.add(child);
            }
          });

          // Fallback if none found with exact prefixes: find the highest nodes in hierarchy that contain 'wheel'
          if (foundWheels.size === 0) {
            carModel.traverse((child) => {
              const name = child.name ? child.name.toLowerCase() : '';
              if (name.includes('wheel') && !name.includes('wheelbase')) {
                let hasWheelParent = false;
                let parent = child.parent;
                while (parent && parent !== carModel) {
                  const pName = parent.name ? parent.name.toLowerCase() : '';
                  if (pName.includes('wheel')) {
                    hasWheelParent = true;
                    break;
                  }
                  parent = parent.parent;
                }
                if (!hasWheelParent) {
                  foundWheels.add(child);
                }
              }
            });
          }
          
          wheelsRef.current = Array.from(foundWheels);

          scene.add(carModel);
          carModelRef.current = carModel;

          // Force update of matrices for accurate bounding box and world position calculation
          carModel.updateMatrixWorld(true);

          // Split combined wheel containers into 4 individual wheel groups based on spatial quadrants
          const finalWheels = [];
          wheelsRef.current.forEach((wheel) => {
            let hasPositiveX = false;
            let hasNegativeX = false;
            let hasPositiveZ = false;
            let hasNegativeZ = false;

            wheel.children.forEach((c) => {
              const pos = new THREE.Vector3();
              pos.setFromMatrixPosition(c.matrixWorld);
              if (pos.x > 0.1) hasPositiveX = true;
              if (pos.x < -0.1) hasNegativeX = true;
              if (pos.z > 0.1) hasPositiveZ = true;
              if (pos.z < -0.1) hasNegativeZ = true;
            });

            const isMultiWheelContainer = (hasPositiveX && hasNegativeX) || (hasPositiveZ && hasNegativeZ);

            if (isMultiWheelContainer && wheel.children.length > 4) {
              // Create four groups for the wheels
              const groups = {
                fl: new THREE.Group(),
                fr: new THREE.Group(),
                rl: new THREE.Group(),
                rr: new THREE.Group()
              };
              groups.fl.name = 'split_wheel_fl';
              groups.fr.name = 'split_wheel_fr';
              groups.rl.name = 'split_wheel_rl';
              groups.rr.name = 'split_wheel_rr';

              const children = [...wheel.children];
              children.forEach((child) => {
                const pos = new THREE.Vector3();
                pos.setFromMatrixPosition(child.matrixWorld);
                let quad = '';
                if (pos.z >= 0) {
                  quad = pos.x >= 0 ? 'fl' : 'fr';
                } else {
                  quad = pos.x >= 0 ? 'rl' : 'rr';
                }
                groups[quad].add(child);
              });

              const parent = wheel.parent;
              if (parent) {
                Object.keys(groups).forEach((key) => {
                  const grp = groups[key];
                  if (grp.children.length > 0) {
                    parent.add(grp);
                    finalWheels.push(grp);
                  }
                });
                parent.remove(wheel);
              }
            } else {
              finalWheels.push(wheel);
            }
          });

          // Recenter wheel pivots so they rotate in place
          // Force update world matrices exactly once for the updated scene structure
          carModel.updateMatrixWorld(true);

          finalWheels.forEach((wheel) => {
            if (wheel.isMesh && wheel.geometry) {
              wheel.geometry.computeBoundingBox();
              const geomCenter = wheel.geometry.boundingBox.getCenter(new THREE.Vector3());
              wheel.geometry.center();
              wheel.position.add(geomCenter);
            } else {
              const box = new THREE.Box3().setFromObject(wheel);
              const center = box.getCenter(new THREE.Vector3());
              const parent = wheel.parent;
              if (parent) {
                const localCenter = parent.worldToLocal(center.clone());
                const oldPos = wheel.position.clone();
                wheel.position.copy(localCenter);
                const offset = localCenter.clone().sub(oldPos);
                wheel.children.forEach((child) => {
                  child.position.sub(offset);
                });
              }
            }
          });

          wheelsRef.current = finalWheels;
          setIsLoading(false);

          if (controlsRef.current) {
            // Position camera target nicely
            const position = config.position || [0, 0.05, 0];
            controlsRef.current.target.set(0, 0.45, isFallback ? position[2] * 0.5 : 0);
            controlsRef.current.update();
          }
        },
        undefined,
        (error) => {
          if (!isCurrent) return;
          console.error(`Failed to load model at ${url}:`, error);
          if (!isFallback) {
            console.warn(`Model not found or failed to parse at ${url}. Falling back to default /ferrari.glb...`);
            loadGLB('/ferrari.glb', true);
          } else {
            console.error('Error loading fallback model:', error);
            setIsLoading(false);
          }
        }
      );
    };

    loadGLB(config.glbPath, false);

    return () => {
      isCurrent = false;
    };
  }, [model]);

  return (
    <div className="sf90-rotator-container">
      {/* 3D Viewport */}
      <div className="sf90-viewport">
        {/* Transparent background radial glow */}
        <div 
          className="sf90-bg-glow"
          style={{ background: `radial-gradient(circle, ${color?.hex}26 0%, transparent 70%)` }}
        />

        {/* Loading Spinner */}
        {isLoading && (
          <div className="sf90-loading-overlay">
            <div className="sf90-spinner" style={{ borderTopColor: color?.hex }}></div>
            <span className="font-mono">LOADING {activeConfig.name.toUpperCase()} 3D MODEL...</span>
          </div>
        )}

        {/* Mounting element for Three.js WebGL canvas */}
        <div ref={mountRef} className="sf90-webgl-canvas" />

        {/* Drag / Orbit instruction hint */}
        {!isLoading && (
          <div className="sf90-drag-hint font-mono">
            <span className="hint-arrow">←</span>
            <span>DRAG TO ROTATE 3D {activeConfig.name.toUpperCase()}</span>
            <span className="hint-arrow">→</span>
          </div>
        )}
      </div>

      {/* Control Panel */}
      <div className="sf90-controls">
        <div className="sf90-hud">
          <div className="hud-metric font-mono">
            <span className="lbl">MODEL</span>
            <span className="val text-gold">{activeConfig.name.toUpperCase()}</span>
          </div>
          <div className="hud-metric font-mono">
            <span className="lbl">COLOUR</span>
            <span className="val" style={{ color: color?.hex }}>{color?.name.toUpperCase()}</span>
          </div>
          <div className="hud-metric font-mono">
            <span className="lbl">ORIENTATION</span>
            <span ref={rotationHudRef} className="val">0°</span>
          </div>
        </div>

        <div className="sf90-control-buttons">
          {/* Compass Dial Indicator */}
          <div className="sf90-dial-container">
            <div 
              ref={dialRingRef}
              className="sf90-dial-ring"
            >
              <div className="dial-marker marker-n">N</div>
              <div className="dial-marker marker-e">E</div>
              <div className="dial-marker marker-s">S</div>
              <div className="dial-marker marker-w">W</div>
            </div>
            <div className="sf90-dial-center">
              <span ref={dialTextRef} className="font-mono">0°</span>
            </div>
          </div>

          <button 
            type="button"
            className={`sf90-action-btn ${autoRotate ? 'active' : ''} font-serif`}
            onClick={() => {
              SoundManager.play('gear-click', 0.08);
              setAutoRotate(!autoRotate);
            }}
          >
            {autoRotate ? 'PAUSE ROTATE' : 'AUTO ROTATE'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SF90Rotator;
