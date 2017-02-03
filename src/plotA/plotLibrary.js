
function doPlotB(inputs) {
    if (typeof a == 'undefined') a = 1;
    //if (typeof inputs.sliderVal != 'undefined') a = inputs.sliderVal;
    a++;  // THIS IS CRAP FOR DEBUGGING !!!!!!!!!!!!!!!!

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
        y = a*i;
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
   



//yaxis: {
//tickFormatter: function(val, axis) { return val < axis.max ? val.toFixed(2) : "CZK/l";}
//}

/*
var options = {
    series: { shadowSize: 0 }, // drawing is faster without shadows
    yaxis: { min: 0, max: maxYaxis},
    xaxis: { show: false },
    colors: ["<?PHP echo $string1Color; ?>","<?PHP echo $string2Color; ?>"]
};
var plot = $.plot($("#placeholder"), [ getStr1(), getStr2() ], options);
*/


/*
        $.plot($("#placeholder"),
           [ { data: oilprices, label: "Oil price ($)" },
             { data: exchangerates, label: "USD/EUR exchange rate", yaxis: 2 }],
           { 
               xaxes: [ { mode: 'time' } ],
               yaxes: [ { min: 0 },
                        {
                          // align if we are to the right
                          alignTicksWithAxis: position == "right" ? 1 : null,
                          position: position,
                          tickFormatter: euroFormatter
                        } ],
               legend: { position: 'sw' }
           });
*/


};


function yAxisLabellerOld(val, axis) { 
    return val < axis.max ? val.toFixed(2) : "ohms";
};

function yAxisLabeller(val, axis) { 
    //return "<span style='font-weight: bold'>" +  val + " ohms</span>";
    return "<span style='color: black'>" +  val + "</span>";
};

function xAxisLabeller(val, axis) { 
    //return "<span style='font-weight: bold'>" +  val + "V</span>";
    return "<span style='color: black'>" +  val + "</span>";
};

/*
{
    color: color or number
    data: rawdata
    label: string
    lines: specific lines options
    bars: specific bars options
    points: specific points options
    xaxis: number
    yaxis: number
    clickable: boolean
    hoverable: boolean
    shadowSize: number
    highlightColor: color or number
}

e.g.
{
    label: "y = 3",
    data: [[0, 3], [10, 3]]
}
e.g.
var options = {
    series: {
        lines: { show: true },
        points: { show: true }
    }
};

$.plot(placeholder, data, options);

// SEE 1st bookmark for lots more info
*/
