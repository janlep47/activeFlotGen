

var inputs = {};
$(document).ready(function() {
    doPlotB(inputs);
});

$(function() {
   $('#showsubplot1').change(function() {
       inputs.XvsY = $(this).is(':checked');
       doPlotB(inputs);
   });

   $('#showsubplot2').change(function() {
       inputs.YvsZ = $(this).is(':checked');
       doPlotB(inputs);
   });

   $('#showsubplot3').change(function() {
       inputs.XvsZ = $(this).is(':checked');
       doPlotB(inputs);
   });

   $('input[name="units"]').change(function() {
       inputs.units = $('input[name="units"]:checked').attr("value");
       doPlotB(inputs);
   });

});

