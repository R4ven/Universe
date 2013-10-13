UN.SunSystem.SunSystemRenderer = function() {
	this._self = this;
	this.init();
}
var scene, camera, rotatingObject, renderer = null;

UN.SunSystem.SunSystemRenderer.prototype = Object.create( UN.SpaceObject.prototype );

UN.SunSystem.SunSystemRenderer.prototype.init = function() {
	if ( ! Detector.webgl ) {
			Detector.getWebGLErrorMessage();
			return;
		}
		
		/**
		 * init function 
		 */
		var init = function() {
			gradientImage = document.createElement('img');
			gradientImage.onload = postStarGradientLoaded;
			gradientImage.src = IMAGEPATH + 'star_color_modified.png';	
		}
		
		var postStarGradientLoaded = function(e) {
			gradientCanvas = document.createElement('canvas');
			gradientCanvas.width = gradientImage.width;
			gradientCanvas.height = gradientImage.height;
			gradientCanvas.getContext('2d').drawImage( gradientImage, 0, 0, gradientImage.width, gradientImage.height );
			gradientCanvas.getColor = function( percentage ){
				return this.getContext('2d').getImageData(0,percentage * gradientImage.height, 1, 1).data;
			}
		
			$.loadShaders( shaderList, function(e){
				shaderList = e;
				postShadersLoaded();
			});	
		}
		
		var postShadersLoaded = function(){
			$.loadJSonData( "system/json/"+SystemID , function(loadedData){
				initScene(loadedData);
				animate();
			});
		};
		
		var initScene = function(data) {
			scene = new THREE.Scene();
			
			renderer = new THREE.WebGLRenderer({antialias:true});
			
			rotatingObject = new THREE.Object3D();
			scene.add(rotatingObject);
			
			masterContainerId = 'glContainer';
			masterContainer = document.getElementById(masterContainerId);
			
			camera = new THREE.PerspectiveCamera( 45, screenWidth / screenHeight, 0.1, 10000 );
			camera.position.z = 1000;
			camera.rotation.x = 0;
			camera.rotation.y = 0;
			camera.position.target = { x: 100, z: 1000, y: 0};
			camera.rotation.vx = 0;
			camera.rotation.vy = 0;
			
			camera.update = function(){
				if( this.easeZooming ) return;
				camera.position.z += (camera.position.target.z - camera.position.z) * 0.125;	
				
			};
			
			// projector
            projector = new THREE.Projector();		
			
			scene.add( camera );
			
			masterContainer.addEventListener( 'mousemove', onDocumentMouseMove, true );
			masterContainer.addEventListener( 'mousedown', onDocumentMouseDown, true );
			masterContainer.addEventListener( 'mousewheel', onMouseWheel, false );
			window.addEventListener( 'mouseup', onDocumentMouseUp, false );
			
			sunsystem = new SunSystem(data);
			rotatingObject.add(sunsystem.getSystem());
			
			if(enableDust) rotatingObject.add(sunsystem.getDust());
			if(enableSpacePlane) rotatingObject.add(sunsystem.getSpacePlane());
			
						
			renderer.setSize( screenWidth * devicePixelRatio, screenHeight * devicePixelRatio );
			renderer.domElement.style.width = screenWidth + 'px';
			renderer.domElement.style.height = screenHeight + 'px';
			renderer.setClearColor( 0x000000, 0 );
			//renderer.setClearColor( 0x666666, 1 );
			renderer.autoClear = false;
			renderer.sortObjects = false;
			renderer.generateMipmaps = false;
			renderer.shadowMapEnabled = false;
		
			maxAniso = renderer.getMaxAnisotropy();
			
			domEvent = new THREEx.DomEvent(camera);			
			THREE.Object3D._threexDomEvent.camera(camera);
			
			if(enableBackground) {
				/**
				 * Background 
				 */
				cameraCube = new THREE.PerspectiveCamera( 45, screenWidth / screenHeight, 0.1, 10000 );
				sceneCube = new THREE.Scene();	
		
				var r = IMAGEPATH+"/textures/skybox/s_";		
				var urls = [ r + "px.jpg", r + "nx.jpg", r + "py.jpg", r + "ny.jpg", r + "pz.jpg", r + "nz.jpg" ];
				var textureCube = THREE.ImageUtils.loadTextureCube( urls, undefined );
					textureCube.anisotropy = maxAniso;
				var shader = THREE.ShaderLib[ "cube" ];
					shader.uniforms[ "tCube" ].value = textureCube;
					shader.uniforms[ "opacity" ] = { value: 1.0, type: "f" };
					skyboxUniforms = shader.uniforms;
				var skyboxMat = new THREE.ShaderMaterial( {
					fragmentShader: shaderList.cubemapcustom.fragment,
					vertexShader: shaderList.cubemapcustom.vertex,
					uniforms: shader.uniforms,
					side: THREE.BackSide,
					depthWrite: false,
					depthTest: false,
				} );
				skyboxUniforms["opacity"].value = 1;
				
				skybox = new THREE.Mesh( new THREE.CubeGeometry( 1000, 1000, 1000 ), skyboxMat );
				sceneCube.add( skybox );
			}

			masterContainer.appendChild( renderer.domElement );
			
			
			/**
			 *attach popover 
			*/
			$('body').popover({
				html: true,
				title : '<span class="text-info"><strong>title!!</strong></span> <button type="button" class="popover-planet-close">&times;</button></span>',
				
    			content : function(el) {
    				
    				var disableArr = ['coord', 'meshCoord'];
    				
    				for(var i=0; i < planetList.length; i++ ) {
    					var planet = planetList[i];
    					
    					if(planet.uid == $(this).parent().attr('data-id')) {
    						var table = document.createElement('table');
					    		
				    		for(var propertyName in planet) {
				    			
				    			if(jQuery.inArray(propertyName, disableArr) < 0) {
				    				var tr = document.createElement('tr');
					    			var t = document.createElement('td');
					    				t.appendChild(document.createTextNode(propertyName));
					    			tr.appendChild(t);
					    			var c = document.createElement('td');
					    				c.appendChild(document.createTextNode(planet[propertyName]));
					    			tr.appendChild(c);
									table.appendChild(tr);
				    			}
				    			
							}
				    		
				    		return table;
    					}
    				}
    			},
			    selector: '.popover-planet',
			    container: 'body',
			    trigger: 'click'
			});
			
		}
		
		var animate = function() {
			
			camera.update();
			camera.updateMatrix(); 
			
			rotateX += rotateVX;
			rotateY += rotateVY;
			
			rotateVX *= 0.9;
			rotateVY *= 0.9;
	
			if (dragging ){
				rotateVX *= 0.6;
				rotateVY *= 0.6;
			}
			
			rotatingObject.rotation.x = rotateX;
			rotatingObject.rotation.y = rotateY;

			rotatingObject.traverse(function(mesh) {
				if( mesh.update !== undefined ) {
					mesh.update();
				}
			});
			
			if(enableBackground) {
				cameraCube.rotation.order = 'XYZ';
				cameraCube.rotation.copy( rotatingObject.rotation.clone() );
				cameraCube.fov = constrain( camera.position.z * 20.0, 60, 70);
				cameraCube.updateProjectionMatrix();
				skyboxUniforms["opacity"].value = 1;
			}
			
			
			shaderTiming = (Date.now() - startTime )/ 1000;
			//rotateYAccumulate += Math.abs(rotateY-lastRotateY);
			
			updateLegacyMarkers();
			
			render();
  			requestAnimationFrame( animate );
		}
		
		/**
		 * function render 
		 */
		var render = function() {
			renderer.clear();
			if(enableBackground) renderer.render( sceneCube, cameraCube );
			renderer.render( scene, camera );
			//rendererCSS.render(sceneCSS, camera);
		}
    	
    	/**
    	 * Events
    	 */
    			
		var onDocumentMouseMove = function(event) {		
			
			if (touchMode != TOUCHMODES.NONE) {
				event.preventDefault();
				return;
			}
			pmouseX = mouseX;
			pmouseY = mouseY;
			mouseX = event.clientX - window.innerWidth * 0.5;
			mouseY = event.clientY - window.innerHeight * 0.5;
			
			if (dragging) {
				doCameraRotationFromInteraction();
			}                       
                    
		}
		
		function onDocumentMouseDown(event) {		
			
			switch(event.button) {
				case 2: //right mouse
				dragging = true;
					pressX = mouseX;
					pressY = mouseY;
					rotateTargetX = undefined;
					rotateTargetX = undefined;
					if (initialAutoRotate) {
						initialAutoRotate = false;
					}
				break;
			}	
			
		}
		
		function onDocumentMouseUp(event) {
			dragging = false;
		}
		
		function onMouseWheel(event) {
			var delta = 0;
			if (event.wheelDelta) {
				delta = event.wheelDelta / 120;
			} else if (event.detail) {
				delta = -event.detail / 3;
			}
			if (delta) {
				
				camera.position.target.z += delta * camera.position.target.z * 0.05;
				camera.position.target.pz = camera.position.target.z;
				camera.rotation.vx += (-0.0001 + Math.random() * 0.0002) * camera.position.z / 1000;
				camera.rotation.vy += (-0.0001 + Math.random() * 0.0002) * camera.position.z / 1000;
				if (initialAutoRotate) {
					initialAutoRotate = false;
				}
				
				if(camera.position.target.z > 2000) {
					camera.position.target.z = 2000;
				}
				
				if(camera.position.target.z < 500) {
					camera.position.target.z = 500;
				}
			}
				
			event.returnValue = false;
		}
	
		function doCameraRotationFromInteraction() {
			rotateVY += (mouseX - pmouseX) / 2 * Math.PI / 180 * 0.2;
			rotateVX += (mouseY - pmouseY) / 2 * Math.PI / 180 * 0.2;
			
			camera.rotation.vy += (mouseX - pmouseX) * 0.00005 * camera.position.z;
			camera.rotation.vx += (mouseY - pmouseY) * 0.00005 * camera.position.z;
		}
	
}
/*
UN.SunSystem.SunSystemRenderer.prototype.postStarGradientLoaded = function(e) {
	var self = this;
  	UN.GRADIENTCANVAS = document.createElement('canvas');
	UN.GRADIENTCANVAS.width = UN.GRADIENTIMAGE.width;
	UN.GRADIENTCANVAS.height = UN.GRADIENTIMAGE.height;
	UN.GRADIENTCANVAS.getContext('2d').drawImage( UN.GRADIENTIMAGE, 0, 0, UN.GRADIENTIMAGE.width, UN.GRADIENTIMAGE.height );
	UN.GRADIENTCANVAS.getColor = function( percentage ){
		return this.getContext('2d').getImageData(0,percentage * UN.GRADIENTIMAGE.height, 1, 1).data;
	}

	$.loadShaders( UN.SHADERLIST, function(e){
		UN.SHADERLIST = e;
		self.postShadersLoaded(self);
	});	
};

UN.SunSystem.SunSystemRenderer.prototype.postShadersLoaded = function(scope) {
	var self = this;
	$.loadJSonData( "system/json/"+SystemID , function(loadedData){
		scope.initScene(loadedData);
		UN.SunSystem.scope = scope;
		scope.animate();
	});
}

UN.SunSystem.SunSystemRenderer.prototype.initScene = function(data) {
	var _self = this;
	
	scene = new THREE.Scene();

	rotatingObject = new THREE.Object3D();
		scene.add(rotatingObject);
	
	masterContainerId = 'glContainer';
	masterContainer = document.getElementById(masterContainerId);
	
	camera = new THREE.PerspectiveCamera( 45, screenWidth / screenHeight, 0.1, 10000 );
	camera.position.z = 1000;
	camera.rotation.x = 0;
	camera.rotation.y = 0;
	camera.position.target = { x: 100, z: 1000, y: 0};
	camera.rotation.vx = 0;
	camera.rotation.vy = 0;
	
	camera.update = function(){
		if( this.easeZooming ) return;
		UN.SunSystem.camera.position.z += (UN.SunSystem.camera.position.target.z - UN.SunSystem.camera.position.z) * 0.125;	
		
	};
	
	// projector
    projector = new THREE.Projector();		
	
	scene.add( camera );
	
	/**
	 * Events 
	
	masterContainer.addEventListener( 'mousemove', _self.onDocumentMouseMove, true );
	masterContainer.addEventListener( 'mousedown', _self.onDocumentMouseDown, true );
	masterContainer.addEventListener( 'mousewheel', _self.onMouseWheel, false );
	window.addEventListener( 'mouseup', _self.onDocumentMouseUp, false );
	
	UN.SunSystem.SunsystemObject = new UN.SunSystem(data); */
	//UN.SunSystem.rotatingObject.add(UN.SunSystem.SunsystemObject.getSystem());
	
	var geometry = new THREE.SphereGeometry(30, 50, 50);
		geometry.computeTangents();
	
	var material = new THREE.MeshPhongMaterial({ color: 0x000000, 
													ambient: 0xffffff,
													map: THREE.ImageUtils.loadTexture(IMAGEPATH+"textures/shuixing.jpg"),
													transparent: false,
        											depthWrite: true });	
	var planetMesh 		= new THREE.Mesh(geometry, material);  
	
	rotatingObject.add(planetMesh);
	
	if(UN.SunSystem.enableDust) rotatingObject.add(sunsystem.getDust());
	if(UN.SunSystem.enableSpacePlane) rotatingObject.add(sunsystem.getSpacePlane());
	
	/**
	 * Renderer 
	 */
	renderer = new THREE.WebGLRenderer({antialias:true});			
		renderer.setSize( screenWidth * UN.devicePixelRatio, screenHeight * UN.devicePixelRatio );
		renderer.domElement.style.width = screenWidth + 'px';
		renderer.domElement.style.height = screenHeight + 'px';
		renderer.setClearColor( 0x000000, 1 );
	renderer.setClearColor( 0x666666, 1 );
	renderer.autoClear = false;
	renderer.sortObjects = false;
	renderer.generateMipmaps = false;
	renderer.shadowMapEnabled = false;

	UN.SunSystem.maxAniso = renderer.getMaxAnisotropy();
	
	//domEvent = new THREEx.DomEvent(camera);			
	//THREE.Object3D._threexDomEvent.camera(camera);
	
	if(UN.SunSystem.enableBackground) {
		/**
		 * Background 
		 */
		cameraCube = new THREE.PerspectiveCamera( 45, screenWidth / screenHeight, 0.1, 10000 );
		sceneCube = new THREE.Scene();	

		var r = IMAGEPATH+"/textures/skybox/s_";		
		var urls = [ r + "px.jpg", r + "nx.jpg", r + "py.jpg", r + "ny.jpg", r + "pz.jpg", r + "nz.jpg" ];
		var textureCube = THREE.ImageUtils.loadTextureCube( urls, undefined );
			textureCube.anisotropy = maxAniso;
		var shader = THREE.ShaderLib[ "cube" ];
			shader.uniforms[ "tCube" ].value = textureCube;
			shader.uniforms[ "opacity" ] = { value: 1.0, type: "f" };
			skyboxUniforms = shader.uniforms;
		var skyboxMat = new THREE.ShaderMaterial( {
			fragmentShader: shaderList.cubemapcustom.fragment,
			vertexShader: shaderList.cubemapcustom.vertex,
			uniforms: shader.uniforms,
			side: THREE.BackSide,
			depthWrite: false,
			depthTest: false,
		} );
		skyboxUniforms["opacity"].value = 1;
		
		skybox = new THREE.Mesh( new THREE.CubeGeometry( 1000, 1000, 1000 ), skyboxMat );
		sceneCube.add( skybox );
	}

	masterContainer.appendChild( renderer.domElement );
}

