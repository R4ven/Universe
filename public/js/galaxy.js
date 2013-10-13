var galaScene, background, hoverObject;

requirejs.config({
  	baseUrl: BASE_URL + 'public/js/',
  	paths: {	
  		'UN' : './Universe/Un',
  		'UN_Event' : './Universe/UN.Event',
  		'UN_Scene' : './Universe/UN.Scene',
  		'UN_SpaceScene' : './Universe/UN.SpaceScene',
  		'UN_System' : './Universe/UN.System',
  		'UN_SpaceObject' : './Universe/UN.SpaceObject',
  		'FONT_HELV' : '../fonts/helvetiker_regular.typeface'
  	},
  	shim: {
  		'UN_Event' : ['UN'],
    	'UN_Scene' : [ 'UN', 'UN_Event'],
    	'UN_SpaceObject' : [ 'UN' ],
    	'UN_System' : [ 'UN_SpaceObject' ],
    	'UN_SpaceScene' : [ 'UN_Scene', 'UN_SpaceObject', 'UN_System','FONT_HELV'],
  	},
  	urlArgs: "time=" + (new Date()).getTime()
});

require([
	"./helpers", 
	"./lib/Detector", "UN_SpaceScene"
], function() {
	
	galaScene = new UN.SpaceScene();
	
	loadShaders( shaderList, function(e){
		shaderList = e;
		loadJSon( jsonUrl , function(loadedData){
			startScene(loadedData);
			animate();
		});
	});	
	
	galaScene.addListener("mouseOverObject" , function(event) {

		if(typeof hoverObject == "object") {
			if(typeof hoverObject.onHoverOut == "function") hoverObject.onHoverOut();
		}
		hoverObject = event.target.object.parent.parent;
		if(typeof hoverObject.onHover == "function") hoverObject.onHover(event)
	});
	
	galaScene.addListener("noMouseHover", function() {
		if(typeof hoverObject == "object") {
			if(typeof hoverObject.onHoverOut == "function") hoverObject.onHoverOut();
			hoverObject = undefined;
		}
	});
	
	galaScene.addListener("mouseClickObject" , function(mesh) {
		//alert(mesh);
	});
	galaScene.addListener("animate", function() {
		if( galaScene.initialAutoRotate )
			galaScene.rotate.vy = 0.0015;
		
		galaScene.object3D.rotation.x = galaScene.rotate.x;
		galaScene.object3D.rotation.y = galaScene.rotate.y;
	
		galaScene.object3D.traverse(function(mesh) {
			if( mesh.update !== undefined ) {
				mesh.update();
			}
		});
	    galaScene.camera.lookAt(this.scene.position);
	   	
	});
		
	galaScene.addListener("onMouseWheel" , function(delta) {
		if(galaScene.camera.position.target.z > 2000) {
			galaScene.camera.position.target.z = 2000;
		}
		
		if(galaScene.camera.position.target.z < 500) {
			galaScene.camera.position.target.z = 500;
		}
	});

});

function startScene(systems) {
	var _this = this;
	var object3D  = new THREE.Object3D();
	
	galaScene.background = galaScene.getBackground();

	//Dust
	object3D.add(galaScene.getDust());

	object3D.add(galaScene.getSpacePlane(galaScene.camera));
	object3D.add(galaScene.getCoordLines());

    for(var i=0; i < systems.length; i++) {
    	
		var systemdata = systems[i];
			//Math.floor(Math.random() * (max - min + 1)) + min;
			systemdata.radius = Math.floor(Math.random() * (40 - 20 + 1)) + 20;

		var system = new UN.System(systemdata);
		var mesh = system.getObject3D();	
						
		//var line = system.getBaseLine();
		//var point = system.getBasePoint();
		//var radiusline = system.getRadiusLine();

		object3D.add(mesh);
		//object3D.add(line);
		//object3D.add(point);
		//object3D.add(radiusline);
		
		galaScene.objects.push(mesh);		
	}
	
	galaScene.object3D = object3D;
	galaScene.scene.add(galaScene.object3D);
	
}
	

function animate() {
	galaScene.animate();
    requestAnimationFrame(animate);
}

