var planetTexture = THREE.ImageUtils.loadTexture(IMAGEPATH+"textures/earth_atmos_2048.jpg");
var starBaseTexture = THREE.ImageUtils.loadTexture( IMAGEPATH+'textures/starbase.png');
var guidePointTexture = THREE.ImageUtils.loadTexture( IMAGEPATH+"textures/p_1.png" );

var Planet = function(params) {
	var self = this;
	
	this.coord = {x : 0, y : 0, z : 0 };
	this.meshCoord = {x : 0, y : 0, z : 0 };
	this.geometry = null;
	this.material = null;
	this.name = "unknown";
	this.position = new THREE.Vector3();
	this.radius = 10;
	this.system = new THREE.Object3D();
	this.uid = 0;
	this.cloudsId = 1;
	this.clouds = null;
	this.factor = 20;
	
	this.system.update = function() {
		if (self.cloudsId > 0) {
			self.clouds.rotation.x -= 0.0005;	
		}
		self.planetMesh.rotation.y -= 0.001;
	}
	
	this.init(params);
}

Planet.prototype.getJSON = function() {
	var obj = {
		uid : this.uid,
		name : this.name,
		coord : this.coord,
		radius : this.radius,
		meshCoord : this.meshCoord
	};
	return obj;
}
	
Planet.prototype.init = function(params) {
	
	if(typeof params == "object") {
		if(typeof params.uid != "undefined") 	this.uid = parseInt(params.uid); 
		if(typeof params.name == "string") 		this.name = params.name;
		if(typeof params.size == "number")		this.size = params.size;
		
		if(typeof params.coord == "object")	{
			this.coord.x = parseInt(params.coord.x);
			this.coord.y = parseInt(params.coord.y);
			this.coord.z = parseInt(params.coord.z);
		}
		
		if(typeof params.systemCoord == "object")	{
			this.meshCoord.x = (this.coord.x - params.systemCoord.x) * this.factor;
			this.meshCoord.y = (this.coord.y - params.systemCoord.y) * this.factor;
			this.meshCoord.z = (this.coord.z - params.systemCoord.z) * this.factor;
		}
	}

	this.geometry = new THREE.SphereGeometry(this.radius, 50, 50);
	this.geometry.computeTangents();
	
	this.material = this.getMaterial(2);
	this.position = new THREE.Vector3(this.meshCoord.x, this.meshCoord.y, this.meshCoord.z);
	
	this.planetMesh 		= new THREE.Mesh(this.geometry, this.material);    
	this.planetMesh.uid 	= this.id;
	this.planetMesh.rotation.z = 0.0001;
	this.planetMesh.castShadow = true;
	this.planetMesh.receiveShadow = true;
	this.planetMesh.renderDepth = true;

	if(this.cloudsId > 0) {
		
		var cloudsTexture = THREE.ImageUtils.loadTexture(IMAGEPATH+"textures/earth_clouds_1024.png");
		var materialClouds = new THREE.MeshLambertMaterial({ color: 0xffffff, map: cloudsTexture, transparent: true });
	    this.clouds = new THREE.Mesh(this.geometry, materialClouds);
	    this.clouds.scale.set(1.008, 1.008, 1.008);
	    this.clouds.rotation.z = 0.0001;
	        
	    this.system.add(this.clouds);
	}
	
	this.system.position = this.position;
	this.system.visible = true;
	this.system.add(this.planetMesh);
	
}

Planet.prototype.getMaterial = function( type ) {
	var map = null;
	switch(type) {
		case 1:	map = THREE.ImageUtils.loadTexture(IMAGEPATH+"textures/shuixing.jpg"); break;
		case 2:	
		default: map = planetTexture; break;
		}
			
	return material = new THREE.MeshPhongMaterial({ color: 0x000000, 
													ambient: 0xffffff,
													map: map,
													transparent: false,
        											depthWrite: true });
}

Planet.prototype.getSystem = function() {
	return this.system;
}

Planet.prototype.getPlanetBase = function() {
	var self = this;
	var position = this.position;
	var x = position.x;
	var z = position.z;
		
	var geometry = new THREE.PlaneGeometry(this.radius * 10, this.radius * 10);
        geometry.computeTangents();
        geometry.applyMatrix(new THREE.Matrix4().makeRotationX( - Math.PI / 2 ));
        
   	var material = new THREE.MeshBasicMaterial({
		map: starBaseTexture,
		blending: THREE.AdditiveBlending,
		transparent: true,
		depthTest: false,
		depthWrite: false,
		side: THREE.DoubleSide
	});
    var mesh = new THREE.Mesh(geometry, material);
    
    	mesh.position.x = x;
		mesh.position.z = z;
		mesh.position.y = 0;
	return mesh;
}

//	-----------------------------------------------------------------------------
//	attach lines from star to plane base
Planet.prototype.getPlanetLine = function() {
	var self = this;
	var position = this.position;
	var pLineGeo = new THREE.Geometry();
		pLineGeo.vertices.push( position.clone() );
	var base = position.clone();
	base.y = 0;
	pLineGeo.vertices.push( base );
	
	var lineMesh = new THREE.Line( pLineGeo, new THREE.LineBasicMaterial({
		color: 			0x333333,
		blending: 		THREE.AdditiveBlending,
		depthTest: 		true,
		depthWrite: 	false,
		transparent:	true,

	}), THREE.LinePieces );
	
	lineMesh.update = function() {
		if(showPlanetLine) {
			this.visible = true;
		} else {
			this.visible = false;
		}
	}
	return lineMesh;
}

Planet.prototype.getSpaceRadius = function() {
	var color = 0xffffff;
	var representationScale = 1;
	
	var radius = Math.sqrt( this.meshCoord.x*this.meshCoord.x + this.meshCoord.z*this.meshCoord.z);

	var width = Math.sqrt(radius) * representationScale;
	var textureRepeat = 30;

	var resolution = 180;
	var twoPI = Math.PI * 2;
	var angPerRes = twoPI / resolution;	
	var verts = [];
	for( var i=0; i<twoPI; i+=angPerRes ){
		var x = Math.cos( i ) * radius;
		var y = Math.sin( i ) * radius;
		var v = new THREE.Vector3( x,y,0 );
		verts.push( v );
	}

	var geometry = new THREE.Geometry();
	geometry.vertices = verts;

	var particleMaterial = new THREE.ParticleBasicMaterial({
			color: color, 
			size: 4, 
			sizeAttenuation: false, 
			map: guidePointTexture,
			blending: THREE.AdditiveBlending,
			depthTest: true,
			depthWrite: false,
		} 
	);

	var mesh = new THREE.ParticleSystem( geometry, particleMaterial );
	
	mesh.rotation.x = Math.PI/2;
	return mesh;
}
