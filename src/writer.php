<?php

require_once('FirePHPCore/FirePHP.class.php');
ob_start();
$firephp = FirePHP::getInstance(true);

if (get_magic_quotes_gpc()) {
    function stripslashes_gpc(&$value)
    {
        $value = stripslashes($value);
    }
    array_walk_recursive($_POST, 'stripslashes_gpc');
}

    $matlabCode = $_POST["matlabCode"];
    //$firephp->log($matlabCode, 'matlabCode');

    $jsRoutine = $_POST["plotRoutine"];
    //$firephp->log($jsRoutine, 'javascript plotter routine');

    $uniquePlotName = $_POST["uniquePlotName"];
    $firephp->log($uniquePlotName, 'js unique plot name');

    $useSubmit = $_POST["useSubmit"];
    //$firephp->log($useSubmit, 'use submit');

    $initializeText = $_POST["initializeText"];
    //$firephp->log($initializeText, 'initializeText');

    if (!empty($jsRoutine)) {
        $prefix = $uniquePlotName;
        $widgetsFilename = "widgets".$uniquePlotName.".js";
    } else {
        $prefix = "matlab".$matlabCode;
        $widgetsFilename = "widgets".$matlabCode.".js";
    }

    // Create the subdirectory (unless it already exists)
    if (file_exists($prefix)) {
       // Make sure this code has write priviledges to this subdirectory
       if (!is_writable($prefix)) {
          echo "Error: Don't have write privileges to subdirectory ".$prefix;
          exit;
       }
    // Need to create the subdirectory
    } else {
       if (!mkdir($prefix, 0777))
          echo "Error: Could not create subdirectory ".$prefix;
       // mkdir doesn't seem to see rights correctly, so do this:
       chmod($prefix, 0777);
    }

    $firephp->log($prefix, 'prefix');
    $filename = $prefix."/".$prefix.".html";

    $handle = fopen($filename, "w");
    chmod($filename, 0777);

    $htmlBody = $_POST["text"];

    // get the slider(s) data; each is an array:
    $steps = json_decode(stripslashes($_POST['steps']));
    $minVals = json_decode(stripslashes($_POST['minVals']));
    $maxVals = json_decode(stripslashes($_POST['maxVals']));
    $initVals = json_decode(stripslashes($_POST['initVals']));
    $sliderIDs = json_decode(stripslashes($_POST['sliderIDs']));
    $sliderNames = json_decode(stripslashes($_POST['sliderNames']));

    // get the entry(ies) data min/max values, for user error checking
    $entryNames = json_decode(stripslashes($_POST['entryNames']));
    $entryMinVals = json_decode(stripslashes($_POST['entryMinVals']));
    $entryMaxVals = json_decode(stripslashes($_POST['entryMaxVals']));
    $entryDefaultVals = json_decode(stripslashes($_POST['entryDefaultVals']));

    // get any checkbox data:
    $checkboxIDs = json_decode(stripslashes($_POST['checkboxIDs']));
    $checkboxVals = json_decode(stripslashes($_POST['checkboxVals']));

    // get any radio button data:
    $radioNames = json_decode(stripslashes($_POST['radioNames']));

    $htmlHeader = "<!DOCTYPE html>
<html>
<head>
  <meta content='text/html;charset=utf-8' http-equiv='Content-Type'>
  <meta content='utf-8' http-equiv='encoding'>

<link rel='stylesheet' href='../jquery-ui-1.9.0.custom.min.css' />
<link rel='stylesheet' href='../plot.css' />

<script type='text/javascript' src='../jquery-1.8.2.min.js'></script>
<script type='text/javascript' src='../jquery-ui-1.9.0.custom.min.js'></script>\n";

   // if using a javascript routine (instead of matlab plot -> matlabxxxxx.php),
   //  then include the source in the matlabxxxxx.html file.
   if (!empty($jsRoutine)) {
      // MAY NOT need this next one:
      $htmlHeader .= 
          "<script type='text/javascript' src='plotLibrary.js'></script>\n";
      $htmlHeader .= 
          "<script type='text/javascript' src='../jquery.flot.min.js'></script>\n";
   }
   // include any necessary widget javascript stuff (e.g. slider stuff, etc):
   $htmlHeader .="<script type='text/javascript' src='".$widgetsFilename
               ."'></script>\n";

   // include code to handle submit button, for MATLAB case (not jquery plot)
   if (!empty($matlabCode)) {
      $htmlHeader .="<script type='text/javascript'>\n";
      $htmlHeader .="

function doSubmit() {
    var \$formInputs = \$('form :input');
    var values = {};
    \$formInputs.each(function() {
        values[this.name] = $(this).val();
    });
    getPlot(values);
}

</script>";
   }


   $htmlHeader .="</head>

