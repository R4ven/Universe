<script type="text/javascript">
	BASE_URL = "<?php echo base_url() ?>";
	IMAGEPATH = "<?php echo base_url() ?>public/img/galaxy/";
	TEXTUREPATH = "<?php echo base_url() ?>public/img/textures/";
	SHADERPATH = "<?php echo base_url() ?>public/img/shaders/";
	GalaxyID = 1;
	var jsonUrl = "<?php echo base_url() ?>index.php/galaxy/json/1";
	
	var shaderList = [SHADERPATH + 'starsurface', SHADERPATH + 'starhalo', SHADERPATH + 'starflare', SHADERPATH + 'galacticstars', SHADERPATH + 'galacticdust', SHADERPATH + 'datastars', SHADERPATH + 'cubemapcustom', SHADERPATH + 'corona'];

</script>
<style>
	#glContainer {
	    position: relative;
	    background:grey;
	    display: block;
	    width: 700px;
	    height: 600px;
	}
	
	@media (max-width: 979px) and (min-width: 768px)
		#glContainer {
		    height: 320px;
		    width: 538px;
		}
	}
	
	@media (min-width: 980px) {
		#glContainer {
			height: 500px;
	    	width: 700px;
	    }
	}
	
	@media (min-width: 1200px) {
		#glContainer {
		    height: 600px;
		    width: 870px;
		}
	}
	
	
	
</style>

<div id="mousex" style="position: absolute; left: 0; top: 0;"></div>
    <div id="mousey" style="position: absolute; left: 0; top: 30px;"></div>

<div style="display: none;">
	<span id="namemarker" class="namemarker">
		<a class="name"></a>
	</span>
	
	<span id="divmarker" class="divmarker noContextMenu">
		
	</span>
</div>

<div id="visualization">
	
	<div id="glContainer" class="noContextMenu">
		<!-- 3D webgl canvas here -->
	</div>
</div>

<script data-main="<?php echo js_link('galaxy.js') ?>" src="<?php echo js_link('lib/require.js') ?>"></script>

