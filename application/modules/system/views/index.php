<script type="text/javascript">
	BASE_URL = "<?php echo base_url() ?>";
	IMAGEPATH = "<?php echo base_url() ?>public/img/galaxy/";
	TEXTUREPATH = "<?php echo base_url() ?>public/img/textures/";
	SHADERPATH = "<?php echo base_url() ?>public/img/shaders/";
	SystemId = <?php echo $systemid ?>;
	var jsonUrl = "<?php echo base_url() ?>index.php/system/json/"+SystemId;
	
	var shaderList = [SHADERPATH + 'starsurface', SHADERPATH + 'starhalo', SHADERPATH + 'starflare', SHADERPATH + 'galacticstars', SHADERPATH + 'galacticdust', SHADERPATH + 'datastars', SHADERPATH + 'cubemapcustom', SHADERPATH + 'corona'];
	
</script>
<div id="tooltip" style="z-index: 10000; position: absolute;"></div>

<div style="display: none;">
	<span id="legacymarker" class="legacymarker">
		<a class="popover-planet"></a>
	</span>
	
	<div id="planet-1" class="planet-tooltip">
		<table cellpadding="0" cellspacing="0">
			<tr>
				<td>Name:</td>
				<td>Unbekannt</td>
			</tr>
			<tr>
				<td>ID:</td>
				<td>123</td>
			</tr>
			
		</table>
	</div>
</div>

<div id="visualization" style="position: relative;">
	
	<div id="glContainer">
		<!-- 3D webgl canvas here -->
	</div>
</div>

<script data-main="<?php echo js_link('sunsystem.js') ?>" src="<?php echo js_link('lib/require.js') ?>"></script>

