UN.Galaxy = function(params) {
	
	UN.SpaceObject.call( this );

	this.params = params;
	
	this.init();
}

var legacyMarkers = [];

UN.Galaxy.prototype = Object.create( UN.SpaceObject.prototype );

UN.Galaxy.shaderTiming