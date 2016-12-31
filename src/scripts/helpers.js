function loadData(fileName) {
  let url = 'http://personality-viz.golf1052.com:3000/data/' + fileName + '.json';
  return new Promise(function(resolve, reject) {
    d3.json(url, function(error, data) {
      if (error) {
        reject(error);
      }
      resolve(data);
    })
  })
}

// loads data from the name endpoint into the names.name object
// ahhh this is a promise
function loadDataIntoName( name ) {
  return new Promise(function(resolve, reject) {
    loadData(name).then(data => {
      names[name].data = data;
      let onColor = 900;
      names[name].color = d3.color(materialColors[names[name].color_name]['500']);
      for (var i = 0; i < names[name].data.reports.length; i++) {
        var d = names[name].data.reports[i];
        d.color = d3.color(materialColors[names[name].color_name][onColor.toString()]);
        onColor -= 200;
      }
      resolve();
    });
  })
}

function loadMaterialColors() {
  return new Promise(function(resolve, reject) {
      loadData('material').then(data => {
      materialColors = data;
      resolve();
    });
  });
}

function loadReportText() {
  return new Promise(function(resolve, reject) {
    loadData('report_text').then(data => {
      reportText = data;
      resolve();
    });
  });
}

function pullOutFacetNames(category) {
  var facets = [];
  names.participant_1.data.reports[0].results.forEach(function(data) {
    if (data.category == category) {
      facets = Object.keys(data.facets);
    }
  });
  return facets;
}

// Returns a random number between min (inclusive) and max (exclusive)
function getRandomNumber(min, max) {
  return Math.random() * (max - min) + min;
}

function getRandomInteger(min, max) {
  return Math.floor(getRandomNumber(min, max));
}

// Draws two dashed lines in the given element (chart) with their heights being specified by the
// given y scale (ysScale function) and their width by the given chart width (chartWidth)
function drawDashedChartLines(chart, yScale, chartWidth) {
  chart.append('line')
    .attr('x1', 0)
    .attr('y1', function() {
      return yScale(30);
    })
    .attr('x2', chartWidth)
    .attr('y2', function() {
      return yScale(30);
    })
    .attr('stroke', 'black')
    .attr('stroke-width', 1)
    .attr('stroke-dasharray', '6, 3');
  
  chart.append('line')
    .attr('x1', 0)
    .attr('y1', function() {
      return yScale(70);
    })
    .attr('x2', chartWidth)
    .attr('y2', function() {
      return yScale(70);
    })
    .attr('stroke', 'black')
    .attr('stroke-width', 1)
    .attr('stroke-dasharray', '6, 3');
}

function drawColumnBorders(chartGroup, columnNames, xScale, yScale) {
  let lineGroups = chartGroup.selectAll('.border').data(columnNames, function(d) {
    return d;
  });
  let exitingLineGroup = lineGroups.exit();
  // immediately remove the tops because they look weird if they stick around
  exitingLineGroup.selectAll('.top').remove();

  // then transition out the left and right lines, with the right line going out slightly slower
  exitingLineGroup.select('.left-line')
    .transition()
    .duration(250)
    .attr('y1', function(d) {
      return yScale(0);
    });
  exitingLineGroup.select('.right-line')
    .transition()
    .duration(500)
    .attr('y1', function(d) {
      return yScale(0);
    });
  
  // also need to put a transition on the remove itself
  exitingLineGroup.transition().duration(500).remove();

  // now bring in any additional lines
  let lineGroup = lineGroups.enter().append('g')
    .attr('class', 'border')
    .attr('transform', function(d) {
      return 'translate(' + xScale(d) + ',0)';
    });
  lineGroup.append('line')
    .attr('class', 'left-line')
    .attr('x1', 0)
    .attr('y1', function(d) {
      return yScale(100);
    })
    .attr('x2', 0)
    .attr('y2', function(d) {
      return yScale(0);
    })
    .attr('stroke', '#000000')
    .attr('stroke-width', 1);
  lineGroup.append('line')
    .attr('class', 'top')
    .attr('x1', -3)
    .attr('y1', function(d) {
      return yScale(100);
    })
    .attr('x2', 3)
    .attr('y2', function(d) {
      return yScale(100);
    })
    .attr('stroke', '#000000')
    .attr('stroke-width', 1);
  lineGroup.append('line')
    .attr('class', 'right-line')
    .attr('x1', xScale.bandwidth())
    .attr('y1', function(d) {
      return yScale(100);
    })
    .attr('x2', xScale.bandwidth())
    .attr('y2', function(d) {
      return yScale(0);
    })
    .attr('stroke', '#000000')
    .attr('stroke-width', 1);
  lineGroup.append('line')
    .attr('class', 'top')
    .attr('x1', xScale.bandwidth() - 3)
    .attr('y1', function(d) {
      return yScale(100);
    })
    .attr('x2', xScale.bandwidth() + 3)
    .attr('y2', function(d) {
      return yScale(100);
    })
    .attr('stroke', '#000000')
    .attr('stroke-width', 1);
}

function pullOutSelectionData() {
  var values = [];
  for (var prop in names) {
    values.push({
      key: names[prop].data.name,
      color: names[prop].color,
      image: names[prop].image
    });
  }
  return values;
}

function switchPages(page) {
  if (page == 'index') {
    
  }
}
