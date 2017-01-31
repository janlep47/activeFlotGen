<?php

//require_once('FirePHPCore/FirePHP.class.php');
//ob_start();
//$firephp = FirePHP::getInstance(true);
    // TO display stuff:
    //$firephp->log($dataIn, 'JSON data');

    //$filename = $_POST["filename"];
    $filename = "setup.txt";
    $dataIn = json_decode(file_get_contents($filename), false);

    //foreach ($dataIn as $key => $value) {
    //    echo "$key => $value\n";
    //}

    //echo $dataIn[0]->matlabCode;
    //echo "  <br> ";
    //echo $dataIn[1]->matlabCode;

    $dataOut = json_encode($dataIn);
    //$firephp->log($dataOut, 'JSON encoded data');    
    echo $dataOut;
?>
