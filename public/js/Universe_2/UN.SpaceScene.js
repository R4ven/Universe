var glowspan = THREE.ImageUtils.loadTexture(TEXTUREPATH+'glowspan.png');

UN.SpaceScene = function(params, callback) {

	this.background = undefined;
	this.enableBackground = true;
	this.callback = callback;
	this.screenWidth = screenWidth;
	this.screenHeight = screenHeight;
	this.maxAniso = 0;
	this.containerId = undefined;
	this.container = undefined;
	this.touchMode = UN.TOUCHMODES.NONE;
	this.objects = [];

	this.mouseX, this.mouseY, this.pmouseX, this.pmouseY, this.pressX, this.pressY, 
	this.rotateVX = 0;
	this.rotateVY = 0;
	this.rotateX = 0.4;
	this.rotateY = 0.9;
	this.startTime = Date.now();
	
	this.object3D = new THREE.Object3D();
	
	this.params = params !== undefined ? params : null;

	this.jsonUrl = undefined;
	
	for (var prop in params) {
      	if(this.hasOwnProperty(prop)){
        	this[prop] = params[prop];
      	}
   	}

   	this.containerId = 'glContainer';

	this.init();	
}

UN.SpaceScene.prototype.init = function() {

	var _this = this;

	if ( ! Detector.webgl ) {
		Detector.getWebGLErrorMessage();
		return;
	}
	
	loadImage(TEXTUREPATH + 'star_color_modified.png', function(img) {
		gradientImage = img;
		/*
		gradientCanvas = document.createElement('canvas');
		gradientCanvas.width = gradientImage.width;
		gradientCanvas.height = gradientImage.height;
		gradientCanvas.getContext('2d').drawImage( img, 0, 0, img.width, img.height );
		gradientCanvas.getColor = function( percentage ){
			return this.getContext('2d').getImageData(0,percentage * gradientImage.height, 1, 1).data;
		}*/
		
		loadShaders( shaderList, function(e){
			shaderList = e;
			
			_this.initScene();
			
			if(typeof _this.jsonUrl != "undefined" && _this.jsonUrl.length > 0 && _this.jsonUrl != undefined) {
				loadJSon( _this.jsonUrl , function(loadedData){
					_this.callback(loadedData);
					_this.jsonUrl = undefined;
					_this.callback = undefined;
				});
			} 
			
		});	
	});
}

UN.SpaceScene.prototype.initScene = function() {
	var _self = this;
	this.scene = new THREE.Scene();
	
	this.scene.add(this.object3D);		
	
	//light
	var light = new THREE.AmbientLight( 0x9c9c9c ); // soft white light
	this.scene.add( light );
	
	this.initRenderer();
	this.initCamera();
	
	this.projector = new THREE.Projector();
	
	if(this.containerId != undefined ) 
	{
		this.container = document.getElementById(this.containerId);
		this.container.addEventListener( 'mousemove', function(ev) { _self.onDocumentMouseMove(ev, _self) }, true );
		this.container.addEventListener( 'mousedown', function(ev) { _self.onDocumentMouseDown(ev, _self) }, true );
		window.addEventListener( 'mouseup', function(ev) { _self.onDocumentMouseUp (ev, _self) }, true );
		
		window.addEventListener( 'resize', function(ev) { _self.onDocumentResize (ev, _self) }, true );
		
		$(this.container).bind('mousewheel', function(event, delta) {
		 	_self.onMouseWheel (event, _self, delta)
		 	event.preventDefault();
		 	return false;
		});
	}
	
	this.domEvent = new THREEx.DomEvent(this.camera);			
	THREE.Object3D._threexDomEvent.camera(this.camera);
	
	
	this.object3D.add(this.getDust());

	if(this.enableBackground) {
		this.background = this.getBackground();
	}
	
	$(window).trigger('resize');
}

UN.SpaceScene.prototype.initRenderer = function() {

	console.log(this.screenHeight);
	this.renderer = new THREE.WebGLRenderer({antialias:true});
	this.renderer.setSize( this.screenWidth * UN.devicePixelRatio, this.screenHeight * UN.devicePixelRatio );
	this.renderer.domElement.style.width = this.screenWidth + 'px';
	this.renderer.domElement.style.height = this.screenHeight + 'px';
	this.renderer.setClearColor( new THREE.Color(0x000000) );
	this.renderer.setClearColor( new THREE.Color(0x666666) );
	this.renderer.autoClear = false;
	this.renderer.sortObjects = false;
	this.renderer.generateMipmaps = false;
	this.renderer.shadowMapEnabled = true;
		
	this.maxAniso = this.renderer.getMaxAnisotropy();
}

