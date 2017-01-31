<?php
   //header('Content-type: text/html; charset=utf-8');

require_once('FirePHPCore/FirePHP.class.php');
ob_start();
$firephp = FirePHP::getInstance(true);

    $dataIn = $_POST["data"];
    $data = (array)$dataIn;

    //$firephp->log("here in matlabPlot.php - data is ".$data);

    //foreach ((array)$data as $key => $val) 
    //   $firephp->log("data[".$key."] is ".$val);

    $dataOut1 = array("filename" => "images/plotImg.jpg");
    $dataOut = json_encode($dataOut1);
    die($dataOut);

    // This also works:
    //$datastr = '{"filename":"plotImg.jpg"}';
    //$dataarray = json_decode($datastr);
    // "die" is same as exit
    //die(json_encode($dataarray));
?>
