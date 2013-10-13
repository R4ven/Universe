

var Sun = function(params) {
	var gyro = new THREE.Gyroscope();
	var system = new THREE.Object3D();
	var starHalo = null;
	var starSurface = null;
	var radius = 60;
	var sunTexture = THREE.ImageUtils.loadTexture( IMAGEPATH+"textures/sun_surface.png" );
		sunTexture.anisotropy = maxAniso;
		sunTexture.wrapS = sunTexture.wrapT = THREE.RepeatWrapping;
	var solarflare = null;
	
	var disable_solarflare = 1;
	
	var sunColorLookupTexture = THREE.ImageUtils.loadTexture( IMAGEPATH+"textures/star_colorshift.png" );
	var starColorGraph = THREE.ImageUtils.loadTexture( IMAGEPATH+ 'textures/star_color_modified.png' );
	var solarflareTexture = THREE.ImageUtils.loadTexture( IMAGEPATH+"textures/solarflare.png");
	var sunHaloTexture = THREE.ImageUtils.loadTexture( IMAGEPATH+"textures/sun_halo.png" );
	var sunHaloColorTexture = THREE.ImageUtils.loadTexture( IMAGEPATH+"textures/halo_colorshift.png" );
	var sunCoronaTexture = THREE.ImageUtils.loadTexture( IMAGEPATH+"textures/corona.png" );
	
	var haloUniforms = {
		texturePrimary:   { type: "t", value: sunHaloTexture },
		textureColor:   { type: "t", value: sunHaloColorTexture },
		time: 			{ type: "f", value: 0 },
		textureSpectral: { type: "t", value: starColorGraph },
		spectralLookup: { type: "f", value: 0 },			
	};
	
	if(!disable_solarflare) {
		var solarflareUniforms = {
			texturePrimary:   { type: "t", value: solarflareTexture },
			time: 			{ type: "f", value: 0 },
			textureSpectral: { type: "t", value: starColorGraph },
			spectralLookup: { type: "f", value: 0 },	
		};
	}
	
	
	var sunUniforms = {
		texturePrimary:   { type: "t", value: sunTexture },
		textureColor:   { type: "t", value: sunColorLookupTexture },
		textureSpectral: { type: "t", value: starColorGraph },
		time: 			{ type: "f", value: 0 },
		spectralLookup: { type: "f", value: 0 },		
	};
	
	var coronaUniforms = {
		texturePrimary:   { type: "t", value: sunCoronaTexture },
		textureSpectral: { type: "t", value: starColorGraph },
		spectralLookup: { type: "f", value: 0 },			
	};
	
	var init = function() {
		starSurface = makeStarSurface( radius, sunUniforms );
		system.add( starSurface );
		
		var directionalLight = new THREE.DirectionalLight(0xffffff);
   	 		directionalLight.position.set(1, 1, 1).normalize();
   		//system.add(directionalLight);
		
		//solarflare = makeSolarflare( radius, solarflareUniforms );
		//system.add( solarflare );
		/*
		
		var ambientLight = new THREE.AmbientLight(0xffffff);
		system.add(ambientLight);*/
	
	/*
	var directionalLight = new THREE.DirectionalLight(0xffffff);
	directionalLight.position.set(1, 0.75, 0.5).normalize();
	//this.system.add(directionalLight);*/
		
		system.setSpectralIndex(1);
		
		system.add( gyro );	

		starHalo = makeStarHalo( radius, haloUniforms );
		gyro.add( starHalo );
	}
	
	var makeStarHalo = function (radius, uniforms){
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
				//	settings that prevent z fighting
				polygonOffset: true,
				polygonOffsetFactor: 1,
				polygonOffsetUnits: 100,
			}
		);
	
		var sunHalo = new THREE.Mesh( haloGeo, sunHaloMaterial );
		sunHalo.position.set( 0, 0, 0 );
		return sunHalo;
	}
	
	var makeStarSurface = function( radius, sunUniforms ) {
		var newRadius = radius;
		var surfaceGeo = new THREE.SphereGeometry(radius, 60, 60);
		var sunShaderMaterial = new THREE.ShaderMaterial( {
			uniforms: 		sunUniforms,
			vertexShader:   shaderList.starsurface.vertex,
			fragmentShader: shaderList.starsurface.fragment,
			depthTest: 		true,
			depthWrite: 	true,
			color: 0xffffff,
			transparent: false,
		});
	
		var sunSphere = new THREE.Mesh( surfaceGeo, sunShaderMaterial);
		return sunSphere;
	}
	
	var makeSolarflare = function( radius, uniforms ){
		var newRadius = radius * 0.51;
		var solarflareGeometry = new THREE.TorusGeometry( newRadius , newRadius, 75, 75, 0.15 + Math.PI  );
		var solarflareMaterial = new THREE.ShaderMaterial({
				uniforms: 		uniforms,
				vertexShader:   shaderList.starflare.vertex,
				fragmentShader: shaderList.starflare.fragment,
				blending: THREE.AdditiveBlending,
				color: 0xffffff,
				transparent: false,
				depthTest: true,
				depthWrite: false,
				polygonOffset: false,
				polygonOffsetFactor: -100,
				polygonOffsetUnits: 1000,
			}
		);
	
		var solarflareMesh = new THREE.Object3D();
	
		for( var i=0; i< 6; i++ ){
			var solarflare = new THREE.Mesh(solarflareGeometry, solarflareMaterial );
			solarflare.rotation.y = Math.PI/2;
			solarflare.speed = Math.random() * 0.01 + 0.005;
			solarflare.rotation.z = Math.PI * Math.random() * 2;
			solarflare.rotation.x = -Math.PI + Math.PI * 2;
			solarflare.update = function(){
				this.rotation.z += this.speed;
			}
			var solarflareContainer = new THREE.Object3D();
			solarflareContainer.position.x = -1 + Math.random() * 2;
			solarflareContainer.position.y = -1 + Math.random() * 2;
			solarflareContainer.position.z = -1 + Math.random() * 2;
			solarflareContainer.position.multiplyScalar( 7.35144e-8 * 0.8 );
			solarflareContainer.lookAt( new THREE.Vector3(0,0,0) );
			solarflareContainer.add( solarflare );
	
			solarflareMesh.add( solarflareContainer );
		}
	
		return solarflareMesh;
	}

	system.update = function() {
		var self = this;
		var time = new Date().getTime();
		
		system.rotation.y += 0.0003;
		
		sunUniforms.time.value = shaderTiming + rotateYAccumulate;
		haloUniforms.time.value = shaderTiming + rotateYAccumulate;
		if(!disable_solarflare) solarflareUniforms.time.value = shaderTiming + rotateYAccumulate;	
	}
	
	system.setSpectralIndex = function( index ){
		var starColor = map( index, -0.3, 1.52, 0, 1);	
		starColor = constrain( starColor, 0.0, 1.0 );

		sunUniforms.spectralLookup.value = starColor;
		if(!disable_solarflare) solarflareUniforms.spectralLookup.value = starColor;
		haloUniforms.spectralLookup.value = starColor;		
		coronaUniforms.spectralLookup.value = starColor;	
	}

	init();
	
	return {
		
		get : function() {
			return system;
		}
	}
}

