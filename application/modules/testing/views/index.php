<script src="http://mrdoob.github.io/three.js/build/three.min.js"></script>

    <div id="model-space"></div>
<script>
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

window.onload = function () {
    init();
    animate();
};


function init() {
    container = document.getElementById('model-space');
    camera = new THREE.PerspectiveCamera(45, container.offsetWidth / container.offsetHeight, 1, 1000);
    camera.position.z = 10;
    scene = new THREE.Scene();
    
    var directionalLight = new THREE.DirectionalLight(0xffeedd);
    directionalLight.position.set(0, 0, 1);
    scene.add(directionalLight);

    directionalLight.position.set(0, 0, -1);
    scene.add(directionalLight);
    
    
    var plane = new THREE.Mesh(new THREE.PlaneGeometry(100,100), new THREE.MeshBasicMaterial({color:0x898989}));
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
    mouseX = event.clientX - (window.innerWidth * 0.5)
    mouseY = event.clientY - (window.innerHeight-window.innerHeight * 0.875);

}

function onDocumentMouseDown(event) {
    event.preventDefault();
    var vector = new THREE.Vector3( ( mouseX / container.offsetWidth )*2-1, - ( mouseY / container.offsetHeight )*2+1, 0.5 );
    projector.unprojectVector( vector, camera );
   
    var raycaster = new THREE.Raycaster( camera.position, vector.sub( camera.position ).normalize() );
    var intersects = raycaster.intersectObjects( objects );
    
    if ( intersects.length > 0 ){
        var sphere = new THREE.Mesh(new THREE.SphereGeometry(size / 4), new THREE.MeshLambertMaterial(intensity));
        sphere.position = intersects[ 0 ].point;
        scene.add(sphere);
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
	
</script>
