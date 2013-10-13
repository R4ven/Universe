var dustTexture = THREE.ImageUtils.loadTexture( IMAGEPATH+"textures/dust.png" );
var glowSpanTexture = THREE.ImageUtils.loadTexture(IMAGEPATH+'textures/glowspan.png');

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

var SunSystem = function(params) {
	
	this.coord = {x : 0, y : 0, z : 0 };
	this.system = null;
	this.sunObject = null;
	this.sid = 0;
	this.name = "unbekannt";
	this.size = 20;
	
	var update = function() {
		this.sunObject.update();
	}
	
	this.init(params);
}

SunSystem.prototype.init = function(params) {
	this.system = new THREE.Object3D();
	
	if(typeof params == "object") {

		if(typeof params.sid != "undefined") 	sid = parseInt(params.sid); 
		if(typeof params.name == "string") 		name = params.name;
		if(typeof params.size == "number")		size = params.size;
		
		if(typeof params.coord == "object")	{
			this.coord.x = params.coord.x;
			this.coord.y = params.coord.y;
			this.coord.z = params.coord.z;
		}
		
		for(var i=0; i<params.planets.length; i++) {
			var p = params.planets[i];
				p.systemCoord = this.coord;
				
			var planet = new Planet(p);
				pSystem = planet.getSystem();
			var json = planet.getJSON();
			planetList.push(json);
				
				attachLegacyMarker( "text", pSystem, 50, 100, planet.uid );
					
			var light	= new THREE.SpotLight( 0xFFFFFF, 10);
				light.target = pSystem;
				light.shadowCameraNear		= 0.001;		
				light.castShadow			= true;
				light.shadowDarkness		= 0.0;
				
				light.shadowCameraVisible	= false;
				
			this.system.add(planet.getPlanetLine());
			this.system.add(planet.getPlanetBase());
			this.system.add(planet.getSpaceRadius());
			this.system.add(pSystem);
			this.system.add( light );
		}
	}
	
	var light = new THREE.AmbientLight( 0x9c9c9c ); // soft white light
	this.system.add( light );
	
	this.sunObject = new Sun({});	
	this.system.add(this.sunObject.get());
	
}

SunSystem.prototype.getDust = function(){

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
		
		dustUniforms.cameraPitch.value = rotatingObject.rotation.x;		
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

SunSystem.prototype.getSpacePlane = function(){
	var cylinderMaterial = new THREE.MeshBasicMaterial({
		map: glowSpanTexture,
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
		mesh.material.map.onUpdate = function(){
			this.offset.y -= 0.001;
			this.needsUpdate = true;
		}

	var updatePlaneMaterial = function(){
		
		if( camera.position.z < 2000 ){
			
			this.material.opacity = constrain( (camera.position.z - 400.0) * 0.002, 0, 0.5); 
			
			if( this.material.map !== undefined && this.material.opacity <= 0.001 ){
				this.material.map.offset.y = 0.0;
				this.material.map.needsUpdate = true;		
			}

			if( this.material.opacity <= 0 )
				this.visible = false;
			else
				this.visible = true;
		}
		else{
			this.material.opacity += (0.0 - this.material.opacity) * 0.1;
		}

		//	some basic LOD
		if( camera.position.z < 400 )
			this.visible = false;
		else
			this.visible = true;		
	}

	mesh.update = updatePlaneMaterial;
	this.system.add( mesh );

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
	mesh.update = updatePlaneMaterial;
	return mesh;
}

SunSystem.prototype.getSystem = function() {
	return this.system;
}