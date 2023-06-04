/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable consistent-return */
/* eslint-disable react/destructuring-assignment */
import { Engine, EngineOptions, Scene, SceneOptions } from "@babylonjs/core";
import React, { useEffect, useRef, useState } from "react";
type Props = {
  antialias: boolean;
  engineOptions?: EngineOptions;
  adaptToDeviceRatio?: boolean;
  sceneOptions?: SceneOptions;
  onRender: (scene: Scene) => void;
  onSceneReady: (scene: Scene, canvas: HTMLCanvasElement) => void;
  id?: string;
  className?: string;
};

function BabylonScene(props: Props) {
  const reactCanvas = useRef(null);
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
    setScene(newScene);
    // console.log(newScene.isReady());
    if (!newScene) return;
    if (newScene.isReady()) onSceneReady(newScene, reactCanvas.current!);
    else newScene.onReadyObservable.addOnce((readyScene) => onSceneReady(readyScene, reactCanvas.current!));

    engine.runRenderLoop(() => {
      if (typeof onRender === "function") onRender(newScene);
      newScene.render();
    });

    return () => {
      if (scene !== null) scene.dispose();
    };
  }, [reactCanvas]);

  return <canvas style={{ width: "100%", height: "100%" }} ref={reactCanvas} {...rest} />;
}

export default BabylonScene;
