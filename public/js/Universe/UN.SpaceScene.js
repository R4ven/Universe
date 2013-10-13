UN.SpaceScene = function(containerID, params) {
		
	this.params = params !== undefined ? params : null;

	UN.Scene.call( this, containerID, params );	
	
	return this;
}

UN.SpaceScene.prototype = Object.create( UN.Scene.prototype );

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
		customColor: 	{ type: 'c', value: new THREE.Color( 0xffffff ) }
	};

	var dustShaderMaterial = new THREE.ShaderMaterial( {
		uniforms: 		dustUniforms,
		attributes:     dustAttributes,
		vertexShader:   shaderList.galacticdust.vertex,
		fragmentShader: shaderList.galacticdust.fragment,

		blending: 		THREE.SubtractiveBlending,
		depthTest: 		true,
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
/**
 * Background 
 */
UN.SpaceScene.prototype.getBackground = function() {
	
	var cameraCube = new THREE.PerspectiveCamera( 45, this.container.offsetWidth / this.container.offsetHeight, 0.1, 10000 );
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
		map: UN.TEXTURES.GLOWSPAN,
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

UN.SpaceScene.prototype.render = function() {
	this.renderer.clear();
	
	if(typeof this.background == "object") {
		this.background[1].rotation.order = 'XYZ';
		this.background[1].rotation.copy( this.object3D.rotation.clone() );
		this.background[1].fov = constrain( this.camera.position.z * 20.0, 60, 70);
		this.background[1].updateProjectionMatrix();
		this.renderer.render( this.background[0], this.background[1] );
	}
	
	this.renderer.render(this.scene, this.camera);
	
}