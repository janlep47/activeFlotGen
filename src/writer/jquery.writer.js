
// Are we going to use matlab-code/plotterName subdirectories?
//   (probably just have it all in the main directory?)

function Writer(){
   this.whatever = null;
}

Writer.prototype.init = function(container,path,inputFile){
    this.matlabCode = "";
    this.jsRoutine = "";
    this.uniquePlotName = "";
    this.useSubmit = true;  // default
    this.initializeText = "";
    this.xAxisLabel = "";
    this.yAxisLabel = "";
    this.plotTitle = "";

    this.numberOfSliders = 0;
    this.steps = [];
    this.minValues = [];
    this.maxValues = [];
    this.initValues = [];
    this.sliderIDs = [];
    this.sliderNames = [];

    this.numberOfEntries = 0;
    this.entryNames = [];
    this.entryMinValues = [];
    this.entryMaxValues = [];
    this.entryDefaultValues = [];

    // keep track of checkbox GROUPS, so can put a <fieldset> around them
    this.numberOfCheckVals = 0;
    this.lastCheckgroupName = "";
    this.checkboxIDs = [];
    this.checkboxVals = [];

    // ONLY need to pass the name of each radio group to writer.php (which
    //  writes the given html code, and also the associated .js file)
    this.numberOfRadiogroups = -1;
    this.radioNames = [];
    this.lastRadioName = "";

    this.lastWidget = "";
    this.messages = "";

    // NOTE: this.container is the div #dataEntries
    this.container = container;

    // DEBUG
    //console.log("currently $(body).html() is: "+$("body").html());
    
    $(this.container).append("\n");

    // Open and read input file:
    this.buildData = null;
    var _this = this;
    
    // read the setup.txt file which describes the GUI for each "application"
    //  and turn it into a JSON object; after setup.php returns this JSON 
    //  object, process it here to create the appropriate HTML code for each app.
    $.ajax({
        async: false,
        type: 'post',
        url: 'setup.php',
        data: {filename : inputFile},
        success: function(data) {
            var dataToObj = eval(data);
            _this.buildData = dataToObj;
        },
        error: function(data) {
            console.log('ERROR from setup.php call');
        },
        warning: function(data) {
            console.log('WARNING from setup.php call');
        }
    });

    $(this.container).css("height","auto");

    // Save the skeleton right wrapper div (contents only), so can reset
    //  the starting app (writer.html) for each .html app written.
    this.rightWrapper = $("#rightWrapper").html();
    //console.log('rightWrapper: '+this.rightWrapper);

    var appData;
    for (var i = 0; i < this.buildData.length; i++) {
        appData = this.buildData[i];
        //console.log('appData = '+appData);
        this.processAppData(appData);

        // All data processed for this app; now, create the files.
        // Convert the arrays to something AJAX/php can handle:
        var jsonSteps = JSON.stringify(this.steps);
        var jsonMinValues = JSON.stringify(this.minValues);
        var jsonMaxValues = JSON.stringify(this.maxValues);
        var jsonInitValues = JSON.stringify(this.initValues);
        var jsonSliderIDs = JSON.stringify(this.sliderIDs);
        var jsonSliderNames = JSON.stringify(this.sliderNames);

        var jsonEntryNames = JSON.stringify(this.entryNames);
        var jsonEntryMinValues = JSON.stringify(this.entryMinValues);
        var jsonEntryMaxValues = JSON.stringify(this.entryMaxValues);
        var jsonEntryDefaultValues = JSON.stringify(this.entryDefaultValues);

        var jsonCheckboxIDs = JSON.stringify(this.checkboxIDs);
        var jsonCheckboxVals = JSON.stringify(this.checkboxVals);

        var jsonRadioNames = JSON.stringify(this.radioNames);

        // get file names to be created, for success/error messages:
        var file1,file2;
        if (this.matlabCode != "") {
            file1 = "matlab"+this.matlabCode+".html";
            file2 = "widgets"+this.matlabCode+".js";
        } else {
            file1 = this.uniquePlotName+".html";
            file2 = "widgets"+this.uniquePlotName+".js";
        }

        // NOW send the text of the new $("body") to the writer.php to create 
        //  the new .html/.js/.php files for this "app"

        var _this = this;

        $.ajax({
            async: false,
            type: 'post',
            url: 'writer.php',
            data: {matlabCode: this.matlabCode,
                   plotRoutine: this.jsRoutine,
                   text: $("body").html(),
                   uniquePlotName: this.uniquePlotName,
                   useSubmit: (this.useSubmit ? 1 : 0),
                   initializeText: this.initializeText,
                   steps: jsonSteps,
                   minVals: jsonMinValues,
                   maxVals: jsonMaxValues,
                   initVals: jsonInitValues,
                   sliderIDs: jsonSliderIDs,
                   sliderNames: jsonSliderNames,
                   entryNames: jsonEntryNames,
                   entryMinVals: jsonEntryMinValues,
                   entryMaxVals: jsonEntryMaxValues,
                   entryDefaultVals: jsonEntryDefaultValues,
                   checkboxIDs: jsonCheckboxIDs,
                   checkboxVals: jsonCheckboxVals,
                   radioNames: jsonRadioNames},
            cache:false,
            success:function(data){
                if (data.indexOf("Error") == 0) {
                    _this.messages += "<p>ERROR: "+file1+" NOT written</p>\n";
                    _this.messages += "<p>ERROR: "+file2+" NOT written</p>\n";
                } else {
                    _this.messages += "<p>"+file1+" was written OK</p>\n";
                    _this.messages += "<p>"+file2+" was written OK</p>\n";
                }
                console.log('file was written OK');
            },
            error:function(s){
                _this.messages += "<p>ERROR: "+file1+" NOT written</p>\n";
                _this.messages += "<p>ERROR: "+file2+" NOT written</p>\n";
                console.log('error: '+s);
                //for (var key in s) 
                //    console.log('s.'+key+' = '+s.key);
            }
        });
        // NOW remove the form from the container, so can start from scratch
        //  to create a new application:
        $('#form').remove();
        // Also, same thing for the right wrapper.
        $('#rightWrapper').empty();
        $('#rightWrapper').append( $(this.rightWrapper) );
    }
    $("#messages").append($(this.messages));
};