/**
 * animate 
 */

UN.SunSystem.SunSystemRenderer.prototype.animate = function(scope) {
	/*
	UN.SunSystem.camera.update();
	UN.SunSystem.camera.updateMatrix(); 
	
	UN.SunSystem.rotateX += UN.SunSystem.rotateVX;
	UN.SunSystem.rotateY += UN.SunSystem.rotateVY;
	
	UN.SunSystem.rotateVX *= 0.9;
	UN.SunSystem.rotateVY *= 0.9;

	if (UN.SunSystem.dragging ){
		UN.SunSystem.rotateVX *= 0.6;
		UN.SunSystem.rotateVY *= 0.6;
	}*/
	
	/*
	UN.SunSystem.rotatingObject.rotation.x = UN.SunSystem.rotateX;
	UN.SunSystem.rotatingObject.rotation.y = UN.SunSystem.rotateY;

	UN.SunSystem.rotatingObject.traverse(function(mesh) {
		if( mesh.update !== undefined ) {
			mesh.update();
		}
	});*/
	
	if(UN.SunSystem.enableBackground) {
		cameraCube.rotation.order = 'XYZ';
		cameraCube.rotation.copy( rotatingObject.rotation.clone() );
		cameraCube.fov = constrain( camera.position.z * 20.0, 60, 70);
		cameraCube.updateProjectionMatrix();
		skyboxUniforms["opacity"].value = 1;
	}
	
	/*
	UN.SunSystem.shaderTiming = (Date.now() - UN.SunSystem.startTime )/ 1000;
	//rotateYAccumulate += Math.abs(rotateY-lastRotateY);
	
	//updateLegacyMarkers();*/
	renderer.render();
	requestAnimationFrame( UN.SunSystem.animate() );
}

