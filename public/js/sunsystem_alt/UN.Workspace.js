/*var gradientImage, gradientCanvas = null;
var scene, renderer, camera, rotatingObject = null;
var rotateYAccumulate, shaderTiming = 0;*/

UN.Workspace = function(params) {
	
	this.params = params !== undefined ? params : null;
	
	this.screenWidth = 800;
	this.screenHeight = 640;
	this.maxAniso = 0;
	this.containerId = undefined;
	this.container = undefined;
	this.touchMode = UN.TOUCHMODES.NONE;

	for (var prop in params) {
      	if(this.hasOwnProperty(prop)){
        	this[prop] = params[prop];
      	}
   	}
	
	this.init();
}

UN.Workspace.prototype.init = function() {
	
	var _self = this;
	
	this.scene = new THREE.Scene();
	
	this.initRenderer();
	this.initCamera();
	
	this.mouseX, this.mouseY, this.pmouseX, this.pmouseY, this.pressX, this.pressY, 
	this.rotateVX = 0;
	this.rotateVY = 0;
	this.rotateX = 0.4;
	this.rotateY = 0.9;
	this.startTime = Date.now();
	
	if(this.containerId != undefined ) 
	{
		this.container = document.getElementById(this.containerId);
		this.container.addEventListener( 'mousemove', function(ev) { _self.onDocumentMouseMove(ev, _self) }, true );
		this.container.addEventListener( 'mousedown', function(ev) { _self.onDocumentMouseDown(ev, _self) }, true );
		window.addEventListener( 'mouseup', function(ev) { _self.onDocumentMouseUp (ev, _self) }, true );
		this.container.addEventListener( 'mousewheel', function(ev) { _self.onMouseWheel (ev, _self) }, true );
	}
}

UN.Workspace.prototype.getScene = function() {
	return this.scene;
}

UN.Workspace.prototype.initRenderer = function() {
	this.renderer = new THREE.WebGLRenderer({antialias:true});
	this.renderer.setSize( this.screenWidth * UN.devicePixelRatio, this.screenHeight * UN.devicePixelRatio );
	this.renderer.domElement.style.width = this.screenWidth + 'px';
	this.renderer.domElement.style.height = this.screenHeight + 'px';
	this.renderer.setClearColor( new THREE.Color(0x666666) );
	//this.renderer.setClearColor( 0x666666, 1 );
	this.renderer.autoClear = false;
	this.renderer.sortObjects = false;
	this.renderer.generateMipmaps = false;
	this.renderer.shadowMapEnabled = true;
		
	this.maxAniso = this.renderer.getMaxAnisotropy();
}

UN.Workspace.prototype.getRenderer = function() {
	return this.renderer;
}

UN.Workspace.prototype.initCamera = function() {
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
		_self.camera.position.z += (_self.camera.position.target.z - _self.camera.position.z) * 0.125;	
		
	};
}

UN.Workspace.prototype.getCamera = function() {
	return this.camera;
}


UN.Workspace.prototype.onMouseWheel = function(event, scope) {
	var delta = 0;
	if (event.wheelDelta) {
		delta = event.wheelDelta / 120;
	} else if (event.detail) {
		delta = -event.detail / 3;
	}
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
		
	event.returnValue = false;
}

UN.Workspace.prototype.onDocumentMouseMove = function(event, scope) {
	if (scope.touchMode != UN.TOUCHMODES.NONE) {
		event.preventDefault();
		return;
	}
	scope.pmouseX = scope.mouseX;
	scope.pmouseY = scope.mouseY;
	scope.mouseX = event.clientX - scope.screenWidth * 0.5;
	scope.mouseY = event.clientY - scope.screenHeight * 0.5;
	
	if (scope.dragging) {
		scope.doCameraRotationFromInteraction();
	}   
}

UN.Workspace.prototype.onDocumentMouseDown = function(event, scope) {
	
	//switch(event.button) {
	//	case 2: //right mouse
		scope.dragging = true;
		scope.pressX = scope.mouseX;
		scope.pressY = scope.mouseY;
		scope.rotateTargetX = undefined;
		scope.rotateTargetX = undefined;
		if (scope.initialAutoRotate) {
			scope.initialAutoRotate = false;
		}
	//	break;
	//}	
}

UN.Workspace.prototype.onDocumentMouseUp = function(event, scope) {
	scope.dragging = false;
}

UN.Workspace.prototype.doCameraRotationFromInteraction = function() {
	this.rotateVY += (this.mouseX - this.pmouseX) / 2 * Math.PI / 180 * 0.2;
	this.rotateVX += (this.mouseY - this.pmouseY) / 2 * Math.PI / 180 * 0.2;
	
	this.camera.rotation.vy += (this.mouseX - this.pmouseX) * 0.00005 * this.camera.position.z;
	this.camera.rotation.vx += (this.mouseY - this.pmouseY) * 0.00005 * this.camera.position.z;
}

/**
 * Background 
 */
UN.Workspace.prototype.getBackground = function() {
	
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

UN.Workspace.prototype.getDust = function(){
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
		
		dustUniforms.cameraPitch.value = self.rotatingObject.rotation.x;		
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
				