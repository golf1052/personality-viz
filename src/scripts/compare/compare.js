let chartGroup = svg.append('g')
  .attr( 'transform', 'translate(' + margin.left + ',' + margin.top + ')' );

let xScale = d3.scaleBand().range([ 0, chartWidth ]);
let yScale = d3.scaleLinear().domain([ 100, 0 ]).range([ 0, chartHeight ]);
let xAxis = d3.axisBottom( xScale );
let yAxis = d3.axisLeft( yScale );
let xAxisGroup = chartGroup.append('g')
  .attr( 'class', 'axis axis--x' )
  .attr( 'transform', 'translate(0,' + chartHeight + ')' );
let yAxisGroup = chartGroup.append('g')
  .attr( 'class', 'axis axis--y' );

drawDashedChartLines( chartGroup, yScale, chartWidth );

xAxisGroup.call( xAxis );
yAxisGroup.call( yAxis );

let selectedCategory = '';
let user1 = '';
let user1Date = '';
let user2 = '';
let user2Date = '';

allDataPromise.then(function() {
});

function drawData() {
  let columnNames = [];
  if (selectedCategory == '') {
    columnNames = categories;
  }
  else {
    columnNames = pullOutFacetNames(selectedCategory);
  }
  let user1Data = pullOutCategoryData( user1, user1Date, selectedCategory );
  let user2Data = pullOutCategoryData( user2, user2Date, selectedCategory );
  let differences = calculateDifferences( user1, user2, user1Date, user2Date, selectedCategory );
  xScale.domain( columnNames );
  xScale.padding([ 0.2 ]);

  drawColumnBorders(chartGroup, columnNames, xScale, yScale);

  let circleRadius = 7;
  let user1Circles = chartGroup.selectAll('.user1Circle').data( user1Data, function(d) {
    return d.columnOrder;
  });
  user1Circles.exit().remove();
  user1Circles.enter().append('circle')
    .attr( 'class', 'user1Circle' )
    .attr( 'r', circleRadius )
    .attr('cy', function(d) {
      return yScale(0);
    })
  .merge(user1Circles)
    .attr( 'cx', function( d ) {
      let val = xScale( d.key );
      let halfBand = xScale.bandwidth() / 2;
      val += halfBand;
      return val - halfBand / 2;
    })
    .transition()
    .duration(function() {
      return getRandomInteger(500, 1000);
    })
    .attr( 'fill', function( d ) {
      return d.color;
    })
    .attr( 'cy', function( d ) {
      return yScale( d.value );
    });
  
  let user2Circles = chartGroup.selectAll('.user2Circle').data( user2Data, function(d) {
    return d.columnOrder;
  });
  user2Circles.exit().remove();
  user2Circles.enter().append('circle')
    .attr( 'class', 'user2Circle' )
    .attr( 'r', circleRadius )
    .attr('cy', function(d) {
      return yScale(0);
    })
  .merge(user2Circles)
    .attr( 'cx', function( d ) {
      let val = xScale( d.key );
      let halfBand = xScale.bandwidth() / 2;
      val += halfBand;
      return val + halfBand / 2;
    })
    .transition()
    .duration(function() {
      return getRandomInteger(500, 1000);
    })
    .attr( 'fill', function( d ) {
      return d.color;
    })
    .attr( 'cy', function( d ) {
      return yScale( d.value );
    });

  let differenceLines = chartGroup.selectAll('.difference').data(differences, function(d) {
    return d.columnOrder;
  });
  differenceLines.exit().remove();
  differenceLines.attr('transform', function(d) {
    let xPos = xScale(d.key);
    let halfBand = xScale.bandwidth() / 2;
    xPos += halfBand;
    return 'translate(' + xPos + ',0)';
  });
  differenceLines.select('.main-line')
    .transition()
    .duration(function() {
      return getRandomInteger(500, 1000);
    })
    .attr( 'y1', function( d ) {
      return yScale( d.user1Value );
    })
    .attr( 'y2', function( d ) {
      return yScale( d.user2Value );
    });
  differenceLines.select('.top')
    .transition()
    .duration(function() {
      return getRandomInteger(500, 1000);
    })
    .attr('y1', function(d) {
      return yScale(d.user1Value);
    })
    .attr('y2', function(d) {
      return yScale(d.user1Value);
    });
  differenceLines.select('.bottom')
    .transition()
    .duration(function() {
      return getRandomInteger(500, 1000);
    })
    .attr('y1', function(d) {
      return yScale(d.user2Value);
    })
    .attr('y2', function(d) {
      return yScale(d.user2Value);
    });
  differenceLines.select('.difference-text')
    .text(function(d) {
      return Math.abs(d.user1Value - d.user2Value);
    })
    .transition()
    .duration(function() {
      return getRandomInteger(500, 1000);
    })
    .attr('y', function(d) {
      if (d.user1Value > d.user2Value) {
        return yScale(d.user1Value + 2);
      }
      else {
        return yScale(d.user2Value + 2);
      }
    });
  let differenceLinesGroup = differenceLines.enter().append('g')
    .attr('class', 'difference')
    .attr('transform', function(d) {
      let xPos = xScale(d.key);
      let halfBand = xScale.bandwidth() / 2;
      xPos += halfBand;
      return 'translate(' + xPos + ',0)';
    });
  differenceLinesGroup.append('line')
    .attr('class', 'main-line')
    .attr( 'x1', 0)
    .attr( 'x2', 0)
    .attr( 'stroke', 'black' )
    .attr( 'stroke-width', 1 )
    .attr( 'y1', function( d ) {
      return yScale( d.user1Value );
    })
    .attr( 'y2', function( d ) {
      return yScale( d.user2Value );
    });
  differenceLinesGroup.append('line')
    .attr('class', 'top')
    .attr('x1', -3)
    .attr('x2', 3)
    .attr( 'stroke', 'black' )
    .attr( 'stroke-width', 1 )
    .attr('y1', function(d) {
      return yScale(d.user1Value);
    })
    .attr('y2', function(d) {
      return yScale(d.user1Value);
    });
  differenceLinesGroup.append('line')
    .attr('class', 'bottom')
    .attr('x1', -3)
    .attr('x2', 3)
    .attr( 'stroke', 'black' )
    .attr( 'stroke-width', 1 )
    .attr('y1', function(d) {
      return yScale(d.user2Value);
    })
    .attr('y2', function(d) {
      return yScale(d.user2Value);
    });
  differenceLinesGroup.append('text')
    .attr('class', 'difference-text')
    .attr('x', 0)
    .attr('text-anchor', 'middle')
    .attr('y', function(d) {
      if (d.user1Value > d.user2Value) {
        return yScale(d.user1Value + 2);
      }
      else {
        return yScale(d.user2Value + 2);
      }
    })
    .text(function(d) {
      return Math.abs(d.user1Value - d.user2Value);
    });
  xAxisGroup.call( xAxis );
}

