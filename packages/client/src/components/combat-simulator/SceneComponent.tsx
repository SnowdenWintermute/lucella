/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable consistent-return */
/* eslint-disable react/destructuring-assignment */
import { Engine, EngineOptions, Scene, SceneOptions } from "@babylonjs/core";
import React, { useEffect, useRef, useState } from "react";
import { renderRate } from "../../../../common";
type Props = {
  antialias: boolean;
  engineOptions?: EngineOptions;
  adaptToDeviceRatio?: boolean;
  sceneOptions?: SceneOptions;
  onRender: (scene: Scene, canvas: HTMLCanvasElement) => void;
  onSceneReady: (scene: Scene, canvas: HTMLCanvasElement) => void;
  id?: string;
  className?: string;
};

function BabylonScene(props: Props) {
  const reactCanvas = useRef(null);
  const renderRef = useRef<NodeJS.Timeout | null>(null);
  const { antialias, engineOptions, adaptToDeviceRatio, sceneOptions, onRender, onSceneReady, ...rest } = props;

  const [loaded, setLoaded] = useState(false);
  const [scene, setScene] = useState<Scene | null>(null);

  useEffect(() => {
    if (!window) return;
    const resize = () => {
      if (scene) scene.getEngine().resize();
    };
    window.addEventListener("resize", resize);

    return () => {
      window.removeEventListener("resize", resize);
    };
  }, [scene]);

  useEffect(() => {
    if (loaded) return;
    setLoaded(true);
    const engine = new Engine(reactCanvas.current, antialias, engineOptions, adaptToDeviceRatio);
    const newScene = new Scene(engine, sceneOptions);
    console.log("creating scene");
    setScene(newScene);
    // console.log(newScene.isReady());
    if (!newScene) return;
    if (newScene.isReady()) onSceneReady(newScene, reactCanvas.current!);
    else newScene.onReadyObservable.addOnce((readyScene) => onSceneReady(readyScene, reactCanvas.current!));

    // renderRef.current = setInterval(() => {
    //   if (typeof onRender === "function") onRender(newScene, reactCanvas.current!);
    //   if (newScene.getCameraById("Camera")) newScene.render();
    // }, renderRate);

    engine.runRenderLoop(() => {
      if (typeof onRender === "function") onRender(newScene, reactCanvas.current!);
      if (newScene.getCameraById("Camera")) newScene.render();
    });

    return () => {
      if (scene !== null) scene.dispose();
      if (renderRef.current) clearInterval(renderRef.current);
    };
  }, [reactCanvas]);

  return <canvas style={{ width: "100%", height: "100%" }} ref={reactCanvas} {...rest} />;
}

export default BabylonScene;
