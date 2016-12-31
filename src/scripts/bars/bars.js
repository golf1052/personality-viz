var selectionSectionHeight = chartHeight / 10;
var chartGroupHeight = chartHeight - selectionSectionHeight;
var chartGroup = svg.append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
var selectionGroup = svg.append('g')
  .attr('transform', 'translate(' + margin.left + ',' + (chartGroupHeight + margin.top + 10) + ')');

let selectedCategory = '';
let selectedFacet = '';

var xScale = d3.scaleBand().domain(namesList).range([0, chartWidth]);
var yScale = d3.scaleLinear().domain([100, 0]).range([0, chartGroupHeight]);
var xAxis = d3.axisBottom(xScale);
var yAxis = d3.axisLeft(yScale);
var xAxisGroup = chartGroup.append('g')
  .attr('class', 'axis axis--x')
.attr('transform', 'translate(0,' + chartGroupHeight + ')');
var yAxisGroup = chartGroup.append('g')
  .attr('class', 'axis axis--y');

function loadBarsPage() {
  selectionSectionHeight = chartHeight / 10;
  chartGroupHeight = chartHeight - selectionSectionHeight;
  chartGroup = svg.append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
  selectionGroup = svg.append('g')
    .attr('transform', 'translate(' + margin.left + ',' + (chartGroupHeight + margin.top + 10) + ')');
  selectedCategory = '';
  selectedFacet = '';
  xScale = d3.scaleBand().domain(namesList).range([0, chartWidth]);
  yScale = d3.scaleLinear().domain([100, 0]).range([0, chartGroupHeight]);
  xAxis = d3.axisBottom(xScale);
  yAxis = d3.axisLeft(yScale);
  xAxisGroup = chartGroup.append('g')
    .attr('class', 'axis axis--x')
    .attr('transform', 'translate(0,' + chartGroupHeight + ')');
  yAxisGroup = chartGroup.append('g')
    .attr('class', 'axis axis--y');
}

drawDashedChartLines(chartGroup, yScale, chartWidth);

xAxisGroup.call(xAxis);
yAxisGroup.call(yAxis);

allDataPromise.then(function(allData) {
  drawInitial();
});

var data = [];

function drawInitial() {
  xScale.padding([0.2]);
  xAxisGroup.call(xAxis);
}

function drawCategoryData(category) {
  data = pullOutCategoryData(category);
  xScale.padding([0.2]);
  drawFacetNames(category);
  drawRectGroups(data);
}

function drawFacetData(category, facet) {
  let data = pullOutFacetData(category, facet);
  xScale.padding([0.2]);
  drawRectGroups(data);
}

function drawRectGroups(data) {
  var rectGroups = chartGroup.selectAll('.groups').data(data, function(d) {
    return d.name;
  });
  rectGroups.exit().remove();
  var enteringRectGroups = rectGroups.enter().append('g')
    .attr('class', 'groups')
    .attr('transform', function(d) {
      return 'translate(' + xScale(d.name) + ',' + (0) + ')';
    });
  rectGroups.selectAll('rect')
    .data(function(d) {
      return d.dates;
    }, function(d) {
      return d.date;
    })
    .transition()
    .duration(function() {
      return getRandomInteger(500, 1000);
    })
    .attr('y', function(d) {
      return yScale(d.value);
    })
    .attr('width', function(d, i) {
      return d.scale.bandwidth() * (d.length - i);
    })
    .attr('height', function(d) {
      return chartGroupHeight - yScale(d.value);
    });
  enteringRectGroups.selectAll('rect')
    .data(function(d) {
      return d.dates;
    }, function(d) {
      return d.date;
    })
    .enter().append('rect')
      .attr('x', 0)
      .attr('fill', function(d) {
        var color = d3.color(d.color);
        return color + '';
      })
      .attr('stroke-width', 1)
      .attr('stroke', 'black')
      .attr('y', function(d) {
        return yScale(0);
      })
      .attr('width', function(d, i) {
        return d.scale.bandwidth() * (d.length - i);
      })
      .attr('height', function(d) {
        return chartGroupHeight - yScale(0);
      })
      .transition()
      .duration(function() {
        return getRandomInteger(500, 1000);
      })
      .attr('y', function(d) {
        return yScale(d.value);
      })
      .attr('width', function(d, i) {
        // the most horrible of hacks. z-index is specified by the order things are drawn  in (SVG man).
        // since the last thing drawn is the widest bar we have to try to draw the widest bar first
        // and then shrink bar width, however we don't know the size of the data array in here so
        // we put it inside this object earlier on so we can access it...
        return d.scale.bandwidth() * (d.length - i);
      })
      .attr('height', function(d) {
        return chartGroupHeight - yScale(d.value);
      });
}

