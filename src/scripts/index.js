let axisLength = 120;
let axisWidth = 8;
let axisColor = '#ffffff';
let halfAxisLength = axisLength / 2;

let halfChartWidth = chartWidth / 2;
let halfChartHeight = chartHeight / 2;
let rectMargin = 3;
let fontSize = 50;

let rectWidth = halfChartWidth - rectMargin * 2;
let rectHeight = halfChartHeight - rectMargin * 2;

let barGraphGroup = null;
let bubbleGraphGroup = null;
let compareGraphGroup = null;
let detailsGraphGroup = null;



let barGraphRect = null;
let bubbleGraphRect = null;
let compareGraphRect = null;
let detailsGraphRect = null;

let barGraphChartGroup = null;
let bubbleGraphChartGroup = null;
let compareGraphChartGroup = null;
let detailsGraphChartGroup = null;

let barGraphInterval = 0;
let barGraphYScale = null;
let bubbleGraphInterval = 0;
let bubbleGraphXScale = null;
let bubbleGraphYScale = null;

function loadIndexPage() {
  initialLoad = false;
  svg = body.append('svg');
  axisLength = 120;
  axisWidth = 8;
  axisColor = '#ffffff';
  halfAxisLength = axisLength / 2;
  rectMargin = 3;
  fontSize = 50;

  barGraphGroup = svg.append('g');
  bubbleGraphGroup = svg.append('g');
  compareGraphGroup = svg.append('g');
  detailsGraphGroup = svg.append('g');
  resizeIndexPage();
}

function resizeIndexPage() {
  chartWidth = parseInt(body.style('width'));
  chartHeight = parseInt(body.style('height'));
  d3.select('svg')
    .attr('width', chartWidth)
    .attr('height', chartHeight);
  halfChartWidth = chartWidth / 2;
  halfChartHeight = chartHeight / 2;
  rectWidth = halfChartWidth - rectMargin * 2;
  rectHeight = halfChartHeight - rectMargin * 2;
  bubbleGraphGroup.attr('transform', 'translate(' + (halfChartWidth) + ',0)');
  compareGraphGroup.attr('transform', 'translate(0,' + (halfChartHeight) + ')');
  detailsGraphGroup.attr('transform', 'translate(' + (halfChartWidth) + ',' + (halfChartHeight) + ')');

  if (initialLoad == true) {
    barGraphRect.attr('width', halfChartWidth)
      .attr('height', halfChartHeight);
    bubbleGraphRect.attr('width', halfChartWidth)
      .attr('height', halfChartHeight);
    compareGraphRect.attr('width', halfChartWidth)
      .attr('height', halfChartHeight);
    detailsGraphRect.attr('width', halfChartWidth)
      .attr('height', halfChartHeight);
    resizeChartGroup(barGraphChartGroup);
    resizeChartGroup(bubbleGraphChartGroup);
    resizeChartGroup(compareGraphChartGroup);
    resizeChartGroup(detailsGraphChartGroup);
  }
}

allDataPromise.then(function(allData) {
  loadIndexPage();
  createSecondaryIndexPageElements();
  initialLoad = true;
  resizeIndexPage();
});

