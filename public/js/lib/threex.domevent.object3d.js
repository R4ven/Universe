/********************************************************************************/
// # Patch THREE.Object3D
/********************************************************************************/

// handle noConflit.
THREEx.DomEvent.noConflict	= function(){
	THREEx.DomEvent.noConflict.symbols.forEach(function(symbol){
		THREE.Object3D.prototype[symbol]	= THREEx.DomEvent.noConflict.previous[symbol]
	})
}
// Backup previous values to restore them later if needed.
THREEx.DomEvent.noConflict.symbols	= ['on', 'off', 'addEventListener', 'removeEventListener'];
THREEx.DomEvent.noConflict.previous	= {};
THREEx.DomEvent.noConflict.symbols.forEach(function(symbol){
	THREEx.DomEvent.noConflict.previous[symbol]	= THREE.Object3D.prototype[symbol]
})

// begin the actual patching of THREE.Object3D

// create the global instance of THREEx.DomEvent
THREE.Object3D._threexDomEvent	= new THREEx.DomEvent();

// # wrap mouseevents.bind()
THREE.Object3D.prototype.on	=
THREE.Object3D.prototype.addEventListener = function(eventName, callback){
	THREE.Object3D._threexDomEvent.bind(this, eventName, callback);
	return this;
}

// # wrap mouseevents.unbind()
THREE.Object3D.prototype.off	=
THREE.Object3D.prototype.removeEventListener	= function(eventName, callback){
	THREE.Object3D._threexDomEvent.unbind(this, eventName, callback);
	return this;
}


THREE.Object3D.prototype.mouseover = function (callback) { this.on("mouseover", callback); }
THREE.Object3D.prototype.mouseout  = function (callback) { this.on("mouseout", callback); }
THREE.Object3D.prototype.mouseup   = function (callback) { this.on("mouseup", callback); }
THREE.Object3D.prototype.mousedown = function (callback) { this.on("mousedown", callback); }
THREE.Object3D.prototype.click     = function (callback) { this.on("click", callback); }
THREE.Object3D.prototype.dblclick  = function (callback) { this.on("dblclick", callback); }