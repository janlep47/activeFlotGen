
        How To Create web pages with interactive plots:

- From a browser, invoke <your-webserver>writer.html.  This will read
  setup.txt and create the application files.  A list of files either
  written OK or NOT written OK is displayed in the browser window.  If
  files not written OK, probably because the subdirectory was already
  created without write rights for the server.  (Just remove the
  subdirectory, and writer will create it with UNIVERSAL rights).

- Have an array of application data in JSON format, in the file
  "setup.txt".  This file should be in the main directory.  Each array
  element (object) describes one application.

- Each application will create/write to a dedicated subdirectory, and
  write 2 files: a .html file and a coordinated .js file.  You will
  need to copy over to that directory EITHER matlabPlot.php or
  plotLibrary.js - depending on whether it is a Matlab plot of a "flot"
  plot - if that file is not already there.

- File naming: the file names will be either:
       <uniquePlotName>.html  and widgets<uniquePlotName>.js (for
       "flot" plots)
   OR
       matlab<matlabCode>.html and widgets<matlabCode>.js (for matlab plots)

- Each application element (object) has the following (possible)
  attributes:

  javascriptRoutine:
        The name of the routine in plotLibrary.js that is to be called
        to create the plot ("flot" case).  DOESN'T apply to Matlab
        plots

  uniquePlotName:
        A unique name for this plot.  Only for "flot" plots. DOESN'T
        apply to Matlab plots

  matlabCode:
        A unique "code" which Matlab can use to generate the desired
        plot.  DOESN'T apply to "flot" plots.

  xAxisLabel:
        Label for the x-axis. DOESN'T apply to Matlab plots.

  yAxisLabel:
        Label for the y-axis. DOESN'T apply to Matlab plots.

  plotTitle:
        Label for the plot.  Currently DOESN'T apply to Matlab
        plots. BUT IT SHOULD

  initializeText:
        A string of line(s) of javascript code you want to have in the
        initialization section of the widgets<xxx>.js file.  This is
        probably kind of stupid, since you can just add it later to
        the widgets<xxx>.js file by editing.

  useSubmit:
        True or False.  If false, it means the plot will be generated
        whenever a change is noted in entries, etc.  If true, the user
        must press the submit button to send the data to the plotter
        (either plotLibrary -> flot, or matlabPlot.php -> matlab).  

        Potential problems: I might be doing sliders such that ANY
        time they change, the plotter is always invoked(?) or maybe it's just
        that way for the "flot" case(?).  Also, I might be assuming
        useSubmit is true for the Matlab case; actually it should be
        flexible for both the Matlab and "flot" cases.

  fields: 
       An array of data entry widgets needed for each application:

       type:
          Either "entry", "slider", "checkbox", or "radio"

       name:
          Only used by checkboxes and radio buttons.  IT'S THE WAY TO
          GROUP related checkboxes and radio button groups.  (See
          setup6.txt for examples).

       id:
          Important to give for sliders, checkboxes, and radio
          buttons.  SHOULD BE UNIQUE for each slider, checkbox and
          radio button.  Not used (currently) for entry(s).

       defaultVal:
          Only applies to entry(s) and sliders.

       label:
          The label to have with the GUI widget.  (can click on the
          label for checkboxes and radio buttons, to toggle the check).

       min:
          Only applies to entry(s) and sliders.

       max:
          Only applies to entry(s) and sliders.

       step:
          Only applies to sliders.

       value:
          Only applies to checkboxes and radio buttons.

       checked:
          true/false  Only applies to checkboxes and radio buttons.


See setup.txt and setup6.txt for examples.



