var spaceScene = null;

requirejs.config({
  	baseUrl: BASE_URL + 'public/js',
  	paths: {	
  		'E' : './lib/threex.domevent',
  		'F' : './lib/threex.domevent.object3d',
  		'UN' : './Universe/Un',
  		'UN_Scene' : './Universe/UN.Scene',
  		'UN_SpaceScene' : './Universe/UN.SpaceScene',
  	},
  	shim: {
  		'F' : [ 'E' ],
    	'UN_SpaceObject' : [ 'UN'],
    	'UN_SpaceScene' : [ 'UN', 'UN_Scene', 'E', 'F' ],
  	},
  	urlArgs: "time=" + (new Date()).getTime()
});

require([
	"./helpers", 
	"./lib/Detector", "UN_SpaceScene"
], function() {
	spaceScene = new UN.SpaceScene('glContainer');
});