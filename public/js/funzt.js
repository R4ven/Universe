var container, stats;
var camera, scene, renderer;
var mouseX = 0,
    mouseY = 0;
var rotationX = 1.55,
    rotationY = 0;
var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;
var intensity = {
    color: 0xFFFF99
};
var size = 1;
var male;
var projector, raycaster;
var spheres = [];
var objects = [];

function init() {
    container = document.getElementById('glContainer');
    camera = new THREE.PerspectiveCamera(45, container.offsetWidth / container.offsetHeight, 1, 1000);
    camera.position.z = 10;
    scene = new THREE.Scene();
    
    var directionalLight = new THREE.DirectionalLight(0xffeedd);
    directionalLight.position.set(0, 0, 1);
    scene.add(directionalLight);

    directionalLight.position.set(0, 0, -1);
    scene.add(directionalLight);
    
    //var plane1 = new THREE.Mesh(new THREE.PlaneGeometry(100,100), new THREE.MeshBasicMaterial({color:0x898989}));
    
    var sphere = new THREE.Mesh(new THREE.SphereGeometry(2), new THREE.MeshLambertMaterial(intensity));
        //sphere.position.set(100,100,100);
        
    
    var plane = new THREE.Object3D();
    	//plane.add(plane1);
    	plane.add(sphere);
    	
    scene.add(plane);
    objects.push(plane);

    renderer = new THREE.WebGLRenderer({
        antialias: true
    });

    renderer.setSize(container.offsetWidth, container.offsetHeight);
    container.appendChild(renderer.domElement);
    
    projector = new THREE.Projector();
    document.addEventListener('mousemove', onDocumentMouseMove, false);
    document.addEventListener('mousedown', onDocumentMouseDown, false);
    window.addEventListener('resize', onWindowResize, false);
}

function onWindowResize() {
    camera.aspect = container.offsetWidth / container.offsetHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(container.offsetWidth, container.offsetHeight);
}

function onDocumentMouseMove(event) {
    mouseX = event.clientX - $(container).offset().left;
    mouseY = event.clientY - (window.innerHeight-window.innerHeight * (container.offsetHeight/window.height));
    document.getElementById('mousex').innerHTML = mouseX;
	document.getElementById('mousey').innerHTML = mouseY;
	
	//document.getElementById('mousex').innerHTML = (mouseX / container.offsetWidth )*2-1;
    var vector = new THREE.Vector3( ( mouseX / container.offsetWidth )*2-1, - ( mouseY / container.offsetHeight )*2+1, 0.5 );
    projector.unprojectVector( vector, camera );
   
    var raycaster = new THREE.Raycaster( camera.position, vector.sub( camera.position ).normalize() );
    var intersects = raycaster.intersectObjects( objects , true);
    
    if ( intersects.length > 0 ){
    	console.log('test');
       /*var sphere = new THREE.Mesh(new THREE.SphereGeometry(size / 4), new THREE.MeshLambertMaterial(intensity));
        sphere.position = intersects[ 0 ].point;
        console.log(intersects[0].point);
        scene.add(sphere);*/
    }//end of if
}

function onDocumentMouseDown(event) {
    event.preventDefault();
    
    //document.getElementById('mousex').innerHTML = (mouseX / container.offsetWidth )*2-1;
    var vector = new THREE.Vector3( ( mouseX / container.offsetWidth )*2-1, - ( mouseY / container.offsetHeight )*2+1, 0.5 );
    projector.unprojectVector( vector, camera );
   
    var raycaster = new THREE.Raycaster( camera.position, vector.sub( camera.position ).normalize() );
    var intersects = raycaster.intersectObjects( objects , true);
    
    if ( intersects.length > 0 ){
    	alert('test');
       /*var sphere = new THREE.Mesh(new THREE.SphereGeometry(size / 4), new THREE.MeshLambertMaterial(intensity));
        sphere.position = intersects[ 0 ].point;
        console.log(intersects[0].point);
        scene.add(sphere);*/
    }//end of if
}

function animate() {
    requestAnimationFrame(animate);
    render();
}

function render() {
    camera.position.x = 30 * Math.cos(rotationY) * Math.cos(rotationX);
    camera.position.y = 30 * Math.sin(rotationY);
    camera.position.z = 30 * Math.cos(rotationY) * Math.sin(rotationX);
    camera.lookAt(scene.position);
    renderer.render(scene, camera);
}

init();
    animate();