// creates elements that require data files to be loaded
function createSecondaryIndexPageElements() {
  barGraphRect = barGraphGroup.append('rect')
    .attr('fill', materialColors['purple']['500']);
  bubbleGraphRect = bubbleGraphGroup.append('rect')
    .attr('fill', materialColors['pink']['500']);
  compareGraphRect = compareGraphGroup.append('rect')
    .attr('fill', materialColors['green']['500']);
  detailsGraphRect = detailsGraphGroup.append('rect')
    .attr('fill', materialColors['blue']['500']);

  barGraphChartGroup = createChartGroup(barGraphGroup);
  resizeChartGroup(barGraphChartGroup);
  createText('Bar Graph', barGraphChartGroup);

  bubbleGraphChartGroup = createChartGroup(bubbleGraphGroup);
  resizeChartGroup(bubbleGraphChartGroup);
  createText('Bubble Graph', bubbleGraphChartGroup);

  compareGraphChartGroup = createChartGroup(compareGraphGroup);
  resizeChartGroup(compareGraphChartGroup);
  createText('User vs User', compareGraphChartGroup);

  detailsGraphChartGroup = createChartGroup(detailsGraphGroup);
  resizeChartGroup(detailsGraphChartGroup);
  createText('In-depth Review', detailsGraphChartGroup);

  barGraphInterval = 0;
  barGraphYScale = createChartYScale();
  drawBarGraph(barGraphChartGroup, barGraphYScale);

  bubbleGraphInterval = 0;
  bubbleGraphXScale = createChartXScale();
  bubbleGraphYScale = createChartYScale();
  drawBubbles(bubbleGraphChartGroup, bubbleGraphXScale, bubbleGraphYScale);
  compareGraphChartGroup.append('image')
    .attr('xlink:href', 'images/userxuser.png')
    .attr('x', 22)
    .attr('y', 20)
    .attr('width', axisLength * 0.7)
    .attr('height', axisLength * 0.7);
  detailsGraphChartGroup.append('image')
    .attr('xlink:href', 'images/user.png')
    .attr('x', 32)
    .attr('y', 30)
    .attr('width', axisLength * 0.5)
    .attr('height', axisLength * 0.5);

  setupIndexPageEvents();
}

function setupIndexPageEvents() {
  barGraphRect.on('mouseenter', function() {
    barGraphRect.attr('fill', materialColors['purple']['700']);
    animateBarGraph(barGraphChartGroup, barGraphYScale);
    barGraphInterval = setInterval(function() {
      animateBarGraph(barGraphChartGroup, barGraphYScale);
    }, 1000);
  });
  barGraphRect.on('mouseleave', function() {
    barGraphRect.attr('fill', materialColors['purple']['500']);
    clearInterval(barGraphInterval);
  });
  barGraphRect.on('click', function() {
    window.location.href = 'bars.html';
  });

  bubbleGraphRect.on('mouseenter', function() {
    bubbleGraphRect.attr('fill', materialColors['pink']['700']);
    animateBubbles(bubbleGraphChartGroup, bubbleGraphXScale, bubbleGraphYScale);
    bubbleGraphInterval = setInterval(function() {
      animateBubbles(bubbleGraphChartGroup, bubbleGraphXScale, bubbleGraphYScale);
    }, 1000);
  });
  bubbleGraphRect.on('mouseleave', function() {
    bubbleGraphRect.attr('fill', materialColors['pink']['500']);
    clearInterval(bubbleGraphInterval);
  });
  bubbleGraphRect.on('click', function() {
    window.location.href = 'bubbles.html';
  });

  compareGraphRect.on('mouseenter', function() {
    compareGraphRect.attr('fill', materialColors['green']['700']);
  });
  compareGraphRect.on('mouseleave', function() {
    compareGraphRect.attr('fill', materialColors['green']['500']);
  });
  compareGraphRect.on('click', function() {
    window.location.href = 'compare.html';
  });

  detailsGraphRect.on('mouseenter', function() {
    detailsGraphRect.attr('fill', materialColors['blue']['700']);
  });
  detailsGraphRect.on('mouseleave', function() {
    detailsGraphRect.attr('fill', materialColors['blue']['500']);
  });
  detailsGraphRect.on('click', function() {
    window.location.href = 'detail.html';
  });
}

function drawBubbles(group, xScale, yScale) {
  let bubbles = group.selectAll('.bubbles').data(getFakeBubbleData());
  bubbles.enter().append('circle')
    .attr('class', 'bubbles')
    .attr('cx', function(d) {
      return xScale(d.x);
    })
    .attr('cy', function(d) {
      return yScale(d.y);
    })
    .attr('r', 6)
    .attr('fill', axisColor);
}

