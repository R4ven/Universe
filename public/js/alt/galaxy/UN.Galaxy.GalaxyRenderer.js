var workspace;
var sun, planetList;
var touchMode = UN.TOUCHMODES.NONE;
var background;

function renderGalaxyInit() {
	
	if ( ! Detector.webgl ) {
		Detector.getWebGLErrorMessage();
		return;
	}
	
	var params = {
		'containerId' : 'glContainer'
	};
	
	workspace = new UN.Workspace(params);
	
	loadImage(TEXTUREPATH + 'star_color_modified.png', function(img) {
		gradientImage = img;
		
		gradientCanvas = document.createElement('canvas');
		gradientCanvas.width = gradientImage.width;
		gradientCanvas.height = gradientImage.height;
		gradientCanvas.getContext('2d').drawImage( gradientImage, 0, 0, gradientImage.width, gradientImage.height );
		gradientCanvas.getColor = function( percentage ){
			return this.getContext('2d').getImageData(0,percentage * gradientImage.height, 1, 1).data;
		}
		
		loadShaders( shaderList, function(e){
			shaderList = e;
			loadJSon( jsonUrl , function(loadedData){
				initScene(loadedData);
				animate();
			});
		});	
	});
}

function initScene(data) {
	
	scene = workspace.getScene();
	
	workspace.rotatingObject = new THREE.Object3D();
	scene.add(workspace.rotatingObject);		
	
	renderer = workspace.getRenderer();	
	
	camera = workspace.getCamera();
	scene.add( camera );
	
	var light = new THREE.AmbientLight( 0x9c9c9c ); // soft white light
	scene.add( light );
	
	sun = new UN.Sun({radius: 60, parent: workspace});
	sun.render();
	workspace.rotatingObject.add(sun.getObject3D());
	
	for(var i=0; i<data.planets.length; i++) {
		
		var s = data.planets[i];
		
		var planet = new UN.Planet(s);
			planet.render();
			
		var pObject3D = planet.getObject3D();
			
			workspace.rotatingObject.add(pObject3D);	//add Planet
			
			workspace.rotatingObject.add(sun.getSunSpotLight(pObject3D)); //SpotLight hinzufügen
			
			workspace.rotatingObject.add(planet.getBaseLine()); //Baseline hinzufügen
			
			workspace.rotatingObject.add(planet.getBasePoint()); //Basepoint hinzufügen
			
			workspace.rotatingObject.add(planet.getRadiusLine()); //Radiuslinie hinzufügen
	}
	
	workspace.rotatingObject.add(workspace.getDust());
	
	background = workspace.getBackground();
	
	workspace.container.appendChild( renderer.domElement );
}

function animate() {
	
	camera.update();
	camera.updateMatrix(); 
	
	workspace.rotateX += workspace.rotateVX;
	workspace.rotateY += workspace.rotateVY;
	
	workspace.rotateVX *= 0.9;
	workspace.rotateVY *= 0.9;

	if (workspace.dragging ){
		workspace.rotateVX *= 0.6;
		workspace.rotateVY *= 0.6;
	}
	
	workspace.rotatingObject.rotation.x = workspace.rotateX;
	workspace.rotatingObject.rotation.y = workspace.rotateY;
	
	workspace.rotatingObject.traverse(function(mesh) {
		if( mesh.update !== undefined ) {
			mesh.update();
		}
	});
	
	/**
	 * background animation 
	 */
	background[1].rotation.order = 'XYZ';
	background[1].rotation.copy( workspace.rotatingObject.rotation.clone() );
	background[1].fov = constrain( camera.position.z * 20.0, 60, 70);
	background[1].updateProjectionMatrix();
	
	workspace.shaderTiming = (Date.now() - startTime )/ 1000;
	render();
  	requestAnimationFrame( animate );
}

function render() {
	workspace.renderer.clear();
	renderer.render( background[0], background[1] );
	renderer.render( scene, camera );
}
