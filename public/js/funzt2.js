var UN = UN || { REVISION: '1' };

UN.devicePixelRatio = window.devicePixelRatio || 1;

UN.TOUCHMODES = {
	NONE : 0,
	SINGLE : 1,
	DOUBLE : 2,
}

UN.Scene = function(params) {
	
	this.params = params !== undefined ? params : null;
	
	this.containerId = 'glContainer';
	this.container;
	this.camera, this.scene, this.renderer;
	this.mouse = { x:0, y:0 };
	this.windowHalf = { x : window.innerWidth / 2, y : window.innerHeight / 2 };
	this.intensity = {
	    color: 0xFFFF99
	};
	this.rotationX = 1.55,
    this.rotationY = 0;
	this.size = 1;
	this.male;
	this.projector, this.raycaster;
	this.spheres = [];
	this.objects = [];
	
	this.init();
}

UN.Scene.prototype.init = function() {
	var _self = this;
	
    this.container = document.getElementById(this.containerId);
    
    this.camera = new THREE.PerspectiveCamera(45, this.container.offsetWidth / this.container.offsetHeight, 0.1, 10000);
    this.camera.position.z = 100;
   	
   	this.scene = new THREE.Scene();
    
    this.directionalLight = new THREE.DirectionalLight(0xffeedd);
    this.directionalLight.position.set(0, 0, 1);
    
    this.scene.add(this.directionalLight);

    this.directionalLight.position.set(0, 0, -1);
    this.scene.add(this.directionalLight);
    
    //var plane1 = new THREE.Mesh(new THREE.PlaneGeometry(100,100), new THREE.MeshBasicMaterial({color:0x898989}));
    
    var sphere = new THREE.Mesh(new THREE.SphereGeometry(2), new THREE.MeshLambertMaterial(this.intensity));
        //sphere.position.set(100,100,100);
        
    
    var plane = new THREE.Object3D();
    	plane.add(sphere);
    	
    this.scene.add(plane);
    this.objects.push(plane);

    this.renderer = new THREE.WebGLRenderer({
        antialias: true
    });

    this.renderer.setSize(this.container.offsetWidth, this.container.offsetHeight);
    this.container.appendChild(this.renderer.domElement);
    
    this.projector = new THREE.Projector();
    document.addEventListener('mousemove', function(e) { _self.onDocumentMouseMove(e, _self) }, true);
    //document.addEventListener('mousedown', this.onDocumentMouseDown, false);
    window.addEventListener('resize',  function(e) { _self.onWindowResize(e, _self) }, true);
    
    return {
    	animate: function() {
    		this.animate();
    	}
    }
}

UN.Scene.prototype.animate = function() {
    this.camera.lookAt(this.scene.position);
    this.renderer.render(this.scene, this.camera);
}

UN.Scene.prototype.onDocumentMouseMove = function(event, scope) {
    scope.mouse.x = event.clientX - $(scope.container).offset().left;
    scope.mouse.y = event.clientY - $(scope.container).offset().top;//(window.innerHeight-window.innerHeight * (scope.container.offsetHeight/window.innerHeight));
    document.getElementById('mousex').innerHTML = scope.mouse.x;
	document.getElementById('mousey').innerHTML = scope.mouse.y;
	
	//document.getElementById('mousex').innerHTML = (mouseX / container.offsetWidth )*2-1;
    var vector = new THREE.Vector3( ( scope.mouse.x / scope.container.offsetWidth )*2-1, - ( scope.mouse.y / scope.container.offsetHeight )*2+1, 0.5 );
    scope.projector.unprojectVector( vector, scope.camera );
   
    var raycaster = new THREE.Raycaster( scope.camera.position, vector.sub( scope.camera.position ).normalize() );
    var intersects = raycaster.intersectObjects( scope.objects , true);
    
    if ( intersects.length > 0 ){
    	console.log('test');
    }
}

UN.Scene.prototype.onWindowResize = function(event, scope) {	
    scope.camera.aspect = scope.container.offsetWidth / scope.container.offsetHeight;
    scope.camera.updateProjectionMatrix();

    scope.renderer.setSize(scope.container.offsetWidth, scope.container.offsetHeight);
    
}

var gala = new UN.Scene();
	animate();

function animate() {
	gala.animate();
    requestAnimationFrame(animate);
}

