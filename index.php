<!DOCTYPE html>
<html lang="en">
<head>
	<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css">
	<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap-theme.min.css">
	<script src="https://code.jquery.com/jquery-2.1.4.min.js"></script>
	<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/js/bootstrap.min.js"></script>
	<script src="argus.js"></script>
	<script src="Jcrop/js/jquery.min.js"></script>
	<script src="Jcrop/js/jquery.Jcrop.min.js"></script>
	<link rel="stylesheet" href="Jcrop/css/jquery.Jcrop.css" type="text/css" />
	<title>Interactive Trainer - Argus</title>
	<style>
		p {
			color:Maroon;
		}
		img {
                	max-height:700px;
                	max-width:700px;
		}
	</style>
</head>
<body>



	<form id="file-form" action="handler.php" method="POST">
		<input type="file" id="file-select" onchange="previewFile()" name="test_image"><br>
		<!--<input type="file" id="file-select" name="test_image"><br>-->
		<button type="button" id="upload-button" >Show Objects</button>
		<button type="button" id="crop" >Crop</button>
		<br> Object label: <input type="text" id="tag"  name="firstname"><br>
		<img src="#"  alt="Image preview..." id="target">
	</form>

	<!--img src="#"  alt="Image preview..." id="target"--> 	




</body>
</html>
