var rotateYAccumulate = 0;
var devicePixelRatio = window.devicePixelRatio || 1;
var screenWidth = $('.col-main').width();
var screenHeight = 600;//$('.col-main').height();
var maxAniso = 0;
var startTime = Date.now();
var enableBackground = 0;

requirejs.config({
  	baseUrl: BASE_URL + 'public/js',
  	paths: {	
    	'UN_SpaceObject' 	: 'UN.SpaceObject',
    	'UN_Galaxy' : './galaxy/UN.Galaxy',
    	'UN_Galaxy_System' : './galaxy/UN.Galaxy.System',
    	'UN_Galaxy_GalaxyRenderer' : './galaxy/UN.Galaxy.GalaxyRenderer'
  	},
  	shim: {
    	'UN_SpaceObject' : [ 'UN'],
    	'UN_Galaxy' : [ 'UN_SpaceObject' ],
    	'UN_Galaxy_System' : [ 'UN_Galaxy' ],
    	'UN_Galaxy_GalaxyRenderer' : ['UN', 'UN_Galaxy_System', 'UN_Galaxy']
  	},
  	urlArgs: "time=" + (new Date()).getTime()
});

require([
	"./helpers", 
	"UN_Galaxy_GalaxyRenderer",
	"./lib/Detector"
], function() {
	init();
});
