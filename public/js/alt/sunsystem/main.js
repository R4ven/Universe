/*var camera = null;

var lastRotateY = 0;
var renderer = null;
var rotateY = null;
var rotatingObject = null;*/

var rotateYAccumulate = 0;
var devicePixelRatio = window.devicePixelRatio || 1;
var screenWidth = $('.col-main').width();
var screenHeight = 600;//$('.col-main').height();
var maxAniso = 0;
var startTime = Date.now();
/*
var scene = null;
var screenWidth = window.innerWidth;
var screenHeight = window.innerHeight
var screenWhalf = window.innerWidth / 2;
var screenHhalf = window.innerHeight / 2;*/
/*
var screenWhalf = screenWidth / 2;
var screenHhalf = screenHeight / 2;
var shaderTiming = 0;
var sunsystem = null;*/


requirejs.config({
  	baseUrl: BASE_URL + 'public/js',
  	paths: {
  		
    	'UN_SpaceObject' 	: 'UN.SpaceObject',
    	'UN_SunSystem' : './sunsystem/UN.SunSystem',
    	'UN_SunSystem_Sun' : './sunsystem/UN.SunSystem.Sun',
    	'UN_SunSystem_Planet' : './sunsystem/UN.SunSystem.Planet',
    	'UN_SunSystem_SunSystemRenderer' : './sunsystem/UN.SunSystem.SunSystemRenderer'
  	},
  	shim: {
    	'UN_SpaceObject' : [ 'UN'],
    	'UN_SunSystem' : [ 'UN_SpaceObject' ],
    	'UN_SunSystem_Planet' : [ 'UN_SunSystem' ],
    	'UN_SunSystem_Sun' : [ 'UN_SunSystem' ],
    	'UN_SunSystem_SunSystemRenderer' : ['UN', 'UN_SunSystem_Planet', 'UN_SunSystem', 'UN_SunSystem_Sun']
  	},
  	urlArgs: "time=" + (new Date()).getTime()
});

require([
	"./helpers", 
	"UN_SunSystem_SunSystemRenderer",
	"./lib/Detector"
], function() {
	$.sunSystemRender();
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