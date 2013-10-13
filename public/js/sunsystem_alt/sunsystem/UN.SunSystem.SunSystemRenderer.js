var TOUCHMODES = {
	NONE : 0,
	SINGLE : 1,
	DOUBLE : 2,
}
var mouseX = 0, mouseY = 0, pmouseX = 0, pmouseY = 0, pressX = 0, pressY = 0, rotateVX = 0, rotateVY = 0, rotateX = 0.4, rotateY = 0.9;
var touchMode = TOUCHMODES.NONE;
var dragging = false;
var masterContainer = null;
var initialAutoRotate = true;
var cameraCube = null;
var sceneCube = null;
var showPlanetLine = true;
var allObjects = [];
var domEvent;
var rendererCSS;	
var enableDust, enableSpacePlane, enableBackground = true;
//var sceneCSS	= new THREE.Scene();
var legacyMarkers = [];
var planetList = [];

(function ($) {
    $.sunSystemRender = function (options) {

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
			gradientImage.src = IMAGEPATH + 'textures/star_color_modified.png';	
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
				UN.SHADERLIST = e;
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
			
			sunsystem = new UN.SunSystem(data);
			rotatingObject.add(sunsystem.getSystem());			
			rotatingObject.add(sunsystem.getDust());
			rotatingObject.add(sunsystem.getSpacePlane());
			
			//domEvent = new THREEx.DomEvent(camera);			
			//THREE.Object3D._threexDomEvent.camera(camera);
			
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
					fragmentShader: UN.SHADERLIST.cubemapcustom.fragment,
					vertexShader: UN.SHADERLIST.cubemapcustom.vertex,
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
			
			
			UN.SunSystem.shaderTiming = (Date.now() - startTime )/ 1000;
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
    	
      	init();
	};
})(jQuery);



