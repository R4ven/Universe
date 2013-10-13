UN.System = function(params) {
	
	this.object3D = null;
	
	this.preview = null;
	
	this.params = params !== undefined ? params : null;
	
	UN.SpaceObject.call( this );
	
}

UN.System.prototype = Object.create( UN.SpaceObject.prototype );

UN.System.prototype.init = function() {
	
	for (var prop in this.params) {
      	if(this.hasOwnProperty(prop)){
        	this[prop] = this.params[prop];
      	}
   	}
}

UN.System.prototype.getObject3D = function() {
	var _this = this;
	/*
	this.starTexture = THREE.ImageUtils.loadTexture( TEXTUREPATH+'star_preview.png');
	this.material = new THREE.MeshBasicMaterial({
		map: this.starTexture,
		blending: THREE.AdditiveBlending,
		depthTest: 		true,
		depthWrite: 	true,
		color: 0x333333,
		transparent: true,
		polygonOffset: true,
		polygonOffsetFactor: 1,
		polygonOffsetUnits: 100,
		opacity: 1
	});
	
	var star = new THREE.Mesh( new THREE.PlaneGeometry( 40, 40 ), this.material );
	star = star.clone( star );
	*/
	var gyroStar = new THREE.Gyroscope();
		gyroStar.add(this.preview);

	this.object3D.add(gyroStar);

	this.position = new THREE.Vector3(this.meshCoord.x, this.meshCoord.y, this.meshCoord.z);
	this.object3D.position = this.position;
	
	this.preview.update = function() {
		
		this.material.opacity = constrain( Math.pow(_this.parent.getCamera().position.z * 0.002,2), 0, 1);
		//console.log(_this.material.opacity);
		if( this.material.opacity < 0.1 )
			this.material.opacity = 0.0;
		if( this.material <= 0.0 )
			this.visibile = false;
		else
			this.visible = true;
	}
	
	return this.object3D;
}

