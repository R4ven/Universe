var UN = UN || { REVISION: '2' };

UN.devicePixelRatio = window.devicePixelRatio || 1;

UN.TOUCHMODES = {
	NONE : 0,
	SINGLE : 1,
	DOUBLE : 2,
};

UN.TEXTURES = {};

UN.TEXTURES.GLOWSPAN = THREE.ImageUtils.loadTexture(TEXTUREPATH+'glowspan.png');
UN.TEXTURES.DUST = THREE.ImageUtils.loadTexture( TEXTUREPATH+"dust.png" );
UN.TEXTURES.STARCOLORGRAPH = THREE.ImageUtils.loadTexture( TEXTUREPATH+ 'star_color_modified.png' );
UN.TEXTURES.SUNHALOTEXTURE = THREE.ImageUtils.loadTexture( TEXTUREPATH+"sun_halo.png" );
UN.TEXTURES.SUNHALOCOLORTEXTURE = THREE.ImageUtils.loadTexture( TEXTUREPATH+"halo_colorshift.png" );

/**
 * TEXTUREN 
 */

UN.TEXTURES.STAR = THREE.ImageUtils.loadTexture( TEXTUREPATH+'star_preview.png');
UN.TEXTURES.STARHOVER = THREE.ImageUtils.loadTexture( TEXTUREPATH+'sun_halo.png');
