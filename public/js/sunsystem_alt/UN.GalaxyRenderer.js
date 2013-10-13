var screenWidth;
var screenHeight;
var spaceScene;

requirejs.config({
  	baseUrl: BASE_URL + 'public/js',
  	paths: {	
  		'UN' : './Universe/Un',
  		'UN_SpaceScene' : './Universe/UN.SpaceScene',
    	'UN_SpaceObject' : './Universe/UN.SpaceObject',
    	'UN_System' : './Universe/UN.System'
  	},
  	shim: {
    	'UN_SpaceObject' : [ 'UN'],
    	'UN_SpaceScene' : [ 'UN' ],
    	'UN_System' : [ 'UN_SpaceObject', 'UN_SpaceScene']
  	},
  	urlArgs: "time=" + (new Date()).getTime()
});

require([
	"./helpers", 
	"./lib/Detector", "UN_System"
], function() {
	
	screenWidth = $('.col-main').width();
	screenHeight = 600;
	
	spaceScene = new UN.SpaceScene({jsonUrl: jsonUrl}, function(data) {
		initGalaxy(data);
	});
});

function initGalaxy(data) {
	
	animate();
	spaceScene.container.appendChild( spaceScene.renderer.domElement );
	
	for(var i=0; i<data.length; i++) {
		var sys = data[i];
		
		console.log(sys);	
	}
	/*
	//sun
	var sun = new UN.Sun({radius: 60, parent: spaceScene});
		sun.render();
	spaceScene.object3D.add(sun.getObject3D());
	
	//planets
	for(var i=0; i<data.planets.length; i++) {
		
		var s = data.planets[i];
		
		var planet = new UN.Planet(s);
			planet.render();
			
		var pObject3D = planet.getObject3D();
			
			spaceScene.object3D.add(pObject3D);	//add Planet
			
			spaceScene.object3D.add(sun.getSunSpotLight(pObject3D)); //SpotLight hinzufügen
			
			spaceScene.object3D.add(planet.getBaseLine()); //Baseline hinzufügen
			
			spaceScene.object3D.add(planet.getBasePoint()); //Basepoint hinzufügen
			
			spaceScene.object3D.add(planet.getRadiusLine()); //Radiuslinie hinzufügen
	}*/
}

function animate() {
	
	render();
	
	spaceScene.animate();
	
  	requestAnimationFrame( animate );
}

function render() {
	spaceScene.render();
}