/**
 * function render 
 */
UN.SunSystem.SunSystemRenderer.prototype.render = function() {

	UN.SunSystem.renderer.clear();
	if(UN.SunSystem.enableBackground) UN.SunSystem.renderer.render( sceneCube, cameraCube );
	UN.SunSystem.renderer.render( UN.SunSystem.scene, UN.SunSystem.camera );
	//rendererCSS.render(sceneCSS, camera);
}

UN.SunSystem.SunSystemRenderer.prototype.onDocumentMouseMove = function(event) {		
			
	if (UN.SunSystem.touchMode != UN.SunSystem.TOUCHMODES.NONE) {
		event.preventDefault();
		return;
	}
	UN.SunSystem.pmouseX = UN.SunSystem.mouseX;
	UN.SunSystem.pmouseY = UN.mouseY;
	UN.SunSystem.mouseX = event.clientX - window.innerWidth * 0.5;
	UN.SunSystem.mouseY = event.clientY - window.innerHeight * 0.5;
	
	if (UN.SunSystem.dragging) {
		doCameraRotationFromInteraction();
	}                       
            
}

UN.SunSystem.SunSystemRenderer.prototype.onDocumentMouseDown = function(event) {		
	
	switch(event.button) {
		case 2: //right mouse
			UN.SunSystem.dragging = true;
			UN.SunSystem.pressX = UN.SunSystem.mouseX;
			UN.SunSystem.pressY = UN.SunSystem.mouseY;
			UN.SunSystem.rotateTargetX = undefined;
			UN.SunSystem.rotateTargetX = undefined;
			if (UN.SunSystem.initialAutoRotate) {
				UN.SunSystem.initialAutoRotate = false;
			}
		break;
	}	
	
}

