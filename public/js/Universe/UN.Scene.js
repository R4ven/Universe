UN.Scene = function(params) {
	
	UN.EventTarget.call(this);
	
	this.params = params !== undefined ? params : null;
	
	this.containerId = 'glContainer';
	this.container;
	this.camera, this.scene, this.renderer;
	this.mouse = { x:0, y:0 };
	this.pmouse = { x:0, y:0 };
	this.press = { x:0, y:0 };
	this.rotateTarget = { x:0, y:0 };
	this.rotate = { x: 0.4, y:0.9, vy: 0, vx: 0 };
	this.initialAutoRotate = true;
	
	this.windowHalf = { x : window.innerWidth / 2, y : window.innerHeight / 2 };
	this.intensity = {
	    color: 0xFFFF99
	};
	this.rotationX = 1.55,
    this.rotationY = 0;
	this.size = 1;
	this.male;
	this.projector, this.raycaster;
	this.objects = [];
	
	this.init();
}

UN.Scene.prototype = new UN.EventTarget();

UN.Scene.prototype.init = function() {
	var _self = this;
	
    this.container = document.getElementById(this.containerId);
       	   	
   	this.scene = new THREE.Scene();
    
    this.directionalLight = new THREE.DirectionalLight(0xffeedd);
    this.directionalLight.position.set(0, 0, 1);
    
    this.scene.add(this.directionalLight);

    this.directionalLight.position.set(0, 0, -1);
    this.scene.add(this.directionalLight);
    
    // camera
    this.camera = new THREE.PerspectiveCamera( 45, this.container.offsetWidth / this.container.offsetHeight, 0.1, 10000 );
	this.camera.position.z = 500;
	this.camera.rotation.x = 0;
	this.camera.rotation.y = 0;
	this.camera.position.target = { x: 100, z: 1000, y: 0};
	this.camera.rotation.vx = 0;
	this.camera.rotation.vy = 0;
			
	this.camera.update = function(){
		if( _self.easeZooming ) return;
		_self.camera.position.z += (_self.camera.position.target.z - _self.camera.position.z) * 0.125;	
		
	};
	
	//renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
	this.renderer.setSize(this.container.offsetWidth * UN.devicePixelRatio, this.container.offsetHeight * UN.devicePixelRatio);
	this.renderer.domElement.style.width = this.container.offsetWidth + 'px';
	this.renderer.domElement.style.height = this.container.offsetHeight + 'px';
	this.renderer.setClearColor( 0x000000, 1 );
	//this.renderer.setClearColor( 0x666666, 0 );
	this.renderer.autoClear = false;
	this.renderer.sortObjects = false;
	this.renderer.generateMipmaps = false;
	this.renderer.shadowMapEnabled = false;

    this.container.appendChild(this.renderer.domElement);
    
    $(this.container).find('canvas').addClass('noContextMenu');
    
    this.projector = new THREE.Projector();
    
    //events
    this.container.addEventListener( 'mousemove', function(e) { _self.onSceneMouseMove(e, _self) }, true);
    this.container.addEventListener( 'mousedown', function(e) { _self.onSceneMouseDown(e, _self) }, true);
    this.container.addEventListener( 'mousewheel', function(e) { _self.onMouseWheel(e, _self) }, true);
    window.addEventListener('resize',  function(e) { _self.onWindowResize(e, _self) }, true);
    window.addEventListener('mouseup',  function(e) { _self.onDocumentMouseUp(e, _self) }, true);
    
    return {
    	animate: function() {
    		this.animate();
    	}
    }
}

UN.Scene.prototype.animate = function() {
	this.camera.update();
	this.camera.updateMatrix(); 
	
	this.rotate.x += this.rotate.vx;
	this.rotate.y += this.rotate.vy;
	
	this.rotate.vx *= 0.9;
	this.rotate.vy *= 0.9;

	if (this.dragging ){
		this.rotate.vx *= 0.6;
		this.rotate.vy *= 0.6;
	}
	
	this.fire({type: 'animate' });
	
    this.render();
}

UN.Scene.prototype.render = function() {
	this.renderer.clear();
	this.renderer.render(this.scene, this.camera);
}

