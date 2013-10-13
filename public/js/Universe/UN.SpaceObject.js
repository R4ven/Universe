UN.SpaceObject = function(params) {
	
	var _self = this;
	
	UN.EventTarget.call(this);
		
	this.object3D = new THREE.Object3D();
	
	this.id = 0;
	this.name = "unknown";
	this.radius = 60;
	this.coord = { x: 0, y: 0, z: 0 };
	this.meshCoord = { x: 0, y: 0, z: 0 };
	this.parent = null;
	
	this.animation = {
		rotation : {
			x: 0, y: 0.0003, z: 0
		}
	}
		
	this.init();
}

//	-----------------------------------------------------------------------------
//	attach lines from star to plane base
UN.SpaceObject.prototype.getBaseLine = function() {
	var _self = this;
	var position = this.position;
	
	var base = position.clone();
		base.y = 0

	var pLineGeo = new THREE.Geometry();
		pLineGeo.vertices.push( position.clone() );
		pLineGeo.vertices.push( base );
	
	var lineMesh = new THREE.Line( pLineGeo, new THREE.LineBasicMaterial({
		color: 			0x333333,
		blending: 		THREE.AdditiveBlending,
		depthTest: 		false,
		depthWrite: 	true,
		transparent:	false,

	}), THREE.LinePieces );
	
	lineMesh.update = function() {		
		if(typeof _self.showBaseLine == "undefined" || _self.showBaseLine == true) {
			this.visible = true;
		} else {
			this.visible = false;
		}
	}
	return lineMesh;
}

UN.SpaceObject.prototype.getBasePoint = function() {
	var _self = this;
	
	var starBaseTexture = THREE.ImageUtils.loadTexture( TEXTUREPATH+'starbase.png');
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
		
	mesh.update = function() {		
		if(typeof _self.showBasePoint == "undefined" || _self.showBasePoint == true) {
			this.visible = true;
			this.rotation.y += 0.003;
		} else {
			this.visible = false;
		}
	}
	return mesh;
}

UN.SpaceObject.prototype.getRadiusLine = function() {
	var guidePointTexture = THREE.ImageUtils.loadTexture( TEXTUREPATH+"p_1.png" );
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
			depthWrite: true,
		} 
	);

	var mesh = new THREE.ParticleSystem( geometry, particleMaterial );
	
	mesh.rotation.x = Math.PI/2;
	return mesh;
}