UN.SunSystem.SunSystemRenderer.prototype.onDocumentMouseUp = function(event) {
	UN.SunSystem.dragging = false;
}

UN.SunSystem.SunSystemRenderer.prototype.onMouseWheel = function(event) {
	var delta = 0;
	if (event.wheelDelta) {
		delta = event.wheelDelta / 120;
	} else if (event.detail) {
		delta = -event.detail / 3;
	}
	if (delta) {
		
		UN.SunSystem.camera.position.target.z += delta * UN.SunSystem.camera.position.target.z * 0.05;
		UN.SunSystem.camera.position.target.pz = UN.SunSystem.camera.position.target.z;
		UN.SunSystem.camera.rotation.vx += (-0.0001 + Math.random() * 0.0002) * UN.SunSystem.camera.position.z / 1000;
		UN.SunSystem.camera.rotation.vy += (-0.0001 + Math.random() * 0.0002) * UN.SunSystem.camera.position.z / 1000;
		if (UN.SunSystem.initialAutoRotate) {
			UN.SunSystem.initialAutoRotate = false;
		}
		
		if(UN.SunSystem.camera.position.target.z > 2000) {
			UN.SunSystem.camera.position.target.z = 2000;
		}
		
		if(UN.SunSystem.camera.position.target.z < 500) {
			UN.SunSystem.camera.position.target.z = 500;
		}
	}
		
	event.returnValue = false;
}

UN.SunSystem.SunSystemRenderer.prototype.doCameraRotationFromInteraction = function() {
	UN.SunSystem.rotateVY += (UN.SunSystem.mouseX - UN.SunSystem.pmouseX) / 2 * Math.PI / 180 * 0.2;
	UN.SunSystem.rotateVX += (UN.SunSystem.mouseY - UN.SunSystem.pmouseY) / 2 * Math.PI / 180 * 0.2;
	
	UN.SunSystem.camera.rotation.vy += (UN.SunSystem.mouseX - UN.SunSystem.pmouseX) * 0.00005 * UN.SunSystem.camera.position.z;
	UN.SunSystem.camera.rotation.vx += (UN.SunSystem.mouseY - UN.SunSystem.pmouseY) * 0.00005 * UN.SunSystem.camera.position.z;
}