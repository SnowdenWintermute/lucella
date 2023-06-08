/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable consistent-return */
/* eslint-disable react/destructuring-assignment */
import { Engine, EngineOptions, Scene, SceneOptions } from "@babylonjs/core";
import React, { useEffect, useRef, useState } from "react";
import { addCSInputEventListeners, removeCSInputEventListeners } from "./CSInputEventListeners";
import { CombatSimulator } from "../../../../common";
type Props = {
  cs: CombatSimulator;
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
  const reactCanvas = useRef<HTMLCanvasElement>(null);
  const { cs, antialias, engineOptions, adaptToDeviceRatio, sceneOptions, onRender, onSceneReady, ...rest } = props;

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
    if (!newScene || !reactCanvas.current) return;

    if (newScene.isReady()) onSceneReady(newScene, reactCanvas.current);
    else newScene.onReadyObservable.addOnce((readyScene) => onSceneReady(readyScene, reactCanvas.current!));

    engine.runRenderLoop(() => {
      if (typeof onRender === "function") onRender(newScene, reactCanvas.current!);
      if (newScene.getCameraById("Camera")) newScene.render();
    });

    if (reactCanvas.current) addCSInputEventListeners(reactCanvas.current, cs);

    return () => {
      if (scene !== null) scene.dispose();
      if (reactCanvas.current) removeCSInputEventListeners(reactCanvas.current, cs);
    };
  }, [reactCanvas]);

  return <canvas style={{ width: "100%", height: "100%" }} ref={reactCanvas} {...rest} />;
}

export default BabylonScene;
