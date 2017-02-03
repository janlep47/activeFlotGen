var a = 2;

var inputs = {};
$(document).ready(function() {
    doPlotA(inputs);
});

$(function() {
   $('#slider1').slider({
      range: 'min',
      step: 0.5,
      min: 0,
      max: 10,
      value: 2,
      slide: function(event, ui) {
          var inputs = {};
          inputs.sliderVal = ui.value;
          doPlotA(inputs);
          $('#amount').val( '  '+ ui.value );
      }
   });
   $( '#amount' ).val('  '+ $( '#slider1' ).slider( 'value') );

});

