      let house = {
          material: 'brick',
          street_number: 123,
          street: 'Jefferson',
      }
      console.log(house.material);
      console.log(house.street_number);
      console.log(house.street);
      
      //settings for model to import
      let model_settings = {
          folder: "https://models.babylonjs.com/", 
          file: "alien.glb",
          color: {r:1, g:0, b:0},
          scale: 15,
          position: {x: 0, y: 2, z: 0},
          rotation: {x: 0, y:3, z: 0}
      }; 
      
      var canvas = document.getElementById("renderCanvas");

        var startRenderLoop = function (engine, canvas) {
            engine.runRenderLoop(function () {
                if (sceneToRender && sceneToRender.activeCamera) {
                    sceneToRender.render();
                }
            });
        }

        var engine = null;
        var scene = null;
        var sceneToRender = null;
        var createDefaultEngine = function() { return new BABYLON.Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true,  disableWebGL2Support: false}); };
        var createScene = function () {
    // This creates a basic Babylon Scene object (non-mesh)
    var scene = new BABYLON.Scene(engine);

    // This creates and positions a free camera (non-mesh)
    var camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 5, -10), scene);

    // This targets the camera to scene origin
    camera.setTarget(BABYLON.Vector3.Zero());

    // let tgt = model_settings.position; 
    // camera.setTarget(BABYLON.Vector3(tgt.x, tgt.y, tgt.z));

    // This attaches the camera to the canvas
    camera.attachControl(canvas, true);

    // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
    var light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);

    // Default intensity is 1. Let's dim the light a small amount
    light.intensity = 0.7;


    //import object

    BABYLON.SceneLoader.ImportMesh(
        null,
         model_settings.folder,
        model_settings.file,
        scene,
        function (meshes) { 
            var mat = new BABYLON.StandardMaterial('colormat', scene);
            mat.diffuseColor = new BABYLON.Color3(model_settings.color.r, model_settings.color.g, model_settings.color.b); 
            meshes[0].StandardMaterial = mat; 
            meshes[0].position = new BABYLON.Vector3(model_settings.position.x, model_settings.position.y, model_settings.position.z); 
            meshes[0].rotation = new BABYLON.Vector3(model_settings.rotation.x, model_settings.rotation.y, model_settings.rotation.z);
            //meshes[0].rotation.x += MATH.PI/2; 
            meshes[0].scaling = new BABYLON.Vector3(model_settings.scale, model_settings.scale, model_settings.scale);
                     
    });

    // Our built-in 'ground' shape.

    return scene;
};
                window.initFunction = async function() {
                    
                    
                    var asyncEngineCreation = async function() {
                        try {
                        return createDefaultEngine();
                        } catch(e) {
                        console.log("the available createEngine function failed. Creating the default engine instead");
                        return createDefaultEngine();
                        }
                    }

                    window.engine = await asyncEngineCreation();
        if (!engine) throw 'engine should not be null.';
        startRenderLoop(engine, canvas);
        window.scene = createScene();};
        initFunction().then(() => {sceneToRender = scene                    
        });

        // Resize
        window.addEventListener("resize", function () {
            engine.resize();
        });