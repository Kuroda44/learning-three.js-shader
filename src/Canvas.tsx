import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

import vertShader from "./shaders/sphere.vert";
import fragShader from "./shaders/sphere.frag";
import skyVertShader from "./shaders/sky.vert";
import skyFragShader from "./shaders/sky.frag";

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
    camera.position.set(0, 0, 75);
    controls.update();

    // カメラ移動に慣性を持たせる
    controls.enableDamping = true;
    controls.dampingFactor = 0.5;

    // 平行光源を作成
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.21);
    directionalLight.position.set(10, 10, 10);
    scene.add(directionalLight);

    // 環境光源を作成
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    // 球を作成
    let time = 0.0;

    const geometry = new THREE.SphereGeometry(15, 32, 16);
    const material = new THREE.ShaderMaterial({
      uniforms: THREE.UniformsUtils.merge([
        THREE.UniformsLib.lights,
        {
          time: { value: time },
          diffuse: { value: new THREE.Color(0xffffff) },
          emissive: { value: new THREE.Color(0x000000) },
          color1: { value: new THREE.Color(0xffffff) },
          color2: { value: new THREE.Color(0xcccccc) },
        }
      ]),
      lights: true,
      vertexShader: vertShader,
      fragmentShader: fragShader,
    });

    const sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);

    // 天球を作成
    const skyGeo = new THREE.SphereGeometry(4000, 32, 15);
    const skyMat = new THREE.ShaderMaterial({
      uniforms: {
        topColor: { value: new THREE.Color(0xcdcdcd) },
        bottomColor: { value: new THREE.Color(0xffffff) },
        offset: { value: 0 },
        exponent: { value: 0.6 },
      },
      vertexShader: skyVertShader,
      fragmentShader: skyFragShader,
      side: THREE.BackSide,
    });

    const sky = new THREE.Mesh(skyGeo, skyMat);
    scene.add(sky);

    // アニメーション
    function tick() {
      if (time === 1.0) time = 0.0;
      sphere.material.uniforms.time.value = time;
      time += 0.1;

      // カメラコントローラーを更新
      controls.update();

      // レンダリング
      renderer.render(scene, camera);

      requestAnimationFrame(tick);
    }

    // 初回実行
    const animationId = requestAnimationFrame(tick);

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
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", onResize);
      elm?.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={ref} />;
}
