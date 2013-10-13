UN.Star = function(params) {
	
	this.object3D = null;
	
	UN.SpaceObject.call( this );
	//this.init(params);
}

UN.Star.prototype = Object.create( UN.SpaceObject.prototype );

UN.Star.prototype.init = function() {
	
}

UN.Star.prototype.getObject3D = function() {
	var sphereMaterial = new THREE.MeshLambertMaterial({ color: 0xCC0000 });
	var radius = 50, segments = 16, rings = 16;
	this.object3D = new THREE.Mesh(
				  new THREE.SphereGeometry(
				    radius,
				    segments,
				    rings), sphereMaterial);
	
	return this.object3D;
}
