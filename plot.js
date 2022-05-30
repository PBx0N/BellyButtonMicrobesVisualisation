//Use updatePlotly2 and updateDemoInfo functions to update the charts when select the id in the dropdown menu
function optionChanged(id) {
    updatePlotly2(id);
    updateDemoInfo(id)
  };
  
  //Create init() function to load the page using the first dropdown 
  function init() {
    d3.json("https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json").then((data) => {
        
        //Create array for all ID names
        var names = data.samples.map(x=>x.id)

        //Append each id as an option in the dropdown
        names.forEach(function(name) {
            d3.select("#selDataset")
                .append("option")
                .text(name);
            });

    //Create arrays for sample_values, otu_ids, and otu_labels
    var sample_values = data.samples.map(x=> x.sample_values);
    var otu_ids = data.samples.map(x=> x.otu_ids);
    var otu_labels = data.samples.map(x=> x.otu_labels);
    
    //Slice data to get the top 10 OTUs
    var sorted_test = sample_values.sort(function(a, b){return b-a});
    var top_ten = sorted_test.map(x => x.slice(0, 10));
    var sorted_ids = otu_ids.sort(function(a, b){return b-a});
    var top_ids = sorted_ids.map(x =>x.slice(0, 10));
    var sorted_labels = otu_labels.sort(function(a, b){return b-a});
    var top_labels = sorted_labels.map(x =>x.slice(0, 10));
  
    //Display the first ID on the html page
    var firstID = data.metadata[0]
    var sample_Metadata1 = d3.select("#sample-metadata").selectAll("h1")
    
    // Display the first ID's demographic info
    var sample_Metadata = sample_Metadata1.data(d3.entries(firstID))
    sample_Metadata.enter()
                    .append("h1")
                    .merge(sample_Metadata)
                    .text(d => `${d.key} : ${d.value}`)
                    .style("font-size","12px")
  
    sample_Metadata.exit().remove()
    
    //1. Plot Bar Chart
    
    //Create bar chart trace
    var trace1 = {
        x : top_ten[0],
        y : top_ids[0].map(x => "OTU" + x),
        text : top_labels[0],
        type : "bar",
        orientation : "h",
        transforms: [{
            type: "sort",
            target: "y",
            order: "descending"
        }]
    };
    
    //Create bar chart layout
    var layout1 = {
        title : "<b>Top 10 OTUs</b>"
    };
  
    //Create bar chart
    var data = [trace1];
    var config = {responsive:true}
    Plotly.newPlot("bar", data, layout1, config);
  
  
    //2. Plot Bubble Chart

    //Create bubble chart trace
    var trace2 = {
        x : otu_ids[0],
        y : sample_values[0],
        text : otu_labels[0],
        mode : "markers",
        marker : {
            color : otu_ids[0],
            size : sample_values[0]
        }
    };
  
    //Create bubble chart layout
    var layout2 = {
        title: "<b>Bubble Chart</b>",
        automargin: true,
        autosize: true,
        showlegend: false,
        margin: {
                l: 150,
                r: 50,
                b: 50,
                t: 50,
                pad: 4
              }
    };
    var config = {responsive:true}
  
    //Create the bubble chart
    var data2 = [trace2];
    Plotly.newPlot("bubble", data2, layout2, config);
  
  
    //3. Plot Weekly Gauge Chart
  
    //Get the first ID's washing frequency
    var first_wash_freq = firstID.wfreq;
  
    //Calculations for gauge pointer
    var first_wash_freq_degree = first_wash_freq * 20;
    var degrees = 180 - first_wash_freq_degree;
    var radius = 0.5;
    var radians = (degrees * Math.PI) / 180;
    var x = radius * Math.cos(degrees * Math.PI / 180);
    var y = radius * Math.sin(degrees * Math.PI / 180);
  
    //Create path for gauge pointer
    var path1 = (degrees < 45 || degrees > 135) ? 'M -0.0 -0.025 L 0.0 0.025 L ' : 'M -0.025 -0.0 L 0.025 0.0 L ';
    var mainPath = path1,
     pathX = String(x),
     space = " ",
     pathY = String(y),
     pathEnd = " Z";
    var path = mainPath.concat(pathX, space, pathY, pathEnd);
  
    //Create trace for gauge chart and pointer
    var dataGauge = [
        {
          type: "scatter",
          x: [0],
          y: [0],
          marker: { size: 12, color: "850000" },
          showlegend: false,
          name: "Freq",
          text: first_wash_freq,
          hoverinfo: "text+name"
        },
        {
          values: [50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50],
          rotation: 90,
          text: ["8-9", "7-8", "6-7", "5-6", "4-5", "3-4", "2-3", "1-2", "0-1", ""],
          textinfo: "text",
          textposition: "inside",
          marker: {
            colors: [
              "rgba(0, 105, 11, .5)",
              "rgba(10, 120, 22, .5)",
              "rgba(14, 127, 0, .5)",
              "rgba(110, 154, 22, .5)",
              "rgba(170, 202, 42, .5)",
              "rgba(202, 209, 95, .5)",
              "rgba(210, 206, 145, .5)",
              "rgba(232, 226, 202, .5)",
              "rgba(240, 230, 215, .5)",
              "rgba(255, 255, 255, 0)"
            ]
          },
          labels: ["8-9", "7-8", "6-7", "5-6", "4-5", "3-4", "2-3", "1-2", "0-1", ""],
          hoverinfo: "label",
          hole: 0.5,
          type: "pie",
          showlegend: false
        }
      ];
  
    //Create gauge chart layout
    var layoutGauge = {
        shapes: [
          {
            type: "path",
            path: path,
            fillcolor: "850000",
            line: {
              color: "850000"
            }
          }
        ],
        title: "<b>Belly Button Washing Frequency</b> <br> Scrubs per Week",
        xaxis: {
          zeroline: false,
          showticklabels: false,
          showgrid: false,
          range: [-1, 1]
        },
        yaxis: {
          zeroline: false,
          showticklabels: false,
          showgrid: false,
          range: [-1, 1]
        }
      };
      var config = {responsive:true}
      
      //Plot the gauge chart
      Plotly.newPlot('gauge', dataGauge,layoutGauge,config);
    
  
    }); 
  
    //Close d3.json
  
  }; 
  //Close init() function
  
  
  //Call init function so page loads on the first ID selection
  init();
  
  
  //Update the bar chart and bubble chart

  function updatePlotly2(id) {
    d3.json("https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json").then((data) => {
        
      //Get the sample data for the selected ID in the dropdown menu

        var test = data.samples.filter(x => x.id === id);
  
        //Get the top 10 values
        var sample_values = test.map(x => x.sample_values).sort(function(a, b){return b-a});
        var top_values = sample_values.map(x => x.slice(0,10));
  
        //Get the top 10 IDs
        var otu_ids = test.map(x=> x.otu_ids).sort(function(a, b){return b-a});
        var top_ids = otu_ids.map(x => x.slice(0,10));
  
        //Get the top 10 labels
        var otu_labels = test.map(x=> x.otu_labels).sort(function(a, b){return b-a});
        var top_labels = otu_labels.map(x => x.slice(0,10));
  
        //1. Plot a horizontal bar chart
  
        //Create bar chart trace
        var trace = {
            x : top_values[0],
            y : top_ids[0].map(x => "OTU" + x),
            text : top_labels[0],
            type : "bar",
            orientation : "h",
            transforms: [{
                type: "sort",
                target: "y",
                order: "descending"
              }]
        };
  
        //Create bar chart layout
        var layout1 = {
            title: "<b>Top 10 OTUs</b>"
        };
        var data1 = [trace];
        var config = {responsive:true}
  
        //Plot bar chart

        Plotly.newPlot("bar", data1, layout1, config);
  
  
        //2. Plot a bubble chart

        //Create bubble chart trace
        var trace2 = {
            x : test.map(x=> x.otu_ids)[0],
            y : test.map(x => x.sample_values)[0],
            text : test.map(x=> x.otu_labels),
            mode : "markers",
            marker : {
                color : test.map(x=> x.otu_ids)[0],
                size : test.map(x => x.sample_values)[0]
            }   
        };
  
        // Create bubble chart layout
        var layout2 = {
            title: "<b>Bubble Chart</b>",
            automargin: true,
            autosize: true,
            showlegend: false,
            margin: {
                l: 150,
                r: 50,
                b: 50,
                t: 50,
                pad: 4
              }
        };
  
        //Plot bubble chart using Plotly
        var data2 = [trace2];
        var config = {responsive:true}
        Plotly.newPlot("bubble", data2, layout2, config)
    });
  };
  
  //Update the demographic information and gauge chart when a new ID is selected
  function updateDemoInfo(id) {
    d3.json("https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json").then((data) => {
  
        //Filter for the selected ID
        var metadataSamples = data.metadata.filter(x => x.id === +id)[0];
  
        //Get the demographic information for the selected ID
        var sampleMetadata1 = d3.select("#sample-metadata").selectAll('h1')
        var sampleMetadata = sampleMetadata1.data(d3.entries(metadataSamples))
        sampleMetadata.enter().append('h1').merge(sampleMetadata).text(d => `${d.key} : ${d.value}`).style('font-size','12px');
  
        //Get the wash frequency for the current ID            
        var wFreq = metadataSamples.wfreq;
        var wFreqDeg = wFreq * 20;
  
        //Calculations for gauge pointer
        var degrees = 180 - wFreqDeg;
        var radius = 0.5;
        var radians = (degrees * Math.PI) / 180;
        var x = radius * Math.cos(degrees * Math.PI / 180);
        var y = radius * Math.sin(degrees * Math.PI / 180);
  
        //Path for gauge pointer
        var path1 = (degrees < 45 || degrees > 135) ? 'M -0.0 -0.025 L 0.0 0.025 L ' : 'M -0.025 -0.0 L 0.025 0.0 L ';
        var mainPath = path1,
        pathX = String(x),
        space = ' ',
        pathY = String(y),
        pathEnd = ' Z';
        var path = mainPath.concat(pathX,space,pathY,pathEnd);
  
        //Create gauge plot trace
        var dataGauge = [
            {
            type: "scatter",
            x: [0],
            y: [0],
            marker: { size: 12, color: "850000" },
            showlegend: false,
            name: "Freq",
            text: wFreq,
            hoverinfo: "text+name"
            },
            {
            values: [50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50],
            rotation: 90,
            text: ["8-9", "7-8", "6-7", "5-6", "4-5", "3-4", "2-3", "1-2", "0-1", ""],
            textinfo: "text",
            textposition: "inside",
            marker: {
                colors: [
                "rgba(0, 105, 11, .5)",
                "rgba(10, 120, 22, .5)",
                "rgba(14, 127, 0, .5)",
                "rgba(110, 154, 22, .5)",
                "rgba(170, 202, 42, .5)",
                "rgba(202, 209, 95, .5)",
                "rgba(210, 206, 145, .5)",
                "rgba(232, 226, 202, .5)",
                "rgba(240, 230, 215, .5)",
                "rgba(255, 255, 255, 0)"
                ]
            },
            labels: ["8-9", "7-8", "6-7", "5-6", "4-5", "3-4", "2-3", "1-2", "0-1", ""],
            hoverinfo: "label",
            hole: 0.5,
            type: "pie",
            showlegend: false
            }
        ];
        
        //Create gauge plot layout
        var layoutGauge = {
            shapes: [
            {
                type: "path",
                path: path,
                fillcolor: "850000",
                line: {
                color: "850000"
                }
            }
            ],
            title: "<b>Belly Button Washing Frequency</b> <br> Scrubs per Week",
            xaxis: {
            zeroline: false,
            showticklabels: false,
            showgrid: false,
            range: [-1, 1]
            },
            yaxis: {
            zeroline: false,
            showticklabels: false,
            showgrid: false,
            range: [-1, 1]
            }
        };
        var config = {responsive:true}
  
        //Plot the new gauge chart
        Plotly.newPlot("gauge", dataGauge, layoutGauge, config);
  
    });
  };