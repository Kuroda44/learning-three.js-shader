import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

import vertShader from './shaders/sphere.vert'
import fragShader from './shaders/sphere.frag'

export default function Canvas() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // キャンバスサイズを指定
    const width = 960;
    const hight = 540;

    // レンダラーを作成
    const renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(width, hight);

    // レンダラー：シャドウを有効にする
    renderer.shadowMap.enabled = true;

    const elm = ref.current;
    elm?.appendChild(renderer.domElement);

    // シーンを作成
    const scene = new THREE.Scene();

    // カメラを作成 THREE.PerspectiveCamera(画角, アスペクト比, 描画開始距離, 描画終了距離)
    const camera = new THREE.PerspectiveCamera(45, width / hight, 1, 10000);
    // カメラコントローラーを作成
    const controls = new OrbitControls(camera, renderer.domElement);
    camera.position.set(0, 0, 50);
    controls.update();

    // カメラ移動に慣性を持たせる
    controls.enableDamping = true;
    controls.dampingFactor = 0.5;

    // 球を作成
    let time = 0.0
    const uniforms = {
      time: { value: time }
    };

    const geometry = new THREE.SphereGeometry(15, 32, 16);
    const material = new THREE.ShaderMaterial({
      uniforms: uniforms,
      vertexShader: vertShader,
      fragmentShader: fragShader,
      side: THREE.BackSide
    });

    const sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);

    // アニメーション
    function tick() {
      if(time === 1.0) time = 0.0
      sphere.material.uniforms.time.value = time
      time += 0.005

      // カメラコントローラーを更新
      controls.update();

      // レンダリング
      renderer.render(scene, camera);

      requestAnimationFrame(tick);
    }

    // 初回実行
    tick();

    function onResize() {
      // サイズを取得
      const width = window.innerWidth;
      const height = window.innerHeight;

      // レンダラーのサイズを変更
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(width, height);

      // カメラのアスペクト比を変更
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    }

    // リサイズイベント発生時に実行
    window.addEventListener("resize", onResize);

    // キャンバスサイズを初期化
    onResize();

    return () => {
      window.removeEventListener("resize", onResize);
      elm?.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={ref} />;
}
