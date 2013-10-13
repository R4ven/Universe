UN.Planet = function(params) {
	
	this.object3D = null;
	this.factor = 20;
	
	this.params = params !== undefined ? params : null;
	
	UN.SpaceObject.call( this );	
	
	this.showBaseLine = true;
	this.showBasePoint = true;
}

UN.Planet.prototype = Object.create( UN.SpaceObject.prototype );

UN.Planet.prototype.init = function() {

	for (var prop in this.params) {
      	if(this.hasOwnProperty(prop)){
        	this[prop] = this.params[prop];
      	}
   	}
}

UN.Planet.prototype.render = function() {
	
	if(typeof this.params.systemCoord == "object")	{
		this.meshCoord.x = (params.systemCoord.x - this.coord.x) * this.factor;
		this.meshCoord.y = (params.systemCoord.y - this.coord.y) * this.factor;
		this.meshCoord.z = (params.systemCoord.z - this.coord.z) * this.factor;
	}
	
	if(typeof this.meshCoord == "object")	{
		this.meshCoord.x = this.meshCoord.x * this.factor;
		this.meshCoord.y = this.meshCoord.y * this.factor;
		this.meshCoord.z = this.meshCoord.z * this.factor;
	}
   	
   	this.position = new THREE.Vector3(this.meshCoord.x, this.meshCoord.y, this.meshCoord.z);
   	this.geometry = new THREE.SphereGeometry(this.radius, 50, 50);
	this.geometry.computeTangents();	
	this.material = this.getMaterial(2);
	
	this.planetMesh 		= new THREE.Mesh(this.geometry, this.material);    
	this.planetMesh.uid 	= this.id;
	this.planetMesh.rotation.z = 0.0001;
	this.planetMesh.castShadow = true;
	this.planetMesh.receiveShadow = true;
	this.planetMesh.renderDepth = true;
	
	this.object3D.position = this.position;
	this.object3D.visible = true;
	this.object3D.add(this.planetMesh);
}

UN.Planet.prototype.getMaterial = function( type ) {
	var planetTexture = THREE.ImageUtils.loadTexture(TEXTUREPATH+"earth_atmos_2048.jpg");
	var map = null;
	switch(type) {
		case 1:	map = THREE.ImageUtils.loadTexture(TEXTUREPATH+"shuixing.jpg"); break;
		case 2:	
		default: map = planetTexture; break;
		}
			
	return material = new THREE.MeshPhongMaterial({ color: 0x000000, 
													ambient: 0xffffff,
													map: map,
													transparent: false,
        											depthWrite: true });
}

UN.Planet.prototype.getObject3D = function() {
	return this.object3D;
}
