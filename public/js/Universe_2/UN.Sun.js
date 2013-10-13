UN.Sun = function(params) {
	
	this.params = params !== undefined ? params : null;
	
	UN.SpaceObject.call( this );
	
	this.gyro = new THREE.Gyroscope();
	
	this.maxAniso = 16;

	//Textures
	this.sunTexture = THREE.ImageUtils.loadTexture( TEXTUREPATH+"sun_surface.png" );
	this.sunTexture.anisotropy = this.maxAniso;
	this.sunTexture.wrapS = this.sunTexture.wrapT = THREE.RepeatWrapping;	
	
	this.sunColorLookupTexture = THREE.ImageUtils.loadTexture( TEXTUREPATH+"star_colorshift.png" );
	this.starColorGraph = THREE.ImageUtils.loadTexture( TEXTUREPATH+ 'star_color_modified.png' );
	this.solarflareTexture = THREE.ImageUtils.loadTexture( TEXTUREPATH+"solarflare.png");
	this.sunHaloTexture = THREE.ImageUtils.loadTexture( TEXTUREPATH+"sun_halo.png" );
	this.sunHaloColorTexture = THREE.ImageUtils.loadTexture( TEXTUREPATH+"halo_colorshift.png" );
	this.sunCoronaTexture = THREE.ImageUtils.loadTexture( TEXTUREPATH+"corona.png" );
	
	this.haloUniforms = {
		texturePrimary:   { type: "t", value: this.sunHaloTexture },
		textureColor:   { type: "t", value: this.sunHaloColorTexture },
		time: 			{ type: "f", value: 0 },
		textureSpectral: { type: "t", value: this.starColorGraph },
		spectralLookup: { type: "f", value: 0 },			
	};

	this.solarflareUniforms = {
		texturePrimary:   { type: "t", value: this.solarflareTexture },
		time: 			{ type: "f", value: 0 },
		textureSpectral: { type: "t", value: this.starColorGraph },
		spectralLookup: { type: "f", value: 0 },	
	};
	
	
	this.sunUniforms = {
		texturePrimary:   { type: "t", value: this.sunTexture },
		textureColor:   { type: "t", value: this.sunColorLookupTexture },
		textureSpectral: { type: "t", value: this.starColorGraph },
		time: 			{ type: "f", value: 0 },
		spectralLookup: { type: "f", value: 1 },		
	};
	
	this.coronaUniforms = {
		texturePrimary:   { type: "t", value: this.sunCoronaTexture },
		textureSpectral: { type: "t", value: this.starColorGraph },
		spectralLookup: { type: "f", value: 0 },			
	};

}

UN.Sun.prototype = Object.create( UN.SpaceObject.prototype );

UN.Sun.prototype.init = function() {
	
	var _self = this;

	this.object3D.setSpectralIndex = function( index ){
		var starColor = map( index, -0.3, 1.52, 0, 1);	
			starColor = constrain( starColor, 0.0, 1.0 );

		_self.sunUniforms.spectralLookup.value = starColor;
		_self.solarflareUniforms.spectralLookup.value = starColor;
		_self.haloUniforms.spectralLookup.value = starColor;		
		_self.coronaUniforms.spectralLookup.value = starColor;	
	}
	
	this.object3D.update = function() {
		
		
		var time = new Date().getTime();
		_self.object3D.rotation.y += _self.animation.rotation.y;
		
		if(typeof _self.parent.shaderTiming != "undefined") 
		{
			_self.sunUniforms.time.value = _self.parent.shaderTiming;
			_self.haloUniforms.time.value = _self.parent.shaderTiming ;
			_self.solarflareUniforms.time.value = _self.parent.shaderTiming;	
		}
	}

	for (var prop in this.params) {
      	if(this.hasOwnProperty(prop)){
        	this[prop] = this.params[prop];
      	}
   	}
}

UN.Sun.prototype.render = function() {
	
	var directionalLight = new THREE.DirectionalLight(0xffffff);
 		directionalLight.position.set(1, 1, 1).normalize();
	this.object3D.add( directionalLight );
	
	if(this.sunUniforms != null) {
		this.starSurface = this.makeStarSurface( this.radius, this.sunUniforms );
		this.object3D.add( this.starSurface );
	}
	
	this.object3D.add( this.gyro );
	
	if(this.haloUniforms != null) {	
		this.starHalo = this.makeStarHalo( this.radius, this.haloUniforms );
		this.gyro.add( this.starHalo );
	}
	
	this.object3D.setSpectralIndex(1);
}

UN.Sun.prototype.makeStarSurface = function(radius, sunUniforms) {
	var newRadius = radius;
	var surfaceGeo = new THREE.SphereGeometry(radius, 60, 60);
	var sunShaderMaterial = new THREE.ShaderMaterial( {
		uniforms: 		sunUniforms,
		vertexShader:   shaderList.starsurface.vertex,
		fragmentShader: shaderList.starsurface.fragment,
		depthTest: 		true,
		depthWrite: 	true,
		color: 0x000000,
		transparent: false,
	});

	var sunSphere = new THREE.Mesh( surfaceGeo, sunShaderMaterial);
	return sunSphere;
}

UN.Sun.prototype.makeStarHalo = function (radius, uniforms){
	var newRadius = (radius)*3;
	var haloGeo = new THREE.PlaneGeometry( newRadius, newRadius );
	var sunHaloMaterial = new THREE.ShaderMaterial(	{
			uniforms: 		uniforms,
			vertexShader:   shaderList.starhalo.vertex,
			fragmentShader: shaderList.starhalo.fragment,
			blending: THREE.AdditiveBlending,
			depthTest: 		true,
			depthWrite: 	true,
			color: 0xffffff,
			transparent: true,
			polygonOffset: true,
			polygonOffsetFactor: 1,
			polygonOffsetUnits: 100,
		}
	);

	var sunHalo = new THREE.Mesh( haloGeo, sunHaloMaterial );
	sunHalo.position.set( 0, 0, 0 );
	return sunHalo;
}

/**
 * @param THREE.Object3D 
 * @return THREE.SpotLight
 */

UN.Sun.prototype.getSunSpotLight = function(target) {
	var light	= new THREE.SpotLight( 0xFFFFFF, 10);
		light.target = target;
		light.shadowCameraNear		= 0.001;		
		light.castShadow			= true;
		light.shadowDarkness		= 0.5;	
		light.shadowCameraVisible	= false;
		
	return light;
}

UN.Sun.prototype.getObject3D = function() {
	return this.object3D;
}
