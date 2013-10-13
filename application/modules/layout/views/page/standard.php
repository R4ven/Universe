<!doctype html>
<html lang="en">
	<head>
		<?php echo $this->layout->block('layout/page/html/head') ?>
</head><!--  oncontextmenu="return false"  -->
	<body class="<?php echo $body_class ?>">
		<header>
			<?php echo $this->layout->block('layout/page/html/header') ?>
		</header>
		<div role="main" class="page container">
			<div class="main row-fluid">
				
				<div class="span3">
					<?php $this->layout->get('navigation') ?>		
				</div>
				
				<div class="span9 col-main">
					<?php $this->layout->get('col-main') ?>					
				</div>
			</div>
		</div>
		<footer>
			<?php echo $this->layout->block('layout/page/html/footer') ?>
		</footer>
	</body>
</html>