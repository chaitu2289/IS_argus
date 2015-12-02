<?php
require_once('sender.php');

//$mongo = new MongoClient();
//$db = $mongo->it;
//$images = $db->images;
//$labels = $db->labels;
//$page = $pages->findOne(array('_id' => $_REQUEST['_id']));
//if (!isset($_REQUEST['op'])) {
//	echo json_encode(array("status" => "error", "description" => "op not specified"));
//	exit;
//}

$callback = function($msg) {
	var_dump($msg->body);
};
/*
$data = '{"image_id":1,"labels":[{"box":[[0,18],[282.33334,146.33334]],"label":"bicycle","_id":0}]}';
$image = '/abc/def';
        $file_name = '"' . $image . '"';
        $arra = json_encode(array('"image_file_path"' => $file_name, '"data"' => $data));
        exec("python learn_features.py $arra", $output, $return_val);
echo $output[0];
*/
error_log("received request with OP $_REQUEST[op]");

$operation_name = $_REQUEST['op'];
switch($_REQUEST['op']) {
case 'identify_objects':
	$image = $_FILES['test_image']['tmp_name'];
	//var_dump($image);
	$file_name = '"' . $image . '"';
	$operation = '"' . $operation_name . '"';
        $arra = json_encode(array('"image_file_path"' => $file_name, '"operation"' => $operation));
        exec("python php2python.py $arra", $output, $return_val);
        $resp = $output[0];

	//$simple_sender = new Sender();
	//$resp = $simple_sender->execute($image);
	//$resp = json_decode($resp);
	//var_dump(gettype(json_decode($resp)));
	//var_dump(json_decode($resp));
	//var_dump(json_encode($resp));
	//echo " [x] Image sent\n";	
	//$label1 = array('_id' => 1, 'box' => array(array(0,0), array(150,150)), 'tag' => 'chair');
	//$label2 = array('_id' => 2, 'box' => array(array(50,50), array(50,50)), 'tag' => 'car');

	//$resp = array('_id' => 1, 'labels' => array($label1, $label2) );
	echo $resp;
	break;
case 'save':
	$image = $_FILES['test_image']['tmp_name'];
	$data = $_POST['image_data'];
	//$data = json_decode($data);
	//$data = '{"image_id":1,"labels":[{"box":[[0,18],[282.33334,146.33334]],"label":"bicycle","_id":0}]}';
	$file_name = '"' . $image . '"';
	$operation = '"' . $operation_name . '"';
        $arra = json_encode(array('"image_file_path"' => $file_name, '"data"' => $data, '"operation"' => $operation));
        exec("python save.py $arra", $output, $return_val);
	$resp = $output[0];
	echo $resp;
	break;
case 'learn_features':
	$operation = '"' . $operation_name . '"';
	$arra = json_encode(array('"operation"' => $operation));
	exec("python learn_features.py $arra", $output, $return_val);
	echo "chaitu";
	break;
default:
	echo json_encode(array("status" => "error", "description" => "unknown op '$_REQUEST[op]'"));
	exit;
}

//echo $resp;