Writer.prototype.processAppData = function(data) {
    // re-initialize
    this.matlabCode = "";
    this.jsRoutine = "";
    this.uniquePlotName = "";
    this.useSubmit = true;  // default
    this.initializeText = "";

    this.numberOfSliders = 0;
    this.steps = [];
    this.minValues = [];
    this.maxValues = [];
    this.initValues = [];
    this.sliderIDs = [];
    this.sliderNames = [];

    this.numberOfEntries = 0;
    this.entryNames = [];
    this.entryMinValues = [];
    this.entryMaxValues = [];
    this.entryDefaultValues = [];

    // keep track of checkbox GROUPS, so can put a <fieldset> around them
    this.numberOfCheckVals = 0;
    this.lastCheckgroupName = "";
    this.checkboxIDs = [];
    this.checkboxVals = [];

    // ONLY need to pass the name of each radio group to writer.php (which
    //  writes the given html code, and also the associated .js file)
    this.numberOfRadiogroups = -1;
    this.radioNames = [];
    this.lastRadioName = "";
    this.lastWidget = "";

    this.xAxisLabel = "";
    this.yAxisLabel = "";
    this.plotTitle = "";

    if (typeof data.matlabCode != 'undefined')
        this.matlabCode = data.matlabCode;
    // Ignore any defined labels/title IF a matlab code is given
    else {
        if (typeof data.xAxisLabel != 'undefined')
            this.xAxisLabel = data.xAxisLabel;
        if (typeof data.yAxisLabel != 'undefined')
            this.yAxisLabel = data.yAxisLabel;
        if (typeof data.plotTitle != 'undefined')
            this.plotTitle = data.plotTitle;
    }
    if (typeof data.javascriptRoutine != 'undefined')
        this.jsRoutine = data.javascriptRoutine;
    if (typeof data.uniquePlotName != 'undefined')
        this.uniquePlotName = data.uniquePlotName;
    if (typeof data.useSubmit != 'undefined')
        this.useSubmit = data.useSubmit;
    if (typeof data.initializeText != 'undefined')
        this.initializeText = data.initializeText;

    var form;  // whether an actual form or not
    if (this.useSubmit) 
        form = "<form id='form' action='javascript:doSubmit()'>\n";
        //form = "<form id='form' action='javascript:doSubmit()'>\n" +
        //"<input type='hidden' value='"+data.matlabCode+
        //"' name='matlabCode'>\n";
    else
        form = "<div id='form'>\n";

    // The matlab code is defined, so remove the table and leave the
    //   stand-alone plot div
    if (this.matlabCode != "") {
        form += "<input type='hidden' value='"+this.matlabCode+
            "' name='matlabCode'>\n";
        $("table").remove();        
    // Otherwise, add any labels to the .html table and delete the stand-alone
    //  plot div.
    } else {
        $("#xAxisLabel").append(this.xAxisLabel);
        $("#yAxisLabel").append(this.yAxisLabel);
        $("#plotTitle").append(this.plotTitle);
        $("#matlab.plot").remove();
    }

    for (var i = 0; i < data.fields.length; i++) {
        var field = data.fields[i];
        var htmlData = this.processFieldInfo(field);
        form += "   "+htmlData.html + "\n";
        if (typeof htmlData.attrs == 'undefined') continue;
        
        for (var j = 0; j < htmlData.attrs.length; j++) {
            var attr = htmlData.attrs[j];
            //$(this.container).css(attr.key,attr.value); // NOT RIGHT!!
        }
    }

    console.log('form = '+form);


    if (this.useSubmit)
        form += "   <input type='submit' value='Submit' name='submit'>\n" +
                "</form>\n";
    else
        form += "</div>\n";

    var $form = $(form);

    console.log('($form).html() = '+($form).html());


    $(this.container).append($form);
    //console.log('$("body").html() = '+$("body").html());

    if (this.matlabCode != "") {
        $(".plot").attr('id','matlab'+this.matlabCode);
    } else {
        $(".plot").attr('id',this.uniquePlotName);
    }
};


