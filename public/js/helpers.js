(function($){var types=['DOMMouseScroll','mousewheel'];if($.event.fixHooks){for(var i=types.length;i;){$.event.fixHooks[types[--i]]=$.event.mouseHooks;}}
$.event.special.mousewheel={setup:function(){if(this.addEventListener){for(var i=types.length;i;){this.addEventListener(types[--i],handler,false);}}else{this.onmousewheel=handler;}},teardown:function(){if(this.removeEventListener){for(var i=types.length;i;){this.removeEventListener(types[--i],handler,false);}}else{this.onmousewheel=null;}}};$.fn.extend({mousewheel:function(fn){return fn?this.bind("mousewheel",fn):this.trigger("mousewheel");},unmousewheel:function(fn){return this.unbind("mousewheel",fn);}});function handler(event){var orgEvent=event||window.event,args=[].slice.call(arguments,1),delta=0,returnValue=true,deltaX=0,deltaY=0;event=$.event.fix(orgEvent);event.type="mousewheel";if(orgEvent.wheelDelta){delta=orgEvent.wheelDelta/120;}
if(orgEvent.detail){delta=-orgEvent.detail/3;}
deltaY=delta;if(orgEvent.axis!==undefined&&orgEvent.axis===orgEvent.HORIZONTAL_AXIS){deltaY=0;deltaX=-1*delta;}
if(orgEvent.wheelDeltaY!==undefined){deltaY=orgEvent.wheelDeltaY/120;}
if(orgEvent.wheelDeltaX!==undefined){deltaX=-1*orgEvent.wheelDeltaX/120;}
args.unshift(event,delta,deltaX,deltaY);return($.event.dispatch||$.event.handle).apply(this,args);}})(jQuery);

$(document).on('contextmenu', function(e) {
  	if ($(e.target).hasClass("noContextMenu"))
   		return false;
});

var loadJSon = function( dataFile, callback ){
	var xhr = new XMLHttpRequest();
	xhr.addEventListener( 'load', function ( event ) {
		var parsed = JSON.parse( xhr.responseText );
		if( callback ){		
			callback(parsed);			
		}
	}, false );
	xhr.open( 'GET', dataFile, true );
	xhr.send( null );
}

function loadImage(url, callback) {
	var image = document.createElement('img');
		image.onload = callback(image);
		image.src = url;	
}
/**
 * loadShaders 
 */
var loadShaders = function ( list, callback ) {
	var shaders = {};	

	var expectedFiles = list.length * 2;
	var loadedFiles = 0;

	function makeCallback( name, type ){
		return function(data){
			if( shaders[name] === undefined ){
				shaders[name] = {};
			}
			
			shaders[name][type] = data;

			//	check if done
			loadedFiles++;
			if( loadedFiles == expectedFiles ){				
				callback( shaders );
			}

		};
	}
	
	for( var i=0; i<list.length; i++ ){
		var vertexShaderFile = list[i] + '.vsh';
		var fragmentShaderFile = list[i] + '.fsh';	

		//	find the filename, use it as the identifier	
		var splitted = list[i].split('/');
		var shaderName = splitted[splitted.length-1];
		$(document).load( vertexShaderFile, makeCallback(shaderName, 'vertex') );
		$(document).load( fragmentShaderFile,  makeCallback(shaderName, 'fragment') );
	}
}

function map(v, i1, i2, o1, o2) {
   return o1 + (o2 - o1) * (v - i1) / (i2 - i1);
}

function constrain(v, min, max) {
	if( v < min )
    	v = min;
  	else
  		if( v > max )
    		v = max;
 	return v;
}

function random(low, high) {
  	if (low >= high) return low;
  	var diff = high - low;
  	return (Math.random() * diff) + low;
}

function screenXY(vec3, obj){
	var projector = new THREE.Projector();
	var vector = projector.projectVector( vec3.clone(), obj.getCamera() );
	var result = new Object();
    var windowWidth = obj.screenWidth;
	var windowHeight = obj.screenHeight;
	
	var w = windowWidth/2;
		h = windowHeight/2;
	/*
	result.x = Math.round( vector.x * (windowWidth/2) ) + windowWidth/2;
	result.y = Math.round( (0-vector.y) * (window.innerHeight/2) ) + window.innerHeight/2;
	 */
	result.x = w + Math.round( vector.x * (windowWidth/2) ); //Math.round( vector.x * (w) ) + (w);
	result.y = h + Math.round( 0-vector.y * (windowHeight/2) ); // Math.round( (0-vector.y) * (window.innerHeight/2) ) + window.innerHeight/2;
	//console.log(vector.x);
	return result;
}	

function attachMarker(obj, markerClass ){
	markerClass = markerClass !== undefined ? markerClass : 'namemarker';
	var template = document.getElementById( markerClass );
	var marker = template.cloneNode(true);
		marker.obj = obj.getObject3D();
		marker.objClass = obj;
		marker.absPosition = obj.getObject3D().position;

		marker.size = typeof size != "undefined" ? size : 3.0;
	
		marker.$ = $(marker);	// jQuery reference	
		marker.$.attr('data-id', marker.objClass.id);
		marker.$.obj = obj;

	var container = document.getElementById('visualization');
		container.appendChild( marker );

	marker.setVisible = function ( vis ){
		if (vis) {
			this.style.opacity = 1.0;
		} else {
			this.style.opacity = 0.0;
		}

		if( vis )
			this.style.visibility = 'visible';
		else
			this.style.visibility = 'hidden';
		return this;
	};

	marker.setPosition = function(x,y){
		//x -= this.markerWidth * 0.25;
		this.style.left = x + 'px';
		this.style.top = parseInt(y) + 'px';	
	};

	var nameLayer = marker.children[0];
	marker.nameLayer = nameLayer;
	if(typeof marker.objClass.name == "string")
		nameLayer.innerHTML = marker.objClass.name;
	else
		nameLayer.innerHTML = 'unknown';
		
	marker.markerWidth = marker.$.outerWidth();
	var i = 0;
	marker.zero = new THREE.Vector3();
	return marker;
}