UN.Scene.prototype.onMouseWheel = function(event, scope) {
	var delta = 0;
	if (event.wheelDelta) {
		delta = event.wheelDelta / 120;
	} else if (event.detail) {
		delta = -event.detail / 3;
	}

	if (delta) {
		
		scope.camera.position.target.z += delta * scope.camera.position.target.z * 0.05;
		scope.camera.position.target.pz = scope.camera.position.target.z;
		scope.camera.rotation.vx += (-0.0001 + Math.random() * 0.0002) * scope.camera.position.z / 1000;
		scope.camera.rotation.vy += (-0.0001 + Math.random() * 0.0002) * scope.camera.position.z / 1000;
		if (scope.initialAutoRotate) {
			scope.initialAutoRotate = false;
		}
		scope.fire({type: 'onMouseWheel', delta: delta});
	}
		
	event.returnValue = false;
}

UN.Scene.prototype.onSceneMouseMove = function(event, scope) {
	
	scope.pmouse.x = scope.mouse.x;
	scope.pmouse.y = scope.mouse.y;
	
    scope.mouse.x = event.clientX - $(scope.container).offset().left;
    scope.mouse.y = event.clientY - $(scope.container).offset().top;//(window.innerHeight-window.innerHeight * (scope.container.offsetHeight/window.innerHeight));
    document.getElementById('mousex').innerHTML = scope.mouse.x;
	document.getElementById('mousey').innerHTML = scope.mouse.y;

	if (scope.dragging) {
		scope.doCameraRotationFromInteraction();
	} else {
		var vector = new THREE.Vector3( ( scope.mouse.x / scope.container.offsetWidth )*2-1, - ( scope.mouse.y / scope.container.offsetHeight )*2+1, 0.5 );
	    scope.projector.unprojectVector( vector, scope.camera );
	   
	    var raycaster = new THREE.Raycaster( scope.camera.position, vector.sub( scope.camera.position ).normalize() );
	    var intersects = raycaster.intersectObjects( scope.objects , true);
	    
	    if ( intersects.length > 0 ){
	    	scope.fire({type: 'mouseOverObject', target: intersects[0]});
	    } else {
	    	scope.fire({ type: 'noMouseHover' });
	    }
	}
    
}

UN.Scene.prototype.onDocumentMouseUp = function(event, scope) {
	scope.dragging = false;
}

UN.Scene.prototype.onSceneMouseDown = function(event, scope) {
		
	switch(event.button) {
		case 0:
		default:
			var vector = new THREE.Vector3( ( scope.mouse.x / scope.container.offsetWidth )*2-1, - ( scope.mouse.y / scope.container.offsetHeight )*2+1, 0.5 );
		    scope.projector.unprojectVector( vector, scope.camera );
		   
		    var raycaster = new THREE.Raycaster( scope.camera.position, vector.sub( scope.camera.position ).normalize() );
		    var intersects = raycaster.intersectObjects( scope.objects , true);
		    
		    if ( intersects.length > 0 ){
		    	scope.fire({type: 'mouseClickObject', target: intersects[0]});
		    }
		break;
		
		case 2: //right mouse*/
			scope.dragging = true;
			scope.press.x = scope.mouse.x;
			scope.press.y = scope.mouse.y;
			scope.rotateTarget.x = undefined;
			scope.rotateTarget.y = undefined;
			if (scope.initialAutoRotate) {
				scope.initialAutoRotate = false;
			}
		break;
	}	
    
}

UN.Scene.prototype.onWindowResize = function(event, scope) {	
    scope.camera.aspect = scope.container.offsetWidth / scope.container.offsetHeight;
    scope.camera.updateProjectionMatrix();

    scope.renderer.setSize(scope.container.offsetWidth, scope.container.offsetHeight);
    
}

UN.Scene.prototype.doCameraRotationFromInteraction = function() {
	this.rotate.vy += (this.mouse.x - this.pmouse.x) / 2 * Math.PI / 180 * 0.2;
	this.rotate.vx += (this.mouse.y - this.pmouse.y) / 2 * Math.PI / 180 * 0.2;
	this.camera.rotation.vy += (this.mouse.x - this.pmouse.x) * 0.00005 * this.camera.position.z;
	this.camera.rotation.vx += (this.mouse.y - this.pmouse.y) * 0.00005 * this.camera.position.z;
}