Writer.prototype.processFieldInfo = function(fieldData) {
    var htmlData = {};
/*
  Enter a real number:<input name="var1" type="number"/>
  <br>
*/
    htmlData.html = "";
    if (this.lastWidget == "") htmlData.html += "<br>\n";
    //if (fieldData.type === "entry" && 
    //    (fieldData.value === "integer" ||
    //     fieldData.value === "real")) {
    if (fieldData.type === "entry") {
        htmlData.html += this.checkForFieldset();
        if (typeof fieldData.name != 'undefined')
            this.entryNames[this.numberOfEntries] = fieldData.name;
        // NOTE: SHOULD NEVER GET TO THIS ELSE!!!
        else this.entryNames[this.numberOfEntries] = 'var1';
        if (typeof fieldData.min != 'undefined')
            this.entryMinValues[this.numberOfEntries] = fieldData.min;
        else this.entryMinValues[this.numberOfEntries] = 'undefined';
        if (typeof fieldData.max != 'undefined')
            this.entryMaxValues[this.numberOfEntries] = fieldData.max;
        else this.entryMaxValues[this.numberOfEntries] = 'undefined';
        if (typeof fieldData.defaultVal != 'undefined')
            this.entryDefaultValues[this.numberOfEntries] = fieldData.defaultVal;
        else this.entryDefaultValues[this.numberOfEntries] = 'undefined';

        this.numberOfEntries++;

        htmlData.html += fieldData.label;
        htmlData.html += " <input type='number' name='"+
            fieldData.name+"'";
        if (this.useSubmit)
            htmlData.html +="/>\n";
        else
            htmlData.html +=" onchange='"+this.jsRoutine+
            "({"+fieldData.name+":this.value})'/>\n";
        htmlData.html += " <br><br>\n";

        this.lastWidget = "entry";
        // check for any attributes also (later ...)
/* 
  <span>Value 1: </span>
  <div id="slider1" style="width:250px; display:inline-block;"></div>
  <input type="text" id="amount1" name="sliderVal1"
         style="border: 0;" />
  <br>
*/
    } else if (fieldData.type === "slider") {
        htmlData.html += this.checkForFieldset();
        // read step value
        if (typeof fieldData.step != 'undefined')
            this.steps[this.numberOfSliders] = fieldData.step;
        else this.steps[this.numberOfSliders] = 1;
        // read min value
        if (typeof fieldData.min != 'undefined')
            this.minValues[this.numberOfSliders] = fieldData.min;
        else this.minValues[this.numberOfSliders] = 0;
        // read max value
        if (typeof fieldData.max != 'undefined')
            this.maxValues[this.numberOfSliders] = fieldData.max;
        else this.maxValues[this.numberOfSliders] = 100;
        // read initial value (otherwise, set to min value)
        if (typeof fieldData.defaultVal != 'undefined')
            this.initValues[this.numberOfSliders] = fieldData.defaultVal;
        else this.initValues[this.numberOfSliders] = 
            this.minValues[this.numberOfSliders];

        this.sliderIDs[this.numberOfSliders] = fieldData.id;
        this.sliderNames[this.numberOfSliders] = fieldData.name;

        // start slider numbering with '1'
        this.numberOfSliders++;
        htmlData.html += '<span>'+fieldData.label+'  </span>\n';
        htmlData.html += '<div id="slider'+this.numberOfSliders+
            '" style="width:250px; '+
            'display:inline-block;"></div>\n';
        htmlData.html += '<input type="text" id="' +
            fieldData.id+'" name="'+
            fieldData.name+'" style="border: 0;width:50px" />\n';
        htmlData.html += ' <br><br>\n';

        this.lastWidget = "slider";
    } else if (fieldData.type === "checkbox") {
        if (typeof fieldData.name != 'undefined')
            // NOTE: numberOfCheckgroups refers to the number of checkbox
            //  GROUPS (so can put a <fieldset> around them ...
            if (fieldData.name != this.lastCheckgroupName) {
                this.lastCheckgroupName = fieldData.name;
                htmlData.html += this.checkForFieldset();
                htmlData.html += "<fieldset>\n";
            }
        //IMPORTANT: id defaults to value!!
        if (typeof fieldData.id == 'undefined')
            fieldData.id = fieldData.value;

        this.checkboxIDs[this.numberOfCheckVals] = fieldData.id;
        if (fieldData.value != 'undefined') 
            this.checkboxVals[this.numberOfCheckVals] = fieldData.value;
        this.numberOfCheckVals++;        

        htmlData.html += '<input type="checkbox" name="'+fieldData.name+
            '" id="'+fieldData.id+'" value="'+fieldData.value+'"';
        var checked = false;
        if (fieldData.checked != 'undefined')
            checked = fieldData.checked;
        htmlData.html += (checked ? ' checked="checked"/>\n' : '/>\n')

        // NOW add <label for ...>
        htmlData.html += '   <label for="'+fieldData.id+'">'+fieldData.label+
            "</label><br>";

        this.lastWidget = "checkbox";
    } else if (fieldData.type === "radio") {
        if (typeof fieldData.name != 'undefined')
            if (fieldData.name != this.lastRadioName) {
                this.numberOfRadiogroups++;  // STARTING WITH -1
                this.lastRadioName = fieldData.name;
                this.radioNames[this.numberOfRadiogroups] = fieldData.name;
                htmlData.html += this.checkForFieldset();
                htmlData.html += "<fieldset>\n";
            }
        //IMPORTANT: id defaults to value!!
        if (typeof fieldData.id == 'undefined')
            fieldData.id = fieldData.value;

        htmlData.html += '<input type="radio" name="'+fieldData.name+
            '" id="'+fieldData.id+'" value="'+fieldData.value+'"';
        var checked = false;
        if (fieldData.checked != 'undefined')
            checked = fieldData.checked;
        htmlData.html += (checked ? ' checked="checked"/>\n' : '/>\n')

        // NOW add <label for ...>
        htmlData.html += '   <label for="'+fieldData.id+'">'+fieldData.label+
            "</label><br>";

        this.lastWidget = "radio";
    }

    // check for any attributes also (later ...)
    return htmlData;
};


