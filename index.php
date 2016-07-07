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
                	max-width:500px;
		}
		.highlight td {
			background: green;
		}
		
	</style>
</head>
<body>


	<div style="width:100%;">
		<div style="float:left; width:50%;">
			<form id="file-form" action="javascript:void(0)" method="POST">
				<input type="file" id="file-select" onchange="previewFile()" name="test_image"><br>
				<!--<input type="file" id="file-select" name="test_image"><br>-->
				<button type="button" id="upload-button" >Show Objects</button>
				<button type="button" id="select_new_object" style="display: none" >Select new object</button>
				<button type="button" id="crop" style="display: none">Confirm selection</button>
				<button type="button" id="save" style="display: none">Save Image</button>
				<!--Learn Features is same as finetune -->
				<button type="button" id="learn_features">Finetune</button>
				<br> Object label: <input type="text" id="tag"  name="firstname"><br>
				<img src="#"  alt="Image preview..." id="target">
			</form>
		</div>
		<div style="float:right; width:50%;" class="two-col">
			 <form>
  				Iterations for Finetuning:<br>
  				<input type="text" name="iterations" id="iterations"><br>
  				Learning Rate:<br>
  				<input type="text" name="learning_rate" id="learning_rate"> <br>
				Number of similar images:<br>
				<input type="text" name="num_sim_images" id="num_sim_images"> <br>
			</form> 
			<table id="hyper-parameters" border="1">
				<tbody>
				<tr>
					<th> Number of Iterations</th>
					<th> Learning Rate</th>
					<th> Number of Similar Images</th>
				</tr>
				</tbody>
			</table>
			<br>
		</div>
	</div>


	<!--img src="#"  alt="Image preview..." id="target"--> 	




</body>
</html>