<body>";


    $htmlEnd = "</body>\n</html>";

    fwrite($handle,$htmlHeader);
    fwrite($handle,$htmlBody);
    fwrite($handle,$htmlEnd);

    fclose($handle);

    //print $filename." printed OK";

    $widgetsFilename = $prefix."/".$widgetsFilename;

    // NOW, write the widgets .js file
    writeJSWidgetCode($firephp,$widgetsFilename,$useSubmit,$jsRoutine,$steps,
                      $minVals,$maxVals,$initVals,$sliderIDs,$sliderNames,
                      $initializeText,$entryNames,$entryMinVals,$entryMaxVals,
                      $entryDefaultVals,$checkboxIDs,$checkboxVals,
                      $radioNames);

    echo "Files written OK";
    exit;


function writeJSWidgetCode($firephp,$filename,$useSubmit,$jsRoutine,
         $steps,$minVals,$maxVals,$initVals,$sliderIDs,$sliderNames,
         $initializeText,$entryNames,$entryMinVals,$entryMaxVals,
         $entryDefaultVals,$checkboxIDs,$checkboxVals,$radioNames) {
    $handle = fopen($filename, "w");
    chmod($filename, 0777);

    // This is for plot routine initialization data (if any)
    $jsBody = $initializeText."\n\n";
    for ($i=0; $i<count($entryNames); $i++) {
       $jsBody .= "var ".$entryNames[$i]." = {};\n";
       if ($entryMinVals[$i] != 'undefined')
          $jsBody .= $entryNames[$i].".min = ".$entryMinVals[$i].";\n";
       if ($entryMaxVals[$i] != 'undefined')
          $jsBody .= $entryNames[$i].".max = ".$entryMaxVals[$i].";\n";
       if ($entryDefaultVals[$i] != 'undefined')
          $jsBody .= $entryNames[$i].".defaultVal = ".$entryDefaultVals[$i].";\n";
    }

    $jsBody .= "var inputs = {};\n";
    $jsBody .= "$(document).ready(function() {\n";
    for ($i=0; $i<count($entryNames); $i++) {
       $jsBody .= "    if (typeof ".$entryNames[$i].".defaultVal != 'undefined')\n";
       $jsBody .= "        $(\"input[name='".$entryNames[$i]."']\").val(".
                      $entryNames[$i].".defaultVal);\n";
    }
    if (!empty($jsRoutine))
       $jsBody .= "    ".$jsRoutine."(inputs);\n";
    $jsBody .= "});\n\n";

    // Create the READY function:
    $jsBody .= "$(function() {\n";

    // Add code to setup sliders and slider action(s):
    for ($i=0; $i<count($steps); $i++) {
       $n = $i+1;
       $jsBody .= "   $('#slider".$n."').slider({\n";
       $jsBody .= "      range: 'min',\n";
       $jsBody .= "      step: ".$steps[$i].",\n";
       $jsBody .= "      min: ".$minVals[$i].",\n";
       $jsBody .= "      max: ".$maxVals[$i].",\n";
       $jsBody .= "      value: ".$initVals[$i].",\n";
       $jsBody .= "      slide: function(event, ui) {\n";
       if ($useSubmit) {
          $jsBody .= "          $('input[name=".$sliderNames[$i]."').val(ui.value);\n";
       } else {
          $jsBody .= "          var inputs = {};\n";
          $jsBody .= "          inputs.".$sliderNames[$i]." = ui.value;\n";
          $jsBody .= "          ".$jsRoutine."(inputs);\n";
       }
       $jsBody .= "          $('#".$sliderIDs[$i]."').val( '  '+ ui.value );\n";
       $jsBody .= "      }\n";
       $jsBody .= "   });\n";
       $jsBody .= "   $( '#".$sliderIDs[$i]."' ).val('  '+ $( '#slider".$n."' ).slider( 'value') );\n";
       $jsBody .= "\n";
    }


    // Add code to setup checkbox action(s):
    //for ($i=0; $i<count($checkboxNames); $i++) {
    //   $jsBody .= "   $('input[name=\"".$checkboxNames[$i]."\"]').change(function() {\n";
    //   $jsBody .= "       var inputs = {};\n";
    //   for ($j=0; $j<count($checkboxVals[$i]); $j++)
    //      $jsBody .= "       inputs.".$checkboxVals[$i][$j]." = $('input[value=\"".$checkboxVals[$i][$j]."\"]').is(':checked');\n";
    //   $jsBody .= "       ".$jsRoutine."(inputs);\n";
    //   $jsBody .= "   });\n\n";
    //}

    // Add code to setup checkbox action(s):
    for ($i=0; $i<count($checkboxIDs); $i++) {
       $jsBody .= "   $('#".$checkboxIDs[$i]."').change(function() {\n";
       $jsBody .= "       inputs.".$checkboxVals[$i]." = \$(this).is(':checked');\n";
       $jsBody .= "       ".$jsRoutine."(inputs);\n";
       $jsBody .= "   });\n\n";
    }

    // Add code to setup radio action(s):
    for ($i=0; $i<count($radioNames); $i++) {
       $jsBody .= "   $('input[name=\"".$radioNames[$i]."\"]').change(function() {\n";
       $jsBody .= "       inputs.".$radioNames[$i]." = \$('input[name=\"".$radioNames[$i]."\"]:checked').attr(\"value\");\n";
       $jsBody .= "       ".$jsRoutine."(inputs);\n";
       $jsBody .= "   });\n\n";
    }       

    // END OF THE READY FUNCTION !!!!!
    $jsBody .= "});\n\n";

    // IF submitting data, add code to check its validity:
    if ($useSubmit) {
       $jsBody .= "
function getPlot(values) {
    if (!checkValidity(values)) return;
    var outputData = null;

    $.ajax({
        async: false,
        type: 'post',
        url: 'matlabPlot.php',
        data: {data : values},
        success: function(data) {
            outputData = eval('outputData='+data);
        },
        error: function(data) {
            alert('ERROR from getPlot() call');
        },
        warning: function(data) {
            alert('WARNING from getPlot() call');
        }
    });
    $('.plot').empty();
    $('.plot').append($(\"<img src='\"+outputData.filename+\"'>\"));
}

function checkValidity(values) {
    $(\"span[style='color:red']\").remove();\n";

       for ($i=0; $i<count($entryNames); $i++) {
         $jsBody .= "    if (typeof ".$entryNames[$i]." != 'undefined') {\n";
         $jsBody .= "        if (typeof ".$entryNames[$i].".min != 'undefined')\n";
         $jsBody .= "            if (values.".$entryNames[$i]." < ".
                                    $entryNames[$i].".min) {\n";
         $jsBody .= "                errmsg = 'Invalid value; minimum value is '+".
                                        $entryNames[$i].".min;\n";
         $jsBody .= "                $('#dataEntries').\n";
         $jsBody .= "                    append($('<span style=\"color:red\">'+errmsg+'</span>'));\n";
         $jsBody .= "                $(\"input[name='".$entryNames[$i]."']\").select();\n";
         $jsBody .= "                return false;\n";
         $jsBody .= "            }\n";

         $jsBody .= "        if (typeof ".$entryNames[$i].".max != 'undefined')\n";
         $jsBody .= "            if (values.".$entryNames[$i]." > ".
                                    $entryNames[$i].".max) {\n";
         $jsBody .= "                errmsg = 'Invalid value; maximum value is '+".
                                        $entryNames[$i].".max;\n";
         $jsBody .= "                $('#dataEntries').\n";
         $jsBody .= "                    append($('<span style=\"color:red\">'+errmsg+'</span>'));\n";
         $jsBody .= "                $(\"input[name='".$entryNames[$i]."']\").select();\n";
         $jsBody .= "                return false;\n";
         $jsBody .= "            }\n";

         $jsBody .= "    }\n";
      }
      $jsBody .= "    return true;\n";
      $jsBody .= "}\n\n";

    // This following line, ends the "if ($useSubmit)" statement!
    }

    fwrite($handle,$jsBody);
    fclose($handle);

    //print $filename." printed OK";
}

?>
