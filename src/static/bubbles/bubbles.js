'use strict';

var selectionSectionWidth = chartWidth / 15;
var chartGroupWidth = chartWidth - selectionSectionWidth;
var chartGroup = svg.append('g').attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
var selectionGroup = svg.append('g').attr('transform', 'translate(' + (chartGroupWidth + margin.right) + ',0)');

var x = d3.scaleBand().range([0, chartGroupWidth]);

var y = d3.scaleLinear().domain([100, 0]).range([0, chartHeight]);
var xAxis = d3.axisBottom(x);
var yAxis = d3.axisLeft(y);
var xG = chartGroup.append('g').attr('class', 'axis axis--x').attr('transform', 'translate(0,' + chartHeight + ')');
var yG = chartGroup.append('g').attr('class', 'axis axis--y');

var circleRadius = 7;

drawDashedChartLines(chartGroup, y, chartGroupWidth);

xG.call(xAxis);
yG.call(yAxis);

allDataPromise.then(function (allData) {
  // first enter the data and append a group for the rectangle and text, set the id attribute so
  // we can refer to it later (not inside the enter), also translate appropriately
  var selectGroup = selectionGroup.selectAll('g').data(pullOutSelectionData()).enter().append('g').attr('id', function (d) {
    return d.key;
  }).attr('transform', function (d, i) {
    return 'translate(0,' + (10 + i * 75) + ')';
  });
  // now append the rect to the group
  var selectRects = selectGroup.append('rect').attr('x', 0).attr('y', function (d, i) {
    return 0;
  }).attr('width', 50).attr('height', 50).attr('rx', 10).attr('ry', 10).attr('fill', function (d) {
    return d.color;
  });
  selectGroup.append('image').attr('xlink:href', function (d) {
    return d.image;
  }).attr('width', 40).attr('height', 40).attr('x', 5).attr('y', 5);
  // now append text to the group (so we know what person the rectangle is referring to)
  selectGroup.append('text').attr('x', 50 + 10).attr('y', function (d, i) {
    return 30;
  }).attr('font-size', 14).attr('fill', 'black').text(function (d) {
    return shortParticipantName(d.key);
  });
  drawInitial();
});

var data = [];

function drawInitial() {
  data = pullOutInitialCategoryData();
  x.domain(categories);
  x.padding([0.2]);
  drawData(data, categories);
}

function pullOutInitialCategoryData() {
  var values = [];
  for (var name in names) {
    for (var i = 0; i < names[name].data.reports.length; i++) {
      var overallData = names[name].data.reports[i];
      overallData.results.forEach(function (data) {
        var columnOrder = 0;
        for (var _i = 0; _i < categories.length; _i++) {
          if (data.category == categories[_i]) {
            columnOrder = _i;
          }
        }
        values.push({
          key: data.category,
          date: overallData.date,
          value: data.score,
          color: names[name].color,
          columnOrder: columnOrder
        });
      });
    }
  }
  return values;
}

function drawCategories(category) {
  var facets = pullOutFacetNames(category);
  data = pullOutCategoryData(category);
  x.domain(facets);
  x.padding([0.2]);

  d3.selectAll('.date').each(function (d) {
    if (d == 'All') {
      d3.select(this).select('input').property('checked', true);
    } else {
      d3.select(this).select('input').property('checked', false);
    }
  });

  drawData(data, facets);
}

function drawData(data, columnNames) {
  var dates = pullOutDates(data);
  dates.unshift('All');
  drawDateInputs(dates);

  drawColumnBorders(chartGroup, columnNames, x, y);

  var circles = chartGroup.selectAll('circle').data(data, function (d) {
    var colorString = d.color + '';
    return d.columnOrder + d.date + colorString;
  });
  var circleRadius = 7;
  circles.exit().transition().duration(function () {
    return getRandomInteger(500, 100);
  }).attr('r', 0).remove();
  circles.enter().append('circle').attr('cy', function (d) {
    return y(0);
  }).attr('cx', function (d) {
    var val = x(d.key);
    var halfBand = x.bandwidth() / 2;
    val += halfBand;
    return getRandomNumber(val - halfBand + circleRadius, val + halfBand - circleRadius);
  }).attr('fill', function (d) {
    var color = d3.color(d.color);
    color.opacity = 0.8;
    return color + '';
  }).merge(circles).transition().duration(function () {
    return getRandomNumber(500, 1500);
  }).attr('r', circleRadius).attr('cx', function (d) {
    var val = x(d.key);
    var halfBand = x.bandwidth() / 2;
    val += halfBand;
    return getRandomNumber(val - halfBand + circleRadius, val + halfBand - circleRadius);
  }).attr('cy', function (d) {
    return y(d.value);
  });

  xG.call(xAxis);
}

function pullOutCategoryData(category) {
  var values = [];
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    var _loop = function () {
      var name = _step.value;

      for (i = 0; i < names[name].data.reports.length; i++) {
        overallData = names[name].data.reports[i];

        overallData.results.forEach(function (cat) {
          if (cat.category == category) {
            for (var _i2 = 0; _i2 < Object.keys(cat.facets).length; _i2++) {
              var key = Object.keys(cat.facets)[_i2];
              values.push({
                key: key,
                date: overallData.date,
                value: cat.facets[key],
                color: names[name].color,
                columnOrder: _i2
              });
            }
          }
        });
      }
    };

    for (var _iterator = Object.keys(names)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var i;
      var overallData;

      _loop();
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator['return']) {
        _iterator['return']();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  return values;
}

function pullOutDates(data) {
  var dates = [];
  data.forEach(function (date) {
    if (dates.indexOf(getYear(date.date)) == -1) {
      dates.push(getYear(date.date));
    }
  });
  return dates;
}

function drawDateInputs(dates) {
  var div = d3.select('#radioDiv');
  var labels = div.selectAll('.date').data(dates, function (d) {
    return d;
  });
  labels.exit().remove();
  labels.enter().append('label').text(function (d) {
    return d;
  }).attr('class', 'date').append('input').attr('id', function (d) {
    return d;
  }).attr('type', 'radio').attr('name', 'dates').attr('value', function (d) {
    return d;
  }).each(function (d) {
    if (d == 'All') {
      d3.select(this).property('checked', true);
    }
  }).on('change', function (d) {
    if (d3.select(this).property('checked')) {
      strokeCircles(d);
    }
  });
}

function strokeCircles(date) {
  var circles = chartGroup.selectAll('circle').data(data);
  circles.transition().duration(function () {
    return getRandomNumber(250, 500);
  }).attr('r', function (d) {
    if (date == 'All') {
      return circleRadius;
    } else {
      if (getYear(d.date) == date) {
        return circleRadius;
      } else {
        return 0;
      }
    }
  });
}

function getYear(date) {
  return date.split('-')[0];
}

function shortParticipantName(name) {
  var split = name.split('_');
  return (split[0][0] + split[1]).toUpperCase();
}

d3.select('#categoriesSelect').on('change', function () {
  var value = d3.select('#categoriesSelect').property('value');
  if (value == '') {
    drawInitial();
  } else {
    drawCategories(value);
  }
});