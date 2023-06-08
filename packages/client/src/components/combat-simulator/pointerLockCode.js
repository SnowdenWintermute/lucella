/* eslint-disable */
// You have to create a function called createScene. This function must return a BABYLON.Scene object
// You can reference the following variables: scene, canvas
// You must at least define a camera

var createScene = function () {
  var scene = new BABYLON.Scene(engine);

  scene.gravity = new BABYLON.Vector3(0, -0.75, 0);
  scene.collisionsEnabled = true;
  scene.enablePhysics();

  //Camera
  //var camera = new BABYLON.ArcRotateCamera("Camera", -Math.PI / 2, Math.PI / 2, 12, BABYLON.Vector3.Zero(), scene);
  //camera.attachControl(canvas, true);

  // Parameters : name, position, scene
  var camera = new BABYLON.UniversalCamera("UniversalCamera", new BABYLON.Vector3(0, 2, -25), scene);

  // Targets the camera to a particular position. In this case the scene origin
  camera.setTarget(BABYLON.Vector3.Zero());

  // Attach the camera to the canvas
  camera.applyGravity = true;
  camera.ellipsoid = new BABYLON.Vector3(1, 1.5, 1);
  camera.checkCollisions = true;
  camera.attachControl(canvas, true);

  // Skybox
  var skybox = BABYLON.Mesh.CreateBox("skyBox", 300.0, scene);
  var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
  skyboxMaterial.backFaceCulling = false;
  skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("textures/skybox", scene);
  skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
  skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
  skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
  skybox.material = skyboxMaterial;

  //Controls  WASD
  camera.keysUp.push(87);
  camera.keysDown.push(83);
  camera.keysRight.push(68);
  camera.keysLeft.push(65);

  //Controls...Mouse
  //We start without being locked.
  var isLocked = false;

  // On click event, request pointer lock
  scene.onPointerDown = function (evt) {
    //true/false check if we're locked, faster than checking pointerlock on each single click.
    if (!isLocked) {
      canvas.requestPointerLock = canvas.requestPointerLock || canvas.msRequestPointerLock || canvas.mozRequestPointerLock || canvas.webkitRequestPointerLock;
      if (canvas.requestPointerLock) {
        canvas.requestPointerLock();
      }
    }

    //continue with shooting requests or whatever :P
    if (evt === 0) {
      castRay();
    } //(left mouse click)
    //evt === 1 (mouse wheel click (not scrolling))
    //evt === 2 (right mouse click)
  };

  // Event listener when the pointerlock is updated (or removed by pressing ESC for example).
  var pointerlockchange = function () {
    var controlEnabled =
      document.mozPointerLockElement || document.webkitPointerLockElement || document.msPointerLockElement || document.pointerLockElement || null;

    // If the user is already locked
    if (!controlEnabled) {
      //camera.detachControl(canvas);
      isLocked = false;
    } else {
      //camera.attachControl(canvas);
      isLocked = true;
    }
  };

  // Attach events to the document
  document.addEventListener("pointerlockchange", pointerlockchange, false);
  document.addEventListener("mspointerlockchange", pointerlockchange, false);
  document.addEventListener("mozpointerlockchange", pointerlockchange, false);
  document.addEventListener("webkitpointerlockchange", pointerlockchange, false);

  //Fog
  scene.fogMode = BABYLON.Scene.FOGMODE_EXP;
  scene.fogDensity = 0.005;
  scene.fogColor = new BABYLON.Color3(0.9, 0.9, 0.85);

  //Geometry
  var sphere = BABYLON.MeshBuilder.CreateSphere("sphere", {}, scene);

  var box1 = BABYLON.MeshBuilder.CreateBox("Box1", { height: 3, width: 3, depth: 3 }, scene);

  var myGround = BABYLON.MeshBuilder.CreateGround("myGround", { width: 200, height: 200, subdivsions: 4 }, scene);
  var ground = BABYLON.Mesh.CreateGroundFromHeightMap("ground", "textures/heightMap.png", 100, 100, 100, 0, 10, scene, false);
  var groundMaterial = new BABYLON.StandardMaterial("ground", scene);
  groundMaterial.diffuseTexture = new BABYLON.Texture("textures/ground.jpg", scene);
  groundMaterial.diffuseTexture.uScale = 6;
  groundMaterial.diffuseTexture.vScale = 6;
  groundMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
  ground.position.y = -1.5;
  ground.position.x = -50;
  ground.material = groundMaterial;

  //Bounding box Geometry

  var border0 = BABYLON.Mesh.CreateBox("border0", 1, scene);
  border0.scaling = new BABYLON.Vector3(1, 100, 200);
  border0.position.x = -100.0;
  border0.checkCollisions = true;
  border0.isVisible = false;

  var border1 = BABYLON.Mesh.CreateBox("border1", 1, scene);
  border1.scaling = new BABYLON.Vector3(1, 100, 200);
  border1.position.x = 100.0;
  border1.checkCollisions = true;
  border1.isVisible = false;

  var border2 = BABYLON.Mesh.CreateBox("border2", 1, scene);
  border2.scaling = new BABYLON.Vector3(200, 100, 1);
  border2.position.z = 100.0;
  border2.checkCollisions = true;
  border2.isVisible = false;

  var border3 = BABYLON.Mesh.CreateBox("border3", 1, scene);
  border3.scaling = new BABYLON.Vector3(200, 100, 1);
  border3.position.z = -100.0;
  border3.checkCollisions = true;
  border3.isVisible = false;

  //Weapon Geometry

  let rlMesh = BABYLON.MeshBuilder.CreateCylinder("rl", { diameterTop: 0.8, diameterBottom: 0.9, height: 3, tessellation: 64 }, scene);
  rlMesh.renderingGroupId = 1;
  rlMesh.material = new BABYLON.StandardMaterial("rlMat", scene);
  rlMesh.material.diffuseColor = new BABYLON.Color3(0, 0, 0);
  rlMesh.rotation.x = Math.PI / 2;
  rlMesh.parent = camera;
  rlMesh.position = new BABYLON.Vector3(1, -2, 5);

  //Weapon Ray

  function vecToLocal(vector, mesh) {
    var m = mesh.getWorldMatrix();
    var v = BABYLON.Vector3.TransformCoordinates(vector, m);
    return v;
  }

  /*function castRay(){       
        var origin = rlMesh.position;
	
	    var forward = new BABYLON.Vector3(0,0,1);		
	    forward = vecToLocal(forward, rlMesh);
	
	    var direction = forward.subtract(origin);
	    direction = BABYLON.Vector3.Normalize(direction);
	
	    var length = 100;
	
	    var ray = new BABYLON.Ray(origin, direction, length);

		let rayHelper = new BABYLON.RayHelper(ray);		
		rayHelper.show(scene);		

        var hit = scene.pickWithRay(ray);

        if (hit.pickedMesh){
		   hit.pickedMesh.scaling.y += 0.01;
	    }
    }

    castRay();*/

  //Light
  scene.ambientColor = new BABYLON.Color3(1, 1, 1);
  var light1 = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(1, 1, 0), scene);
  var light2 = new BABYLON.PointLight("light2", new BABYLON.Vector3(60, 60, 0), scene);
  var gl = new BABYLON.GlowLayer("sphere", scene);
  light1.intensity = 0.5;
  light2.intensity = 0.5;

  var shadowGenerator = new BABYLON.ShadowGenerator(1024, light2);
  shadowGenerator.getShadowMap().renderList.push(box1);
  shadowGenerator.getShadowMap().renderList.push(sphere);
  myGround.receiveShadows = true;

  //Color
  var myMaterial = new BABYLON.StandardMaterial("myMaterial", scene);

  myMaterial.diffuseColor = new BABYLON.Color3(0, 0, 1);
  myMaterial.specularColor = new BABYLON.Color3(0.5, 0.6, 0.87);
  myMaterial.emissiveColor = new BABYLON.Color3(1, 0, 0);
  myMaterial.ambientColor = new BABYLON.Color3(0.23, 0.98, 0.53);
  sphere.material = myMaterial;

  //Position
  sphere.position = new BABYLON.Vector3(0, 2.5, 0);
  box1.position.y = 0.5;
  box1.rotation.y = 1;
  myGround.position.y = -1;

  // Create a particle system
  var particleSystem = new BABYLON.ParticleSystem("particles", 2000, scene);

  //Texture of each particle
  particleSystem.particleTexture = new BABYLON.Texture("textures/flare.png", scene);

  // Where the particles come from
  particleSystem.emitter = box1; // the starting object, the emitter
  particleSystem.minEmitBox = new BABYLON.Vector3(0, 2, 0); // Starting all from
  particleSystem.maxEmitBox = new BABYLON.Vector3(1, 2.5, 70); // To...

  // Colors of all particles
  particleSystem.color1 = new BABYLON.Color4(0.7, 0.8, 1.0, 1.0);
  particleSystem.color2 = new BABYLON.Color4(0.2, 0.5, 1.0, 1.0);
  particleSystem.colorDead = new BABYLON.Color4(0, 0, 0.2, 0.0);

  // Size of each particle (random between...
  particleSystem.minSize = 0.1;
  particleSystem.maxSize = 0.5;

  // Life time of each particle (random between...
  particleSystem.minLifeTime = 0.3;
  particleSystem.maxLifeTime = 1.5;

  // Emission rate
  particleSystem.emitRate = 30000;

  // Blend mode : BLENDMODE_ONEONE, or BLENDMODE_STANDARD
  particleSystem.blendMode = BABYLON.ParticleSystem.BLENDMODE_ONEONE;

  // Set the gravity of all particles
  particleSystem.gravity = new BABYLON.Vector3(0, -9.81, 0);

  // Direction of each particle after it has been emitted
  particleSystem.direction1 = new BABYLON.Vector3(0, 0, 0);
  particleSystem.direction2 = new BABYLON.Vector3(-100, 10, 100);

  // Angular speed, in radians
  particleSystem.minAngularSpeed = 0;
  particleSystem.maxAngularSpeed = Math.PI;

  // Speed
  particleSystem.minEmitPower = 1;
  particleSystem.maxEmitPower = 3;
  particleSystem.updateSpeed = 0.005;

  // Start the particle system
  particleSystem.start();

  //Animation
  var animationBox = new BABYLON.Animation("myAnimation", "rotation.y", 30, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);

  // An array with all animation keys
  var keys = [];

  //At the animation key 0, the value of scaling is "1"
  keys.push({
    frame: 0,
    value: 1,
  });

  //At the animation key 20, the value of scaling is "0.2"
  keys.push({
    frame: 20,
    value: 6,
  });

  //At the animation key 100, the value of scaling is "1"
  keys.push({
    frame: 100,
    value: 1,
  });

  animationBox.setKeys(keys);
  box1.animations = [];
  box1.animations.push(animationBox);

  scene.beginAnimation(box1, 0, 100, true);

  myGround.checkCollisions = true;
  box1.checkCollisions = true;
  ground.checkCollisions = true;

  //Jump
  function jump() {
    camera.cameraDirection.y = 5;
  }

  document.body.onkeyup = function (e) {
    if (e.keyCode == 32) {
      //your code
      console.log("jump");
      setTimeout(jump(), 10000);
    }
  };

  return scene;
};
