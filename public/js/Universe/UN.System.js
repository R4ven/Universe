UN.System = function(params) {
	
	var _self = this;
	
	this.gyroStar = new THREE.Gyroscope();
	
	this.hoverMarker = null;
	
	this.object3D = new THREE.Object3D();
	
	this.preview = null;
	
	this.intensity = {
	    color: 0xFFFF99
	};
	
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
   	
   	var star = new THREE.Mesh( new THREE.PlaneGeometry( this.radius, this.radius ), new THREE.MeshBasicMaterial({
		map: UN.TEXTURES.STAR,
		blending: THREE.AdditiveBlending,
		depthTest: 		false,
		depthWrite: 	true,
		color: 0xffffff,
		transparent: true,
		opacity: 1
	}) );

	this.hoverMarker = this.getHoverMarker();
	this.gyroStar.add(star);
	this.gyroStar.add(this.hoverMarker);
	
	this.initEvents();
}

UN.System.prototype.getHoverMarker = function() {
	this.hoverMarker = new THREE.Gyroscope();
	
	var mesh = new THREE.Mesh( new THREE.PlaneGeometry( this.radius, this.radius ), new THREE.MeshBasicMaterial({
		map: UN.TEXTURES.STARHOVER,
		blending: THREE.AdditiveBlending,
		depthTest: 		false,
		depthWrite: 	true,
		color: 0xffffff,
		transparent: true,
		opacity: 0,
		//needsUpdate: true
	}) );
	
	/**
	 *text 
	 */
	var text3d = new THREE.TextGeometry( this.name, {
		size: 10, height: 0, curveSegments: 2,	font: "helvetiker"
	});
	
	text3d.computeBoundingBox();

	var textMaterial = new THREE.MeshBasicMaterial( { 
		blending: THREE.AdditiveBlending,
		depthTest: 		false,
		depthWrite: 	true,
		color: 0xffffff,
		transparent: true,
		opacity: 0, 
	} );
	
	var text = new THREE.Mesh( text3d, textMaterial );
		text.position.y = 0;
		text.position.x = 10;
	
	this.hoverMarker.text = text;
	this.hoverMarker.add(this.hoverMarker.text);
	
	this.hoverMarker.mesh = mesh;
	this.hoverMarker.add(this.hoverMarker.mesh);
	
	return this.hoverMarker;
	
}

UN.System.prototype.initEvents = function() {
	
	var _this = this;
	
	this.object3D.onHover = function(event) {

   		if(typeof _this.hoverMarker == "object") {
   			_this.hoverMarker.mesh.material.opacity = 1;
   			_this.hoverMarker.text.material.opacity = 1;
   			var s = Math.round(event.target.distance)/1000;
   			_this.hoverMarker.text.scale.set(s,s,s);
   		}
   	}
   	
   	this.object3D.onHoverOut = function() {
   		if(typeof _this.hoverMarker == "object") {
   			_this.hoverMarker.mesh.material.opacity = 0;
   			_this.hoverMarker.text.material.opacity = 0;
   		} 
   	}
}

UN.System.prototype.getObject3D = function() {	

	this.position = new THREE.Vector3(this.meshCoord.x, this.meshCoord.y, this.meshCoord.z);
	this.object3D.position = this.position;
	this.object3D.add(this.gyroStar);
	
	return this.object3D;
}