Writer.prototype.checkForFieldset = function() {
    var htmlLine = "";
    if (this.lastWidget == "checkbox" || this.lastWidget == "radio")
        htmlLine += "</fieldset>\n<br>\n";
    return htmlLine;
};


(function($){
    $.fn.Writer = function(options){
        var settings = {
            path         : "/writer/",
            inputFile    : "setup.txt"
        };
        if ( options ) { 
            $.extend( settings, options );
        }
        
        addStyle(settings.path);
        return this.each(function(){
            var cp = new Writer()
                .init(
                    this,
                    settings.path,
                    settings.inputFile
                );
        });
        function addStyle(path){
            if ( $.fn.Writer.StyleReady ){
                return;
            }
            $.fn.Writer.StyleReady = true;
            var arrStyle = [
                "<style type='text/css'>",
/*
changed "ec-comment" to "writer":

            ".writer-pane{position:relative; padding-left:20px; margin:5px 0; overflow:auto}",
            ".writer-pane div.ec-total{font:1.3em Georgia; height:24px; line-height:24px}",
            ".writer-pane div.ec-paging{height:30px; line-height:30px;text-align:right;}",
            ".writer-pane div.ec-paging>button{font:13px arial;height:30px; line-height:30px;margin-right:10px;}",
            ".writer-pane ul.writer-list{position:relative; font-family:'Lucida Grande',sans-serif; font-size:14px; line-height:16px; list-style-type:none; padding:0px; background-color:#FFF; border:0px solid #14a1cc; border-radius:12px; overflow:auto}",
            ".writer-pane ul.writer-list li.writer{position:relative; min-height:48px; min-width:48px; padding:4px 4px 12px 56px; margin-bottom:8px; border-radius:4px; font-size:9pt arial}",
            ".writer-pane ul.writer-list li.writer:last-child{border:none; padding-bottom:0px}",
            ".writer-pane ul.writer-list li.writer button{font:11px arial}",
            ".writer-pane ul.writer-list li.writer a, ",
            ".writer-pane ul.writer-list li.writer .author{font-weight:bold; color:#2276bb; text-decoration:none}",
            ".writer-pane ul.writer-list li.writer a:hover{text-decoration:underline}",
            ".writer-pane ul.writer-list li.writer div.avatar{position:absolute; top:0px; left:0px; width:48px; height:48px; border:none; margin-top:6px; margin-left:2px; border-radius:4px; text-overflow:ellipsis; background:url(" + path + "writer.png)}",
            ".writer-pane ul.writer-list li.writer span.user-name{font-weight:bold; margin-right:0.5em; text-overflow:ellipsis}",
            ".writer-pane ul.writer-list li.writer span.comment-time{font-size:11px; color:#999; line-height:16px; text-overflow:ellipsis}",
            ".writer-form{font:1em Georgia}",
            ".writer-form form{margin:0; padding:0}",
            ".writer-form form input, .writer-form form textarea, .writer-form form button{font:1em arial}",
            ".writer-form fieldset{ background:-webkit-gradient(linear,0 0,0 bottom,from(#ffffff),to(#dddddd));  background:-moz-linear-gradient(#ffffff,#dddddd);  background:linear-gradient(#ffffff,#dddddd);  filter :progid:DXImageTransform.Microsoft.Gradient(GradientType=0,startColorstr=#ffffff,endColorstr=#dddddd)}",
            ".writer-form fieldset legend{ background:-webkit-gradient(linear,0 0,0 bottom,from(#ffffff),to(#dddddd));  background:-moz-linear-gradient(#ffffff,#dddddd);  background:linear-gradient(#ffffff,#dddddd);  filter :progid:DXImageTransform.Microsoft.Gradient(GradientType=0,startColorstr=#ffffff,endColorstr=#dddddd);  padding:0px 5px;  border-radius:6px;  border:1px solid #ccc}",
            ".writer-form .title{ color:#444;  line-height:30px}",
            ".writer-form fieldset{ border-radius:6px}",
            ".writer-form fieldset fieldset{ border:none;  background:none;  filter:none}",
            ".writer-form fieldset fieldset legend{ background:none;  border:none;  filter:none}",
            ".writer-reply-form{position:absolute; left:0px; top:0px; height:400px}",
            ".writer-reply-form div.close_button{ position:absolute;  right:-18px; top:-18px;  width:36px; height:36px;  background:url(" + path + "ec-close_box.png) no-repeat;  cursor:pointer}",
*/
                "</style>"
            ];
            $(arrStyle.join("")).appendTo("head");
        }
    };
})(jQuery);