UN.SpaceScene.prototype.getRenderer = function() {
	return this.renderer;
}

UN.SpaceScene.prototype.animate = function() {
	
	this.camera.update();
	this.camera.updateMatrix(); 
	
	this.rotateX += this.rotateVX;
	this.rotateY += this.rotateVY;
	
	this.rotateVX *= 0.9;
	this.rotateVY *= 0.9;

	if (this.dragging ){
		this.rotateVX *= 0.6;
		this.rotateVY *= 0.6;
	}
	
	this.object3D.rotation.x = this.rotateX;
	this.object3D.rotation.y = this.rotateY;
	
	this.object3D.traverse(function(mesh) {
		if( mesh.update !== undefined ) {
			mesh.update();
		}
	});
	
	this.shaderTiming = (Date.now() - this.startTime )/ 1000;
	
	/**
	 * background animation 
	 */
	if(typeof this.background == "object") {
		this.background[1].rotation.order = 'XYZ';
		this.background[1].rotation.copy( this.object3D.rotation.clone() );
		this.background[1].fov = constrain( this.camera.position.z * 20.0, 60, 70);
		this.background[1].updateProjectionMatrix();
	}
	
	
	//console.log(workspace.shaderTiming);*/
	
}

UN.SpaceScene.prototype.render = function() {
	this.renderer.clear();
	if(this.enableBackground) { this.renderer.render( this.background[0], this.background[1] ); }
	this.renderer.render( this.scene, this.camera );
}

UN.SpaceScene.prototype.initCamera = function() {
	var _self = this;
	this.camera = new THREE.PerspectiveCamera( 45, this.screenWidth / this.screenHeight, 0.1, 10000 );
	this.camera.position.z = 1000;
	this.camera.rotation.x = 0;
	this.camera.rotation.y = 0;
	this.camera.position.target = { x: 100, z: 1000, y: 0};
	this.camera.rotation.vx = 0;
	this.camera.rotation.vy = 0;
		
	this.camera.update = function(){
		if( _self.easeZooming ) return;
		_self.camera.position.z += (_self.camera.position.target.z - _self.camera.position.z);	
		
	};
}

UN.SpaceScene.prototype.getCamera = function() {
	return this.camera;
}

UN.SpaceScene.prototype.onDocumentResize = function(event, scope) {
	scope.screenWidth = $('#' + scope.containerId).width();
	scope.screenHeight = $('#' + scope.containerId).width();
	
	if(scope.screenWidth >= 870)  {
		//scope.screenHeight = scope.screenHeight;
	}
	
	scope.maxAniso =scope.renderer.getMaxAnisotropy();

	pageZoom = document.documentElement.clientWidth / this.screenWidth;

	scope.devicePixelRatio = window.devicePixelRatio || 1;
	scope.renderer.setSize(scope.screenWidth * scope.devicePixelRatio, scope.screenHeight * scope.devicePixelRatio);
	scope.renderer.domElement.style.width = scope.screenWidth + 'px';
	scope.renderer.domElement.style.height = scope.screenHeight + 'px';
	scope.camera.aspect = scope.screenWidth / scope.screenHeight;
	scope.camera.updateProjectionMatrix();
}

UN.SpaceScene.prototype.onMouseWheel = function(event, scope, delta) {

	if (delta) {
		
		scope.camera.position.target.z += delta * scope.camera.position.target.z * 0.05;
		scope.camera.position.target.pz = scope.camera.position.target.z;
		scope.camera.rotation.vx += (-0.0001 + Math.random() * 0.0002) * scope.camera.position.z / 1000;
		scope.camera.rotation.vy += (-0.0001 + Math.random() * 0.0002) * scope.camera.position.z / 1000;
		if (scope.initialAutoRotate) {
			scope.initialAutoRotate = false;
		}
		
		if(scope.camera.position.target.z > 2000) {
			scope.camera.position.target.z = 2000;
		}
		
		if(scope.camera.position.target.z < 500) {
			scope.camera.position.target.z = 500;
		}
	}
	
	if(typeof this.onCameraMotionEvent == "function") {
		this.onCameraMotionEvent();
	}
	
	event.returnValue = false;
}

