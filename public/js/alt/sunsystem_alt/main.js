var camera = null;
var devicePixelRatio = window.devicePixelRatio || 1;
var lastRotateY = 0;
var maxAniso = 0;
var renderer = null;
var rotateY = null;
var rotateYAccumulate = 0;
var rotatingObject = null;


var scene = null;
/*var screenWidth = window.innerWidth;
var screenHeight = window.innerHeight
var screenWhalf = window.innerWidth / 2;
var screenHhalf = window.innerHeight / 2;*/
var screenWidth = $('.col-main').width();
var screenHeight = 600;//$('.col-main').height();
var screenWhalf = screenWidth / 2;
var screenHhalf = screenHeight / 2;
var shaderTiming = 0;
var startTime = Date.now();
var sunsystem = null;


requirejs.config({
  	baseUrl: BASE_URL + 'public/js',
  	paths: {
    	//'domevent': 'lib/threex.domevent',
    	//'domevent.object3d': 'lib/threex.domevent.object3d',
    	//'THREEx.WindowResize' : 'lib/THREEx.WindowResize',
    	'UN' : 'UN',
    	'UN_SpaceObject' 	: 'UN.SpaceObject'
  	},
  	shim: {
    	//'domevent.object3d': [ 'domevent' ],
    	'UN_SpaceObject' : [ 'UN '],
    	'UN_Planet' : [ 'UN_SpaceObject' ]
  	},
  	urlArgs: "time=" + (new Date()).getTime()
});

require([
	"./helpers", 
	"UN",
	"UN_SpaceObject",
	"UN_SunSystem_Planet"
], function() {
	console.log(new UN.Planet());
});
/*	
require([	"THREEx.WindowResize",
			"CSS3DRenderer",
			"domevent",
			"domevent.object3d",
			"./helpers", 
			"./sunsystem/sun",
			"./sunsystem/planet",
			"./sunsystem/sunSystem",
			"./sunsystem/sunSystemRender", 
			"./lib/Detector"], function(helpers, sun, sunsystem, sunsystemrender, Detector) {
    $.sunSystemRender();
});
*/