function pullOutFacetData(category, facet) {
  let values = [];
  for (var name in names) {
    let o = {
      name: '',
      dates: []
    };
    for (let i = 0; i < names[name].data.reports.length; i++) {
      let overallData = names[name].data.reports[i];
      o.name = names[name].data.name;
      overallData.results.forEach(function(cat) {
        if (cat.category == category) {
          Object.keys(cat.facets).forEach(function(key) {
            if (key == facet) {
              o.dates.push({
                date: overallData.date,
                value: cat.facets[key],
                color: overallData.color
              });
            }
          });
        }
      });
    }
    for (let i = 0; i < o.dates.length; i++) {
      o.dates[i].scale = d3.scaleBand()
        .domain(o.dates.map(function(date) {
          return date.date;
        }))
        .range([0, xScale.bandwidth()]);
      o.dates[i].length = o.dates.length;
    }
    values.push(o);
  }
  return values;
}

// really uninventive name zzz
function pullOutCategoryData(category) {
  var values = [];
  for (var name in names) {
    // o for object, perfect!
    // this represents is a category object with a score and date array inside it
    var o = {
      name: '',
      dates: []
    };
    for (var i = 0; i < names[name].data.reports.length; i++) {
      var overallData = names[name].data.reports[i];
      o.name = names[name].data.name;
      overallData.results.forEach(function(cat) {
        if (cat.category == category) {
          o.dates.push({
            date: overallData.date,
            value: cat.score,
            color: overallData.color
          });
        }
      });
    }
    for (var i = 0; i < o.dates.length; i++) {
      o.dates[i].scale = d3.scaleBand()
        .domain(o.dates.map(function(date) {
          return date.date;
        }))
        .range([0, xScale.bandwidth()]);
      o.dates[i].length = o.dates.length;
    }
    values.push(o);
  }
  return values;
}

function drawFacetNames(category) {
  let facetNames = pullOutFacetNames(category);
  facetNames.unshift('Overall');
  let spans = d3.select('#facetsDiv').selectAll('span').data(facetNames, function(d) {
    return d;
  });
  spans.exit().remove();
  spans.attr('class', function(d, i) {
    if (i == 0) {
      return 'underline';
    }
    else {
      return '';
    }
  });
  spans.enter().append('span')
    .attr('class', function(d, i) {
      if (i == 0) {
        return 'underline';
      }
      else {
        return '';
      }
    })
    .text(function(d) {
      return d;
    })
    .on('click', function(d) {
      d3.selectAll('span').each(function() {
        d3.select(this).classed('underline', false);
      });
      d3.select(this).classed('underline', true);
      if (d == 'Overall') {
        drawCategoryData(selectedCategory);
      }
      else {
        drawFacetData(selectedCategory, d);
      }
    });
}

d3.select('#categoriesSelect').on('change', function() {
  var value = d3.select('#categoriesSelect').property('value');
  selectedCategory = value;
  if ( value == '') {
    drawInitial();
  }
  else {
    drawCategoryData( value );
  }
});
