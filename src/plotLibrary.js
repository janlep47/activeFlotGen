
function doPlotB(inputs) {
    if (typeof a == 'undefined') a = 1;
    a++;  // FOR DEBUGGING 

    var d1 = [];
    var d2 = [];
    var d3 = [];
    var y;
    for (var i = 0; i <= 10.0; i += 0.05) {
        y = a*i*i;
        d3.push([i, y]);
    }
    // 3rd param element (d3) will be plotted in red
    // 2nd param in blue
    // 1st param in yellow/orange

    var options = {
        xaxis: { tickFormatter: xAxisLabeller },
        yaxis: { min: 0, max: 10,
                 tickFormatter: yAxisLabeller }
    };
    
    $.plot($("#plotB"), [ d1, d2, d3 ], options);
};

   
function doHistogram(inputs) {
    // These are the names of the sliders/entries in the user input screen:
    if (typeof inputs.sliderVal1 != 'undefined')
        d2[0][1] = inputs.sliderVal1;
    if (typeof inputs.sliderVal2 != 'undefined')
        d2[1][1] = inputs.sliderVal2;
    if (typeof inputs.var1 != 'undefined')
        d2[2][1] = inputs.var1;
    if (typeof inputs.var2 != 'undefined')
        d2[3][1] = inputs.var2;

    $.plot($("#histogram1"), [
        {
            data: d2,
            bars: { show: true }
        }
    ]);
};

function doPlotA(inputs) {
    if (typeof a == 'undefined') a = 1;
    if (typeof inputs.sliderVal != 'undefined') a = inputs.sliderVal;

    var d1 = [];
    var d2 = [];
    var d3 = [];
    var y;
    for (var i = 0; i <= 10.0; i += 0.05) {
        y = a*i*i;
        d3.push([i, y]);
    }
    // 3rd param element (d3) will be plotted in red
    // 2nd param in blue
    // 1st param in yellow/orange

    var options = {
        xaxis: { tickFormatter: xAxisLabeller },
        yaxis: { min: 0, max: 10,
                 tickFormatter: yAxisLabeller }
    };
    
    $.plot($("#plotA"), [ d1, d2, d3 ], options);
};


function yAxisLabellerOld(val, axis) { 
    return val < axis.max ? val.toFixed(2) : "ohms";
};

function yAxisLabeller(val, axis) { 
    return "<span style='color: black'>" +  val + "</span>";
};

function xAxisLabeller(val, axis) { 
    return "<span style='color: black'>" +  val + "</span>";
};