function pullOutFacetNames( category ) {
  let facets = [];
  names.participant_1.data.reports[0].results.forEach(function( data ) {
    if ( data.category == category ) {
      facets = Object.keys( data.facets );
    }
  });
  return facets;
}

function pullOutCategoryData( name, date, category ) {
  let values = [];
  for ( let i = 0; i < names[name].data.reports.length; i++ ) {
    let overallData = names[name].data.reports[i];
    if ( overallData.date != date ) {
      continue;
    }
    for (let j = 0; j < overallData.results.length; j++) {
      let cat = overallData.results[j];
      if (category == '') {
        values.push({
          key: cat.category,
          value: cat.score,
          color: names[name].color,
          columnOrder: j
        });
      }
      else {
        if (cat.category == category) {
          for (let k = 0; k < Object.keys(cat.facets).length; k++) {
            let key = Object.keys(cat.facets)[k];
            values.push({
              key: key,
              value: cat.facets[key],
              color: names[name].color,
              columnOrder: k
            });
          }
        }
      }
    }
  }
  return values;
}

function calculateDifferences( name1, name2, date1, date2, category ) {
  let values = [];
  for ( let i = 0; i < names[name1].data.reports.length; i++ ) {
    let overallUser1Data = names[name1].data.reports[i];
    if ( overallUser1Data.date != date1 ) {
      continue;
    }
    for ( let j = 0; j < names[name2].data.reports.length; j++ ) {
      let overallUser2Data = names[name2].data.reports[j];
      if ( overallUser2Data.date != date2 ) {
        continue;
      }
      for ( let k = 0; k < overallUser1Data.results.length; k++ ) {
        let user1Cat = overallUser1Data.results[k];
        if (category == '') {
          values.push({
            key: user1Cat.category,
            user1Value: user1Cat.score,
            user2Value: overallUser2Data.results[k].score,
            columnOrder: k
          });
        }
        else {
          if ( user1Cat.category == category ) {
            for (let l = 0; l < Object.keys(user1Cat.facets).length; l++) {
              let key = Object.keys(user1Cat.facets)[l];
              values.push({
                key: key,
                user1Value: user1Cat.facets[key],
                user2Value: overallUser2Data.results[k].facets[key],
                columnOrder: l
              });
            }
          }
        }
      }
    }
  }
  return values;
}

function populateYearSelect( userName, selectId ) {
  let userDates = names[userName].data.reports.map(function( report ) {
    return report.date;
  });
  let userDateOptions = d3.select( selectId ).selectAll('option').data( userDates, function( d ) {
    return d;
  });
  userDateOptions.exit().remove();
  userDateOptions.enter().append('option')
    .attr( 'value', function( d ) {
      return d;
    })
    .text(function( d ) {
      return d;
    });
  d3.select(selectId).property('value', userDates[0]);
}

function tryDraw() {
  if (user1 != '' && user2 != '' && user1Date != '' && user2Date != '') {
    drawData();
  }
}

d3.select('#categoriesSelect').on( 'change', function() {
  let value = d3.select(this).property('value');
  selectedCategory = value;
  tryDraw();
});

d3.select('#user1Select').on( 'change', function() {
  let value = d3.select(this).property( 'value' );
  user1 = value;
  populateYearSelect( user1, '#user1YearSelect' );
  user1Date = names[user1].data.reports[0].date;
  tryDraw();
});

d3.select('#user1YearSelect').on( 'change', function() {
  let value = d3.select(this).property('value');
  user1Date = value;
  tryDraw();
});

d3.select('#user2Select').on( 'change', function() {
  let value = d3.select(this).property('value');
  user2 = value;
  populateYearSelect( user2, '#user2YearSelect' );
  user2Date = names[user2].data.reports[0].date;
  tryDraw();
});

d3.select('#user2YearSelect' ).on( 'change', function() {
  let value = d3.select(this).property('value');
  user2Date = value;
  tryDraw();
});