function animateBubbles(group, xScale, yScale) {
  let exitingBubbles = group.selectAll('.bubbles').data([]);
  exitingBubbles.exit()
    .transition()
    .duration(750)
    .attr('r', 0)
    .remove();
  let bubbles = group.selectAll('.entering-bubbles').data(getFakeBubbleData());
  bubbles.enter().append('circle')
    .attr('class', 'entering-bubbles')
    .attr('cx', function(d) {
      return xScale(d.x);
    })
    .attr('cy', function(d) {
      return yScale(d.y);
    })
    .attr('fill', axisColor)
    .transition()
    .duration(750)
    .attr('r', 6)
    .attr('class', 'bubbles');
}

function getFakeBubbleData() {
  let fakeData = [];
  for (let i = 0; i < 8; i++) {
    fakeData.push({
      x: getRandomInteger(0, 101),
      y: getRandomInteger(0, 101)
    });
  }
  return fakeData;
}

function drawBarGraph(group, scale) {
  let barGraphRects = group.selectAll('rect').data(getFakeBarGraphData());
  barGraphRects.enter().append('rect')
    .attr('width', 15)
    .attr('fill', axisColor)
    .attr('x', function(d, i) {
      return 10 + i * 30;
    })
    .attr('y', function(d) {
      return scale(d);
    })
    .attr('height', function(d) {
      return axisLength - axisWidth + 2 - scale(d);
    });
}

function animateBarGraph(group, scale) {
  let barGraphRects = group.selectAll('rect').data(getFakeBarGraphData());
  barGraphRects.exit().remove();
  barGraphRects.transition()
    .duration(function() {
      return getRandomInteger(500, 950);
    })
    .attr('y', function(d) {
      return scale(d);
    })
    .attr('height', function(d) {
      return axisLength - axisWidth + 2 - scale(d);
    })
  barGraphRects.enter().append('rect')
    .attr('width', 15)
    .attr('fill', axisColor)
    .attr('x', function(d, i) {
      return 10 + i * 30;
    })
    .attr('y', function() {
      return scale(0);
    });
}

function getFakeBarGraphData() {
  let fakeData = [];
  for (let i = 0; i < 4; i++) {
    fakeData.push(getRandomInteger(0, 101));
  }
  return fakeData;
}

function createText(text, group) {
  group.append('text')
    .attr('class', 'index-group')
    .attr('text-anchor', 'middle')
    .attr('font-size', fontSize)
    .attr('x', axisLength / 2)
    .attr('y', axisLength + fontSize)
    .text(text);
}

function createChartGroup(group) {
  let g = group.append('g');
  createAxis(g);
  return g;
}

function resizeChartGroup(group) {
  group.attr('transform', 'translate(' + (rectWidth / 2 - halfAxisLength) + ',' + (rectHeight / 2 - halfAxisLength) + ')');
}

function createAxis(group) {
  // x axis
  group.append('line')
    .attr('x1', axisWidth - 2)
    .attr('y1', axisLength)
    .attr('x2', axisLength + axisWidth - 2)
    .attr('y2', axisLength)
    .attr('stroke', axisColor)
    .attr('stroke-width', axisWidth);
  // y axis
  group.append('line')
    .attr('x1', 0)
    .attr('y1', -(axisWidth - 2))
    .attr('x2', 0)
    .attr('y2', axisLength - axisWidth + 2)
    .attr('stroke', axisColor)
    .attr('stroke-width', axisWidth);
}

function createChartXScale() {
  return d3.scaleLinear().domain([0, 100]).range([axisWidth - 2, axisLength + axisWidth - 2]);
}

function createChartYScale() {
  return d3.scaleLinear().domain([100, 0]).range([-(axisWidth - 2), axisLength - axisWidth + 2]);
}

window.onresize = resizeIndexPage;