UN.SpaceScene.prototype.onDocumentMouseMove = function(event, scope) {
	if (scope.touchMode != UN.TOUCHMODES.NONE) {
		event.preventDefault();
		return;
	}
	scope.pmouseX = scope.mouseX;
	scope.pmouseY = scope.mouseY;
	//scope.mouseX = event.clientX - scope.screenWidth * 0.5;
	//scope.mouseY = event.clientY - scope.screenHeight * 0.5;
	
	scope.mouseX = event.clientX - (window.innerWidth * 0.5)
   	scope.mouseY = event.clientY - (window.innerHeight - (window.innerHeight - $(this.container).offset().top));
	
	//document.getElementById('mousex').innerHTML = scope.mouseX;
	//document.getElementById('mousey').innerHTML = scope.mouseY;
	
	//event.preventDefault();
    //document.getElementById('mousex').innerHTML = (mouseX / container.offsetWidth )*2-1;
	
	var vector = new THREE.Vector3( ( scope.mouseX / scope.container.offsetWidth )*2-1, - ( scope.mouseY / $(scope.container).find('canvas').height() )*2+1, 0.5 ).normalize();
	
    scope.projector.unprojectVector( vector, scope.camera );
   
    var raycaster = new THREE.Raycaster( scope.camera.position, vector.sub( scope.camera.position ).normalize() );
    var intersects = raycaster.intersectObjects( scope.objects , true);
    
	//console.log(scope.camera.position);
	
    if ( intersects.length > 0 ){
        console.log(intersects[0]);
    }//end of if
	
	if (scope.dragging) {
		scope.doCameraRotationFromInteraction();
	}   
	
	if(typeof this.onMouseMove == "function") {
		this.onMouseMove(event, scope);
	}
	
	if(typeof this.onCameraMotionEvent == "function") {
		this.onCameraMotionEvent();
	}
}

UN.SpaceScene.prototype.onDocumentMouseDown = function(event, scope) {

	switch(event.button) {
		case 0: //left mouse
			//event.preventDefault();
		    //document.getElementById('mousex').innerHTML = (mouseX / container.offsetWidth )*2-1;
		    var vector = new THREE.Vector3( ( scope.mouseX / scope.container.offsetWidth )*2-1, - ( scope.mouseY / scope.container.offsetHeight )*2+1, 1 );
		    scope.projector.unprojectVector( vector, scope.camera );
		   
		    var raycaster = new THREE.Raycaster( scope.camera.position, vector.sub( scope.camera.position ).normalize() );
		    var intersects = raycaster.intersectObjects( scope.objects , true);

		    if ( intersects.length > 0 ){
		        alert(intersects);
		    }//end of if
		
			break;
		
		case 2: //right mouse
			scope.dragging = true;
			scope.pressX = scope.mouseX;
			scope.pressY = scope.mouseY;
			scope.rotateTargetX = undefined;
			scope.rotateTargetX = undefined;
			if (scope.initialAutoRotate) {
				scope.initialAutoRotate = false;
			}
		break;
	}	
}

UN.SpaceScene.prototype.onDocumentMouseUp = function(event, scope) {
	scope.dragging = false;
}

UN.SpaceScene.prototype.doCameraRotationFromInteraction = function() {
	this.rotateVY += (this.mouseX - this.pmouseX) / 2 * Math.PI / 180 * 0.2;
	this.rotateVX += (this.mouseY - this.pmouseY) / 2 * Math.PI / 180 * 0.2;
	
	this.camera.rotation.vy += (this.mouseX - this.pmouseX) * 0.00005 * this.camera.position.z;
	this.camera.rotation.vx += (this.mouseY - this.pmouseY) * 0.00005 * this.camera.position.z;
	
	
}

/**
 * Background 
 */
UN.SpaceScene.prototype.getBackground = function() {
	
	var cameraCube = new THREE.PerspectiveCamera( 45, screenWidth / screenHeight, 0.1, 10000 );
	var sceneCube = new THREE.Scene();	
	
	var r = TEXTUREPATH+"/skybox/s_";		
	var urls = [ r + "px.jpg", r + "nx.jpg", r + "py.jpg", r + "ny.jpg", r + "pz.jpg", r + "nz.jpg" ];
	var textureCube = THREE.ImageUtils.loadTextureCube( urls, undefined );
		textureCube.anisotropy = this.maxAniso;
		
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
	
		
	var skybox = new THREE.Mesh( new THREE.CubeGeometry( 1000, 1000, 1000 ), skyboxMat );
		sceneCube.add( skybox );
	return [sceneCube, cameraCube];
}

