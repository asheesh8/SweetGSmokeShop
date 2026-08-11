'use client'

import { Suspense, useEffect, useMemo } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment, Lightformer, ContactShadows, useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { useDeviceTier } from '@/lib/useDeviceTier'

/**
 * The one genuinely real 3D asset on the site: photogrammetry scans of two
 * actual nugs. Procedural props (the grinder and bong we tried first) read as
 * CG immediately — scanned geometry does not, because it isn't.
 *
 * Lit warm-key / cool-rim to match the footage grade, so the interactive
 * element and the video clips look like they came from the same shoot.
 */
function Specimen({ url }: { url: string }) {
  const { scene } = useGLTF(url)

  // Clone and normalise: Sketchfab exports arrive at arbitrary scale, rotated
  // under a wrapper node, and off-origin.
  const model = useMemo(() => {
    const root = scene.clone(true)
    const box = new THREE.Box3().setFromObject(root)
    const size = new THREE.Vector3()
    const center = new THREE.Vector3()
    box.getSize(size)
    box.getCenter(center)
    root.position.sub(center)

    root.traverse((o) => {
      const m = o as THREE.Mesh
      if (!m.isMesh) return
      const mat = m.material as THREE.MeshStandardMaterial
      if (mat) {
        mat.roughness = Math.min(mat.roughness ?? 1, 0.7)
        mat.envMapIntensity = 1.1
      }
    })

    const wrap = new THREE.Group()
    wrap.add(root)
    wrap.scale.setScalar(2.5 / Math.max(size.x, size.y, size.z))
    return wrap
  }, [scene])

  // WebGL does not garbage-collect. Everything cloned here is freed here.
  useEffect(() => {
    const captured = model
    return () => {
      captured.traverse((o) => {
        const m = o as THREE.Mesh
        if (!m.isMesh) return
        m.geometry?.dispose()
        const mat = m.material
        if (Array.isArray(mat)) mat.forEach((x) => x.dispose())
        else mat?.dispose()
      })
    }
  }, [model])

  return <primitive object={model} />
}

export function NugViewer({ url }: { url: string }) {
  const tier = useDeviceTier()
  if (tier === null) return null

  return (
    <Canvas
      dpr={tier === 'high' ? [1, 2] : [1, 1.4]}
      camera={{ fov: 38, position: [0, 0.2, 5.4] }}
      gl={{ antialias: true, alpha: true }}
    >
      <Suspense fallback={null}>
        <ambientLight intensity={0.35} />
        {/* Warm key from camera-left, matching the shot list's lighting note. */}
        <directionalLight position={[-4, 3, 4]} intensity={2.6} color="#ffb066" />
        {/* Cool rim from behind for separation against the dark plate. */}
        <directionalLight position={[3, 1, -4]} intensity={1.8} color="#8fb4d6" />
        <pointLight position={[2, -2, 2]} intensity={5} color="#e8873a" distance={10} />

        <Specimen url={url} />

        <ContactShadows position={[0, -1.6, 0]} opacity={0.55} scale={8} blur={2.8} far={4} color="#000000" />

        {/* Inline lightformers — no HDR fetched from a CDN. */}
        <Environment resolution={128} frames={1}>
          <Lightformer form="rect" intensity={1.6} color="#ffd9a8" position={[-4, 2, 3]} scale={[5, 4, 1]} />
          <Lightformer form="rect" intensity={1.1} color="#9dc0e0" position={[4, 0, -2]} scale={[4, 5, 1]} />
        </Environment>

        <OrbitControls
          enablePan={false}
          minDistance={3.4}
          maxDistance={8}
          autoRotate
          autoRotateSpeed={0.6}
          makeDefault
        />
      </Suspense>
    </Canvas>
  )
}