UN.SpaceScene.prototype.getDust = function(){
	var self = this;
	var dustTexture = THREE.ImageUtils.loadTexture( TEXTUREPATH+"dust.png" );
	var dustUniforms = {
		color:     { type: "c", value: new THREE.Color( 0xffffff ) },
		scale: 		{ type: 'f', value: 1 },
		texture0:   { type: "t", value: dustTexture },
		cameraPitch: { type: "f", value: 0 },
	};
	
	var dustAttributes = {
		size: 			{ type: 'f', value: [] },	
		customColor: 	{ type: 'c', value: [] }
	};

	var dustShaderMaterial = new THREE.ShaderMaterial( {
		uniforms: 		dustUniforms,
		attributes:     dustAttributes,
		vertexShader:   shaderList.galacticdust.vertex,
		fragmentShader: shaderList.galacticdust.fragment,

		blending: 		THREE.SubtractiveBlending,
		depthTest: 		false,
		depthWrite: 	true,
		transparent:	true,
		sizeAttenuation: false,		
	});	

	var pGalacticDust = new THREE.Geometry();	

	var count = random(800, 1400);
	var numArms = 5;
	var arm = 0;
	var countPerArm = count / numArms;
	var ang = 0;
	var dist = 0;
	for( var i=0; i<count; i++ ){
		var x = Math.cos(ang) * dist;
	
		var y = 0;
		var z = Math.sin(ang) * dist;

		var sa = 1000;
		if( Math.random() > 0.3)
			sa *= ( 1 + Math.random() );
		x += random(-sa, sa);
		z += random(-sa, sa);
		y += random(-sa, sa);

		var p = new THREE.Vector3(x,y,z);

		p.size = Math.random()/10000;
		pGalacticDust.vertices.push( p );
		
		var r = 1;
		var g = 1;
		var b = 1;
		var c = new THREE.Color();
		c.r = r; c.g = g; c.b = b;
		pGalacticDust.colors.push( c );	

		ang -= 0.0012;	
		dist += .5;

		if( i % countPerArm == 0 ){
			ang = Math.PI * 2 / numArms * arm;
			dist = 0;
			arm++;
		}
	}		

	pDustSystem = new THREE.ParticleSystem( pGalacticDust, dustShaderMaterial );

	//	set the values to the shader
	var values_size = dustAttributes.size.value;
	var values_color = dustAttributes.customColor.value;

	for( var v = 0; v < pGalacticDust.vertices.length; v++ ) {		
		values_size[ v ] = pGalacticDust.vertices[v].size;
		values_color[ v ] = pGalacticDust.colors[v];
	}
	var twoPI = Math.PI * 2;
	
	pDustSystem.update = function(){		
		
		dustUniforms.cameraPitch.value = self.object3D.rotation.x;		
		while( dustUniforms.cameraPitch.value > twoPI ){
			dustUniforms.cameraPitch.value -= twoPI;
		}

		while( dustUniforms.cameraPitch.value < -twoPI ){
			dustUniforms.cameraPitch.value += twoPI;
		}		

		//	scale the particles based off of screen size
		var areaOfWindow = window.innerWidth * window.innerHeight;
		dustUniforms.scale.value = areaOfWindow / 720.0;

	}

	return pDustSystem;
}	

UN.SpaceScene.prototype.getCoordLines = function() {
	
	var lines = new THREE.Geometry();
	lines.vertices.push( new THREE.Vector3(0,0,-600) );
	lines.vertices.push( new THREE.Vector3(0,0,600) );
	lines.vertices.push( new THREE.Vector3(-600,0,0) );
	lines.vertices.push( new THREE.Vector3(600,0,0) );
	mesh = new THREE.Line( lines, new THREE.LineBasicMaterial(
		{ 
			color: 0x111144, 
			blending: THREE.AdditiveBlending,
			transparent: true,
			depthTest: false,
			depthWrite: true,		
			wireframe: true,
			linewidth: 2,
		}), THREE.LinePieces );
	//mesh.update = updatePlaneMaterial;
	
	return mesh;
}

UN.SpaceScene.prototype.getSpacePlane = function(camera){

	var cylinderMaterial = new THREE.MeshBasicMaterial({
		map: glowspan,
		blending: THREE.AdditiveBlending,
		transparent: true,
		depthTest: false,
		depthWrite: false,		
		wireframe: true,
		opacity: 0,
	})
	
	var cylinderGeo = new THREE.CylinderGeometry( 600, 0, 0, (360/8) - 1, 100 );
	
	var mesh = new THREE.Mesh( cylinderGeo, cylinderMaterial );
		mesh.material.map.wrapS = THREE.RepeatWrapping;
		mesh.material.map.wrapT = THREE.RepeatWrapping;
		mesh.material.map.needsUpdate = true;
		mesh.material.opacity = 0.3;

	mesh.update = function(){
		this.material.map.offset.y -= 0.001;
		this.material.map.needsUpdate = true;
	}

	return mesh;

}